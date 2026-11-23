<script setup lang="ts">
import { ref, computed } from 'vue'
import { features, workflows, capture, site } from '../../data/content'
import CaptureImage from '../ui/CaptureImage.vue'

const f = features
const flow = ref('all')
const shown = computed(() => f.items.filter((x) => flow.value === 'all' || x.workflows.includes(flow.value)))
const th = ref('light')
const alt = (kind: string, label: string) => `EverOn ${kind} in the ${label} theme.`
const themeNow = computed(() => th.value)
</script>

<template>
  <section id="features" class="section alt" data-group="features" aria-labelledby="features-title">
    <div class="container">
      <div v-reveal class="head stack"><h2 id="features-title">{{ f.title }}</h2><p class="lead">{{ f.lead }}</p></div>
      <div class="chips" role="group" :aria-label="f.filterLabel">
        <button v-for="w in workflows" :key="w.id" type="button" :aria-pressed="flow === w.id" @click="flow = w.id">{{ w.label }}</button>
      </div>
      <p class="sr" aria-live="polite">{{ shown.length }} features shown</p>
      <TransitionGroup tag="ul" name="fx" class="grid">
        <li v-for="x in shown" :key="x.id" class="card item">
          <h3>{{ x.title }}</h3><p>{{ x.text }}</p>
        </li>
      </TransitionGroup>

      <div v-reveal class="themes">
        <h3 class="sub">{{ f.themesTitle }}</h3>
        <div class="seg" role="radiogroup" aria-label="Preview a theme">
          <button v-for="t in f.themes" :key="t.id" type="button" role="radio" :aria-checked="th === t.id" :class="{ on: th === t.id }" @click="th = t.id">{{ t.label }}</button>
        </div>
        <div class="pair">
          <CaptureImage :shot="capture('overview-active', themeNow, alt('Overview', f.themes.find((t) => t.id === th)?.label ?? ''))" :caption="site.captureNote" />
          <div class="narrow"><CaptureImage frame="popover" :shot="capture('popover-active', themeNow, alt('popover', f.themes.find((t) => t.id === th)?.label ?? ''))" /></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.alt { background: var(--surface-2); } .head { max-width: 640px; }
.chips { display: flex; flex-wrap: wrap; gap: var(--s2); margin: var(--s7) 0 var(--s6); }
.chips button, .seg button { min-height: 44px; padding: 0 18px; border: 0; border-radius: var(--r-pill); background: var(--hover); color: var(--t2); font: 500 .9375rem var(--font); cursor: pointer; transition: background var(--dur-fast), color var(--dur-fast), transform var(--dur-fast) var(--ease-spring); }
.chips button:hover, .seg button:hover { background: var(--press); } .chips button:active { transform: scale(.97); }
.chips button[aria-pressed="true"], .seg button.on { background: var(--accent); color: var(--on-accent); }
.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--s4); position: relative; }
.item { display: grid; gap: var(--s2); align-content: start; background: var(--surface); } .item h3 { margin-top: var(--s2); }
.fx-enter-active, .fx-leave-active, .fx-move { transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
.fx-enter-from { opacity: 0; transform: translateY(var(--dist-md)); } .fx-leave-active { position: absolute; width: calc((100% - 2 * var(--s4)) / 3); } .fx-leave-to { opacity: 0; transform: scale(.96); }
.themes { margin-top: var(--s11); } .sub { font-size: 1.5rem; letter-spacing: -.015em; margin-bottom: var(--s4); }
.seg { display: flex; flex-wrap: wrap; gap: var(--s2); margin-bottom: var(--s6); }
.pair { display: grid; grid-template-columns: 1fr 260px; gap: var(--s6); align-items: start; } .narrow { align-self: center; }
@media (max-width: 900px) { .pair { grid-template-columns: 1fr; } .narrow { max-width: 280px; } }
@media (prefers-reduced-motion: reduce) { .fx-leave-active { position: static; } }
</style>
