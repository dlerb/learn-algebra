# Laws & notation devices — DRAFT for discussion

Layer 1 (laws) and layer 2 (notation devices) of the three-layer model. The 64
families are layer 3: curated cells of the laws × devices matrix, selected by
classroom reality. These lists are the *coordinate system* the families live in
— they justify and audit the families, they do not generate them.

Ids here are draft codes (A1, D1, T1, Ā1, N1) for discussion; final data files
would use slug ids in project style (`law.distributivity`, `device.juxtaposition`).

---

## Design decisions (to confirm)

1. **Four sorts of law**: `axiom` (accepted, not proven in school), `definition`
   (introduces a new operation via old ones), `theorem` (derivable, carries
   `derivedFrom`), `antilaw` (named false generalization; pitfalls cite these).
2. **Conventions are not laws.** They live in the device list. "1·a = a" is an
   axiom about numbers; "we don't write the 1" is a device.
3. **Two kinds of error, two homes.** A *misreading* (parsing the notation
   wrong: `-a²` as `(-a)²`, `2a` as `2+a`) attaches to a device. A *false law*
   (algebra that isn't true: `(a+b)² = a²+b²`) is an anti-law. Dual citation
   is allowed and expected where both readings are plausible: `−(a+b) = −a+b`
   cites Ā4 (partial distribution) *and* N3 (sign-scope misreading).
4. **D3 stays a definition.** In a field `3a = a+a+a` is provable from A9,
   but school treats it as the *meaning* of `3a` — the sorts record how the
   material is honestly presented in class, not the minimal axiomatization.
5. **Meta-patterns are the student-facing digest of these lists**, not a third
   independent taxonomy: notation M1→N1, M2→N3, M3→N4+N1, M4→N8, M5→N6,
   M6→A9+Ā1. Keep meta-patterns as the classroom voice; link each to its
   device/law ids so they can't drift.
6. The `derivedFrom` DAG over laws is where the "addition first, then
   multiplication, then powers" hierarchy lives — see the tower at the end.

---

## Layer 2 — Notation devices

Conventions of the writing system. No truth value; the honest answer to "why?"
is "we agreed to write it that way." Each lists its characteristic misreadings.

| id | device | misreadings it invites |
|----|--------|------------------------|
| N1 | **Juxtaposition means multiplication.** `3x`, `2(x+1)`, `xy`; explicit variants `×`, `·` mean the same. | reading `3x` as `3+x` (mixed-number carryover: `2½ = 2+½`) |
| N2 | **The invisible one.** Coefficient 1 and exponent 1 are omitted: `a = 1a = a¹`. | "a has no coefficient"; losing the 1 when collecting `a + 3a` |
| N3 | **One minus symbol, three roles.** Binary subtraction `a−b`, unary negation `−a`, times-(−1) before a bracket `−(…)`. | treating every minus as binary; dropping a unary minus |
| N4 | **Brackets group.** Types `()[]{}` interchangeable; redundant brackets legal; a bracket is one object. | dissolving a bracket without distributing |
| N5 | **Precedence.** Powers before products/quotients before sums/differences; brackets override. | `a + b·c` computed left-to-right |
| N6 | **The fraction bar is a bracket.** It denotes division AND groups numerator and denominator. | reading `(a+b)/c` as `a + b/c` |
| N7 | **Division symbols are synonyms.** `÷`, `:`, `/`, fraction bar. | treating `a:b` as something other than `a÷b` |
| N8 | **Exponent scope.** A superscript applies to the immediately preceding atom or bracket only. | `-a²` as `(-a)²`; `ab²` as `(ab)²` |
| N9 | **The root sign groups.** The vinculum of `√` brackets its argument; index sits in the hook. | `√(a+b)` split at the `+`; swapping index and exponent in `ⁿ√(aᵐ)` |
| N10 | **Same letter, same value.** Within one expression every occurrence of a letter denotes the same number. | treating the two `a`s in `a + a` as free to differ |
| N11 | **Canonical ordering.** Coefficient before letter, letters alphabetical (`3xy`, not `y3x` — legal but non-canonical). | not recognizing `x·3` and `3x` as the same term |

---

## Layer 1 — Laws

### Axioms — the addition world

| id | statement |
|----|-----------|
| A1 | `a + b = b + a` (commutativity of addition) |
| A2 | `(a + b) + c = a + (b + c)` (associativity of addition) |
| A3 | `a + 0 = a` (zero is neutral) |
| A4 | `a + (−a) = 0` (every number has an opposite) |

### Axioms — the multiplication world

| id | statement |
|----|-----------|
| A5 | `ab = ba` (commutativity of multiplication) |
| A6 | `(ab)c = a(bc)` (associativity of multiplication) |
| A7 | `1 · a = a` (one is neutral) |
| A8 | `a · (1/a) = 1`, `a ≠ 0` (every non-zero number has a reciprocal) |
| A9 | `a(b + c) = ab + ac` (distributivity — the only bridge between the two worlds) |

### Definitions — every further operation is built from these

| id | definition | built on |
|----|-----------|----------|
| D1 | `a − b := a + (−b)` — subtraction is adding the opposite | A4 |
| D2 | `a ÷ b := a · (1/b)`, `b ≠ 0` — division is multiplying by the reciprocal | A8 |
| D3 | `n·a := a + a + … + a` (n summands) — integer multiple as repeated addition (definition by decision, see design decision 4) | — |
| D4 | `aⁿ := a · a · … · a` (n factors) — power as repeated multiplication | — |
| D5 | `a⁰ := 1`, `a⁻ⁿ := 1/aⁿ` — chosen so the product rule T11 survives | D4, motivated by T11 |
| D6 | `a^(m/n) := ⁿ√(aᵐ)`, `a > 0` | D4, D7 |
| D7 | `√a` := the `b ≥ 0` with `b² = a`, for `a ≥ 0` (ⁿ√ likewise) | D4 |

### Theorems — with their derivations

| id | statement | derivedFrom |
|----|-----------|-------------|
| T1 | `0 · a = 0` | A9, A3, A4 |
| T2 | `(−1) · a = −a` | T1, A9, A7, A4 |
| T3 | `(−a)b = −(ab)`; `(−a)(−b) = ab` | T2, A5, A6 |
| T4 | `−(a + b) = −a − b`; `−(a − b) = −a + b = b − a` | T2, A9, D1 |
| T5 | `−(−a) = a`; `a − (−b) = a + b` | A4, D1 |
| T6 | `a − (b + c) = a − b − c`; `a − (b − c) = a − b + c` | D1, T4, A2 |
| T7 | `na + ma = (n + m)a` (collecting like terms — A9 read backwards) | A9, A5, D3 |
| T8 | `(a + b) ÷ c = a÷c + b÷c` (division distributes over a sum — from the right only) | D2, A9 |
| T9 | `−(a/b) = (−a)/b = a/(−b)` (the minus of a fraction moves) | T2, T3, D2 |
| T10 | `(ka)/(kb) = a/b`, `k ≠ 0` (cancelling a common **factor**) | D2, A6, A8 |
| T11 | `aᵐ · aⁿ = aᵐ⁺ⁿ` | D4 |
| T12 | `(aᵐ)ⁿ = aᵐⁿ` | D4 |
| T13 | `(ab)ⁿ = aⁿbⁿ` | D4, A5, A6 |
| T14 | `(a/b)ⁿ = aⁿ/bⁿ` | D2, T13 |
| T15 | `√(ab) = √a · √b`, `a, b ≥ 0` | D7, T13 |
| T16 | `√(a/b) = √a / √b`, `a ≥ 0, b > 0` | D7, T14 |
| T17 | `(a + b)² = a² + 2ab + b²` | D4, A9, A1, T7 |
| T18 | `(a + b)(a − b) = a² − b²` | A9, D1, T3, A1 |
| T19 | `a ÷ 1 = a`; `a ÷ a = 1` (`a ≠ 0`) | D2, A7, A8 |

### Anti-laws — named false generalizations

These are the *generative rules of the error space*. Pitfalls cite them.

| id | false law | typical instances |
|----|-----------|-------------------|
| Ā1 | **Linearity illusion** — every operation distributes over `+` | `(a+b)² = a²+b²`, `√(a+b) = √a+√b`, cancelling a single **term** of a sum: `(3x+2)/3 = x+2` |
| Ā2 | **Everything commutes** | `a−b = b−a`, `a/b = b/a` |
| Ā3 | **Conjoining / closure compulsion** — an unfinished sum must collapse to one term | `2+3x = 5x`, `3x+2y = 5xy`, `x²+x = x³` |
| Ā4 | **Partial distribution** — operate on the first term only | `−(a+b) = −a+b`, `2(x+1) = 2x+1` |
| Ā5 | **The two repetitions confused** — repeated addition (D3) vs. repeated multiplication (D4) | `a² = 2a`, `x+x = x²` |

---

## The tower — the derivedFrom DAG in words

This is the hierarchy the user of the library should be able to see:

1. **Addition** stands alone (A1–A4).
2. **Subtraction** is not a new operation: D1 rewrites it as addition of an
   opposite. Everything about minus signs (T4–T6, T9) is a consequence.
3. **Multiplication** gets its own axioms (A5–A8) but connects to addition
   only through **distributivity** (A9) — the single most cited law in the
   taxonomy — and through D3 (integer multiples as repeated addition).
4. **Division** is not a new operation: D2 rewrites it as multiplication by a
   reciprocal. All fraction rules (T8–T10, T14, T16, T19) follow.
5. **Powers** repeat multiplication (D4) exactly as multiples repeat addition
   (D3) — the analogy Ā5 shows students failing to keep apart. The power rules
   T11–T13 fall out of counting factors.
6. **Extended exponents and roots** (D5–D7) are *chosen*, not discovered:
   defined so the power rules keep holding. Root rules T15–T16 inherit from
   power rules.

Structure-skill families sit outside this tower: they cite devices (N4, N5,
N6, N8 — parsing), not laws, except `structure.same-value-different-structure`
(T18) and the familiar-shapes group (T17, T18).

---

## Coverage spot-check (families → coordinates), sample

| family | devices | laws |
|--------|---------|------|
| notation.explicit-vs-implicit-product | N1, N11 | — (pure convention) |
| notation.minus-as-times-negative-one | N3, N4 | T2, T4; ✗ Ā4 |
| notation.fraction-bar-grouping | N6 | — ; ✗ misreading N6 |
| notation.no-cancelling-in-a-sum | N6 | T8, T10; ✗ Ā1 |
| notation.coefficient-vs-exponent | N1, N2 | D3, D4; ✗ Ā5 |
| notation.power-of-a-sum | N8 | D4, T17; ✗ Ā1 |
| notation.number-plus-term | N1 | T7 (why it *stays* open); ✗ Ā3 |
| structure.product-with-inner-sum | N4, N5 | — |
| structure.difference-of-squares | N5, N8 | T18 |

Full tagging of all 64 families = the authoring pass, folded into the ongoing
teacher inspection.

---

## Resolved questions (2026-07-08)

1. Pitfalls may cite an anti-law and a device together (→ design decision 3).
2. D3 stays a definition (→ design decision 4).
3. **Right-distribution of division.** T8 works from the right only
   (`c/(a+b)` does NOT split); no family drilled that asymmetry — first
   genuine gap the matrix audit surfaced. → Add a new family (fractions
   group, contrasting with `notation.splitting-a-fraction`; pitfall
   `\frac{c}{a} + \frac{c}{b}` citing Ā1).
4. **Anti-laws stay flat** — no `derivedFrom` on them; the machinery isn't
   worth it.
5. **Conditions live on laws** (A8/D2 `≠ 0`; D7/T15/T16 `≥ 0`); families
   inherit the conditions of the laws they cite via `justifiedBy` instead of
   restating them, keeping the family-level `conditions` field only for
   caveats that aren't law-derived.
