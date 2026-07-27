<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NPopover } from 'naive-ui'
import RichText from '../components/RichText.vue'
import OpenInSource from '../components/OpenInSource.vue'
import { ruleTree, rules, errorPatterns, skills } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type RuleDef, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect, inspectAvailable } from '../inspect'

// The DECODING lens, and the second curated page to get the presentation /
// inspection split (src/inspect.ts). A rule is the POSITIVE twin of an
// error: /errors says "here is the mistake, here is the fix", this page says
// "here is the reading rule that stops it happening". Both halves of that pairing
// are derived, never authored — rule → summarizes → card ← corrupts ←
// error — which is why neither layer references the other directly.
const t = (ls: LocalizedString) => loc(ls, lang.value)
const L = computed(() => lang.value === 'de'
  ? { reads: 'liest', prevents: 'verhindert' }
  : { reads: 'reads',  prevents: 'prevents' })

const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

const citedRules = new Set(skills.flatMap(s => s.rules))
const unused = computed(() => rules.filter(m => !citedRules.has(m.id)).length)

const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const toggle = (s: Set<string>, id: string) => (s.has(id) ? s.delete(id) : s.add(id))

function cardLink(id: string) {
  const e = cardIndex.get(id)
  return { id, name: e ? t(e.card.name) : id, layer: e?.layer.slug }
}

// The mirror of the /errors page's "read more" link, walked the other way: the
// mistakes this rule heads off. Capped, because `meta.dominant-op-last` reaches
// five and the error names are sentence-length.
const PREVENTS_LIMIT = 4
function preventedBy(m: RuleDef) {
  const cards = new Set(m.summarizes)
  return errorPatterns
    .filter(e => e.corrupts.some(c => cards.has(c)))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, PREVENTS_LIMIT)
    .map(e => ({ id: e.id, name: t(e.name) }))
}

const items = computed(() => rules.map(m => ({
  // `rule` is the SENTENCE (was `name`) and `note` its gloss (was `rule`) —
  // renamed 2026-07-27, because the headline always was the rule.
  id: m.id, kind: m.kind, rule: t(m.rule), note: t(m.note),
  cards: m.summarizes.map(cardLink),
  errors: preventedBy(m),
  unused: !citedRules.has(m.id), json: JSON.stringify(m, null, 2),
})))
</script>

