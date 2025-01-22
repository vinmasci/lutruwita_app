# Deployment Guide

## Infrastructure Overview

### Production Stack
- Vercel (Next.js application)
- AWS RDS (PostgreSQL + PostGIS)
- AWS S3 (File storage)
- Cloudflare (CDN)
- Auth0 (Authentication)

## Pre-deployment Checklist

### 1. Environment Configuration
```bash
# Production environment variables
NEXT_PUBLIC_MAPBOX_TOKEN=
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
DATABASE_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
CLOUDFLARE_TOKEN=
```

### 2. Database Setup
```bash
# Create production database
createdb lutruwita_prod

# Enable PostGIS
psql -d lutruwita_prod -c "CREATE EXTENSION postgis;"

# Run migrations
pnpm prisma migrate deploy
```

### 3. Build Check
```bash
# Verify build
pnpm build

# Run type check
pnpm type-check

# Run tests
pnpm test
```

## Deployment Process

### 1. Initial Setup

#### Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel init
```

#### AWS Setup
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier lutruwita-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20

# Create S3 bucket
aws s3api create-bucket \
  --bucket lutruwita-prod \
  --region ap-southeast-2
```

### 2. Deployment Steps

#### Production Deployment
```bash
# Deploy to production
vercel --prod

# Run database migrations
pnpm prisma migrate deploy

# Verify deployment
curl https://lutruwita.com/api/health
```

#### Staging Deployment
```bash
# Deploy to staging
vercel

# Run database migrations on staging
DATABASE_URL=$STAGING_DATABASE_URL pnpm prisma migrate deploy
```

### 3. Post-deployment Checks

#### Health Checks
```bash
# API health check
curl https://lutruwita.com/api/health

# Database check
psql $DATABASE_URL -c "SELECT NOW();"

# Auth check
curl https://lutruwita.com/api/auth/session
```

#### Performance Checks
```bash
# Run Lighthouse
lighthouse https://lutruwita.com

# Check API latency
artillery quick --count 10 -n 20 https://lutruwita.com/api/health
```

## Monitoring Setup

### 1. Logging Configuration
```typescript
// packages/utils/logger.ts
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});
```

### 2. Error Tracking
```typescript
// apps/web/utils/sentry.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 3. Performance Monitoring
```typescript
// apps/web/monitoring/performance.ts
export const monitorPerformance = () => {
  // Web Vitals monitoring
  reportWebVitals((metric) => {
    logger.info({
      metric: metric.name,
      value: metric.value,
    });
  });
};
```

## Backup Strategy

### 1. Database Backups
```bash
#!/bin/bash
# backup.sh
TODAY=$(date +"%Y%m%d")
BACKUP_DIR="/backups/db"

# Backup database
pg_dump -Fc $DATABASE_URL > $BACKUP_DIR/lutruwita_$TODAY.dump

# Upload to S3
aws s3 cp $BACKUP_DIR/lutruwita_$TODAY.dump \
  s3://lutruwita-backups/db/
```

### 2. S3 Backups
```bash
#!/bin/bash
# sync-backup.sh
aws s3 sync \
  s3://lutruwita-prod \
  s3://lutruwita-backups/files/$(date +"%Y%m%d")
```

## Rollback Procedures

### 1. Application Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```

### 2. Database Rollback
```bash
# Revert last migration
pnpm prisma migrate reset

# Restore from backup
pg_restore -d $DATABASE_URL backup.dump
```

## Security Measures

### 1. SSL Configuration
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name lutruwita.com;

    ssl_certificate /etc/letsencrypt/live/lutruwita.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lutruwita.com/privkey.pem;
    
    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
}
```

### 2. Headers Configuration
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
];
```

## Performance Optimization

### 1. CDN Configuration
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.lutruwita.com'],
    loader: 'cloudflare'
  }
};
```

### 2. Caching Strategy
```typescript
// packages/api/cache.ts
export const cacheConfig = {
  staleWhileRevalidate: 60,
  maxAge: 3600,
  swr: true
};
```

## Automated Deployment

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Deploy
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Troubleshooting Guide

### Common Issues

#### Database Connection Issues
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1;"

# Check active connections
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
```

#### Build Failures
```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
pnpm install
pnpm build
```

## Related Documentation
- [DATABASE.md](TECHNICAL/DATABASE.md)
- [API.md](TECHNICAL/API.md)
- [SETUP.md](GUIDES/SETUP.md)