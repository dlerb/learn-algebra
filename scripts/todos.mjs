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
//
//   pnpm todos             what is still open
//   pnpm todos --resolved  what this branch has already answered, and where
//   pnpm todos --strict    the gate before main
//
// ── WHY `--resolved` IS DERIVED FROM GIT (2026-08-02) ────────────────────────
// The obvious alternative was to mark a finished note `DONE` and leave it in the
// file. Rejected, three reasons: it breaks `--strict` (the gate then only catches
// the notes somebody remembered to mark, and a forgotten one is indistinguishable
// from open work), the markers accumulate until nobody reads them, and — the one
// that decides it — a DONE note says what was INTENDED while the entry says what
// was DONE, with nothing checking the two against each other. This pass has
// already found that exact gap three times in prose that outlived its data.
//
// So the answer is not stored, it is READ BACK: a todo is resolved when a commit
// removed it, which git records exactly and which no author can forget to write
// down. Same move as deriving `skill.mistakes` from `wrong[]` — the fact has one
// home, and it is the one that cannot drift.

import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { contentFiles, CONTENT_ROOT } from './content-format.mjs'

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

/** Every `id` in a parsed file, so a resolved todo can say whether its ENTRY
 *  survived. A note that vanished because the skill it hung off was deleted is
 *  answered, but not in the same way as one whose entry was rewritten. */
function idsIn(node, out = new Set()) {
  if (Array.isArray(node)) { node.forEach(v => idsIn(v, out)); return out }
  if (node === null || typeof node !== 'object') return out
  if (typeof node.id === 'string') out.add(node.id)
  for (const v of Object.values(node)) idsIn(v, out)
  return out
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trimEnd()
/** A file as it stood at a revision, or null where it did not exist (a commit
 *  that created it, or the root commit's parent). */
function showJson(rev, file) {
  try { return JSON.parse(git('show', `${rev}:${file}`)) } catch { return null }
}

// ── --resolved: the todos this branch has already answered ──────────────────
// `-S` narrows the walk to commits whose diff changes the COUNT of `"todo":`,
// which is every commit that added or removed one — a handful, not the whole
// history. Merges carry no diff of their own and are skipped, so what is
// reported is always the commit that did the work, never the merge that landed
// it. Newest first, because the question is usually "what did we just do".
function reportResolved() {
  const shas = git('log', '--format=%H', '-S', '"todo":', '--', CONTENT_ROOT).split('\n').filter(Boolean)
  let n = 0
  for (const sha of shas) {
    const [short, date, subject] = git('show', '-s', '--format=%h%x00%ad%x00%s', '--date=short', sha).split('\0')
    const files = git('diff-tree', '--no-commit-id', '--name-only', '-r', sha, '--', CONTENT_ROOT)
      .split('\n').filter(f => f.endsWith('.json'))
    const hits = []
    for (const file of files) {
      const before = showJson(`${sha}^`, file), after = showJson(sha, file)
      if (before === null) continue
      // Keyed by id where there is one — a `path` shifts when anything above it
      // is added or removed, an id does not.
      const stillThere = new Set(scan(after ?? {}).map(t => t.id ?? t.path))
      const survivingIds = idsIn(after ?? {})
      for (const t of scan(before)) {
        const key = t.id ?? t.path
        if (stillThere.has(key)) continue          // reworded, not resolved — still open
        hits.push({ file, ...t, gone: t.id !== null && !survivingIds.has(t.id) })
      }
    }
    if (hits.length === 0) continue
    console.log(`\n\x1b[1m${short}\x1b[0m  \x1b[2m${date}\x1b[0m  ${subject}`)
    for (const h of hits) {
      console.log(`  \x1b[36m${h.id ?? h.path}\x1b[0m \x1b[2m${h.file}\x1b[0m${h.gone ? ' \x1b[2m(entry removed)\x1b[0m' : ''}`)
      console.log(`      ${h.text}`)
      n++
    }
  }
  console.log(n === 0 ? '\n✓ no todos resolved on this branch yet.' : `\n${n} todo(s) resolved.`)
}

if (process.argv.includes('--resolved')) {
  reportResolved()
  process.exit(0)
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
