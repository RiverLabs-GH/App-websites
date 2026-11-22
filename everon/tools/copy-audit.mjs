// Copy audit for the EverOn site (website-build-prompt.md, Section 2).
//
// Scans the site's text for claims EverOn's own docs forbid. It reads, by absolute path:
//   - src/data/content.ts (all visible copy), index.html (metadata and JSON-LD), every .vue template,
//   - and, when a build exists, the prerendered text of dist/index.html.
//
// The download and forbidden-claim patterns are COPIED from the product repo's tools/copy-audit.test.mjs and tools/forbidden-claims.test.mjs
// (those are Vitest suites that do not export their patterns). A drift check reads the two source files via EVERON_REPO and fails if a copied
// pattern is no longer in them. The never-say list is from website-build-prompt.md, Section 2.
//
// Usage: node tools/copy-audit.mjs        EVERON_REPO overrides /Users/vipinkp/PycharmProjects/EverOn
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repo = process.env.EVERON_REPO ?? '/Users/vipinkp/PycharmProjects/EverOn'
const abs = (...p) => path.resolve(root, ...p)

// ---- patterns copied from the product repo --------------------------------------------------------------------------------------------
const FROM_COPY_AUDIT = [
  ['all, any or every download', /\b(?:all|any|every|each) downloads?\b/i],
  ['detects downloads with no integration named', /\bdetects? (?:(?:all|any|every) )?downloads?\b/i],
  ['download detection as universal or automatic', /\b(?:universal(?:ly)?|automatic(?:ally)?|reliabl[ey]|always)\b[^.\n]{0,24}\bdownload (?:detect|monitor)/i],
  ['works with every app or browser', /\b(?:works? with|supports?|covers?) (?:every|all|any) (?:app|apps|browser|browsers|download manager)/i],
  ['every app or browser is covered', /\bevery (?:app|browser)\b|\ball (?:apps|browsers)\b/i],
  ['a download guarantee', /\bguarantee[sd]?\b[^.\n]{0,40}\bdownloads?\b/i],
]
const FROM_FORBIDDEN = [
  ['the Mac never sleeps', /never (?:go(?:es)? to )?sleep|won['’]t (?:ever )?sleep|can['’]t (?:ever )?sleep/i],
  ['a lid-close guarantee', /(?:guarantee|ensure|prevent)s?[^.\n]{0,40}\blid\b|lid[- ]close[^.\n]{0,30}(?:guarantee|protect)/i],
  ['every download is detected', /all downloads|every download|any download/i],
  ['an unconditional awake claim', /your mac is (?:now )?awake\b|keeps? your mac awake no matter/i],
]
// ---- the never-say list from the build prompt, and the tone rules ----------------------------------------------------------------------
const NEVER = [
  ['signed or notarised', /\b(?:code[- ]?signed|signed|notari[sz]ed|notari[sz]ation|gatekeeper)\b/i],
  ['works with every AI tool', /\b(?:every|all|any) (?:AI|coding) (?:tool|agent|assistant)s?\b|\bworks? with (?:Claude|Cursor|Codex|ChatGPT|Copilot|Gemini)\b/i],
  ['detects when AI is thinking', /\bdetects? (?:when )?(?:your |the )?(?:AI|agent|model)\b[^.\n]{0,30}\b(?:thinking|working|busy|running)\b/i],
  ['the Mac will never sleep unexpectedly', /\bnever (?:sleeps?|goes to sleep)\b|\bsleep unexpectedly\b|\bwill not sleep\b|\bstays? awake no matter\b/i],
  ['a task will finish', /\bpromises? (?:that )?(?:a |your |the )?(?:task|run|build)s? will\b|\bwill (?:always )?finish\b/i],
  ['free forever or a price', /\bfree forever\b|\balways free\b|\b(?:completely|totally|100%) free\b|\bfree download\b|\bfor free\b|[$€£]\s?\d|\bpric(?:e|ed|ing)\b|\bper (?:month|year)\b|\bsubscription\b|\bone-time purchase\b|\bcheap\b/i],
  ['an iPhone app or hosted service', /\biPhone\b|\biOS\b|\bhosted (?:service|relay)\b|\bcompanion app\b|\bcloud sync\b/i],
  ['VoiceOver or accessibility certification', /VoiceOver|screen[- ]reader[- ]accessible|fully accessible|WCAG|certified accessible/i],
  ['another platform', /\bWindows\b|\bLinux\b|\bAndroid\b/i],
  ['a testimonial, rating or statistic', /★|\b\d(?:\.\d)?\s*(?:\/\s?5|stars?)\b|\b\d[\d,]*\+?\s*(?:users|developers|customers|teams|downloads|installs)\b|\b(?:trusted|loved|chosen) by\b|\btestimonial/i],
  ['a named competitor', /\b(?:Amphetamine|KeepingYouAwake|Lungo|Theine|Owly|Caffeine|NoSleep|Jiggler)\b/i],
  ['hype, urgency or fear', /\b(?:revolutionary|game[- ]chang\w*|unbeatable|limited[- ]time|act now|don['’]t miss|hurry|before it['’]s too late)\b|\bMac (?:dies|will die)\b|\bbattery dies\b/i],
  ['the 24-hour maximum (OQ-003 is open)', /\b24[- ]?(?:hours?|h)\b/i],
]
// Rules about context, not words.
const CONTEXT = [
  ['an agent mention must say "not yet verified"', (s) => /\bagents?\b/i.test(s) && !/not yet verified/i.test(s)],
  ['a CPU figure must give its context (on one Mac, or the Mac we measured)', (s) => /\d%[^.\n]{0,12}CPU|CPU[^.\n]{0,12}\d%/i.test(s) && !/(?:one Mac|Mac we measured)/i.test(s)],
]

