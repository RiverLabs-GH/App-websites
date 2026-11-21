<script setup lang="ts">
import { why } from '../data/content'
</script>

<template>
  <section id="why" class="section section--alt why" aria-labelledby="why-title">
    <div class="container">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ why.eyebrow }}</p>
        <h2 id="why-title" class="h2">{{ why.title }}</h2>
        <p class="lead lead--strong">{{ why.lead }}</p>
      </header>
      <dl class="list">
        <div v-for="(it, i) in why.items" :key="it.title" class="item" v-reveal="i * 60">
          <dt class="h3 h3--lg">{{ it.title }}</dt>
          <dd class="lead">{{ it.text }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.list { border-top: 1px solid var(--c-line); }
.item { display: grid; grid-template-columns: 1fr 1.6fr; gap: var(--s-6); align-items: baseline; padding-block: var(--s-6); border-bottom: 1px solid var(--c-line); }
@media (max-width: 760px) { .item { grid-template-columns: 1fr; gap: var(--s-2); } }
</style>
