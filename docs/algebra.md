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

## The fractions — built 2026-07-23, and split across three layers

The fraction cluster does not sit in one place, because the same filing logic that
moved the binomials up here sends its pieces to three different floors:

- **The notation is fundament0's.** `def.div` already writes `\frac{a}{b}`, so by the
  tower's own rule — *a statement cites the convention it cannot be written without* —
  the bar had to be a convention below it, not above. `ix.fraction-bar` and
  `ix.division-signs` joined the `infix` section's *reading* group, and `def.div` now
  cites `ix.fraction-bar`.
- **The quotient power laws are powers'.** `th.pow-quotient-same-base` (ℤ act) and
  `th.pow-of-quotient` (ℤ act) are statements about exponents wearing a bar, not facts
  about fractions; `th.root-laws` (ℚ act) is the same two laws in radical form.
- **The transformations are algebra's** — the `fractions` section here.

### `ix.fraction-bar` is the load-bearing one

*The bar is a bracket you do not write.* It does two jobs and the second is invisible:
it divides, and it groups, so everything above is one object and everything below is
another with no bracket written anywhere. Four of the error patterns corrupt exactly
this and now point at the card: `mis.fraction-bar-grouping-lost` (`(a+b)/c → a + b/c`,
the brackets dropped), `mis.linear-slash-overgrouped` (the reverse, brackets invented),
`mis.bar-not-division` (the bar read as a picture rather than an operation), and
`anti.linearity`'s `\frac{3x+2}{3} = x + 2`.

Its intuition is *parts of a whole* and its stopping point is early and worth knowing:
that reading makes the bar a **picture** rather than an operation, so `7/4` has no cake
to be four quarters of and `a/b` has nothing to cut. Read `a : b` instead.

### The three transformation cards say one thing

**Where a move is allowed to reach.** `th.split-numerator` and
`th.cancel-common-factor` reach **factors, never summands**, and the derivations show
why rather than asserting it:

- Splitting works upstairs because `(a+b)·c⁻¹` has the sum in a **factor** position, so
  `ax.distributivity` applies. It fails downstairs because `c·(a+b)⁻¹` has the sum
  **inverted**, and no axiom distributes over an inverse. That is the whole reason
  `3/(x+2) ≠ 3/x + 3/2`.
- Cancelling removes a factor paired with its own inverse, `c·c⁻¹ = 1`. In
  `(a+c)/(b+c)` there is nothing to pair — `c` is a summand and no `c⁻¹` is anywhere
  near it, so the chain cannot even begin.
- `th.fraction-minus-moves` reaches everywhere, and for the opposite reason: by
  `th.negative-one-times` the minus **is** a factor, and a product does not care where
  a factor stands. Three positions, not eight combinations — moving it twice puts it
  back.

`th.divide-by-one` carries the case worth saying out loud: `a/a = 1` is not a rule
about the same thing appearing above and below. Unfolded by `def.div` it **is**
`ax.multiplicative-inverse`, which is also exactly why `0/0` is not `1` — the axiom
hands out an inverse for every element except `0`, so the condition is the reach of the
axiom rather than caution.

## Not built

`thm.minus-over-sum`, `thm.subtract-a-sum`, `thm.collect-like-terms`,
`thm.root-power-order` — all that is left of `laws.json`. **`conventions.json` is
empty**: every convention it held is now a card.
