import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' keeps every asset URL relative, so the site works from any subpath
// (GitHub Pages serves it at /App-websites/mark-o/) and when opened from disk.
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
})
