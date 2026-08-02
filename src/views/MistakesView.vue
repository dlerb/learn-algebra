<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { mistakeTree, mistakes, rules, skills } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type MistakeDef, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect } from '../inspect'

// THE ANTI-REGISTRY — the negative face of /rules, and deliberately the same
// page. A mistake is a SENTENCE, the same kind of object as a rule: a general
// claim carrying no context of its own, given meaning by what cites it. The one
// difference in kind is that a rule is true and this is false, which is why the
// formula column sits under a ✗ where /rules has none.
//
// ⚠️ THE PARALLEL BUILD IS OVER (2026-07-31): /errors is retired and this is the
// ONLY mistake layer. It was built alongside it so the two could be compared
// migrated. The ids are UNCHANGED from errors.json, so every reverse index below
// resolves off `skill.errors` without a single skill being touched.
//
// Like /rules it is built mostly out of REVERSE INDEXES, which is what makes it
// impossible to go stale: it says exactly what the rest of the data says about
// each sentence, or nothing.
const t = (ls: LocalizedString) => loc(ls, lang.value)

const L = computed(() => lang.value === 'de'
  ? { corrupts: 'verfälscht', taught: 'geübt in', breaks: 'verletzt',
      by: 'gliedern nach', byTopic: 'Thema', byRule: 'verletzte Regel', byFamily: 'Familie',
      noFamily: 'Ohne Familie', again: 'auch oben' }
  : { corrupts: 'corrupts',   taught: 'guarded by', breaks: 'breaks',
      by: 'section by', byTopic: 'topic', byRule: 'rule broken', byFamily: 'family',
      noFamily: 'No family', again: 'also above' })

const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

// THE ONE SIDEWAYS EDGE IN THE DESIGN. A rule points only down into the tower;
// a mistake points down (`corrupts`) AND across into the rules pool (`breaks`),
// because a misconception is defined against the law it violates. Still a DAG —
// mistakes → rules → cards — so it cannot cycle.
const ruleById = new Map(rules.map(r => [r.id, r]))
const breaksOf = (m: MistakeDef) => m.breaks.map(id => {
  const r = ruleById.get(id)
  return { id, text: r ? t(r.rule) : id, to: `/rules#${id}` }
})

const corruptsOf = (m: MistakeDef) => m.corrupts.map(id => {
  const c = cardIndex.get(id)
  return { id, name: c ? t(c.card.name) : id, to: `/${c?.layer.slug}#${id}` }
})

// The reverse index: who exemplifies this sentence. Reads `skill.errors`, which
// still holds these exact ids — the whole point of not renaming them.
const guardedBy = (m: MistakeDef) => skills
  .filter(s => s.mistakes.includes(m.id))
  .map(s => ({ id: s.id, name: t(s.name), to: `/skills#${s.id}` }))

// SECTIONED BY TOPIC, where /rules is flat — the one deliberate divergence from
// the page this is modelled on. A student arrives at a mistake by topic ("I keep
// messing up fractions") in a way nobody arrives at a rule. The FILE is flat all
// the same; `topic` is a field and the sectioning happens here, the same trick
// /skills plays with `group`.
const TOPICS = ['minus', 'reading', 'distributing', 'powers', 'fractions', 'terms', 'factoring']
const TOPIC_TITLE: Record<string, { en: string; de: string }> = {
  minus: { en: 'The minus sign', de: 'Das Minus' },
  reading: { en: 'Reading a term', de: 'Einen Term lesen' },
  distributing: { en: 'Distributing', de: 'Ausmultiplizieren' },
  powers: { en: 'Powers and roots', de: 'Potenzen und Wurzeln' },
  fractions: { en: 'Fractions', de: 'Brüche' },
  terms: { en: 'Terms and letters', de: 'Terme und Buchstaben' },
  factoring: { en: 'Factoring', de: 'Faktorisieren' },
}

const items = computed(() => mistakes.map(m => ({
  id: m.id, kind: m.kind, topic: m.topic, frequency: m.frequency,
  mistake: t(m.mistake), latex: m.latex, note: t(m.note),
  // THE NAME AND THE DEVICE, mirroring /rules exactly — the pools are
  // symmetric and their naming is too. No cross-language fallback on either:
  // each language has its own or has none.
  shortName: m.shortName?.[lang.value], mnemonic: m.mnemonic?.[lang.value],
  breaks: breaksOf(m), corrupts: corruptsOf(m), guardedBy: guardedBy(m),
  // A sentence nothing exemplifies is dead weight, exactly as on /rules: the
  // citing skill is the only thing that gives a pool entry meaning.
  orphan: !skills.some(s => s.mistakes.includes(m.id)),
  raw: m,
})))

