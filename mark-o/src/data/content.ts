// All site copy and asset references live here. Every claim is taken from the mark.O repo
// (README, docs/product/*, docs/engineering/features.md). Do not add claims that are not there.
import dims from './images.json'

// Always relative (vite.config.ts sets base './'). Do not use import.meta.env.BASE_URL here:
// the SSR build resolves it to '/', which would break the prerendered HTML under a subpath.
const base = './'
export const asset = (p: string) => `${base}${p}`

export interface Img { src: string; width: number; height: number; alt: string }
export function image(key: string, alt: string): Img {
  const [width, height] = (dims as Record<string, number[]>)[key]
  return { src: asset(`images/${key}.webp`), width, height, alt }
}

/** Flip `enabled` to true once the release is publicly reachable. Nothing else needs to change. */
export const download = {
  enabled: false,
  url: 'https://github.com/RiverLabs-GH/mark.O/releases/tag/v0.1.0',
  label: 'Download for Mac',
  pendingLabel: 'Coming soon for Mac',
}

export const site = {
  name: 'mark.O',
  tagline: 'Read. Write. Organise.',
  description: 'A private, offline Markdown workspace for macOS.',
  year: 2026,
}

// The parent company. The footer, the structured data, the author meta tag and the 404 page all read this.
const companyLogoPath = 'images/riverlabs-logo.svg'

export const company = {
  name: 'RiverLabs.io',
  byline: 'A RiverLabs.io product',
  url: 'https://river-labs.io/',
  email: 'riverlabs.io@gmail.com',
  // The logo mark, copied from the company's own site (https://river-labs.io/favicon.svg).
  // Decorative: it always sits inside a link whose text already says the company name.
  logoPath: companyLogoPath,
  logo: { src: asset(companyLogoPath), width: 32, height: 32, alt: '' } as Img,
}

export const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Who it’s for', href: '#for-everyone' },
  { label: 'Features', href: '#features' },
  { label: 'Product tour', href: '#tour' },
]

export const hero = {
  eyebrow: site.tagline,
  title: 'Your agents write Markdown. Read it like it matters.',
  lead: 'mark.O is a private, offline Markdown workspace for Mac. Read it properly, edit it live, keep every version, and review what your agents change.',
  audience: 'Made for anyone who gets a Markdown file and just wants to read it: product managers, analysts, writers and team leads.',
  secondaryCta: { label: 'Watch the film', href: '#tour' },
  image: image('read', 'mark.O showing an agent-written market research brief, rendered with an outline, a callout and a table.'),
}

export const problem = {
  id: 'overview',
  eyebrow: 'The problem',
  title: 'Agent output arrives as files. Most tools show you text.',
  lead: 'The work comes back as Markdown, and more of what your agents know is Markdown too. You read it, correct it, approve it and send it on.',
  groups: [
    {
      heading: 'Any Markdown file or folder',
      rows: [
        { pain: 'Forty lines of raw #, | and ---.', fix: 'Tables, diagrams, math and code render the moment the file opens.' },
        { pain: 'It rewrote a file you had already edited.', fix: 'Edits made outside the app are kept as their own versions. Compare any two, side by side.' },
        { pain: 'It reworked the plan and the old one is gone.', fix: 'Restore any earlier version in one click.' },
        { pain: 'You need to pass the result to a colleague.', fix: 'Export to PDF, HTML or EPUB in one step.' },
      ],
    },
    {
      heading: 'A folder of agent-written knowledge',
      rows: [
        { pain: 'Four hundred concepts, and nobody can say how they connect.', fix: 'See the whole bundle as a graph. Orphans and missing links stand out.' },
        { pain: 'An agent edited a metric last night and nothing says so.', fix: 'It lands in a review queue. Open the diff, then verify it.' },
        { pain: 'A runbook was true in March.', fix: 'Freshness dates show what is going stale, and you extend or deprecate it.' },
      ],
    },
  ],
}

