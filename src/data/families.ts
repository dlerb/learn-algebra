import type { Family } from '../types/family'

// Note: templates use {A}, {B}, ... as parameter slots.
// Single uppercase letter in braces — unambiguous, doesn't conflict with LaTeX.

export const families: Family[] = [
  {
    id: 'S1.A1',
    skill: 1,
    skillFlag: 'S1',
    group: 'A',
    title: 'Explicit vs implicit multiplication',
    priority: 5,
    forms: [
      '{A} \\times {B}',
      '{A} \\cdot {B}',
      '{A}{B}',
      '{B} \\cdot {A}',
      '({A})({B})',
    ],
    params: {
      A: ['2', '3', '4', '5'],
      B: ['x', 'y', 'a', 'n'],
    },
    distractors: [
      '{A} + {B}',
    ],
    exerciseTypes: ['same_or_different', 'odd_one_out'],
    metaPatterns: ['M1'],
    feedbackNote:
      'Symbols written next to each other, or joined by \\cdot or \\times, all mean multiplication. Juxtaposition is never addition.',
  },

  {
    id: 'S1.B4',
    skill: 1,
    skillFlag: 'S1+S3',
    group: 'B',
    title: 'Distributing a negative over a difference',
    priority: 1,
    forms: [
      '-({A} - {B})',
      '-{A} + {B}',
      '{B} - {A}',
    ],
    params: {
      A: [
        'a', 'x',
        { value: '2x', level: 2 },
        { value: 'x+1', level: 3 },
      ],
      B: [
        'b', 'y',
        { value: '3', level: 2 },
        { value: 'x-1', level: 3 },
      ],
    },
    distractors: [
      '-{A} - {B}',
    ],
    exerciseTypes: ['same_or_different', 'odd_one_out'],
    metaPatterns: ['M2'],
    feedbackNote:
      'The minus flips the sign of every term inside the bracket. -({A} - {B}) = -{A} + {B}, not -{A} - {B}.',
  },

  {
    id: 'S2.B2',
    skill: 2,
    skillFlag: 'S2',
    group: 'B',
    title: 'Sum of products — multiplication is inside the terms',
    priority: 1,
    forms: [
      '{A}{X} + {B}{Y}',
      '{A} \\cdot {X} + {B} \\cdot {Y}',
    ],
    params: {
      A: ['2', '3', '5'],
      X: ['x', 'a'],
      B: ['2', '3', '4'],
      Y: ['y', 'b'],
    },
    exerciseTypes: ['name_structure'],
    dominantOp: 'sum',
    metaPatterns: ['M3'],
    feedbackNote:
      'The multiplications are inside the terms and already done. The last operation applied to the whole expression is addition — this is a sum.',
  },
]

export function getFamilyById(id: string): Family | undefined {
  return families.find(f => f.id === id)
}

export function getFamiliesForSkill(skill: 1 | 2): Family[] {
  return families.filter(f => f.skill === skill)
}
