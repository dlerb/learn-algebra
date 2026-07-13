<script setup lang="ts">
import { computed, ref } from 'vue'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import { families, groups, metaPatterns, laws, conventions, errorPatterns, rawById } from '../data'
import { loc, type Family } from '../data/family.schema'
import { lang } from '../lang'

// 'groups' = thematic sections (default); 'order' = one flat list sorted by
// drilling priority — for reviewing the sequence itself.
const viewMode = ref<'groups' | 'order'>('groups')

function metaLabel(id: string): string {
  const m = metaPatterns.find(mp => mp.id === id)
  return m ? `${m.code} · ${loc(m.title, lang.value)}` : id
}

// Layer coordinates (laws/conventions) and error-pattern cites, shown as
// "code · name" chips. Ids not found fall back to the raw id.
const layerNames = new Map(
  [...laws, ...conventions, ...errorPatterns].map(x => [x.id, x] as const),
)
function layerLabel(id: string): string {
  const x = layerNames.get(id)
  return x ? `${x.code} · ${loc(x.name, lang.value)}` : id
}

// Flatten each family into a dumb view-model so the template needs no narrowing.
interface CardVM {
  id: string
  title: string
  kind: string
  group: string
  json: string
  priority?: number
  conditions?: string
  note: string
  metas: string[]
  requires: string[]
  laws: string[]
  governedBy: string[]
  equivChain?: string
  equivPitfalls?: { latex: string; revise: string[]; explainedBy: string[] }[]
  classExamples?: string[]
  classAnswer?: string
  classPitfalls?: { answer: string; why: string; revise: string[]; explainedBy: string[] }[]
  decomp?: { expr: string; chunks: string[]; op: string }[]
  decompPitfalls?: { why: string; revise: string[]; explainedBy: string[] }[]
}

function familyTitle(id: string): string {
  const f = families.find(f => f.id === id)
  return f ? loc(f.title, lang.value) : id
}

function toVM(f: Family): CardVM {
  const base = {
    id: f.id, title: loc(f.title, lang.value), kind: f.kind, group: f.group,
    priority: f.priority, conditions: f.conditions, note: loc(f.note, lang.value),
    json: JSON.stringify(rawById.get(f.id), null, 2),
    metas: f.metaPatterns.map(m => metaLabel(m)),
    requires: f.requires.map(familyTitle),
    laws: f.justifiedBy.map(layerLabel),
    governedBy: f.governedBy.map(layerLabel),
  }
  if (f.kind === 'equivalence') {
    return {
      ...base,
      equivChain: f.equivalents.join(' = '),
      equivPitfalls: f.pitfalls.map(p => ({
        latex: `${f.equivalents[0]} \\neq ${p.expr}`,
        revise: (p.revise ?? []).map(familyTitle),
        explainedBy: (p.explainedBy ?? []).map(layerLabel),
      })),
    }
  }
  if (f.kind === 'classification') {
    return {
      ...base, classExamples: f.examples, classAnswer: f.answer,
      classPitfalls: f.pitfalls.map(p => ({
        answer: p.answer, why: loc(p.why, lang.value),
        revise: (p.revise ?? []).map(familyTitle),
        explainedBy: (p.explainedBy ?? []).map(layerLabel),
      })),
    }
  }
  return {
    ...base, decomp: f.examples,
    decompPitfalls: f.pitfalls.map(p => ({
      why: loc(p.why, lang.value),
      revise: (p.revise ?? []).map(familyTitle),
      explainedBy: (p.explainedBy ?? []).map(layerLabel),
    })),
  }
}

const byPriority = (a: Family, b: Family) =>
  (a.priority ?? 999) - (b.priority ?? 999)
  || loc(a.title, lang.value).localeCompare(loc(b.title, lang.value))

// Flat list of sections. 'groups' = one section per group (familyGroups order);
// 'order' = a single priority-sorted section.
const sections = computed(() =>
  viewMode.value === 'order'
    ? [{
        slug: 'order', title: 'Drilling order',
        blurb: 'All families, ranked first, unranked ("remaining") after.',
        cards: [...families].sort(byPriority).map(toVM),
      }]
    : groups
        .map(g => ({
          ...g,
          cards: families.filter(f => f.group === g.slug).sort(byPriority).map(toVM),
        }))
        .filter(g => g.cards.length > 0),
)

