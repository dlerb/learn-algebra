// The layer-tree sweep from docs/fundament0.md "Verifying edits", made runnable:
// `pnpm sweep-layers`. Compiles every latex field and every inline $…$ fragment
// with NO macros defined (proving nothing depends on the deleted \num/\nnum),
// then checks codes are unique tower-wide, citations resolve across layers,
// concerns are present and valid, and the prose rules hold (no em dash, no ß,
// no retired "sign"/"Vorzeichen"). En dashes are allowed: they spell ranges.
//
// Structural validation also runs at load time in src/data/layers.ts; this
// script is the part that needs KaTeX and so stays out of the app bundle.
import katex from 'katex'
import fs from 'fs'

const files = ['src/data/fundament0/cards.json', 'src/data/numbers/cards.json', 'src/data/powers/cards.json', 'src/data/algebra/cards.json']
const LATEX_FIELDS = ['latex','derivation','cond','forall','avoid','prefer','symbol','type']
let errs = [], codes = new Map(), refs = [], n = 0
const CONCERNS = new Set(['add','mul','eq','order','completeness'])

const tryTex = (tex, where) => { n++
  try { katex.renderToString(tex, { throwOnError: true, displayMode: false }) }
  catch (e) { errs.push(`KaTeX ${where}: ${e.message.split('\n')[0]}  <<${tex}>>`) } }

const scanProse = (s, where) => {
  const re = /\$([^$]+)\$/g
  for (let m = re.exec(s); m; m = re.exec(s)) tryTex(m[1], where)
  if ((s.match(/\$/g) || []).length % 2) errs.push(`unpaired $ in ${where}`)
  if (/—/.test(s)) errs.push(`em dash in ${where}`)  // en dash ok in numeric ranges
  if (/ß/.test(s)) errs.push(`sharp s in ${where}`)
  if (/\b(signs?|Vorzeichen)\b/i.test(s)) errs.push(`retired word "sign" in ${where}`)
}

const layerOrder = []          // [layerId, [code, …]] in page order
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
        if (codes.has(c.code)) errs.push(`duplicate code ${c.code}`)
        codes.set(c.code, `${layer}/${s.kind}`)
        cardByCode.set(c.code, c)
        order.push(c.code)
        for (const k of LATEX_FIELDS) if (c[k]) tryTex(c[k], `${c.code}.${k}`)
        for (const k of ['name','note','intuition']) if (c[k]) for (const l of ['en','de']) {
          if (!c[k][l]) errs.push(`${c.code}.${k} missing ${l}`); else scanProse(c[k][l], `${c.code}.${k}.${l}`)
        }
        for (const r of [...(c.basedOn||[]), ...(c.derivedFrom||[])]) refs.push([c.code, r])
        if (s.kind !== 'preliminary') {
          if (!c.concerns?.length) errs.push(`${c.code} has no concerns`)
          for (const x of c.concerns||[]) if (!CONCERNS.has(x)) errs.push(`${c.code} bad concern ${x}`)
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
// Since 2026-07-23 the tower is the primary reference and laws.json /
// conventions.json are a legacy stub holding only what the tower does not yet
// state. Every reference out of the skills side must therefore land on a card
// code OR on one of the survivors — nothing else. This is what stops the two
// from drifting apart again.
const readJSON = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const legacy = new Set([
  ...readJSON('src/data/laws.json').map(x => x.id),
  ...readJSON('src/data/conventions.json').map(x => x.id),
])
const resolves = id => codes.has(id) || legacy.has(id)
let bridged = 0, intoTower = 0
const cite = (from, id, field) => {
  bridged++
  if (codes.has(id)) intoTower++
  else if (!legacy.has(id)) errs.push(`${from}.${field} cites unknown ${id}`)
}
for (const f of fs.readdirSync('src/data/skills')) {
  for (const sk of readJSON(`src/data/skills/${f}`)) {
    for (const field of ['governedBy', 'justifiedBy'])
      for (const id of sk[field] || []) cite(sk.id, id, field)
  }
}
for (const e of readJSON('src/data/errors.json'))
  for (const id of e.corrupts || []) if (!id.startsWith('meta.')) cite(e.id, id, 'corrupts')
for (const x of [...readJSON('src/data/laws.json'), ...readJSON('src/data/conventions.json')])
  for (const field of ['basedOn', 'derivedFrom'])
    for (const id of x[field] || []) cite(x.id, id, field)

console.log(`cards: ${codes.size}   latex fragments checked: ${n}   refs: ${refs.length}`)
console.log(`bridge: ${bridged} references from the skills side, ${intoTower} into the tower, ${bridged - intoTower} still legacy`)
console.log(errs.length ? 'PROBLEMS:\n' + errs.join('\n') : 'clean')
