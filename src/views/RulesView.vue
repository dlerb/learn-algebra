<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MathExpr from '../components/MathExpr.vue'
import RichText from '../components/RichText.vue'
import LayerPage from '../components/LayerPage.vue'
import LayerSection from '../components/LayerSection.vue'
import LayerRow from '../components/LayerRow.vue'
import RefFold from '../components/RefFold.vue'
import { ruleTree, rules, sheets, mistakes, skills } from '../data'
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
// ON THE ROW SHELL since 2026-07-27 (Layer{Page,Section,Row}). It began as the
// FLAT case — one panel, `LayerSection` with no title — because a registry of
// sentences had no structure to give it, and the container tolerating that was
// half the point of building this layer first. FLAT IS STILL THE DEFAULT and
// still the honest reading of a registry.
//
// ⚠️ BUT IT NOW HAS TWO AXES TO OFFER (2026-07-31), and both were already
// authored. `family` arrived 2026-07-29 and is the SUBJECT axis — "the power
// laws", "the minus rules" — with its heads declared. `kind` is the REGISTER
// axis and is the older of the two: this pool is the DO/IS registry, and until
// you can see the two halves side by side that claim is only in the prose.
// Neither is derived; sectioning by them just draws what the fields say.
const t = (ls: LocalizedString) => loc(ls, lang.value)

const L = computed(() => lang.value === 'de'
  ? { reads: 'fasst zusammen', drills: 'geübt in',  prevents: 'verhindert', sheet: 'Merkblatt',
      by: 'gliedern nach', byFlat: 'gar nicht', byFamily: 'Familie', byKind: 'Register',
      isTitle: 'Was eine Form IST', doTitle: 'Was man TUT', noFamily: 'Ohne Familie',
      isTag: 'IST', doTag: 'TUT' }
  : { reads: 'summarises',      drills: 'drilled by', prevents: 'prevents',   sheet: 'Cheat sheet',
      by: 'section by', byFlat: 'nothing', byFamily: 'family', byKind: 'register',
      isTitle: 'What a form IS', doTitle: 'What to DO', noFamily: 'No family',
      isTag: 'IS', doTag: 'DO' })

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
// Reads the POOL since 2026-07-31: /errors is gone, so this both resolves against
// the only mistake layer left and links somewhere that exists. It also shows the
// name where a mistake has one, the sentence otherwise — the same rule as /skills.
const preventedBy = (m: RuleDef) => mistakes
  .filter(e => !e.head && e.breaks.includes(m.id))
  .sort((a, b) => b.frequency - a.frequency)
  .map(e => ({
    id: e.id, name: e.shortName?.[lang.value] ?? t(e.mistake),
    frequency: e.frequency, to: `/mistakes#${e.id}`,
  }))

const drilledBy = (m: RuleDef) => skills
  .filter(s => s.rules.includes(m.id))
  .map(s => ({ id: s.id, name: t(s.name), to: `/skills#${s.id}` }))

const readsOf = (m: RuleDef) => m.summarizes.map(id => {
  const c = cardIndex.get(id)
  return { id, name: c ? t(c.card.name) : id, to: `/${c?.layer.slug}#${id}` }
})

// THE SHEET THIS RULE HEADS, as a pointer only. The sheet itself moved to its
// own page on 2026-07-28 (SheetsView): rendering it here as well is how the two
// treatments would start to drift, and a sheet is not a row — a row is four
// columns of prose with one formula, a sheet is formulas under headings.
const sheetByRule = new Map(sheets.map(s => [s.rule, s]))

const ruleById = new Map(rules.map(r => [r.id, r]))

// THE FAMILY THIS RULE BELONGS TO — "Power laws", "Minus rules". Read straight
// off `rule.family` since 2026-07-29; it used to be derived through sheet
// membership, which made /rules import from cheatsheets to answer a question
// about a RULE, and conflated "belongs to one family" with "is printed on two
// sheets". Family is one, sheets are many.
const familyOf = (id: string) => {
  const f = ruleById.get(id)?.family
  const head = f ? ruleById.get(f) : undefined
  return head ? [t(head.rule)] : []
}

