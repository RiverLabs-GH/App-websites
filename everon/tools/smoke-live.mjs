// Smoke test against a live (or locally served) copy of the site.
// Usage: node tools/smoke-live.mjs <site url>
// Fails if the page, its assets, its canonical and Open Graph targets, the sitemap, robots.txt or the 404 page do not resolve where the page says.
// A 404 is retried for a while, because Pages can take a moment to serve a fresh deploy.
const slash = (u) => (u.endsWith('/') ? u : `${u}/`)
const base = slash(process.argv[2] || '')
if (!/^https?:\/\//.test(base)) { console.error('usage: node tools/smoke-live.mjs <site url>'); process.exit(2) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const failures = []
const TRIES = Number(process.env.SMOKE_TRIES || 8); const WAIT = Number(process.env.SMOKE_WAIT_MS || 8000)
async function get(url, want = 200) {
  let res
  for (let i = 1; i <= TRIES; i++) {
    try { res = await fetch(url); if (res.status === want) return res; if (res.status !== 404) break } catch (e) { res = { status: `network error: ${e.message}` } }
    if (i < TRIES) await sleep(WAIT)
  }
  failures.push(`${url} returned ${res.status}, expected ${want}`); return null
}
const page = await get(base)
if (page) {
  const html = await page.text()
  if (!/<h1[\s>]/.test(html)) failures.push('live page has no <h1>')
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
  if (canonical && slash(canonical) !== base) failures.push(`canonical ${canonical} differs from ${base}`)
  const refs = new Set([...html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)].map((m) => m[1]))
  for (const r of refs) await get(new URL(r, base).href)
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1]; if (og) await get(og)
  for (const f of ['sitemap.xml', 'robots.txt', 'brand/tray-active.png', 'images/app/popover-active-light.webp', 'screens/']) await get(new URL(f, base).href)
}
const missing = await fetch(new URL('no-such-page-xyz', base)).catch(() => null)
if (missing && missing.status !== 404) failures.push(`an unknown address returned ${missing.status}, expected 404`)
if (failures.length) { console.error(failures.map((f) => `  - ${f}`).join('\n')); process.exit(1) }
console.log(`smoke OK: ${base}`)
