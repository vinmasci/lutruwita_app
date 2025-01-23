├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── turbo.json
├── apps/
│   └── web/
│       ├── .gitignore
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── README.md
│       ├── tailwind.config.ts
│       ├── theme.ts
│       ├── tsconfig.json
│       ├── app/
│       │   ├── error.tsx
│       │   ├── favicon.ico
│       │   ├── global-error.tsx
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── api/
│       │   │   ├── auth/
│       │   │   │   └── [auth0]/
│       │   │   │       └── route.ts
│       │   │   └── trpc/
│       │   │       └── [trpc]/
│       │   │           └── route.ts
│       │   └── profile/
│       │       └── page.tsx
│       ├── components/
│       │   ├── AuthButton.tsx
│       │   ├── Header.tsx
│       │   ├── LoadingScreen.tsx
│       │   ├── Map.tsx
│       │   └── TrpcTest.tsx
│       ├── contexts/
│       │   └── MapContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── withAuth.tsx
│       ├── public/
│       │   ├── file.svg
│       │   ├── globe.svg
│       │   ├── next.svg
│       │   ├── vercel.svg
│       │   └── window.svg
│       ├── types/
│       │   └── map.ts
│       └── utils/
│           ├── layerManager.ts
│           ├── mapEvents.ts
│           ├── storage.ts
│           └── trpc.ts
├── DOCS/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── DOCS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── PROJECT.md
│   ├── COMPONENTS/
│   │   └── SIDEBAR.md
│   ├── FEATURES/
│   │   ├── GPX.md
│   │   ├── MAPS.md
│   │   ├── PHOTOS.md
│   │   └── POI.md
│   ├── GUIDES/
│   │   └── SETUP.md
│   └── TECHNICAL/
│       ├── API.md
│       └── DATABASE.md
└── packages/
    ├── api/
    │   ├── index.ts
    │   ├── package.json
    │   ├── router.ts
    │   └── trpc.ts
    ├── db/
    │   ├── client.ts
    │   ├── index.ts
    │   ├── package.json
    │   └── prisma/
    │       └── schema.prisma
    ├── map-core/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   └── src/
    │       ├── index.ts
    │       ├── gpx/
    │       │   ├── index.ts
    │       │   ├── processor.ts
    │       │   └── types.ts
    │       └── types/
    │           ├── simplify-js.d.ts
    │           ├── togeojson.d.ts
    │           └── xml2js.d.ts
    └── ui/
        ├── package.json
        ├── tsconfig.json
        ├── tsconfig.tsbuildinfo
        ├── tsup.config.ts
        └── src/
            ├── index.ts
            ├── form/
            │   ├── Checkbox.tsx
            │   ├── FormContext.tsx
            │   ├── index.ts
            │   ├── RadioGroup.tsx
            │   ├── Select.tsx
            │   ├── Switch.tsx
            │   ├── TextField.tsx
            │   └── types.ts
            ├── modal/
            │   ├── index.ts
            │   ├── Modal.tsx
            │   ├── ModalContext.tsx
            │   └── WelcomeModal.tsx
            ├── navigation/
            │   ├── Sidebar.tsx
            │   ├── SidebarContext.tsx
            │   └── SidebarItem.tsx
            └── upload/
                ├── GpxUpload.tsx
                ├── index.ts
                └── types.ts