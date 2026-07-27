# numbers — the named subsets of ℝ

The second layer of the tower, sitting directly on **fundamentals** (`docs/fundamentals.md`).
Data: `src/data/numbers/cards.json`; page: `/numbers`. Tag: **`≙ ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ`**.

## What it is

fundamentals leaves ℝ **undifferentiated**: the axioms say nothing about counting,
primes or decimals. This layer names the parts — ℕ, ℤ, ℚ — and works out what
counting lets us build (numerals, the times table, multiples). It **assumes nothing**:
every set is carved out of what the axioms already forced to exist.

**Criterion for what belongs here** (so it does not become a junk drawer):
*distinguished subsets of ℝ, and the vocabulary for naming their elements.*
Divisibility and the primes qualify (structure inside ℕ); decimal representation
qualifies and continues the naming thread `pre.elements` → `def.numeral`; the irrationals
qualify. Equations, functions and the powers do not.

## Extracted from the powers layers (2026-07-23)

Until 2026-07-23 `def.nat`/`def.int`/`def.rat` lived inside the three **power**
layers, each next to the exponent range it enabled. The user's objection, which was
right: that **conflates defining a number set with defining the power**, and it leaves
*no home* for anything else about numbers — primes, decimals, divisibility would have
had to be filed under "ℕ-exponents". The split was already latent in the data as group
slugs (`numbers` vs `powers` inside every `definition`/`theorem` section), so the
extraction moved **groups, not cards**: eleven cards, prose untouched.

`ix.juxtaposition` came along because it rests on `th.multiple-is-product`;
`pre.permanence` and `pre.existence` stayed with the powers, since they frame
*definition methods*, not sets. Cross-layer citations (`def.pow` → `def.nat`,
`def.pow-rat` → `def.rat`) resolve through `src/data/layers.ts` as before.

`rk.existence` in fundamentals records the **direction**, which is what makes this layer
coherent: the standard construction of ℝ builds it *out of* ℕ, ℤ, ℚ; here they are
carved *out of* an ℝ already given. Different questions — what the number line
contains vs. whether there is one. That is also why there is no "existence" layer.

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
- The move is set-quantifying, the same flavour as `ax.completeness` — but `ax.completeness` *assumed*,
  this *defines*, and a definition may always be made.

## Settled decisions

- **$0 \notin \mathbb{N}$ here.** $1$ is what `ax.one-neutral` hands us; $0$ would have to be
  fetched from `ax.zero-neutral` for no work it does in this layer, and starting at $0$ would
  give $a^0$ away as a base case, which the powers design specifically does not want.
  Swiss textbooks usually include $0$ — that mismatch is **stated on the card**, and
  stated as the point: whether $0$ is natural is a **convention, not a fact**, and
  conventions and facts arrive in the same voice.
- **Numerals stop at ℕ.** `def.numeral` names one element at a time ($2 := 1+1$).
  Decimal/positional notation is a different machine and belongs upstairs, where it
  also has to explain $1.23$.