const items = computed(() => rules.map(m => {
  const errors = preventedBy(m), sk = drilledBy(m)
  return {
    id: m.id, kind: m.kind, rule: t(m.rule), latex: m.latex, note: t(m.note),
    family: familyOf(m.id),
    // ⚠️ NO FALLBACK, deliberately. `loc()` falls back to English so prose never
    // renders blank, but a mnemonic is not prose: showing a German reader
    // "PEMDAS" — an acronym nobody in their classroom says — is worse than
    // showing nothing. Each language has its own or has none.
    // THE NAME IT IS CITED BY (2026-07-31). /skills prints "Power laws › Same
    // base rule" and links here, so the name has to be findable on arrival —
    // otherwise the student follows a name to a page that never says it. Same
    // no-fallback discipline as the mnemonic, and for the same reason: a rule
    // named only in German shows nothing to an English reader.
    shortName: m.shortName?.[lang.value],
    mnemonic: m.mnemonic?.[lang.value],
    errors, skills: sk, reads: readsOf(m),
    sheet: sheetByRule.get(m.id),
    orphan: errors.length === 0 && sk.length === 0,
    raw: m,
  }
}))
const orphans = computed(() => items.value.filter(i => i.orphan).length)

// ⚠️ A HEAD IS A HEADING, NEVER A ROW, in both sectionings. The eight family
// heads carry a name and a note and no `latex`, so listed as rows they are eight
// blanks; as section titles they are exactly what they were written to be. That
// is also why the flat view still shows them — with no sections to become, a
// head is just another sentence in the registry.
const heads = computed(() => rules.filter(r => r.head))
const members = computed(() => items.value.filter(i => !i.raw.head))

// ── ORDER WITHIN A SECTION: THE OTHER AXIS, THEN THE FILE (2026-08-02) ───────
// The two axes cross-cut, so whichever one the headings spend, the other still
// sorts the rows under them — a family section runs IS-sentences then DO-, a
// register section runs family by family. Underneath that, the order rules.json
// lists them in, never the alphabet: the file's order is authored and a revision
// pass reads the file. `sort` is stable, so a single rank key is the whole sort.
// FLAT IS UNTOUCHED, deliberately — it is the registry as authored, and a
// secondary key would make it a third sectioning wearing no headings.
type Item = (typeof items.value)[number]
const kindRank = (i: Item) => (i.kind === 'is' ? 0 : 1)
// Family order = the order the HEADS stand in the file, which is the order the
// family sections themselves come in; no family sorts last, as `fam-none` does.
const familyRank = (i: Item) => {
  const at = heads.value.findIndex(h => h.id === i.raw.family)
  return at === -1 ? heads.value.length : at
}
const rankedBy = (rank: (i: Item) => number, list: Item[]) =>
  [...list].sort((a, b) => rank(a) - rank(b))

const familySections = computed(() => {
  const out = heads.value.map(h => ({
    slug: `fam-${h.id}`,
    title: t(h.rule),
    note: t(h.note) as string | undefined,
    items: rankedBy(kindRank, members.value.filter(i => i.raw.family === h.id)),
  })).filter(x => x.items.length > 0)
  const rest = members.value.filter(i => !i.raw.family)
  if (rest.length) out.push({ slug: 'fam-none', title: L.value.noFamily, note: undefined, items: rankedBy(kindRank, rest) })
  return out
})

// The registry's own claim, drawn: IS says what a written form MEANS, DO says
// what you may do to it. `is` leads because you cannot act on a form you have
// not read — the same order the skill processes are in.
const kindSections = computed(() => ([
  { slug: 'kind-is', title: L.value.isTitle, note: undefined as string | undefined,
    items: rankedBy(familyRank, members.value.filter(i => i.kind === 'is')) },
  { slug: 'kind-do', title: L.value.doTitle, note: undefined as string | undefined,
    items: rankedBy(familyRank, members.value.filter(i => i.kind === 'do')) },
] as const).filter(x => x.items.length > 0))

const sectionBy = ref<'flat' | 'family' | 'kind'>('flat')
const sections = computed(() => sectionBy.value === 'family' ? familySections.value
  : sectionBy.value === 'kind' ? kindSections.value
  : [{ slug: 'all', title: undefined as string | undefined, note: undefined as string | undefined, items: items.value }])

