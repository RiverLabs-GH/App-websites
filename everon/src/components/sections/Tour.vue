<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { tour, site } from '../../data/content'
import { useTheme } from '../../composables/useTheme'
import CaptureImage from '../ui/CaptureImage.vue'
import TimelineDemo from '../screens/TimelineDemo.vue'

const { theme } = useTheme()
const active = ref(0)
const blocks = ref<HTMLElement[]>([])
const tabs = ref<HTMLElement[]>([])
const n = tour.steps.length
const progress = computed(() => (active.value + 1) / n)
let io: IntersectionObserver | null = null
const th = computed(() => (theme.value === 'dark' ? 'dark' : 'light'))

const go = (i: number, focus = false) => {
  active.value = i
  blocks.value[i]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
  history.replaceState(null, '', `#${tour.steps[i].id}`)
  if (focus) nextTick(() => tabs.value[i]?.focus({ preventScroll: true }))
}
const key = (e: KeyboardEvent, i: number) => {
  const k = e.key
  const next = k === 'ArrowRight' || k === 'ArrowDown' ? (i + 1) % n : k === 'ArrowLeft' || k === 'ArrowUp' ? (i - 1 + n) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1
  if (next >= 0) { e.preventDefault(); go(next, true) }
}
onMounted(() => {
  const i = tour.steps.findIndex((s) => `#${s.id}` === location.hash)
  if (i >= 0) { active.value = i; nextTick(() => blocks.value[i]?.scrollIntoView({ block: 'center' })) }
  if (typeof IntersectionObserver === 'undefined') return
  io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) active.value = blocks.value.indexOf(e.target as HTMLElement) }, { rootMargin: '-45% 0px -45% 0px' })
  blocks.value.forEach((b) => b && io!.observe(b))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <section id="tour" class="section" data-group="tour" aria-labelledby="tour-title">
    <div class="container">
      <div v-reveal class="head stack"><p class="eyebrow">{{ tour.eyebrow }}</p><h2 id="tour-title">{{ tour.title }}</h2><p class="lead">{{ tour.lead }}</p></div>
      <div class="tabs" role="tablist" aria-label="Tour steps">
        <button v-for="(s, i) in tour.steps" :id="`tab-${s.id}`" :key="s.id" :ref="(el) => { if (el) tabs[i] = el as HTMLElement }" type="button" role="tab" :aria-selected="active === i" :aria-controls="`panel-${s.id}`" :tabindex="active === i ? 0 : -1" @click="go(i)" @keydown="key($event, i)"><b>{{ i + 1 }}</b>{{ s.label }}</button>
        <span class="rail" aria-hidden="true"><i :style="{ transform: `scaleX(${progress})` }" /></span>
      </div>
      <div class="layout">
        <ol class="steps">
          <li v-for="(s, i) in tour.steps" :id="s.id" :key="s.id" :ref="(el) => { if (el) blocks[i] = el as HTMLElement }" class="step" :class="{ on: active === i }" :aria-current="active === i ? 'step' : undefined">
            <div class="txt"><p class="eyebrow">Step {{ i + 1 }}</p><h3 class="big">{{ s.title }}</h3><p>{{ s.text }}</p></div>
            <div class="inline"><TimelineDemo v-if="s.kind === 'timeline'" :theme="th" /><CaptureImage v-else :shot="s.shots[th]" :frame="i === 0 ? 'popover' : 'window'" /></div>
          </li>
        </ol>
        <div class="sticky" aria-hidden="false">
          <div class="screens">
            <div v-for="(s, i) in tour.steps" :id="`panel-${s.id}`" :key="s.id" class="panel" :class="{ on: active === i }" role="tabpanel" :aria-labelledby="`tab-${s.id}`" :inert="active !== i">
              <TimelineDemo v-if="s.kind === 'timeline'" :theme="th" />
              <CaptureImage v-else :shot="s.shots[th]" :frame="i === 0 ? 'popover' : 'window'" :class="{ narrow: i === 0 }" />
            </div>
          </div>
          <p class="caption">{{ tour.steps[active].kind === 'timeline' ? site.generatedNote : site.captureNote }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head { max-width: 640px; } .tabs { position: relative; display: flex; gap: var(--s2); margin: var(--s8) 0 var(--s6); padding-bottom: var(--s3); flex-wrap: wrap; }
.tabs button { min-height: 44px; display: inline-flex; align-items: center; gap: 10px; padding: 0 18px 0 8px; border: 0; border-radius: var(--r-pill); background: var(--hover); color: var(--t2); font: 500 .9375rem var(--font); cursor: pointer; transition: background var(--dur-fast), color var(--dur-fast); }
.tabs button b { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: var(--surface); font-size: .8125rem; color: var(--t2); transition: background var(--dur-base), color var(--dur-base); }
.tabs button[aria-selected="true"] { background: var(--surface); color: var(--t1); box-shadow: var(--shadow-card); } .tabs button[aria-selected="true"] b { background: var(--accent); color: var(--on-accent); }
.rail { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--line-strong); border-radius: 2px; overflow: hidden; } .rail i { display: block; height: 100%; background: var(--accent); transform-origin: 0 50%; transition: transform var(--dur-slow) var(--ease-out); }
.layout { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(24px, 5vw, 72px); align-items: start; }
.steps { list-style: none; margin: 0; padding: 0; } .step { min-height: 62vh; display: flex; align-items: center; }
.txt { position: relative; padding-left: var(--s5); } .txt::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 2px; background: var(--accent); opacity: 0; transform: scaleY(.25); transform-origin: 50% 0; transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out); } .step.on .txt::before { opacity: 1; transform: none; }
.txt > * + * { margin-top: var(--s3); } .big { font-size: clamp(1.5rem, 1.1rem + 1.3vw, 2.25rem); letter-spacing: -.02em; line-height: 1.12; }
.inline { display: none; }
.sticky { position: sticky; top: calc(var(--nav-h) + 24px); }
.screens { display: grid; } .panel { grid-area: 1 / 1; opacity: 0; transform: translateY(var(--dist-md)) scale(.985); pointer-events: none; transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out); } .panel.on { opacity: 1; transform: none; pointer-events: auto; }
.panel:not(.on) { visibility: hidden; transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out), visibility 0s var(--dur-slow); }
.narrow { max-width: 340px; margin-inline: auto; }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; } .sticky { display: none; } .txt { padding-left: 0; } .txt::before { display: none; } .step { min-height: 0; flex-direction: column; align-items: stretch; gap: var(--s5); padding-block: var(--s7); }
  .inline { display: block; } .inline :deep(figure) { max-width: 360px; }
}
@media (prefers-reduced-motion: reduce) { .panel { transform: none; } .txt::before { transform: none; transition: none; } }
</style>
