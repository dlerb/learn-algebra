<script setup lang="ts">
// THROWAWAY LAYOUT PROTOTYPE — /proto, 2026-07-26. Delete or promote; do not
// build on it.
//
// One row anatomy, tried on the cards that stress it hardest rather than on the
// tidy ones: a faint header strip for the unimportant and the outbound links,
// the NAME in a left rail carrying the weight, then in the body the maths, then
// the intuition, then the note truncated with an expander.
//
// Real data, real KaTeX, real tokens — the point is to judge it, and a mockup
// with lorem ipsum and fake formulas would answer a different question.

import { computed, ref } from 'vue'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import { cardIndex } from '../data/layers'
import { loc, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'

const t = (ls: LocalizedString) => loc(ls, lang.value)

// Chosen to break the layout if it is going to break: the longest note in the
// tower, a card with intuition AND a long derivation, a signature card whose
// formal object is a glyph rather than a statement, a prose-only preliminary
// with no maths at all, and a short one that should not look empty.
const SAMPLE = [
  'ax.distributivity',   // latex + forall + intuition + long note + basedOn
  'th.inverse-of-product', // theorem: derivation, derivedFrom, 900-char note
  'op.add',              // signature: symbol + type, no statement
  'pre.compound',        // no latex at all — the note IS the card
  'ax.zero-not-one',     // short, minimal
]

const NOTE_CUT = 180

/** Truncate on a word boundary WITHOUT splitting an inline `$…$` span — cutting
 *  inside one would hand KaTeX an unterminated expression and render an error box
 *  in the middle of the page. Walks the string, tracks whether it is inside math,
 *  and only ever cuts outside. */
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
  const note = c.note ? t(c.note) : ''
  const cut = truncateProse(note, NOTE_CUT)
  return {
    id,
    kind: e.kind,
    concerns: c.concerns ?? [],
    name: t(c.name),
    symbol: c.symbol, type: c.type,
    latex: c.latex, forall: c.forall, cond: c.cond,
    intuition: c.intuition ? t(c.intuition) : '',
    note, noteHead: cut.head, clipped: cut.clipped,
    refs: [...(c.basedOn ?? []), ...(c.derivedFrom ?? [])]
      .map(r => ({ id: r, name: cardIndex.get(r) ? t(cardIndex.get(r)!.card.name) : r })),
    derivation: c.derivation,
  }
}))

const openNote = ref(new Set<string>())
const toggleNote = (id: string) => (openNote.value.has(id) ? openNote.value.delete(id) : openNote.value.add(id))

const L = computed(() => lang.value === 'de'
  ? { forall: 'für alle', cond: 'sofern', more: 'weiterlesen', less: 'weniger', rests: 'stützt sich auf' }
  : { forall: 'for all', cond: 'provided', more: 'read on', less: 'less', rests: 'rests on' })
</script>

<template>
  <div class="proto">
    <header class="intro">
      <h2>Row layout prototype</h2>
      <p class="lead">
        Five cards chosen to stress the anatomy: the longest note in the tower, a theorem with
        a derivation, a signature glyph, a prose-only preliminary, and a minimal one.
        Language switch in the header applies. <code>/proto</code> — throwaway.
      </p>
      <p class="lead"><button class="langbtn" @click="lang = lang === 'de' ? 'en' : 'de'">lang: {{ lang }}</button></p>
    </header>

    <div class="rows">
      <article v-for="r in rows" :key="r.id" class="row">
        <!-- HEADER STRIP: the unimportant and the outbound. Faint, small, one
             line, and the first thing the eye is meant to skip. -->
        <div class="strip">
          <span class="tag">{{ r.kind }}</span>
          <span v-for="c in r.concerns" :key="c" class="tag faint">{{ c }}</span>
          <span class="strip-refs" v-if="r.refs.length">
            <span class="strip-label">{{ L.rests }}</span>
            <a v-for="x in r.refs" :key="x.id" class="chip" :href="`#${x.id}`">{{ x.name }}</a>
          </span>
          <code class="strip-id">{{ r.id }}</code>
        </div>

        <!-- RAIL: the name, carrying the weight. -->
        <h3 class="name">{{ r.name }}</h3>

        <!-- BODY: maths, then intuition, then the note. -->
        <div class="body">
          <div v-if="r.symbol" class="sig">
            <span class="sig-sym"><MathExpr :latex="r.symbol" /></span>
            <span class="sig-type"><MathExpr :latex="r.type!" /></span>
          </div>
          <div v-if="r.latex" class="maths"><MathExpr :latex="r.latex" display /></div>
          <div v-if="r.forall || r.cond" class="quant">
            <span v-if="r.forall">{{ L.forall }} <MathExpr :latex="r.forall" /></span>
            <span v-if="r.cond">{{ L.cond }} <MathExpr :latex="r.cond" /></span>
          </div>

          <p v-if="r.intuition" class="intuition"><RichText :text="r.intuition" /></p>

          <p v-if="r.note" class="note">
            <RichText :text="openNote.has(r.id) || !r.clipped ? r.note : r.noteHead" /><template
              v-if="r.clipped && !openNote.has(r.id)">… </template>
            <button v-if="r.clipped" class="more" @click="toggleNote(r.id)">
              {{ openNote.has(r.id) ? L.less : L.more }}
            </button>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.proto { max-width: 900px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }
