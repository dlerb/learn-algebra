import { z } from 'zod'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
// Family schema — the single source of truth for BOTH the runtime validator and
// the TypeScript `Family` type (via z.infer). Family data is authored as JSON in
// src/data/families/*.json and validated against this schema on load.
//
// A family is a mathematical unit only. It declares WHAT IT IS (its `kind`);
// how it is drilled (exercise type) is derived from the kind in code, never
// stored here. Authored curation — including `priority`, the teacher's drilling
// order — lives here; per-student runtime state (mastery, next-item selection,
// spaced-repetition scheduling) does not.
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

// Fields shared by every family, regardless of kind.
// The id is prefixed with the family's `kind` (its mental-step type) — the same
// value the `kind` field carries, mirroring how a law id is prefixed by its kind
// (ax/def/thm). The pedagogical `skill` (equivalence | classification |
// transformation) is DERIVED from the kind via skillOf(), never stored.
const core = {
  id: z.string().regex(/^(equivalence|recognition|classification|chunking|transformation)\.[a-z0-9-]+$/,
    'id must be "<kind>.<slug>" — kind ∈ equivalence|recognition|classification|chunking|transformation, slug lowercase kebab-case'),
  group: z.string(),                    // group slug, e.g. "minus-sign"; must exist in familyGroups.json
  title: localizedString,
  priority: z.number().int().positive().optional(),  // authored drilling rank within the skill; lower = earlier; omit = unranked
  requires: z.array(z.string()).default([]),        // DIRECT prerequisites (family ids, cross-skill allowed) — author the transitive reduction, not the closure
  metaPatterns: z.array(z.string()).default([]),    // e.g. ["M2"] — references a meta-pattern in metapatterns.json
  justifiedBy: z.array(z.string()).default([]),     // law ids (laws.json) that make the true forms true; empty = pure convention
  governedBy: z.array(z.string()).default([]),      // convention ids (conventions.json) the family is governed by
  note: localizedString,                // one/two-line explanation shown in feedback — prose with inline $…$ KaTeX
  conditions: z.string().optional(),    // domain caveat NOT already carried by a cited law — pure LaTeX, e.g. "a > 0", "b \\ne 0"
}

// Every kind has a CORRECT half (varies by kind) and an ERROR half (`pitfalls` —
// the "this is exactly what you must not do" content). The error half keeps the
// same field name across kinds; only its shape differs.
//
// Any pitfall may carry `revise`: family ids to send the student to when this
// SPECIFIC error fires — for errors that point at a sharper gap than the
// family-level `requires`. Omit it where `requires` + metaPatterns suffice.
// Any pitfall may carry `explainedBy`: error-pattern ids (errors.json) naming
// WHY the wrong form tempts — a false law, a misreading, or one of each.

// An equivalence pitfall is authored as a bare LaTeX string, or as an object
// when it carries `revise` or `explainedBy`. Normalized to object form on parse.
const equivPitfall = z
  .union([z.string(), z.object({
    expr: z.string(),
    revise: z.array(z.string()).min(1).optional(),
    explainedBy: z.array(z.string()).min(1).optional(),
  })])
  .transform((p): { expr: string; revise?: string[]; explainedBy?: string[] } =>
    (typeof p === 'string' ? { expr: p } : p))

