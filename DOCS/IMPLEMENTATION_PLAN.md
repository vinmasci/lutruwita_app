# Implementation Plan

## Phase 1: Project Setup

### 1. Initialize Project Structure
- [x] Create new Turborepo project
  ```bash
  pnpx create-turbo@latest lutruwita
  ```
- [x] Set up directory structure
  - [x] `/apps/web`
  - [x] `/packages/ui`
  - [x] `/packages/map-core`
  - [x] `/packages/api`
  - [x] `/packages/db`
- [x] Configure TypeScript for all packages
- [x] Set up ESLint and Prettier

### 2. Core Dependencies
- [x] Install Next.js in web app
- [x] Set up Material UI
- [x] Configure Tailwind CSS
- [x] Install MapBox GL JS
- [x] Set up tRPC
- [x] Configure Prisma
- [~] Set up Auth0 (Environment variables configured, dependencies pending)
- [x] Update .env.local
- [x] Update .git.ignore

### 3. Database Setup
- [x] Set up PostgreSQL
- [x] Configure PostGIS extension
- [x] Create initial Prisma schema
- [x] Set up initial migrations (Using db:push for initial schema)
- [x] Configure connection pooling

### Implementation Notes
3. Connection Pooling Implementation:
   - Configured PgBouncer-compatible connection pooling
   - Added DIRECT_DATABASE_URL for migrations and schema operations
   - Updated DATABASE_URL with pooling parameters
   - Implemented connection management in Prisma client
   - Added connection cleanup handlers
   - Features include:
     * Efficient connection reuse
     * Connection timeout handling
     * Automatic cleanup on shutdown
     * Error handling and reconnection
     * Logging for monitoring

### Implementation Notes
1. Auth0 Configuration:
   - Environment variables configured in .env.local
   - Auth0 tenant created (dev-8jmwfh4hugvdjwh8.au.auth0.com)
   - Client ID and secret obtained
   - Base URLs and redirects configured
   - UserProvider successfully implemented in app layout
   - Dependencies installed and configured

2. Database Configuration:
   - PostgreSQL database hosted on DigitalOcean
   - SSL enabled with CA certificate
   - Connection details configured in environment variables
   - PostGIS extension enabled in schema.prisma
   - Initial schema created with User, POI, and Route models
   - Spatial data types configured for POI locations and Route paths
   - Relations established between models
   - Schema successfully pushed to database using db:push
   - Prisma Client generated for type-safe database access
   - Connection pooling to be configured in next phase

## Phase 2: Core Infrastructure

### 1. Authentication System
- [x] Configure Auth0 provider
- [x] Set up authentication hooks
- [x] Create protected routes
- [x] Implement user profile management
- [ ] Set up role-based access

### Implementation Notes
3. Authentication System Implementation:
   - Created useAuth hook for managing authentication state
   - Implemented withAuth HOC for route protection
   - Added LoadingScreen component for auth state transitions
   - Created example protected profile page
   - Features include:
     * Automatic redirect to login
     * Return URL handling
     * Loading states
     * Error handling
     * User profile display

### 2. Base UI Components
- [x] Create custom Material UI theme
- [x] Build expandable sidebar
- [x] Implement base map component
- [x] Create modal system
- [x] Set up form components
- [x] Implement welcome modal

### Implementation Notes
3. Form Components Implementation:
   - Created comprehensive form system with Material UI integration
   - Implemented FormContext for centralized state management
   - Built form components:
     * TextField for text input
     * Select for dropdown selection
     * Checkbox for boolean values
     * RadioGroup for multiple choice
     * Switch for toggle inputs
   - Features include:
     * Form-level and field-level validation
     * Error handling and display
     * Touch state tracking
     * Proper TypeScript types
     * Accessibility support
     * Helper text and labels
     * Custom validation rules
     * Form submission handling
     * Reset functionality

