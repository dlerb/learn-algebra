# integers — the ℤ-exponent layer

The third layer of the tower, on top of **naturals** (`docs/naturals.md`).
Data: `src/data/integers/cards.json`; page: `/integers`. Tag: **`≙ aⁿ, n ∈ ℤ`**.

## What it is

The layer where **the arrow reverses**. Everywhere below, definitions came first and
laws were proved from them: `def.pow` was written down and `pl.same-base` followed.
Here there is nothing to prove from — the recursion says what $a^{n+1}$ is given
$a^n$, and says *nothing* about $a^0$, because counting starts at one. The question
"what is $a^0$?" has **no answer waiting to be found**.

What fills the gap is a decision, and the layer's whole point is that the decision is
**not free**: state which law is to keep holding, and the values follow uniquely. The
law becomes the constraint; the definition becomes the output.

Filed under the integers because ℤ is the exponent range it reaches, but the ℤ card
itself is one cheap line — almost all of the layer is about powers.

## The payoff: three species of "convention"

School runs all three together into one dismissive word. This page puts them side by
side, which is the best thing the layer teaches:

| | example | what it is |
|---|---|---|
| **arbitrary** | is $0 \in \mathbb{N}$? ($0^0$ too) | nothing determines it; books differ; both correct |
| **determined** | $a^0 = 1$, $a^{-n}$ | not free: name the law you keep and the value follows |
| **proved** | the laws hold on all of ℤ | a theorem, no choice anywhere |

`def.nat` (naturals) already carries the first; this layer supplies the other two.

## Settled decisions

- **`pre.permanence` is a `preliminary`, not a new kind.** The Permanenzprinzip
  (Peacock 1834, Hankel 1867) is explicitly **neither axiom nor theorem** but a
  *methodological* principle, so it needs no rung on the epistemic ladder and the
  cards it produces stay honest `definition`s. The German name is standard in
  German-language schooling, so students may actually meet the word.
- **The derivations on `def.pow-zero` / `def.pow-neg` are not proofs**, and each card
  says so. There is no object to prove things about before the definition; what is
  proved is the conditional — *if* a value exists and keeps `pl.same-base`, it can
  only be this one. The chains look exactly like proofs, which is why it is said out loud.
- **`0^0` stays undefined**, and the hole is *explained* rather than patched: the
  argument needs $a^{-1}$, which $0$ has not got. So `0^0` falls back into the
  arbitrary column (combinatorics and power series take it as $1$; analysis leaves it
  open). Leaving the hole is worth more than filling it on a page about where choices
  come from.
- **`def.pow-neg` defines $a^{-n} := (a^n)^{-1}$ and exhibits $(a^{-1})^n$** to show
  such an element exists (via `pl.of-product`). This deliberately **routes around**
  needing "$a^n \neq 0$", so the layer needs no non-vanishing lemma. Three spellings,
  one element: $(a^n)^{-1}$ (what the demand produces), $(a^{-1})^n$ (what shows it
  exists), $1/a^n$ (what school writes, and the most downstream — it needs `def.div`).
  Word split kept: **multiplicative inverse** = $a^{-1}$, **reciprocal** = $1/a$.
- **`th.inverse-is-power` closes a backlog item.** At fundament0 `a^{-1}` was *atomic
  notation* with a decorative `-1`; here it becomes literally the power with exponent
  $-1$, and the two readings coincide. Same move as `ix.juxtaposition`: notation used
  on trust, paid for later. Also settles the other half — the minus in $a^{-n}$ is the
  ordinary unary minus of `ax.A4` applied to $n$, not a special mark.
- **`th.pow-laws-int` is the vindication, and it is not circular.** One law was
  demanded (`pl.same-base`, only in the mixed cases with $0$); *all three* come back
  across ℤ. The extension could have been coherent for the demanded law and broken for
  the others. Note the status change: on ℕ these were theorems about a recursion, here
  they are theorems about definitions built to satisfy them.

## Added to fundament0 for this layer

**`th.7` zero product** ($ab = 0 \Rightarrow a = 0$ or $b = 0$) — a one-line
consequence of `ax.M4` + `th.1`, the converse of `th.1`, and the entire basis of
solving equations by factoring. Not actually *needed* here (see `def.pow-neg` above),
but its absence looked like an oversight rather than a decision. Its intuition carries
a stopping point: the property belongs to *fields*, not to multiplication as such —
$2 \cdot 3 = 0$ among the clock remainders modulo $6$.

## Page order

`Preliminaries` (pre.permanence) → `Definitions` (def.int · def.pow-zero,
def.pow-neg) → `Theorems` (th.inverse-is-power, th.pow-laws-int).

## Deferred (not built)

- **ℚ — existence.** Roots and rational exponents; needs `ax.C1` and $a > 0$. This is
  where permanence does worse than fall silent: demanding the laws for $(-2)^{1/2}$
  produces a contradiction, which is why the $a>0$ fence exists and why the ℚ layer is
  a different *kind* of step (existence, not choice).
- **The multiples/powers divergence card** — still waiting on decimals.
