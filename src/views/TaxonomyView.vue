<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopover } from 'naive-ui'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import { skills, drills, groups, skillKinds, metaPatterns, laws, conventions, errorPatterns, rawById } from '../data'
import { loc, type Skill, type Drill } from '../data/skill.schema'
import { lang } from '../lang'

// The skills catalog. A card rests quiet — title · the forms the skill looks
// like · the rationale note — and reveals its coordinates (laws / conventions /
// meta-patterns / errors), prerequisites, drill pitfalls and raw JSON behind a
// per-card `details` toggle, each labeled with its field name.
function metaLabel(id: string): string {
  const m = metaPatterns.find(mp => mp.id === id)
  return m ? `${m.code} · ${loc(m.title, lang.value)}` : id
}
const layerNames = new Map(
  [...laws, ...conventions, ...errorPatterns].map(x => [x.id, x] as const),
)
function layerLabel(id: string): string {
  const x = layerNames.get(id)
  return x ? `${x.code} · ${loc(x.name, lang.value)}` : id
}
function skillTitle(id: string): string {
  const f = skills.find(f => f.id === id)
  return f ? loc(f.title, lang.value) : id
}

// Per-card disclosure state (the extra fields, and the raw JSON within them).
const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const toggle = (id: string) => (open.value.has(id) ? open.value.delete(id) : open.value.add(id))
const toggleJson = (id: string) => (jsonOpen.value.has(id) ? jsonOpen.value.delete(id) : jsonOpen.value.add(id))

// Flatten each skill into a dumb view-model so the template needs no narrowing.
interface CardVM {
  id: string
  title: string
  kind: string
  group: string
  json: string
  conditions?: string
  note: string
  illustration?: string
  errors: string[]
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

// A skill (the strategy) joined with its drill (the material, if any).
const drillBySkill = new Map<string, Drill>(drills.map(d => [d.skill, d]))

function toVM(f: Skill): CardVM {
  const base = {
    id: f.id, title: loc(f.title, lang.value), kind: f.kind, group: f.group,
    conditions: f.conditions, note: loc(f.note, lang.value),
    illustration: f.illustration, errors: f.errors.map(layerLabel),
    json: JSON.stringify(rawById.get(f.id), null, 2),
    metas: f.metaPatterns.map(m => metaLabel(m)),
    requires: f.requires.map(skillTitle),
    laws: f.justifiedBy.map(layerLabel),
    governedBy: f.governedBy.map(layerLabel),
  }
  const d = drillBySkill.get(f.id)
  if (d?.kind === 'equivalence') {
    return {
      ...base,
      equivChain: d.equivalents.join(' = '),
      equivPitfalls: d.pitfalls.map(p => ({
        latex: `${d.equivalents[0]} \\neq ${p.expr}`,
        revise: (p.revise ?? []).map(skillTitle),
        explainedBy: (p.explainedBy ?? []).map(layerLabel),
      })),
    }
  }
  if (d?.kind === 'classification') {
    return {
      ...base, classExamples: d.examples, classAnswer: d.answer,
      classPitfalls: d.pitfalls.map(p => ({
        answer: p.answer, why: loc(p.why, lang.value),
        revise: (p.revise ?? []).map(skillTitle),
        explainedBy: (p.explainedBy ?? []).map(layerLabel),
      })),
    }
  }
  if (d?.kind === 'chunking') {
    return {
      ...base, decomp: d.examples,
      decompPitfalls: d.pitfalls.map(p => ({
        why: loc(p.why, lang.value),
        revise: (p.revise ?? []).map(skillTitle),
        explainedBy: (p.explainedBy ?? []).map(layerLabel),
      })),
    }
  }
  return base
}

const byTitle = (a: Skill, b: Skill) =>
  loc(a.title, lang.value).localeCompare(loc(b.title, lang.value))

// Skills can be sectioned by `group` (classroom topic, skillGroups order) or by
// `kind` (the strategy type). Cards sort by title within a section; skills carry
// no drilling sequence — that lives in the drill layer.
const groupBy = ref<'group' | 'kind'>('group')

interface Section { slug: string; title: string; blurb?: string; cards: CardVM[] }

const groupSections = computed<Section[]>(() =>
  groups
    .map(g => ({ slug: g.slug, title: g.title, blurb: g.blurb, cards: skills.filter(f => f.group === g.slug).sort(byTitle).map(toVM) }))
    .filter(s => s.cards.length > 0),
)
const kindSections = computed<Section[]>(() =>
  skillKinds
    .map(k => ({ slug: k.slug, title: k.title, blurb: k.blurb, cards: skills.filter(f => f.kind === k.slug).sort(byTitle).map(toVM) }))
    .filter(s => s.cards.length > 0),
)
const sections = computed(() => (groupBy.value === 'group' ? groupSections.value : kindSections.value))

function hasErrors(c: CardVM): boolean {
  return !!(c.equivPitfalls?.length || c.classPitfalls?.length || c.decompPitfalls?.length)
}
</script>

<template>
  <div class="tax">
    <div class="top-bar">
      <div class="mode">
        <button :class="{ active: groupBy === 'group' }" @click="groupBy = 'group'">by group</button>
        <button :class="{ active: groupBy === 'kind' }" @click="groupBy = 'kind'">by kind</button>
      </div>
    </div>

