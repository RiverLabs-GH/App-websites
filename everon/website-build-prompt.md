# Role: Senior Product Designer, Brand Strategist, UX Architect & Frontend Engineer

Design and build a production-ready static marketing website for **EverOn**, a macOS menu-bar app: *the intelligent keep-awake companion for macOS*. Treat it as a premium, calm, native-feeling Mac utility, not a generic SaaS page.

## 0. Where things live (absolute paths)
- **Product repo (source of truth, read-only):** `/Users/vipinkp/PycharmProjects/EverOn`
- **Website module (write only here):** `/Users/vipinkp/PycharmProjects/App-websites/everon/`. Follow the layout rules in `/Users/vipinkp/PycharmProjects/App-websites/README.md`, and add a row for EverOn to its modules table.
- **Structural reference only:** `/Users/vipinkp/PycharmProjects/App-websites/mark-o/` (build, prerender, asset pipeline, CI check, Pages deploy). Do not copy mark.O content, branding or claims.
- **Workflows:** `/Users/vipinkp/PycharmProjects/App-websites/.github/workflows/`. Add `everon-ci.yml` and `deploy-everon.yml`, scoped to `everon/**`.
- **Asset sources:** `/Users/vipinkp/PycharmProjects/EverOn/assets/icons/` and `/Users/vipinkp/PycharmProjects/EverOn/design/`. Anything captured from the running app goes to `/Users/vipinkp/PycharmProjects/App-websites/everon/public/images/`.
- Do not modify the EverOn repo, except to build and run the app for screenshot capture. Any asset script in the website module must take the product repo path from an `EVERON_REPO` environment variable, defaulting to `/Users/vipinkp/PycharmProjects/EverOn`.
- Run all commands with absolute paths or `cd` into the module explicitly. Don't assume the current directory.

## 1. Stage 1: Discovery (deliver a report first, then stop for review)
Read these under `/Users/vipinkp/PycharmProjects/EverOn`, in this order:
1. `docs/product/pitch-and-positioning.md` (**binding for all copy**)
2. `docs/product/product-spec.md`
3. `docs/product/vision-and-roadmap.md`
4. `docs/product/copy-deck.md`
5. `docs/product/sales-pitch.md`
6. `docs/design/ui-ux-spec.md`
7. `design/brand.json`
8. `src/renderer/styles/tokens.css`
9. `docs/qa/real-agent-pass.md`
10. `docs/qa/registers.md`

Report on:
- what EverOn is
- the users (main audience: people running long AI coding runs; also presenters, remote workers, developers and battery-conscious users)
- the problem
- why choose it over a basic toggle
- primary features
- differentiators
- usable assets
- recommended messaging

State the asset audit plainly. As of now there are **no screenshots, no video and no full-colour app icon**. `/Users/vipinkp/PycharmProjects/EverOn/assets/icons/` holds only tray template icons, and `icon.png` is missing. Propose how to get real assets:
1. Build and run the app from `/Users/vipinkp/PycharmProjects/EverOn` (use the `run` skill). Capture the popover, dashboard, rule editor, history/timeline, settings and themes at 2x, in light and dark.
2. Use the tray icon states (active, inactive, paused, attention, unknown) as brand marks.
3. Ask me for the app icon. Do not invent a logo.

Ask me questions only for gaps the repo can't answer (download URL, domain, contact, privacy page, pricing).

