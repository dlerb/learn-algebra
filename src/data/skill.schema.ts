import { z } from 'zod'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
// Skill schema — the single source of truth for BOTH the runtime validator and
// the TypeScript `Skill` type (via z.infer). Skill data is authored as JSON in
// src/data/skills/*.json and validated against this schema on load.
//
// A skill is a mathematical unit only. It declares WHAT IT IS (its `kind`);
// how it is drilled (exercise type) is derived from the kind in code, never
// stored here. A skill carries no linear ordering: dependency lives in the
// `requires` graph, but drilling *sequence* is a drill/session-layer concern
// (the old `priority` field was parked to drills/_parked-priority.json). Per-
// student runtime state (mastery, next-item selection, scheduling) is not here.
// ─────────────────────────────────────────────────────────────────────────────

export const dominantOp = z.enum(['sum', 'difference', 'product', 'quotient', 'power'])
export type DominantOp = z.infer<typeof dominantOp>

// ── Localization ─────────────────────────────────────────────────────────────
// Prose fields are LocalizedString: authored as a plain string (= English) or
// as { en, de }. English is the fallback so untranslated content never renders
// blank; "de" means Schweizer Hochdeutsch. LaTeX math is language-neutral and
// never localized.

export const langs = ['en', 'de'] as const
export type Lang = (typeof langs)[number]

export const localizedString = z.union([
  z.string().transform((s): { en: string; de?: string } => ({ en: s })),
  z.object({ en: z.string(), de: z.string().optional() }),
])
export type LocalizedString = z.output<typeof localizedString>

export function loc(ls: LocalizedString, lang: Lang): string {
  return ls[lang] ?? ls.en
}

// A skill is a curated STRATEGY/SKILL — NOT drill material. It says what the
// skill is, why it matters (`note`), one canonical `illustration`, the
// misconceptions it guards against (`errors` → error-pattern ids), and its links
// into the tower (`restsOn` → card ids) and the rules registry. All the
// drill-specific material — instances, answers, distractors — lives in the drill
// layer (drills/*.json), keyed by skill id. Uniform shape across kinds: `kind` is
// a plain category label (= id prefix), not a data-shape discriminant.
export const skillKind = z.enum(['equivalence', 'classification', 'chunking', 'transformation'])
export type SkillKind = z.infer<typeof skillKind>

// ── A WRONG ANSWER AND THE MISTAKE IT INSTANTIATES (2026-07-30) ───────────────
// `explains` is the edge the layer was missing. Before it, /skills rendered the
// skill's WHOLE mistake list under its WHOLE ✗ column — a list beside a column,
// never a link from a form to a sentence. That reads fine (the eye pairs them by
// proximity) and is unusable to a drill, which must name ONE sentence when the
// student picks ONE form. Nine skills showed two or three sentences under a
// single ✗, and in three of those the extra sentence was quietly recording a
// wrong form nobody had authored.
//
// ⚠️ SINGULAR, ALWAYS. A form may be describable at two levels — `\sqrt{a^2+b^2}
// = a+b` is both *a root spread over a plus* and *a move invented where none
// applies* — and allowing both here would reinstate exactly the ambiguity this
// field exists to remove. Name WHICH move was wrong; the level above is the
// mistake's `family`.
//
// ⚠️ `latex` IS OPTIONAL, and absent means INEXPRESSIBLE, not missing. A
// recognition skill fails by inaction: the student writes nothing, so there is no
// false claim to show, and the view draws an ellipsis under the ✗. Do NOT put
// `\ldots` in here to fill it — the field means "the false claim", and the whole
// point of these entries is that there is none.
const wrongForm = z.object({
  latex: z.string().optional(),
  explains: z.string(),
})
export type WrongForm = z.infer<typeof wrongForm>

export const skill = z.object({
  // ⚠️ THE ID NO LONGER CARRIES THE CLASSIFICATION (2026-07-30). It used to be
  // `<kind>.<slug>`, which made every re-classification a mass rename — and this
  // layer's classification turned out to be revisable: `fraction-bar-grouping` is
  // a chunking skill that was filed as equivalence because its illustration
  // happened to be written as an equation. A `skill.` TYPE prefix matches every
  // other entity here (`rule.`, `sheet.`, `th.`, `ax.`, `ix.`), and re-filing is
  // now a one-field edit.
  id: z.string().regex(/^skill\.[a-z0-9-]+$/, 'id must be "skill.<slug>"'),
  kind: skillKind,                     // positional in the kind file, re-attached by parseSkillTree — NOT derivable from the id any more
  group: z.string(),                    // topic slug; positional in the kind file (= the containing group node), re-attached by parseSkillTree
  name: localizedString,                // the skill's display heading (like a card's `name`)
  note: localizedString,                // the rationale — why this skill matters; prose + inline $…$ KaTeX
  illustration: z.string().optional(),  // ONE canonical example (LaTeX) that anchors the skill
  // THE TEMPTING FORM, AS A FALSE CLAIM (2026-07-28). Each entry is a complete
  // false equation in LaTeX — `3x = 3 + x`, not a bare `3 + x` — so it stands on
  // its own under a ✗ exactly as an error's `instances[].wrong` does, and needs no
  // stem column to be read.
  //
  // AUTHORED PER SKILL, never fetched from the cited errors, and the measurement
  // that decided it: 70 (skill → error) citations point at only 27 distinct
  // errors, `anti.linearity` alone is cited by 10 skills, and 16 of those
  // collisions fall inside a single topic panel. The errors are GENERAL and the
  // skills are SPECIFIC — `minus-over-sum` and `minus-over-difference` both cite
  // `anti.partial-distribution` but are tempted by different forms ($-a+b$ vs
  // $-a-b$) — so the pair a skill needs cannot be derived from the error even in
  // principle. Same ruling as rule.latex vs card.latex: each layer keeps its own
  // formulas, and restating one at student level is translation, not duplication.
  //
  // AN ARRAY, because a note can carry two ($2a$ is not $a^2$, AND $a^2$ is not
  // $2a$), and EMPTY IS MEANINGFUL: `skill.bracket-types` and
  // `-addition-commutative` have no tempting wrong form at all, which is exactly
  // why they exist — a Same-or-Different session needs items whose answer is
  // `same`. Never invent one to fill the field.
  //
  // ⚠️ ONLY A FALSE CLAIM belongs here. `a + -b` is not false, it is badly
  // written; that is the tower's avoid/prefer relation, where the two sides are
  // EQUAL and WrongRight joins them with `=` and mutes the marks. Putting a
  // clumsy-but-correct form under the same red ✗ would teach ✗ = wrong and then
  // contradict it. A belief the student holds is fine and is written as the
  // claim itself — `a \cdot 3 \neq 3a` under a ✗ says that belief is false.
  wrong: z.array(wrongForm).default([]),
  // ── THE OTHER TWO ANSWER SHAPES (2026-07-29) ─────────────────────────────
  // `wrong` holds a FALSE EQUATION, and neither classification nor chunking
  // produces one: a classification's wrong answer is a WORD ("a product"), a
  // chunking's is a GROUPING. Forcing either into `wrong` would repeat the
  // `omission` mistake — two forms equal in value, differing only in reading,
  // under a mark that is supposed to mean "false".
  //
  // ⚠️ These cluster by kind, which bends the rule at the top of this file that
  // `kind` is "not a data-shape discriminant". The bend is deliberate and the
  // alternative was worse. Note the VIEW still does not branch on kind — it
  // renders whichever field is present, so kind stays out of the rendering path.
  //
  // ⚠️ Authored here and NOT in the drill layer, because the rebuilt drills will
  // CONSUME skills (docs/TODO.md, "the drill layer is disposable"). A
  // classification skill with no `answer` was simply incomplete: /skills rendered
  // `3x + 2y` and never said it was a sum.
  //
  // BOTH CARRY `explains` SINCE 2026-07-30, for the same reason `wrong` does: a
  // wrong NAME and a wrong SPLIT are wrong answers, so each instantiates exactly
  // one mistake. With the authored `errors` list gone, an unpaired wrong answer
  // would also contribute nothing to the derived `mistakes` below.
  answer: dominantOp.optional(),        // classification: the dominant operation, the thing the skill asks you to name
  misreads: z.object({ op: dominantOp, explains: z.string() }).optional(),  // …and the tempting wrong name. EVIDENCED, never invented: present only on the 6 classification skills that cite a mistake
  chunks: z.array(z.string()).default([]),      // chunking: the decomposition, one LaTeX piece per chunk
  // …and the tempting wrong split. ONE alternative decomposition, not a list of
  // them — which is why it pairs at FIELD level while `wrong` pairs per entry.
  misChunks: z.object({ chunks: z.array(z.string()).min(2), explains: z.string() }).optional(),
  requires: z.array(z.string()).default([]),     // DIRECT prerequisite skill ids
  rules: z.array(z.string()).default([]),        // rule ids (rules.json) — the DO/IS sentences this skill teaches
  restsOn: z.array(z.string()).default([]),      // card ids (src/data/layers.ts): the axioms/definitions/theorems it is justified by and the notation conventions (`ix.`) it obeys — which is which is read off the card prefix. Merged 2026-07-24 from the old justifiedBy + governedBy
  conditions: z.string().optional(),    // domain caveat, pure LaTeX
}).transform(s => ({
  ...s,
  // ── `mistakes` IS DERIVED, NEVER AUTHORED (2026-07-30) ───────────────────
  // The union of what this skill's wrong answers explain, in first-appearance
  // order. It replaced an authored `errors: string[]` that said the same thing
  // twice and drifted: five skills cited the nearest available pool entry rather
  // than their actual failure — `root-of-a-product` cited `anti.linearity`, but a
  // student's error there is inaction, and it cites `omi.no-move-attempted` now.
  // Deriving makes that class of mis-wiring unrepresentable.
  //
  // ⚠️ EMPTY IS LEGITIMATE and means the skill shows nothing wrong: the contrast
  // pair (`bracket-types`, `addition-commutative`), which exists so a
  // Same-or-Different session has items whose answer is *same*, and the few
  // deliberate abstentions where the tempting form belongs to a neighbouring
  // skill (the STARTING-FORM rule — what must not repeat across two skills is the
  // form a student starts from, never the mistake, since many starting forms
  // converge on one mistake: `anti.linearity` is reached from four).
  mistakes: [...new Set([
    ...s.wrong.map(w => w.explains),
    ...(s.misreads ? [s.misreads.explains] : []),
    ...(s.misChunks ? [s.misChunks.explains] : []),
  ])],
}))
export type Skill = z.infer<typeof skill>

