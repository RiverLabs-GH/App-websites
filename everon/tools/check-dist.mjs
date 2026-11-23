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
  for (const e of await readdir(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...(await walk(p))); else out.push(p) }
  return out
}
if (!existsSync(path.join(dist, 'index.html'))) { console.error('dist/index.html not found. Run `npm run build` first.'); process.exit(1) }
const html = await readFile(path.join(dist, 'index.html'), 'utf8')
const files = await walk(dist)

// 1. Prerendered: real content is in the HTML before any JS runs.
if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail('index.html must have exactly one <h1> (the page was not prerendered, or has several)')
if (html.includes('<div id="app"></div>')) fail('mount point is empty: prerender did not run')
for (const must of ['Coming soon for Mac', 'Built for macOS 13 or later', 'Interactive demo', 'basic toggle']) if (!html.includes(must)) fail(`prerendered HTML is missing "${must}"`)

// 2. Nothing unresolved, and no root-absolute URLs (they break under /App-websites/everon/).
if (/%VITE_[A-Z_]+%/.test(html)) fail('an unreplaced %VITE_...% placeholder is left in index.html')
for (const m of html.matchAll(/\s(?:src|href|poster)="(\/[^"]*)"/g)) if (!m[1].startsWith('//')) fail(`root-absolute URL in index.html: ${m[1]}`)

// 3. Every relative reference in the HTML and CSS exists in dist.
for (const m of html.matchAll(/(?:src|href|poster)="(\.\/[^"#?]+)"/g)) if (!existsSync(path.join(dist, m[1]))) fail(`missing file referenced by index.html: ${m[1]}`)
for (const css of files.filter((f) => f.endsWith('.css'))) {
  const text = await readFile(css, 'utf8')
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const u = m[1]; if (/^(data:|https?:|#)/.test(u)) continue
    if (u.startsWith('/')) fail(`root-absolute url() in ${path.basename(css)}: ${u}`)
    else if (!existsSync(path.resolve(path.dirname(css), u))) fail(`missing file referenced by ${path.basename(css)}: ${u}`)
  }
}
// Capture and brand images named in the bundle exist (the data files build their URLs at run time).
const bundle = (await Promise.all(files.filter((f) => f.endsWith('.js')).map((f) => readFile(f, 'utf8')))).join('\n')
for (const m of bundle.matchAll(/images\/app\/([a-z0-9-]+)\.webp/g)) if (!existsSync(path.join(dist, 'images/app', `${m[1]}.webp`))) fail(`bundle names a missing capture: ${m[1]}`)
for (const m of html.matchAll(/images\/app\/([a-z0-9-]+)\.webp/g)) if (!existsSync(path.join(dist, 'images/app', `${m[1]}.webp`))) fail(`HTML names a missing capture: ${m[1]}`)
for (const s of ['active', 'inactive', 'paused', 'attention', 'unknown']) if (!existsSync(path.join(dist, `brand/tray-${s}.png`))) fail(`missing brand/tray-${s}.png`)

// 4. Anchors and ARIA references resolve.
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) fail(`anchor #${m[1]} has no target`)
for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) for (const m of html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))) for (const id of m[1].split(/\s+/)) if (!ids.has(id)) fail(`${attr}="${id}" points at no element`)

