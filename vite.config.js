import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This project has several CRA-era .js files that contain JSX (a pattern
// CRA's webpack config allowed but Vite's esbuild does not by default).
// These loader overrides let esbuild parse JSX in .js files without
// renaming every component. Safe to remove once files are renamed to .jsx.
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
})
