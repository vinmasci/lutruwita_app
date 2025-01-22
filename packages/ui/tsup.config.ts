import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/navigation/Sidebar.tsx',
    'src/navigation/SidebarContext.tsx',
    'src/navigation/SidebarItem.tsx'
  ],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    compilerOptions: {
      moduleResolution: "node",
      jsx: "react-jsx",
      isolatedModules: true,
      outDir: "./dist"
    }
  },
  outDir: "./dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
});
