<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopover } from 'naive-ui'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import { loc, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import data from '../data/fundament0/axioms.json'
import convData from '../data/fundament0/conventions.json'

// Isolated inspection page for the fundament0 slab (src/data/fundament0/
// axioms.json): the definition of a field over ℝ. Deliberately plain — a few
// cards introducing the operations + , · and the congruence =, then the axioms
// as cards under four group headings (equality / addition / multiplication /
// bridge). No further classification. Reads its own JSON, not the wired `laws`.

interface Operation { code: string; symbol: string; type: string; name: LocalizedString; note: LocalizedString }
interface InfixItem { id: string; code: string; name: LocalizedString; latex: string; note?: LocalizedString }
interface Infix { title: LocalizedString; blurb: LocalizedString; items: InfixItem[] }
interface Group { slug: string; title: LocalizedString; blurb: LocalizedString }
interface Axiom {
  id: string; code: string; group: string
  name: LocalizedString; latex: string; forall?: string; note?: LocalizedString; intuition?: LocalizedString
}
interface ConvItem {
  id: string; code: string; group: string
  name: LocalizedString; latex: string; cond?: string; basedOn?: string[]; note?: LocalizedString
}

const meta = data.meta as unknown as { characterizes: LocalizedString; note: LocalizedString }
const operations = data.operations as unknown as Operation[]
const infix = data.infix as unknown as Infix
const groups = data.groups as unknown as Group[]
const axioms = data.axioms as unknown as Axiom[]

const convMeta = convData.meta as unknown as { note: LocalizedString }
const convGroups = convData.groups as unknown as Group[]
const convItems = convData.items as unknown as ConvItem[]

const t = (ls: LocalizedString) => loc(ls, lang.value)

// Resolve a basedOn axiom code to "ax.A4 · Inverse element of addition".
const axLabel = (code: string) => {
  const a = axioms.find(x => x.code === code)
  return a ? `${code} · ${t(a.name)}` : code
}

const sections = computed(() =>
  groups.map(g => ({
    slug: g.slug,
    title: t(g.title),
    blurb: t(g.blurb),
    items: axioms.filter(a => a.group === g.slug),
  })).filter(s => s.items.length > 0),
)

const convSections = computed(() =>
  convGroups.map(g => ({
    slug: g.slug,
    title: t(g.title),
    blurb: t(g.blurb),
    items: convItems.filter(i => i.group === g.slug),
  })).filter(s => s.items.length > 0),
)

// Per-card disclosure (id/code/group + raw JSON), matching Fundamentals.
const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const intuitionOpen = ref(new Set<string>())
const toggle = (id: string) => (open.value.has(id) ? open.value.delete(id) : open.value.add(id))
const toggleJson = (id: string) => (jsonOpen.value.has(id) ? jsonOpen.value.delete(id) : jsonOpen.value.add(id))
const toggleIntuition = (id: string) => (intuitionOpen.value.has(id) ? intuitionOpen.value.delete(id) : intuitionOpen.value.add(id))
const json = (x: unknown) => JSON.stringify(x, null, 2)
</script>

<template>
  <div class="f0">
    <header class="intro">
      <div class="title-row">
        <h2>fundament0</h2>
        <span class="tag field">≙ {{ t(meta.characterizes) }}</span>
      </div>
      <p class="lead"><RichText :text="t(meta.note)" /></p>
    </header>

    <!-- OPERATIONS: the data of the structure -->
    <section>
      <div class="group-title"><h3>Operations &amp; relation</h3></div>
      <div class="ops">
        <article v-for="op in operations" :key="op.symbol" class="op">
          <div class="op-eyebrow">{{ op.code }}</div>
          <div class="op-top">
            <span class="op-sym"><MathExpr :latex="op.symbol" /></span>
            <span class="op-type"><MathExpr :latex="op.type" /></span>
          </div>
          <div class="op-name">{{ t(op.name) }}</div>
          <p class="op-note"><RichText :text="t(op.note)" /></p>
        </article>
      </div>
    </section>

    <!-- INFIX: parsing rules, needed before the axioms -->
    <section class="group">
      <div class="group-title">
        <h3>{{ t(infix.title) }}</h3>
        <NPopover trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About the infix convention">i</button></template>
          <div class="pop"><RichText :text="t(infix.blurb)" /></div>
        </NPopover>
      </div>
      <div class="cards">
        <article v-for="it in infix.items" :key="it.id" class="card">
          <div class="card-top">
            <span class="eyebrow">{{ it.code }}</span>
            <button class="disclose" @click="toggle(it.id)">{{ open.has(it.id) ? 'less' : 'details' }}</button>
          </div>
          <div class="card-head"><h4>{{ t(it.name) }}</h4></div>
          <div class="statement"><MathExpr :latex="it.latex" display /></div>
          <p v-if="it.note" class="note"><RichText :text="t(it.note)" /></p>
          <div v-if="open.has(it.id)" class="details">
            <dl class="fields">
              <div class="field"><dt>id</dt><dd><code>{{ it.id }}</code></dd></div>
              <div class="field"><dt>code</dt><dd>{{ it.code }}</dd></div>
            </dl>
            <button class="json-toggle" @click="toggleJson(it.id)">{{ jsonOpen.has(it.id) ? 'hide json' : 'json' }}</button>
            <pre v-if="jsonOpen.has(it.id)" class="json">{{ json(it) }}</pre>
          </div>
        </article>
      </div>
    </section>

    <!-- AXIOMS: grouped -->
    <section v-for="s in sections" :key="s.slug" class="group">
      <div class="group-title">
        <h3>{{ s.title }}</h3>
        <NPopover trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this group">i</button></template>
          <div class="pop">{{ s.blurb }}</div>
        </NPopover>
      </div>
      <div class="cards">
        <article v-for="a in s.items" :key="a.id" class="card">
          <div class="card-top">
            <span class="eyebrow">{{ a.code }}</span>
            <button class="disclose" @click="toggle(a.id)">{{ open.has(a.id) ? 'less' : 'details' }}</button>
          </div>
          <div class="card-head"><h4>{{ t(a.name) }}</h4></div>
          <div class="statement"><MathExpr :latex="a.latex" display /></div>
          <div v-if="a.forall" class="forall">for all <MathExpr :latex="a.forall" /></div>
          <p v-if="a.note" class="note"><RichText :text="t(a.note)" /></p>
          <button v-if="a.intuition" class="intuition-toggle" @click="toggleIntuition(a.id)">{{ intuitionOpen.has(a.id) ? '▾ intuition' : '▸ intuition' }}</button>
          <div v-if="a.intuition && intuitionOpen.has(a.id)" class="intuition"><RichText :text="t(a.intuition)" /></div>
          <div v-if="open.has(a.id)" class="details">
            <dl class="fields">
              <div class="field"><dt>id</dt><dd><code>{{ a.id }}</code></dd></div>
              <div class="field"><dt>code</dt><dd>{{ a.code }}</dd></div>
              <div class="field"><dt>group</dt><dd>{{ a.group }}</dd></div>
            </dl>
            <button class="json-toggle" @click="toggleJson(a.id)">{{ jsonOpen.has(a.id) ? 'hide json' : 'json' }}</button>
            <pre v-if="jsonOpen.has(a.id)" class="json">{{ json(a) }}</pre>
          </div>
        </article>
      </div>
    </section>

    <!-- BUILT ON TOP: definitions & notation (not axioms) -->
    <div class="divider">
      <h3>Built on top: definitions</h3>
      <p><RichText :text="t(convMeta.note)" /></p>
    </div>

    <section v-for="s in convSections" :key="s.slug" class="group">
      <div class="group-title">
        <h3>{{ s.title }}</h3>
        <NPopover trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this group">i</button></template>
          <div class="pop">{{ s.blurb }}</div>
        </NPopover>
      </div>
      <div class="cards">
        <article v-for="it in s.items" :key="it.id" class="card">
          <div class="card-top">
            <span class="eyebrow">{{ it.code }}</span>
            <button class="disclose" @click="toggle(it.id)">{{ open.has(it.id) ? 'less' : 'details' }}</button>
          </div>
          <div class="card-head"><h4>{{ t(it.name) }}</h4></div>
          <div class="statement"><MathExpr :latex="it.latex" display /></div>
          <div v-if="it.cond" class="forall">for <MathExpr :latex="it.cond" /></div>
          <p v-if="it.note" class="note"><RichText :text="t(it.note)" /></p>
          <div v-if="it.basedOn" class="basedon">
            <span class="basedon-label">rests on</span>
            <span v-for="c in it.basedOn" :key="c" class="chip">{{ axLabel(c) }}</span>
          </div>
          <div v-if="open.has(it.id)" class="details">
            <dl class="fields">
              <div class="field"><dt>id</dt><dd><code>{{ it.id }}</code></dd></div>
              <div class="field"><dt>code</dt><dd>{{ it.code }}</dd></div>
              <div class="field"><dt>group</dt><dd>{{ it.group }}</dd></div>
              <div v-if="it.basedOn" class="field"><dt>basedOn</dt><dd>{{ it.basedOn.join(', ') }}</dd></div>
            </dl>
            <button class="json-toggle" @click="toggleJson(it.id)">{{ jsonOpen.has(it.id) ? 'hide json' : 'json' }}</button>
            <pre v-if="jsonOpen.has(it.id)" class="json">{{ json(it) }}</pre>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.f0 { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

.intro { margin-bottom: 1.4rem; }
.title-row { display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap; }
.intro h2 { font-size: 1.35rem; font-weight: 700; margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.tag { font-size: .66rem; text-transform: uppercase; letter-spacing: .05em; padding: .16rem .5rem; border-radius: 999px; }
.tag.field { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
.lead { font-size: .88rem; line-height: 1.55; color: var(--text-muted); margin: .5rem 0 0; max-width: 72ch; }

.group-title { display: flex; align-items: center; gap: .4rem; margin: 1.6rem 0 .7rem; }
.group-title h3 { font-size: .95rem; font-weight: 700; color: var(--text); margin: 0; }
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 280px; font-size: .8rem; line-height: 1.45; color: var(--text); }

/* Operations */
.ops { display: grid; grid-template-columns: 1fr; gap: .7rem; align-items: start; }
@media (min-width: 560px) { .ops { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } }
.op { border: 1px solid var(--border); border-radius: var(--radius); padding: .75rem .85rem; background: var(--surface); }
.op-eyebrow { font-size: .6rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--text-faint); margin-bottom: .25rem; }
.op-top { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
.op-sym { font-size: 1.3rem; color: var(--text); }
.op-type { font-size: .78rem; color: var(--text-muted); }
.op-name { font-size: .85rem; font-weight: 600; margin-top: .25rem; }
.op-note { font-size: .78rem; line-height: 1.45; color: var(--text-muted); margin: .35rem 0 0; }


/* Axiom cards */
.cards { display: grid; grid-template-columns: 1fr; gap: .7rem; }
@media (min-width: 560px) { .cards { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
.card { position: relative; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.3rem .9rem .8rem; background: var(--surface); }
.card-top { position: absolute; top: .35rem; left: .9rem; right: .9rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.eyebrow { font-size: .62rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }
.statement { margin: .5rem 0 0; overflow-x: auto; }
.forall { font-size: .74rem; color: var(--text-muted); margin-top: .35rem; }
.note { font-size: .8rem; color: var(--text-muted); margin: .55rem 0 0; line-height: 1.5; }

/* Per-axiom intuition — collapsed by default, informal (recognition, not proof) */
.intuition-toggle { margin-top: .5rem; font-size: .72rem; color: var(--accent); background: none; border: none; cursor: pointer; padding: .1rem 0; }
.intuition-toggle:hover { text-decoration: underline; }
.intuition { margin-top: .45rem; padding: .5rem .6rem; background: var(--chip-bg); border-radius: 6px; font-size: .78rem; line-height: 1.5; color: var(--text); }

/* Divider before the built-on-top layer */
.divider { margin: 2.4rem 0 .3rem; padding-top: 1.1rem; border-top: 2px solid var(--border-strong); }
.divider h3 { font-size: 1.05rem; font-weight: 700; margin: 0 0 .3rem; color: var(--text); }
.divider p { font-size: .82rem; line-height: 1.55; color: var(--text-muted); margin: 0; max-width: 74ch; }

/* basedOn chips on definition cards */
.basedon { display: flex; align-items: baseline; flex-wrap: wrap; gap: .35rem; margin-top: .55rem; }
.basedon-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.chip { font-size: .7rem; padding: .1rem .45rem; background: var(--chip-bg); color: var(--text-muted); border-radius: 999px; }

.details { margin-top: .65rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: #374151; }
</style>