// ── Groups ───────────────────────────────────────────────────────────────────
// Groups organize skills into ordered sections in the lookup view. Authored
// inline in the per-kind tree files (a group node = { slug, title, blurb?,
// skills[] }); `groups` and `skillKinds` are the flattened registries
// parseSkillTree derives from them (array order = display order). GroupDef is the
// shared { slug, title, blurb? } shape both derived registries use.

// LOCALIZED SINCE 2026-07-29. These titles are section headings on /skills — the
// last page prose that was English-only, and the only reason it was is that the
// registries predate the localization contract. `validateGroupRegistry` compares
// slugs, not titles, so it is unaffected.
export const groupDef = z.object({
  slug: z.string(),
  title: localizedString,
  blurb: localizedString.optional(),
})
export type GroupDef = z.infer<typeof groupDef>

export const groupsFile = z.array(groupDef)
export type GroupsFile = z.infer<typeof groupsFile>

// A derived display registry (the skillKinds list, …) must name exactly the enum
// it titles: no duplicate slug, no unknown slug, no missing title.
function validateGroupRegistry(registry: GroupDef[], allowed: readonly string[], file: string): void {
  const slugs = registry.map(g => g.slug)
  const dup = slugs.find((s, i) => slugs.indexOf(s) !== i)
  if (dup) throw new Error(`Duplicate group slug "${dup}" in ${file}.`)
  const inEnum = new Set<string>(allowed)
  const inReg = new Set(slugs)
  for (const s of inReg) if (!inEnum.has(s)) throw new Error(`${file} lists unknown group "${s}".`)
  for (const s of inEnum) if (!inReg.has(s)) throw new Error(`${file} is missing a title for group "${s}".`)
}

export function validateSkillKinds(registry: GroupDef[]): void {
  validateGroupRegistry(registry, skillKind.options, 'the skill kind files')
}

// ── Rules ────────────────────────────────────────────────────────────────────
// THE DO/IS REGISTRY (renamed from "meta-patterns" 2026-07-27). A flat list of
// student-facing one-liners in rules.json, cited by skills and — from step 2 —
// by errors.
//
// The registry is a COLLECTION OF SENTENCES and nothing more. Their natural home
// is the errors and skills that show them with examples; the list exists only so
// the same sentence is not written into twenty entries. Context therefore comes
// from the citing entity, never from the sentence itself, which is why an entry
// carries no errors, no skills and no ordering of its own.
//
// `summarizes` is KEPT and points at cards only. It is no longer a mechanism —
// the error→rule link is authored now, not derived through it — but a BRIDGE
// CLAIM: this sentence is the student-facing form of those formal statements,
// which is the only way to ask which of the tower's cards have a plain-language
// form yet. It points into another tower, so it cannot cycle.
export const ruleDef = z.object({
  id: z.string().regex(/^rule\.[a-z0-9-]+$/),   // a dotted slug like every other entity; the `meta.` prefix went with the rename
  kind: z.enum(['is', 'do']),             // IS = what a written form MEANS (decoding); DO = what to reach for. 15:1 today, which measures how unbuilt the DO side is
  rule: localizedString,                  // THE SENTENCE — "The fraction bar is a bracket". Was `name`, and it always was the rule
  // THE FORMULA AS DATA (2026-07-28), not buried in the prose. A formulary cannot
  // be typeset out of sentences with maths embedded in them, and a student hunts
  // by formula ("the one about exponents") long before they read 25 sentences.
  // An ARRAY because one sentence can carry several lines worth showing, and a
  // table wants one row each. Empty is legitimate: "A letter is one fixed number"
  // has no formula, and its cell stays empty like any other.
  latex: z.array(z.string()).default([]),
  note: localizedString,                  // its gloss, one sentence with an example. Was `rule`, and it always was the gloss
  summarizes: z.array(z.string()).default([]),  // card ids this sentence digests — a bridge claim, not a link (see above)
  // ── THE SUBJECT AXIS (2026-07-29) ────────────────────────────────────────
  // `family` names the pool this sentence belongs to — "the power laws", "the
  // minus rules" — as the id of the rule that IS that family.
  //
  // WHY IT IS A FIELD AND NOT DERIVED. It used to be read off sheet membership,
  // which conflated two different things: `rule.divide-by-one-and-self` came back
  // as "Zero and one + Fraction laws", but that is *appears on two sheets*, not
  // *belongs to two families*. FAMILY IS ONE, SHEETS ARE MANY — a rule is one
  // kind of thing and may usefully be printed in several places. Deriving it also
  // forced /skills to import from cheatsheets to answer a question about a rule.
  //
  // It is also the axis this pool was missing. Every other curated layer has two
  // classifiers — a register/causal one and a subject one (mistakes: kind +
  // topic; skills: kind + group) — and rules had only `kind: is|do`. That hole is
  // why the family had nowhere to live.
  //
  // ⚠️ ONE LEVEL, NO CHAINS: a family head has no `family` of its own, and
  // validateFamilies enforces it.
  family: z.string().optional(),
  // ── AND THE HEAD SAYS SO (2026-07-30) ────────────────────────────────────
  // A head used to be implicit — "a head is simply a rule somebody names" — which
  // is true and unreadable: 7 of these 59 entries are family heads and NOTHING
  // about a head's own JSON says so. You had to scan all 59 `family` values to
  // find out. It also made a family unauthorable until its first member existed.
  //
  // Now it is declared, and validateFamilies checks BOTH directions: a head must
  // not itself have a `family`, and anything named as a family must be declared a
  // head. Two fields that can disagree are worth it only when the disagreement is
  // caught, and it is.
  head: z.boolean().optional(),
  // ── THE CLASSROOM PHRASING (2026-07-29) ──────────────────────────────────
  // The sticky version a student can SAY: "Punkt vor Strich", "keep, change,
  // flip", "Differenzen und Summen kürzen nur die Dummen". Its job is retention,
  // not classification — which is why it is neither a `family` nor an alias, and
  // why most rules have none.
  //
  // ⚠️ NOT a `localizedString`, and that is the whole point. A localized string
  // promises the SAME content in two languages; a mnemonic does not translate.
  // The English counterpart of "Punkt vor Strich" is not a translation of it, it
  // is a DIFFERENT device (PEMDAS, an acronym, which German does not use). Each
  // language either has one or does not, so both sides are optional and the view
  // must NOT fall back — showing a German reader an English acronym nobody in
  // their classroom says is worse than showing nothing.
  //
  // ⚠️ NEVER INVENT ONE. A mnemonic that exists only here is not a reference
  // point, it is a phrase we made up; the same rule that governs notation. Every
  // entry below is in documented classroom use. German is the richer side, which
  // makes this the first field where the German column leads.
  mnemonic: z.object({ en: z.string().optional(), de: z.string().optional() }).optional(),
})
export type RuleDef = z.infer<typeof ruleDef>

