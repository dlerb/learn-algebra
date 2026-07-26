<script setup lang="ts">
// THROWAWAY LAYOUT PROTOTYPE — /proto. Delete or promote; do not build on it.
//
// Revision 2 (2026-07-26), rebuilt from the STUDENT's priorities: they want the
// name, the maths, the intuition, and to be able to skim the note. Kind,
// `restsOn` and `concerns` are the teacher's interest, so they are present but
// demoted — kind opens the header quietly, references fold away, and concerns
// trails the name in the rail as the OPERATOR GLYPHS themselves rather than as
// tokens to decode. The id doubles as the deep link into the source, so there is
// one affordance where there were two.
//
// TWO VARIANTS of one instruction, because "two cells to the right of the maths"
// has two readings and they differ in whether the prose stays readable:
//   stacked — rail | maths | prose, three columns, intuition above note in the
//             third. Fits the 900px measure the other row views already use.
//   quad    — rail | maths | intuition | note, four real columns. Needs a wider
//             page: at 900px each prose cell would be ~22 characters per line.
// Switch at the top of the page and judge by looking.

import { computed, ref } from 'vue'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import OpenInSource from '../components/OpenInSource.vue'
import { cardIndex, CONCERN_TOKENS } from '../data/layers'
import { loc, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'

const t = (ls: LocalizedString) => loc(ls, lang.value)

// Chosen to break the layout if it is going to break: the longest note in the
// tower, a theorem with a derivation and four references, a signature card whose
// formal object is a glyph, a prose-only preliminary with no maths at all, and a
// short one that should not look empty.
const SAMPLE = [
  'ax.distributivity',
  'th.inverse-of-product',
  'th.root-of-quotient',
  'op.add',
  'pre.compound',
  'ax.zero-not-one',
]

const variant = ref<'stacked' | 'quad'>('quad')

// CONCERNS AS GLYPHS, following the name. The glyph for a concern is the SYMBOL
// OF THE CARD WHERE THAT CONCERN ENTERS THE TOWER — the same entry points
// sweep-layers' audit derives — so the tag is not a new vocabulary to learn: it
// is the operator the card is about, written the way the tower writes it.
//
// TWO DELIBERATE OVERRIDES, because a chip at .72rem is an ICON, not an
// expression. The rule against notation students meet nowhere else governs
// mathematical content — the statement, the derivation — not a badge on a title,
// which nobody reads as a formula. Within a chip the only question is whether the
// mark is legible and unambiguous at 11px.
//   mul → `\bullet` rather than op.mul's `\cdot`. A lone \cdot at tag size is
//     indistinguishable from a stray period, and mul is the commonest concern by
//     far (72 of 95 cards), so the least legible glyph would have been the most
//     seen one. A filled bullet reads as a mark at any size, and `a • b` is
//     ordinary textbook multiplication anyway.
//   completeness → `\mathbb{R}` rather than `\sup`. It has no signature card at
//     all (it is an axiom, not an operation); ax.completeness states itself as
//     `\sup S \in \mathbb{R}`, but "sup" is three letters where every other chip
//     is one mark, and it sat wrong. Completeness is precisely the axiom that
//     separates ℝ from ℚ, and the tower is told as `R` turning out to BE `ℝ` — so
//     ℝ is the icon for "complete", in one familiar glyph.
const CONCERN_ENTRY: Record<string, string> = {
  add: 'op.add', mul: 'op.mul', eq: 'op.eq', order: 'op.lt', completeness: 'ax.completeness',
}
const CONCERN_GLYPH: Record<string, string> = { mul: '\\bullet', completeness: '\\mathbb{R}' }
const glyphOf = (token: string) =>
  CONCERN_GLYPH[token] ?? cardIndex.get(CONCERN_ENTRY[token])?.card.symbol ?? token
const glyphTitle = (tokens: string[]) => tokens
  .map(k => {
    const e = cardIndex.get(CONCERN_ENTRY[k])
    return e ? t(e.card.name) : k
  })
  .join(' · ')

// Both prose cells truncate now. Every one of the 34 intuitions exceeds 180
// characters (median 393, about seven lines), so leaving intuition whole was the
// main thing making row heights ragged.
const CUT = 240

/** Truncate on a word boundary WITHOUT splitting an inline `$…$` span — cutting
 *  inside one hands KaTeX an unterminated expression and prints an error box
 *  mid-page. Tracks whether it is inside math and only ever cuts outside. */
function truncateProse(s: string, max: number): { head: string; clipped: boolean } {
  if (s.length <= max) return { head: s, clipped: false }
  let inMath = false
  let lastSafe = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '$') inMath = !inMath
    if (i > max && !inMath) break
    if (!inMath && (s[i] === ' ' || s[i] === ',' || s[i] === '.')) lastSafe = i
  }
  if (lastSafe === 0) return { head: s, clipped: false }
  return { head: s.slice(0, lastSafe).trimEnd(), clipped: true }
}

