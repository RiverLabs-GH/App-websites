<script setup lang="ts">
import { hero } from '../data/content'
import AppWindow from './AppWindow.vue'
import DownloadButton from './DownloadButton.vue'
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="container hero__copy">
      <p class="eyebrow" v-reveal>{{ hero.eyebrow }}</p>
      <h1 id="hero-title" class="h1" v-reveal="60">{{ hero.title }}</h1>
      <p class="lead" v-reveal="120">{{ hero.lead }}</p>
      <p class="hero__audience" v-reveal="150">{{ hero.audience }}</p>
      <div class="hero__cta" v-reveal="180">
        <a class="btn btn--primary" :href="hero.secondaryCta.href">{{ hero.secondaryCta.label }}</a>
        <DownloadButton variant="secondary" />
      </div>
    </div>
    <div class="container--wide hero__shot" v-reveal="240">
      <AppWindow :img="hero.image" eager />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: clamp(2.5rem, 1.5rem + 4vw, 5rem);
  background: var(--bg-fade);
  overflow: clip;
}
.hero__copy { display: grid; justify-items: center; text-align: center; gap: var(--s-5); max-width: 56rem; }
.hero__copy .lead { max-width: 38rem; }
.hero__audience { max-width: 38rem; font-size: var(--fs-small); color: var(--c-ink-3); }
.hero__cta { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-3); margin-top: var(--s-2); }
.hero__shot { margin-top: clamp(2rem, 1.5rem + 3vw, 3.5rem); padding-bottom: var(--s-9); max-width: 70rem; }
</style>