// 5. Images: alt text, dimensions, lazy loading below the fold.
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
for (const t of imgs) { const decorative = /\salt=""/.test(t) && /riverlabs-logo/.test(t) // the company mark sits inside a link whose text already names the company
    if (!decorative && !/\salt="[^"]+"/.test(t)) fail(`image without alt text: ${t.slice(0, 80)}`); if (!/\swidth="\d+"/.test(t) || !/\sheight="\d+"/.test(t)) fail(`image without width and height: ${t.slice(0, 80)}`) }
if (imgs.length && !imgs.some((t) => /loading="lazy"/.test(t))) fail('no image is lazy-loaded')
// Every real-capture image carries the sample-data note somewhere on the page.
if (!html.includes('Captured from the EverOn app, with sample data.')) fail('the capture caption (sample data) is missing')
if (!html.includes('Interface shown from the EverOn design spec.')) fail('the generated-screen caption is missing')

// 6. SEO.
const decode = (t) => t?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1])
if (!title) fail('missing <title>'); else if (title.length < 20 || title.length > 60) fail(`<title> is ${title.length} characters (want 20 to 60)`)
const description = decode(html.match(/name="description" content="([^"]*)"/)?.[1])
if (!description) fail('missing meta description'); else if (description.length < 70 || description.length > 160) fail(`meta description is ${description.length} characters (want 70 to 160)`)
const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
if (!canonical || !/^https:\/\//.test(canonical)) fail('canonical link is missing or not an absolute https URL')
for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!html.includes(`property="${p}"`)) fail(`missing ${p}`)
const og = html.match(/property="og:image" content="([^"]+)"/)?.[1]
if (og && canonical && !og.startsWith(canonical)) fail(`og:image (${og}) is not under the canonical URL`)
if (og && canonical && !existsSync(path.join(dist, og.slice(canonical.length)))) fail(`og:image file is missing: ${og}`)
for (const f of ['sitemap.xml', 'robots.txt']) if (!existsSync(path.join(dist, f))) fail(`missing ${f}`)
if (canonical && existsSync(path.join(dist, 'sitemap.xml'))) { const sm = await readFile(path.join(dist, 'sitemap.xml'), 'utf8'); if (!sm.includes(`<loc>${canonical}</loc>`)) fail('sitemap.xml does not list the canonical URL'); if (/screens|404/.test(sm)) fail('sitemap.xml lists a page that must stay out of search') }
if (existsSync(path.join(dist, 'robots.txt')) && !/Disallow: .*screens\//.test(await readFile(path.join(dist, 'robots.txt'), 'utf8'))) fail('robots.txt does not disallow the screens catalogue')

// 6b. Structured data: SoftwareApplication for macOS, a feature list, and no price, offer or download claim.
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
if (!ld) fail('no JSON-LD structured data')
else {
  let data; try { data = JSON.parse(ld) } catch (e) { fail(`JSON-LD is not valid JSON: ${e.message}`) }
  if (data) {
    if (data['@type'] !== 'SoftwareApplication') fail('JSON-LD @type is not SoftwareApplication')
    if (data.operatingSystem !== 'macOS') fail('JSON-LD operatingSystem is not macOS')
    if (!Array.isArray(data.featureList) || !data.featureList.length) fail('JSON-LD has no featureList')
    for (const k of ['offers', 'price', 'downloadUrl', 'installUrl', 'aggregateRating', 'review']) if (k in data) fail(`JSON-LD must not carry "${k}" (no price, download or rating claims)`)
    for (const u of [data.url, data.image, ...[].concat(data.screenshot || [])].filter(Boolean)) {
      if (canonical && !u.startsWith(canonical)) fail(`JSON-LD URL ${u} is not under the canonical address`)
      else if (canonical && u !== canonical && !existsSync(path.join(dist, u.slice(canonical.length)))) fail(`JSON-LD URL ${u} has no file in dist`)
    }
  }
}

// 6c. The download button is not a link (there is no public distribution URL), and nothing mentions Windows or a price.
if (/<a\b[^>]*\bdownload\b/i.test(html) || /<a\b[^>]*>\s*(?:Download|Get EverOn now)/i.test(html)) fail('a download link is present, but no public distribution URL exists')
const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ')
if (/\bWindows\b|\bLinux\b/.test(text)) fail('the page mentions Windows or Linux (EverOn is macOS only)')
if (/[$€£]\s?\d|\bper (?:month|year)\b|\bsubscription\b/i.test(text)) fail('the page mentions a price')

// 6d. No rule may hide the whole document.
for (const css of files.filter((f) => f.endsWith('.css'))) {
  const t = await readFile(css, 'utf8')
  for (const m of t.matchAll(/(?:^|[}\s])((?:html|body|:root)(?::not\([^)]*\))*)\s*\{([^}]*)\}/g)) if (/(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?![.\d]))/.test(m[2])) fail(`${path.basename(css)} has a rule that hides the whole page: ${m[1]}`)
}

// 6e. Reduced motion is honoured in the CSS, and motion uses the tokens.
const allCss = (await Promise.all(files.filter((f) => f.endsWith('.css')).map((f) => readFile(f, 'utf8')))).join('\n')
if (!/prefers-reduced-motion:\s*reduce/.test(allCss)) fail('no prefers-reduced-motion rule in the CSS')
if (!/--dur-base/.test(allCss)) fail('motion tokens (--dur-base) are missing from the CSS')

