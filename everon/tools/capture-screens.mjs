// Captures the real EverOn app at 2x for the website (Stage 3 of website-build-prompt.md).
//
// It launches the BUILT app (EVERON_REPO/out) with the product repo's own Playwright launcher, in a throwaway user-data folder, and screenshots the
// popover and the main window in each state and theme. It does not modify the product repo.
//
// What is real and what is sample data (recorded in the manifest, and the captions on the site must say so):
//   - The UI, copy, layout and themes are the shipped app's own.
//   - Battery readings and rule conditions are injected through the app's own test door (EVERON_E2E hooks), because a test Mac has no
//     real discharge and no real external display. Rule names are sample names. Nothing here shows a real device, network or user.
//
// Usage:  node tools/capture-screens.mjs [outDir]
//   EVERON_REPO  product repo (default /Users/vipinkp/PycharmProjects/EverOn). Build it first: `npx electron-vite build` there.
//   outDir       default <module>/captures
import { pathToFileURL, fileURLToPath } from 'node:url';
import * as fs from 'node:fs';
import * as path from 'node:path';

const repo = process.env.EVERON_REPO ?? '/Users/vipinkp/PycharmProjects/EverOn';
const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(process.argv[2] ?? path.join(here, '..', 'captures'));
if (!fs.existsSync(path.join(repo, 'out', 'main', 'index.js'))) throw new Error(`No build in ${repo}/out. Run "npx electron-vite build" there first.`);
const { launchApp, waitFor } = await import(pathToFileURL(path.join(repo, 'tests', 'e2e', 'helpers', 'app.mjs')).href);
fs.mkdirSync(outDir, { recursive: true });

const THEMES = ['light', 'dark'];
const EXTRA_THEMES = ['midnight', 'arctic', 'oled', 'aurora']; // overview and popover only, for the themes strip
const manifest = [];
const failures = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ctx = await launchApp();
const { app, popover, window: win } = ctx;
const everon = (fn, arg) => app.evaluate(fn, arg);
const setTheme = async (theme) => { for (const p of [win, popover]) await p.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme); await sleep(250); };
const openPopover = async () => {
  if (await everon(() => globalThis.__everon.popover.isVisible())) return;
  await everon(() => { const { tray } = globalThis.__everon; tray.emit('click', {}, tray.getBounds()); });
  await waitFor(() => everon(() => globalThis.__everon.popover.isVisible()), { message: 'the popover to open' });
};
const nav = (text) => win.locator('#nav .nav-item', { hasText: text }).click();

/** Shoots one target in each theme. `target` is 'popover' or 'window'. */
async function shoot(id, target, state, note, themes = THEMES, claimsNote = '') {
  for (const theme of themes) {
    try {
      await setTheme(theme);
      const page = target === 'popover' ? popover : win;
      if (target === 'window') { await win.evaluate(() => document.getElementById('content')?.scrollTo(0, 0)); await sleep(150); }
      const file = `${id}-${theme}@2x.png`;
      await page.screenshot({ path: path.join(outDir, file) });
      const size = await page.evaluate(() => ({ w: innerWidth, h: innerHeight }));
      manifest.push({ id, target, state, theme, file, cssSize: size, scale: 2, note, ...(claimsNote ? { claimsNote } : {}) });
    } catch (e) { failures.push(`${id} ${theme}: ${e.message}`); }
  }
}
const step = async (name, fn) => { try { await fn(); } catch (e) { failures.push(`${name}: ${e.message}`); } };

