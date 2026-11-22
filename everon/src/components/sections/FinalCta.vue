<script setup lang="ts">
import { finalCta } from '../../data/content'
import TrayIcon from '../ui/TrayIcon.vue'
</script>

<template>
  <section id="get" class="section" data-group="get" aria-labelledby="get-title">
    <div class="container">
      <div v-reveal class="band">
        <TrayIcon state="active" :size="44" class="mark" />
        <h2 id="get-title">{{ finalCta.title }}</h2>
        <p>{{ finalCta.text }}</p>
        <button type="button" class="btn btn-soon" disabled aria-describedby="get-req">{{ finalCta.button }}</button>
        <p id="get-req" class="req">{{ finalCta.requirement }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band { display: grid; justify-items: center; gap: var(--s4); text-align: center; padding: clamp(40px, 7vw, 96px) var(--s5); border-radius: 28px; background: var(--hero-glow), var(--surface); box-shadow: var(--shadow-card); }
.band p { margin-inline: auto; } .mark { color: var(--accent); } .btn:disabled { opacity: 1; } .req { font-size: .9375rem; color: var(--t3); }
</style>
