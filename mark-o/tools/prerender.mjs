// Prerenders the Vue app into dist/index.html so the page has real HTML before any JS runs,
// and writes sitemap.xml and robots.txt. Run by `npm run build`.
import { readFile, writeFile, rm, readdir, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = process.cwd()
const siteUrl = (process.env.VITE_SITE_URL
  || (await readFile('.env.production', 'utf8')).match(/^VITE_SITE_URL=(.+)$/m)?.[1]
  || '').trim().replace(/\/?$/, '/')

const { render, company } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const html = await render()

const file = path.join(root, 'dist/index.html')
const page = await readFile(file, 'utf8')
if (!page.includes('<div id="app"></div>')) throw new Error('mount point not found in dist/index.html')
// The publisher and author come from the same company entry as the footer, so they cannot drift apart.
const publisher = { '@type': 'Organization', name: company.name, url: company.url, logo: `${siteUrl}${company.logoPath}`, email: company.email }
const out = page
  .replace('<div id="app"></div>', `<div id="app">${html}</div>`)
  .replace('"__PUBLISHER__"', JSON.stringify(publisher))
  .replace('__COMPANY_NAME__', company.name)
if (out.includes('__PUBLISHER__') || out.includes('__COMPANY_NAME__')) throw new Error('a company placeholder was not replaced in dist/index.html')
await writeFile(file, out)

const today = new Date().toISOString().slice(0, 10)
await writeFile(path.join(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc><lastmod>${today}</lastmod></url>\n  <url><loc>${siteUrl}privacy/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`)
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`)

// The branded 404 page. GitHub Pages serves 404.html from the root of the published site for any unknown
// address at any depth, so it cannot use relative URLs: everything it loads is an absolute URL.
// The deploy workflow moves it from the build folder to the root of the published site.
const font = (await readdir(path.join(root, 'dist/assets'))).find((f) => /^inter-latin-.*\.woff2$/.test(f))
await writeFile(path.join(root, 'dist/404.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | mark.O</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" sizes="32x32" href="${siteUrl}favicon/favicon-32.png">
<style>
${font ? `@font-face{font-family:Inter;src:url(${siteUrl}assets/${font}) format("woff2");font-weight:100 900;font-display:swap}` : ''}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff;color:#1d1d1f;font:400 1.125rem/1.55 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:min(100% - 2.5rem,34rem);padding-block:4rem;text-align:center}
img{display:block;height:1.75rem;width:auto;margin:0 auto 2.5rem}
h1{margin:0 0 1rem;font-size:clamp(2rem,1.4rem + 3vw,3rem);font-weight:700;line-height:1.1;letter-spacing:-.03em}
p{margin:0 0 2rem;color:#515154}
p.by{margin:2rem 0 0;font-size:.9375rem}
p.by a{display:inline;min-height:0;padding:0;background:none;color:#515154;font-weight:400;text-decoration:underline}
a{display:inline-flex;align-items:center;min-height:2.75rem;padding:0 1.5rem;border-radius:999px;background:#1d1d1f;color:#fff;font-weight:500;text-decoration:none}
a:hover{background:#000}
a:focus-visible{outline:2px solid #2457c5;outline-offset:3px}
</style>
</head>
<body>
<main>
<img src="${siteUrl}images/wordmark.png" width="448" height="120" alt="mark.O">
<h1>Page not found</h1>
<p>There is nothing at this address.</p>
<a href="${siteUrl}">Go to the mark.O home page</a>
<p class="by"><a href="${company.url}">${company.byline}</a></p>
</main>
</body>
</html>
`)

// The privacy policy, a public page at privacy/ (the address the App Store listing points to). The text is
// src/content/privacy.md, a copy of assets/legal/privacy.md in the mark.O repo (`npm run assets` refreshes it).
// Like the 404 page it is self-contained, with absolute URLs, so it does not depend on the Vue bundle.
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inline = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
function mdToHtml(md) {
  const out = []
  let list = false
  let para = []
  const flush = () => { if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`); para = [] }
  const close = () => { if (list) out.push('</ul>'); list = false }
  for (const line of md.split('\n')) {
    if (/^#\s/.test(line)) { flush(); close(); continue } // the page's own <h1> carries the title
    const h = line.match(/^##\s+(.*)/)
    const li = line.match(/^-\s+(.*)/)
    if (h) { flush(); close(); out.push(`<h2>${inline(h[1])}</h2>`) }
    else if (li) { flush(); if (!list) out.push('<ul>'); list = true; out.push(`<li>${inline(li[1])}</li>`) }
    else if (!line.trim()) { flush(); close() }
    else para.push(line.trim())
  }
  flush(); close()
  return out.join('\n')
}
const policy = await readFile(path.join(root, 'src/content/privacy.md'), 'utf8')
const updated = policy.match(/^Last updated:\s*(.+)$/m)?.[1]
if (!updated) throw new Error('src/content/privacy.md has no "Last updated:" line')
const body = mdToHtml(policy.replace(/^Last updated:.*$/m, ''))
await mkdir(path.join(root, 'dist/privacy'), { recursive: true })
await writeFile(path.join(root, 'dist/privacy/index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy policy | mark.O</title>
<meta name="description" content="mark.O runs on your Mac and collects, transmits and shares no personal data. This is its privacy policy, including how the on-device assistant handles your notes.">
<meta name="author" content="${esc(company.name)}">
<link rel="canonical" href="${siteUrl}privacy/">
<link rel="icon" type="image/png" sizes="32x32" href="${siteUrl}favicon/favicon-32.png">
<style>
${font ? `@font-face{font-family:Inter;src:url(${siteUrl}assets/${font}) format("woff2");font-weight:100 900;font-display:swap}` : ''}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#1d1d1f;font:400 1.0625rem/1.65 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.skip{position:absolute;left:-999px}.skip:focus{left:1rem;top:1rem;background:#fff;padding:.5rem 1rem}
header,main,footer{width:min(100% - 2.5rem,42rem);margin-inline:auto}
header{padding-block:2rem 0}
header a{display:inline-block}header img{display:block;height:1.75rem;width:auto}
main{padding-block:3rem 4rem}
h1{margin:0 0 .5rem;font-size:clamp(2rem,1.4rem + 3vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em}
.updated{margin:0 0 2.5rem;color:#515154;font-size:.9375rem}
h2{margin:2.25rem 0 .75rem;font-size:1.3125rem;font-weight:600;letter-spacing:-.01em}
p,li{color:#3a3a3c}p{margin:0 0 1rem}ul{margin:0 0 1rem;padding-left:1.25rem}li{margin-bottom:.5rem}
strong{color:#1d1d1f;font-weight:600}
a{color:#2457c5}a:focus-visible{outline:2px solid #2457c5;outline-offset:3px}
footer{padding-block:1.5rem 3rem;border-top:1px solid #d2d2d7;color:#515154;font-size:.9375rem}
footer p{margin:.25rem 0;color:#515154}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header><a href="${siteUrl}"><img src="${siteUrl}images/wordmark.png" width="448" height="120" alt="mark.O home"></a></header>
<main id="main">
<h1>mark.O privacy policy</h1>
<p class="updated">Last updated: ${esc(updated)}</p>
${body}
</main>
<footer>
<p><a href="${siteUrl}">mark.O home</a> · <a href="${company.url}">${esc(company.byline)}</a></p>
<p>Contact: <a href="mailto:${esc(company.email)}">${esc(company.email)}</a></p>
</footer>
</body>
</html>
`)

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${html.length} bytes, site url ${siteUrl}`)
