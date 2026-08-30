import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true   // для production
  },
  resolve: {
    alias: {
      '@': '/src',           // Алиас для папки src
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})