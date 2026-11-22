<script setup lang="ts">
import { agents as a } from '../../data/content'
</script>

<template>
  <section id="agents" class="section" data-group="overview" aria-labelledby="agents-title">
    <div class="container grid">
      <div class="copy stack">
        <p v-reveal class="eyebrow">{{ a.eyebrow }}</p>
        <h2 id="agents-title" v-reveal>{{ a.title }}</h2>
        <p v-reveal class="lead">{{ a.text }}</p>
        <ul v-reveal class="pts"><li v-for="p in a.points" :key="p">{{ p }}</li></ul>
        <p v-reveal class="caveat" role="note">{{ a.caveat }}</p>
      </div>
      <figure v-reveal="100" class="flow">
        <figcaption class="cap"><span class="badge">{{ a.badge }}</span>{{ a.flowTitle }}</figcaption>
        <ol>
          <li v-for="(f, i) in a.flow" :key="f" :style="{ '--i': i }"><span class="mk" aria-hidden="true" /><span>{{ f }}</span></li>
        </ol>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
.copy > * + * { margin-top: var(--s4); } .lead { font-size: 1.125rem; color: var(--t2); }
.pts { padding: 0; list-style: none; display: grid; gap: var(--s3); } .pts li { position: relative; padding-left: 26px; }
.pts li::before { content: ""; position: absolute; left: 4px; top: .55em; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
.caveat { color: var(--t2); font-size: .9375rem; border-left: 3px solid var(--warn); padding-left: var(--s4); }
.flow { margin: 0; background: var(--surface); border-radius: var(--r-win); box-shadow: var(--shadow-card); padding: var(--s6); }
.cap { display: grid; gap: var(--s2); color: var(--t2); font-size: .9375rem; margin-bottom: var(--s5); }
.badge { justify-self: start; padding: 2px 10px; border-radius: var(--r-pill); background: var(--warn-soft); color: var(--warn); font-weight: 600; font-size: .8125rem; }
ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
.flow li { position: relative; display: flex; align-items: center; gap: var(--s4); padding: var(--s4) 0; }
.flow li + li::before { content: ""; position: absolute; left: 9px; top: -50%; height: 100%; width: 2px; background: var(--line-strong); }
.mk { position: relative; z-index: 1; width: 20px; height: 20px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); flex: none; }
.mk::after { content: ""; position: absolute; inset: 3px; border-radius: 50%; background: var(--accent); opacity: 0; }
.js .mk::after { animation: ev-agent-step 10s var(--ease-out) infinite; animation-delay: calc(var(--i) * 2s); }
@keyframes ev-agent-step { 0%, 18% { opacity: 1; transform: scale(1); } 22%, 100% { opacity: 0; transform: scale(.4); } }
@media (prefers-reduced-motion: reduce) { .js .mk::after { animation: none; opacity: 1; } }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>
