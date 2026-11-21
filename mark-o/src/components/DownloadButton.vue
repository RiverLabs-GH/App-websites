<script setup lang="ts">
import { download } from '../data/content'

withDefaults(defineProps<{ variant?: 'primary' | 'secondary'; small?: boolean }>(), { variant: 'primary', small: false })
</script>

<template>
  <a v-if="download.enabled" :href="download.url" class="btn" :class="[`btn--${variant}`, { 'btn--sm': small }]">
    {{ download.label }}
  </a>
  <span v-else class="btn btn--soft" :class="{ 'btn--sm': small }" role="note">
    {{ download.pendingLabel }}
  </span>
</template>
