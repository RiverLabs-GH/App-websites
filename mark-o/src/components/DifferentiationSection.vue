<script setup lang="ts">
import { why } from '../data/content'
</script>

<template>
  <section class="section section--alt why" aria-labelledby="why-title">
    <div class="container">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ why.eyebrow }}</p>
        <h2 id="why-title" class="h2">{{ why.title }}</h2>
        <p class="lead why__lead">{{ why.lead }}</p>
      </header>
      <dl class="list">
        <div v-for="(it, i) in why.items" :key="it.title" class="item" v-reveal="i * 60">
          <dt class="h3">{{ it.title }}</dt>
          <dd>{{ it.text }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.why__lead { color: var(--c-ink); font-weight: 600; }
.list { border-top: 1px solid var(--c-line); }
.item { display: grid; grid-template-columns: 1fr 1.6fr; gap: var(--s-6); align-items: baseline; padding-block: var(--s-6); border-bottom: 1px solid var(--c-line); }
.item dt { font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem); letter-spacing: -0.025em; }
.item dd { margin: 0; font-size: var(--fs-lead); line-height: 1.4; color: var(--c-ink-2); letter-spacing: -0.01em; }
@media (max-width: 760px) { .item { grid-template-columns: 1fr; gap: var(--s-2); } }
</style>
