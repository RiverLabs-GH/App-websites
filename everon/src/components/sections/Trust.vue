<script setup lang="ts">
import { trust, capture, site } from '../../data/content'
import { useTheme } from '../../composables/useTheme'
import CaptureImage from '../ui/CaptureImage.vue'

const { theme } = useTheme()
</script>

<template>
  <section id="trust" class="section" data-group="features" aria-labelledby="trust-title">
    <div class="container">
      <div v-reveal class="head stack"><p class="eyebrow">{{ trust.eyebrow }}</p><h2 id="trust-title">{{ trust.title }}</h2></div>

      <div v-reveal class="limit" role="note">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
        <div><h3>{{ trust.limit.title }}</h3><p>{{ trust.limit.text }}</p><p class="mono">{{ trust.limit.note }}</p></div>
      </div>

      <div class="pillars">
        <article v-for="(p, i) in trust.pillars" :key="p.title" v-reveal="i * 80" class="card"><h3>{{ p.title }}</h3><p>{{ p.text }}</p></article>
      </div>

      <div class="split">
        <div v-reveal>
          <h3 class="sub">{{ trust.statesTitle }}</h3>
          <ul class="states">
            <li v-for="(s, i) in trust.states" :key="s.key" :style="{ '--i': i }">
              <span class="dot" :class="s.tone" aria-hidden="true" /><span class="w">{{ s.word }}</span><span class="t">{{ s.text }}</span>
            </li>
          </ul>
          <p class="caption">Wording from the app. Unknown is never styled as success.</p>
        </div>
        <div v-reveal="100">
          <CaptureImage :shot="capture('settings-safety', theme === 'dark' ? 'dark' : 'light', 'EverOn Safety and battery settings: warning and stop levels for the battery, the maximum session length and a warning before an indefinite session on battery.')" :caption="`${trust.safetyCaption} ${site.captureNote}`" />
        </div>
      </div>

      <p v-reveal class="honest"><strong>{{ trust.honest.title }}.</strong> {{ trust.honest.text }}</p>
    </div>
  </section>
</template>

<style scoped>
.head { max-width: 760px; } .limit { display: flex; gap: var(--s5); margin-top: var(--s8); padding: var(--s6); border-radius: var(--r-pop); background: var(--accent-soft); color: var(--accent-text); align-items: flex-start; }
.limit svg { flex: none; }
.limit > div > * + * { margin-top: var(--s2); } .limit h3, .limit p { color: var(--t1); } .limit .mono { color: var(--t2); font-size: .9375rem; }
.pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--s5); margin-top: var(--s6); } .pillars .card { display: grid; gap: var(--s2); align-content: start; }
.split { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(24px, 5vw, 72px); margin-top: var(--s10); align-items: center; }
.sub { margin-bottom: var(--s4); font-size: 1.375rem; letter-spacing: -.015em; }
.states { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s2); } .states li { display: grid; grid-template-columns: 14px 104px 1fr; gap: var(--s3); align-items: baseline; padding: var(--s3) var(--s4); border-radius: var(--r-card); background: var(--surface); box-shadow: var(--shadow-card); transition: transform var(--dur-base) var(--ease-out); } .states li:hover { transform: translateX(4px); }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--idle); align-self: center; } .dot.ok { background: var(--ok); } .dot.warn { background: var(--warn); } .dot.err { background: var(--err); }
.w { font-weight: 600; color: var(--t1); } .t { color: var(--t2); font-size: .9375rem; }
.honest { margin-top: var(--s9); max-width: 70ch; padding-top: var(--s5); border-top: 1px solid var(--line-strong); } .honest strong { color: var(--t1); }
@media (max-width: 900px) { .pillars, .split { grid-template-columns: 1fr; } .states li { grid-template-columns: 14px 1fr; } .states .t { grid-column: 2; } }
</style>
