<script setup lang="ts">
// The EverOn menu-bar popover, drawn from the app's real layout (see captures/popover-*.png) with the app's own tokens and copy.
// Presentational: the interactive wrapper (PopoverScreen) and the /screens catalogue both use it.
import { computed } from 'vue'
import { demos } from '../../data/content'

export type PopState = 'inactive' | 'pending' | 'active' | 'paused' | 'unknown' | 'unavailable' | 'battery' | 'rule'
const props = withDefaults(defineProps<{ state: PopState; theme?: string; mode?: string; clock?: string; progress?: number; interactive?: boolean; live?: boolean; fixed?: boolean }>(),
  { theme: 'light', mode: 'Both', clock: '1:00:00', progress: 0, interactive: false, live: true, fixed: false })
const emit = defineEmits<{ start: [secs: number]; stop: []; pause: []; resume: []; extend: []; mode: [m: string]; check: [] }>()
const d = demos.popover
const secs: Record<string, number> = { '15m': 900, '1h': 3600, '2h': 7200 }

const view = computed(() => {
  switch (props.state) {
    case 'pending': return { word: 'Pending', text: d.pending, tone: 'accent' }
    case 'active': return { word: 'Active', text: d.activeTitle, tone: 'ok' }
    case 'paused': return { word: 'Paused', text: d.paused, tone: 'warn' }
    case 'unknown': return { word: 'Unknown', text: 'Mac status is unknown.', tone: 'idle' }
    case 'unavailable': return { word: 'Unavailable', text: 'Requested, but native helper is unavailable.', tone: 'err' }
    case 'rule': return { word: 'No session', text: 'Keeping awake for 1 automation.', tone: 'idle' }
    default: return { word: 'Inactive', text: d.inactive, tone: 'idle' }
  }
})
const running = computed(() => props.state === 'active' || props.state === 'paused')
const battery = computed(() => (props.state === 'battery' ? { text: 'Battery 18% · On battery · Low', warn: true } : { text: d.battery, warn: false }))
const modeLabel = computed(() => ({ System: 'System', Display: 'Display', Both: 'Both' } as Record<string, string>)[props.mode] ?? props.mode)
</script>

<template>
  <div class="ev-app pop" :class="{ fixed }" :data-theme="theme" :aria-hidden="interactive ? undefined : 'true'">
    <div class="head">
      <span class="brand"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-text)" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2.6" fill="var(--accent-text)" stroke="none" /></svg>EverOn</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18" /></svg>
    </div>

    <div class="status" :class="view.tone">
      <span class="orb" aria-hidden="true">
        <i v-if="state === 'active'" class="pulse" />
        <svg v-if="state === 'paused'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M10 9v6M14 9v6" /></svg>
        <svg v-else-if="state === 'unknown'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="3 3"><circle cx="12" cy="12" r="8.5" /></svg>
        <svg v-else-if="state === 'unavailable'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5M12 16v.5" /></svg>
        <svg v-else-if="state === 'active'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" /></svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8.5" /></svg>
      </span>
      <div :aria-live="live ? 'polite' : 'off'">
        <div class="eyebrow">{{ view.word }}</div>
        <div class="line">{{ view.text }}</div>
        <div v-if="state === 'active'" class="sub">{{ mode === 'Both' ? 'System and display' : mode }} awake session is active.</div>
      </div>
    </div>

    <template v-if="running">
      <div class="count"><span class="t">{{ clock }}</span><span class="lbl">{{ d.remaining }}</span></div>
      <div class="bar" aria-hidden="true"><i :style="{ transform: `scaleX(${progress})` }" /></div>
      <div class="group">
        <div class="row"><span>{{ d.mode }}</span><span class="v">{{ modeLabel }}</span></div>
        <div class="row"><span>{{ d.because }}</span><span class="v">{{ d.manual }}</span></div>
      </div>
      <button class="btn primary" type="button" :tabindex="interactive ? 0 : -1" @click="emit('stop')">{{ d.stop }}</button>
      <div class="two">
        <button v-if="state === 'active'" class="btn" type="button" :tabindex="interactive ? 0 : -1" @click="emit('pause')">{{ d.pause }}</button>
        <button v-else class="btn" type="button" :tabindex="interactive ? 0 : -1" @click="emit('resume')">{{ d.resume }}</button>
        <button v-if="state === 'active'" class="btn" type="button" :tabindex="interactive ? 0 : -1" @click="emit('extend')">{{ d.extend }}</button>
      </div>
    </template>

    <template v-else>
      <div v-if="state === 'rule'" class="group block"><div class="blk-h">Automations</div><div class="blk-t">Kept awake by “Coding session”.</div><div class="btn ghost-btn" role="presentation">Pause automations and quit</div></div>
      <div v-if="state === 'unknown'" class="two"><span class="btn">Open Diagnostics</span><span class="btn" role="button" :tabindex="interactive ? 0 : -1" @click="emit('check')">Check again</span></div>
      <div v-else-if="state === 'unavailable'" class="two"><span class="btn">Repair helper</span></div>
      <button v-if="state !== 'unknown' && state !== 'unavailable'" class="btn primary" type="button" :disabled="state === 'pending'" :tabindex="interactive ? 0 : -1" @click="emit('start', 3600)">{{ d.start }}</button>
      <div v-if="state !== 'unknown' && state !== 'unavailable'" class="sec">{{ d.startFor }}</div>
      <div v-if="state !== 'unknown' && state !== 'unavailable'" class="chips">
        <button v-for="c in d.durations" :key="c" class="btn chip-b" type="button" :disabled="state === 'pending'" :tabindex="interactive ? 0 : -1" @click="emit('start', secs[c])">{{ c }}</button>
      </div>
      <div v-if="state !== 'unknown' && state !== 'unavailable'" class="sec">{{ d.mode }}</div>
      <div v-if="state !== 'unknown' && state !== 'unavailable'" class="seg" role="radiogroup" :aria-label="d.mode">
        <button v-for="m in d.modes" :key="m" type="button" role="radio" :aria-checked="mode === m" :class="{ on: mode === m }" :tabindex="interactive ? 0 : -1" @click="emit('mode', m)">{{ m }}</button>
      </div>
      <div v-if="state !== 'unknown' && state !== 'unavailable'" class="presets">
        <div class="ph"><span>Presets</span><span class="lk">Manage presets…</span></div>
        <div class="pt">No pinned presets yet. Pin favourites in Sessions and presets.</div>
      </div>
    </template>

    <div class="foot" :class="{ warn: battery.warn }">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path v-if="battery.warn" d="M12 8v5M12 16v.5" stroke-linecap="round" /></svg>
      {{ battery.text }}
    </div>
  </div>
