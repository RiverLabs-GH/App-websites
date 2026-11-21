# Prompt: build the mark.O marketing website

Run this from a session in `/Users/vipinkp/PycharmProjects/App-websites`. The website is built in this module, `/Users/vipinkp/PycharmProjects/App-websites/mark-o/`. The product and its assets live in a different repository, which this prompt calls **the mark.O repo**:

```
/Users/vipinkp/PycharmProjects/mark.O
```

Read from the mark.O repo. Do not modify it.

---

## Asset locations (absolute paths)

| What | Path |
|---|---|
| Product docs: pitch, copy, roadmap, requirements | `/Users/vipinkp/PycharmProjects/mark.O/docs/product/sales-pitch.md`, `copy-deck.md`, `vision-and-roadmap.md`, `requirements.md` |
| Feature references | `/Users/vipinkp/PycharmProjects/mark.O/docs/engineering/features.md` |
| UI/UX spec | `/Users/vipinkp/PycharmProjects/mark.O/docs/design/ui-ux-spec.md` |
| App README | `/Users/vipinkp/PycharmProjects/mark.O/README.md` |
| Launch film research (what the film claims and why) | `/Users/vipinkp/PycharmProjects/mark.O/product-video/PRODUCT_RESEARCH.md` |
| **Promo images** (finished marketing slides, 2880×1800, 12 files: `01-hero` to `12-okf-both`) | `/Users/vipinkp/PycharmProjects/mark.O/docs/store-images/` |
| **Raw app screenshots** (clean UI captures, 2880×1698, 13 files) | `/Users/vipinkp/PycharmProjects/mark.O/product-video/public/screenshots/` |
| Step-by-step interaction captures (templates, detect, graph, search, verify, extend, export, themes) | `/Users/vipinkp/PycharmProjects/mark.O/product-video/public/screenshots/demo/` (with `manifest.json`) |
| Typing sequence (46 frames) | `/Users/vipinkp/PycharmProjects/mark.O/product-video/public/screenshots/typing/` |
| **Promo video**, 4K, 78 MB | `/Users/vipinkp/PycharmProjects/mark.O/product-video/output/mark-o-launch.mp4` |
| Promo video, 1080p, 31 MB | `/Users/vipinkp/PycharmProjects/mark.O/product-video/output/mark-o-preview.mp4` |
| Official icon (1254×1254, white canvas, no alpha) | `/Users/vipinkp/PycharmProjects/mark.O/assets/icons/icon.png` (also `icon.icns`, `icon.ico` in the same folder) |
| Fonts (Inter, JetBrains Mono, the ones the app bundles) | `/Users/vipinkp/PycharmProjects/mark.O/product-video/public/fonts/` |
| Design tokens of the app | `/Users/vipinkp/PycharmProjects/mark.O/mocks/design-tokens.css` |
| Stock footage licence note | `/Users/vipinkp/PycharmProjects/mark.O/product-video/public/footage/SOURCES.md` |

## What an earlier discovery pass already found

Stage 1 was done once. Use this as a head start. Re-check anything you rely on, but do not start from zero.

1. **The promo images are not usable as raw product shots.** They are finished slides on blue, purple and green backgrounds with serif headlines and floating cards baked in. They clash with a black-and-white site and with "do not recreate screens with artificial mockups". The raw screenshots folder holds the real, unstyled UI. Build from those, inside a CSS window frame with the macOS traffic lights drawn (the captures omit them).
2. **The video exists only locally.** `product-video/output/` is gitignored in the mark.O repo. The 4K file is far too heavy for a landing page. Make a web copy of about 8–12 MB (H.264, with a poster frame) and keep the originals untouched. The mark.O repo's Remotion install bundles an ffmpeg you can use. The film contains Pexels stock footage of a MacBook. The licence allows it. The site must not imply Apple endorses mark.O.
3. **Hosting and download are unresolved.** Both `App-websites` and `mark.O` are private repos under `RiverLabs-GH`. GitHub Pages from a private repo needs a paid plan, and a download link to the v0.1.0 release (`https://github.com/RiverLabs-GH/mark.O/releases/tag/v0.1.0`) returns a 404 for outsiders.
4. **Facts to keep true.** Offline, no account, no analytics, no telemetry. macOS builds are ad-hoc signed and not notarized, so first launch needs right-click then Open. There is no price, no privacy-policy page and no support contact in the repo. Trust labels are advisory, not security. mark.O is not affiliated with Google. The product ships on macOS and Windows by design, but no Windows build is published or tested.
5. **Messaging already in the repo.** The sales pitch headline "Your agents write Markdown. Read it like it matters." and the tagline "AI drafts. You decide." The product has no feature called "Independent Markdown Reader". Call the two pillars **Markdown Reader** (any file or folder) and **OKF Reader** (knowledge bundles).
6. **Open questions and the defaults to use unless I say otherwise:**
   - Hosting: make `App-websites` public. *Default: public.*
   - Download button: "Coming soon" until the release is publicly reachable, with the real link ready to switch on.
   - Windows: macOS only, no mention of Windows.
   - Footer: no privacy-policy or support links. Add an on-page "Private by design" statement taken from the product principles.
   - Bundle export: present it as available ("Export a bundle"), although the sales pitch still says "Coming in 1.0".
   - Use a compressed copy of the film and the raw screenshots, not the promo images.

   Ask me about any of these that you are about to depend on, and proceed with the default if I have not answered.

