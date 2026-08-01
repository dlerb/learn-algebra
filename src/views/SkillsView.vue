<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MathExpr from '../components/MathExpr.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import type { WrongForm } from '../data/skill.schema'
import { skills, groups, processes, rules, mistakes, rawById, skillTree } from '../data'
import { loc, type Skill, type LocalizedString, type GroupDef, type RuleDef } from '../data/skill.schema'
import { cardIndex } from '../data/layers'
import { lang } from '../lang'
import { inspect } from '../inspect'

// THE SKILLS CATALOG — the top of the curated stack, and the only layer that
// cites all three below it: a skill rests on the tower's CARDS, teaches the
// pool's RULES, and guards against the ERRORS.
//
// ON THE ROW SHELL since 2026-07-28 (Layer{Page,Section,Row}), the last page to
// come off the card grid. What the grid cost was not looks but reading: 74
// bordered boxes in three columns stretched every card in a row to the tallest,
// and a 300px column is too narrow for a formula that does not reflow — the
// equivalence chains overflowed a column each. Rows give the illustration a real
// measure and put the four coordinates of a skill in four fixed places.
//
// A SKILL IS ONE PROBLEM, SOLVED RIGHT AND SOLVED WRONG (2026-07-29, the user's
// model). The row is TWO BLOCKS, not four columns:
//
//   name │ ✓ the correct form      │ ✗ the tempting form
//        │ → the rule that licenses │ → the belief it comes from
//
// The horizontal split is good vs bad; the vertical pairing inside each block is
// claim-then-why. Measured support for the framing: 27 of the 34 ✓/✗ pairs share
// a left-hand side outright, and the other five differ only because the ✗ starts
// from a member of the ✓ chain — so a skill really is one problem seen twice.
//
// THE `fix` COLUMN IS GONE, AND THAT IS THE POINT. The correct form plus the rule
// IS the fix, so a third prose cell restating it was always a fourth rendering of
// one claim. The errors data had already proved the split: of three `fix` strings
// measured, one worked a case (that is the ✓ block) and two restated the rule
// (that is the → line under it). `note` — the author's rationale — moves to
// inspection, exactly as /errors demoted its diagnosis on 2026-07-25.
//
// It is also a SIMPLIFICATION of the strip: `teaches` and `guards against` were
// folds and a column, and are now the two → lines, so the strip is down to the
// two authored folds a reader might follow.
//
// ⚠️ THE SENTENCES COME FROM THE TWO POOLS — `rules.json` and `mistakes.json`,
// never errors.json. A mistake pool entry states the belief FROM THE INSIDE
// ("The factor in front reaches only the first term"), which is what pairs with
// a wrong form; the error layer's `name` labels it from outside, which under a
// formula reads as a category tag. Ids are shared, so `skill.errors` resolves in
// the pool untouched. This page is the ONLY place the skill→mistake edge is
// visible, since mistakes must not cite skills (that would close the cycle).
//
// ⚠️ THE DRILL LAYER IS RETIRED (2026-07-30). `src/data/drills/*.json` and the
// inspection-only `drill material` fold that rendered it are both gone: the
// material was disposable, the rebuilt drills CONSUME skills, and the fold's
// content would otherwise have had to be dragged through the process migration
// for nothing. Every one of the 74 skills carries its own `illustration`, which
// is what makes the maths column uniform, and the row's geometry never depended
// on the drill.
const t = (ls: LocalizedString) => loc(ls, lang.value)

// The prose this view owns: fold labels, the two cell labels, the section-by
// switch. Localized like every other page's, even though the skills' own `name`
// and `note` are still English-only — that is a content debt, not a view one.
const L = computed(() => lang.value === 'de'
  ? { rests: 'stützt sich auf', teaches: 'lehrt', requires: 'setzt voraus', requiredBy: 'Grundlage für',
      guards: 'schützt vor', cond: 'sofern', terminal: 'nichts zu tun',
      by: 'gliedern nach', byGroup: 'Thema', byProcess: 'Prozess', }
  : { rests: 'rests on', teaches: 'teaches', requires: 'requires', requiredBy: 'required by',
      guards: 'guards against', cond: 'provided', terminal: 'nothing to do',
      by: 'section by', byGroup: 'topic', byProcess: 'process', })

