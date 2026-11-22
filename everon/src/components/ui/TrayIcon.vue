<script setup lang="ts">
import { computed } from 'vue'
import { asset } from '../../data/content'
const props = withDefaults(defineProps<{ state: string; size?: number }>(), { size: 18 })
// Set as inline mask-image so the URL is resolved against the page (a url() inside a CSS variable resolves against the stylesheet).
const url = computed(() => `url(${asset(`brand/tray-${props.state}.png`)})`)
</script>

<template>
  <span class="tray" :style="{ maskImage: url, '-webkit-mask-image': url, width: `${size}px`, height: `${size}px` }" role="img" :aria-label="`Menu-bar icon: ${state}`" />
</template>

<style scoped>
.tray { display: inline-block; background: currentColor; -webkit-mask-position: center; mask-position: center; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; transition: opacity var(--dur-base) var(--ease-out); }
</style>
