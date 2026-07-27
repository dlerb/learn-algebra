<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NPopover } from 'naive-ui'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import WrongRight from '../components/WrongRight.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { loc, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { layerById, cardsOf, cardIndex, CONCERN_TOKENS, type Card, type Section } from '../data/layers'

// Inspection page for ONE layer of the tower, selected by the `layerId` route
// prop (src/data/layers.ts is the manifest). One source file per layer
// (cards.json), one containment tree: layer → sections → groups → cards.
// `kind` is the section (preliminary/signature/convention/axiom/definition/
// theorem/remark); `concerns` is a per-card multi-tag (add/mul/eq/order/
// completeness). Two filter rows (kind, concerns) dim non-matching cards. Page
// order is array order, top to bottom. See docs/fundamentals.md.
//
// LANDSCAPE ROWS, not a card grid (2026-07-26). The grid of bordered cards was
// replaced because the content is a linear argument — no card may cite anything
// later in its layer — and a multi-column grid renders an argument as a pinboard.
// Rows also stretch every card in a row to the tallest, which with notes running
// 46–1336 characters meant one long note surrounded itself with columns of
// whitespace. And below 560px the grid was already a single column, so the phone
// was always seeing rows; now the desktop agrees with it.
//
// ⚠️ The shell — page, section panel, row, strip, rail, prose cells — lives in
// src/components/Layer{Page,Section,Row}.vue since 2026-07-27, shared with the
// curated layers so /errors and /fundamentals are one application. What stays
// here is what is genuinely the tower's: the filters, the concern glyphs, prose
// truncation, and the placement of the four body cells.
//
// The anatomy, from the student's priorities — name, maths, intuition, skimmable
// note — with the author's interest present but demoted:
//   strip    `rests on` folds away; the id at the right IS the source deep link.
//   rail     the name, with `concerns` trailing it as the operator glyphs.
//   maths    the statement (or the signature glyph, or avoid/prefer), then the
//            quantifiers.
//   two cells  intuition, then note, each truncated with an expander.
//   full width  the derivation and the json span every column.

const props = defineProps<{ layerId: string }>()

// Deep link from /errors: `/fundamentals#ax.distributivity` marks the card the
// mistake breaks. Driven off the route rather than the `:target` pseudo-class —
// `:target` does not update on a pushState navigation, which is all vue-router
// does, so a CSS-only highlight silently never fires.
const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

const layer = computed(() => layerById(props.layerId)!)
const meta = computed(() => layer.value.data.layer.meta)
const sections = computed<Section[]>(() => layer.value.data.sections)

const t = (ls: LocalizedString) => loc(ls, lang.value)

// Citations resolve tower-wide, not just inside this layer: powers cards rest
// on fundamentals ids (th.negative-base → th.negative-one-times, ix.precedence).
const refName = (id: string) => {
  const x = cardIndex.get(id)
  return x ? t(x.card.name) : id
}
const refLinks = (ids: string[]) => ids.map(id => ({
  id, name: refName(id), to: `/${cardIndex.get(id)?.layer.slug ?? layer.value.slug}#${id}`,
}))

// A single-group section shows its cards directly (no sub-heading); its group
// blurb, if any, is lifted onto the section. Multi-group sections show headings.
const sectionBlurb = (s: Section) => s.blurb ?? (s.groups.length === 1 ? s.groups[0].blurb : undefined)
const showGroupHeads = (s: Section) => s.groups.length > 1

// CONCERNS AS GLYPHS after the name. A concern's glyph is the `symbol` of the card
// where that concern ENTERS the tower — the same entry points sweep-layers' audit
// derives — so the tag is not a vocabulary to learn: it is the operator the card is
// about, written the way the tower writes it.
//
// Two deliberate substitutions, on the principle that a mark at .62rem is an ICON,
// not an expression. The rule against notation students meet nowhere else governs
// mathematical content, not a tag nobody reads as a formula.
//   mul → `\bullet`, not op.mul's `\cdot`: a lone \cdot at tag size is
//     indistinguishable from a stray period, and mul is the commonest concern by
//     far (72 of 95 cards), so the least legible glyph would have been the most
//     seen. `a • b` is ordinary textbook multiplication anyway.
//   completeness → `\mathbb{R}`. It has no signature card at all, being an axiom
//     rather than an operation, and `\sup` (how ax.completeness states itself) is
//     three letters where every other glyph is one mark. Completeness is precisely
//     the axiom separating ℝ from ℚ, and the tower is told as `R` turning out to
//     BE `ℝ`, so ℝ is the icon for "complete".
const CONCERN_ENTRY: Record<string, string> = {
  add: 'op.add', mul: 'op.mul', eq: 'op.eq', order: 'op.lt', completeness: 'ax.completeness',
}
const CONCERN_GLYPH: Record<string, string> = { mul: '\\bullet', completeness: '\\mathbb{R}' }
const glyphOf = (token: string) =>
  CONCERN_GLYPH[token] ?? cardIndex.get(CONCERN_ENTRY[token])?.card.symbol ?? token
