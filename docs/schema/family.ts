// Core types for the algebra fluency trainer family schema.
// Families are the basic curriculum unit — one entry in the taxonomy.
// They are authored as JSON (human-readable LaTeX strings),
// parsed into MathJSON at runtime via Compute Engine.

// ─── Primitives ──────────────────────────────────────────────────────────────

export type SkillNumber = 1 | 2;

export type SkillFlag =
  | 'S1'       // Skill 1 only: notation recognition
  | 'S1+S3'    // Skill 1 + Skill 3: also a strategic manipulation tool
  | 'S2'       // Skill 2 only: structural recognition
  | 'S2->S3';  // Skill 2 + directly unlocks a Skill 3 tool

export type ExerciseType =
  | 'same_or_different'  // Type 1: two expressions, SAME or DIFFERENT?
  | 'odd_one_out'        // Type 2: four expressions, tap the one that doesn't belong
  | 'name_structure';    // Type 3: one expression, tap its dominant operation

export type DominantOp =
  | 'sum'
  | 'difference'
  | 'product'
  | 'quotient'
  | 'power';

// ─── Parameters ──────────────────────────────────────────────────────────────

// A single parameter value.
// Plain string shorthand = level 1 (used for simple families).
// Explicit object form used when progressive difficulty matters.
export type ParamEntry =
  | string                              // shorthand: { value: string, level: 1 }
  | { value: string; level: 1 | 2 | 3 };

// Parameter slots: uppercase letter keys matching the template strings.
// E.g. { A: [...], B: [...] } for a template like "-(A - B)".
export type Params = Record<string, ParamEntry[]>;

// ─── Family ──────────────────────────────────────────────────────────────────

export interface Family {
  // Unique identifier. Skill 1 families: "S1.A1", "S1.B4", etc.
  // Skill 2 families: "S2.B2", "S2.D1", etc.
  id: string;

  skill: SkillNumber;
  skillFlag: SkillFlag;

  // Single letter, matches the group in the taxonomy document.
  group: string;

  title: string;

  // Determines introduction order. Lower = introduced earlier.
  // Matches the priority order in the taxonomy documents.
  priority: number;

  // ── Content ──

  // Equivalent surface forms — all mean the same thing.
  // LaTeX strings with uppercase letters as parameter slots.
  //
  // Skill 1: multiple notation variants of the same expression.
  //   At least 2 required (to generate SAME pairs).
  //   At least 3 recommended (to support odd_one_out).
  //
  // Skill 2: one or two representative forms of the expression to classify.
  forms: string[];

  // Parameter slot definitions.
  // Values are LaTeX strings. Levels allow progressive difficulty:
  //   level 1: simple (single variable or small integer)
  //   level 2: medium (e.g. "2x")
  //   level 3: complex (e.g. "x+1", "x-1")
  params: Params;

  // Wrong-answer templates using the same parameter slots.
  // Skill 1 only: used to generate DIFFERENT pairs (Type 1)
  // and the odd-one-out item (Type 2).
  // Each distractor reflects a real, common student error.
  distractors?: string[];

  // Which exercise types this family supports.
  exerciseTypes: ExerciseType[];

  // Skill 2 only: the correct answer for Type 3 (name the structure).
  // Derived from the template tree, but declared explicitly for clarity
  // and to avoid runtime inference errors.
  dominantOp?: DominantOp;

  // Meta-pattern IDs shown in feedback after a wrong answer.
  // References Section 0 of the taxonomy documents ("M1"–"M5").
  metaPatterns: string[];

  // One or two sentences shown in feedback.
  // Should name the specific error and explain why it's wrong.
  feedbackNote: string;
}
