import { ref, onMounted } from 'vue'

export type Theme = 'light' | 'dark'
// One shared state for the page. The inline script in index.html sets data-theme before first paint; this keeps Vue in step with it.
const theme = ref<Theme>('light')
let ready = false

const read = (): Theme => {
  try { const s = localStorage.getItem('everon-theme'); if (s === 'light' || s === 'dark') return s } catch { /* storage may be blocked */ }
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
const apply = (t: Theme) => { theme.value = t; document.documentElement.dataset.theme = t }

export function useTheme() {
  onMounted(() => { if (!ready) { ready = true; apply(read()) } else theme.value = (document.documentElement.dataset.theme as Theme) || theme.value })
  const set = (t: Theme) => {
    const run = () => apply(t)
    try { localStorage.setItem('everon-theme', t) } catch { /* ignore */ }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (d.startViewTransition && !reduce) d.startViewTransition(run); else run()
  }
  const toggle = () => set(theme.value === 'dark' ? 'light' : 'dark')
  return { theme, set, toggle }
}
