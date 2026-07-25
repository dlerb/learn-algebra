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
// LAYOUT. When `from` is given the two candidates stack against that invariant
// stem, so the eye lands on the one thing that varies:
//     (a+b)²   ✗  a² + b²
//              ✓  a² + 2ab + b²
// Pair only what shares a stem. Juxtaposing a rule and an unrelated instance
// claims a correspondence the data does not have — show those as a list instead.
const props = withDefaults(defineProps<{
  from?: string       // shared left-hand side (KaTeX); omit for a standalone claim
  wrong: string       // the false claim / clumsy form (KaTeX)
  right?: string      // the correction (KaTeX)
  hint?: string       // prose correction — carries it when `right` cannot
  relation?: 'false' | 'style'
}>(), { relation: 'false' })

const stemmed = () => Boolean(props.from)
</script>

<template>
  <div class="wr" :class="[relation, { stemmed: stemmed() }]">
    <div v-if="from" class="stem"><MathExpr :latex="from" /></div>
    <div class="cand bad"><span class="mark">✗</span><MathExpr :latex="wrong" /></div>
    <div v-if="relation === 'style'" class="eq">=</div>
    <div class="cand good">
      <span class="mark">✓</span>
      <MathExpr v-if="right" :latex="right" />
      <span v-if="hint" class="hint" :class="{ solo: !right }"><RichText :text="hint" /></span>
    </div>
  </div>
</template>

<style scoped>
/* `false`: a two-row grid, stem in the gutter spanning both rows. */
.wr.false { display: grid; grid-template-columns: 1fr; row-gap: .2rem; align-items: baseline; margin: .5rem 0 0; }
.wr.false.stemmed { grid-template-columns: auto 1fr; column-gap: 1rem; }
.wr.false.stemmed .stem { grid-row: 1 / span 2; grid-column: 1; }
.wr.false.stemmed .cand { grid-column: 2; }

/* `style`: one line, the two forms joined by the equals sign that makes the
   claim honest — these ARE the same thing. */
.wr.style { display: flex; flex-wrap: wrap; align-items: baseline; gap: .1rem .55rem; margin: .5rem 0 0; }
.wr.style .mark { color: var(--text-faint); }
.wr.style .eq { color: var(--text-faint); }

.stem { font-size: .95rem; line-height: 1.5; color: var(--text); white-space: nowrap; }
.cand { font-size: .95rem; line-height: 1.5; overflow-x: auto; }
.mark { font-weight: 700; margin-right: .5rem; }
.bad .mark { color: var(--bad); }
.good .mark { color: var(--good); }
.hint { font-size: .82rem; color: var(--text-muted); }
.hint.solo { font-style: italic; }
</style>
