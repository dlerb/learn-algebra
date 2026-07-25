// THE ONE SERIALIZER for every content file under src/data (2026-07-25).
//
// Three writers touch these files: this repo's author in an editor, Claude Code,
// and (soon) the in-app card editor writing back through the dev server. Churn
// happens whenever two of them disagree about layout — a one-word fix to a note
// arrives as sixteen hunks of re-indentation, and `git diff` stops being a
// readable record of a content change.
//
// The fix is not clever patching, it is agreement: ONE canonical form, produced
// by ONE function. Every writer must import `serializeContent` from here rather
// than call `JSON.stringify` with its own options — two writers that merely
// intend the same style will drift, two writers calling one function cannot.
//
// Run `pnpm format-content` to normalize, `pnpm format-content:check` to verify
// (the check belongs in CI / before a commit; it is what catches a hand edit
// that landed in a different shape).
//
// NOTE the deliberate absence of Prettier. Its object expansion is input
// sensitive — an object that was written on one line and fits the print width
// tends to stay on one line — so it is not canonical in the sense needed here,
// and it can disagree with JSON.stringify. Two formatters that disagree produce
// ping-pong churn, which is the very thing this file exists to end.

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'

/** The canonical form: 2-space indent, one trailing newline. */
export const serializeContent = value => JSON.stringify(value, null, 2) + '\n'

/** Everything under src/data is content. Includes the parked drill file. */
export const CONTENT_ROOT = 'src/data'

export function contentFiles(root = CONTENT_ROOT) {
  const out = []
  for (const e of fs.readdirSync(root, { withFileTypes: true, recursive: true })) {
    if (e.isFile() && e.name.endsWith('.json')) out.push(path.join(e.parentPath, e.name))
  }
  return out.sort()
}

/** Canonical text for one file, with the data proved unchanged.
 *  The deep-equal assert is what makes normalizing safe to run blind: it fails
 *  loudly if serializing ever altered anything but whitespace. */
export function normalized(file) {
  const before = fs.readFileSync(file, 'utf8')
  const data = JSON.parse(before)
  const after = serializeContent(data)
  assert.deepStrictEqual(JSON.parse(after), data, `${file}: serializing changed the DATA, not just layout`)
  return { before, after, changed: before !== after }
}

// CLI. Guarded: this module is also imported for `contentFiles`/`serializeContent`
// (by scripts/content-ids.mjs, and by the card editor's write endpoint), and an
// unguarded CLI would make a mere import rewrite every content file as a side
// effect of asking for a helper.
if (import.meta.filename === process.argv[1]) {
  const check = process.argv.includes('--check')
  const files = contentFiles()
  const changed = []

  for (const f of files) {
    const { after, changed: dirty } = normalized(f)
    if (!dirty) continue
    changed.push(f)
    if (!check) fs.writeFileSync(f, after)
  }

  if (check) {
    if (changed.length) {
      console.error(`\n✗ ${changed.length} of ${files.length} content file(s) are not in canonical form:\n`)
      for (const f of changed) console.error('  ' + f)
      console.error('\nRun `pnpm format-content` to fix.')
      process.exit(1)
    }
    console.log(`✓ all ${files.length} content files are in canonical form.`)
  } else {
    console.log(changed.length
      ? `✓ normalized ${changed.length} of ${files.length} content file(s):\n` + changed.map(f => '  ' + f).join('\n')
      : `✓ all ${files.length} content files were already canonical.`)
  }
}
