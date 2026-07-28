<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { skills, drills, groups, skillKinds, rules, errorPatterns, rawById, skillTree } from '../data'
import { loc, type Skill, type Drill, type LocalizedString } from '../data/skill.schema'
import { cardIndex } from '../data/layers'
import { clipProse } from '../prose'
import { lang } from '../lang'
import { inspect } from '../inspect'

// THE SKILLS CATALOG — the top of the curated stack, and the only layer that
// cites all three below it: a skill rests on the tower's CARDS, teaches the
// pool's RULES, and guards against the ERRORS.
//
// ON THE ROW SHELL since 2026-07-28 (Layer{Page,Section,Row}), the last page to
// come off the card grid. What the grid cost was not looks but reading: 74
// bordered boxes in three columns stretched every card in a row to the tallest,
// and a 300px column is too narrow for a formula that does not reflow — the
// equivalence chains overflowed a column each. Rows give the illustration a real
// measure and put the four coordinates of a skill in four fixed places.
//
// THE FOUR CELLS: name | the illustration | the rationale | the mistakes it
// heads off. The last one is the pitch of the whole layer and the mirror of
// /rules' `prevents` column — and this page is the ONLY place the skill→error
// edge is visible, since errors must not cite skills (that would close the
// cycle; see docs/TODO.md, "The DAG is settled").
//
// ⚠️ THE DRILL LAYER IS FROZEN (docs/TODO.md), so the row deliberately does NOT
// lean on it. Every one of the 74 skills carries an `illustration`, which is what
// makes the maths column uniform; the drill's own material — the equivalents
// chain, the classification examples, the chunk decompositions and all the
// pitfalls — is inspection-only, behind a fold, and can be reshaped without
// touching this layout.
const t = (ls: LocalizedString) => loc(ls, lang.value)

// The prose this view owns: fold labels, the two cell labels, the section-by
// switch. Localized like every other page's, even though the skills' own `name`
// and `note` are still English-only — that is a content debt, not a view one.
const L = computed(() => lang.value === 'de'
  ? { rests: 'stützt sich auf', teaches: 'lehrt', requires: 'setzt voraus', requiredBy: 'Grundlage für',
      guards: 'schützt vor', cond: 'sofern', drill: 'Übungsmaterial', more: 'mehr', less: 'weniger',
      by: 'gliedern nach', byGroup: 'Thema', byKind: 'Art', dominant: 'dominante Operation', not: 'nicht',
      revise: 'wiederholen' }
  : { rests: 'rests on', teaches: 'teaches', requires: 'requires', requiredBy: 'required by',
      guards: 'guards against', cond: 'provided', drill: 'drill material', more: 'more', less: 'less',
      by: 'section by', byGroup: 'topic', byKind: 'kind', dominant: 'dominant operation', not: 'not',
      revise: 'revise' })

// Deep link from /rules, where each rule lists the skills that teach it.
const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

// ── the four reference edges, three authored and one backwards ──────────────
// `restsOn` resolves in the tower (validated: card ids only), `rules` in the
// pool, `requires` inside this layer. `requiredBy` is the reverse of `requires`
// and is the answer to "why does this skill exist" for every RECOGNITION skill:
// failing to recognise a shape produces no wrong answer, only inaction, so those
// skills are justified downstream by what they enable and never upstream by what
// they prevent (docs/TODO.md, "Why an error cannot rescue these").
const skillName = (id: string) => {
  const s = skills.find(x => x.id === id)
  return s ? t(s.name) : id
}
const skillLinks = (ids: string[]) => ids.map(id => ({ id, name: skillName(id), to: `/skills#${id}` }))

const cardLinks = (ids: string[]) => ids.map(id => {
  const c = cardIndex.get(id)
  return { id, name: c ? t(c.card.name) : id, to: `/${c?.layer.slug}#${id}` }
})

const ruleById = new Map(rules.map(r => [r.id, r]))
const ruleLinks = (ids: string[]) => ids.map(id => {
  const r = ruleById.get(id)
  return { id, name: r ? t(r.rule) : id, to: `/rules#${id}` }
})