export const rulesFile = z.array(ruleDef)
export type RulesFile = z.infer<typeof rulesFile>

// A layer head like errors.json — title, the student-facing `blurb` (the page
// lede) and the authoring `note` — then the entries. The list stays FLAT: a
// registry of sentences has no structure to give it, and proving the container
// tolerates a flat layer is half of why this one went first.
export const rulesTree = z.object({
  layer: z.literal('rules'),
  title: localizedString,
  blurb: localizedString,
  note: localizedString,
  rules: z.array(ruleDef).min(1),
})
export interface RuleTree {
  meta: { title: LocalizedString; blurb: LocalizedString; note: LocalizedString }
  rules: RulesFile
}
export function parseRuleTree(raw: unknown): RuleTree {
  const r = rulesTree.safeParse(raw)
  if (!r.success) throw new Error(`Invalid rules file:\n${z.prettifyError(r.error)}`)
  const { title, blurb, note, rules } = r.data
  return { meta: { title, blurb, note }, rules }
}

// ── Mistakes ─────────────────────────────────────────────────────────────────
// THE ANTI-REGISTRY (2026-07-28) — the negative face of the rules pool, and the
// same kind of object: a flat collection of general sentences that carry no
// context of their own, given meaning only by what cites them.
//
// WHY IT IS A POOL AND NOT A LAYER. `anti.linearity` is not an example, it is a
// SENTENCE: "every operation spreads over a plus". Modelling it as an entry with
// instances bolted on is what made its 10 citing skills look like duplication —
// a pool entry cited ten times is ordinary (`rule.dominant-op-last` is cited by
// 13 and nobody calls that a defect). The instances are examples and belong to
// the skills; the sentence belongs here.
//
// WHY IT IS NOT A `not:` FIELD ON A RULE. Measured: six rules are broken by two
// or three DISTINCT misconceptions each — `rule.only-multiplication-distributes`
// by `mis.bracket-dissolved` (bracket erased), `anti.linearity` (wrong operation
// spreads) and `anti.partial-distribution` (right operation, stops early). Each
// has its own frequency, its own cards and its own examples. A field on the rule
// could name one of them.
//
// HOW IT DIFFERS FROM ruleDef, in order of weight:
//   `breaks`     THE STRUCTURAL DIFFERENCE. A rule points only DOWN into the
//                tower (`summarizes`); a mistake points down (`corrupts`) AND
//                SIDEWAYS into the rules pool. It is the one place in this design
//                where one pool cites another, which is why "same level as rules"
//                is not quite right — mistakes sit half a level above. Still a
//                DAG: mistakes → rules → cards.
//   `frequency`  Can live nowhere else. A rule is not more or less true; a
//                mistake is more or less MADE, and the number is evidence from
//                docs/common_mistakes.md, gathered per misconception.
//   `kind`       Four values and a different question. A rule's `is|do` is a
//                REGISTER (decoding vs doing); a mistake's kind is a CAUSAL
//                taxonomy — a wrong rule applied (anti-law), a glyph misparsed
//                (misreading), the wrong thing looked at (salience), or a step
//                simply not taken (omission). Not parallel to is|do.
//                ⚠️ `omission` (2026-07-29) is the one kind that writes NOTHING
//                FALSE: `a + -b` equals `a + (-b)` and `(ab)c` equals `abc`, so
//                the answer is right and only the writing is poor. That is why
//                both entries refuse the ✗/✓ format and why their sentence only
//                works as "Don't …" — the failure is inaction, and it costs
//                fluency rather than correctness. It was found twice
//                independently: by the a/b/c mechanism analysis and by which
//                sentences refused the "A is not B" mood.
//   `topic`      Kept from the errors tree. A student arrives at a mistake by
//                topic ("I keep messing up fractions") in a way nobody arrives at
//                a rule, so the file stays flat like rules.json and the VIEW
//                sections by this field — the same trick /skills plays with
//                `group`. (errors.json's tree was section → exactly one group →
//                errors in all seven sections, so the group level was vestigial
//                and nothing is lost by flattening.)
//   `latex`      Same field, INVERTED CONTRACT: on a rule it is the true formula,
//                here every entry is a FALSE CLAIM, rendered under a ✗. Which is
//                also where the six `\neq` lines currently squatting in
//                `rule.latex` belong.
//
// WHAT IT DELIBERATELY DOES NOT TAKE from errors.json: `instances` and `fix`.
// Both work a CASE, and a case belongs to the skill that teaches it.
export const mistakeDef = z.object({
  id: z.string().regex(/^(anti|mis|sal|omi)\.[a-z0-9-]+$/),  // ids are UNCHANGED from errors.json, so a skill's `explains` resolves here without touching a single skill
  kind: z.enum(['anti-law', 'misreading', 'salience', 'omission']),
  // ── THE FAMILY AXIS (2026-07-30), the same mechanism as a rule's ──────────
  // `kind` turned out to be too coarse to be the family. `anti.linearity` and
  // `anti.partial-distribution` are both anti-laws and are not the same failure
  // at all: one INVENTED a move, the other made the right move and stopped early.
  // The family is that missing level, and it is what makes an error message read
  // the way a teacher says it — "Forced move · Don't spread a power or a root
  // over a plus" — exactly as /rules already prints "Power laws · …".
  //
  // ⚠️ A HEAD HAS NO `topic`, which is why that field is now optional. A family
  // cuts ACROSS topics: forced moves happen in distributing, fractions, powers
  // and terms alike, so naming one would be a lie. A rule never hit this because
  // a rule has no topic.
  //
  // ⚠️ `frequency` ON A HEAD IS MEANINGLESS — a family is not made more or less
  // often, its members are. Views must not rank heads by it.
  family: z.string().optional(),
  head: z.boolean().optional(),
  topic: z.string().optional(),
  frequency: z.number().int().min(1).max(3).default(1),
  mistake: localizedString,               // THE FALSE SENTENCE, stated as the student holds it — "Every minus is a subtraction", not "Losing one of two minuses". The error layer names the mistake from outside; a pool entry states it from inside, so it reads as a claim that can be marked ✗ exactly as a rule reads as one that can be marked ✓
  latex: z.array(z.string()).default([]), // the false claim(s). Empty is legitimate: the two salience mistakes and the adjacent-signs omission have no expressible schema
  note: localizedString,                  // the diagnosis — mechanism and cause, which was always a statement about the misconception rather than about one case of it
  breaks: z.array(z.string()).default([]),    // rule ids
  corrupts: z.array(z.string()).default([]),  // card ids
})
export type MistakeDef = z.infer<typeof mistakeDef>

