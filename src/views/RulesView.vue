<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { ruleTree, rules, sheets, errorPatterns, skills } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type RuleDef, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect } from '../inspect'

// THE DO/IS REGISTRY. A flat collection of student-facing sentences, each saying
// what a written form IS or what to DO with it.
//
// The entries carry no context of their own — that is the design, not a gap
// (src/data/skill.schema → Rules). So this page is built almost entirely out of
// REVERSE INDEXES: the mistakes a sentence prevents and the skills that teach it
// are found by asking who cites it, never by reading anything on the sentence.
// Which is also why the page cannot go stale — it says exactly what the rest of
// the data says about each sentence, or nothing.
//
// ON THE ROW SHELL since 2026-07-27 (Layer{Page,Section,Row}), and it is the FLAT
// case: no sections, one panel, `LayerSection` with no title. A registry of
// sentences has no structure to give it, and the container tolerating that was
// half the point of building this layer before the manifest unification.
const t = (ls: LocalizedString) => loc(ls, lang.value)

const L = computed(() => lang.value === 'de'
  ? { reads: 'fasst zusammen', drills: 'geübt in',  prevents: 'verhindert' }
  : { reads: 'summarises',      drills: 'drilled by', prevents: 'prevents' })

const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

// THE THREE INDEXES, two of them backwards.
//   errors  — `error.rules`, authored 2026-07-27. This used to be derived
//             through the cards (rule → summarizes → card ← corrupts ← error),
//             which guessed and capped at four; now it is exactly what /errors
//             shows, because it is the same edge read the other way.
//   skills  — `skill.rules`.
//   reads   — the one FORWARD edge, `summarizes`: the bridge claim that this
//             sentence is the student-facing form of those formal statements.
const preventedBy = (m: RuleDef) => errorPatterns
  .filter(e => e.rules.includes(m.id))
  .sort((a, b) => b.frequency - a.frequency)
  .map(e => ({ id: e.id, name: t(e.name), frequency: e.frequency, to: `/errors#${e.id}` }))

const drilledBy = (m: RuleDef) => skills
  .filter(s => s.rules.includes(m.id))
  .map(s => ({ id: s.id, name: t(s.name), to: `/skills#${s.id}` }))

const readsOf = (m: RuleDef) => m.summarizes.map(id => {
  const c = cardIndex.get(id)
  return { id, name: c ? t(c.card.name) : id, to: `/${c?.layer.slug}#${id}` }
})

// THE SHEET, on the row of the rule that heads it. A sheet is presentation over
// the pool (src/data/cheatsheets.json): it names sentences that already exist
// here and owns none of them, so everything below is a lookup.
//
// It renders as a `.wide` block — the full-width slot the tower uses for a
// derivation — because a cheat sheet is NOT a row. A row is four columns of
// prose with one formula; a sheet is formulas only, in a grid, under headings.
// Same data, different rendering: the headings come from a group's `title` or
// its heading rule's sentence, the formulas from each member's `latex`, and
// everything else on a rule — gloss, prevents, folds — is dropped.
const ruleById = new Map(rules.map(r => [r.id, r]))
const sheetByRule = new Map(sheets.map(s => [s.rule, s]))
const sheetFor = (id: string) => {
  const s = sheetByRule.get(id)
  if (!s) return undefined
  return s.groups.map(g => ({
    title: t(g.title),
    layout: g.layout,
    // One column per `latex` index in a table, so an algebraic form and its root
    // form sit under each other. Members of a table group are authored with the
    // same number of lines; a ragged one would just leave a hole.
    columns: Math.max(...g.rules.map(r => ruleById.get(r)!.latex.length), 1),
    cells: g.rules.flatMap(r => ruleById.get(r)!.latex.map(latex => ({ id: r, latex }))),
  }))
}

// A sentence nothing cites is dead weight: context is the only thing that gives
// it meaning, and with no error and no skill behind it there is none to give.
// REACH AS GARBAGE COLLECTION, not as an admission test — what belongs in the
// registry is whatever turns out to be important, however narrowly it is used.
const items = computed(() => rules.map(m => {
  const errors = preventedBy(m), sk = drilledBy(m)
  return {
    id: m.id, kind: m.kind, rule: t(m.rule), latex: m.latex, note: t(m.note),
    errors, skills: sk, reads: readsOf(m),
    sheet: sheetFor(m.id),
    orphan: errors.length === 0 && sk.length === 0,
    raw: m,
  }
}))
const orphans = computed(() => items.value.filter(i => i.orphan).length)

// FOUR COLUMNS: the sentence | its formula | its gloss | the mistakes it prevents.
// The maths column arrived with `latex` (2026-07-28) and changes what the page
// is for: a student hunting "the one about exponents" scans formulas, not 26
// sentences, and the page reads as a formulary rather than a list of prose.
// The rail is wider than the tower's 11rem because what sits in it is a
// SENTENCE, not a name. Four columns inside 89rem is tight — 22 + 18 + 22 + 22
// plus three 1.6rem gaps is 88.8 — so the prose columns run under the shared
// 26rem measure. The skills that teach a rule fold into the strip instead:
// rule.dominant-op-last is cited by 13, which is a list and not a column, while
// nothing prevents more than three mistakes.
const COLS = 'minmax(0, 22rem) minmax(0, 18rem) minmax(0, 22rem) minmax(0, 22rem)'
</script>

