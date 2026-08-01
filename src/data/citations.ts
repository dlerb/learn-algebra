// WHO CITES WHAT — the reverse index over the curated pools.
//
// The pools are normalized: a rule sentence is written once and cited from
// everywhere it applies, which is the entire reason `rules.json` exists (see its
// own `note`). The price of that is the fan-out on IDENTITY change — splitting one
// rule into two, or merging two into one, means every citation has to be
// re-pointed at the right half, and each of those is a judgement call about what
// the citer meant. This module is what makes that decidable: it collects every
// reference in the content graph as an edge carrying enough CONTEXT to decide,
// so a split becomes a checklist you read rather than a network you hold in
// your head.
//
// ⚠️ THE CONTEXT IS THE POINT, not the count. `grep -c` already answers "how many
// cite this"; what it cannot answer is "when this skill cited the rule, which
// half of it did it mean" — and that is the only question a split actually asks.
// So every edge carries a one-line quote from the CITER's own body: a skill's
// stimulus, a mistake's false sentence, the wrong form that names a mistake.
//
// The edge set is COMPLETE as of 2026-08-01 — every field in the curated schemas
// that holds an id of another entity is listed in `collect()` below, family links
// included. Add a referencing field to any pool and it must be added here too,
// or a split will silently miss it. There is deliberately no generic "scan every
// string that looks like an id" fallback: it would report prose mentions as
// citations, and `fundament/terms/cards.json` contains an English sentence ending
// in the word "rule." that such a scan reads as a reference.
//
// ⚠️ THE TOWER NEVER CITES A POOL. The arrow is one-way — rules `summarizes`
// cards, mistakes `corrupts` them, skills `restsOn` them — because `layers.ts`
// may not import the curated data without closing an import cycle (see its
// header). So no split of a rule or a mistake can ever require an edit inside
// `src/data/fundament/`. That is a guarantee, not an observation.

import { rules, mistakes, skills, sheets } from './index'
import { cardIndex } from './layers'

/** What kind of entity an id belongs to. `card` covers the whole fundament tower. */
export type EntityKind = 'rule' | 'mistake' | 'skill' | 'sheet' | 'card'

export interface Citation {
  /** The citing entity — the one that would need editing if `to` changed. */
  from: string
  fromKind: EntityKind
  /** The referenced entity. */
  to: string
  toKind: EntityKind
  /** The authored field carrying the reference, as you would find it in the JSON. */
  field: string
  /** One line from the CITER's body: what it was saying when it cited. */
  context: string
}

const EN = (ls: { en: string } | undefined) => ls?.en ?? ''

/** Trim a quote to one readable line. */
function line(s: string, max = 72): string {
  const flat = s.replace(/\s+/g, ' ').trim()
  return flat.length > max ? flat.slice(0, max - 1) + '…' : flat
}

function collect(): Citation[] {
  const out: Citation[] = []
  const add = (
    from: string, fromKind: EntityKind, to: string, toKind: EntityKind,
    field: string, context: string,
  ) => out.push({ from, fromKind, to, toKind, field, context: line(context) })

  // ── rules.json ────────────────────────────────────────────────────────────
  for (const r of rules) {
    if (r.family) add(r.id, 'rule', r.family, 'rule', 'family', EN(r.rule))
    for (const c of r.summarizes) add(r.id, 'rule', c, 'card', 'summarizes', EN(r.rule))
  }

  // ── mistakes.json ─────────────────────────────────────────────────────────
  for (const m of mistakes) {
    if (m.family) add(m.id, 'mistake', m.family, 'mistake', 'family', EN(m.mistake))
    for (const r of m.breaks) add(m.id, 'mistake', r, 'rule', 'breaks', EN(m.mistake))
    for (const c of m.corrupts) add(m.id, 'mistake', c, 'card', 'corrupts', EN(m.mistake))
  }

  // ── skills/*.json ─────────────────────────────────────────────────────────
  // A skill's context is its STIMULUS, not its name: the stimulus is the form a
  // student starts from, so it is what says which half of a split rule was meant.
  for (const s of skills) {
    const ctx = `${s.stimulus}   (${EN(s.name)})`
    for (const r of s.rules) add(s.id, 'skill', r, 'rule', 'rules', ctx)
    for (const c of s.restsOn) add(s.id, 'skill', c, 'card', 'restsOn', ctx)
    for (const p of s.requires) add(s.id, 'skill', p, 'skill', 'requires', ctx)
    // `mistakes` on a skill is DERIVED from wrong[]; the authored site is the
    // wrong form, and its latex is the sharper context — it is the false claim
    // itself, which is what decides which mistake it belongs to after a split.
    s.wrong.forEach((w, i) => {
      add(s.id, 'skill', w.mistake, 'mistake', `wrong[${i}].mistake`, w.latex ?? ctx)
    })
  }

  // ── cheatsheets.json ──────────────────────────────────────────────────────
  // A sheet owns nothing but order and grouping, so its context is the group
  // heading the rule was filed under — which is exactly the editorial judgement
  // a split has to re-make.
  for (const sh of sheets) {
    add(sh.id, 'sheet', sh.rule, 'rule', 'rule', 'heads the sheet')
    sh.groups.forEach((g, i) => {
      for (const r of g.rules) {
        add(sh.id, 'sheet', r, 'rule', `groups[${i}].rules`, `group "${EN(g.title)}"`)
      }
    })
  }

  return out
}

export const citations: Citation[] = collect()

function bucket(key: (c: Citation) => string): Map<string, Citation[]> {
  const m = new Map<string, Citation[]>()
  for (const c of citations) {
    const k = key(c)
    const list = m.get(k)
    if (list) list.push(c)
    else m.set(k, [c])
  }
  return m
}
const incoming = bucket(c => c.to)
const outgoing = bucket(c => c.from)

/** Everything that would need re-pointing if `id` were split, merged or renamed. */
export function citationsTo(id: string): Citation[] {
  return incoming.get(id) ?? []
}

/** Everything `id` itself points at — what a merge has to union. */
export function citationsFrom(id: string): Citation[] {
  return outgoing.get(id) ?? []
}

export interface Entity {
  id: string
  kind: EntityKind
  /** The entity's own sentence, for display beside its id. */
  label: string
}

/** Every addressable id in the graph, pools and tower alike. */
export const entities: Map<string, Entity> = new Map<string, Entity>([
  ...rules.map((r): [string, Entity] => [r.id, { id: r.id, kind: 'rule', label: EN(r.rule) }]),
  ...mistakes.map((m): [string, Entity] => [m.id, { id: m.id, kind: 'mistake', label: EN(m.mistake) }]),
  ...skills.map((s): [string, Entity] => [s.id, { id: s.id, kind: 'skill', label: EN(s.name) }]),
  ...sheets.map((s): [string, Entity] => [s.id, { id: s.id, kind: 'sheet', label: s.id }]),
  ...[...cardIndex].map(([id, e]): [string, Entity] => [id, { id, kind: 'card', label: EN(e.card.name) }]),
])

/** Resolve a bare slug (`minus-rules`) or a full id. Returns every match, since
 *  a slug can name a rule and a mistake at once. */
export function resolve(query: string): Entity[] {
  const exact = entities.get(query)
  if (exact) return [exact]
  const hits = [...entities.values()].filter(e => e.id.replace(/^[a-z]+\./, '') === query)
  if (hits.length > 0) return hits
  return [...entities.values()].filter(e => e.id.includes(query))
}