// ── ORDER WITHIN A SECTION: THE OTHER AXIS, THEN THE FILE (2026-08-02) ───────
// It used to be frequency, everywhere on this page — the most-often-made first.
// That reading now lives entirely in the ★ column, which carries it row by row
// anyway; what the sequence carries instead is the coordinate the headings did
// NOT spend, so a topic section runs family by family and a family section runs
// topic by topic. Underneath the rank, the order mistakes.json lists them in.
// `sort` is stable, so one rank key is the whole sort.
// The rule-broken sectioning takes `topic` as its other axis: `family` is the
// nearer neighbour of "the law you break" and would mostly re-say the heading,
// while the classroom topic is the coordinate that section cannot see.
type Item = (typeof items.value)[number]
const FAMILY_ORDER = mistakes.filter(m => m.head).map(m => m.id)
const familyRank = (i: Item) => {
  const at = FAMILY_ORDER.indexOf(i.raw.family ?? '')
  return at === -1 ? FAMILY_ORDER.length : at   // no family last, as `fam-none` is
}
const topicRank = (i: Item) => {
  const at = TOPICS.indexOf(i.topic ?? '')
  return at === -1 ? TOPICS.length : at
}
const rankedBy = (rank: (i: Item) => number, list: Item[]) =>
  [...list].sort((a, b) => rank(a) - rank(b))

const topicSections = computed(() => TOPICS
  .map(slug => ({
    slug,
    title: TOPIC_TITLE[slug] ? t(TOPIC_TITLE[slug]) : slug,
    note: undefined as string | undefined,
    items: rankedBy(familyRank, items.value.filter(i => i.topic === slug))
      .map(i => ({ item: i, primary: true })),
  }))
  .filter(s => s.items.length > 0))

// ── THE SECOND SECTIONING: BY THE RULE BROKEN ────────────────────────────────
// `breaks` IS the family, and it needs no field of its own — the law you violate
// is the group you belong to. This renders an edge that is already authored.
//
// It is a better grouping than the one /rules has, for three reasons worth
// keeping. It is CAUSAL rather than editorial: a rule family is one teacher's
// arrangement for a sheet, while these clusters are "one conversation fixes all
// of these". It gives the FAMILY a weight its members lack — the fraction-bar
// cluster is ★2/★1/★1 entry by entry but is the biggest fraction problem in the
// data taken together. And it allows DUAL MEMBERSHIP: `mis.precedence-ignored`
// breaks two rules and belongs to both families, which a `group: string` could
// never say and `breaks: string[]` says for free.
//
// A family is a rule broken by TWO OR MORE mistakes. Break a rule nobody else
// breaks and you are not in a family — those fall to the catch-all at the end,
// which is itself the finding: most misconceptions are lonely, a handful are
// epidemics.
const LONERS = { en: 'One of a kind', de: 'Einzelfälle' }
const LONERS_NOTE = {
  en: 'Each of these breaks a rule no other mistake breaks. Being alone is not a defect — it is what most misconceptions look like, and it is what makes the families above worth naming.',
  de: 'Jeder dieser Fehler verletzt eine Regel, die kein anderer verletzt. Alleinstehen ist kein Mangel, sondern der Normalfall — und genau deshalb lohnt es sich, die Familien darüber zu benennen.',
}

