# API Architecture

## Overview
Type-safe API layer using tRPC with Next.js, providing end-to-end type safety between client and server.

## Base Configuration

### tRPC Setup
```typescript
// packages/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
```

### Context Setup
```typescript
// packages/api/context.ts
export interface Context {
  user?: {
    id: string;
    role: UserRole;
  };
  prisma: PrismaClient;
}

export const createContext = async (
  opts: CreateNextContextOptions
): Promise<Context> => {
  const session = await getSession(opts);
  return {
    user: session?.user,
    prisma: prisma,
  };
};
```

## Feature Routers

### Maps Router
```typescript
// packages/api/routers/maps.ts
export const mapsRouter = router({
  create: protectedProcedure
    .input(createMapSchema)
    .mutation(async ({ input, ctx }) => {
      const map = await ctx.prisma.map.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
      return map;
    }),
    
  get: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const map = await ctx.prisma.map.findUnique({
        where: { id: input },
        include: {
          routes: true,
          pois: true,
          photos: true,
        },
      });
      return map;
    }),
});
```

### GPX Router
```typescript
// packages/api/routers/gpx.ts
export const gpxRouter = router({
  upload: protectedProcedure
    .input(gpxUploadSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await processGPXFile(input.file);
      return result;
    }),
    
  process: protectedProcedure
    .input(gpxProcessSchema)
    .mutation(async ({ input, ctx }) => {
      const processed = await processGpxData(input);
      return processed;
    }),
});
```

### POI Router
```typescript
// packages/api/routers/pois.ts
export const poisRouter = router({
  create: protectedProcedure
    .input(createPoiSchema)
    .mutation(async ({ input, ctx }) => {
      const poi = await ctx.prisma.poi.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
      return poi;
    }),
    
  nearby: protectedProcedure
    .input(nearbyPoiSchema)
    .query(async ({ input, ctx }) => {
      const pois = await findNearbyPois(input.coordinates, input.radius);
      return pois;
    }),
});
```

## Client Integration

### API Hook Setup
```typescript
// packages/api/hooks/useApi.ts
export const useApi = () => {
  const api = trpc.useContext();
  
  return {
    maps: {
      create: trpc.maps.create.useMutation(),
      get: trpc.maps.get.useQuery,
      list: trpc.maps.list.useQuery,
    },
    gpx: {
      upload: trpc.gpx.upload.useMutation(),
      process: trpc.gpx.process.useMutation(),
    },
    pois: {
      create: trpc.pois.create.useMutation(),
      nearby: trpc.pois.nearby.useQuery,
    },
  };
};
```

### Usage Example
```typescript
// apps/web/features/maps/CreateMap.tsx
export const CreateMap = () => {
  const api = useApi();
  
  const handleCreate = async (data: CreateMapInput) => {
    try {
      const map = await api.maps.create.mutateAsync(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    // Component implementation
  );
};
```

## Error Handling

### Error Types
```typescript
// packages/api/errors.ts
export class APIError extends Error {
  constructor(
    public code: string,
    public httpStatus: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    return new TRPCError({
      code: mapErrorCode(error.code),
      message: error.message,
      cause: error,
    });
  }
  return error;
};
```

### Error Middleware
```typescript
// packages/api/middleware/error.ts
const errorMiddleware = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    throw handleAPIError(error);
  }
});
```

## Authentication & Authorization

### Auth Middleware
```typescript
// packages/api/middleware/auth.ts
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

const hasRole = (role: UserRole) => {
  return t.middleware(async ({ ctx, next }) => {
    if (ctx.user?.role !== role) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return next();
  });
};
```

## Validation

### Input Schemas
```typescript
// packages/api/schemas/input.ts
import { z } from 'zod';

export const createMapSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  viewState: z.object({
    center: z.tuple([z.number(), z.number()]),
    zoom: z.number(),
  }),
});

export const gpxUploadSchema = z.object({
  file: z.any(), // File type
  name: z.string(),
  processOptions: z.object({
    simplify: z.boolean().default(true),
    simplifyTolerance: z.number().default(0.00001),
  }),
});
```

## Performance Optimization

### Caching
```typescript
// packages/api/cache.ts
const withCache = (ttl: number) => {
  return t.middleware(async ({ path, input, next }) => {
    const cacheKey = `${path}:${JSON.stringify(input)}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const result = await next();
    await redis.setex(cacheKey, ttl, JSON.stringify(result));
    
    return result;
  });
};
```

### Batching
```typescript
// packages/api/batch.ts
const withBatch = t.middleware(async ({ path, input, next }) => {
  if (Array.isArray(input)) {
    return Promise.all(
      input.map(item => next({ input: item }))
    );
  }
  return next();
});
```

## Testing

### Integration Tests
```typescript
// packages/api/__tests__/maps.test.ts
describe('maps router', () => {
  it('creates a map', async () => {
    const caller = appRouter.createCaller({
      user: mockUser,
      prisma,
    });
    
    const result = await caller.maps.create({
      name: 'Test Map',
      description: 'Test Description',
      isPublic: true,
    });
    
    expect(result).toHaveProperty('id');
  });
});
```

## Related Documentation
- [DATABASE.md](DATABASE.md) - Database schema and queries
- [FEATURES/GPX.md](../FEATURES/GPX.md) - GPX processing
- [FEATURES/POI.md](../FEATURES/POI.md) - POI system