// Deep link from /rules, where each rule lists the skills that teach it.
const route = useRoute()
const targetId = computed(() => route.hash.slice(1))

// ── the four reference edges, three authored and one backwards ──────────────
// `restsOn` resolves in the tower (validated: card ids only), `rules` in the
// pool, `requires` inside this layer. `requiredBy` is the reverse of `requires`
// and is the answer to "why does this skill exist" for every RECOGNITION skill:
// failing to recognise a shape produces no wrong answer, only inaction, so those
// skills are justified downstream by what they enable and never upstream by what
// they prevent (docs/TODO.md, "Why an error cannot rescue these").
const skillName = (id: string) => {
  const s = skills.find(x => x.id === id)
  return s ? t(s.name) : id
}
const skillLinks = (ids: string[]) => ids.map(id => ({ id, name: skillName(id), to: `/skills#${id}` }))

const cardLinks = (ids: string[]) => ids.map(id => {
  const c = cardIndex.get(id)
  return { id, name: c ? t(c.card.name) : id, to: `/${c?.layer.slug}#${id}` }
})

const ruleById = new Map(rules.map(r => [r.id, r]))
// THE FAMILY THIS RULE BELONGS TO — "Power laws", "Minus rules". Read straight
// off `rule.family` since 2026-07-29; it used to be derived through sheet
// membership, which made this page import from cheatsheets to answer a question
// about a RULE, and conflated "belongs to one family" with "is printed on two
// sheets". Family is one, sheets are many.
const familyOf = (id: string) => {
  const f = ruleById.get(id)?.family
  const head = f ? ruleById.get(f) : undefined
  return head ? [t(head.rule)] : []
}
// THE NAME BEATS THE SENTENCE HERE (2026-07-31). A skill cites "Power laws ›
// Same base rule", not "Multiply powers of the same base by adding the
// exponents". The point is to train the student to SEE a building block and
// NAME it; the sentence is one click away on /rules for when the name is not
// enough yet. Rules with no name in current classroom use keep their sentence.
//
// ⚠️ Falls back to the SENTENCE, never to the other language. `shortName` is not a
// localizedString for the same reason `mnemonic` is not: "3. binomische Formel"
// has no English counterpart, and showing an English reader a German name is
// worse than showing them the rule itself.
const nameOf = (r: RuleDef) => r.shortName?.[lang.value] ?? t(r.rule)
const ruleLinks = (ids: string[]) => {
  const out = ids.map(id => {
    const r = ruleById.get(id)
    return { id, name: r ? nameOf(r) : id, to: `/rules#${id}`, family: familyOf(id) }
  })
  // Say the family ONCE. Two rules of the same family stacked — the factoring
  // skills cite two binomial formulas each — printed "Binomial formulas ·" twice
  // in bold, one under the other, which reads as a repeated heading rather than
  // as two members of one set.
  return out.map((x, i) => ({
    ...x,
    family: i > 0 && out[i - 1].family.join() === x.family.join() ? [] : x.family,
  }))
}

// THE BELIEF, not the label. `skill.errors` holds ids that resolve in both
// errors.json and mistakes.json; the pool is the right source here because its
// sentence is the misconception stated as the student holds it, which is what a
// ✗ form is an instance OF.
const mistakeById = new Map(mistakes.map(m => [m.id, m]))
// Frequency-ordered, like everywhere else the ★ appears: the belief most worth
// dislodging leads.
const mistakeLinks = (ids: string[]) => ids
  .map(id => mistakeById.get(id)!)
  .filter(Boolean)
  .sort((a, b) => b.frequency - a.frequency)
  // Same rule as the ✓ side: the NAME if the mistake has one, the sentence
  // otherwise, and never the other language's name.
  .map(m => ({
    id: m.id, name: m.shortName?.[lang.value] ?? t(m.mistake),
    frequency: m.frequency, to: `/mistakes#${m.id}`,
  }))

const requiredBy = new Map<string, string[]>()
for (const s of skills) for (const r of s.requires) requiredBy.set(r, [...(requiredBy.get(r) ?? []), s.id])

