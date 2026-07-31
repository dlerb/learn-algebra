// The layer-tree sweep from docs/fundamentals.md "Verifying edits", made runnable:
// `pnpm sweep-layers`. Compiles every latex field and every inline $…$ fragment
// with NO macros defined (proving nothing depends on the deleted \num/\nnum),
// then checks ids are unique tower-wide, citations resolve across layers,
// concerns are present and valid, and the prose rules hold (no em dash, no ß,
// no retired "sign"/"Vorzeichen"). En dashes are allowed: they spell ranges.
//
// Structural validation also runs at load time in src/data/layers.ts; this
// script is the part that needs KaTeX and so stays out of the app bundle.
//
// The prose rules themselves moved to scripts/content-prose.mjs on 2026-07-25, so
// that the in-app editor's write endpoint checks text against the very same rules
// before saving it. A checker and a writer that disagreed would hand you a green
// save and then a red sweep.
import fs from 'fs'
import { checkLatex, checkProse } from './content-prose.mjs'

const files = ['src/data/fundament/fundamentals/cards.json', 'src/data/fundament/numbers/cards.json', 'src/data/fundament/powers/cards.json', 'src/data/fundament/terms/cards.json']
const LATEX_FIELDS = ['latex','derivation','cond','forall','avoid','prefer','symbol','type']
let errs = [], codes = new Map(), refs = [], n = 0
const CONCERNS = new Set(['add','mul','eq','order','completeness'])

const tryTex = (tex, where) => { n++
  const bad = checkLatex(tex)
  if (bad) errs.push(`KaTeX ${where}: ${bad}`)
}

// The tower is exactly what the STYLE tier of the rules applies to, which is why
// `style: true` is unconditional here — this script reads nothing else.
const scanProse = (s, where) => {
  const { problems, fragments } = checkProse(s, { style: true })
  n += fragments
  for (const p of problems) errs.push(`${p} in ${where}`)
}

const layerOrder = []          // [layerId, [id, …]] in page order
const cardByCode = new Map()

for (const f of files) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'))
  const layer = d.layer.id
  const order = []
  layerOrder.push([layer, order])
  for (const k of ['characterizes','note']) for (const l of ['en','de']) scanProse(d.layer.meta[k][l], `${layer}/meta.${k}.${l}`)
  for (const s of d.sections) {
    for (const k of ['title','blurb','note']) if (s[k]) for (const l of ['en','de']) scanProse(s[k][l], `${layer}/${s.kind}.${k}.${l}`)
    for (const g of s.groups) {
      for (const k of ['title','blurb']) if (g[k]) for (const l of ['en','de']) scanProse(g[k][l], `${layer}/${s.kind}/${g.slug}.${k}.${l}`)
      for (const c of g.cards) {
        if (codes.has(c.id)) errs.push(`duplicate id ${c.id}`)
        codes.set(c.id, `${layer}/${s.kind}`)
        cardByCode.set(c.id, c)
        order.push(c.id)
        for (const k of LATEX_FIELDS) if (c[k]) tryTex(c[k], `${c.id}.${k}`)
        for (const k of ['name','note','intuition']) if (c[k]) for (const l of ['en','de']) {
          if (!c[k][l]) errs.push(`${c.id}.${k} missing ${l}`); else scanProse(c[k][l], `${c.id}.${k}.${l}`)
        }
        for (const r of [...(c.basedOn||[]), ...(c.derivedFrom||[])]) refs.push([c.id, r])
        if (s.kind !== 'preliminary') {
          if (!c.concerns?.length) errs.push(`${c.id} has no concerns`)
          for (const x of c.concerns||[]) if (!CONCERNS.has(x)) errs.push(`${c.id} bad concern ${x}`)
        }
      }
    }
  }
}
for (const [from, r] of refs) if (!codes.has(r)) errs.push(`${from} cites unknown ${r}`)

// No card may cite something that appears LATER in its own layer. Page order is
// array order, so a forward citation means the page uses something before it has
// been given — the one thing this tower exists to avoid. Citing a lower layer is
// fine, that is the point. Prose may still point forward (the ℕ act's note defers
// a⁰ to the layers above); only basedOn/derivedFrom are checked.
for (const [layer, ordered] of layerOrder) {
  const at = new Map(ordered.map((c, i) => [c, i]))
  for (const c of ordered) {
    const card = cardByCode.get(c)
    for (const r of [...(card.basedOn || []), ...(card.derivedFrom || [])])
      if (at.has(r) && at.get(r) > at.get(c))
        errs.push(`${c} cites ${r}, which comes later in ${layer} — reorder the sections`)
  }
}

