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
// into the law / convention / meta-pattern layers. All the drill-specific
// material — instances, answers, distractors — lives in the drill layer
// (drills/*.json), keyed by skill id. Uniform shape across kinds: `kind` is a
// plain category label (= id prefix), not a data-shape discriminant.
export const skillKind = z.enum(['equivalence', 'classification', 'chunking', 'transformation'])
export type SkillKind = z.infer<typeof skillKind>

export const skill = z.object({
  id: z.string().regex(/^(equivalence|classification|chunking|transformation)\.[a-z0-9-]+$/,
    'id must be "<kind>.<slug>" (kind ∈ equivalence|classification|chunking|transformation)'),
  kind: skillKind,                     // = id prefix (validated); a plain category label
  group: z.string(),                    // topic slug; must exist in skillGroups.json
  title: localizedString,
  note: localizedString,                // the rationale — why this skill matters; prose + inline $…$ KaTeX
  illustration: z.string().optional(),  // ONE canonical example (LaTeX) that anchors the skill
  gateway: z.boolean().default(false),  // recognising this shape triggers a transformation (familiar shapes)
  requires: z.array(z.string()).default([]),     // DIRECT prerequisite skill ids
  metaPatterns: z.array(z.string()).default([]), // meta-pattern ids (metapatterns.json)
  justifiedBy: z.array(z.string()).default([]),  // law ids (laws.json)
  governedBy: z.array(z.string()).default([]),   // convention ids (conventions.json)
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
// Groups organize skills into ordered sections in the lookup view. Defined once
// in skillGroups.json as a flat list (array order = display order); a skill
// references its group by slug.

export const groupDef = z.object({
  slug: z.string(),
  title: z.string(),
  blurb: z.string().optional(),
})
export type GroupDef = z.infer<typeof groupDef>

export const groupsFile = z.array(groupDef)
export type GroupsFile = z.infer<typeof groupsFile>

// Cross-check: every skill's group slug must exist in skillGroups.json.
export function validateGroupRefs(skills: Skill[], groups: GroupsFile): void {
  const slugs = new Set(groups.map(g => g.slug))
  for (const f of skills) {
    if (!slugs.has(f.group)) {
      throw new Error(`Skill "${f.id}" references unknown group "${f.group}".`)
    }
  }
}

// ── Meta-patterns ────────────────────────────────────────────────────────────
// The generative decoding rules. A flat list in metapatterns.json; skills
// reference them by id ("meta.…").

export const metaPatternDef = z.object({
  id: z.string().regex(/^meta\.[a-z0-9-]+$/),  // globally unique slug, like every other id
  code: z.string(),    // display code "M1".."M10" — the classroom name, globally unique
  title: localizedString,
  text: localizedString,                  // the student-facing takeaway line in drill feedback
  summarizes: z.array(z.string()).default([]),  // law/convention/error ids this pattern digests — keeps the classroom voice linked to the layer it summarizes
})
export type MetaPatternDef = z.infer<typeof metaPatternDef>

export const metaPatternsFile = z.array(metaPatternDef)
export type MetaPatternsFile = z.infer<typeof metaPatternsFile>

// Cross-check: every metaPattern a skill references must exist; ids and display
// codes are globally unique.
export function validateMetaPatternRefs(skills: Skill[], metas: MetaPatternsFile): void {
  const dupId = metas.map(m => m.id).find((id, i, a) => a.indexOf(id) !== i)
  if (dupId) throw new Error(`Duplicate meta-pattern id "${dupId}".`)
  const dupCode = metas.map(m => m.code).find((c, i, a) => a.indexOf(c) !== i)
  if (dupCode) throw new Error(`Duplicate meta-pattern code "${dupCode}".`)

  const ids = new Set(metas.map(m => m.id))
  for (const f of skills) {
    for (const m of f.metaPatterns) {
      if (!ids.has(m)) {
        throw new Error(`Skill "${f.id}" references unknown meta-pattern "${m}".`)
      }
    }
  }
}

// ── Laws (layer 1) ───────────────────────────────────────────────────────────
// The logical skeleton of school algebra (docs/content_model.md). Three
// kinds: axiom (accepted, no links), definition (carries `basedOn` — what it
// presupposes), theorem (carries `derivedFrom` — what proves it). `kind` is the
// intrinsic type of the entry (mirroring the skill `kind` discriminant); the id
// prefix mirrors it so a derivation chain reads like a proof. A separate `group`
// (topic: signs, fractions, powers …) cross-cuts `kind` for browsing. `code` is
// the short display code matching the doc (A1, D3, T11).

export const lawKind = z.enum(['axiom', 'definition', 'theorem'])
export type LawKind = z.infer<typeof lawKind>

// Topical group — a display/navigation bucket that cross-cuts `kind` (a group
// holds definitions and theorems alike). Deliberately NOT in the id: grouping is
// a soft, revisable call, ids are hard identity cited everywhere. The two power
// sub-skills (same-base / same-exponent / power-of-power) are intentionally
// left to the derivedFrom lineage rather than a `subgroup` — one level is enough.
export const lawGroup = z.enum([
  'addition', 'multiplication', 'distribution',
  'signs', 'fractions', 'powers', 'roots', 'binomials',
])
export type LawGroup = z.infer<typeof lawGroup>

// Display registry for the law groups — titles + display order — in its own file
// (lawGroups.json), mirroring skillGroups.json for skills. Kept separate from
// skillGroups.json because that file is keyed by skill namespace, a different axis.
// The slug set must equal the lawGroup enum exactly, so a title can never drift
// from a value laws use, nor a group go titleless. `groupDef` is reused (defined
// above): { slug, title, blurb? }, array order = display order.
export const lawGroupsFile = z.array(groupDef)
export type LawGroupsFile = z.infer<typeof lawGroupsFile>

// Shared registry check (used by law and convention group registries): the
// registry's slug set must equal the group enum's value set exactly — no
// duplicate, no unknown group, no missing title — so display titles/order can
// never drift from the values entries actually carry.
function validateGroupRegistry(registry: GroupDef[], allowed: readonly string[], file: string): void {
  const slugs = registry.map(g => g.slug)
  const dup = slugs.find((s, i) => slugs.indexOf(s) !== i)
  if (dup) throw new Error(`Duplicate group slug "${dup}" in ${file}.`)
  const inEnum = new Set<string>(allowed)
  const inReg = new Set(slugs)
  for (const s of inReg) if (!inEnum.has(s)) throw new Error(`${file} lists unknown group "${s}".`)
  for (const s of inEnum) if (!inReg.has(s)) throw new Error(`${file} is missing a title for group "${s}".`)
}

export function validateLawGroups(registry: GroupDef[]): void {
  validateGroupRegistry(registry, lawGroup.options, 'lawGroups.json')
}

export const lawDef = z.object({
  id: z.string().regex(/^(ax|def|thm)\.[a-z0-9-]+$/),
  code: z.string(),
  kind: lawKind,                                // intrinsic logical type — drives the link kind + id prefix
  group: lawGroup,                              // topical bucket, cross-cuts kind — display/navigation only
  name: localizedString,
  latex: z.string(),                            // the statement, KaTeX
  conditions: z.string().optional(),            // domain condition, pure LaTeX, e.g. "b \\ne 0"; skills citing the law inherit it
  basedOn: z.array(z.string()).default([]),     // definitions only
  derivedFrom: z.array(z.string()).default([]), // theorems only
  note: localizedString.optional(),
})
export type LawDef = z.output<typeof lawDef>

const lawPrefixOfKind: Record<LawKind, string> = { axiom: 'ax', definition: 'def', theorem: 'thm' }

export function validateLaws(laws: LawDef[]): void {
  const byId = new Map(laws.map(l => [l.id, l]))
  if (byId.size !== laws.length) throw new Error('Duplicate law id.')

  for (const l of laws) {
    if (!l.id.startsWith(lawPrefixOfKind[l.kind] + '.')) {
      throw new Error(`Law "${l.id}" has kind "${l.kind}" but a mismatching id prefix.`)
    }
    if (l.kind !== 'definition' && l.basedOn.length > 0) {
      throw new Error(`Law "${l.id}" (${l.kind}) may not carry basedOn — definitions only.`)
    }
    if (l.kind !== 'theorem' && l.derivedFrom.length > 0) {
      throw new Error(`Law "${l.id}" (${l.kind}) may not carry derivedFrom — theorems only.`)
    }
    if (l.kind === 'theorem' && l.derivedFrom.length === 0) {
      throw new Error(`Theorem "${l.id}" must name what it is derived from.`)
    }
    for (const r of [...l.basedOn, ...l.derivedFrom]) {
      if (!byId.has(r)) throw new Error(`Law "${l.id}" links to unknown law "${r}".`)
    }
  }

  // Acyclicity over basedOn ∪ derivedFrom (DFS, reporting the cycle path).
  const state = new Map<string, 'visiting' | 'done'>()
  function visit(id: string, path: string[]): void {
    if (state.get(id) === 'done') return
    if (state.get(id) === 'visiting') {
      throw new Error(`Cycle in law graph: ${[...path, id].join(' → ')}`)
    }
    state.set(id, 'visiting')
    const l = byId.get(id)!
    for (const r of [...l.basedOn, ...l.derivedFrom]) visit(r, [...path, id])
    state.set(id, 'done')
  }
  for (const l of laws) visit(l.id, [])
}

// ── Conventions (layer 2) ────────────────────────────────────────────────────
// The agreed rules of the writing system — no truth value, hence no `kind`
// (there is no axiom/definition/theorem analog for a notation rule). They carry
// only a topical `group`: reading (what a mark means), grouping (how marks bind
// into structure / precedence), or form (legal & canonical writing). `code` =
// N1..N12.

export const conventionGroup = z.enum(['reading', 'grouping', 'form'])
export type ConventionGroup = z.infer<typeof conventionGroup>

// Display registry for the convention groups — titles + display order + blurbs —
// its own file (conventionGroups.json), parallel to lawGroups.json. Slug set must
// equal the conventionGroup enum exactly (see validateGroupRegistry).
export const conventionGroupsFile = z.array(groupDef)
export type ConventionGroupsFile = z.infer<typeof conventionGroupsFile>

export function validateConventionGroups(registry: GroupDef[]): void {
  validateGroupRegistry(registry, conventionGroup.options, 'conventionGroups.json')
}

export const conventionDef = z.object({
  id: z.string().regex(/^conv\.[a-z0-9-]+$/),
  code: z.string(),
  group: conventionGroup,
  name: localizedString,
  text: localizedString,
})
export type ConventionDef = z.output<typeof conventionDef>

// Ids and display codes must both be unique (mirrors validateLaws/validateErrors).
// Codes carry a skill suffix when one convention is split into tiers — e.g.
// precedence → N5a (powers bind first) + N5b (point before line) — so the code
// uniqueness check is what catches a fat-fingered duplicate suffix.
export function validateConventions(conventions: ConventionDef[]): void {
  const seenId = new Set<string>()
  const seenCode = new Set<string>()
  for (const c of conventions) {
    if (seenId.has(c.id)) throw new Error(`Duplicate convention id "${c.id}".`)
    seenId.add(c.id)
    if (seenCode.has(c.code)) throw new Error(`Duplicate convention code "${c.code}".`)
    seenCode.add(c.code)
  }
}

// ── Error patterns ───────────────────────────────────────────────────────────
// First-class citizens of the error space: ONE addressable list that pitfalls
// cite, so drill data can be analyzed per error pattern from day one. Three
// kinds (each `corrupts` a different layer; the kind's leading word IS its id
// prefix — anti-law→anti, misreading→mis, salience→sal):
//   anti-law   (anti.) — corrupts a true LAW it distorts/over-generalizes
//   misreading (mis.)  — corrupts a CONVENTION it violates
//   salience   (sal.)  — corrupts a METAPATTERN: parsing by what is visually
//                        loudest instead of by structure (the negative of a
//                        perceptual heuristic, e.g. sal.loudest-op-wins is the
//                        failure of meta.dominant-op-last).
// `code` = Ā1..Ā5 / R1..R15 / S1..

export const errorKind = z.enum(['anti-law', 'misreading', 'salience'])
export type ErrorKind = z.infer<typeof errorKind>

export const errorDef = z.object({
  id: z.string().regex(/^(anti|mis|sal)\.[a-z0-9-]+$/),
  code: z.string(),
  kind: errorKind,
  corrupts: z.array(z.string()).default([]),
  name: localizedString,
  text: localizedString,
  instances: z.array(z.string()).default([]),   // typical wrong forms, KaTeX
})
export type ErrorDef = z.output<typeof errorDef>

const errorPrefixOfKind: Record<ErrorKind, string> =
  { 'anti-law': 'anti.', misreading: 'mis.', salience: 'sal.' }

export function validateErrors(
  errors: ErrorDef[], laws: LawDef[], conventions: ConventionDef[], metas: MetaPatternsFile,
): void {
  const poolOfKind: Record<ErrorKind, { ids: Set<string>; name: string }> = {
    'anti-law': { ids: new Set(laws.map(l => l.id)), name: 'law' },
    misreading: { ids: new Set(conventions.map(c => c.id)), name: 'convention' },
    salience: { ids: new Set(metas.map(m => m.id)), name: 'meta-pattern' },
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
  }
}

// ── Cross-layer references from skills and meta-patterns ──────────────────
// `justifiedBy` → laws; `governedBy` → conventions; `errors` → error patterns;
// meta-pattern `summarizes` → any of the three.

export function validateLayerRefs(
  skills: Skill[], metas: MetaPatternsFile,
  laws: LawDef[], conventions: ConventionDef[], errors: ErrorDef[],
): void {
  const lawIds = new Set(laws.map(l => l.id))
  const convIds = new Set(conventions.map(c => c.id))
  const errIds = new Set(errors.map(e => e.id))

  for (const f of skills) {
    for (const r of f.justifiedBy) {
      if (!lawIds.has(r)) throw new Error(`Skill "${f.id}" is justifiedBy unknown law "${r}".`)
    }
    for (const r of f.governedBy) {
      if (!convIds.has(r)) throw new Error(`Skill "${f.id}" references unknown convention "${r}".`)
    }
    for (const r of f.errors) {
      if (!errIds.has(r)) throw new Error(`Skill "${f.id}" lists unknown error pattern "${r}".`)
    }
  }
  for (const m of metas) {
    for (const r of m.summarizes) {
      if (!lawIds.has(r) && !convIds.has(r) && !errIds.has(r)) {
        throw new Error(`Meta-pattern ${m.id} summarizes unknown id "${r}".`)
      }
    }
  }
}

// ── Matrix audit ─────────────────────────────────────────────────────────────
// The completeness report, not a validator: which skills have no coordinates
// yet, and which laws / conventions / error patterns no skill uses. An empty
// cell is a QUESTION (gap, or deliberately inert?), never automatically an
// error — so this warns, it does not throw.

export function auditCoverage(
  skills: Skill[], metas: MetaPatternsFile,
  laws: LawDef[], conventions: ConventionDef[], errors: ErrorDef[],
): string[] {
  const lines: string[] = []
  const untagged = skills.filter(f => f.justifiedBy.length === 0 && f.governedBy.length === 0)
  if (untagged.length > 0) {
    lines.push(`${untagged.length}/${skills.length} skills have no layer coordinates yet (justifiedBy/conventions).`)
  }

  // Authored ⊆ derived: on a tagged skill, every authored meta-pattern should
  // be reachable from the skill's coordinates via the pattern's summarizes.
  // (Authored stays curation — this only catches a missing tag or a
  // meta-pattern citation that doesn't fit the skill.)
  for (const f of skills) {
    if (f.justifiedBy.length === 0 && f.governedBy.length === 0) continue
    const coords = new Set([...f.justifiedBy, ...f.governedBy, ...f.errors])
    const unsupported = f.metaPatterns.filter(mid => {
      const mp = metas.find(m => m.id === mid)
      return mp !== undefined && !mp.summarizes.some(r => coords.has(r))
    })
    if (unsupported.length > 0) {
      lines.push(`"${f.id}" declares meta-patterns its coordinates don't support: ${unsupported.join(', ')}`)
    }
  }
  const citedLaws = new Set(skills.flatMap(f => f.justifiedBy))
  const citedConvs = new Set(skills.flatMap(f => f.governedBy))
  const citedErrs = new Set(skills.flatMap(f => f.errors))
  const uncited = (kind: string, ids: string[], cited: Set<string>) => {
    const free = ids.filter(id => !cited.has(id))
    if (free.length > 0) lines.push(`${kind} cited by no skill: ${free.join(', ')}`)
  }
  uncited('Laws', laws.filter(l => l.kind !== 'axiom').map(l => l.id), citedLaws)  // axioms may be reached only via theorems
  uncited('Conventions', conventions.map(c => c.id), citedConvs)
  uncited('Error patterns', errors.map(e => e.id), citedErrs)

  // Prose format contract: text with inline $…$ KaTeX. Improvised unicode
  // math in prose (2x², √, ÷ …) predates the contract; count what remains
  // to migrate. Conditions are excluded — they are pure LaTeX, not prose.
  const unicodeMath = /[²³¹⁰ⁿ⁻√÷×·−≠≥≤½]/
  const locVals = (ls?: LocalizedString): string[] => ls ? [ls.en, ls.de ?? ''] : []
  const countDirty = (fields: string[][]) => fields.filter(f => f.some(s => unicodeMath.test(s))).length
  const dirty = {
    'skill notes': countDirty(skills.map(f => locVals(f.note))),
    'law notes': countDirty(laws.filter(l => l.note).map(l => locVals(l.note))),
    'convention texts': countDirty(conventions.map(c => locVals(c.text))),
    'error texts': countDirty(errors.map(e => locVals(e.text))),
    'meta-pattern texts': countDirty(metas.map(m => locVals(m.text))),
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
  skills: Skill[], drills: Drill[], metas: MetaPatternsFile,
  laws: LawDef[], conventions: ConventionDef[], errors: ErrorDef[],
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
  for (const l of laws) {
    check(l.id, 'latex', l.latex)
    if (l.conditions) check(l.id, 'conditions', l.conditions)
    proseMath(l.note).forEach(m => check(l.id, 'note', m))
  }
  for (const c of conventions) proseMath(c.text).forEach(m => check(c.id, 'text', m))
  for (const e of errors) {
    e.instances.forEach((x, i) => check(e.id, `instances[${i}]`, x))
    proseMath(e.text).forEach(m => check(e.id, 'text', m))
  }
  for (const m of metas) proseMath(m.text).forEach(s => check(m.id, 'text', s))

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
