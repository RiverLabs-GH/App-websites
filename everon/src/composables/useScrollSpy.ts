import { ref, onMounted, onBeforeUnmount } from 'vue'

/** Tracks which [data-group] section is under the top of the viewport. */
export function useScrollSpy(defaultGroup: string) {
  const active = ref(defaultGroup)
  let io: IntersectionObserver | null = null
  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const sections = [...document.querySelectorAll<HTMLElement>('[data-group]')]
    const seen = new Map<Element, number>()
    io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0)
      let best: string | null = null; let bestR = 0
      for (const s of sections) { const r = seen.get(s) ?? 0; if (r > bestR) { bestR = r; best = s.dataset.group ?? null } }
      if (best) active.value = best
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.01, 0.1, 0.3, 0.6, 1] })
    sections.forEach((s) => io!.observe(s))
  })
  onBeforeUnmount(() => io?.disconnect())
  return { active }
}
