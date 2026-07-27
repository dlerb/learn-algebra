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

export const skill = z.object({
  id: z.string().regex(/^(equivalence|classification|chunking|transformation)\.[a-z0-9-]+$/,
    'id must be "<kind>.<slug>" (kind ∈ equivalence|classification|chunking|transformation)'),
  kind: skillKind,                     // = id prefix (validated); positional in the kind file, re-attached by parseSkillTree
  group: z.string(),                    // topic slug; positional in the kind file (= the containing group node), re-attached by parseSkillTree
  name: localizedString,                // the skill's display heading (like a card's `name`)
  note: localizedString,                // the rationale — why this skill matters; prose + inline $…$ KaTeX
  illustration: z.string().optional(),  // ONE canonical example (LaTeX) that anchors the skill
  requires: z.array(z.string()).default([]),     // DIRECT prerequisite skill ids
  rules: z.array(z.string()).default([]),        // rule ids (rules.json) — the DO/IS sentences this skill teaches
  restsOn: z.array(z.string()).default([]),      // card ids (src/data/layers.ts): the axioms/definitions/theorems it is justified by and the notation conventions (`ix.`) it obeys — which is which is read off the card prefix. Merged 2026-07-24 from the old justifiedBy + governedBy
  errors: z.array(z.string()).default([]),       // error-pattern ids — the skill's misconception catalog
  conditions: z.string().optional(),    // domain caveat, pure LaTeX
})
export type Skill = z.infer<typeof skill>

// ── Drill layer ──────────────────────────────────────────────────────────────
// Drill material, parked out of the skills (drills/*.json). Each drill points
// at its `skill` by id. Discriminated on `kind` for now — that is the shape of
// the parked material; the real drill layer will likely key on a `format`
// instead. A pitfall's `explainedBy` names which of the skill's `errors` this
// concrete distractor instantiates (validated ⊆ the skill's set).
const equivPitfall = z
  .union([z.string(), z.object({
    expr: z.string(),
    revise: z.array(z.string()).min(1).optional(),
    explainedBy: z.array(z.string()).min(1).optional(),
  })])
  .transform((p): { expr: string; revise?: string[]; explainedBy?: string[] } =>
    (typeof p === 'string' ? { expr: p } : p))

export const drill = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('equivalence'), skill: z.string(),
    equivalents: z.array(z.string()).min(2),
    pitfalls: z.array(equivPitfall).default([]),
  }),
  z.object({
    kind: z.literal('classification'), skill: z.string(),
    examples: z.array(z.string()).min(1),
    answer: dominantOp,
    pitfalls: z.array(z.object({
      answer: dominantOp, why: localizedString,
      revise: z.array(z.string()).min(1).optional(),
      explainedBy: z.array(z.string()).min(1).optional(),
    })).default([]),
  }),
  z.object({
    kind: z.literal('chunking'), skill: z.string(),
    examples: z.array(z.object({
      expr: z.string(), chunks: z.array(z.string()).min(2), op: dominantOp,
    })).min(1),
    pitfalls: z.array(z.object({
      chunks: z.array(z.string()), why: localizedString,
      revise: z.array(z.string()).min(1).optional(),
      explainedBy: z.array(z.string()).min(1).optional(),
    })).default([]),
  }),
])
export type Drill = z.infer<typeof drill>

// ── Groups ───────────────────────────────────────────────────────────────────
// Groups organize skills into ordered sections in the lookup view. Authored
// inline in the per-kind tree files (a group node = { slug, title, blurb?,
// skills[] }); `groups` and `skillKinds` are the flattened registries
// parseSkillTree derives from them (array order = display order). GroupDef is the
// shared { slug, title, blurb? } shape both derived registries use.

