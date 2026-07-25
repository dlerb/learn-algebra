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

## Authoring tooling — the content pipeline and the in-app editor (2026-07-25)

The content is ~450 KB of JSON under `src/data`, and by now the bottleneck is not writing
it but *improving* it: fixing a German sentence when you notice it, which happens while
reading the page, not while sitting in a JSON file where the neighbouring cards are
invisible. Everything below exists to make that edit cheap without giving up git, the
load-time validators, or the ability to grep the content.

**Two processes, and the boundary between them is the whole design.** `vite.config.ts` runs
in **Node** as the dev server and imports the `scripts/*.mjs` modules — which is why they
may use `node:fs` and write to disk. The app in `src/` runs in the **browser** and imports
none of them; `ProseEditor.vue` reaches the write path only over HTTP. **`src/` must never
import from `scripts/`** — the build would try to bundle `node:fs` and fail. That boundary
is also why the feature cannot exist in production: no dev server, no Node process, no
endpoints. The built site renders no editor and answers 404 to `/__content/write`.

**Three invariants, each enforced, each a precondition for the next.**

1. **One canonical form.** `serializeContent` (`scripts/content-format.mjs`) is the only
   serializer: `JSON.stringify(v, null, 2)` plus a trailing newline. Every writer imports
   it rather than calling `JSON.stringify` with its own options, because two writers that
   merely *intend* the same style will drift, and a disagreement shows up as a one-word fix
   arriving in `git diff` as sixteen hunks of re-indentation. `pnpm format-content`
   normalizes, and the check runs first in `pnpm validate`. VS Code formats JSON on save to
   match. **No Prettier**: its object expansion is input-sensitive, so it is not canonical
   in the required sense and can ping-pong against `JSON.stringify`.
2. **Globally unique entity ids.** Every addressable thing in all seven layers — a card, an
   error, a meta-pattern, a skill, a layer head — is a JSON object with an `id`, 218 of
   them, unique across all 23 files and guarded by `pnpm check-ids`. This is what lets a
   *shape-blind* walk (`entityPaths` in `scripts/content-ids.mjs`) find any entity without
   knowing that the tower nests `sections→groups→cards` while skills nest
   `kinds→groups→skills` across four files. Reshaping a layer does not touch the resolver:
   it is coupled to the **identity** model, not the **containment** model.
3. **One set of prose rules.** `scripts/content-prose.mjs`, shared by `pnpm sweep-layers`
   and the write path, so the editor cannot accept text the sweep later rejects. Two tiers:
   **KaTeX correctness** (every `$…$` compiles with no macros, delimiters pair) applies
   everywhere; **house style** (no em dash, no `ß`, no retired "sign"/"Vorzeichen") applies
   to the **tower only** — `errors.json` uses em dashes in its own head and is right to.

**The endpoints** (`scripts/vite-content-editor.mjs`, `apply: 'serve'`): `GET
/__content/locate` → file and line, `GET /__content/fields` → the writable prose,
`POST /__content/write` → one localized string. **The client never sends a path.** A path
computed in the browser can go stale the moment the file is edited elsewhere — a card
inserted above in VS Code shifts every index below it — so every request carries a stable id
and the path is derived server-side, per request, from the bytes about to be read or
written. Nothing is cached between requests. There is no authentication because there is no
server to authenticate against: this runs on the author's machine, bound to localhost.

**What may be written is decided server-side**, in `scripts/content-write.mjs`, not in the
UI: the browser decides what to *offer*, that decides what is *allowed*. `WRITABLE_FIELDS`
is `name · note · intuition · fix · rule · meta.characterizes · meta.note`. Three guards,
each ruling out a different accident — the allowlist keeps `id`, `basedOn`, `corrupts` and
the rest unreachable, so the editor **cannot** break the ~197 cross-references; a field must
already exist, so a typo'd name fails loudly instead of quietly growing a key no view reads;
and the prose rules run before the write lands. An editor that can only touch leaf strings
is one you can use quickly and carelessly, which is the point.

**Localization follows the data rather than forcing it.** Cards, errors and meta-patterns
carry `{en, de}`; all 96 skills prose fields are bare English-only strings, which the schema
reads as English. Editing `en` on a bare string leaves it bare; typing `de` promotes it to a
pair — that is how a translation gets added without a source edit.

**Two UI components, both dev-only, both generic over all seven layers** because they need
nothing but an id: `OpenInSource.vue` (hands `file:line` to Vite's own `/__open-in-editor`;
`LAUNCH_EDITOR` is pinned to `code` because launch-editor's process-guessing fails under WSL,
where VS Code is a Windows process invisible to a Linux `ps`) and `ProseEditor.vue` (en/de
textareas, with a live KaTeX preview under any field carrying `$…$` — the one thing the app
does that an editor cannot, and the only real argument for editing here at all). Saving
triggers a full HMR reload, so the panel closes; the hash is set *before* the write, so the
page lands back on the card. One editor may be open at a time, so a reload cannot discard
unsaved text elsewhere.

**Known limits**, listed in `docs/TODO.md`: the panel inherits the card's width and is too
narrow for two languages of a paragraph (layout thread open); sections and groups are not
addressable, since they carry `slug` rather than `id`; and `instances[].hint` needs an index
in the field path.

---

## App shell & views (as built — 2026-07-15, routing/nav updated 2026-07-24)

**Shell** (`App.vue`): a naive-ui header — brand · page nav (`NMenu`) · settings
popover (`NPopover`). The language switch lives in the settings popover (moved
out of the per-view headers). **Dark mode is scaffolded but NOT surfaced**:
`NConfigProvider` is in place, but the content views must first move fully to the
color tokens, so enabling the toggle now would darken only the chrome. Turning it
on later ≈ one prop + a `:root[data-theme="dark"]` block in `tokens.css`.

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
