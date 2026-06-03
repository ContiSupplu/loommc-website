import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs.html'),
        quickservers: resolve(__dirname, 'quick-servers.html'),
        release: resolve(__dirname, 'release.html'),
        changelog: resolve(__dirname, 'changelog.html'),
      },
    },
  },
})
