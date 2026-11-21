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
          {{ tour.video.fallback }}
        </video>
        <figcaption>{{ tour.video.note }}</figcaption>
      </figure>

      <div class="steps" v-reveal>
        <div class="tabs" role="tablist" aria-label="Product tour">
          <button
            v-for="(f, i) in tour.flows" :id="`tab-${f.id}`" :key="f.id" role="tab" type="button" class="btn btn--md btn--quiet"
            :aria-selected="f.id === flowId" aria-controls="tour-panel"
            :tabindex="f.id === flowId ? 0 : -1" :class="{ on: f.id === flowId }"
            @click="pick(f.id)" @keydown="onKey($event, i)"
          >{{ f.label }}</button>
        </div>

        <div id="tour-panel" role="tabpanel" :aria-labelledby="`tab-${flow.id}`" class="panel">
          <AppWindow :img="step.img" titlebar dark />
          <div class="panel__nav">
            <p class="lead panel__caption" aria-live="polite">{{ step.text }}</p>
            <div class="pager" role="group" aria-label="Steps">
              <button
                v-for="(s, i) in flow.steps" :key="i" type="button" class="btn btn--md btn--round btn--quiet" :class="{ on: i === stepIdx }"
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
.film figcaption { margin-top: var(--s-3); font-size: var(--fs-eyebrow); color: var(--c-on-dark-2); text-align: center; }
.steps { max-width: 66rem; margin-inline: auto; }
.tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-2); margin-bottom: var(--s-6); }
.panel__nav { display: flex; align-items: center; justify-content: space-between; gap: var(--s-5); margin-top: var(--s-5); min-height: 3rem; }
.showcase .panel__caption { color: var(--c-on-dark); max-width: 40rem; }
.pager { display: flex; gap: var(--s-2); flex-shrink: 0; }
@media (max-width: 640px) {
  .panel__nav { flex-direction: column; align-items: flex-start; }
}
</style>
