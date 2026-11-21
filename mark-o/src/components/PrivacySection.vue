<script setup lang="ts">
import { privacy } from '../data/content'
</script>

<template>
  <section :id="privacy.id" class="section section--dark on-dark privacy" aria-labelledby="privacy-title">
    <div class="container">
      <div class="section-head" v-reveal>
        <p class="eyebrow">{{ privacy.eyebrow }}</p>
        <h2 id="privacy-title" class="h2">{{ privacy.title }}</h2>
        <p class="lead">{{ privacy.lead }}</p>
      </div>
      <ul class="facts" v-reveal="80">
        <li v-for="f in privacy.facts" :key="f">{{ f }}</li>
      </ul>
      <p class="detail" v-reveal="120">{{ privacy.detail }}</p>
    </div>
  </section>
</template>

<style scoped>
.privacy { padding-block: clamp(4rem, 3rem + 5vw, 7rem); }
.privacy .section-head { margin-bottom: var(--s-7); }
.facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-4); max-width: 56rem; margin-inline: auto; }
.facts li {
  padding: var(--s-5) var(--s-3); text-align: center; font-size: var(--fs-h3); font-weight: 600; letter-spacing: -0.015em;
  border-top: 1px solid var(--c-line-dark);
}
.detail { margin: var(--s-6) auto 0; max-width: 36rem; text-align: center; color: var(--c-on-dark-2); font-size: 0.9375rem; }
@media (max-width: 760px) { .facts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