const mistakesTree = z.object({
  layer: z.literal('mistakes'),
  title: localizedString,
  blurb: localizedString,
  note: localizedString,
  mistakes: z.array(mistakeDef).min(1),
})
export interface MistakeTree {
  meta: { title: LocalizedString; blurb: LocalizedString; note: LocalizedString }
  mistakes: MistakeDef[]
}
export function parseMistakeTree(raw: unknown): MistakeTree {
  const r = mistakesTree.safeParse(raw)
  if (!r.success) throw new Error(`Invalid mistakes file:\n${z.prettifyError(r.error)}`)
  const { title, blurb, note, mistakes } = r.data
  return { meta: { title, blurb, note }, mistakes }
}

/** Every edge a mistake claims must land: the rule it breaks, and the cards it
 *  corrupts. A pool entry owns nothing else, so a dangling reference is the only
 *  way it can be wrong. */
export function validateMistakeRefs(
  mistakes: MistakeDef[], rules: RulesFile, cardIds: Set<string>,
): void {
  const ruleIds = new Set(rules.map(r => r.id))
  for (const m of mistakes) {
    for (const r of m.breaks) {
      if (!ruleIds.has(r)) throw new Error(`Mistake "${m.id}" breaks unknown rule "${r}".`)
    }
    for (const c of m.corrupts) {
      if (!cardIds.has(c)) throw new Error(`Mistake "${m.id}" corrupts unknown card "${c}".`)
    }
  }
}

// ── Cheat sheets ─────────────────────────────────────────────────────────────
// PRESENTATION OVER THE RULES POOL (2026-07-28), owning nothing. A sheet groups
// and orders sentences that already exist in rules.json.
//
// The split is the design: whether a sentence belongs in the pool is editorial
// ("should a student know this?"), while which sheet it lands on and where is a
// later question, answerable more than once for the same sentence. Putting the
// grouping inside a rule — a `contains` field — was drafted and rejected: it
// mixes layout into the content pool and lets a sentence belong to only one
// parent.
//
// A rule therefore never refers to another rule. Nothing in rules.json knows a
// sheet exists.
const sheetGroup = z.object({
  // A PLAIN TITLE, always. A heading is the teacher's arrangement of the sheet,
  // and a sheet may group loosely related rules by preference — so a heading is
  // presentation and never a pool entry. Only the SHEET's own family name is a
  // rule, because that is what a mistake cites ("use the power laws"). Group
  // headings were briefly allowed to be rules too; `rule.same-base-laws` then
  // sat in the pool one word from `rule.same-base` and read as a duplicate.
  title: localizedString,
  // TWO VALUES ON PURPOSE. `flow` fills columns left to right; `table` puts one
  // row per rule and one column per `latex` index, which is what makes an
  // algebraic form and its root form line up. A third value would be the start
  // of a layout language, which was considered and rejected.
  layout: z.enum(['flow', 'table']).default('flow'),
  rules: z.array(z.string()).min(1),
})

export const sheetDef = z.object({
  id: z.string().regex(/^sheet\.[a-z0-9-]+$/),
  /** The pool sentence that heads it — and the sheet's citable identity, since
   *  an error naming "the power laws" cites the rule, not the sheet. */
  rule: z.string(),
  groups: z.array(sheetGroup).min(1),
})
export type SheetDef = z.infer<typeof sheetDef>

const sheetsTree = z.object({
  layer: z.literal('cheatsheets'),
  title: localizedString,
  blurb: localizedString,
  note: localizedString,
  sheets: z.array(sheetDef).min(1),
})
export interface SheetTree {
  meta: { title: LocalizedString; blurb: LocalizedString; note: LocalizedString }
  sheets: SheetDef[]
}
export function parseSheetTree(raw: unknown): SheetTree {
  const r = sheetsTree.safeParse(raw)
  if (!r.success) throw new Error(`Invalid cheatsheets file:\n${z.prettifyError(r.error)}`)
  const { title, blurb, note, sheets } = r.data
  return { meta: { title, blurb, note }, sheets }
}

/** A family must resolve, must not be the rule itself, and must not itself have
 *  a family — one level, no chains, so "which family is this in" is always one
 *  lookup. There is no separate "is a head" flag: a head is simply a rule
 *  somebody names, and its `rule` sentence IS the label, which is why it is a
 *  bare name ("Power laws") while its `note` carries why the family coheres. */
export function validateFamilies(
  entries: { id: string; family?: string; head?: boolean }[], what: string,
): void {
  const byId = new Map(entries.map(r => [r.id, r]))
  for (const r of entries) {
    if (r.head && r.family) {
      throw new Error(`${what} "${r.id}" is declared a head and also has a family — families are one level deep.`)
    }
    if (!r.family) continue
    const head = byId.get(r.family)
    if (!head) throw new Error(`${what} "${r.id}" has unknown family "${r.family}".`)
    if (r.family === r.id) throw new Error(`${what} "${r.id}" is its own family.`)
    if (head.family) throw new Error(`Family "${r.family}" itself has a family — families are one level deep.`)
    // THE SECOND DIRECTION, and the whole reason `head` exists: being named as a
    // family is not enough to be one, or the flag would be decorative and could
    // silently disagree with the data it describes.
    if (!head.head) throw new Error(`${what} "${r.id}" names family "${r.family}", which is not declared a head.`)
  }
}

export function validateRuleFamilies(rules: RulesFile): void {
  validateFamilies(rules, 'Rule')
}

/** Every rule a sheet names must exist — a sheet owns nothing, so a dangling
 *  reference is the only way it can be wrong. */
export function validateSheetRefs(sheets: SheetDef[], rules: RulesFile): void {
  const ids = new Set(rules.map(r => r.id))
  for (const s of sheets) {
    if (!ids.has(s.rule)) throw new Error(`Sheet "${s.id}" is headed by unknown rule "${s.rule}".`)
    for (const g of s.groups) {
      for (const r of g.rules) {
        if (!ids.has(r)) throw new Error(`Sheet "${s.id}" lists unknown rule "${r}".`)
      }
    }
  }
}

