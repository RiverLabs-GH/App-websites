<script setup lang="ts">
// A generic macOS-style menu bar (no vendor logo or wallpaper) with the real EverOn tray mark in it.
import TrayIcon from '../ui/TrayIcon.vue'
defineProps<{ tray: string; open?: boolean }>()
</script>

<template>
  <div class="mb" aria-hidden="true">
    <div class="left"><i class="blob w1" /><i class="blob w2" /><i class="blob w3" /></div>
    <div class="right">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 9a15 15 0 0120 0M5.5 12.5a10 10 0 0113 0M9 16a5 5 0 016 0" /></svg>
      <svg width="22" height="16" viewBox="0 0 28 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="2" width="22" height="12" rx="3.5" /><rect x="3" y="4" width="14" height="8" rx="1.5" fill="currentColor" stroke="none" /><path d="M25 6v4" stroke-linecap="round" /></svg>
      <span class="slot" :class="{ open }"><TrayIcon :state="tray" :size="18" /></span>
      <span class="clock">9:41</span>
    </div>
  </div>
</template>

<style scoped>
.mb { height: 30px; display: flex; justify-content: space-between; align-items: center; padding: 0 12px; border-radius: var(--r-ctl) var(--r-ctl) 0 0; background: var(--surface); background: color-mix(in srgb, var(--surface) 78%, transparent); color: var(--t1); box-shadow: 0 .5px 0 var(--line-strong); font: 500 13px var(--font); }
.left, .right { display: flex; align-items: center; gap: 14px; }
.blob { display: block; height: 8px; border-radius: 4px; background: var(--line-strong); } .w1 { width: 34px; } .w2 { width: 44px; } .w3 { width: 38px; }
.slot { display: inline-grid; place-items: center; width: 28px; height: 22px; border-radius: 5px; color: var(--accent); transition: background var(--dur-base); } .slot.open { background: var(--hover); }
.clock { font-variant-numeric: tabular-nums; }
</style>
