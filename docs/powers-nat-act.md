# powers · the ℕ act (was the `naturals` layer)

The first of the three acts of the **powers** layer (`docs/powers.md`), merged in
2026-07-23. Sections `nat-notation` / `nat-definition` / `nat-laws` of
`src/data/powers/cards.json`; page `/powers`. This file is the design record for
the act; the layer-level structure lives in `docs/powers.md`.

## What it is

**Repetition made into an operator.** `def.pow` defines $a^n$ by recursion along the
counting elements — one more factor at each step — and the three power laws follow by
induction. It assumes nothing: $a^n$ is an abbreviation for a product that could always
have been written out.

ℕ itself is **not defined here** — it and `th.ind`, `def.numeral`, `def.multiple` moved
down to the **numbers** layer on 2026-07-23 (see `docs/numbers.md`, "Extracted from the
powers layers"). This layer uses ℕ for one purpose: as the place an exponent may live.

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

- **`pl.no-sum-law` is kept as a card.** A negative claim by counterexample, and the
  first such card in the tower. It sits one card after `pl.of-product`, and the
  contrast is doing the teaching: powers pass through products because they are made
  of products, and not through sums because they are not made of sums.
- **`th.negative-base` is filed under theorems, not conventions.** Its content is a
  derivation ($-2^2 = (-1)\cdot 2^2$ via `th.negative-one-times`, then `ix.precedence`), not an agreement — and
  that filing also puts it last on the page, where the payoff belongs. This is the
  "atomic object, composite name" card the backlog had been holding for the power
  layer; the teaching stance ("students are never wrong; a completion, not a
  correction") lives in its `intuition`.

## Page order

`Notation` (ix.pow) → `Definitions` (def.pow) → `Theorems` (pl.same-base,
pl.of-power, pl.of-product, pl.no-sum-law, th.negative-base).

**Codes are slug-style, never numbered** (`pl.same-base`, not `th.zero-product`) so nothing can
collide with fundament0's theorem codes now that citations resolve tower-wide.

## Deferred (not built)

- **ℤ — choice by permanence.** $a^0 := 1$, $a^{-n} := 1/a^n$. The arrow reverses:
  the laws become the constraint and *force* the definition. `pl.same-base` is the
  card the whole layer is built to preserve.
- **ℚ — existence.** Roots and rational exponents; needs `ax.completeness` and $a > 0$.

## References checked (2026-07-22)

- **ℤ-module action / characteristic** (why the counter framing exists and why ℝ
  dissolves it): [Beachy, *Abstract Algebra Online*](https://faculty.niu.edu/math_beachy/aaol/modules.shtml).
- **`def.pow` matches the standard monoid/semigroup definition**, including starting
  at $a^1 := a$: [ProofWiki, Power of Element](https://proofwiki.org/wiki/Definition:Power_of_Element/Monoid),
  [Index Laws for Monoid](https://proofwiki.org/wiki/Index_Laws_for_Monoid).
