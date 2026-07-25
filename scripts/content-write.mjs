// THE WRITE PATH for the in-app prose editor (2026-07-25).
//
// Deliberately the smallest thing that can do the job: read the file, set ONE
// localized string, serialize with the one serializer, write. No patching
// library, no diffing, no partial writes — canonical form (see
// scripts/content-format.mjs) means parse→mutate→serialize touches only the
// bytes that changed.
//
// EVERY GUARD IS HERE, not in the UI. The browser decides what to *offer*; this
// decides what is *allowed*. A stray request must not be able to reach `id`,
// `basedOn` or `corrupts`, so the rules below are enforced server-side even
// though the editor never renders an input for them.
//
// Three guards, and each rules out a different accident:
//   1. WRITABLE — the field name must be on the allowlist. Keeps the graph out of
//      reach: an editor that can only touch leaf prose cannot break the ~197
//      cross-references, which is what makes it safe to use quickly and carelessly.
//   2. the field must ALREADY EXIST on the entity. A typo'd field name then fails
//      loudly instead of quietly growing a new key that no view reads and no
//      schema knows. Adding a field stays a source edit — that is what the
//      open-in-source button is for.
//   3. the prose must PASS THE SAME RULES the sweep applies (content-prose.mjs).
//      A broken `$…$` is rejected at save time rather than rendering as a KaTeX
//      error box on the page.
//
// LOCALIZATION. A prose field is either `{en, de?}` or — in all four skills files,
// 96 fields — a BARE STRING, which the schema reads as English-only. Both are
// writable. Writing `de` onto a bare string promotes it to `{en: <the string>,
// de: <new>}`, which is how a German translation gets added without a source
// edit. Writing `en` onto a bare string leaves it a bare string; nothing is
// gratuitously restructured.

import fs from 'node:fs'
import { serializeContent } from './content-format.mjs'
import { entityIndex, locate } from './content-ids.mjs'
import { checkProse, isTowerFile } from './content-prose.mjs'

/** Field names the editor may write, relative to the entity object. Dotted paths
 *  reach the layer head's `meta`. Everything absent from this list — `id`,
 *  `basedOn`, `derivedFrom`, `corrupts`, `restsOn`, `summarizes`, `latex`,
 *  `concerns`, and the whole containment structure — is unreachable by design. */
export const WRITABLE_FIELDS = [
  'name',                 // every entity type
  'note',                 // cards, errors, skills
  'intuition',            // cards
  'fix',                  // errors
  'rule',                 // meta-patterns
  'meta.characterizes',   // layer heads
  'meta.note',            // layer heads
]

const LANGS = ['en', 'de']
const MAX_LENGTH = 20000

const at = (obj, dotted) => dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)

/** Is this a prose value we know how to edit? `{en, de?}` or a bare string. */
const isProse = v =>
  typeof v === 'string' || (v && typeof v === 'object' && !Array.isArray(v) && typeof v.en === 'string')

/** The entity's writable prose as it is on disk, for the editor to load into its
 *  inputs. Normalized to `{en, de}` for the UI's benefit, with `bare: true`
 *  marking the English-only form so the UI can say so. Only fields that are
 *  actually present come back — the editor offers exactly what may be written. */
export function readFields(id) {
  const hit = locate(id)
  if (!hit) return null
  const doc = JSON.parse(fs.readFileSync(hit.file, 'utf8'))
  const entity = hit.path.reduce((o, k) => o[k], doc)
  const fields = {}
  for (const f of WRITABLE_FIELDS) {
    const v = at(entity, f)
    if (!isProse(v)) continue
    fields[f] = typeof v === 'string'
      ? { en: v, de: '', bare: true }
      : { en: v.en, de: v.de ?? '', bare: false }
  }
  return { id, file: hit.file, line: hit.line, style: isTowerFile(hit.file), fields }
}

/** Write one localized string. Returns `{ ok: true, … }` or `{ ok: false, error,
 *  problems? }` — never throws for a caller error, so the endpoint can map it
 *  straight to a 400. */
export function writeField({ id, field, lang, value }) {
  if (typeof value !== 'string') return { ok: false, error: 'value must be a string' }
  if (value.length > MAX_LENGTH) return { ok: false, error: `value longer than ${MAX_LENGTH} characters` }
  if (!LANGS.includes(lang)) return { ok: false, error: `lang must be one of ${LANGS.join(', ')}` }
  if (!WRITABLE_FIELDS.includes(field)) {
    return { ok: false, error: `field "${field}" is not writable (allowed: ${WRITABLE_FIELDS.join(', ')})` }
  }

  // Resolved against the bytes about to be rewritten, in the same tick — no path
  // computed elsewhere or earlier can be stale by the time it is applied.
  const { index } = entityIndex()
  const hit = index.get(id)
  if (!hit) return { ok: false, error: `no entity with id "${id}"` }

  const text = fs.readFileSync(hit.file, 'utf8')
  const doc = JSON.parse(text)
  const entity = hit.path.reduce((o, k) => o[k], doc)

  const parts = field.split('.')
  const leaf = parts.pop()
  const owner = parts.reduce((o, k) => (o == null ? o : o[k]), entity)
  if (owner == null) return { ok: false, error: `"${id}" has no "${parts.join('.')}"` }
  const current = owner[leaf]
  if (!isProse(current)) {
    return { ok: false, error: `"${id}" has no "${field}" to edit — add it in the source first` }
  }

  const { problems } = checkProse(value, { style: isTowerFile(hit.file) })
  if (problems.length) return { ok: false, error: 'prose rules', problems }

  if (typeof current === 'string') {
    // English-only. Editing `en` keeps it that way; adding `de` promotes the pair.
    owner[leaf] = lang === 'en' ? value : { en: current, de: value }
  } else {
    owner[leaf] = { ...current, [lang]: value }
  }

  const after = serializeContent(doc)
  if (after === text) return { ok: true, id, field, lang, file: hit.file, changed: false }
  fs.writeFileSync(hit.file, after)
  return { ok: true, id, field, lang, file: hit.file, changed: true }
}

// CLI, so the write path is exercisable without a browser:
//   node scripts/content-write.mjs read  <id>
//   node scripts/content-write.mjs write <id> <field> <lang> <value>
if (import.meta.filename === process.argv[1]) {
  const [cmd, id, field, lang, ...rest] = process.argv.slice(2)
  if (cmd === 'read') {
    const r = readFields(id)
    if (!r) { console.error(`✗ no entity with id "${id}"`); process.exit(1) }
    console.log(JSON.stringify(r, null, 2))
  } else if (cmd === 'write') {
    const r = writeField({ id, field, lang, value: rest.join(' ') })
    console.log(JSON.stringify(r, null, 2))
    if (!r.ok) process.exit(1)
  } else {
    console.error('usage: content-write.mjs read <id> | write <id> <field> <lang> <value>')
    process.exit(1)
  }
}
