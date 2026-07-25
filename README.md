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
pnpm dev            # vite dev server
pnpm build          # vue-tsc && vite build
pnpm validate       # skills/drills: schema, id uniqueness, graph + Compute Engine checks
pnpm sweep-layers   # fundament: KaTeX (no macros), citations, concerns, prose rules
```

`pnpm sweep-layers` compiles every LaTeX field and every inline `$…$` fragment with
**no macros defined**, then checks that card codes are unique tower-wide, that every
citation resolves, and that the prose rules hold. Structural validation also runs at
load time in `src/data/layers.ts`, so a broken citation throws rather than rendering.

Stack: Vue 3 + TypeScript + Vite, naive-ui, UnoCSS, Pinia, vue-router, KaTeX, Zod,
Compute Engine.

## Prose format

Content text is plain text with inline `$…$` KaTeX — deliberately **not** markdown
(`RichText.vue` has no parser). Fields like `latex`, `derivation`, `forall` and
`cond` are pure LaTeX. No em dashes in data (they render literally, and `—` reads as
`−`), and Swiss orthography in German: `ss`, never `ß`.

## Docs

| file | what |
|---|---|
| `docs/vision.md` | why the project exists |
| `docs/TODO.md` | the live thread list, including everything parked |
| `docs/content_model.md` | the skills tower: rationale and revisions |
| `docs/app_design.md` | shell, views, card system, drill-runner design |
| `docs/fundament0.md` | the fundament's design decisions and the untangling backlog |
| `docs/naturals.md` · `docs/integers.md` · `docs/rationals.md` | one per layer above fundament0 |
| `docs/skill2_grammar.md` | Tier-2 grammar notes |

Start with `docs/TODO.md` for where things stand and `docs/fundament0.md` for why
the fundament is built the way it is.
