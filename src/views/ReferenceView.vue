<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import RichText from '../components/RichText.vue'
import WrongRight from '../components/WrongRight.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { errorTree, skills, metaPatterns } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type ErrorDef, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect } from '../inspect'

// The student-facing mistakes page — and the author's error inspector, one body
// of content in two modes (src/inspect.ts). Presentation groups by TOPIC, which
// is how a student arrives ("I keep messing up fractions"); inspection keeps the
// same order but adds the plumbing. `kind` (anti-law / misreading / salience) is
// the author's causal taxonomy and cross-cuts topic, so it is a tag, not a level.
//
// ON THE ROW SHELL since 2026-07-27 (Layer{Page,Section,Row}), which is the whole
// point of this rewrite: a reader moving from /terms to /errors should see one
// application, not two that happen to import WrongRight. So this page gives up
// its own 900px width, its own hairline geometry and its own chip vocabulary, and
// takes the tower's — 91rem, one panel per section, the strip's folds, the rail's
// name, the shared prose cell.
const t = (ls: LocalizedString) => loc(ls, lang.value)

// The only prose this view owns, so it localizes like everything else.
// `reading rules` is the nav's own name for /metapatterns. It used to read
// `read` / `dazu`, which named neither the destination nor the same claim in the
// two languages; a fold has to say what is behind it.
const L = computed(() => lang.value === 'de'
  ? { breaks: 'verletzt', reading: 'Leseregeln' }
  : { breaks: 'breaks',   reading: 'reading rules' })

// Deep link from /metapatterns, where each rule lists the mistakes it prevents.
const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

const citedErrs = new Set(skills.flatMap(s => s.errors))
const unused = computed(() => errorTree.errors.filter(e => !citedErrs.has(e.id)).length)

// The rule an error breaks, as the card's NAME — `ax.distributivity` is a code the
// author reads, "Distributivity" is what a student can follow into the tower.
function cardLink(id: string) {
  const e = cardIndex.get(id)
  return { id, name: e ? t(e.card.name) : id, to: `/${e?.layer.slug}#${id}` }
}

// Two hops, no authoring: error → `corrupts` (cards) → the meta-patterns that
// summarize those cards. The error is the disease, the meta-pattern is the
// positive rule that stops it firing — the most useful link on the page.
//
// Capped at two. The hop is generous (`mis.exponent-scope` reaches four), and the
// names are sentence-length, so an uncapped list ran three grey lines. Inside a
// fold that matters less than it did, but the cap is also editorial: two rules
// are a pointer, five are a reading list.
const META_LIMIT = 2
function metasFor(e: ErrorDef) {
  const cards = new Set(e.corrupts)
  return metaPatterns
    .filter(m => m.summarizes.some(c => cards.has(c)))
    .slice(0, META_LIMIT)
    .map(m => ({ id: m.id, name: t(m.name), to: `/metapatterns#${m.id}` }))
}

// Within a topic, the most-often-made mistake comes first (frequency = the ★
// rating carried over from docs/common_mistakes.md).
const sections = computed(() => errorTree.sections.map(s => ({
  slug: s.slug,
  title: t(s.title),
  blurb: s.blurb ? t(s.blurb) : undefined,
  items: [...s.errors].sort((a, b) => b.frequency - a.frequency).map(e => ({
    id: e.id, kind: e.kind, name: t(e.name), fix: t(e.fix), note: t(e.note),
    frequency: e.frequency, instances: e.instances,
    rules: e.corrupts.map(cardLink),
    metas: metasFor(e),
    unused: !citedErrs.has(e.id),
    raw: e,
  })),
})))

// THREE COLUMNS: rail | the ✗/✓ pairs | the fix.
//
// The mapping onto the tower's four is exact where it can be — the rail is the
// rail, `fix` is a prose cell at the same measure — and honest where it cannot:
// the pairs stand where a statement stands, but need about twice the 19rem a
// single formula does. MEASURED: the widest pair block on the page is 589px
// (mis.root-scope and five others), so the track is 38rem and every one of them
// fits without scrolling.
//
// A FIXED TRACK, NOT `1fr`. With `1fr` the pairs kept their own geometry
// (`justify-content: start` holds the ✗/✓ columns at content width) but the slack
// piled up BETWEEN the ✓ and the fix — 190px of it at 1600px, a hole in the
// middle of every row. Fixed, the slack moves to the outer edge, where it reads
// as the margin it is.
//
// The author's `note` does NOT get the tower's fourth column: three prose tracks
// plus the pairs is 106rem, past the 91rem page. It is the diagnosis anyway —
// invisible to a student — so it stacks under the `fix`.
const COLS = 'minmax(0, var(--rail)) minmax(0, 38rem) minmax(0, var(--measure))'
</script>

