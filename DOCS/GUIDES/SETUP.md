# Development Environment Setup Guide

## Prerequisites

### Required Software
- Node.js (v18+)
- pnpm (v8+)
- PostgreSQL (v14+)
- PostGIS (v3+)
- Git
- VS Code (recommended)

### Required Accounts
- GitHub account
- Auth0 account
- Mapbox account
- AWS account (for S3)

## Initial Setup

### 1. Clone and Install
```bash
# Clone repository
git clone https://github.com/yourusername/lutruwita.git
cd lutruwita

# Install dependencies
pnpm install
```

### 2. Environment Configuration
```bash
# Create environment files
cp .env.example .env.local

# Required environment variables
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=your_auth0_url
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
DATABASE_URL=postgresql://user:pass@localhost:5432/lutruwita_dev
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

### 3. Database Setup
```bash
# Install PostgreSQL and PostGIS
sudo apt install postgresql-14 postgresql-14-postgis-3

# Create development database
createdb lutruwita_dev

# Enable PostGIS
psql -d lutruwita_dev -c "CREATE EXTENSION postgis;"

# Run migrations
pnpm prisma migrate dev
```

### 4. VS Code Configuration
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Development Workflow

### 1. Starting Development Server
```bash
# Start development environment
pnpm dev

# In separate terminal, watch for type errors
pnpm type-check --watch
```

### 2. Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test path/to/test

# Watch mode
pnpm test --watch
```

### 3. Database Operations
```bash
# Generate Prisma client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name description

# Reset database
pnpm prisma migrate reset
```

## Package Development

### 1. Creating New Package
```bash
cd packages
mkdir my-package
cd my-package
pnpm init
```

### 2. Package Configuration
```json
// packages/my-package/package.json
{
  "name": "@lutruwita/my-package",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  }
}
```

### 3. Building Packages
```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @lutruwita/my-package build
```

## Common Development Tasks

### 1. Adding New Route
1. Create page in `apps/web/app/`
2. Add route to navigation
3. Implement components
4. Add tests

### 2. Creating New Component
1. Create component in appropriate package
2. Add types
3. Add tests
4. Add to exports

### 3. Adding API Endpoint
1. Create procedure in tRPC router
2. Add input/output types
3. Implement logic
4. Add tests

## Troubleshooting

### Database Issues
```bash
# Reset database
pnpm prisma migrate reset

# Verify PostGIS
psql -d lutruwita_dev -c "SELECT PostGIS_version();"

# Check connections
psql -d lutruwita_dev -c "SELECT * FROM pg_stat_activity;"
```

### Build Issues
```bash
# Clean all builds
pnpm clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Common Errors

#### Prisma Client Error
```bash
# Regenerate Prisma client
pnpm prisma generate

# Reset database if schema changed
pnpm prisma migrate reset
```

#### Node Version Error
```bash
# Check Node version
node -v

# Use correct version
nvm use 18
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write tests for new features

### Git Workflow
- Create feature branches
- Write descriptive commit messages
- Submit pull requests
- Keep branches up to date

### Testing
- Write unit tests
- Add integration tests
- Test edge cases
- Maintain test coverage

## Next Steps
1. Review [ARCHITECTURE.md](../ARCHITECTURE.md)
2. Check [FEATURES/GPX.md](../FEATURES/GPX.md)
3. Read [TECHNICAL/API.md](../TECHNICAL/API.md)
4. See [DEPLOYMENT.md](../DEPLOYMENT.md)