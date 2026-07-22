# fundament0 — the clean ℝ layer (complete ordered field)

A deliberately isolated rebuild of the very bottom of algebra, mathematically
stricter than the existing `laws.json` tower, which it does not touch. It lives
in `src/data/fundament0/` and renders at `/fundament0`
(`src/views/LayerView.vue`, shared by every layer via `src/data/layers.ts`). This doc records the *why* and the open
threads, not the content tables (they would drift — read the JSON).

## What it is

`fundament0` specifies **ℝ as the complete ordered field**, from stated
assumptions only. It is a **specification**, not a construction: we posit a set
`R` with `+`, `·`, `<` and the axioms, and the claim is that anything satisfying
them *is* ℝ (the axioms pin it down uniquely). The page's arc is the discovery
that these assumptions — and nothing borrowed from the number line — reconstruct
exactly the high-school algebra of ℝ. Tag: `≙ ℝ`.

*(History, worth keeping. It began as "a field over ℝ" — wrong twice: in algebra
"over" means extension (a field over ℝ is something like ℂ), and fixing the
carrier to ℝ contradicts the axioms being a specification. It was then reframed
as "a specification of a field", **parking** order and completeness, on the audit
verdict "school algebra is an ordered field; completeness is the analysis seam,
park it". On 2026-07-18 that parking was **reversed**: the user chose the full ℝ,
told as `R` discovered to be `ℝ`. Order and completeness are now built in.)*

Three words, each a floor, each answering "what else still satisfies this?":
- **field** — `+`, `·`, neutrals `0`/`1`, inverses, the laws. Also ℚ, ℂ, …
- **ordered** — the relation `<` and its four axioms; where *positive* / *negative*
  are born. Also ℚ (not ℂ).
- **complete** — the supremum axiom (`ax.C1`); the number line has no gaps. **ℝ
  alone.** The analysis seam.

The elements are abstract: no properties beyond what the axioms give. `0`/`1` exist
by axiom; `2` is a *name* for `1+1`; `−2` *describes* the additive inverse of `2`.
The familiar names (`0,1,2,1.25,π`) are for reading only; every property is traced
to an axiom, never taken for granted from the number line. That tracing is the
point: it makes visible **which property rests on which assumption** (`−a` is the
opposite → no order; `−a` is *negative* → order; `√2` exists → completeness). The
axioms earn their place **not by constructing ℝ** — nobody needs axioms to find
2+2=4 — **but by that dependency bookkeeping**, which *is* the untangling thesis.

The page tells one linear story:

0. **Preliminaries** (`pre.1` *The elements*, `pre.2` *Variables & constants*) — no
   properties beyond what the axioms give; `0`/`1` by axiom, `2` a name for `1+1`,
   `−2` the additive inverse of `2`. Told apart by ordinary italic/upright (no house
   typography; see Design decisions).
1. **Operations & relations** — the given data: `+`, `·` (both `ℝ×ℝ→ℝ`), `=` and
   `<` (relations `ℝ×ℝ→{true,false}`). Codes `op.add/mul/eq/lt`. Naming lives here:
   summands, factors, coefficient. **`op.lt` also defines *positive* (`0<a`) and
   *negative* (`a<0`)** — the terms live with the relation that makes them possible,
   not in a `def.` card. There is no `def.sign`.
2. **Infix convention** (`ix.1–6`) — reading rules (brackets, left-to-right,
   precedence) + writing conventions (bracket a negative factor, no operator next to
   a unary minus, coefficient in front). Before the axioms on purpose: association
   and distribution cannot be *stated* without brackets and precedence.
3. **The axioms** — Equality (`ax.E1–E4`), Addition (`A1–A4`), Multiplication
   (`M1–M4`), Bridge (`D1` distributivity, `N1` `0≠1`), **Order (`O1` trichotomy,
   `O2` transitivity, `O3` `+`-compat, `O4` `·`-compat)**, **Completeness (`C1`, the
   supremum axiom)**. Field/order axioms carry a collapsed `intuition`. `O4`'s `0<c`
   condition is exactly where "flip the inequality when multiplying by a negative"
   comes from. `C1` is different in kind — it speaks of *sets*, not elements (the
   analysis seam), and its intuition motivates via the ℚ hole at `√2`.
