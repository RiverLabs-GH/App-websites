import { createApp, createSSRApp } from 'vue'
import App from './App.vue'
import { reveal } from './directives/reveal'
import './styles/tokens.css'
import './styles/global.css'
import './styles/animations.css'

const root = document.getElementById('app')!
// The production build is prerendered, so hydrate it. In dev the container is empty.
const app = root.hasChildNodes() ? createSSRApp(App) : createApp(App)
app.directive('reveal', reveal)
app.mount(root)
