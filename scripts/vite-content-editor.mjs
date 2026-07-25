// DEV-ONLY: the card editor's server side (2026-07-25).
//
// Three routes, all of them keyed on an entity id and nothing else:
//   GET  /__content/locate?id=…   → { file, line, path }   open the source
//   GET  /__content/fields?id=…   → { fields: {…} }        load the editor
//   POST /__content/write         → { ok } | 400           save one string
//
// THE CLIENT NEVER SENDS A PATH. Positional information computed in the browser
// can go stale the moment the file is edited elsewhere — a card inserted above in
// VS Code shifts every index below it — so every request carries a stable id and
// the path is derived here, per request, from the bytes about to be read or
// rewritten. Nothing is cached between requests.
//
// `apply: 'serve'` keeps all of it out of the built site. There is no
// authentication because there is no server to authenticate against: this exists
// only while `pnpm dev` runs on the author's own machine, and Vite binds to
// localhost. It must not be moved into a deployed environment as-is.
//
// Every guard on what may be written lives in scripts/content-write.mjs, not in
// the browser and not here — see its header for why.

import { locate } from './content-ids.mjs'
import { readFields, writeField } from './content-write.mjs'

// Vite's dev server already mounts /__open-in-editor (launch-editor-middleware),
// so nothing here needs to know about vscode:// URLs or spawn anything. What it
// does need is for launch-editor to identify the editor: it normally guesses from
// running processes, and under WSL that fails, because VS Code runs as a Windows
// process invisible to a Linux `ps` while `code` on PATH is the interop shim.
// Pinning it makes the guess unnecessary; `code` is in launch-editor's known list,
// so it gets `-g file:line`. Override by exporting LAUNCH_EDITOR yourself.
const DEFAULT_EDITOR = 'code'

const json = (res, status, body) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

const readBody = req => new Promise((resolve, reject) => {
  let data = ''
  req.on('data', chunk => {
    data += chunk
    // A prose field is capped at 20k in content-write.mjs; this is the transport
    // guard, so a runaway body cannot be buffered without limit.
    if (data.length > 1e6) reject(new Error('body too large'))
  })
  req.on('end', () => resolve(data))
  req.on('error', reject)
})

export function contentEditor() {
  return {
    name: 'content-editor',
    apply: 'serve',
    configureServer(server) {
      process.env.LAUNCH_EDITOR ??= DEFAULT_EDITOR

      server.middlewares.use('/__content/locate', (req, res) => {
        const id = new URL(req.url, 'http://localhost').searchParams.get('id')
        const hit = id && locate(id)
        if (!hit) return json(res, 404, { error: id ? `no entity with id "${id}"` : 'no id given' })
        json(res, 200, hit)
      })

      // The editor loads its inputs from HERE rather than from the entity the
      // page already holds. The views carry assorted shapes — a card, a derived
      // error view-model, a skill with kind/group re-attached from tree position —
      // and the editor should depend on none of them. Reading from disk also means
      // the inputs show what is in the file, not what the last HMR left in the
      // module graph.
      server.middlewares.use('/__content/fields', (req, res) => {
        const id = new URL(req.url, 'http://localhost').searchParams.get('id')
        const found = id && readFields(id)
        if (!found) return json(res, 404, { error: id ? `no entity with id "${id}"` : 'no id given' })
        json(res, 200, found)
      })

      server.middlewares.use('/__content/write', async (req, res) => {
        if (req.method !== 'POST') return json(res, 405, { error: 'POST only' })
        let body
        try {
          body = JSON.parse(await readBody(req))
        } catch (e) {
          return json(res, 400, { error: `bad request body: ${e.message}` })
        }
        const result = writeField(body ?? {})
        // A rejection is the author's mistake, not a server fault: 400, with the
        // prose problems listed so the editor can show them beside the field.
        json(res, result.ok ? 200 : 400, result)
      })
    },
  }
}
