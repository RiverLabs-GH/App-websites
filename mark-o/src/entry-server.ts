import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { reveal } from './directives/reveal'

export async function render(): Promise<string> {
  const app = createSSRApp(App)
  app.directive('reveal', reveal)
  return renderToString(app)
}
