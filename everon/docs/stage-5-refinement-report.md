# EverOn website: Stage 5, visual refinement report

Reviewed the built site at 1440 and 1280 (desktop), 1024 and 820 (tablet) and 390 (mobile), in light and dark, with `prefers-reduced-motion` on and off. Tools: the embedded Chromium driven by Playwright, contact sheets of every section, a layout-shift probe and a scroll-reveal probe (scratch scripts, not part of the module).

## Fixed in this stage
| Problem | Fix |
|---|---|
| The popover demo changed height (350, 451, 467 px) as autoplay moved through its states, which moved the caption by 83 px. Layout shift 0.08 at 1440 and 0.16 at 1024, over the 0.1 budget. | The demo card has a fixed height (the tallest state) with the battery line pinned to the bottom. Layout shift is now 0.0016 to 0.0036 at every width, and the caption never moves. |
| The inactive card then had an empty gap. | Added the app's own "Presets" block with its copy-deck strings, as the real popover shows it. |
| The "What EverOn can and can't do" icon shrank to a dot on mobile. | `flex: none` on the icon. |
| On mobile the comparison table scrolled sideways and hid the EverOn column. | Under 680 px the rows become stacked cards: question, "A basic toggle" line, then a highlighted "EverOn" line. |
| Earlier in Stage 4 (kept here for the record): tray ring not rendering, oversized headline, bullet spacing, tour arrow keys. | Fixed and re-tested. |

## Reviewed and left as is
- No horizontal overflow at any width. Desktop hero, problem, two experiences, tour, trust, features and the comparison table are balanced. Tablet stacks the hero and the trust pillars cleanly.
- Dark theme: contrast and surfaces hold on every section, including the captures and the mobile sheet.
- Reduced motion: no autoplay, the demo starts in its final state, the Pause control is hidden because there is nothing to pause, the tour steps and reveals are static, and the pulse is off.
- Scroll reveals: all 23 reveal blocks become visible after a full scroll. No `will-change` is left set, and no image is broken.
- Navigation pill, reading-progress line and the sticky tour behave at every width. On mobile the tour drops pinning, as designed.

## Not covered yet (Stage 6)
Contrast measured numerically, a no-JavaScript render of the built HTML, Firefox and Safari, the deploy itself.
