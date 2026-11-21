<script setup lang="ts">
import { finalCta } from '../data/content'
import DownloadButton from './DownloadButton.vue'
</script>

<template>
  <section id="get" class="section cta" aria-labelledby="cta-title">
    <div class="container cta__inner" v-reveal>
      <h2 id="cta-title" class="h2">{{ finalCta.title }}</h2>
      <p class="lead">{{ finalCta.lead }}</p>
      <div class="cta__action">
        <DownloadButton />
        <p class="meta">{{ finalCta.meta }}</p>
      </div>
      <details class="guide">
        <summary>{{ finalCta.guide.summary }}</summary>
        <p>{{ finalCta.guide.text }}</p>
        <pre><code>{{ finalCta.guide.command }}</code></pre>
      </details>
    </div>
  </section>
</template>

<style scoped>
.cta { background: linear-gradient(180deg, var(--c-bg) 0%, var(--c-bg-alt) 100%); }
.cta__inner { display: grid; justify-items: center; text-align: center; gap: var(--s-5); max-width: 48rem; }
.cta__action { display: grid; justify-items: center; gap: var(--s-3); margin-top: var(--s-3); }
.cta__action :deep(.btn) { min-height: 3.25rem; padding-inline: 2rem; font-size: 1.125rem; }
.meta { font-size: 0.875rem; color: var(--c-ink-3); }
.guide { margin-top: var(--s-5); max-width: 32rem; text-align: left; font-size: 0.9375rem; color: var(--c-ink-2); }
.guide summary { cursor: pointer; text-align: center; color: var(--c-ink); font-weight: 500; }
.guide p { margin-top: var(--s-3); }
.guide pre {
  margin: var(--s-3) 0 0; padding: var(--s-3) var(--s-4); border-radius: 10px; background: var(--c-ink); color: var(--c-on-dark);
  overflow-x: auto; font-size: 0.8125rem;
}
</style>
