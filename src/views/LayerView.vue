<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NPopover } from 'naive-ui'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import WrongRight from '../components/WrongRight.vue'
import OpenInSource from '../components/OpenInSource.vue'
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
// LANDSCAPE ROWS, not a card grid (2026-07-26, prototyped at /proto). The grid of
// bordered cards was replaced because the content is a linear argument — no card
// may cite anything later in its layer — and a multi-column grid renders an
// argument as a pinboard. Rows also stretch every card in a row to the tallest,
// which with notes running 46–1336 characters meant one long note surrounded
// itself with columns of whitespace. And below 560px the grid was already a single
// column, so the phone was always seeing rows; now the desktop agrees with it.
//
// The anatomy, from the student's priorities — name, maths, intuition, skimmable
// note — with the author's interest present but demoted:
//   header   `rests on` and `details` fold away; the id at the right IS the
//            source deep link. `kind` is NOT repeated here: the section heading
//            above already says it.
//   rail     the name, carrying the weight, with `concerns` trailing it as the
//            operator glyphs themselves.
//   maths    the statement (or the signature glyph, or avoid/prefer), then the
//            quantifiers.
//   two cells  intuition, then note, each truncated with an expander.
//   full width  the derivation and the details block span every column: a
//            derivation runs to 362 characters of LaTeX and would scroll to
//            uselessness inside the 13rem maths column.
//
// EVERY CELL KEEPS ITS COLUMN even when empty — the intuition column is blank on
// the 67 cards without one. Three attempts at filling those gaps by moving or
// spanning cells were each worse: a gap in the same place on every row reads as
// structure, a gap that moves reads as breakage.

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
const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const derivOpen = ref(new Set<string>())
const toggle = (s: Set<string>, id: string) => (s.has(id) ? s.delete(id) : s.add(id))
const json = (x: unknown) => JSON.stringify(x, null, 2)
</script>

