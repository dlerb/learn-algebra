<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NPopover } from 'naive-ui'
import RichText from '../components/RichText.vue'
import WrongRight from '../components/WrongRight.vue'
import OpenInSource from '../components/OpenInSource.vue'
import ProseEditor from '../components/ProseEditor.vue'
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

// The only prose this view owns, so it localizes like everything else.
const L = computed(() => lang.value === 'de'
  ? { breaks: 'verletzt', read: 'dazu' }
  : { breaks: 'breaks',   read: 'read' })

// Deep link from /metapatterns, where each rule lists the mistakes it prevents.
const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

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
  id: string; kind: string; name: string; fix: string; note: string; frequency: number
  instances: ErrorDef['instances']
  rules: ReturnType<typeof cardLink>[]
  metas: { id: string; name: string }[]
  unused: boolean; json: string
}
function errVM(e: ErrorDef): ErrVM {
  return {
    id: e.id, kind: e.kind, name: t(e.name), fix: t(e.fix), note: t(e.note), frequency: e.frequency,
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
        <article
          v-for="e in s.items" :key="e.id" :id="e.id"
          class="entry" :class="{ unused: inspect && e.unused, targeted: e.id === targetId }"
        >
          <div class="rail">
            <div v-if="inspect" class="card-top">
              <span class="eyebrow">{{ e.kind }} · {{ e.id }}</span>
              <span class="top-right">
                <span v-if="e.unused" class="badge unused">unused</span>
                <OpenInSource :id="e.id" />
                <button class="disclose" @click="toggle(open, e.id)">{{ open.has(e.id) ? 'less' : 'details' }}</button>
              </span>
            </div>
            <h4 class="name">
              {{ e.name }}
              <span class="freq" :title="`${e.frequency} of 3 — how often the sources flag it`">{{ '★'.repeat(e.frequency) }}</span>
            </h4>
            <!-- `fix` is the entry's prose for a student: how to get it right.
                 `note` is the diagnosis, written for a teacher — inspection only. -->
            <p class="fix"><RichText :text="e.fix" /></p>
            <p v-if="inspect" class="body"><RichText :text="e.note" /></p>
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
               reader before the links do.

               CHIPS, not a run of grey text. These are pointers into the tower and
               they read as noise unless they look like pointers — so they borrow
               the `rests on` vocabulary LayerView already uses for exactly this
               (small-caps label + pills), and each one deep-links to the card it
               names rather than dumping you at the top of a layer. -->
          <div v-if="e.rules.length || e.metas.length" class="refs">
            <p v-if="e.rules.length" class="ref-line">
              <span class="ref-label">{{ L.breaks }}</span>
              <RouterLink v-for="r in e.rules" :key="r.id" class="chip rule" :to="`/${r.layer}#${r.id}`">{{ r.name }}</RouterLink>
            </p>
            <p v-if="e.metas.length" class="ref-line">
              <span class="ref-label">{{ L.read }}</span>
              <RouterLink v-for="m in e.metas" :key="m.id" class="chip" :to="`/metapatterns#${m.id}`">{{ m.name }}</RouterLink>
            </p>
          </div>

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

          <ProseEditor v-if="inspect" :id="e.id" />
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* UNVERIFIED (2026-07-25) — the one-line attempt at "the pairs drift right on a
   wide screen". The rail is a fixed 21rem and the pairs start right after it, but
   the hairline ran the full 1100px, so past ~1200px viewport each entry showed a
   wide empty gutter to the right of the ✓ column and the pairs read as adrift.
   Narrowing the container ends the rule near where the content ends. If it still
   drifts, the next thing to try is `minmax(0, max-content)` on the pairs column. */
.refv { max-width: 900px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

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
.entry { display: grid; grid-template-columns: 1fr; gap: .45rem 2rem; padding: .95rem 0; border-top: 1px solid var(--border); scroll-margin-top: 4.5rem; }
.entry.targeted { background: var(--chip-bg); box-shadow: 0 0 0 .55rem var(--chip-bg); border-radius: 2px; }
@media (min-width: 820px) {
  .entry { grid-template-columns: minmax(0, 21rem) minmax(0, 1fr); align-items: start; }
  .rail { grid-area: 1 / 1; }
  .wr-rows { grid-area: 1 / 2; }
  /* Full entry width, not squeezed into the rail: chip names are sentence-long
     and inside 21rem they wrapped INSIDE the pill, which a 999px radius turns
     into a lozenge. Across the full width they sit on one line each. */
  .refs { grid-area: 2 / 1 / 3 / -1; }
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

.fix { font-size: .82rem; color: var(--text); margin: .3rem 0 0; line-height: 1.55; }
.body { font-size: .78rem; color: var(--text-faint); margin: .35rem 0 0; line-height: 1.5; font-style: italic; }

/* Pointers into the tower, dressed as pointers — the same small-caps label +
   pill pattern LayerView uses for `rests on`. As bare grey text they read as
   more prose and the eye slid off them. */
.refs { margin: .5rem 0 0; display: grid; gap: .3rem; }
.ref-line { margin: 0; display: flex; align-items: baseline; flex-wrap: wrap; gap: .3rem; }
.ref-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin-right: .1rem; }
.chip { font-size: .7rem; padding: .12rem .5rem; max-width: 100%; background: var(--chip-bg); color: var(--text-muted); border: 1px solid transparent; border-radius: 999px; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
a.chip:hover { color: var(--accent); border-color: var(--accent); }
.chip.rule { color: var(--text); }

/* The shared grid WrongRight fills: stem | ✗ wrong | ✓ right as real columns,
   so several instances on one card line up instead of scattering.
   `justify-content: start` keeps the tracks at content width — with an `fr`
   track the ✓ column absorbed the free space and the pairs drifted rightward on
   a wide screen instead of sitting at a fixed place. The track MINIMUMS then give
   the page one geometry: most stems and wrong forms fit inside them, so ✗ and ✓
   land at the same x on entry after entry rather than shuffling per card. */
.wr-rows { display: grid; grid-template-columns: minmax(4.5rem, auto) minmax(7rem, auto) auto; justify-content: start; column-gap: 1.1rem; row-gap: .35rem; align-items: baseline; min-width: 0; }

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