// Cross-check: every rule a skill references must exist; ids are globally unique.
export function validateRuleRefs(skills: Skill[], rules: RulesFile): void {
  const dupId = rules.map(m => m.id).find((id, i, a) => a.indexOf(id) !== i)
  if (dupId) throw new Error(`Duplicate rule id "${dupId}".`)

  const ids = new Set(rules.map(m => m.id))
  for (const f of skills) {
    for (const m of f.rules) {
      if (!ids.has(m)) {
        throw new Error(`Skill "${f.id}" references unknown rule "${m}".`)
      }
    }
  }
}

export const errorKind = z.enum(['anti-law', 'misreading', 'salience', 'omission'])
export type ErrorKind = z.infer<typeof errorKind>

// An INSTANCE is one concrete wrong→right pair — the unit the /errors page shows a
// student and the unit `WrongRight.vue` renders. `wrong` is ALWAYS a false claim;
// `from` and `right` are the shorthand for the common case where that claim is an
// equation with a shared left-hand side, so the two candidates can be stacked
// against an invariant stem (`(a+b)^2` ✗ `a^2+b^2` / ✓ `a^2+2ab+b^2`).
//
// Three shapes fall out of that, all authored, none derivable (a card states the
// general law; the correction of a specific instance usually lives on a DIFFERENT
// card than the one the error `corrupts` — see docs/TODO.md):
//   rewrite  — from + wrong + right       the common case
//   dead end — from + wrong + hint        the right move is "none": no rule applies,
//                                         or the term was already finished
//   belief   — wrong (a `\neq` claim) + hint
//               the student thinks two equal forms differ; nothing was transformed,
//               so there is no stem and no rewrite, only a false claim to deny.
export const errorInstance = z.object({
  from: z.string().optional(),    // the shared stem, KaTeX; absent = the claim stands alone
  wrong: z.string(),              // the false claim / the wrong continuation, KaTeX
  right: z.string().optional(),   // the correction, KaTeX
  hint: localizedString.optional(),  // prose correction — required when `right` cannot say it
})
export type ErrorInstance = z.output<typeof errorInstance>

export const errorDef = z.object({
  id: z.string().regex(/^(anti|mis|sal|omi)\.[a-z0-9-]+$/),  // the single identifier — a dotted slug
  kind: errorKind,                 // cross-cuts `topic`, so it stays a field, not a tree level
  topic: z.string(),               // POSITIONAL — the section slug, re-attached by parseErrorTree
  frequency: z.number().int().min(1).max(3).default(1),  // ★–★★★, from docs/common_mistakes.md
  corrupts: z.array(z.string()).default([]),
  // THE RULE THIS MISTAKE IS THE COUNTEREXAMPLE TO (authored 2026-07-27,
  // rules.json). It replaced a derivation — `corrupts` ∩ a rule's `summarizes`,
  // first two — which is fine for "related reading" and wrong for the sentence a
  // student reads first: it guessed, it capped, and it could not be overruled.
  // Ordered, most useful first. Empty is legitimate and visible: 9 of 28 have no
  // sentence yet, and all but two of those are anti-laws, whose general form is a
  // LAW in the tower (reachable via `corrupts`) that nobody has written as a
  // student-facing one-liner.
  rules: z.array(z.string()).default([]),
  name: localizedString,
  // TWO PROSE FIELDS, two readers (2026-07-25). `name` says WHICH mistake this is;
  // `fix` says HOW TO GET IT RIGHT, in a 15-year-old's language, and is the entry's
  // main prose in presentation mode. `note` is the DIAGNOSIS — the mechanism, the
  // cause, why the error exists in the taxonomy — written for a teacher and shown
  // in inspection only. It is not student prose and rewriting it in place would
  // have deleted the better material ("$3x$ read as $3+x$ — the mixed-number
  // carryover" names a cause no student needs and no teacher should lose).
  //
  // `fix` vs the rule: the rule is the general decoding sentence
  // shared across many errors, `fix` is the concrete one for THIS mistake. Where
  // they would coincide, keep `fix` concrete ("two minuses make a plus") and let
  // the rule carry the general form. 7 of the 28 errors reach no rule at all.
  fix: localizedString,
  note: localizedString,
  instances: z.array(errorInstance).min(1),     // see above; at least one, enforced so a
})                                              // bare error cannot silently reach the page
export type ErrorDef = z.output<typeof errorDef>

const errorPrefixOfKind: Record<ErrorKind, string> =
  { 'anti-law': 'anti.', misreading: 'mis.', salience: 'sal.', omission: 'omi.' }

// `cardIds` is the set of fundament-tower card ids (src/data/layers.ts). Since
// 2026-07-23 the legacy laws.json / conventions.json are gone and every error's
// `corrupts` target is a card there — an anti-law corrupts a law card, a misreading
// a convention card, and (since 2026-07-24) a salience error a structure card. Every
// error kind now points straight into the tower: the curated layers form a clean
// downward stack (cards ← errors ← skills, and rules ← both) with no upward edges.
export function validateErrors(
  errors: ErrorDef[], cardIds: Set<string>,
): void {
  const poolOfKind: Record<ErrorKind, { ids: Set<string>; name: string }> = {
    'anti-law': { ids: cardIds, name: 'law card' },
    misreading: { ids: cardIds, name: 'convention card' },
    salience: { ids: cardIds, name: 'structure card' },
    omission: { ids: cardIds, name: 'convention card' },
  }
  const seen = new Set<string>()
  for (const e of errors) {
    if (seen.has(e.id)) throw new Error(`Duplicate error id "${e.id}".`)
    seen.add(e.id)
    if (!e.id.startsWith(errorPrefixOfKind[e.kind])) {
      throw new Error(`Error "${e.id}" has kind "${e.kind}" but a mismatching id prefix.`)
    }
    const pool = poolOfKind[e.kind]
    for (const r of e.corrupts) {
      if (!pool.ids.has(r)) throw new Error(`Error "${e.id}" corrupts unknown ${pool.name} "${r}".`)
    }
    // The ✗ must never be shown without its ✓. An instance with neither `right`
    // nor `hint` would render as an unanswered wrong form — the one thing the
    // research on incorrect worked examples says not to do.
    e.instances.forEach((x, i) => {
      if (!x.right && !x.hint) {
        throw new Error(`Error "${e.id}" instances[${i}] has no correction: give it "right" or "hint".`)
      }
    })
  }
}

// ── Error tree file ──────────────────────────────────────────────────────────
// Errors are authored as ONE containment tree, the same shape as a fundament
// layer (`layer → sections[] → groups[] → entries[]`, page order = array order at
// every level) — see src/data/layers.ts. The sections are TOPICS, not kinds: a
// topic is how a student looks a mistake up ("I keep messing up fractions"),
// whereas `kind` (anti-law / misreading / salience) cross-cuts it — the `minus`
// topic holds three misreadings and an anti-law — so kind stays a field on the
// entry and is shown in inspection mode only. `topic` is POSITIONAL and injected
// here, exactly as parseSkillTree injects kind/group.
//
// The group level is kept even though every topic currently has a single
// anonymous group: that is precisely how the `terms` layer is authored, and it
// leaves room to sub-group a topic later without a schema change.
const errorGroupNode = z.object({
  slug: z.string(),
  title: localizedString.optional(),
  blurb: localizedString.optional(),
  errors: z.array(z.record(z.string(), z.unknown())).min(1),
})
const errorSectionNode = z.object({
  slug: z.string(),
  title: localizedString,
  blurb: localizedString.optional(),
  groups: z.array(errorGroupNode).min(1),
})
export const errorTreeFile = z.object({
  layer: z.literal('errors'),
  title: localizedString,
  blurb: localizedString,   // the student-facing lede
  note: localizedString,    // the authoring/inspection note
  sections: z.array(errorSectionNode).min(1),
})
export type ErrorSection = z.output<typeof errorSectionNode>

