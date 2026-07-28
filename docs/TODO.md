# TODO

Status legend: [ ] not started · [~] in progress · [x] done

---

## ✅ DECIDED 2026-07-28 — the two layers keep their own formulas

**The question:** the rules pool carries 66 hand-typed formulas and the tower carries its own.
How much is duplication, and should DRY apply?

**Measured** (each `rule.latex` line against the `latex` of the cards it `summarizes`,
normalised for spacing): **15 EXACT · 7 contained · 44 differ.** The 44 break down as:

| kind | n | example |
|---|---|---|
| register — `\cdot` vs juxtaposition, sides swapped | ~11 | `a^m \cdot a^n = a^{m+n}` vs `a^{m+n} = a^m \cdot a^n` |
| role — a definition against a usable form | ~10 | `\frac{a}{b} = a : b` vs `\frac{a}{b} := a \cdot b^{-1}` |
| formulation — the card states it another way | ~14 | `a^{1/n} = \sqrt[n]{a}` vs `:= \text{the unique } b>0 \text{ with}\dots` |
| warning lines the tower does not carry | 5 | `\sqrt{a+b} \neq \sqrt{a} + \sqrt{b}` |
| worked instances no card states | ~3 | `3x + 2y = (3x) + (2y)` |
| the card has no `latex` at all | 3 | `pre.variables`, `ix.coefficient-front` |

### The decision (the user's, and it settles three questions at once)

**THE FUNDAMENT MAKES NO COMPROMISES IN NOTATION.** It is the mathematics, written for the
advanced reader: `\cdot` stays explicit, `:=` stays, `a \cdot b^{-1}` stays where the inverse
is the subject. **The curated side is the pedagogical derivative**, and rewriting a formula at
student level there is not duplication — it is translation.

Three consequences, all settled:

1. **`:=` stays in the tower, never appears in `rules.json`.** The tower's job is to separate
   stipulation from claim — $a^0 := 1$ was chosen, $a^m a^n = a^{m+n}$ was proved, and the
   three-species-of-convention story is unreadable without the mark. In the pool the same
   statement is being USED, not established, so `=` is right there.
2. **No smoothing of the tower toward school notation.** An earlier proposal to adopt
   juxtaposition wherever `ix.juxtaposition` licenses it is REJECTED: it would make notation
   position-dependent with nothing validating it, and it trades away exactly what makes the
   tower worth diving into.
3. **No reference mechanism in `rules.json`** (`latex` stays a string array, never a card id).
   Three objections stand: it could only address a whole card, not one formula, so it would
   first need `latex: string[]` on all 101 cards; "use the card's when possible" is a
   judgement made 66 times and would be made inconsistently; and it would let a tower edit
   silently reshape a sheet a class is looking at.

⚠️ **And it kills the drift audit** that was proposed alongside it. If the layers are
independent BY DESIGN, a pair that matches today and stops matching tomorrow is the
translation improving, not a defect. Do not add a line reporting it — it would be noise.
`summarizes` remains the link between them, and its job is the coverage question (which cards
have a student-facing form), not string comparison.

**The incentive that was the strongest argument for coupling survives without it.** Coupling
would have forced the tower's notation to stay good because a sheet depended on it. But the
fundament is open to the students who want to dive deeper, and they are the same pressure —
applied to its prose and its derivations rather than to its notation.

---

## ✅ DONE 2026-07-28 — /skills onto the shell, and the last hardcoded page prose

**Every reference page is now one application.** `/skills` was the last card grid; the four
cells are `name | illustration | rationale | the mistakes it heads off`, and the fourth is
the mirror of `/rules`' `prevents` — this page is the ONLY place the skill→error edge is
visible, since errors must not cite skills.

**The two things the handover flagged, both settled:**

1. **Skills now has a layer head** — `src/data/skills/layer.json`, joined by
   `parseSkillTree(files, head)`. A layer split across four kind files has nowhere else to
   keep its title, blurb and note, and until this existed `/skills` was the one page whose
   lede was hardcoded view prose, and so **the one page that could not be read in German**.
2. **The `by group` / `by kind` switch survives**, as filter chips in `LayerPage`'s `filters`
   slot — the same place and the same control as the tower's. What makes it cheap is that
   **the strip carries the COMPLEMENTARY coordinate**: under a topic heading it says which
   strategy, under a strategy heading which topic. The row never repeats its own heading and
   never loses the other half. (Labels are `topic` / `kind`, since "group" is a data word.)

**The drill freeze was respected without losing anything.** All 74 skills carry an
`illustration`, so the maths column is uniform without reading `drills/*.json` at all; the
drill's own material — equivalents chain, classification examples, chunk decompositions,
pitfalls — sits behind an inspection-only `drill material` fold as a full-width block, where
it can be reshaped freely. **The row's geometry depends on none of it.**

**Four folds, not three**, and the fourth is derived: `rests on` · `teaches` · `requires` ·
`required by`. The last is `requires` read backwards and is the ONLY justification a
recognition skill has — failing to recognise a shape produces no wrong answer, only inaction.