<template>
  <div class="layer">
    <header class="intro">
      <div class="title-row">
        <h2>{{ layer.title }}</h2>
        <!-- NOT `class="tag field"` any more: `.field` is also the details block's
             row class in this same scoped stylesheet, so the tag was silently
             inheriting `display: grid; grid-template-columns: 92px 1fr` and sat at
             a fixed 115px whatever it contained. That was the "chip too wide". -->
        <span class="tag">≙ {{ t(meta.characterizes) }}</span>
      </div>
      <p class="lead"><RichText :text="t(meta.note)" /></p>

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
    </header>

    <section v-for="s in sections" :key="s.slug" class="group">
      <div class="group-title">
        <h3>{{ t(s.title) }}</h3>
        <NPopover v-if="sectionBlurb(s)" trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this section">i</button></template>
          <div class="pop"><RichText :text="t(sectionBlurb(s)!)" /></div>
        </NPopover>
      </div>
      <p v-if="s.note" class="section-note"><RichText :text="t(s.note)" /></p>

      <!-- ONE PANEL PER SECTION, with the group subheads inside it. Per group it
           was 37 panels across the tower, and a section like Axioms broke into six
           — several of them wrapping a single row, which made the panel read as a
           box around one card rather than as a surface holding a list. Merged, the
           subheads become dividers WITHIN one continuous surface, which is what
           they are: the section is the thing, the groups are its parts.
           ONE template for every card, signatures included. The old signature tile
           is gone: a `symbol` renders in the maths cell where a statement would,
           which removed the last layout variant. -->
      <div class="rows">
        <template v-for="g in s.groups" :key="g.slug">
          <div v-if="showGroupHeads(s)" class="subhead">
            <h4>{{ g.title ? t(g.title) : g.slug }}</h4>
            <NPopover v-if="g.blurb" trigger="click" placement="bottom-start">
              <template #trigger><button class="info" aria-label="About this group">i</button></template>
              <div class="pop"><RichText :text="t(g.blurb)" /></div>
            </NPopover>
          </div>

          <article
            v-for="c in g.cards" :key="c.id" :id="c.id"
            class="row" :class="{ dimmed: !matched(c, s.kind), targeted: c.id === targetId }"
          >
            <div class="strip">
              <!-- `kind` is repeated on every row despite the section heading
                   above stating it: on a long page you are usually mid-section
                   with the heading scrolled away, and "axiom" or "theorem" is the
                   first thing that orients you. -->
              <span class="kind">{{ s.kind }}</span>
              <details v-if="c.basedOn?.length" class="fold">
                <summary>{{ L.rests }} <span class="n">{{ c.basedOn.length }}</span></summary>
                <span class="fold-body">
                  <RouterLink
                    v-for="r in c.basedOn" :key="r" class="ref"
                    :to="`/${cardIndex.get(r)?.layer.slug ?? layer.slug}#${r}`"
                  >{{ refName(r) }}</RouterLink>
                </span>
              </details>
              <button class="disclose" @click="toggle(open, c.id)">{{ open.has(c.id) ? 'less' : 'details' }}</button>
              <span class="strip-right"><OpenInSource :id="c.id" :label="c.id" /></span>
            </div>

            <div class="rail">
              <h4 class="name">
                {{ t(c.name) }}<span
                  v-if="glyphsFor(c).length" class="glyphs" :title="glyphTitle(glyphsFor(c))"
                ><MathExpr v-for="k in glyphsFor(c)" :key="k" :latex="glyphOf(k)" /></span>
              </h4>
            </div>

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
            <div v-if="c.note" class="cell note">
              <RichText :text="expand.has(c.id + ':n') || !clip(c.note)!.clipped ? clip(c.note)!.full : clip(c.note)!.head" /><template
                v-if="clip(c.note)!.clipped && !expand.has(c.id + ':n')">… </template>
              <button v-if="clip(c.note)!.clipped" class="more" @click="toggle(expand, c.id + ':n')">{{ expand.has(c.id + ':n') ? L.less : L.more }}</button>
            </div>

            <!-- Full width: a derivation runs to 362 characters of LaTeX, which
                 would be unreadable in the 13rem maths column. -->
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

            <div v-if="open.has(c.id)" class="wide details">
              <dl class="fields">
                <div class="field"><dt>id</dt><dd><code>{{ c.id }}</code></dd></div>
                <div class="field"><dt>kind</dt><dd>{{ s.kind }}</dd></div>
                <div v-if="c.concerns" class="field"><dt>concerns</dt><dd>{{ c.concerns.join(', ') }}</dd></div>
              </dl>
              <button class="json-toggle" @click="toggle(jsonOpen, c.id)">{{ jsonOpen.has(c.id) ? 'hide json' : 'json' }}</button>
              <pre v-if="jsonOpen.has(c.id)" class="json">{{ json(c) }}</pre>
            </div>
          </article>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* THE WIDTH BUDGET, measured against the real tower rather than guessed.
   Of 92 maths cells, 20 need more than the prototype's 13rem: the widest is
   th.minus-in-product at 407px, and 10 exceed 304px. The cost of fitting them all
   would be a 25rem maths column and a 100rem page, so this splits the difference
   by taking the width from the prose rather than from the reader's screen —
   maths 19rem clears 10 of the 20, prose 26rem still gives ~51 characters, which
   is inside the readable band, and the page stays at 89rem.
   Sizing the COLUMNS and letting the page fall out is what makes the cap on
   `.cell` exact: a cell can never be wider than one column's measure. */
.layer { --measure: 26rem; --maths: 19rem; max-width: 91rem; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

/* A PAGE HEADER, not a row. Putting the intro on the row grid made the layer title
   into a narrow rail and the blurb into a column — a second layout on a page that
   only needs one, which read as noise. A page header is a title, its tag, and the
   text under it; the rows below are a different thing and do not need the header
   to pretend otherwise. */
/* ONE LEFT EDGE for everything on the page. The panels carry 1rem of inner
   padding, so row content starts 1rem inside the panel border; giving the header
   and the section headings the same padding puts every piece of text on the page —
   title, blurb, headings, card names — on a single vertical line. That, plus the
   removed max-width below, is what "not the width of the cards" was asking for. */
/* `calc(1rem + 1px)`, not `1rem`: the panel's own 1px border sits inside its box,
   so row content starts a pixel further right than page content would. Without the
   pixel every heading on the page is off by one against every card name. */
.intro, .group-title, .section-note { padding-left: calc(1rem + 1px); padding-right: calc(1rem + 1px); }
.intro { margin-bottom: 1.5rem; }
.title-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: .5rem .7rem; }
.intro h2 { font-size: 1.25rem; font-weight: 700; margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; line-height: 1.2; }
/* A small radius, not a pill. `border-radius: 999px` only reads as a pill on a
   single line; on two it becomes a huge ellipse, which is what "Term
   manipulations" did with three words in it. */
/* Not uppercased. `≙ expand · collect · cancel` is a characterising PHRASE, not a
   label, and capitalising it inflated three words into three lines inside the
   11rem rail. Sentence case fits, and reads as something to be read. */
