import { ref, onMounted } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)
  onMounted(() => { reduced.value = matchMedia('(prefers-reduced-motion: reduce)').matches })
  return { reduced }
}
