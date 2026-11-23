// All visible copy for the EverOn site. The copy audit (tools/copy-audit.mjs) reads this file by absolute path.
// Source of truth for wording: EverOn docs/product/pitch-and-positioning.md (claims table) and docs/product/copy-deck.md.
import images from './images.json'

/** Asset URLs are relative so the site works under /App-websites/everon/. The /screens/ page sets window.__ASSET_BASE__ to '../'. */
export const asset = (p: string): string => `${(globalThis as { __ASSET_BASE__?: string }).__ASSET_BASE__ ?? './'}${p}`

export type Capture = { src: string; w: number; h: number; alt: string }
type ImageIndex = Record<string, { w: number; h: number; state: string; note: string; target: string }>
const index = images as ImageIndex

/** A real capture of the EverOn app (sample data), by id and theme. */
export function capture(id: string, theme: string, alt: string): Capture {
  const k = `${id}-${theme}`
  const meta = index[k] ?? index[`${id}-light`]
  return { src: asset(`images/app/${meta ? k : `${id}-light`}.webp`), w: meta?.w ?? 1760, h: meta?.h ?? 1152, alt }
}

export const site = {
  name: 'EverOn',
  title: 'EverOn: Keep Your Mac Awake for Long AI Coding Runs',
  description: 'EverOn is a menu-bar app for macOS. Set a rule once and it keeps your Mac awake for long AI coding runs, then lets go, with limits you set.',
  requirement: 'Built for macOS 13 or later',
  captureNote: 'Captured from the EverOn app, with sample data.',
  generatedNote: 'Interface shown from the EverOn design spec.',
}

// The parent company, as on the mark.O site (same name, link, contact and logo mark). The footer reads this, and the structured
// data's publisher must match it (npm run check fails if they disagree). The logo mark is a copy of the company site's own favicon.
export const company = {
  name: 'RiverLabs.io',
  byline: 'A RiverLabs.io product',
  url: 'https://river-labs.io/',
  email: 'riverlabs.io@gmail.com',
  logo: asset('brand/riverlabs-logo.svg'),
  copyright: 'Copyright © 2026 RiverLabs.io.',
}

// A sibling product from the same company. Its address follows this site's own base address (…/everon/ -> …/mark-o/).
const siteBase = (import.meta.env?.VITE_SITE_URL as string | undefined) ?? 'https://riverlabs-gh.github.io/App-websites/everon/'
export const markO = {
  name: 'mark.O',
  text: 'A private, offline Markdown workspace for macOS.',
  url: new URL('../mark-o/', siteBase).href,
}

export const nav = [
  { label: 'Overview', href: '#top', group: 'overview' },
  { label: 'Tour', href: '#tour', group: 'tour' },
  { label: 'Features', href: '#trust', group: 'features' },
]

export const hero = {
  eyebrow: 'A menu-bar app for macOS',
  title: 'Set it once. EverOn keeps your Mac awake for long AI coding runs, then lets go.',
  lead: 'A rule switches the hold on and off for you while your terminal or editor is open, with limits you set and a reason you can read. Prefer manual? Start a timed session in one click.',
  primary: 'Coming soon for Mac',
  secondary: 'See how it works',
  demoLabel: 'Interactive demo',
  demoHint: 'Try it. Nothing here touches your Mac.',
}

export const problem = {
  title: 'Long runs shouldn’t die when your Mac falls asleep.',
  lead: 'A long task looks idle to a Mac, because you are not touching the keyboard. So the Mac can sleep exactly when you have stepped away.',
  cards: [
    { title: 'Cut off while you are away', text: 'You hand a big task to an AI coding tool, close the lid on a meeting or go to lunch, and come back to a stalled run.' },
    { title: 'The switch you forgot', text: 'The usual fix is a keep-awake switch. It gives no reason and no limit, so it gets left on and the battery is flat in the morning.' },
  ],
  solution: 'EverOn treats staying awake as a decision you can see, bound and undo.',
}

