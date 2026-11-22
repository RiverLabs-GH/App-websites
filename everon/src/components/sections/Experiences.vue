<script setup lang="ts">
import { experiences, capture, site } from '../../data/content'
import { useTheme } from '../../composables/useTheme'
import CaptureImage from '../ui/CaptureImage.vue'
import RuleDemo from '../screens/RuleDemo.vue'

const { theme } = useTheme()
const e = experiences
</script>

<template>
  <section id="experiences" class="section alt" data-group="overview" aria-labelledby="exp-title">
    <div class="container">
      <h2 id="exp-title" v-reveal class="title">{{ e.title }}</h2>
      <div class="cols">
        <article v-reveal class="col">
          <p class="eyebrow">{{ e.instant.eyebrow }}</p><h3 class="big">{{ e.instant.title }}</h3><p>{{ e.instant.text }}</p>
          <ul class="pts"><li v-for="p in e.instant.points" :key="p">{{ p }}</li></ul>
          <div class="shot"><CaptureImage frame="popover" :shot="capture('popover-active', theme, 'The EverOn popover with an active one-hour session, a countdown and a Stop session button.')" :caption="site.captureNote" /></div>
        </article>
        <article v-reveal="100" class="col">
          <p class="eyebrow">{{ e.automation.eyebrow }}</p><h3 class="big">{{ e.automation.title }}</h3><p>{{ e.automation.text }}</p>
          <ul class="pts"><li v-for="p in e.automation.points" :key="p">{{ p }}</li></ul>
          <div class="demo"><RuleDemo :theme="theme" /><p class="caption">{{ site.generatedNote }}</p></div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.alt { background: var(--surface-2); } .title { max-width: 18ch; margin-bottom: var(--s9); }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.col > * + * { margin-top: var(--s4); } .big { font-size: clamp(1.375rem, 1.1rem + 1vw, 1.875rem); letter-spacing: -.02em; }
.pts { padding: 0; list-style: none; display: grid; gap: var(--s2); } .pts li { position: relative; padding-left: 26px; color: var(--t1); }
.pts li::before { content: ""; position: absolute; left: 4px; top: .55em; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
.shot { max-width: 320px; margin-top: var(--s6); } .demo { margin-top: var(--s6); }
@media (max-width: 900px) { .cols { grid-template-columns: 1fr; } }
</style>
