import type { LocalizedString } from './skill.schema'
import fundamentals from './fundament/fundamentals/cards.json'
import numbers from './fundament/numbers/cards.json'
import powers from './fundament/powers/cards.json'
import terms from './fundament/terms/cards.json'

// THE LAYER MANIFEST — all seven layers of the app, in one list (2026-07-25).
//
// Four `fundament` layers (the tower: one cards.json each, a containment tree
// `layer → sections[] → groups[] → cards[]`, page order = array order at every
// level — docs/fundamentals.md, "Data structure") and three `curated` layers
// (errors · metapatterns · skills). This module fixes the reading order, and
// `router.ts` and `App.vue` generate every route and every nav entry from it, so
// **adding a layer of either family is one entry below**. It also resolves
// citations ACROSS tower layers — the reason it had to exist before the numbers
// layer could be written, since `th.negative-base` in powers rests on
// `th.negative-one-times` and `ix.precedence` in fundamentals.
//
// ⚠️ THE MANIFEST CARRIES NO CURATED DATA, only routing/nav metadata. It cannot:
// `src/data/index.ts` imports `cardIndex` from here, so importing errors.json or
// metapatterns.json back into this module would close an import cycle. Each
// curated view imports its own data. The consequence is that a curated layer's
// nav `title` here is a plain English label while its PAGE title is the localized
// one in its data head — a small duplication, and the honest price of the acyclic
// stack (cards ← errors/metapatterns ← skills).

export interface Card {
  id: string
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
  /** Unique within the layer, and the key the rendered list is built on.
   *  Required since 2026-07-23: `kind` cannot key the list once a layer repeats
   *  one (powers runs ℕ → ℤ → ℚ as three acts, so `definition` and `theorem`
   *  each appear three times), and a per-layer key that is sometimes the kind
   *  and sometimes not is worse than one that is always the slug. */
  slug: string
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
/** `fundament` = the reference tower, rendered by LayerView from `data`.
 *  `curated` = the pedagogy on top of it (errors · metapatterns · skills), each
 *  with its own view and its own data file. The families are what App.vue groups
 *  the nav by, and what says which layers `cardIndex` is built from. */
export type LayerFamily = 'fundament' | 'curated'

export interface LayerRef {
  /** Stable id, matches `layer.id` in the data file and the route name. */
  id: string
  /** Route path + nav key. */
  slug: string
  /** Nav label. Not localized — a curated layer's localized page title lives in
   *  its own data head (see the import-cycle note above). */
  title: string
  family: LayerFamily
}

/** A tower layer, which additionally carries its cards tree. */
export interface Layer extends LayerRef {
  family: 'fundament'
  data: LayerData
}

export const layers: Layer[] = [
  { id: 'fundamentals', slug: 'fundamentals', title: 'Fundamentals', family: 'fundament', data: fundamentals as unknown as LayerData },
  { id: 'numbers', slug: 'numbers', title: 'Numbers', family: 'fundament', data: numbers as unknown as LayerData },
  { id: 'powers', slug: 'powers', title: 'Powers', family: 'fundament', data: powers as unknown as LayerData },
  { id: 'terms', slug: 'terms', title: 'Term manipulations', family: 'fundament', data: terms as unknown as LayerData },
]

/** The curated layers. Ordered to echo the reference stack bottom-up: the two
 *  lenses that cite only cards, then Skills on top, which cites all three.
 *  Titles are the student-facing page names (2026-07-25) — the nav used to say
 *  "Errors" while the page said "Common mistakes". */
export const curatedLayers: LayerRef[] = [
  { id: 'errors', slug: 'errors', title: 'Common mistakes', family: 'curated' },
  { id: 'metapatterns', slug: 'metapatterns', title: 'Reading rules', family: 'curated' },
  { id: 'skills', slug: 'skills', title: 'Skills', family: 'curated' },
]

/** Every layer, tower first. Routes and nav are generated from this. */
export const allLayers: LayerRef[] = [...layers, ...curatedLayers]

export const layersOf = (family: LayerFamily) => allLayers.filter(l => l.family === family)

export const layerById = (id: string) => layers.find(l => l.id === id)

export const cardsOf = (l: Layer) =>
  l.data.sections.flatMap(s => s.groups.flatMap(g => g.cards.map(card => ({ card, kind: s.kind, layer: l }))))

/** Every card in the tower, keyed by id. Ids are unique tower-wide, which
 *  is what lets a card cite another layer's card by bare id. */
export const cardIndex = new Map(layers.flatMap(l => cardsOf(l).map(e => [e.card.id, e] as const)))

export const CONCERN_TOKENS = ['add', 'mul', 'eq', 'order', 'completeness'] as const

// Load-time validation, same contract as the skills tower: throw on the first
// offending code rather than rendering a broken page.
function validate() {
  // Every section carries a slug, unique per layer: it is what keys the rendered
  // list. The JSON is cast rather than parsed, so TypeScript cannot enforce it —
  // this can.
  // Slugs are route paths and nav keys, so they must be unique across BOTH
  // families, not just within the tower.
  const slugs = new Set<string>()
  for (const l of allLayers) {
    if (slugs.has(l.slug)) throw new Error(`layers: duplicate layer slug "${l.slug}"`)
    slugs.add(l.slug)
  }
  for (const l of layers) {
    const keys = new Set<string>()
    for (const s of l.data.sections) {
      if (!s.slug) throw new Error(`layers: section "${s.kind}" in layer ${l.id} has no slug`)
      if (keys.has(s.slug)) throw new Error(`layers: duplicate section slug "${s.slug}" in layer ${l.id}`)
      keys.add(s.slug)
    }
  }
  const seen = new Set<string>()
  for (const l of layers) {
    for (const { card } of cardsOf(l)) {
      if (seen.has(card.id)) throw new Error(`layers: duplicate card id "${card.id}" (layer ${l.id})`)
      seen.add(card.id)
    }
  }
  for (const l of layers) {
    for (const { card, kind } of cardsOf(l)) {
      for (const ref of [...(card.basedOn ?? []), ...(card.derivedFrom ?? [])]) {
        if (!seen.has(ref)) throw new Error(`layers: "${card.id}" cites unknown id "${ref}"`)
      }
      if (kind !== 'preliminary') {
        if (!card.concerns?.length) throw new Error(`layers: "${card.id}" (${kind}) has no concerns`)
        for (const c of card.concerns) {
          if (!(CONCERN_TOKENS as readonly string[]).includes(c)) {
            throw new Error(`layers: "${card.id}" has unknown concern "${c}"`)
          }
        }
      }
    }
  }
}
validate()
