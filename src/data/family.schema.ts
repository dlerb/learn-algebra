import { z } from 'zod'

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
// The id's namespace ("notation." | "structure.") IS the skill — no separate
// skill field. Skill-3 relevance ("flag") is dropped; it will be recaptured when
// the Skill-3 taxonomy is built.
const core = {
  id: z.string().regex(/^(notation|structure)\.[a-z0-9-]+$/,
    'id must be "notation.<slug>" or "structure.<slug>" (lowercase, kebab-case)'),
  group: z.string(),                    // group slug, e.g. "minus-sign"; must exist in groups.json
  title: localizedString,
  priority: z.number().int().positive().optional(),  // authored drilling rank within the skill; lower = earlier; omit = unranked
  requires: z.array(z.string()).default([]),        // DIRECT prerequisites (family ids, cross-skill allowed) — author the transitive reduction, not the closure
  metaPatterns: z.array(z.string()).default([]),    // e.g. ["M2"] — refs a meta-pattern in metapatterns.json
  justifiedBy: z.array(z.string()).default([]),     // law ids (laws.json) that make the true forms true; empty = pure convention
  conventions: z.array(z.string()).default([]),     // convention ids (conventions.json) the family exercises
  note: localizedString,                // one/two-line explanation shown in feedback
  conditions: z.string().optional(),    // domain caveat NOT already carried by a cited law, e.g. "a > 0"
}

// Every kind has a CORRECT half (varies by kind) and an ERROR half (`pitfalls` —
// the "this is exactly what you must not do" content). The error half keeps the
// same field name across kinds; only its shape differs.
//
// Any pitfall may carry `revise`: family ids to send the student to when this
// SPECIFIC error fires — for errors that point at a sharper gap than the
// family-level `requires`. Omit it where `requires` + metaPatterns suffice.
// Any pitfall may carry `cites`: error-pattern ids (errors.json) naming WHY
// the wrong form tempts — a false law, a misreading, or one of each.

// An equivalence pitfall is authored as a bare LaTeX string, or as an object
// when it carries `revise` or `cites`. Normalized to object form on parse.
const equivPitfall = z
  .union([z.string(), z.object({
    expr: z.string(),
    revise: z.array(z.string()).min(1).optional(),
    cites: z.array(z.string()).min(1).optional(),
  })])
  .transform((p): { expr: string; revise?: string[]; cites?: string[] } =>
    (typeof p === 'string' ? { expr: p } : p))

export const family = z.discriminatedUnion('kind', [
  // EQUIVALENCE — a set of forms that are all EQUAL (same value for all inputs).
  // Mostly Skill 1. The `equivalents` share one binding: the `a` in every form is
  // the same `a`. Pitfalls are wrong FORMS (look equal, aren't).
  z.object({
    kind: z.literal('equivalence'),
    ...core,
    equivalents: z.array(z.string()).min(2),   // ≥2 so a SAME pair can be drawn
    pitfalls: z.array(equivPitfall).default([]),  // non-equal forms
  }),

  // CLASSIFICATION — one expression, name its dominant operation. Skill 2.
  // `examples` are DIFFERENT expressions sharing the SAME structural class; each is
  // independently bound. Pitfalls are wrong LABELS plus why they tempt.
  z.object({
    kind: z.literal('classification'),
    ...core,
    examples: z.array(z.string()).min(1),
    answer: dominantOp,
    pitfalls: z.array(z.object({
      answer: dominantOp,
      why: localizedString,
      revise: z.array(z.string()).min(1).optional(),
      cites: z.array(z.string()).min(1).optional(),
    })).default([]),
  }),

  // DECOMPOSITION — break an expression into its chunks. Skill 2 group C.
  // Not drilled yet (no exercise type maps to it); authored now for the library.
  z.object({
    kind: z.literal('decomposition'),
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
      cites: z.array(z.string()).min(1).optional(),
    })).default([]),
  }),
])

export type Family = z.infer<typeof family>

// The skill "namespace" is derived from the id prefix — the single source of the
// skill axis (no redundant `skill` field).
export type Namespace = 'notation' | 'structure'
export function namespaceOf(id: string): Namespace {
  return id.startsWith('structure.') ? 'structure' : 'notation'
}

// ── Groups ───────────────────────────────────────────────────────────────────
// Groups organize families into ordered sections in the lookup view. Defined once
// in groups.json (keyed by namespace: "notation" | "structure"); a family
// references its group by slug. Array order = display order.

export const groupDef = z.object({
  slug: z.string(),
  title: z.string(),
  blurb: z.string().optional(),
})
export type GroupDef = z.infer<typeof groupDef>

export const groupsFile = z.object({
  notation: z.array(groupDef),
  structure: z.array(groupDef),
})
export type GroupsFile = z.infer<typeof groupsFile>