export interface ErrorTree {
  meta: { title: LocalizedString; blurb: LocalizedString; note: LocalizedString }
  errors: ErrorDef[]                                    // flat, in tree order
  sections: { slug: string; title: LocalizedString; blurb?: LocalizedString; errors: ErrorDef[] }[]
}

export function parseErrorTree(raw: unknown): ErrorTree {
  const parsed = errorTreeFile.safeParse(raw)
  if (!parsed.success) throw new Error(`Invalid errors file:\n${z.prettifyError(parsed.error)}`)
  const f = parsed.data

  const seenSlug = new Set<string>()
  const sections = f.sections.map(s => {
    if (seenSlug.has(s.slug)) throw new Error(`errors: duplicate section slug "${s.slug}"`)
    seenSlug.add(s.slug)
    const errors = s.groups.flatMap(g => g.errors.map(e => {
      const result = errorDef.safeParse({ ...e, topic: s.slug })
      if (!result.success) {
        const id = (e as { id?: string })?.id ?? `(no id) in section ${s.slug}`
        throw new Error(`Invalid error "${id}":\n${z.prettifyError(result.error)}`)
      }
      return result.data
    }))
    return { slug: s.slug, title: s.title, blurb: s.blurb, errors }
  })

  return {
    meta: { title: f.title, blurb: f.blurb, note: f.note },
    errors: sections.flatMap(s => s.errors),
    sections,
  }
}

// ── Cross-layer references from skills and rules ──────────────────────────
// The bridge into the fundament tower: `restsOn` is now card ids (was the two
// arrays justifiedBy/governedBy, merged 2026-07-24 — law vs convention is read off
// the card prefix), `errors` → error patterns, and a rule `summarizes` card
// ids. Every curated cross-edge points down into the tower — errors and rules
// cite only cards, skills cite all three — so the graph is a clean stack with no
// cycles. `cardIds` comes from src/data/layers.ts. This is the runtime twin of
// scripts/sweep-layers.mjs.
export function validateLayerRefs(
  skills: Skill[], rules: RulesFile,
  cardIds: Set<string>, errors: ErrorDef[], mistakes: MistakeDef[] = [],
): void {
  // ⚠️ RESOLVED AGAINST THE POOL, NOT THE ERROR LAYER (2026-07-30). The ids are
  // shared, so this was the same set until the pool gained entries errors.json
  // cannot express: `errorInstance.wrong` is REQUIRED, and an inactivity mistake
  // writes nothing at all. `mistakes.json` is what a skill's `explains` means.
  const errIds = new Set([...errors.map(e => e.id), ...mistakes.map(m => m.id)])

  for (const f of skills) {
    for (const r of f.restsOn) {
      if (!cardIds.has(r)) throw new Error(`Skill "${f.id}" restsOn unknown card "${r}".`)
    }
    for (const r of f.mistakes) {
      if (!errIds.has(r)) throw new Error(`Skill "${f.id}" explains unknown mistake "${r}".`)
    }
  }
  for (const m of rules) {
    for (const r of m.summarizes) {
      if (!cardIds.has(r)) {
        throw new Error(`Rule ${m.id} summarizes unknown card "${r}".`)
      }
    }
  }
  const ruleIds = new Set(rules.map(m => m.id))
  for (const e of errors) {
    for (const r of e.rules) {
      if (!ruleIds.has(r)) throw new Error(`Error "${e.id}" cites unknown rule "${r}".`)
    }
  }
}

// ── Matrix audit ─────────────────────────────────────────────────────────────
// The completeness report, not a validator: which skills have no coordinates
// yet, and which cards / error patterns no skill uses. An empty
// cell is a QUESTION (gap, or deliberately inert?), never automatically an
// error — so this warns, it does not throw.

