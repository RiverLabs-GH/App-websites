<script setup lang="ts">
import { ref } from 'vue'
import { asset, nav } from '../data/content'
import DownloadButton from './DownloadButton.vue'

const open = ref(false)
const close = () => { open.value = false }
</script>

<template>
  <header class="nav" :class="{ 'nav--open': open }">
    <div class="nav__inner container--wide">
      <a class="brand" href="#top" aria-label="mark.O, back to top" @click="close">
        <img :src="asset('images/wordmark.png')" width="448" height="120" alt="mark.O" />
      </a>
      <nav id="site-nav" class="nav__links" aria-label="Primary">
        <a v-for="l in nav" :key="l.href" :href="l.href" @click="close">{{ l.label }}</a>
        <DownloadButton small class="nav__cta-mobile" />
      </nav>
      <DownloadButton small class="nav__cta" />
      <button
        class="nav__toggle" type="button" :aria-expanded="open" aria-controls="site-nav"
        aria-label="Menu" @click="open = !open"
      >
        <span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 50; height: var(--nav-h);
  background: color-mix(in srgb, var(--c-bg) 80%, transparent); backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--c-line-soft);
}
.nav__inner { height: 100%; display: flex; align-items: center; gap: var(--s-6); }
.brand { display: inline-flex; margin-right: auto; }
.brand img { height: 1.375rem; width: auto; }
.nav__links { display: flex; align-items: center; gap: var(--s-6); }
.nav__links a:not(.btn) { font-size: 0.8125rem; color: var(--c-ink-2); text-decoration: none; transition: color var(--t-fast); padding-block: var(--s-2); }
.nav__links a:not(.btn):hover { color: var(--c-ink); }
.nav__cta-mobile { display: none; }
.nav__toggle { display: none; }

@media (max-width: 760px) {
  .nav__cta { display: none; }
  .nav__toggle {
    display: grid; place-content: center; gap: 6px; width: 2.75rem; height: 2.75rem; margin-right: -0.75rem;
    background: none; border: 0;
  }
  .nav__toggle span { display: block; width: 18px; height: 1.5px; background: var(--c-ink); transition: transform var(--t-fast); }
  .nav--open .nav__toggle span:first-child { transform: translateY(3.75px) rotate(45deg); }
  .nav--open .nav__toggle span:last-child { transform: translateY(-3.75px) rotate(-45deg); }
  .nav__links {
    position: absolute; inset: var(--nav-h) 0 auto 0; flex-direction: column; align-items: stretch; gap: 0;
    background: var(--c-bg); border-bottom: 1px solid var(--c-line-soft); padding: var(--s-2) var(--gutter) var(--s-5);
    visibility: hidden; opacity: 0; transform: translateY(-6px);
    transition: opacity var(--t-fast), transform var(--t-fast), visibility var(--t-fast);
  }
  .nav--open .nav__links { visibility: visible; opacity: 1; transform: none; }
  .nav__links a:not(.btn) { font-size: 1.125rem; padding-block: var(--s-3); border-bottom: 1px solid var(--c-line-soft); }
  .nav__cta-mobile { display: inline-flex; margin-top: var(--s-4); align-self: flex-start; }
}
</style>