.intro h2 { font-size: 1.15rem; font-weight: 700; margin: 0 0 .3rem; }
.lead { margin: 0 0 .5rem; font-size: .8rem; line-height: 1.5; color: var(--text-muted); max-width: 62ch; }
.langbtn { font-size: .7rem; padding: .1rem .5rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-muted); cursor: pointer; }

.rows { margin-top: 1.4rem; }

/* One hairline per row, no boxes: 101 bordered cards would be 404 borders
   competing, one rule per row is a rhythm. */
.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: .1rem 2rem;
  padding: 1.15rem 0 1.25rem;
  border-top: 1px solid var(--border);
  scroll-margin-top: 4.5rem;
}
@media (min-width: 820px) {
  /* Rail and body. The strip spans both so its hairline-adjacent line runs the
     full measure; the rail STACKS below this width rather than shrinking, which
     is the rule a 17rem gutter beside body text on a phone would break. */
  .row { grid-template-columns: minmax(0, 15rem) minmax(0, 1fr); }
  .strip { grid-area: 1 / 1 / 2 / -1; }
  .name  { grid-area: 2 / 1; }
  .body  { grid-area: 2 / 2; }
}

/* --- the header strip ---------------------------------------------------- */
.strip {
  display: flex; align-items: baseline; flex-wrap: wrap; gap: .3rem .45rem;
  margin-bottom: .55rem;
  font-size: .62rem; line-height: 1.4;
}
.tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: .03em; color: var(--text-muted);
}
.tag.faint { color: var(--text-faint); }
.strip-refs { display: inline-flex; align-items: baseline; flex-wrap: wrap; gap: .3rem; min-width: 0; }
.strip-label { color: var(--text-faint); font-style: italic; }
/* NOT pills. As pills these were the loudest thing on the row — second only to
   the name — which is the opposite of what a strip for "not so important" is for.
   Plain text, separated by middots, at the strip's own faint size: still links,
   no longer furniture. Truncation is gone too; a chip reading "Associativity of
   multiplica…" looks broken rather than brief. */
.chip { color: var(--text-muted); text-decoration: none; white-space: nowrap; }
.chip:not(:last-child)::after { content: ' ·'; color: var(--text-faint); }
.chip:hover { color: var(--accent); text-decoration: underline; }
.strip-id {
  margin-left: auto; padding-left: .6rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--text-faint);
}

/* --- the rail ------------------------------------------------------------ */
.name {
  margin: 0; font-size: 1rem; font-weight: 650; line-height: 1.3;
  color: var(--text); text-wrap: balance;
}

/* --- the body ----------------------------------------------------------- */
.body { min-width: 0; }
.sig { display: flex; align-items: baseline; gap: .8rem; }
.sig-sym { font-size: 1.4rem; }
.sig-type { font-size: .82rem; color: var(--text-muted); }

/* The one high-contrast object on a quiet page: give it air, do not box it.
   KaTeX centres display mode by default, which floats the formula in the middle
   of the body and breaks the vertical line the rail and body edges make — the
   thing that makes the page read as composed. Force it left. */
.maths { margin: .1rem 0 .35rem; overflow-x: auto; }
.maths :deep(.katex-display) { margin: 0; text-align: left; }
.maths :deep(.katex-display > .katex) { text-align: left; }
.quant { display: flex; flex-wrap: wrap; gap: .1rem 1.1rem; font-size: .76rem; color: var(--text-muted); margin-bottom: .2rem; }

.intuition {
  margin: .55rem 0 0; font-size: .84rem; line-height: 1.6;
  color: var(--text); max-width: 66ch;
}
.note {
  margin: .5rem 0 0; font-size: .8rem; line-height: 1.6;
  color: var(--text-muted); max-width: 68ch;
}
.more {
  border: none; background: none; padding: 0; cursor: pointer;
  font: inherit; font-size: .76rem; color: var(--accent); white-space: nowrap;
}
.more:hover { text-decoration: underline; }
</style>