// ---- the bridge -----------------------------------------------------------
// ---- the bridge -----------------------------------------------------------
// The legacy laws.json / conventions.json were deleted on 2026-07-23; since the
// 2026-07-24 cleanup every reference from the curated side (skills'
// restsOn, mistakes' corrupts, rules' summarizes) lands on a
// card id — the curated layers form a downward-only stack over the tower.
// Anything else is a dangling reference. Build-time twin of validateLayerRefs.
const readJSON = f => JSON.parse(fs.readFileSync(f, 'utf8'))
let bridged = 0
const cite = (from, id, field, pool) => {
  bridged++
  if (!pool.has(id)) errs.push(`${from}.${field} cites unknown ${id}`)
}
// Skills are one file per kind: a `kind → groups[] → skills[]` tree (2026-07-24).
for (const f of fs.readdirSync('src/data/skills')) {
  const kindFile = readJSON(`src/data/skills/${f}`)
  for (const g of kindFile.groups || [])
    for (const sk of g.skills || [])
      for (const id of sk.restsOn || []) cite(sk.id, id, 'restsOn', codes)
}
// The mistake pool is flat, and hand-authored since 2026-07-31. It replaced the
// errors tree the sweep used to walk here; errors.json is parked in legacy/ and
// deliberately outside everything that reads src/data.
for (const e of readJSON('src/data/mistakes.json').mistakes)
  for (const id of e.corrupts || [])
    cite(e.id, id, 'corrupts', codes)
// The rules registry gained a layer head (title/blurb/note) on 2026-07-25 and was
// renamed off "metapatterns" on 2026-07-27; the entries live under `rules`.
// The list itself stays flat — a registry of sentences has no structure to give it.
for (const m of readJSON('src/data/rules.json').rules)
  for (const id of m.summarizes || [])
    cite(m.id, id, 'summarizes', codes)

// ---- audit: concerns vs citations ----------------------------------------
// A REPORT, not a validator — it never fails the sweep, because a disagreement
// can be perfectly correct authoring.
//
// `concerns` and `basedOn`/`derivedFrom` are two hand-authored graphs over the
// same cards, and nothing else cross-checks them. They answer different
// questions: citations say what a card USES, concerns say what it is ABOUT. So
// `concerns` is NOT derivable from citations, and deriving it would be worse than
// useless — union over a DAG is monotone, so tokens only accumulate upward and the
// top of the tower would concern everything. (Measured 2026-07-26: deriving from
// transitive ancestors matches the authored tags on 30 of 90 cards and inflates 36
// cards to three or more tokens, where the author gave 4.)
//
// One direction is still informative. If a card claims concern T and NO ancestor
// supplies T, then either the tag is wrong or a citation is missing — the card
// leans on something it never says it leans on. The reverse (ancestors supply more
// than the card claims) is normal and says nothing: `ax.mul-associative` rests on
// the bracket conventions, which concern addition too, and is still only about
// multiplication.
//
// Two exemptions, both derived from the data rather than listed:
//   - a token's ENTRY POINT, the first non-remark card in page order carrying it,
//     cannot inherit it from anywhere. That is where the token enters the tower
//     (`completeness` at ax.completeness, the other four at their signatures).
//   - `remark` cards, which are commentary on the whole structure: rk.existence
//     and rk.uniqueness carry all five tokens deliberately.
const kindOf = id => (codes.get(id) || '/').split('/')[1]
const citesOf = id => {
  const c = cardByCode.get(id)
  return c ? [...(c.basedOn || []), ...(c.derivedFrom || [])] : []
}
// Memoized transitive ancestors. The set is registered BEFORE recursing, so a
// cycle would terminate with a partial answer rather than hang — the tower is a
// DAG (no forward citation, and cross-layer citations point down), but this script
// should not be the thing that hangs if that ever breaks.
const ancMemo = new Map()
const ancestorsOf = id => {
  if (ancMemo.has(id)) return ancMemo.get(id)
  const out = new Set()
  ancMemo.set(id, out)
  for (const p of citesOf(id)) {
    out.add(p)
    for (const q of ancestorsOf(p)) out.add(q)
  }
  return out
}
const pageOrder = layerOrder.flatMap(([, ids]) => ids)
const entryOf = new Map()
for (const id of pageOrder) {
  if (kindOf(id) === 'remark') continue
  for (const t of cardByCode.get(id)?.concerns || []) if (!entryOf.has(t)) entryOf.set(t, id)
}
const unsupported = []
for (const id of pageOrder) {
  if (kindOf(id) === 'remark') continue
  const supplied = new Set([...ancestorsOf(id)].flatMap(p => cardByCode.get(p)?.concerns || []))
  const missing = (cardByCode.get(id)?.concerns || [])
    .filter(t => !supplied.has(t) && entryOf.get(t) !== id)
  if (missing.length) unsupported.push(`${id} claims [${missing.join(', ')}] but no card it cites concerns it`)
}

console.log(`cards: ${codes.size}   latex fragments checked: ${n}   refs: ${refs.length}`)
console.log(`[audit] concerns entry points: ${[...entryOf].map(([t, id]) => `${t}→${id}`).join('  ')}`)
if (unsupported.length) for (const line of unsupported) console.log(`[audit] ${line}`)
else console.log('[audit] every concern is supplied by a cited card')
console.log(`bridge: ${bridged} references from the skills side, all resolved into the tower`)
console.log(errs.length ? 'PROBLEMS:\n' + errs.join('\n') : 'clean')