**The audit's two red skills are labelled, not fixed.** `contrast = no errors AND nothing
requires it` resolves to exactly the two `auditCoverage` names
(`equivalence.bracket-types`, `equivalence.addition-commutative`), so the page and the load
log read the same thing — but the chip says **`2 pure contrast`** in the neutral band, not a
warn-coloured count of work outstanding, because those two exist so a Same-or-Different
session has items whose answer is *same*.

**Measured, not guessed:** exactly ONE of the 74 illustrations exceeds 352px rendered
(`equivalence.product-with-brackets`, 363) and the next is 258, so the maths column is 23rem
and 24 would buy nothing. The rail is 14rem rather than the shared 11 — a skill's name is a
phrase with a clause in it ("Sum of products — multiplication is inside the terms"), and at
11rem the longest took five lines beside a two-line illustration.

⚠️ Measure a KaTeX column with a `max-content` range over `.katex-html`, never `scrollWidth`
— see the trap list in `docs/app_design.md`.

### Still open on this page
- **Skill `name` and `note` are English-only** in all four kind files (`localizedString`
  accepts a bare string, so they load as `{en}` and German falls back). The head, the fold
  labels and the cell labels are bilingual; the content is not. Same debt as the 57 rules.
- **Section titles come from the group/kind nodes and are plain `string`, not localized** —
  a data-shape change across four files, deliberately not bundled into the port.
- **Presentation mode for skills** is still not a separate thing: the page is the same in
  both modes bar the plumbing. Whether a student-facing skills page is a *progress* surface
  (drill-blocked) or just a how-to (not blocked) is still the open question below.

### The curated side is now four layers, not three
`docs/content_model.md` rev. 11 has the model; `/` draws it. The short version:

    rules            the pool of student-facing DO/IS sentences (57)
    ├── sheets       presentation over the pool: which rules, grouped how (6)
    └── errors       the mistakes, each citing the rule it breaks (28)
        └── skills   the interventions, citing errors, rules and cards (74)

### Open, in rough order
1. **A seventh sheet, or not.** The coverage question (`summarizes`) says what is left:
   `fundamentals` 33 of 48 uncovered and `numbers` 10 of 12, but those are the equality and
   order axioms, completeness and the construction of ℕ — the tower's ARGUMENT, not a
   student's toolkit. ⚠️ Those numbers **should stay high**. A rules layer that covered them
   would be the parallel tower this design exists to avoid.
2. **German prose** across 57 rules, 6 sheets and the rewritten fixes is authored and
   unreviewed by a native reader. The largest single debt in the content.
3. **`note` on an error** is still an open question — the author's diagnosis, displaced from
   the fourth column by the rule, alive only in the json fold. Several were pure restatements
   of their own `fix`. Decide whether it earns a field.
4. **Two errors reject their derived rule on purpose**, so the audit line "rules an error's
   cards reach but it does not cite" reports them forever and gets noisier as the pool grows.
   It is a QUESTION, never a check. Do not promote it to a validator.
5. **The tutorial will collide with `/sheets`** if it is built to hold content. It was
   conceived as a drill DRIVER; the sheets are the reference it should walk, not duplicate.

### Authoring rules earned the hard way
- **A fix WORKS A CASE**; the rule states the law, one column over. Where the rule itself
  quotes a case, the fix works a different one.
- **A numeric check is the best fix** for a misreading — except where the two forms are equal
  in value (`mis.adjacent-signs`), where substituting proves nothing.
- **No words inside `latex`** — it is not localized.
- **Membership of a sheet is teaching experience, not a derivable test.** The pool carries the
  family names a teacher names ("the power laws"); everything else about grouping is
  presentation and lives on the sheet.
- ⚠️ **`\;` in a JavaScript single-quoted string loses its backslash.** An authoring script
  shipped `ab = 0 ;\Longrightarrow;` and KaTeX compiled it happily, because semicolons are
  valid LaTeX. Use raw strings; the compile check cannot catch this class.

**It must be aesthetically pleasing.** This is the actual requirement, not a finishing touch:
nobody reads these pages unless the design draws them in.

**TASTE CALIBRATION — do not re-run these experiments.** Each was tried and rejected:
- **Pills/chips for reference links are too loud.** Plain middot-separated text inside a fold
  instead (`RefFold`).
- **Small caps on headings** read as shouting; size and weight carry the levels.
- **Whitespace alone as a group separator** reads as an accident. A tinted band works; a rule
  does not, because hairlines already mean "next row".
- **Anything grey inside a panel** risks reading as a hole punched through to the page. Check
  it against `--band`.
- **A general rule restated in a `fix`** is noise beside the ✗/✓ that already shows it.
- **A cheat sheet is not a row**, and one group per full-width row is a banner. Groups flow
  into columns, as a printed formulary does.
- The author reads a lot of LaTeX and will notice a serif that is not Computer Modern.
  `--font-content` is Latin Modern; do not substitute a system stack.

Constraints to carry: keep `overflow-x: auto` plus vertical padding on every display-math
container; the identity rail must **stack** below the breakpoint, never shrink; every cell
keeps its column even when empty; and a rule with no formula falls back to its SENTENCE on a
sheet, because contributing zero cells makes it vanish silently.

**The drill layer is a separate question** and stays frozen — see below.

---

## ✅ DONE 2026-07-28 — the rules pool, the sheets, and the DAG

**The rename is done**: "Reading rules" → **All rules**, ids `meta.` → `rule.`, and the nav
shows the stack by `level` with a `└` rather than a flat list.

**`latex` on a rule** turned `/rules` into a formulary: the formulas had been trapped inside
prose, and a student hunting "the one about exponents" scans formulas, not 57 sentences. 53
of 57 carry one. It also found the sentences that were two claims wearing one coat —
`rule.exponent-arithmetic` split into `same-base` and `power-of-power`.

**Six cheat sheets** (`cheatsheets.json`, `/sheets`): zero and one · reading a term · the
minus · fractions · powers · binomials. Built from the coverage question, which turned up
real gaps — `th.minus-times-minus` had NO RULE, the most-recited rule in school algebra, and
neither had `th.zero-product`, the entire basis of solving by factoring. *Reading a term*
cost one entry and no new content: all fifteen rules already existed, scattered.

**The overview diagram was redrawn** for the four-level stack; the old one had errors and
rules as siblings, which stopped being true when an error first cited a rule.

---

## ✅ DONE 2026-07-27 — the row shell, and the rules registry

Eleven commits on `feat/curated-row-shell`. Two threads that turned out to be one.

**The shell** (`src/components/Layer{Page,Section,Row}.vue` + `RefFold.vue`, extracted from
`LayerView`): measures and header on the page, one panel per section, and a row whose BODY
IS A SLOT — a statement, a ✗/✓ table and a sentence have nothing in common but their
container. `cols` is a prop, so each layer's column arithmetic lives in its own stylesheet.
`LayerSection.title` is optional, for the flat case. Prose clipping moved to `src/prose.ts`.
**The gate is DEV**: `?inspect` is gone, one toggle in the page header serves all layers,
and presentation is the default so the student view cannot rot unseen.

**`/errors`** took the tower's 91rem, panels, strip, rail and prose cell. The ✗/✓ stem is
now a table STUB — a fixed 7rem track with a continuous rule painted as a gradient on the
grid (a per-cell border breaks at every row-gap and reads as dashed) — which also aligns
the ✗ column page-wide, including on the four entries that have no stem.

**The rules registry** (`rules.json`, was `metapatterns.json`). The finding that started it:
every entry's `name` was already a complete rule, so `name`→`rule`, gloss `rule`→`note`,
new `kind: is|do`, ids `meta.*`→`rule.*`, route `/rules`. The model is the user's: **a flat
collection of sentences whose natural home is the errors and skills that show them with
examples; the list exists only so one sentence is not written into twenty entries.** It
carries no context of its own, so `/rules` is built almost entirely out of reverse indexes.
- **`error.rules` is authored** (28/28), replacing a derivation through `corrupts` ×
  `summarizes` that guessed on five of nineteen and capped at two. The derivation survives
  as an audit question.
- **`summarizes` is kept and demoted** to a bridge claim: this sentence is the plain-language
  form of those cards. It points into another tower, so it cannot cycle.
- **16 → 25 sentences, 15:1 → 18:7 IS/DO.** The nine added are the positive form of the
  anti-laws, whose general statement was a LAW in the tower and had never been said in a
  student's words. That the DO side looked empty was a measurement, not an accident.
- **14 fixes rewritten as worked cases**, usually a numeric check the student can run —
  except where the two forms are equal in value (`mis.adjacent-signs`), where substituting
  proves nothing and the mistake is the notation itself.
- **The DAG is settled**: `skills → {errors, rules, cards}`, `errors → {rules, cards}`,
  `rules → cards`. **Errors must NOT cite skills** — skills cite errors, so it would close a
  cycle, and error→skill navigation is a free reverse index of `skill.errors`.
- Three fat rule paragraphs gave their argument back to the tower
  (`th.negative-one-times`, `pre.variables`, `ax.distributivity`).

---

## Removed 2026-07-26 — the in-app prose editor

**Do not rebuild it without asking.** Built 2026-07-25, removed the next day: the `source`
deep link plus VS Code side by side on a desktop monitor turned out to be enough, and with
one author for the foreseeable future the write path was machinery earning nothing.

Restore from **`62ea8d2`** (`merge: edit card prose in place`) if that judgement changes;
`git show 62ea8d2` has the whole thing. What was deleted: `src/components/ProseEditor.vue`,
`scripts/content-write.mjs`, and the `/__content/fields` + `/__content/write` routes.

**Kept, because they pay for themselves independently:** canonical JSON
(`pnpm format-content`), global id uniqueness (`pnpm check-ids`), the shared prose rules
(`scripts/content-prose.mjs`), the id resolver and the `source` button. See
`docs/app_design.md` → "Authoring tooling".

If the editor ever comes back, the two gaps it never closed were: sections and groups are not
addressable (they carry `slug`, not `id` — prefer giving them ids over teaching the resolver a
second address form), and `instances[].hint` needs an index in the field path.

---

## Superseded — the editor's layout and unreachable fields (2026-07-25)

The card editor is **built** (see "DONE — the card editor" below, and
`docs/app_design.md` → "Authoring tooling" for the architecture). Two threads left, in
this order:

**1. Layout — brainstorm before touching CSS.** The panel currently opens *inside* the
card, so it inherits the card's width: a 300px grid column, which is far too narrow for
two languages of a paragraph-length `note`. Options named so far: a popup/modal, or
abandoning the card grid for a **horizontal layout** while editing. The user has already
flagged the risk that this turns into many CSS fine-tuning loops — so decide the shape
first, in prose, and only then write styles. Worth weighing: the editor's *value* is that
the card is visible in its place in the layer, and a modal that covers the page gives that
away, which is the thing VS Code already fails at.

**2. The prose fields the editor still cannot reach.** Not design choices, just gaps:
- **sections and groups** — their `title`, `blurb` and `note` are localized prose, but a
  section/group carries `slug`, not `id`, so the shape-blind entity walk in
  `scripts/content-ids.mjs` never finds them. Fixing means either giving them ids (they
  would enter the global id namespace, and `pnpm check-ids` would then guard them) or
  teaching the resolver a second address form. Prefer the first: one identity model.
- **`instances[].hint`** on an error — localized prose nested in an array under the entity,
  so it needs a sub-selector (`instances.3.hint`) rather than a flat field name. The
  allowlist and the write path already take dotted paths; what is missing is an index.

Deliberately still OUT of scope, and not a gap: ids, `basedOn`/`derivedFrom`/`corrupts`/
`restsOn`, card order, adding or deleting cards, and the `latex` fields. Those stay VS Code
work, which is what the `source` button is the handoff for.

---

## ✅ DONE 2026-07-25 — the card editor

Built in four merges, each resting on the one before:

1. **`chore: one canonical form for the content JSON`** — `serializeContent` in
   `scripts/content-format.mjs` is the single serializer every writer goes through, plus
   the normalizing commit (whitespace only, proved a no-op three ways). Without this, every
   save would have reformatted a whole file and buried the actual edit in diff churn.
2. **`chore: enforce globally unique entity ids`** — `pnpm check-ids`. Ids were unique
   across all 23 content files as a measured fact; the editor addresses entities by bare id,
   so it became an enforced invariant *before* anything depended on it.
3. **`feat: open a card's source from the page`** — the read-only half. Permanent, not a
   stepping stone: it is the handoff for every edit the prose editor deliberately won't do.
4. **`feat: edit card prose in place`** — en/de textareas with live KaTeX preview, on every
   entity in all seven layers.

The brainstorm that chose this shape rejected Firestore and IndexedDB (they buy multi-user
writes nobody needs, and cost git history, load-time validation, and Claude Code's ability
to read the content), and dropped `jsonc-parser` once it turned out the hand-tuned JSON
layout it would have protected was Claude's from earlier sessions, not the author's.

---

## Superseded — the card-editor brief (2026-07-25, kept for the reasoning)

**The user's problem, in their words:** editing cards in VS Code is too hard, because
**context gets lost** — the cards above and below, and the page as a whole, are not
visible while you edit one card's JSON. Start the session by discussing this; no design
has been chosen.

**Read that carefully before proposing anything.** The ask is *context while editing*, not
*better JSON tooling*. That distinction kills the obvious cheap answer: the parked
"JSON Schema for IDE authoring" item (further down, `z.toJSONSchema` + `.vscode/settings.json`)
gives autocomplete and inline validation and would **not** help at all, because the missing
thing is the neighbours, not the field names. Worth naming that explicitly so it is not
proposed as the fix.

**What the app already has that is half an editor:**
- `LayerView` renders the whole tree in page order, so the *context view already exists* —
  the question is whether editing can happen inside it.
- Inspection mode already discloses each card's **raw JSON** per card (`json` toggle), and
  `/errors` + `/metapatterns` now have the same presentation/inspection switch
  (`src/inspect.ts`, presentation default, toggle gated on dev or `?inspect`).
- The **manifest unification landed this session**, so an editor could be layer-generic
  from day one rather than fundament-only — all seven layers are one list with a `family`.

**Facts the design has to respect:**
- 101 cards over 4 files, tree `layer → sections[] → groups[] → cards[]`, **page order =
  array order at every level** — so "move a card" is an array splice, and reordering is a
  first-class edit, not an afterthought.
- Card fields: `id · concerns[] · symbol · type · name · latex · avoid · prefer · forall ·
  cond · basedOn[] · derivation · derivedFrom[] · note · intuition` (`src/data/layers.ts`).
  `name/note/intuition` are bilingual `{en,de}`; several fields are **LaTeX**, and prose
  carries inline `$…$` (the RichText contract).
- Cross-layer `basedOn`/`derivedFrom` refs resolve tower-wide, so an id rename is a
  multi-file edit — an editor that can rename safely is worth more than one that cannot.
- Everything must keep passing: `layers.ts` load validation, `pnpm sweep-layers`,
  `npx vite-node src/data/index.ts`.

**The open question to actually brainstorm — where do the edits go?** The app is a static
Vite site with no backend, so persistence is the crux, and the honest options differ a lot
in cost:
  (a) a **dev-only Vite plugin** with a tiny write endpoint → real files on disk, works
      only under `pnpm dev`, which is where authoring happens anyway;
  (b) the **File System Access API** → the browser writes the JSON directly, no server,
      Chromium-only;
  (c) **edit in the page, export a patch** to paste back — no write path at all, cheapest,
      worst ergonomics;
  (d) not an in-app editor at all — e.g. a **split-view preview** beside VS Code.
Also open: whole-card form vs inline field editing, live KaTeX preview, and whether the
same editor should serve the curated layers (errors already has a much richer shape:
sections, instances with `from/wrong/right/hint`, `fix`, `frequency`).

---

## 🧊 FROZEN — the DRILL layer (2026-07-25)

