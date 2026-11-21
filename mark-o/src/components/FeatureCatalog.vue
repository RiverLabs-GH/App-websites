<script setup lang="ts">
import { ref } from 'vue'
import { catalogCopy, featureGroups, featurePillars, featureTotal, pillarTotal } from '../data/features'

// The whole catalogue: every group's panel is in the page, only the chosen one is shown.
// That keeps all the text in the HTML (readable without scripts and by search engines).
const active = ref(featureGroups[0].id)
const rows = featurePillars.map((p) => ({
  ...p,
  total: pillarTotal(p.id),
  groups: featureGroups.filter((g) => g.pillar === p.id),
}))
const pillarLabel = (id: string) => featurePillars.find((p) => p.id === id)!.label
const tabId = (id: string) => `feature-tab-${id}`
const panelId = (id: string) => `feature-panel-${id}`

function pick(id: string, focus = false) {
  active.value = id
  if (focus) (document.getElementById(tabId(id)) as HTMLElement | null)?.focus()
}

// Arrow keys, Home and End move between all the tabs, in the order they are drawn.
function onKey(e: KeyboardEvent, id: string) {
  const n = featureGroups.length
  const i = featureGroups.findIndex((g) => g.id === id)
  const next =
    e.key === 'ArrowRight' ? (i + 1) % n
    : e.key === 'ArrowLeft' ? (i - 1 + n) % n
    : e.key === 'Home' ? 0
    : e.key === 'End' ? n - 1
    : -1
  if (next < 0) return
  e.preventDefault()
  pick(featureGroups[next].id, true)
}
</script>

<template>
  <div id="all-features" class="catalog">
    <header class="section-head" v-reveal>
      <p class="eyebrow">{{ catalogCopy.eyebrow }}</p>
      <h3 class="h2 h2--sm">{{ featureTotal }} {{ catalogCopy.titleRest }}</h3>
    </header>

    <div class="tabs" role="tablist" :aria-label="catalogCopy.groupsLabel" v-reveal>
      <div v-for="r in rows" :key="r.id" class="tabs__row" role="presentation">
        <span class="tabs__label eyebrow" aria-hidden="true">{{ r.label }} <span class="num">{{ r.total }}</span></span>
        <div class="tabs__pills" role="presentation">
          <button
            v-for="g in r.groups" :id="tabId(g.id)" :key="g.id" type="button" role="tab"
            class="btn btn--md btn--quiet" :class="{ on: g.id === active }"
            :aria-selected="g.id === active" :aria-controls="panelId(g.id)" :tabindex="g.id === active ? 0 : -1"
            :aria-label="`${pillarLabel(g.pillar)}: ${g.tab}`"
            @click="pick(g.id)" @keydown="onKey($event, g.id)"
          >{{ g.tab }} <span class="num" aria-hidden="true">{{ g.features.length }}</span></button>
        </div>
      </div>
    </div>

    <div
      v-for="g in featureGroups" :id="panelId(g.id)" :key="g.id" class="panel" role="tabpanel"
      :aria-labelledby="tabId(g.id)" :hidden="g.id !== active"
    >
      <h4 class="h3 panel__title">{{ g.title }} <span class="panel__count">{{ g.features.length }} {{ catalogCopy.countNoun }}</span></h4>
      <dl class="grid">
        <div v-for="f in g.features" :key="f.name" class="item">
          <dt>{{ f.name }}</dt>
          <dd>{{ f.text }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.catalog { margin-top: var(--s-9); padding-top: var(--s-7); border-top: 1px solid var(--c-line); }

.tabs { display: grid; gap: var(--s-4); margin-bottom: var(--s-7); }
.tabs__row { display: grid; grid-template-columns: 13rem minmax(0, 1fr); gap: var(--s-4); align-items: start; }
.tabs__label { padding-top: var(--s-3); }
.tabs__pills { display: flex; flex-wrap: wrap; gap: var(--s-2); }
.num { font-variant-numeric: tabular-nums; color: var(--c-ink-3); margin-left: var(--s-1); }
.on .num { color: var(--c-line); }
.tabs__label .num { margin-left: var(--s-2); }

.panel__title { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--s-2) var(--s-4); }
.panel__count { font-size: var(--fs-small); font-weight: 400; color: var(--c-ink-3); }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--s-7); margin: var(--s-4) 0 0; border-top: 1px solid var(--c-line); }
.item { padding-block: var(--s-4); border-bottom: 1px solid var(--c-line-soft); }
.item dt { font-size: var(--fs-body); font-weight: 600; color: var(--c-ink); }
.item dd { margin: var(--s-1) 0 0; font-size: var(--fs-small); color: var(--c-ink-2); }

@media (max-width: 760px) {
  .tabs__row { grid-template-columns: 1fr; gap: var(--s-2); }
  .tabs__label { padding-top: 0; }
  .grid { grid-template-columns: 1fr; }
}
</style>

<!-- Not scoped on purpose: Vue's :global() drops the part after the space and would hide the whole page.
     Without scripts the tabs cannot work, so every group is shown in turn instead. -->
<style>
html:not(.js) #all-features .tabs { display: none; }
html:not(.js) #all-features .panel[hidden] { display: block; margin-top: var(--s-7); }
</style>