// 7. The 404 page and the screens catalogue.
{
  const f404 = path.join(dist, '404.html')
  if (!existsSync(f404)) fail('missing 404.html')
  else {
    const t = await readFile(f404, 'utf8')
    if (!/<meta name="robots" content="noindex">/.test(t)) fail('404.html is not marked noindex')
    if (!/<title>Page not found \| EverOn<\/title>/.test(t)) fail('404.html has no "Page not found | EverOn" title')
    for (const m of t.matchAll(/(?:src|href)="([^"]+)"/g)) { if (!/^https?:\/\//.test(m[1])) fail(`404.html has a relative URL ${m[1]}`); else if (canonical && m[1].startsWith(canonical) && m[1] !== canonical && !existsSync(path.join(dist, m[1].slice(canonical.length)))) fail(`404.html refers to ${m[1]}, which has no file in dist`) }
    for (const m of t.matchAll(/url\(([^)]+)\)/g)) { const u = m[1].replace(/["']/g, ''); if (!/^https?:\/\//.test(u)) fail(`404.html has a relative url(${u})`); else if (canonical && u.startsWith(canonical) && !existsSync(path.join(dist, u.slice(canonical.length)))) fail(`404.html refers to ${u}, which has no file in dist`) }
  }
  const scr = path.join(dist, 'screens/index.html')
  if (!existsSync(scr)) fail('missing screens/index.html')
  else { const t = await readFile(scr, 'utf8'); if (!/<meta name="robots" content="noindex"/.test(t)) fail('screens/index.html is not noindex') ; for (const m of t.matchAll(/(?:src|href)="(\.\.?\/[^"#?]+)"/g)) if (!existsSync(path.resolve(dist, 'screens', m[1]))) fail(`screens/index.html references a missing file: ${m[1]}`) }
}

// 7b. The company reference: the footer links to the company site and the structured data names the same publisher; the sibling product link resolves on this origin.
{
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}')
  const pubUrl = ld.publisher?.url
  if (!pubUrl || !html.includes(`href="${pubUrl}"`)) fail(`the footer does not link to the structured data's publisher (${pubUrl})`)
  if (!/href="mailto:[^"]+"/.test(html)) fail('the footer has no company contact link')
  const mo = html.match(/<a class="app"[^>]*href="([^"]+)"/)?.[1]
  if (!mo || !canonical || new URL(mo).origin !== new URL(canonical).origin || !/\/mark-o\/$/.test(mo)) fail(`the mark.O link is wrong: ${mo}`)
}

// 8. Fully static and private: no third-party hosts, no network APIs.
// The parent company's own site, linked from the footer and named as the publisher in the structured data (links only, nothing is fetched).
const allowed = [/^https:\/\/river-labs\.io\//, /^https?:\/\/www\.w3\.org\//, /^https:\/\/schema\.org/, /^https:\/\/vuejs\.org\//, /^https?:\/\/www\.sitemaps\.org\//]
const siteOrigin = canonical ? new URL(canonical).origin : null
for (const f of files.filter((f) => /\.(html|js|css|xml|txt)$/.test(f))) {
  const t = await readFile(f, 'utf8')
  for (const m of t.matchAll(/https?:\/\/[^\s"'<>)`\\]+/g)) {
    const url = m[0]
    try { if (siteOrigin && new URL(url).origin === siteOrigin) continue } catch { /* not a URL */ }
    if (allowed.some((re) => re.test(url))) continue
    fail(`unexpected external URL in ${path.relative(dist, f)}: ${url}`)
  }
}
if (/\b(?:XMLHttpRequest|WebSocket|sendBeacon|EventSource)\b|\bfetch\(/.test(bundle)) fail('a network API (fetch, XMLHttpRequest, WebSocket, sendBeacon or EventSource) is in the bundle')

// 9. Size.
let total = 0
for (const f of files) { const { size } = await stat(f); total += size; if (size > 50 * 1024 * 1024) fail(`${path.relative(dist, f)} is over 50 MB`) }
if (total > 100 * 1024 * 1024) fail(`dist is ${(total / 1048576).toFixed(1)} MB (limit 100 MB)`)
const js = (await Promise.all(files.filter((f) => f.endsWith('.js')).map((f) => stat(f)))).reduce((a, s) => a + s.size, 0)
if (js > 400 * 1024) fail(`JavaScript is ${(js / 1024).toFixed(0)} KB uncompressed (budget 400 KB)`)

if (failures.length) { console.error(`\n${failures.length} problem${failures.length > 1 ? 's' : ''} in dist/:\n`); for (const f of failures) console.error(`  - ${f}`); process.exit(1) }
console.log(`dist OK: ${files.length} files, ${(total / 1048576).toFixed(1)} MB, JS ${(js / 1024).toFixed(0)} KB, canonical ${canonical}`)
