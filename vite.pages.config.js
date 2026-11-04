import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ColorPalette/',
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true,
    rollupOptions: {
      input: 'pages-build.html',
      output: {
        entryFileNames: 'assets/palettelab.js',
        assetFileNames: 'assets/palettelab.css',
      },
    },
  },
})
