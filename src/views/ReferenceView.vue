<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopover } from 'naive-ui'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import { laws, lawGroups, lawKinds, conventions, conventionGroups, errorPatterns, layers, skills } from '../data'
import { loc, type LawDef, type ConventionDef, type ErrorDef, type LawGroup, type ConventionGroup } from '../data/skill.schema'
import { lang } from '../lang'

// Reference rendering of the fundament (laws + conventions) and its shadow
// (errors). Cards rest quiet — name + primary content — and reveal the rest
// (ids, codes, links, notes, raw JSON) behind a per-card `details` toggle.
const layerNames = new Map(
  [...laws, ...conventions, ...errorPatterns].map(x => [x.id, x] as const),
)
function label(id: string): string {
  const x = layerNames.get(id)
  return x ? `${x.code} · ${loc(x.name, lang.value)}` : id
}

// Coverage: which fundamentals no skill draws on yet (mirrors auditCoverage;
// axioms excluded — reached transitively via cited theorems).
const citedLaws = new Set(skills.flatMap(s => s.justifiedBy))
const citedConvs = new Set(skills.flatMap(s => s.governedBy))
const citedErrs = new Set(skills.flatMap(s => s.errors))
const lawUnused = (l: LawDef) => l.kind !== 'axiom' && !citedLaws.has(l.id)

// One layer visible at a time. Errors aren't fundamentals — they are the
// fundament's shadow (each `corrupts` a law or convention) — but live here as a
// third segment. The unused chip is contextual to the active layer.
const layer = ref<'laws' | 'conventions' | 'errors'>('laws')
const unusedByLayer = {
  laws: laws.filter(lawUnused).length,
  conventions: conventions.filter(c => !citedConvs.has(c.id)).length,
  errors: errorPatterns.filter(e => !citedErrs.has(e.id)).length,
}
const activeUnused = computed(() => unusedByLayer[layer.value])

// One-line description of each layer (data: layers.json), surfaced on tap via
// the ⓘ dot next to the switch.
const activeBlurb = computed(() => layers.find(l => l.slug === layer.value)?.blurb)

// Per-card disclosure state (the extra fields, and the raw JSON within them).
const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const toggle = (id: string) => (open.value.has(id) ? open.value.delete(id) : open.value.add(id))
const toggleJson = (id: string) => (jsonOpen.value.has(id) ? jsonOpen.value.delete(id) : jsonOpen.value.add(id))

interface LawVM {
  id: string; code: string; kind: string; name: string; latex: string; group: LawGroup
  conditions?: string; links: string[]; linkField: string; note?: string; unused: boolean; json: string
}
function lawVM(l: LawDef): LawVM {
  return {
    id: l.id, code: l.code, kind: l.kind, name: loc(l.name, lang.value), latex: l.latex, group: l.group,
    conditions: l.conditions,
    links: (l.kind === 'definition' ? l.basedOn : l.derivedFrom).map(label),
    linkField: l.kind === 'definition' ? 'basedOn' : 'derivedFrom',
    note: l.note ? loc(l.note, lang.value) : undefined,
    unused: lawUnused(l), json: JSON.stringify(l, null, 2),
  }
}

// Laws sectioned by `kind` (place in the tower) or by `group` (classroom topic).
const groupBy = ref<'kind' | 'topic'>('kind')
interface LawSection { title: string; blurb?: string; items: LawVM[] }
const lawKindSections = computed<LawSection[]>(() =>
  lawKinds
    .map(k => ({ title: k.title, blurb: k.blurb, items: laws.filter(l => l.kind === k.slug).map(lawVM) }))
    .filter(s => s.items.length > 0),
)
const lawTopicSections = computed<LawSection[]>(() =>
  lawGroups
    .map(t => ({ title: t.title, blurb: t.blurb, items: laws.filter(l => l.group === (t.slug as LawGroup)).map(lawVM) }))
    .filter(s => s.items.length > 0),
)
const lawSections = computed(() => (groupBy.value === 'kind' ? lawKindSections.value : lawTopicSections.value))

interface ConvVM { id: string; code: string; group: ConventionGroup; name: string; text: string; unused: boolean; json: string }
function convVM(c: ConventionDef): ConvVM {
  return {
    id: c.id, code: c.code, group: c.group, name: loc(c.name, lang.value),
    text: loc(c.text, lang.value), unused: !citedConvs.has(c.id), json: JSON.stringify(c, null, 2),
  }
}
const conventionSections = computed(() =>
  conventionGroups
    .map(g => ({
      title: g.title, blurb: g.blurb,
      items: conventions.filter(c => c.group === (g.slug as ConventionGroup)).map(convVM),
    }))
    .filter(s => s.items.length > 0),
)

