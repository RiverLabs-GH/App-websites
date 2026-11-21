<script setup lang="ts">
import { features } from '../data/content'
import AppWindow from './AppWindow.vue'
</script>

<template>
  <section :id="features.id" class="section features" aria-labelledby="features-title">
    <div class="container--wide">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ features.eyebrow }}</p>
        <h2 id="features-title" class="h2">{{ features.title }}</h2>
      </header>

      <article v-for="(r, i) in features.rows" :key="r.title" class="row" :class="{ 'row--flip': i % 2 === 1 }">
        <div class="row__copy" v-reveal>
          <p class="eyebrow">{{ r.eyebrow }}</p>
          <h3 class="h2 row__title">{{ r.title }}</h3>
          <p class="lead">{{ r.text }}</p>
          <ul class="ticks">
            <li v-for="t in r.list" :key="t">{{ t }}</li>
          </ul>
        </div>
        <div class="row__shot window-rise">
          <AppWindow :img="r.img" :titlebar="false" />
        </div>
      </article>

      <ul class="more">
        <li v-for="(m, i) in features.more" :key="m.title" v-reveal="i * 70">
          <h3 class="h3">{{ m.title }}</h3>
          <p>{{ m.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: clamp(2rem, 5vw, 5rem); align-items: center; }
.row + .row { margin-top: var(--s-9); }
.row--flip { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); }
.row--flip .row__copy { order: 2; }
.row__copy { display: grid; gap: var(--s-4); }
.row__title { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); }
.ticks { display: grid; gap: var(--s-2); margin-top: var(--s-2); color: var(--c-ink-2); }
.ticks li { position: relative; padding-left: 1.5rem; }
.ticks li::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 0.75rem; height: 1.5px; background: var(--c-ink-3); }
.more { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--s-7); margin-top: var(--s-9); padding-top: var(--s-7); border-top: 1px solid var(--c-line); }
.more h3 { margin-bottom: var(--s-2); }
.more p { color: var(--c-ink-2); }
@media (max-width: 960px) {
  .row, .row--flip { grid-template-columns: 1fr; }
  .row--flip .row__copy { order: 0; }
  .more { grid-template-columns: 1fr; gap: var(--s-6); }
}
</style>
