# Database Architecture

## Overview
PostgreSQL database with PostGIS extension for spatial data handling, using Prisma as ORM.

## Setup Requirements

### PostgreSQL Setup
```bash
# Install PostgreSQL 14+ and PostGIS
sudo apt install postgresql-14 postgresql-14-postgis-3

# Create database
createdb lutruwita_dev
createdb lutruwita_test

# Enable PostGIS
psql -d lutruwita_dev -c "CREATE EXTENSION postgis;"
psql -d lutruwita_test -c "CREATE EXTENSION postgis;"
```

### Prisma Configuration
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [postgis]
}
```

## Schema Design

### Core Tables

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  auth0Id       String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  maps          Map[]
  routes        Route[]
  pois          POI[]
  photos        Photo[]
}

model Map {
  id            String    @id @default(cuid())
  name          String
  description   String?
  isPublic      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // JSON fields
  viewState     Json
  settings      Json?

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  routes        Route[]
  pois          POI[]
  photos        Photo[]

  @@index([userId])
}

model Route {
  id            String    @id @default(cuid())
  name          String
  description   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Spatial data
  path          Unsupported("geometry(LineString,4326)")
  
  // JSON fields
  metadata      Json?
  style         Json?

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  map           Map       @relation(fields: [mapId], references: [id])
  mapId         String
  surfaces      Surface[]
  photos        Photo[]

  @@index([userId])
  @@index([mapId])
}

model POI {
  id            String    @id @default(cuid())
  name          String
  description   String?
  type          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Spatial data
  location      Unsupported("geometry(Point,4326)")
  
  // JSON fields
  metadata      Json?

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  map           Map       @relation(fields: [mapId], references: [id])
  mapId         String
  photos        Photo[]

  @@index([userId])
  @@index([mapId])
}
```

### Supporting Tables

```prisma
model Surface {
  id            String    @id @default(cuid())
  type          String
  grade         Int
  
  // Spatial data
  segment       Unsupported("geometry(LineString,4326)")
  
  // Relations
  route         Route     @relation(fields: [routeId], references: [id])
  routeId       String

  @@index([routeId])
}

model Photo {
  id            String    @id @default(cuid())
  filename      String
  originalUrl   String
  thumbnailUrl  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Spatial data
  location      Unsupported("geometry(Point,4326)")
  
  // JSON fields
  metadata      Json?

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  map           Map?      @relation(fields: [mapId], references: [id])
  mapId         String?
  route         Route?    @relation(fields: [routeId], references: [id])
  routeId       String?
  poi           POI?      @relation(fields: [poiId], references: [id])
  poiId         String?

  @@index([userId])
  @@index([mapId])
  @@index([routeId])
  @@index([poiId])
}
```

## Spatial Queries

### Route Queries
```typescript
// Query routes within bounds
const routesInBounds = await prisma.$queryRaw`
  SELECT * FROM "Route"
  WHERE ST_Intersects(
    path,
    ST_MakeEnvelope($1, $2, $3, $4, 4326)
  )
`;

// Calculate route length
const routeLength = await prisma.$queryRaw`
  SELECT ST_Length(
    path::geography,
    true
  ) as length
  FROM "Route"
  WHERE id = $1
`;
```

### POI Queries
```typescript
// Find nearby POIs
const nearbyPois = await prisma.$queryRaw`
  SELECT *,
    ST_Distance(
      location::geography,
      ST_Point($1, $2)::geography
    ) as distance
  FROM "POI"
  WHERE ST_DWithin(
    location::geography,
    ST_Point($1, $2)::geography,
    $3
  )
  ORDER BY distance
`;
```

## Migrations

### Initial Migration
```bash
# Generate migration
prisma migrate dev --name init

# Apply migration
prisma migrate deploy
```

### Adding PostGIS
```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add spatial indexes
CREATE INDEX route_path_idx ON "Route" USING GIST (path);
CREATE INDEX poi_location_idx ON "POI" USING GIST (location);
CREATE INDEX photo_location_idx ON "Photo" USING GIST (location);
```

## Performance Optimization

### Indexes
```sql
-- Spatial indexes
CREATE INDEX route_path_idx ON "Route" USING GIST (path);
CREATE INDEX poi_location_idx ON "POI" USING GIST (location);

-- Standard indexes
CREATE INDEX route_user_idx ON "Route"(user_id);
CREATE INDEX poi_map_idx ON "POI"(map_id);
```

### Query Optimization
```typescript
// Optimize spatial queries
const optimizedQuery = await prisma.$queryRaw`
  SELECT id, name,
    ST_AsGeoJSON(path) as path
  FROM "Route"
  WHERE map_id = $1
  AND ST_Intersects(
    path,
    ST_MakeEnvelope($2, $3, $4, $5, 4326)
  )
  AND ST_Length(path::geography) > 100
`;
```

## Backup & Recovery

### Backup Script
```bash
#!/bin/bash
pg_dump -Fc lutruwita_prod > backup_$(date +%Y%m%d).dump

# With PostGIS
pg_dump -Fc -Z9 -E UTF8 -I -h localhost lutruwita_prod > \
  backup_$(date +%Y%m%d).dump
```

### Recovery Script
```bash
#!/bin/bash
pg_restore -d lutruwita_prod backup.dump
```

## Related Documentation
- [API.md](API.md) - API integration
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment configuration