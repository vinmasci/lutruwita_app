# Lutruwita Project Overview

## Vision
Advanced interactive mapping platform for creating and sharing routes in Tasmania, focusing on cycling, hiking, and outdoor activities with emphasis on surface types and elevation data.

## Tech Stack Evolution

### Core Framework: Next.js 14
- **Why**: Replaces Vite + Express for unified development
- **Benefits**:
  - Server and client rendering
  - API routes built-in
  - Better performance and SEO
  - Excellent TypeScript support
  - Simplified deployment

### Type-Safety: TypeScript + tRPC
- **Type System**: Full stack type safety
- **API Layer**: tRPC for seamless client-server communication
- **Benefits**:
  - Catch errors early
  - Automated API documentation
  - Improved developer experience

### Database: PostgreSQL + PostGIS + Prisma
- **Primary DB**: PostgreSQL with PostGIS extension
- **ORM**: Prisma for type-safe queries
- **Benefits**:
  - Spatial data support
  - Type-safe database access
  - Automatic migrations

### UI Framework: Material UI + Custom Components
- **Base**: Material UI components
- **Custom**: Shadcn-inspired sidebar
- **Icons**: Lucide icon set
- **Benefits**:
  - Consistent design language
  - Customizable components
  - Excellent accessibility

### Map Integration: MapBox GL JS
- **Core**: MapBox GL JS for map rendering
- **Features**:
  - Custom styling
  - Complex interactions
  - Performance optimizations

### Mobile: Expo (Planned)
- **Framework**: React Native with Expo
- **Benefits**:
  - Share code with web
  - Native performance
  - Simplified deployment

## Project Structure

### Turborepo Architecture
```bash
lutruwita/
├── apps/
│   ├── web/          # Next.js application
│   └── mobile/       # Expo application (future)
├── packages/
│   ├── ui/           # Shared components
│   ├── map-core/     # Map functionality
│   ├── api/          # tRPC API
│   └── db/           # Database logic
└── docs/             # Documentation
```

## Core Features

### 1. GPX Management
- Upload and processing
- Surface detection
- Elevation analysis
- Route statistics
- Color customization

### 2. POI System
- Multiple POI types
- Rich metadata
- Place integration
- Photo attachments

### 3. Map Operations
- Save/Load maps
- Embed functionality
- Route management
- Collaboration features

### 4. Photo Integration
- GPX-tagged photos
- Thumbnail generation
- Map integration
- Gallery view

## Performance Optimizations

### Current
- Stream processing for large files
- Efficient data structures
- Caching strategies
- Code splitting

### Planned
- Edge functions
- WebAssembly processing
- Worker threads
- Vector tiles

## Developer Experience

### Tools
- ESLint + Prettier
- Husky for git hooks
- Jest + Playwright
- Storybook (planned)

### Workflows
- Feature branches
- PR templates
- Automated testing
- Documentation requirements

## Getting Started

1. Check [SETUP.md](SETUP.md) for environment setup
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. See [CONTRIBUTING.md](GUIDES/CONTRIBUTING.md) for guidelines
4. Follow feature docs for implementation details

## Future Roadmap

### Phase 1: Core Features
- Basic map functionality
- GPX upload and processing
- Simple POI system
- Basic photo integration

### Phase 2: Advanced Features
- Collaborative editing
- Advanced surface detection
- Mobile application
- Offline support

### Phase 3: Optimization
- Performance improvements
- Advanced caching
- AI integration
- Enhanced analytics

## Related Documentation
- [FEATURES/GPX.md](FEATURES/GPX.md) - GPX system details
- [FEATURES/POI.md](FEATURES/POI.md) - POI system architecture
- [TECHNICAL/API.md](TECHNICAL/API.md) - API documentation
- [COMPONENTS/MAP.md](COMPONENTS/MAP.md) - Map component details

Would you like me to continue with creating the other documentation files?