// WHO CITES WHAT — CLI over `src/data/citations.ts`. Run with `pnpm who-cites`.
//
//   pnpm who-cites rule.minus-rules          every citation of a rule, with context
//   pnpm who-cites minus-rules               bare slug works; substring matches too
//   pnpm who-cites rule.a rule.b             several at once, e.g. before a merge
//   pnpm who-cites --audit                   the whole pool, sorted by how uncited
//   pnpm who-cites --audit --kind mistake    …for mistakes instead of rules
//   pnpm who-cites rule.x --json             machine-readable, for piping
//
// ⚠️ READ THIS BEFORE A SPLIT, not after. The point of the detail view is that
// every citation prints with a line of the CITER's own body — a skill's stimulus,
// a mistake's false sentence — because "which half of the split rule did this
// one mean" is not answerable from an id. Work down the printed list and the
// split is mechanical; skip it and the citations silently keep pointing at
// whichever half kept the old id, which no validator can catch (the reference
// still resolves — it is just no longer true).
//
// ⚠️ AND READ THE `cites:` HALF BEFORE A MERGE. Merging two entries has to union
// what they point AT — `summarizes` cards, `breaks` rules — and a card that only
// one of the two digested is the thing quietly dropped.

import type { Citation, EntityKind } from '../src/data/citations'

// Importing the data module prints the coverage audit as an import side-effect
// (see src/data/index.ts). Useful under `pnpm validate`, noise here — this tool's
// output is meant to be read as a checklist or piped as JSON.
const info = console.info
console.info = () => {}
const { citations, citationsTo, citationsFrom, entities, resolve } =
  await import('../src/data/citations')
console.info = info

const argv = process.argv.slice(2).filter(a => a !== '--')
const flag = (name: string) => argv.includes(name)
const opt = (name: string) => {
  const i = argv.indexOf(name)
  return i === -1 ? undefined : argv[i + 1]
}
const asJson = flag('--json')
const queries = argv.filter((a, i) =>
  !a.startsWith('--') && argv[i - 1] !== '--kind')

const KIND_ORDER: EntityKind[] = ['skill', 'mistake', 'rule', 'sheet', 'card']
const PLURAL: Record<EntityKind, string> = {
  skill: 'skills', mistake: 'mistakes', rule: 'rules', sheet: 'sheets', card: 'cards',
}

const pad = (s: string, n: number) => s.length >= n ? s : s + ' '.repeat(n - s.length)

/** Group citations by the kind of entity on the far side. */
function byKind(cs: Citation[], side: 'from' | 'to'): Map<EntityKind, Citation[]> {
  const m = new Map<EntityKind, Citation[]>()
  for (const k of KIND_ORDER) {
    const hits = cs.filter(c => (side === 'from' ? c.fromKind : c.toKind) === k)
    if (hits.length > 0) m.set(k, hits)
  }
  return m
}

function detail(id: string): void {
  const e = entities.get(id)!
  const to = citationsTo(id)
  const from = citationsFrom(id)

  console.log(`\n\x1b[1m${e.id}\x1b[0m  ${e.label}`)
  console.log(`  kind: ${e.kind}`)

  if (to.length === 0) {
    console.log(`\n  \x1b[33mcited by nothing.\x1b[0m`)
  } else {
    console.log(`\n  cited by ${to.length}:`)
    for (const [kind, cs] of byKind(to, 'from')) {
      console.log(`    ${PLURAL[kind]} (${cs.length})`)
      const w = Math.max(...cs.map(c => c.from.length))
      for (const c of cs) {
        console.log(`      ${pad(c.from, w)}  \x1b[2m${pad('[' + c.field + ']', 22)}\x1b[0m ${c.context}`)
      }
    }
  }

  if (from.length > 0) {
    console.log(`\n  cites ${from.length}:`)
    for (const [kind, cs] of byKind(from, 'to')) {
      const ids = cs.map(c => `${c.to} \x1b[2m[${c.field}]\x1b[0m`)
      console.log(`    ${PLURAL[kind]} (${cs.length}): ${ids.join(', ')}`)
    }
  }
}