export const family = z.discriminatedUnion('kind', [
  // EQUIVALENCE — a set of forms that are all EQUAL (same value for all inputs).
  // The mental step is "produce/know an equal form" (Skill 1 fluency). The
  // `equivalents` share one binding: the `a` in every form is the same `a`.
  // Pitfalls are wrong FORMS (look equal, aren't).
  z.object({
    kind: z.literal('equivalence'),
    ...core,
    equivalents: z.array(z.string()).min(2),   // ≥2 so a SAME pair can be drawn
    pitfalls: z.array(equivPitfall).default([]),  // non-equal forms
  }),

  // RECOGNITION — same data-shape as equivalence (a set of equal forms), but the
  // mental step is "recognise that differently-built forms have the same value"
  // (Skill 2). Kept a distinct kind precisely because that step is skill-2, not
  // skill-1 fluency — this is what dissolves the old notation/structure crossover.
  z.object({
    kind: z.literal('recognition'),
    ...core,
    equivalents: z.array(z.string()).min(2),
    pitfalls: z.array(equivPitfall).default([]),
  }),

  // CLASSIFICATION — one expression, name its dominant operation. Skill 2.
  // `examples` are DIFFERENT expressions sharing the SAME structural class; each is
  // independently bound. Pitfalls are wrong LABELS plus why they tempt.
  // `gateway` marks familiar-shape families — classification-with-intent that hinge
  // Skill 2 → Skill 3 (recognising the shape is the trigger for a transformation).
  z.object({
    kind: z.literal('classification'),
    ...core,
    gateway: z.boolean().default(false),
    examples: z.array(z.string()).min(1),
    answer: dominantOp,
    pitfalls: z.array(z.object({
      answer: dominantOp,
      why: localizedString,
      revise: z.array(z.string()).min(1).optional(),
      explainedBy: z.array(z.string()).min(1).optional(),
    })).default([]),
  }),

  // CHUNKING — break an expression into its chunks. Skill 2 group C.
  // Not drilled yet (no exercise type maps to it); authored now for the library.
  z.object({
    kind: z.literal('chunking'),
    ...core,
    examples: z.array(z.object({
      expr: z.string(),
      chunks: z.array(z.string()).min(2),   // the correct chunking
      op: dominantOp,                       // dominant op between the chunks
    })).min(1),
    pitfalls: z.array(z.object({
      chunks: z.array(z.string()),
      why: localizedString,
      revise: z.array(z.string()).min(1).optional(),
      explainedBy: z.array(z.string()).min(1).optional(),
    })).default([]),
  }),
])

export type Family = z.infer<typeof family>

// Skill is DERIVED from the family kind (= the id prefix): the pedagogical
// grouping over mental-step types. Recognition and chunking are skill-2
// (classification) steps even though they carry their own kind names. The three
// skills form a fixed progression equivalence → classification → transformation
// (a family may depend only on same- or earlier-skill families).
export type Skill = 'equivalence' | 'classification' | 'transformation'
const skillOfKind: Record<string, Skill> = {
  equivalence: 'equivalence',
  recognition: 'classification',
  classification: 'classification',
  chunking: 'classification',
  transformation: 'transformation',
}
export const skillRank: Record<Skill, number> = { equivalence: 1, classification: 2, transformation: 3 }
export function skillOf(id: string): Skill {
  return skillOfKind[id.split('.')[0]] ?? 'equivalence'
}

// ── Groups ───────────────────────────────────────────────────────────────────
// Groups organize families into ordered sections in the lookup view. Defined once
// in familyGroups.json (keyed by skill: "equivalence" | "classification" |
// "transformation"); a family references its group by slug. Array order = display
// order.

export const groupDef = z.object({
  slug: z.string(),
  title: z.string(),
  blurb: z.string().optional(),
})
export type GroupDef = z.infer<typeof groupDef>

export const groupsFile = z.object({
  equivalence: z.array(groupDef),
  classification: z.array(groupDef),
  transformation: z.array(groupDef),
})
export type GroupsFile = z.infer<typeof groupsFile>

// Cross-check: every family's group slug must exist under its skill.
export function validateGroupRefs(families: Family[], groups: GroupsFile): void {
  for (const f of families) {
    const sk = skillOf(f.id)
    if (!groups[sk].some(g => g.slug === f.group)) {
      throw new Error(`Family "${f.id}" references unknown ${sk} group "${f.group}".`)
    }
  }
}

// ── Meta-patterns ────────────────────────────────────────────────────────────
// The generative decoding rules (Section 0 of each taxonomy). Defined once in
// metapatterns.json, namespaced; families reference them by id ("M2").

export const metaPatternDef = z.object({
  id: z.string().regex(/^meta\.[a-z0-9-]+$/),  // globally unique slug, like every other id
  code: z.string(),    // display code "M1".."M10" — the classroom name, globally unique across the file
  title: localizedString,
  text: localizedString,                  // the student-facing takeaway line in drill feedback
  summarizes: z.array(z.string()).default([]),  // law/convention/error ids this pattern digests — keeps the classroom voice linked to the layer it summarizes
})
export type MetaPatternDef = z.infer<typeof metaPatternDef>

export const metaPatternsFile = z.object({
  equivalence: z.array(metaPatternDef),
  classification: z.array(metaPatternDef),
  transformation: z.array(metaPatternDef),
})
export type MetaPatternsFile = z.infer<typeof metaPatternsFile>

// All meta-patterns across every skill — the flat view for uniqueness checks and
// cross-layer scans.
export function allMetas(metas: MetaPatternsFile): MetaPatternDef[] {
  return [...metas.equivalence, ...metas.classification, ...metas.transformation]
}