export const experiences = {
  title: 'Set it once. Or take over in one click.',
  instant: {
    eyebrow: 'Instant control',
    title: 'One or two clicks from the menu bar',
    text: 'Pick 15 minutes, an hour or a time of day. Choose system sleep, display sleep or both. Pause, extend or stop at any moment.',
    points: ['15m, 1h or until a time', 'System, display or both', 'Pause, extend 15 min, stop'],
  },
  automation: {
    eyebrow: 'Automatic',
    title: 'Rules that configure the hold for you',
    text: 'Build a rule once, such as “keep the Mac awake while my terminal or editor is open”. EverOn holds when it opens and lets go when it closes, with no switch to remember. Rules can also watch power, a display or a schedule, and a reason line says why.',
    points: ['Set once, then hands-off', 'Rules by app, power, display and schedule', 'Profiles that group rules', 'A reason line in plain words'],
  },
}

export type TourStep = { id: string; label: string; title: string; text: string; shots: { light: Capture; dark: Capture }; kind: 'image' | 'timeline' }
const pair = (id: string, alt: string) => ({ light: capture(id, 'light', alt), dark: capture(id, 'dark', alt) })
export const tour = {
  eyebrow: 'Product tour',
  title: 'See what it is holding, and why.',
  lead: 'Four steps, shown with the real app.',
  steps: [
    { id: 'tour-start', label: 'Start', title: 'Start in one click', text: 'Open the menu-bar popover and start a session. The countdown, the mode and the reason are right there.', kind: 'image',
      shots: pair('popover-active', 'The EverOn popover with an active one-hour session: the status “EverOn is preventing idle sleep”, a countdown, the mode and the reason “Manual session”.') },
    { id: 'tour-understand', label: 'Understand', title: 'Know what is holding your Mac', text: 'Every hold lists its reasons and what it is holding. The status says Active only when EverOn can confirm it.', kind: 'image',
      shots: pair('session-detail', 'The EverOn session screen: the reason “Manual session”, the held system and display sleep, the helper running and the battery safeguard.') },
    { id: 'tour-automate', label: 'Automate', title: 'Let rules do the remembering', text: 'Each rule says whether it is active and why. “Active because an application is running”, or what is still needed.', kind: 'image',
      shots: pair('automations-list', 'The EverOn automations list with a rule that is active because an application is running and a rule that is not active yet.') },
    { id: 'tour-review', label: 'Review', title: 'Review what held your Mac', text: 'History and a timeline show what held the Mac, when, and why each hold ended.', kind: 'timeline',
      shots: pair('automations-list', 'Example timeline of holds and the reason each one ended.') },
  ] as TourStep[],
}

export const demos = {
  popover: {
    title: 'Quick control', inactive: 'No active session.', activeTitle: 'EverOn is preventing idle sleep.', pending: 'Starting…',
    paused: 'Paused. Your Mac can sleep normally until you resume.', start: 'Start session', stop: 'Stop session', pause: 'Pause', resume: 'Resume', extend: 'Extend 15 min',
    startFor: 'Or start for', durations: ['15m', '1h', '2h'], mode: 'Mode', modes: ['System', 'Display', 'Both'], remaining: 'Remaining', because: 'Active because', manual: 'Manual session',
    battery: 'Battery 82% · Charging', autoplay: 'Autoplay', pauseDemo: 'Pause demo', playDemo: 'Play demo',
    modeNote: { System: 'The Mac stays awake; the display may still turn off.', Display: 'The display stays awake.', Both: 'Keeps both the Mac and the display awake where macOS permits.' } as Record<string, string>,
  },
  rules: {
    title: 'Try a rule', lead: 'Switch the conditions on and off. The reason line follows.',
    name: 'Work display setup',
    conditions: [
      { id: 'display', label: 'An external display is connected' },
      { id: 'power', label: 'The power source is the AC adapter' },
      { id: 'app', label: 'An application is running' },
    ],
    summary: 'Keeps the Mac and the display awake while all three are true.',
    met: 'Met', notMet: 'Not met',
    active: (n: string) => `Active because ${n}.`,
    waiting: (n: string) => `Not active. Still needed: ${n}.`,
    limitsLabel: 'Battery 15% · On battery',
    limitsToggle: 'Pretend the battery is low',
    limitsWin: 'Stopped: battery below the critical level of 10%. Your Mac can sleep normally.',
    limitsNote: 'Limits always win, even over a rule.',
  },
  timeline: {
    title: 'Example day', note: 'Example data.',
    rows: [
      { time: '08:42', label: 'Coding session', source: 'Rule', start: 8.7, end: 12.4, end_reason: 'Ended: the rule no longer applies.' },
      { time: '13:05', label: 'System + display', source: 'Manual', start: 13.1, end: 14.1, end_reason: 'Ended: the time ran out.' },
      { time: '15:20', label: 'Work display setup', source: 'Rule', start: 15.3, end: 18.2, end_reason: 'Ended: the rule no longer applies.' },
      { time: '19:40', label: 'System awake', source: 'Manual', start: 19.7, end: 20.9, end_reason: 'Stopped by you.' },
    ],
    hint: 'Select a block to see why it ended.',
  },
}