1. Modal System Implementation:
   - Created reusable modal components in @lutruwita/ui package
   - Implemented context-based state management with ModalProvider
   - Built base Modal component with Material UI integration
   - Features include:
     * Customizable width and styling
     * Close button with optional hiding
     * Proper accessibility attributes
     * TypeScript type safety
     * Flexible content rendering
     * Proper event handling

2. Welcome Modal Implementation:
   - Create WelcomeModal component with:
     * Centered welcome message and tagline
     * "Start Exploring" button with compass icon
     * Click-outside behavior for dismissal
     * One-time display logic using localStorage
     * Smooth fade animations
     * Responsive layout for all devices
     * Proper accessibility attributes
     * TypeScript type safety

3. Material UI Theme:
   - Implemented comprehensive theme system with light/dark mode support
   - Custom color palette optimized for both modes
   - Typography system with Inter font and responsive scaling
   - Component-specific styling for map-related UI elements
   - Consistent spacing and border radius system
   - Enhanced component overrides for:
     * Buttons with hover effects
     * Cards with mode-specific shadows
     * AppBar and Drawer with border styling
     * Tooltips with inverted colors
     * IconButtons with optimized padding

2. Sidebar Implementation:
   - Created reusable sidebar components in @lutruwita/ui package
   - Implemented context-based state management with SidebarProvider
   - Built expandable/collapsible functionality with smooth transitions
   - Added support for tooltips in collapsed state
   - Styled components using Material UI's styled API
   - Features include:
     * Customizable width and positioning
     * Active item tracking
     * Disabled state handling
     * Icon and label support
     * Keyboard accessibility
     * Responsive design
   - TypeScript Configuration Attempts:
     * Initial setup with basic tsconfig.json extending from root
     * Tried explicit file patterns: "src/**/*.ts", "src/**/*.tsx", "src/**/*.json"
     * Attempted moduleResolution "bundler" with isolatedModules
     * Tried various tsup configurations:
       - Multiple entry points listing each navigation component
       - Explicit DTS entry configuration for each component
       - Simplified to single entry point with automatic DTS generation
     * TypeScript Configuration Solution:
       - Updated tsconfig.json to be self-contained with explicit file includes
       - Configured moduleResolution to "node" for better compatibility
       - Aligned tsup.config.ts with tsconfig.json settings
       - Added explicit entry points for each component
       - Successfully generating type definitions and bundles
     * Build Status:
       - All components building successfully with proper type definitions
       - Both CommonJS and ESM formats supported
       - Source maps generated for all outputs
       - Type definitions (.d.ts files) correctly exported through index.d.ts
       - Minor warnings about unused React imports (useState, useCallback) - to be cleaned up

