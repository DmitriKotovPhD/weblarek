import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true 
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