**Do not start drill work.** The user is planning a substantial revision of the drill
layer, so anything that authors, reshapes, or builds on `src/data/drills/*.json` waits
for that. Frozen: the *Exercise generators* section, *Drill / session + progression*,
the undefined `chunking` drill format, Compute-Engine drill checks in `pnpm validate`,
`_parked-priority.json`, Tier-3 endpoint grading and MathLive input, and the
`frequency` → drill-emphasis idea recorded under "Errors as evidence" below.

Also frozen by dependency: **presentation mode for the skills page** — a skill stripped
to student view is really a *progress* surface, and that needs the drill runtime.
⚠️ **Narrowed 2026-07-28.** The shell port went ahead and reads no drill data at all: the
maths column is the skill's own `illustration` (all 74 carry one), and the drill material
sits behind an inspection-only fold. What is still frozen is a *progress* surface; a
*how-to* surface needed no runtime, which is what `/skills` now is.

**Not affected**, since they touch only the tower / errors / skills / metapattern layers:
the manifest unification, the metapatterns presentation pass, the school-facing
simplification of the fundament, the ℝ layer, the `numbers`-layer gaps (decimals,
divisibility, primes), German prose, and the residue of the coverage triage
(`mis.letters-differ` needs a skill; 14/74 skills still have no `restsOn`).

⚠️ The two drill pitfalls added 2026-07-25 (`divide-by-one`, `same-value-different-structure`)
need **no unwinding**: the skills carry the matching `errors` refs independently, and the
coverage audit seeds on `errors` OR a drill pitfall — so those skills stay justified
however the drill layer is rebuilt.

---

## ✅ DONE 2026-07-25 — WrongRight + the errors page as the student page

`/errors` **is** the student-facing mistakes page (no separate `/mistakes` route — the
nav's **Curated** group was always the student layer). One body of content, two modes.

**Data.** `errors.json` is now a containment tree — `sections[] → groups[] → errors[]`,
the same shape as a fundament layer, page order = array order. **Sections are TOPICS**,
authored, six of them (`minus` · `reading` · `distributing` · `powers` · `fractions` ·
`terms`), matching `docs/common_mistakes.md`'s A–F families so doc and app share one
taxonomy. ⚠️ **Topic is NOT derivable from `corrupts`** — this was tried and rejected:
the tower's sections are organised by *kind of statement*, so `anti.linearity` (the most-
cited algebra error) resolves to "Axioms · Bridge axioms", and `anti.repetition-confusion`
corrupts cards in two different layers. `kind` (anti-law/misreading/salience) **cross-cuts**
topic — the `minus` topic holds three misreadings and an anti-law — so it stays a *field*,
shown in inspection only. `topic` is positional, injected by `parseErrorTree`.

**Instances reshaped** `string[]` → `{ from?, wrong, right?, hint? }[]`. `wrong` is always
a *false claim*; `from`/`right` is the shorthand for the common case where that claim is an
equation with a shared stem, so the two candidates stack against an invariant background
(variation theory: pair only what shares a stem). Three shapes fall out: **rewrite**
(from+wrong+right), **dead end** (from+wrong+hint — "no rule applies" / "already finished",
which is `anti.conjoining`'s entire content), **belief** (a `\neq` claim + hint, for the four
errors where nothing was transformed). All 25 errors now carry instances (was 17/25) and
`frequency` 1–3 (the catalog's ★). Load-time validator: **every instance needs `right` or
`hint`** — a ✗ is never shown without its ✓.

**Component.** `src/components/WrongRight.vue`, props `from?/wrong/right?/hint?/relation`.
`relation="style"` is the card `avoid`/`prefer` case, where the two sides **are equal** —
so they are joined by a literal `=` and the marks go muted. Same red ✗ for "false" and for
"clumsy but correct" would teach ✗ = wrong and then contradict it. `LayerView` now uses it.

**Layout, revised 2026-07-25 after looking at the rendered page.** Three fixes, all
structural rather than cosmetic:
- **One shared grid per entry.** `WrongRight` renders `display: contents` grid *cells*
  into a `.wr-rows` parent (`grid-template-columns: auto auto minmax(0,1fr)`), so stem /
  ✗ / ✓ are real COLUMNS across every instance on a card. Per-instance grids put the
  marks at a different x for each stem width and the block read as scattered — the
  invariant background is the whole point of the contrast.
- **One row per instance; `hint` on its own row.** It used to trail the ✓ inline (and
  without a space: `✓ −(b−a)reversing a subtraction…`). Where there is no `right` — a
  dead end or a belief — the hint moves *up* into the ✓ column, so that column always
  holds the correction whether formula or prose.
- **Landscape rows, not a mosaic.** Three narrow bordered cards broke the math (which
  does not reflow) and 25 boxes competed with each other. Now: name + note in a left
  rail, the ✗/✓ table in the wide right column, entries separated by a hairline. Links
  are their own grid cell so that on a phone (single column, DOM order) the pairs reach
  the reader before the links. Meta-pattern links capped at 2 — the two-hop is generous
  and the names are sentence-length, so uncapped they were the loudest thing on the page.
- `relation="style"` glues the `=` to the form it introduces, so a wrap leaves it leading
  the second line instead of dangling off the end of the first.

**Second pass, same day.** Two more from looking at it:
- **One geometry down the page.** Track minimums on `.wr-rows`
  (`minmax(4.5rem,auto) minmax(7rem,auto) auto` + `justify-content: start`) put ✗ at a
  single x for all 25 entries and ✓ at three near-identical ones. The cause of the drift
  was a prose `hint` in the ✓ column: as an `auto` track it took the sentence's full
  max-content width (670px on some entries, 250px on others), so the ✓ jumped as you
  scrolled. `.hint` is now `max-width: 22rem` and wraps.
- **The refs were noise.** Bare grey text after grey prose reads as more prose. They are
  now the tower's own `rests on` vocabulary — small-caps label (`breaks` / `read`,
  localized) plus pills — spanning the full entry width so sentence-long names sit on one
  line. **And each chip deep-links to the card it names**: `LayerView` cards carry
  `:id="c.id"`, the router's `scrollBehavior` resolves the hash, and the landed-on card
  gets a `.targeted` highlight. Three traps, all of which fail silently: the layer views
  are lazily loaded so the element does not exist when `scrollBehavior` first runs; card
  ids are dotted so a selector string needs `CSS.escape` — **and vue-router then refuses
  the escaped `#…` string and requires an Element**; and `:target` does not update on a
  pushState navigation, so a CSS-only highlight never fires (hence the route-driven class).

**Mode.** `src/inspect.ts` — **presentation is the DEFAULT**; `inspect` is opt-in and its
toggle only renders in dev or with `?inspect`, so a build shows students the page and
nothing else. The author is in this app far more than any student, so defaulting to
inspection would let the student view rot unseen.

**Also:** `src/data/layers.json` **deleted** (its title/blurb moved to the head of the
errors tree) — its `layers` export collided by name with the tower manifest in
`src/data/layers.ts`. `layers` now means the tower and only the tower.

**Third pass — `fix` vs `note` (2026-07-25).** The notes were written when `/errors` was
the tower's shadow, addressed to the author, and they stayed that way on a student page:
*"Every minus treated as binary subtraction; a unary minus dropped"* uses two words no
15-year-old knows. New division of labour: **`name` says WHICH mistake, `fix` says HOW TO
GET IT RIGHT** ("Two minuses make a plus: $-(-3) = 3$"), authored for all 25, bilingual,
required by the schema. **`note` is untouched** and demoted to inspection — it is the
*diagnosis* (mechanism, cause, why the entry exists in the taxonomy), which is exactly
what makes an entry useful to a teacher; rewriting it in place would have deleted the
better material. Authoring rule where the two could collide: the meta-pattern chip carries
the GENERAL decoding rule, `fix` the CONCRETE one for this mistake (and 8 of 25 errors
reach no meta-pattern at all, so `fix` is not redundant with them).

**Fourth pass — the names (2026-07-25).** All 25 rewritten student-facing and bilingual:
they now name the mistake **as the student made it**, not as the literature classifies it.
"Linearity illusion" → *Spreading an operation over a plus*; "Precedence ignored" →
*Calculated left to right*; "The two repetitions confused" → *Squaring and doubling mixed
up*; "Conjoining / closure compulsion" → *Forcing unlike terms together*.

**Replaced in place, no second field** — unlike the `note`/`fix` split, where the diagnosis
was rich prose worth preserving. A name is only a label, and the technical handle survives
in two places already: the **id** (`anti.linearity`, `sal.loudest-op-wins`) and the
inspection-only `note`. `TaxonomyView` renders errors as `id · name`, so the id is beside
the name there too. The one term that lived *only* in a name — "closure compulsion" — was
moved into `anti.conjoining`'s note rather than dropped.
- [ ] ⚠️ **UNVERIFIED**: `.refv` max-width 1100px → 900px, the one-line attempt at "the
  pairs drift right on a wide screen" (the rail is a fixed 21rem, so past ~1200px each
  entry showed a wide empty gutter right of the ✓ column and the hairline ran well past
  the content). Not looked at in a browser — the user is checking. If it still drifts, try
  `minmax(0, max-content)` on the pairs column next.

## Errors as evidence, skills as intervention (2026-07-25)

The dependency inverted during this work: **errors now inform which skills exist**, not the
other way round. That is the right order — you only drill what students get wrong — but it
is an *epistemic* order, not a merger. Skills are not the other face of the error coin:

- **The coin-ness varies by tier.** At Tier 3 they nearly coincide
  (`transformation.combine-fractions` ↔ `anti.fraction-addition`), which is why seeding
  Tier 3 from the mistake catalog worked. At Tier 1 they diverge, because fluency fails
  *silently*. Measured: **every `anti-law` is cited by a Tier-1 or Tier-3 skill and none by
  Tier 2; every uncited error is a `misreading`**; anti-laws average 2.3 instances and
  ★2.6, misreadings 1.5 and ★1.8. The kinds already encode the gradient.
- **Errors cannot supply ordering.** `frequency` says what to prioritise, `requires` says
  what must be automatic first. 7 skills are justified *only* as prerequisites.
- **Errors cannot supply decomposition.** One error threads three tiers
  (`docs/common_mistakes.md` mapping table); that one-to-many map is the pedagogical
  content.
- **An error is not drillable.** Drill material is keyed per skill; you drill a capability
  and *detect* an error.

**Consequence for the parked `priority`** (`drills/_parked-priority.json`): emphasis should
derive from the `frequency` of the errors a skill guards, ordering from the `requires` DAG.
Empirically grounded, and it only became available once errors carried frequency.