const groupTitle = new Map(groups.map(g => [g.slug, t(g.title)]))
const processTitle = new Map(processes.map((p: GroupDef) => [p.slug, t(p.title)]))

interface Row {
  id: string; process: string; group: string; name: string
  stimulus: string; right: string[]; wrong: WrongForm[]; conditions?: string
  requires: { id: string; name: string; to: string }[]
  requiredBy: { id: string; name: string; to: string }[]
  restsOn: { id: string; name: string; to: string }[]
  rules: { id: string; name: string; to: string; family: string[] }[]
  errors: { id: string; name: string; frequency: number; to: string }[]
  /** Is there anything in the bad half to contrast against? THE MARKS COME AS A
   *  PAIR OR NOT AT ALL — a ✗ without its ✓ is forbidden on /errors, and a ✓ with
   *  nothing opposite it says nothing.
   *  ⚠️ IT ASKS ABOUT THE BAD HALF ONLY, and briefly did not (2026-07-30): adding
   *  `right.length > 0` looked symmetric and broke exactly the rows this migration
   *  exists for. A FINISHED skill has an empty `right[]` and shows its stimulus as
   *  the answer — `2 + 3x` opposite ✗ `2 + 3x = 5x` — so suppressing its ✓ left a
   *  lone ✗ facing an unmarked formula, which is the one thing the contract bans.
   *  Caught by looking at the rendered row, not by any check. */
  paired: boolean
  contrast: boolean
  raw: unknown
}

function toRow(s: Skill): Row {
  const errors = mistakeLinks(s.mistakes)
  const rby = skillLinks(requiredBy.get(s.id) ?? [])
  return {
    id: s.id, process: s.process, group: s.group, name: t(s.name),
    stimulus: s.stimulus, right: s.right, wrong: s.wrong, conditions: s.conditions,
    requires: skillLinks(s.requires), requiredBy: rby,
    restsOn: cardLinks(s.restsOn), rules: ruleLinks(s.rules), errors,
    paired: s.wrong.length > 0,
    // NEITHER JUSTIFICATION HOLDS: it guards no mistake and enables no other
    // skill. Not a defect and not a backlog — it is the CONTRAST SET, and the
    // label says so. Nobody believes $a+b \neq b+a$, so authoring an error for it
    // would be fabricating evidence; what these two are for is the drill-design
    // reason the error layer can never express, that a Same-or-Different session
    // needs items whose answer is `same` or students learn to answer "different"
    // by reflex. It resolves to exactly the two skills `auditCoverage` names, so
    // the page and the load-time audit are reading the same thing.
    contrast: errors.length === 0 && rby.length === 0,
    raw: rawById.get(s.id),
  }
}

// Skills sort by name within a section; the layer carries no drilling sequence.
const byName = (a: Skill, b: Skill) => t(a.name).localeCompare(t(b.name))

// TWO SECTIONINGS OF ONE LIST, which no other layer has: `group` is the
// classroom topic and `kind` the strategy type, they cross-cut, and both are
// real ways in. The switch sits in LayerPage's `filters` slot — the same place
// the tower's chips sit — because it is the same kind of control: it changes what
// the page shows without leaving it.
const sectionBy = ref<'group' | 'process'>('group')

interface Sec { slug: string; title: string; blurb?: string; items: Row[] }
const sectionsOf = (reg: GroupDef[], key: 'group' | 'process') =>
  reg
    .map(g => ({ slug: g.slug, title: t(g.title), blurb: g.blurb ? t(g.blurb) : undefined, items: skills.filter(s => s[key] === g.slug).sort(byName).map(toRow) }))
    .filter(s => s.items.length > 0)

const sections = computed<Sec[]>(() =>
  sectionBy.value === 'group' ? sectionsOf(groups, 'group') : sectionsOf(processes, 'process'))

