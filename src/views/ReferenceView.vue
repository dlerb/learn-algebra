<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopover } from 'naive-ui'
import RichText from '../components/RichText.vue'
import WrongRight from '../components/WrongRight.vue'
import { errorTree, skills, metaPatterns } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type ErrorDef, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect, inspectAvailable } from '../inspect'

// The student-facing mistakes page — and the author's error inspector, one body
// of content in two modes (src/inspect.ts). Presentation groups by TOPIC, which
// is how a student arrives ("I keep messing up fractions"); inspection keeps the
// same order but adds the plumbing. `kind` (anti-law / misreading / salience) is
// the author's causal taxonomy and cross-cuts topic, so it is a tag, not a level.
const t = (ls: LocalizedString) => loc(ls, lang.value)

const citedErrs = new Set(skills.flatMap(s => s.errors))
const unused = computed(() => errorTree.errors.filter(e => !citedErrs.has(e.id)).length)

const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const toggle = (s: Set<string>, id: string) => (s.has(id) ? s.delete(id) : s.add(id))

// The rule an error breaks, as the card's NAME — `ax.distributivity` is a code the
// author reads, "Distributivity" is what a student can follow into the tower.
function cardLink(id: string) {
  const e = cardIndex.get(id)
  return { id, name: e ? t(e.card.name) : id, layer: e?.layer.slug }
}

// Two hops, no authoring: error → `corrupts` (cards) → the meta-patterns that
// summarize those cards. The error is the disease, the meta-pattern is the
// positive rule that stops it firing — the most useful link on the page.
//
// Capped at two. The hop is generous (`mis.exponent-scope` reaches four), and the
// names are sentence-length, so an uncapped list ran three grey lines and became
// the loudest thing on an entry — louder than the mistake it hangs off.
const META_LIMIT = 2
function metasFor(e: ErrorDef) {
  const cards = new Set(e.corrupts)
  return metaPatterns.filter(m => m.summarizes.some(c => cards.has(c))).slice(0, META_LIMIT)
}

interface ErrVM {
  id: string; kind: string; name: string; note: string; frequency: number
  instances: ErrorDef['instances']
  rules: ReturnType<typeof cardLink>[]
  metas: { id: string; name: string }[]
  unused: boolean; json: string
}
function errVM(e: ErrorDef): ErrVM {
  return {
    id: e.id, kind: e.kind, name: t(e.name), note: t(e.note), frequency: e.frequency,
    instances: e.instances,
    rules: e.corrupts.map(cardLink),
    metas: metasFor(e).map(m => ({ id: m.id, name: t(m.name) })),
    unused: !citedErrs.has(e.id), json: JSON.stringify(e, null, 2),
  }
}

// Within a topic, the most-often-made mistake comes first (frequency = the ★
// rating carried over from docs/common_mistakes.md).
const sections = computed(() => errorTree.sections.map(s => ({
  slug: s.slug, title: t(s.title), blurb: s.blurb ? t(s.blurb) : '',
  items: [...s.errors].sort((a, b) => b.frequency - a.frequency).map(errVM),
})))
</script>

