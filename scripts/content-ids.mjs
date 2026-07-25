// THE ENTITY WALK, and the invariant it guards (2026-07-25).
//
// Every addressable thing in every one of the seven layers — a fundament card,
// an error pattern, a meta-pattern, a skill, and a layer's own head — is a JSON
// object carrying a unique string `id`. That is the whole identity model, and it
// holds across BOTH families and all the differing tree shapes: the walk below
// asks only "is there an object here with an id?", so it neither knows nor cares
// that fundament nests sections→groups→cards while skills nests kinds→groups→
// skills across four files. Reshaping a layer does not touch this file.
//
// Two consumers, one walk, deliberately:
//   - `pnpm check-ids` (chained into `pnpm validate`) enforces that ids are
//     GLOBALLY unique — across all 23 content files, not merely within a layer.
//   - the card editor's write endpoint resolves `id → (file, path)` with the very
//     same function before patching a file.
// Sharing it is the point. A guard and a resolver that disagreed about what
// counts as an entity would let the guard pass while the resolver wrote to the
// wrong place.
//
// WHY GLOBAL uniqueness, when nothing needed it before: src/data/layers.ts
// enforces uniqueness tower-wide and parseSkillTree enforces it within skills,
// but until now nothing compared a card id against a skill id against an error
// id. Zero collisions exist today — that was a measured fact, not a guarantee.
// The editor is about to address entities by bare id alone, and its worst
// failure mode is a silent write to whichever file a duplicate matched first.
// This turns the coincidence into an invariant BEFORE anything relies on it.
//
// NOTE drills carry no `id` (they are keyed by `skill`), so they are invisible
// here and are not addressable by id. That is correct while drills are frozen
// and outside the editor's prose-only scope; drill editing would need its own
// resolution path.

import fs from 'node:fs'
import { contentFiles } from './content-format.mjs'

/** Every entity in one parsed document, as `{ id, path }`, where `path` is the
 *  key/index chain from the document root — exactly what a JSON patcher needs.
 *  Recursion is shape-blind on purpose; see the header. */
export function entityPaths(node, path = [], out = []) {
  if (Array.isArray(node)) {
    node.forEach((child, i) => entityPaths(child, [...path, i], out))
  } else if (node && typeof node === 'object') {
    if (typeof node.id === 'string') out.push({ id: node.id, path })
    for (const key of Object.keys(node)) entityPaths(node[key], [...path, key], out)
  }
  return out
}

/** id → { file, path } across all content files. The editor resolves with this,
 *  but only ever against bytes it has just read — a path is derived from the
 *  same text it is applied to, never cached across a write. */
export function entityIndex(files = contentFiles()) {
  const index = new Map()
  const duplicates = []
  for (const file of files) {
    for (const { id, path } of entityPaths(JSON.parse(fs.readFileSync(file, 'utf8')))) {
      const prior = index.get(id)
      if (prior) duplicates.push({ id, first: prior.file, second: file })
      else index.set(id, { file, path })
    }
  }
  return { index, duplicates }
}

/** id → `{ id, file, line, path }`, the source location of an entity.
 *
 *  The LINE is found by text search rather than by counting the tree, because a
 *  line number is a property of the bytes and nothing else. `"id": "th.foo"` is
 *  unambiguous: the key is part of the pattern, so a bare mention of the same id
 *  in a `basedOn` array cannot match, and canonical form (one space after the
 *  colon — see scripts/content-format.mjs) makes the spacing predictable.
 *
 *  Resolved fresh on every call against the file as it is on disk right now.
 *  Nothing is cached, so an edit in VS Code between two clicks cannot produce a
 *  stale line. */
export function locate(id, files = contentFiles()) {
  const { index } = entityIndex(files)
  const hit = index.get(id)
  if (!hit) return null
  const text = fs.readFileSync(hit.file, 'utf8')
  const needle = `"id": ${JSON.stringify(id)}`
  const at = text.indexOf(needle)
  // The index found the entity, so the text must contain it. If it does not,
  // the file is not in canonical form and `pnpm validate` would have said so —
  // fall back to the file's first line rather than guessing.
  const line = at === -1 ? 1 : text.slice(0, at).split('\n').length
  return { id, file: hit.file, line, path: hit.path }
}

// CLI: `node scripts/content-ids.mjs` checks the invariant,
//      `node scripts/content-ids.mjs <id>` prints one entity's source location.
if (import.meta.filename === process.argv[1]) {
  const files = contentFiles()
  const wanted = process.argv[2]
  if (wanted) {
    const hit = locate(wanted, files)
    if (!hit) {
      console.error(`✗ no entity with id "${wanted}"`)
      process.exit(1)
    }
    console.log(`${hit.file}:${hit.line}`)
    console.log(`  path: ${hit.path.join(' → ')}`)
    process.exit(0)
  }
  const { index, duplicates } = entityIndex(files)
  if (duplicates.length) {
    console.error(`\n✗ ${duplicates.length} duplicate id(s) across ${files.length} content files:\n`)
    for (const d of duplicates) console.error(`  "${d.id}" in ${d.first} and ${d.second}`)
    console.error('\nIds address entities across layers; a duplicate makes an edit land in the wrong one.')
    process.exit(1)
  }
  console.log(`✓ ${index.size} entity ids, globally unique across ${files.length} content files.`)
}