// Cross-check: every metaPattern a family references must exist in its skill.
export function validateMetaPatternRefs(families: Family[], metas: MetaPatternsFile): void {
  // Slug ids AND display codes must both be globally unique even though the file
  // is keyed by skill (the code is a chip; a duplicate would be ambiguous to read).
  const all = allMetas(metas)
  const dupId = all.map(m => m.id).find((id, i, a) => a.indexOf(id) !== i)
  if (dupId) throw new Error(`Duplicate meta-pattern id "${dupId}" across skills.`)
  const dupCode = all.map(m => m.code).find((c, i, a) => a.indexOf(c) !== i)
  if (dupCode) throw new Error(`Duplicate meta-pattern code "${dupCode}" across skills.`)

  for (const f of families) {
    const sk = skillOf(f.id)
    for (const m of f.metaPatterns) {
      if (!metas[sk].some(mp => mp.id === m)) {
        throw new Error(`Family "${f.id}" references unknown ${sk} meta-pattern "${m}".`)
      }
    }
  }
}

// ── Laws (layer 1) ───────────────────────────────────────────────────────────
// The logical skeleton of school algebra (docs/content_model.md). Three
// kinds: axiom (accepted, no links), definition (carries `basedOn` — what it
// presupposes), theorem (carries `derivedFrom` — what proves it). `kind` is the
// intrinsic type of the entry (mirroring the family `kind` discriminant); the id
// prefix mirrors it so a derivation chain reads like a proof. A separate `group`
// (topic: signs, fractions, powers …) cross-cuts `kind` for browsing. `code` is
// the short display code matching the doc (A1, D3, T11).

export const lawKind = z.enum(['axiom', 'definition', 'theorem'])
export type LawKind = z.infer<typeof lawKind>

// Topical group — a display/navigation bucket that cross-cuts `kind` (a group
// holds definitions and theorems alike). Deliberately NOT in the id: grouping is
// a soft, revisable call, ids are hard identity cited everywhere. The two power
// sub-families (same-base / same-exponent / power-of-power) are intentionally
// left to the derivedFrom lineage rather than a `subgroup` — one level is enough.
export const lawGroup = z.enum([
  'addition', 'multiplication', 'distribution',
  'signs', 'fractions', 'powers', 'roots', 'binomials',
])
export type LawGroup = z.infer<typeof lawGroup>

// Display registry for the law groups — titles + display order — in its own file
// (lawGroups.json), mirroring familyGroups.json for families. Kept separate from
// familyGroups.json because that file is keyed by family namespace, a different axis.
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
  conditions: z.string().optional(),            // domain condition, pure LaTeX, e.g. "b \\ne 0"; families citing the law inherit it
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
// Codes carry a family suffix when one convention is split into tiers — e.g.
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
// kinds, each `corrupts` a different layer:
//   false-law  (anti.) — corrupts a true LAW it distorts/over-generalizes
//   misreading (mis.)  — corrupts a CONVENTION it violates
//   salience   (sal.)  — corrupts a METAPATTERN: parsing by what is visually
//                        loudest instead of by structure (the negative of a
//                        perceptual heuristic, e.g. sal.loudest-op-wins is the
//                        failure of meta.dominant-op-last). Skill-2 specific.
// `code` = Ā1..Ā5 / R1..R15 / S1..

export const errorKind = z.enum(['false-law', 'misreading', 'salience'])
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
  { 'false-law': 'anti.', misreading: 'mis.', salience: 'sal.' }

