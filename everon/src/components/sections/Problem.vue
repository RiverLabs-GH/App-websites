<script setup lang="ts">
import { problem } from '../../data/content'
</script>

<template>
  <section id="problem" class="section" data-group="overview" aria-labelledby="problem-title">
    <div class="container">
      <div v-reveal class="head stack"><h2 id="problem-title">{{ problem.title }}</h2><p class="lead">{{ problem.lead }}</p></div>
      <div class="cards">
        <article v-for="(c, i) in problem.cards" :key="c.title" v-reveal="i * 80" class="card">
          <span class="ico" aria-hidden="true">
            <svg v-if="i === 0" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>
            <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5" /><circle cx="17" cy="12" r="2.5" /></svg>
          </span>
          <h3>{{ c.title }}</h3><p>{{ c.text }}</p>
        </article>
      </div>
      <p v-reveal class="solution">{{ problem.solution }}</p>
    </div>
  </section>
</template>

<style scoped>
.head { max-width: 760px; } .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--s5); margin-top: var(--s8); }
.card { display: grid; gap: var(--s3); align-content: start; transition: transform var(--dur-base) var(--ease-out); } .card:hover { transform: translateY(-3px); }
.ico { width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-text); }
.solution { margin-top: var(--s8); max-width: 30ch; color: var(--t1); font-size: clamp(1.375rem, 1rem + 1.4vw, 2rem); font-weight: 600; letter-spacing: -.02em; line-height: 1.2; }
@media (max-width: 760px) { .cards { grid-template-columns: 1fr; } }
</style>