## 2. Claims discipline (hard rules)
- Follow the **claims table** in `/Users/vipinkp/PycharmProjects/EverOn/docs/product/pitch-and-positioning.md`. "Say now" items may be stated. "Wait" items need the stated qualifier or stay out.
- Never say: signed or notarised; works with every AI tool; detects when AI is thinking; the Mac will never sleep unexpectedly; has a price or is free forever; an iPhone app or hosted service exists; VoiceOver-accessible.
- The agent rule is "optional, not yet verified". Lead with timed sessions and app rules, which are real today.
- The promise has a stated limit: EverOn prevents supported idle sleep. It cannot override lid-close, thermal or critical-battery sleep, and the copy must say so.
- Tone: calm, plain and precise. No hype, no urgency, no fear about a Mac that "dies".
- No competitor comparisons, testimonials, ratings or statistics. A measured figure is allowed only with its context (for example, idle CPU of about 0.6 to 0.7% on one Mac).
- After the copy is written, run the copy-audit patterns in `/Users/vipinkp/PycharmProjects/EverOn/tools/copy-audit.test.mjs` against the site text. The check must read the site's `content.ts` by absolute path.

## 3. Positioning
Two equal experiences:
- **Instant control:** the menu-bar popover. Start, pause, extend or stop in one or two clicks (15m, 1h, until a time; system, display or both).
- **Intelligent automation:** rules by app, display, power, devices, network, audio and schedule, with profiles, and a plain-words reason line for why the Mac is awake.

Supporting pillars:
- truthful status (never "awake" when it is only requested)
- safety by default (max length, battery stops, global pause, never paid)
- private and offline by default

Headline direction: the real problem, a long agent run or build cut off by sleep, or a forgotten switch that drains the battery. In 5 seconds a visitor should get what it does. In 15 they should get why it beats a toggle.

## 4. Visual direction
Apple-led, with Raycast (native-app showcase), Craft (typography), Linear (polish) and Arc (identity) as secondary references. Inspect them in the browser if it's available. Otherwise say you're using them as guidance only.
- Calm, minimal, generous whitespace, strong type hierarchy, restrained palette.
- Neutral base plus the **EverOn accent `#2457c5`**, from `/Users/vipinkp/PycharmProjects/EverOn/src/renderer/styles/tokens.css`. Support light and dark. Use gradients sparingly.
- The app UI is the hero: real captures where they exist, otherwise screens generated to the rules in Section 7. No mockups of screens the spec doesn't define, and no stock imagery, generic SaaS illustration or heavy glassmorphism.
- The site should feel alive: rich motion, intuitive navigation and ultra-rich HTML components (Section 7). Motion is slow, eased and purposeful, so it stays calm, never busy.
- Menu-bar framing is a signature idea: show the popover against a macOS menu bar, from real captures or generated screens.

## 5. Information architecture
Navbar (logo, Overview, Features, Tour, Get EverOn) → Hero (real popover capture) → Problem/Solution → Two core experiences (Instant control, Automation) → Product showcase (real captures or generated screens, scroll-driven transitions, no cropping) → Trust & safety (limits, truthful status, privacy) → Feature highlights by workflow → Why EverOn (verified differences only) → Final CTA → Footer.

Include a visible "Requires macOS 13+" line. EverOn is macOS only, so don't mention Windows. The download button is a functional link **only** if a real, public distribution URL exists. Otherwise it reads "Coming soon for Mac". The footer has no invented legal pages or contact details.

## 6. Technical requirements
- **Stack:** Vue 3 + TypeScript + Vite, Composition API, semantic HTML, CSS variables, content in `/Users/vipinkp/PycharmProjects/App-websites/everon/src/data/content.ts`, one component per section, prerendered static output.
- **Constraints:** no React, no backend, no analytics, no third-party requests.
- **Paths:** relative asset paths and Vite `base: './'`, so it works under the GitHub Pages subpath `/App-websites/everon/`.
- **SEO and metadata:**
  - sitemap and robots.txt
  - canonical and Open Graph tags
  - JSON-LD (`SoftwareApplication`, `macOS`)
  - a favicon from the real brand marks
  - a 404 page
- **Performance and docs:** lazy-loaded images and a README.
- **CI/CD:** GitHub Actions CI check and Pages deploy, as in Section 0.
- **Accessibility and motion:**
  - keyboard navigation and visible focus
  - accessible contrast and touch-friendly targets
  - `prefers-reduced-motion`
  - descriptive alt text
  - captions or a transcript for any video

