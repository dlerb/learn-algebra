# Taxonomy — Skill 1: Notation Fluency

Each family is a training unit. Students drill all surface variants until recognition is automatic.

**Flags:**
- `[S1]` — Skill 1 only: needs to be read automatically, not a strategic tool
- `[S1+S3]` — appears in both: needs automatic recognition AND is a strategic manipulation tool

**Note on completeness:** Notational variations are endless, as in language. This taxonomy covers the most important core families, plus meta-patterns (Section 0) that let students decode novel forms they haven't drilled. The goal is not exhaustive enumeration but sufficient coverage + decodability.

---

## Section 0 — Meta-Patterns

These are not drill families but underlying generative rules. Teaching these explicitly gives students a tool for decoding surface variants they have never seen before.

**M1 · Juxtaposition means multiplication.**
Anything written next to anything else, with no symbol between them, means multiply.
`3x`, `2(x+1)`, `(a+1)(a-1)`, `xy` — all products.

**M2 · The minus sign is always one of three things.**
- Binary subtraction: `a − b` (between two objects)
- Unary negation: `−a` (in front of one object)
- Multiplication by −1: `−(expression)` (in front of a bracket)
When confused by a minus sign, ask: which of these three is it?

**M3 · Brackets always have an implicit operation in front.**
If there is no explicit symbol before a bracket, the implicit operation is multiplication (M1).
If there is a minus sign before a bracket, the implicit operation is × (−1) (M2).

**M4 · Exponents bind tighter than coefficients.**
`−a²` means `−(a²)`, not `(−a)²`. The exponent applies first, the minus applies after.
When in doubt: what does the exponent directly sit on top of?

**M5 · The fraction bar is a bracket.**
Everything above the line is one grouped object. Everything below is another.
`a+b/c` and `(a+b)/c` are different things — the fraction notation resolves the ambiguity.

---

## Group A — Multiplication Notation

### A1 · Explicit vs implicit multiplication `[S1]`
```
3 × x  =  3 · x  =  3x  =  x · 3  =  (3)(x)
```
**Trap:** `3x` looks like a two-digit number to students early on.

### A2 · Multiplication with brackets `[S1]`
```
2 × (x+1)  =  2·(x+1)  =  2(x+1)  =  (x+1)·2
```
**Trap:** `2(x+1)` vs `2 + (x+1)` — juxtaposition means multiply, not add.

### A3 · Coefficient of 1 and −1 `[S1]`
```
1·x  =  1x  =  x

(-1)·a  =  (-1)a  =  -1·a  =  -1a  =  -(a)  =  -a
```
**Trap:** Students treat `(-1)a` and `-a` as different objects. Also: `-1a` misread as the number −14 if variables are single letters close to digits.

### A4 · Coefficient of 0 `[S1]`
```
0·x  =  0x  =  0        (regardless of x)
```

### A5 · Repeated addition vs multiplication `[S1+S3]`
```
x + x  =  2x
x + x + x  =  3x
```
**Trap:** `x + x = 2x` confused with `x · x = x²`. These are the two things that look most alike and mean the most different things.

---

## Group B — The Minus Sign

The minus sign is the single highest-priority group. It is used for three distinct roles (see M2) that share identical notation.

### B1 · Negative numbers and unary minus `[S1]`
```
−3  =  (−3)  =  0 − 3
```
**Trap:** Students treat `(−3)` and `−3` as different objects.

### B2 · Subtracting vs adding a negative `[S1+S3]`
```
a − b  =  a + (−b)  =  a + (−1)·b
```

### B3 · Distributing a negative over a sum `[S1+S3]`
```
−(a + b)  =  −a − b
```
**Trap:** Students write `−a + b` — distributing to first term only.

### B4 · Distributing a negative over a difference `[S1+S3]`
```
−(a − b)  =  −a + b  =  b − a
```
**Trap:** Highest error-rate pattern in first-year algebra. `−(a − b) ≠ −a − b`.
Note: whether this is read automatically (S1) or applied as a strategic rewrite (S3) depends on context — both matter.

### B5 · Double negative `[S1+S3]`
```
−(−a)  =  a
a − (−b)  =  a + b
```
**Trap:** `a − (−b)` written as `a − b`.

### B6 · Negative × negative `[S1+S3]`
```
(−a)(−b)  =  ab
(−a)(b)   =  −ab
(a)(−b)   =  −ab
```

