import type { LocalizedString } from './skill.schema'
import fundament0 from './fundament0/cards.json'
import naturals from './naturals/cards.json'
import integers from './integers/cards.json'
import rationals from './rationals/cards.json'

// The layer manifest. Each layer is one cards.json — a containment tree
// `layer → sections[] → groups[] → cards[]`, page order = array order at every
// level (docs/fundament0.md, "Data structure"). This module is what composes
// them: it fixes the reading order of the tower, generates the routes and the
// nav entries, and — the reason it had to exist before the naturals layer could
// be written — resolves citations ACROSS layers, since `th.negative-base` in
// naturals rests on `th.2` and `ix.3` in fundament0.
//
// Adding a layer = write its cards.json, add one entry below.

export interface Card {
  code: string
  concerns?: string[]
  symbol?: string
  type?: string
  name: LocalizedString
  latex?: string
  avoid?: string
  prefer?: string
  forall?: string
  cond?: string
  basedOn?: string[]
  derivation?: string
  derivedFrom?: string[]
  note?: LocalizedString
  intuition?: LocalizedString
}
export interface Group {
  slug: string
  title?: LocalizedString
  blurb?: LocalizedString
  cards: Card[]
}
export interface Section {
  kind: string
  title: LocalizedString
  blurb?: LocalizedString
  note?: LocalizedString
  groups: Group[]
}
export interface LayerData {
  layer: { id: string; meta: { characterizes: LocalizedString; note: LocalizedString } }
  sections: Section[]
}
export interface Layer {
  /** Stable id, matches `layer.id` in the file and the route name. */
  id: string
  /** Route path + nav key. */
  slug: string
  /** Nav label + page heading. Not localized: these are proper names. */
  title: string
  data: LayerData
}

export const layers: Layer[] = [
  { id: 'fundament0', slug: 'fundament0', title: 'fundament0', data: fundament0 as unknown as LayerData },
  { id: 'naturals', slug: 'naturals', title: 'naturals', data: naturals as unknown as LayerData },
  { id: 'integers', slug: 'integers', title: 'integers', data: integers as unknown as LayerData },
  { id: 'rationals', slug: 'rationals', title: 'rationals', data: rationals as unknown as LayerData },
]

export const layerById = (id: string) => layers.find(l => l.id === id)

export const cardsOf = (l: Layer) =>
  l.data.sections.flatMap(s => s.groups.flatMap(g => g.cards.map(card => ({ card, kind: s.kind, layer: l }))))

/** Every card in the tower, keyed by code. Codes are unique tower-wide, which
 *  is what lets a card cite another layer's card by bare code. */
export const cardIndex = new Map(layers.flatMap(l => cardsOf(l).map(e => [e.card.code, e] as const)))

export const CONCERN_TOKENS = ['add', 'mul', 'eq', 'order', 'completeness'] as const

// Load-time validation, same contract as the skills tower: throw on the first
// offending code rather than rendering a broken page.
function validate() {
  const seen = new Set<string>()
  for (const l of layers) {
    for (const { card } of cardsOf(l)) {
      if (seen.has(card.code)) throw new Error(`layers: duplicate card code "${card.code}" (layer ${l.id})`)
      seen.add(card.code)
    }
  }
  for (const l of layers) {
    for (const { card, kind } of cardsOf(l)) {
      for (const ref of [...(card.basedOn ?? []), ...(card.derivedFrom ?? [])]) {
        if (!seen.has(ref)) throw new Error(`layers: "${card.code}" cites unknown code "${ref}"`)
      }
      if (kind !== 'preliminary') {
        if (!card.concerns?.length) throw new Error(`layers: "${card.code}" (${kind}) has no concerns`)
        for (const c of card.concerns) {
          if (!(CONCERN_TOKENS as readonly string[]).includes(c)) {
            throw new Error(`layers: "${card.code}" has unknown concern "${c}"`)
          }
        }
      }
    }
  }
}
validate()
