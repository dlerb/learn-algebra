<script setup lang="ts">
import { useRouter } from 'vue-router'
import { skills, mistakes, rules, sheets } from '../data'
import { layers, cardIndex } from '../data/layers'

// THE REFERENCE GRAPH as a clickable stack, and every arrow points DOWN.
//
// Redrawn 2026-07-28, when the curated side stopped being three flat lenses:
// rules is the POOL at the base of it, sheets and mistakes both sit on the pool,
// and skills sits on everything. The old picture had mistakes and rules as
// siblings, which stopped being true the moment an error cited a rule.
const router = useRouter()
const go = (path: string) => router.push(path)

const n = {
  cards: cardIndex.size,
  skills: skills.length,
  mistakes: mistakes.length,
  rules: rules.length,
  sheets: sheets.length,
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
        theorems, conventions). <strong>Rules</strong> are the student-facing sentences
        drawn from it; <strong>cheat sheets</strong> arrange them and <strong>mistakes</strong>
        cite the one each breaks; <strong>skills</strong> sit on top, drawing on all of it.
        Every arrow points down — nothing points up, so there are no cycles. Click a box to open it.
      </p>
    </div>

    <svg class="diagram" viewBox="0 0 820 560" role="img"
         aria-label="Reference graph: skills cite mistakes, rules and cards; mistakes cite rules and cards; cheat sheets cite rules; rules cite cards.">
      <defs>
        <marker id="ov-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" class="arrowhead" />
        </marker>
      </defs>

      <!-- edges, all pointing down the stack -->
      <line class="edge" x1="355" y1="80"  x2="255" y2="150" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="410" y1="80"  x2="410" y2="280" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="260" y1="210" x2="345" y2="280" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="555" y1="210" x2="480" y2="280" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="160" y1="210" x2="160" y2="400" marker-end="url(#ov-arrow)" />
      <line class="edge" x1="410" y1="340" x2="410" y2="400" marker-end="url(#ov-arrow)" />
      <!-- skills → cards is the one edge that cannot be drawn straight: it would
           run through the sheets box. Curved out past it on the right. -->
      <path class="edge" d="M 530 52 C 792 70, 792 330, 706 398" marker-end="url(#ov-arrow)" />

      <!-- edge labels: the actual field names -->
      <text class="edge-label" x="288" y="112" text-anchor="middle">mistakes</text>
      <text class="edge-label" x="420" y="196" text-anchor="start">rules</text>
      <text class="edge-label" x="292" y="262" text-anchor="middle">rules</text>
      <text class="edge-label" x="536" y="262" text-anchor="middle">rules</text>
      <text class="edge-label" x="150" y="312" text-anchor="end">corrupts</text>
      <text class="edge-label" x="420" y="374" text-anchor="start">summarizes</text>
      <text class="edge-label" x="786" y="214" text-anchor="end">restsOn</text>

      <!-- SKILLS -->
      <g class="node" tabindex="0" role="link" aria-label="Skills"
         @click="go('/skills')" @keyup.enter="go('/skills')">
        <title>Skills — curated strategies</title>
        <rect class="box" x="290" y="20" width="240" height="60" rx="10" />
        <text class="box-title" x="410" y="46" text-anchor="middle" font-size="18">Skills</text>
        <text class="box-sub" x="410" y="66" text-anchor="middle" font-size="11">{{ n.skills }} · strategies</text>
      </g>

      <!-- MISTAKES -->
      <g class="node" tabindex="0" role="link" aria-label="Common mistakes"
         @click="go('/mistakes')" @keyup.enter="go('/mistakes')">
        <title>Common mistakes — the tower's shadow</title>
        <rect class="box" x="110" y="150" width="200" height="60" rx="10" />
        <text class="box-title" x="210" y="176" text-anchor="middle" font-size="17">Mistakes</text>
        <text class="box-sub" x="210" y="196" text-anchor="middle" font-size="11">{{ n.mistakes }} · the shadow</text>
      </g>

      <!-- CHEAT SHEETS -->
      <g class="node" tabindex="0" role="link" aria-label="Cheat sheets"
         @click="go('/sheets')" @keyup.enter="go('/sheets')">
        <title>Cheat sheets — the rules, arranged for learning by heart</title>
        <rect class="box" x="480" y="150" width="200" height="60" rx="10" />
        <text class="box-title" x="580" y="176" text-anchor="middle" font-size="17">Cheat sheets</text>
        <text class="box-sub" x="580" y="196" text-anchor="middle" font-size="11">{{ n.sheets }} · arrangements</text>
      </g>

      <!-- RULES (the pool) -->
      <g class="node" tabindex="0" role="link" aria-label="All rules"
         @click="go('/rules')" @keyup.enter="go('/rules')">
        <title>All rules — the pool of DO and IS sentences</title>
        <rect class="box" x="290" y="280" width="240" height="60" rx="10" />
        <text class="box-title" x="410" y="306" text-anchor="middle" font-size="17">Rules</text>
        <text class="box-sub" x="410" y="326" text-anchor="middle" font-size="11">{{ n.rules }} · DO and IS</text>
      </g>

      <!-- FUNDAMENT (the floor) -->
      <g class="floor">
        <rect class="box floor-box" x="60" y="400" width="700" height="102" rx="12" />
        <text class="box-title" x="410" y="426" text-anchor="middle" font-size="15">
          Fundament — the tower · {{ n.cards }} cards
        </text>
        <g v-for="c in chips" :key="c.slug" class="chip-g" tabindex="0" role="link"
           :aria-label="c.title" @click="go('/' + c.slug)" @keyup.enter="go('/' + c.slug)">
          <rect class="chip" :x="c.x" y="446" width="150" height="42" rx="8" />
          <text class="chip-label" :x="c.x + 75" y="472" text-anchor="middle" font-size="12">{{ c.title }}</text>
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