function hasErrors(c: CardVM): boolean {
  return !!(c.equivPitfalls?.length || c.classPitfalls?.length || c.decompPitfalls?.length)
}
</script>

<template>
  <div class="tax">
    <header class="tax-head">
      <h1>Taxonomy</h1>
      <p>Every expression family, as reference. Green = the true forms; red = the typical error.</p>
      <div class="mode">
        <button :class="{ active: viewMode === 'groups' }" @click="viewMode = 'groups'">by group</button>
        <button :class="{ active: viewMode === 'order' }" @click="viewMode = 'order'">drilling order</button>
        <span class="mode-gap" />
        <button :class="{ active: lang === 'de' }" @click="lang = 'de'">de</button>
        <button :class="{ active: lang === 'en' }" @click="lang = 'en'">en</button>
      </div>
    </header>

    <section v-for="g in sections" :key="g.slug" class="group">
        <div class="group-head">
          <h3>{{ g.title }}</h3>
          <p v-if="g.blurb" class="blurb">{{ g.blurb }}</p>
        </div>

        <div class="cards">
          <article v-for="c in g.cards" :key="c.id" class="card">
            <div class="card-head">
              <h4>{{ c.title }}</h4>
              <div class="badges">
                <span v-if="c.priority" class="badge prio">#{{ c.priority }}</span>
                <span v-if="viewMode === 'order'" class="badge group">{{ c.group }}</span>
                <span class="badge kind">{{ c.kind }}</span>
              </div>
            </div>
            <code class="fam-id">{{ c.id }}</code>
            <div v-if="c.conditions" class="cond">for <MathExpr :latex="c.conditions" /></div>

            <div class="correct">
              <MathExpr v-if="c.equivChain" :latex="c.equivChain" display />
              <template v-else-if="c.classExamples">
                <div class="examples">
                  <span v-for="(ex, i) in c.classExamples" :key="i" class="ex"><MathExpr :latex="ex" /></span>
                </div>
                <div class="answer">dominant operation: <strong>{{ c.classAnswer }}</strong></div>
              </template>
              <template v-else-if="c.decomp">
                <div v-for="(d, i) in c.decomp" :key="i" class="decomp">
                  <MathExpr :latex="d.expr" />
                  <span class="arrow">→</span>
                  <span v-for="(ch, j) in d.chunks" :key="j" class="chunk">[<MathExpr :latex="ch" />]</span>
                  <span class="opname">{{ d.op }}</span>
                </div>
              </template>
            </div>

            <div v-if="hasErrors(c)" class="errors">
              <template v-if="c.equivPitfalls">
                <div v-for="(p, i) in c.equivPitfalls" :key="i" class="err">
                  <MathExpr :latex="p.latex" />
                  <span v-if="p.explainedBy.length" class="cites">{{ p.explainedBy.join(' + ') }}</span>
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
              <template v-else-if="c.classPitfalls">
                <div v-for="(p, i) in c.classPitfalls" :key="i" class="err">
                  not <strong>{{ p.answer }}</strong> — <RichText :text="p.why" />
                  <span v-if="p.explainedBy.length" class="cites">{{ p.explainedBy.join(' + ') }}</span>
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
              <template v-else-if="c.decompPitfalls">
                <div v-for="(p, i) in c.decompPitfalls" :key="i" class="err">
                  <RichText :text="p.why" />
                  <span v-if="p.explainedBy.length" class="cites">{{ p.explainedBy.join(' + ') }}</span>
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
            </div>

            <p class="note"><RichText :text="c.note" /></p>
            <div v-if="c.requires.length" class="reqs">requires: {{ c.requires.join(' · ') }}</div>
            <div v-if="c.metas.length" class="chip-row">
              <span class="chip-label">meta</span>
              <span v-for="(m, i) in c.metas" :key="i" class="meta-chip">{{ m }}</span>
            </div>
            <div v-if="c.laws.length" class="chip-row">
              <span class="chip-label">laws</span>
              <span v-for="(l, i) in c.laws" :key="i" class="meta-chip law-chip">{{ l }}</span>
            </div>
            <div v-if="c.governedBy.length" class="chip-row">
              <span class="chip-label">conv</span>
              <span v-for="(cv, i) in c.governedBy" :key="i" class="meta-chip conv-chip">{{ cv }}</span>
            </div>
            <details class="json">
              <summary>json</summary>
              <pre>{{ c.json }}</pre>
            </details>
          </article>
        </div>
    </section>
  </div>
