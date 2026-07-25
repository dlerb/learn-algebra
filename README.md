# learn-algebra

An algebra fluency app for Swiss Gymnasium first-years, plus the content model
behind it. Built by a maths teacher; the content is bilingual (English and Swiss
High German).

The working thesis: algebra is hard not because the rules are many, but because
several *distinct* things are taught in one voice — a definition, a theorem, a
convention and a picture all sound alike. Most of this repository is an attempt to
pull those apart and keep them apart. See `docs/vision.md`.

## Two towers, deliberately separate

**The fundament** — mathematics from stated assumptions, for the author and for
teachers, not for students. Four layers, each one JSON file rendered by one view:

| layer | page | what it adds |
|---|---|---|
| `fundamentals` | `/fundamentals` | ℝ as the complete ordered field: `+ · = <`, the axioms, `−`/`/`/`\|·\|` as definitions, the first theorems |
| `numbers` | `/numbers` | ℕ, ℤ and ℚ carved out of ℝ — numerals, multiples, divisibility, the √2 hole |
| `powers` | `/powers` | `aⁿ` in three acts: ℕ *builds*, ℤ *finds* (forced by permanence), ℚ *must be given* (the tower's only use of completeness) |
| `terms` | `/terms` | term manipulation: distributing, the binomials, the fraction bar and fraction arithmetic |

**101 cards.** Each layer is a containment tree `layer → sections[] → groups[] →
cards[]`, where page order is array order at every level.

**The curated layers** — the pedagogy on top, and the part that faces students:
**errors** (`errors.json`, 28 common mistakes grouped by topic, each shown wrong →
right), **metapatterns** (`metapatterns.json`, 11 reading rules) and **skills**
(`skills/*.json`, 74 curated strategies) with **drills** (`drills/*.json`) holding
the concrete material. Every curated entry points *down* into a tower card, so the
stack is acyclic: cards ← errors/metapatterns ← skills. See `docs/content_model.md`.

`src/data/layers.ts` is the manifest for **all seven layers**: it fixes the reading
order, generates every route and both nav dropdowns (grouped by `family`:
`fundament` or `curated`), resolves citations *across* tower layers, and validates
at load time. Adding a layer is one entry there.

The two families are separate representations of the same mathematics and are
**not** to be merged.

## Pages

The four tower pages are **teacher/dev** inspection surfaces — ids, raw JSON,
coverage markers.

`/errors` (*Common mistakes*) and `/metapatterns` (*Reading rules*) are
**student-facing**, and each has two modes: **presentation is the default**, with
an `inspect` toggle that adds ids, raw JSON and coverage warnings. The toggle only
appears in dev or with `?inspect`, so a build shows students the page and nothing
else — and because presentation is the default, the student view cannot rot unseen.
`/skills` has no split yet.

`/tutorial` and `/drills` are the remaining student surfaces and are **empty
stubs**: the drill runner is not built. Design rule for when it is: Tutorial
*drives* Drills, one runner with two drivers. See `docs/app_design.md`.

## Running it

```bash
pnpm install
pnpm dev             # vite dev server (also serves the content editor — see below)
pnpm build           # vue-tsc && vite build
pnpm validate        # canonical form + id uniqueness, then schema, graph, Compute Engine
pnpm sweep-layers    # fundament: KaTeX (no macros), citations, concerns, prose rules
pnpm format-content  # rewrite src/data JSON in canonical form (`:check` to verify only)
pnpm check-ids       # entity ids unique across every content file
```

`pnpm sweep-layers` compiles every LaTeX field and every inline `$…$` fragment with
**no macros defined**, then checks that card codes are unique tower-wide, that every
citation resolves, and that the prose rules hold. Structural validation also runs at
load time in `src/data/layers.ts`, so a broken citation throws rather than rendering.

Stack: Vue 3 + TypeScript + Vite, naive-ui, UnoCSS, Pinia, vue-router, KaTeX, Zod,
Compute Engine.

## Editing content in the app (dev only)

Under `pnpm dev`, every card, error, meta-pattern, skill and layer head grows two small
author-only buttons: **`source`** opens that entity's line in VS Code, and **`edit prose`**
opens `en`/`de` textareas for its prose, with a live KaTeX preview of any `$…$`. Saving
writes the JSON file on disk, so the change lands as an ordinary `git diff` you review and
commit; Vite reloads and the page returns to the card you were on.

The editor is scoped to **prose only** — `name`, `note`, `intuition`, `fix`, `rule`,
`meta.*`. It cannot touch ids, `basedOn`/`corrupts`/`restsOn`, card order, or the `latex`
fields, and that is enforced on the server, not in the UI. An editor that only reaches leaf
strings cannot break the ~197 cross-references, which is what makes it safe to use without
care; everything else stays VS Code work, which is what the `source` button is for.

None of this exists in a build: the endpoints live in a `apply: 'serve'` Vite plugin, so the
deployed site renders no buttons and answers 404. See `docs/app_design.md` →
"Authoring tooling" for the architecture and its invariants.

## Prose format

Content text is plain text with inline `$…$` KaTeX — deliberately **not** markdown
(`RichText.vue` has no parser). Fields like `latex`, `derivation`, `forall` and
`cond` are pure LaTeX.

The rules are checked by `scripts/content-prose.mjs`, shared by `pnpm sweep-layers` and the
in-app editor's write path so the two cannot disagree, and they come in **two tiers**.
*Correctness* applies everywhere: every `$…$` fragment must compile with no macros defined,
and the delimiters must pair. *House style* applies to the **fundament tower only** — no em
dashes (they render literally, and `—` reads as `−`), Swiss orthography in German (`ss`,
never `ß`), and none of the retired word "sign"/"Vorzeichen". The curated layers are exempt
by design: `errors.json` uses em dashes in its own prose.

## Docs

| file | what |
|---|---|
| `docs/vision.md` | why the project exists |
| `docs/TODO.md` | the live thread list, including everything parked |
| `docs/content_model.md` | the skills tower: rationale and revisions |
| `docs/app_design.md` | shell, views, card system, drill-runner design, **authoring tooling** |
| `docs/fundamentals.md` | the fundament layer's design decisions and data structure |
| `docs/numbers.md` · `docs/powers.md` · `docs/terms.md` | one per further layer of the tower |
| `docs/powers-nat-act.md` · `docs/powers-int-act.md` · `docs/powers-rat-act.md` | the three acts of the powers layer |
| `docs/common_mistakes.md` | the web-sourced catalogue behind `/errors` |
| `docs/skill2_grammar.md` | Tier-2 grammar notes |

Start with `docs/TODO.md` for where things stand and `docs/fundamentals.md` for why
the fundament is built the way it is.