export const groupDef = z.object({
  slug: z.string(),
  title: z.string(),
  blurb: z.string().optional(),
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
  note: localizedString,                  // its gloss, one sentence with an example. Was `rule`, and it always was the gloss
  summarizes: z.array(z.string()).default([]),  // card ids this sentence digests — a bridge claim, not a link (see above)
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

export const errorKind = z.enum(['anti-law', 'misreading', 'salience'])
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
  id: z.string().regex(/^(anti|mis|sal)\.[a-z0-9-]+$/),  // the single identifier — a dotted slug
  kind: errorKind,                 // cross-cuts `topic`, so it stays a field, not a tree level
  topic: z.string(),               // POSITIONAL — the section slug, re-attached by parseErrorTree
  frequency: z.number().int().min(1).max(3).default(1),  // ★–★★★, from docs/common_mistakes.md
  corrupts: z.array(z.string()).default([]),
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
  { 'anti-law': 'anti.', misreading: 'mis.', salience: 'sal.' }

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
  cardIds: Set<string>, errors: ErrorDef[],
): void {
  const errIds = new Set(errors.map(e => e.id))

  for (const f of skills) {
    for (const r of f.restsOn) {
      if (!cardIds.has(r)) throw new Error(`Skill "${f.id}" restsOn unknown card "${r}".`)
    }
    for (const r of f.errors) {
      if (!errIds.has(r)) throw new Error(`Skill "${f.id}" lists unknown error pattern "${r}".`)
    }
  }
  for (const m of rules) {
    for (const r of m.summarizes) {
      if (!cardIds.has(r)) {
        throw new Error(`Rule ${m.id} summarizes unknown card "${r}".`)
      }
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
  drills: Drill[] = [],
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
      ...f.errors.flatMap(eid => corruptsOf.get(eid) ?? []),
    ])
    const unsupported = f.rules.filter(mid => {
      const mp = rules.find(m => m.id === mid)
      return mp !== undefined && !mp.summarizes.some(r => coords.has(r))
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
  // Direction 1 — errors nothing drills. Frequency-ranked, because a ★★★ mistake
  // with no skill is a curriculum hole and a ★ one may just be rare.
  const citedErrs = new Set(skills.flatMap(f => f.errors))
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
  //     anti.commute-everything) and will never own an error   → cite it from
  //     the drill's pitfalls, which is the mechanism that already exists
  const byId = new Map(skills.map(s => [s.id, s]))
  const viaDrill = new Set(
    drills.filter(d => d.pitfalls.some(p => (p.explainedBy?.length ?? 0) > 0)).map(d => d.skill))
  const justified = new Set(skills.filter(f => f.errors.length > 0 || viaDrill.has(f.id)).map(f => f.id))
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
  skills: Skill[], drills: Drill[], rules: RulesFile, errors: ErrorDef[],
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
    for (const m of proseMath(f.note)) check(f.id, 'note', m)
  }
  for (const d of drills) {
    if (d.kind === 'equivalence') {
      d.equivalents.forEach((x, i) => check(d.skill, `equivalents[${i}]`, x))
      d.pitfalls.forEach((p, i) => check(d.skill, `pitfalls[${i}]`, p.expr))
    } else if (d.kind === 'classification') {
      d.examples.forEach((x, i) => check(d.skill, `examples[${i}]`, x))
      d.pitfalls.forEach((p, i) =>
        proseMath(p.why).forEach(m => check(d.skill, `pitfalls[${i}].why`, m)))
    } else {
      d.examples.forEach((ex, i) => {
        check(d.skill, `examples[${i}].expr`, ex.expr)
        ex.chunks.forEach((c, j) => check(d.skill, `examples[${i}].chunks[${j}]`, c))
      })
      d.pitfalls.forEach((p, i) => {
        p.chunks.forEach((c, j) => check(d.skill, `pitfalls[${i}].chunks[${j}]`, c))
        proseMath(p.why).forEach(m => check(d.skill, `pitfalls[${i}].why`, m))
      })
    }
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
  }

  if (failures.length > 0) {
    throw new Error(`LaTeX compile failures:\n${failures.join('\n')}`)
  }
}

// Every id must be unique, and the id prefix must match the skill's `kind`.
export function validateUniqueIds(skills: Skill[]): void {
  const seen = new Set<string>()
  for (const f of skills) {
    if (seen.has(f.id)) throw new Error(`Duplicate skill id "${f.id}".`)
    seen.add(f.id)
    if (!f.id.startsWith(f.kind + '.')) {
      throw new Error(`Skill "${f.id}" has kind "${f.kind}" but a mismatching id prefix.`)
    }
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
  title: z.string(),
  blurb: z.string().optional(),
  groups: z.array(skillGroupNode).min(1),
})
export type SkillKindFile = z.infer<typeof skillKindFile>

export interface SkillTree {
  skills: Skill[]
  groups: GroupDef[]      // flattened across kinds, in display (array) order
  skillKinds: GroupDef[]  // one entry per kind file, in file order
  rawEntries: unknown[]   // kind/group-injected skill bodies, keyed by id downstream
}

// Parse the per-kind tree files into the flat runtime shape the app has always
// consumed: a flat Skill[] (kind/group re-attached from tree position), plus the
// derived group and kind registries. The offending id is named on any failure.
export function parseSkillTree(files: unknown[]): SkillTree {
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
  return { skills: parseSkills(rawEntries), groups, skillKinds, rawEntries }
}

// ── Drill validation ─────────────────────────────────────────────────────────
export function parseDrills(raw: unknown[]): Drill[] {
  return raw.map((entry, i) => {
    const result = drill.safeParse(entry)
    if (!result.success) {
      const fam = (entry as { skill?: string })?.skill ?? `index ${i}`
      throw new Error(`Invalid drill for "${fam}":\n${z.prettifyError(result.error)}`)
    }
    return result.data
  })
}

// Each drill points at a real skill, shares its kind, and every distractor's
// `explainedBy` / `revise` must resolve — and `explainedBy` must be one of the
// skill's declared `errors` (a distractor can't test a misconception the skill
// never claims). One drill per skill (for now).
export function validateDrills(drills: Drill[], skills: Skill[]): void {
  const byId = new Map(skills.map(f => [f.id, f]))
  const famIds = new Set(byId.keys())
  const seen = new Set<string>()
  for (const d of drills) {
    const f = byId.get(d.skill)
    if (!f) throw new Error(`Drill references unknown skill "${d.skill}".`)
    if (seen.has(d.skill)) throw new Error(`More than one drill for skill "${d.skill}".`)
    seen.add(d.skill)
    if (d.kind !== f.kind) throw new Error(`Drill for "${d.skill}" is kind "${d.kind}" but the skill is "${f.kind}".`)
    const declared = new Set(f.errors)
    for (const p of d.pitfalls) {
      for (const r of p.revise ?? []) {
        if (!famIds.has(r)) throw new Error(`Drill "${d.skill}" revises unknown skill "${r}".`)
      }
      for (const r of p.explainedBy ?? []) {
        if (!declared.has(r)) {
          throw new Error(`Drill "${d.skill}" has a distractor explainedBy "${r}", not in the skill's errors.`)
        }
      }
    }
  }
}
