<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import RichText from '../components/RichText.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { ruleTree, rules, errorPatterns, skills } from '../data'
import { cardIndex } from '../data/layers'
import { loc, type RuleDef, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect } from '../inspect'

// THE DO/IS REGISTRY. A flat collection of student-facing sentences, each saying
// what a written form IS or what to DO with it.
//
// The entries carry no context of their own — that is the design, not a gap
// (src/data/skill.schema → Rules). So this page is built almost entirely out of
// REVERSE INDEXES: the mistakes a sentence prevents and the skills that teach it
// are found by asking who cites it, never by reading anything on the sentence.
// Which is also why the page cannot go stale — it says exactly what the rest of
// the data says about each sentence, or nothing.
//
// ON THE ROW SHELL since 2026-07-27 (Layer{Page,Section,Row}), and it is the FLAT
// case: no sections, one panel, `LayerSection` with no title. A registry of
// sentences has no structure to give it, and the container tolerating that was
// half the point of building this layer before the manifest unification.
const t = (ls: LocalizedString) => loc(ls, lang.value)

const L = computed(() => lang.value === 'de'
  ? { reads: 'liest',  drills: 'geübt in',  prevents: 'verhindert' }
  : { reads: 'reads',  drills: 'drilled by', prevents: 'prevents' })

const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

// THE THREE INDEXES, two of them backwards.
//   errors  — `error.rules`, authored 2026-07-27. This used to be derived
//             through the cards (rule → summarizes → card ← corrupts ← error),
//             which guessed and capped at four; now it is exactly what /errors
//             shows, because it is the same edge read the other way.
//   skills  — `skill.rules`.
//   reads   — the one FORWARD edge, `summarizes`: the bridge claim that this
//             sentence is the student-facing form of those formal statements.
const preventedBy = (m: RuleDef) => errorPatterns
  .filter(e => e.rules.includes(m.id))
  .sort((a, b) => b.frequency - a.frequency)
  .map(e => ({ id: e.id, name: t(e.name), frequency: e.frequency, to: `/errors#${e.id}` }))

const drilledBy = (m: RuleDef) => skills
  .filter(s => s.rules.includes(m.id))
  .map(s => ({ id: s.id, name: t(s.name), to: `/skills#${s.id}` }))

const readsOf = (m: RuleDef) => m.summarizes.map(id => {
  const c = cardIndex.get(id)
  return { id, name: c ? t(c.card.name) : id, to: `/${c?.layer.slug}#${id}` }
})

// A sentence nothing cites is dead weight: context is the only thing that gives
// it meaning, and with no error and no skill behind it there is none to give.
// REACH AS GARBAGE COLLECTION, not as an admission test — what belongs in the
// registry is whatever turns out to be important, however narrowly it is used.
const items = computed(() => rules.map(m => {
  const errors = preventedBy(m), sk = drilledBy(m)
  return {
    id: m.id, kind: m.kind, rule: t(m.rule), note: t(m.note),
    errors, skills: sk, reads: readsOf(m),
    orphan: errors.length === 0 && sk.length === 0,
    raw: m,
  }
}))
const orphans = computed(() => items.value.filter(i => i.orphan).length)

// THREE COLUMNS: the sentence | its gloss | the mistakes it prevents.
// The rail is wider than the tower's 11rem because what sits in it is a
// SENTENCE, not a name — up to 58 characters. The two prose columns keep the
// shared 26rem measure. The skills that teach a rule fold into the strip
// instead: rule.dominant-op-last is drilled by 13 of them, which is a list and
// not a column, while nothing prevents more than three mistakes.
const COLS = 'minmax(0, 24rem) minmax(0, var(--measure)) minmax(0, var(--measure))'
</script>

<template>
  <LayerPage
    :title="t(ruleTree.meta.title)"
    :lead="t(ruleTree.meta.blurb)"
    :about="inspect ? t(ruleTree.meta.note) : undefined"
    :cols="COLS"
  >
    <template #bar-right>
      <span v-if="inspect && orphans" class="orphan-chip" title="cited by no error and no skill">{{ orphans }} orphaned</span>
    </template>

    <!-- No title: the list is flat, so there is nothing to head it with. -->
    <LayerSection>
      <LayerRow
        v-for="m in items" :key="m.id"
        :id="m.id" :name="m.rule" :record="m.raw"
        :kind="inspect ? m.kind : undefined"
        :targeted="m.id === targetId"
      >
        <template #folds>
          <RefFold :label="L.reads" :links="m.reads" />
          <RefFold :label="L.drills" :links="m.skills" derived />
        </template>

        <div class="cell muted gloss"><RichText :text="m.note" /></div>

        <!-- THE PITCH OF THE WHOLE LAYER: learn this one sentence and these
             mistakes stop happening. Derived, hence the arrows — it is
             `error.rules` read backwards, so it can never disagree with what
             /errors shows. Uncapped, because nothing prevents more than three;
             the old card-mediated version needed a cap of four. -->
        <div v-if="m.errors.length" class="cell prevents">
          <span class="label">{{ L.prevents }}</span>
          <RouterLink v-for="e in m.errors" :key="e.id" class="prevent" :to="e.to">
            <span class="arrow">→</span>{{ e.name }}<span class="freq">{{ '★'.repeat(e.frequency) }}</span>
          </RouterLink>
        </div>
      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  .gloss    { grid-area: 2 / 2; }
  .prevents { grid-area: 2 / 3; }
}

/* A list of links that happens to sit in a prose column: it takes the measure
   and the content serif from `.cell` and lays itself out as a list. */
.prevents { display: flex; flex-direction: column; gap: .15rem; }
.label { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .62rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); margin-bottom: .1rem; }
.prevent { color: var(--text-muted); text-decoration: none; text-indent: -.9rem; padding-left: .9rem; line-height: 1.45; }
.prevent:hover { color: var(--accent); }
.arrow { color: var(--text-faint); margin-right: .35rem; }
.prevent:hover .arrow { color: var(--accent); }
/* The mistake's own ★ carried across, so the list is weighted as well as
   ordered: it says which of the mistakes this rule heads off is worth heading
   off most. */
.freq { font-size: .7rem; color: var(--text-faint); letter-spacing: .06em; margin-left: .4rem; white-space: nowrap; }

.orphan-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
</style>
