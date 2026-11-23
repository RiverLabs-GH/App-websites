# EverOn website

A static marketing site for **EverOn**, a macOS menu-bar app that keeps the Mac awake for long AI coding runs, with limits the person sets and a reason they can read.

Vue 3, TypeScript and Vite. The built page is prerendered, so every section is real HTML before any JavaScript runs. There is no backend, no analytics and no third-party request.

Published at `https://riverlabs-gh.github.io/App-websites/everon/` (once deployed). Assets are relative (`base: './'`), so it also works from any subpath and from disk.

## Run it

```bash
cd /Users/vipinkp/PycharmProjects/App-websites/everon
npm install
npm run dev          # http://localhost:5173/  (the screens catalogue is at /screens/)
npm run build        # type-check, bundle, prerender, 404, sitemap, robots
npm run check        # build-output checks, then the copy audit
npm run preview      # serve dist/
```

## What is on the page

Overview (hero with an interactive menu-bar popover, problem, two core experiences), a sticky four-step product tour, trust and safety, features by workflow, "Why EverOn" (a basic toggle compared with EverOn), and a final call to action. The download button reads "Coming soon for Mac" and is not a link: no public distribution URL exists.

Navigation: Overview, Tour, Features, Get EverOn (the order follows the page, so the scroll-spy pill never jumps back).

## Screens: real captures and generated screens

- **Real captures** (`public/images/app/*.webp`, 47 files) are screenshots of the running EverOn app at 2x, with **sample data** (an injected battery reading, sample rule names). Every one carries the caption "Captured from the EverOn app, with sample data."
- **Generated screens** are Vue components drawn from the app's own design tokens and copy, for states the captures do not cover or must not show: the interactive popover (`PopoverView`, `PopoverScreen`), the rule evaluator (`RuleDemo`) and the timeline (`TimelineDemo`). Every one carries "Interface shown from the EverOn design spec." and is labelled an interactive demo. The demos are simulated in local state and never touch the Mac.
- Two captures are **withheld** (History and the rule builder) because they show a Pro feature description and an unverified agent button. They stay out of the site and are flagged in `captures/manifest.json`.
- `/screens/` is a review page (noindex, not in the sitemap) listing every generated state and every capture.

## Assets and tools

| Command | What it does |
|---|---|
| `npm run assets` | Reads the product repo (`EVERON_REPO`, default `/Users/vipinkp/PycharmProjects/EverOn`, read-only): scopes the app's design tokens into `src/styles/app-tokens.css`, copies the five tray marks to `public/brand/`, makes the favicon, touch icon and OG image from the tray ring, and converts `captures/*.png` to WebP in `public/images/app/` (+ `src/data/images.json`). Outputs are committed, so CI does not need the product repo. |
| `npm run capture` | Rebuild the product app first (`npx electron-vite build` in the product repo), then this launches it with the product repo's own Playwright launcher and re-takes the captures into `captures/` (PNG, gitignored). |
| `npm run check` | `tools/check-dist.mjs` (prerender, links, assets, anchors, alt text, SEO, JSON-LD, 404, no third-party hosts, no network API, no download link, no price, size and JS budget) and `tools/copy-audit.mjs`. |
| `npm run smoke -- <url>` | Fetches a live copy of the site and checks that its pages and assets resolve. |

## Copy rules

Wording follows the product repo's `docs/product/pitch-and-positioning.md` (claims table) and `docs/product/copy-deck.md`. All copy is in `src/data/content.ts`. `tools/copy-audit.mjs` scans `content.ts`, `index.html`, every `.vue` template and the prerendered page for the claims EverOn's own docs forbid, plus the build prompt's never-say list. Its download and forbidden-claim patterns are copied from the product repo's two Vitest suites, and a drift check (run when `EVERON_REPO` exists) fails if they change there.

Open questions the copy depends on: OQ-003 (maximum session length, so no number is stated), OQ-012 (Pro and price, so neither is mentioned) and OQ-016 (privacy wording, so the line is "works offline, nothing is sent unless you turn on an alert").

## Layout

```
everon/
├── index.html  screens/index.html      page shells (SEO tags, JSON-LD)
├── captures/                           capture manifest (PNGs are gitignored)
├── docs/                               stage reports (design architecture, capture report)
├── public/  brand/ favicon/ images/    static files
├── src/
│   ├── data/                           content.ts (all copy), images.json
│   ├── styles/                         tokens, scoped app tokens, motion tokens, global
│   ├── components/sections/            one component per page section
│   ├── components/screens/             generated screens and demos
│   ├── components/ui/                  capture image + lightbox, tray icon, reading progress
│   ├── composables/                    theme, scroll-spy, in-view, reduced motion
│   └── pages/ScreensCatalogue.vue
└── tools/                              prerender, check-dist, copy-audit, prepare-assets, capture-screens, smoke-live
```

## Accessibility and motion

Semantic landmarks, a skip link, visible focus, 44 px targets on the site, native controls where possible, a focus-trapped mobile menu, keyboard-operable demos and tour tabs. All motion uses the tokens in `src/styles/motion.css` and animates only `transform` and `opacity`. Under `prefers-reduced-motion`, there is no autoplay and no reveal or scroll movement, and the demos start in their final state and stay usable by click. Demo autoplay has a visible Pause control, and any click takes over.

## Company and sibling product

The parent company (`company` in `src/data/content.ts`) matches the mark.O site: name, link (`https://river-labs.io/`), contact and logo mark (`public/brand/riverlabs-logo.svg`, a copy of the company's favicon). The footer links to it and to mark.O, whose address follows `VITE_SITE_URL`. `npm run check` fails if the structured data's publisher and the footer link disagree.

## Deploy

`.github/workflows/everon-ci.yml` checks pull requests. `deploy-everon.yml` publishes on a push to `main`.

**One Pages site, separate deploy files.** `deploy-everon.yml` builds only everon and replaces the `everon/` folder on the `gh-pages` branch; `deploy-mark-o.yml` does the same for `mark-o/` and neither touches the other. Setup once: the repository must be public, run the deploy once so `gh-pages` exists, then Settings > Pages > Source: Deploy from a branch > `gh-pages` (root). For a custom domain set the repository variable `SITE_BASE_URL`.

---

*Copyright © 2026 RiverLabs.io. All rights reserved.*
