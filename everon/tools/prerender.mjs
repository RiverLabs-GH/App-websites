// Prerenders the Vue app into dist/index.html so the page has real HTML before any JS runs,
// and writes sitemap.xml, robots.txt and the branded 404 page. Run by `npm run build`.
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
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\nDisallow: ${new URL(siteUrl).pathname}screens/\n\nSitemap: ${siteUrl}sitemap.xml\n`)

// The branded 404 page. GitHub Pages serves 404.html from the root of the published site for any unknown address at any depth,
// so everything it loads is an absolute URL. The deploy workflow moves it from the build folder to the root of the published site.
await writeFile(path.join(root, 'dist/404.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | EverOn</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" sizes="32x32" href="${siteUrl}favicon/favicon-32.png">
<style>
:root{color-scheme:light dark;--bg:#f5f5f8;--t1:#1b1c21;--t2:#5c5e68;--ac:#2457c5}
@media(prefers-color-scheme:dark){:root{--bg:#1b1c21;--t1:#f3f3f6;--t2:#b1b3bd;--ac:#93b0f6}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--t1);font:400 1.0625rem/1.55 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:min(100% - 2.5rem,34rem);padding-block:4rem;text-align:center}
.ring{display:block;width:56px;height:56px;margin:0 auto 2rem;background:var(--ac);-webkit-mask:url(${siteUrl}brand/tray-active.png) center/contain no-repeat;mask:url(${siteUrl}brand/tray-active.png) center/contain no-repeat;animation:sleep 2.4s cubic-bezier(.2,.7,.2,1) .4s both}
@keyframes sleep{to{transform:translateY(14px) rotate(-8deg);opacity:.45}}
@media(prefers-reduced-motion:reduce){.ring{animation:none;opacity:.45}}
h1{margin:0 0 1rem;font-size:clamp(2rem,1.4rem + 3vw,3rem);font-weight:650;line-height:1.1;letter-spacing:-.03em}
p{margin:0 0 2rem;color:var(--t2)}
a{display:inline-flex;align-items:center;min-height:2.75rem;padding:0 1.5rem;border-radius:999px;background:var(--ac);color:#fff;font-weight:600;text-decoration:none}
@media(prefers-color-scheme:dark){a{color:#10131c}}
a:focus-visible{outline:2px solid var(--ac);outline-offset:3px}
</style>
</head>
<body>
<main>
<span class="ring" role="img" aria-label="EverOn ring icon"></span>
<h1>Page not found</h1>
<p>There is nothing at this address.</p>
<a href="${siteUrl}">Go to the EverOn home page</a>
</main>
</body>
</html>
`)

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${html.length} bytes, site url ${siteUrl}`)