    <section v-for="g in sections" :key="g.slug" class="group">
      <div class="group-title">
        <h3>{{ g.title }}</h3>
        <NPopover v-if="g.blurb" trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this group">i</button></template>
          <div class="pop">{{ g.blurb }}</div>
        </NPopover>
      </div>

      <div class="cards">
        <article v-for="c in g.cards" :key="c.id" class="card">
          <div class="card-top">
            <span class="eyebrow">{{ c.kind }} · {{ c.group }}</span>
            <button class="disclose" @click="toggle(c.id)">{{ open.has(c.id) ? 'less' : 'details' }}</button>
          </div>
          <div class="card-head">
            <h4>{{ c.title }}</h4>
          </div>

          <!-- primary content: what this skill looks like -->
          <div class="forms">
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
            <MathExpr v-else-if="c.illustration" :latex="c.illustration" display />
          </div>

          <p class="body"><RichText :text="c.note" /></p>

          <div v-if="open.has(c.id)" class="details">
            <dl class="fields">
              <div class="field"><dt>kind</dt><dd>{{ c.kind }}</dd></div>
              <div class="field"><dt>id</dt><dd><code>{{ c.id }}</code></dd></div>
              <div class="field"><dt>group</dt><dd>{{ c.group }}</dd></div>
              <div v-if="c.conditions" class="field"><dt>conditions</dt><dd><MathExpr :latex="c.conditions" /></dd></div>
              <div v-if="c.requires.length" class="field">
                <dt>requires</dt><dd><span v-for="(r, i) in c.requires" :key="i" class="chip">{{ r }}</span></dd>
              </div>
              <div v-if="c.laws.length" class="field">
                <dt>justifiedBy</dt><dd><span v-for="(l, i) in c.laws" :key="i" class="chip">{{ l }}</span></dd>
              </div>
              <div v-if="c.governedBy.length" class="field">
                <dt>governedBy</dt><dd><span v-for="(cv, i) in c.governedBy" :key="i" class="chip">{{ cv }}</span></dd>
              </div>
              <div v-if="c.metas.length" class="field">
                <dt>metaPatterns</dt><dd><span v-for="(m, i) in c.metas" :key="i" class="chip">{{ m }}</span></dd>
              </div>
              <div v-if="c.errors.length" class="field">
                <dt>errors</dt><dd><span v-for="(er, i) in c.errors" :key="i" class="chip">{{ er }}</span></dd>
              </div>
            </dl>