// THE COMPLEMENTARY COORDINATE in the strip's `kind` slot, never the one the
// section heading already says. A skill has two, and the heading spends one of
// them — so under a topic heading the strip says which strategy it is, and under
// a strategy heading which topic. Content, not plumbing, so it is not gated on
// the mode: on a long page you are usually mid-section with the heading scrolled
// away, which is exactly when the other coordinate orients you.
const stripKind = (r: Row) =>
  sectionBy.value === 'group' ? (processTitle.get(r.process) ?? r.process) : (groupTitle.get(r.group) ?? r.group)

// The size of the contrast set, on the page rather than only in the load log.
const contrastCount = computed(() => skills.filter(s => toRow(s).contrast).length)

// THREE COLUMNS, NOT FIVE. The literal reading of "columns 2-3 good, 4-5 bad"
// was measured and does not fit: the widest ✓ is a four-term chain at ~23rem and
// two sentence columns beside it come to 83rem of content, so every column sits
// at its minimum and both prose columns end up narrower than any other on the
// site. Laid out 2x2 the same information takes 79rem, and each formula gets
// 33rem instead of the 24 it had — more than the widest chain needs, so the
// maths stops scrolling for the first time.
// What it costs: the rules no longer line up in a column of their own down the
// page. That is the right trade — /rules already carries that reverse index
// (`drilled by`), and it carries it better.
// 13 + 33 + 33 plus two 1.6rem gaps is 82.2rem, comfortably inside the page's 91.
const COLS = 'minmax(0, 13rem) minmax(0, 33rem) minmax(0, 33rem)'
</script>

