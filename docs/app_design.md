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
   error, a rule, a skill, a layer head — is a JSON object with an `id`, 232 of them,
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
everything below.

### One shell, seven pages (2026-07-27, completed 2026-07-28)

The row system started inside `LayerView` and now lives in four components under
`src/components/`, so `/errors`, `/rules` and `/skills` are the same application as the tower
rather than four pages that happen to import the same file:

- **`LayerPage`** — the measure vocabulary (`--rail` 11rem, `--maths` 19rem, `--measure`
  26rem), the page's one left edge, the header, the inspect toggle. **`cols` is a prop**,
  because the column budget is a per-layer decision and belongs in the consuming page's own
  stylesheet beside the arithmetic justifying it: the tower, `/errors`, `/rules` and
  `/skills` all run four, and no two of them the same four widths.
- **`LayerSection`** — heading and note on the page plane, one panel per section. `title` is
  optional, for a FLAT layer: `/rules` is a registry of sentences with no structure to give
  it, so it renders one panel and no heading.
- **`LayerRow`** — strip · rail · body. The strip is `kind`, reference folds, the json fold
  and the id (which IS the source deep link); the rail is the name plus trailing marks — the
  tower's concern glyphs, an error's ★ frequency. **The body is a slot**: a statement, a ✗/✓
  table and a sentence have nothing in common but their container. What makes the pages look
  alike is the shared strip, rail, planes, hairline, measures and `:deep(.cell)` prose, not a
  shared body.
- **`RefFold`** — the one answer to "where do pointers to other entries go". Bare grey text
  read as more prose; full-size pills were the loudest thing on a row. A closed fold is
  neither. `derived` swaps ▸ for → to mark a link nobody authored.

Prose clipping is shared in `src/prose.ts` — 240 characters at a 26rem column, less in a
narrower one. Every reference page is now on this system.

**`/skills` came last (2026-07-28)**, and brought two things no other layer had:

- **A layer head for a layer with no one file.** Every other layer keeps its title, blurb and
  note at the top of its single tree; skills are four kind files and the head belongs to none
  of them, so it is authored on its own in `src/data/skills/layer.json` and joined by
  `parseSkillTree(files, head)`. Until then `/skills` was the one page whose title and lede
  were hardcoded view prose — and so the one page that could not be read in German.
- **Two sectionings of one list**, in `LayerPage`'s `filters` slot beside where the tower's
  chips sit: `group` is the classroom topic, `kind` the strategy type, they cross-cut, and
  both are real ways in. What makes the switch cheap is that **the strip carries the
  COMPLEMENTARY coordinate** — under a topic heading it says which strategy, under a strategy
  heading which topic — so the row never repeats the heading and never loses the other half.

**The good half carries the ANSWER, not only a formula.** An equivalence or transformation
skill answers with a form (`illustration` + `wrong`); a classification answers with a NAME
(`answer`/`misreads`) and a chunking with a SPLIT (`chunks`/`misChunks`, rendered as boxed
pieces so `3x` visibly reads as one thing). The view picks on PRESENCE, never on `kind`.
⚠️ **The marks come as a pair or not at all** — the ✓ renders only when the bad half has
something in it (`paired`). This was hardcoded to always-✓ when the row became two blocks and
went unnoticed until the classification readings landed.

**The family label in front of a rule comes from `rule.family`** (2026-07-29), not from sheet
membership — so `/skills` imports nothing from `cheatsheets.json`. A family head's `rule` IS
the label ("Power laws"); its `note` says why the family coheres.

**Its row was rebuilt 2026-07-29 as TWO BLOCKS rather than four cells** — the user's model: a
skill is one problem, solved right and solved wrong.

    name │ ✓ the correct form         │ ✗ the tempting form
         │ → the rule that licenses it │ → the belief it comes from