---

# Role: Senior Product Designer, Brand Strategist, UX Architect & Frontend Engineer

Act as a senior product designer, Apple-level UI/UX designer, brand strategist and frontend architect.

Your task is to design and build a complete, production-ready static marketing website for **mark.O**, a macOS application.

The website must communicate the product's purpose, demonstrate its capabilities, showcase the actual application experience and convert visitors into potential users.

Do not approach this as a generic SaaS landing page. Treat mark.O as a premium, thoughtfully designed macOS productivity application.

## 1. First: Understand the Existing Product

Before writing any code, thoroughly inspect the existing repository.

The mark.O repo (`/Users/vipinkp/PycharmProjects/mark.O`) is the single source of truth for product information.

Explore:

- Existing Markdown documentation and product specifications.
- README files and feature descriptions.
- Application architecture and supported capabilities.
- Existing mockup screens and UI screenshots.
- Product demonstration videos and promotional assets.
- Application icons, logos and branding assets.
- Existing user workflows and use cases.
- Any available documentation describing the problem mark.O solves.

Pay particular attention to the actual application screenshots and videos. These should form the foundation of the website's visual storytelling.

Do not invent features, capabilities, integrations, pricing, compatibility claims or product benefits that cannot be established from the repository.

If information is missing, identify the gap and ask me questions in a question-and-answer format before making assumptions.

First deliver a concise product discovery report covering:

1. What mark.O is.
2. Who the intended users are.
3. What problem it solves.
4. Why someone would choose it over existing alternatives.
5. Its primary features.
6. Its strongest differentiators.
7. Which existing visual assets should be used.
8. Recommended website messaging and positioning.

## 2. Product Positioning

Product name: mark.O

Category: Markdown Workspace

Tagline: Read. Write. Organise.

Positioning:

mark.O is a macOS Markdown workspace designed to make working with Markdown files more organised and accessible.

The product should communicate two equally important experiences:

- A dedicated Markdown reader experience.
- An OKF reader experience.

Do not position mark.O as merely another Markdown editor.

Understand the distinction between these experiences from the repository and explain their value clearly.

The website should answer three questions immediately:

- What exactly is mark.O?
- What problem does it solve?
- Why should I use it instead of my existing workflow?

## 3. Visual Design Direction

Create an Apple-inspired visual experience.

Design references:
- Apple macOS product pages.
- Apple's editorial product storytelling.
- Linear's clean interface presentation.
- Arc's product-focused visual communication.
- Premium independent Mac application websites.

Visual principles:

- Minimalist and sophisticated.
- Generous whitespace.
- Strong typography and clear hierarchy.
- Restrained colour palette.
- High-quality product screenshots.
- Subtle gradients and depth.
- Carefully controlled animations.
- Consistent spacing and alignment.
- Premium, editorial presentation.

Brand direction:

- Preserve the existing mark.O identity and icon (`/Users/vipinkp/PycharmProjects/mark.O/assets/icons/icon.png`).
- Use black, white and sophisticated grey tones as the primary palette.
- Use gradients sparingly.
- Avoid unnecessary colours.
- Avoid generic SaaS illustrations.
- Avoid excessive glassmorphism.
- Avoid decorative elements that compete with the product.

The application UI must remain the visual hero.

