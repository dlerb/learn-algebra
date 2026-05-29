# Taxonomy — Skill 2: Structural Recognition

The goal: before touching an expression, identify its dominant operation and main chunks.
The drill format is always the same: look, classify, name. No computation.

**Flags:**
- `[S2]` — pure recognition, foundation for Skill 3 but no specific tool follows directly
- `[S2→S3]` — recognition directly unlocks a specific Skill 3 manipulation tool

**The core question students must learn to ask first:**
> "What is the dominant operation of this expression?"

---

## Section 0 — Meta-Patterns

**M1 · The dominant operation is the last one applied.**
Ask: "if I were evaluating this step by step, what would I do last?"
That operation is dominant. Everything else is subordinate — happening inside chunks.

**M2 · Brackets make a chunk.**
Whatever is inside brackets is a single object. The dominant operation is always outside all brackets.
`3(x+1) − 2(x−1)` — the brackets absorb the additions inside. The dominant operation is the subtraction between the two products.

**M3 · Multiplication binds tighter than addition/subtraction.**
In `3x + 2y`, the × is "used up" inside the terms. The dominant operation is +.
The expression is a sum, not a product — even though multiplication is visibly present.

**M4 · The dominant operation determines which tools apply.**
This is the bridge to Skill 3:
- Sum/difference → collect like terms, look for common factors
- Product → expand or factor
- Power → apply power rules
- Quotient → fraction manipulation
Classifying correctly means you pick up the right tool automatically.

---

## Group A — The Five Basic Forms

Recognition in unambiguous cases. Foundation before misleading cases.

### A1 · Sum `[S2]`
```
a + b           dominant: addition      chunks: a, b
3x + 2y         dominant: addition      chunks: 3x, 2y
(x+1) + (x−1)  dominant: addition      chunks: (x+1), (x−1)
```

### A2 · Difference `[S2]`
```
a − b           dominant: subtraction   chunks: a, b
3x − 2y         dominant: subtraction   chunks: 3x, 2y
(x+1) − (x−1)  dominant: subtraction   chunks: (x+1), (x−1)
```

### A3 · Product `[S2]`
```
ab              dominant: multiplication    chunks: a, b
3(x+1)          dominant: multiplication    chunks: 3, (x+1)
(x+1)(x−1)     dominant: multiplication    chunks: (x+1), (x−1)
```

### A4 · Quotient `[S2]`
```
a/b             dominant: division      chunks: a, b
(x+1)/(x−1)    dominant: division      chunks: (x+1), (x−1)
3x/(2y)         dominant: division      chunks: 3x, 2y
```

### A5 · Power `[S2]`
```
a²              dominant: exponentiation    base: a, exponent: 2
(x+1)²         dominant: exponentiation    base: (x+1), exponent: 2
2^x             dominant: exponentiation    base: 2, exponent: x
```

---

## Group B — Misleading Surface Forms

Expressions where visible operations distract from the dominant one.
These are the core of Skill 2 — where students most often misclassify.

### B1 · Product containing a sum/difference — looks like a sum `[S2]`
```
3(x+1)          dominant: PRODUCT       (not sum — the + is inside a chunk)
2x(x−1)        dominant: PRODUCT
(x+1)(x−1)     dominant: PRODUCT
```
**Trap:** Students see the `+` or `−` inside and name the dominant operation as addition/subtraction.

### B2 · Sum of products — the multiplication is inside `[S2]`
```
3x + 2y         dominant: SUM           (3x and 2y are the chunks)
ab + cd         dominant: SUM
3(x+1) − 2(x−1)   dominant: DIFFERENCE  (between two products)
```
**Trap:** Students name the dominant operation as multiplication because they see it first.
This is the inverse of B1 — together they cover the most common misclassification.

### B3 · Power containing a sum — looks like a product or sum `[S2]`
```
(x+1)²         dominant: POWER         (base is the whole chunk (x+1))
(3x)²           dominant: POWER         (base is 3x)
```
**Trap:** Students name it as a sum because of the + inside, or as a product because of the implicit ×.

### B4 · Expression with a leading minus `[S2]`
```
−3x + 2y        dominant: SUM           (first term happens to be negative)
−(x+1) + x      dominant: SUM
−(x+1)²        dominant: POWER, then negated
```
**Trap:** The leading minus makes students name the dominant operation as subtraction or negation,
when the expression may actually be a sum, power, or product.

### B5 · Quotient with complex numerator/denominator `[S2]`
```
(3x+2) / (x−1)     dominant: QUOTIENT
(x²+1) / (x+1)     dominant: QUOTIENT    (the sums are inside the chunks)
```
**Trap:** Students focus on the sums/differences inside and miss that the whole thing is a division.

### B6 · Coefficient in front of a power `[S2]`
```
2x²     dominant: PRODUCT of 2 and x²      (not a power of 2x)
3a³     dominant: PRODUCT of 3 and a³
```
**Trap:** `2x²` is NOT `(2x)²`. The dominant structure is product, not power.
Connects directly to Skill 1 families D3/D4.

