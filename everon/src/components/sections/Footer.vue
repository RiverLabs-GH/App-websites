<script setup lang="ts">
import { footer, company, markO } from '../../data/content'
import TrayIcon from '../ui/TrayIcon.vue'
</script>

<template>
  <footer id="footer" class="foot">
    <div class="container row">
      <div class="who stack">
        <div class="brand"><TrayIcon state="active" :size="20" /><p class="p">{{ footer.product }}</p></div>
        <a class="co" :href="company.url"><img :src="company.logo" width="24" height="24" alt="" loading="lazy" /><span>{{ company.byline }}</span></a>
        <p class="s">{{ footer.contactLabel }}: <a class="in" :href="`mailto:${company.email}`">{{ company.email }}</a></p>
      </div>
      <div class="also">
        <p class="lab">{{ footer.alsoLabel }}</p>
        <a class="app" :href="markO.url"><strong>{{ markO.name }}</strong><span>{{ markO.text }}</span></a>
      </div>
      <div class="end"><a href="#top">{{ footer.top }}</a><p class="s">{{ footer.copyright }}</p></div>
    </div>
  </footer>
</template>

<style scoped>
.foot { padding-block: var(--s9); border-top: 1px solid var(--line-strong); } .row { display: flex; justify-content: space-between; gap: var(--s7); flex-wrap: wrap; align-items: flex-start; }
.who { display: grid; gap: var(--s3); max-width: 26rem; } .brand { display: flex; gap: var(--s3); align-items: center; color: var(--accent); } .p { color: var(--t1); font-weight: 500; }
.co { display: inline-flex; align-items: center; gap: var(--s2); min-height: 44px; color: var(--t2); text-decoration: none; justify-self: start; } .co:hover span { text-decoration: underline; }
.co img { width: 24px; height: 24px; border-radius: 6px; }
.s { font-size: .875rem; color: var(--t3); } .in { color: var(--t2); text-decoration: underline; }
.also { display: grid; gap: var(--s2); max-width: 20rem; } .lab { font-size: .875rem; color: var(--t3); }
.app { display: grid; gap: 2px; padding: var(--s3) var(--s4); border-radius: var(--r-card); background: var(--surface); box-shadow: var(--shadow-card); text-decoration: none; color: var(--t2); transition: transform var(--dur-base) var(--ease-out); }
.app strong { color: var(--t1); } .app:hover { transform: translateY(-2px); } .app:hover strong { text-decoration: underline; }
.end { display: grid; gap: var(--s2); justify-items: end; } .end a { display: inline-flex; align-items: center; min-height: 44px; }
@media (max-width: 600px) { .end { justify-items: start; } }
@media (prefers-reduced-motion: reduce) { .app { transition: none; } .app:hover { transform: none; } }
</style>
