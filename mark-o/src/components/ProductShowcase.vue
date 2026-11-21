<script setup lang="ts">
import { computed, ref } from 'vue'
import { tour } from '../data/content'
import AppWindow from './AppWindow.vue'

const flowId = ref(tour.flows[0].id)
const stepIdx = ref(0)
const flow = computed(() => tour.flows.find((f) => f.id === flowId.value)!)
const step = computed(() => flow.value.steps[stepIdx.value])

function pick(id: string) { flowId.value = id; stepIdx.value = 0 }

// Arrow keys, Home and End move between tabs, as in a standard tablist.
// All tabs control the one shared panel below, which is the only panel in the page.
function onKey(e: KeyboardEvent, i: number) {
  const n = tour.flows.length
  const next =
    e.key === 'ArrowRight' ? (i + 1) % n
    : e.key === 'ArrowLeft' ? (i - 1 + n) % n
    : e.key === 'Home' ? 0
    : e.key === 'End' ? n - 1
    : -1
  if (next < 0) return
  e.preventDefault()
  pick(tour.flows[next].id)
  ;(document.getElementById(`tab-${tour.flows[next].id}`) as HTMLElement | null)?.focus()
}
</script>

<template>
  <section :id="tour.id" class="section section--dark on-dark showcase" aria-labelledby="tour-title">
    <div class="container--wide">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ tour.eyebrow }}</p>
        <h2 id="tour-title" class="h2">{{ tour.title }}</h2>
        <p class="lead">{{ tour.lead }}</p>
      </header>

      <figure class="film window-rise">
        <video
          controls preload="none" playsinline :poster="tour.video.poster" :aria-label="tour.video.label"
        >
          <source :src="tour.video.src" type="video/mp4" />
          Your browser cannot play this video.
        </video>
        <figcaption>{{ tour.video.note }}</figcaption>
      </figure>

      <div class="steps" v-reveal>
        <div class="tabs" role="tablist" aria-label="Product tour">
          <button
            v-for="(f, i) in tour.flows" :id="`tab-${f.id}`" :key="f.id" role="tab" type="button"
            :aria-selected="f.id === flowId" aria-controls="tour-panel"
            :tabindex="f.id === flowId ? 0 : -1" :class="{ on: f.id === flowId }"
            @click="pick(f.id)" @keydown="onKey($event, i)"
          >{{ f.label }}</button>
        </div>

        <div id="tour-panel" role="tabpanel" :aria-labelledby="`tab-${flow.id}`" class="panel">
          <AppWindow :img="step.img" titlebar dark />
          <div class="panel__nav">
            <p class="panel__caption" aria-live="polite">{{ step.text }}</p>
            <div class="pager" role="group" aria-label="Steps">
              <button
                v-for="(s, i) in flow.steps" :key="i" type="button" :class="{ on: i === stepIdx }"
                :aria-label="`Step ${i + 1} of ${flow.steps.length}`" :aria-current="i === stepIdx ? 'step' : undefined"
                @click="stepIdx = i"
              >{{ i + 1 }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.film { max-width: 64rem; margin: 0 auto var(--s-9); }
.film video { width: 100%; aspect-ratio: 16 / 9; background: var(--c-black); border-radius: var(--r-window); box-shadow: var(--shadow-window-dark); }
.film figcaption { margin-top: var(--s-3); font-size: 0.8125rem; color: var(--c-on-dark-2); text-align: center; }
.steps { max-width: 66rem; margin-inline: auto; }
.tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-2); margin-bottom: var(--s-6); }
.tabs button {
  min-height: 2.5rem; padding: 0 1.1rem; border-radius: var(--r-pill); border: 1px solid var(--c-line-dark);
  background: transparent; color: var(--c-on-dark-2); font-size: 0.9375rem; font-weight: 500;
  transition: background var(--t-fast), color var(--t-fast), border-color var(--t-fast);
}
.tabs button:hover { color: var(--c-on-dark); border-color: var(--c-line-dark-hover); }
.tabs button.on { background: var(--c-on-dark); color: var(--c-black); border-color: var(--c-on-dark); }
.panel__nav { display: flex; align-items: center; justify-content: space-between; gap: var(--s-5); margin-top: var(--s-5); min-height: 3rem; }
.panel__caption { font-size: var(--fs-lead); letter-spacing: -0.01em; line-height: 1.35; max-width: 40rem; }
.pager { display: flex; gap: var(--s-2); flex-shrink: 0; }
.pager button {
  width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid var(--c-line-dark); background: transparent;
  color: var(--c-on-dark-2); font-variant-numeric: tabular-nums; font-size: 0.9375rem;
}
.pager button:hover { color: var(--c-on-dark); border-color: var(--c-line-dark-hover); }
.pager button.on { background: var(--c-on-dark); color: var(--c-black); border-color: var(--c-on-dark); }
@media (max-width: 640px) {
  .panel__nav { flex-direction: column; align-items: flex-start; }
}
</style>
