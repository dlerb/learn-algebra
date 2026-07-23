# algebra — where the tower stops describing and starts transforming

The fourth and last layer of the tower, on top of **powers** (`docs/powers.md`).
Data: `src/data/algebra/cards.json`; page: `/algebra`.
Tag: **`≙ expand · collect · cancel`**. Started 2026-07-23, **deliberately unfinished.**

## What it is, and why it is a layer rather than a section

Every layer below says what things **are** — what the operations satisfy
(`fundament0`), which subsets of ℝ have names (`numbers`), how one operation extends
across a widening exponent (`powers`). Here every card says what may be **done** to an
expression that has parts: expand a product of sums, collect what repeats, cancel what
undoes itself.

Nothing new is assumed to do it. Every card is `ax.distributivity`,
`ax.mul-commutative` and the inverses again — the only new thing is that the objects
are **compound**, so a move can reach *inside* one.

That is also why this is the layer the **skills tower** talks to. A drill is nearly
always one of these moves carried out on particular material, which is why the error
patterns point here rather than at the axioms.

## Why `th.binomial-square` moved up here (2026-07-23)

It was built the same day into `powers`, next to `pl.no-sum-law`, on the argument that
the negative result and its repair belong side by side. That was right about the
pedagogy and wrong about the filing, and the deciding case is
**`th.difference-of-squares`**: `(a+b)(a−b) = a² − b²` is not a statement about
exponents at all, it is a product of two sums that happens to yield squares. Filing it
under a layer tagged `aⁿ, n ∈ ℕ→ℤ→ℚ` would be wrong, and splitting the three binomial
identities across two layers would be worse.

The adjacency is kept as a **forward pointer** in `pl.no-sum-law`'s note — house style
already, since the ℕ act's note defers `a⁰` and fractional exponents to "the two
layers above".

## The binomials — three cards, one mechanism

Each expands a product of two sums with `ax.distributivity` and then collects. All
that differs is what the two **mixed products** do, and between them they do all three
possible things:

| card | statement | the mixed products |
|---|---|---|
| `th.binomial-square` | `(a+b)² = a² + 2ab + b²` | **double** — `ab` and `ba` are one element (`ax.mul-commutative`), so they collect and the `2` counts them |
| `th.square-of-difference` | `(a−b)² = a² − 2ab + b²` | **survive with a minus** |
| `th.difference-of-squares` | `(a+b)(a−b) = a² − b²` | **cancel** by `ax.additive-inverse` |

Teaching points carried on the cards:

- **`th.square-of-difference` is not a second identity.** It is the first with `b`
  replaced by `−b`: `def.sub` turns the difference into a sum, `th.binomial-square`
  applies unchanged, then `th.negative-one-times` puts a minus on the middle term and
  `th.minus-times-minus` keeps it off the last one. School presents the two as a pair
  to memorise, which doubles the load and hides the reason. **Writing `−b²` at the end
  is `th.negative-base` one layer down**, met again inside a longer expression.
- **`th.difference-of-squares` read right to left is the first factoring pattern** —
  the more valuable direction and the harder one. Its note also says what the card does
  *not* say: there is no matching factorisation of a *sum* of two squares, and not for
  want of looking.
- Its `intuition` is the L-shaped cut, plus `19·21 = 400−1`. Stopping point: the
  picture needs `b < a` and both to be lengths; the identity does not care, and
  `a = 2, b = 5` is as true as any other case.

## Not built

**The fraction bar** — the other half of the spec in `docs/TODO.md`. `def.div` defines
`a/b := a·b⁻¹` and stops; every `ix.*` convention is about *linear* infix, so nothing
in the tower yet says the bar is two-dimensional and groups both its parts without
writing a bracket. That is where most of the remaining school algebra lives:
`conv.fraction-bar`, `conv.division-signs`, `thm.split-numerator`,
`thm.cancel-common-factor`, `thm.fraction-sign-moves`, `thm.divide-by-one`, the two
quotient power laws, `thm.root-of-quotient`. Also outstanding: `thm.collect-like-terms`
and the minus-over-sums group.
