# App Design — Algebra Fluency Trainer

---

## Purpose

A daily drill tool for first-year Swiss high school students to build automaticity in algebra reading and classification. Used outside class (10–15 min/day), complementing in-class instruction. Not a tutor — a fluency trainer.

---

## Technical Stack

- **Framework:** Vue 3 (Composition API)
- **UI Library:** Naive UI — clean defaults, TypeScript-first, unobtrusive
- **Utility CSS:** UnoCSS (Tailwind-compatible, on-demand, Vite-native)
- **Math rendering:** KaTeX — fast, lightweight LaTeX rendering in-browser
- **State management:** Pinia
- **Routing:** Vue Router
- **Build:** Vite + vue-tsc
- **Package manager:** pnpm

KaTeX is the critical dependency: all expressions must render as proper mathematical notation, not plain text. Every expression in the taxonomy is stored in LaTeX and rendered via KaTeX.

**Compute Engine** (`@cortex-js/compute-engine`) parses expressions to MathJSON trees. First use (2026-07-11) is **offline validation only**: `pnpm validate` (`scripts/validate.ts`, run via `vite-node`) derives the AST for every Tier-2 skill and cross-checks the hand-authored structure fields against it — root op-class vs `answer`/`op`, and chunk count vs the tree's maximal root operands. Kept out of the app runtime bundle. Still planned: template substitution via the tree (Tier 2/3, avoiding raw-LaTeX collision) and Tier-3 equivalence verification; MVP template substitution is still regex-based. Tier 1 deliberately stays on surface strings — an AST cannot represent `3x` vs `3·x` (same tree).

**Display principle — the authored LaTeX string is the single source of truth for anything the student sees. Compute Engine is asked only *semantic* questions ("are these equal?", "what are the root operands?") and is never used to render display output.** The reason is that CE *canonicalizes*: it reorders commutative operands (`3x + 2y` can come back as `2y + 3x`) and folds subtraction into `Add`+`Negate`, losing surface sign placement — and `canonical: false` does **not** reliably preserve authored order either. That normalization is exactly the *feature* for Tier-3 equivalence grading (normalize both sides, then compare) and a bounded chore for structural chunk checks (compare operands as a multiset, reconcile signs) — but it is a hazard the moment it drives display. Tier 1 already lives by this (surface strings, no CE); Tier 2/3 follow it too — display the authored `expr`, use CE only for the semantic layer behind it.

