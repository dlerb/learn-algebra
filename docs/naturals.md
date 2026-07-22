# naturals — the ℕ-indexed layer

The second layer of the tower, sitting directly on **fundament0** (`docs/fundament0.md`).
Data: `src/data/naturals/cards.json`; page: `/naturals`. Tag: **`≙ ℕ ⊂ ℝ`**.

## What it is

The layer that makes *counting* available and then spends it twice: on **multiples**
($n$ copies added) and on **powers** ($n$ factors multiplied). It is the first layer
since the axioms that **assumes nothing** — only definitions and their consequences.

## The ℕ-entry decision (2026-07-22)

The parked draft (`powers.json`, now replaced) imported ℕ as *"a genuine new
assumption (like order and completeness)"*. **That was rejected as false.** In a
field, ℕ is *definable*: `def.nat` takes the smallest inductive subset (intersection
of all $S$ with $1 \in S$ and $x \in S \Rightarrow x+1 \in S$). Nothing is imported.

Consequences that make this the right call, not merely the correct one:

- **Induction is a theorem** (`th.ind`), one line off the definition, not a borrowed
  axiom. In school it is an exotic technique; here it is the definition read backwards.
- **`th.multiple-is-product` says "agree", not "correspond".** Because ℕ ⊆ ℝ, the two
  $n$'s in $\underbrace{a+\dots+a}_{n} = n \cdot a$ are literally the *same object*.
  An imported ℕ would have forced a map ℕ → ℝ and a weaker statement.
- The move is set-quantifying, the same flavour as `ax.C1` — but `C1` *assumed*,
  this *defines*, and a definition may always be made.

What survives from the draft's instinct is sharper than what it claimed: **`n` in
$a^n$ is used as a counter, not as a field element** (`pre.count`). Same object,
two roles. Exponentiation is not a field operation and its upper slot is not a field slot.

## Settled decisions

- **$0 \notin \mathbb{N}$ here.** $1$ is what `ax.M3` hands us; $0$ would have to be
  fetched from `ax.A3` for no work it does in this layer, and starting at $0$ would
  give $a^0$ away as a base case, which the powers design specifically does not want.
  Swiss textbooks usually include $0$ — that mismatch is **stated on the card**, and
  stated as the point: whether $0$ is natural is a **convention, not a fact**, and
  conventions and facts arrive in the same voice.
- **Numerals stop at ℕ.** `def.numeral` names one element at a time ($2 := 1+1$).
  Decimal/positional notation is a different machine and belongs upstairs, where it
  also has to explain $1.23$.
- **`th.numerals-distinct` needs order.** That $2 \neq 3$ is not a field fact (a field
  may satisfy $1+1=0$); `th.6` + `ax.O3` + `ax.O2` is what stops counting from looping.
  The sharpest dependency-bookkeeping card in the layer.
- **`ix.juxtaposition` justifies `ix.6` rather than re-licensing it.** fundament0
  already *prefers* $3a$; this card supplies the proof that the abbreviation loses
  nothing, plus the two limits (not between numerals — $34$ is another name; and it
  says *which* multiplication, not how tightly it binds).
- **`pl.no-sum-law` is kept as a card.** A negative claim by counterexample, and the
  first such card in the tower. It sits one card after `pl.of-product`, and the
  contrast is doing the teaching: powers pass through products because they are made
  of products, and not through sums because they are not made of sums.
- **`th.negative-base` is filed under theorems, not conventions.** Its content is a
  derivation ($-2^2 = (-1)\cdot 2^2$ via `th.2`, then `ix.3`), not an agreement — and
  that filing also puts it last on the page, where the payoff belongs. This is the
  "atomic object, composite name" card the backlog had been holding for the power
  layer; the teaching stance ("students are never wrong; a completion, not a
  correction") lives in its `intuition`.

## Page order

`Preliminaries` (pre.count) → `Notation` (ix.pow · ix.juxtaposition) → `Definitions`
(def.nat, def.numeral · def.multiple · def.pow) → `Theorems` (th.ind,
th.numerals-distinct · th.multiple-is-product · pl.same-base, pl.of-power,
pl.of-product, pl.no-sum-law, th.negative-base).

Sections are **kinds**; "numbers / multiples / powers" are **groups** inside them, so
a topic's definition and its theorem sit in different sections and are read together.

**Codes are slug-style, never numbered** (`th.ind`, not `th.7`) so nothing can collide
with fundament0's `th.1…th.6` now that citations resolve tower-wide.

## Deferred (not built)

- **ℤ — choice by permanence.** $a^0 := 1$, $a^{-n} := 1/a^n$. The arrow reverses:
  the laws become the constraint and *force* the definition. `pl.same-base` is the
  card the whole layer is built to preserve.
- **ℚ — existence.** Roots and rational exponents; needs `ax.C1` and $a > 0$.
- **Decimal numerals**, and with them the full `1.23·a` card — planted in
  `th.multiple-is-product`'s intuition (copies run out, the product does not).
- **The multiples/powers divergence card.** Coefficients dissolve into ordinary `·`
  at ℚ; exponents never do. Statable only where both stories are visible.
