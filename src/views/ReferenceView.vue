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

// The only prose this view owns, so it localizes like everything else. It is
// down to one label: the `reading rules` fold became the fourth column, and the
// rules name themselves there.
const L = computed(() => lang.value === 'de'
  ? { breaks: 'verletzt' }
  : { breaks: 'breaks' })

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
// Capped at two, and the cap is editorial as much as spatial: the hop is
// generous (`mis.exponent-scope` reaches four), and two rules beside a mistake
// are a pointer where five are a reading list.
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
    // Whether to paint the stub rule: four errors are pure BELIEFS (a `\neq`
    // claim with no `from`), and a divider with nothing to its left divides
    // nothing.
    hasStem: e.instances.some(x => x.from),
    raw: e,
  })),
})))

// FOUR COLUMNS: rail | the ✗/✓ pairs | fix | the reading rule — the tower's own
// row, with the pairs standing where a statement stands and the two prose cells
// where intuition and note stand.
//
// A FIXED PAIRS TRACK, NOT `1fr`. With `1fr` the pairs kept their own geometry
// (`justify-content: start` holds the ✗/✓ columns at content width) but the slack
// piled up BETWEEN the ✓ and the fix — 190px of it at 1600px, a hole in the
// middle of every row. Fixed, the slack moves to the outer edge, where it reads
// as the margin it is.
//
// The fourth column carries THE READING RULE AS A ONE-LINER (2026-07-27). It
// briefly held the author's `note` (invisible to a student, mostly a restatement
// of the fix), then the metapattern's whole `rule` paragraph (noise beside a ✗/✓
// and a worked fix). What survives is the rule itself in one line.
// That is also what pays for the `fix`: with the rule column down from 18rem to
// 14, the fix goes 18 → 22rem, about 46 characters, back inside the readable
// band it had been pushed out of. 7 of 28 errors reach no rule at all, and their
// cell stays empty rather than the layout changing.
const COLS = 'minmax(0, var(--rail)) minmax(0, 36rem) minmax(0, 22rem) minmax(0, 14rem)'
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

        <!-- The `reading rules` fold is GONE (2026-07-27). Once the column
             carries the one-liner rather than the paragraph, fold and column are
             the same words — and the one-liner is the most useful thing on the
             row after the fix, so folding it away was hiding the payload. The
             column keeps it open and carries the link. -->
        <template #folds>
          <RefFold :label="L.breaks" :links="e.rules" />
        </template>

        <template #strip-right>
          <span v-if="inspect && e.unused" class="badge">unused</span>
        </template>

        <!-- The pairs ARE the content: a student arrives recognising a shape, not
             reading a definition. One shared grid per entry so stem / ✗ / ✓ are
             real COLUMNS across every instance on the row — per-instance grids
             put the marks at a different x for each stem width and the block read
             as scattered, and the invariant background is the whole point of the
             contrast. -->
        <div class="pairs" :class="{ 'has-stem': e.hasStem }">
          <WrongRight
            v-for="(x, i) in e.instances" :key="i"
            :from="x.from" :wrong="x.wrong" :right="x.right"
            :hint="x.hint ? t(x.hint) : undefined"
          />
        </div>

        <!-- `fix` is the entry's prose for a student: how to get it right.
             `note` is the diagnosis, written for a teacher — author mode only. -->
        <!-- THREE KINDS OF PROSE, TOLD APART BY COLOUR (2026-07-27, provisional).
             `fix`, `note` and an instance's `hint` were written at different
             times for different readers and they overlap: the fix prescribes,
             the note diagnoses, the hint glosses one pair. Until the text itself
             is sorted out, the tint says which is which — green for what to DO,
             red for what went WRONG, and the hints left untinted so the
             three-way overlap is visible rather than hidden.
             ⚠️ NOT `class="fix"`: KaTeX emits its own `<span class="fix">`. -->
        <div class="cell fix-cell">
          <RichText :text="e.fix" />
        </div>
        <!-- THE READING RULE ITSELF, not a pointer to it (2026-07-27). The
             column held the author's `note`, which was invisible to a student
             and duplicated the `fix` besides. Quoting the metapattern instead
             puts the general rule beside the concrete correction, which is the
             division of labour the two layers are supposed to have — and it
             makes any remaining overlap between them visible on the page rather
             than one fold away. Derived, so the arrow marks it as such, and the
             name still deep-links to /metapatterns.
             `note` is not lost: it is in the json fold, and its future is an
             open question. -->
        <!-- THE ONE-LINER, and only that. The column briefly quoted the whole
             `rule` paragraph, which read as noise next to a ✗/✓ pair and a
             worked fix — a fourth rendering of a claim the row had already made
             three ways. Every metapattern `name` is a complete rule on its own
             ("The fraction bar is a bracket"), so the name IS the content here
             and the paragraph stays on /metapatterns, where a reader has come
             for the rule itself. The arrow marks it as derived; the whole line
             is the link. -->
        <div v-if="e.metas.length" class="cell meta-cell">
          <RouterLink v-for="m in e.metas" :key="m.id" class="meta-rule" :to="m.to">
            <span class="arrow">→</span>{{ m.name }}
          </RouterLink>
        </div>
      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  .pairs     { grid-area: 2 / 2; }
  .fix-cell  { grid-area: 2 / 3; }
  .meta-cell { grid-area: 2 / 4; }
}