// Ordered by the token vocabulary rather than as authored, so the glyphs sit in
// the same sequence on every row and can be compared down the page.
const glyphsFor = (c: Card) => CONCERN_TOKENS.filter(k => (c.concerns ?? []).includes(k))
const glyphTitle = (tokens: readonly string[]) =>
  tokens.map(k => refName(CONCERN_ENTRY[k])).join(' · ')

// `forall` is the DOMAIN of the card's free variables, `cond` a RESTRICTION on
// them — kept apart because the generator needs both separately (the domain says
// where to sample, the condition what to filter). Their labels are the only
// prose the view owns, so they localize like everything else.
const L = computed(() => lang.value === 'de'
  ? { forall: 'für alle', cond: 'sofern', more: 'mehr', less: 'weniger', rests: 'stützt sich auf', from: 'aus', deriv: 'Herleitung' }
  : { forall: 'for all', cond: 'provided', more: 'more', less: 'less', rests: 'rests on', from: 'from', deriv: 'derivation' })

// PROSE TRUNCATION. Both cells clip, because leaving intuition whole was the main
// source of ragged row heights: all 34 intuitions exceed 180 characters (median
// 393, about seven lines), and notes run to 1336.
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
const clip = (ls: LocalizedString | undefined) => {
  if (!ls) return null
  const full = t(ls)
  const { head, clipped } = truncateProse(full, CUT)
  return { full, head, clipped }
}

// Filters. Both sets start full (nothing dimmed). Toggling narrows. The kind
// row is per-layer (powers has no signature or axiom section), so it resets
// when the route swaps the layer under a reused component instance. Deduped:
// a layer may repeat a kind across sections (powers runs ℕ/ℤ/ℚ as three acts),
// and one chip must then govern all of them.
const kinds = computed(() => [...new Set(sections.value.map(s => s.kind))])
const concernTokens = CONCERN_TOKENS

// Counts on the chips, PER LAYER — the chip filters this page, so a tower-wide
// number would be a different claim. They earn their place by making a filter's
// selectivity visible instead of hidden: `mul 29` warns you it selects most of
// fundamentals, `eq 8` promises it narrows hard. And a zero is real information
// about the tower's shape — `eq 0` on three of four layers says equality is only
// ever discussed on the ground floor — so zero chips are shown, and made inert
// rather than removed.
const cards = computed(() => cardsOf(layer.value))
const kindCount = computed(() => {
  const m: Record<string, number> = {}
  for (const { kind } of cards.value) m[kind] = (m[kind] ?? 0) + 1
  return m
})
const concernCount = computed(() => {
  const m: Record<string, number> = Object.fromEntries(concernTokens.map(t => [t, 0]))
  for (const { card } of cards.value) for (const t of card.concerns ?? []) m[t] = (m[t] ?? 0) + 1
  return m
})

const kindActive = ref(new Set<string>(kinds.value))
watch(kinds, k => (kindActive.value = new Set(k)))
const concernActive = ref(new Set<string>(concernTokens))
const toggleKind = (k: string) => (kindActive.value.has(k) ? kindActive.value.delete(k) : kindActive.value.add(k))
const toggleConcern = (c: string) => (concernActive.value.has(c) ? concernActive.value.delete(c) : concernActive.value.add(c))
const matched = (c: Card, kind: string) =>
  kindActive.value.has(kind) && (c.concerns ? c.concerns.some(x => concernActive.value.has(x)) : true)

// Per-card disclosure. `expand` is keyed `id:i` / `id:n` because the two prose
// cells clip independently.
const expand = ref(new Set<string>())
const derivOpen = ref(new Set<string>())
const toggle = (s: Set<string>, id: string) => (s.has(id) ? s.delete(id) : s.add(id))

// Four columns: rail | maths | intuition | note, from LayerPage's shared measures.
const COLS = 'minmax(0, var(--rail)) minmax(0, var(--maths)) minmax(0, var(--measure)) minmax(0, var(--measure))'
</script>

