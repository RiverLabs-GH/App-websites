<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const bar = ref<HTMLElement | null>(null)
let raf = 0
const update = () => {
  raf = 0
  const h = document.documentElement.scrollHeight - innerHeight
  bar.value?.style.setProperty('--p', String(h > 0 ? Math.min(1, scrollY / h) : 0))
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
onMounted(() => { addEventListener('scroll', onScroll, { passive: true }); update() })
onBeforeUnmount(() => removeEventListener('scroll', onScroll))
</script>

<template>
  <div ref="bar" class="progress" aria-hidden="true"><span /></div>
</template>

<style scoped>
.progress { position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 60; pointer-events: none; }
.progress span { display: block; height: 100%; background: var(--accent); transform-origin: 0 50%; transform: scaleX(var(--p, 0)); }
@media (prefers-reduced-motion: reduce) { .progress { display: none; } }
</style>
