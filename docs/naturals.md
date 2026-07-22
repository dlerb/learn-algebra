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

### The "counter vs element" framing — RETIRED 2026-07-22

The first build described `n` in $a^n$ as a **counter** rather than a field element,
"same object, two jobs". The user pushed back: if ℕ ⊆ ℝ there is nothing to identify,
so the distinction sounds artificial. **They were right, and the web check confirms
where the framing came from and why it does not apply here:**

- In general algebra it is real. For an abelian group $A$, the multiple $na$ is an
  **external** operation, the ℤ-module action $\mathbb{Z} \times A \to A$, and ℤ genuinely
  is not a subset of $A$. What reconnects them in a ring is the canonical homomorphism
  $\mathbb{Z} \to R$, $n \mapsto n \cdot 1_R$, whose kernel defines the *characteristic*.
- `th.multiple-is-product` is that comparison, specialised. **In ℝ the map is injective
  (characteristic 0) and `def.nat` takes ℕ to *be* its image** — so the distinction does
  not get identified away, it never arises. Worth knowing as the answer to "why do
  algebra books make a fuss about $na$ then?"

What replaces it, and is stated on the cards instead:

1. **The slots draw from different sets.** $r \cdot a$ accepts any $r \in \mathbb{R}$;
   $a^n$ accepts only $n \in \mathbb{N}$. $a^{\sqrt 2}$ is not withheld, it does not exist yet.
2. **$n \mapsto a^n$ is a map *out of* ℕ** — in grown-up terms a homomorphism
   $(\mathbb{N},+) \to (\mathbb{R},\cdot)$, which is exactly `pl.same-base` — and there is **no field
   operation for it to be a restriction of**. $n \cdot a$ *is* a restriction of one.
   That asymmetry is the honest content, and it predicts the ℚ fence: extending
   $r \cdot a$ costs nothing, extending $a^r$ must be built and only works for $a > 0$
   ($(-2)^3$ is fine, $(-2)^{1/2}$ has no value).

The user's own reading, now on `ix.pow`: $a^3 = a^{1+1+1}$, **one factor of $a$ per $1$
in the exponent**. It is `pl.same-base` read backwards, and it is well defined only
because each element of ℕ is reached from $1$ in exactly one way — i.e. it *is* the
recursion, said in words. Prefer it to any formal phrasing.

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
- **`th.numeral-arithmetic` (added 2026-07-22, the user's point).** $2+3=5$ by `ax.A2`,
  $2 \cdot 3 = 6$ by `ax.D1`. The times table is a list of **theorems**, not a table, and
  the axioms that prove its entries are the ones later used on letters. Doing arithmetic
  and doing algebra are not two subjects. A standard first-week exercise elsewhere.
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
th.numerals-distinct, th.numeral-arithmetic · th.multiple-is-product · pl.same-base,
pl.of-power, pl.of-product, pl.no-sum-law, th.negative-base).

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

## References checked (2026-07-22)

- **`def.nat` is the textbook move**, not an invention: ℕ as the intersection of all
  inductive subsets, induction from minimality — Spivak *Calculus* ch. 2,
  [Zakon *Mathematical Analysis* §2.2](https://math.libretexts.org/Bookshelves/Analysis/Mathematical_Analysis_(Zakon)/02:_Real_Numbers_and_Fields/2.02:_Natural_Numbers._Induction)
  (stated for an arbitrary field, our setting exactly),
  [ProofWiki](https://proofwiki.org/wiki/Definition:Natural_Numbers/Inductive_Sets_in_Real_Numbers).
- **ℤ-module action / characteristic** (why the counter framing exists and why ℝ
  dissolves it): [Beachy, *Abstract Algebra Online*](https://faculty.niu.edu/math_beachy/aaol/modules.shtml).
- **`def.pow` matches the standard monoid/semigroup definition**, including starting
  at $a^1 := a$: [ProofWiki, Power of Element](https://proofwiki.org/wiki/Definition:Power_of_Element/Monoid),
  [Index Laws for Monoid](https://proofwiki.org/wiki/Index_Laws_for_Monoid).
- **`th.numeral-arithmetic` is standard fare**: $2+2=4$ from $2 := 1+1$ and associativity
  appears as a first-week exercise, e.g. [Reed math112](https://people.reed.edu/~mayer/math112.html/html1/node16.html),
  [UChicago IBL sheet 6](https://www.math.uchicago.edu/~boller/IBL/M162script6.pdf).
- **Keith Devlin, *It Ain't No Repeated Addition* (MAA, 2008)** — the same claim as
  `th.multiple-is-product`'s intuition (repeated addition is not what multiplication
  *is*; the model breaks at fractions; scaling is the general notion), and a live
  argument among teachers, so worth knowing before a colleague raises it.
  [Overview](https://en.wikipedia.org/wiki/Multiplication_and_repeated_addition).
