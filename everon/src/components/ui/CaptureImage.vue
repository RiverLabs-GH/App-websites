<script setup lang="ts">
import { ref } from 'vue'
import type { Capture } from '../../data/content'

const props = defineProps<{ shot: Capture; caption?: string; eager?: boolean; frame?: 'window' | 'popover' | 'none' }>()
const dlg = ref<HTMLDialogElement | null>(null)
const open = () => dlg.value?.showModal()
const close = () => dlg.value?.close()
const onBackdrop = (e: MouseEvent) => { if (e.target === dlg.value) close() }
</script>

<template>
  <figure class="cap" :class="`frame-${frame ?? 'window'}`">
    <button type="button" class="zoom" :aria-label="`Enlarge: ${props.shot.alt}`" @click="open">
      <img :src="shot.src" :width="shot.w" :height="shot.h" :alt="shot.alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" />
    </button>
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
    <dialog ref="dlg" class="lightbox" :aria-label="`Enlarged view: ${props.shot.alt}`" @click="onBackdrop">
      <button type="button" class="x" aria-label="Close" @click="close">×</button>
      <img :src="shot.src" :width="shot.w" :height="shot.h" :alt="shot.alt" loading="lazy" />
    </dialog>
  </figure>
</template>

<style scoped>
.cap { margin: 0; }
.zoom { display: block; width: 100%; padding: 0; border: 0; background: none; cursor: zoom-in; border-radius: var(--r-win); }
.zoom img { width: 100%; height: auto; border-radius: var(--r-win); box-shadow: var(--shadow-lift); transition: transform var(--dur-base) var(--ease-out); }
.zoom:hover img { transform: translateY(-2px); }
.frame-popover .zoom img { border-radius: var(--r-pop); }
.frame-none .zoom img { box-shadow: none; border-radius: 0; }
.lightbox { border: 0; padding: 0; background: transparent; max-width: min(96vw, 1400px); max-height: 94vh; overflow: visible; }
.lightbox::backdrop { background: rgba(10, 12, 20, .72); }
.lightbox[open] { animation: ev-rise var(--dur-base) var(--ease-out); }
.lightbox img { max-height: 90vh; width: auto; max-width: 100%; border-radius: var(--r-win); }
.x { position: absolute; top: -14px; right: -14px; width: 44px; height: 44px; border-radius: 50%; border: 0; background: var(--surface); color: var(--t1); font-size: 24px; line-height: 1; cursor: pointer; box-shadow: var(--shadow-card); }
</style>