Use real screenshots and video assets from the mark.O repo wherever possible (`/Users/vipinkp/PycharmProjects/mark.O/product-video/public/screenshots/` and `/Users/vipinkp/PycharmProjects/mark.O/product-video/output/`). Do not recreate existing application screens using artificial mockups.

## 4. Website Information Architecture

Build a complete website with the following structure.

### A. Navigation

A clean, minimal navigation bar.

Include:
- mark.O logo and application name.
- Overview.
- Features.
- Screenshots or Product Tour.
- Download / Get mark.O CTA.

Navigation should remain visually subtle and work well on desktop and mobile.

### B. Hero Section

The first screen must immediately communicate the product.

Include:
- A compelling headline.
- A concise supporting description.
- Primary CTA.
- Secondary CTA, if appropriate.
- Application screenshot or product video.

The headline should communicate the actual problem solved rather than using generic marketing language.

The product UI should receive more visual attention than decorative elements.

### C. Problem and Solution

Explain the problem mark.O addresses.

Focus on actual user friction discovered in the repository.

Show how mark.O improves the experience.

Use short, clear statements rather than lengthy paragraphs.

### D. Core Experiences

Create dedicated sections for:

1. Markdown Reader.
2. OKF Reader.

Give both experiences equal importance.

For each section:
- Explain what it does.
- Explain the user benefit.
- Show the relevant application screenshot.
- Highlight the important capabilities.
- Use concise, outcome-oriented messaging.

### E. Product Showcase

Create an immersive visual showcase using the existing mockup screens and screenshots.

Requirements:
- Large application screenshots.
- Consistent presentation.
- Optional subtle scroll-based transitions.
- Responsive image layouts.
- No distortion or unnecessary cropping of screenshots.

Use the existing promotional video (`/Users/vipinkp/PycharmProjects/mark.O/product-video/output/`) where appropriate.

### F. Feature Highlights

Identify and present the most valuable features from the repository.

Do not simply create a long feature checklist.

Organise features around user benefits and actual workflows.

Use concise titles and descriptions.

### G. Why mark.O?

Create a differentiation section explaining why someone would choose mark.O.

Base this on verified product capabilities and workflows.

Avoid unsupported competitor comparisons.

### H. Final CTA

End with a strong, minimal conversion section.

Reinforce the product's value and provide an appropriate download or product CTA.

Only include a functional download link if a valid distribution URL or installer is available in the repository.

### I. Footer

Include:
- mark.O branding.
- Short product description.
- Navigation links.
- Privacy policy, if available.
- Contact/support details, if available.
- Copyright information.

Do not invent legal pages or contact information.

## 5. Technical Architecture

Build a static website using:

- Vue 3.
- TypeScript.
- Vite.
- Composition API.
- Semantic HTML5.
- Modern CSS.
- CSS variables for design tokens.

Use a component-driven architecture.

Suggested structure (the project root is `/Users/vipinkp/PycharmProjects/App-websites/mark-o/`):

src/
  assets/
  components/
    Navbar.vue
    HeroSection.vue
    ProblemSection.vue
    ExperienceSection.vue
    ProductShowcase.vue
    FeatureSection.vue
    DifferentiationSection.vue
    FinalCTA.vue
    Footer.vue
  sections/
  styles/
    tokens.css
    global.css
    animations.css
  data/
    content.ts
  App.vue
  main.ts

public/
  images/
  videos/
  favicon/

Keep content separate from presentation wherever practical.

Do not introduce React alongside Vue unless there is a compelling technical reason. The final deliverable should be a simple static website.

## 6. UX and Responsive Behaviour

The website must work exceptionally well on:

- Large desktop displays.
- MacBook screens.
- Tablets.
- Mobile phones.

Requirements:

- Responsive navigation.
- Responsive typography.
- Carefully adapted screenshot layouts.
- Optimised video playback.
- Touch-friendly interactive elements.
- Accessible contrast.
- Keyboard navigation.
- Reduced-motion support.

Animations should be subtle and purposeful.

Use CSS transitions and lightweight JavaScript where possible.

Avoid unnecessarily large animation libraries.

## 7. Performance and SEO

The website must be lightweight and suitable for GitHub Pages.

Implement:

- Static site generation/build through Vite.
- Optimised images.
- Lazy loading for below-the-fold assets.
- Appropriate video loading strategies.
- SEO title and description.
- Open Graph metadata.
- Favicon using the existing brand icon.
- Semantic headings.
- Descriptive image alt text.
- Sitemap and robots.txt where appropriate.