// ── WHAT THE STRIP SAYS: EVERY COORDINATE THE HEADING DOES NOT (2026-08-02) ──
// The /skills rule, applied to a page with two axes instead of one: a row carries
// both `kind` and `family`, the heading spends at most one of them, and the strip
// shows whichever is left. So a family section is tagged IS/DO, a register
// section is tagged with the family, and FLAT — which has no heading at all —
// carries both, as it must.
// This is also what makes the new within-section order legible: the key the rows
// are sorted by is now printed on every row. Content, not plumbing, so neither is
// gated on inspect — and the register tag replaces the raw `is`/`do` that used to
// sit in the strip under inspect, which said the same thing in the file's words.
// SHORT CAPS, not the section titles: "What a form IS" is a heading and reads as
// one; repeated down 55 rows it would be the loudest thing in the strip. The caps
// are the heading's own emphasised word, so the tag and the heading match.
const stripRegister = (kind: string) =>
  sectionBy.value === 'kind' ? undefined : (kind === 'is' ? L.value.isTag : L.value.doTag)

// FOUR COLUMNS: the sentence | its formula | its gloss | the mistakes it prevents.
// The maths column arrived with `latex` (2026-07-28) and changes what the page
// is for: a student hunting "the one about exponents" scans formulas, not 26
// sentences, and the page reads as a formulary rather than a list of prose.
// The rail is wider than the tower's 11rem because what sits in it is a
// SENTENCE, not a name. Four columns inside 89rem is tight — 22 + 18 + 22 + 22
// plus three 1.6rem gaps is 88.8 — so the prose columns run under the shared
// 26rem measure. The skills that teach a rule fold into the strip instead:
// rule.dominant-op-last is cited by 13, which is a list and not a column, while
// nothing prevents more than three mistakes.
const COLS = 'minmax(0, 22rem) minmax(0, 18rem) minmax(0, 22rem) minmax(0, 22rem)'
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

    <template #filters>
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">{{ L.by }}</span>
          <button class="fchip" :class="{ off: sectionBy !== 'flat' }" @click="sectionBy = 'flat'">
            <!-- No count: its neighbours count SECTIONS, and flat has none. A
                 number meaning something different from the one beside it is
                 worse than no number. -->
            {{ L.byFlat }}
          </button>
          <button class="fchip" :class="{ off: sectionBy !== 'family' }" @click="sectionBy = 'family'">
            {{ L.byFamily }}<span class="fcount">{{ familySections.length }}</span>
          </button>
          <button class="fchip" :class="{ off: sectionBy !== 'kind' }" @click="sectionBy = 'kind'">
            {{ L.byKind }}<span class="fcount">{{ kindSections.length }}</span>
          </button>
        </div>
      </div>
    </template>

    <!-- Flat renders as ONE untitled section, which is what the page always was. -->
    <LayerSection v-for="s in sections" :key="s.slug" :title="s.title" :note="s.note">
      <LayerRow
        v-for="m in s.items" :key="m.id + s.slug"
        :id="m.id" :name="m.rule" :record="m.raw"
        :kind="stripRegister(m.kind)"
        :targeted="m.id === targetId"
      >
        <!-- THE CLASSROOM PHRASING, in the rail directly under the name. It is
             another wording of the SAME sentence — what a teacher says instead —
             so it belongs with the name rather than in the gloss column, where it
             read as the first line of an explanation. Small and quiet: it is an
             alternative, not an addition. -->
        <!-- The NAME sits above the mnemonic and reads louder than it: one is
             what the rule is CALLED, the other is a way to remember what it
             says. Both are alternatives to the sentence in the row's name, so
             both belong in the rail rather than in the gloss column. -->
        <template v-if="m.shortName || m.mnemonic" #rail>
          <p v-if="m.shortName" class="short-name">{{ m.shortName }}</p>
          <p v-if="m.mnemonic" class="mnemonic">{{ m.mnemonic }}</p>
        </template>

        <template #folds>
          <!-- The pool it belongs to, ahead of the reference folds: it is what
               the sentence is CALLED, not somewhere else to go. Dropped when the
               section heading IS the family — a row that repeats its own heading
               teaches nothing and makes the strip longer. -->
          <span v-if="m.family.length && sectionBy !== 'family'" class="fam">{{ m.family.join(' · ') }}</span>
          <RefFold :label="L.reads" :links="m.reads" />
          <RefFold :label="L.drills" :links="m.skills" derived />
        </template>

        <!-- One line per formula: a sentence can carry several, and a formulary
             wants a row each. Left-aligned like the tower's statements — KaTeX
             centres display mode, which would float each formula in its cell and
             break the vertical line the column makes. -->
        <div v-if="m.latex.length" class="maths">
          <div v-for="(l, i) in m.latex" :key="i" class="stmt"><MathExpr :latex="l" display /></div>
        </div>

        <div class="cell muted gloss">
          <RichText :text="m.note" />
          <!-- A family name's whole job is to head a sheet, so the link is the
               row's payload rather than a footnote. -->
          <RouterLink v-if="m.sheet" class="sheet-link" :to="`/sheets#${m.sheet.id}`">
            <span class="arrow">→</span>{{ L.sheet }}
          </RouterLink>
        </div>

        <!-- THE PITCH OF THE WHOLE LAYER: learn this one sentence and these
             mistakes stop happening. Derived, hence the arrows — it is
             `error.rules` read backwards, so it can never disagree with what
             /errors shows. These are now the ONLY inline arrows on the three
             curated pages: /skills' rule and mistake lists and /mistakes' broken
             rules lost theirs on 2026-08-02 because they are authored, which
             makes the glyph mean one thing again — RefFold's → and this one say
             "nobody typed this edge here".
             Uncapped, because nothing prevents more than three;
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
  .maths    { grid-area: 2 / 2; }
  .gloss    { grid-area: 2 / 3; }
  .prevents { grid-area: 2 / 4; }
}

