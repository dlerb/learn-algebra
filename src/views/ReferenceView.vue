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
function metasFor(e: ErrorDef) {
  const cards = new Set(e.corrupts)
  return metaPatterns.filter(m => m.summarizes.some(c => cards.has(c)))
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
      <div class="cards">
        <article v-for="e in s.items" :key="e.id" class="card" :class="{ unused: inspect && e.unused }">
          <div v-if="inspect" class="card-top">
            <span class="eyebrow">{{ e.kind }} · {{ e.id }}</span>
            <span class="top-right">
              <span v-if="e.unused" class="badge unused">unused</span>
              <button class="disclose" @click="toggle(open, e.id)">{{ open.has(e.id) ? 'less' : 'details' }}</button>
            </span>
          </div>

          <div class="card-head">
            <h4>{{ e.name }}</h4>
            <span class="freq" :title="`${e.frequency} of 3 — how often the sources flag it`">{{ '★'.repeat(e.frequency) }}</span>
          </div>

          <!-- The pairs ARE the content: a student arrives recognising a shape,
               not reading a definition, so they lead and the prose follows. -->
          <WrongRight
            v-for="(x, i) in e.instances" :key="i"
            :from="x.from" :wrong="x.wrong" :right="x.right"
            :hint="x.hint ? t(x.hint) : undefined"
          />

          <p class="body"><RichText :text="e.note" /></p>

          <div v-if="e.rules.length || e.metas.length" class="links">
            <p v-if="e.rules.length" class="link-line">
              <span class="link-label">The rule this breaks:</span>
              <template v-for="(r, i) in e.rules" :key="r.id">
                <span v-if="i" class="sep">·</span>
                <RouterLink class="lnk" :to="`/${r.layer}`">{{ r.name }}</RouterLink>
              </template>
            </p>
            <p v-for="m in e.metas" :key="m.id" class="link-line">
              <span class="link-label">Read more:</span>
              <RouterLink class="lnk" to="/metapatterns">{{ m.name }}</RouterLink>
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

.group-title { display: flex; align-items: center; gap: .4rem; margin: 1.8rem 0 .3rem; }
.group-title h3 { font-size: .95rem; font-weight: 700; color: var(--text); margin: 0; }
.group-blurb { margin: 0 0 .7rem; font-size: .8rem; line-height: 1.5; color: var(--text-muted); max-width: 68ch; }
.cards { display: grid; grid-template-columns: 1fr; gap: .7rem; }
@media (min-width: 700px) { .cards { grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); } }

.card { position: relative; border: 1px solid var(--border); border-radius: var(--radius); padding: .8rem .9rem .8rem; background: var(--surface); }
.card.unused { border-style: dashed; border-color: var(--warn-border); }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .3rem; }
.eyebrow { flex: 1; min-width: 0; font-size: .6rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-right { display: flex; align-items: center; gap: .35rem; flex-shrink: 0; }
.card-head { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); }
.freq { font-size: .68rem; color: var(--text-faint); letter-spacing: .06em; flex-shrink: 0; }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }

.body { font-size: .82rem; color: var(--text-muted); margin: .7rem 0 0; line-height: 1.5; }

.links { margin-top: .6rem; display: grid; gap: .15rem; }
.link-line { margin: 0; font-size: .74rem; line-height: 1.5; color: var(--text-faint); }
.link-label { margin-right: .35rem; }
.lnk { color: var(--text-muted); text-decoration: none; border-bottom: 1px solid var(--border-strong); }
.lnk:hover { color: var(--accent); border-color: var(--accent); }
.sep { margin: 0 .3rem; color: var(--text-faint); }

.details { margin-top: .65rem; border-top: 1px solid var(--border); padding-top: .55rem; }
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