// Cross-check: every family's group slug must exist under its namespace.
export function validateGroupRefs(families: Family[], groups: GroupsFile): void {
  for (const f of families) {
    const ns = namespaceOf(f.id)
    if (!groups[ns].some(g => g.slug === f.group)) {
      throw new Error(`Family "${f.id}" references unknown ${ns} group "${f.group}".`)
    }
  }
}

// ── Meta-patterns ────────────────────────────────────────────────────────────
// The generative decoding rules (Section 0 of each taxonomy). Defined once in
// metapatterns.json, namespaced; families reference them by id ("M2").

export const metaPatternDef = z.object({
  id: z.string().regex(/^meta\.[a-z0-9-]+$/),  // globally unique slug, like every other id
  code: z.string(),    // display code "M1".."M6" — the classroom name, unique per namespace only
  title: localizedString,
  text: localizedString,                  // the student-facing takeaway line in drill feedback
  refs: z.array(z.string()).default([]),  // law/convention/error ids this pattern digests — keeps the classroom voice linked to the layer it summarizes
})
export type MetaPatternDef = z.infer<typeof metaPatternDef>

export const metaPatternsFile = z.object({
  notation: z.array(metaPatternDef),
  structure: z.array(metaPatternDef),
})
export type MetaPatternsFile = z.infer<typeof metaPatternsFile>

// Cross-check: every metaPattern a family references must exist in its namespace.
export function validateMetaPatternRefs(families: Family[], metas: MetaPatternsFile): void {
  // Slug ids must be globally unique even though the file is namespaced.
  const all = [...metas.notation, ...metas.structure].map(m => m.id)
  const dup = all.find((id, i) => all.indexOf(id) !== i)
  if (dup) throw new Error(`Duplicate meta-pattern id "${dup}" across namespaces.`)

  for (const f of families) {
    const ns = namespaceOf(f.id)
    for (const m of f.metaPatterns) {
      if (!metas[ns].some(mp => mp.id === m)) {
        throw new Error(`Family "${f.id}" references unknown ${ns} meta-pattern "${m}".`)
      }
    }
  }
}

// ── Laws (layer 1) ───────────────────────────────────────────────────────────
// The logical skeleton of school algebra (docs/laws_and_conventions.md). Three
// sorts: axiom (accepted, no links), definition (carries `basedOn` — what it
// presupposes), theorem (carries `derivedFrom` — what proves it). The id
// prefix mirrors the sort so a derivation chain reads like a proof. `code` is
// the short display code matching the doc (A1, D3, T11).

export const lawSort = z.enum(['axiom', 'definition', 'theorem'])
export type LawSort = z.infer<typeof lawSort>

export const lawDef = z.object({
  id: z.string().regex(/^(ax|def|thm)\.[a-z0-9-]+$/),
  code: z.string(),
  sort: lawSort,
  name: localizedString,
  latex: z.string(),                            // the statement, KaTeX
  conditions: z.string().optional(),            // domain condition, e.g. "b \\ne 0"; families citing the law inherit it
  basedOn: z.array(z.string()).default([]),     // definitions only
  derivedFrom: z.array(z.string()).default([]), // theorems only
  note: localizedString.optional(),
})
export type LawDef = z.output<typeof lawDef>

const lawPrefixOfSort: Record<LawSort, string> = { axiom: 'ax', definition: 'def', theorem: 'thm' }