            <div v-if="hasErrors(c)" class="pitfalls">
              <div class="pitfalls-head">pitfalls</div>
              <template v-if="c.equivPitfalls">
                <div v-for="(p, i) in c.equivPitfalls" :key="i" class="pit">
                  <MathExpr :latex="p.latex" />
                  <span v-if="p.explainedBy.length" class="cites">{{ p.explainedBy.join(' + ') }}</span>
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
              <template v-else-if="c.classPitfalls">
                <div v-for="(p, i) in c.classPitfalls" :key="i" class="pit">
                  not <strong>{{ p.answer }}</strong> — <RichText :text="p.why" />
                  <span v-if="p.explainedBy.length" class="cites">{{ p.explainedBy.join(' + ') }}</span>
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
              <template v-else-if="c.decompPitfalls">
                <div v-for="(p, i) in c.decompPitfalls" :key="i" class="pit">
                  <RichText :text="p.why" />
                  <span v-if="p.explainedBy.length" class="cites">{{ p.explainedBy.join(' + ') }}</span>
                  <span v-if="p.revise.length" class="revise">→ revise: {{ p.revise.join(' · ') }}</span>
                </div>
              </template>
            </div>

            <button class="json-toggle" @click="toggleJson(c.id)">{{ jsonOpen.has(c.id) ? 'hide json' : 'json' }}</button>
            <pre v-if="jsonOpen.has(c.id)" class="json">{{ c.json }}</pre>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tax { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

.top-bar { display: flex; justify-content: flex-end; margin-bottom: .25rem; }
.mode { display: flex; gap: .4rem; }
.mode button { font-size: .78rem; padding: .25rem .7rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-muted); cursor: pointer; }
.mode button.active { background: var(--text); border-color: var(--text); color: #fff; }

.group-title { display: flex; align-items: center; gap: .4rem; margin: 1.5rem 0 .6rem; }
.group-title h3 { font-size: .95rem; font-weight: 700; color: var(--text); margin: 0; }
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 260px; font-size: .8rem; line-height: 1.45; color: var(--text); }

.cards { display: grid; grid-template-columns: 1fr; gap: .7rem; }
@media (min-width: 560px) { .cards { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }

/* Card: quiet at rest — title · forms · note */
.card { position: relative; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.3rem .9rem .8rem; background: var(--surface); }
.card-top { position: absolute; top: .35rem; left: .9rem; right: .9rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.eyebrow { flex: 1; min-width: 0; font-size: .6rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-head { display: flex; align-items: baseline; gap: .5rem; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }

.forms { margin: .5rem 0 0; overflow-x: auto; }
.examples { display: flex; flex-wrap: wrap; gap: .35rem .9rem; }
.ex { padding: .1rem .2rem; }
.answer { margin-top: .35rem; font-size: .82rem; color: var(--text-muted); }
.decomp { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; margin: .2rem 0; }
.arrow { color: var(--text-faint); }
.chunk { display: inline-flex; align-items: center; }
.opname { font-size: .72rem; color: var(--text-muted); margin-left: .25rem; }
.body { font-size: .84rem; color: var(--text); margin: .5rem 0 0; line-height: 1.45; }

/* Disclosed detail — labeled with the field name */
.details { margin-top: .65rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.chip { font-size: .7rem; padding: .1rem .45rem; background: var(--chip-bg); color: var(--text-muted); border-radius: 999px; }

.pitfalls { margin-top: .6rem; }
.pitfalls-head { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin-bottom: .3rem; }
.pit { border-left: 2px solid var(--bad); padding-left: .5rem; font-size: .82rem; color: var(--text); margin: .3rem 0; }
.cites { font-size: .72rem; color: var(--bad); margin-left: .4rem; }
.revise { font-size: .72rem; color: var(--text-muted); font-style: italic; margin-left: .4rem; }

.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: #374151; }
</style>
