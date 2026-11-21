<script setup lang="ts">
import { download } from '../data/content'

withDefaults(defineProps<{ variant?: 'primary' | 'secondary'; small?: boolean; large?: boolean }>(), { variant: 'primary', small: false, large: false })
</script>

<template>
  <a v-if="download.enabled" :href="download.url" class="btn" :class="[`btn--${variant}`, { 'btn--sm': small, 'btn--lg': large }]">
    {{ download.label }}
  </a>
  <span v-else class="btn btn--soft" :class="{ 'btn--sm': small, 'btn--lg': large }" role="note">
    {{ download.pendingLabel }}
  </span>
</template>