export const agents = {
  eyebrow: 'Agent rule · optional, not yet verified',
  title: 'Built to follow your AI tool, starting with Claude Code.',
  text: 'An optional agent rule can watch the AI tool you choose, hold the Mac while it looks busy, and let go after a grace period you set. It is built, but not yet verified on real tools.',
  points: [
    'Claude Code first: with your agreement EverOn can add its hook lines, and remove them again.',
    'A grace period you set, 30 minutes by default, so a short pause doesn’t drop the hold.',
    'Limits still win: the maximum session length, battery stops and the global pause apply to every hold.',
  ],
  flowTitle: 'How the rule is meant to work.',
  flow: ['The tool looks busy', 'EverOn holds the Mac', 'The tool goes quiet', 'The grace period runs', 'EverOn lets go'],
  badge: 'Not yet verified on real tools',
  caveat: 'It can’t see inside SSH sessions, Docker or virtual machines, and a long silent phase can be missed. Until it is verified, rely on timed sessions and app rules.',
}

export const trust = {
  eyebrow: 'Trust and safety',
  title: 'Staying awake should be a decision you can see, bound and undo.',
  limit: {
    title: 'What EverOn can and can’t do',
    text: 'EverOn prevents supported idle sleep. It can’t override a closed lid, heat or a critical battery, and it says so in the app.',
    note: 'Lid closed — macOS may still put this Mac to sleep.',
  },
  pillars: [
    { title: 'Truthful status', text: 'Requested and active are different things. The status says Active only when EverOn can confirm it, and Unknown is never shown as success.' },
    { title: 'Safety by default', text: 'Every session has a maximum length. Battery thresholds warn you and then stop a hold, and one global pause releases everything. None of this sits behind a paid plan.' },
    { title: 'Private and offline', text: 'EverOn works offline, has no account and reads no file contents. Nothing is sent unless you turn on an alert you set up.' },
  ],
  states: [
    { key: 'active', word: 'Active', text: 'EverOn is preventing idle sleep.', tone: 'ok' },
    { key: 'inactive', word: 'Inactive', text: 'No active session.', tone: 'idle' },
    { key: 'paused', word: 'Paused', text: 'Paused. Your Mac can sleep normally until you resume.', tone: 'warn' },
    { key: 'unavailable', word: 'Unavailable', text: 'Requested, but native helper is unavailable.', tone: 'err' },
    { key: 'unknown', word: 'Unknown', text: 'Mac status is unknown.', tone: 'idle' },
  ],
  statesTitle: 'Five states, each in words',
  honest: {
    title: 'Honest about itself',
    text: 'The optional agent rule described above is built, but not yet verified on real tools. Timed sessions and app rules are what to rely on today.',
  },
  safetyCaption: 'Safety and battery settings.',
}

