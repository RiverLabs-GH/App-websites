// Builds web-ready assets from the mark.O repo. Read-only on the source repo.
// Usage: MARKO_REPO=/path/to/mark.O npm run assets
import sharp from 'sharp'
import { mkdir, copyFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const repo = process.env.MARKO_REPO || '/Users/vipinkp/PycharmProjects/mark.O'
const shots = path.join(repo, 'product-video/public/screenshots')
const out = path.resolve('public')
const img = path.join(out, 'images')

await mkdir(path.join(img, 'demo'), { recursive: true })
await mkdir(path.join(out, 'favicon'), { recursive: true })
const fontsDir = path.resolve('src/assets/fonts')
await mkdir(fontsDir, { recursive: true })
const dims = {}

// Screenshots: 2880px source -> 2000px WebP (about 2x for a 1000px-wide frame)
const main = ['read', 'render', 'edit', 'history-panel', 'okf-read', 'okf-graph', 'okf-diff']
for (const n of main) {
  const r = await sharp(path.join(shots, `${n}.png`)).resize({ width: 2000 }).webp({ quality: 80 })
    .toFile(path.join(img, `${n}.webp`))
  dims[`${n}`] = [r.width, r.height]
}

// AI assistant: raw app captures from docs/store-images/website (3000px source -> 2000px WebP)
for (const n of ['ai-app-summary', 'ai-app-ask']) {
  const r = await sharp(path.join(repo, 'docs/store-images/website', `${n}.png`)).resize({ width: 2000 }).webp({ quality: 80 })
    .toFile(path.join(img, `${n}.webp`))
  dims[`${n}`] = [r.width, r.height]
}

// Step captures for the product tour
const steps = { detect: [0, 1, 2], verify: [0, 1, 2, 4], graph: [0, 1, 4], extend: [0, 2, 3], export: [0, 2, 4], search: [1, 3] }
for (const [k, list] of Object.entries(steps)) {
  for (const i of list) {
    const f = String(i).padStart(3, '0')
    const r = await sharp(path.join(shots, 'demo', k, `${f}.png`)).resize({ width: 1600 }).webp({ quality: 78 })
      .toFile(path.join(img, 'demo', `${k}-${f}.webp`))
    dims[`demo/${k}-${f}`] = [r.width, r.height]
  }
}

// Icon: favicon tile (rounded) and a transparent wordmark cropped from the official icon
const icon = path.join(repo, 'assets/icons/icon.png')
const tile = await sharp(icon).extract({ left: 104, top: 100, width: 1050, height: 1040 }).resize(512, 512).toBuffer()
const mask = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="115" fill="#fff"/></svg>')
const rounded = await sharp(tile).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
await sharp(rounded).toFile(path.join(out, 'favicon/icon-512.png'))
await sharp(rounded).resize(180).toFile(path.join(out, 'favicon/apple-touch-icon.png'))
await sharp(rounded).resize(32).toFile(path.join(out, 'favicon/favicon-32.png'))
// Open Graph card from the film's poster frame (made with ffmpeg, see README)
const poster = path.join(out, 'videos/poster.jpg')
if (existsSync(poster)) {
  await sharp(poster).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 85 })
    .toFile(path.join(img, 'og-image.jpg'))
}

// Wordmark: black on transparent (alpha from luminance)
const crop = await sharp(icon).extract({ left: 170, top: 470, width: 940, height: 280 }).greyscale().raw().toBuffer({ resolveWithObject: true })
const { data, info } = crop
const rgba = Buffer.alloc(info.width * info.height * 4)
for (let i = 0; i < data.length; i++) {
  const a = Math.max(0, Math.min(255, Math.round((255 - data[i]) * 1.15)))
  rgba[i * 4] = 0; rgba[i * 4 + 1] = 0; rgba[i * 4 + 2] = 0; rgba[i * 4 + 3] = a
}
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().resize({ height: 120 })
  .png().toFile(path.join(img, 'wordmark.png'))

// Privacy policy: the site publishes a copy of the app's own policy at privacy/
await mkdir(path.resolve('src/content'), { recursive: true })
await copyFile(path.join(repo, 'assets/legal/privacy.md'), path.resolve('src/content/privacy.md'))

// Fonts
for (const f of ['inter-latin.woff2', 'jetbrains-mono-latin.woff2']) {
  const src = path.join(repo, 'product-video/public/fonts', f)
  if (existsSync(src)) await copyFile(src, path.join(fontsDir, f))
}
await writeFile(path.resolve('src/data/images.json'), JSON.stringify(dims, null, 2) + '\n')
console.log('assets ready')