<template>
  <LayerPage
    :title="t(errorTree.meta.title)"
    :lead="t(errorTree.meta.blurb)"
    :about="inspect ? t(errorTree.meta.note) : undefined"
    :cols="COLS"
  >
    <template #bar-right>
      <span v-if="inspect && unused" class="unused-chip" title="not drawn on by any skill yet">{{ unused }} unused</span>
    </template>

    <LayerSection v-for="s in sections" :key="s.slug" :title="s.title" :note="s.blurb">
      <LayerRow
        v-for="e in s.items" :key="e.id"
        :id="e.id" :name="e.name" :record="e.raw"
        :kind="inspect ? e.kind : undefined"
        :marks-title="`${e.frequency} of 3 — how often the sources flag it`"
        :targeted="e.id === targetId"
      >
        <!-- ★ where the tower puts its concern glyphs: a mark qualifying the
             name, optically centred by the shared rule. -->
        <template #marks><span class="freq">{{ '★'.repeat(e.frequency) }}</span></template>

        <template #folds>
          <RefFold :label="L.breaks" :links="e.rules" />
          <RefFold :label="L.reading" :links="e.metas" />
          <span v-if="inspect && e.unused" class="badge">unused</span>
        </template>

        <!-- The pairs ARE the content: a student arrives recognising a shape, not
             reading a definition. One shared grid per entry so stem / ✗ / ✓ are
             real COLUMNS across every instance on the row — per-instance grids
             put the marks at a different x for each stem width and the block read
             as scattered, and the invariant background is the whole point of the
             contrast. -->
        <div class="pairs">
          <WrongRight
            v-for="(x, i) in e.instances" :key="i"
            :from="x.from" :wrong="x.wrong" :right="x.right"
            :hint="x.hint ? t(x.hint) : undefined"
          />
        </div>

        <!-- `fix` is the entry's prose for a student: how to get it right.
             `note` is the diagnosis, written for a teacher — author mode only. -->
        <!-- ⚠️ NOT `class="fix"`: KaTeX emits its own `<span class="fix">` inside
             rendered math, so the name is taken. Scoping saves us today (those
             spans are built at runtime by MathExpr and carry no scope id), but a
             cell class that collides with the math renderer is a trap. -->
        <div class="cell fix-cell">
          <RichText :text="e.fix" />
          <p v-if="inspect" class="diagnosis"><RichText :text="e.note" /></p>
        </div>
      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  .pairs    { grid-area: 2 / 2; }
  .fix-cell { grid-area: 2 / 3; }
}

/* A star at the strip's .62rem reads as an asterisk, not a rating — one step up,
   with the letters spaced so three of them stay countable at a glance. */
.freq { font-size: .74rem; letter-spacing: .06em; }

/* The shared grid WrongRight fills: stem | ✗ wrong | ✓ right as real columns.
   `justify-content: start` keeps the tracks at content width — with an `fr`
   track the ✓ column absorbed the free space and the pairs drifted rightward on
   a wide screen. The track MINIMUMS then give the page one geometry: most stems
   and wrong forms fit inside them, so ✗ and ✓ land at the same x on entry after
   entry rather than shuffling per card. */
/* Mobile first, and the minimums are DROPPED here: at 390px they reserve 219px
   of the 358 available before the ✓ column gets any, which is what pushed the
   correction off the screen. Alignment across entries is a desktop concern —
   on a phone one entry is one screenful, so there is nothing to align with. */
.pairs { display: grid; grid-template-columns: auto auto minmax(0, 1fr); justify-content: start; column-gap: .7rem; row-gap: .35rem; align-items: baseline; min-width: 0; }
@media (min-width: 820px) {
  .pairs { grid-template-columns: minmax(4.5rem, auto) minmax(7rem, auto) auto; column-gap: 1.1rem; }
}

/* Not a second cell: the diagnosis is a footnote to the fix, in the same column
   and a step quieter. */
.diagnosis { margin: .4rem 0 0; font-size: .82rem; line-height: 1.5; color: var(--text-muted); font-style: italic; }

.unused-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
/* In the strip with the other author plumbing, not against the name: it is a
   coverage warning about the data, not something true of the mistake. */
.badge { font-size: .58rem; padding: .05rem .35rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
</style>
