<script setup lang="ts">
import { computed } from 'vue'
import MathExpr from '../components/MathExpr.vue'
import { families, groups, metaPatterns } from '../data'
import { namespaceOf, type Family, type Namespace } from '../data/family.schema'

const namespaces: { key: Namespace; label: string }[] = [
  { key: 'notation', label: 'Skill 1 · Notation Fluency' },
  { key: 'structure', label: 'Skill 2 · Structural Recognition' },
]

function metaLabel(ns: Namespace, id: string): string {
  const m = metaPatterns[ns].find(mp => mp.id === id)
  return m ? `${m.id} · ${m.title}` : id
}

// Flatten each family into a dumb view-model so the template needs no narrowing.
interface CardVM {
  id: string
  title: string
  kind: string
  priority?: number
  conditions?: string
  note: string
  metas: string[]
  requires: string[]
  equivChain?: string
  equivPitfalls?: { latex: string; revise: string[] }[]
  classExamples?: string[]
  classAnswer?: string
  classPitfalls?: { answer: string; why: string; revise: string[] }[]
  decomp?: { expr: string; chunks: string[]; op: string }[]
  decompPitfalls?: { why: string; revise: string[] }[]
}

function familyTitle(id: string): string {
  return families.find(f => f.id === id)?.title ?? id
}

function toVM(f: Family): CardVM {
  const ns = namespaceOf(f.id)
  const base = {
    id: f.id, title: f.title, kind: f.kind, priority: f.priority,
    conditions: f.conditions, note: f.note,
    metas: f.metaPatterns.map(m => metaLabel(ns, m)),
    requires: f.requires.map(familyTitle),
  }
  if (f.kind === 'equivalence') {
    return {
      ...base,
      equivChain: f.equivalents.join(' = '),
      equivPitfalls: f.pitfalls.map(p => ({
        latex: `${f.equivalents[0]} \\neq ${p.expr}`,
        revise: (p.revise ?? []).map(familyTitle),
      })),
    }
  }
  if (f.kind === 'classification') {
    return {
      ...base, classExamples: f.examples, classAnswer: f.answer,
      classPitfalls: f.pitfalls.map(p => ({
        answer: p.answer, why: p.why, revise: (p.revise ?? []).map(familyTitle),
      })),
    }
  }
  return {
    ...base, decomp: f.examples,
    decompPitfalls: f.pitfalls.map(p => ({
      why: p.why, revise: (p.revise ?? []).map(familyTitle),
    })),
  }
}

const sections = computed(() =>
  namespaces.map(nsDef => ({
    ...nsDef,
    groups: groups[nsDef.key]
      .map(g => ({
        ...g,
        cards: families
          .filter(f => namespaceOf(f.id) === nsDef.key && f.group === g.slug)
          .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || a.title.localeCompare(b.title))
          .map(toVM),
      }))
      .filter(g => g.cards.length > 0),
  })).filter(s => s.groups.length > 0),
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
    </header>

    <section v-for="ns in sections" :key="ns.key" class="skill">
      <h2>{{ ns.label }}</h2>

      <div v-for="g in ns.groups" :key="g.slug" class="group">
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
                <span class="badge kind">{{ c.kind }}</span>
              </div>
            </div>
            <div v-if="c.conditions" class="cond">for {{ c.conditions }}</div>

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
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
              <template v-else-if="c.classPitfalls">
                <div v-for="(p, i) in c.classPitfalls" :key="i" class="err">
                  not <strong>{{ p.answer }}</strong> — {{ p.why }}
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
              <template v-else-if="c.decompPitfalls">
                <div v-for="(p, i) in c.decompPitfalls" :key="i" class="err">
                  {{ p.why }}
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
            </div>

            <p class="note">{{ c.note }}</p>
            <div v-if="c.requires.length" class="reqs">requires: {{ c.requires.join(' · ') }}</div>
            <div v-if="c.metas.length" class="metas">
              <span v-for="(m, i) in c.metas" :key="i" class="meta-chip">{{ m }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tax { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: #1f2937; }
.tax-head h1 { font-size: 1.6rem; font-weight: 700; margin: 0 0 .25rem; }
.tax-head p { color: #6b7280; margin: 0 0 1rem; }
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
.metas { display: flex; flex-wrap: wrap; gap: .3rem; }
.meta-chip { font-size: .7rem; padding: .12rem .45rem; background: #f3f4f6; color: #4b5563; border-radius: 999px; }
</style>