The horizontal split is good vs bad; the vertical pairing inside each block is
claim-then-why. Measured support: **27 of the 34 ✓/✗ pairs share a left-hand side outright**,
and the other five differ only because the ✗ starts from a member of the ✓ chain.

**The `fix`/`note` column is gone, and that is the point** — the correct form plus its rule IS
the fix, so a third prose cell restating it was a fourth rendering of one claim. The errors
data had already proved the split: of three `fix` strings measured, one worked a case (the ✓
block) and two restated the rule (the → line). `note` moved to inspection, exactly as
`/errors` demoted its diagnosis in 2026-07-25. It also **simplified the strip**: `teaches` and
`guards against` were a fold and a column and are now the two → lines, so the strip is down to
two authored folds (`rests on`, `requires`) with `required by` gated on inspect.

⚠️ **The sentences come from the two POOLS** — `rules.json` and `mistakes.json`, never
errors.json. A pool entry states the belief from the inside ("The factor in front reaches only
the first term"), which is what pairs with a wrong form; the error layer's `name` labels it
from outside and reads as a category tag under a formula. Ids are shared, so `skill.errors`
resolves in the pool untouched — **but this makes the mistakes pool load-bearing for
`/skills`**, which is why the branch is not split.

Three columns, not five: the literal `2-3 good / 4-5 bad` reading was measured and does not
fit (widest ✓ is a four-term chain at ~23rem, so two sentence columns beside it leave every
column at its minimum). Laid out 2×2 the same content takes 79rem and each formula gets 33rem
instead of 24 — more than the widest chain needs, so the maths stopped scrolling. What it
costs: rules no longer align in a column of their own, which `/rules` does better anyway.

⚠️ **`.block.good`, never `.good`.** The ✓/✗ marks carry `.good`/`.bad` too, so a bare
`.good { grid-area: 2 / 2 }` also placed every *mark* at row 2 column 2 of its own `.stmt`
grid — the mark took the 497px formula track and the formula was left with the 18px mark
track. Same family as the KaTeX `.fix` collision: **a class name that is a colour is never
specific enough.**

This page is the **only** place the skill→mistake edge is visible, since mistakes must not
cite skills.

**⚠️ NOT A STUDENT PAGE (settled 2026-07-30).** Students see only the drills. That is why the
"never invent notation students meet nowhere else" rule does **not** bind here, and why a
chunking answer may be shown as `3x + 2y = (3x) + (2y)` — brackets that are redundant and
deliberately shown, the same device `rule.multiplication-binds-tighter` has always used.

**THE ROW IS TWO STACKS over one stimulus (2026-07-30).** `right[]` holds BARE forms with the
stimulus implied as the left-hand side, and the view composes `stimulus = right[i]` at render
time — so the stimulus is stored once instead of 77 times and both stacks show complete claims,
which is what makes the two columns of marks line up.

⚠️ **An empty `right[]` renders the STIMULUS ALONE, under a ✓.** It means *this form is already
finished*, which is the whole point of the field: four skills used to illustrate commutativity
(`2 + 3x = 3x + 2`) because an equation cannot say "nothing". And `paired` asks about the **bad
half only** — briefly it also required a non-empty `right[]`, which looked symmetric and left
those four rows showing a lone ✗ opposite an unmarked formula, the one thing the ✗/✓ contract
bans. **Caught by looking at a rendered row, not by any check.**

**Re-measured after the split** (Range `getBoundingClientRect`, 153 formulas, 1500px viewport):
**widest 341px** (`bracket-as-chunk`), p90 176px, p50 119px — **nothing exceeds the 33rem/528px
column**, which now carries ~190px of slack per side because composing one claim per line is
shorter than the old whole-chain illustration. Tightening to 24rem would fit everything and pull
the two stacks together; left alone deliberately, since the width is the author's taste call on
a layout already approved.

⚠️ Measure with a Range's **bounding** rect. `getClientRects()` returns one rect per span, so a
max over them measures the widest *atom* — it reported 92px for a 341px formula.

### `/mistakes` — the anti-registry (2026-07-28, MERGED 2026-07-29)

**Load-bearing**: `/skills` reads it for the sentence under every ✗, so it is no longer the
parallel experiment it was built as. `/errors` still exists and still holds the 50 instances,
28 fixes and 14 hints — see the housekeeping list in `docs/TODO.md`. The model is in
`content_model.md` rev. 12–13; what matters for the app:

**`/rules` carries the mnemonic in its RAIL**, under the name, small and italic — it is another
wording of the same sentence, so it belongs with the name rather than in the gloss column,
where it first sat and read as the opening line of an explanation. ⚠️ **No cross-language
fallback**: a mnemonic is not prose, and a German reader shown an English acronym nobody in
their classroom says is worse off than one shown nothing.

- It is **`/rules` with the sign flipped**: same four columns at the same widths, so the two
  measure identically read side by side. Two divergences — the formula column carries FALSE
  claims and so sits under a ✗ (reusing `/skills`' reserved mark track), and the page
  **sections by `topic`** where `/rules` is flat, because a student arrives at a mistake by
  topic in a way nobody arrives at a rule.
- **A second sectioning, `by rule broken`**, in `LayerPage`'s `filters` slot. No new data:
  `breaks` is the family, so the heading is the LAW plus its gloss and the rows beneath are
  the ways it gets broken. Six families and fifteen loners.
- **Ids are unchanged from `errors.json`**, so every reverse index resolves off `skill.errors`
  without a single skill being touched. That is what makes the whole thing revertible.
- ⚠️ **Known rough edge**: a mistake in two families renders twice, and both rows carry the
  real id — invalid HTML, though every resolver involved takes the first, which is the primary
  by construction. `LayerRow` needs a separate `anchor` prop so the id stops doing two jobs
  (entity address *and* page position).
- ⚠️ **`mistakes.json` IS HAND-AUTHORED (since 2026-07-31)** and `scripts/gen-mistakes.py` is
  deleted. It was a generated mirror of `errors.json` until the derivation stopped being true
  in both directions — 10 pool entries had no errors.json twin, one errors.json entry had been
  retired from the pool — and the generator had grown two escape hatches whose only job was to
  let the two files disagree. `scripts/content-ids.mjs` still shadows one of the pair, but the
  direction is REVERSED: the pool is walked and editable, **`errors.json` is the shadow**, which
  also means the in-app editor can no longer reach errors.json prose.

**`/sheets` uses the shell differently, and that is the point.** A cheat sheet is not a row —
a row is four columns of prose with one formula; a sheet is formulas under headings. So it
takes `LayerPage` + `LayerSection` and fills the panel with a formula grid instead of rows.
Two facts found by looking at it: laid out one group per full-width row it was a banner with
the page 80% empty, so groups flow into `columns: 23rem` the way a printed formulary does;
and a flow group is FLEX, not grid, because a grid track squeezes a formula to the track
width and KaTeX then breaks it mid-expression. Sizing comes from a `\displaystyle` prefix on
the latex, NOT KaTeX's display mode — display mode fixes the size but wraps every formula in
a centred block with margins that then has to be overridden back.

⚠️ **Traps this cost, all cheap to hit again:**
- **KaTeX emits its own `<span class="fix">`** — do not name a cell class `fix`.
- A KaTeX span reports `scrollWidth` **exactly 2px over its box whatever the box is**, so an
  overflow check reads as a permanent overrun and widening never clears it. Measure the
  content with an `auto` track instead.
- `align-content` on a grid defaults to **stretch**, so when a neighbouring cell is taller
  the leftover height is dealt out BETWEEN rows — ✗/✓ pairs that belong together drift apart
  by a different amount on every entry. `align-content: start`.
- **Em dashes are banned in card prose** (`scripts/content-prose.mjs`, caught by `pnpm
  sweep-layers`) — but the curated layers use them freely, because sweep-layers reads only
  the tower.

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
(`TaxonomyView`), `/errors` (`ReferenceView` — errors only), `/rules`
(`RulesView`), `/sheets` (`SheetsView`), `/tutorial`, `/drills`, **plus one route per layer of the
tower** — `/fundamentals`, `/numbers`, `/powers`, `/terms`. Those four are
**generated from the manifest** (`src/data/layers.ts`) and all render the same
component (`LayerView`, selected by a `layerId` prop), so adding a layer needs no
route. The **nav groups them** (`App.vue`): a "Fundament" dropdown over the four
layers, a "Curated" dropdown over the curated stack, **indented by a `level` on the manifest
entry and drawn with a `└`** so the dropdown shows what sits on what: All rules (the pool) →
Cheat sheets and Common mistakes on it → Skills over everything. Then Tutorial and Drills. Group headers use `-menu` keys so
they never collide with a route. Activity routes are lazy-loaded so their future weight
(CE grading) code-splits off the reference pages. **Tutorial and Drills are empty stubs.**

**Two audiences.** `Skills`, `Fundamentals` and the four **layer** pages are
*browsable catalogs* and today are **teacher/dev inspection surfaces** — they show
ids, raw JSON, `unused` coverage markers. The layer pages are the deepest of these
and are explicitly *not* student-facing (see the school-facing simplification thread
in `docs/TODO.md`). `Tutorial` and `Drills` are the (unbuilt) **student** surfaces.
Design rule for when they're built: **Tutorial *drives* Drills — one drill-runner,
two drivers** (guided `requires`-traversal vs. free pick). Don't fork the runner.

**Row system** (every reference page — see "One shell, seven pages" above): an entry is a
landscape row with a quiet strip, a name in the rail, and body cells that differ per layer.
Author plumbing — ids, raw JSON, coverage warnings, `Skills`' `drill material` fold — is gated
on `import.meta.env.DEV` via a single toggle in the page header (`src/inspect.ts`), and
**presentation is the default**, so every visit shows the page a student sees. Group, section
and layer descriptions are tap-triggered **info-dot popovers** (mobile-friendly, not hover).
`Skills` keeps its `by topic` / `by kind` switch, now as filter chips in the page header.
(The old Laws · Conventions · Errors segment switch is gone — laws/conventions became
tower cards in the 2026-07-23 bridge.)

**Design tokens** (`src/styles/tokens.css`): one quiet neutral-led palette, color
reserved for signal. This *is* the dark-mode groundwork. **Display prose for the
curated side lives in data registries**, never hardcoded in components: `skillGroups`
and `skillKinds` (slug-set validated == the kind enum, and **localized since 2026-07-29** —
their titles were the last English-only prose on the site), and since 2026-07-28 the skills
**layer head** too (`src/data/skills/layer.json` — title, blurb, note, bilingual), which
was the last page prose still living in a component. (The old `lawGroups`/
`conventionGroups`/`lawKinds` registries went with laws.json/conventions.json in the
bridge; the tower's own section/group titles live inline in each `cards.json`.)

**Mobile:** a row stacks below 820px, in DOM order, which is already the reading order; the
rail never shrinks into an unusable gutter. Mobile-*aware*, not a mobile-first pass (that's
reserved for the greenfield drill screens).

---

## Core Concepts

### Skill
One entry in the taxonomy (e.g. B4 — distributing a negative over a difference).
Each skill has:
- A set of parameterized templates for generating items
- A rule link (shown in feedback)
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
3. Link to the relevant rule (tap to expand).
4. Same item repeats before moving on.

Example:
```
You answered: SAME
─────────────────────────────
  -(a - b)  ≠  -a - b

The minus distributes and flips the sign of every term inside.
-(a - b) = -a + b

→ See rule `rule.implicit-op-before-bracket`: minus before a bracket means × (−1)
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