- **`th.numeral-arithmetic` (added 2026-07-22, the user's point).** $2+3=5$ by `ax.add-associative`,
  $2 \cdot 3 = 6$ by `ax.distributivity`. The times table is a list of **theorems**, not a table, and
  the axioms that prove its entries are the ones later used on letters. Doing arithmetic
  and doing algebra are not two subjects. A standard first-week exercise elsewhere.
- **`th.numerals-distinct` needs order.** That $2 \neq 3$ is not a field fact (a field
  may satisfy $1+1=0$); `th.zero-less-than-one` + `ax.order-add` + `ax.order-transitive` is what stops counting from looping.
  The sharpest dependency-bookkeeping card in the layer.
- **`ix.juxtaposition` justifies `ix.coefficient-front` rather than re-licensing it.** fundamentals
  already *prefers* $3a$; this card supplies the proof that the abbreviation loses
  nothing, plus the two limits (not between numerals — $34$ is another name; and it
  says *which* multiplication, not how tightly it binds).

## Page order

`Preliminaries` (pre.count) → `Notation` (ix.juxtaposition) → `Definitions`
(def.nat, def.numeral · def.multiple · def.int, def.rat) → `Theorems` (th.ind,
th.numerals-distinct, th.numeral-arithmetic · th.multiple-is-product).

Sections are **kinds**; `counting / multiples / extensions` are **groups** inside them,
so a topic's definition and its theorem sit in different sections and are read together.

## Deferred (not built)

- **Decimal numerals**, and with them the full `1.23·a` card — planted in
  `th.multiple-is-product`'s intuition (copies run out, the product does not).
  `def.numeral` names one element at a time; positional notation is a different machine.
- **Divisibility and the primes** — the first structure *inside* ℕ, and the first
  content this layer has that the powers never needed.
- **The irrationals as a set.** ℝ∖ℚ named, now that `th.no-rational-square-two`
  (built 2026-07-23) has exhibited one. That card proves the hole by **descent** —
  smallest denominator, then a smaller one — so it needs neither divisibility nor
  primes nor "lowest terms", only `th.ind` read once more as well-ordering. It is
  stated as `q·q ≠ 2` rather than `√2 ∉ ℚ` on purpose: roots and power notation live
  one layer *up*, and this layer may not borrow forward.
- **The multiples/powers divergence card.** Coefficients dissolve into ordinary `·`
  at ℚ; exponents never do. Statable only where both stories are visible.

## References checked (2026-07-22)

- **`def.nat` is the textbook move**, not an invention: ℕ as the intersection of all
  inductive subsets, induction from minimality — Spivak *Calculus* ch. 2,
  [Zakon *Mathematical Analysis* §2.2](https://math.libretexts.org/Bookshelves/Analysis/Mathematical_Analysis_(Zakon)/02:_Real_Numbers_and_Fields/2.02:_Natural_Numbers._Induction)
  (stated for an arbitrary field, our setting exactly),
  [ProofWiki](https://proofwiki.org/wiki/Definition:Natural_Numbers/Inductive_Sets_in_Real_Numbers).
- **`th.numeral-arithmetic` is standard fare**: $2+2=4$ from $2 := 1+1$ and associativity
  appears as a first-week exercise, e.g. [Reed math112](https://people.reed.edu/~mayer/math112.html/html1/node16.html),
  [UChicago IBL sheet 6](https://www.math.uchicago.edu/~boller/IBL/M162script6.pdf).
- **Keith Devlin, *It Ain't No Repeated Addition* (MAA, 2008)** — the same claim as
  `th.multiple-is-product`'s intuition (repeated addition is not what multiplication
  *is*; the model breaks at fractions; scaling is the general notion), and a live
  argument among teachers, so worth knowing before a colleague raises it.
  [Overview](https://en.wikipedia.org/wiki/Multiplication_and_repeated_addition).

## Repeated addition vs scaling — the discussion behind the stopping points (2026-07-22)

Devlin's *It Ain't No Repeated Addition* was weighed and largely **set aside**, with
one part kept. The user's position, which held up:

- **In this frame the slogan is empty.** `op.mul` is a *primitive*: no definition at
  all, only axioms. So neither repeated addition nor scaling is what multiplication
  *is*. Devlin's implicit second half ("…it *is* scaling") overreaches exactly as far
  as the half he attacks.
- The slogan is **domain-relative**, and that is its whole content. On ℕ via Peano,
  multiplication literally **is** defined as repeated addition. On a *specified* field
  it is primitive. On a *constructed* ℝ it is neither. So "abstract on ℚ" is true if
  you specify ℚ and false if you construct it — the specification/construction seam,
  one floor down.
- **Scaling has no independent content on ℚ.** Scaling by $m/n$ is executed as *take
  the $n$-th part, repeat it $m$ times*, and the $n$-th part is characterised by
  `ax.multiplicative-inverse`. It is repetition closed under its own inverse, not a rival picture. (User's
  argument, and it generalises further than the $1.5$ case they raised.) It becomes
  irreducible only at irrational factors — i.e. **the intuition boundary coincides with
  the `ax.completeness` boundary**.
- **Scaling is not innate-free either way.** The approximate number system is
  ratio-based (Weber), 6-month-olds abstract ratios (McCrink & Wynn), and size
  constancy is a scaling computation run continuously. But all of it is *approximate*;
  exactness lives on the repetition side. **Neither faculty has both**, which is why
  the number system had to be built rather than perceived.
- **The picture of $\sqrt2 \cdot a$ is a construction, not a stretch**: the diagonal of
  the square on $a$. Exact, drawable, no approximation. Geometry has the completeness
  that arithmetic must be *given* by `ax.completeness` — the Greek separation of ratio from
  number, and Eudoxus' equal-ratios definition is Dedekind's cut 2200 years early.

**Conclusion, and the reason the stopping-point pass happened:** ℝ has no adequate
intuitive model. Sticks fail at $\sqrt2$, rubber bands fail at exactness, area fails at
negatives, and nothing at all pictures $(-2)(-3) = 6$ (`th.minus-times-minus` is pure axioms). That is
*why* ℝ is axiomatised. The teaching debt is not caused by choosing the wrong picture;
it is caused by never saying that every picture has a stopping point. Hence: each
`intuition` now names its own.

**Not adopted:** "teach scaling instead" as the fix for *multiplication makes bigger*.
Fischbein's finding is about the primitive model students **have**; it is no evidence
that scaling can be **installed**, and classroom experience says it cannot. The fix is
to make the *extension* visible, which is `th.multiple-is-product` plus the ℚ
divergence. Still open for the errors layer: **"multiplication makes bigger" is not
among M1–M10**, which are all notation/structure. It is a different kind of error, a
property smuggled from the ℕ-model into ℝ, sibling to expecting $a^r$ to behave like
$a^n$. Candidate new rule (rules.json).