<template>
  <LayerPage
    :title="t(skillTree.meta.title)"
    :lead="t(skillTree.meta.blurb)"
    :about="inspect ? t(skillTree.meta.note) : undefined"
    :cols="COLS"
  >
    <template #bar-right>
      <span v-if="inspect && contrastCount" class="contrast-chip" title="guards no mistake and no skill requires it — the contrast items a Same-or-Different session needs">{{ contrastCount }} pure contrast</span>
    </template>

    <template #filters>
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">{{ L.by }}</span>
          <button class="fchip" :class="{ off: sectionBy !== 'group' }" @click="sectionBy = 'group'">
            {{ L.byGroup }}<span class="fcount">{{ groups.length }}</span>
          </button>
          <button class="fchip" :class="{ off: sectionBy !== 'process' }" @click="sectionBy = 'process'">
            {{ L.byProcess }}<span class="fcount">{{ processes.length }}</span>
          </button>
        </div>
      </div>
    </template>

    <LayerSection v-for="s in sections" :key="s.slug" :title="s.title" :about="s.blurb">
      <LayerRow
        v-for="r in s.items" :key="r.id"
        :id="r.id" :name="r.name" :record="r.raw"
        :kind="stripKind(r)"
        :targeted="r.id === targetId"
      >
        <template #folds>
          <RefFold :label="L.rests" :links="r.restsOn" />
          <RefFold :label="L.requires" :links="r.requires" />
          <!-- Derived, and now INSPECTION-ONLY. It is the only justification a
               recognition skill has, which makes it an author's question, not a
               reader's — and four folds on the strip was most of what made this
               page read as too much. -->
          <RefFold v-if="inspect" :label="L.requiredBy" :links="r.requiredBy" derived />
        </template>

        <template #strip-right>
          <span v-if="inspect && r.contrast" class="badge">contrast</span>
        </template>

        <!-- THE GOOD HALF: the problem solved correctly, then the rule that
             licenses the move. Left-aligned like the tower's statements — KaTeX
             centres display mode, which would float each form in its block and
             break the vertical line the column makes. -->
        <div class="block good">
          <!-- THE CLAIM, COMPOSED AT RENDER TIME. `right[]` holds bare forms with
               the stimulus implied as the left-hand side, so the equation is built
               here rather than stored 71 times over. Both stacks then show
               COMPLETE claims and the two columns of marks line up.
               ⚠️ EMPTY `right[]` IS NOT AN EMPTY BLOCK — it means the stimulus is
               already finished, so the stimulus itself is the answer and stands
               alone. That is the whole reason four skills no longer illustrate
               commutativity. -->
          <div v-for="(x, i) in r.right" :key="i" class="stmt">
            <span class="mark good">{{ r.paired ? '✓' : '' }}</span>
            <span class="f"><MathExpr :latex="`${r.stimulus} = ${x}`" display /></span>
          </div>
          <!-- ✓ STAYS, AND THE STOP SITS WHERE THE RIGHT-HAND SIDE WOULD BE. The
               stimulus IS the correct answer here, so the mark column keeps
               saying so and stays aligned with the ✗ opposite it; what the row
               has to add is that the answer slot is empty ON PURPOSE, which is
               the one thing a bare stimulus cannot say for itself.
               ⚠️ NO `=` BEFORE IT, and the marker is prose rather than a symbol
               CE could parse. `2 + 3x = \varnothing` is a false claim about the
               empty set, and the reason the glyph is kept out of `right[]` is
               that it is not an expression — composing one here would put the
               sentinel back, one layer up. Same discipline as the ✗ column,
               which writes `…` rather than inventing a symbol for inaction. -->
          <div v-if="!r.right.length" class="stmt">
            <span class="mark good">{{ r.paired ? '✓' : '' }}</span>
            <span class="f terminal">
              <MathExpr :latex="r.stimulus" display />
              <!-- ∎ IS BORROWED, NOT INVENTED. The QED tombstone means "this is
                   complete, nothing follows" — which is what a finished form is,
                   and why the rule beneath is called Finished form. The prose it
                   replaced repeated that rule; symbol plus named rule is the same
                   pairing the ✗ column already uses (`…` plus the named mistake),
                   so the words stay one line away rather than on every row.
                   ⚠️ NOT ∅ or ⊥, which are false rather than empty: they claim the
                   term equals the empty set, or is false. -->
              <span class="stop" :title="L.terminal"><MathExpr latex="\blacksquare" /></span>
            </span>
          </div>
          <!-- The tower's quantifier line, for the four skills with a domain
               caveat. It qualifies the form, so it sits under it. -->
          <div v-if="r.conditions" class="quant">{{ L.cond }} <MathExpr :latex="r.conditions" /></div>
          <RouterLink v-for="x in r.rules" :key="x.id" class="line" :to="x.to">
            <span class="arrow">→</span><span v-if="x.family.length" class="fam">{{ x.family.join(' · ') }}</span>{{ x.name }}
          </RouterLink>
        </div>

        <!-- THE BAD HALF: the tempting solution, then the belief it comes from.
             RIGHT THEN WRONG across the row, the reverse of /errors, because the
             arrival direction is reversed — you reach /errors CARRYING a mistake,
             so recognition leads; you reach /skills to learn a capability, so the
             correct form leads and the tempting one hangs off it.
             ⚠️ 10 of 74 blocks are empty today and that is honest, not broken:
             all 10 transformation skills still need their ✗ authored, and the 20
             classification/chunking skills have a wrong ANSWER (a name, a
             decomposition) rather than a false equation — which is the frozen
             drill layer's shape, so it is deliberately not decided here. -->
        <div class="block bad">
          <!-- ⚠️ NO `latex` MEANS INEXPRESSIBLE, NOT MISSING (2026-07-30). A
               recognition skill fails by INACTION — the student writes nothing,
               so there is no false claim to show and the ellipsis is the honest
               rendering. Do not fill it from the mistake's own `latex`: the pool
               entry is a general schema and this column is the skill's own
               instance. -->
          <div v-for="(w, i) in r.wrong" :key="i" class="stmt">
            <span class="mark bad">✗</span>
            <span v-if="w.latex" class="f"><MathExpr :latex="w.latex" display /></span>
            <span v-else class="f nothing">…</span>
          </div>
          <!-- The same two shapes, mirrored. EVIDENCED, never invented: only the
               9 of 20 that cite a mistake carry one, so 11 rows show a right
               reading with no wrong one — which is the same "marks come as a
               pair or not at all" rule the formulas follow. -->
          <!-- NO `fix` HERE, and it was tried (2026-07-29). errors.json's fix is
               authored per MISTAKE and rendered per SKILL, so the fan wrecks it:
               of 70 renders only 15 mentioned maths the skill actually shows, and
               seven fixes repeated 4-10 times each. It was also redundant by
               construction — 19 of the 28 fixes restate the rule or the correct
               form, which is exactly what the ✓ block one column left already
               says. The right half showing the wrong move IS the fix. -->
          <RouterLink v-for="e in r.errors" :key="e.id" class="line" :to="e.to">
            <span class="arrow">→</span>{{ e.name }}<span class="freq">{{ '\u2605'.repeat(e.frequency) }}</span>
          </RouterLink>
        </div>

      </LayerRow>
    </LayerSection>
  </LayerPage>