const brokenRuleSections = computed(() => {
  const byRule = new Map<string, typeof items.value>()
  for (const m of items.value) {
    for (const b of m.breaks) byRule.set(b.id, [...(byRule.get(b.id) ?? []), m])
  }
  const fams = [...byRule.entries()]
    .filter(([, v]) => v.length > 1)
    // Biggest family first, ties broken by the worst mistake in it: the point of
    // this view is that the epidemics lead.
    .sort((a, b) => b[1].length - a[1].length
      || Math.max(...b[1].map(m => m.frequency)) - Math.max(...a[1].map(m => m.frequency)))

  // A mistake in two families is shown under both, and `primary` marks which
  // sighting is the first. The row keeps its REAL id in both — a derived one
  // would leak into the strip's source link, which addresses the entity and not
  // the position. Deep links resolve by document order, so they land on the
  // primary by construction (families are ordered, and `claimed` is filled in
  // that order). ⚠️ Known rough edge of this sectioning: two elements then
  // share a DOM id, which is invalid even though every resolver involved —
  // getElementById, querySelector, vue-router's scrollBehavior — is defined to
  // take the first. If this sectioning is kept, LayerRow should grow a separate
  // `anchor` prop rather than the id doing both jobs.
  const claimed = new Set<string>()
  const out = fams.map(([ruleId, ms]) => {
    const r = ruleById.get(ruleId)
    return {
      slug: `by-${ruleId}`,
      // The heading IS the law, and the rows under it are the ways it gets
      // broken — so a family section reads as one /rules row with its own
      // wreckage laid out beneath it.
      title: r ? t(r.rule) : ruleId,
      note: r ? t(r.note) : undefined,
      items: rankedBy(topicRank, ms).map(item => {
        const primary = !claimed.has(item.id)
        claimed.add(item.id)
        return { item, primary }
      }),
    }
  })
  const rest = rankedBy(topicRank, items.value.filter(m => !claimed.has(m.id)))
  if (rest.length) {
    out.push({
      slug: 'by-loners', title: t(LONERS), note: t(LONERS_NOTE),
      items: rest.map(item => ({ item, primary: true })),
    })
  }
  return out
})

// ── THE THIRD SECTIONING: BY THE AUTHORED FAMILY (2026-07-31) ────────────────
// ⚠️ NOT the same axis as "rule broken" above, which is why both exist. That one
// is DERIVED from `breaks` and is causal — "one conversation fixes all of these".
// This one is the AUTHORED `family` field: the shape of the misconception itself,
// which cuts across the rules broken. `mis.term-misread` (Lesefehler) holds
// mistakes that break eight different rules; `anti.freshmans-dream` holds three
// that break two. Neither grouping can produce the other.
//
// The head is the HEADING, never a row: a family head has no `latex`, no
// `breaks` and a meaningless `frequency`, so listing it beside its members would
// put an empty row at the top of every section.
const familySections = computed(() => {
  const heads = mistakes.filter(m => m.head)
  const out = heads.map(h => ({
    slug: `fam-${h.id}`,
    // The name if the family has one — "Lesefehler", "Freshman's dream" — and
    // the sentence otherwise. Same rule as everywhere else the pools are read.
    title: h.shortName?.[lang.value] ?? t(h.mistake),
    note: t(h.note) as string | undefined,
    items: rankedBy(topicRank, items.value.filter(i => i.raw.family === h.id))
      .map(item => ({ item, primary: true })),
  })).filter(s => s.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length)

  // A mistake with no family is not a defect either — 9 of 38 are singular
  // enough that no shape holds them, and saying so is more honest than
  // inventing a family to absorb them.
  const rest = rankedBy(topicRank, items.value.filter(i => !i.raw.head && !i.raw.family))
  if (rest.length) {
    out.push({
      slug: 'fam-none', title: t(L_NOFAM.title), note: t(L_NOFAM.note),
      items: rest.map(item => ({ item, primary: true })),
    })
  }
  return out
})

const L_NOFAM = {
  title: { en: 'No family', de: 'Ohne Familie' },
  note: {
    en: 'These belong to no shape the others share. A pool where everything had a family would be one where the families meant nothing.',
    de: 'Diese gehören zu keiner Gestalt, die die anderen teilen. Ein Pool, in dem alles eine Familie hätte, wäre einer, in dem die Familien nichts bedeuten.',
  },
}

const sectionBy = ref<'topic' | 'rule' | 'family'>('topic')
const sections = computed(() => sectionBy.value === 'topic' ? topicSections.value
  : sectionBy.value === 'rule' ? brokenRuleSections.value
  : familySections.value)

