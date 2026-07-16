# fundament0 — the clean field-axioms layer

A deliberately isolated rebuild of the very bottom of algebra, mathematically
stricter than the existing `laws.json` tower, which it does not touch. It lives
in `src/data/fundament0/` and renders at `/fundament0`
(`src/views/Fundament0View.vue`). This doc records the *why* and the open
threads, not the content tables (they would drift — read the JSON).

## What it is

`fundament0` characterises **a field over ℝ** — explicitly *a field*, not ℝ
itself. Every axiom here already holds in ℚ; the **order** and **completeness**
that single out ℝ are deliberately deferred (see Deferred layers). Naming it
honestly matters: nearly all symbolic manipulation is field-level, and pretending
the slab is "ℝ" hides where the real analysis content begins.

The page tells one linear story:

1. **Operations & relation** — the given data: `+`, `·` (both `ℝ×ℝ→ℝ`) and `=`
   (a relation `ℝ×ℝ→{true,false}`). Codes `op.add`, `op.mul`, `op.eq`.
2. **Infix convention** — the parsing rules (`ix.1` brackets, `ix.2` left-to-right,
   `ix.3` precedence). Placed *before* the axioms on purpose: association and
   distribution cannot even be *stated* without brackets and precedence. Parsing
   is only a problem because we chose infix — `·(a, +(b,c))` needs no rules.
3. **The field axioms** — Equality (`ax.E1–E4`), Addition (`ax.A1–A4`),
   Multiplication (`ax.M1–M4`), Bridge (`ax.D1` distributivity, `ax.N1` `0≠1`).
4. **Built on top: definitions** — subtraction (`def.sub`, rests on `ax.A4`) and
   division (`def.div`, rests on `ax.M4`). Not new operations.

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
- **Codes** are prefixed by category: `op.`, `ix.`, `ax.`, `def.`. Bilingual
  (English + Swiss German). Prose uses `$…$` for math and **no markdown** — the
  `RichText` renderer only does math, so `**bold**`/`*italic*`/`—` render
  literally (em dashes were purged for looking like `−`).

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
- **Minus / signed numbers.** `−a` as the additive *inverse* (an element), vs the
  *sign* of a number, vs *binary subtraction* `a − b`. One glyph, three meanings —
  the central conflation the whole app targets.
- **Powers & roots.** Which power laws are theorems (natural exponents: all, from
  the definition + `ax.M1`/`ax.M2` + induction), which are definitions-by-choice
  (`a⁰ := 1`, `a⁻ⁿ := 1/aⁿ`, extension by permanence), and which need new axioms
  (roots and rational powers need order + completeness). See Deferred layers.
- **The exponent `-1` / `-n`.** One glyph string, three readings: `b^{-1}` at
  fundament0 is *atomic notation* for the inverse (ax.M4), where the `-1` is
  decorative — not the number `-1`, and not a power (powers don't exist here). In
  the later powers layer, `a^{-1}` is re-read as `a` to the integer *literal* `-1`,
  while `a^{-n}` uses the additive-inverse *operator* on the *variable* `n`. They
  are unified by the extension-by-permanence choice `a^{-n} := 1/a^n`. Typographic
  upshot (a good invariant): the number font marks *literals only* — variables
  (incl. variable exponents) stay italic, and the inverse marker `^{-1}` stays
  plain. The number font thus acts as a conflation-detector: every numeral-looking
  mark forces the "literal / variable / notation?" decision school glosses over.

## Verifying edits

Data is plain JSON consumed directly by the view (no Zod schema yet, unlike the
skills tower). After editing: run a KaTeX render sweep over every `$…$` fragment
and every `latex` field, `vue-tsc --noEmit`, and a `vite` serve check. Watch for
stray markdown/em dashes (they render literally).
