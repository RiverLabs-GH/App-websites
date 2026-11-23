# EverOn website: Stage 2, UX and design architecture

Status: **for approval.** Nothing is built. Stage 3 (asset capture) and Stage 4 (implementation) start only after this is approved.

Sources: the Stage 1 discovery report, `website-build-prompt.md` (Sections 1 to 8), the EverOn repo docs (`pitch-and-positioning.md` is binding for all copy), `tokens.css`, `ui-ux-spec.md` and the structure of `mark-o/` (reference only).

## 0. Decisions applied from Stage 1 (the defaults)

| # | Decision | Applied as |
|---|---|---|
| 1 | No public download URL | The button reads "Coming soon for Mac". It is a `<button disabled>`-style element, not a link. |
| 2 | No domain, contact or privacy page | The footer holds only "© 2026 RiverLabs.io" and the product line. No legal or contact links. |
| 3 | Parent company | One plain text line, "From RiverLabs.io", in the footer. No logo or link. |
| 4 | No app icon | The mark is the tray ring (from `assets/icons/`), in the favicon, navbar and OG image. No invented logo. |
| 5 | macOS 13 | "Built for macOS 13 or later". It is a target, never "tested on". |
| 6 | Price, Pro, agent | No price and no Pro mention. The agent rule appears once, as "optional, not yet verified". |

---

## 1. Audience and messaging

### 1.1 Who the page speaks to
- **Primary:** people running long AI coding tasks (vibe coders, developers with agent loops, overnight runs).
- **Secondary, served by the workflow filter in Features:** presenters, remote workers, battery-conscious users, everyday users.

### 1.2 The 5-second and 15-second tests
- **5 seconds (hero):** a menu-bar app that keeps your Mac awake for long runs, with limits and a readable reason.
- **15 seconds (hero plus problem plus two experiences):** why it beats a toggle. It explains itself, it has limits, and it has rules.

### 1.3 Message hierarchy