.tag {
  font-size: .68rem; letter-spacing: .01em; padding: .16rem .4rem;
  border-radius: 4px; line-height: 1.4;
  /* Tokens, not hex, so the tag follows the theme: the dark block redefines both
     to a lifted accent on a deep ground. */
  background: var(--accent-bg); color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
}
/* No max-width: the blurb runs the panel width, as asked. Note the consequence —
   at 91rem that is ~205 characters per line, well past the 45–75 that keeps the
   eye on the line. If it reads badly, the fix that keeps the full width is to flow
   it into columns (`column-width: 26rem`), which fills the measure with two or
   three readable columns instead of one long one. */
.lead { font-size: .84rem; line-height: 1.6; color: var(--text-muted); margin: .55rem 0 0; }

/* Filters */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 4.5rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: #fff; cursor: pointer; }
.fchip.concern { border-color: var(--border-strong); background: var(--text-muted); }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover:not(:disabled) { filter: brightness(1.08); }
/* The count rides inside the chip, a step quieter than the label: it informs the
   choice, it is not the thing you are choosing. */
.fcount { margin-left: .3rem; font-size: .64rem; opacity: .7; font-variant-numeric: tabular-nums; }
/* A zero-count chip stays visible — that a layer touches no `order` is worth
   knowing — but stops pretending to be a control. */
.fchip:disabled { background: transparent; color: var(--text-faint); border-color: var(--border); cursor: default; }

/* STRUCTURE IS MONO, CONTENT IS THE BODY FONT. Section and group headings named
   the tree; card names name the mathematics; and at .95rem/700 against a card's
   1rem/650 the two were near-indistinguishable, so a heading read as just another
   card. Rather than push the weights further apart, they now differ in TYPEFACE —
   the same distinction the layer title already made — which separates them at a
   glance and lets the card name go lighter instead of louder. A rule under the
   section heading does the rest of the work a size jump would have. */
/* No rule under the heading: the panel's own top edge sits a few pixels below it,
   so a border here made two horizontal lines in a row — exactly the noise the
   card grid's 404 borders were removed to avoid. */
.group-title { display: flex; align-items: center; gap: .4rem; margin: 1.9rem 0 .5rem; }
.group-title h3 {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: .82rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  color: var(--text); margin: 0;
}
.section-note { font-size: .82rem; line-height: 1.55; color: var(--text-muted); margin: -.1rem 0 .6rem; }
/* A TINTED BAND, and no rules at all. Hairlines already mean "next row", so
   spending one on "next group" used the same signal for two levels and left the
   label enclosed between its own rule and the following row's. Whitespace alone
   was tried and read as an accident — you stop and ask what changed. A band is a
   third device: its fill is the boundary, so nothing above it and nothing below.
   Full-bleed across the panel via negative margins, with matching padding so the
   label keeps the page's shared left edge. */
/* --band: the MIDDLE rung of the elevation ladder in tokens.css, lighter than the
   page and darker than the panel. The first attempt used a plain grey near the page
   colour and read as a hole punched through to the page; the second used the
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
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: .7rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  color: var(--text-muted); margin: 0;
}
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 280px; font-size: .8rem; line-height: 1.45; color: var(--text); }

/* --- the panel and the row ------------------------------------------------ */
/* ONE SURFACE PER GROUP, not per card. The page is --bg (#fafafa) and the panel is
   --surface (#ffffff) — a distinction the tokens were written for, where --surface
   is commented "card". Structure (the section and group headings) sits on the page
   OUTSIDE the panel; content sits on the raised surface INSIDE it, divided by
   hairlines.
   This is what settles the heading-versus-card-name competition, and it settles it
   without typography: the two are on different planes, so neither has to shout.
   It is also not a return to cards — 101 bordered boxes become about ten panels,
   and contiguous rows read as one continuous table rather than as a mosaic. */
.rows {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0 1rem;
}
/* One hairline per row, no boxes. Mobile is the base case — everything stacks in
   DOM order, which is already the student's reading order. */
.row {
  display: grid; grid-template-columns: 1fr; gap: .1rem 1.6rem;
  padding: 1.05rem 0 1.15rem; border-top: 1px solid var(--border);
  scroll-margin-top: 4.5rem;
}
/* The panel's own edge is the first divider, whatever comes first — a row in a
   single-group section, a subhead in a multi-group one. */
.rows > :first-child { border-top: none; }
@media (min-width: 820px) {
  .row {
    grid-template-columns: minmax(0, 11rem) minmax(0, var(--maths)) minmax(0, var(--measure)) minmax(0, var(--measure));
  }
  /* The rail STACKS below this width rather than shrinking: an 11rem gutter
     beside body text on a phone is unusable. */
  .strip { grid-area: 1 / 1 / 2 / -1; }
  .rail  { grid-area: 2 / 1; }
  .maths { grid-area: 2 / 2; }
  .intuition { grid-area: 2 / 3; }
  .note      { grid-area: 2 / 4; }
  /* Auto-placed after the explicit cells, so these land on rows 3 and 4. */
  .wide { grid-column: 1 / -1; }
}