const rows = computed(() => SAMPLE.map(id => {
  const e = cardIndex.get(id)!
  const c = e.card
  const intuition = c.intuition ? t(c.intuition) : ''
  const note = c.note ? t(c.note) : ''
  const ic = truncateProse(intuition, CUT)
  const nc = truncateProse(note, CUT)
  return {
    id, kind: e.kind,
    // Ordered by the token vocabulary, NOT as authored: a fixed sequence means
    // the glyphs sit in the same order on every row and can be compared down the
    // page, which is the only way a two-glyph tag is scannable at all.
    concerns: CONCERN_TOKENS.filter(k => (c.concerns ?? []).includes(k)),
    name: t(c.name),
    symbol: c.symbol, type: c.type,
    latex: c.latex, forall: c.forall, cond: c.cond,
    intuition, intHead: ic.head, intClipped: ic.clipped,
    note, noteHead: nc.head, noteClipped: nc.clipped,
    refs: [...(c.basedOn ?? []), ...(c.derivedFrom ?? [])]
      .map(r => ({ id: r, name: cardIndex.get(r) ? t(cardIndex.get(r)!.card.name) : r })),
  }
}))

const open = ref(new Set<string>())
const toggle = (k: string) => (open.value.has(k) ? open.value.delete(k) : open.value.add(k))

const L = computed(() => lang.value === 'de'
  ? { forall: 'für alle', cond: 'sofern', more: 'mehr', less: 'weniger', rests: 'stützt sich auf' }
  : { forall: 'for all', cond: 'provided', more: 'more', less: 'less', rests: 'rests on' })
</script>

<template>
  <div class="proto" :class="variant">
    <header class="intro">
      <h2>Row layout prototype — rev 2</h2>
      <p class="lead">
        Student-first: name, maths, intuition, skimmable note. Kind opens the header, references
        fold, concerns sits in the rail as language, the id is the source link.
      </p>
      <p class="controls">
        <button class="ctl" :class="{ on: variant === 'stacked' }" @click="variant = 'stacked'">stacked · 3 col · 900px</button>
        <button class="ctl" :class="{ on: variant === 'quad' }" @click="variant = 'quad'">quad · 4 col · 1240px</button>
        <button class="ctl" @click="lang = lang === 'de' ? 'en' : 'de'">lang: {{ lang }}</button>
      </p>
    </header>

    <div class="rows">
      <!-- Absent parts release their column rather than leaving a hole: only 34
           of 101 cards carry an intuition and 13 carry no maths, so without this
           two thirds of rows would strand the note in the last column with a gap
           beside it. -->
      <article
        v-for="r in rows" :key="r.id" class="row"
        :class="{ 'no-int': !r.intuition, 'no-note': !r.note, 'no-maths': !r.latex && !r.symbol }"
      >
        <!-- HEADER: kind first, the references folded away, and the id at the right
             doubling as the deep link into the source. -->
        <div class="strip">
          <span class="kind">{{ r.kind }}</span>
          <details v-if="r.refs.length" class="fold">
            <summary>{{ L.rests }} <span class="n">{{ r.refs.length }}</span></summary>
            <span class="fold-body">
              <a v-for="x in r.refs" :key="x.id" class="ref" :href="`#${x.id}`">{{ x.name }}</a>
            </span>
          </details>
          <span class="strip-right"><OpenInSource :id="r.id" :label="r.id" /></span>
        </div>

        <!-- RAIL: the name with the weight, and what the card is about, in words. -->
        <div class="rail">
          <h3 class="name">
            {{ r.name }}<span
              v-if="r.concerns.length" class="glyphs" :title="glyphTitle(r.concerns)"
            ><MathExpr v-for="k in r.concerns" :key="k" :latex="glyphOf(k)" /></span>
          </h3>
        </div>

        <div class="maths">
          <div v-if="r.symbol" class="sig">
            <span class="sig-sym"><MathExpr :latex="r.symbol" /></span>
            <span class="sig-type"><MathExpr :latex="r.type!" /></span>
          </div>
          <div v-if="r.latex" class="stmt"><MathExpr :latex="r.latex" display /></div>
          <div v-if="r.forall || r.cond" class="quant">
            <span v-if="r.forall">{{ L.forall }} <MathExpr :latex="r.forall" /></span>
            <span v-if="r.cond">{{ L.cond }} <MathExpr :latex="r.cond" /></span>
          </div>
        </div>

        <div v-if="r.intuition" class="cell intuition">
          <RichText :text="open.has(r.id + ':i') || !r.intClipped ? r.intuition : r.intHead" /><template
            v-if="r.intClipped && !open.has(r.id + ':i')">… </template>
          <button v-if="r.intClipped" class="more" @click="toggle(r.id + ':i')">{{ open.has(r.id + ':i') ? L.less : L.more }}</button>
        </div>
        <div v-if="r.note" class="cell note">
          <RichText :text="open.has(r.id + ':n') || !r.noteClipped ? r.note : r.noteHead" /><template
            v-if="r.noteClipped && !open.has(r.id + ':n')">… </template>
          <button v-if="r.noteClipped" class="more" @click="toggle(r.id + ':n')">{{ open.has(r.id + ':n') ? L.less : L.more }}</button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.proto { margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); max-width: 900px; }