## 7. Generated screens, motion and rich components

### 7.1 Generated screens (build them as and when a section needs them)
Real captures may not exist yet, and the site must not wait for them. When a section needs an app screen, generate it as a Vue component in HTML/CSS. Do not use an image or screenshot-lookalike.

**What may be generated.** Only screens the product defines in `docs/design/ui-ux-spec.md` and `docs/product/product-spec.md`: menu-bar popover, dashboard, rule editor, history/timeline, settings, themes, and the tray icon states. If a section needs a screen the spec doesn't define, stop and ask me. Don't invent it.

**Fidelity rules.**
- Build from `tokens.css` and `design/brand.json` (accent `#2457c5`, type, radii, spacing, shadows). Do not eyeball values.
- Use the app's real labels, strings and states from the spec and `copy-deck.md`. No invented features, settings, numbers or statuses.
- Every screen has light and dark variants, driven by the same CSS variables as the site.
- Show truthful status. "Requested" and "active" look different, and the agent rule is labelled optional and not yet verified.
- Keep the app's native macOS feel (window chrome, menu bar, vibrancy kept light). No heavy glassmorphism.

**Architecture.**
- One component per screen in `src/components/screens/` (for example `PopoverScreen.vue`, `DashboardScreen.vue`, `RuleEditorScreen.vue`, `TimelineScreen.vue`, `SettingsScreen.vue`).
- Shared `ScreenFrame.vue` (macOS window or menu-bar framing, light/dark) and `TrayIcon.vue` (the five real tray states from `assets/icons/`).
- Props: `theme`, `state`, `size`, `interactive`. Screen content is data-driven from `src/data/screens.ts`.
- Each screen component accepts an optional `capture` prop. When a real 2x capture exists in `public/images/`, it replaces the generated version with no layout change.
- Add a hidden `/screens` catalogue page (not in the nav or sitemap, `noindex`) listing every generated screen in light and dark and in each state, for review.

**Process for each new screen.**
1. Name the section that needs it and the spec section that defines it.
2. Add its data to `screens.ts`, then build the component and its states.
3. Check it against the spec at 1x and 2x, in light and dark.
4. Register it in the `/screens` catalogue.
5. List it in the deliverables as "generated, replace with capture when available".

**Honesty.** Generated screens carry a small caption (for example "Interface shown from the EverOn design spec") and a descriptive `aria-label` or alt equivalent. Never present one as a screenshot.

### 7.2 Interactive demos (simulated, local only)
- **Popover demo:** a working menu-bar popover. Start, pause, extend (15m, 1h, until a time) and stop. System, display or both. A live countdown. The reason line updates in plain words. The tray icon changes state in the menu bar above it.
- **Rule demo:** toggle app, power, display, schedule and network conditions, and watch the reason line and status resolve. Show the stated limit (lid-close, thermal and critical-battery sleep win) as one of the outcomes.
- **Timeline demo:** a scrubbable history/timeline.
- Everything is simulated in component state. No network, no real system effect, and a visible "Interactive demo" label.
- Provide a scripted autoplay loop that starts when the demo scrolls into view, with a visible Pause/Play control. Any user input takes over from the script.

### 7.3 Motion system
- Define motion tokens as CSS variables (durations, easings, distances, stagger). Use them everywhere. No one-off values.
- Prefer CSS, the Web Animations API and `IntersectionObserver`, plus CSS scroll-driven animations with a graceful fallback. A small animation library is allowed only if it is bundled locally and justified in the README. No CDN.
- Animate `transform` and `opacity` only. Keep 60fps, avoid layout thrash, and set no `will-change` on more than a few elements.
- **Hero:** the menu bar assembles, the tray icon switches state, and the popover opens and runs a short sequence.
- **Scroll storytelling:** a sticky product tour where screens cross-fade or morph between Instant control, Automation, Timeline and Settings as the copy advances. Include a progress indicator.
- **Section reveals:** staggered, subtle and one-shot.
- **Data motion:** animated ring or countdown, timeline lines that draw in, and a toggle-to-reason-line cascade. Counted figures animate only if they are allowed figures with context.
- **Theme switch:** a light/dark toggle that transitions smoothly and is remembered in `localStorage`. The default follows the system.
- **Micro-interactions:** hover, press and focus states on every interactive element, with spring-like easing kept short.

