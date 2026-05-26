import { defineConfig } from 'vite';

export default defineConfig({
  // Set base path to relative to allow correct asset loading on GitHub Pages subdirectories
  base: './',
  build: {
    outDir: 'dist',
  }
});