const errById = new Map(errorPatterns.map(e => [e.id, e]))
// Frequency-ordered, like everywhere else the ★ appears: the mistake most worth
// heading off leads the list.
const errorLinks = (ids: string[]) => ids
  .map(id => errById.get(id)!)
  .sort((a, b) => b.frequency - a.frequency)
  .map(e => ({ id: e.id, name: t(e.name), frequency: e.frequency, to: `/errors#${e.id}` }))

const requiredBy = new Map<string, string[]>()
for (const s of skills) for (const r of s.requires) requiredBy.set(r, [...(requiredBy.get(r) ?? []), s.id])

const groupTitle = new Map(groups.map(g => [g.slug, g.title]))
const kindTitle = new Map(skillKinds.map(k => [k.slug, k.title]))

// PROSE TRUNCATION, the tower's (src/prose.ts): 9 of the 74 notes run past 240
// characters — the factoring skills carry a paragraph — and one of them would
// otherwise set the height of its whole row.
const CUT = 240
const clip = (s: string) => clipProse(s, CUT)

// The drill joined by skill id. Read-only and inspection-only; see the banner.
const drillBySkill = new Map<string, Drill>(drills.map(d => [d.skill, d]))

interface Row {
  id: string; kind: string; group: string; name: string; note: string
  illustration?: string; conditions?: string
  requires: { id: string; name: string; to: string }[]
  requiredBy: { id: string; name: string; to: string }[]
  restsOn: { id: string; name: string; to: string }[]
  rules: { id: string; name: string; to: string }[]
  errors: { id: string; name: string; frequency: number; to: string }[]
  drill?: Drill
  contrast: boolean
  raw: unknown
}

function toRow(s: Skill): Row {
  const errors = errorLinks(s.errors)
  const rby = skillLinks(requiredBy.get(s.id) ?? [])
  return {
    id: s.id, kind: s.kind, group: s.group, name: t(s.name), note: t(s.note),
    illustration: s.illustration, conditions: s.conditions,
    requires: skillLinks(s.requires), requiredBy: rby,
    restsOn: cardLinks(s.restsOn), rules: ruleLinks(s.rules), errors,
    drill: drillBySkill.get(s.id),
    // NEITHER JUSTIFICATION HOLDS: it guards no mistake and enables no other
    // skill. Not a defect and not a backlog — it is the CONTRAST SET, and the
    // label says so. Nobody believes $a+b \neq b+a$, so authoring an error for it
    // would be fabricating evidence; what these two are for is the drill-design
    // reason the error layer can never express, that a Same-or-Different session
    // needs items whose answer is `same` or students learn to answer "different"
    // by reflex. It resolves to exactly the two skills `auditCoverage` names, so
    // the page and the load-time audit are reading the same thing.
    contrast: errors.length === 0 && rby.length === 0,
    raw: rawById.get(s.id),
  }
}

// Skills sort by name within a section; the layer carries no drilling sequence.
const byName = (a: Skill, b: Skill) => t(a.name).localeCompare(t(b.name))

// TWO SECTIONINGS OF ONE LIST, which no other layer has: `group` is the
// classroom topic and `kind` the strategy type, they cross-cut, and both are
// real ways in. The switch sits in LayerPage's `filters` slot — the same place
// the tower's chips sit — because it is the same kind of control: it changes what
// the page shows without leaving it.
const sectionBy = ref<'group' | 'kind'>('group')

interface Sec { slug: string; title: string; blurb?: string; items: Row[] }
const sectionsOf = (reg: { slug: string; title: string; blurb?: string }[], key: 'group' | 'kind') =>
  reg
    .map(g => ({ slug: g.slug, title: g.title, blurb: g.blurb, items: skills.filter(s => s[key] === g.slug).sort(byName).map(toRow) }))
    .filter(s => s.items.length > 0)

const sections = computed<Sec[]>(() =>
  sectionBy.value === 'group' ? sectionsOf(groups, 'group') : sectionsOf(skillKinds, 'kind'))

