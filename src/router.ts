import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { layers } from './data/layers'

// Four pages, two libraries + two activities (docs/content_model.md "Skills are
// the pedagogical bridge"): Laws & Conventions and Skills are browsable
// catalogs; Tutorial and Drills are the (not-yet-built) stateful activities.
// Activity routes are lazy-loaded so their future weight (Compute Engine for
// grading) code-splits off the reference pages.
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/skills' },
  { path: '/skills', name: 'skills', component: () => import('./views/TaxonomyView.vue'), meta: { title: 'Skills' } },
  { path: '/fundamentals', name: 'fundamentals', component: () => import('./views/ReferenceView.vue'), meta: { title: 'Fundamentals' } },
  // One route per layer of the tower, generated from the manifest: same
  // LayerView, different `layerId` prop. Adding a layer needs no route.
  ...layers.map<RouteRecordRaw>(l => ({
    path: `/${l.slug}`,
    name: l.slug,
    component: () => import('./views/LayerView.vue'),
    props: { layerId: l.id },
    meta: { title: l.title },
  })),
  { path: '/tutorial', name: 'tutorial', component: () => import('./views/TutorialView.vue'), meta: { title: 'Tutorial' } },
  { path: '/drills', name: 'drills', component: () => import('./views/DrillsView.vue'), meta: { title: 'Drills' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