export type Feature = { id: string; title: string; text: string; workflows: string[] }
export const workflows = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'Long AI runs' },
  { id: 'present', label: 'Presentations' },
  { id: 'remote', label: 'Remote work' },
  { id: 'battery', label: 'Battery-conscious' },
  { id: 'everyday', label: 'Everyday' },
]
export const features = {
  title: 'Built around how you work.',
  lead: 'Filter by what you do.',
  filterLabel: 'Filter features by workflow',
  items: [
    { id: 'timed', title: 'Start in one click', text: 'Pick 15 minutes, an hour or a time of day from the menu bar, then pause, extend or stop whenever you like.', workflows: ['ai', 'present', 'everyday'] },
    { id: 'modes', title: 'Choose what stays awake', text: 'Keep the system awake, the display awake or both. The app explains the difference before you start.', workflows: ['ai', 'present', 'everyday'] },
    { id: 'apps', title: 'Hands-off with app rules', text: 'Name your terminal or editor once. EverOn holds the Mac while it is open and lets go when it closes.', workflows: ['ai'] },
    { id: 'agent', title: 'A rule for your AI tool', text: 'Claude Code first. It is optional and not yet verified on real tools, so lean on app rules today.', workflows: ['ai'] },
    { id: 'schedule', title: 'Rules that follow your day', text: 'Limit a rule to the days and times you work, and switch groups of rules on together as a profile.', workflows: ['remote', 'present'] },
    { id: 'reason', title: 'Always know why', text: 'A plain-words line says which rule or session is holding the Mac, and why a hold ended.', workflows: ['ai', 'present', 'remote', 'battery', 'everyday'] },
    { id: 'history', title: 'See what held your Mac', text: 'A timeline shows when each hold started, what caused it and why it stopped. The Free edition keeps 30 days.', workflows: ['ai'] },
    { id: 'limits', title: 'Limits that protect your battery', text: 'Set a maximum session length and battery warning and stop levels. One global pause releases everything at once.', workflows: ['battery', 'ai'] },
    { id: 'offline', title: 'Works offline, no account', text: 'EverOn makes no network call unless you turn on an alert you set up.', workflows: ['ai', 'battery', 'everyday', 'remote'] },
    { id: 'devices', title: 'Rules for your devices', text: 'Rules that react to a display, USB device, Wi-Fi, VPN, Bluetooth or audio. Tested with simulated devices.', workflows: ['remote'] },
    { id: 'alerts', title: 'Get a nudge when it matters', text: 'Send a short alert to an address you choose, or run a Shortcut. You can pair a receiver you run yourself.', workflows: ['ai', 'remote'] },
    { id: 'themes', title: 'Looks right in any light', text: 'System Adaptive, Midnight, Arctic, OLED Black and Aurora, each in light and dark.', workflows: ['everyday'] },
    { id: 'switcher', title: 'Keyboard first', text: 'Press ⌘K to start a session, jump to a page or pause automations without leaving the keyboard.', workflows: ['everyday', 'ai'] },
  ] as Feature[],
  themesTitle: 'Light, dark and three more',
  themes: ['light', 'dark', 'midnight', 'arctic', 'oled', 'aurora'].map((t) => ({ id: t, label: ({ light: 'Light', dark: 'Dark', midnight: 'Midnight', arctic: 'Arctic', oled: 'OLED Black', aurora: 'Aurora' } as Record<string, string>)[t] })),
}

export const why = {
  title: 'More than an on and off switch.',
  lead: 'A basic toggle keeps the Mac awake. EverOn adds the parts that make that safe to leave running.',
  colToggle: 'A basic toggle',
  colEverOn: 'EverOn',
  rows: [
    { what: 'Why is my Mac awake?', toggle: 'It is on or off.', everon: 'A reason line in plain words.' },
    { what: 'A forgotten session', toggle: 'Runs until you remember.', everon: 'Every session has a maximum length.' },
    { what: 'Battery', toggle: 'No say.', everon: 'Warn and stop levels, and a critical level that always stops a hold.' },
    { what: 'Context', toggle: 'You switch it by hand.', everon: 'Rules by app, display, power and schedule.' },
    { what: 'Afterwards', toggle: 'No record.', everon: 'History and a timeline of what held the Mac.' },
    { what: 'Privacy', toggle: 'Varies.', everon: 'Offline by default, no account.' },
  ],
  figure: 'Quiet when idle: about 0.6 to 0.7% CPU on the Mac we measured.',
  trayTitle: 'The menu-bar icon shows five states',
  tray: [
    { key: 'active', label: 'Active' }, { key: 'inactive', label: 'Inactive' }, { key: 'paused', label: 'Paused' },
    { key: 'attention', label: 'Attention' }, { key: 'unknown', label: 'Unknown' },
  ],
}

export const finalCta = {
  title: 'Coming soon for Mac.',
  text: 'EverOn is a menu-bar app for macOS. A download link will appear here when it is ready.',
  button: 'Coming soon for Mac',
  requirement: site.requirement,
}

export const footer = { product: 'EverOn, the intelligent keep-awake companion for macOS.', alsoLabel: 'Also from RiverLabs.io', contactLabel: 'Contact', copyright: company.copyright, top: 'Back to top' }

export const featureList = [
  'Timed and until-a-time keep-awake sessions from the menu bar',
  'System, display or both',
  'Rules that keep the Mac awake while a chosen app is open, set once',
  'A plain-words reason for every hold',
  'Maximum session length, battery stops and a global pause',
  'Works offline with no account',
]
