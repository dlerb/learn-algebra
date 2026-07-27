# Catalog of common algebra mistakes (from the web)

**Purpose.** An evidence base of the mistakes students *actually* make when
reading and manipulating algebraic **expressions**, assembled from the web so we
can hold the 65 skills up against it and prune the ones no real mistake needs.

**Scope filter.** This app is about *expression fluency* — reading structure,
judging equivalence, chunking — **not equation solving**. So the web's big
equation-solving errors (dividing only part of a side, moving terms without
flipping signs, losing the `x = 0` root by cancelling, the quadratic formula)
are **out of scope** and parked in the appendix, not the main list. Every entry
below is an error you can make *inside a single expression*.

Each entry: a canonical **wrong → right** pair, a one-line note on the trap, and
how often the sources flag it (★★★ = named by nearly every source / canonical in
Paul's; ★★ = common; ★ = mentioned).

**Shipped into the app 2026-07-25.** The A–F families below are now the six *topic
sections* of `src/data/errors.json`, and the ★ rating is its `frequency` field — so
this doc and `/errors` share one taxonomy rather than drifting. The wrong→right pairs
render through `src/components/WrongRight.vue`. Sections here map to section slugs as:
A→`minus`, B→`reading`, C→`distributing`, D→`powers`, E→`fractions`, F→`terms`.

⚠️ **The app has a 7th topic this doc does not: `factoring`** (added 2026-07-25). That is
not an oversight here — it is a **gap in this evidence base**. The sources were all about
*reading and judging* expressions, so they record no factoring errors at all, even though
factoring is squarely in scope for expression fluency. The consequence showed up in the
coverage audit: the error layer is thin exactly where Tier 3 is, because the evidence was
collected for a different question. `anti.quadratic-pair-unchecked` was authored from
teaching experience rather than from a source, and **its ★★ is teacher judgement, not a
source count** — the only entry in the app for which that is true.

---

## A. Minus sign & subtraction

- **A1 — Distributing a minus over a sum.** ★★★
  `−(3x + 5) → −3x + 5` **✗**  →  `−3x − 5` **✓**
  The minus must hit *every* term, not just the first.

- **A2 — Subtracting a bracketed difference.** ★★★
  `x² + 3x − 5 − (4x − 5) → x² − x − 10` **✗**  →  `x² − x` **✓**
  The `−5` inside becomes `+5`; the second sign flips too.

- **A3 — Double negative / subtracting a negative.** ★★★
  `4 − (−2) → 4 − 2 = 2` **✗**  →  `4 + 2 = 6` **✓**
  Two minuses make a plus; students drop one.

- **A4 — Sign of a negative times a negative.** ★★
  `(−a)(−b) → −ab` **✗**  →  `+ab` **✓**

- **A5 — Minus in front of a fraction.** ★
  `−(a/b)` mis-placed onto only numerator *or* denominator inconsistently — the
  one minus can live in three places but means one thing.

---

## B. Order of operations & precedence

- **B1 — Add before multiply.** ★★★
  `2 + 3 × 4 → 5 × 4 = 20` **✗**  →  `2 + 12 = 14` **✓**

- **B2 — Combine before exponent.** ★★
  `3 + 2² → 5² = 25` **✗**  →  `3 + 4 = 7` **✓**

- **B3 — Unary minus vs. exponent.** ★★★ *(canonical in Paul's)*
  `−3² = 9` **✗**  →  `−(3²) = −9` **✓**; only `(−3)² = 9`.
  The power binds tighter than the leading minus.

- **B4 — Coefficient not raised with the base.** ★★★ *(canonical)*
  `(4x)² → 4x²` **✗**  →  `16x²` **✓**
  The exponent on a bracket hits the coefficient too.

---

## C. The "freshman's dream" (operation distributes when it doesn't)

- **C1 — Square of a sum.** ★★★ *(the single most-cited algebra error)*
  `(x + y)² → x² + y²` **✗**  →  `x² + 2xy + y²` **✓**

- **C2 — Any power of a sum.** ★★
  `(a + b)ⁿ → aⁿ + bⁿ` **✗** — no such rule for a sum.

- **C3 — Root of a sum.** ★★★
  `√(x + y) → √x + √y` **✗**; and `√(a² + b²) → a + b` **✗**.

- **C4 — Distributing a coefficient into a *squared* bracket.** ★★
  `3(2x − 5)² → (6x − 15)²` **✗**  →  `3(4x² − 20x + 25)` **✓**
  You can't pull the 3 inside past the square.

*(For contrast, the rules that genuinely DO distribute — and get over-applied by
analogy above — are `(ab)ⁿ = aⁿbⁿ` and `√(ab) = √a·√b`.)*

---

## D. Exponent & radical laws

- **D1 — Product of powers.** ★★★
  `xᵃ · xᵇ → xᵃᵇ` **✗**  →  `xᵃ⁺ᵇ` **✓** *(add the exponents)*

- **D2 — Power of a power.** ★★
  `(xᵃ)ᵇ → xᵃ⁺ᵇ` **✗**  →  `xᵃᵇ` **✓** *(multiply the exponents)*

- **D3 — Coefficient vs. exponent confusion.** ★★
  `x³` read as `3x`, or `3x` read as `x³`.

- **D4 — Negative exponent.** ★★
  `x⁻¹` mishandled — sign of the exponent, not of the value: `x⁻¹ = 1/x`, not `−x`.

- **D5 — Zero / one exponent.** ★
  `x⁰ = 0` **✗**  →  `x⁰ = 1` **✓**.

- **D6 — Root written without grouping.** ★★
  `√(7x) → 7x^(1/2)` **✗**  →  `(7x)^(1/2)` **✓** — the whole radicand takes the power.

- **D7 — Square root has one (non-negative) value.** ★★
  `√16 = ±4` **✗**  →  `√16 = 4` **✓**. (`√(x²) = |x|`, not `x`.)

---

## E. Fractions & cancelling

- **E1 — Cancelling a term inside a sum.** ★★★ *(research: "illegal cancellation" ≈ 48% of errors)*
  `(a + b)/a → b` **✗**; `(3x³ − x)/x → 3x³ − 1` **✗**  →  factor first: `= 3x² − 1` **✓**

- **E2 — A sum in the denominator does not split.** ★★★
  `c/(a + b) → c/a + c/b` **✗** — no such rule.
  (Whereas a sum in the *numerator* does: `(a + b)/c = a/c + b/c` **✓**.)

- **E3 — Adding fractions without a common denominator.** ★★
  `a/b + c/d → (a + c)/(b + d)` **✗**.

- **E4 — Missing the fraction bar as a grouping symbol.** ★
  `(a + b)/c` written/read as `a + b/c`.

---

## F. Like terms & the meaning of a variable

- **F1 — Combining unlike terms.** ★★★
  `3x + 5 → 8x` **✗** — a variable term and a constant stay separate.

- **F2 — Adding vs. multiplying a variable.** ★★
  `x + x → x²` **✗**  →  `2x` **✓**.

- **F3 — Juxtaposition read as addition.** ★★ *(research-flagged)*
  `xy` treated as `x + y` **✗** — `xy` is a product.

- **F4 — Adding across different powers.** ★
  `x² + x → x³` (or any merge of unlike powers) **✗**.

---

## Cross-cutting root causes (what the research names)

These are the *negative* form; each is the shadow of a **rule** (our positive
decoding rule). The cross-links below tie the research categories to our layer — a
rule is what a student must internalise so the root cause never fires.

- **Illegal cancellation** — the single largest category (~48% in one grade-11 study).
  → `meta.only-multiplication-distributes` (its rule spells out "a single term of a
  sum cannot be cancelled").
- **Misapplication of a valid rule** — retrieving a correct rule (distribution,
  a power law) and firing it where it doesn't hold (C-family, E-family).
  → `meta.only-multiplication-distributes`.
- **Weak grasp of "variable"** — F3, and treating letters as labels not numbers.
  → `meta.variable-is-a-fixed-number` (added 2026-07-24 to close this gap; before, the
  only coverage was the error `mis.letters-differ` + card `pre.variables`; `rule.variable-is-a-fixed-number` covers it since 2026-07-27).
- **Sign/procedural slips** — A- and B-families; slips more than misconceptions.
  → `meta.three-minuses`.

---

## Mapping to the three skill tiers

The skills are read on three levels (the "Tier 1/2/3" lens in `content_model.md`):

- **Tier 1 — Fluency** (`equivalence` kind, 45 skills): automatic reading of
  notation; knowing two forms mean the same. *Not expected to map 1:1 to web
  errors* — it is the substrate a mastery/Chinese-style curriculum drills so the
  higher-tier errors never fire. Kept for automaticity, not because each has a
  matching mistake.
- **Tier 2 — Chunking** (`classification` + `chunking`, 20 skills): reading the
  *structure* of a term — dominant operation, what is one chunk, scope of an
  operator.
- **Tier 3 — Manipulation** (`transformation`, **0 skills — empty**): actually
  expanding, factoring, simplifying, collecting.

**The pattern.** Almost every web error is a **Tier-3 manipulation gone wrong**,
caused by a **Tier-2 misreading of structure**, resting on a **Tier-1 fluency**
that wasn't automatic. A single mistake threads all three tiers — which is why
the fluency skills matter even though few *are* errors themselves.

| Error | Tier-1 fluency underneath | Tier-2 structure to read | Tier-3 act that goes wrong |
|---|---|---|---|
| A1/A2 minus over a bracket | `−(−a)=a`, `(−a)(−b)=ab` | the bracket is one chunk | distributing the minus |
| A3/A4/A5 double neg, neg×neg, minus-on-fraction | **these ARE the fluency** | — | — |
| B1/B2 order of operations | — | what binds first | (mostly a reading error, Tier 2) |
| B3 `−3²` vs `(−3)²` | power binds tighter than unary minus | scope of the exponent | evaluating |
| B4 `(4x)²` coeff not raised | — | exponent scopes the whole bracket | raising the power |
| C1/C2 `(x+y)ⁿ` | `pl.no-sum-law` | sum inside a power is one chunk | expanding |
| C3 `√(x+y)` | `pl.no-sum-law` (radical shadow) | sum under the root is one chunk | splitting the root |
| C4 `3(2x−5)²` | — | the square binds before the 3 | distributing too early |
| D1 `xᵃ·xᵇ` product of powers | `pl.same-base` (add exponents) | — | `transformation.simplify-power-product` (error `anti.exponent-arithmetic`) |
| D2 `(xᵃ)ᵇ` power of a power | `pl.of-power` (multiply exponents) | — | covered by the same skill + error |
| D3/D4/D5/D7 coeff-vs-exp, neg/zero exp, √16 | **these ARE the fluency** | — | — |
| D4 negative exponent | `def.pow-neg` (minus = reciprocal) | — | error `mis.negative-exponent-negates`, authored 2026-07-25 → `equivalence.negative-exponent`, `-negative-fractional-exponent` |
| D5 zero / one exponent | `def.pow-zero` (forced, not decreed) | — | error `anti.zero-exponent`, authored 2026-07-25 → `equivalence.zero-and-one-exponent` |
| D6 `√(7x)` grouping | — | radicand is one chunk | writing the power |
| E1 cancel in a sum (~48%!) | — | `a+b` is one chunk, not two | cancelling / simplifying |
| E2 denominator doesn't split | — | the sum is one chunk | splitting the fraction |
| E3 common denominator | fraction addition rule | — | combining |
| E4 fraction-bar grouping | — | bar groups num and denom | reading/writing |
| F1/F4 combine unlike terms/powers | `3x+5` stays open | which terms are "like" | collecting |
| F2 `x+x=x²` | add vs. multiply | — | collecting |
| F3 `xy=x+y` | **juxtaposition means product** | — | — |

**What this says for pruning.** The count problem is really a **distribution**
problem: 45 skills at the tier the teacher agrees rarely holds an error, 20 at
the structure tier, **0 at the tier where mistakes actually surface as wrong
answers**. So the rubric is tier-aware, not one-error-per-skill:

- *Tier 1*: keep for fluency value; cut only genuine notation-trivia /
  redundancy (e.g. `bracket-types`, `division-variants`, the two
  "commutativity-holds" skills whose only real error is the non-commutative twin).
- *Tier 2*: keep those matching a real structural misreading; these are load-bearing.
- *Tier 3*: **build**, don't cut. Start with the undrilled ★★★ exponent laws
  (`pl.same-base`, `pl.of-power`) and the freshman's-dream / illegal-cancellation
  manipulations, which are where the frequency mass sits.

---

## Appendix — out of scope (equation solving, not expression fluency)

Recorded so we don't mistake their absence for a gap:

- Dividing only *some* terms of a side (`3x + 4 = 6 → x + 4 = 2`).
- Moving a term across `=` without flipping its sign.
- Cancelling `x` from `2x² = x` and losing the root `x = 0`.
- Misremembering the quadratic formula; sign slips in the discriminant.
- Division by zero treated as `0` or as the numerator.

---

## Sources

- Paul Dawkins, *Common Math Errors — Algebra*, Lamar University
  <https://tutorial.math.lamar.edu/extras/commonerrors/algebraerrors.aspx> — the canonical wrong→right list (A2, B3, B4, C1, C3, C4, D6, D7, E1).
- *4.8 Common Mistakes in Algebra*, Mathematics LibreTexts (Northern Illinois Univ.)
  <https://math.libretexts.org/Courses/Northern_Illinois_University/Conceptual_Mathematics_in_Society/04:_Algebra/4.08:_Common_Mistakes_in_Algebra>
- *Secondary school students' errors and misconceptions in learning algebra* / *Misconceptions in School Algebra* (HRMARS) — illegal-cancellation and rule-misapplication statistics; `xy = x + y`.
  <https://hrmars.com/papers_submitted/7250/Misconceptions_in_School_Algebra.pdf>
- eTutorWorld, *Top 10 Algebra Mistakes* — sign distribution, unlike terms, PEMDAS.
  <https://www.etutorworld.com/blog/top-10-algebra-mistakes-students-make-and-how-to-avoid-them/>
- Third Space Learning, *Distributing Exponents* — coefficient-not-raised, `(a+b)ⁿ` misapplication.
  <https://thirdspacelearning.com/us/math-resources/topic-guides/algebra/distributing-exponents/>
- Hoff Math, *12 Common Mistakes in Algebra*; Mathnasium; Ivy Tutors — aggregated frequency signal.
