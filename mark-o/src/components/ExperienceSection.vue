<script setup lang="ts">
import type { Experience } from '../data/content'
import AppWindow from './AppWindow.vue'

withDefaults(defineProps<{ data: Experience; tone?: 'alt' | 'plain'; flip?: boolean }>(), { tone: 'plain', flip: false })
</script>

<template>
  <section :id="data.id" class="section experience" :class="{ 'section--alt': tone === 'alt' }" :aria-labelledby="`${data.id}-title`">
    <div class="container--wide">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ data.eyebrow }}</p>
        <h2 :id="`${data.id}-title`" class="h2">{{ data.title }}</h2>
        <p class="lead">{{ data.lead }}</p>
      </header>

      <div class="stage" :class="{ 'stage--flip': flip }">
        <div class="stage__shot window-rise">
          <AppWindow :img="data.main" />
        </div>
        <ul class="points">
          <li v-for="(p, i) in data.points" :key="p.title" v-reveal="i * 70">
            <h3 class="h3">{{ p.title }}</h3>
            <p>{{ p.text }}</p>
          </li>
        </ul>
      </div>

      <div v-if="data.extras" class="extras">
        <figure v-for="e in data.extras" :key="e.caption" v-reveal>
          <AppWindow :img="e.img" titlebar />
          <figcaption>{{ e.caption }}</figcaption>
        </figure>
      </div>
      <p v-if="data.note" class="note" v-reveal>{{ data.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.stage { display: grid; grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr); gap: clamp(2rem, 4vw, 4rem); align-items: center; }
.stage--flip { grid-template-columns: minmax(0, 1fr) minmax(0, 1.9fr); }
.stage--flip .stage__shot { order: 2; }
.points { display: grid; gap: var(--s-6); }
.points h3 { margin-bottom: var(--s-2); }
.points p { color: var(--c-ink-2); }
.extras { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-6); margin-top: var(--s-9); }
.extras figcaption { margin-top: var(--s-4); font-size: 0.9375rem; color: var(--c-ink-3); max-width: 34rem; }
.extras figure { margin: 0; }
.note { max-width: var(--w-text); margin: var(--s-8) auto 0; text-align: center; font-size: 0.9375rem; color: var(--c-ink-3); }
@media (max-width: 960px) {
  .stage, .stage--flip { grid-template-columns: 1fr; }
  .stage--flip .stage__shot { order: 0; }
  .extras { grid-template-columns: 1fr; margin-top: var(--s-8); }
}
</style>
