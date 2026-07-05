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

// Fields shared by every family, regardless of kind.
// The id's namespace ("notation." | "structure.") IS the skill — no separate
// skill field. Skill-3 relevance ("flag") is dropped; it will be recaptured when
// the Skill-3 taxonomy is built.
const core = {
  id: z.string().regex(/^(notation|structure)\.[a-z0-9-]+$/,
    'id must be "notation.<slug>" or "structure.<slug>" (lowercase, kebab-case)'),
  group: z.string(),                    // group slug, e.g. "minus-sign"; must exist in groups.json
  title: z.string(),
  priority: z.number().int().positive().optional(),  // authored drilling rank within the skill; lower = earlier; omit = unranked
  metaPatterns: z.array(z.string()).default([]),    // e.g. ["M2"] — refs a meta-pattern in metapatterns.json
  note: z.string(),                     // one/two-line explanation shown in feedback
  conditions: z.string().optional(),    // domain caveat, e.g. "a > 0" (roots)
}

// Every kind has a CORRECT half (varies by kind) and an ERROR half (`pitfalls` —
// the "this is exactly what you must not do" content). The error half keeps the
// same field name across kinds; only its shape differs.

export const family = z.discriminatedUnion('kind', [
  // EQUIVALENCE — a set of forms that are all EQUAL (same value for all inputs).
  // Mostly Skill 1. The `equivalents` share one binding: the `a` in every form is
  // the same `a`. Pitfalls are wrong FORMS (look equal, aren't).
  z.object({
    kind: z.literal('equivalence'),
    ...core,
    equivalents: z.array(z.string()).min(2),   // ≥2 so a SAME pair can be drawn
    pitfalls: z.array(z.string()).default([]),  // non-equal forms
  }),

  // CLASSIFICATION — one expression, name its dominant operation. Skill 2.
  // `examples` are DIFFERENT expressions sharing the SAME structural class; each is
  // independently bound. Pitfalls are wrong LABELS plus why they tempt.
  z.object({
    kind: z.literal('classification'),
    ...core,
    examples: z.array(z.string()).min(1),
    answer: dominantOp,
    pitfalls: z.array(z.object({ answer: dominantOp, why: z.string() })).default([]),
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
    pitfalls: z.array(z.object({ chunks: z.array(z.string()), why: z.string() })).default([]),
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
  id: z.string(),      // "M1".."M5"
  title: z.string(),
  text: z.string(),
})
export type MetaPatternDef = z.infer<typeof metaPatternDef>

export const metaPatternsFile = z.object({
  notation: z.array(metaPatternDef),
  structure: z.array(metaPatternDef),
})
export type MetaPatternsFile = z.infer<typeof metaPatternsFile>

// Cross-check: every metaPattern a family references must exist in its namespace.
export function validateMetaPatternRefs(families: Family[], metas: MetaPatternsFile): void {
  for (const f of families) {
    const ns = namespaceOf(f.id)
    for (const m of f.metaPatterns) {
      if (!metas[ns].some(mp => mp.id === m)) {
        throw new Error(`Family "${f.id}" references unknown ${ns} meta-pattern "${m}".`)
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