// The non-technical reader. Positioning supplied by the product owner; every feature named here
// is already in the catalogue (render on open, outline and find, export, versions, offline, no account).
export const audience = {
  id: 'for-everyone',
  eyebrow: 'For everyone',
  title: 'Not a developer? Open a Markdown file and just read it.',
  lead: 'Markdown is the plain-text format that AI tools and developers write in. In the wrong app it looks like clutter. mark.O shows it as the finished document, and you do not need to know Markdown to read it.',
  before: {
    label: 'In a plain-text app',
    sample: [
      '# Q3 market brief',
      '',
      '## What changed',
      '- **Pricing:** two rivals cut prices',
      '- Demand is *steady* in Europe',
      '',
      '| Region | Share |',
      '|--------|-------|',
      '| Europe | 42%   |',
      '| US     | 31%   |',
    ].join('\n'),
  },
  after: {
    label: 'In mark.O',
    img: image('read', 'mark.O showing an agent-written market research brief, rendered with an outline, a callout and a table.'),
  },
  tasksTitle: 'What you can do with it',
  tasks: [
    { title: 'Read it', text: 'It looks like a document the moment it opens. Tables, diagrams and formulas are drawn, and a long report has an outline and find.' },
    { title: 'Share it', text: 'Export to PDF, HTML or EPUB, so people who do not have mark.O can open it too.' },
    { title: 'See what changed', text: 'Compare any two versions side by side, and bring an earlier one back in one click.' },
    { title: 'Keep it private', text: 'No account, no analytics, and it works offline. Your files stay in the folders you chose.' },
  ],
  rolesTitle: 'Who it helps',
  roles: [
    { title: 'Project managers', text: 'Read the plan, status report or spec someone wrote, and see what changed since you last looked.' },
    { title: 'Analysts and researchers', text: 'Open a brief with its tables and diagrams drawn, then export it when it is ready to share.' },
    { title: 'Writers and editors', text: 'Read drafts the way they will look, and keep every version in case you want the earlier one back.' },
    { title: 'Team leads', text: 'Check what has been reviewed and what has not, before you rely on it.' },
  ],
}

export interface Experience {
  id: string
  eyebrow: string
  title: string
  lead: string
  points: { title: string; text: string }[]
  main: Img
  extras?: { img: Img; caption: string }[]
  note?: string
}

export const markdownReader: Experience = {
  id: 'markdown-reader',
  eyebrow: 'Markdown Reader',
  title: 'Read any Markdown file or folder the way it was meant to be seen.',
  lead: 'Open a file and it reads like a finished document. Open a folder and work through it with tabs, an outline and find.',
  points: [
    { title: 'Everything renders', text: 'Tables, task lists, math, diagrams and highlighted code, all bundled so it works offline.' },
    { title: 'It keeps up with the agent', text: 'When a file changes on disk, mark.O refreshes it right there. No reopening.' },
    { title: 'Long reports, short trips', text: 'An outline with reading progress, tabs, and find in page.' },
    { title: 'Opens Obsidian vaults', text: 'Notes with [[links]], embeds, tags and callouts read correctly, so a vault opens as it was meant to.' },
  ],
  main: image('render', 'mark.O rendering a Markdown report with a math equation, a highlighted Python snippet and a flow diagram.'),
}