/* A star at the strip's .62rem reads as an asterisk, not a rating — one step up,
   with the letters spaced so three of them stay countable at a glance. */
.freq { font-size: .74rem; letter-spacing: .06em; }

/* PROVISIONAL COLOUR (2026-07-27) — a diagnostic, not a decided design. The tint
   is a pale wash of the same --good / --bad the ✓ and ✗ already use, so the row
   has one colour vocabulary: what to do is green, what went wrong is red. Both
   are ~10% mixes, well below the marks' full-strength accents, so a cell reads as
   tinted paper rather than as a highlight competing with the pairs.
   `color-mix` against --surface, not `transparent`: over transparency the tint
   would darken with whatever it sits on, and in dark mode --good/--bad are pale,
   so mixing toward the panel keeps both themes at the same apparent strength. */
.cell.fix-cell, .cell.meta-cell {
  padding: .35rem .55rem; border-radius: 6px;
  border-left: 2px solid;
}
.fix-cell { background: color-mix(in srgb, var(--good) 10%, var(--surface)); border-left-color: color-mix(in srgb, var(--good) 55%, var(--surface)); }
/* NOT a third colour. The rule is neither the correction nor the mistake — it is
   quoted from another layer, so it takes the neutral band and a plain rule, the
   typographic convention for a quotation. Colour stays on the axis it already
   means: green for what to do, red for what went wrong. */
.meta-cell { background: var(--band); border-left-color: var(--border-strong); color: var(--text-muted); }
/* A rule per line, the whole line clickable — it is one short sentence, so a
   separate link affordance under it would be chrome around nothing. */
.meta-rule { display: block; color: var(--text-muted); text-decoration: none; text-indent: -.9rem; padding-left: .9rem; }
.meta-rule + .meta-rule { margin-top: .4rem; }
.meta-rule:hover { color: var(--accent); }
/* The same derived marker RefFold uses in the strip, hung in the margin so the
   rule's own first word starts the text column. */
.arrow { color: var(--text-faint); margin-right: .35rem; }
.meta-rule:hover .arrow { color: var(--accent); }

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
/* `align-content: start` is load-bearing, not tidiness. The pairs grid is
   stretched to the height of the tallest cell in the row (a five-line quoted
   rule), and with the default `stretch` the leftover height is dealt out BETWEEN
   the instance rows — so two pairs that belong together drifted half a row
   apart, and by a different amount on every entry. */
.pairs { display: grid; grid-template-columns: auto auto minmax(0, 1fr); justify-content: start; align-content: start; column-gap: .7rem; row-gap: .35rem; align-items: baseline; min-width: 0; }
@media (min-width: 820px) {
  /* A FIXED 7rem STUB. Measured: no stem on the page exceeds 6.2rem
     (anti.quadratic-pair-unchecked), so a constant track holds all 50 of them.
     A constant track is what lets the rule below land at the same x on every
     entry — with `auto` it moved with the widest stem in each entry, the same
     drift the ✗/✓ minimums were introduced to stop. It also aligns the ✗ column
     page-wide, including on the four entries with no stem at all.
     ⚠️ Do not size this off `scrollWidth`: a KaTeX span reports exactly 2px more
     than its box whatever the box is (114>112 at 7rem, 122>120 at 7.5rem), so an
     overflow check reads as a permanent 2px overrun and widening never clears
     it. Measure the rendered content with an `auto` track instead. */
  .pairs { grid-template-columns: 7rem minmax(7rem, auto) auto; column-gap: 1.1rem; }
}

/* THE STUB RULE, painted by the container rather than bordered per cell. A
   `border-right` on `.stem` would be one stub per instance with a gap at every
   row-gap — a dashed line by accident. As a gradient on the grid it is one
   continuous rule the height of the whole block, which is what says "everything
   right of here is a claim about what is left of here".
   At 7rem + half the 1.1rem gap, so it sits midway between the columns. */
.pairs.has-stem { background: linear-gradient(to right, transparent 7.55rem, var(--border-strong) 7.55rem, var(--border-strong) calc(7.55rem + 1px), transparent calc(7.55rem + 1px)); }
@media (max-width: 819px) { .pairs.has-stem { background: none; } }

/* Not a second cell: the diagnosis is a footnote to the fix, in the same column
   and a step quieter. */
.diagnosis { margin: .4rem 0 0; font-size: .82rem; line-height: 1.5; color: var(--text-muted); font-style: italic; }

.unused-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
/* In the strip with the other author plumbing, not against the name: it is a
   coverage warning about the data, not something true of the mistake. */
.badge { font-size: .58rem; padding: .05rem .35rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
</style>