<template>
  <LayerPage :title="layer.title" :lead="t(meta.note)" :cols="COLS">
    <template #title-right>
      <span class="tag">≙ {{ t(meta.characterizes) }}</span>
    </template>

    <template #filters>
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">kind</span>
          <button v-for="k in kinds" :key="k" class="fchip" :class="{ off: !kindActive.has(k) }" @click="toggleKind(k)">{{ k }}<span class="fcount">{{ kindCount[k] }}</span></button>
        </div>
        <div class="filter-row">
          <span class="filter-label">concerns</span>
          <button
            v-for="c in concernTokens" :key="c"
            class="fchip concern" :class="{ off: !concernActive.has(c) }"
            :disabled="!concernCount[c]"
            :title="concernCount[c] ? undefined : `no card in this layer concerns ${c}`"
            @click="toggleConcern(c)"
          >{{ c }}<span class="fcount">{{ concernCount[c] }}</span></button>
        </div>
      </div>
    </template>

    <LayerSection
      v-for="s in sections" :key="s.slug"
      :title="t(s.title)"
      :about="sectionBlurb(s) ? t(sectionBlurb(s)!) : undefined"
      :note="s.note ? t(s.note) : undefined"
    >
      <template v-for="g in s.groups" :key="g.slug">
        <!-- A TINTED BAND, and no rules at all. Hairlines already mean "next
             row", so spending one on "next group" used the same signal for two
             levels. Whitespace alone read as an accident. -->
        <div v-if="showGroupHeads(s)" class="subhead">
          <h4>{{ g.title ? t(g.title) : g.slug }}</h4>
          <NPopover v-if="g.blurb" trigger="click" placement="bottom-start">
            <template #trigger><button class="info" aria-label="About this group">i</button></template>
            <div class="pop"><RichText :text="t(g.blurb)" /></div>
          </NPopover>
        </div>

        <LayerRow
          v-for="c in g.cards" :key="c.id"
          :id="c.id" :kind="s.kind" :name="t(c.name)" :record="c"
          :marks-title="glyphsFor(c).length ? glyphTitle(glyphsFor(c)) : undefined"
          :dimmed="!matched(c, s.kind)" :targeted="c.id === targetId"
        >
          <template v-if="c.basedOn?.length" #folds>
            <RefFold :label="L.rests" :links="refLinks(c.basedOn)" />
          </template>

          <template v-if="glyphsFor(c).length" #marks>
            <MathExpr v-for="k in glyphsFor(c)" :key="k" :latex="glyphOf(k)" />
          </template>

          <div class="maths">
            <div v-if="c.symbol" class="sig">
              <span class="sig-sym"><MathExpr :latex="c.symbol" /></span>
              <span class="sig-type"><MathExpr :latex="c.type!" /></span>
            </div>
            <div v-if="c.latex" class="stmt"><MathExpr :latex="c.latex" display /></div>
            <!-- avoid/prefer is the `style` relation: the two forms are EQUAL,
                 one is just better written, so WrongRight joins them with `=`. -->
            <WrongRight v-else-if="c.avoid" :wrong="c.avoid" :right="c.prefer!" relation="style" />
            <div v-if="c.forall || c.cond" class="quant">
              <span v-if="c.forall">{{ L.forall }} <MathExpr :latex="c.forall" /></span>
              <span v-if="c.cond">{{ L.cond }} <MathExpr :latex="c.cond" /></span>
            </div>
            <button v-if="c.derivation" class="fold-btn" @click="toggle(derivOpen, c.id)">
              {{ derivOpen.has(c.id) ? '▾' : '▸' }} {{ L.deriv }}
            </button>
          </div>

          <div v-if="c.intuition" class="cell intuition">
            <RichText :text="expand.has(c.id + ':i') || !clip(c.intuition)!.clipped ? clip(c.intuition)!.full : clip(c.intuition)!.head" /><template
              v-if="clip(c.intuition)!.clipped && !expand.has(c.id + ':i')">… </template>
            <button v-if="clip(c.intuition)!.clipped" class="more" @click="toggle(expand, c.id + ':i')">{{ expand.has(c.id + ':i') ? L.less : L.more }}</button>
          </div>
          <div v-if="c.note" class="cell note muted">
            <RichText :text="expand.has(c.id + ':n') || !clip(c.note)!.clipped ? clip(c.note)!.full : clip(c.note)!.head" /><template
              v-if="clip(c.note)!.clipped && !expand.has(c.id + ':n')">… </template>
            <button v-if="clip(c.note)!.clipped" class="more" @click="toggle(expand, c.id + ':n')">{{ expand.has(c.id + ':n') ? L.less : L.more }}</button>
          </div>

          <!-- Full width: a derivation runs to 362 characters of LaTeX, which
               would be unreadable in the 19rem maths column. -->
          <div v-if="c.derivation && derivOpen.has(c.id)" class="wide derivation">
            <MathExpr :latex="c.derivation" display />
            <div v-if="c.derivedFrom" class="refs">
              <span class="refs-label">{{ L.from }}</span>
              <RouterLink
                v-for="r in c.derivedFrom" :key="r" class="ref"
                :to="`/${cardIndex.get(r)?.layer.slug ?? layer.slug}#${r}`"
              >{{ refName(r) }}</RouterLink>
            </div>
          </div>
        </LayerRow>
      </template>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