export function auditCoverage(
  skills: Skill[], rules: RulesFile, errors: ErrorDef[],
  cardConds: Map<string, string | undefined> = new Map(),
  sheets: SheetDef[] = [],
): string[] {
  const lines: string[] = []
  const untagged = skills.filter(f => f.restsOn.length === 0)
  if (untagged.length > 0) {
    lines.push(`${untagged.length}/${skills.length} skills have no layer coordinates yet (restsOn).`)
  }

  // A skill's `conditions` should hold only caveats its cited cards don't already
  // carry (content_model design decision 5): if it restates a cited card's `cond`
  // verbatim (whitespace/LaTeX-spacing normalized), the domain is already inherited
  // via restsOn, so the restatement is redundant — inherit instead.
  const norm = (s: string) => s.replace(/\\[,;: ]|\s+/g, '')
  for (const f of skills) {
    if (!f.conditions) continue
    const dup = f.restsOn.find(r => {
      const c = cardConds.get(r)
      return c !== undefined && norm(c) === norm(f.conditions!)
    })
    if (dup) lines.push(`"${f.id}" restates a condition already on card "${dup}" — inherit via restsOn instead.`)
  }

  // Authored ⊆ derived: on a tagged skill, every authored rule should
  // be reachable from the skill's coordinates via the pattern's summarizes.
  // (Authored stays curation — this only catches a missing tag or a
  // rule citation that doesn't fit the skill.) Since 2026-07-24 a
  // a rule summarizes CARDS only, so the skill's coordinates are its card
  // ids: `restsOn`, plus the cards its errors corrupt (the two lenses meet at the
  // tower — skill → error → card mirrors skill → meta → card).
  const corruptsOf = new Map(errors.map(e => [e.id, e.corrupts]))
  for (const f of skills) {
    if (f.restsOn.length === 0) continue
    const coords = new Set([
      ...f.restsOn,
      ...f.mistakes.flatMap(eid => corruptsOf.get(eid) ?? []),
    ])
    const unsupported = f.rules.filter(mid => {
      const mp = rules.find(m => m.id === mid)
      // A rule with NO `summarizes` can be neither supported nor unsupported —
      // it has no tower bridge to check against, so asking the question of it is
      // meaningless and the answer was a permanent false positive. Eight of the
      // 57 are like that: the six family names, plus `dominant-op-tools` and
      // `unlike-terms-stay`, which are strategy sentences rather than digests of
      // a card. Their lack of a bridge is the COVERAGE question's business, one
      // audit line down; this line asks something else.
      return mp !== undefined && mp.summarizes.length > 0 && !mp.summarizes.some(r => coords.has(r))
    })
    if (unsupported.length > 0) {
      lines.push(`"${f.id}" declares rules its coordinates don't support: ${unsupported.join(', ')}`)
    }
  }
  // ── Coverage, both directions ──────────────────────────────────────────────
  // The skill layer is the INTERVENTION and the error layer is the EVIDENCE, so
  // the two should account for each other. Neither direction is a validator: an
  // empty cell is a question, and the three usual answers are different repairs.
  //
  // A rule nothing cites is dead weight: context is the only thing that gives a
  // sentence meaning, so with no error and no skill behind it there is none to
  // give. REACH AS GARBAGE COLLECTION — never as an admission test, since what
  // belongs in the registry is whatever turns out to be important, however
  // narrowly it is used.
  const citedRules = new Set([...skills.flatMap(f => f.rules), ...errors.flatMap(e => e.rules)])
  const orphaned = rules.filter(m => !citedRules.has(m.id))
  if (orphaned.length > 0) {
    lines.push(`Rules cited by no error and no skill (${orphaned.length}): ${orphaned.map(m => m.id).join(', ')}`)
  }

  // ── THE SHEET COVERAGE QUESTION (2026-07-29) ──────────────────────────────
  // A cheat sheet is what a student orients by, so a rule PRINTED on one that no
  // skill teaches is something they are told to know and never get to practise.
  // Reported per sheet, not in one lump: the answer differs sharply by sheet and
  // a single number hides which sheet is hollow.
  //
  // ⚠️ A QUESTION, NEVER A CHECK, and it should STAY non-zero. A sheet is
  // legitimately broader than a drill curriculum — a formulary may carry a rule
  // for reference that nothing drills — so this weighs a gap, it does not
  // condemn one. Promoting it to a validator would force skills into existence
  // to satisfy an arithmetic rather than a student.
  const taughtRules = new Set(skills.flatMap(f => f.rules))
  const perSheet = sheets.map(sh => {
    const printed = [...new Set(sh.groups.flatMap(g => g.rules))]
    return { id: sh.id.replace('sheet.', ''), miss: printed.filter(r => !taughtRules.has(r)).length, n: printed.length }
  })
  const hollow = perSheet.filter(x => x.miss > 0)
  if (hollow.length > 0) {
    // The headline counts DISTINCT rules: four sit on two sheets each, and
    // summing the per-sheet figures would count those twice and overstate it.
    const allPrinted = [...new Set(sheets.flatMap(sh => sh.groups.flatMap(g => g.rules)))]
    const miss = allPrinted.filter(r => !taughtRules.has(r)).length
    lines.push(`Sheet rules no skill teaches (${miss} of ${allPrinted.length}): `
      + hollow.sort((a, b) => b.miss / b.n - a.miss / a.n).map(x => `${x.id} ${x.miss}/${x.n}`).join(' · '))
  }

  // Rules: two questions, both inherited from the derivation the authored
  // `error.rules` replaced (2026-07-27). That derivation was always better at
  // SUGGESTING than at deciding — it is what turned up the five missing reading
  // rules — so it survives here rather than in the page.
  //   a. errors with no sentence at all, frequency-ranked;
  //   b. errors whose corrupted cards ARE summarized by a rule they do not cite,
  //      which is either a missed reference or a deliberate rejection.
  const ruled = errors.filter(e => e.rules.length === 0).sort((a, b) => b.frequency - a.frequency)
  if (ruled.length > 0) {
    lines.push(`Errors citing no rule (${ruled.length}): ` +
      ruled.map(e => `${'\u2605'.repeat(e.frequency)} ${e.id}`).join(', '))
  }
  const suggested = errors
    .map(e => {
      const cards = new Set(e.corrupts)
      const hit = rules.filter(m => m.summarizes.some(c => cards.has(c)) && !e.rules.includes(m.id))
      return hit.length ? `${e.id} → ${hit.map(m => m.id).join(', ')}` : null
    })
    .filter((x): x is string => x !== null)
  if (suggested.length > 0) {
    lines.push(`Rules an error's cards reach but it does not cite (${suggested.length}): ${suggested.join(' | ')}`)
  }

  // Direction 1 — errors nothing drills. Frequency-ranked, because a ★★★ mistake
  // with no skill is a curriculum hole and a ★ one may just be rare.
  const citedErrs = new Set(skills.flatMap(f => f.mistakes))
  const undrilled = errors.filter(e => !citedErrs.has(e.id)).sort((a, b) => b.frequency - a.frequency)
  if (undrilled.length > 0) {
    lines.push(`Errors no skill drills (${undrilled.length}): ` +
      undrilled.map(e => `${'★'.repeat(e.frequency)} ${e.id}`).join(', '))
  }

  // Direction 2 — skills no error justifies. Seed with every skill that names an
  // error (directly, or through a drill pitfall's `explainedBy`), then close
  // DOWNWARD over `requires`: a prerequisite of a justified skill is justified,
  // which is what keeps the fluency tier honest without demanding an error per
  // skill. Whatever is left over is a QUESTION with three known answers, and they
  // call for opposite repairs — see docs/TODO.md:
  //   · the error exists but the skill does not cite it        → wire it
  //   · the error was never authored                           → author it
  //   · the skill is a CONTRAST (the true-form twin of a wrong
  //     one, e.g. the commutativity pair against
  //     anti.commute-everything) and will never own an error   → it stays listed,
  //     and the `pure contrast` chip on /skills names it rather than counting it
  //     as work outstanding
  const byId = new Map(skills.map(s => [s.id, s]))
  const justified = new Set(skills.filter(f => f.mistakes.length > 0).map(f => f.id))
  for (let grew = true; grew;) {
    grew = false
    for (const id of [...justified]) {
      for (const r of byId.get(id)?.requires ?? []) {
        if (byId.has(r) && !justified.has(r)) { justified.add(r); grew = true }
      }
    }
  }
  const unjustified = skills.filter(f => !justified.has(f.id))
  if (unjustified.length > 0) {
    lines.push(`Skills no error reaches (${unjustified.length}/${skills.length}, incl. via requires): ` +
      unjustified.map(f => f.id).join(', '))
  }

  // Prose format contract: text with inline $…$ KaTeX. Improvised unicode
  // math in prose (2x², √, ÷ …) predates the contract; count what remains
  // to migrate. Conditions are excluded — they are pure LaTeX, not prose.
  const unicodeMath = /[²³¹⁰ⁿ⁻√÷×·−≠≥≤½]/
  const locVals = (ls?: LocalizedString): string[] => ls ? [ls.en, ls.de ?? ''] : []
  const countDirty = (fields: string[][]) => fields.filter(f => f.some(s => unicodeMath.test(s))).length
  const dirty = {
    'skill notes': countDirty(skills.map(f => locVals(f.note))),
    'error notes': countDirty(errors.map(e => locVals(e.note))),
    'rule sentences': countDirty(rules.map(m => locVals(m.rule))),
  }
  const parts = Object.entries(dirty).filter(([, n]) => n > 0).map(([k, n]) => `${k}: ${n}`)
  if (parts.length > 0) lines.push(`Prose fields with unmigrated unicode math (→ inline $…$): ${parts.join(', ')}`)
  return lines
}

// ── Skill links: requires (skill-level) + revise (pitfall-level) ──────────
// `requires` lists a skill's direct prerequisites; `revise` on a pitfall names
// the skills that train the specific discrimination that error reveals. Both
// hold skill ids and must resolve; the requires graph must be acyclic — the
// only ordering a skill carries (a dependency partial order, not a sequence).

/** A wrong reading with no right reading beside it is the one thing the ✗/✓
 *  contract forbids — the same rule that makes `instances` require `right` or
 *  `hint`, and that keeps the marks on /skills coming as a pair or not at all. */
export function validateReadings(skills: Skill[]): void {
  for (const f of skills) {
    if (f.misreads && !f.answer) {
      throw new Error(`Skill "${f.id}" has a misreads but no answer.`)
    }
    if (f.misChunks && f.chunks.length === 0) {
      throw new Error(`Skill "${f.id}" has misChunks but no chunks.`)
    }
  }
}