try {
  await openPopover();
  const ac = { source: 'ac', percent: 82, charging: true, hasBattery: true };
  await everon((_, x) => globalThis.__everon.injectPower(x), ac);
  await sleep(600);

  // 1. Inactive
  await shoot('popover-inactive', 'popover', 'inactive', 'Sample power reading: 82%, charging (injected).');
  await nav('Overview'); await sleep(400);
  await shoot('overview-inactive', 'window', 'inactive', 'Sample power reading (injected).', [...THEMES, ...EXTRA_THEMES]);

  // 2. Active (1 hour, system + display)
  await step('start session', async () => {
    const r = await win.evaluate(() => window.api.session.start({ mode: 'both', kind: 'duration', durationMs: 3_600_000 }));
    if (!r.ok) throw new Error(JSON.stringify(r));
    await sleep(900);
  });
  await shoot('popover-active', 'popover', 'active, manual session, 1 hour', 'Countdown is live at capture time. Sample power reading (injected).', [...THEMES, ...EXTRA_THEMES]);
  await shoot('overview-active', 'window', 'active, manual session', 'Countdown is live at capture time.', [...THEMES, ...EXTRA_THEMES]);
  await step('session detail', async () => {
    await win.locator('[data-test="open-detail"]').click(); await sleep(700);
    await shoot('session-detail', 'window', 'active, reasons listed', 'Live session; countdown is live at capture time.');
    await nav('Overview'); await sleep(300);
  });

  // 3. Paused
  await step('pause', async () => { await win.evaluate(() => window.api.session.pause()); await sleep(700); });
  await shoot('popover-paused', 'popover', 'paused', '');
  await step('resume + stop', async () => { await win.evaluate(() => window.api.session.resume()); await sleep(300); await win.evaluate(() => window.api.session.stop()); await sleep(700); });

  // 4. Rules: two sample rules, conditions injected as met
  const rule = (id, name, conditions, mode) => ({ id, name, enabled: true, matchMode: 'all', conditions, action: { mode, maxDurationMs: null, stopWhenFalse: true, notify: false, sound: false }, schedule: null, priority: 50, safety: { batteryFloorPercent: null }, debounceMs: 0, minStableMs: 0, paused: false });
  await step('rules', async () => {
    const coding = rule('cap-coding', 'Coding session', [{ id: 'c1', type: 'app_running', parameters: { bundleId: 'com.apple.Terminal' } }], 'system');
    const work = rule('cap-work', 'Work display setup', [{ id: 'w1', type: 'external_display', parameters: {} }, { id: 'w2', type: 'ac_power', parameters: {} }], 'both');
    for (const t of [coding, work]) { const r = await everon((_, x) => globalThis.__everon.saveTrigger(x), t); if (r && r.ok === false) failures.push(`save ${t.name}: ${JSON.stringify(r)}`); }
    await everon((_, x) => globalThis.__everon.injectConditions(x), { 'app_running:com.apple.Terminal': 'met', external_display: 'not_met' });
    await sleep(1200);
  });
  await shoot('popover-rule-active', 'popover', 'held by a rule', 'Sample rule names; condition injected as met.', [...THEMES, 'midnight']);
  await nav('Automations'); await sleep(600);
  await shoot('automations-list', 'window', 'one rule active, one waiting', 'Sample rules and injected conditions.');
  await step('rule detail', async () => {
    await win.locator('[data-test="open-cap-coding"]').click(); await sleep(900);
    await shoot('rule-evaluator', 'window', 'live evaluator', 'Sample rule; injected condition.');
  });
  await step('new automation builder', async () => {
    await nav('Automations'); await sleep(300);
    await win.locator('[data-test="auto-new"]').click(); await sleep(700);
    await win.locator('input').first().fill('Coding session'); await sleep(300);
    // The builder offers an agent shortcut ("Keep awake while Claude Code CLI is working"). The agent rule is unverified (GAP-047), so
    // this capture must not be used on the site unless the unverified label is shown next to it. See claimsNote in the manifest.
    await shoot('rule-builder', 'window', 'builder, conditions (name typed, nothing saved)', 'Nothing saved.', THEMES, 'Shows the agent shortcut button without an "unverified" label: do not use on the site as is.');
    await nav('Overview'); await sleep(700); // leaving a changed builder asks "Discard your changes?"
    const discard = win.locator('button', { hasText: /Discard changes/i });
    if (await discard.count()) { await discard.click(); await sleep(500); }
  });

  // 5. History (a stopped session exists from step 3)
  await nav('History'); await sleep(700);
  await shoot('history', 'window', 'one session, stopped by the person', 'History holds only this capture run.', THEMES,
    'Shows an "Included in EverOn Pro" Insights card (Pro feature description) and "Showing the last 366 days", which conflicts with the 30-day Free decision (OQ-014). Do not use on the site until the app copy is corrected, or use the generated screen.');

  // 6. Sessions and presets, Diagnostics, Settings pages
  await nav('Sessions'); await sleep(600);
  await shoot('sessions-presets', 'window', 'built-in presets', '');
  await nav('Diagnostics'); await sleep(900);
  await shoot('diagnostics', 'window', 'helper running', 'Real helper in the capture run.');
  await nav('Settings'); await sleep(600);
  for (const s of ['general', 'appearance', 'safety', 'automation', 'notifications']) {
    await step(`settings ${s}`, async () => {
      await win.locator(`[data-test="section-${s}"]`).click(); await sleep(500);
      await shoot(`settings-${s}`, 'window', `settings, ${s}`, '', s === 'appearance' || s === 'safety' ? [...THEMES, 'midnight'] : THEMES);
    });
  }

  // 7. Battery warning (popover), then quick switcher and composer
  await everon((_, x) => globalThis.__everon.injectPower(x), { source: 'battery', percent: 18, charging: false, hasBattery: true });
  await sleep(900);
  await shoot('popover-battery-warning', 'popover', 'battery warning', 'Injected power reading: 18% on battery.');
  await everon((_, x) => globalThis.__everon.injectPower(x), ac); await sleep(500);
  await nav('Overview'); await sleep(300);
  await step('quick switcher', async () => { await win.keyboard.press('Meta+k'); await sleep(600); await shoot('quick-switcher', 'window', 'results shown', ''); await win.keyboard.press('Escape'); await sleep(300); });
  await step('composer', async () => {
    await win.locator('button', { hasText: 'New session' }).first().click(); await sleep(700);
    await shoot('composer', 'window', 'new session composer', 'Nothing started.'); await win.keyboard.press('Escape'); await sleep(300);
  });
  if (ctx.errors.length) failures.push(`renderer errors: ${JSON.stringify(ctx.errors)}`);
} finally { await ctx.cleanup(); }

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ capturedAt: new Date().toISOString(), repo, items: manifest, failures }, null, 2));
console.log(`${manifest.length} captures in ${outDir}`);
if (failures.length) { console.log('Needs attention:'); for (const f of failures) console.log(' -', f); }
