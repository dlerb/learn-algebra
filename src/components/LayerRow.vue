<script setup lang="ts">
import { ref } from 'vue'
import OpenInSource from './OpenInSource.vue'
import { inspect } from '../inspect'

// ONE LANDSCAPE ROW — the anatomy every layer shares.
//
//   strip   `kind`, the reference folds, and at the right the json fold plus the
//           id, which IS the source deep link (one affordance where there were
//           two). All of it .62rem, the quietest thing on the row.
//   rail    the name, carrying the weight, with marks (the tower's concern
//           glyphs, an error's ★ frequency) trailing it.
//   body    the default slot: the cells that differ per layer — a statement, a
//           ✗/✓ table, a rule. The row grid is `--row-cols` from LayerPage, and
//           each page places its OWN cells; this component places only the two
//           it owns.
//
// The body is a slot rather than prop soup because the bodies genuinely differ,
// while the chrome genuinely does not. What keeps the pages looking alike is not
// a shared body but the shared strip, rail, planes, hairline and measures — plus
// `:deep(.cell)` below, so a prose cell reads the same on every layer.
//
// EVERY CELL KEEPS ITS COLUMN even when empty: a gap in the same place on every
// row reads as structure, a gap that moves reads as breakage.
const props = defineProps<{
  id: string
  /** Shown at the left of the strip. Repeated on every row despite the section
   *  heading saying it: on a long page you are usually mid-section with the
   *  heading scrolled away, and "axiom" or "misreading" is what orients you. */
  kind?: string
  /** The row's name — set in the content serif, the row's subject. */
  name: string
  /** Tooltip for the trailing marks (what the glyphs stand for). */
  marksTitle?: string
  /** Dimmed by a filter, but kept in place. */
  dimmed?: boolean
  /** Arrived at by deep link. */
  targeted?: boolean
  /** The authored record behind the `json` fold. Author plumbing: omit and the
   *  fold does not render. */
  record?: unknown
}>()

const jsonOpen = ref(false)
const json = () => JSON.stringify(props.record, null, 2)
</script>

<template>
  <article :id="id" class="row" :class="{ dimmed, targeted }">
    <div class="strip">
      <span v-if="kind" class="kind">{{ kind }}</span>
      <slot name="folds" />
      <span class="strip-right">
        <button v-if="record !== undefined && inspect" class="jfold" @click="jsonOpen = !jsonOpen">
          {{ jsonOpen ? '▾' : '▸' }} json
        </button>
        <OpenInSource :id="id" :label="id" />
      </span>
    </div>

    <div class="rail">
      <h4 class="name">{{ name }}<span
        v-if="$slots.marks" class="marks" :class="{ helped: marksTitle }" :title="marksTitle"
      ><slot name="marks" /></span></h4>
      <slot name="rail" />
    </div>

    <slot />

    <pre v-if="jsonOpen" class="wide json">{{ json() }}</pre>
  </article>
</template>

<style scoped>
/* One hairline per row, no boxes. Mobile is the base case — everything stacks in
   DOM order, which is already the reading order. */
.row {
  display: grid; grid-template-columns: 1fr; gap: .1rem 1.6rem;
  padding: 1.05rem 0 1.15rem; border-top: 1px solid var(--border);
  scroll-margin-top: 4.5rem;
}
@media (min-width: 820px) {
  /* Set per layer by LayerPage's `cols`. */
  .row { grid-template-columns: var(--row-cols, 1fr); }
  /* The rail STACKS below this width rather than shrinking: an 11rem gutter
     beside body text on a phone is unusable. */
  .strip { grid-area: 1 / 1 / 2 / -1; }
  .rail  { grid-area: 2 / 1; }
  /* Full-width blocks — a derivation runs to 362 characters of LaTeX and would
     scroll to uselessness inside one column. Auto-placed after the explicit
     cells, so they land below them. */
  :deep(.wide) { grid-column: 1 / -1; }
}

/* Every row is an anchor. `targeted` says which one you arrived at.
   A hue and an inset accent bar, not a grey fill: inside a light panel a grey
   highlight reads as a hole rather than as "you arrived here", and a spread
   shadow bleeds outside the panel's edge. */
.row.targeted { background: var(--accent-bg); box-shadow: inset 3px 0 0 var(--accent); }
.dimmed { opacity: .2; transition: opacity .15s; }

/* --- header strip -------------------------------------------------------- */
.strip {
  display: flex; align-items: baseline; flex-wrap: wrap; gap: .25rem .7rem;
  margin-bottom: .45rem; font-size: .62rem; line-height: 1.4;
}
.kind { letter-spacing: .01em; font-weight: 600; color: var(--text-muted); }
.strip-right { margin-left: auto; padding-left: .6rem; display: inline-flex; align-items: baseline; gap: .6rem; }
/* Matches RefFold's summary exactly — same size, colour, marker — so the strip's
   affordances read as one row of controls, some opening references and one
   opening the record. */
.jfold { font-size: .62rem; color: var(--text-faint); background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
.jfold:hover { color: var(--text-muted); }

/* --- rail ---------------------------------------------------------------- */
.rail { min-width: 0; }
/* Serif, like the prose and like the formulas — structure is sans, chrome is
   sans, content is serif, and a name is content.
   ⚠️ Weight 500, which resolves to Latin Modern's REGULAR face. 560 matches the
   700 face and sets every name in bold; the name is set apart from its prose by
   size and colour, not by weight. */
.name { margin: 0; font-family: var(--font-content); font-size: 1.06rem; font-weight: 500; line-height: 1.32; color: var(--text); text-wrap: balance; }
/* `vertical-align: middle` is NOT the optical middle — it aligns to half the
   parent's x-height, while a title's visible centre is half its cap height, and
   KaTeX adds a strut below the glyph. Measured against the name's real font
   metrics that leaves the mark 2.2px low; the correction is in em so it survives
   a font-size change. */
.marks {
  display: inline-flex; align-items: center; gap: .32rem;
  margin-left: .45rem; vertical-align: middle; transform: translateY(-.22em);
  font-size: .62rem; color: var(--text-faint); font-weight: 400;
  white-space: nowrap;
}
.marks.helped { cursor: help; }

/* --- prose cells, shared across layers ----------------------------------- */
/* Capped at exactly one column's measure, so no row can set its prose wider than
   its neighbours. Serif: the inline `$…$` in this prose is Computer Modern, so a
   sans setting changed typeface at every formula. Serif is also read at a
   slightly larger size for the same apparent weight, hence .86 against sans .8. */
:deep(.cell) { min-width: 0; max-width: var(--measure); font-family: var(--font-content); font-size: .86rem; line-height: 1.6; color: var(--text); }
:deep(.cell.muted) { color: var(--text-muted); }
:deep(.cell) + :deep(.cell) { margin-top: .5rem; }
@media (min-width: 820px) { :deep(.cell) + :deep(.cell) { margin-top: 0; } }

.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: var(--text-muted); }
</style>
