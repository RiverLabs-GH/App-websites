<script setup lang="ts">
import { footer } from '../../data/content'
import TrayIcon from '../ui/TrayIcon.vue'
</script>

<template>
  <footer id="footer" class="foot">
    <div class="container row">
      <div class="who"><TrayIcon state="active" :size="20" /><div><p class="p">{{ footer.product }}</p><p class="s">{{ footer.parent }}</p></div></div>
      <div class="end"><a href="#top">{{ footer.top }}</a><p class="s">{{ footer.copyright }}</p></div>
    </div>
  </footer>
</template>

<style scoped>
.foot { padding-block: var(--s9); border-top: 1px solid var(--line-strong); } .row { display: flex; justify-content: space-between; gap: var(--s6); flex-wrap: wrap; align-items: flex-start; }
.who { display: flex; gap: var(--s3); color: var(--accent); } .who div { color: var(--t2); } .p { color: var(--t1); font-weight: 500; } .s { font-size: .875rem; color: var(--t3); }
.end { display: grid; gap: var(--s2); justify-items: end; } .end a { display: inline-flex; align-items: center; min-height: 44px; }
@media (max-width: 600px) { .end { justify-items: start; } }
</style>
