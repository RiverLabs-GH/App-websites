<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { why } from '../../data/content'
import TrayIcon from '../ui/TrayIcon.vue'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { useInView } from '../../composables/useInView'

const idx = ref(0)
const hold = ref(false)
const box = ref<HTMLElement | null>(null)
const { reduced } = useReducedMotion()
const { inView } = useInView(box, 0.3)
let t: ReturnType<typeof setInterval> | null = null
onMounted(() => { t = setInterval(() => { if (inView.value && !hold.value && !reduced.value) idx.value = (idx.value + 1) % why.tray.length }, 1800) })
onBeforeUnmount(() => { if (t) clearInterval(t) })
</script>

<template>
  <section id="why" class="section" data-group="features" aria-labelledby="why-title">
    <div class="container">
      <div v-reveal class="head stack"><h2 id="why-title">{{ why.title }}</h2><p class="lead">{{ why.lead }}</p></div>
      <div v-reveal class="wrap">
        <table>
          <thead><tr><th scope="col"><span class="sr">Question</span></th><th scope="col">{{ why.colToggle }}</th><th scope="col" class="ev">{{ why.colEverOn }}</th></tr></thead>
          <tbody><tr v-for="r in why.rows" :key="r.what"><th scope="row">{{ r.what }}</th><td :data-label="why.colToggle">{{ r.toggle }}</td><td class="ev" :data-label="why.colEverOn">{{ r.everon }}</td></tr></tbody>
        </table>
      </div>
      <p v-reveal class="fig">{{ why.figure }}</p>

      <div ref="box" v-reveal class="legend" @mouseenter="hold = true" @mouseleave="hold = false" @focusin="hold = true" @focusout="hold = false">
        <h3>{{ why.trayTitle }}</h3>
        <ul>
          <li v-for="(s, i) in why.tray" :key="s.key" :class="{ on: idx === i }" tabindex="0" @focus="idx = i" @mouseenter="idx = i"><TrayIcon :state="s.key" :size="22" /><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head { max-width: 640px; } .wrap { margin-top: var(--s8); border-radius: var(--r-pop); box-shadow: var(--shadow-card); background: var(--surface); }
table { width: 100%; border-collapse: collapse; text-align: left; font-size: 1rem; }
th, td { padding: var(--s4) var(--s5); border-bottom: 1px solid var(--line); vertical-align: top; } tbody tr:last-child > * { border-bottom: 0; }
thead th { font-size: .875rem; color: var(--t2); font-weight: 600; } th[scope="row"] { font-weight: 600; color: var(--t1); width: 24%; } td { color: var(--t2); }
.ev { background: var(--accent-soft); color: var(--t1); } thead .ev { color: var(--accent-text); }
.fig { margin-top: var(--s5); font-size: .9375rem; }
.legend { margin-top: var(--s10); } .legend h3 { margin-bottom: var(--s4); font-size: 1.25rem; }
.legend ul { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: var(--s3); }
.legend li { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 var(--s5); border-radius: var(--r-pill); background: var(--surface); color: var(--t3); box-shadow: var(--shadow-card); font-weight: 600; transition: color var(--dur-base), transform var(--dur-base) var(--ease-spring), background var(--dur-base); }
.legend li.on { color: var(--accent-text); background: var(--accent-soft); transform: translateY(-2px); }
@media (max-width: 680px) {
  table, tbody, tr, th, td { display: block; }
  thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  tbody tr { padding: var(--s4) 0; border-bottom: 1px solid var(--line); } tbody tr:last-child { border-bottom: 0; }
  th, td { border: 0; padding: var(--s1) var(--s5); } th[scope="row"] { width: auto; font-size: 1.0625rem; }
  td::before { content: attr(data-label); display: block; font-size: .75rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--t3); }
  td.ev { background: var(--accent-soft); margin: var(--s2) var(--s3) 0; padding: var(--s3) var(--s4); border-radius: var(--r-card); } td.ev::before { color: var(--accent-text); }
}
@media (prefers-reduced-motion: reduce) { .legend li.on { transform: none; } }
</style>