interface ErrVM {
  id: string; code: string; kind: string; name: string; text: string
  corrupts: string[]; instances: string[]; unused: boolean; json: string
}
function errVM(e: ErrorDef): ErrVM {
  return {
    id: e.id, code: e.code, kind: e.kind, name: loc(e.name, lang.value), text: loc(e.text, lang.value),
    corrupts: e.corrupts.map(label), instances: e.instances, unused: !citedErrs.has(e.id), json: JSON.stringify(e, null, 2),
  }
}
const errorSections = computed(() => [
  { title: 'False laws — the generative rules of wrong algebra', items: errorPatterns.filter(e => e.kind === 'anti-law').map(errVM) },
  { title: 'Misreadings — parsing the notation wrong', items: errorPatterns.filter(e => e.kind === 'misreading').map(errVM) },
])
</script>

<template>
  <div class="refv">
    <div class="layer-bar">
      <div class="bar-left">
        <div class="mode layers">
          <button :class="{ active: layer === 'laws' }" @click="layer = 'laws'">Laws</button>
          <button :class="{ active: layer === 'conventions' }" @click="layer = 'conventions'">Conventions</button>
          <button :class="{ active: layer === 'errors' }" @click="layer = 'errors'">Errors</button>
        </div>
        <NPopover trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this layer">i</button></template>
          <div class="pop">{{ activeBlurb }}</div>
        </NPopover>
      </div>
      <div class="bar-right">
        <span v-if="activeUnused" class="unused-chip" title="not drawn on by any skill yet">{{ activeUnused }} unused</span>
        <div v-if="layer === 'laws'" class="mode">
          <button :class="{ active: groupBy === 'kind' }" @click="groupBy = 'kind'">by kind</button>
          <button :class="{ active: groupBy === 'topic' }" @click="groupBy = 'topic'">by group</button>
        </div>
      </div>
    </div>

    <!-- LAWS -->
    <template v-if="layer === 'laws'">
      <div v-for="s in lawSections" :key="s.title" class="group">
        <div class="group-title">
          <h3>{{ s.title }}</h3>
          <NPopover v-if="s.blurb" trigger="click" placement="bottom-start">
            <template #trigger><button class="info" aria-label="About this group">i</button></template>
            <div class="pop">{{ s.blurb }}</div>
          </NPopover>
        </div>
        <div class="cards">
          <article v-for="l in s.items" :key="l.id" class="card" :class="{ unused: l.unused }">
            <div class="card-top">
              <span class="eyebrow">{{ l.kind }} · {{ l.group }}</span>
              <span class="top-right">
                <span v-if="l.unused" class="badge unused">unused</span>
                <button class="disclose" @click="toggle(l.id)">{{ open.has(l.id) ? 'less' : 'details' }}</button>
              </span>
            </div>
            <div class="card-head"><h4>{{ l.name }}</h4></div>
            <div class="statement"><MathExpr :latex="l.latex" display /></div>
            <div v-if="open.has(l.id)" class="details">
              <dl class="fields">
                <div class="field"><dt>kind</dt><dd>{{ l.kind }}</dd></div>
                <div class="field"><dt>id</dt><dd><code>{{ l.id }}</code></dd></div>
                <div class="field"><dt>code</dt><dd>{{ l.code }}</dd></div>
                <div class="field"><dt>group</dt><dd>{{ l.group }}</dd></div>
                <div v-if="l.conditions" class="field"><dt>conditions</dt><dd><MathExpr :latex="l.conditions" /></dd></div>
                <div v-if="l.links.length" class="field">
                  <dt>{{ l.linkField }}</dt>
                  <dd><span v-for="(x, i) in l.links" :key="i" class="chip">{{ x }}</span></dd>
                </div>
                <div v-if="l.note" class="field"><dt>note</dt><dd><RichText :text="l.note" /></dd></div>
              </dl>
              <button class="json-toggle" @click="toggleJson(l.id)">{{ jsonOpen.has(l.id) ? 'hide json' : 'json' }}</button>
              <pre v-if="jsonOpen.has(l.id)" class="json">{{ l.json }}</pre>
            </div>
          </article>
        </div>
      </div>
    </template>

    <!-- CONVENTIONS -->
    <template v-else-if="layer === 'conventions'">
      <div v-for="s in conventionSections" :key="s.title" class="group">
        <div class="group-title">
          <h3>{{ s.title }}</h3>
          <NPopover v-if="s.blurb" trigger="click" placement="bottom-start">
            <template #trigger><button class="info" aria-label="About this group">i</button></template>
            <div class="pop">{{ s.blurb }}</div>
          </NPopover>
        </div>
        <div class="cards">
          <article v-for="c in s.items" :key="c.id" class="card" :class="{ unused: c.unused }">
            <div class="card-top">
              <span class="eyebrow">· {{ c.group }}</span>
              <span class="top-right">
                <span v-if="c.unused" class="badge unused">unused</span>
                <button class="disclose" @click="toggle(c.id)">{{ open.has(c.id) ? 'less' : 'details' }}</button>
              </span>
            </div>
            <div class="card-head"><h4>{{ c.name }}</h4></div>
            <p class="body"><RichText :text="c.text" /></p>
            <div v-if="open.has(c.id)" class="details">
              <dl class="fields">
                <div class="field"><dt>id</dt><dd><code>{{ c.id }}</code></dd></div>
                <div class="field"><dt>code</dt><dd>{{ c.code }}</dd></div>
                <div class="field"><dt>group</dt><dd>{{ c.group }}</dd></div>
              </dl>
              <button class="json-toggle" @click="toggleJson(c.id)">{{ jsonOpen.has(c.id) ? 'hide json' : 'json' }}</button>
              <pre v-if="jsonOpen.has(c.id)" class="json">{{ c.json }}</pre>
            </div>
          </article>
        </div>
      </div>
    </template>

    <!-- ERRORS -->
    <template v-else>
      <div v-for="s in errorSections" :key="s.title" class="group">
        <div class="group-title"><h3>{{ s.title }}</h3></div>
        <div class="cards">
          <article v-for="e in s.items" :key="e.id" class="card" :class="{ unused: e.unused }">
            <div class="card-top">
              <span class="eyebrow">{{ e.kind }} ·</span>
              <span class="top-right">
                <span v-if="e.unused" class="badge unused">unused</span>
                <button class="disclose" @click="toggle(e.id)">{{ open.has(e.id) ? 'less' : 'details' }}</button>
              </span>
            </div>
            <div class="card-head"><h4>{{ e.name }}</h4></div>
            <p class="body"><RichText :text="e.text" /></p>
            <div v-if="open.has(e.id)" class="details">
              <dl class="fields">
                <div class="field"><dt>kind</dt><dd>{{ e.kind }}</dd></div>
                <div class="field"><dt>id</dt><dd><code>{{ e.id }}</code></dd></div>
                <div class="field"><dt>code</dt><dd>{{ e.code }}</dd></div>
                <div v-if="e.corrupts.length" class="field">
                  <dt>corrupts</dt>
                  <dd><span v-for="(x, i) in e.corrupts" :key="i" class="chip">{{ x }}</span></dd>
                </div>
                <div v-if="e.instances.length" class="field">
                  <dt>instances</dt>
                  <dd class="instances"><span v-for="(x, i) in e.instances" :key="i" class="wrong"><MathExpr :latex="x" /></span></dd>
                </div>
              </dl>
              <button class="json-toggle" @click="toggleJson(e.id)">{{ jsonOpen.has(e.id) ? 'hide json' : 'json' }}</button>
              <pre v-if="jsonOpen.has(e.id)" class="json">{{ e.json }}</pre>
            </div>
          </article>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.refv { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

/* Top bar: layer switch · contextual unused chip · (laws-only) grouping toggle */
.layer-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: .75rem; }
.bar-left { display: flex; align-items: center; gap: .5rem; }
.bar-right { display: flex; align-items: center; gap: .6rem; }
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 260px; font-size: .8rem; line-height: 1.45; color: var(--text); }
.mode { display: flex; gap: .4rem; }
.mode button { font-size: .78rem; padding: .25rem .7rem; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--surface); color: var(--text-muted); cursor: pointer; }
.mode button.active { background: var(--text); border-color: var(--text); color: #fff; }
.mode.layers button { font-size: .88rem; font-weight: 600; padding: .3rem .95rem; }
.unused-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
.group-title { display: flex; align-items: center; gap: .4rem; margin: 1.5rem 0 .6rem; }
.group-title h3 { font-size: .95rem; font-weight: 700; color: var(--text); margin: 0; }
.cards { display: grid; grid-template-columns: 1fr; gap: .7rem; }
@media (min-width: 560px) { .cards { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }

/* Card: quiet at rest — name + primary content only */
.card { position: relative; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.3rem .9rem .8rem; background: var(--surface); }
.card.unused { border-style: dashed; border-color: var(--warn-border); }
.card-top { position: absolute; top: .35rem; left: .9rem; right: .9rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.eyebrow { flex: 1; min-width: 0; font-size: .6rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-right { display: flex; align-items: center; gap: .35rem; flex-shrink: 0; }
.card-head { display: flex; align-items: baseline; gap: .5rem; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }

.statement { margin: .5rem 0 0; overflow-x: auto; }
.body { font-size: .84rem; color: var(--text); margin: .5rem 0 0; line-height: 1.45; }

/* Disclosed detail — labeled with the field name so it reads unambiguously */
.details { margin-top: .65rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.chip { font-size: .7rem; padding: .1rem .45rem; background: var(--chip-bg); color: var(--text-muted); border-radius: 999px; }
.field dd.instances { flex-direction: column; align-items: flex-start; gap: .35rem; }
.wrong { border-left: 2px solid var(--bad); padding-left: .4rem; color: var(--text); }

.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: #374151; }

.badge.unused { font-size: .62rem; padding: .1rem .4rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
</style>
