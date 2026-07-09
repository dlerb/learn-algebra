<script setup lang="ts">
import { computed } from 'vue'
import MathExpr from '../components/MathExpr.vue'
import { laws, conventions, errorPatterns } from '../data'
import { loc, type LawDef, type ErrorDef } from '../data/family.schema'
import { lang } from '../lang'

// The reference rendering of layers 1+2 (docs/laws_and_conventions.md holds
// the design rationale; the content itself lives in the JSON and is shown
// here). Law cards show their place in the tower via basedOn/derivedFrom.

const layerNames = new Map(
  [...laws, ...conventions, ...errorPatterns].map(x => [x.id, x] as const),
)
function label(id: string): string {
  const x = layerNames.get(id)
  return x ? `${x.code} · ${loc(x.name, lang.value)}` : id
}

interface LawVM {
  id: string; code: string; name: string; latex: string
  conditions?: string; links: string[]; linkWord: string; note?: string
}
function lawVM(l: LawDef): LawVM {
  return {
    id: l.id, code: l.code, name: loc(l.name, lang.value), latex: l.latex,
    conditions: l.conditions,
    links: (l.sort === 'definition' ? l.basedOn : l.derivedFrom).map(label),
    linkWord: l.sort === 'definition' ? 'builds on' : 'derived from',
    note: l.note ? loc(l.note, lang.value) : undefined,
  }
}

const lawSections = computed(() => [
  { title: 'Axioms — accepted, not proven', items: laws.filter(l => l.sort === 'axiom').map(lawVM) },
  { title: 'Definitions — every further operation is built from these', items: laws.filter(l => l.sort === 'definition').map(lawVM) },
  { title: 'Theorems — with their derivations', items: laws.filter(l => l.sort === 'theorem').map(lawVM) },
])

const conventionCards = computed(() => conventions.map(c => ({
  id: c.id, code: c.code, name: loc(c.name, lang.value), text: loc(c.text, lang.value),
})))

interface ErrVM {
  id: string; code: string; name: string; text: string
  of: string[]; instances: string[]
}
function errVM(e: ErrorDef): ErrVM {
  return {
    id: e.id, code: e.code, name: loc(e.name, lang.value), text: loc(e.text, lang.value),
    of: e.of.map(label), instances: e.instances,
  }
}
const errorSections = computed(() => [
  { title: 'False laws — the generative rules of wrong algebra', ofWord: 'distorts', items: errorPatterns.filter(e => e.sort === 'false-law').map(errVM) },
  { title: 'Misreadings — parsing the notation wrong', ofWord: 'violates', items: errorPatterns.filter(e => e.sort === 'misreading').map(errVM) },
])
</script>

<template>
  <div class="refv">
    <header class="ref-head">
      <h1>Laws & Conventions</h1>
      <p>Layer 1 (laws) and layer 2 (writing conventions) — the coordinate system the families live in. Error patterns name what goes wrong.</p>
      <div class="mode">
        <button :class="{ active: lang === 'de' }" @click="lang = 'de'">de</button>
        <button :class="{ active: lang === 'en' }" @click="lang = 'en'">en</button>
      </div>
    </header>

    <section class="block">
      <h2>Laws</h2>
      <div v-for="s in lawSections" :key="s.title" class="group">
        <h3>{{ s.title }}</h3>
        <div class="cards">
          <article v-for="l in s.items" :key="l.id" class="card">
            <div class="card-head">
              <h4>{{ l.name }}</h4>
              <span class="badge code">{{ l.code }}</span>
            </div>
            <code class="slug">{{ l.id }}</code>
            <div class="statement"><MathExpr :latex="l.latex" display /></div>
            <div v-if="l.conditions" class="cond">for {{ l.conditions }}</div>
            <div v-if="l.links.length" class="links">
              {{ l.linkWord }}:
              <span v-for="(x, i) in l.links" :key="i" class="chip">{{ x }}</span>
            </div>
            <p v-if="l.note" class="note">{{ l.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="block">
      <h2>Notation conventions</h2>
      <p class="blurb">No truth value — the honest answer to "why?" is "we agreed to write it that way."</p>
      <div class="cards">
        <article v-for="c in conventionCards" :key="c.id" class="card">
          <div class="card-head">
            <h4>{{ c.name }}</h4>
            <span class="badge code conv">{{ c.code }}</span>
          </div>
          <code class="slug">{{ c.id }}</code>
          <p class="note">{{ c.text }}</p>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>Error patterns</h2>
      <div v-for="s in errorSections" :key="s.title" class="group">
        <h3>{{ s.title }}</h3>
        <div class="cards">
          <article v-for="e in s.items" :key="e.id" class="card err-card">
            <div class="card-head">
              <h4>{{ e.name }}</h4>
              <span class="badge code err">{{ e.code }}</span>
            </div>
            <code class="slug">{{ e.id }}</code>
            <p class="note">{{ e.text }}</p>
            <div v-if="e.instances.length" class="instances">
              <div v-for="(x, i) in e.instances" :key="i" class="wrong"><MathExpr :latex="x" /></div>
            </div>
            <div v-if="e.of.length" class="links">
              {{ s.ofWord }}:
              <span v-for="(x, i) in e.of" :key="i" class="chip">{{ x }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.refv { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: #1f2937; }
.ref-head h1 { font-size: 1.6rem; font-weight: 700; margin: 0 0 .25rem; }
.ref-head p { color: #6b7280; margin: 0 0 .6rem; }
.mode { display: flex; gap: .4rem; margin-bottom: 1rem; }
.mode button { font-size: .78rem; padding: .25rem .7rem; border: 1px solid #d1d5db; border-radius: 999px; background: #fff; color: #4b5563; cursor: pointer; }
.mode button.active { background: #111827; border-color: #111827; color: #fff; }
.block > h2 { font-size: 1.15rem; font-weight: 700; margin: 2rem 0 .75rem; padding-bottom: .35rem; border-bottom: 2px solid #111827; }
.group > h3 { font-size: 1rem; font-weight: 700; margin: 1.25rem 0 .5rem; }
.blurb { color: #6b7280; font-size: .85rem; margin: .15rem 0 .5rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: .9rem; }
.card { border: 1px solid #e5e7eb; border-radius: 10px; padding: .85rem .95rem; background: #fff; }
.card-head { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; }
.badge { font-size: .68rem; padding: .1rem .4rem; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }
.badge.code { background: #ecfdf5; color: #047857; }
.badge.code.conv { background: #eff6ff; color: #1d4ed8; }
.badge.code.err { background: #fef2f2; color: #b91c1c; }
.slug { font-size: .7rem; color: #9ca3af; }
.statement { margin: .6rem 0 .3rem; padding: .5rem .6rem; background: #f0fdf4; border-left: 3px solid #22c55e; border-radius: 4px; overflow-x: auto; }
.cond { font-size: .78rem; color: #6b7280; font-style: italic; margin: .2rem 0; }
.links { font-size: .75rem; color: #6b7280; margin-top: .45rem; display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.chip { font-size: .7rem; padding: .12rem .45rem; background: #f3f4f6; color: #4b5563; border-radius: 999px; }
.note { font-size: .82rem; color: #4b5563; margin: .5rem 0 0; }
.err-card .note { margin-top: .35rem; }
.instances { margin: .5rem 0 0; padding: .4rem .6rem; background: #fef2f2; border-left: 3px solid #ef4444; border-radius: 4px; overflow-x: auto; }
.wrong { color: #7f1d1d; margin: .15rem 0; }
</style>