---

## Group C — Chunking

Before naming the dominant operation, you must identify the main chunks correctly.
These exercises train chunk-identification as a standalone step.

### C1 · Chunks in a sum/difference `[S2]`
```
3x + 2y − z        →  three chunks: [3x]  [2y]  [−z]
ab − cd + ef       →  three chunks: [ab]  [−cd]  [ef]
```
Exercise format: "draw brackets around each chunk."

### C2 · Chunks in a product `[S2]`
```
3 · x · (x+1)       →  three factors: [3]  [x]  [(x+1)]
2x(x−1)(x+2)       →  three factors: [2x]  [(x−1)]  [(x+2)]
```

### C3 · Implicit chunking — multiplication precedence `[S2]`
```
3x + 2y     →  chunks [3x] and [2y], even without explicit brackets
a²b + ab²   →  chunks [a²b] and [ab²]
```
**The hardest chunking task.** Students must read implicit brackets from precedence rules.
Connects to meta-pattern M3.

### C4 · Bracket as a single chunk `[S2]`
```
3(x+1) − 2(x−1)   →  the dominant structure is [3(x+1)] minus [2(x−1)]
(x+1)(x−1)         →  two chunks: [(x+1)] and [(x−1)]
```
Students must resist "expanding" and instead see the whole bracket as one object.

---

## Group D — Familiar Shapes

Canonical forms that recur throughout algebra and beyond.
Recognition of these shapes directly unlocks specific manipulation strategies (Skill 3).

### D1 · Difference of two squares `[S2→S3]`
```
a² − b²                     ← base form
x² − 9                      ← (recognise 9 = 3²)
(x+1)² − (x−1)²            ← both chunks are squares
4x² − 25                    ← (recognise 4x² = (2x)², 25 = 5²)
```
Recognition question: "are both chunks perfect squares, connected by subtraction?"
Unlocks: factoring as (a+b)(a−b).

### D2 · Perfect square trinomial `[S2→S3]`
```
a² + 2ab + b²       ← sum form
a² − 2ab + b²       ← difference form
x² + 6x + 9         ← (recognise b = 3)
x² − 4x + 4         ← (recognise b = 2)
```
Recognition question: "is the middle term twice the product of the square roots of the outer terms?"
Unlocks: writing as (a±b)².

### D3 · Common factor `[S2→S3]`
```
3x + 6          ← common factor 3
ax + ay         ← common factor a
6x² + 4x        ← common factor 2x
a(x+1) + b(x+1) ← common factor (x+1)
```
Recognition question: "do all chunks share a factor?"
Unlocks: factoring out.

### D4 · Linear form `[S2]`
```
3x + 2      ax + b      −x + 5
```
Highest power is 1. One variable term, one constant.

### D5 · Quadratic form `[S2→S3]`
```
x² + 3x + 2     ax² + bx + c     x² − 5x
```
Highest power is 2. Recognising this form gates everything in quadratic algebra.

---

## Group E — Full Classification

Putting it together: given any expression, state the dominant operation and identify the main chunks.
No computation. Output is always a sentence: "this is a [operation] of [chunks]."

### E1 · Classification drill `[S2]`
```
3(x+1) − 2(x−1)    →  "difference of two products"
(x+1)(x−1)          →  "product of two differences" (or sum/difference)
x²/(x+1)            →  "quotient of a power and a sum"
(x+1)² − 9         →  "difference — and it's D1 shape: difference of two squares"
−3x + 2             →  "sum (with a negative first term)"
2x²                 →  "product of 2 and a power"
```

### E2 · Same value, different dominant operation `[S2→S3]`
```
x² − 1      vs      (x+1)(x−1)
```
Both expressions represent the same values, but:
- `x² − 1` is a difference (dominant: subtraction)
- `(x+1)(x−1)` is a product (dominant: multiplication)

This is the conceptual heart of Skill 3: rewriting changes the dominant operation, and that's the point.

---

## Priority Order for Drilling

1. **B2** — sum of products (multiplication visible but subordinate) ← most common misclassification
2. **B1** — product containing a sum (brackets absorb the inner operation)
3. **C3/C4** — implicit chunking and bracket-as-chunk
4. **B6** — coefficient in front of a power (`2x²` vs `(2x)²`)
5. **E1** — full classification drill (brings it all together)
6. **D1** — difference of two squares (high payoff for Skill 3)
7. **B4** — leading minus confusion
8. **D3** — common factor recognition
9. **B3/B5** — misleading powers and quotients
10. **D2/D5** — perfect square and quadratic form recognition

---

## Open Questions

- E2 is arguably the conceptual bridge between Skills 2 and 3. Should it live here, or open the Skill 3 taxonomy?
- Group D shapes: how many should be in Skill 2 vs Skill 3? The risk is that D families explode as Skill 3 grows (sum of cubes, etc.). Cap at the ones that appear in first-year curriculum?
- Is "linear form" (D4) trivial enough to drop, or does naming it explicitly have value?