**Bidirectional audit added** to `auditCoverage` (both lines are questions, never throws):
- *Errors no skill drills* — frequency-ranked, currently **9**, three of them ★★.
- *Skills no error reaches* — seeded from skills naming an error (directly or via a drill
  pitfall's `explainedBy`), closed downward over `requires`. Currently **16/71**.

⚠️ **The gaps are not one problem, they are four, with opposite repairs:**

1. [x] ~~**Wire it** — the error exists, the skill just doesn't cite it.~~ **DONE
   2026-07-25**, and it was most of the gap: **undrilled errors 9 → 1, unreached skills
   16 → 13**, purely by adding `errors` refs to skills whose content already covered them.
   No new data, no new fields. The ten edges:
   `mis.adjacent-signs` → `subtraction-as-adding-opposite` + `double-negative` ·
   `mis.root-scope` → `root-of-a-sum` + `fractional-exponent-root` ·
   `mis.invisible-one-lost` → `transformation.collect-like-terms` ·
   `mis.subtraction-as-times-negative` → `subtraction-as-adding-opposite` ·
   `mis.redundant-brackets-kept` → `redundant-brackets` ·
   `mis.linear-slash-overgrouped` → `fraction-bar-grouping` (the twin of
   `-grouping-lost`) · `mis.bar-not-division` → `division-variants` +
   `fraction-as-reciprocal-product` · `mis.order-blindness` →
   `multiplication-commutative`.
   ⚠️ **That last one corrects the claim below**: `equivalence.multiplication-commutative`
   DOES own an error — `a \cdot 3` not recognised as `3a` is a commutativity failure. Only
   `addition-commutative` is a pure contrast skill.
2. [x] ~~**Author the error** — the exponent-extension skills.~~ **DONE 2026-07-25**,
   **unreached skills 13 → 10**, and it confirmed the user's pushback: here fine-graining
   the error layer DOES make it 1:1. Two errors authored, tower now cited by **27** errors:
   - **`anti.zero-exponent`** ★ (catalog D5) — `x^0` ✗ `0` ✓ `1`, `x^1` ✗ `1` ✓ `x`;
     corrupts `def.pow-zero`, `def.pow`. Kind `anti-law`: nothing is misparsed, a wrong
     *rule* is applied, and it is generative ($5^0$, $x^0$, $(a+b)^0$ all come out `0`).
   - **`mis.negative-exponent-negates`** ★★ (catalog D4) — `x^{-1}` ✗ `-x` ✓ `1/x`;
     corrupts `def.pow-neg`, `th.inverse-is-power`. Kind `misreading`: the minus is read as
     attaching to the *value* rather than the exponent — `mis.minus-roles-confused` one
     floor up, in the exponent.
   - Neither was invented: both skills' own notes already said "not $0$" and "not a
     negative number". `negative-fractional-exponent` needed **no third error** — it cites
     the new misreading (the minus half) plus `mis.root-scope` (the root half).
   - The kind split also matches the measured gradient: the false *rule* is an anti-law,
     the misread *glyph* is a misreading.
3. [~] **Missing edge — and mostly BLOCKED ON MISSING TIER-3 SKILLS** (investigated
   2026-07-25). Two conclusions:
   - ✅ **The trigger mechanism needs no new field.** `transformation.factor-common`
     already requires `classification.common-factor`, which is why that is the one shape
     the audit reaches. Plain `requires` IS the Tier-2→Tier-3 trigger; **do not
     reintroduce `gateway` or a typed edge** (closes that open question in the Tier-3
     section below).
   - ❌ **Four shapes have nothing to be required BY.** The factoring group holds exactly
     one skill. Each remaining shape needs a Tier-3 skill that does not exist:
     `difference-of-squares` → `transformation.factor-difference-of-squares`;
     `perfect-square-trinomial` → `transformation.factor-perfect-square`;
     `quadratic-form` → `transformation.factor-quadratic`. And **two of the six are
     chained, not orphaned** — `classification.difference` is already required by
     `difference-of-squares`, and `linear-form` by `quadratic-form`, so fixing the head of
     each chain resolves them for free. **Three missing skills, not six missing edges.**
   - Not faked: `expand-binomial-square` does NOT require `perfect-square-trinomial` —
     expanding $(a+b)^2$ reads a bracket-power, while recognising $a^2+2ab+b^2$ is the
     *factoring* side. Pointing the edge there would invert the dependency.
   - [x] ~~`chunking.chunks-in-product`~~ **DONE**: added to `transformation.factor-common`
     and `-cancel-common-factor` as an ordinary prerequisite (you must read a term's
     factors before pulling one out). **Unreached 10 → 9.**
   - [x] ~~**Author the three Tier-3 factoring skills.**~~ **DONE 2026-07-25**, skills
     **71 → 74**, unreached **9 → 7**. The `factoring` group is no longer a group of one:
     `transformation.factor-difference-of-squares` (restsOn `th.difference-of-squares`),
     `-factor-perfect-square` (`th.binomial-square` + `th.square-of-difference`),
     `-factor-quadratic` (`ax.distributivity` + `th.collect-like-terms`). Each requires its
     recognition shape, which is what closed the chain: `difference-of-squares`,
     `classification.difference` and `perfect-square-trinomial` all went green.
   - [x] ~~**BLOCKED**: `factor-quadratic` had no error, so `quadratic-form` +
     `linear-form` stayed red behind it.~~ **RESOLVED 2026-07-25** by a **7th topic
     section, `factoring`** (placed last — it depends on everything above it) holding
     **`anti.quadratic-pair-unchecked`** ★★: $x^2+5x+6$ ✗ $(x+5)(x+6)$ ✓ $(x+2)(x+3)$
     (numbers copied out of the term) and $x^2+7x+12$ ✗ $(x+2)(x+5)$ ✓ $(x+3)(x+4)$ (only
     the sum checked — $2+5=7$ but $2 \cdot 5 \ne 12$). Corrupts `ax.distributivity` +
     `th.collect-like-terms`, because the two conditions are not a recipe: expanding
     $(x+m)(x+n)$ *produces* $x^2+(m+n)x+mn$, so the middle coefficient IS a collected sum
     and the constant IS a product. **Unreached 7 → 4.**
     ⚠️ Two honest caveats, both recorded in `docs/common_mistakes.md` too: the new topic
     has **no counterpart in the catalog**, and this error's **★★ is teacher judgement, not
     a source count** — the only entry for which that is true. The catalog's sources were
     about *reading and judging* expressions, so they record no factoring errors at all.
     The general lesson stands: **the error layer is thin exactly where Tier 3 is, because
     the evidence base was collected for a different question.**

   **Why an error cannot rescue these** (worth keeping — it is the general rule): failing
   to recognise a shape produces **no wrong answer**, only inaction. The student does not
   write a false form, they leave the term unfactored. So recognition skills are justified
   **downstream** by what they enable, never **upstream** by what they prevent — which is
   why the audit's downward `requires` closure is the right test for them, and why its
   failure here is a TRUE signal that Tier 3 is underbuilt rather than a wiring artifact.
   Same conclusion `docs/common_mistakes.md` reached: *"Tier 3: build, don't cut."*
4. [x] **Contrast skills — worked 2026-07-25, and the "distractor-free by decision" call
   was HALF wrong.** Two of the four did have a tempting wrong form after all, and an
   existing error already explained it, so both got a drill pitfall + the matching
   `errors` ref (`explainedBy` is validated ⊆ the skill's `errors`). **Unreached 4 → 2.**
   - `divide-by-one`: pitfall `\frac{1}{a}` ← `anti.commute-everything`. Reading $a/1$ as
     the reciprocal is an exact instance of $a/b = b/a$.
   - `same-value-different-structure`: pitfall `(x-1)^2` ← `anti.linearity`. "Factoring"
     $x^2-1$ as $(x-1)^2$ is the freshman's dream mirrored — $a^2-b^2=(a-b)^2$ is the same
     false identity as $(a+b)^2=a^2+b^2$, which is why
     `transformation.factor-difference-of-squares` cites it too.

- [ ] ⚠️ **THE FLOOR: 2 skills, 1 error — and they should probably stay.** The audit will
  never read 0/0, and that is correct rather than a backlog:
  - `equivalence.bracket-types` and `equivalence.addition-commutative` have **no tempting
    wrong form at all**. No student believes $a+b \ne b+a$ or that $[a+b]$ groups
    differently from $(a+b)$. Note these are **exactly the two** `docs/common_mistakes.md`
    named as cut candidates ("notation-trivia / the two commutativity-holds skills") — the
    audit and the pruning rubric converged independently, which is some evidence both are
    reading something real.
  - **But there is a drill-design reason to KEEP them that the error layer can never
    express**: a Same-or-Different session needs items whose answer is *same*. A drill set
    made only of distractor-bearing skills trains students to answer "different" by
    reflex. Pure-positive skills are the control items. So: keep, and read the red line as
    "these are the contrast set", not as work outstanding.
  - `mis.letters-differ` still has no skill (a letter read as a word/unit). Its positive
    form is `meta.variable-is-a-fixed-number`. Needs a skill or a decision. `addition-commutative`,
   `divide-by-one`, `bracket-types`, `same-value-different-structure` exist to make the
   *wrong* twin visible; no student believes $a+b \ne b+a$, and authoring an error for it
   would be fabricating evidence. The mechanism to wire them already exists and was left
   empty by decision: a drill pitfall citing the error the contrast guards against
   (`anti.commute-everything`). Reversing that decision needs no new field.

- [ ] **One error still has no skill at all**: `mis.letters-differ` ("a letter is a number,
  not a word"). Not a wiring gap — there is no variables/fluency skill to attach it to. Its
  positive form exists as `meta.variable-is-a-fixed-number`. Needs a skill or a decision.

### Findings to act on
- [ ] **`sal.loudest-op-wins` vs `mis.precedence-ignored` did NOT collide** — the merge
  predicted before authoring never materialised, and the reason is worth keeping: salience
  is a **classification** error (*name* the structure: `3x + 2y` called a product) while
  precedence-ignored is an **evaluation** error (`2 + 3·4 = 20`). Both salience errors turn
  out to be classification-shaped, so their ✗/✓ are names of structure, not expressions.
  Keep both; no action beyond not re-opening it.
- [ ] **Two errors resist a single topic**, and both look too broad rather than
  mis-filed: `anti.commute-everything` (one instance is a minus error, one a fraction
  error) and `anti.partial-distribution` (minus vs coefficient). Filed under `minus` and
  `distributing` respectively. Splitting each in two is the likely fix — decide when the
  drill layer needs them separately.
- [ ] **Nine errors are still cited by no skill** (the audit line lists them). Now more
  visible than before, since each has instances and renders as a full card.
- [ ] German `hint` prose is authored but unreviewed by a native reader.

### ✅ Manifest unification — DONE 2026-07-25
`src/data/layers.ts` is now **the manifest for all seven layers**: `layers` (4 `fundament`,
each with its cards tree), `curatedLayers` (3), `allLayers`, and `layersOf(family)`.
- **`router.ts` generates every layer route** from `allLayers` — the tower shares
  `LayerView` parameterized by `layerId`, curated layers map id → view in one `viewOf`
  table. **`App.vue` generates BOTH dropdowns** from `layersOf(family)`; the hardcoded
  Errors/Metapatterns/Skills list is gone. Adding a layer of either family is one manifest
  line (plus one `viewOf` line if curated).
- **Slug uniqueness is validated across both families**, not just within the tower — slugs
  are route paths and nav keys now.
- ⚠️ **The manifest carries NO curated data, and cannot**: `src/data/index.ts` imports
  `cardIndex` from `layers.ts`, so importing errors.json/metapatterns.json back would close
  a cycle. Each curated view imports its own data. Price: a curated layer's nav `title` is
  a plain English label while its PAGE title is the localized one in its data head.
- **Nav labels changed to the student-facing page names** — "Errors" → *Common mistakes*,
  "Metapatterns" → *Reading rules*. The nav had been contradicting the page titles since
  the presentation passes. One line each in `curatedLayers` to revert.
- **NOT unified, on purpose**: the card renderers. A card, a skill, an error and a
  metapattern carry genuinely different fields; a generic renderer would be a pile of
  `v-if`s. Uniform container, per-layer view.
- Still true and still fine: metapatterns is a flat layer (11, no sections), and skills is
  one layer split across four files by section. The manifest blesses both rather than
  forcing a filesystem change.
- [x] ~~**Skills is the one curated layer with no layer head**~~ **DONE 2026-07-28**:
  `src/data/skills/layer.json`, joined by `parseSkillTree(files, head)`. It gained the
  presentation/inspection split with the shell port at the same time.

- [x] ~~**Metapatterns presentation pass.**~~ **DONE 2026-07-25.** `/metapatterns` now has
  the presentation/inspection split, the landscape row layout and the chip vocabulary of
  `/errors`, so the Curated group reads as one thing.
  - `metapatterns.json` gained a **layer head** (`layer`/`title`/`blurb`/`note` +
    `patterns[]`), matching `errors.json`, so the page lede is content rather than
    hardcoded view prose. **The list stays FLAT** — eleven rules need no sections, and
    that was half the point: it proves the container tolerates a flat layer before the
    manifest commits to a shape. `metaPatterns` downstream is still the plain array, so no
    consumer changed. (`scripts/sweep-layers.mjs` needed the `.patterns` hop.)
  - **New derived cross-link, the mirror of the errors page's**: each rule lists the
    mistakes it PREVENTS, walked metapattern → `summarizes` → card ← `corrupts` ← error.
    No authoring, and it is the pitch for the whole layer — *learn this one rule and these
    four mistakes stop happening*. Capped at 4 (`meta.dominant-op-last` reaches five).
  - **Both curated pages are now deep-linkable and cross-link BOTH ways**: entries carry
    `:id`, the router resolves the hash, and the arrived-at entry gets `.targeted`. So
    /errors "read →" lands on the exact rule, and /metapatterns "prevents →" lands on the
    exact mistake. Verified end to end.

**Skills last, and under-invested** — a skill stripped to student view is a *progress*
surface, and it cannot be that until the drill runtime exists. **Now hard-blocked by the
drill freeze** (see the banner at the top).

---

## Superseded — the original WrongRight handover (2026-07-24)

Extract the wrong→right (✗/✓) presentation into a reusable component and use it across
the app. The user liked the wrong→right pairing in `docs/common_mistakes.md` and asked
to surface it more. **The pattern already exists inline** in `LayerView.vue` (the card
`avoid`/`prefer` block, ~L147–149: `.rewrite` > `.ex.bad`✗ / `.ex.good`✓, each an
`<MathExpr>`). That block is the seed to generalize.

The ✗/✓ structure is latent in every layer's data:

| layer | ✗ wrong | ✓ right |
|---|---|---|
| errors | `instances[]` | the corrupted card's `latex` (or a skill's `illustration`) |
| skills | the skill's `errors` → their instances | `illustration` |
| cards | `avoid` | `prefer` |
| drills | `pitfalls` | `equivalents` / `answer` |

- [ ] Extract `src/components/WrongRight.vue` from the LayerView `.rewrite` block —
  props `wrong` / `right` (LaTeX), renders `✗ <MathExpr> = ✓ <MathExpr>` with the
  existing styles; swap LayerView's inline block for it (no visual change — the
  refactor-safe first step).
- [ ] Use it in **ErrorsView (`ReferenceView.vue`) FIRST** — highest payoff: render each
  error `instance` as ✗ paired with its ✓ correction, turning `/errors` into the
  wrong→right reference the catalog format shows.
- [ ] Then TaxonomyView (skill `illustration` ✓ beside its errors' instances ✗); later,
  drill feedback (✗ your answer → ✓ correct).

**OPEN DESIGN QUESTION — RESOLVED 2026-07-25, and the recommendation below was WRONG.**
Deriving the ✓ from the corrupted card does not work: a card states the *general law*,
and the correction of a specific instance usually lives on a **different card than the
one the error corrupts** (`anti.linearity` corrupts `ax.distributivity`; its ✓ comes from
`th.binomial-square`). `anti.conjoining` corrupts nothing at all. And roughly a third of
corrections are prose, not formulas. All corrections are **authored** — see the DONE
entry at the top.

~~(a) DERIVE it from the corrupted card's `latex`; or (b) add an optional per-instance
`corrected[]` field. Recommendation: derive first.~~

Infra: `MathExpr.vue` (KaTeX renderer, props `latex` + `display`), `RichText.vue`
(prose + inline `$…$`). Rationale + full ✗/✓ table: `docs/common_mistakes.md`.

**Prior NEXT-SESSION task (skill validation/prune) is ✅ DONE** — catalog assembled
(`docs/common_mistakes.md`), skills rebalanced (65→71, Tier-3 seeded), errors/metapatterns
extended, fraction arithmetic added to the tower. See the dated entries below.

---

## fundamentals + naturals — current thread (2026-07-22)

Isolated clean rebuild of the field-axioms bedrock, separate from the `laws.json`
tower. Full rationale, structure, and design decisions in **`docs/fundamentals.md`**.
Built and live at `/fundamentals`: now the **full complete ordered field ℝ** (tag
`≙ ℝ`) — operations + relations (`+ · = <`) + infix convention + field/order/
completeness axioms + definitions + theorems, with a collapsed per-axiom
`intuition` field.

**Thread state:**
- [x] ~~Refine/extend the intuition layer.~~ **2026-07-22: every `intuition` that
  offers a *model* now names its own stopping point** (where the picture fails), in
  both layers. Rationale + the list in `docs/fundamentals.md` (Design decisions).
- [ ] **School-facing simplification of the fundament (user's instinct, 2026-07-22).**
  The layers are deliberately deep and none of it is student-facing as written. The
  hypothesis to test later: **most of this can be collapsed for school use while
  keeping the important concepts *separate*** — the separation is the load-bearing
  part (definition vs theorem vs picture; opposite vs negative; object vs name), the
  depth is not. Related to but distinct from the second-field item below: that one
  adds prose per card, this one asks which cards a school version needs at all.
  Not started, no design yet.
- [ ] **A second, classroom-facing prose field per axiom/theorem** (name TBD, a
  sibling of `intuition`, not a replacement). `intuition` is written for the reader of
  the page — a teacher, or the author checking dependencies; what is missing is the
  same statement said the way it would be said to a 15-year-old. Two audiences, two
  failure modes, so two fields. **Deferred on purpose**: the field name and the
  writing standard both need deciding, and part of this may belong in the skills
  tower instead, which is the pedagogical bridge. Touches: both `cards.json` trees,
  `LayerView.vue` (a second collapsed toggle), `scripts/sweep-layers.mjs`.
- [x] ~~Powers (natural) as the ℕ-indexed layer *above* the field.~~ **Built
  2026-07-22 as the `naturals` layer** (`src/data/powers/cards.json`, `/powers`,
  tag `≙ ℕ ⊂ ℝ`) — see **`docs/powers-nat-act.md`**. The parked `pre.nat` import card was
  **rejected as false**: `def.nat` carves ℕ out of ℝ as the smallest inductive
  subset, so the layer assumes *nothing* and induction (`th.ind`) is a theorem.
  Cards: `pre.count` · `ix.pow`, `ix.juxtaposition` · `def.nat`, `def.numeral`,
  `def.multiple`, `def.pow` · `th.ind`, `th.numerals-distinct`,
  `th.multiple-is-product`, `pl.same-base`, `pl.of-power`, `pl.of-product`,
  `pl.no-sum-law`, `th.negative-base`. `0 ∉ ℕ` here (stated on the card as a
  *convention, not a fact*); decimal numerals deferred. **Revised 2026-07-22 after
  user pushback**: the "counter vs element" framing is RETIRED (ℕ ⊆ ℝ, so nothing is
  identified; the distinction is the ℤ-module/characteristic story, which ℝ dissolves).
  Replaced by the domain fact (`a^n` only for `n ∈ ℕ`) and "`n ↦ aⁿ` is a restriction
  of no field operation, `n·a` is". Card `th.numeral-arithmetic` added (`2+3=5`,
  `2·3=6` are theorems). Sources checked in `docs/powers-nat-act.md`.
- [x] ~~**ℤ layer — choice by permanence.**~~ **Built 2026-07-22** as the `integers`
  layer (`src/data/powers/cards.json`, `/powers`, tag `≙ aⁿ, n ∈ ℤ`) — see
  **`docs/powers-int-act.md`**. The arrow reverses: `pre.permanence` (Peacock 1834 / Hankel
  1867, a *method*, neither axiom nor theorem) → `def.int` · `def.pow-zero`
  (`a⁰ := 1`, forced; `0⁰` left undefined *and explained*) · `def.pow-neg`
  (`a⁻ⁿ := (aⁿ)⁻¹`, existence via `(a⁻¹)ⁿ` and `pl.of-product`) → `th.inverse-is-power`
  (fundamentals's atomic `a⁻¹` notation is retroactively justified — closes the
  exponent-`-1` backlog item) · `th.pow-laws-int` (all three laws survive on ℤ).
  Payoff: **three species of "convention" side by side** — arbitrary (`0 ∈ ℕ`, `0⁰`),
  determined (`a⁰ = 1`), proved (the laws on ℤ).
- [x] ~~fundamentals `th.zero-product` **zero product**~~ (`ab = 0 ⇒ a = 0 or b = 0`) — added
  2026-07-22 alongside the ℤ layer. Converse of `th.zero-times`, one line from `ax.multiplicative-inverse`, and the
  basis of solving by factoring. Its stopping point: a property of *fields*, not of
  multiplication (`2·3 = 0` mod `6`).
- [ ] **Layer manifest follow-ups.** `src/data/layers.ts` + `LayerView` shipped
  2026-07-22 (routes + nav generated, citations resolve tower-wide,
  `pnpm sweep-layers` runs the KaTeX/refs/prose checks). Open: the layers are still
  separate *pages*; composing several into one scrolling page is unbuilt.
- [x] ~~Order + completeness slab (upgrades field → ℝ; unblocks roots).~~ **Built
  2026-07-18:** `op.lt` + `the four `ax.order-*`` (`ax.order-mul`'s `0<c` condition = the flip rule) + `ax.completeness`
  supremum axiom; positive/negative defined on `op.lt`; theorems th.opposite-flips (opposite
  flips positive/negative), th.minus-times-minus (`(−1)(−1)=1`, no order used), th.square-positive (non-zero
  square positive), th.zero-less-than-one (`0<1`). Tag moved to `≙ ℝ`; the word "sign" retired.
- [x] ~~**ℚ layer — existence** (roots + rational powers).~~ **Built 2026-07-22** as the
  `rationals` layer (`src/data/powers/cards.json`, `/powers`, tag `≙ aⁿ, n ∈ ℚ`) —
  see **`docs/powers-rat-act.md`**. `pre.existence` → `ix.root` → `def.rat` · `def.root`
  (by *description*, licensed by the theorem below it) · `def.pow-rat` →
  `th.root-exists` (**the first and only use of `ax.completeness`** — uniqueness is order,
  existence is completeness) · `th.principal-root` · `th.exponent-well-defined` (ℚ is
  the first layer with non-unique exponent *names*) · `th.pow-laws-rat` ·
  `th.base-fence`. Added `def.abs` to fundamentals for `√(x²) = |x|`.
  **The powers tower is complete: ℕ builds, ℤ finds, ℚ must be given.**
- [ ] **ℝ layer — real exponents (sketched 2026-07-22, not started; build LAST).**
  Small, ~5 cards, and worth it mainly to stop the fundament ending on a dangling
  "and then, analysis". **Behind the school-facing simplification**, which has far more
  classroom value per hour.

  **Permanence fails a third way here.** At `0⁰` it falls silent; at negative bases it
  contradicts itself; for irrational exponents it is **massively underdetermined**. The
  laws say `f(x+y) = f(x)·f(y)`, `f(1) = a` — Cauchy's functional equation — which has
  infinitely many solutions besides `aˣ` (Hamel basis). The sharp fact: those solutions
  **agree with `a^q` at every rational `q`** (forced by the equation) and differ at the
  irrationals. So all of ℚ can be pinned down and `a^√2` still is not.

  **Completeness = existence, order = selection.** Both routes to the value work and
  both rest on `ax.completeness`: `aˣ := sup{a^q : q ∈ ℚ, q < x}` (a>1), or `lim a^{q_k}` for
  `q_k → x`. But neither *selects*: the step "`q_k → x` therefore `a^{q_k} → aˣ`" is not
  a deduction, it is the assumption that the extension respects limits, i.e. continuity
  chosen by the method. What pins it down is an extra condition on the **function**, and
  **monotonicity suffices** — no continuity, no limits, and monotone is `ax.order-mul`
  vocabulary the tower already owns. Contrast with `th.root-exists`, which needed no
  extra criterion because it pinned an **element**, where order gave uniqueness free.
  The object being determined changed from an element to a function; that is the layer.

  **Use sup, not sequences.** `ax.completeness` is stated as a supremum axiom, so the sup version
  uses it directly. The sequence route needs convergence and Cauchy sequences defined
  first, well-definedness across sequences, and quietly the Archimedean property. Same
  destination, more machinery — and sup keeps the layer inside the fundament's existing
  vocabulary, which is the only reason it is cheap enough to consider.

  Cards: `pre.underdetermination` · `def.pow-real` (sup; a>1 / a=1 / a<1) ·
  `th.agrees-on-rationals` (the agreement-on-overlap beat, the first that genuinely
  could have failed) · `th.pow-laws-real` · **`th.unique-monotone`** (the payoff: `aˣ`
  is the unique monotone law-abiding extension — the only card in the tower where a
  definition is pinned by a *property* rather than a construction or a demand).
  Optional sixth, and the one school-facing idea: **the role swap** — fix `a`, let `x`
  run, and `x ↦ aˣ` becomes a *function*, the doorway to growth and logarithms.
  Caveat that belongs on a card, not in a footnote: the wild solutions need the axiom
  of choice; without it, it is consistent that all solutions are continuous.
- [x] ~~**Correction owed to `docs/powers-rat-act.md` + `src/data/powers/cards.json`**~~ —
  **done 2026-07-23**: the continuity sentence was deleted from the layer data on the
  user's instruction. The sketch below is kept as the record of *why* it was wrong. The
  layer note's closing line says `aˣ` "needs continuity, a new idea rather than a new
  axiom". Truer: it needs a **tie-breaker**, and the cheapest one is **monotonicity**,
  which the tower already owns. Fix whether or not the ℝ layer is built.

**Untangling backlog** — the conflations that make algebra hard (a concept living
in several layers at once; detail in `docs/fundamentals.md`):
- [ ] Equality **number vs variable** (`a=a` trivial for a number, a universal claim
  for a variable; symmetry near-empty for numbers, load-bearing for variables).
- [x] ~~`3a = a+a+a` (definition) vs `3·a` (theorem) vs "three copies" (intuition).~~
  **Resolved 2026-07-22** — three separate cards in the naturals layer
  (`def.multiple` / `th.multiple-is-product` / its collapsed `intuition`).
- [ ] `1.23·a` — repeated addition breaks → forces `r·a` (product); needs decimal numerals.
- [x] ~~Minus / sign / subtraction — one glyph, three meanings.~~ **Resolved 2026-07-17:
  there are only *two* minuses — unary (`ax.additive-inverse`, `-a` and `-2` alike) and binary
  (`def.sub`). The third ("a number's own sign") does not exist in the notation.
  Shipped in `ax.additive-inverse` + `th.negative-one-times` + `ix.negative-factor`. Extended 2026-07-18: positive/negative built
  via order (`op.lt` + `ax.order-trichotomy`, `th.opposite-flips`), and the word "sign" retired from the data.**
- [x] ~~**Atomic object, composite name** — `-2² = -4` (parse the name) vs
  `(-2)² = 4` (square the object).~~ **Shipped 2026-07-22** as `th.negative-base`
  in the naturals layer: derived via `th.negative-one-times` + `ix.precedence` rather than decreed, brackets
  as the notation's name-maker (`ix.negative-factor`), and the "completion, not a correction"
  teaching stance in the card's `intuition`.
- [~] Powers & roots — the *theorem* half is built (natural exponents, by induction,
  plus `pl.no-sum-law`); definition-by-permanence (ℤ) and existence (ℚ, roots) remain.
- [ ] The exponent `-1`/`-n` — `b^{-1}` inverse-*notation* (fundamentals) vs `a^{-1}` the literal-`-1` power vs `a^{-n}` operator-on-variable.
- [ ] Inverse-notation asymmetry — unary-minus *prefix* for `+`, no prefix for `·` (postfix `a^{-1}`). `a^{-1}` (primitive) vs `1/a` (derived, needs division); reserve "reciprocal" for `1/a`.
- [x] ~~Sign vs unary minus — "sign/Vorzeichen" = literal's sign only.~~ **Superseded
  2026-07-17 (too weak: `-2`'s minus is the unary *operator* too), then RETIRED
  2026-07-18: the word "sign" is dropped from the data entirely — only
  positive/negative/zero, each defined via `<`. See `docs/fundamentals.md`.**

---

## The `terms` layer (Term manipulations) — STARTED 2026-07-23; renamed from `algebra` 2026-07-23

House-cleaning on 2026-07-23 made the fundament tower the primary reference and cut
`laws.json` 38 → 15 and `conventions.json` 12 → 2. **What survives is the spec for
this layer**: it is precisely what the tower does not state, and the gap has a shape.
The tower is complete for the *linear infix core* — one operation, one term at a
time — and empty wherever school algebra is two-dimensional or two-termed.

Confirmation that it is ready to write: the survivors already cite **45 tower
cards** and only **4 of each other**. Every derivation is one or two steps from
cards that exist. `laws.json` is down to **14** after `th.binomial-square` moved in.

**Cluster 1 — the fraction bar. ✅ DONE 2026-07-23**, split across three layers by the
same filing logic that placed the binomials: the **notation** went to `fundamentals`
(`ix.fraction-bar`, `ix.division-symbols` in the `infix`/reading group, and `def.div`
now cites the bar it is written with); the **quotient power laws** went to `powers`
(`th.pow-quotient-same-base`, `th.pow-of-quotient` in the ℤ act, `th.root-of-product` /
`th.root-of-quotient` in the ℚ act); the **transformations** went to the `terms` layer's new `fractions` section
(`th.split-numerator`, `th.cancel-common-factor`, `th.fraction-minus-moves`,
`th.divide-by-one`). See `docs/terms.md`. **`conventions.json` is now empty and
`laws.json` is down to 4.**
  - **Fraction arithmetic completed 2026-07-24** (was the acknowledged hole): `th.inverse-of-product` `(ab)⁻¹=a⁻¹b⁻¹` added to `fundamentals` Field theorems (the multiplicative twin of `th.minus-in-product`; `th.cancel-common-factor` now cites it instead of re-deriving inline), and `th.fraction-multiply`, `th.fraction-divide` (reciprocal + **double fractions**: stacked form, mixed cases, "which bar is the main one" reading folded into `ix.fraction-bar`), `th.fraction-add` (common denominator `bd`; special case `a/b+c/b`) added to `terms` fractions. `anti.fraction-addition` re-pointed to `th.fraction-add`. Tower now **101 cards**. Drilled by **`transformation.combine-fractions`** (added 2026-07-24), which wires `anti.fraction-addition` to a skill.

**Cluster 2 — the binomial. ✅ DONE 2026-07-23**, and it is what created the layer.
All three now live in `src/data/terms/cards.json` (`docs/terms.md`):
`th.binomial-square` · `th.square-of-difference` · `th.difference-of-squares`. The card
built earlier that day in `powers` **moved up**: `th.difference-of-squares` is not a
statement about exponents, so the binomials could not stay filed under `aⁿ`. The
adjacency with `pl.no-sum-law` survives as a forward pointer in its note.

**Cluster 3 — minus over sums and collecting. ✅ DONE 2026-07-23.** `th.minus-over-sum`,
`th.subtract-a-sum`, `th.collect-like-terms` are algebra's new `distributing` section;
`th.root-power-order` went to `powers` (ℚ act), since both its sides are powers. **This
empties `laws.json` — the bridge is 163/163 into the tower, zero legacy.**

⭐ **DONE 2026-07-23.** The tower had `pl.no-sum-law` — *there is no law for sums* —
and nothing saying what does happen, so students were told only that the obvious move
fails. `th.binomial-square` now sits immediately after it. Its content is the middle
term: `ab` and `ba` are the same element by `ax.mul-commutative`, so the two mixed
products collect into one, and the `2` is counting them — which is exactly the term
students lose. The last step makes `ix.invisible-one` visible
(`ab + ab = 1·ab + 1·ab = (1+1)·ab`), and the intuition's stopping point is that the
square picture needs `a` and `b` to be lengths, so it says nothing about
`(a + (−b))²`, the case that has to work.

## Decimal numbers and other special numbers — for the `numbers` layer (2026-07-23)

The `numbers` layer's stated criterion is *distinguished subsets of ℝ and the
vocabulary for naming their elements*, and both halves have obvious holes:

- **Decimal representation.** `def.numeral` names one element at a time
  (`2 := 1+1`); positional/decimal notation is a different machine and has to
  explain `1.23`. It is what the full `1.23·a` card needs — already planted in
  `th.multiple-is-product`'s intuition (copies run out, the product does not).
  Note `conv.division-signs` above: the Swiss `:` and the decimal point/comma
  question belong in the same pass.
- **Divisibility and the primes** — the first structure *inside* ℕ.
- **Other special numbers** — π and e (named constants with no algebraic
  definition, which is itself the point), and the irrationals as a *set* now that
  `th.no-rational-square-two` has exhibited one.

## Done — Taxonomy as data + reference library

- [x] Project setup (Vue 3, Vite, Pinia, Naive UI, UnoCSS, KaTeX)
- [x] Skill schema as Zod (`src/data/skill.schema.ts`) — single source for validator + `Skill` type
  - [x] `kind` discriminator = the skill's *mental step*: `equivalence` (equal-forms set), `recognition` (equal-forms set, but a Tier-2 "same value across different structure" step), `classification` (`examples` + `answer`), `chunking` (`examples[].chunks`); `transformation` reserved for Tier 3.
  - [x] Exercise type derived from `kind`, not stored; `flag`/`id` dropped as redundant
  - [x] Readable slug ids **kind-prefixed** (`<kind>.<slug>`), mirroring law `ax/def/thm`. `skill` (equivalence/classification/transformation) is DERIVED from kind via `skillOf()`, not stored, not in the id — the notation/structure namespace was retired 2026-07-13 (commit a05749f) because it conflated skill with naming and couldn't hold a third skill.
- [x] All 54 skills authored as JSON, one file per group (`src/data/skills/*.json`)
- [x] Groups + meta-patterns as namespaced data (`skillGroups.json`, `metapatterns.json`), referenced by skills
- [x] Load-time validation: schema, unique ids, group refs, meta-pattern refs (throws with offending id)
- [x] Read-only card view (`TaxonomyView.vue`) — green true-forms vs red pitfalls
- [x] Retired the old pre-refactor path (skills.ts, generator, SessionView, old schema docs)
- [x] Dependency graph: `requires` + pitfall-level `revise` in schema, graph validators, ~70 edges authored; notation ranked as a strict 1–28 sequence, structure 1–15, consistent with the DAG
- [x] Misconception wave (2026-07-08): 10 new skills (like-terms/conjoining group, embedded-minus pair, multiplying-into-a-bracket, power-of-a-sum, roots pair, no-cancelling-in-a-sum) + meta-pattern M6 (linearity illusion) — 64 skills total
- [x] Card view as inspection tool: drilling-order mode, skill ids on cards, per-card raw-JSON disclosure
- [x] **Tier-1 (notation) content COMPLETE (2026-07-10):** all 44 notation skills carry law/convention coordinates (`justifiedBy` / `conventions`); cited distractors added wherever a tempting wrong form exists (the empty pitfalls that remain — the basic-identity skills like `divide-by-one`, `bracket-types`, the commutativity pair — are distractor-free *by decision*, not omission); all 12 remaining notation notes migrated to the inline `$…$` prose contract. Notation audit now reads 0 untagged, 0 unmigrated prose. Commits `5bba71c`→`8b77b2c`. Two loose threads deferred (both incremental, see Tier-1 leftovers): German skill prose, and 4 exponent-extension distractors left uncited (no matching error pattern exists yet).

---

## NEXT SESSION — Tier 2 (structure) content pass

Tier-1 (notation) content is **fully complete** as of 2026-07-10 (tags +
distractors + prose contract — see the Done section). The 21 structure
skills are already authored (`structure` / `chunking` / 1 equivalence);
this pass completes them the way tier 1 was completed.

**Working hypotheses going in** (from the 2026-07-09 discussion — tier 1's
deep structure was laws + conventions; tier 2's is the **expression tree**):

- Dominant operation = root node; chunks = subtrees; the `structure` kind = naming
  the root; `chunking` = reading one level; the conventions (precedence,
  brackets, fraction bar, exponent scope) are the parsing rules from written
  string to tree. The tree is to tier 2 what the tower is to tier 1.
- Expect the five-way answer set (sum/difference/product/quotient/power) to
  come under pressure: `def.subtraction` collapses difference into sum
  (`structure.leading-minus` already answers "sum" for $-3x+2y$),
  `def.division` collapses quotient into product. Likely outcome: keep five
  (school-honest — students see five), but RECORD the collapse, as D3 records
  "provable but taught as definition."
- Familiar shapes are named TREE TEMPLATES ($a^2-b^2$ as pattern) — a
  different sort from root-naming, which is why the dominant-op `answer` fits
  them poorly. RESOLVED 2026-07-11: kept in `structure` but flagged
  `gateway: true` (Tier 2 → Tier 3 hinge), rather than a separate layer — see
  the resolved item below.
- The chunks-in-sum vs implicit-chunking overlap should dissolve once trees
  are the coordinate system: same tree operation through different devices.
- None of this is throwaway: MathJSON (Compute Engine, installed) IS the
  expression tree — this layer is the data structure the generator's
  degeneracy checks and the chunk-marking exercise need anyway.

**Timeline note (corrected 2026-07-10):** the earlier "students need it ~Sept /
school starts mid-Aug" deadline was LLM-invented, not the user's — real algebra
training starts later in the semester, so time is not the binding constraint.
The user works **bottom-up by preference**: finish a layer properly before the
next vertical step. Notation content is now fully done, so there is no tier-1
backfill left to parallelize; the vertical slice's critical path still runs
through notation equivalence skills (Same-or-Different first), which are
drill-ready. Sequencing is the user's call, not deadline-driven.

**The pass itself:**

- [x] **Familiar-Shapes representation DECIDED (2026-07-11).** Kept the 5 shapes (difference-of-squares, perfect-square-trinomial, common-factor, linear-form, quadratic-form) in the `structure` kind but flagged `gateway: true` — *classification-with-intent* that hinges Tier 2 → Tier 3 (recognising the shape is the trigger for a transformation). Chose the flag over a separate `kind`/`shape` field: the drill is still "name the dominant operation," the gateway just marks it as a Tier-3 trigger. Schema: `gateway: z.boolean().default(false)` on the structure variant (commit 7400524).
- [ ] **Resolve chunks-in-sum vs implicit-chunking overlap** (same example expressions, different emphasis) — merge or sharpen the contrast.
- [ ] **Inspect + tag the 21 structure skills** (18 untagged). Expect sparse law coordinates by design — structure is about parsing, so mostly conventions (`conv.brackets-group`, `conv.precedence`, `conv.fraction-bar`, `conv.exponent-scope`); only the shapes group and `same-value-different-structure` cite theorems. Add pitfall `cites` to the `structure` whys.
- [ ] **Migrate the 4 structure notes** (+ 2 whys) still in unicode math to `$…$` (audit counts them).
- [ ] **Empty pitfalls in structure** (12 skills): for the 5 basic forms that may be fine (no tempting wrong label); for the shapes group it isn't — decide per card.
- [ ] `chunking` drill format is still undefined (generator section) — the chunking group's data should be inspected with that open question in mind.

## Content — Tier 1 leftovers

Notation content is **complete (2026-07-10)** — the tagging, prose-migration,
and distractor items below are done. Only incremental threads remain.

- [x] Tag the 36 untagged notation skills → all 44 now carry coordinates (0 untagged).
- [x] Migrate the 12 notation notes in unicode math to `$…$` → notation prose fully on the contract.
- [x] Distractors for empty-pitfall notation skills → cited where a tempting wrong form fits; remaining empties (basic identities: `divide-by-one`, `bracket-types`, `redundant-brackets`, commutativity pair, `fraction-as-reciprocal-product`, `splitting-a-fraction`) are distractor-free by decision.
- [ ] German translations of skill notes/whys (incremental & cross-skill — better as one bilingual pass over notation + structure; layer files and meta-patterns already bilingual).
- [ ] Cite the 4 uncited exponent-extension distractors (`zero-and-one-exponent`, `negative-exponent`, `fractional-exponent-root`, `negative-fractional-exponent`) — blocked on an error pattern that fits, not on authoring.
- [ ] **Candidate rule: "multiplication makes bigger"** (2026-07-22). Not among
  the 25 in `rules.json`, which are all notation/structure/law. This one is a different kind: a property
  smuggled from the ℕ-model into ℝ (sibling: expecting `a^r` to behave like `aⁿ`).
  Errors-layer work; rationale in `docs/powers-nat-act.md`.
- [ ] Fine-tune taxonomy from classroom use (ongoing).
- [~] Prerequisites as a graph: `requires` + validators in schema; graph fully authored and priority-consistent (notation strict 1–29 after the 2026-07-09 insertion; structure basic forms 1–5, linear-form 14 with quadratic-form requiring it). The graph is a v1 hypothesis until drill data confirms it.
  - Resolved 2026-07-24: `equivalence.minus-as-times-negative-one` was merged into `equivalence.minus-over-sum` (SAME equivalence class; the ×(−1) form folded into its note + drill equivalents). `subtracting-a-sum`/`subtracting-a-difference` stay SEPARATE skills — a merge was tried and reverted because `a-(b+c)` is a different equivalence class than `-(a+b)` (different drilled discrimination; the drill schema can't share one equivalents-set). Merge Tier-1 skills only when same equivalence class, not merely same strategy. See `docs/common_mistakes.md`.
- [~] **Layer 1+2 — laws & notation conventions**: IMPLEMENTED 2026-07-09 — SOURCE OF TRUTH is `laws.json` (37: 9 ax / 7 def / 21 thm), `conventions.json` (12), `errors.json` (20: 5 false laws + 15 misreadings); `docs/content_model.md` is rationale only (no content tables — they'd drift). In-app **Laws & Conventions view** (`ReferenceView.vue`, tab in App.vue) renders law cards with derivation chains, conventions, error patterns. Schema + validators (sort↔id-prefix, DAG over `basedOn` ∪ `derivedFrom`, `of` refs, cross-layer refs), matrix-audit console report, meta-pattern `refs`, `justifiedBy`/`conventions` on skills, `cites` on pitfalls. LocalizedString (`{en, de}`, en fallback, de = Schweizer Hochdeutsch) + de/en toggle. Power laws carry classroom names incl. quotient/root forms; `thm.power-same-base-quotient` added (was missing). New skill `notation.no-splitting-the-denominator` ranked 26 (26–28 shifted to 27–29; notation now a strict 1–29 sequence). Meta-patterns migrated to slug ids (`meta.…` + display code M1–M6) with localized title/text (student-facing feedback takeaway); assignment stays authored — derivation tested and rejected (recovers all, over-generates); authored-⊆-derived is an audit line. Prose format contract: text + inline `$…$` KaTeX (`RichText.vue`; markdown rejected), `conditions` = pure LaTeX; load-time KaTeX compile check on every latex field and `$…$` segment. Remaining work is split into the tier-2 pass and tier-1 leftovers sections above; the audit reports live counts.
- [ ] Pitfall-level `revise` refs where an error points at a sharper gap than the skill's `requires` (schema supports it on all three kinds; author only where skill-level links aren't precise enough).
- [ ] Per-skill variation dimensions (what varies / constant / discriminating feature) — variation theory (Marton / bianshi).

---

## Exercise generators — derive drills from `kind`

- [ ] `equivalence` → Same-or-Different + Odd-One-Out (needs `equivalents` + `pitfalls`)
- [ ] `structure` → Name-the-Structure (needs `examples` + `answer`)
- [ ] `chunking` → Chunk-marking exercise (new format; needs `examples[].chunks`)
- [ ] `kind → available exercises` lookup table in code
- [ ] Generation params: per-skill, which letters vary over which pools (respect shared binding for equivalence, independent for `structure`). **The pool choice is the Tier-1↔Tier-3 selector** (atoms → Tier 1 recognition drill; compound/nested → Tier 3 drill of the same skill) — see vision.md #4 corollary.
- [ ] Substitute on the MathJSON tree via Compute Engine (installed, unused) — avoids raw-LaTeX string-collision
- [ ] Degeneracy checks on generated items: a drawn DIFFERENT pair must be verifiably non-equal (e.g. `b = 0` makes `-a+b` equal `-a-b`); respect `conditions`
- [ ] Skill workbench (dev-only view): skill card + live-generated drill items + degeneracy warnings — build after the generator exists

---

## Drill / session + progression

- [ ] Session structure (~12–15 items, mixed skills, clear end)
- [ ] Mastery tracking per skill (threshold e.g. 8 correct without error)
- [ ] Spaced repetition (mastered skills re-enter review queue)
- [ ] localStorage persistence for mastery + runtime state
- [ ] Progress overview screen (mastered / in progress / not started)
- [ ] Sequencing driven by `priority` + prerequisites; level progression (harder params after mastery)
- [ ] Diagnostic entry test (surfaces the gap on trivial-looking items)
- [ ] Meta-pattern lookup (the card view can serve as browsable reference, triggered by errors)

---

## Teacher dashboard (later)

- [ ] Per-student progress (skills mastered / stuck), highest error-rate skills across class, last session date
- [ ] Student account setup (teacher-issued codes or self-register) — implies a backend

---

## Technical / housekeeping

- [x] ~~`package.json` name is still `tmp`; README is the stock Vite template~~ — both
  fixed 2026-07-22: package is `learn-algebra` with a description, and the README now
  documents the two towers, the pages, the scripts, the prose contract and the doc index.
- [ ] Mobile layout polish (large tap targets, phone-readable)
- [ ] PWA setup (installable, offline)
- [ ] JSON Schema for IDE authoring: generate via `z.toJSONSchema(skill, { io: 'input' })`, register in `.vscode/settings.json` (`json.schemas`) for `src/data/skills/*.json` — autocomplete + inline validation while editing
- [ ] Consider renaming the `examples` field for the **`chunking`** kind (`{expr, chunks, op}`): each entry carries its *own* answer, so it's labeled ground-truth data, not illustrative "examples" — `cases` / `items` reads truer. Cosmetic; **bundle it with any future `{expr, ast}` migration** rather than churning it alone (touches schema + `TaxonomyView.vue` + all chunking JSON). Note: `structure` kind's `examples` (multiple exprs sharing one `answer`) is fine as-is — genuine examples of one class.
- [~] `pnpm validate` script (`scripts/validate.ts`, via `vite-node`) — runs the schema + graph validators (import side-effects) **plus** Compute-Engine AST checks on Tier 2 (root op-class vs `answer`/`op`; chunk count vs the tree's maximal root operands). CE first use; kept out of the app bundle. TODO: wire into CI; extend CE checks to Tier 1 (`equivalents` mutually equal, `pitfalls` non-equal at sampled points) and Tier-3 endpoint-grading; add full per-chunk structural match (needs sum/difference + sign reconciliation).

---

## Research to lean on

- [ ] Arcavi (1994) "Symbol Sense" — closest description of Tier 1+2 combined
- [ ] Hoch & Dreyfus (2004–2006) "Structure Sense" — maps to Tier 2
- [ ] Variation theory / bianshi — Contrast, Generalization, Separation, Fusion as design dimensions
- [ ] Devlin (2008) "It Ain't No Repeated Addition" (MAA) — multiplication is not
  repeated addition; the model breaks at fractions, scaling is the general notion.
  Directly under `th.multiple-is-product` and the deferred `1.23·a` card; also a live
  teacher argument, so worth knowing before a colleague raises it.

---

## Deferred — Tier 3 (Transformation / *Umformung*)

Blocked on: math input UX + equivalence verification.

**Design model (2026-07-11 discussion).** Tier 3 is *directed* equivalence:
Tiers 1 and 3 are both equivalence, split as **static** (Tier 1: "these are equal",
recognition) vs. **dynamic/directed** (Tier 3: "rewrite toward a goal", production).
Tier 3 = chains Tier 1 equivalences, located via Tier 2 parsing, toward a target — so it
*requires* both. A Tier 3 skill = Tier 1 equivalences + Tier 2 parsing + **a target**.

- The distinction from a Tier 1 *directed* drill is *given-vs-selected* /
  *isolated-vs-embedded*, not move count: Tier 1 = "know the move" (bare pattern,
  one forced rewrite, target implicit); Tier 3 = "know when/where/whether" (embedded,
  selected, sequenced). A single-move-but-embedded problem is already Tier 3.
- **`target: { direction, done }`** field. `direction` = the named intent
  (`factor`/`expand`/`combine`/`simplify`/…) and *is* the Tier 3 sub-taxonomy; one
  skill = one direction (multiple valid targets for an expression live *across*
  skills, chosen by the drill). `done` = a **predicate** (combine/simplify have
  no fixed endpoint); template skills like factor `a²−b²` carry a concrete
  target instead.
- **Endpoint-graded** — any valid route to the normal form passes. Needs a
  canonical **normalizer per direction** (equivalence = normalize-both-and-compare;
  `factor` is the awkward case). `steps` demote to teaching aid, not answer key;
  map common wrong endpoints to causes in `pitfalls`.
- New `kind:"transformation"` (greenfield — not yet in schema) + a new id-prefix
  namespace (e.g. `transform.`). The five `familiar-shapes` skills
  (difference-of-squares, perfect-square-trinomial, common-factor, linear-form,
  quadratic-form) are the Tier 2→Tier 3 recognition hinge that feeds it. ⚠️ The
  `gateway: true` flag these carried was **removed 2026-07-24** (dead field, nothing
  read it); re-introduce a trigger mechanism — likely a typed edge, not a boolean —
  when this is actually built.

- [ ] Research MathLive as input component
- [ ] Design Tier 3 exercise format (endpoint-graded per above)
- [ ] Compute Engine for equivalence checking + per-direction normalizers
- [ ] **Drill "dirty" expressions** — Tier-3 terms will need to contain messy sub-forms (`a/1`, `--a`, unsimplified coefficients) that the student must handle/clean as part of the transformation. Deferred, but a real requirement for the transformation drills.
- [ ] Add the `transformation` `kind` to the schema (`target` field); ids get the `transformation.` prefix like every other kind (no separate namespace — skill derives from kind)
- [ ] Author Tier 3 skills; wire the `familiar-shapes` skills as their recognition triggers (the old `gateway` flag was removed — see note above)
- [ ] **Coefficient-lens chunking** (`2x(x+1) → [2x, (x+1)]`, keeping the coefficient with its variable): operation-relative grouping, the recognition-half of an *expand* move — author as a Tier-3 skill. The example was removed from the Tier-2 `chunking.chunks-in-product` card on 2026-07-11 (Tier-2 chunking is maximal/flat: `[2, x, (x+1)]`); this is where its coefficient-lens version lands.

## Open questions — salvaged from archived taxonomy docs (2026-07-13)

Rescued from `docs/archive/taxonomy_skill{1,2}_*.md` before archiving; the rest of
those docs' questions are already resolved (drilling priority now lives in the
`priority` field; the Tier-2↔3 gateway is decided via `gateway`/`recognition`).

- [ ] Are there Swiss/German textbook notation conventions that differ from the authored set? (audit against a local textbook)
- [ ] Should `ab`-as-a-product vs a two-letter variable name get its own skill? (matters in physics/chemistry contexts)
- [ ] Meta-patterns: taught explicitly in class *before* drilling starts, or embedded only in drill feedback?
- [ ] Is "linear form" trivial enough to drop as a familiar-shape skill, or does naming it explicitly earn its place?
