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
| `fundament0` | `/fundament0` | ℝ as the complete ordered field: `+ · = <`, the axioms, `−`/`/`/`\|·\|` as definitions, the first theorems |
| `naturals` | `/naturals` | ℕ carved out of ℝ, numerals, multiples, natural powers |
| `integers` | `/integers` | `a⁰` and `a⁻ⁿ` as choices *forced by permanence* |
| `rationals` | `/rationals` | roots and rational exponents, by *existence* — the tower's only use of the completeness axiom |

Each layer is a containment tree `layer → sections[] → groups[] → cards[]`, where
page order is array order at every level. `src/data/layers.ts` is the manifest: it
fixes the reading order, generates the routes and nav entries, resolves citations
*across* layers, and validates at load time.

**The skills tower** — the pedagogical bridge, and the part that faces students.
Laws, conventions, error patterns and meta-patterns as data (`laws.json`,
`conventions.json`, `errors.json`, `metapatterns.json`), with **skills**
(`skills/*.json`) as curated strategies built on those coordinates and **drills**
(`drills/*.json`) holding the concrete material. See `docs/content_model.md`.

The two towers are separate representations of the same mathematics and are **not**
to be merged. Note that both use the word *layer*: in the skills tower it means a
file and a role (`src/data/layers.json`), in the fundament it means a floor of
mathematical dependency (`src/data/layers.ts`).

## Pages

`/skills` and `/fundamentals` are browsable catalogs; the four layer pages are the
deepest inspection surfaces. All of these are **teacher/dev** views — they show ids,
raw JSON and coverage markers. `/tutorial` and `/drills` are the student surfaces
and are **empty stubs**: the drill runner is not built. Design rule for when it is:
Tutorial *drives* Drills, one runner with two drivers. See `docs/app_design.md`.

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
