# rationals — the ℚ-exponent layer

The fifth and last layer of the tower, on top of **integers** (`docs/integers.md`).
`def.rat` moved to the **numbers** layer on 2026-07-23 (`docs/numbers.md`); what
remains here is powers only.
Data: `src/data/rationals/cards.json`; page: `/rationals`. Tag: **`≙ aⁿ, n ∈ ℚ`**.

## What it is

The step where **permanence stops being able to pay for itself**. Permanence always
demands a value; what has differed layer to layer is *who supplies it*:

| layer | the demand | who supplies |
|---|---|---|
| ℕ | none — the recursion builds it | **we do**, by construction |
| ℤ | $a^{-n}$ must invert $a^n$ | **the field**, via `ax.multiplicative-inverse` (`def.pow-neg` exhibits $(a^{-1})^n$) |
| ℚ | $a^{1/n}$ must be an $n$-th root of $a$ | **nobody below `ax.completeness`** |

Demand `pl.same-base` for the exponent $1/n$ and $\left(a^{1/n}\right)^n = a$ follows —
so $a^{1/n}$ has to be an $n$-th root. In ℤ the analogous demand described something we
could then point at. Here the description is all there is, and ℚ is the proof: nothing
rational squares to $2$, though the demand for $2^{1/2}$ is as reasonable there as
anywhere. **The question stops being *what value* and becomes *is there a value*,** and
that question is not algebraic.

**This is what `ax.completeness` was for.** Every other card in the tower could have been written
in ℚ and stayed true. `th.root-exists` is false in ℚ, and that is the exact content of
the word *complete*.

## Second theme: definitions carry existence obligations

`def.pow` had none (a recursion always defines something). `def.pow-neg` discharged one
in a line by exhibiting a witness. `def.root` needs a theorem resting on an axiom.
Students meet definitions as free stipulations; three cards in this tower say otherwise,
with rising difficulty, and this layer is where the rise becomes visible.

## Settled decisions

- **`def.root` is a definition by description**, licensed by `th.root-exists` *below* it
  in the ladder. The awkwardness was kept and turned into content: the card says outright
  that a definition may name only something that is there, and that here the obligation
  is real work. A forward-declared theorem would have cost more than it bought.
- **`th.root-exists` splits cleanly, and the split is the point.** *Uniqueness* is pure
  order (`ax.order-mul` + induction). *Existence* is completeness and nothing else.
- **The `a > 0` fence is not caution** (`th.base-fence`). The chain
  $-2 = (-2)^{2/2} = ((-2)^2)^{1/2} = 2$ is built entirely from laws that hold elsewhere,
  so $a > 0$ is **the largest domain on which the demand is consistent at all**. That is
  a *fourth* species of convention beyond the ℤ layer's three (arbitrary / determined /
  proved): forced by the absence of any consistent alternative.
- **`th.principal-root`: the positive choice is determined, not free.** Choosing the
  negative root for even $n$ breaks `pl.of-power` at $\left(a^{1/4}\right)^2 = a^{1/2}$.
  Single-valuedness must be *some* choice ($x^2 = 4$ has two solutions); which one is
  then decided for you. Also the home of $\sqrt{x^2} = |x|$.
- **`th.exponent-well-defined` is a genuinely new obligation.** ℚ is the first layer
  whose exponents have **non-unique names** ($\tfrac12 = \tfrac24$), so a definition
  stated in terms of $m$ and $n$ must be shown not to depend on the spelling. The
  naturals layer got this free from `def.nat` (each element reached from $1$ in exactly
  one way) and never had to mention it. General habit worth keeping: *whenever a
  definition reads a name rather than an object, something has to be checked* — the same
  obligation that licenses cancelling a common factor.
- **`ix.root`: the radical reaches where the exponent notation cannot.** $\sqrt[3]{-8} = -2$
  is consistent as a root; $(-8)^{1/3}$ invites `pl.of-power` and the contradiction. The
  fence stands on the *exponent notation*, because that is what invites the laws.
- **`th.pow-laws-rat` shows the trade.** The ℤ extension cost nothing and kept every
  non-zero base. This one cost an axiom and bought a *smaller* domain (positive bases
  only). The tower has been trading domain for reach all the way up; here it is visible.

## Added to fundament0 for this layer

**`def.abs`** (definition section, after `def.sub`/`def.div`) — three cases, one per
branch of trichotomy (`ax.order-trichotomy`), built from `ax.additive-inverse` and `op.lt`. Its note makes the point
`th.principal-root` needs: the definition does **not** say "leave off the minus", which
is a rule about marks and fails for $|a|$ with a variable. Stopping point in its
intuition: distance is a picture of the *value*, while the notation tempts a reading of
the *marks* — they come apart exactly at $\sqrt{x^2} = |x|$.

## Page order

`Preliminaries` (pre.existence) → `Notation` (ix.root) → `Definitions` (def.rat ·
def.root, def.pow-rat) → `Theorems` (th.root-exists, th.principal-root,
th.exponent-well-defined, th.pow-laws-rat, th.base-fence).

## Where the tower stops

$a^{\sqrt2}$ is **not** reachable: there is no rational name to read, and no algebraic
demand settles it. What settles it is **continuity** ($a^x$ as a limit along rationals),
a new *idea* rather than a new axiom. Recorded in the layer note — the fundament ends by
naming what would come next, which is analysis.