4. **Definitions** — subtraction (`def.sub`, rests on `A4`) and division (`def.div`,
   rests on `M4`; reciprocal noted there). Not new operations. (`positive`/`negative`
   are *not* here — see step 1.)
5. **Theorems** — field: `th.1` (`0·a=0`), `th.2` (`−a=(−1)·a`), **`th.7`
   (zero product, `ab=0 ⟹ a=0 or b=0` — the converse of `th.1` and the licence for
   solving by factoring; added 2026-07-22 with the ℤ layer)**, `th.4`
   (`(−1)(−1)=1`, "minus times minus is plus", proved with **no order** — the audit's
   showcase). Order: `th.3` (the opposite flips positive/negative, `0<a ⟺ −a<0` —
   the untangler: the unary minus does not *make* things negative, it swaps),
   `th.5` (a non-zero square is positive — why `a·a+1=0` has no solution), `th.6`
   (`0<1`, a corollary of `th.5`). Each shows a collapsed derivation and cites what
   it rests on (by **code**; the earlier `th.zero-times`-by-id citation bug is fixed).

## Data structure (one file, 2026-07-18)

The three files (`axioms.json` / `conventions.json` / `theorems.json`) were
collapsed into a single **`src/data/fundament0/cards.json`**, a uniform
containment tree — the flat structure discussion (see git log) landed here:

```
layer → sections[] → groups[] → cards[]
```

- **`layer`** — `{ id, meta }`; `meta.characterizes` (the `≙ ℝ` tag) + `meta.note`
  (the intro). One layer per file. **The manifest is `src/data/layers.ts`** (built
  2026-07-22 with the naturals layer): it fixes the reading order of the tower,
  generates the routes and nav entries (one `LayerView`, a `layerId` prop), and
  resolves citations **across** layers — `th.negative-base` in naturals rests on
  `th.2` and `ix.3` here. Codes are unique tower-wide, and it throws at load time
  on a duplicate code, an unresolvable citation, or a bad/missing `concerns`.
- **`sections[]`** — ordered; each has a `kind` and its `groups`. **Page order is
  array order** at every level — no derived-from-folder kind, no layout config.
  The seven→six kinds are the epistemic ladder: `preliminary · signature ·
  convention · axiom · definition · theorem` (framing → given → agreed → assumed →
  defined → derived). **`operation`+`relation` merged under `signature`** (both are
  the *given vocabulary*; function-vs-predicate is a group split inside it).
- **`groups[]`** — a *partition* of a kind's cards into titled sub-sections
  (`slug`, `title?`, `blurb?`). Membership is **structural** — the card nests
  inside its group, so the old `group` foreign-key field is gone. New sub-groups the
  flat files couldn't show: signature→operations/relations, convention→
  reading/writing, theorem→field/order.
- **`cards[]`** — `code` is the sole key (`id` dropped; citations always used
  codes). Each carries `concerns` + its kind-specific fields.

**Planned, not built — a second prose field per card.** `intuition` is written for
the *reader of this page* (a teacher, or the author checking dependencies). What is
missing is the **classroom-facing** explanation: the same axiom or theorem said the
way it would be said to a 15-year-old. It wants its own named field alongside
`intuition`, not a rewrite of it, because the two have different audiences and
different failure modes. Deferred deliberately — the field name and the writing
standard both need deciding, and the skills tower may turn out to be the better home
for some of it. See `docs/TODO.md`.

Two orthogonal axes, deliberately represented differently:
- **`kind` / `group`** = the *tree* (a partition → structural nesting). What a card
  *is*, and which section it's filed under.
- **`concerns[]`** = a *tagging* (multi-valued → a field). Tokens `add · mul · eq ·
  order · completeness`; what a card is *about*. **Bridges are emergent**
  (`|concerns|>1`) — every theorem, plus E4/D1/N1/O1/O3/O4/C1 — so the `bridge`
  axiom group is no longer the only bridge, just a display home.