// THE COMPLEMENTARY COORDINATE in the strip's `kind` slot, never the one the
// section heading already says. A skill has two, and the heading spends one of
// them — so under a topic heading the strip says which strategy it is, and under
// a strategy heading which topic. Content, not plumbing, so it is not gated on
// the mode: on a long page you are usually mid-section with the heading scrolled
// away, which is exactly when the other coordinate orients you.
const stripKind = (r: Row) =>
  sectionBy.value === 'group' ? (kindTitle.get(r.kind) ?? r.kind) : (groupTitle.get(r.group) ?? r.group)

// The size of the contrast set, on the page rather than only in the load log.
const contrastCount = computed(() => skills.filter(s => toRow(s).contrast).length)

// Per-row disclosure: the clipped note, and the drill block.
const expand = ref(new Set<string>())
const drillOpen = ref(new Set<string>())
const toggle = (s: Set<string>, id: string) => (s.has(id) ? s.delete(id) : s.add(id))

// FOUR COLUMNS: name | illustration | rationale | the mistakes it heads off.
// The rail runs to 14rem rather than the shared 11: a skill's name is a phrase
// with a clause in it ("Sum of products — multiplication is inside the terms",
// 52 characters), where a card's is two or three words, and at 11rem the longest
// of them took five lines beside a two-line illustration.
// The maths column is 23rem, wider than the tower's 19, and it is measured
// rather than guessed: the illustrations are equivalence CHAINS of up to five
// forms and the whole point of a chain is to be read across, so a scrollbar here
// costs more than it does on a card's single statement. Rendered, exactly ONE of
// the 74 exceeds 352px — equivalence.product-with-brackets at 363 — and the next
// is 258, so 23rem (368) fits every one of them and 24 would buy nothing.
// ⚠️ Measure that with a `max-content` range over `.katex-html`, never with
// `scrollWidth`: a KaTeX span reports exactly 2px over its box whatever the box
// is, so an overflow check reads as a permanent overrun and widening never
// clears it.
// 14 + 23 + 26 + 20 plus three 1.6rem gaps is 87.8rem, inside the page's 91.
const COLS = 'minmax(0, 14rem) minmax(0, 23rem) minmax(0, var(--measure)) minmax(0, 20rem)'
</script>

