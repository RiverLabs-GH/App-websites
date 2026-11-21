<script setup lang="ts">
import type { Img } from '../data/content'

// A product screenshot inside a macOS-style window. The captures omit the traffic lights,
// so they are drawn here: over the image where its top-left corner is empty, or in a thin
// title bar when the screen has controls there.
withDefaults(defineProps<{ img: Img; eager?: boolean; titlebar?: boolean; dark?: boolean }>(), {
  eager: false, titlebar: false, dark: false,
})
</script>

<template>
  <figure class="window" :class="{ 'window--dark': dark }">
    <div v-if="titlebar" class="window__bar" aria-hidden="true">
      <span class="dots"><i /><i /><i /></span>
    </div>
    <span v-else class="dots dots--over" aria-hidden="true"><i /><i /><i /></span>
    <img
      :src="img.src" :width="img.width" :height="img.height" :alt="img.alt"
      :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : undefined" decoding="async"
    />
  </figure>
</template>

<style scoped>
.window {
  position: relative; overflow: hidden; background: var(--c-bg);
  border-radius: var(--r-window); box-shadow: var(--shadow-window);
  container-type: inline-size;
}
.window--dark { box-shadow: var(--shadow-window-dark); }
.window img { width: 100%; height: auto; }
.window__bar { height: clamp(18px, 2.6cqw, 30px); background: var(--c-app-chrome); display: flex; align-items: center; padding-left: 2cqw; }
.dots { display: inline-flex; gap: clamp(3px, 0.6cqw, 8px); }
.dots i { display: block; width: clamp(5px, 1cqw, 12px); aspect-ratio: 1; border-radius: 50%; background: var(--c-dot-red); }
.dots i:nth-child(2) { background: var(--c-dot-yellow); }
.dots i:nth-child(3) { background: var(--c-dot-green); }
.dots--over { position: absolute; left: 2cqw; top: 2cqw; z-index: 1; }
</style>
