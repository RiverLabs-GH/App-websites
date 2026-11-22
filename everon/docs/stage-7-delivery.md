# EverOn website: Stage 7, delivery

Nothing is committed. `git status` shows `README.md` (modified), `.github/workflows/` (two new, one modified), and `everon/` (new).

## What was delivered
| Item | Where |
|---|---|
| Source (Vue 3 + TS + Vite, prerendered, one runtime dependency: `vue`) | `everon/` |
| Build and checks | `npm run build`, `npm run check` (dist check + copy audit), `npm run smoke -- <url>` |
| CI for pull requests | `.github/workflows/everon-ci.yml` |
| Deploy, separate per module | `.github/workflows/deploy-everon.yml` and `deploy-mark-o.yml` (see "Deploy") |
| Docs | `everon/README.md`, stage reports in `everon/docs/` |
| Asset and capture tools | `tools/capture-screens.mjs`, `tools/prepare-assets.mjs` (both take `EVERON_REPO`) |
| Build prompt, with the new Section 7 (generated screens, demos, motion, navigation, components, guardrails) | `website-build-prompt.md` |

## Section summary (one page, plus a catalogue and a 404)
1. **Navbar:** sliding scroll-spy pill (Overview, Tour, Features), theme toggle, "Get EverOn", focus-trapped mobile sheet.
2. **Hero:** menu-bar frame with a live, simulated popover (autoplay with a Pause control; click takes over; tray icon follows the state).
3. **Problem:** why a basic toggle falls short.
4. **Experiences:** instant control (real capture) and automation (interactive rule demo).
5. **Tour:** four steps with a sticky stage, keyboard tabs, deep links (`#tour-automate`), real captures, one example timeline.
6. **Trust:** limits, battery safeguard, honest status wording, the measured idle figure with its context.
7. **Features:** 12 items with status tags, a workflow filter, a six-theme strip of real captures.
8. **Why EverOn:** comparison table (stacked cards on mobile) and the five-state tray legend.
9. **Get EverOn / footer:** "Coming soon for Mac" (not a link), "© 2026 RiverLabs.io", "From RiverLabs.io".
10. `/screens/` catalogue (noindex) and a branded `404.html`.

## Generated screens to replace with captures
Every generated screen carries a caption ("Interface shown from the EverOn design spec") and accepts an optional `capture` prop (added in this stage), so a real 2x capture swaps in with no layout change.

| On the page now | Component | Replace with | Why it is generated |
|---|---|---|---|
| Hero popover and menu bar (G1, G2) | `PopoverScreen`, `MenuBar` | Keep as the interactive demo; pass `capture` only for a static version | A capture cannot be interactive |
| Rule evaluator in Experiences (G4) | `RuleDemo` | `rule-evaluator-*` capture exists (static) | Interactive on purpose |
| Tour step 4 timeline (G7) | `TimelineDemo` | A new History capture once the app copy is fixed | The real History screen shows Pro copy and "last 366 days" |
| `/screens/` catalogue states: popover unknown, helper unavailable, ended-session detail, builder, History, empty and error states | `PopoverView` and friends | Captures once those states can be produced in the app | Not captured (builder shows an unverified agent button) |

Everything else on the site is a real capture with sample data, captioned as such.

## Deploy
Each module has its own deploy file and publishes only its own folder on the `gh-pages` branch, so neither can remove the other's site (Actions-based Pages deploys cannot do this: each upload replaces the whole site).
1. Make the repository public.
2. Merge, and let each deploy run once (the first run creates `gh-pages`).
3. Settings > Pages > Source: **Deploy from a branch** > `gh-pages` > `/ (root)`.
4. Custom domain: set the repository variable `SITE_BASE_URL`.
**Changed outside the everon module:** `deploy-mark-o.yml` (same pattern, same checks, same smoke test; review it with `git diff .github/workflows/deploy-mark-o.yml`) and the deploy paragraph in `mark-o/README.md`. The root 404 stays mark-o's page.

## Verification summary
Build, dist check and copy audit pass. Browser checks (Chromium): subpath serving, no console errors, 0 broken images, text contrast 0 failures in light and dark, no horizontal overflow from 390 to 1440 px, keyboard operation, no-JS render, reduced motion, layout shift about 0.002 to 0.004. Details in the stage 5 and 6 reports.

## What you still owe
- **App icon** (the tray ring is the brand mark for now).
- **Public download URL**, then the button becomes a link and the JSON-LD gets a download URL.
- **Domain** (canonical, sitemap and OG URLs follow `VITE_SITE_URL` or `SITE_BASE_URL`).
- **Contact and privacy pages** (none invented; the footer links to nothing legal).
- **Pricing decision** (no price, Free or Pro mention appears anywhere).
- **Open questions:** OQ-003 (maximum session length: the site gives no number), OQ-012, OQ-016 (offline wording: "nothing sent unless you turn on an alert" is a default I chose).
- **Agent rule verification** (GAP-047): until verified, agent mentions must say "optional, not yet verified".

## Findings about the app (for the product owner)
- History copy says "last 366 days" although Free is 30 days (OQ-014), and the Insights card shows Pro copy.
- The Safety screen shows "Maximum session length 24 h", a number the site avoids.
- The rule builder offers an agent shortcut with no "unverified" label.
- The popover says "Battery status is unavailable" on a Mac with no reading.

## Not done
Firefox and Safari were not run; no VoiceOver pass; the live deploy and `smoke` run have not happened.
