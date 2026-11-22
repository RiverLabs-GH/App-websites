<script setup lang="ts">
// Interactive, simulated popover. Local state only: it never touches the Mac, and it is labelled as a demo on the page.
import CaptureImage from '../ui/CaptureImage.vue'
import type { Capture } from '../../data/content'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import PopoverView, { type PopState } from './PopoverView.vue'
import { hero, demos } from '../../data/content'
import { useInView } from '../../composables/useInView'
import { useReducedMotion } from '../../composables/useReducedMotion'

const props = withDefaults(defineProps<{ theme?: string; autoplay?: boolean; capture?: Capture }>(), { theme: 'light', autoplay: true })
const tray = defineModel<string>('tray', { default: 'inactive' })

const root = ref<HTMLElement | null>(null)
const state = ref<PopState>('inactive')
const mode = ref('Both')
const remaining = ref(3600)
const total = ref(3600)
const auto = ref(props.autoplay)      // the script is allowed to run
const { inView } = useInView(root)
const { reduced } = useReducedMotion()
let tick: ReturnType<typeof setInterval> | null = null
let pend: ReturnType<typeof setTimeout> | null = null
let token = 0

const fmt = (s: number) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const x = s % 60; return `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` }
const clock = computed(() => fmt(remaining.value))
const progress = computed(() => (total.value ? Math.max(0, remaining.value / total.value) : 0))
watch(state, (s) => { tray.value = s === 'active' ? 'active' : s === 'paused' ? 'paused' : 'inactive' }, { immediate: true })

const clear = () => { if (tick) clearInterval(tick); tick = null; if (pend) clearTimeout(pend); pend = null }
const run = () => { tick = setInterval(() => { remaining.value -= 1; if (remaining.value <= 0) stop() }, 1000) }
const start = (secs: number) => { clear(); state.value = 'pending'; pend = setTimeout(() => { total.value = remaining.value = secs; state.value = 'active'; run() }, 450) }
const stop = () => { clear(); state.value = 'inactive' }
const pause = () => { clear(); state.value = 'paused' }
const resume = () => { clear(); state.value = 'active'; run() }
const extend = () => { remaining.value += 900; total.value += 900 }

// A person's own click takes over from the script.
const user = <A extends unknown[]>(fn: (...a: A) => void) => (...a: A) => { auto.value = false; fn(...a) }

const sleep = (ms: number, t: number) => new Promise<void>((res, rej) => setTimeout(() => (t === token ? res() : rej(new Error('stopped'))), ms))
async function script() {
  const t = ++token
  try {
    for (;;) {
      await sleep(1500, t); start(3600)
      await sleep(3400, t); pause()
      await sleep(1800, t); resume()
      await sleep(2200, t); extend()
      await sleep(2600, t); stop()
      await sleep(2200, t)
    }
  } catch { /* cancelled */ }
}
watch([inView, auto, reduced], ([v, a, r]) => { token++; if (v && a && !r) script() }, { flush: 'post' })
onMounted(() => { if (reduced.value) { state.value = 'active'; run() } })
watch(reduced, (r) => { if (r && state.value === 'inactive') { state.value = 'active'; run() } })
onBeforeUnmount(() => { token++; clear() })
</script>

<template>
  <CaptureImage v-if="capture" :shot="capture" frame="popover" />
  <div v-else ref="root" class="wrap">
    <PopoverView :state="state" :theme="theme" :mode="mode" :clock="clock" :progress="progress" interactive fixed :live="!auto"
      @start="user(start)($event)" @stop="user(stop)()" @pause="user(pause)()" @resume="user(resume)()" @extend="user(extend)()" @mode="user((m: string) => (mode = m))($event)" />
    <div class="meta">
      <span class="chip">{{ hero.demoLabel }}</span>
      <button v-if="!reduced" type="button" class="ctl" :aria-pressed="auto" @click="auto = !auto">{{ auto ? demos.popover.pauseDemo : demos.popover.playDemo }}</button>
    </div>
  </div>
</template>

<style scoped>
.wrap { display: grid; justify-items: center; gap: var(--s3); }
.meta { display: flex; align-items: center; gap: var(--s3); }
.ctl { min-height: 44px; padding: 0 16px; border-radius: var(--r-pill); border: 0; background: var(--hover); color: var(--t1); font: 500 .875rem var(--font); cursor: pointer; }
.ctl:hover { background: var(--press); }
</style>
