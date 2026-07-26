// DEV-ONLY: "open this entity's source in the editor", by id.
//
//   GET /__content/locate?id=…  → { id, file, line, path }
//
// One route, READ-ONLY. There was briefly a write path here too, behind an in-app
// prose editor; it was removed on 2026-07-26 because the deep link plus VS Code
// side by side on a desktop monitor turned out to be enough, and the author is the
// only person who will edit this content for the foreseeable future. See
// docs/TODO.md — the commit to restore from is recorded there.
//
// THE CLIENT SENDS ONLY AN ID. Positional information computed in the browser can
// go stale the moment the file is edited elsewhere — a card inserted above in VS
// Code shifts every index below it — so the path and line are derived here, per
// request, from the bytes on disk at that moment. Nothing is cached.
//
// `apply: 'serve'` keeps all of it out of the built site.

import { locate } from './content-ids.mjs'

// Vite's dev server already mounts /__open-in-editor (launch-editor-middleware),
// so nothing here needs to know about vscode:// URLs or spawn anything. What it
// does need is for launch-editor to identify the editor: it normally guesses from
// running processes, and under WSL that fails, because VS Code runs as a Windows
// process invisible to a Linux `ps` while `code` on PATH is the interop shim.
// Pinning it makes the guess unnecessary; `code` is in launch-editor's known list,
// so it gets `-g file:line`. Override by exporting LAUNCH_EDITOR yourself.
const DEFAULT_EDITOR = 'code'

export function contentLocator() {
  return {
    name: 'content-locator',
    apply: 'serve',
    configureServer(server) {
      process.env.LAUNCH_EDITOR ??= DEFAULT_EDITOR

      server.middlewares.use('/__content/locate', (req, res) => {
        const id = new URL(req.url, 'http://localhost').searchParams.get('id')
        const hit = id && locate(id)
        res.setHeader('Content-Type', 'application/json')
        if (!hit) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: id ? `no entity with id "${id}"` : 'no id given' }))
          return
        }
        res.end(JSON.stringify(hit))
      })
    },
  }
}
