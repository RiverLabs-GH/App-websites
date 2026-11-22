<script setup lang="ts">
// Interactive, simulated rule evaluator (S09 in the app). Conditions are toggles; the reason line resolves the way the app words it.
import CaptureImage from '../ui/CaptureImage.vue'
import type { Capture } from '../../data/content'
import { ref, computed } from 'vue'
import { demos, hero } from '../../data/content'

defineProps<{ theme?: string; capture?: Capture }>()
const d = demos.rules
const on = ref<Record<string, boolean>>({ display: true, power: true, app: false })
const low = ref(false)
const met = computed(() => d.conditions.filter((c) => on.value[c.id]))
const missing = computed(() => d.conditions.filter((c) => !on.value[c.id]))
const list = (xs: { label: string }[]) => xs.map((x) => x.label.charAt(0).toLowerCase() + x.label.slice(1)).join(', ').replace(/, ([^,]*)$/, ' and $1')
const verdict = computed(() => {
  if (low.value && !missing.value.length) return { tone: 'err', chip: 'Battery low', text: d.limitsWin }
  if (!missing.value.length) return { tone: 'ok', chip: 'Active', text: d.active(list(met.value)) }
  return { tone: 'idle', chip: 'Not active', text: d.waiting(list(missing.value)) }
})
</script>

<template>
  <CaptureImage v-if="capture" :shot="capture" frame="window" />
  <div v-else class="ev-app rule" :data-theme="theme ?? 'light'">
    <div class="top"><span class="chip-demo">{{ hero.demoLabel }}</span><h3>{{ d.name }}</h3>
      <span class="state" :class="verdict.tone"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><circle v-if="verdict.tone === 'ok'" cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" /></svg>{{ verdict.chip }}</span></div>
    <p class="sum">{{ d.summary }}</p>
    <ul class="conds">
      <li v-for="c in d.conditions" :key="c.id" :class="{ met: on[c.id] }">
        <label><input type="checkbox" role="switch" v-model="on[c.id]" /><span class="sw" aria-hidden="true" /><span class="lbl">{{ c.label }}</span></label>
        <span class="badge" :class="on[c.id] ? 'ok' : 'idle'">{{ on[c.id] ? d.met : d.notMet }}</span>
      </li>
    </ul>
    <label class="low"><input type="checkbox" role="switch" v-model="low" /><span class="sw" aria-hidden="true" /><span class="lbl">{{ d.limitsToggle }}</span></label>
    <div class="why" :class="verdict.tone" aria-live="polite">
      <div class="wk">Why</div>
      <Transition name="swap" mode="out-in"><div :key="verdict.text" class="wt">{{ verdict.text }}</div></Transition>
      <div v-if="low" class="note">{{ d.limitsLabel }} · {{ d.limitsNote }}</div>
    </div>
  </div>
</template>

<style scoped>
.rule { background: var(--surface); color: var(--t1); border-radius: var(--r-pop); box-shadow: var(--shadow-win); padding: var(--s6); font: 400 var(--fs-md)/1.4 var(--font); display: grid; gap: var(--s4); text-align: left; }
.top { display: flex; align-items: center; gap: var(--s3); flex-wrap: wrap; } .top h3 { font-size: var(--fs-lg); font-weight: 600; letter-spacing: -.01em; flex: 1; min-width: 10ch; }
.chip-demo { font-size: var(--fs-sm); padding: 2px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-text); font-weight: 600; }
.state { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: var(--fs-sm); font-weight: 600; background: var(--idle-soft); color: var(--idle); transition: background var(--dur-base), color var(--dur-base); }
.state.ok { background: var(--ok-soft); color: var(--ok); } .state.err { background: var(--err-soft); color: var(--err); }
.sum { color: var(--t2); font-size: var(--fs-body); max-width: none; }
.conds { list-style: none; margin: 0; padding: 0; background: var(--surface-2); border-radius: var(--r-card); box-shadow: 0 0 0 .5px var(--line); }
.conds li { display: flex; align-items: center; justify-content: space-between; gap: var(--s3); padding: var(--s3) var(--s4); min-height: 52px; } .conds li + li { border-top: .5px solid var(--line-strong); }
label { display: inline-flex; align-items: center; gap: var(--s3); cursor: pointer; min-height: 44px; }
input[role="switch"] { position: absolute; opacity: 0; width: 44px; height: 44px; margin: 0; cursor: pointer; }
.sw { position: relative; flex: none; width: 36px; height: 22px; border-radius: 999px; background: var(--seg-bg); transition: background var(--dur-base) var(--ease-out); }
.sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .3); transition: transform var(--dur-base) var(--ease-spring); }
input:checked + .sw { background: var(--switch-on); } input:checked + .sw::after { transform: translateX(14px); }
input:focus-visible + .sw { outline: 2px solid var(--accent); outline-offset: 3px; }
.lbl { font-size: var(--fs-md); }
.badge { font-size: var(--fs-sm); font-weight: 600; padding: 2px 10px; border-radius: 999px; background: var(--idle-soft); color: var(--idle); transition: background var(--dur-base), color var(--dur-base); } .badge.ok { background: var(--ok-soft); color: var(--ok); }
.why { border-radius: var(--r-card); padding: var(--s4); background: var(--surface-2); box-shadow: 0 0 0 .5px var(--line); min-height: 92px; }
.why.ok { background: var(--ok-soft); } .why.err { background: var(--err-soft); }
.wk { font-size: var(--fs-sm); font-weight: 600; color: var(--t2); } .wt { font-size: var(--fs-md); font-weight: 600; margin-top: 2px; } .note { color: var(--t2); font-size: var(--fs-sm); margin-top: var(--s2); }
.swap-enter-active, .swap-leave-active { transition: opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out); } .swap-enter-from { opacity: 0; transform: translateY(var(--dist-sm)); } .swap-leave-to { opacity: 0; }
</style>
