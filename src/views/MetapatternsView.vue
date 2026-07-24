<script setup lang="ts">
import { computed, ref } from 'vue'
import RichText from '../components/RichText.vue'
import { metaPatterns, skills } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type MetaPatternDef } from '../data/skill.schema'
import { lang } from '../lang'

// The DECODING lens. A metapattern is a reading heuristic — how to parse the
// notation into structure. Like errors, it is curation that points DOWN into the
// tower: since the 2026-07-24 cleanup each `summarizes` a card code only (never
// an error), so the curated layers form a clean stack. This page renders them as
// a flat list; a card code resolves to its name via cardIndex.
function label(id: string): string {
  const card = cardIndex.get(id)
  return card ? `${id} · ${loc(card.card.name, lang.value)}` : id
}

const citedMetas = new Set(skills.flatMap(s => s.metaPatterns))
const unused = computed(() => metaPatterns.filter(m => !citedMetas.has(m.id)).length)

const open = ref(new Set<string>())
const jsonOpen = ref(new Set<string>())
const toggle = (id: string) => (open.value.has(id) ? open.value.delete(id) : open.value.add(id))
const toggleJson = (id: string) => (jsonOpen.value.has(id) ? jsonOpen.value.delete(id) : jsonOpen.value.add(id))

interface MetaVM {
  id: string; name: string; rule: string
  summarizes: string[]; unused: boolean; json: string
}
function metaVM(m: MetaPatternDef): MetaVM {
  return {
    id: m.id, name: loc(m.name, lang.value), rule: loc(m.rule, lang.value),
    summarizes: m.summarizes.map(label), unused: !citedMetas.has(m.id), json: JSON.stringify(m, null, 2),
  }
}
const items = computed(() => metaPatterns.map(metaVM))
</script>

<template>
  <div class="metav">
    <div class="layer-bar">
      <div class="bar-left">
        <h2 class="metav-title">Metapatterns</h2>
      </div>
      <div class="bar-right">
        <span v-if="unused" class="unused-chip" title="cited by no skill yet">{{ unused }} unused</span>
      </div>
    </div>
    <p class="role">How to read the notation — each <strong>summarizes</strong> the cards it decodes.</p>

    <div class="cards">
      <article v-for="m in items" :key="m.id" class="card" :class="{ unused: m.unused }">
        <div class="card-top">
          <span class="eyebrow">metapattern</span>
          <span class="top-right">
            <span v-if="m.unused" class="badge unused">unused</span>
            <button class="disclose" @click="toggle(m.id)">{{ open.has(m.id) ? 'less' : 'details' }}</button>
          </span>
        </div>
        <div class="card-head"><h4>{{ m.name }}</h4></div>
        <p class="body"><RichText :text="m.rule" /></p>
        <div v-if="open.has(m.id)" class="details">
          <dl class="fields">
            <div class="field"><dt>id</dt><dd><code>{{ m.id }}</code></dd></div>
            <div v-if="m.summarizes.length" class="field">
              <dt>summarizes</dt>
              <dd><span v-for="(x, i) in m.summarizes" :key="i" class="chip">{{ x }}</span></dd>
            </div>
          </dl>
          <button class="json-toggle" @click="toggleJson(m.id)">{{ jsonOpen.has(m.id) ? 'hide json' : 'json' }}</button>
          <pre v-if="jsonOpen.has(m.id)" class="json">{{ m.json }}</pre>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.metav { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1rem 4rem; color: var(--text); }

.layer-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: .35rem; }
.bar-left { display: flex; align-items: center; gap: .5rem; }
.bar-right { display: flex; align-items: center; gap: .6rem; }
.metav-title { font-size: 1.15rem; font-weight: 700; color: var(--text); margin: 0; }
.role { margin: 0 0 .5rem; font-size: .8rem; line-height: 1.45; color: var(--text-muted); max-width: 60ch; }
.role strong { font-weight: 600; color: var(--text); }
.unused-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }

.cards { display: grid; grid-template-columns: 1fr; gap: .7rem; margin-top: 1rem; }
@media (min-width: 560px) { .cards { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }

.card { position: relative; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.3rem .9rem .8rem; background: var(--surface); }
.card.unused { border-style: dashed; border-color: var(--warn-border); }
.card-top { position: absolute; top: .35rem; left: .9rem; right: .9rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.eyebrow { flex: 1; min-width: 0; font-size: .6rem; letter-spacing: .04em; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-right { display: flex; align-items: center; gap: .35rem; flex-shrink: 0; }
.card-head { display: flex; align-items: baseline; gap: .5rem; }
.card-head h4 { font-size: .92rem; font-weight: 600; margin: 0; color: var(--text); }
.disclose { flex-shrink: 0; font-size: .72rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: .1rem .25rem; }
.disclose:hover { color: var(--accent); }
.body { font-size: .84rem; color: var(--text); margin: .5rem 0 0; line-height: 1.45; }

.details { margin-top: .65rem; border-top: 1px solid var(--border); padding-top: .55rem; }
.fields { margin: 0; display: grid; gap: .32rem; }
.field { display: grid; grid-template-columns: 92px 1fr; gap: .5rem; align-items: baseline; }
.field dt { font-size: .7rem; color: var(--text-faint); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.field dd { margin: 0; font-size: .8rem; color: var(--text); display: flex; flex-wrap: wrap; gap: .3rem; align-items: baseline; }
.field dd code { font-size: .74rem; color: var(--text-muted); }
.chip { font-size: .7rem; padding: .1rem .45rem; background: var(--chip-bg); color: var(--text-muted); border-radius: 999px; }

.badge.unused { font-size: .62rem; padding: .1rem .4rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }

.json-toggle { margin-top: .55rem; font-size: .68rem; color: var(--text-muted); background: none; border: 1px solid var(--border-strong); border-radius: 6px; padding: .12rem .45rem; cursor: pointer; }
.json-toggle:hover { color: var(--text); }
.json { margin: .45rem 0 0; padding: .55rem .65rem; background: var(--code-bg); border-radius: 6px; font-size: .7rem; line-height: 1.45; overflow-x: auto; color: #374151; }
</style>