Avoid backend dependencies, databases, server-side rendering and unnecessary external services.

## 8. GitHub Pages Deployment

Prepare the project for deployment to GitHub Pages.

The site lives in the `mark-o/` module of the `App-websites` repository (`https://github.com/RiverLabs-GH/App-websites`), so it deploys under a subpath such as `/App-websites/mark-o/`, not the domain root.

Requirements:

- Correct Vite base path configuration.
- Production build configuration.
- Relative asset handling.
- GitHub Actions deployment workflow (at `.github/workflows/` in the `App-websites` repo root, scoped to the `mark-o/` folder).
- README with local development and deployment instructions (update `/Users/vipinkp/PycharmProjects/App-websites/mark-o/README.md`).

The website must work when deployed under a GitHub repository subpath, not just at the root domain.

## 9. Design Quality Expectations

Do not produce a generic template.

Pay attention to:

- Visual rhythm between sections.
- Consistent spacing.
- Typography scale.
- Screenshot proportions.
- Text-to-image balance.
- CTA hierarchy.
- Visual storytelling.
- Section transitions.

Every section must have a clear purpose.

Keep the website content minimal, curated and meaningful.

Avoid:
- Long paragraphs.
- Repeated marketing statements.
- Fake testimonials.
- Fake ratings.
- Unsupported statistics.
- Unnecessary pricing sections.
- Generic stock imagery.
- Excessive cards.
- Unnecessary gradients.
- Generic AI-generated marketing language.

## 10. Execution Workflow

Work in the following stages.

**Stage 1 — Repository Discovery**

Inspect the repository and prepare the product discovery report.

Do not start implementation until the product positioning and important missing information have been resolved.

**Stage 2 — UX and Design Architecture**

Define:
- Target audience.
- Product messaging.
- Website sitemap.
- Section hierarchy.
- Visual direction.
- Design tokens.
- Screenshot and video placement.

Present the proposed structure for review.

**Stage 3 — Implementation**

Build the website using Vue 3, TypeScript and Vite.

Implement reusable components and responsive layouts.

Use actual repository assets.

**Stage 4 — Visual Refinement**

Review the website at desktop, tablet and mobile sizes.

Refine typography, whitespace, alignment, transitions and product showcase presentation.

The result should feel like a premium native Mac application website.

**Stage 5 — Validation**

Run the production build.

Check:
- Broken links.
- Missing assets.
- Console errors.
- Responsive behaviour.
- GitHub Pages base path.
- Image and video loading.
- SEO metadata.

Fix all identified issues.

**Stage 6 — Final Deliverables**

Provide:
- Completed source code.
- Production build.
- GitHub Pages deployment workflow.
- README.
- Summary of implemented sections.
- Any remaining information or assets required from me.

## Final Instruction

Think like a product designer first and a frontend developer second.

The website should sell the product through clarity, visual storytelling and a convincing demonstration of the actual application.

A visitor should understand what mark.O does within the first 5 seconds and understand why it is useful within the next 15 seconds.

Prioritise quality over complexity.

Start with repository discovery. Ask questions only when an important product detail cannot be established from the existing files.

---

## Visual Reference Websites

Use the following websites as design references. Study their actual layouts, visual hierarchy, typography, spacing, product showcase techniques and responsive behaviour.

1. Apple Mac — https://www.apple.com/mac/
   Primary reference for overall layout, whitespace, typography and product storytelling.

2. Linear — https://linear.app/
   Reference for sophisticated software marketing, subtle gradients and premium visual hierarchy.

3. Raycast — https://www.raycast.com/
   Reference for showcasing a native Mac application through actual UI screenshots and product demonstrations.

4. Craft — https://www.craft.do/
   Reference for document-centric presentation, typography and reading experiences.

5. Arc — https://arc.net/
   Reference for distinctive product identity and creative visual storytelling.

Do not copy these websites. Extract their strongest design principles and combine them into an original mark.O visual identity.

Priority:
- Apple for overall design language.
- Raycast for application showcase.
- Craft for document and reading experience.
- Linear for polish and animations.

The final website must feel like a premium macOS application website, not a generic SaaS template.

Use the existing mark.O screenshots, promotional video, logo and application assets as the actual product content.

If browser access is available, inspect the reference websites directly before implementing. If not, use the supplied references as design guidance rather than pretending to have inspected them.