<template>
  <LayerPage
    :title="t(ruleTree.meta.title)"
    :lead="t(ruleTree.meta.blurb)"
    :about="inspect ? t(ruleTree.meta.note) : undefined"
    :cols="COLS"
  >
    <template #bar-right>
      <span v-if="inspect && orphans" class="orphan-chip" title="cited by no error and no skill">{{ orphans }} orphaned</span>
    </template>

    <!-- No title: the list is flat, so there is nothing to head it with. -->
    <LayerSection>
      <LayerRow
        v-for="m in items" :key="m.id"
        :id="m.id" :name="m.rule" :record="m.raw"
        :kind="inspect ? m.kind : undefined"
        :targeted="m.id === targetId"
      >
        <template #folds>
          <RefFold :label="L.reads" :links="m.reads" />
          <RefFold :label="L.drills" :links="m.skills" derived />
        </template>

        <!-- One line per formula: a sentence can carry several, and a formulary
             wants a row each. Left-aligned like the tower's statements — KaTeX
             centres display mode, which would float each formula in its cell and
             break the vertical line the column makes. -->
        <div v-if="m.latex.length" class="maths">
          <div v-for="(l, i) in m.latex" :key="i" class="stmt"><MathExpr :latex="l" display /></div>
        </div>

        <div class="cell muted gloss"><RichText :text="m.note" /></div>

        <!-- THE PITCH OF THE WHOLE LAYER: learn this one sentence and these
             mistakes stop happening. Derived, hence the arrows — it is
             `error.rules` read backwards, so it can never disagree with what
             /errors shows. Uncapped, because nothing prevents more than three;
             the old card-mediated version needed a cap of four. -->
        <div v-if="m.errors.length" class="cell prevents">
          <span class="label">{{ L.prevents }}</span>
          <RouterLink v-for="e in m.errors" :key="e.id" class="prevent" :to="e.to">
            <span class="arrow">→</span>{{ e.name }}<span class="freq">{{ '★'.repeat(e.frequency) }}</span>
          </RouterLink>
        </div>
        <div v-if="m.sheet" class="wide sheet">
          <section v-for="(g, i) in m.sheet" :key="i" class="sheet-group">
            <h5 class="sheet-head">{{ g.title }}</h5>
            <div
              class="sheet-body" :class="g.layout"
              :style="g.layout === 'table' ? { gridTemplateColumns: `repeat(${g.columns}, max-content)` } : undefined"
            >
              <RouterLink v-for="(c, j) in g.cells" :key="j" class="formula" :to="`/rules#${c.id}`">
                <MathExpr :latex="c.latex" />
              </RouterLink>
            </div>
          </section>
        </div>
      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  .maths    { grid-area: 2 / 2; }
  .gloss    { grid-area: 2 / 3; }
  .prevents { grid-area: 2 / 4; }
}

.maths { min-width: 0; }
/* `overflow-x: auto` makes the computed `overflow-y` AUTO as well, so a formula
   whose ink exceeds its line box gets a surprise vertical scrollbar. The padding
   absorbs it, and gives radicals and exponents room at the top. */
.stmt { overflow-x: auto; padding: .3rem 0; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }

/* A list of links that happens to sit in a prose column: it takes the measure
   and the content serif from `.cell` and lays itself out as a list. */
.prevents { display: flex; flex-direction: column; gap: .15rem; }
.label { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); margin-bottom: .1rem; }
.prevent { color: var(--text-muted); text-decoration: none; text-indent: -.9rem; padding-left: .9rem; line-height: 1.45; }
.prevent:hover { color: var(--accent); }
.arrow { color: var(--text-faint); margin-right: .35rem; }
.prevent:hover .arrow { color: var(--accent); }
/* The mistake's own ★ carried across, so the list is weighted as well as
   ordered: it says which of the mistakes this rule heads off is worth heading
   off most. */
.freq { font-size: .7rem; color: var(--text-faint); letter-spacing: .06em; margin-left: .4rem; white-space: nowrap; }

/* --- the cheat sheet ----------------------------------------------------- */
/* --band, not --bg: it sits INSIDE the panel, so it takes the ladder's middle
   rung like the tower's derivation block. Painted the page colour it would read
   as a hole punched through to the page behind. */
.sheet { padding: .8rem 1rem 1rem; background: var(--band); border: 1px solid var(--border); border-radius: 6px; }
/* MULTI-COLUMN, or it is a banner rather than a sheet. Each group laid out as a
   full-width row left the page 80% empty and put "same base" and "same exponent"
   a screen apart, when the whole value of a formulary is seeing them at once.
   Flowing the groups into columns is what a printed one does.
   `break-inside: avoid` keeps a heading with its formulas. */
.sheet { columns: 23rem; column-gap: 2.5rem; }
.sheet-group { break-inside: avoid; }
.sheet-group + .sheet-group { margin-top: .9rem; }
/* Sans, small, muted — the headings are structure, and the formulas are the
   content. On a sheet the formulas must be the loudest thing by a distance. */
.sheet-head { margin: 0 0 .35rem; font-size: .68rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
.sheet-body { display: grid; gap: .3rem 1.6rem; align-items: baseline; justify-content: start; }
/* `flow` is FLEX, not grid: a grid track squeezes a formula to the track width
   and KaTeX then breaks it mid-expression — $(a+b)^n \neq a^n + b^n$ came apart
   after the $+$. Flex wraps BETWEEN items and never inside one, which is the
   whole requirement for a ragged group. */
.sheet-body.flow { display: flex; flex-wrap: wrap; gap: .3rem 1.6rem; }
.formula { display: block; padding: .2rem .1rem; color: var(--text); text-decoration: none; border-radius: 4px; white-space: nowrap; }
/* Every formula is a link back to its own row, so the sheet doubles as the
   table of contents for the rules below it. */
.formula:hover { background: var(--surface); color: var(--accent); }

.orphan-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
</style>