export function validateSkillLinks(skills: Skill[]): void {
  const byId = new Map(skills.map(f => [f.id, f]))

  for (const f of skills) {
    for (const r of f.requires) {
      if (!byId.has(r)) throw new Error(`Skill "${f.id}" requires unknown skill "${r}".`)
    }
  }

  // Acyclicity of `requires` (DFS, reporting the cycle path).
  const state = new Map<string, 'visiting' | 'done'>()
  function visit(id: string, path: string[]): void {
    if (state.get(id) === 'done') return
    if (state.get(id) === 'visiting') {
      throw new Error(`Cycle in requires: ${[...path, id].join(' → ')}`)
    }
    state.set(id, 'visiting')
    for (const r of byId.get(id)!.requires) visit(r, [...path, id])
    state.set(id, 'done')
  }
  for (const f of skills) visit(f.id, [])
}

// ── LaTeX compile check ──────────────────────────────────────────────────────
// Every latex field and every inline $…$ segment in prose must compile. The
// views render with throwOnError: false, so a typo'd escape would otherwise
// show up as red mush in some card — this fails loudly at load time with the
// owning id and field named instead.

const mathSegments = (s: string): string[] =>
  [...s.matchAll(/\$([^$]+)\$/g)].map(m => m[1])

function proseMath(ls?: LocalizedString): string[] {
  return ls ? [ls.en, ls.de ?? ''].flatMap(mathSegments) : []
}

export function validateLatexCompiles(
  skills: Skill[], rules: RulesFile, errors: ErrorDef[],
): void {
  const failures: string[] = []
  function check(owner: string, field: string, latex: string): void {
    try {
      katex.renderToString(latex, { throwOnError: true })
    } catch (e) {
      failures.push(`${owner} ${field}: ${(e as Error).message}`)
    }
  }

  for (const f of skills) {
    if (f.conditions) check(f.id, 'conditions', f.conditions)
    if (f.illustration) check(f.id, 'illustration', f.illustration)
    f.wrong.forEach((w, i) => { if (w.latex) check(f.id, `wrong[${i}]`, w.latex) })
    if (f.misChunks) f.misChunks.chunks.forEach((c, i) => check(f.id, `misChunks[${i}]`, c))
    f.chunks.forEach((c, i) => check(f.id, `chunks[${i}]`, c))
    for (const m of proseMath(f.note)) check(f.id, 'note', m)
  }
  for (const e of errors) {
    e.instances.forEach((x, i) => {
      if (x.from) check(e.id, `instances[${i}].from`, x.from)
      check(e.id, `instances[${i}].wrong`, x.wrong)
      if (x.right) check(e.id, `instances[${i}].right`, x.right)
      proseMath(x.hint).forEach(m => check(e.id, `instances[${i}].hint`, m))
    })
    proseMath(e.fix).forEach(m => check(e.id, 'fix', m))
    proseMath(e.note).forEach(m => check(e.id, 'note', m))
  }
  for (const m of rules) {
    proseMath(m.rule).forEach(s => check(m.id, 'rule', s))
    proseMath(m.note).forEach(s => check(m.id, 'note', s))
    m.latex.forEach((l, i) => check(m.id, `latex[${i}]`, l))
  }

  if (failures.length > 0) {
    throw new Error(`LaTeX compile failures:\n${failures.join('\n')}`)
  }
}

// Every id must be unique. The kind/prefix agreement check went with the prefix
// itself (2026-07-30): an id says only WHICH skill this is, never what kind it is,
// so there is nothing left for the two to disagree about. The slug must therefore
// be unique across ALL kinds, not just within one file — which was checked before
// the rename and holds.
export function validateUniqueIds(skills: Skill[]): void {
  const seen = new Set<string>()
  for (const f of skills) {
    if (seen.has(f.id)) throw new Error(`Duplicate skill id "${f.id}".`)
    seen.add(f.id)
  }
}

// Validate an array of raw JSON skills, with the offending id in any error.
export function parseSkills(raw: unknown[]): Skill[] {
  return raw.map((entry, i) => {
    const result = skill.safeParse(entry)
    if (!result.success) {
      const id = (entry as { id?: string })?.id ?? `index ${i}`
      throw new Error(`Invalid skill "${id}":\n${z.prettifyError(result.error)}`)
    }
    return result.data
  })
}

// ── Skill tree files (one per kind) ───────────────────────────────────────────
// Since 2026-07-24 skills are authored as one file per KIND, mirroring the
// fundament tower's one-file-per-layer containment tree: `kind → groups[] →
// skills[]`. `kind` and `group` are POSITIONAL — a skill body in the file carries
// neither — and re-injected at load, so the runtime Skill keeps both fields while
// the two side registries (skillGroups.json / skillKinds.json) are gone: their
// titles and display order now live inline in the tree. `groups` (flattened, in
// display order) and `skillKinds` (one per file) are derived here, not authored.
const skillGroupNode = groupDef.extend({
  skills: z.array(z.record(z.string(), z.unknown())).min(1),
})
export const skillKindFile = z.object({
  kind: skillKind,
  title: localizedString,
  blurb: localizedString.optional(),
  groups: z.array(skillGroupNode).min(1),
})
export type SkillKindFile = z.infer<typeof skillKindFile>

// A LAYER HEAD FOR A LAYER THAT HAS NO ONE FILE (2026-07-28). Every other layer
// keeps its title, its student-facing `blurb` and its authoring `note` at the top
// of its single tree; skills are four kind files and the head belongs to none of
// them, so it is authored on its own in `skills/layer.json` and joined here.
// Until this existed /skills was the one page whose title and lede were hardcoded
// view prose rather than content — which is also why it was the one page that
// could not be read in German.
const skillsHead = z.object({
  layer: z.literal('skills'),
  title: localizedString,
  blurb: localizedString,
  note: localizedString,
})

export interface SkillTree {
  meta: { title: LocalizedString; blurb: LocalizedString; note: LocalizedString }
  skills: Skill[]
  groups: GroupDef[]      // flattened across kinds, in display (array) order
  skillKinds: GroupDef[]  // one entry per kind file, in file order
  rawEntries: unknown[]   // kind/group-injected skill bodies, keyed by id downstream
}

// Parse the per-kind tree files into the flat runtime shape the app has always
// consumed: a flat Skill[] (kind/group re-attached from tree position), plus the
// derived group and kind registries. The offending id is named on any failure.
export function parseSkillTree(files: unknown[], head: unknown): SkillTree {
  const h = skillsHead.safeParse(head)
  if (!h.success) throw new Error(`Invalid skills layer head:\n${z.prettifyError(h.error)}`)
  const groups: GroupDef[] = []
  const skillKinds: GroupDef[] = []
  const rawEntries: unknown[] = []
  files.forEach((f, i) => {
    const parsed = skillKindFile.safeParse(f)
    if (!parsed.success) {
      const kind = (f as { kind?: string })?.kind ?? `index ${i}`
      throw new Error(`Invalid skill file "${kind}":\n${z.prettifyError(parsed.error)}`)
    }
    const kf = parsed.data
    skillKinds.push({ slug: kf.kind, title: kf.title, blurb: kf.blurb })
    for (const g of kf.groups) {
      groups.push({ slug: g.slug, title: g.title, blurb: g.blurb })
      for (const s of g.skills) rawEntries.push({ ...s, kind: kf.kind, group: g.slug })
    }
  })
  const { title, blurb, note } = h.data
  return { meta: { title, blurb, note }, skills: parseSkills(rawEntries), groups, skillKinds, rawEntries }
}