<template>
  <div class="rulesv">
    <div class="layer-bar">
      <div class="bar-left">
        <h2 class="rulesv-title">{{ t(ruleTree.meta.title) }}</h2>
        <NPopover v-if="inspect" trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About the rules">i</button></template>
          <div class="pop"><RichText :text="t(ruleTree.meta.note)" /></div>
        </NPopover>
      </div>
      <div class="bar-right">
        <span v-if="inspect && unused" class="unused-chip" title="cited by no skill yet">{{ unused }} unused</span>
        <button v-if="inspectAvailable" class="mode-toggle" :class="{ on: inspect }" @click="inspect = !inspect">
          {{ inspect ? 'inspecting' : 'inspect' }}
        </button>
      </div>
    </div>
    <p class="role">{{ t(ruleTree.meta.blurb) }}</p>

    <!-- Flat: eleven rules need no sections. Same landscape row as /errors so the
         Curated group reads as one thing — name in the rail, the rule in the wide
         column, derived cross-links underneath. -->
    <div class="entries">
      <article
        v-for="m in items" :key="m.id" :id="m.id"
        class="entry" :class="{ unused: inspect && m.unused, targeted: m.id === targetId }"
      >
        <div class="rail">
          <div v-if="inspect" class="card-top">
            <span class="eyebrow">{{ m.kind }} · {{ m.id }}</span>
            <span class="top-right">
              <span v-if="m.unused" class="badge unused">unused</span>
              <OpenInSource :id="m.id" />
              <button class="disclose" @click="toggle(open, m.id)">{{ open.has(m.id) ? 'less' : 'details' }}</button>
            </span>
          </div>
          <h4 class="name">{{ m.rule }}</h4>
        </div>

        <p class="rule"><RichText :text="m.note" /></p>

        <div v-if="m.cards.length || m.errors.length" class="refs">
          <p v-if="m.cards.length" class="ref-line">
            <span class="ref-label">{{ L.reads }}</span>
            <RouterLink v-for="c in m.cards" :key="c.id" class="chip card" :to="`/${c.layer}#${c.id}`">{{ c.name }}</RouterLink>
          </p>
          <p v-if="m.errors.length" class="ref-line">
            <span class="ref-label">{{ L.prevents }}</span>
            <RouterLink v-for="e in m.errors" :key="e.id" class="chip" :to="`/errors#${e.id}`">{{ e.name }}</RouterLink>
          </p>
        </div>

        <div v-if="inspect && open.has(m.id)" class="details">
          <dl class="fields">
            <div class="field"><dt>id</dt><dd><code>{{ m.id }}</code></dd></div>
            <div v-if="m.cards.length" class="field">
              <dt>summarizes</dt>
              <dd><span v-for="c in m.cards" :key="c.id" class="chip">{{ c.id }} · {{ c.name }}</span></dd>
            </div>
          </dl>
          <button class="json-toggle" @click="toggle(jsonOpen, m.id)">{{ jsonOpen.has(m.id) ? 'hide json' : 'json' }}</button>
          <pre v-if="jsonOpen.has(m.id)" class="json">{{ m.json }}</pre>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.rulesv { max-width: 900px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

.layer-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: .35rem; }
.bar-left { display: flex; align-items: center; gap: .5rem; }
.bar-right { display: flex; align-items: center; gap: .6rem; }
.rulesv-title { font-size: 1.15rem; font-weight: 700; color: var(--text); margin: 0; }
.role { margin: 0 0 .5rem; font-size: .8rem; line-height: 1.45; color: var(--text-muted); max-width: 62ch; }
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 300px; font-size: .8rem; line-height: 1.45; color: var(--text); }
.mode-toggle { font-size: .7rem; padding: .16rem .55rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-faint); cursor: pointer; }
.mode-toggle.on { background: var(--text); border-color: var(--text); color: var(--surface); }
.unused-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }

.entries { display: grid; margin-top: 1rem; }
.entry { display: grid; grid-template-columns: 1fr; gap: .45rem 2rem; padding: .95rem 0; border-top: 1px solid var(--border); scroll-margin-top: 4.5rem; }
@media (min-width: 820px) {
  .entry { grid-template-columns: minmax(0, 17rem) minmax(0, 1fr); align-items: start; }
  .rail { grid-area: 1 / 1; }
  .rule { grid-area: 1 / 2; }
  .refs { grid-area: 2 / 1 / 3 / -1; }
}
.entry.targeted { background: var(--chip-bg); box-shadow: 0 0 0 .55rem var(--chip-bg); border-radius: 2px; }
.entry.unused .rail { border-left: 2px dashed var(--warn-border); padding-left: .6rem; margin-left: -.8rem; }

.rail { min-width: 0; }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .2rem; }
.eyebrow { flex: 1; min-width: 0; font-size: .6rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-right { display: flex; align-items: center; gap: .35rem; flex-shrink: 0; }
.name { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); line-height: 1.4; }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }

.rule { margin: 0; font-size: .85rem; line-height: 1.6; color: var(--text); }

.refs { margin: .1rem 0 0; display: grid; gap: .3rem; }
.ref-line { margin: 0; display: flex; align-items: baseline; flex-wrap: wrap; gap: .3rem; }
.ref-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin-right: .1rem; }
.chip { font-size: .7rem; padding: .12rem .5rem; max-width: 100%; background: var(--chip-bg); color: var(--text-muted); border: 1px solid transparent; border-radius: 999px; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
a.chip:hover { color: var(--accent); border-color: var(--accent); }
a.chip.card { color: var(--text); }

.details { grid-column: 1 / -1; margin-top: .3rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.badge.unused { font-size: .62rem; padding: .1rem .4rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: var(--text-muted); }
</style>
