import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

/** True while the element is on screen. Used to start demos and pause offscreen work. */
export function useInView(target: Ref<HTMLElement | null>, threshold = 0.35) {
  const inView = ref(false)
  let io: IntersectionObserver | null = null
  onMounted(() => {
    if (!target.value || typeof IntersectionObserver === 'undefined') return
    io = new IntersectionObserver(([e]) => { inView.value = e.isIntersecting }, { threshold })
    io.observe(target.value)
  })
  onBeforeUnmount(() => io?.disconnect())
  return { inView }
}