export const okfReader: Experience = {
  id: 'okf-reader',
  eyebrow: 'OKF Reader',
  title: 'An OKF reader for knowledge bundles, with a human in the loop.',
  lead: 'Open a folder of agent-written Markdown as an Open Knowledge Format bundle: a plain folder of linked notes with a standard shape. See it, review it, verify it, and keep it true.',
  points: [
    { title: 'Understand a bundle in a minute', text: 'Every concept shows its type, tags, status, trust level and freshness. Footnotes resolve to their sources, and “Cited by” shows what points here.' },
    { title: 'See the shape', text: 'A graph coloured by type and ringed by trust. Find the path between two concepts, or filter search by type, tag, status and trust.' },
    { title: 'Review before you rely on it', text: 'Changed concepts land in Needs review. Open the diff since the last human check, then Verify. The history keeps both versions.' },
    { title: 'Edit without fear', text: 'Change one front matter field and no other byte moves. A snapshot precedes every write, with Undo.' },
  ],
  main: image('okf-read', 'mark.O showing a metric concept in a knowledge bundle, with its type, trust and freshness badges, a stale banner and a Cited by list.'),
  extras: [
    { img: image('okf-graph', 'The bundle as a graph, with concepts coloured by type and ringed by trust, and a side panel listing what cites the selected concept.'), caption: 'The graph. Orphans stand out, and links to files not yet written appear as dashed nodes.' },
    { img: image('okf-diff', 'The Needs review screen showing a side-by-side diff of what changed since the last human check, with a Verify button.'), caption: 'Needs review. A side-by-side diff since the last human check, then Verify.' },
  ],
  note: 'Trust labels are advisory. They tell people what has been looked at; they are not security. OKF is an open specification, and mark.O is not affiliated with Google.',
}

export const tour = {
  id: 'tour',
  eyebrow: 'Product tour',
  title: 'See how mark.O reads and reviews agent output.',
  lead: 'A 73-second film, then the real screens, step by step.',
  video: {
    src: asset('videos/mark-o-launch-web.mp4'),
    poster: asset('videos/poster.jpg'),
    label: 'mark.O launch film, 73 seconds',
    note: 'The laptop in the film is stock footage from Pexels. mark.O is not affiliated with or endorsed by Apple.',
    fallback: 'Your browser cannot play this video.',
  },
  flows: [
    { id: 'detect', label: 'Open a bundle', steps: [
      { n: '000', text: 'Open a folder.', alt: 'The mark.O welcome screen, with Open Folder.' },
      { n: '001', text: 'mark.O notices it looks like a knowledge bundle and asks once how to open it.', alt: 'A dialog saying the chosen folder looks like an OKF bundle.' },
      { n: '002', text: 'Opened as a bundle. Opening writes nothing.', alt: 'The folder opened as a knowledge bundle.' },
    ] },
    { id: 'verify', label: 'Review and verify', steps: [
      { n: '000', text: 'An agent rewrote a concept. It lands in Needs review.', alt: 'A concept an agent has rewritten, with the Needs review entry in the bundle sidebar.' },
      { n: '001', text: 'Filter the queue by why: changed, unverified, machine only, draft or stale.', alt: 'The review queue, filtered by why each concept is there.' },
      { n: '002', text: 'See what changed since the last human check.', alt: 'A side-by-side view of what changed since the last human check.' },
      { n: '004', text: 'Verify. The concept is now human-reviewed, with Undo.', alt: 'The concept marked human-reviewed, with an Undo notice.' },
    ] },
    { id: 'graph', label: 'Explore the graph', steps: [
      { n: '000', text: 'The whole bundle as a graph.', alt: 'The whole bundle drawn as a graph.' },
      { n: '001', text: 'Select a concept to see what cites it and what it links to.', alt: 'A concept selected in the graph, with a panel listing what cites it and what it links to.' },
      { n: '004', text: 'Path to: the chain of links between two concepts.', alt: 'The chain of links between two concepts, shown in the graph.' },
    ] },
    { id: 'search', label: 'Search', steps: [
      { n: '001', text: 'Every concept, with filters by type, tag, status and trust.', alt: 'Bundle search listing every concept, with filters by type, tag, status and trust.' },
      { n: '003', text: 'Combine filters. Every choice shows a count.', alt: 'Bundle search filtered by type and by trust level.' },
    ] },
    { id: 'extend', label: 'Keep it fresh', steps: [
      { n: '000', text: 'Bundle home: what needs a person today.', alt: 'Bundle home, with the counts of what needs a person and the freshness table.' },
      { n: '002', text: 'Extend fresh-until by 30, 90 or 180 days, with a reason.', alt: 'The extend dialog with 90 days chosen and a reason for log.md.' },
      { n: '003', text: 'Done. A line goes to log.md.', alt: 'The concepts extended, with a line added to log.md.' },
    ] },
    { id: 'export', label: 'Export a bundle', steps: [
      { n: '000', text: 'Open Export from the Bundle tab.', alt: 'The Bundle tab with the Export button.' },
      { n: '002', text: 'A validation gate checks the bundle first. Choose a format.', alt: 'The export dialog with the validation gate clear and the zip format chosen.' },
      { n: '004', text: 'Exported.', alt: 'The export finished.' },
    ] },
  ].map((f) => ({
    ...f,
    steps: f.steps.map((s) => ({
      text: s.text,
      img: image(`demo/${f.id}-${s.n}`, s.alt),
    })),
  })),
}

