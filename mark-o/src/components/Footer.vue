<script setup lang="ts">
import { asset, company, footer, site } from '../data/content'
</script>

<template>
  <footer class="footer">
    <div class="container--wide footer__inner">
      <div class="footer__brand">
        <img :src="asset('images/wordmark.png')" width="448" height="120" alt="mark.O" loading="lazy" />
        <p>{{ footer.blurb }}</p>
        <a class="footer__company" :href="company.url">
          <img :src="company.logo.src" :width="company.logo.width" :height="company.logo.height" :alt="company.logo.alt" loading="lazy" />
          <span>{{ company.byline }}</span>
        </a>
      </div>
      <div class="footer__side">
        <nav aria-label="Footer">
          <ul>
            <li v-for="l in footer.links" :key="l.href"><a :href="l.href">{{ l.label }}</a></li>
          </ul>
        </nav>
        <p class="footer__contact">{{ footer.contactLabel }}: <a :href="`mailto:${company.email}`">{{ company.email }}</a></p>
      </div>
    </div>
    <div class="container--wide footer__legal">
      <p>Copyright © {{ site.year }} {{ company.name }}. All rights reserved.</p>
      <p>{{ footer.legal }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--c-bg-alt); padding-block: var(--s-8) var(--s-6); font-size: 0.875rem; color: var(--c-ink-3); }
.footer__inner { display: flex; justify-content: space-between; gap: var(--s-7); flex-wrap: wrap; padding-bottom: var(--s-6); border-bottom: 1px solid var(--c-line); }
.footer__brand { display: grid; gap: var(--s-3); max-width: 22rem; }
.footer__brand img { height: 1.5rem; width: auto; }
.footer__company { display: inline-flex; align-items: center; gap: var(--s-2); justify-self: start; }
.footer__company img { width: 1.5rem; height: 1.5rem; }
.footer__side { display: grid; gap: var(--s-5); align-content: start; }
.footer__contact { margin: 0; }
.footer ul { display: grid; grid-template-columns: repeat(2, auto); gap: var(--s-2) var(--s-7); }
.footer a { text-decoration: none; color: var(--c-ink-2); }
.footer a:hover { color: var(--c-ink); text-decoration: underline; }
.footer .footer__contact a { text-decoration: underline; } /* a link inside a sentence must not rely on colour alone */
.footer__legal { display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--s-2) var(--s-6); padding-top: var(--s-5); }
</style>
