<script setup lang="ts">
import { ref } from 'vue'
import { hero, site } from '../../data/content'
import { useTheme } from '../../composables/useTheme'
import MenuBar from '../screens/MenuBar.vue'
import PopoverScreen from '../screens/PopoverScreen.vue'

const { theme } = useTheme()
const tray = ref('inactive')
</script>

<template>
  <section id="top" class="hero section" data-group="overview" aria-labelledby="hero-title">
    <div class="container grid">
      <div class="copy stack">
        <p class="eyebrow">{{ hero.eyebrow }}</p>
        <h1 id="hero-title">{{ hero.title }}</h1>
        <p class="lead">{{ hero.lead }}</p>
        <div class="cta">
          <button type="button" class="btn btn-soon" disabled aria-describedby="req">{{ hero.primary }}</button>
          <a class="btn btn-ghost" href="#tour">{{ hero.secondary }}</a>
        </div>
        <p id="req" class="caption">{{ site.requirement }} · Menu-bar app</p>
      </div>
      <div class="stage" aria-label="Interactive demo of the EverOn menu-bar popover">
        <div class="desk">
          <MenuBar :tray="tray" :open="tray !== 'inactive'" class="mbar" />
          <div class="pop"><PopoverScreen v-model:tray="tray" :theme="theme" /></div>
        </div>
        <p class="caption">{{ hero.demoHint }} {{ site.generatedNote }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { background: var(--hero-glow); padding-top: clamp(32px, 5vw, 72px); overflow: clip; }
.grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(32px, 6vw, 88px); align-items: center; }
.copy h1 { font-size: clamp(2.125rem, 1.2rem + 2.6vw, 3.375rem); max-width: 20ch; } .cta { display: flex; flex-wrap: wrap; gap: var(--s3); margin-top: var(--s6); }
.copy .stack > *, .copy > * { animation: ev-rise var(--dur-scene) var(--ease-out) both; } .copy > :nth-child(2) { animation-delay: calc(var(--stagger) * 1); } .copy > :nth-child(3) { animation-delay: calc(var(--stagger) * 2); } .copy > :nth-child(4) { animation-delay: calc(var(--stagger) * 3); } .copy > :nth-child(5) { animation-delay: calc(var(--stagger) * 4); }
.btn:disabled { opacity: 1; }
.stage { justify-self: center; width: 100%; max-width: 440px; }
.desk { border-radius: var(--r-win); background: var(--surface-2); background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 16%, var(--surface-2)), var(--surface-2) 60%); box-shadow: var(--shadow-lift); padding-bottom: var(--s6); }
.mbar { animation: ev-slide-down var(--dur-slow) var(--ease-out) both; }
.pop { display: grid; justify-items: end; padding: 6px 18px 0; animation: ev-rise var(--dur-scene) var(--ease-out) 400ms both; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .pop { justify-items: center; } }
@media (prefers-reduced-motion: reduce) { .copy > *, .mbar, .pop { animation: none; } }
</style>
