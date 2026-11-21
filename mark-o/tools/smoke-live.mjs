// Smoke test against a live (or locally served) copy of the site.
// Usage: node tools/smoke-live.mjs <site url> [expected canonical url]
//   node tools/smoke-live.mjs https://riverlabs-gh.github.io/App-websites/mark-o/
//
// Fails if the page, its assets, its canonical and Open Graph targets, the sitemap or
// robots.txt do not resolve at the address the page says it lives at, or if the video
// does not support range requests (needed for seeking).
// A 404 is retried for a while, because Pages can take a moment to serve a fresh deploy.

const ensureSlash = (u) => (u.endsWith('/') ? u : `${u}/`)
const base = ensureSlash(process.argv[2] || '')
const expectCanonical = ensureSlash(process.argv[3] || base)
if (!/^https?:\/\//.test(base)) {
  console.error('usage: node tools/smoke-live.mjs <site url> [expected canonical url]')
  process.exit(2)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const failures = []
const fail = (m) => failures.push(m)

const TRIES = Number(process.env.SMOKE_TRIES || 8)
const WAIT_MS = Number(process.env.SMOKE_WAIT_MS || 8000)

async function get(url, init = {}, { wantStatus = 200, tries = TRIES, waitMs = WAIT_MS } = {}) {
  let res
  for (let i = 1; i <= tries; i++) {
    try {
      res = await fetch(url, init)
      if (res.status === wantStatus) return res
      if (res.status !== 404) break // only a 404 is worth waiting out
    } catch (e) {
      res = { status: `network error: ${e.message}`, headers: new Headers() }
    }
    if (i < tries) await sleep(waitMs)
  }
  fail(`${url} returned ${res.status}, expected ${wantStatus}`)
  return null
}

// 1. The page itself.
const page = await get(base)
if (!page) done()
const html = await page.text()
if (!/<h1[\s>]/.test(html)) fail('the page has no <h1>: it is not the prerendered site')
if (!/mark\.O/.test(html)) fail('the page does not look like the mark.O site')

// 2. It must say it lives where it is served.
const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
if (!canonical) fail('no canonical link')
else if (ensureSlash(canonical) !== expectCanonical) {
  fail(`canonical is ${canonical} but the site is served at ${expectCanonical}`)
}

// 3. Everything the page points at under its canonical address resolves at the served address.
const rel = (u) => (canonical && u.startsWith(canonical) ? u.slice(canonical.length) : null)
const og = html.match(/property="og:image" content="([^"]+)"/)?.[1]
const targets = new Map()
const add = (label, path) => path && targets.set(label, path)
add('og:image', og && rel(og))
if (og && rel(og) === null) fail(`og:image ${og} is not under the canonical address`)
add('sitemap.xml', 'sitemap.xml')
add('robots.txt', 'robots.txt')
for (const m of html.matchAll(/(?:src|href|poster)="\.\/([^"#?]+)"/g)) add(m[1], m[1])
for (const [label, p] of targets) {
  const res = await get(base + p, { method: 'GET' })
  if (res) await res.arrayBuffer()
  else continue
  if (label === 'og:image' && !(res.headers.get('content-type') || '').startsWith('image/')) {
    fail(`og:image is served as ${res.headers.get('content-type')}, not an image`)
  }
}

// 4. The sitemap lists the canonical address; robots.txt points at the sitemap.
const sm = await get(base + 'sitemap.xml')
if (sm && canonical && !(await sm.text()).includes(`<loc>${canonical}</loc>`)) fail('sitemap.xml does not list the canonical address')
const robots = await get(base + 'robots.txt')
if (robots && !(await robots.text()).includes('Sitemap:')) fail('robots.txt has no Sitemap line')

// 5. The video supports range requests (seeking).
const video = html.match(/src="\.\/(videos\/[^"]+\.mp4)"/)?.[1]
if (!video) fail('no video found on the page')
else {
  const r = await get(base + video, { headers: { Range: 'bytes=0-99' } }, { wantStatus: 206 })
  if (r) {
    await r.arrayBuffer()
    if (!r.headers.get('content-range')) fail('video range response has no Content-Range')
  }
}

// 6. An unknown address gets the branded 404 page (served from the Pages site root) with a 404 status.
{
  const url = `${base}__smoke-404-${Date.now()}`
  let ok = false
  let last = 'no response'
  for (let i = 1; i <= TRIES && !ok; i++) {
    try {
      const r = await fetch(url)
      const body = await r.text()
      ok = r.status === 404 && /<title>Page not found \| mark\.O<\/title>/.test(body) && /name="robots" content="noindex"/.test(body)
      last = ok ? 'ok' : `${r.status}, ${(body.match(/<title>([^<]*)<\/title>/) || [])[1] || 'no title'}`
    } catch (e) {
      last = `network error: ${e.message}`
    }
    if (!ok && i < TRIES) await sleep(WAIT_MS)
  }
  if (!ok) fail(`${url} did not return the branded 404 page (got ${last})`)
}

done()

function done() {
  if (failures.length) {
    console.error(`\nsmoke test failed for ${base}\n`)
    for (const f of failures) console.error(`  - ${f}`)
    process.exit(1)
  }
  console.log(`smoke test OK: ${base} (${targets.size} resources, canonical ${canonical}, video range ok)`)
  process.exit(0)
}