**Why validation is offline even though CE will likely enter the app later.** CE will probably ship in the runtime bundle eventually — most plausibly for Tier-3 grading, which checks arbitrary live student input that can't be precomputed. Validation stays a separate offline gate regardless: it must run in CI / pre-commit independent of the app booting, it shouldn't re-run on every student page load, and runtime CE (when it lands) should be lazy-loaded for the grading feature specifically — a different concern from validation. (An alternative that keeps runtime CE minimal: pre-generate the drill pool and precompute each target's normal form at build time, shipping JSON.)

---

## Authoring tooling — the content pipeline (2026-07-25, editor removed 2026-07-26)

The content is ~450 KB of JSON under `src/data`. Authoring happens **in VS Code**, and the
app's job is to make that easy to aim rather than to replace it: a dev-only `source` button
on every entity opens its exact line. An in-app prose editor was built on 2026-07-25 and
**removed on 2026-07-26** — the deep link plus VS Code side by side on a desktop monitor
turned out to be enough, and with one author for the foreseeable future the write path was
machinery earning nothing. `docs/TODO.md` records the commit to restore it from.

**Two processes, and the boundary between them is the design.** `vite.config.ts` runs in
**Node** as the dev server and imports the `scripts/*.mjs` modules — which is why they may
use `node:fs` and read the repo. The app in `src/` runs in the **browser** and imports none
of them; `OpenInSource.vue` reaches the resolver only over HTTP. **`src/` must never import
from `scripts/`** — the build would try to bundle `node:fs` and fail. That boundary is also
why the feature cannot exist in production: no dev server, no Node process, no endpoint. The
built site renders no buttons and answers 404.

**Three invariants, each enforced.** They were introduced for the editor, and all three keep
paying for themselves without it:

1. **One canonical form.** `serializeContent` (`scripts/content-format.mjs`) is the only
   serializer: `JSON.stringify(v, null, 2)` plus a trailing newline. Any writer — the author
   in VS Code, Claude Code, a script — produces the same bytes, so a one-word fix arrives in
   `git diff` as one line rather than sixteen hunks of re-indentation. `pnpm format-content`
   normalizes; the check runs first in `pnpm validate`; VS Code formats JSON on save to
   match. **No Prettier**: its object expansion is input-sensitive, so it is not canonical in
   the required sense and can ping-pong against `JSON.stringify`.
2. **Globally unique entity ids.** Every addressable thing in all seven layers — a card, an
   error, a meta-pattern, a skill, a layer head — is a JSON object with an `id`, 218 of them,
   unique across all 23 files and guarded by `pnpm check-ids`. That is what lets a
   *shape-blind* walk (`entityPaths` in `scripts/content-ids.mjs`) find any entity without
   knowing that the tower nests `sections→groups→cards` while skills nest
   `kinds→groups→skills` across four files. The resolver is coupled to the **identity**
   model, not the **containment** model, so reshaping a layer does not touch it.
3. **One set of prose rules.** `scripts/content-prose.mjs`, used by `pnpm sweep-layers`. Two
   tiers: **KaTeX correctness** (every `$…$` compiles with no macros, delimiters pair)
   everywhere; **house style** (no em dash, no `ß`, no retired "sign"/"Vorzeichen") in the
   **tower only** — `errors.json` uses em dashes in its own head and is right to.

**The endpoint** (`scripts/vite-content-locator.mjs`, `apply: 'serve'`): `GET
/__content/locate?id=…` → `{ file, line, path }`. **The client sends only an id.** A path
computed in the browser can go stale the moment the file is edited elsewhere — a card
inserted above in VS Code shifts every index below it — so the path and line are derived
server-side, per request, from the bytes on disk at that moment. Nothing is cached.

`OpenInSource.vue` hands `file:line` to Vite's own `/__open-in-editor`; `LAUNCH_EDITOR` is
pinned to `code` because launch-editor guesses the editor from running processes and that
fails under WSL, where VS Code is a Windows process invisible to a Linux `ps` and `code` on
PATH is the interop shim.

**Not reachable by id**, should it ever matter again: sections and groups (they carry `slug`,
not `id`) and `instances[].hint` on an error (nested in an array, so a field path would need
an index).

---

## The visual system — rows, planes, voices (2026-07-26)

The reference pages are for LOOK-UP, not front-to-back reading, and that decides almost
everything below. Built on `LayerView`, which serves all four fundament layers; the curated
three are still on the older system (docs/TODO.md).

### Rows, not a card grid

`repeat(auto-fill, minmax(300px, 1fr))` was replaced by one landscape row per card. Three
reasons, in order of weight. The tower is a **linear argument** — no card may cite anything
later in its layer — and a multi-column grid renders an argument as a pinboard. A grid
**stretches every card in a row to the tallest**, so with notes running 46–1336 characters
one long note surrounded itself with columns of whitespace. And below 560px the grid was
already a single column, so **the phone was always seeing rows**; the desktop now agrees with
it rather than being a separate design.

The row is four columns — `rail | maths | intuition | note` — with a header strip spanning
them and full-width blocks below for the derivation and the details/json:

- **strip**: `kind`, a `rests on` fold, a `details` toggle, and the id at the right, which IS
  the source deep link (one affordance where there were two).
- **rail**: the name, with `concerns` trailing it as the operator glyphs themselves — a
  concern's glyph is the `symbol` of the card where that concern ENTERS the tower, the same
  entry points sweep-layers' audit derives.
- **maths**: statement, or signature glyph, or avoid/prefer; then the quantifiers.
- **two prose cells**: intuition then note, each clipped at 240 characters with an expander.
- **full width**: derivation and details — a derivation runs to 362 characters of LaTeX and
  would scroll to uselessness in the 19rem maths column.

**EVERY CELL KEEPS ITS COLUMN even when empty.** The intuition column is blank on the 67
cards without one. Three attempts at filling those gaps were each worse: spanning gave the
note 126 characters per line, and moving it put note left edges at 900/485/485/252/900 down
the page. The rule that came out of it is worth keeping: *a gap in the same place on every
row reads as structure; a gap that moves reads as breakage.*

**Widths were measured, not chosen.** At a 13rem maths column, 20 of 92 maths cells
overflowed, the widest being `th.minus-in-product` at 407px; fitting all of them would need a
25rem column and a 100rem page. The compromise takes width from the prose rather than off the
screen: maths 19rem clears half of them, prose 26rem still gives ~51 characters, page 91rem.
Sizing the COLUMNS and letting the page fall out is what makes `.cell`'s `max-width` exact —
a cell can never be wider than one column.

### Three planes, ordered by elevation

One panel per SECTION (26 across the tower), with group subheads as bands inside it. Per
group it was 37 panels, several wrapping a single row, which read as a box around one card.

    --bg      #e6e6e6  page, lowest    structure (headings) lives here
    --band    #f1f1f1  middle          a subdivision inside a panel
    --surface #fbfbfb  panel, highest  content lives here

The ordering is the whole point: **a band painted near the page's colour reads as a HOLE
punched through the panel to the page behind it**. A band clearly lighter than the page
cannot, because nothing recessed is lighter than what it recedes toward. Radix's step
semantics place the band at step 3 (UI-element background, for a subdivision inside a
surface); putting step 2 there left it six values from white and its edges dissolved.

Two further rules the iteration produced. **The neutrals are one pure family** — equal RGB on
every step, from Radix `gray`; the earlier hand-rolled greys had drifted into a bad `slate`
(blue seven points above red) and the temperature mismatch read as colours oscillating.
And **no pure white**: `#ffffff` against a grey page is a 23-value jump that dominates as
glare, so the ladder runs in even ~10-value steps and stops short.

Colour stays reserved for signal. `--accent-bg` has exactly one structural use, the
deep-link target, which also takes an inset accent bar rather than a spread shadow that bled
outside the panel.

### Two typographic voices

**Card content is Latin Modern Roman; everything else is the sans body font**, with mono left
for ids and codes. This is not decoration: inline `$…$` fragments are rendered by KaTeX in
Computer Modern, so prose set in anything else changes typeface at every formula. Latin
Modern is the Unicode successor to Computer Modern and what LaTeX sets by default, so prose
and its formulas are now one face. Self-hosted, 96KB, licence and rejected alternatives in
`public/fonts/README.md`.

The serif/sans split is also what lets the headings be plain: they were briefly mono, only
because card names were then also sans. Structure now carries its levels by size and weight
alone — section .98rem/700, subhead .82rem/600, kind .62rem/600 muted, no small caps.

⚠️ Card names take weight **500**, which resolves to Latin Modern's regular face. 560 matches
the 700 face and sets every name in bold.

⚠️ `overflow-x: auto` makes the computed `overflow-y` AUTO as well, so a formula whose ink
exceeds its line box gets a surprise VERTICAL scrollbar — `th.root-of-quotient` ran 46px of
content in a 41px box. Every display-math container needs vertical padding, not just
`overflow-x`.

### Dark mode

Live. `src/theme.ts` stamps `data-theme` on the root, which selects the second token block in
`tokens.css` — the same elevation ladder inverted in value but not meaning, with wider steps
because dark surfaces need more separation to read apart. It defaults to
`prefers-color-scheme` and follows the system until the user chooses in Settings, after which
the stored choice wins.

⚠️ **It is TWO halves.** The token block covers everything the views draw; naive-ui's own
components (header, menu, popover, radio) style themselves and cannot see our variables, so
`App.vue` hands them `darkTheme` separately. Miss either half and you get a dark shell over
light pages, or the reverse — including in any automated check that sets the attribute
without updating the ref.

Two tokens exist purely for inverted states, and both were literal `#fff` before: `--on-accent`
(text on an accent fill — dark in dark mode, because the accent lifts to a pale indigo), and
the "on" toggles, which use `--surface` since that is the opposite end of the ramp in both
themes.

---

## App shell & views (as built — 2026-07-15, routing/nav updated 2026-07-24)

**Shell** (`App.vue`): a naive-ui header — brand · page nav (`NMenu`) · settings
popover (`NPopover`). The language switch lives in the settings popover (moved
out of the per-view headers), and so does the **dark-mode switch — live since
2026-07-26**, `src/theme.ts` plus the second token block in `tokens.css`. See
"The visual system → Dark mode" above for the two-halves trap (`NConfigProvider`
takes `darkTheme` separately; our tokens are invisible to naive-ui's own
components).

**Router** (`router.ts`): `/` (`OverviewView` — the home/landing, an all-SVG clickable
diagram of the reference stack, reached from the "Algebra" brand link), `/skills`
(`TaxonomyView`), `/errors` (`ReferenceView` — errors only), `/metapatterns`
(`MetapatternsView`), `/tutorial`, `/drills`, **plus one route per layer of the
tower** — `/fundamentals`, `/numbers`, `/powers`, `/terms`. Those four are
**generated from the manifest** (`src/data/layers.ts`) and all render the same
component (`LayerView`, selected by a `layerId` prop), so adding a layer needs no
route. The **nav groups them** (`App.vue`): a "Fundament" dropdown over the four
layers, a "Curated" dropdown over Errors · Metapatterns · Skills (ordered bottom-up to
echo the reference stack), then Tutorial and Drills. Group headers use `-menu` keys so
they never collide with a route. Activity routes are lazy-loaded so their future weight
(CE grading) code-splits off the reference pages. **Tutorial and Drills are empty stubs.**

**Two audiences.** `Skills`, `Fundamentals` and the four **layer** pages are
*browsable catalogs* and today are **teacher/dev inspection surfaces** — they show
ids, raw JSON, `unused` coverage markers. The layer pages are the deepest of these
and are explicitly *not* student-facing (see the school-facing simplification thread
in `docs/TODO.md`). `Tutorial` and `Drills` are the (unbuilt) **student** surfaces.
Design rule for when they're built: **Tutorial *drives* Drills — one drill-runner,
two drivers** (guided `requires`-traversal vs. free pick). Don't fork the runner.

**Card system** (all catalogs, one system): a card rests quiet — an absolute
coordinate *eyebrow* (`kind · group`, pinned under the top border), **`name`**, the
primary content (a card's statement / a skill's forms), and the prose (`note`, or a
metapattern's `rule`). Everything else — ids, coordinates, links, pitfalls, raw JSON —
sits behind a per-card `details` disclosure, each row **labeled with its field name**.
Group/kind/layer descriptions are tap-triggered **info-dot popovers** (mobile-friendly,
not hover). `Errors` and `Metapatterns` are the curated-lens pages (each with a role
header + a contextual "N unused" chip); `Skills` also switches `by group` / `by kind`.
(The old Laws · Conventions · Errors segment switch is gone — laws/conventions became
tower cards in the 2026-07-23 bridge.)

**Design tokens** (`src/styles/tokens.css`): one quiet neutral-led palette, color
reserved for signal. This *is* the dark-mode groundwork. **Display prose for the
curated side lives in data registries**, never hardcoded in components: `skillGroups`
and `skillKinds` (slug-set validated == the kind enum). (The old `lawGroups`/
`conventionGroups`/`lawKinds` registries went with laws.json/conventions.json in the
bridge; the tower's own section/group titles live inline in each `cards.json`.)

**Mobile:** cards are single-column by default, multi-column at ≥560px —
mobile-*aware*, not a mobile-first pass (that's reserved for the greenfield drill
screens).

---

## Core Concepts

### Skill
One entry in the taxonomy (e.g. B4 — distributing a negative over a difference).
Each skill has:
- A set of parameterized templates for generating items
- A meta-pattern link (shown in feedback)
- A mastery threshold (e.g. 8 correct in a row across sessions)

### Item
A single exercise, generated from a skill template. Never stored — generated fresh each session.

### Mastery
A skill is mastered when the student has answered correctly above threshold with no recent errors. Mastery decays over time (spaced repetition) — a skill can move from mastered back to review.

### Session
A fixed-length set of items (around 12–15). Mix of:
- New skills being introduced
- Skills in progress
- Mastered skills due for review

Session always has a clear end. Students never open the app and face an infinite queue.

---

## Exercise Types

### Type 1 — Same or Different?
**Covers:** Tier 1 (equivalence fluency)

Two expressions displayed side by side (or stacked on mobile).
Student taps SAME or DIFFERENT.

```
   3(x + 1)        3x + 1
   
   [ SAME ]    [ DIFFERENT ]
```

### Type 2 — Odd One Out
**Covers:** Tier 1 (equivalence fluency, deeper)

Four expressions displayed. Three are equivalent, one is not.
Student taps the odd one out.

```
   3(x+1)     3·(x+1)     (x+1)·3     3x+1
```

### Type 3 — Name the Structure
**Covers:** Tier 2 (structural recognition)

One expression displayed. Student taps the dominant operation.

```
        3(x + 1) − 2(x − 1)

  [ SUM ]  [ DIFFERENCE ]  [ PRODUCT ]  [ QUOTIENT ]  [ POWER ]
```

All three types require a single tap — no typing, no drag. Fast by design.

---

## Feedback

### Correct answer (fluency mode)
Subtle positive signal (brief green highlight, soft sound optional).
Next item loads immediately. Rhythm is not interrupted.

### Wrong answer (learning mode)
Triggered by: first encounter with a skill, OR same error made twice in a row.

1. Show what the student answered and why it is wrong — specifically, not generically.
2. Show the correct answer with a one-line explanation.
3. Link to the relevant meta-pattern (tap to expand).
4. Same item repeats before moving on.

Example:
```
You answered: SAME
─────────────────────────────
  -(a - b)  ≠  -a - b

The minus distributes and flips the sign of every term inside.
-(a - b) = -a + b

→ See meta-pattern `meta.implicit-op-before-bracket`: minus before a bracket means × (−1)
```

### No gamification
No points, stars, streaks, leaderboards, or celebratory animations.
Progress is shown as mastered skills — a real, meaningful number.

---

## Session Structure

1. **Open app** → see progress overview (X skills mastered, Y in progress)
2. **Start session** → 12–15 items, drawn from:
   - 1–2 new skills (introduced for first time)
   - 4–6 skills in active learning
   - 3–4 mastered skills due for spaced review
3. **During session** → items appear one at a time, full screen, no distractions
4. **End of session** → brief summary: how many correct, which skills improved, which need more work
5. **Done** → clear stopping point, no pressure to continue

---

## Progression

### Introduction order
Skills are introduced in priority order (as defined in each taxonomy).
A new skill is not introduced until the previous one reaches a minimum threshold.

### Mastery definition
- 8 correct answers with no errors in the last 8 attempts = mastered
- Mastered skills re-enter review queue after 3 days, then 1 week, then 2 weeks (spaced repetition)

### Adaptive difficulty
If a student errors on a skill repeatedly:
- That skill appears more often
- Simpler template variants are used first
- Harder variants (more complex parameters) introduced after mastery of simpler ones

---

## UI Principles

- **One thing per screen.** During a session, only the current item is shown.
- **Large tap targets.** Answer buttons must be comfortably tappable on a phone.
- **Math is the focus.** Expressions rendered large and clearly via KaTeX. No visual clutter around them.
- **Minimal chrome.** No persistent navigation during a session. Progress bar at top only.
- **Fast.** No loading states between items. Next item is pre-generated.
- **No dark patterns.** No notification guilt, no streak anxiety, no "don't break the chain" pressure.

---

## Teacher Dashboard

Separate view (not student-facing).
Shows per-student:
- Skills mastered / in progress / not yet started
- Skills with persistent errors (high miss rate)
- Last session date

Allows teacher to target class time at the skills where most students are stuck.

---

## Scope

### In scope (v1)
- Tier 1 exercise types (Type 1 and Type 2)
- Tier 2 exercise type (Type 3)
- Taxonomy skills for Tier 1 (`equivalence`) and Tier 2 (`classification` / `chunking` / `recognition`)
- Spaced repetition and mastery tracking
- Meta-pattern lookup library
- Teacher dashboard (read-only)

### Out of scope (v1)
- Tier 3 (manipulation) — requires free input and CAS-based verification
- Authentication / multi-school deployment
- Mobile app (PWA is sufficient for v1)
- Localisation (Swiss German, French)

---

## Open Questions

- Should the app be usable without a teacher account (solo student)?
- How are student accounts created — teacher-issued codes, or self-registration?
- Local storage only (simple, private) vs. backend (required for teacher dashboard)?
- Which skills should be in the diagnostic entry test, and how many items?
