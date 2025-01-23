import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/form/index.ts',
    'src/form/types.ts',
    'src/modal/index.ts',
    'src/upload/index.ts',
    'src/upload/types.ts',
    'src/form/Checkbox.tsx',
    'src/form/FormContext.tsx',
    'src/form/RadioGroup.tsx',
    'src/form/Select.tsx',
    'src/form/Switch.tsx',
    'src/form/TextField.tsx',
    'src/modal/Modal.tsx',
    'src/modal/ModalContext.tsx',
    'src/modal/WelcomeModal.tsx',
    'src/navigation/Sidebar.tsx',
    'src/navigation/SidebarContext.tsx',
    'src/navigation/SidebarItem.tsx',
    'src/upload/GpxUpload.tsx'
  ],
  format: ['cjs', 'esm'],
  dts: true,
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
