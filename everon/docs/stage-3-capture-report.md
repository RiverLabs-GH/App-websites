# EverOn website: Stage 3, asset capture report

Status: **done, reviewed.** 57 real captures at 2x, no renderer errors, product repo unchanged (`git status` there still shows only the `skills/` folder that was untracked before).

## How they were made
- `tools/capture-screens.mjs` (re-runnable: `node tools/capture-screens.mjs`; `EVERON_REPO` overrides the product path).
- It rebuilt the app output (`npx electron-vite build` in the product repo, which writes the gitignored `out/` folder), then launched the built app with the product repo's own Playwright launcher in a throwaway user-data folder and screenshotted the popover (320 x about 390 to 500 px) and the main window (1100 x 720) at 2x.
- Output: `public/images/captures/<id>-<theme>@2x.png` plus `manifest.json` (id, state, theme, size, notes, claims notes). PNGs total 8.9 MB. Stage 4's `prepare-assets.mjs` converts them to WebP.

## What is real and what is sample data
- **Real:** the UI, layout, copy, themes and the helper (Diagnostics shows the real helper running).
- **Injected through the app's own test door (EVERON_E2E):** the battery reading (82% charging, and 18% on battery for the warning shot) and rule conditions marked as met. A test Mac has no real discharge or external display.
- **Sample:** rule names ("Coding session", "Work display setup"). History holds only this capture run.
- Captions on the site must say "Captured from the EverOn app with sample data".

## Inventory

| Capture | Themes |
|---|---|
| `popover-inactive`, `popover-paused`, `popover-battery-warning` | light, dark |
| `popover-active` | light, dark, midnight, arctic, oled, aurora |
| `popover-rule-active` | light, dark, midnight |
| `overview-inactive`, `overview-active` | all six |
| `session-detail`, `automations-list`, `rule-evaluator`, `sessions-presets`, `diagnostics`, `quick-switcher`, `composer`, `settings-general`, `settings-automation`, `settings-notifications` | light, dark |
| `settings-appearance`, `settings-safety` | light, dark, midnight |
| `rule-builder`, `history` | light, dark (**restricted, see below**) |

## Reviewed by eye: cleared for use
Popover (all states and themes checked), Overview, session detail (reasons, held assertions, helper), automations list, rule evaluator, composer, quick switcher, safety settings and the Midnight and Aurora variants. Colours, copy and layout are correct, and nothing is clipped.

## Restricted captures (not for the site as they stand)

| Capture | Problem | Rule |
|---|---|---|
| `history-*` | Shows an "Included in EverOn Pro" Insights card (a Pro feature description) and "Showing the last 366 days". The claims table allows no Pro feature list, and the Free window was decided as 30 days (OQ-014). | Use the generated History screen, or re-capture after the app copy is fixed. |
| `rule-builder-*` | Offers "Keep awake while Claude Code CLI is working" with no "unverified" label (the agent rule is unverified, GAP-047). | Use the generated builder, or show it only beside the unverified label. |

Both are flagged in `manifest.json` under `claimsNote`.

## Findings about the product (for you, not the website)
1. **The real app differs from the spec and the mock** in places: the popover has a Presets block and an "Automations" block with "Pause automations and quit", Overview has a "While an app runs" card, Session detail lists held assertions (System idle sleep, Display sleep), and History has an Insights card. The generated screens (G1 to G12) must follow these captures, not the mock.
2. **History copy says "last 366 days"** although Free is now 30 days (OQ-014).
3. **Safety settings shows "Maximum session length 24 h".** The site copy still gives no number (OQ-003), but the screenshot does.
4. **The popover shows "Battery status is unavailable"** on a Mac or run with no battery reading. I injected a reading for all captures.
5. The Settings tabs include **Agents**. It was deliberately not captured.

## Consequences for Stage 4
- The captures replace the generated screens wherever one exists, through the `capture` prop. Generated versions remain for states not captured: popover unknown, helper unavailable, ended-session detail, builder and History (restricted), and empty and error states.
- The generated popover and Overview must match the real layout above.
- The hero uses `popover-active` (light and dark) inside the generated menu-bar frame.
- The themes strip uses the six `overview-active` and `popover-active` captures, so the generated Appearance screen is now optional.
