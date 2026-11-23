<script setup lang="ts">
import { audience } from '../data/content'
import AppWindow from './AppWindow.vue'
</script>

<template>
  <section :id="audience.id" class="section section--alt audience" aria-labelledby="audience-title">
    <div class="container">
      <header class="section-head" v-reveal>
        <p class="eyebrow">{{ audience.eyebrow }}</p>
        <h2 id="audience-title" class="h2">{{ audience.title }}</h2>
        <p class="lead">{{ audience.lead }}</p>
      </header>

      <div class="compare" v-reveal>
        <figure class="compare__side">
          <figcaption class="eyebrow">{{ audience.before.label }}</figcaption>
          <pre class="raw"><code>{{ audience.before.sample }}</code></pre>
        </figure>
        <div class="compare__side">
          <p class="eyebrow">{{ audience.after.label }}</p>
          <AppWindow :img="audience.after.img" />
        </div>
      </div>

      <div class="block" v-reveal>
        <h3 class="block__title eyebrow">{{ audience.tasksTitle }}</h3>
        <ul class="tasks">
          <li v-for="t in audience.tasks" :key="t.title" class="task">
            <p class="h3">{{ t.title }}</p>
            <p class="lead">{{ t.text }}</p>
          </li>
        </ul>
      </div>

      <div class="block" v-reveal>
        <h3 class="block__title eyebrow">{{ audience.rolesTitle }}</h3>
        <ul class="roles">
          <li v-for="r in audience.roles" :key="r.title" class="role">
            <p class="h3">{{ r.title }}</p>
            <p class="role__text">{{ r.text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.compare { display: grid; grid-template-columns: 1fr 1.4fr; gap: var(--s-6); align-items: start; }
.compare__side { display: grid; gap: var(--s-3); margin: 0; }
.raw {
  margin: 0; padding: var(--s-5); overflow-x: auto; border: 1px solid var(--c-line); border-radius: var(--r-sm);
  background: var(--c-bg); color: var(--c-ink-2); font-family: var(--font-mono); font-size: var(--fs-small); line-height: 1.6;
}
.block { margin-top: var(--s-8); }
.block__title { margin-bottom: var(--s-4); }
.tasks { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--c-line); }
.task { padding: var(--s-5) var(--s-6) var(--s-5) 0; border-bottom: 1px solid var(--c-line); display: grid; gap: var(--s-2); align-content: start; }
.task .lead { color: var(--c-ink-2); }
.roles { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--s-4); }
.role { background: var(--c-bg); border-radius: var(--r-sm); padding: var(--s-5); display: grid; gap: var(--s-2); align-content: start; }
.role__text { font-size: var(--fs-small); color: var(--c-ink-2); }
@media (max-width: 960px) { .roles { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 760px) {
  .compare, .tasks, .roles { grid-template-columns: 1fr; }
  .task { padding-right: 0; }
}
</style>
