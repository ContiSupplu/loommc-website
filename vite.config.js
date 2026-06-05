import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs.html'),
        features: resolve(__dirname, 'features.html'),
        quickservers: resolve(__dirname, 'quick-servers.html'),
        release: resolve(__dirname, 'release.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        contact: resolve(__dirname, 'contact.html'),
        notfound: resolve(__dirname, '404.html'),
        card: resolve(__dirname, 'card/index.html'),
      },
    },
  },
})
