<script setup lang="ts">
// Example timeline (S10 in the app, drawn from the spec because the real History capture shows Pro copy; see docs/stage-3-capture-report.md).
import CaptureImage from '../ui/CaptureImage.vue'
import type { Capture } from '../../data/content'
import { ref } from 'vue'
import { demos } from '../../data/content'
defineProps<{ theme?: string; capture?: Capture }>()
const d = demos.timeline
const sel = ref(0)
const span = (r: { start: number; end: number }) => ({ left: `${((r.start - 8) / 13) * 100}%`, width: `${((r.end - r.start) / 13) * 100}%` })
const hours = [8, 10, 12, 14, 16, 18, 20]
const dur = (r: { start: number; end: number }) => { const m = Math.round((r.end - r.start) * 60); return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min` }
</script>

<template>
  <CaptureImage v-if="capture" :shot="capture" frame="window" />
  <div v-else class="ev-app tl" :data-theme="theme ?? 'light'">
    <div class="top"><h3>{{ d.title }}</h3><span class="chip-demo">{{ d.note }}</span></div>
    <div class="axis" aria-hidden="true"><span v-for="h in hours" :key="h" :style="{ left: `${((h - 8) / 13) * 100}%` }">{{ String(h).padStart(2, '0') }}:00</span></div>
    <ul class="rows">
      <li v-for="(r, i) in d.rows" :key="r.time">
        <span class="name">{{ r.label }}<small>{{ r.source }}</small></span>
        <span class="track"><button type="button" class="blk" :class="{ on: sel === i }" :style="{ ...span(r), '--d': `${i * 90}ms` }" :aria-pressed="sel === i" :aria-label="`${r.label}, ${r.time}, ${dur(r)}`" @click="sel = i" /></span>
      </li>
    </ul>
    <div class="why" aria-live="polite"><div class="wk">{{ d.rows[sel].label }} · {{ d.rows[sel].time }} · {{ dur(d.rows[sel]) }}</div><div class="wt">{{ d.rows[sel].end_reason }}</div></div>
    <p class="hint">{{ d.hint }}</p>
  </div>
</template>

<style scoped>
.tl { background: var(--surface); color: var(--t1); border-radius: var(--r-pop); box-shadow: var(--shadow-win); padding: var(--s6); font: 400 var(--fs-md)/1.4 var(--font); display: grid; gap: var(--s3); text-align: left; }
.top { display: flex; justify-content: space-between; align-items: center; gap: var(--s3); } .top h3 { font-size: var(--fs-lg); font-weight: 600; }
.chip-demo { font-size: var(--fs-sm); padding: 2px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-text); font-weight: 600; }
.axis { position: relative; height: 16px; margin-left: 28%; } .axis span { position: absolute; transform: translateX(-50%); font-size: var(--fs-cap); color: var(--t3); font-variant-numeric: tabular-nums; }
.rows { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s2); }
.rows li { display: grid; grid-template-columns: 28% 1fr; align-items: center; gap: var(--s2); }
.name { display: flex; flex-direction: column; font-size: var(--fs-body); font-weight: 500; line-height: 1.2; } .name small { color: var(--t3); font-size: var(--fs-cap); font-weight: 400; }
.track { position: relative; height: 44px; border-radius: var(--r-ctl); background: var(--surface-2); box-shadow: 0 0 0 .5px var(--line); }
.blk { position: absolute; top: 6px; bottom: 6px; border: 0; border-radius: 6px; background: var(--accent-soft); box-shadow: inset 0 0 0 1.5px var(--accent); cursor: pointer; transform-origin: 0 50%; transition: background var(--dur-fast); min-width: 22px; }
.blk.on { background: var(--accent); } .blk:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.js .blk { animation: ev-grow var(--dur-slow) var(--ease-out) both; animation-delay: var(--d); }
@keyframes ev-grow { from { transform: scaleX(0); } to { transform: none; } }
.why { margin-top: var(--s2); border-radius: var(--r-card); padding: var(--s3) var(--s4); background: var(--surface-2); box-shadow: 0 0 0 .5px var(--line); min-height: 64px; } .wk { font-size: var(--fs-sm); font-weight: 600; color: var(--t2); } .wt { font-size: var(--fs-md); font-weight: 600; }
.hint { color: var(--t3); font-size: var(--fs-sm); max-width: none; }
@media (max-width: 520px) { .rows li { grid-template-columns: 1fr; gap: 2px; } .axis { margin-left: 0; } }
</style>
