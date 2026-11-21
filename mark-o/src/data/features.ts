// The full feature catalogue, as supplied by the product owner (106 features in 13 groups).
// Three entries are worded differently from the supplied list, to stay true to the mark.O repo:
//   Export as PDF   the repo's docs say callouts and coloured text appear unstyled in a PDF
//   Document themes the source has GitHub and Solarized in light and dark, plus four single themes
//   Native menus    no Windows build is published, so the site does not mention Windows
// Each description must stay within 30 words (checked by tools/check-dist.mjs).

export interface Feature { name: string; text: string }
export interface FeatureGroup { id: string; pillar: 'markdown' | 'okf'; tab: string; title: string; features: Feature[] }

const f = (name: string, text: string): Feature => ({ name, text })

// Words the catalogue shows around the features, kept here with the data (not in the component).
export const catalogCopy = {
  eyebrow: 'Everything in mark.O',
  titleRest: 'features, by what you do with them',
  groupsLabel: 'Feature groups',
  countNoun: 'features',
}

export const featurePillars = [
  { id: 'markdown', label: 'Markdown Reader' },
  { id: 'okf', label: 'OKF Reader' },
] as const

export const featureGroups: FeatureGroup[] = [
  {
    id: 'reading', pillar: 'markdown', tab: 'Reading and rendering', title: 'Reading and rendering',
    features: [
      f('GitHub Flavored Markdown', `Tables, task lists, strikethrough, nested lists and fenced code render the moment a file opens.`),
      f('Syntax highlighting', `Fenced code is coloured by highlight.js, bundled with the app and working fully offline.`),
      f('Math with KaTeX', `Inline and display equations typeset beautifully, with no network call.`),
      f('Mermaid diagrams', `Flowcharts, sequence, state and data-model diagrams are drawn in place from plain text.`),
      f('GitHub-style alerts', `NOTE, TIP, IMPORTANT, WARNING and CAUTION blocks render as styled callouts.`),
      f('Coloured callouts and text', `Seven colours through ::: blocks and {color:green}(text) spans, tuned to every theme.`),
      f('Extended inline marks', `==Highlight==, underline, superscript and subscript render in the preview and the editor.`),
      f('Raw HTML in notes', `Inline HTML renders in the preview, and aligned blocks like <p align="center"> are honoured.`),
      f('Front matter handling', `YAML front matter stays out of the rendered page, with title and tags shown in a header.`),
      f('Image embedding', `Local and remote images render; photo.png#50 "caption" sets width and caption in plain Markdown.`),
      f('Reading outline', `A live H1 to H3 outline with scroll-spy, collapsible sections and a section jump menu.`),
      f('Reading progress', `"Section N of M", percent read and a progress bar keep your place in long documents.`),
      f('Document statistics', `Word, character and line counts and an estimated read time sit under every document.`),
      f('Zoom', `Scale the document from 70% to 160% and return to actual size with one shortcut.`),
      f('Reading layout options', `Centre headings and justify text in the preview only; the .md file is never changed.`),
      f('Auto-reload', `Open files refresh when changed on disk, with a visible notice and no reopening.`),
    ],
  },
  {
    id: 'writing', pillar: 'markdown', tab: 'Writing and editing', title: 'Writing and editing',
    features: [
      f('Source editor', `A CodeMirror 6 editor with line numbers, optional line wrap and Markdown-aware highlighting.`),
      f('Live editing', `Text appears formatted as you type; Markdown marks show only at the caret and the file stays plain.`),
      f('Edit and Preview modes', `Toggle between the editor beside a live, resizable preview and a clean reading view.`),
      f('Formatting toolbar', `Text style, bold, italic, strike, code, link, lists, tasks, indent, quote, code and math blocks.`),
      f('Vim and Emacs keys', `Switch the editor to Vim or Emacs key bindings in Settings.`),
      f('List and quote continuation', `Press Enter and bullets, numbers, quotes and task lists carry on; an empty item ends the list.`),
      f('Find and replace', `Live match count, case toggle, next and previous, replace and replace-all as one undo step.`),
      f('Code language support', `Editor highlighting for JS, TS, JSON, HTML, CSS, Python, SQL, YAML, Markdown and shell fences.`),
      f('Math and callout colouring', `Math and ::: callouts are tinted in the source editor too, not only in the preview.`),
      f('Insert Image', `Choose, paste or drop an image; set alt text, caption, width and alignment (3 MB limit).`),
      f('Images saved beside the note', `Pasted and dropped images become files next to the document, linked by relative path.`),
      f('Embedded image folding', `Large base64 image data collapses to a short label in Live mode so text stays readable.`),
      f('Note header', `Edit title and tags in a header; every other front matter byte is kept exactly as written.`),
      f('Template library', `25 ready-to-edit notes in five categories, from meeting minutes to Mermaid, with search.`),
      f('Font picker', `Choose body and code fonts from a bundled catalogue, with custom fonts validated before use.`),
      f('Save, Save As and autosave', `Autosave with a Saving and Saved pill, plus Save As and named snapshots on demand.`),
    ],
  },
  {
    id: 'organising', pillar: 'markdown', tab: 'Organising and finding', title: 'Organising and finding',
    features: [
      f('Tabs', `Open many notes in tabs; each remembers its scroll position and collapsed sections.`),
      f('Welcome screen', `A calm start with Open file, Open folder, New from Template and your recent notes.`),
      f('Drag and drop', `Drop Markdown files anywhere in the window to open them straight away.`),
      f('Open folder as a vault', `Open a folder and mark.O indexes up to 20,000 notes for links, tags and search.`),
      f('Open Recent', `The File menu and the Welcome list remember recent files; Clear Menu empties the list.`),
      f('Library', `Smart lists for All, Recent, Favourites and Trash, each with a count.`),
      f('Favourites', `Star the notes you return to and find them together in one list.`),
      f('Files tree', `Browse your folder as a tree and filter notes by name as you type.`),
      f('Spaces', `Group several folders into a named Space and switch between workspaces in one click.`),
      f('Tags', `A Tags tab lists every #tag and nested tag across the vault.`),
      f('In-app Trash', `Deleted notes wait in a Trash with restore, delete forever and empty, instead of vanishing.`),
      f('Reveal in Finder', `Jump from any open note straight to its file in Finder, to share, move or back it up.`),
    ],
  },
  {
    id: 'obsidian', pillar: 'markdown', tab: 'Obsidian support', title: 'Obsidian support',
    features: [
      f('Wikilinks', `[[note]] links with aliases, heading links and block links resolve across the vault.`),
      f('Embeds', `![[note]], ![[note#Heading]], ![[note#^id]] and ![[image]] pull content in place.`),
      f('Tags and block IDs', `#tags and ^block-id markers are recognised and indexed across the whole vault.`),
      f('Vault compatibility', `Open an Obsidian vault folder and the notes read as they were written, with no plugin.`),
    ],
  },
  {
    id: 'history', pillar: 'markdown', tab: 'Version history', title: 'Version history',
    features: [
      f('Version history', `Every version of a note is kept in a local SQLite timeline, the latest 500 per note.`),
      f('External edit tracking', `Edits made by other programs or agents are saved as their own labelled versions.`),
      f('Named snapshots', `Save a snapshot of the current note with an optional label, any time.`),
      f('Compare versions', `Side-by-side or unified diff with word-level highlights and a raw Markdown view.`),
      f('Jump between changes', `Step through "Change 2 of 5" while unchanged blocks fold away with a little context.`),
      f('Safe restore', `Restore any version in place; the current text is saved first, so a restore can be undone.`),
      f('Patch export', `Copy a diff as a standard unified patch or save it as a .patch file.`),
      f('Time Machine versions', `On macOS, older copies of a note from Time Machine backups appear in the timeline.`),
    ],
  },
  {
    id: 'export', pillar: 'markdown', tab: 'Export and sharing', title: 'Export and sharing',
    features: [
      f('Export as PDF', `Save the open note as a PDF to print or share. Callouts and coloured text appear unstyled in the PDF.`),
      f('Export as HTML', `One self-contained file with styles, fonts, diagrams and images inlined and no network needed.`),
      f('Export as EPUB', `An EPUB 3 book with navigation, images, MathML math and diagrams, checked by epubcheck.`),
    ],
  },
  {
    id: 'look', pillar: 'markdown', tab: 'Look and feel', title: 'Look and feel',
    features: [
      f('Document themes', `Eight built-in themes: GitHub and Solarized in light and dark, plus Nord, Dracula, One Light and Monokai.`),
      f('Appearance mode and tints', `Light, Dark or follow the system, plus five app tints from Pastel orange to Grass green.`),
      f('Custom themes', `Import your own JSON and CSS themes; they are validated and checked for contrast.`),
      f('Keyboard and accessibility', `Everything works from the keyboard, with visible focus and meaning never carried by colour alone.`),
      f('Native menus and shortcuts', `Native macOS menus, with shortcuts for the main actions.`),
      f('Settings', `General, Appearance, Editor, Files, Privacy and About, all in one overlay opened with ⌘,.`),
    ],
  },
  {
    id: 'privacy', pillar: 'markdown', tab: 'Privacy and files', title: 'Privacy and files',
    features: [
      f('Fully offline', `Math, diagrams, code highlighting and fonts all ship with the app; no CDN calls.`),
      f('No telemetry', `No analytics, no account and no tracking; the Settings switch is always shown Off.`),
      f('Plain files you own', `Notes stay as .md files in your own folders, so nothing is locked in.`),
      f('Launch at login', `An optional setting starts mark.O when you sign in, with a choice of update checks.`),
    ],
  },
  {
    id: 'okf-reading', pillar: 'okf', tab: 'Opening and reading', title: 'OKF bundles: opening and reading',
    features: [
      f('Bundle detection', `mark.O spots an OKF bundle, asks once whether to open it as one, and remembers per folder.`),
      f('Safe to open', `Opening a bundle writes nothing, and a plain folder behaves exactly as it did before.`),
      f('Bundle exclusions', `A .okfignore file keeps folders and files out of a bundle; the status bar says how many.`),
      f('Concept header', `Type, status, trust and freshness badges, with a plain-words banner when a concept needs a look.`),
      f('Sources panel', `Footnotes resolve to the concept's declared sources, so every claim leads somewhere.`),
      f('Bundle links and Cited by', `/path.md links resolve from the bundle root; each concept lists what cites it.`),
      f('Not written yet', `Links to files that don't exist show as ghosts and findings, never as broken errors.`),
      f('Bundle sidebar', `An index tree, quick filter, Types with counts, and lists of Stale and Draft concepts.`),
      f('log.md timeline', `The bundle log reads as a dated timeline instead of a wall of text.`),
      f('Computation card', `Attested computations show runtime, parameters and attester, and are never executed.`),
      f('Validation drawer', `Findings by severity with jump-to-line; problems are reported, and reading is never blocked.`),
    ],
  },
  {
    id: 'okf-writing', pillar: 'okf', tab: 'Writing and upkeep', title: 'OKF bundles: writing and upkeep',
    features: [
      f('Live validation', `Problems underline as you type, ](/ completes bundle links, and a Problems list tracks them.`),
      f('Properties form', `Edit type, tags, status and sources with the exact YAML shown; one field moves no other byte.`),
      f('New concept and bundle', `Six concept templates that start as drafts, and a wizard for an empty or tour bundle.`),
      f('Safe move and rename', `Preview every link line, rewrite links all or nothing, and undo the whole move at once.`),
      f('Index and log upkeep', `Regenerate index.md and append to log.md, with a preview before anything is written.`),
      f('Undo for bulk changes', `A toast undoes risky or bulk changes across every file they touched.`),
      f('Identity and actor stamping', `Optional stamping of who edited; the human id is a label you choose, not a login.`),
    ],
  },
  {
    id: 'okf-trust', pillar: 'okf', tab: 'Trust and time', title: 'OKF bundles: trust and time',
    features: [
      f('Review queue', `Needs review, filtered by Changed, Unverified, Machine only, Draft or Stale, with sorting.`),
      f('Verify', `One click stamps who confirmed a concept and when, and its badge becomes Human-reviewed.`),
      f('Agent-change detection', `Spots rewrites by agents and says who, labelling a best guess honestly as one.`),
      f('Diff since last verified', `Side-by-side changes with words marked since a person last checked the concept.`),
      f('Freshness tracking', `See what is going stale and extend many concepts by 30, 90 or 180 days with a logged reason.`),
      f('Deprecate with replacement', `Mark a concept deprecated and point readers to its replacement in one click.`),
      f('Bundle Home', `Answers "what needs a person today?" with counts that match the queue and recent activity.`),
      f('Trust badges everywhere', `The same advisory marks in sidebar, search, graph and lists; always a word and an icon.`),
    ],
  },
  {
    id: 'okf-exploring', pillar: 'okf', tab: 'Exploring', title: 'OKF bundles: exploring',
    features: [
      f('Knowledge graph', `Concepts coloured by type and ringed by trust, with orphans and ghost nodes standing out.`),
      f('Graph side panel', `Select a concept to see what cites it and what it links to, then open or edit it.`),
      f('Graph list view', `The same graph facts as a table, for anyone who prefers rows to nodes.`),
      f('Path-to', `Find the chain of links between two concepts, shown in words, on the graph and in the list.`),
      f('Focus mode', `Strip the graph down to one concept and its neighbours, from the keyboard.`),
      f('Graph filters', `Filter from the legend by type, and toggle ghosts, orphans and hop distance.`),
      f('Bundle search', `Filter by type, tag, status and trust, see counts on every choice, and save filters per bundle.`),
    ],
  },
  {
    id: 'okf-export', pillar: 'okf', tab: 'Export', title: 'OKF bundles: export',
    features: [
      f('Bundle export', `PDF, EPUB, HTML, zip or JSON in index.md order, with a live preview of what travels.`),
      f('Recipient filters', `Leave out drafts, types or tags, or keep only what a person has reviewed.`),
      f('Export validation gate', `Blocks on errors, with Open it to fix or Leave it out, so nothing broken ships.`),
      f('Bundle JSON export', `A structured JSON of the whole bundle for other programs, with a published schema.`),
    ],
  },
]

export const featureTotal = featureGroups.reduce((n, g) => n + g.features.length, 0)
export const pillarTotal = (id: string) => featureGroups.filter((g) => g.pillar === id).reduce((n, g) => n + g.features.length, 0)
