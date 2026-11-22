<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { nav, site } from '../../data/content'
import { useScrollSpy } from '../../composables/useScrollSpy'
import { useTheme } from '../../composables/useTheme'
import TrayIcon from '../ui/TrayIcon.vue'

const { active } = useScrollSpy('overview')
const { theme, toggle } = useTheme()
const links = ref<HTMLElement[]>([])
const pill = ref({ x: 0, w: 0, show: false })
const condensed = ref(false)
const open = ref(false)
const sheet = ref<HTMLElement | null>(null)
const burger = ref<HTMLButtonElement | null>(null)

const place = () => {
  const el = links.value.find((l) => l.dataset.group === active.value)
  pill.value = el ? { x: el.offsetLeft, w: el.offsetWidth, show: true } : { ...pill.value, show: false }
}
watch(active, () => nextTick(place))
const onScroll = () => { condensed.value = scrollY > 24 }
const lock = (on: boolean) => { document.documentElement.style.overflow = on ? 'hidden' : '' }
const openSheet = async () => { open.value = true; lock(true); await nextTick(); sheet.value?.querySelector<HTMLElement>('a,button')?.focus() }
const closeSheet = () => { open.value = false; lock(false); burger.value?.focus() }
const onKey = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Escape') return closeSheet()
  if (e.key !== 'Tab' || !sheet.value) return
  const f = [...sheet.value.querySelectorAll<HTMLElement>('a,button')]
  const first = f[0]; const last = f[f.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}
onMounted(() => { addEventListener('scroll', onScroll, { passive: true }); addEventListener('keydown', onKey); addEventListener('resize', place); onScroll(); nextTick(place) })
onBeforeUnmount(() => { removeEventListener('scroll', onScroll); removeEventListener('keydown', onKey); removeEventListener('resize', place); lock(false) })
</script>

<template>
  <header class="nav" :class="{ condensed }">
    <div class="container bar">
      <a class="brand" href="#top" aria-label="EverOn, back to the top"><TrayIcon state="active" :size="22" /><span>{{ site.name }}</span></a>
      <nav class="links" aria-label="Primary">
        <span class="pill" aria-hidden="true" :style="{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px`, opacity: pill.show ? 1 : 0 }" />
        <a v-for="n in nav" :key="n.href" :ref="(el) => { if (el) links[nav.indexOf(n)] = el as HTMLElement }" :href="n.href" :data-group="n.group"
           :aria-current="active === n.group ? 'true' : undefined">{{ n.label }}</a>
      </nav>
      <div class="end">
        <button type="button" class="icon" :aria-label="theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'" @click="toggle">
          <svg v-if="theme === 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>
        </button>
        <a class="btn btn-primary cta" href="#get">Get EverOn</a>
        <button ref="burger" type="button" class="icon burger" aria-label="Open the menu" :aria-expanded="open" aria-controls="sheet" @click="openSheet">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </div>
    <Teleport to="body" :disabled="true">
      <div id="sheet" ref="sheet" class="sheet" :class="{ on: open }" role="dialog" aria-modal="true" aria-label="Menu" :hidden="!open">
        <button type="button" class="icon close" aria-label="Close the menu" @click="closeSheet">×</button>
        <a v-for="(n, i) in nav" :key="n.href" :href="n.href" :style="{ '--i': i }" @click="closeSheet">{{ n.label }}</a>
        <a class="btn btn-primary" href="#get" :style="{ '--i': nav.length }" @click="closeSheet">Get EverOn</a>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
.nav { position: sticky; top: 0; z-index: 50; height: var(--nav-h); display: flex; align-items: center; background: var(--nav-bg); backdrop-filter: saturate(1.4) blur(14px); -webkit-backdrop-filter: saturate(1.4) blur(14px); transition: height var(--dur-base) var(--ease-out), box-shadow var(--dur-base); }
.nav.condensed { height: 52px; box-shadow: 0 1px 0 var(--line-strong); }
.bar { display: flex; align-items: center; justify-content: space-between; gap: var(--s4); }
.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--t1); font-weight: 650; font-size: 1.125rem; text-decoration: none; min-height: 44px; }
.brand .tray { color: var(--accent); }
.links { position: relative; display: flex; gap: 4px; padding: 4px; border-radius: var(--r-pill); background: var(--hover); }
.links a { position: relative; z-index: 1; min-height: 36px; display: inline-flex; align-items: center; padding: 0 16px; border-radius: var(--r-pill); color: var(--t2); font-size: .9375rem; font-weight: 500; text-decoration: none; transition: color var(--dur-fast); }
.links a:hover, .links a[aria-current] { color: var(--t1); }
.pill { position: absolute; z-index: 0; top: 4px; bottom: 4px; left: 0; border-radius: var(--r-pill); background: var(--surface); box-shadow: var(--shadow-card); transition: transform var(--dur-base) var(--ease-out), width var(--dur-base) var(--ease-out), opacity var(--dur-fast); }
.end { display: flex; align-items: center; gap: var(--s2); }
.icon { width: 44px; height: 44px; border-radius: 50%; border: 0; background: transparent; color: var(--t1); display: inline-grid; place-items: center; cursor: pointer; font-size: 26px; transition: background var(--dur-fast); }
.icon:hover { background: var(--hover); }
.cta { min-height: 40px; padding: 0 18px; font-size: .9375rem; }
.cta:focus-visible { box-shadow: 0 0 0 4px var(--ring); }
.burger { display: none; }
.sheet { position: fixed; inset: 0; z-index: 70; display: flex; flex-direction: column; justify-content: center; gap: var(--s5); padding: var(--s8) 28px; background: var(--canvas); transform: translateY(-12px); opacity: 0; visibility: hidden; transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), visibility 0s var(--dur-base); }
.sheet.on { transform: none; opacity: 1; visibility: visible; transition-delay: 0s; }
.sheet a:not(.btn) { color: var(--t1); font-size: 2rem; font-weight: 650; letter-spacing: -.02em; text-decoration: none; opacity: 0; transform: translateY(var(--dist-md)); transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); transition-delay: calc(var(--i) * var(--stagger)); }
.sheet .btn { align-self: flex-start; opacity: 0; transform: translateY(var(--dist-md)); transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); transition-delay: calc(var(--i) * var(--stagger)); }
.sheet.on a:not(.btn), .sheet.on .btn { opacity: 1; transform: none; }
.close { position: absolute; top: 12px; right: 12px; }
@media (max-width: 760px) { .links, .cta { display: none; } .burger { display: inline-grid; } }
@media (min-width: 761px) { .sheet { display: none; } }
</style>
