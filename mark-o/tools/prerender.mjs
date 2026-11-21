// Prerenders the Vue app into dist/index.html so the page has real HTML before any JS runs,
// and writes sitemap.xml and robots.txt. Run by `npm run build`.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = process.cwd()
const siteUrl = (process.env.VITE_SITE_URL
  || (await readFile('.env.production', 'utf8')).match(/^VITE_SITE_URL=(.+)$/m)?.[1]
  || '').trim().replace(/\/?$/, '/')

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const html = await render()

const file = path.join(root, 'dist/index.html')
const page = await readFile(file, 'utf8')
if (!page.includes('<div id="app"></div>')) throw new Error('mount point not found in dist/index.html')
await writeFile(file, page.replace('<div id="app"></div>', `<div id="app">${html}</div>`))

const today = new Date().toISOString().slice(0, 10)
await writeFile(path.join(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`)
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`)

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${html.length} bytes, site url ${siteUrl}`)