### 3. API Layer
- [x] Set up tRPC routers
- [x] Configure API procedures
- [~] Implement error handling (Basic setup with tRPC's built-in error handling)
- [x] Set up validation (Using Zod through tRPC)
- [ ] Configure rate limiting

### Implementation Notes
1. API Layer Implementation:
   - tRPC router configured with type-safe procedures
   - Basic API route handler set up for Next.js
   - Test procedure implemented and working
   - Zod validation integrated through tRPC
   - Error handling using tRPC's built-in system
   - Rate limiting to be implemented in next iteration

## Phase 3: Map Foundation

### 1. Basic Map Setup
- [x] Initialize MapBox GL JS
- [x] Create map controls
- [x] Set up viewport management
- [x] Implement base layer controls
- [x] Add zoom/pan handlers
- [x] Configure full screen map display
- [x] Enable 3D terrain and buildings
- [x] Add streets and places layers
- [x] Optimize map performance for 3D rendering

### Implementation Notes
6. Map Features Implementation:
   - Full screen map display:
     * Implemented proper container styling with absolute positioning
     * Configured responsive layout for all viewport sizes
     * Added proper z-index management for overlays
     * Fixed canvas dimension issues
   - 3D terrain and buildings:
     * Added terrain-dem source with proper error handling
     * Configured fill-extrusion layers for buildings
     * Set default 45° pitch for better 3D visualization
     * Implemented proper layer ordering and zoom constraints
   - Streets and places:
     * Added vector tile layers with proper styling
     * Implemented place labels with collision detection
     * Added park POI labels with custom styling
     * Configured proper layer ordering for readability
   - Performance optimizations:
     * Added error handling in layer setup
     * Configured tile cache size limits
     * Implemented proper layer culling
     * Added cleanup handlers for memory management
     * Optimized style change handling

### 2. Map State Management
- [x] Create map context
- [x] Set up state persistence
- [x] Implement view state management
- [x] Add layer management
- [x] Create map event system

### Implementation Notes
1. Map Context Implementation:
   - Created MapContext with viewport, style, and map instance management
   - Implemented useMap hook for easy context access
   - Added MapProvider to root layout for global state access

2. State Persistence:
   - Implemented localStorage-based state persistence in utils/storage.ts
   - Stores viewport (center, zoom, bearing, pitch) and map style
   - Handles error cases gracefully with fallbacks
   - Automatic saving of state changes using useCallback and useEffect
   - Loads stored state on component initialization with fallback to defaults

3. Layer Management:
   - Created comprehensive type system for different layer types (marker, line, polygon, circle)
   - Implemented LayerManager utility for handling layer operations
   - Support for layer groups with visibility controls
   - Integrated with MapContext for global layer state management
   - Handles cleanup and state persistence

4. Event System:
   - Implemented MapEventManager for handling map interactions
   - Support for click, hover, drag, zoom, and rotation events
   - Built-in popup management system
   - Event delegation through MapContext
   - Type-safe event handlers with TypeScript

5. Enhanced Map Features:
   - Full screen implementation:
     * CSS configuration for 100vh/100vw map container
     * Proper handling of mobile viewport heights
     * Consideration for header/navigation space
     * Z-index management for overlays
   - 3D terrain and buildings:
     * Enable terrain-dem source for elevation data
     * Configure fill-extrusion layers for buildings
     * Optimize performance with proper zoom level constraints
     * Add pitch and bearing controls for 3D navigation
   - Streets and places:
     * Enable vector tile layers for streets
     * Add place labels with proper collision detection
     * Configure symbol layers for points of interest
     * Implement proper layer ordering for readability
   - Performance optimizations:
     * Implement proper layer culling
     * Configure proper tile loading strategies
     * Optimize memory usage for 3D features
     * Handle proper level of detail transitions

## Phase 4: GPX Implementation

### 1. Upload System
- [x] Create upload component
- [x] Implement file validation
- [x] Set up progress tracking
- [x] Add error handling
- [ ] Create upload queue

### Implementation Notes
1. Upload Component Implementation:
   - Created GpxUpload component in @lutruwita/ui package
   - Features include:
     * Drag and drop interface
     * File type validation (.gpx)
     * Size limit validation (configurable, default 10MB)
     * Progress tracking with visual feedback
     * Error handling and display
     * Material UI integration
     * TypeScript type safety
     * Accessible keyboard interactions
     * Loading states
   - Upload handling:
     * Client-side validation
     * Progress tracking with XHR
     * Error state management
     * Success callback with route ID

### 2. Processing Pipeline
- [x] Build GPX parser
- [ ] Implement map matching
- [ ] Create surface detection
- [ ] Add elevation processing
- [ ] Set up route statistics

### Implementation Notes
2. Processing Pipeline Implementation:
   - Created BaseGpxProcessor in @lutruwita/map-core package
   - Features include:
     * GPX file parsing with metadata extraction
     * Track point simplification using Ramer-Douglas-Peucker algorithm
     * Placeholder for map matching (ready for Mapbox integration)
     * Surface type detection framework
     * Comprehensive elevation processing with statistics
   - Type system includes:
     * Strong typing for all GPX data structures
     * Error handling with specific error codes
     * Interfaces for processing stages
   - Dependencies configured:
     * xml2js for GPX parsing
     * simplify-js for track simplification
     * @tmcw/togeojson for GeoJSON conversion
   - Error handling:
     * Type-safe error codes for each processing stage
     * Detailed error messages with original error details
     * Graceful fallbacks for missing data

### 3. Visualization
- [ ] Create route renderer
- [ ] Build elevation profile
- [ ] Add surface indicators
- [ ] Implement route styling
- [ ] Create route controls

## Phase 5: POI System

### 1. Base POI Structure
- [ ] Create POI database schema
- [ ] Set up POI types
- [ ] Implement POI manager
- [ ] Add POI validation
- [ ] Create POI events

### 2. POI Interface
- [ ] Build POI creation modal
- [ ] Create POI markers
- [ ] Implement POI editing
- [ ] Add POI categories
- [ ] Set up POI filtering

### 3. Place Integration
- [ ] Implement place detection
- [ ] Create place markers
- [ ] Set up place POIs
- [ ] Add place search
- [ ] Create place details

## Phase 6: Photo Management

### 1. Upload System
- [ ] Create photo uploader
- [ ] Implement EXIF extraction
- [ ] Set up thumbnail generation
- [ ] Add progress tracking
- [ ] Configure S3 storage

### 2. Photo Integration
- [ ] Create photo markers
- [ ] Build photo gallery
- [ ] Implement photo modal
- [ ] Add photo clustering
- [ ] Set up photo filtering

### 3. Photo Management
- [ ] Create photo database schema
- [ ] Implement photo metadata
- [ ] Add photo editing
- [ ] Set up photo organization
- [ ] Create photo search

## Phase 7: Map Operations

### 1. Save/Load System
- [ ] Create save functionality
- [ ] Implement load system
- [ ] Add versioning
- [ ] Set up auto-save
- [ ] Create history system

### 2. Embed System
- [ ] Create embed generator
- [ ] Build embed preview
- [ ] Implement embed security
- [ ] Add embed customization
- [ ] Set up embed analytics

### 3. Export System
- [ ] Create GPX export
- [ ] Implement PDF export
- [ ] Add image export
- [ ] Set up data export
- [ ] Create backup system

## Phase 8: Optimization

### 1. Performance
- [ ] Implement code splitting
- [ ] Add lazy loading
- [ ] Optimize bundle size
- [ ] Set up caching
- [ ] Configure CDN

### 2. User Experience
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Create feedback system
- [ ] Add tooltips/help
- [ ] Optimize interactions

### 3. Testing
- [ ] Set up unit tests
- [ ] Add integration tests
- [ ] Implement E2E tests
- [ ] Create test data
- [ ] Add performance tests

## Phase 9: Mobile Preparation

### 1. Mobile Setup
- [ ] Initialize Expo project
- [ ] Configure shared components
- [ ] Set up mobile navigation
- [ ] Add mobile styles
- [ ] Create mobile layouts

### 2. Mobile Features
- [ ] Adapt map component
- [ ] Create mobile UI
- [ ] Implement offline support
- [ ] Add mobile-specific features
- [ ] Optimize performance

## Phase 10: Deployment

### 1. Infrastructure
- [ ] Set up production database
- [ ] Configure CDN
- [ ] Set up monitoring
- [ ] Add logging
- [ ] Configure backups

### 2. CI/CD
- [ ] Set up GitHub Actions
- [ ] Configure deployment
- [ ] Add smoke tests
- [ ] Create rollback system
- [ ] Set up staging

### 3. Documentation
- [ ] Create API docs
- [ ] Add usage guides
- [ ] Create help system
- [ ] Add code comments
- [ ] Create contributing guide

## Dependencies and Prerequisites
- Node.js 18+
- PostgreSQL 14+
- PostGIS 3+
- Mapbox API key
- Auth0 account
- AWS account (for S3)
- pnpm installed

## Environment Setup
```bash
# Required environment variables
NEXT_PUBLIC_MAPBOX_TOKEN=
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
DATABASE_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## Development Commands
```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Testing
pnpm test

# Build
pnpm build

# Type checking
pnpm type-check
```

## Notes
- Check off items as they're completed
- Follow order where possible
- Document any deviations
- Update dependencies as needed
- Review security at each phase
- Check DIR.md before creating new files
