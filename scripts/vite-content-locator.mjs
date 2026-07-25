// DEV-ONLY: "open this card's source in the editor", by id (2026-07-25).
//
// The page shows a card in its place in the layer, with the cards above and
// below it visible; the source shows the JSON with no context at all. This plugin
// is the bridge — click a card, land on its line. It is the FIRST consumer of the
// id → (file, line) resolver in scripts/content-ids.mjs, and deliberately a
// READ-ONLY one: the in-app prose editor will resolve exactly the same way before
// writing, and a mistake in resolution should first show up as landing on the
// wrong line, not as a silently corrupted card.
//
// It is also permanent, not a stepping stone. The prose editor is scoped to leaf
// strings and will never touch ids, `basedOn`, card order, or adding a card —
// those stay editor work forever, and they are exactly the edits where seeing the
// neighbouring cards matters most.
//
// `apply: 'serve'` keeps every byte of this out of the built site, which is what
// students get. There is no write path here at all.

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

      // GET /__content/locate?id=ax.distributivity → { id, file, line, path }
      //
      // The client sends an id and NOTHING ELSE — no path, no line, no layer.
      // Positional information computed in the browser could go stale the moment
      // the file is edited elsewhere; resolving here, per request, against the
      // bytes on disk, means the answer is derived from the same text it
      // describes. The client then hands file:line to /__open-in-editor.
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