<template>
  <LayerPage
    :title="t(skillTree.meta.title)"
    :lead="t(skillTree.meta.blurb)"
    :about="inspect ? t(skillTree.meta.note) : undefined"
    :cols="COLS"
  >
    <template #bar-right>
      <span v-if="inspect && contrastCount" class="contrast-chip" title="guards no mistake and no skill requires it — the contrast items a Same-or-Different session needs">{{ contrastCount }} pure contrast</span>
    </template>

    <template #filters>
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">{{ L.by }}</span>
          <button class="fchip" :class="{ off: sectionBy !== 'group' }" @click="sectionBy = 'group'">
            {{ L.byGroup }}<span class="fcount">{{ groups.length }}</span>
          </button>
          <button class="fchip" :class="{ off: sectionBy !== 'kind' }" @click="sectionBy = 'kind'">
            {{ L.byKind }}<span class="fcount">{{ skillKinds.length }}</span>
          </button>
        </div>
      </div>
    </template>

    <LayerSection v-for="s in sections" :key="s.slug" :title="s.title" :about="s.blurb">
      <LayerRow
        v-for="r in s.items" :key="r.id"
        :id="r.id" :name="r.name" :record="r.raw"
        :kind="stripKind(r)"
        :targeted="r.id === targetId"
      >
        <template #folds>
          <RefFold :label="L.rests" :links="r.restsOn" />
          <RefFold :label="L.teaches" :links="r.rules" />
          <RefFold :label="L.requires" :links="r.requires" />
          <!-- Derived, hence the arrow: `requires` read backwards. Nobody
               maintains it, and it is the only justification a recognition
               skill has. -->
          <RefFold :label="L.requiredBy" :links="r.requiredBy" derived />
        </template>

        <template #strip-right>
          <span v-if="inspect && r.contrast" class="badge">contrast</span>
          <!-- With the json fold, not beside the name: the drill layer is the
               author's material, and this row is deliberately not built on it. -->
          <button v-if="inspect && r.drill" class="dfold" @click="toggle(drillOpen, r.id)">
            {{ drillOpen.has(r.id) ? '▾' : '▸' }} {{ L.drill }}
          </button>
        </template>

        <!-- THE CANONICAL FORM, one per skill and all 74 carry one. Left-aligned
             like the tower's statements: KaTeX centres display mode, which would
             float each illustration in its cell and break the vertical line the
             column makes. -->
        <div class="maths">
          <div v-if="r.illustration" class="stmt"><MathExpr :latex="r.illustration" display /></div>
          <!-- The tower's own quantifier line, for the four skills that carry a
               domain caveat. It qualifies the formula, so it belongs under it
               and not in the prose. -->
          <div v-if="r.conditions" class="quant">{{ L.cond }} <MathExpr :latex="r.conditions" /></div>
        </div>

        <div class="cell note">
          <RichText :text="expand.has(r.id) || !clip(r.note).clipped ? clip(r.note).full : clip(r.note).head" /><template
            v-if="clip(r.note).clipped && !expand.has(r.id)">… </template>
          <button v-if="clip(r.note).clipped" class="more" @click="toggle(expand, r.id)">{{ expand.has(r.id) ? L.less : L.more }}</button>
        </div>

        <!-- THE PITCH: practise this and these mistakes stop happening. Authored
             (`skill.errors`), so no arrow — and uncapped, because nothing here
             guards more than three. -->
        <div v-if="r.errors.length" class="cell guards">
          <span class="label">{{ L.guards }}</span>
          <RouterLink v-for="e in r.errors" :key="e.id" class="guard" :to="e.to">
            <span class="arrow">→</span>{{ e.name }}<span class="freq">{{ '★'.repeat(e.frequency) }}</span>
          </RouterLink>
        </div>

        <!-- FULL WIDTH, and inspection-only: the frozen drill layer's material,
             shown so it stays visible to the author without any of the row's
             geometry depending on it. Three shapes, one per drill kind. -->
        <div v-if="r.drill && drillOpen.has(r.id)" class="wide drill">
          <template v-if="r.drill.kind === 'equivalence'">
            <div class="stmt"><MathExpr :latex="r.drill.equivalents.join(' = ')" display /></div>
            <div v-for="(p, i) in r.drill.pitfalls" :key="i" class="pit">
              <MathExpr :latex="`${r.drill.equivalents[0]} \\neq ${p.expr}`" />
              <span v-if="p.explainedBy?.length" class="cites">{{ p.explainedBy.map(x => errById.get(x) ? t(errById.get(x)!.name) : x).join(' · ') }}</span>
              <span v-if="p.revise?.length" class="revise">{{ L.revise }}: {{ p.revise.map(skillName).join(' · ') }}</span>
            </div>
          </template>
          <template v-else-if="r.drill.kind === 'classification'">
            <div class="examples">
              <span v-for="(ex, i) in r.drill.examples" :key="i"><MathExpr :latex="ex" /></span>
            </div>
            <div class="answer">{{ L.dominant }}: <strong>{{ r.drill.answer }}</strong></div>
            <div v-for="(p, i) in r.drill.pitfalls" :key="i" class="pit">
              {{ L.not }} <strong>{{ p.answer }}</strong> — <RichText :text="t(p.why)" />
              <span v-if="p.explainedBy?.length" class="cites">{{ p.explainedBy.map(x => errById.get(x) ? t(errById.get(x)!.name) : x).join(' · ') }}</span>
              <span v-if="p.revise?.length" class="revise">{{ L.revise }}: {{ p.revise.map(skillName).join(' · ') }}</span>
            </div>
          </template>
          <template v-else>
            <div v-for="(d, i) in r.drill.examples" :key="i" class="decomp">
              <MathExpr :latex="d.expr" />
              <span class="arrow">→</span>
              <span v-for="(ch, j) in d.chunks" :key="j" class="chunk">[<MathExpr :latex="ch" />]</span>
              <span class="opname">{{ d.op }}</span>
            </div>
            <div v-for="(p, i) in r.drill.pitfalls" :key="i" class="pit">
              <RichText :text="t(p.why)" />
              <span v-if="p.explainedBy?.length" class="cites">{{ p.explainedBy.map(x => errById.get(x) ? t(errById.get(x)!.name) : x).join(' · ') }}</span>
              <span v-if="p.revise?.length" class="revise">{{ L.revise }}: {{ p.revise.map(skillName).join(' · ') }}</span>
            </div>
          </template>
        </div>
      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  .maths  { grid-area: 2 / 2; }
  .note   { grid-area: 2 / 3; }
  .guards { grid-area: 2 / 4; }
}