export function validateErrors(
  errors: ErrorDef[], laws: LawDef[], conventions: ConventionDef[], metas: MetaPatternsFile,
): void {
  const poolOfKind: Record<ErrorKind, { ids: Set<string>; name: string }> = {
    'false-law': { ids: new Set(laws.map(l => l.id)), name: 'law' },
    misreading: { ids: new Set(conventions.map(c => c.id)), name: 'convention' },
    salience: { ids: new Set(allMetas(metas).map(m => m.id)), name: 'meta-pattern' },
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

// ── Cross-layer references from families and meta-patterns ──────────────────
// `justifiedBy` → laws; `governedBy` → conventions; pitfall `explainedBy` →
// error patterns; meta-pattern `summarizes` → any of the three.

function explainedByTargets(f: Family): string[] {
  const pitfalls: { explainedBy?: string[] }[] = f.pitfalls
  return pitfalls.flatMap(p => p.explainedBy ?? [])
}

export function validateLayerRefs(
  families: Family[], metas: MetaPatternsFile,
  laws: LawDef[], conventions: ConventionDef[], errors: ErrorDef[],
): void {
  const lawIds = new Set(laws.map(l => l.id))
  const convIds = new Set(conventions.map(c => c.id))
  const errIds = new Set(errors.map(e => e.id))

  for (const f of families) {
    for (const r of f.justifiedBy) {
      if (!lawIds.has(r)) throw new Error(`Family "${f.id}" is justifiedBy unknown law "${r}".`)
    }
    for (const r of f.governedBy) {
      if (!convIds.has(r)) throw new Error(`Family "${f.id}" references unknown convention "${r}".`)
    }
    for (const r of explainedByTargets(f)) {
      if (!errIds.has(r)) throw new Error(`A pitfall of "${f.id}" is explainedBy unknown error pattern "${r}".`)
    }
  }
  for (const sk of ['equivalence', 'classification', 'transformation'] as const) {
    for (const m of metas[sk]) {
      for (const r of m.summarizes) {
        if (!lawIds.has(r) && !convIds.has(r) && !errIds.has(r)) {
          throw new Error(`Meta-pattern ${sk}/${m.id} summarizes unknown id "${r}".`)
        }
      }
    }
  }
}

// ── Matrix audit ─────────────────────────────────────────────────────────────
// The completeness report, not a validator: which families have no coordinates
// yet, and which laws / conventions / error patterns no family uses. An empty
// cell is a QUESTION (gap, or deliberately inert?), never automatically an
// error — so this warns, it does not throw.

export function auditCoverage(
  families: Family[], metas: MetaPatternsFile,
  laws: LawDef[], conventions: ConventionDef[], errors: ErrorDef[],
): string[] {
  const lines: string[] = []
  const untagged = families.filter(f => f.justifiedBy.length === 0 && f.governedBy.length === 0)
  if (untagged.length > 0) {
    lines.push(`${untagged.length}/${families.length} families have no layer coordinates yet (justifiedBy/conventions).`)
  }

  // Authored ⊆ derived: on a tagged family, every authored meta-pattern should
  // be reachable from the family's coordinates via the pattern's summarizes.
  // (Authored stays curation — this only catches a missing tag or a
  // meta-pattern citation that doesn't fit the family.)
  for (const f of families) {
    if (f.justifiedBy.length === 0 && f.governedBy.length === 0) continue
    const coords = new Set([...f.justifiedBy, ...f.governedBy, ...explainedByTargets(f)])
    const unsupported = f.metaPatterns.filter(mid => {
      const mp = metas[skillOf(f.id)].find(m => m.id === mid)
      return mp !== undefined && !mp.summarizes.some(r => coords.has(r))
    })
    if (unsupported.length > 0) {
      lines.push(`"${f.id}" declares meta-patterns its coordinates don't support: ${unsupported.join(', ')}`)
    }
  }
  const citedLaws = new Set(families.flatMap(f => f.justifiedBy))
  const citedConvs = new Set(families.flatMap(f => f.governedBy))
  const citedErrs = new Set(families.flatMap(explainedByTargets))
  const uncited = (kind: string, ids: string[], cited: Set<string>) => {
    const free = ids.filter(id => !cited.has(id))
    if (free.length > 0) lines.push(`${kind} cited by no family: ${free.join(', ')}`)
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
    'family notes': countDirty(families.map(f => locVals(f.note))),
    'pitfall whys': countDirty(families.flatMap(f =>
      (f.pitfalls as { why?: LocalizedString }[]).filter(p => p.why).map(p => locVals(p.why)))),
    'law notes': countDirty(laws.filter(l => l.note).map(l => locVals(l.note))),
    'convention texts': countDirty(conventions.map(c => locVals(c.text))),
    'error texts': countDirty(errors.map(e => locVals(e.text))),
    'meta-pattern texts': countDirty(allMetas(metas).map(m => locVals(m.text))),
  }
  const parts = Object.entries(dirty).filter(([, n]) => n > 0).map(([k, n]) => `${k}: ${n}`)
  if (parts.length > 0) lines.push(`Prose fields with unmigrated unicode math (→ inline $…$): ${parts.join(', ')}`)
  return lines
}

// ── Family links: requires (family-level) + revise (pitfall-level) ──────────
// `requires` lists a family's direct prerequisites; `revise` on a pitfall names
// the families that train the specific discrimination that error reveals. Both
// hold family ids. The requires graph must be acyclic and must agree with the
// authored drilling order: a prerequisite is drilled strictly earlier, so its
// priority must be strictly lower, and a ranked family may not require an
// unranked one (unranked = "remaining", i.e. after everything ranked).
// Ranks are meaningful only WITHIN a skill; across skills the progression is
// fixed (equivalence → classification → transformation; a family may depend only
// on same- or earlier-skill families), so a cross-skill edge is checked for
// direction only, not rank.

function reviseTargets(f: Family): string[] {
  const pitfalls: { revise?: string[] }[] = f.pitfalls
  return pitfalls.flatMap(p => p.revise ?? [])
}

export function validateFamilyLinks(families: Family[]): void {
  const byId = new Map(families.map(f => [f.id, f]))

  for (const f of families) {
    for (const r of f.requires) {
      if (!byId.has(r)) throw new Error(`Family "${f.id}" requires unknown family "${r}".`)
    }
    for (const r of reviseTargets(f)) {
      if (!byId.has(r)) throw new Error(`A pitfall of "${f.id}" revises unknown family "${r}".`)
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
  for (const f of families) visit(f.id, [])

  // Priority consistency with the graph (see block comment above).
  for (const f of families) {
    for (const r of f.requires) {
      const req = byId.get(r)!
      const sf = skillOf(f.id), sr = skillOf(req.id)
      if (sf !== sr) {
        if (skillRank[sf] < skillRank[sr]) {
          throw new Error(
            `Family "${f.id}" (${sf}) requires "${r}" (${sr}) — `
            + `cross-skill dependencies may point only to an earlier skill `
            + `(equivalence → classification → transformation).`)
        }
        continue  // later skill → earlier skill: always consistent, ranks not comparable
      }
      if (f.priority === undefined) continue
      if (req.priority === undefined) {
        throw new Error(
          `Family "${f.id}" (priority ${f.priority}) requires unranked "${r}" — `
          + `rank the prerequisite earlier or unrank the dependent.`)
      }
      if (req.priority >= f.priority) {
        throw new Error(
          `Family "${f.id}" (priority ${f.priority}) requires "${r}" (priority ${req.priority}) — `
          + `a prerequisite must be ranked strictly earlier.`)
      }
    }
  }
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
  families: Family[], metas: MetaPatternsFile,
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

  for (const f of families) {
    if (f.conditions) check(f.id, 'conditions', f.conditions)
    for (const m of proseMath(f.note)) check(f.id, 'note', m)
    if (f.kind === 'equivalence' || f.kind === 'recognition') {
      f.equivalents.forEach((x, i) => check(f.id, `equivalents[${i}]`, x))
      f.pitfalls.forEach((p, i) => check(f.id, `pitfalls[${i}]`, p.expr))
    } else if (f.kind === 'classification') {
      f.examples.forEach((x, i) => check(f.id, `examples[${i}]`, x))
      f.pitfalls.forEach((p, i) =>
        proseMath(p.why).forEach(m => check(f.id, `pitfalls[${i}].why`, m)))
    } else {
      f.examples.forEach((ex, i) => {
        check(f.id, `examples[${i}].expr`, ex.expr)
        ex.chunks.forEach((c, j) => check(f.id, `examples[${i}].chunks[${j}]`, c))
      })
      f.pitfalls.forEach((p, i) => {
        p.chunks.forEach((c, j) => check(f.id, `pitfalls[${i}].chunks[${j}]`, c))
        proseMath(p.why).forEach(m => check(f.id, `pitfalls[${i}].why`, m))
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
  for (const sk of ['equivalence', 'classification', 'transformation'] as const) {
    for (const m of metas[sk]) proseMath(m.text).forEach(s => check(m.id, 'text', s))
  }

  if (failures.length > 0) {
    throw new Error(`LaTeX compile failures:\n${failures.join('\n')}`)
  }
}

// Every id must be unique across all family files.
export function validateUniqueIds(families: Family[]): void {
  const seen = new Set<string>()
  for (const f of families) {
    if (seen.has(f.id)) throw new Error(`Duplicate family id "${f.id}".`)
    seen.add(f.id)
  }
}

// Validate an array of raw JSON families, with the offending id in any error.
export function parseFamilies(raw: unknown[]): Family[] {
  return raw.map((entry, i) => {
    const result = family.safeParse(entry)
    if (!result.success) {
      const id = (entry as { id?: string })?.id ?? `index ${i}`
      throw new Error(`Invalid family "${id}":\n${z.prettifyError(result.error)}`)
    }
    return result.data
  })
}