</template>

<style scoped>
@media (min-width: 820px) {
  /* ⚠️ `.block.good`, NOT `.good`. The ✓/✗ marks carry `.good`/`.bad` too, so a
     bare `.good { grid-area: 2 / 2 }` also placed every MARK at row 2 column 2 of
     its own `.stmt` grid — the mark took the 497px formula track and the formula
     was left with the 18px mark track. Same family as the KaTeX `.fix` collision
     in docs/app_design.md: a class name that is a colour is never specific
     enough. */
  .block.good { grid-area: 2 / 2; }
  .block.bad  { grid-area: 2 / 3; }
}

/* THE TWO BLOCKS. No fill — 74 rows of two large tinted fields would be the
   loudest thing on the page, and the taste record already says anything filled
   inside a panel risks reading as a hole punched through it. A 2px rule at the
   left edge is enough to say which half you are in, because the ✓/✗ marks and
   the arrows are already carrying the signal. Colour stays on its one axis:
   green for what to do, red for what went wrong.
   `align-content: start` is load-bearing, not tidiness: the two blocks are
   stretched to the height of the taller one, and with the default `stretch` the
   leftover height is dealt out BETWEEN the formula and its sentence, so the pair
   drifts apart by a different amount on every row. */
.block { min-width: 0; display: grid; align-content: start; padding-left: .7rem; border-left: 2px solid transparent; }
.block.good { border-left-color: color-mix(in srgb, var(--good) 45%, var(--surface)); }
.block.bad  { border-left-color: color-mix(in srgb, var(--bad) 45%, var(--surface)); }
/* An empty bad block keeps its column but drops its rule: a bar with nothing
   beside it reads as a missing row rather than as an absent mistake. */
.block.bad:empty { border-left-color: transparent; }

/* A FIXED MARK TRACK, reserved even when empty — the shell's own rule, because a
   gap in the same place on every row reads as structure while a gap that moves
   reads as breakage. */
.stmt { display: grid; grid-template-columns: 1.1rem minmax(0, 1fr); align-items: baseline; }
/* `overflow-x: auto` makes the computed `overflow-y` AUTO as well, so a formula
   whose ink exceeds its line box gets a surprise vertical scrollbar. The padding
   absorbs it and gives exponents and radicals room at the top. It sits on the
   FORMULA cell, not the row: a scrollbar under the mark would scroll the mark. */
.f { overflow-x: auto; padding: .3rem 0; min-width: 0; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }
.mark { font-size: .82rem; line-height: 1; font-weight: 600; }
.mark.good { color: var(--good); }
.mark.bad { color: var(--bad); }
/* THE READING — a named operation, or a split into chunks. Set in the content
   serif like the formulas it answers for, one step down in size because it is
   the ANSWER to the form above rather than another form. Indented onto the
   formula column so it hangs under the expression, not under the mark. */
.reading { padding-left: 1.1rem; font-family: var(--font-content); font-size: .92rem; color: var(--text); }
.stmt > .reading { padding-left: 0; }
/* An inactivity mistake has no false claim to show — the ellipsis stands in for
   the form the student never wrote. Muted, because it is an ABSENCE and must not
   read as loudly as a wrong formula sitting under the same mark. */
.f.nothing { color: var(--text-faint); font-family: var(--font-content); letter-spacing: .1em; }
/* The terminal row: formula, then the stop where the right-hand side would be.
   Flex rather than a third grid column so the marker sits against the formula
   at any width and drops beneath it on a phone instead of squeezing the maths. */