.maths { min-width: 0; }
/* `overflow-x: auto` makes the computed `overflow-y` AUTO as well, so a formula
   whose ink exceeds its line box gets a surprise vertical scrollbar. The padding
   absorbs it, and gives exponents and radicals room at the top. */
.stmt { overflow-x: auto; padding: .3rem 0; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }
.quant { margin-top: .15rem; font-size: .78rem; color: var(--text-muted); }

/* A list of links that happens to sit in a prose column — it takes the measure
   and the content serif from `.cell` and lays itself out as a list. Same
   vocabulary as /rules' `prevents`, because it is the same edge: this is what
   the layer is for. */
.guards { display: flex; flex-direction: column; gap: .15rem; }
.label { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); margin-bottom: .1rem; }
.guard { color: var(--text-muted); text-decoration: none; text-indent: -.9rem; padding-left: .9rem; line-height: 1.45; }
.guard:hover { color: var(--accent); }
.arrow { color: var(--text-faint); margin-right: .35rem; }
.guard:hover .arrow { color: var(--accent); }
.freq { font-size: .7rem; color: var(--text-faint); letter-spacing: .06em; margin-left: .4rem; white-space: nowrap; }

/* Section-by switch — the tower's filter chips, and deliberately the same
   control: it changes what the page shows without leaving it. */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 6rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: var(--on-accent); cursor: pointer; }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover { filter: brightness(1.08); }
.fcount { margin-left: .3rem; font-size: .64rem; opacity: .7; font-variant-numeric: tabular-nums; }

/* Matches LayerRow's `json` fold exactly — same size, colour and marker — so the
   strip's affordances read as one row of controls. */
.dfold { font-size: .62rem; color: var(--text-faint); background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
.dfold:hover { color: var(--text-muted); }

/* The drill block: author plumbing, so it takes the quiet register of the json
   fold rather than the row's own. It sits on the band, not on a grey fill —
   inside a light panel a grey block reads as a hole punched through the page. */
.drill { margin: .5rem 0 0; padding: .55rem .7rem; background: var(--band); border-radius: 6px; }
.examples { display: flex; flex-wrap: wrap; gap: .3rem .9rem; }
.answer { margin-top: .3rem; font-size: .8rem; color: var(--text-muted); }
.decomp { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; margin: .2rem 0; }
.chunk { display: inline-flex; align-items: center; }
.opname { font-size: .72rem; color: var(--text-muted); margin-left: .25rem; }
.pit { border-left: 2px solid var(--bad); padding-left: .5rem; font-size: .82rem; color: var(--text); margin: .35rem 0; }
.cites { font-size: .72rem; color: var(--bad); margin-left: .4rem; }
.revise { font-size: .72rem; color: var(--text-muted); font-style: italic; margin-left: .4rem; }

/* NOT the warn colours /errors and /rules use for their coverage chips. Those
   count work outstanding; this counts a deliberate set, so it takes the neutral
   band and reads as a label rather than as an alarm. */
.contrast-chip { font-size: .72rem; padding: .16rem .5rem; border-radius: 999px; background: var(--band); color: var(--text-muted); border: 1px solid var(--border-strong); white-space: nowrap; }
/* In the strip with the other author plumbing, not against the name: it is a
   fact about the data's shape, not something the reader needs about the skill. */
.badge { font-size: .58rem; padding: .05rem .35rem; border-radius: 999px; background: var(--band); color: var(--text-muted); border: 1px solid var(--border-strong); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
</style>
