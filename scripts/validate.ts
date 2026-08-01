// CLI validation — run with `pnpm validate`.
//
// Importing the data module runs all the load-time validators (schema, unique
// ids, graph, KaTeX) as import side-effects; if any throw, this script aborts
// with their message. On top of that, this file adds the Compute-Engine check
// that is too heavy to want in the app's runtime bundle.
//
// ── WHAT IT CHECKS, since the stimulus/right split (2026-07-30) ──────────────
// EVERY `right[]` ENTRY MUST EQUAL ITS STIMULUS. That is the whole contract of
// the field — `right[]` holds what the stimulus may legitimately become, with the
// stimulus implied as the left-hand side — so a semantic equality test validates
// the entire good half of the layer in one sweep, fluency chains and chunking
// decompositions alike. It is strictly stronger than what stood here before,
// which could only compare a root operator class and an operand count against
// hand-authored `answer`/`chunks` fields that no longer exist.
//
// ⚠️ CE NORMALIZES, and that is exactly why it is safe HERE and nowhere near the
// display path: it reorders commutative operands, folds subtraction into
// Add+Negate and folds signs into operands. Two forms differing only in surface
// come back equal — the property this check wants, and the property that would
// destroy the authored notation if it ever drove rendering.
//
// ⚠️ THE EXEMPTIONS BELOW ARE NOT BUGS. Each is a real fact about notation or
// domain that a computer algebra system cannot be expected to know, and in each
// case it is the SUBJECT of the skill that carries it. Do not "fix" them by
// rewriting the data; add to the list only for a reason of the same kind.

import { ComputeEngine } from '@cortex-js/compute-engine'
import { skills } from '../src/data/index'
import { TERMINAL } from '../src/data/skill.schema'

const ce = new ComputeEngine()

/** skill id → why CE cannot decide this one. */
const CANNOT_DECIDE: Record<string, string> = {
  // Bracket TYPE is a notation convention; to CE `[a+b]` and `\{a+b\}` are not
  // brackets at all. That interchangeability is the entire content of the skill.
  'skill.bracket-types': 'bracket variants are notation, not structure',
  // `a^{m/n} = \sqrt[n]{a^m}` holds for a > 0, which is exactly what these skills'
  // own `conditions` say. CE will not assert it unconditionally, and is right.
  'skill.fractional-exponent-root': 'needs the a > 0 condition the skill declares',
  'skill.negative-fractional-exponent': 'needs the a > 0 condition the skill declares',
  // The colon is the primary-school division sign. CE reports "Unknown operator
  // Colon" — and teaching that `a : b` is the same object is the skill's point.
  'skill.division-variants': 'CE has no colon-as-division operator',
  // `x^a x^b = x^{a+b}` needs its EXPONENTS quantified: pl.same-base states it for
  // m, n ∈ ℕ, where it holds for every real base. The skill inherits that through
  // restsOn and does not restate it (design decision 5), so CE sees free symbols,
  // samples a non-integer exponent against a negative base, and is right to refuse.
  //
  // ⚠️ THIS ONE WAS FOUND BY LUCK RUNNING OUT, not by a data change. CE falls back
  // to NUMERIC SAMPLING when it cannot decide symbolically, so `isEqual` on the
  // very same two expression objects returns false about 10% of the time and
  // `pnpm validate` had been green by chance. Measured over 40 full sweeps this is
  // the only entry that ever flickered — but a future skill can join it silently,
  // and a green run is not by itself proof the check was decided.
  'skill.simplify-power-product': 'CE samples exponents the skill quantifies over ℕ',
}

const issues: string[] = []
let checked = 0

for (const s of skills) {
  if (CANNOT_DECIDE[s.id]) continue
  const lhs = ce.parse(s.stimulus, { canonical: true })
  for (const [i, r] of s.right.entries()) {
    // ⚠️ BEFORE ce.parse, NEVER AFTER. The sentinel is not an expression: CE reads
    // \blacksquare as an Error node, returns `undefined` from isEqual — undecided,
    // not false, which is the green-by-luck hazard this file's header warns about —
    // and prints a "compilation fallback" line to stderr on every single run.
    if (r.latex === TERMINAL) continue
    checked++
    try {
      if (!lhs.isEqual(ce.parse(r.latex, { canonical: true }))) {
        issues.push(`${s.id}: right[${i}] "${r.latex}" is not equal to the stimulus "${s.stimulus}"`)
      }
    } catch (e) {
      issues.push(`${s.id}: right[${i}] "${r.latex}" — CE threw: ${(e as Error).message}`)
    }
  }
}

if (issues.length) {
  console.error(`\n✗ stimulus/right equality: ${issues.length} issue(s)\n`)
  for (const m of issues) console.error('  ' + m)
  process.exit(1)
}
console.log(`✓ every right[] entry equals its stimulus (${checked} checked, `
  + `${Object.keys(CANNOT_DECIDE).length} skills exempt with cause).`)