| Level | Message | Claim status |
|---|---|---|
| Promise | Keep your Mac awake for long AI coding runs, with limits you set and a reason you can read. | Say now (today's line) |
| Pillar A, Instant control | Start, pause, extend or stop from the menu bar in one or two clicks. | Say now |
| Pillar B, Automation | Rules by app today, plus schedules and profiles, and a reason line for every hold. | Say now (app rules, schedules, profiles) |
| Support 1 | Truthful status: "requested" and "active" are different things. | Say now |
| Support 2 | Safety by default: a maximum length, battery stops, a global pause, never paid. | Say now. No number for the maximum (OQ-003). |
| Support 3 | Private and offline by default. Nothing is sent unless you turn on an alert you set up. | Say now |
| Stated limit | EverOn prevents supported idle sleep. It can't override a closed lid, heat or a critical battery. | Required |
| Optional | An agent rule that follows a chosen agent is built, optional and not yet verified. | One mention |

### 1.4 Key copy per section (final copy is written in Stage 4 into `content.ts` and audited)

| Section | Headline | Core line |
|---|---|---|
| Hero | Keep your Mac awake for long AI coding runs, with limits you set and a reason you can read. | Start a timed session in one click, or set a rule that keeps the Mac awake while your coding app is open. |
| Problem | Long runs shouldn't die when your Mac falls asleep. | A long task looks idle to a Mac. The usual fix is a switch you forget, and the Mac stays awake all night. |
| Two experiences | Instant when you want it. Automatic when you don't. | Instant control from the popover. Rules that remember for you. |
| Showcase / Tour | See what it is holding, and why. | Four steps: start, understand, automate, review. |
| Trust and safety | Staying awake should be a decision you can see, bound and undo. | Limits, truthful status, privacy, and what EverOn can't do. |
| Features | Built around how you work. | A filterable grid of 12 capabilities, each with a plain status tag. |
| Why EverOn | More than an on and off switch. | A comparison with "a basic toggle" only, using verified differences. |
| Final CTA | Coming soon for Mac. | Built for macOS 13 or later. |

Tone: calm, plain and precise. No urgency, no fear, no hype, no competitor names, no testimonials, ratings or statistics. The only figure is "about 0.6 to 0.7% idle CPU on one Mac".

---

## 2. Sitemap and page structure

### 2.1 Sitemap

| URL | Purpose | Indexed |
|---|---|---|
| `/` | The single-page site (all sections below) | Yes (sitemap, canonical, OG, JSON-LD) |
| `/404.html` | Branded, animated 404 | No |
| `/screens/` | Review catalogue of every generated screen (light and dark, every state) | No (`noindex`, not in the nav or sitemap) |
| `/robots.txt`, `/sitemap.xml` | SEO files | n/a |

Under the Pages subpath this is `/App-websites/everon/`. Vite `base: './'` and relative asset paths throughout.

### 2.2 Section order and anchors

| # | Section | Anchor | Nav group |
|---|---|---|---|
| 1 | Hero | `#top` | Overview |
| 2 | Problem and solution | `#problem` | Overview |
| 3 | Two core experiences | `#experiences` | Overview |
| 4 | Product tour (sticky) | `#tour` | Tour |
| 5 | Trust and safety | `#trust` | Features |
| 6 | Feature highlights by workflow | `#features` | Features |
| 7 | Why EverOn | `#why` | Features |
| 8 | Final CTA | `#get` | Get EverOn |
| 9 | Footer | `#footer` | none |

**Deviation for approval:** the prompt lists the navbar as Overview, Features, Tour, Get EverOn. The page order puts the tour before the features, so the sliding scroll-spy pill would jump backwards. I propose the nav order **Overview, Tour, Features, Get EverOn**. Trust, Features and Why share the "Features" item.

### 2.3 Page wireframe (desktop)

```
┌ navbar ───────────────────────────────────────────────────────────────┐
│ ◯ EverOn   Overview  Tour  Features          [ Get EverOn ]  ◐ theme │
└───────────────────────────────────────────────────────────────────────┘
HERO        headline + sub + "Coming soon for Mac" + "See how it works"
            ┌ generated macOS menu bar ──────────────────────┐
            │ … status icons   ◯ ◀ tray ring (live state)    │
            │            ┌ Popover demo (S01, interactive) ┐ │
            └────────────┴─────────────────────────────────┴─┘
            Built for macOS 13 or later · Menu-bar app
PROBLEM     two plain cards: "Cut off by sleep" / "A switch you forgot"
            + one-line solution
EXPERIENCES two columns, equal weight
            [ Instant control: mini S01 ]   [ Automation: mini S09 ]
TOUR        sticky screen (left/centre) + 4 steps of copy (right)
            1 Start (S01)  2 Understand (S09)  3 Automate (S07)  4 Review (S10)
            progress rail + step tabs
TRUST       stated limit callout, truthful-status states strip (S01 states),
            safety settings screen (S14), privacy bullets
FEATURES    workflow filter chips → 12 feature cards
            themes strip (S12): 5 themes
WHY         "basic toggle vs EverOn" six-row comparison + tray-state legend
GET         "Coming soon for Mac" · Built for macOS 13 or later
FOOTER      © 2026 RiverLabs.io · From RiverLabs.io · EverOn
```

Mobile (390 px): the hero popover sits under the text. The tour becomes a vertical stack with one screen per step, no sticky pinning. The nav collapses to the animated sheet.

---

## 3. Design tokens (site)

The site reuses EverOn's own token values, so generated screens and site chrome share one source. Everything is a CSS variable in `src/styles/tokens.css`. The site follows the system theme by default, with a manual toggle remembered in `localStorage`.

### 3.1 Site chrome (light / dark), taken from `tokens.css`

| Token | Light | Dark |
|---|---|---|
| `--canvas` | `#f5f5f8` | `#1b1c21` |
| `--surface` | `#ffffff` | `#25262c` |
| `--surface-2` | `#fafafc` | `#2a2c33` |
| `--elevated` | `#ffffff` | `#2d2f36` |
| `--line` / `--line-strong` | `rgba(24,26,36,.08)` / `.15` | `rgba(255,255,255,.08)` / `.15` |
| `--t1` / `--t2` / `--t3` | `#1b1c21` / `#5c5e68` / `#6a6c76` | `#f3f3f6` / `#b1b3bd` / `#9496a0` |
| `--accent` | `#2457c5` (brand) | `#3c6ad8` |
| `--accent-text` | `#2457c5` | `#93b0f6` |
| `--accent-soft` | `rgba(36,87,197,.1)` | `rgba(120,156,245,.16)` |
| status `--ok` / `--warn` / `--err` / `--idle` | `#15724a` / `#965000` / `#b3261e` / `#5e6069` | `#55c78e` / `#f2b65d` / `#ff8c82` / `#a8aab4` |

Accent `#2457c5` on white is about 6.5:1, and Stage 6 verifies all pairs. Gradients are used once, in the hero: a very soft accent radial behind the menu bar. There is no glassmorphism.

### 3.2 Scoped app tokens for generated screens
Each generated screen carries `data-theme` on its own root (`light`, `dark`, `midnight`, `arctic`). The full EverOn token sets are copied into `src/styles/app-tokens.css`, scoped to `.ev-app[data-theme="…"]`. A screen can therefore show dark inside a light page, and the theme strip can show four themes at once. The scoped sets never leak into site chrome.

### 3.3 Type, space, shape
- **Fonts:** the macOS system stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, …`). No webfont, so there are no third-party requests and the page feels native on a Mac. Non-Apple fallbacks are system fonts.
- **Site scale:** 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64 px, with fluid `clamp()` on display sizes. Weights are 400, 500 and 600. Tabular figures are used for times and counts.
- **App screens use the app's own scale:** 11 / 12 / 13 / 15 / 20 / 28 / 40 px, so they match the product.
- **Space:** a 4 px grid (`--s1`…`--s8` = 4…40, plus `--s9` 56 and `--s10` 80 for section rhythm).
- **Shape:** control 7, card 10, window 12, popover 14, pill 999, as in the app.
- **Layout:** content width 1120 px, text measure 62 ch, section padding 80 to 120 px (48 on mobile), 16 px gutters minimum.
- **Targets:** 44 px for site controls (the app screens keep their 28 px).

---

## 4. Screen inventory (real captures vs generated)

**Rule (Section 7.1):** generated screens come only from the spec. Each is a Vue component in `src/components/screens/`, built from the scoped tokens, the copy deck's strings and the design mock `EverOn_Phase1_UI_Redesign.html`. Each takes an optional `capture` prop. In Stage 3, a real 2x capture replaces a generated screen with no layout change.

| ID | Screen | Spec | Needed by section | States to build | Source now | Priority |
|---|---|---|---|---|---|---|
| G1 | Menu bar frame and `TrayIcon` | tray icons | Hero, Why | active, inactive, paused, attention, unknown | Real tray PNGs, plus a generic CSS menu bar (no Apple logo) | Must |
| G2 | Popover (Quick control) | S01 | Hero, Experiences, Tour 1, Trust | inactive, active, paused, unknown, helper unavailable, battery warning, started by a rule | Generated, then capture | Must |
| G3 | Active session detail and reason | S04 | Tour 2 | active with 2 reasons, ended with a stop reason | Generated, then capture | Must |
| G4 | Trigger detail and live evaluator | S09 | Experiences, Tour 2 | active, inactive, unavailable | Generated, then capture | Must |
| G5 | Trigger builder (conditions) | S07 | Tour 3, Features | valid, one condition not met, permission explanation inline | Generated, then capture | Must |
| G6 | Trigger builder (action and schedule) | S08 | Tour 3 | valid summary | Generated, then capture | Should |
| G7 | History and timeline | S10 | Tour 4 | full, filtered, stop reasons | Generated, then capture | Must |
| G8 | Overview dashboard | S02 | Showcase band, Features | active, inactive | Generated, then capture | Should |
| G9 | Settings: Safety and battery | S14 | Trust | default, "critical below warning" blocked | Generated, then capture | Must |
| G10 | Settings: Appearance (themes) | S12 | Features themes strip | theme cards for light, dark, Midnight, Arctic, OLED, Aurora | Generated from tokens | Should |
| G11 | Quick switcher | S19 | Features | results, no results | Generated, then capture | Could |
| G12 | Empty, error states | S20 | Trust ("status unknown") | helper unavailable, status unknown, lid-closed note | Generated, then capture | Should |

Not generated, by decision:
- S13a Agents, because it is unverified. A single text line says "optional, not yet verified".
- S15 Sound and remote alerts, S18 Onboarding (the spec says ten steps, the copy deck lists nine plus one) and S16 Permissions.
- The pairing QR (waiting on a phone check).

Placement:
- Generated screens live in `src/components/screens/` and are data-driven from `src/data/screens.ts`. Their strings are copied from the copy deck and checked by the audit.
- Real captures go to `public/images/` as `screen-<id>-<theme>@2x.webp`, listed in `src/data/images.json`.
- Brand marks (copied from `EVERON_REPO/assets/icons`) go to `public/brand/`. The favicon and OG image are derived from them by `tools/prepare-assets.mjs`.

Honesty: every generated screen has the caption "Interface shown from the EverOn design spec" and a descriptive `aria-label`. None is described as a screenshot.

---

## 5. Interactive demos (all simulated, local only)

| Demo | Where | What it does | Truthfulness rules |
|---|---|---|---|
| Popover | Hero, Tour 1 | Start (15m, 1h, until a time). System, display or both. Pause, extend 15 min, stop. A live countdown. The tray ring changes state in the menu bar above. | A "Starting…" pending state before "Active". Copy is taken from the copy deck. Labelled "Interactive demo". |
| Rules | Tour 2, 3 | Toggle conditions (display, AC, app running, schedule). The reason line resolves: "Active because…" / "Not active. Still needed: …". A "limits win" outcome shows when the battery toggle is set low. | Never shows "your Mac is awake" without confirmation. The lid-closed note is one of the outcomes. |
| Timeline | Tour 4 | Scrub a day. Spans show what held the Mac and why it stopped. | Sample data is labelled "Example data". |

Autoplay: each demo starts a short scripted loop when scrolled into view. A visible Pause/Play control is always present, and any user input takes over. Under `prefers-reduced-motion`, there is no autoplay and each demo shows its final state.

---

## 6. Motion system

### 6.1 Tokens (`src/styles/motion.css`)

```css
:root {
  --dur-instant: 90ms;  --dur-fast: 160ms;  --dur-base: 280ms;
  --dur-slow: 480ms;    --dur-scene: 720ms;
  --ease-out: cubic-bezier(.2,.7,.2,1);          /* EverOn's own --ease */
  --ease-in-out: cubic-bezier(.65,0,.35,1);
  --ease-spring: cubic-bezier(.34,1.3,.64,1);    /* short, small overshoot only */
  --dist-sm: 8px; --dist-md: 16px; --dist-lg: 32px;
  --stagger: 60ms;
}
@media (prefers-reduced-motion: reduce) {
  :root { --dur-fast: 1ms; --dur-base: 1ms; --dur-slow: 1ms; --dur-scene: 1ms; --stagger: 0ms; }
}
```

### 6.2 Choreography

| Moment | Motion | Tech |
|---|---|---|
| Hero load | The menu bar slides in (`--dur-slow`). The tray ring appears inactive. The popover rises and opens after 400 ms. A short demo sequence runs: start 1h, ring fills, reason line appears. | CSS plus WAAPI; the first paint is the final state (content-first) |
| Section reveal | Fade and rise `--dist-md`, staggered by `--stagger`, once only | `IntersectionObserver`, a `v-reveal` directive |
| Tour | The sticky screen cross-fades or morphs between G2, G3/G4, G5, G7 as the copy advances. A progress rail fills. | CSS scroll-driven animations, with an `IntersectionObserver` fallback |
| Data motion | Countdown ring, timeline lines drawing in, a condition-to-reason cascade | SVG `stroke-dashoffset`, transform only |
| Theme switch | Smooth colour transition across the page | View Transitions API, with a fallback to a 200 ms colour transition |
| Micro-interactions | Hover lift, press scale .98, focus ring, switch slide | CSS, `--ease-spring` kept under 200 ms |
| Tray legend | The five tray states cycle, then pause on hover or focus | CSS |

Rules: only `transform` and `opacity` are animated. No flashing above 3 times a second. Any motion over 5 seconds is pausable. Offscreen animations pause. `will-change` is set on at most a few elements.

### 6.3 Reduced motion
No autoplay, no parallax and no scroll-driven movement. Screens show their final state, and the tour steps swap with a simple fade or instantly. Demos stay fully usable by click. All text is present without JavaScript.

---

## 7. Navigation and navigation animation

- **Navbar:** sticky, 64 px, and it condenses to 52 px on scroll (shadow and a light blur). The active-section pill slides between items (scroll-spy) and also follows clicks.
- **Anchors:** smooth scroll with `scroll-margin-top` for the sticky header. Section hand-offs use the View Transitions API where supported.
- **Get EverOn** scrolls to `#get`. It is emphasised with a subtle ring and no bounce.
- **Mobile sheet:** it opens with a slide and a staggered link reveal. It has a focus trap, Escape to close, scroll lock and focus return.
- **Tour sub-navigation:** step tabs with a roving tabindex and arrow keys, an animated underline and a deep-linkable hash (`#tour-automate`).
- **Extras:** a 2 px reading-progress hairline, a back-to-top control after the hero, and a skip link as the first tab stop.
- **404:** an animated tray ring that falls asleep, with a link home.

---

## 8. Rich components (native elements first)

| Component | Native base |
|---|---|
| Segmented control, tabs | `role="tablist"` / radio group, roving tabindex |
| Switch | `<input type="checkbox" role="switch">` |
| Accordion (limits and FAQ-style notes) | `<details>` |
| Lightbox for screens | `<dialog>`, focus return, Escape |
| Tooltip / popover primitive | Popover API with fallback |
| Workflow filter chips and feature grid | `<button aria-pressed>`; FLIP animation on filter |
| "Basic toggle vs EverOn" comparison | `<table>` with real headers |
| Rule-builder card (interactive G5) | Form controls |
| Theme switcher | Radio group |
| Tray-state legend | List, `aria-hidden` decoration plus text labels |
| Copyable shortcut chip | Only shortcuts in the spec (for example `⌘K` for the quick switcher) |
| Stepper / progress rail | `<ol>` with `aria-current="step"` |

---

## 9. Feature grid (Features section, 12 items)

Each card has a plain status tag. The workflow filters are Long AI runs, Presentations, Remote work, Battery-conscious and Everyday.

| Feature | Tag | Workflows |
|---|---|---|
| Timed and until-a-time sessions | Available in the app | Long AI runs, Presentations, Everyday |
| System, display or both | Available | All |
| App rules ("while the app is open") | Available | Long AI runs |
| Schedules and profiles | Available | Remote work, Presentations |
| Reason line and truthful status | Available | All |
| History and timeline (30 days on the Free edition) | Available | Long AI runs |
| Maximum length, battery stops, global pause | Available (no real-battery claim) | Battery-conscious |
| Works offline by default | Available | All |
| Device and network rules (USB, display, Wi-Fi, VPN, Bluetooth, audio) | Tested with simulated devices | Remote work |
| Webhook and Shortcuts alerts, receiver you run yourself | Available (no iPhone app, no hosted service) | Long AI runs |
| Themes (5) | Available | Everyday |
| Quick switcher (`⌘K`) | Available | Everyday |

"Available in the app" means built and tested per the claims table, not "released", since there is no public build yet. The tag wording is final in Stage 4.

---

## 10. Technical architecture

```
everon/
├── README.md                     how to run, build, deploy, assets, audit
├── package.json  vite.config.ts  tsconfig.json  index.html
├── docs/stage-2-design-architecture.md   (this file)
├── public/
│   ├── brand/                    tray ring marks (from EVERON_REPO)
│   ├── favicon/  images/  robots.txt  sitemap.xml  404.html
├── src/
│   ├── App.vue  main.ts  entry-server.ts
│   ├── data/    content.ts  screens.ts  features.ts  images.json
│   ├── styles/  tokens.css  app-tokens.css  motion.css  global.css
│   ├── components/
│   │   ├── sections/   Navbar Hero Problem Experiences Tour Trust
│   │   │               Features Why FinalCta Footer
│   │   ├── screens/    ScreenFrame TrayIcon MenuBar Popover SessionDetail
│   │   │               RuleEvaluator RuleBuilder History Overview
│   │   │               SafetySettings Themes QuickSwitcher States
│   │   └── ui/         Segmented Switch Accordion Lightbox Tooltip …
│   ├── composables/    useScrollSpy useReveal useTheme useDemoClock
│   └── pages/          ScreensCatalogue.vue
├── tools/
│   ├── prerender.mjs         static HTML for / , /404.html, /screens/
│   ├── prepare-assets.mjs    reads EVERON_REPO (default /Users/vipinkp/PycharmProjects/EverOn)
│   ├── copy-audit.mjs        see 10.2
│   ├── check-dist.mjs        links, assets, SEO, no third-party requests
│   └── smoke-live.mjs
└── (workflows, in App-websites/.github/workflows) everon-ci.yml, deploy-everon.yml
```

Stack: Vue 3 Composition API, TypeScript, Vite, `vue-tsc`, `sharp` (assets). The only runtime dependency is `vue`. There is no animation library unless Stage 5 proves one is needed.

### 10.1 Prerender and hydration
The prerender step writes the full HTML for every section. Demos render a fixed initial state on the server and start timers only after mount, so the first paint is the same with or without JavaScript. Animations are enhancements and never hide content.

### 10.2 Copy audit (the Stage 1 finding)
`tools/copy-audit.mjs` holds:
- the download-overclaim patterns copied from `EverOn/tools/copy-audit.test.mjs`
- the four patterns copied from `forbidden-claims.test.mjs`
- the never-say list from the prompt: signed or notarised, every AI tool, detects when AI is thinking, "never sleep unexpectedly", price or free forever, an iPhone app or hosted service, VoiceOver-accessible

It reads `src/data/content.ts`, `screens.ts` and `features.ts` by absolute path. A drift check reads the two source test files via `EVERON_REPO` and fails if a pattern no longer matches the source. A fixtures test proves each pattern catches a bad sentence, as the product's own tests do.

### 10.3 Workflows
Both are scoped to `everon/**`, mirroring mark-o: `everon-ci.yml` (type-check, build, prerender, `npm run check`, copy audit) and `deploy-everon.yml` (Pages deploy under `/App-websites/everon/`).

### 10.4 Docs
Stage 4 adds the EverOn row to `App-websites/README.md` and writes `everon/README.md`.

---

## 11. Budgets and checks

| Area | Budget / rule |
|---|---|
| Performance | LCP under 2.5 s, CLS under 0.1, no animation-caused layout shift. Below-the-fold screens and demos are lazy. JS under about 120 KB gzip. |
| Accessibility | Keyboard order and visible focus on every demo. Contrast 4.5:1 for text. Targets 44 px. Decorative motion is `aria-hidden`. Polite live regions for demo changes only. |
| Content | No third-party requests, analytics or backend. Alt text is descriptive. No video planned, so no captions needed (a transcript is added if one appears). |
| SEO | Sitemap, robots, canonical, Open Graph, JSON-LD `SoftwareApplication` (`operatingSystem: macOS`, no price, no download URL), favicon from the tray marks, 404. |
| Claims | The audit blocks the build on any hit. |

---

## 12. Risks and open items

1. **Generated screens drift from the real app.** They are built from the mock and the copy deck, and the `/screens` catalogue plus the `capture` prop is the correction path in Stage 3. Several S-screens were "not looked at in the running app" in the registers (GAP-048, GAP-049), so the real app may differ from the mock.
2. **No Apple logo or wallpaper in the menu bar frame.** I use a generic bar with abstract status glyphs to avoid using Apple assets.
3. **Tour on mobile** drops pinning. This is a deliberate trade for reliability.
4. **The tray ring is a template icon** (black on transparent). It is recoloured with `currentColor` through a CSS mask, which is fine for marks and a favicon, but it isn't a full-colour app icon.
5. **Still owed by you:** the app icon, a public download URL, a domain, contact and privacy pages, and a pricing decision. Defaults are applied until then.

## 13. Approval requested

Please approve, or change:
1. The nav order **Overview, Tour, Features, Get EverOn** (instead of the prompt's order).
2. The screen inventory G1 to G12 and the exclusions (Agents, Sound and remote, Onboarding, Permissions, QR).
3. The three simulated demos with autoplay and a Pause control.
4. The system font stack (no webfont).
5. The Stage 3 plan: capture the real app from `dist/` or `out/` at 2x, light and dark, show you the shots, then swap in captures through the `capture` prop.
