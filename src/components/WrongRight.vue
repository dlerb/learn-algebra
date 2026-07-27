<script setup lang="ts">
import MathExpr from './MathExpr.vue'
import RichText from './RichText.vue'

// The ✗/✓ pair — the one format in the app that speaks straight to a student.
//
// TWO RELATIONS, and they must not look alike. `false` (the default) means the
// two sides are NOT equal: an error instance, a drill pitfall. `style` means they
// ARE equal and one is merely better written — a card's avoid/prefer. Marking a
// correct-but-clumsy form with the same red ✗ as a falsehood teaches ✗ = wrong and
// then contradicts it, so the punctuation carries the difference: in the `style`
// case the two forms are joined by an actual `=`, in the `false` case nothing
// joins them, because nothing can.
//
// LAYOUT CONTRACT (relation="false"). This renders GRID CELLS via `display:
// contents`, not a self-contained block, and must live inside a `.wr-rows` grid:
//
//   .wr-rows { display: grid; grid-template-columns: auto auto minmax(0, 1fr); }
//
// The reason is alignment ACROSS instances. When one card carries three pairs with
// stems of different widths ((a+b)², √(a+b), (3x+2)/3), a per-instance grid puts
// the ✗ and ✓ at three different x positions and the block reads as scattered.
// Sharing one grid makes the stem, the wrong form and the right form each a
// COLUMN, so the eye can run down them — the invariant background that makes the
// contrast legible in the first place. One row per instance; the prose `hint` gets
// its own row underneath rather than trailing the ✓ inline.
//
// `style` has no siblings to align with, so it stays self-contained.
const props = withDefaults(defineProps<{
  from?: string       // shared left-hand side (KaTeX); omit for a standalone claim
  wrong: string       // the false claim / clumsy form (KaTeX)
  right?: string      // the correction (KaTeX)
  hint?: string       // prose correction — carries it alone when `right` cannot
  relation?: 'false' | 'style'
}>(), { relation: 'false' })

// The ✓ column always holds the correction, formula or prose: with no `right`
// (a dead end — "no rule applies" — or a belief) the hint moves up into it.
const hintInline = () => Boolean(props.hint && !props.right)
</script>

<template>
  <template v-if="relation === 'false'">
    <div class="stem"><MathExpr v-if="from" :latex="from" /></div>
    <div class="cand bad"><span class="mark">✗</span><MathExpr :latex="wrong" /></div>
    <div class="cand good">
      <span class="mark">✓</span>
      <MathExpr v-if="right" :latex="right" />
      <span v-else-if="hintInline()" class="hint"><RichText :text="hint!" /></span>
    </div>
    <div v-if="right && hint" class="hint-row"><RichText :text="hint" /></div>
  </template>

  <!-- Equal forms, one better written: joined by the `=` that says so. -->
  <div v-else class="wr-style">
    <span class="cand bad"><span class="mark">✗</span><MathExpr :latex="wrong" /></span>
    <!-- `=` is glued to the form it introduces, so a wrap leaves it leading the
         second line rather than dangling off the end of the first. -->
    <span class="tail"><span class="eq">=</span><span class="cand good"><span class="mark">✓</span><MathExpr :latex="right!" /></span></span>
  </div>
</template>

<style scoped>
/* THE STEM IS THE GIVEN, not the first of three equal candidates. Read left to
   right the row used to say "a−b, b−a, −(b−a)" in one voice, and you had to work
   out which one you were being shown. It is now a table's STUB column: right
   aligned against a fixed track so every stem ends on the same vertical line, and
   the page paints a continuous rule there (see `.pairs` in ReferenceView). The
   two candidates then read as two claims ABOUT the thing to the left of the rule.
   Right, not left: the stem's job is to abut the rule, and ragged-right stems
   left a gap that varied with the formula's width. */
.stem { grid-column: 1; text-align: right; font-size: .95rem; line-height: 1.6; color: var(--text); white-space: nowrap; }
.cand.bad { grid-column: 2; }
.cand.good { grid-column: 3; }
.cand { font-size: .95rem; line-height: 1.6; min-width: 0; overflow-x: auto; white-space: nowrap; }
/* CONTENT SERIF, like every other prose in the app: a hint carries inline `$…$`
   fragments that KaTeX sets in Computer Modern, so a sans hint changed typeface
   mid-sentence at every formula ("no rule — $\frac{b}{a}$ is the reciprocal").
   This only surfaced when /errors moved onto the row shell — the tower uses
   WrongRight for avoid/prefer only, which carries no hint. */
.hint-row { grid-column: 2 / -1; margin-top: -.1rem; max-width: 34rem; font-family: var(--font-content); font-size: .82rem; line-height: 1.5; color: var(--text-muted); font-style: italic; }

.mark { font-weight: 600; font-size: .85em; margin-right: .45rem; }
.bad .mark { color: var(--bad); }
.good .mark { color: var(--good); }
/* Capped so a sentence-long correction WRAPS instead of stretching the ✓ track.
   Uncapped, one prose hint pushed that column to 670px on some entries and 250px
   on others, and the ✓ jumped horizontally as you scrolled down the page. */
/* `min(22rem, 100%)`, not `22rem`. The cap stops a sentence-long correction
   stretching the ✓ track — uncapped, one prose hint pushed that column to 670px
   on some entries and 250px on others, and the ✓ jumped as you scrolled. But on a
   phone the ✓ track is ~130px, and a flat 22rem made the hint wider than its own
   cell, so `overflow-x: auto` clipped the correction — the one thing on the page
   a student must be able to read. */
/* `100%` is the whole cell, but the ✓ mark and its margin sit BEFORE the hint on
   the same line, so a hint capped at 100% overran its own cell by exactly the
   mark's width and `overflow-x: auto` clipped the tail. */
.hint { display: inline-block; max-width: min(22rem, calc(100% - 1.7rem)); font-family: var(--font-content); font-size: .86rem; color: var(--text-muted); font-style: italic; white-space: normal; vertical-align: top; }

.wr-style { display: flex; flex-wrap: wrap; align-items: baseline; gap: .15rem .55rem; margin: .5rem 0 0; }
.wr-style .tail { display: inline-flex; align-items: baseline; gap: .55rem; min-width: 0; }
.wr-style .cand { white-space: normal; }
.wr-style .mark { color: var(--text-faint); }
.wr-style .eq { color: var(--text-faint); }
</style>
