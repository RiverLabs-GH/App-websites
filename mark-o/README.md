# mark-o

The website for **mark.O**, a private, offline Markdown workspace for macOS and Windows. *Read. Write. Organise.*

The app lives in its own repository: [RiverLabs-GH/mark.O](https://github.com/RiverLabs-GH/mark.O) (private).

## Status

Scaffold only. There is no site, build or deploy yet.

## Source material

These already exist in the app repository and can feed the site:

| What | Where in `mark.O` |
|---|---|
| Positioning and copy | `docs/product/sales-pitch.md`, `docs/product/copy-deck.md`, `docs/product/vision-and-roadmap.md` |
| Screenshots | `docs/store-images/` (12 images, including the OKF screens) |
| Launch film | `product-video/` (Remotion project, 73 s) |
| Downloads | GitHub releases: arm64 and Intel DMGs with `SHA256SUMS.txt` |
| Design tokens | `mocks/design-tokens.css` |

## Facts the site must keep true

- Fully offline, no account, no analytics, no telemetry.
- macOS builds are ad-hoc signed and not notarized, so first launch needs right-click, then Open.
- No Windows build is published yet.
- OKF trust labels are advisory, not security. mark.O is not affiliated with Google.

## To do

- [ ] Choose the stack and hosting
- [ ] Build the landing page: hero, features, screenshots, download
- [ ] Link the download button to the latest release
- [ ] Add a first-launch guide for the unsigned macOS build
- [ ] Add a privacy page