The view (`LayerView.vue`) walks the tree with three card layouts (signature
op-cards, plain preliminaries, one unified statement-card for convention/axiom/
definition/theorem) and two **filter rows** — `kind` and `concerns` — that **dim**
(not hide) non-matching cards. Deselect all concerns but `mul` for the cross-cutting
"multiplication across all kinds" view the section layout can't produce.

## Design decisions (settled)

- **Strict `\cdot`** in the axioms; juxtaposition `ab` is only mentioned on the
  `·` operation card, never baked into a primitive statement.
- **`=` is a congruence**, not merely an equivalence relation — E4 states the
  compatibility with the operations that makes rewriting legal. (Its intro card
  keeps the plain title "Equality" / "Gleichheit"; the congruence property lives
  in the axiom E4.)
- **Structure = signature + axioms**, all axioms peers. An earlier heavier
  apparatus (given/introduced columns, existence/law/distinctness *kind* tags,
  spine/substrate *weight* tags, a grammar-tier system) was built and then
  **deliberately stripped for being too complicated**. Keep it lean.
- **`−` and `/` are definitions, not operations** — built on the inverse axioms.
  A load-bearing pedagogical point, not a technicality.
- **Per-axiom `intuition` field**, collapsed by default (`▸ intuition` toggle).
- **Every intuition names its own stopping point (2026-07-22).** A picture is
  `recognition on a model, not proof`, and the teaching debt comes not from picking
  the wrong picture but from never saying where it stops, then acting surprised when
  a student takes theirs past that point. So each `intuition` that offers a *model*
  ends by saying where the model fails: the balance scale cannot tell you which steps
  are reversible (`E4`); the mirror needs a line, and the line is order, which `A4`
  does not have; the rectangle has no negative sides (`M1`, `D1`); the box runs out at
  three factors (`M2`); partition reaches the fractions and no further (`M4`); a
  stretch cannot be seen for an unseeable factor (`O4`); and the sharpest one, the
  gapless number line is **not evidence for `C1`, it is a picture of it** — anyone who
  draws it has assumed what is asserted, and the hole at `√2` is by construction the
  point that cannot be drawn. Intuitions that are not models are exempt (`def.nat`'s
  `0`-convention note, `th.negative-base`'s teaching stance).
  *Background: the discussion that produced this (repeated addition vs scaling,
  whether ℝ has any adequate picture at all) is summarised in `docs/naturals.md`.*
  Informal, model-grounded, weighted toward the non-obvious (area model for
  distributivity; number-line "opposite" → subtraction; reciprocal → division;
  balance scale for congruence). It is **recognition on a model, not proof** —
  because `+`/`·` stay informally defined, the axioms can only be *exhibited* as
  evidently true, never derived. The page must never call this a proof.
- **Number typography: built, then deliberately removed (2026-07-17).** `\num{n}`
  (numeral in `\mathtt`) and `\nnum{n}` (a short raised "sign minus", the
  APL `¯` / "high minus" idea) existed for two sessions and are now **deleted**;
  `MathExpr.vue` is plain KaTeX with no macros. Do not reintroduce them. Why:
  - `\nnum` encoded a **fiction**. Standard notation has **no sign inside the
    numeral**. There is exactly one minus — the unary *operator* — plus brackets.
    The `−` in `−2` is the same operator applied to the constant `2` that `−a`
    applies to `a`. Marking "a number's own sign" teaches a distinction the
    notation does not implement — structurally the same broken promise as TI's
    `(-)` key, whose glyph *looks* like a literal and *parses* like an operator
    (which is exactly why `−2² = −4` while `Ans² = 4`).
  - `\num` went for a different reason: **KaTeX already sets numerals upright and
    variables italic**, and that italic/upright split *is* the international
    convention (ISO 80000-2). `\mathtt` was decoration over a distinction already
    present.
  - The survey that settled it: the raised minus exists only in *elementary
    education* (explicitly "training wheels", dropped by ~8th grade — our students
    are past it), *APL* (where it is a genuine literal and works, because APL
    committed), and *some early graphing calculators*. **Never in mathematics.**
    Historical note: APL took it from Max Beberman, a maths educator — the idea
    went education → APL, and mainstream maths declined it.
  - **Principle: do not invent notation students meet nowhere else.** Use the
    notation they will actually read, and *explain* it.
- **The carrier is `R`, discovered to be `ℝ`; tag `≙ ℝ`.** The meta introduces the
  set as `R` and reveals `R = ℝ` at the end. The axiom LaTeX still quantifies over
  `\mathbb{R}` (kept for readability). *Open tidy:* strict R-purism would use `R` in
  every `forall`; deferred as cheap and cosmetic.
- **"Sign" / "Vorzeichen" is retired entirely (2026-07-18).** Student-facing data
  never uses the word — not even reclaimed for the order meaning. `positive` /
  `negative` / `zero` carry everything, each defined via `<` on `op.lt`, made a
  clean three-way split by trichotomy (`ax.O1`). Retiring the word sidesteps the
  whole *Vorzeichen / Rechenzeichen* baggage. (This doc still discusses "sign" as a
  design term — deliberate; ids like `th.opposite-flips`, `ix.negative-factor` were
  renamed to keep the word out even internally.)
- **Naming vocabulary**, attached where it belongs: summands (`op.add`), factors +
  coefficient (`op.mul`), variable vs constant (`pre.1`), unary minus (`ax.A4`),
  multiplicative inverse (`ax.M4`), reciprocal (`def.div`), positive/negative
  (`op.lt`).
- **Codes** are prefixed by category: `pre.`, `op.`, `ix.`, `ax.`, `def.`, `th.`.
  Bilingual (English + Swiss German). Prose uses `$…$` for math and **no markdown**
  — the `RichText` renderer only does math, so `**bold**`/`*italic*` and em dashes
  `—` render literally (em dashes were purged for looking like `−`).

## Built (2026-07-18) — order + completeness

Order + completeness were once deferred; they are now **in** (see What it is). The
order relation `op.lt`, the four order axioms `ax.O1–O4`, the completeness axiom
`ax.C1`, the `positive`/`negative` definition on `op.lt`, and the order theorems
`th.3/th.5/th.6` plus the field theorem `th.4` all shipped. The tag moved to `≙ ℝ`.

## Deferred layers (not built)

- **The ℕ-indexed layer — BUILT 2026-07-22**, see `docs/naturals.md`. Numerals
  (`2 := 1+1`), multiples (`3a`) and natural powers (`aⁿ`) live in
  `src/data/naturals/cards.json` at `/naturals`. It does **not** smuggle in ℕ: the
  parked `pre.nat` import card was rejected as false, and `def.nat` carves ℕ out of
  ℝ as the smallest inductive subset, so the layer assumes nothing and induction
  (`th.ind`) is a theorem. Power laws are theorems by induction, as designed. The
  "atomic object, composite name" card shipped there as `th.negative-base`.
  Still deferred above it: ℤ (choice by permanence — `a⁰`, `a⁻ⁿ`), ℚ (existence —
  roots, needs `ax.C1`), and decimal numerals. The old `laws.json` (`def.power` →
  `thm.power-same-base`, `def.extended-exponents`, `def.root`) remains the worked
  reference for those.
- **The ℤ-exponent layer — BUILT 2026-07-22**, see `docs/integers.md`. `a⁰` and `a⁻ⁿ`
  as *choices forced by permanence*; `th.inverse-is-power` retroactively justifies this
  page's atomic `a^{-1}` notation. Only the ℚ floor (roots, existence, needs `ax.C1`)
  is left.

## The untangling backlog

The project's real thesis: at school level several *distinct* building blocks are
**conflated**, and that conflation is exactly what makes algebra hard. Teachers
stop seeing it with experience; students trip on it daily. Each item below is one
concept that lives in more than one layer at once (definition / theorem /
intuition / notation), and needs sorting before it is built.

- **Equality: number vs variable.** `a = a` is trivially true for a *fixed
  number*, but as a *variable* it is a universally-quantified claim; symmetry
  `a=b ⟹ b=a` is nearly content-free for numbers yet is the load-bearing "read the
  equation both ways" for variables. The equality intuitions we wrote lean on the
  number reading — the variable reading is where the real difficulty lives. Untangle
  which reading each equality axiom/intuition intends.
- **`3a = a + a + a` — RESOLVED 2026-07-22**, shipped in the naturals layer. The
  three homes are now three separate cards: a *definition* (`def.multiple`, copies),
  a *theorem* (`th.multiple-is-product`, copies coincide with `n·a`, hinging on
  `ax.D1`), and an *intuition* (the collapsed field, "three lengths end to end").
  The point of the split: school says all three in one voice, so nothing tells a
  student that one was chosen, one proved and one is only a picture.
- **`1.23·a`.** Repeated addition breaks (you cannot add `a` "1.23 times"), which
  forces the `n·a` view to generalise to `r·a` for any real `r` — i.e. plain
  multiplication. Also needs decimal **numerals** first (what `1.23` names). A good
  probe for where "multiple" stops and "product" takes over.
- **Minus / signed numbers — RESOLVED (2026-07-17).** There are exactly **two**
  minuses, not three: the **unary** operator (`ax.A4` — `−a` and `−2` alike) and
  **binary** subtraction (`def.sub`). The supposed third, "a number's own sign",
  **does not exist in the notation**. "Sign" is a property of an *element*
  (semantic; needs order *and* the field's `0`), never a feature of a *mark*.
  Calling the `−` in `−2` a sign fuses syntax with semantics and *causes* the
  `−2² = −4` surprise. Shipped in `ax.A4`, `th.2`, `ix.4`. **Update 2026-07-18:**
  `positive`/`negative` now built via order (`op.lt` + `ax.O1`), with `th.3`
  proving `−a` is negative *only* when `a` is positive; and the word "sign" was
  retired from the data entirely (see Design decisions).

- **Atomic object, composite name (2026-07-17) — SHIPPED 2026-07-22** as
  `th.negative-base` in the naturals layer (statement + derivation in the note, the
  teaching stance in `intuition`); this entry stays as the full rationale. ℝ's negative elements are full citizens: atomic,
  no internal structure. But the notation gives atomic **names** only to
  non-negatives (`2`); a negative gets only a **description** (`−2` = "apply the
  unary minus to `2`"). Hence the trap: **squaring looks at the object (→ 4);
  parsing looks at the name (→ −4)**. Both are right; they are different
  questions; the notation is silent about which one you asked.
  - **Brackets are the notation's name-maker.** `(−2)` is how a description is made
    to stand as one element. That — not "keeping the sign with the number" — is
    what `ix.4` is really for. Students learn brackets only as "do this first"
    (`ix.1`), never as "**this is one thing**": two jobs, one glyph, school teaches
    one.
  - **The students are never wrong.** They assume *referential* atomicity implies
    *syntactic* atomicity — true for every number they met before age 11. The
    teaching debt is a **completion**, not a correction: "you were right that −2 is
    a number; nobody told you our notation has no name for it." Framing it as a
    reversal is what manufactures the sense of betrayal.
  - Receipts for the card: TI's `2−4` ENTER → `Ans²` = **4** (the *object*) vs
    `(-)2` `x²` = **−4** (the *expression*) — the device demonstrates both
    faithfully and labels neither. Excel dissents (`−2² = 4`); TI does **not** —
    TI matches standard maths, and its `(-)` key is documented as "multiplying by
    −1", i.e. it ships `th.2` as its implementation.
  - Fractions share the trap (`2/3² ≠ (2/3)²`); negatives are worse off, having
    **no** atomic spelling at all, ever.
  - Pedagogical spine (settled): read the minus via `th.2` as `(−1)·`. Then
    `−2² = (−1)·2² = −4` follows from the precedence rule students *already own*
    (`ix.3`, powers bind tighter than products) — it **derives** the rule instead
    of decreeing it, and needs no "the power binds to the 2" PEMDAS edict.
- **Powers & roots — half done (2026-07-22).** The *theorem* half is built: all
  natural-exponent laws are proved by induction in the naturals layer, plus
  `pl.no-sum-law` (there is no law for sums, by counterexample). Still open: the
  definitions-by-choice (`a⁰ := 1`, `a⁻ⁿ := 1/aⁿ`, extension by permanence — the ℤ
  layer, where the arrow reverses and the laws *force* the definition) and the
  existence half (roots and rational powers, needing `ax.C1`). See `docs/naturals.md`.
- **The exponent `-1` / `-n`.** One glyph string, three readings: `b^{-1}` at
  fundament0 is *atomic notation* for the inverse (ax.M4), where the `-1` is
  decorative — not the number `-1`, and not a power (powers don't exist here). In
  the later powers layer, `a^{-1}` is re-read as `a` to the integer *literal* `-1`,
  while `a^{-n}` uses the additive-inverse *operator* on the *variable* `n`. They
  are unified by the extension-by-permanence choice `a^{-n} := 1/a^n`. (The
  typographic "conflation-detector" invariant that used to live here died with the
  number font — see Design decisions.)
- **Inverse notation is asymmetric.** Addition's inverse has a named unary
  *prefix* operator (`-a`, the *unary minus*); multiplication's has *no* prefix
  operator, forcing postfix `a^{-1}` (or the fraction `1/a`). This asymmetry is
  likely why the multiplicative inverse feels more awkward. `a^{-1}` (primitive,
  ax.M4) vs `1/a`: the fraction *looks* more elementary but is downstream —
  `1/a = 1·a^{-1}` needs division (`def.div`), itself defined from the inverse. So
  keep `a^{-1}` at the axiom; introduce `1/a` as the derived equivalent later.
  Proposed word split: "multiplicative inverse" + `a^{-1}` (primitive) vs
  "reciprocal" + `1/a` (derived) — so the name "reciprocal" travels with `1/a`.
- **Sign vs unary minus — SUPERSEDED, then RETIRED (2026-07-18).** The old rule
  ("reserve 'sign' for literals; only `-b` with a *variable* operand is the unary
  minus") was too weak, wrong in the same direction as `\nnum`: the `−` in `−2` is
  the unary *operator* too, exactly as in `−b`. The interim fix ("'sign' describes
  *elements*, never *marks*") was then dropped in favour of dropping the word
  outright — the data now uses only `positive`/`negative`/`zero`, defined via `<`.
  - Still worth remembering: the German-school *Vorzeichen / Rechenzeichen*
    tradition names a distinction its own notation does not implement (which is why
    Beberman and Iverson had to invent `⁻`/`¯`). Where the tradition is right is
    **binary vs unary** (`def.sub` vs `ax.A4`) — real, and TI enforces it in
    hardware with two separate keys.

## Verifying edits

Data is one plain-JSON file per layer, `cards.json`, consumed directly by the view
(no Zod schema, unlike the skills tower). **`pnpm sweep-layers`** now runs the whole
checklist below over every layer in the manifest, except the two build steps; the
structural half also runs at load time in `src/data/layers.ts`. The list, for when
a check needs changing:

- **KaTeX** over every `$…$` fragment and every `latex`/`derivation`/`cond`/
  `forall`/`avoid`/`prefer` field, **with no macros defined** (proves nothing
  depends on `\num`/`\nnum` again).
- **`vue-tsc --noEmit`** and **`vite build`** (a `vite` boot to `200` is the serve
  check; no browser tooling installed for pixels).
- No em dashes / stray markdown (they render literally; `—` also reads as `−`), no
  `ß` in German, no "sign"/"Vorzeichen" leak.
- Every `derivedFrom`/`basedOn` code resolves against a card `code`, and every card
  code is unique.
- Every non-`preliminary` card has `concerns`; every `concerns` token is one of
  `add·mul·eq·order·completeness`.