/** The aggregate the per-id view cannot give: which entries nothing teaches. */
function audit(kind: EntityKind): void {
  const pool = [...entities.values()].filter(e => e.kind === kind)
  const rows = pool.map(e => {
    const cs = citationsTo(e.id)
    const count = (k: EntityKind) => cs.filter(c => c.fromKind === k).length
    return {
      e,
      total: cs.length,
      skills: count('skill'),
      mistakes: count('mistake'),
      sheets: count('sheet'),
      family: count(kind),   // members that name this entry as their family head
    }
  }).sort((a, b) => a.skills - b.skills || a.total - b.total || a.e.id.localeCompare(b.e.id))

  const w = Math.max(...rows.map(r => r.e.id.length))
  console.log(`\n\x1b[1m${pool.length} ${PLURAL[kind]}\x1b[0m, least-cited first`)
  console.log(`  ${pad('id', w)}  skill  mist  sheet  fam   sentence`)
  for (const r of rows) {
    const zero = r.skills === 0 ? '\x1b[33m' : ''
    console.log(`  ${zero}${pad(r.e.id, w)}  ${pad(String(r.skills), 5)}  ${pad(String(r.mistakes), 4)}  `
      + `${pad(String(r.sheets), 5)}  ${pad(String(r.family), 4)}  ${r.e.label.slice(0, 48)}\x1b[0m`)
  }

  // ⚠️ SPLIT THE HEADS OUT OF THE COVERAGE NUMBER. A family head is a heading —
  // "Zero and one", "Binomial formulas" — not a sentence a student acts on, so no
  // skill should cite it and its zero is not a gap. Counting heads in makes the
  // coverage gap look bigger than it is, which is how the same question gets
  // answered with a different number each time it is asked.
  const noSkill = rows.filter(r => r.skills === 0)
  const heads = noSkill.filter(r => r.family > 0)
  const leaves = noSkill.filter(r => r.family === 0)
  const nothing = rows.filter(r => r.total === 0)
  console.log(`\n  \x1b[33m${leaves.length}/${pool.length} ${PLURAL[kind]} no skill cites\x1b[0m`
    + ` — the coverage gap. (Plus ${heads.length} family heads, which is normal: a`
    + ` heading is not a sentence to teach.)`)
  console.log(`  ${nothing.length}/${pool.length} nothing cites at all.`)
}

if (flag('--audit')) {
  const kind = (opt('--kind') ?? 'rule') as EntityKind
  if (!KIND_ORDER.includes(kind)) {
    console.error(`Unknown --kind "${kind}". One of: ${KIND_ORDER.join(', ')}`)
    process.exit(1)
  }
  if (asJson) {
    const pool = [...entities.values()].filter(e => e.kind === kind)
    console.log(JSON.stringify(pool.map(e => ({ ...e, citedBy: citationsTo(e.id) })), null, 2))
  } else audit(kind)
} else if (queries.length === 0) {
  console.error('usage: pnpm who-cites <id|slug>… | --audit [--kind rule|mistake|card|skill] [--json]')
  console.error(`       ${citations.length} citations indexed over ${entities.size} entities.`)
  process.exit(1)
} else {
  const resolved: string[] = []
  for (const q of queries) {
    const hits = resolve(q)
    if (hits.length === 0) {
      console.error(`\x1b[31mno entity matches "${q}".\x1b[0m`)
      process.exit(1)
    }
    // An ambiguous slug is worth showing rather than guessing: `linearity` names
    // both a rule and the mistake defined against it, and after a split the two
    // halves share a prefix by design.
    if (hits.length > 1 && !entities.get(q)) {
      console.error(`"${q}" matches ${hits.length}: ${hits.map(h => h.id).join(', ')}`)
    }
    resolved.push(...hits.map(h => h.id))
  }
  if (asJson) {
    console.log(JSON.stringify(resolved.map(id => ({
      id, entity: entities.get(id), citedBy: citationsTo(id), cites: citationsFrom(id),
    })), null, 2))
  } else {
    for (const id of resolved) detail(id)
    console.log('')
  }
}
