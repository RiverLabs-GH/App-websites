# EverOn website: Stage 6, validation report

Status: **done, with the gaps listed at the end.** Nothing is committed.

## Automated gates (every run, all green on the final build)
- `npm run build`: type-check, client build, SSR build, prerender. JS 140 KB (budget 400 KB), 67 files, 2.2 MB.
- `npm run check`: `check-dist` (prerender, relative refs, anchors, ARIA refs, alt/size, SEO, JSON-LD, no download link, no price or Windows mention, no third-party hosts or network APIs) and `copy-audit` (557 strings, 23 patterns, product-repo drift check).
- Both workflow files parse as YAML (`everon-ci`: 1 job; `deploy-everon`: build, deploy, smoke).

## Checked in a browser (Chromium via Electron), served under `/App-websites/everon/`
| Check | Result |
|---|---|
| Home, `screens/` and an unknown URL (404 page) load under the subpath | pass, one h1 each, no horizontal overflow |
| Failed requests, console errors | none, apart from the deliberate 404 for the unknown URL |
| Requests outside the subpath or to other hosts | none on the real pages (the 404 page uses absolute production URLs on purpose, see below) |
| Images (20 on home, 47 on the catalogue, lazy ones forced to load) | 0 broken, all have alt text and width/height |
| Opened from `file://` (relative assets) | loads, no errors |
| Text contrast, measured numerically (WCAG 2.x AA, 261 text elements, light and dark) | **0 failures** after the fix below |
| JavaScript disabled | full content renders, nothing hidden; demo controls and tour tabs hidden because they would do nothing |
| Keyboard | first Tab reaches "Skip to content", then brand, nav, theme, CTA; every stop shows a 2 px outline |

## Fixed in this stage
1. **Tour inactive steps failed contrast** (opacity 0.38 gave 1.75 to 2.3:1). Steps are now full strength; the active step is marked by an accent bar that animates only transform and opacity. Reduced motion: no transition.
2. **Dead controls without JavaScript** ("Pause demo", the demo chip, tour tabs) are hidden when the `js` class is absent.
3. **Safari 16.0/16.1** (macOS 13 target): plain fallbacks added before the two `color-mix()` backgrounds; the tray mask now renders with the `-webkit-` form in server HTML. `backdrop-filter` was already prefixed.

## Not covered, and why
- **Firefox and Safari were not run.** Only Chromium is available to drive here. I audited the features used (no `:has`, container queries, `@property`, scroll-driven animation or view transitions; `color-mix` and `backdrop-filter` now have fallbacks). Open the deployed site in both once.
- **The deploy itself.** It needs a public repo and Settings > Pages > Source: GitHub Actions. `smoke-live.mjs` runs only after deploy.
- **Screen-reader pass (VoiceOver).** Roles, labels and focus handling are in place, but I did not listen to it. The site makes no VoiceOver claim.
- **Motion feel.** Verified by behaviour, not by eye at speed.
- `robots.txt` lists `Disallow: /App-websites/everon/screens/`, but crawlers read robots.txt only at the host root, so it has no effect there. The `noindex` meta on the catalogue page is what does the work.
- The 404 page loads its tray icon from the production URL, so it shows a broken icon until the site is deployed.