.f.terminal { display: flex; align-items: baseline; gap: .7rem; flex-wrap: wrap; }
.stop { color: var(--text-muted); font-size: .78rem; font-family: var(--font-content); white-space: nowrap; }
/* Each chunk boxed just enough to read as one object — the whole point of a
   chunking skill is that `3x` is ONE thing, so the grouping has to be visible
   without a bracket, which would say something different. */
.chunk { display: inline-block; padding: .06rem .35rem; margin-right: .3rem; border-radius: 4px; background: var(--band); }

/* Indented onto the formula column, not the mark's: the caveat qualifies the
   statement, so it lines up under it rather than under the ✓. */
.quant { margin-top: .15rem; padding-left: 1.1rem; font-size: .78rem; color: var(--text-muted); }

/* THE SENTENCE UNDER THE FORM — the rule that licenses it, the belief it comes
   from. Quoted from another pool, so it takes the content serif and the muted
   voice of a quotation; the whole line is the link, because it is one short
   sentence and a separate affordance under it would be chrome around nothing. */
.line {
  display: block; margin-top: .3rem; padding-left: 1.9rem; text-indent: -.8rem;
  font-family: var(--font-content); font-size: .84rem; line-height: 1.5;
  color: var(--text-muted); text-decoration: none;
}
.line:hover, .line:hover .arrow { color: var(--accent); }
.arrow { color: var(--text-faint); margin-right: .35rem; }
/* The mistake's own ★ carried across, so the list is weighted as well as
   ordered: it says which belief is worth dislodging first. */
.freq { font-size: .7rem; color: var(--text-faint); letter-spacing: .06em; margin-left: .4rem; white-space: nowrap; }

/* THE FAMILY NAME, in front of the rule it belongs to. Set apart by weight and
   colour rather than by a chip: the taste record already rejected pills for
   reference links as too loud, and this sits inside a line that is itself a
   pointer. It is the label a teacher says out loud, so it reads as the sentence's
   surname, not as a tag hung off it. */
.fam { font-weight: 600; color: var(--text-muted); }
.fam::after { content: ' · '; font-weight: 400; color: var(--text-faint); }

/* Section-by switch — the tower's filter chips, and deliberately the same
   control: it changes what the page shows without leaving it. */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 6rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: var(--on-accent); cursor: pointer; }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover { filter: brightness(1.08); }
.fcount { margin-left: .3rem; font-size: .64rem; opacity: .7; font-variant-numeric: tabular-nums; }

/* Matches LayerRow's `json` fold exactly — same size, colour and marker — so the
   strip's affordances read as one row of controls. */
/* The drill block: author plumbing, so it takes the quiet register of the json
   fold rather than the row's own. It sits on the band, not on a grey fill —
   inside a light panel a grey block reads as a hole punched through the page. */
.drill { margin: .5rem 0 0; padding: .55rem .7rem; background: var(--band); border-radius: 6px; }
.examples { display: flex; flex-wrap: wrap; gap: .3rem .9rem; }
.answer { margin-top: .3rem; font-size: .8rem; color: var(--text-muted); }
.decomp { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; margin: .2rem 0; }
.chunk { display: inline-flex; align-items: center; }
.opname { font-size: .72rem; color: var(--text-muted); margin-left: .25rem; }
.pit { border-left: 2px solid var(--bad); padding-left: .5rem; font-size: .82rem; color: var(--text); margin: .35rem 0; }
.cites { font-size: .72rem; color: var(--bad); margin-left: .4rem; }
.revise { font-size: .72rem; color: var(--text-muted); font-style: italic; margin-left: .4rem; }

/* NOT the warn colours /errors and /rules use for their coverage chips. Those
   count work outstanding; this counts a deliberate set, so it takes the neutral
   band and reads as a label rather than as an alarm. */
.contrast-chip { font-size: .72rem; padding: .16rem .5rem; border-radius: 999px; background: var(--band); color: var(--text-muted); border: 1px solid var(--border-strong); white-space: nowrap; }
/* In the strip with the other author plumbing, not against the name: it is a
   fact about the data's shape, not something the reader needs about the skill. */
.badge { font-size: .58rem; padding: .05rem .35rem; border-radius: 999px; background: var(--band); color: var(--text-muted); border: 1px solid var(--border-strong); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
</style>
