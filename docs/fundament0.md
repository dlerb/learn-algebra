# fundament0 — the clean field-axioms layer

A deliberately isolated rebuild of the very bottom of algebra, mathematically
stricter than the existing `laws.json` tower, which it does not touch. It lives
in `src/data/fundament0/` and renders at `/fundament0`
(`src/views/Fundament0View.vue`). This doc records the *why* and the open
threads, not the content tables (they would drift — read the JSON).

## What it is

`fundament0` is a **specification of a field** — not a construction of ℝ.

*(The original phrasing, "a field over ℝ", was wrong twice: in algebra "over"
means extension — a field over ℝ is something like ℂ — and fixing the carrier to
the set ℝ contradicts the very next sentence, that ℚ satisfies the axioms too.
Fixed 2026-07-17.)*

The elements are treated as abstract: they have no properties beyond what the
axioms give them. `0`/`1` exist by axiom; `2` is a *name* for `1+1`; `−2`
*describes* the additive inverse of `2`. Every law here holds in ℚ just as well,
so **nothing proved at this floor can tell ℝ from ℚ** — and order would not
separate them either. Only completeness pins it down: **ℝ is the unique complete
ordered field.** That gives the tower its narrative motor — at each floor, ask
"what else still satisfies this?", and the answer names what you have not yet
said.

Naming each floor honestly matters: nearly all symbolic manipulation is
field-level, and saying "ℝ" before it is earned hides where the real analysis
content begins. The axioms earn their place **not by constructing ℝ** — nobody
needs axioms to discover that 2+2=4 — **but by dependency bookkeeping**: making
visible which property rests on which assumption (`−a` is the opposite → no
order; `−a` is *negative* → order; `√2` exists → completeness). That bookkeeping
*is* the untangling thesis.

The page tells one linear story:

0. **Preliminaries** (`pre.1`, `pre.2`) — `pre.1` *The elements*: no properties
   beyond what the axioms give; `0`/`1` by axiom, `2` a name for `1+1`, `−2` the
   additive inverse of `2`; if a property is not in the axioms it is not available
   here, which is the whole point. `pre.2` *Variables & constants* — letters stand
   for an arbitrary element, named elements are constants, told apart by the
   ordinary italic/upright convention (no house typography; see Design decisions).
1. **Operations & relation** — the given data: `+`, `·` (both `ℝ×ℝ→ℝ`) and `=`
   (a relation `ℝ×ℝ→{true,false}`). Codes `op.add`, `op.mul`, `op.eq`. Naming lives
   here: summands (`+`), factors and coefficient (`·`).
2. **Infix convention** — *reading* rules (`ix.1` brackets, `ix.2` left-to-right,
   `ix.3` precedence) and *writing* conventions (`ix.4`–`ix.6`: bracket a negative
   factor, no operator next to a unary minus, coefficient in front). Placed
   *before* the axioms on purpose: association and distribution cannot even be
   *stated* without brackets and precedence. Parsing is only a problem because we
   chose infix — `·(a, +(b,c))` needs no rules.
3. **The field axioms** — Equality (`ax.E1–E4`), Addition (`ax.A1–A4`),
   Multiplication (`ax.M1–M4`), Bridge (`ax.D1` distributivity, `ax.N1` `0≠1`).
   Each carries a collapsed, model-grounded `intuition`.
4. **Definitions** — subtraction (`def.sub`, rests on `ax.A4`) and division
   (`def.div`, rests on `ax.M4`; the reciprocal `1/a = a⁻¹` is its special case,
   noted there). Not new operations.
5. **Theorems** — derived results, not padding: `th.1` (`0·a = 0`, *forced* by the
   axioms) and `th.2` (`-a = (-1)·a`, the additive inverse as "multiply by −1" —
   a cross-world bridge via distributivity). Each shows a collapsed derivation and
   cites what it rests on. (Notation identities like `1/a = a⁻¹` stay in the
   relevant definition's note, not here.)

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
- **Naming vocabulary**, attached where it belongs: summands (`op.add`), factors +
  coefficient (`op.mul`), variable vs constant (`pre.1`), unary minus (`ax.A4`),
  multiplicative inverse (`ax.M4`), reciprocal (`def.div`).
- **Codes** are prefixed by category: `pre.`, `op.`, `ix.`, `ax.`, `def.`, `th.`.
  Bilingual (English + Swiss German). Prose uses `$…$` for math and **no markdown**
  — the `RichText` renderer only does math, so `**bold**`/`*italic*` and em dashes
  `—` render literally (em dashes were purged for looking like `−`).

## Deferred layers (not built)

- **Order + completeness** — the two axioms that upgrade "a field" to ℝ. Needed
  for `a ≥ 0`, inequalities, and the *existence* of roots (`√2` is not in ℚ).
- **The ℕ-indexed layer** above the field — multiples (`3a`), powers (`aⁿ`), and
  numerals (`2 := 1+1`, decimal). These all smuggle in ℕ (counting/repetition),
  so they sit *above* fundament0, not inside it. Natural-power laws are theorems
  from the definition plus `ax.M1`/`ax.M2` (by induction, no new axioms); roots
  and rational powers need the order+completeness slab first. The existing
  `laws.json` (`def.power` → `thm.power-same-base`, `def.extended-exponents`
  "extension by permanence", `def.root`) is the worked reference.

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
- **`3a = a + a + a`.** Straddles three layers: a *definition* (multiple = repeated
  addition), a *theorem* (`3a = 3·a` via distributivity, where `3 = 1+1+1`), and an
  *intuition* ("three copies"). One glyph pattern, three homes.
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
  `−2² = −4` surprise. Shipped in `ax.A4`, `th.2`, `ix.4`.

- **Atomic object, composite name (2026-07-17) — the sharpest card in the design,
  waiting on the power layer.** ℝ's negative elements are full citizens: atomic,
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
- **Powers & roots.** Which power laws are theorems (natural exponents: all, from
  the definition + `ax.M1`/`ax.M2` + induction), which are definitions-by-choice
  (`a⁰ := 1`, `a⁻ⁿ := 1/aⁿ`, extension by permanence), and which need new axioms
  (roots and rational powers need order + completeness). See Deferred layers.
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
- **Sign vs unary minus — SUPERSEDED (2026-07-17).** The old rule ("reserve 'sign'
  for literals; only `-b` with a *variable* operand is the unary minus") was too
  weak, and wrong in the same direction as `\nnum`: the `−` in `−2` is the unary
  *operator* too, exactly as in `−b`. **New rule: "sign" describes *elements*,
  never *marks*.** "The sign of `−2` is negative" ✓ — an order fact about the
  element. "The `−` in `−2` is a sign" ✗ — there is no such thing.
  - Note the German-school angle: the *Vorzeichen / Rechenzeichen* tradition names
    a distinction its own notation does not implement, which is precisely why
    Beberman and Iverson had to invent `⁻`/`¯` to build the thing the tradition
    talks about. Where the tradition is right is **binary vs unary** (`def.sub` vs
    `ax.A4`) — that distinction is real, and TI enforces it in hardware with two
    separate keys.

## Verifying edits

Data is plain JSON consumed directly by the view (no Zod schema yet, unlike the
skills tower). After editing: run a KaTeX render sweep over every `$…$` fragment
and every `latex` field, `vue-tsc --noEmit`, and a `vite` serve check. Watch for
stray markdown/em dashes (they render literally).
