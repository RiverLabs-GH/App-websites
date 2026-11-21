<script setup lang="ts">
import { problem } from '../data/content'
</script>

<template>
  <section :id="problem.id" class="section problem" aria-labelledby="problem-title">
    <div class="container">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ problem.eyebrow }}</p>
        <h2 id="problem-title" class="h2">{{ problem.title }}</h2>
        <p class="lead">{{ problem.lead }}</p>
      </header>

      <div v-for="g in problem.groups" :key="g.heading" class="group" v-reveal>
        <h3 class="group__title eyebrow">{{ g.heading }}</h3>
        <ul class="rows">
          <li v-for="r in g.rows" :key="r.pain" class="row">
            <p class="row__pain">{{ r.pain }}</p>
            <p class="row__fix">{{ r.fix }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.group + .group { margin-top: var(--s-8); }
.group__title { margin-bottom: var(--s-4); }
.rows { border-top: 1px solid var(--c-line); }
.row {
  display: grid; grid-template-columns: 1fr 1.25fr; gap: var(--s-6); align-items: baseline;
  padding-block: var(--s-5); border-bottom: 1px solid var(--c-line);
}
.row__pain { font-size: var(--fs-h3); font-weight: 600; letter-spacing: -0.015em; line-height: 1.25; color: var(--c-ink-3); }
.row__fix { font-size: var(--fs-lead); line-height: 1.4; letter-spacing: -0.01em; }
@media (max-width: 760px) {
  .row { grid-template-columns: 1fr; gap: var(--s-2); }
}
</style>
