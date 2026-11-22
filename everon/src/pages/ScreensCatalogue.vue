<script setup lang="ts">
// Review page: every generated screen in each state and every real capture, with its note. Not linked from the site, not in the sitemap, noindex.
import { asset } from '../data/content'
import images from '../data/images.json'
import PopoverView, { type PopState } from '../components/screens/PopoverView.vue'
import RuleDemo from '../components/screens/RuleDemo.vue'
import TimelineDemo from '../components/screens/TimelineDemo.vue'
import TrayIcon from '../components/ui/TrayIcon.vue'

const states: PopState[] = ['inactive', 'pending', 'active', 'paused', 'rule', 'battery', 'unknown', 'unavailable']
const themes = ['light', 'dark', 'midnight']
const caps = Object.entries(images as Record<string, { w: number; h: number; state: string; note: string }>)
</script>

<template>
  <main class="container cat">
    <h1>EverOn screens catalogue</h1>
    <p>Review page. Generated screens (drawn from the design spec) and real captures (sample data). Not part of the public site.</p>
    <h2>Tray states</h2>
    <p class="tray"><span v-for="s in ['active', 'inactive', 'paused', 'attention', 'unknown']" :key="s"><TrayIcon :state="s" :size="24" /> {{ s }}</span></p>
    <template v-for="t in themes" :key="t">
      <h2>Generated popover, {{ t }}</h2>
      <div class="row"><figure v-for="s in states" :key="s"><PopoverView :state="s" :theme="t" /><figcaption>{{ s }}</figcaption></figure></div>
    </template>
    <h2>Rule evaluator (interactive)</h2><div class="demo"><RuleDemo theme="light" /><RuleDemo theme="dark" /></div>
    <h2>Timeline (interactive)</h2><div class="demo"><TimelineDemo theme="light" /><TimelineDemo theme="dark" /></div>
    <h2>Real captures ({{ caps.length }})</h2>
    <div class="caps"><figure v-for="[k, m] in caps" :key="k"><img :src="asset(`images/app/${k}.webp`)" :width="m.w" :height="m.h" :alt="`${k}: ${m.state}`" loading="lazy" /><figcaption><b>{{ k }}</b> · {{ m.state }}<br />{{ m.note }}</figcaption></figure></div>
  </main>
</template>

<style scoped>
.cat { padding-block: var(--s9); } .cat h2 { margin: var(--s9) 0 var(--s4); font-size: 1.5rem; }
.row { display: flex; flex-wrap: wrap; gap: var(--s5); } figure { margin: 0; } figcaption { font-size: .8125rem; color: var(--t3); margin-top: var(--s2); max-width: 36ch; }
.tray { display: flex; gap: var(--s6); color: var(--accent); } .tray span { display: inline-flex; gap: 8px; align-items: center; color: var(--t2); }
.demo { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--s5); }
.caps { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--s5); } .caps img { width: 100%; height: auto; border-radius: var(--r-ctl); box-shadow: var(--shadow-card); }
</style>