// ── WHAT THE STRIP SAYS: EVERY COORDINATE THE HEADING DOES NOT (2026-08-02) ──
// The same rule /rules and /skills follow. A row carries a `topic` and a
// `family`; a heading spends at most one of them; the strip shows what is left.
// Under a topic heading that is the family, under a family heading the topic, and
// under a BROKEN RULE — which is neither — it is both, because that sectioning is
// derived from `breaks` and can say nothing about either coordinate.
// It is also what makes the within-section order readable: the rows are sorted by
// the key the strip now prints. Content, so neither is gated on inspect; the
// authored `kind` (mis/anti/omi/sal) moves to the strip's right, where the rest
// of the inspect-only plumbing already lives.
const familyName = (m: MistakeDef) => m.shortName?.[lang.value] ?? t(m.mistake)
const familyTitle = new Map(mistakes.filter(m => m.head).map(m => [m.id, familyName(m)]))
const stripTopic = (i: Item) => sectionBy.value === 'topic' || !i.topic ? undefined
  : (TOPIC_TITLE[i.topic] ? t(TOPIC_TITLE[i.topic]) : i.topic)
const stripFamily = (i: Item) => sectionBy.value === 'family' || !i.raw.family ? undefined
  : familyTitle.get(i.raw.family)
const brokenRuleCount = computed(() => brokenRuleSections.value.filter(s => s.slug !== 'by-loners').length)

const orphans = computed(() => items.value.filter(i => i.orphan).length)

// FOUR COLUMNS, matching /rules one for one: the sentence | its formula | its
// gloss | what it is defined against. Only the last differs in direction —
// /rules derives its fourth column (the mistakes a rule prevents), this one
// AUTHORS it (`breaks`), because a misconception knows which law it violates
// while a law does not know which misconceptions exist.
// Same widths as /rules, so the two pages measure identically when read side by
// side — which was the point of the parallel build, and is still worth keeping.
const COLS = 'minmax(0, 22rem) minmax(0, 18rem) minmax(0, 22rem) minmax(0, 22rem)'
</script>

<template>
  <LayerPage
    :title="t(mistakeTree.meta.title)"
    :lead="t(mistakeTree.meta.blurb)"
    :about="inspect ? t(mistakeTree.meta.note) : undefined"
    :cols="COLS"
  >
    <template #bar-right>
      <span v-if="inspect && orphans" class="orphan-chip" title="no skill exemplifies it">{{ orphans }} unexemplified</span>
    </template>

    <template #filters>
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">{{ L.by }}</span>
          <button class="fchip" :class="{ off: sectionBy !== 'topic' }" @click="sectionBy = 'topic'">
            {{ L.byTopic }}<span class="fcount">{{ topicSections.length }}</span>
          </button>
          <button class="fchip" :class="{ off: sectionBy !== 'rule' }" @click="sectionBy = 'rule'">
            {{ L.byRule }}<span class="fcount">{{ brokenRuleCount }}</span>
          </button>
          <button class="fchip" :class="{ off: sectionBy !== 'family' }" @click="sectionBy = 'family'">
            {{ L.byFamily }}<span class="fcount">{{ familySections.length }}</span>
          </button>
        </div>
      </div>
    </template>

    <LayerSection v-for="s in sections" :key="s.slug" :title="s.title" :note="s.note">
      <LayerRow
        v-for="{ item: m, primary } in s.items" :key="m.id + s.slug"
        :id="m.id" :name="m.mistake" :record="m.raw"
        :kind="stripTopic(m)"
        :marks-title="`${m.frequency} of 3 — how often the sources flag it`"
        :targeted="m.id === targetId"
      >
        <template #marks><span class="freq">{{ '★'.repeat(m.frequency) }}</span></template>

        <!-- The name above the device, as on /rules: one is what the mistake is
             CALLED, the other a way to remember it. -->
        <template v-if="m.shortName || m.mnemonic" #rail>
          <p v-if="m.shortName" class="short-name">{{ m.shortName }}</p>
          <p v-if="m.mnemonic" class="mnemonic">{{ m.mnemonic }}</p>
        </template>

        <template #folds>
          <!-- The shape it belongs to, ahead of the reference folds and styled
               exactly as /rules styles its family tag: the pools are symmetric
               and so is their chrome. -->
          <span v-if="stripFamily(m)" class="fam">{{ stripFamily(m) }}</span>
          <RefFold :label="L.corrupts" :links="m.corrupts" />
          <RefFold :label="L.taught" :links="m.guardedBy" derived />
        </template>

        <template #strip-right>
          <!-- The authored taxonomy — misconception, antipattern, omission,
               salience. An author's word, never a student's, so it sits with the
               json fold rather than at the head of the strip where the two
               reader-facing coordinates now are. -->
          <span v-if="inspect" class="tax">{{ m.kind }}</span>
          <!-- A mistake that breaks two rules belongs to both families and is
               shown under both. Marked, so a second sighting reads as structure
               rather than as a duplicated row. -->
          <span v-if="!primary" class="again">↑ {{ L.again }}</span>
        </template>

        <!-- THE INVERTED CONTRACT. Same column as /rules' formulary, but every
             line here is a FALSE claim, so it carries the ✗ that /rules' true
             ones do not need. Three entries have none: the two salience
             mistakes and the adjacent-signs notation mistake have no schema to
             write, and their cell stays empty like any other. -->
        <div v-if="m.latex.length" class="maths">
          <div v-for="(l, i) in m.latex" :key="i" class="stmt">
            <span class="mark bad">✗</span>
            <span class="f"><MathExpr :latex="l" display /></span>
          </div>
        </div>

        <div class="cell muted gloss"><RichText :text="m.note" /></div>

        <!-- AUTHORED, hence no arrow — this is `breaks`, the one edge that runs
             from one pool into another. It is the mirror of /rules' `prevents`
             column read the other way, so the two pages can never disagree.
             ⚠️ The comment said that from the first commit and the markup
             printed an arrow anyway until 2026-08-02, which is exactly the
             "prose the data does not encode" failure the revision keeps
             finding — here between a comment and its own template. -->

        <div v-if="m.breaks.length" class="cell rule-cell">
          <RouterLink v-for="r in m.breaks" :key="r.id" class="rule-line" :to="r.to">
            {{ r.text }}
          </RouterLink>
        </div>
      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  .maths     { grid-area: 2 / 2; }
  .gloss     { grid-area: 2 / 3; }
  .rule-cell { grid-area: 2 / 4; }
}