/* Every card is an anchor: `/fundamentals#ax.distributivity`. The /errors page
   links a mistake to the exact card it breaks, so the ref has to LAND on that
   card. `targeted` says which one you arrived at; scroll-margin clears the app
   header. A tinted band rather than a border, since the row has no box to outline. */
/* A hue, and an accent bar — not a grey fill. Inside a white panel a grey
   highlight reads as a hole rather than as "you arrived here", and the old
   .5rem spread shadow bled outside the panel's edge. The inset bar stays within
   the row and cannot spill. */
.row.targeted { background: var(--accent-bg); box-shadow: inset 3px 0 0 var(--accent); }

/* --- header strip -------------------------------------------------------- */
.strip {
  display: flex; align-items: baseline; flex-wrap: wrap; gap: .25rem .7rem;
  margin-bottom: .45rem; font-size: .62rem; line-height: 1.4;
}
.kind { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .03em; color: var(--text-muted); }
/* A native fold: no component state, keyboard-operable for free. */
.fold { font-size: .62rem; min-width: 0; }
.fold summary { cursor: pointer; color: var(--text-faint); list-style: none; }
.fold summary::-webkit-details-marker { display: none; }
.fold summary::before { content: '▸ '; }
.fold[open] summary::before { content: '▾ '; }
.fold summary:hover { color: var(--text-muted); }
.fold .n { opacity: .7; font-variant-numeric: tabular-nums; }
.fold-body { display: inline-flex; flex-wrap: wrap; gap: .3rem .5rem; padding: .25rem 0 0 .8rem; }
.ref { color: var(--text-muted); text-decoration: none; }
.ref:hover { color: var(--accent); text-decoration: underline; }
.disclose { font-size: .62rem; color: var(--text-faint); background: none; border: none; cursor: pointer; padding: 0; }
.disclose:hover { color: var(--text-muted); }
.strip-right { margin-left: auto; padding-left: .6rem; }

/* --- rail ---------------------------------------------------------------- */
.rail { min-width: 0; }
/* Lighter than it was (650 → 560): the name is the row's subject, but the section
   heading above it is the page's structure, and the two were competing. */
.name { margin: 0; font-size: 1rem; font-weight: 560; line-height: 1.32; color: var(--text); text-wrap: balance; }
/* `vertical-align: middle` is NOT the optical middle — it aligns to half the
   parent's x-height, while a title's visible centre is half its cap height, and
   KaTeX adds a strut below the glyph. Measured against the name's real font
   metrics that leaves the mark 2.2px low; the correction is in em so it survives
   a font-size change. */
.glyphs {
  display: inline-flex; align-items: center; gap: .32rem;
  margin-left: .45rem; vertical-align: middle; transform: translateY(-.22em);
  font-size: .62rem; color: var(--text-faint); font-weight: 400;
  white-space: nowrap; cursor: help;
}

/* --- maths --------------------------------------------------------------- */
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

/* --- prose cells --------------------------------------------------------- */
/* Capped at exactly one column's measure, so no row can ever set its prose wider
   than its neighbours. */
.cell { min-width: 0; max-width: var(--measure); font-size: .8rem; line-height: 1.6; }
.cell.intuition { color: var(--text); }
.cell.note { color: var(--text-muted); }
.cell + .cell { margin-top: .5rem; }
@media (min-width: 820px) { .cell + .cell { margin-top: 0; } }
.more { border: none; background: none; padding: 0; cursor: pointer; font: inherit; font-size: .76rem; color: var(--accent); white-space: nowrap; }
.more:hover { text-decoration: underline; }

/* --- full-width blocks --------------------------------------------------- */
.wide { margin-top: .6rem; }
/* --band, not --bg: this block sits INSIDE a white panel, so it takes the ladder's
   middle rung like the group stripe. Painted the page colour it read as a hole
   punched through to the page behind. */
.derivation { padding: .5rem .65rem; background: var(--band); border: 1px solid var(--border); border-radius: 6px; overflow-x: auto; }
.refs { display: flex; align-items: baseline; flex-wrap: wrap; gap: .35rem .5rem; margin-top: .45rem; }
.refs-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.details { border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: var(--text-muted); }

/* Filter dimming */
.dimmed { opacity: .2; transition: opacity .15s; }
</style>
