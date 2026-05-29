import type { Family, ParamEntry } from '../types/family'

export interface SameOrDifferentItem {
  type: 'same_or_different'
  familyId: string
  left: string       // LaTeX
  right: string      // LaTeX
  correct: 'same' | 'different'
  feedbackNote: string
  metaPatterns: string[]
}

export interface NameStructureItem {
  type: 'name_structure'
  familyId: string
  expression: string  // LaTeX
  correct: string     // DominantOp
  feedbackNote: string
  metaPatterns: string[]
}

export type ExerciseItem = SameOrDifferentItem | NameStructureItem

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickTwo<T>(arr: T[]): [T, T] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return [shuffled[0], shuffled[1]]
}

function entryValue(e: ParamEntry): string {
  return typeof e === 'string' ? e : e.value
}

function entryLevel(e: ParamEntry): number {
  return typeof e === 'string' ? 1 : e.level
}

// Returns only level-1 values (used early in progression).
function levelOneValues(entries: ParamEntry[]): string[] {
  return entries.filter(e => entryLevel(e) === 1).map(entryValue)
}

// Substitutes {A}, {B}, ... in a LaTeX template string.
// Matches only single uppercase letters in braces to avoid LaTeX conflicts.
function substitute(template: string, params: Record<string, string>): string {
  return template.replace(/\{([A-Z])\}/g, (_, key) => params[key] ?? `{${key}}`)
}

// Draws one concrete value per parameter slot (level 1 only for now).
function drawParams(family: Family): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, entries] of Object.entries(family.params)) {
    const values = levelOneValues(entries)
    result[key] = pickRandom(values.length > 0 ? values : entries.map(entryValue))
  }
  return result
}

// ─── Generators ──────────────────────────────────────────────────────────────

export function generateSameOrDifferent(family: Family): SameOrDifferentItem {
  const params = drawParams(family)
  const isSame = Math.random() < 0.5

  let left: string
  let right: string

  if (isSame) {
    const [f1, f2] = pickTwo(family.forms)
    left = substitute(f1, params)
    right = substitute(f2, params)
  } else {
    const form = pickRandom(family.forms)
    const distractor = pickRandom(family.distractors ?? [])
    if (Math.random() < 0.5) {
      left = substitute(form, params)
      right = substitute(distractor, params)
    } else {
      left = substitute(distractor, params)
      right = substitute(form, params)
    }
  }

  // Substitute params into the feedback note too (makes it concrete).
  const feedbackNote = substitute(family.feedbackNote, params)

  return {
    type: 'same_or_different',
    familyId: family.id,
    left,
    right,
    correct: isSame ? 'same' : 'different',
    feedbackNote,
    metaPatterns: family.metaPatterns,
  }
}

export function generateNameStructure(family: Family): NameStructureItem {
  const params = drawParams(family)
  const form = pickRandom(family.forms)

  return {
    type: 'name_structure',
    familyId: family.id,
    expression: substitute(form, params),
    correct: family.dominantOp!,
    feedbackNote: family.feedbackNote,
    metaPatterns: family.metaPatterns,
  }
}

export function generateItem(family: Family): ExerciseItem {
  if (family.exerciseTypes.includes('same_or_different')) {
    return generateSameOrDifferent(family)
  }
  if (family.exerciseTypes.includes('name_structure')) {
    return generateNameStructure(family)
  }
  return generateSameOrDifferent(family)
}
