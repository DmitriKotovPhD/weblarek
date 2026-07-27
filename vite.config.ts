import { defineConfig } from 'vite'

export default defineConfig({
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