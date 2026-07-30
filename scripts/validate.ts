// CLI validation — run with `pnpm validate`.
//
// Importing the data module runs all the load-time validators (schema, unique
// ids, graph, KaTeX) as import side-effects; if any throw, this script aborts
// with their message. On top of that, this file adds the Compute-Engine checks
// that are too heavy to want in the app's runtime bundle: it parses each
// Skill-2 expression to an AST and cross-checks the hand-authored structure
// fields against it.
//
// Why an AST check: a chunking skill's `chunks` are meant to be the immediate
// operands of the root operator, maximally (all terms of a sum, all factors of a
// product). Compute Engine's n-ary Add/Multiply gives exactly that decomposition,
// so it is the ground truth the authored chunks must agree with. This is what
// would have caught `2x(x-1)(x+2)` authored as [2x,(x-1),(x+2)] (3 chunks) when
// the tree has 4 factors.
//
// ⚠️ IT READS THE SKILLS, NOT THE DRILLS (2026-07-30). It was written against
// drills/*.json only because that is where the material lived; the header above
// has always described a SKILL. With the drill layer retired it points at the
// authored `answer` / `chunks` on the skill itself, which is both its proper
// subject and a wider check — every classification and chunking skill is now
// covered, not only those a drill happened to exist for.
//
// Compute Engine normalizes in ways we deliberately do NOT compare against:
// it reorders commutative operands, folds subtraction into Add+Negate, and
// folds signs into operands. So we check only the two properties that survive
// all of that — operand COUNT and coarse op-CLASS — not operand strings/order.

import { ComputeEngine } from '@cortex-js/compute-engine'
import { skills } from '../src/data/index'

const ce = new ComputeEngine()

// Coarse operator class. Skill-honest labels (sum vs difference, product vs
// quotient) collapse in the semantic tree, so we can only validate the class.
function astClass(op: string | undefined): string {
  if (!op) return 'atom'
  if (op === 'Add' || op === 'Subtract' || op === 'Negate') return 'additive'
  if (op === 'Multiply' || op === 'Divide' || op === 'Rational') return 'multiplicative'
  if (op === 'Power' || op === 'Root' || op === 'Sqrt') return 'power'
  return op
}
const wantClass: Record<string, string> = {
  sum: 'additive', difference: 'additive',
  product: 'multiplicative', quotient: 'multiplicative', power: 'power',
}

const issues: string[] = []

for (const s of skills) {
  const expr = s.illustration
  if (!expr) continue
  const parsed = ce.parse(expr, { canonical: true })
  const got = astClass(parsed.operator)

  // A classification skill names the dominant operation; the illustration's AST
  // root must be in that class.
  if (s.answer) {
    const want = wantClass[s.answer]
    if (got !== want) {
      issues.push(`${s.id}: "${expr}" — answer=${s.answer} (${want}) but AST root is ${got}`)
    }
  }

  // A chunking skill's chunks must be the MAXIMAL root operands.
  if (s.chunks.length > 0) {
    const nOps = parsed.ops?.length ?? 0
    if (nOps !== s.chunks.length) {
      issues.push(`${s.id}: "${expr}" — ${s.chunks.length} chunks authored but AST root has ${nOps} operands `
        + `(${JSON.stringify(parsed.ops?.map(o => o.toString()))}). Chunks must be the maximal root operands.`)
    }
  }
}

if (issues.length) {
  console.error(`\n✗ AST validation: ${issues.length} issue(s)\n`)
  for (const m of issues) console.error('  ' + m)
  process.exit(1)
}
console.log(`✓ AST validation passed (op-class + chunk count) over ${skills.length} skills.`)
