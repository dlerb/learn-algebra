export type SkillNumber = 1 | 2
export type SkillFlag = 'S1' | 'S1+S3' | 'S2' | 'S2->S3'
export type ExerciseType = 'same_or_different' | 'odd_one_out' | 'name_structure'
export type DominantOp = 'sum' | 'difference' | 'product' | 'quotient' | 'power'

// Plain string = level 1. Object form for progressive difficulty.
export type ParamEntry = string | { value: string; level: 1 | 2 | 3 }

export interface Family {
  id: string
  skill: SkillNumber
  skillFlag: SkillFlag
  group: string
  title: string
  priority: number

  // LaTeX templates with {A}, {B}, ... as parameter slots.
  // All forms are equivalent expressions — different surface notation.
  forms: string[]

  params: Record<string, ParamEntry[]>

  // Wrong-answer templates (same params, different meaning).
  // Used for DIFFERENT pairs and odd-one-out items.
  distractors?: string[]

  exerciseTypes: ExerciseType[]

  // Skill 2 only: correct answer for name_structure exercise.
  dominantOp?: DominantOp

  metaPatterns: string[]
  feedbackNote: string
}