### 7.4 Navigation and navigation animation
- Sticky navbar with a sliding active-section pill that follows scroll position (scroll-spy) and clicks.
- Smooth anchor scrolling that respects the sticky header offset. Section transitions use the View Transitions API where supported, with a no-JS fallback.
- Navbar condenses on scroll (height, blur-lite, shadow). The Get EverOn button gets a subtle emphasis, not a bounce.
- Mobile menu: animated sheet with staggered links, focus trap, Escape to close and scroll lock.
- Tour sub-navigation: step tabs with a keyboard arrow-key roving tabindex, an animated underline and a deep-linkable hash.
- A reading-progress hairline and a back-to-top control. The 404 page is animated too.

### 7.5 Ultra-rich HTML components
Build these as reusable, accessible components, using native elements first (`<details>`, `<dialog>`, `<button>`, `<input type="checkbox" role="switch">`):
- segmented control and tabs
- toggle switches and steppers
- an accordion FAQ
- an interactive rule-builder card
- a "basic toggle vs EverOn" explainer using verified differences only
- a copyable keyboard-shortcut chip (only shortcuts that exist in the spec)
- a tooltip and popover primitive
- a theme switcher
- a feature grid with a filter by workflow
- a lightbox for screens (`<dialog>`, focus return, Escape)
- an animated tray-icon legend for the five states

### 7.6 Guardrails
- **Reduced motion:** under `prefers-reduced-motion: reduce`, there is no autoplay and no parallax or scroll-driven movement. Screens show their final state, transitions become instant or a simple fade, and demos stay fully usable by click.
- **Content first:** all copy is in the prerendered HTML, never hidden until JS runs. With JS off, every section and screen is readable.
- **No flashing** above 3 times a second. Any motion over 5 seconds can be paused.
- **Keyboard and screen readers:** every demo control is keyboard-operable and visibly focused. Decorative animation is `aria-hidden`. Live regions announce only meaningful demo changes, politely.
- **Performance:** a budget of LCP under 2.5s, CLS under 0.1 and no layout shift from animations. Lazy-load below-the-fold screens and demos, and pause offscreen animations.
- **Claims discipline still applies to every generated screen and animation** (Section 2). A demo must never imply the Mac will never sleep, that the agent rule is verified, or that anything is signed, priced or hosted.
- **Tone:** calm. If an animation draws attention to itself rather than the product, cut it.

## 8. Workflow
1. **Discovery report and questions.** Stop for my review.
2. **UX and design architecture:** audience, messaging, sitemap, tokens, asset placement, plus the screen inventory (which screens are real captures, which are generated and the section that needs each), the motion tokens and the navigation behaviour. Stop for my approval.
3. **Asset capture** from the running app. Show me the shots before using them. Generate any screen still missing a capture, per Section 7.1, and show me the `/screens` catalogue before it is used in sections.
4. **Implementation** in `/Users/vipinkp/PycharmProjects/App-websites/everon/`. Build components, then demos, then motion, then navigation. Generate further screens as sections need them.
5. **Visual refinement** at desktop, tablet and mobile, with motion reviewed at normal speed and with reduced motion on.
6. **Validation:** production build, link, asset and SEO checks, subpath behaviour, console errors, the copy audit (run against the strings in `screens.ts` too), keyboard and reduced-motion passes, no-JS rendering and the performance budget. Fix everything found.
7. **Deliver:** source, build, workflow, README, a section summary, the list of generated screens to replace with captures, and the list of what I still owe you.

Prioritise quality over complexity. Think like a product designer first and a frontend developer second.