// ---- self-test: every pattern must catch a bad sentence, and pass a good one ---------------------------------------------------------
const FIXTURES = {
  'signed or notarised': ['EverOn is signed and notarised.', 'A notarised Mac app'],
  'works with every AI tool': ['Works with every AI tool', 'Works with Claude Code and Cursor'],
  'detects when AI is thinking': ['It detects when your AI is thinking.'],
  'the Mac will never sleep unexpectedly': ['Your Mac will never sleep unexpectedly.', 'It never sleeps'],
  'a task will finish': ['EverOn promises your task will finish.'],
  'free forever or a price': ['Free forever', 'Only $9 a month', 'Pricing starts soon', 'Get the free download'],
  'an iPhone app or hosted service': ['Alerts on your iPhone', 'A hosted service relays it'],
  'VoiceOver or accessibility certification': ['Works with VoiceOver'],
  'another platform': ['Also on Windows'],
  'a testimonial, rating or statistic': ['4.8/5 stars', 'Trusted by 10,000 developers'],
  'a named competitor': ['Better than Amphetamine'],
  'hype, urgency or fear': ['Act now', 'Your battery dies overnight'],
  'the 24-hour maximum (OQ-003 is open)': ['Stops after 24 hours'],
}
const GOOD = ['Keep your Mac awake for long AI coding runs, with limits you set and a reason you can read.', 'A maximum length on every session.', 'About 0.6 to 0.7% CPU on the Mac we measured.', 'Built for macOS 13 or later', 'The Free edition keeps 30 days.', 'Long runs shouldn’t die when your Mac falls asleep.']
const ALL = [...FROM_COPY_AUDIT.map(([n, re]) => ({ n, re, src: 'copy-audit.test.mjs' })), ...FROM_FORBIDDEN.map(([n, re]) => ({ n, re, src: 'forbidden-claims.test.mjs' })), ...NEVER.map(([n, re]) => ({ n, re, src: 'prompt' }))]
const problems = []
for (const [name, bad] of Object.entries(FIXTURES)) {
  const p = NEVER.find(([n]) => n === name)
  for (const b of bad) if (!p || !p[1].test(b)) problems.push(`self-test: "${name}" does not catch: ${b}`)
}
for (const g of GOOD) for (const { n, re } of ALL) if (re.test(g)) problems.push(`self-test: "${n}" wrongly flags the good sentence: ${g}`)
for (const bad of ['EverOn detects downloads.', 'Works with every app', 'It guarantees your downloads finish', 'Every browser is covered']) if (!FROM_COPY_AUDIT.some(([, re]) => re.test(bad))) problems.push(`self-test: product download patterns missed: ${bad}`)

