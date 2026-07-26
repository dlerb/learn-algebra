import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { allLayers } from './data/layers'

// The seven layers are browsable catalogs; Tutorial and Drills are the
// (not-yet-built) stateful activities (docs/content_model.md, "Skills are the
// pedagogical bridge"). Every layer route is GENERATED from the manifest
// (src/data/layers.ts) — adding a layer of either family needs no change here
// beyond a line in `viewOf` if it is curated.
//
// All routes are lazy so the activities' future weight (Compute Engine for
// grading) code-splits off the reference pages. The tower shares one view
// parameterized by `layerId`; each curated layer has its own.
const viewOf: Record<string, () => Promise<unknown>> = {
  errors: () => import('./views/ReferenceView.vue'),
  metapatterns: () => import('./views/MetapatternsView.vue'),
  skills: () => import('./views/TaxonomyView.vue'),
}

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./views/OverviewView.vue'), meta: { title: 'Overview' } },
  ...allLayers.map(l => ({
    path: `/${l.slug}`,
    name: l.slug,
    component: l.family === 'fundament' ? () => import('./views/LayerView.vue') : viewOf[l.id],
    ...(l.family === 'fundament' ? { props: { layerId: l.id } } : {}),
    meta: { title: l.title },
  } as RouteRecordRaw)),
  { path: '/tutorial', name: 'tutorial', component: () => import('./views/TutorialView.vue'), meta: { title: 'Tutorial' } },
  { path: '/drills', name: 'drills', component: () => import('./views/DrillsView.vue'), meta: { title: 'Drills' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  // A hash means a deep link to one tower card (`/fundamentals#ax.distributivity`,
  // as the /errors page emits): scroll to it rather than to the top.
  //
  // Two things make the naive version silently do nothing. The layer views are
  // lazily loaded, so the card is not in the DOM when scrollBehavior first runs;
  // and every card renders its LaTeX in onMounted, which moves everything below it.
  // So: wait for the element, then one more frame for KaTeX to settle.
  //
  // Card ids are dotted (`th.negative-one-times`), so a selector STRING has to be
  // escaped — and vue-router then refuses it, warning that an escaped `#…` must be
  // passed as an element instead. Hence the lookup here and `el` as an Element.
  scrollBehavior: async to => {
    if (!to.hash) return { top: 0 }
    const sel = `#${CSS.escape(to.hash.slice(1))}`
    let el = document.querySelector(sel)
    for (let i = 0; i < 40 && !el; i++) {
      await new Promise(requestAnimationFrame)
      el = document.querySelector(sel)
    }
    if (!el) return { top: 0 }
    await new Promise(requestAnimationFrame)
    return { el: el as HTMLElement, top: 72, behavior: 'smooth' }
  },
})