export const features = {
  id: 'features',
  eyebrow: 'Features',
  title: 'Built around what you do with the file.',
  rows: [
    {
      eyebrow: 'Write',
      title: 'Stay in charge.',
      text: 'Edit the text yourself, right next to the live preview. Or switch to live mode and it renders as you type.',
      list: ['Split view with a resizable preview', 'Vim and Emacs key bindings', '25 templates, from meeting minutes to diagrams', 'A note header for title and tags that leaves other front matter alone'],
      img: image('edit', 'mark.O in split view, with Markdown source and front matter on the left and the rendered plan on the right.'),
    },
    {
      eyebrow: 'Keep every version',
      title: 'Know exactly what the agent did.',
      text: 'Version History is one timeline of auto-saves, outside edits, git commits and manual snapshots, stored in a local database.',
      list: ['Side-by-side or unified diffs, rendered as Markdown', 'Restore any version in one click', 'Your changes and the agent’s sit on one timeline'],
      img: image('history-panel', 'The Version History panel listing a coding agent edit, a research agent edit, a manual snapshot and an auto-save.'),
    },
  ],
}

export const why = {
  eyebrow: 'Why mark.O',
  title: 'Made for the moment the work comes back.',
  lead: 'AI drafts. You decide.',
  items: [
    { title: 'Trust', text: 'Nothing an agent wrote is trusted until a person has looked at it. Verify records who confirmed it, and when.' },
    { title: 'Time', text: 'See exactly what changed since you last checked, and go back to any version.' },
    { title: 'Safe to edit', text: 'Change one field and no other byte moves. Every write is snapshotted first.' },
    { title: 'Tolerant', text: 'It never refuses a bundle, a note or a field it does not understand. Problems are reported as findings.' },
  ],
}

export const privacy = {
  id: 'privacy',
  eyebrow: 'Private by design',
  title: 'Your notes never leave your Mac.',
  lead: 'mark.O runs entirely on your device. Your files stay plain .md files in the folders you choose.',
  facts: ['No account', 'No analytics', 'No telemetry', 'Works offline'],
  detail: 'Math, diagrams and syntax highlighting ship with the app, so nothing is fetched from a CDN at runtime.',
}

export const finalCta = {
  title: 'Open one agent-written file. Then open a bundle.',
  lead: 'You will see the difference in a minute.',
  meta: 'For macOS, Apple Silicon and Intel.',
  guide: {
    summary: 'First launch on a Mac',
    text: 'mark.O builds are not notarized yet. On first launch, right-click the app and choose Open. Or, in Terminal:',
    command: 'xattr -cr /Applications/mark.O.app',
  },
}

export const footer = {
  contactLabel: 'Contact',
  blurb: 'A private, offline Markdown workspace for macOS. Read. Write. Organise.',
  links: [
    { label: 'Overview', href: '#overview' },
    { label: 'Who it’s for', href: '#for-everyone' },
    { label: 'Markdown Reader', href: '#markdown-reader' },
    { label: 'OKF Reader', href: '#okf-reader' },
    { label: 'Product tour', href: '#tour' },
    { label: 'Features', href: '#features' },
    { label: 'Why mark.O', href: '#why' },
    { label: 'Private by design', href: '#privacy' },
  ],
  legal: 'mark.O is not affiliated with or endorsed by Google or Apple.',
}
