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

const files = ['src/data/fundament0/cards.json', 'src/data/numbers/cards.json', 'src/data/naturals/cards.json', 'src/data/integers/cards.json', 'src/data/rationals/cards.json']
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

for (const f of files) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'))
  const layer = d.layer.id
  for (const k of ['characterizes','note']) for (const l of ['en','de']) scanProse(d.layer.meta[k][l], `${layer}/meta.${k}.${l}`)
  for (const s of d.sections) {
    for (const k of ['title','blurb','note']) if (s[k]) for (const l of ['en','de']) scanProse(s[k][l], `${layer}/${s.kind}.${k}.${l}`)
    for (const g of s.groups) {
      for (const k of ['title','blurb']) if (g[k]) for (const l of ['en','de']) scanProse(g[k][l], `${layer}/${s.kind}/${g.slug}.${k}.${l}`)
      for (const c of g.cards) {
        if (codes.has(c.code)) errs.push(`duplicate code ${c.code}`)
        codes.set(c.code, `${layer}/${s.kind}`)
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
console.log(`cards: ${codes.size}   latex fragments checked: ${n}   refs: ${refs.length}`)
console.log(errs.length ? 'PROBLEMS:\n' + errs.join('\n') : 'clean')
