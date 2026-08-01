// NOTES TO THE OTHER WRITER — `pnpm todos`.
//
// During a revision pass the author reads the pools in an editor and Claude Code
// does the splits, merges and re-pointing. The instruction is worth writing down
// exactly where it is thought of, next to the entry being read, rather than
// carried out of the file into a message — so a `"todo"` key may be added to any
// object in any content file under `src/data`:
//
//   { "id": "rule.minus-rules", "todo": "split: the sign case is a separate rule",
//     "kind": "do", … }
//
// TWO PROPERTIES MAKE THIS SAFE, both verified 2026-08-01 rather than assumed:
//   · No schema in `skill.schema.ts` calls `.strict()`, so zod STRIPS the key.
//     An annotation cannot reach a view, break a validator, or render.
//   · `content-format.mjs` is `JSON.stringify(value, null, 2)` — key order is
//     preserved as authored and unknown keys survive, so `pnpm validate` stays
//     green with annotations in place. Which it must: they are present for the
//     whole pass, and a check that is red for a week is a check nobody reads.
//
// ⚠️ AND THAT IS EXACTLY WHY THIS SCRIPT EXISTS. A key that is invisible to the
// app AND survives formatting is one nobody will notice again. `--strict` exits
// non-zero while any remain: run it before merging the pass to main, so the
// annotations cannot outlive the work they describe.

import fs from 'node:fs'
import { contentFiles } from './content-format.mjs'

const KEY = 'todo'

/** Every annotation in one parsed file, with the nearest enclosing id — which is
 *  what makes a note addressable, since a `todo` may also sit on a group or on
 *  the layer head, where there is no id of its own to report. */
function scan(node, id = null, path = '$', out = []) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => scan(v, id, `${path}[${i}]`, out))
    return out
  }
  if (node === null || typeof node !== 'object') return out
  const here = typeof node.id === 'string' ? node.id : id
  if (typeof node[KEY] === 'string') out.push({ id: here, path, text: node[KEY] })
  for (const [k, v] of Object.entries(node)) {
    if (k !== KEY) scan(v, here, `${path}.${k}`, out)
  }
  return out
}

const found = contentFiles().flatMap(file => {
  const hits = scan(JSON.parse(fs.readFileSync(file, 'utf8')))
  return hits.map(h => ({ file, ...h }))
})

if (found.length === 0) {
  console.log('✓ no todos in src/data.')
  process.exit(0)
}

let currentFile = null
for (const t of found) {
  if (t.file !== currentFile) {
    currentFile = t.file
    console.log(`\n\x1b[1m${t.file}\x1b[0m`)
  }
  console.log(`  \x1b[36m${t.id ?? t.path}\x1b[0m`)
  console.log(`      ${t.text}`)
}

const strict = process.argv.includes('--strict')
console.log(`\n${found.length} todo(s).`)
if (strict) {
  console.error('✗ --strict: annotations must not outlive the pass they describe.')
  process.exit(1)
}