/* A small radius, not a pill. `border-radius: 999px` only reads as a pill on a
   single line; on two it becomes a huge ellipse, which is what "Term
   manipulations" did with three words in it. */
/* Not uppercased. `≙ expand · collect · cancel` is a characterising PHRASE, not a
   label, and capitalising it inflated three words into three lines. */
.tag {
  font-size: .68rem; letter-spacing: .01em; padding: .16rem .4rem;
  border-radius: 4px; line-height: 1.4;
  /* Tokens, not hex, so the tag follows the theme: the dark block redefines both
     to a lifted accent on a deep ground. */
  background: var(--accent-bg); color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
}

/* Filters */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 4.5rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: var(--on-accent); cursor: pointer; }
.fchip.concern { border-color: var(--border-strong); background: var(--text-muted); }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover:not(:disabled) { filter: brightness(1.08); }
/* The count rides inside the chip, a step quieter than the label: it informs the
   choice, it is not the thing you are choosing. */
.fcount { margin-left: .3rem; font-size: .64rem; opacity: .7; font-variant-numeric: tabular-nums; }
/* A zero-count chip stays visible — that a layer touches no `order` is worth
   knowing — but stops pretending to be a control. */
.fchip:disabled { background: transparent; color: var(--text-faint); border-color: var(--border); cursor: default; }

/* --- the group band ------------------------------------------------------ */
/* --band: the MIDDLE rung of the elevation ladder in tokens.css, lighter than the
   page and darker than the panel. The first attempt used a plain grey near the
   page colour and read as a hole punched through to the page; the second used the
   accent tint and competed with the page for attention. A neutral that is
   unambiguously lighter than the page can be neither.
   Full-bleed across the panel via negative margins, with matching padding so the
   label keeps the page's shared left edge. */
.subhead {
  display: flex; align-items: center; gap: .4rem;
  margin: 0 -1rem; padding: .45rem 1rem;
  background: var(--band);
}
/* The band's own edge separates it from what follows. */
.subhead + .row { border-top: none; }
/* Flush in the panel's rounded corner when a group starts the section. */
.rows > .subhead:first-child { border-radius: var(--radius) var(--radius) 0 0; }
.subhead h4 {
  font-size: .82rem; font-weight: 600; letter-spacing: 0;
  color: var(--text-muted); margin: 0;
}
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 280px; font-size: .8rem; line-height: 1.45; color: var(--text); }

/* --- body cells: the tower's four columns -------------------------------- */
@media (min-width: 820px) {
  .maths { grid-area: 2 / 2; }
  .intuition { grid-area: 2 / 3; }
  .note      { grid-area: 2 / 4; }
}

.maths { min-width: 0; }
.sig { display: flex; align-items: baseline; gap: .7rem; padding: .4rem 0; }
.sig-sym { font-size: 1.4rem; }
.sig-type { font-size: .82rem; color: var(--text-muted); }
/* KaTeX centres display mode, which would float each formula in its cell and
   break the vertical lines the columns make. Force left.
   The padding is not decoration: `overflow-x: auto` makes the computed
   `overflow-y` AUTO as well (the spec turns `visible` into `auto` when paired with
   a non-visible value), so a formula whose ink exceeds its line box gets a
   VERTICAL scrollbar — th.root-of-quotient, a radical over a fraction, ran 46px
   of content in a 41px box. scrollHeight counts the padding box, so the padding
   absorbs it, and it gives radicals and exponents room at the top too. */
.stmt { overflow-x: auto; padding: .4rem 0; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }
.quant { display: flex; flex-wrap: wrap; gap: .1rem .9rem; font-size: .74rem; color: var(--text-muted); margin-top: .1rem; }
.fold-btn { margin-top: .3rem; font-size: .68rem; color: var(--text-faint); background: none; border: none; cursor: pointer; padding: 0; display: block; }
.fold-btn:hover { color: var(--accent); }

.more { border: none; background: none; padding: 0; cursor: pointer; font: inherit; font-size: .76rem; color: var(--accent); white-space: nowrap; }
.more:hover { text-decoration: underline; }

/* --- full-width blocks --------------------------------------------------- */
.wide { margin-top: .6rem; }
/* --band, not --bg: this block sits INSIDE a panel, so it takes the ladder's
   middle rung like the group stripe. Painted the page colour it read as a hole
   punched through to the page behind. */
.derivation { padding: .5rem .65rem; background: var(--band); border: 1px solid var(--border); border-radius: 6px; overflow-x: auto; }
.refs { display: flex; align-items: baseline; flex-wrap: wrap; gap: .35rem .5rem; margin-top: .45rem; }
.refs-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.ref { color: var(--text-muted); text-decoration: none; }
.ref:hover { color: var(--accent); text-decoration: underline; }
</style>