export function validateLaws(laws: LawDef[]): void {
  const byId = new Map(laws.map(l => [l.id, l]))
  if (byId.size !== laws.length) throw new Error('Duplicate law id.')

  for (const l of laws) {
    if (!l.id.startsWith(lawPrefixOfSort[l.sort] + '.')) {
      throw new Error(`Law "${l.id}" has sort "${l.sort}" but a mismatching id prefix.`)
    }
    if (l.sort !== 'definition' && l.basedOn.length > 0) {
      throw new Error(`Law "${l.id}" (${l.sort}) may not carry basedOn — definitions only.`)
    }
    if (l.sort !== 'theorem' && l.derivedFrom.length > 0) {
      throw new Error(`Law "${l.id}" (${l.sort}) may not carry derivedFrom — theorems only.`)
    }
    if (l.sort === 'theorem' && l.derivedFrom.length === 0) {
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
// The agreed rules of the writing system — no truth value. `code` = N1..N12.

export const conventionDef = z.object({
  id: z.string().regex(/^conv\.[a-z0-9-]+$/),
  code: z.string(),
  name: localizedString,
  text: localizedString,
})
export type ConventionDef = z.output<typeof conventionDef>

// ── Error patterns ───────────────────────────────────────────────────────────
// First-class citizens of the error space: ONE addressable list that pitfalls
// cite, so drill data can be analyzed per error pattern from day one. Sorts:
// false-law (`of` = the true laws it distorts) and misreading (`of` = the
// conventions it violates). `code` = Ā1..Ā5 / R1..R15.

export const errorSort = z.enum(['false-law', 'misreading'])
export type ErrorSort = z.infer<typeof errorSort>

export const errorDef = z.object({
  id: z.string().regex(/^(anti|mis)\.[a-z0-9-]+$/),
  code: z.string(),
  sort: errorSort,
  of: z.array(z.string()).default([]),
  name: localizedString,
  text: localizedString,
  instances: z.array(z.string()).default([]),   // typical wrong forms, KaTeX
})
export type ErrorDef = z.output<typeof errorDef>

export function validateErrors(errors: ErrorDef[], laws: LawDef[], conventions: ConventionDef[]): void {
  const lawIds = new Set(laws.map(l => l.id))
  const convIds = new Set(conventions.map(c => c.id))
  const seen = new Set<string>()
  for (const e of errors) {
    if (seen.has(e.id)) throw new Error(`Duplicate error id "${e.id}".`)
    seen.add(e.id)
    const wantPrefix = e.sort === 'false-law' ? 'anti.' : 'mis.'
    if (!e.id.startsWith(wantPrefix)) {
      throw new Error(`Error "${e.id}" has sort "${e.sort}" but a mismatching id prefix.`)
    }
    const pool = e.sort === 'false-law' ? lawIds : convIds
    const poolName = e.sort === 'false-law' ? 'law' : 'convention'
    for (const r of e.of) {
      if (!pool.has(r)) throw new Error(`Error "${e.id}" is "of" unknown ${poolName} "${r}".`)
    }
  }
}

// ── Cross-layer references from families and meta-patterns ──────────────────
// `justifiedBy` → laws; `conventions` → conventions; pitfall `cites` → error
// patterns; meta-pattern `refs` → any of the three.

function citeTargets(f: Family): string[] {
  const pitfalls: { cites?: string[] }[] = f.pitfalls
  return pitfalls.flatMap(p => p.cites ?? [])
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
    for (const r of f.conventions) {
      if (!convIds.has(r)) throw new Error(`Family "${f.id}" references unknown convention "${r}".`)
    }
    for (const r of citeTargets(f)) {
      if (!errIds.has(r)) throw new Error(`A pitfall of "${f.id}" cites unknown error pattern "${r}".`)
    }
  }
  for (const ns of ['notation', 'structure'] as const) {
    for (const m of metas[ns]) {
      for (const r of m.refs) {
        if (!lawIds.has(r) && !convIds.has(r) && !errIds.has(r)) {
          throw new Error(`Meta-pattern ${ns}/${m.id} refs unknown id "${r}".`)
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
  const untagged = families.filter(f => f.justifiedBy.length === 0 && f.conventions.length === 0)
  if (untagged.length > 0) {
    lines.push(`${untagged.length}/${families.length} families have no layer coordinates yet (justifiedBy/conventions).`)
  }

  // Authored ⊆ derived: on a tagged family, every authored meta-pattern should
  // be reachable from the family's coordinates via the pattern's refs.
  // (Authored stays curation — this only catches a missing tag or a
  // meta-pattern citation that doesn't fit the family.)
  for (const f of families) {
    if (f.justifiedBy.length === 0 && f.conventions.length === 0) continue
    const coords = new Set([...f.justifiedBy, ...f.conventions, ...citeTargets(f)])
    const unsupported = f.metaPatterns.filter(mid => {
      const mp = metas[namespaceOf(f.id)].find(m => m.id === mid)
      return mp !== undefined && !mp.refs.some(r => coords.has(r))
    })
    if (unsupported.length > 0) {
      lines.push(`"${f.id}" cites meta-patterns its coordinates don't support: ${unsupported.join(', ')}`)
    }
  }
  const citedLaws = new Set(families.flatMap(f => f.justifiedBy))
  const citedConvs = new Set(families.flatMap(f => f.conventions))
  const citedErrs = new Set(families.flatMap(citeTargets))
  const uncited = (kind: string, ids: string[], cited: Set<string>) => {
    const free = ids.filter(id => !cited.has(id))
    if (free.length > 0) lines.push(`${kind} cited by no family: ${free.join(', ')}`)
  }
  uncited('Laws', laws.filter(l => l.sort !== 'axiom').map(l => l.id), citedLaws)  // axioms may be reached only via theorems
  uncited('Conventions', conventions.map(c => c.id), citedConvs)
  uncited('Error patterns', errors.map(e => e.id), citedErrs)
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
// fixed (structure builds on notation, never the reverse), so a cross-skill
// edge is checked for direction only, not rank.

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
      if (namespaceOf(f.id) !== namespaceOf(req.id)) {
        if (namespaceOf(f.id) === 'notation') {
          throw new Error(
            `Family "${f.id}" (notation) requires "${r}" (structure) — `
            + `cross-skill dependencies must point from structure to notation.`)
        }
        continue  // structure → notation: always consistent, ranks not comparable
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
