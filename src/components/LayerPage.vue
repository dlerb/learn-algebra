<script setup lang="ts">
import { NPopover } from 'naive-ui'
import RichText from './RichText.vue'
import { inspect, inspectAvailable } from '../inspect'

// THE PAGE HALF OF THE ROW SHELL — extracted from LayerView 2026-07-27 so the
// curated layers can be the same application rather than three that happen to
// import the same file (docs/TODO.md, "the curated views onto the row shell").
//
// It owns the page's measure vocabulary, its one left edge, and the header. What
// it deliberately does NOT own is the row grid: `cols` is a per-layer decision
// (the tower needs four columns, errors three, a flat layer two), and it arrives
// as a string so the arithmetic sits in the consuming page's own stylesheet
// beside the comment justifying it.
//
// A PAGE HEADER, NOT A ROW. Putting the intro on the row grid made the layer
// title a narrow rail and the blurb a column — a second layout on a page that
// needs one.
withDefaults(defineProps<{
  title: string
  /** The visible page lede. Prose contract (inline `$…$`). */
  lead?: string
  /** Behind the info dot: the layer's own note, one level down from the lede. */
  about?: string
  /** `grid-template-columns` for every row on the page, applied at ≥820px.
   *  Below that the rows stack and this is ignored — see LayerRow. */
  cols?: string
}>(), { cols: '1fr' })
</script>

<template>
  <div class="layer" :style="{ '--row-cols': cols }">
    <header class="intro">
      <div class="title-row">
        <h2>{{ title }}</h2>
        <NPopover v-if="about" trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this layer">i</button></template>
          <div class="pop"><RichText :text="about" /></div>
        </NPopover>
        <!-- The tower's `≙ ℝ` tag, and anything else that belongs beside the name. -->
        <slot name="title-right" />
        <span class="bar-right">
          <slot name="bar-right" />
          <!-- ONE GATE, AND IT IS DEV (docs/TODO.md 2026-07-26). The toggle lives
               here rather than in each curated view, so all seven layers disclose
               their plumbing the same way — the tower used to show `json` to
               everyone while /errors hid it. Presentation stays the DEFAULT: the
               author is in this app far more than any student, so an inspection
               default would let the student view rot unseen. -->
          <button v-if="inspectAvailable" class="mode-toggle" :class="{ on: inspect }" @click="inspect = !inspect">
            {{ inspect ? 'inspecting' : 'inspect' }}
          </button>
        </span>
      </div>
      <p v-if="lead" class="lead"><RichText :text="lead" /></p>
      <slot name="filters" />
    </header>

    <slot />
  </div>
</template>

<style scoped>
/* THE WIDTH BUDGET, measured against the real tower rather than guessed.
   Of 92 maths cells, 20 need more than the prototype's 13rem: the widest is
   th.minus-in-product at 407px, and 10 exceed 304px. The cost of fitting them all
   would be a 25rem maths column and a 100rem page, so this splits the difference
   by taking the width from the prose rather than from the reader's screen —
   maths 19rem clears 10 of the 20, prose 26rem still gives ~51 characters, which
   is inside the readable band, and the page stays at 91rem.
   Sizing the COLUMNS and letting the page fall out is what makes the cap on
   `.cell` exact: a cell can never be wider than one column's measure.
   These three are the shared vocabulary every layer builds its `cols` from, which
   is what makes a curated page measure like the tower instead of merely resemble
   it. */
.layer { --rail: 11rem; --maths: 19rem; --measure: 26rem; max-width: 91rem; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

/* ONE LEFT EDGE for everything on the page. The panels carry 1rem of inner
   padding, so row content starts 1rem inside the panel border; giving the header
   and the section headings the same padding puts every piece of text on the page —
   title, blurb, headings, card names — on a single vertical line.
   `calc(1rem + 1px)`, not `1rem`: the panel's own 1px border sits inside its box,
   so row content starts a pixel further right than page content would. Without the
   pixel every heading on the page is off by one against every card name. */
.intro { padding: 0 calc(1rem + 1px); margin-bottom: 1.5rem; }
.title-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: .5rem .7rem; }
.intro h2 { font-size: 1.3rem; font-weight: 700; margin: 0; line-height: 1.2; letter-spacing: -.01em; }
.bar-right { margin-left: auto; display: inline-flex; align-items: center; gap: .6rem; }
/* No max-width: the blurb runs the panel width. */
.lead { font-size: .84rem; line-height: 1.6; color: var(--text-muted); margin: .55rem 0 0; }

.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 300px; font-size: .8rem; line-height: 1.45; color: var(--text); }

.mode-toggle { font-size: .7rem; padding: .16rem .55rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-faint); cursor: pointer; }
.mode-toggle.on { background: var(--text); border-color: var(--text); color: var(--surface); }
</style>
