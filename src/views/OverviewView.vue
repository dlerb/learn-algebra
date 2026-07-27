<script setup lang="ts">
import { useRouter } from 'vue-router'
import { skills, errorPatterns, rules } from '../data'
import { layers, cardIndex } from '../data/layers'

// The reference graph as a clickable stack. Everything points DOWN into the tower:
// skills (top) cite cards + errors + rules; errors and rules are
// sibling lenses that cite cards only. Each box navigates to that section.
const router = useRouter()
const go = (path: string) => router.push(path)

const n = {
  cards: cardIndex.size,
  skills: skills.length,
  errors: errorPatterns.length,
  rules: rules.length,
}
// the four tower layers, laid out as the floor
const chips = layers.map((l, i) => ({ slug: l.slug, title: l.title, x: 80 + i * 166 }))
</script>

<template>
  <div class="overview">
    <div class="head">
      <h2>The model</h2>
      <p>
        Everything rests on <strong>the tower</strong> (the cards — axioms, definitions,
        theorems, conventions). <strong>Errors</strong> and <strong>rules</strong>
        are two lenses over it; <strong>skills</strong> sit on top, drawing on all three.
        Every arrow points down — nothing points up, so there are no cycles. Click a box to open it.
      </p>
    </div>

    <svg class="diagram" viewBox="0 0 820 545" role="img"
         aria-label="Reference graph: skills cite cards, errors and rules; errors and rules cite cards.">
      <defs>
        <marker id="ov-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" class="arrowhead" />
        </marker>
      </defs>

      <!-- edges (all point down into the tower) -->
      <line class="edge" x1="352" y1="88"  x2="228" y2="224" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="468" y1="88"  x2="592" y2="224" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="410" y1="88"  x2="410" y2="420" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="190" y1="292" x2="266" y2="420" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="630" y1="292" x2="554" y2="420" marker-end="url(#ov-arrow)" />

      <!-- edge labels (the actual field names) -->
      <text class="edge-label" x="262" y="150" text-anchor="middle">errors</text>
      <text class="edge-label" x="560" y="150" text-anchor="middle">rules</text>
      <text class="edge-label" x="448" y="250" text-anchor="start">restsOn</text>
      <text class="edge-label" x="196" y="364" text-anchor="middle">corrupts</text>
      <text class="edge-label" x="626" y="364" text-anchor="middle">summarizes</text>

      <!-- SKILLS -->
      <g class="node" tabindex="0" role="link" aria-label="Skills"
         @click="go('/skills')" @keyup.enter="go('/skills')">
        <title>Skills — curated strategies</title>
        <rect class="box" x="290" y="24" width="240" height="64" rx="10" />
        <text class="box-title" x="410" y="52" text-anchor="middle" font-size="18">Skills</text>
        <text class="box-sub" x="410" y="72" text-anchor="middle" font-size="11">{{ n.skills }} · strategies</text>
      </g>

      <!-- ERRORS -->
      <g class="node" tabindex="0" role="link" aria-label="Errors"
         @click="go('/errors')" @keyup.enter="go('/errors')">
        <title>Errors — the tower's shadow</title>
        <rect class="box" x="70" y="228" width="230" height="64" rx="10" />
        <text class="box-title" x="185" y="256" text-anchor="middle" font-size="17">Errors</text>
        <text class="box-sub" x="185" y="276" text-anchor="middle" font-size="11">{{ n.errors }} · the shadow</text>
      </g>

      <!-- METAPATTERNS -->
      <g class="node" tabindex="0" role="link" aria-label="Rules"
         @click="go('/rules')" @keyup.enter="go('/rules')">
        <title>Rules — the DO and IS sentences</title>
        <rect class="box" x="520" y="228" width="230" height="64" rx="10" />
        <text class="box-title" x="635" y="256" text-anchor="middle" font-size="17">Rules</text>
        <text class="box-sub" x="635" y="276" text-anchor="middle" font-size="11">{{ n.rules }} · DO and IS</text>
      </g>

      <!-- FUNDAMENT (the floor) -->
      <g class="floor">
        <rect class="box floor-box" x="60" y="420" width="700" height="102" rx="12" />
        <text class="box-title" x="410" y="446" text-anchor="middle" font-size="15">
          Fundament — the tower · {{ n.cards }} cards
        </text>
        <g v-for="c in chips" :key="c.slug" class="chip-g" tabindex="0" role="link"
           :aria-label="c.title" @click="go('/' + c.slug)" @keyup.enter="go('/' + c.slug)">
          <rect class="chip" :x="c.x" y="466" width="150" height="42" rx="8" />
          <text class="chip-label" :x="c.x + 75" y="492" text-anchor="middle" font-size="12">{{ c.title }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.overview { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: var(--text); }
.head h2 { font-size: 1.3rem; font-weight: 700; margin: 0 0 .5rem; }
.head p { font-size: .9rem; color: var(--text-muted); margin: 0 0 1.75rem; max-width: 66ch; line-height: 1.55; }
.head strong { font-weight: 600; color: var(--text); }

.diagram { width: 100%; height: auto; display: block; }

.node, .chip-g { cursor: pointer; }
.node:focus-visible, .chip-g:focus-visible { outline: none; }

.box { fill: var(--surface); stroke: var(--border-strong); stroke-width: 1.5; transition: stroke .12s; }
.floor-box { fill: var(--chip-bg); }
.node:hover .box, .node:focus-visible .box { stroke: var(--accent); stroke-width: 2; }

.box-title { fill: var(--text); font-weight: 700; }
.node:hover .box-title, .node:focus-visible .box-title { fill: var(--accent); }
.box-sub { fill: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

.chip { fill: var(--surface); stroke: var(--border-strong); stroke-width: 1; transition: stroke .12s; }
.chip-g:hover .chip, .chip-g:focus-visible .chip { stroke: var(--accent); stroke-width: 1.5; }
.chip-label { fill: var(--text); }
.chip-g:hover .chip-label, .chip-g:focus-visible .chip-label { fill: var(--accent); }

.edge { stroke: var(--text-faint); stroke-width: 1.5; fill: none; }
.arrowhead { fill: var(--text-faint); }
.edge-label { fill: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
</style>