// ---- drift check against the product repo ---------------------------------------------------------------------------------------------
let drift = 'skipped (no product repo)'
const srcA = path.join(repo, 'tools/copy-audit.test.mjs'); const srcB = path.join(repo, 'tools/forbidden-claims.test.mjs')
if (existsSync(srcA) && existsSync(srcB)) {
  const ta = readFileSync(srcA, 'utf8'); const tb = readFileSync(srcB, 'utf8')
  for (const [n, re] of FROM_COPY_AUDIT) if (!ta.includes(re.source)) problems.push(`drift: "${n}" is no longer in ${srcA}`)
  for (const [n, re] of FROM_FORBIDDEN) if (!tb.includes(re.source)) problems.push(`drift: "${n}" is no longer in ${srcB}`)
  drift = 'checked'
}

// ---- gather the text to scan ---------------------------------------------------------------------------------------------------------
const walk = (d, ext) => readdirSync(d).flatMap((n) => { const p = path.join(d, n); return statSync(p).isDirectory() ? walk(p, ext) : ext.test(p) ? [p] : [] })
const strings = (code) => [...code.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)].map((m) => m[1] ?? m[2] ?? m[3]).filter((s) => /[A-Za-z]{3}/.test(s) && /\s/.test(s))
const targets = []
const contentTs = abs('src/data/content.ts')
targets.push({ file: contentTs, texts: strings(readFileSync(contentTs, 'utf8')) })
const html = readFileSync(abs('index.html'), 'utf8')
targets.push({ file: abs('index.html'), texts: [...html.matchAll(/(?:content|alt)="([^"]+)"/g)].map((m) => m[1]).concat([html.match(/<title>([^<]+)/)?.[1] ?? ''], strings((html.match(/ld\+json">([\s\S]*?)<\/script>/)?.[1]) ?? '')) })
for (const f of walk(abs('src'), /\.vue$/)) {
  const src = readFileSync(f, 'utf8')
  const tpl = src.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
  targets.push({ file: f, texts: [...tpl.matchAll(/>([^<>{}]*[A-Za-z]{3}[^<>{}]*)</g)].map((m) => m[1].trim()).concat([...tpl.matchAll(/(?:aria-label|alt|title|placeholder)="([^"]+)"/g)].map((m) => m[1])).filter(Boolean) })
}
const built = abs('dist/index.html')
if (existsSync(built)) { const h = readFileSync(built, 'utf8'); targets.push({ file: built, texts: [...h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').matchAll(/>([^<]*[A-Za-z]{3}[^<]*)</g)].map((m) => m[1].trim()).concat([...h.matchAll(/(?:aria-label|alt)="([^"]+)"/g)].map((m) => m[1])) }) }

let scanned = 0
for (const { file, texts } of targets) for (const t of texts) {
  scanned++
  for (const { n, re } of ALL) if (re.test(t)) problems.push(`${path.relative(root, file)}: ${n}: “${t.slice(0, 110)}”`)
  if (file === contentTs || file === built) for (const [n, test] of CONTEXT) if (test(t)) problems.push(`${path.relative(root, file)}: ${n}: “${t.slice(0, 110)}”`)
}

if (problems.length) { console.error(`\nCopy audit: ${problems.length} problem${problems.length > 1 ? 's' : ''}\n`); for (const p of [...new Set(problems)]) console.error(`  - ${p}`); process.exit(1) }
console.log(`Copy audit OK: ${scanned} strings in ${targets.length} files (content: ${contentTs}); ${ALL.length} patterns; product-repo drift check ${drift}.`)