</template>

<style scoped>
.pop { width: 320px; max-width: 100%; background: var(--surface); color: var(--t1); border-radius: var(--r-pop); box-shadow: var(--shadow-pop); font: 400 var(--fs-body)/1.4 var(--font); padding: var(--s4) var(--s4) 0; display: flex; flex-direction: column; gap: var(--s3); overflow: hidden; text-align: left; }
.pop.fixed { min-height: 472px; } /* the tallest state, so the card never changes height while the demo runs */
.head { display: flex; justify-content: space-between; align-items: center; }
.brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: var(--fs-md); }
.status { display: flex; gap: var(--s3); align-items: center; }
.orb { position: relative; flex: none; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--idle-soft); color: var(--idle); }
.ok .orb { background: var(--ok-soft); color: var(--ok); } .warn .orb { background: var(--warn-soft); color: var(--warn); } .err .orb { background: var(--err-soft); color: var(--err); } .accent .orb { background: var(--accent-soft); color: var(--accent-text); }
.pulse { position: absolute; inset: 0; border-radius: 50%; background: var(--ok); opacity: .3; animation: ev-pulse 2.4s var(--ease-out) infinite; }
.eyebrow { font-size: var(--fs-sm); font-weight: 600; color: var(--idle); } .ok .eyebrow { color: var(--ok); } .warn .eyebrow { color: var(--warn); } .err .eyebrow { color: var(--err); } .accent .eyebrow { color: var(--accent-text); }
.line { font-size: var(--fs-md); font-weight: 600; line-height: 1.3; } .sub { color: var(--t2); font-size: var(--fs-sm); margin-top: 2px; }
.count { display: flex; justify-content: space-between; align-items: baseline; margin-top: var(--s1); }
.t { font-size: var(--fs-count); font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; } .lbl { color: var(--t2); font-size: var(--fs-sm); }
.bar { height: 6px; border-radius: 3px; background: var(--seg-bg); overflow: hidden; } .bar i { display: block; height: 100%; background: var(--accent); transform-origin: 0 50%; transition: transform 1s linear; }
.group { background: var(--surface-2); border-radius: var(--r-card); box-shadow: 0 0 0 .5px var(--line); } .group.block { padding: var(--s3); display: grid; gap: var(--s2); }
.row { display: flex; justify-content: space-between; padding: var(--s3); } .row + .row { border-top: .5px solid var(--line-strong); } .v { color: var(--t2); }
.blk-h { color: var(--ok); font-weight: 600; font-size: var(--fs-sm); } .blk-t { color: var(--t2); font-size: var(--fs-sm); }
.btn { min-height: var(--ctl); display: inline-flex; justify-content: center; align-items: center; padding: 0 var(--s3); border-radius: var(--r-ctl); border: 0; background: var(--surface); color: var(--t1); box-shadow: var(--shadow-ctl); font: 500 var(--fs-body) var(--font); cursor: pointer; transition: transform var(--dur-instant) var(--ease), background var(--dur-fast); }
.btn:hover:not(:disabled) { background: var(--hover); } .btn:active:not(:disabled) { transform: scale(.98); } .btn:disabled { opacity: .55; cursor: default; }
.btn.primary { min-height: var(--ctl-lg); background: var(--accent); color: var(--on-accent); box-shadow: none; } .btn.primary:hover:not(:disabled) { background: var(--accent-press); }
.ghost-btn { cursor: default; } .two { display: flex; gap: var(--s2); } .two .btn { flex: 1; }
.sec { color: var(--t2); font-weight: 600; font-size: var(--fs-sm); margin-top: var(--s1); } .chips { display: flex; gap: var(--s2); } .chips .btn { flex: 1; }
.seg { display: flex; padding: 2px; border-radius: var(--r-ctl); background: var(--seg-bg); }
.seg button { flex: 1; min-height: 24px; border: 0; background: transparent; border-radius: 5px; color: var(--t2); font: 500 var(--fs-body) var(--font); cursor: pointer; transition: background var(--dur-fast), color var(--dur-fast); }
.seg button.on { background: var(--surface); color: var(--t1); box-shadow: var(--shadow-ctl); }
.presets { display: grid; gap: var(--s1); margin-top: var(--s1); } .ph { display: flex; justify-content: space-between; color: var(--t2); font-weight: 600; font-size: var(--fs-sm); } .lk { color: var(--accent-text); font-weight: 500; } .pt { color: var(--t2); font-size: var(--fs-sm); }
.foot { display: flex; align-items: center; gap: 8px; margin: auto calc(var(--s4) * -1) 0; padding: var(--s3) var(--s4); border-top: .5px solid var(--line-strong); color: var(--t2); font-size: var(--fs-sm); } .foot.warn { color: var(--warn); }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .pulse { animation: none; opacity: 0; } .bar i { transition: none; } }
</style>
