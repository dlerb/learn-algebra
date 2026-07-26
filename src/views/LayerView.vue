<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NPopover } from 'naive-ui'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import WrongRight from '../components/WrongRight.vue'
import OpenInSource from '../components/OpenInSource.vue'
import { loc, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { layerById, cardIndex, CONCERN_TOKENS, type Card, type Group, type Section } from '../data/layers'

// Inspection page for ONE layer of the tower, selected by the `layerId` route
// prop (src/data/layers.ts is the manifest). One source file per layer
// (cards.json), one containment tree: layer → sections → groups → cards.
// `kind` is the section (preliminary/signature/convention/axiom/definition/
// theorem/remark); `concerns` is a per-card multi-tag (add/mul/eq/order/
// completeness). Two filter rows (kind, concerns) dim non-matching cards. Page
// order is array order, top to bottom. See docs/fundamentals.md.
//
// ONE card template, driven by field presence (2026-07-23). `kind` is a claim
// about knowledge, not about layout, so it no longer selects a template: a card
// shows a statement iff it has `latex`, a derivation iff it has `derivation`, and
// so on. Adding a kind therefore needs no change here. The single remaining
// layout variant is the signature tile, keyed on `symbol` — see isOpGroup.

const props = defineProps<{ layerId: string }>()

// Deep link from /errors: `/fundamentals#ax.distributivity` marks the card the
// mistake breaks. Driven off the route rather than the `:target` pseudo-class —
// `:target` does not update on a pushState navigation, which is all vue-router
// does, so a CSS-only highlight silently never fires.
const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

const layer = computed(() => layerById(props.layerId)!)
const meta = computed(() => layer.value.data.layer.meta)
const sections = computed<Section[]>(() => layer.value.data.sections)

const t = (ls: LocalizedString) => loc(ls, lang.value)

// Citations resolve tower-wide, not just inside this layer: naturals cards rest
// on fundamentals ids (th.negative-base → th.negative-one-times, ix.precedence).
const idLabel = (id: string) => {
  const x = cardIndex.get(id)
  return x ? `${id} · ${t(x.card.name)}` : id
}

// A single-group section shows its cards directly (no sub-heading); its group
// blurb, if any, is lifted onto the section. Multi-group sections show headings.
const sectionBlurb = (s: Section) => s.blurb ?? (s.groups.length === 1 ? s.groups[0].blurb : undefined)
const showGroupHeads = (s: Section) => s.groups.length > 1

// Signature cards (a glyph over a type) need wider, shorter tiles than statement
// cards. That is the ONE layout difference left, and it is chosen by whether the
// card carries a `symbol` — never by `kind`, which means epistemic role and must
// stay free to grow without the view knowing (`remark` was added without a change
// here). Everything else renders from field presence.
const isOpGroup = (g: Group) => g.cards.some(c => !!c.symbol)

// `forall` is the DOMAIN of the card's free variables, `cond` a RESTRICTION on
// them — kept apart because the generator needs both separately (the domain says
// where to sample, the condition what to filter). Their labels are the only
// prose the view owns, so they localize like everything else.
const L = computed(() => lang.value === 'de'
  ? { forall: 'für alle', cond: 'sofern' }
  : { forall: 'for all',  cond: 'provided' })

// Filters. Both sets start full (nothing dimmed). Toggling narrows. The kind
// row is per-layer (powers has no signature or axiom section), so it resets
// when the route swaps the layer under a reused component instance. Deduped:
// a layer may repeat a kind across sections (powers runs ℕ/ℤ/ℚ as three acts),
// and one chip must then govern all of them.
const kinds = computed(() => [...new Set(sections.value.map(s => s.kind))])
const concernTokens = CONCERN_TOKENS
const kindActive = ref(new Set<string>(kinds.value))
watch(kinds, k => (kindActive.value = new Set(k)))
const concernActive = ref(new Set<string>(concernTokens))
const toggleKind = (k: string) => (kindActive.value.has(k) ? kindActive.value.delete(k) : kindActive.value.add(k))
const toggleConcern = (c: string) => (concernActive.value.has(c) ? concernActive.value.delete(c) : concernActive.value.add(c))
const matched = (c: Card, kind: string) =>
  kindActive.value.has(kind) && (c.concerns ? c.concerns.some(x => concernActive.value.has(x)) : true)

// Per-card disclosure, keyed by id (unique).
const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const intuitionOpen = ref(new Set<string>())
const derivOpen = ref(new Set<string>())
const toggle = (s: Set<string>, id: string) => (s.has(id) ? s.delete(id) : s.add(id))
const json = (x: unknown) => JSON.stringify(x, null, 2)
</script>

<template>
  <div class="layer">
    <header class="intro">
      <div class="title-row">
        <h2>{{ layer.title }}</h2>
        <span class="tag field">≙ {{ t(meta.characterizes) }}</span>
      </div>
      <p class="lead"><RichText :text="t(meta.note)" /></p>

      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">kind</span>
          <button v-for="k in kinds" :key="k" class="fchip" :class="{ off: !kindActive.has(k) }" @click="toggleKind(k)">{{ k }}</button>
        </div>
        <div class="filter-row">
          <span class="filter-label">concerns</span>
          <button v-for="c in concernTokens" :key="c" class="fchip concern" :class="{ off: !concernActive.has(c) }" @click="toggleConcern(c)">{{ c }}</button>
        </div>
      </div>
    </header>

    <section v-for="s in sections" :key="s.slug" class="group">
      <div class="group-title">
        <h3>{{ t(s.title) }}</h3>
        <NPopover v-if="sectionBlurb(s)" trigger="click" placement="bottom-start">
          <template #trigger><button class="info" aria-label="About this section">i</button></template>
          <div class="pop"><RichText :text="t(sectionBlurb(s)!)" /></div>
        </NPopover>
      </div>
      <p v-if="s.note" class="section-note"><RichText :text="t(s.note)" /></p>

      <template v-for="g in s.groups" :key="g.slug">
        <div v-if="showGroupHeads(s)" class="subhead">
          <h4>{{ g.title ? t(g.title) : g.slug }}</h4>
          <NPopover v-if="g.blurb" trigger="click" placement="bottom-start">
            <template #trigger><button class="info" aria-label="About this group">i</button></template>
            <div class="pop"><RichText :text="t(g.blurb)" /></div>
          </NPopover>
        </div>

        <div :class="isOpGroup(g) ? 'ops' : 'cards'">
          <template v-for="c in g.cards" :key="c.id">
            <!-- Signature cards: a glyph over a type. Selected by `c.symbol`, not by
                 kind — a card carrying a symbol IS this shape, whatever it is called. -->
            <article v-if="c.symbol" :id="c.id" class="op" :class="{ dimmed: !matched(c, s.kind), targeted: c.id === targetId }">
              <div class="op-eyebrow">{{ c.id }}<OpenInSource :id="c.id" /></div>
              <div class="op-top">
                <span class="op-sym"><MathExpr :latex="c.symbol" /></span>
                <span class="op-type"><MathExpr :latex="c.type!" /></span>
              </div>
              <div class="op-name">{{ t(c.name) }}</div>
              <p v-if="c.note" class="op-note"><RichText :text="t(c.note)" /></p>
            </article>

            <!-- Every other card. Each part appears iff its field is present, so a
                 framing card is simply one that has a note and nothing else. -->
            <article v-else :id="c.id" class="card" :class="{ dimmed: !matched(c, s.kind), targeted: c.id === targetId }">
              <div class="card-top">
                <span class="eyebrow">{{ c.id }}</span>
                <OpenInSource :id="c.id" />
                <button class="disclose" @click="toggle(open, c.id)">{{ open.has(c.id) ? 'less' : 'details' }}</button>
              </div>
              <div class="card-head"><h4>{{ t(c.name) }}</h4></div>

              <div v-if="c.latex" class="statement"><MathExpr :latex="c.latex" display /></div>
              <!-- avoid/prefer is the `style` relation: the two forms are EQUAL,
                   one is just better written, so WrongRight joins them with `=`. -->
              <WrongRight v-else-if="c.avoid" :wrong="c.avoid" :right="c.prefer!" relation="style" />

              <div v-if="c.forall" class="forall">{{ L.forall }} <MathExpr :latex="c.forall" /></div>
              <div v-if="c.cond" class="forall">{{ L.cond }} <MathExpr :latex="c.cond" /></div>
              <p v-if="c.note" class="note"><RichText :text="t(c.note)" /></p>

              <div v-if="c.basedOn" class="basedon">
                <span class="basedon-label">rests on</span>
                <span v-for="r in c.basedOn" :key="r" class="chip">{{ idLabel(r) }}</span>
              </div>

              <button v-if="c.intuition" class="intuition-toggle" @click="toggle(intuitionOpen, c.id)">{{ intuitionOpen.has(c.id) ? '▾ intuition' : '▸ intuition' }}</button>
              <div v-if="c.intuition && intuitionOpen.has(c.id)" class="intuition"><RichText :text="t(c.intuition)" /></div>

              <button v-if="c.derivation" class="intuition-toggle" @click="toggle(derivOpen, c.id)">{{ derivOpen.has(c.id) ? '▾ derivation' : '▸ derivation' }}</button>
              <div v-if="c.derivation && derivOpen.has(c.id)" class="derivation">
                <MathExpr :latex="c.derivation" display />
                <div v-if="c.derivedFrom" class="basedon">
                  <span class="basedon-label">from</span>
                  <span v-for="r in c.derivedFrom" :key="r" class="chip">{{ idLabel(r) }}</span>
                </div>
              </div>

              <div v-if="open.has(c.id)" class="details">
                <dl class="fields">
                  <div class="field"><dt>id</dt><dd>{{ c.id }}</dd></div>
                  <div v-if="c.concerns" class="field"><dt>concerns</dt><dd>{{ c.concerns.join(', ') }}</dd></div>
                </dl>
                <button class="json-toggle" @click="toggle(jsonOpen, c.id)">{{ jsonOpen.has(c.id) ? 'hide json' : 'json' }}</button>
                <pre v-if="jsonOpen.has(c.id)" class="json">{{ json(c) }}</pre>
              </div>
            </article>
          </template>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.layer { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

.intro { margin-bottom: 1.4rem; }
.title-row { display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap; }
.intro h2 { font-size: 1.35rem; font-weight: 700; margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.tag { font-size: .66rem; text-transform: uppercase; letter-spacing: .05em; padding: .16rem .5rem; border-radius: 999px; }
.tag.field { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
.lead { font-size: .88rem; line-height: 1.55; color: var(--text-muted); margin: .5rem 0 0; max-width: 72ch; }

/* Filters */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 4.5rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: #fff; cursor: pointer; }
.fchip.concern { border-color: var(--border-strong); background: var(--text-muted); }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover { filter: brightness(1.08); }

.group-title { display: flex; align-items: center; gap: .4rem; margin: 1.6rem 0 .7rem; }
.group-title h3 { font-size: .95rem; font-weight: 700; color: var(--text); margin: 0; }
.section-note { font-size: .82rem; line-height: 1.55; color: var(--text-muted); margin: -.3rem 0 .8rem; max-width: 74ch; }
.subhead { display: flex; align-items: center; gap: .4rem; margin: 1rem 0 .55rem; }
.subhead h4 { font-size: .8rem; font-weight: 600; color: var(--text-muted); margin: 0; text-transform: uppercase; letter-spacing: .03em; }
.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 280px; font-size: .8rem; line-height: 1.45; color: var(--text); }

/* Signature cards */
.ops { display: grid; grid-template-columns: 1fr; gap: .7rem; align-items: start; }
@media (min-width: 560px) { .ops { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } }
.op { border: 1px solid var(--border); border-radius: var(--radius); padding: .75rem .85rem; background: var(--surface); }
.op-eyebrow { font-size: .6rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--text-faint); margin-bottom: .25rem; }
.op-top { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
.op-sym { font-size: 1.3rem; color: var(--text); }
.op-type { font-size: .78rem; color: var(--text-muted); }
.op-name { font-size: .85rem; font-weight: 600; margin-top: .25rem; }
.op-note { font-size: .78rem; line-height: 1.45; color: var(--text-muted); margin: .35rem 0 0; }

/* Statement cards */
.cards { display: grid; grid-template-columns: 1fr; gap: .7rem; }
@media (min-width: 560px) { .cards { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
.card { position: relative; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.3rem .9rem .8rem; background: var(--surface); }

/* Every card is an anchor: `/fundamentals#ax.distributivity`. The /errors page
   links a mistake to the exact card it breaks, so the ref has to LAND on that
   card — jumping to the top of the layer is what made those refs read as noise.
   `:target` says which one you arrived at; scroll-margin clears the app header. */
.op, .card { scroll-margin-top: 4.5rem; }
.op.targeted, .card.targeted { border-color: var(--accent); box-shadow: 0 0 0 3px var(--chip-bg); }
.card-top { position: absolute; top: .35rem; left: .9rem; right: .9rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.eyebrow { font-size: .62rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }
.statement { margin: .5rem 0 0; overflow-x: auto; }
.forall { font-size: .74rem; color: var(--text-muted); margin-top: .35rem; }
.note { font-size: .8rem; color: var(--text-muted); margin: .55rem 0 0; line-height: 1.5; }

.derivation { margin-top: .45rem; padding: .4rem .55rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; overflow-x: auto; }
.intuition-toggle { margin-top: .5rem; font-size: .72rem; color: var(--accent); background: none; border: none; cursor: pointer; padding: .1rem 0; display: block; }
.intuition-toggle:hover { text-decoration: underline; }
.intuition { margin-top: .45rem; padding: .5rem .6rem; background: var(--chip-bg); border-radius: 6px; font-size: .78rem; line-height: 1.5; color: var(--text); }

.basedon { display: flex; align-items: baseline; flex-wrap: wrap; gap: .35rem; margin-top: .55rem; }
.basedon-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.chip { font-size: .7rem; padding: .1rem .45rem; background: var(--chip-bg); color: var(--text-muted); border-radius: 999px; }

.details { margin-top: .65rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); }
.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: #374151; }

/* Filter dimming */
.dimmed { opacity: .2; transition: opacity .15s; }
</style>