.maths { min-width: 0; }
/* `overflow-x: auto` makes the computed `overflow-y` AUTO as well, so a formula
   whose ink exceeds its line box gets a surprise vertical scrollbar. The padding
   absorbs it, and gives radicals and exponents room at the top. */
.stmt { overflow-x: auto; padding: .3rem 0; }
.stmt :deep(.katex-display) { margin: 0; text-align: left; }
.stmt :deep(.katex-display > .katex) { text-align: left; }

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

/* Under the name, a step down in size and colour. Content serif and italic
   because it is a QUOTATION from the classroom rather than the app's own voice,
   and italic is the convention for a quoted phrase. `text-wrap: balance` because
   the long ones run to three lines in a 22rem rail and an even shape reads as
   deliberate. */
/* THE SECTION-BY CHIPS. Byte-identical to /mistakes' — the two pages are read
   side by side and a control that behaved or looked even slightly differently
   across them would read as two controls. */
.filters { margin-top: 1rem; display: grid; gap: .4rem; }
.filter-row { display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
.filter-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; width: 6rem; }
.fchip { font-size: .72rem; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--accent); background: var(--accent); color: var(--on-accent); cursor: pointer; }
.fchip.off { background: transparent; color: var(--text-muted); border-color: var(--border-strong); }
.fchip:hover { filter: brightness(1.08); }
.fcount { margin-left: .3rem; font-size: .64rem; opacity: .7; font-variant-numeric: tabular-nums; }

/* THE NAME: upright and unmuted, so it reads as a handle rather than as a
   second gloss. The mnemonic under it stays italic and quiet — the two must not
   look like one two-line remark. */
.short-name {
  margin: .3rem 0 0; font-family: var(--font-content); font-weight: 600;
  font-size: .82rem; line-height: 1.35; color: var(--text); text-wrap: balance;
}
.mnemonic {
  margin: .3rem 0 0; font-family: var(--font-content); font-style: italic;
  font-size: .78rem; line-height: 1.4; color: var(--text-muted); text-wrap: balance;
}

.sheet-link { display: block; margin-top: .45rem; color: var(--text-muted); text-decoration: none; }
.sheet-link:hover, .sheet-link:hover .arrow { color: var(--accent); }

.fam { font-size: .62rem; font-weight: 600; color: var(--text-muted); letter-spacing: .01em; }

.orphan-chip { font-size: .72rem; font-weight: 600; padding: .16rem .5rem; border-radius: 999px; background: var(--warn-bg); color: var(--warn-fg); border: 1px solid var(--warn-border); white-space: nowrap; }
</style>