.proto.quad { max-width: 1240px; }
.intro h2 { font-size: 1.15rem; font-weight: 700; margin: 0 0 .3rem; }
.lead { margin: 0 0 .5rem; font-size: .8rem; line-height: 1.5; color: var(--text-muted); max-width: 62ch; }
.controls { display: flex; gap: .4rem; margin: 0; flex-wrap: wrap; }
.ctl { font-size: .7rem; padding: .16rem .55rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-muted); cursor: pointer; }
.ctl.on { background: var(--text); border-color: var(--text); color: #fff; }

.rows { margin-top: 1.4rem; }

/* One hairline per row, no boxes. Mobile is the base case: everything stacks in
   DOM order, which is already the student's reading order — kind, name, maths,
   intuition, note. */
.row {
  display: grid; grid-template-columns: 1fr; gap: .1rem 1.6rem;
  padding: 1.15rem 0 1.25rem; border-top: 1px solid var(--border);
  scroll-margin-top: 4.5rem;
}
/* THREE COLUMNS: prose stacked in the third. The rail STACKS below this width
   rather than shrinking — a 13rem gutter beside body text on a phone is
   unusable. */
@media (min-width: 820px) {
  .stacked .row { grid-template-columns: minmax(0, 13rem) minmax(0, 15rem) minmax(0, 1fr); }
  .stacked .strip { grid-area: 1 / 1 / 2 / -1; }
  .stacked .rail  { grid-area: 2 / 1; }
  .stacked .maths { grid-area: 2 / 2; }
  .stacked .intuition { grid-area: 2 / 3; }
  .stacked .note      { grid-area: 3 / 3; }
}
/* FOUR COLUMNS: the two prose cells side by side. Needs the wider page; each cell
   lands near 46 characters, the floor of readable measure. */
@media (min-width: 1100px) {
  .quad .row { grid-template-columns: minmax(0, 11rem) minmax(0, 13rem) minmax(0, 1fr) minmax(0, 1fr); }
  .quad .strip { grid-area: 1 / 1 / 2 / -1; }
  .quad .rail  { grid-area: 2 / 1; }
  .quad .maths { grid-area: 2 / 2; }
  .quad .intuition { grid-area: 2 / 3; }
  .quad .note      { grid-area: 2 / 4; }
  /* EVERY CELL KEEPS ITS COLUMN, even when its neighbour is empty.
     Two attempts at filling the hole left by a missing intuition were both
     worse. Spanning columns 3–4 gave the note 126 characters per line, past
     readable measure. Moving the note up to column 3 fixed that but put note
     left edges at 900, 485, 485, 485, 252, 900 down the page — the note no
     longer has a column, and the two unbroken vertical lines are the thing that
     makes a reference list read as composed rather than assembled.
     So the intuition column stays, and is simply empty on the 67 cards that
     have no intuition. A gap in the same place on every row reads as structure;
     a gap that moves reads as breakage. Only the prose-only cards (no maths AND
     no intuition) span, and the max-width cap keeps them readable. */
  .quad .row.no-maths.no-int .note { grid-column: 2 / -1; }
}

/* --- header -------------------------------------------------------------- */
.strip {
  display: flex; align-items: baseline; flex-wrap: wrap; gap: .25rem .7rem;
  margin-bottom: .5rem; font-size: .62rem; line-height: 1.4;
}
.kind {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: .03em; color: var(--text-muted);
}
/* A native fold: no component state, keyboard-operable for free. */
.fold { font-size: .62rem; }
.fold summary { cursor: pointer; color: var(--text-faint); list-style: none; }
.fold summary::-webkit-details-marker { display: none; }
.fold summary::before { content: '▸ '; }
.fold[open] summary::before { content: '▾ '; }
.fold summary:hover { color: var(--text-muted); }
.fold .n { opacity: .7; font-variant-numeric: tabular-nums; }
.fold-body { display: inline-flex; flex-wrap: wrap; gap: .3rem .5rem; padding: .25rem 0 0 .8rem; }
.ref { color: var(--text-muted); text-decoration: none; }
.ref:hover { color: var(--accent); text-decoration: underline; }
.strip-right { margin-left: auto; padding-left: .6rem; }

/* --- rail ---------------------------------------------------------------- */
.rail { min-width: 0; }
.name { margin: 0; font-size: 1rem; font-weight: 650; line-height: 1.3; text-wrap: balance; }
/* Bare glyphs trailing the name: no frame, small, and centred on the title's
   middle rather than raised. The chip version framed each mark unambiguously but
   drew too much attention for something the student is not meant to read — two
   bordered boxes beside every name were louder than the name. `vertical-align:
   middle` on the inline-flex sits the strip on the text's centre, which is what
   keeps it from reading as a superscript. */
.glyphs {
  display: inline-flex; align-items: center; gap: .32rem;
  margin-left: .45rem;
  /* `vertical-align: middle` is not the optical middle. It aligns to half the
     parent's X-HEIGHT above the baseline, while the visible centre of a title is
     half its CAP height — and KaTeX adds its own strut below the glyph. Measured
     against the name's real font metrics, that leaves the mark 2.2px low, which is
     exactly the "sits too low" of the first attempt. The correction is in em so it
     survives a font-size change. This is centring, not the badge-style raise. */
  vertical-align: middle; transform: translateY(-.22em);
  font-size: .62rem; color: var(--text-faint); font-weight: 400;
  white-space: nowrap; cursor: help;
}

/* --- maths --------------------------------------------------------------- */
.maths { min-width: 0; }
.sig { display: flex; align-items: baseline; gap: .7rem; }
.sig-sym { font-size: 1.4rem; }
.sig-type { font-size: .82rem; color: var(--text-muted); }
/* KaTeX centres display mode, which would float each formula in its cell and
   break the vertical lines the columns make. Force left. */
.stmt { overflow-x: auto; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }
.quant { display: flex; flex-wrap: wrap; gap: .1rem .9rem; font-size: .74rem; color: var(--text-muted); margin-top: .15rem; }

/* --- prose cells --------------------------------------------------------- */
/* The measure is capped in characters, not left to the column: a cell that ever
   gets a wide grid area must still break its lines where prose is readable. */
.cell { min-width: 0; max-width: 68ch; font-size: .8rem; line-height: 1.6; }
.cell.intuition { color: var(--text); }
.cell.note { color: var(--text-muted); }
/* Stacked by the base grid below the breakpoints, so they need their own gap. */
.cell + .cell { margin-top: .5rem; }
@media (min-width: 1100px) { .quad .cell + .cell { margin-top: 0; } }
.more {
  border: none; background: none; padding: 0; cursor: pointer;
  font: inherit; font-size: .76rem; color: var(--accent); white-space: nowrap;
}
.more:hover { text-decoration: underline; }
</style>