### B7 · Minus in front of a fraction `[S1]`
```
−a/b  =  (−a)/b  =  a/(−b)  =  −(a/b)
```
**Trap:** `−a/b ≠ (−a)/(−b)`.

---

## Group C — Brackets

### C1 · Types of brackets are interchangeable `[S1]`
```
(a + b)  =  [a + b]  =  {a + b}
```

### C2 · Redundant brackets `[S1]`
```
(x)  =  x
((a + b))  =  (a + b)  =  a + b
```

### C3 · Brackets change meaning via order of operations `[S1]`
```
2 + 3 × 4   ≠   (2 + 3) × 4          [14 vs 20]
a + b·c     ≠   (a + b)·c
```
Drill as pure recognition: "same or different?" — no computation.

### C4 · Implicit brackets in the fraction bar `[S1]`
```
(a + b) / c  written as a fraction = the whole of (a+b) over c
a + b/c  ≠  (a+b)/c
```

### C5 · Minus before a bracket = multiply by −1 `[S1+S3]`
```
−(a + b)  =  (−1)(a + b)
```
Connection to M2 and M3.

---

## Group D — Exponent Notation

### D1 · Exponent as repeated multiplication `[S1]`
```
a²  =  a·a  =  a^2
a³  =  a·a·a
a¹  =  a
```

### D2 · Exponent vs coefficient — the core confusion `[S1]`
```
a²  =  a·a        (not 2a)
2a  =  a+a        (not a²)
```
**Trap:** Most common early confusion. Pure trap family.

### D3 · Negative base vs negated square `[S1]`
```
(−a)²  =  a²             the negative is inside: squared
 −a²   =  −(a²)          the negative is outside: negated after squaring
(−3)²  = 9    but    −3² = −9
```
**Trap:** Extremely high error rate. Deserves its own dedicated drill track.

### D4 · Exponent on a product `[S1+S3]`
```
(ab)²   =  a²b²
(2x)²   =  4x²
ab²     =  a·b²          (exponent on b only)
(ab)²  ≠  ab²
```

### D5 · Zero and one exponents `[S1]`
```
a⁰  =  1    (a ≠ 0)
a¹  =  a
```

---

## Group E — Division and Fraction Notation

### E1 · Division notation variants `[S1]`
```
a ÷ b  =  a/b  =  a·(1/b)  =  a·b⁻¹
```

### E2 · Fraction as multiplication by reciprocal `[S1+S3]`
```
a/b  =  a·(1/b)
```

### E3 · Dividing by 1 `[S1]`
```
a/1  =  a
```

### E4 · Splitting a fraction over addition `[S1+S3]`
```
(a + b)/c  =  a/c + b/c          ✓  split the numerator
a/(b + c)  ≠  a/b + a/c          ✗  cannot split the denominator
```

---

## Group F — Commutativity and Order

### F1 · Addition is commutative `[S1]`
```
a + b  =  b + a
```

### F2 · Multiplication is commutative `[S1]`
```
ab  =  ba
```

### F3 · Subtraction is NOT commutative `[S1]`
```
a − b  ≠  b − a      (unless a = b)
a − b  =  −(b − a)
```
Pure trap family.

### F4 · Division is NOT commutative `[S1]`
```
a/b  ≠  b/a      (unless a = b)
```
Pure trap family.

---

## Priority Order for Drilling

1. **B4** — negative over a difference ← single highest error rate
2. **D3** — `(−a)²` vs `−a²`
3. **A3** — the `(-1)·a = -a` family
4. **B3** — negative over a sum
5. **A1/A2** — multiplication notation (foundational)
6. **B5** — double negative
7. **C3/C4** — brackets and order of operations
8. **D4** — exponent on a product
9. **B2** — subtracting vs adding a negative
10. **F3/F4** — non-commutativity
11. **E4** — fraction splitting
12. Remaining families

---

## Open Questions

- The `[S1+S3]` families will grow further once Skill 3 taxonomy is built. Risk of explosion. Revisit after Skill 2 taxonomy is done to see if the boundary holds.
- Are there Swiss/German textbook conventions that differ from the above?
- Should variable naming (`ab` as product of a and b vs a two-letter variable name) get its own family? Relevant in physics and chemistry contexts.
- M1–M5 meta-patterns: should these be explicitly taught in class (before drilling starts) or embedded in the drill feedback?
