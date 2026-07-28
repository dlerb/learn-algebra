<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MathExpr from '../components/MathExpr.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import { sheetTree, sheets, rules } from '../data'
import { loc, type LocalizedString } from '../data/skill.schema'
import { lang } from '../lang'
import { inspect } from '../inspect'

// THE CHEAT SHEETS — the formulas worth knowing by heart, grouped the way they
// are taught.
//
// A sheet OWNS NOTHING. It names rules from the pool (src/data/rules.json) and
// says which, in what order, under what heading; every formula on this page is
// looked up from the rule it names. Edit a formula in the pool and every sheet
// showing it changes, because there is no second copy.
//
// It got its own page on 2026-07-28, out of a full-width block on /rules. Two
// reasons, and the first is the decisive one: buried at row 9 of 34 with nothing
// announcing it, the author could not find it — so a student certainly could
// not. And the two artifacts are different in kind. /rules is the pool with each
// sentence's context (its gloss, the mistakes it prevents, the skills that drill
// it), which is a reference surface; a sheet is formulas under headings, which
// is what you project, print, or tell a class to open.
const t = (ls: LocalizedString) => loc(ls, lang.value)

const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

const ruleById = new Map(rules.map(r => [r.id, r]))

const items = computed(() => sheets.map(s => {
  const head = ruleById.get(s.rule)!
  return {
    id: s.id,
    title: t(head.rule),          // the sheet's name IS a pool sentence
    note: t(head.note),
    ruleTo: `/rules#${s.rule}`,
    groups: s.groups.map(g => ({
      title: t(g.title),
      layout: g.layout,
      // One column per `latex` index in a table, so an algebraic form and its
      // root form sit under each other. Members of a table group are authored
      // with the same number of lines; a ragged one just leaves a hole.
      columns: Math.max(...g.rules.map(r => ruleById.get(r)!.latex.length), 1),
      cells: g.rules.flatMap(r => ruleById.get(r)!.latex.map(latex => ({ id: r, latex }))),
    })),
  }
}))
</script>

<template>
  <LayerPage
    :title="t(sheetTree.meta.title)"
    :lead="t(sheetTree.meta.blurb)"
    :about="inspect ? t(sheetTree.meta.note) : undefined"
  >
    <LayerSection
      v-for="s in items" :key="s.id" :id="s.id"
      :title="s.title" :note="s.note"
      :class="{ targeted: s.id === targetId }"
    >
      <div class="sheet">
        <section v-for="(g, i) in s.groups" :key="i" class="sheet-group">
          <h5 class="sheet-head">{{ g.title }}</h5>
          <div
            class="sheet-body" :class="g.layout"
            :style="g.layout === 'table' ? { gridTemplateColumns: `repeat(${g.columns}, max-content)` } : undefined"
          >
            <!-- Every formula links back to its rule in the pool, so the sheet
                 doubles as the table of contents for /rules. -->
            <RouterLink v-for="(c, j) in g.cells" :key="j" class="formula" :to="`/rules#${c.id}`">
              <MathExpr :latex="c.latex" />
            </RouterLink>
          </div>
        </section>
      </div>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
.section { scroll-margin-top: 4.5rem; }
.targeted :deep(.rows) { background: var(--accent-bg); box-shadow: inset 3px 0 0 var(--accent); }

/* MULTI-COLUMN, or it is a banner rather than a sheet. One group per full-width
   row left the page mostly empty and put "same base" a screen away from "same
   exponent", when seeing them at once is the whole value of a formulary.
   `break-inside: avoid` keeps a heading with its formulas. */
.sheet { columns: 23rem; column-gap: 2.5rem; padding: 1rem 0 1.1rem; }
.sheet-group { break-inside: avoid; }
.sheet-group + .sheet-group { margin-top: .9rem; }
/* Sans, small, muted: the headings are structure and the formulas are the
   content. On a sheet the formulas must be the loudest thing by a distance. */
.sheet-head { margin: 0 0 .35rem; font-size: .68rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
.sheet-body { display: grid; gap: .35rem 1.6rem; align-items: baseline; justify-content: start; }
/* `flow` is FLEX, not grid: a grid track squeezes a formula to the track width
   and KaTeX then breaks it mid-expression — $(a+b)^n \neq a^n + b^n$ came apart
   after the plus. Flex wraps BETWEEN items and never inside one. */
.sheet-body.flow { display: flex; flex-wrap: wrap; gap: .35rem 1.6rem; }
.formula { display: block; padding: .2rem .1rem; color: var(--text); text-decoration: none; border-radius: 4px; white-space: nowrap; }
.formula:hover { background: var(--band); color: var(--accent); }
</style>
