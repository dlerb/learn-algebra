// CLI validation — run with `pnpm validate`.
//
// Importing the data module runs all the load-time validators (schema, unique
// ids, graph, KaTeX) as import side-effects; if any throw, this script aborts
// with their message. On top of that, this file adds the Compute-Engine checks
// that are too heavy to want in the app's runtime bundle: it parses each
// Skill-2 expression to an AST and cross-checks the hand-authored structure
// fields against it.
//
// Why an AST check for Skill 2: a chunking skill's `chunks` are meant to be the
// immediate operands of the root operator, maximally (all terms of a sum, all
// factors of a product). Compute Engine's n-ary Add/Multiply gives exactly that
// decomposition, so it is the ground truth the authored chunks must agree with.
// This is what would have caught `2x(x-1)(x+2)` authored as [2x,(x-1),(x+2)]
// (3 chunks) when the tree has 4 factors.
//
// Compute Engine normalizes in ways we deliberately do NOT compare against:
// it reorders commutative operands, folds subtraction into Add+Negate, and
// folds signs into operands. So we check only the two properties that survive
// all of that — operand COUNT and coarse op-CLASS — not operand strings/order.

import { ComputeEngine } from '@cortex-js/compute-engine'
import { drills } from '../src/data/index'

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

for (const d of drills) {
  if (d.kind === 'classification') {
    // one shared `answer`; every example must share that dominant-op class
    for (const ex of d.examples) {
      const got = astClass(ce.parse(ex, { canonical: true }).operator)
      const want = wantClass[d.answer]
      if (got !== want)
        issues.push(`${d.skill}: example "${ex}" — answer=${d.answer} (${want}) but AST root is ${got}`)
    }
  } else if (d.kind === 'chunking') {
    // each example carries its own op + chunk list
    for (const ex of d.examples) {
      const p = ce.parse(ex.expr, { canonical: true })
      const got = astClass(p.operator)
      const want = wantClass[ex.op]
      if (got !== want)
        issues.push(`${d.skill}: "${ex.expr}" — op=${ex.op} (${want}) but AST root is ${got}`)
      const nOps = p.ops?.length ?? 0
      if (nOps !== ex.chunks.length)
        issues.push(`${d.skill}: "${ex.expr}" — ${ex.chunks.length} chunks authored but AST root has ${nOps} operands `
          + `(${JSON.stringify(p.ops?.map(o => o.toString()))}). Chunks must be the maximal root operands.`)
    }
  }
}

if (issues.length) {
  console.error(`\n✗ Skill-2 AST validation: ${issues.length} issue(s)\n`)
  for (const m of issues) console.error('  ' + m)
  process.exit(1)
}
console.log('✓ Skill-2 AST validation passed (op-class + chunk count).')
