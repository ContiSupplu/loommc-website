import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        changelog: resolve(__dirname, 'changelog.html'),
        download: resolve(__dirname, 'download.html'),
        pricing: resolve(__dirname, 'pricing.html'),
      },
    },
  },
})
