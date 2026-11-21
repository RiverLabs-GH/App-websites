// Checks the production build in dist/ before it is published. Exits non-zero on any failure.
// Usage: npm run build && npm run check
import { readFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const failures = []
const fail = (msg) => failures.push(msg)

async function walk(dir) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html not found. Run `npm run build` first.')
  process.exit(1)
}

const html = await readFile(path.join(dist, 'index.html'), 'utf8')
const files = await walk(dist)

// 1. Prerendered: real content is in the HTML before any JS runs.
if (!/<h1[\s>]/.test(html)) fail('index.html has no <h1>: the page was not prerendered')
if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail('index.html must have exactly one <h1>')
if (html.includes('<div id="app"></div>')) fail('mount point is empty: prerender did not run')

// 2. Nothing unresolved, and no root-absolute URLs (they break under /App-websites/mark-o/).
if (/%VITE_[A-Z_]+%/.test(html)) fail('an unreplaced %VITE_...% placeholder is left in index.html')
for (const m of html.matchAll(/\s(?:src|href|poster)="(\/[^"]*)"/g)) {
  if (!m[1].startsWith('//')) fail(`root-absolute URL in index.html: ${m[1]} (use a relative ./ path)`)
}

// 3. Every relative reference in the HTML and CSS exists in dist.
for (const m of html.matchAll(/(?:src|href|poster)="(\.\/[^"#?]+)"/g)) {
  if (!existsSync(path.join(dist, m[1]))) fail(`missing file referenced by index.html: ${m[1]}`)
}
for (const css of files.filter((f) => f.endsWith('.css'))) {
  const text = await readFile(css, 'utf8')
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const u = m[1]
    if (/^(data:|https?:|#)/.test(u)) continue
    if (u.startsWith('/')) fail(`root-absolute url() in ${path.basename(css)}: ${u}`)
    else if (!existsSync(path.resolve(path.dirname(css), u))) fail(`missing file referenced by ${path.basename(css)}: ${u}`)
  }
}

// 4. In-page anchors resolve.
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(m[1])) fail(`anchor #${m[1]} has no target`)
}

// 5. aria-controls and aria-labelledby point at real ids.
for (const attr of ['aria-controls', 'aria-labelledby']) {
  for (const m of html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))) {
    for (const id of m[1].split(/\s+/)) if (!ids.has(id)) fail(`${attr}="${id}" points at no element`)
  }
}

// 6. Every image has alt text.
for (const m of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\salt="/.test(m[0])) fail(`image without alt: ${m[0].slice(0, 80)}`)
}

// 7. SEO: title, description, canonical, Open Graph, sitemap and robots.
// Lengths are what a searcher sees, so decode HTML entities (&amp; is one character) before measuring.
const decode = (t) => t?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1])
if (!title) fail('missing <title>')
else if (title.length < 20 || title.length > 60) fail(`<title> is ${title.length} characters (want 20 to 60)`)
const description = decode(html.match(/name="description" content="([^"]*)"/)?.[1])
if (!description) fail('missing meta description')
else if (description.length < 70 || description.length > 160) fail(`meta description is ${description.length} characters (want 70 to 160)`)
const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
if (!canonical || !/^https:\/\//.test(canonical)) fail('canonical link is missing or not an absolute https URL')
for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) {
  if (!html.includes(`property="${p}"`)) fail(`missing ${p}`)
}
const og = html.match(/property="og:image" content="([^"]+)"/)?.[1]
if (og && canonical && !og.startsWith(canonical)) fail(`og:image (${og}) is not under the canonical URL (${canonical})`)
for (const f of ['sitemap.xml', 'robots.txt']) {
  if (!existsSync(path.join(dist, f))) fail(`missing ${f}`)
}
if (canonical && existsSync(path.join(dist, 'sitemap.xml'))) {
  const sm = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
  if (!sm.includes(`<loc>${canonical}</loc>`)) fail('sitemap.xml does not list the canonical URL')
}

// 7b. Structured data parses, names the app, lists its features, and every URL in it resolves in dist.
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
if (!ld) fail('no JSON-LD structured data')
else {
  let data
  try { data = JSON.parse(ld) } catch (e) { fail(`JSON-LD is not valid JSON: ${e.message}`) }
  if (data) {
    if (data['@type'] !== 'SoftwareApplication') fail('JSON-LD @type is not SoftwareApplication')
    if (!Array.isArray(data.featureList) || data.featureList.length === 0) fail('JSON-LD has no featureList')
    for (const u of [data.url, data.image, ...[].concat(data.screenshot || [])].filter(Boolean)) {
      if (canonical && !u.startsWith(canonical)) fail(`JSON-LD URL ${u} is not under the canonical address`)
      else if (canonical && u !== canonical && !existsSync(path.join(dist, u.slice(canonical.length)))) fail(`JSON-LD URL ${u} has no file in dist`)
    }
  }
}

// 8. Fully static and private: no third-party hosts anywhere in the built page or bundles.
const allowed = [
  /^https?:\/\/www\.w3\.org\//, /^https:\/\/schema\.org/, /^https:\/\/vuejs\.org\//,
  /^https?:\/\/www\.sitemaps\.org\//, /^https:\/\/github\.com\/RiverLabs-GH\/mark\.O\//,
]
const siteOrigin = canonical ? new URL(canonical).origin : null
for (const f of files.filter((f) => /\.(html|js|css|xml|txt)$/.test(f))) {
  const text = await readFile(f, 'utf8')
  for (const m of text.matchAll(/https?:\/\/[^\s"'<>)`\\]+/g)) {
    const url = m[0]
    if (siteOrigin && url.startsWith(siteOrigin)) continue
    if (allowed.some((re) => re.test(url))) continue
    fail(`unexpected external URL in ${path.relative(dist, f)}: ${url}`)
  }
}
if (/\b(?:XMLHttpRequest|WebSocket|sendBeacon|EventSource)\b/.test(
  (await Promise.all(files.filter((f) => f.endsWith('.js')).map((f) => readFile(f, 'utf8')))).join('\n'),
)) fail('a network API (XMLHttpRequest, WebSocket, sendBeacon or EventSource) is in the bundle')

// 9. Size: GitHub Pages sites are limited to 1 GB, and a single file over 100 MB cannot be pushed.
let total = 0
for (const f of files) {
  const { size } = await stat(f)
  total += size
  if (size > 50 * 1024 * 1024) fail(`${path.relative(dist, f)} is ${(size / 1048576).toFixed(1)} MB (limit 50 MB)`)
}
if (total > 100 * 1024 * 1024) fail(`dist is ${(total / 1048576).toFixed(1)} MB (limit 100 MB)`)

if (failures.length) {
  console.error(`\n${failures.length} problem${failures.length > 1 ? 's' : ''} in dist/:\n`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`dist OK: ${files.length} files, ${(total / 1048576).toFixed(1)} MB, canonical ${canonical}`)
