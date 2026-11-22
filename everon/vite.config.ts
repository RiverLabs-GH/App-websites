import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))

// base './' keeps every asset URL relative, so the site works from any subpath
// (GitHub Pages serves it at /App-websites/everon/) and when opened from disk.
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
    rollupOptions: { input: { main: resolve(here, 'index.html'), screens: resolve(here, 'screens/index.html') } },
  },
})