.maths { min-width: 0; }
/* The mark track, reserved as on /skills so every claim starts at one x. */
.stmt { display: grid; grid-template-columns: 1.1rem minmax(0, 1fr); align-items: baseline; }
/* `overflow-x: auto` makes the computed `overflow-y` AUTO as well, so a formula
   whose ink exceeds its line box gets a surprise vertical scrollbar. */
.f { overflow-x: auto; padding: .3rem 0; min-width: 0; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }
.mark { font-size: .82rem; line-height: 1; font-weight: 600; }
.mark.bad { color: var(--bad); }

.short-name {
  margin: .3rem 0 0; font-family: var(--font-content); font-weight: 600;
  font-size: .82rem; line-height: 1.35; color: var(--text); text-wrap: balance;
}
.mnemonic {
  margin: .3rem 0 0; font-family: var(--font-content); font-style: italic;
  font-size: .78rem; line-height: 1.4; color: var(--text-muted); text-wrap: balance;
}
.freq { font-size: .74rem; letter-spacing: .06em; }

/* The rule is QUOTED from another pool, so it takes the neutral band and a plain
   rule — the typographic convention for a quotation — exactly as on /errors.
   Colour stays on its own axis and is not spent here. */
.cell.rule-cell {
  padding: .35rem .55rem; border-radius: 6px; border-left: 2px solid var(--border-strong);
  background: var(--band); color: var(--text-muted);
}
/* Flush, since the arrow that the hanging indent was hanging off is gone: the
   band and the .4rem between entries already separate one quoted rule from the
   next, and an indent with nothing in it reads as a missing glyph. */
.rule-line { display: block; color: var(--text-muted); text-decoration: none; }
.rule-line + .rule-line { margin-top: .4rem; }
.rule-line:hover { color: var(--accent); }

/* The sectioning switch — the tower's filter chips, same control as /skills'. */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 6rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: var(--on-accent); cursor: pointer; }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover { filter: brightness(1.08); }
.fcount { margin-left: .3rem; font-size: .64rem; opacity: .7; font-variant-numeric: tabular-nums; }

/* A second sighting of the same mistake under another family. Quiet, in the
   strip with the other structural markers — it is a fact about the grouping,
   not about the mistake. */
.again { font-size: .58rem; color: var(--text-faint); white-space: nowrap; font-style: italic; }

/* The family tag, byte-identical to /rules' — the two pages are read side by
   side and their strips must weigh the same. */
.fam { font-size: .62rem; font-weight: 600; color: var(--text-muted); letter-spacing: .01em; }
/* The taxonomy word, in the inspect-only band: fainter than the tag at the head
   of the strip, because it is the file's word and not the reader's. */
.tax { font-size: .58rem; color: var(--text-faint); white-space: nowrap; }

.orphan-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
</style>