</template>

<style scoped>
.tax { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: #1f2937; }
.tax-head h1 { font-size: 1.6rem; font-weight: 700; margin: 0 0 .25rem; }
.tax-head p { color: #6b7280; margin: 0 0 .6rem; }
.mode { display: flex; gap: .4rem; margin-bottom: 1rem; }
.mode button { font-size: .78rem; padding: .25rem .7rem; border: 1px solid #d1d5db; border-radius: 999px; background: #fff; color: #4b5563; cursor: pointer; }
.mode button.active { background: #111827; border-color: #111827; color: #fff; }
.mode-gap { width: .6rem; }
.cites { font-size: .72rem; color: #b91c1c; margin-left: .4rem; }
.law-chip { background: #ecfdf5; color: #047857; }
.conv-chip { background: #eff6ff; color: #1d4ed8; }
.skill > h2 { font-size: 1.15rem; font-weight: 700; margin: 2rem 0 .75rem; padding-bottom: .35rem; border-bottom: 2px solid #111827; }
.group-head { margin: 1.25rem 0 .5rem; }
.group-head h3 { font-size: 1rem; font-weight: 700; margin: 0; }
.blurb { color: #6b7280; font-size: .85rem; margin: .15rem 0 0; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: .9rem; }
.card { border: 1px solid #e5e7eb; border-radius: 10px; padding: .85rem .95rem; background: #fff; }
.card-head { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; }
.badges { display: flex; gap: .3rem; flex-shrink: 0; }
.badge { font-size: .68rem; padding: .1rem .4rem; border-radius: 999px; white-space: nowrap; }
.badge.prio { background: #111827; color: #fff; }
.badge.kind { background: #eef2ff; color: #4338ca; }
.badge.group { background: #f3f4f6; color: #4b5563; }
.fam-id { font-size: .7rem; color: #9ca3af; }
.cond { font-size: .78rem; color: #6b7280; font-style: italic; margin-top: .2rem; }
.correct { margin: .6rem 0; padding: .5rem .6rem; background: #f0fdf4; border-left: 3px solid #22c55e; border-radius: 4px; overflow-x: auto; }
.examples { display: flex; flex-wrap: wrap; gap: .35rem .9rem; }
.ex { padding: .1rem .3rem; }
.answer { margin-top: .4rem; font-size: .85rem; color: #374151; }
.decomp { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; margin: .2rem 0; }
.arrow { color: #9ca3af; }
.chunk { display: inline-flex; align-items: center; }
.opname { font-size: .72rem; color: #6b7280; margin-left: .25rem; }
.errors { margin: .5rem 0; padding: .5rem .6rem; background: #fef2f2; border-left: 3px solid #ef4444; border-radius: 4px; overflow-x: auto; }
.err { font-size: .85rem; color: #7f1d1d; margin: .15rem 0; }
.revise { font-size: .75rem; color: #9f1239; font-style: italic; margin-left: .4rem; }
.note { font-size: .82rem; color: #4b5563; margin: .5rem 0 .4rem; }
.reqs { font-size: .75rem; color: #6b7280; margin: 0 0 .35rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; margin-top: .25rem; }
.chip-label { font-size: .68rem; color: #9ca3af; min-width: 2.2rem; }
.meta-chip { font-size: .7rem; padding: .12rem .45rem; background: #f3f4f6; color: #4b5563; border-radius: 999px; }
.json { margin-top: .5rem; }
.json summary { font-size: .7rem; color: #9ca3af; cursor: pointer; user-select: none; }
.json pre { font-size: .72rem; line-height: 1.45; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: .5rem .6rem; overflow-x: auto; margin: .3rem 0 0; }
</style>
