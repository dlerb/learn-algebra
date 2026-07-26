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

It also prints an `[audit]` line cross-checking the two hand-authored graphs over the
cards: if a card claims a `concerns` token that **no card it cites** concerns, either the
tag is wrong or a citation is missing. A report, never a failure — the reverse direction
(ancestors concerning more than the card claims) is normal and ignored.

Stack: Vue 3 + TypeScript + Vite, naive-ui, UnoCSS, Pinia, vue-router, KaTeX, Zod,
Compute Engine.

## Authoring: jump from the page to the source (dev only)

Content is edited in VS Code. Under `pnpm dev`, every card, error, meta-pattern, skill and
layer head grows a small author-only **`source`** button that opens that entity's exact line
in the editor — the page shows a card among its neighbours, the source shows it with no
context at all, and this is the bridge. With the browser and VS Code side by side on one
monitor that is the whole authoring loop.

Nothing writes: the resolver is a single read-only `GET /__content/locate?id=…` in an
`apply: 'serve'` Vite plugin, so the deployed site has no button and no endpoint. An in-app
prose editor existed briefly (2026-07-25 to 2026-07-26) and was removed as unnecessary; see
`docs/app_design.md` → "Authoring tooling" for the architecture and the three content
invariants it left behind, and `docs/TODO.md` for the commit to restore it from.

## Prose format

Content text is plain text with inline `$…$` KaTeX — deliberately **not** markdown
(`RichText.vue` has no parser). Fields like `latex`, `derivation`, `forall` and
`cond` are pure LaTeX.

The rules live in `scripts/content-prose.mjs`, applied by `pnpm sweep-layers`, and come in
**two tiers**. *Correctness* applies everywhere: every `$…$` fragment must compile with no macros defined,
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