<template>
  <div class="refv">
    <div class="layer-bar">
      <div class="bar-left">
        <h2 class="refv-title">{{ t(errorTree.meta.title) }}</h2>
        <NPopover v-if="inspect" trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About errors">i</button></template>
          <div class="pop"><RichText :text="t(errorTree.meta.note)" /></div>
        </NPopover>
      </div>
      <div class="bar-right">
        <span v-if="inspect && unused" class="unused-chip" title="not drawn on by any skill yet">{{ unused }} unused</span>
        <button v-if="inspectAvailable" class="mode-toggle" :class="{ on: inspect }" @click="inspect = !inspect">
          {{ inspect ? 'inspecting' : 'inspect' }}
        </button>
      </div>
    </div>
    <p class="role">{{ t(errorTree.meta.blurb) }}</p>

    <section v-for="s in sections" :key="s.slug" class="group">
      <div class="group-title"><h3>{{ s.title }}</h3></div>
      <p v-if="s.blurb" class="group-blurb">{{ s.blurb }}</p>
      <!-- Landscape rows, not a mosaic of boxes: the content is math that does not
           reflow, so narrow columns broke the pairs and made 25 bordered cards
           compete with each other. Name and prose sit in a left rail, the ✗/✓ table
           gets the width, and a hairline does the separating a border used to. -->
      <div class="entries">
        <article v-for="e in s.items" :key="e.id" class="entry" :class="{ unused: inspect && e.unused }">
          <div class="rail">
            <div v-if="inspect" class="card-top">
              <span class="eyebrow">{{ e.kind }} · {{ e.id }}</span>
              <span class="top-right">
                <span v-if="e.unused" class="badge unused">unused</span>
                <button class="disclose" @click="toggle(open, e.id)">{{ open.has(e.id) ? 'less' : 'details' }}</button>
              </span>
            </div>
            <h4 class="name">
              {{ e.name }}
              <span class="freq" :title="`${e.frequency} of 3 — how often the sources flag it`">{{ '★'.repeat(e.frequency) }}</span>
            </h4>
            <p class="body"><RichText :text="e.note" /></p>
          </div>

          <!-- The pairs ARE the content: a student arrives recognising a shape,
               not reading a definition. One shared grid so stem / ✗ / ✓ line up
               as columns across every instance on the card. -->
          <div class="wr-rows">
            <WrongRight
              v-for="(x, i) in e.instances" :key="i"
              :from="x.from" :wrong="x.wrong" :right="x.right"
              :hint="x.hint ? t(x.hint) : undefined"
            />
          </div>

          <!-- Its own grid cell, not part of the rail: on a phone the entry
               collapses to one column in DOM order, and the pairs must reach the
               reader before the links do. -->
          <p v-if="e.rules.length || e.metas.length" class="links">
            <template v-for="(r, i) in e.rules" :key="r.id">
              <span v-if="i" class="sep">·</span>
              <RouterLink class="lnk rule" :to="`/${r.layer}`">{{ r.name }}</RouterLink>
            </template>
            <template v-for="m in e.metas" :key="m.id">
              <span class="sep">·</span>
              <RouterLink class="lnk" to="/metapatterns">{{ m.name }}</RouterLink>
            </template>
          </p>

          <div v-if="inspect && open.has(e.id)" class="details">
            <dl class="fields">
              <div class="field"><dt>kind</dt><dd>{{ e.kind }}</dd></div>
              <div class="field"><dt>id</dt><dd><code>{{ e.id }}</code></dd></div>
              <div class="field"><dt>frequency</dt><dd>{{ e.frequency }}</dd></div>
              <div v-if="e.rules.length" class="field">
                <dt>corrupts</dt>
                <dd><span v-for="r in e.rules" :key="r.id" class="chip">{{ r.id }} · {{ r.name }}</span></dd>
              </div>
            </dl>
            <button class="json-toggle" @click="toggle(jsonOpen, e.id)">{{ jsonOpen.has(e.id) ? 'hide json' : 'json' }}</button>
            <pre v-if="jsonOpen.has(e.id)" class="json">{{ e.json }}</pre>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.refv { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

.layer-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: .35rem; }
.refv-title { font-size: 1.15rem; font-weight: 700; color: var(--text); margin: 0; }
.role { margin: 0 0 .5rem; font-size: .8rem; line-height: 1.45; color: var(--text-muted); max-width: 60ch; }
.bar-left { display: flex; align-items: center; gap: .5rem; }
.bar-right { display: flex; align-items: center; gap: .6rem; }
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 300px; font-size: .8rem; line-height: 1.45; color: var(--text); }
.mode-toggle { font-size: .7rem; padding: .16rem .55rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-faint); cursor: pointer; }
.mode-toggle.on { background: var(--text); border-color: var(--text); color: #fff; }
.unused-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }

.group-title { display: flex; align-items: center; gap: .4rem; margin: 2.2rem 0 .3rem; }
.group-title h3 { font-size: .95rem; font-weight: 700; color: var(--text); margin: 0; }
.group-blurb { margin: 0 0 .3rem; font-size: .8rem; line-height: 1.5; color: var(--text-muted); max-width: 68ch; }

/* One landscape row per mistake, separated by a hairline. */
.entries { display: grid; }
.entry { display: grid; grid-template-columns: 1fr; gap: .45rem 2rem; padding: .95rem 0; border-top: 1px solid var(--border); }
@media (min-width: 820px) {
  .entry { grid-template-columns: minmax(0, 21rem) minmax(0, 1fr); align-items: start; }
  .rail { grid-area: 1 / 1; }
  .links { grid-area: 2 / 1; }
  .wr-rows { grid-area: 1 / 2 / span 2 / 3; }
}
.entry.unused .rail { border-left: 2px dashed var(--warn-border); padding-left: .6rem; margin-left: -.8rem; }

.rail { min-width: 0; }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .2rem; }
.eyebrow { flex: 1; min-width: 0; font-size: .6rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-right { display: flex; align-items: center; gap: .35rem; flex-shrink: 0; }
.name { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); line-height: 1.4; }
.freq { font-size: .62rem; color: var(--text-faint); letter-spacing: .08em; margin-left: .3rem; white-space: nowrap; }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }

.body { font-size: .8rem; color: var(--text-muted); margin: .3rem 0 0; line-height: 1.5; }

/* One line, no labels: the rule comes first and is weighted, the meta-patterns
   trail it. Labelled two-line link blocks were louder than the mistakes. */
.links { margin: .35rem 0 0; font-size: .72rem; line-height: 1.6; color: var(--text-faint); }
.lnk { color: var(--text-faint); text-decoration: none; border-bottom: 1px solid var(--border); }
.lnk.rule { color: var(--text-muted); }
.lnk:hover { color: var(--accent); border-color: var(--accent); }
.sep { margin: 0 .3rem; color: var(--border-strong); }

/* The shared grid WrongRight fills: stem | ✗ wrong | ✓ right as real columns,
   so several instances on one card line up instead of scattering. */
.wr-rows { display: grid; grid-template-columns: auto auto minmax(0, 1fr); column-gap: 1.1rem; row-gap: .35rem; align-items: baseline; min-width: 0; }

.details { grid-column: 1 / -1; margin-top: .3rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.chip { font-size: .7rem; padding: .1rem .45rem; background: var(--chip-bg); color: var(--text-muted); border-radius: 999px; }

.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: #374151; }

.badge.unused { font-size: .62rem; padding: .1rem .4rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
</style>
