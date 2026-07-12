# Skill 2 — The Grammar (production rules)

Status: **design sketch (2026-07-12), for review.** Not yet built. Once
`grammar.json` exists it becomes the source of truth and this doc reverts to
rationale only (no content tables — they would drift), the same way
`laws_and_conventions.md` relates to `laws.json`.

## Why this exists

Skill 1 feels systematic because its content sits on a materialized backbone —
the law tower (`laws.json`) plus conventions — and every family cites it. Skill 2
has had no such backbone: the structure/chunking families were a flat list of
example expressions floating free of any system, which is why they felt ad hoc.

The backbone Skill 2 was missing is a **grammar**: a small set of recursive
**production rules** (one per operator construct) that say how an expression
decomposes, disambiguated by the parsing **conventions**. This is the exact
structural analog of Skill 1:

| | the "atoms" | the disambiguation | the family |
|---|---|---|---|
| **Skill 1** | laws (axioms/defs/theorems) | conventions | curated *law × convention* cell |
| **Skill 2** | grammar productions | **parsing** conventions | curated *production × obscuring-convention* cell |

Note the roles **swap**: in Skill 1 the laws are the rich content and conventions
are glue; in Skill 2 the productions are a near-tautological skeleton and the
**conventions (N1–N9) are the real content** — precedence, juxtaposition,
brackets, exponent scope are where all the reading errors live.

## The core idea: annotation over Compute Engine, not a new parser

We do **not** write a grammar engine. **Compute Engine is the parser.**
`grammar.json` is a thin layer that *annotates CE's node types* with the teaching
vocabulary — name, precedence, the conventions that govern them, the
student-facing metapattern digests, and the `dominantOp` labels they carry.

The one operational field is **`astHead`**: it maps a production to CE's root
operator (`Add`, `Multiply`, `Power`, `Divide`, …). Everything else on a
production is declarative content, exactly like a law's `latex`/`name` are
declarative. So the split of labor is:

- **Compute Engine** — parses, recurses, and splits (offline; never in the app
  runtime; never used to render — see the display principle in `app_design.md`).
- **`grammar.json`** — annotates CE's nodes, links to conventions/metapatterns,
  supplies the coverage matrix.
- **The authored LaTeX string** — remains the source of truth for display.

## Where recursion lives — in the tree, never as a field

MathJSON is already recursive: `a(b+c)·d` parses to
`Multiply(a, Add(b,c), d)`, and that `Add` operand is itself a subtree. So
"recursion" is just tree traversal — the grammar never states a recursive rule.
The whole chunker is:

```
chunk(node):
    prod = productionByAstHead[node.head]
    if prod is atom:  return [node]        # base case — does not split
    return node.operands                   # one level: the chunks (each a subtree)
# to go deeper, call chunk() again on any operand
```

One level of chunking = read a node's operands. "Make a and b more complicated"
= those operands are themselves compound subtrees. Difficulty is recursion depth,
not new rules — the same lever as the Skill-1↔3 pool parameter.

## The codes referenced here (`N·` and `M·`)

These are **not new** — they are the existing layers Skill 1 already cites,
referenced by their classroom display codes. `N·` = a **convention** in
`conventions.json` (its `code`); `M·` = a **metapattern** in `metapatterns.json`
(structure namespace). Only the ones used below are listed; the grammar invents
no new disambiguation content, it points at what already exists.

| code | id | in one line |
|---|---|---|
| N1 | `conv.juxtaposition` | juxtaposition means multiplication |
| N3 | `conv.minus-roles` | one minus symbol, three roles (binary / unary / sign) |
| N4 | `conv.brackets-group` | brackets group (and override precedence) |
| N5a | `conv.precedence-power` | powers bind first (power tighter than × ÷) |
| N5b | `conv.precedence-point-line` | point before line (× ÷ tighter than + −) |
| N6 | `conv.fraction-bar` | the fraction bar is a bracket |
| N7 | `conv.division-signs` | division signs are synonyms |
| N8 | `conv.exponent-scope` | exponent scope |
| N9 | `conv.root-groups` | the root sign groups its radicand |
| N12 | `conv.adjacent-signs` | adjacent operation signs must be bracketed |
| M1 | `meta.dominant-op-last` | the dominant operation is the last one applied |
| M2 | `meta.bracket-chunk` | brackets make a chunk |
| M3 | `meta.multiplication-binds-tighter` | multiplication binds tighter than + − |

## The productions (the set)

Precedence-ordered, loosest binds first (= splits first = the dominant
operation). `roles` names the operands the production yields; a single label
means the rule is variadic and homogeneous.

| id | rank | dominantOp label(s) | astHead | roles | governed by | digest |
|---|---|---|---|---|---|---|
| `prod.additive` | 1 | sum, difference | `Add` | *terms* (variadic) | N5b, N3, N12 | M1, M3 |
| `prod.multiplicative` | 2 | product | `Multiply` | *factors* (variadic) | N1, N5a, N5b, N7 | M3, M1 |
| `prod.fraction` | 2 | quotient | `Divide`/`Rational` | numerator, denominator | N6, N7 | M1, M2 |
| `prod.power` | 4 | power | `Power` | base, exponent | N8 | M1 |
| `prod.root` | 4 | *(none — see open q.)* | `Sqrt`/`Root` | radicand, (index) | N9 | M2 |
| *(modifier)* `prod.sign` | 3 | — | `Negate` | (the term) | N3 | — |
| *(base)* `prod.atom` | — | — | *leaf* | — | — | — |

Brackets are deliberately **not** a production: a bracketed group is not a CE
node (CE elides it — `(a+b)` is just `Add(a,b)`), it is the **convention `N4`
(brackets group)** that the productions cite. So "bracket as a chunk" is a
convention effect, not a rule of its own.

## How families sit on the grammar (thin link)

Decided **thin/derived**: a family declares its production *implicitly* via its
existing `answer`/`op` `dominantOp` label (`sum` → `prod.additive`). No new
per-family `produces` field. The label→production map is fixed and lives in the
grammar (`labels`).

Two family kinds fall out of the grammar:

- **`basic-forms` = a production in isolation** (atomic operands): Sum,
  Difference, Product, Quotient, Power. Five families, the five productions,
  taught clean.
- **`misleading-forms` = a production where a glyph tempts the wrong production,
  resolved by a convention** — the *production × obscuring-convention* cell:

| family | correct production | tempts | resolved by |
|---|---|---|---|
| Sum of products (`ab + cd`) | additive | split at `·` | N5 / M3 |
| Product containing a sum (`a(b+c)`) | multiplicative | split at `+` | N4 / M2 |
| Coefficient before a power (`3x²`) | multiplicative → `[3, x²]` | read `(3x)²` | N8 |
| Leading minus (`−3x + 2y`) | additive (sum) | read as difference | N3 |
| Power containing a sum (`(a+b)²`) | power → `[(a+b), 2]` | read as a sum | N8 / N4 |
| Complex quotient (`(a+b)/(c−d)`) | fraction → `[num, den]` | split at inner `+`/`−` | N6 |

The concrete family work this unlocks: **tag the untagged-17 families with the
`conv.*` their production's `governedBy` lists** — the grammar now *tells you*
which conventions each family should cite, instead of guessing. And it gives
Skill 2 the same **coverage matrix** Skill 1 has: audit *production × convention*
cells for gaps.

## Familiar-shapes are a separate layer

The `familiar-shapes` group (difference of squares, perfect-square trinomial, …)
is **not** part of this grammar. Those are recognition-with-intent — templates
matched against an already-parsed tree, the S2→S3 `gateway` families. They sit
*on top of* the grammar, not inside it.

## `grammar.json` shape (the fields)

```json
{
  "id": "prod.power",
  "code": "P4",
  "name": { "en": "Power", "de": "Potenz" },
  "rank": 4,
  "labels": ["power"],
  "astHead": "Power",
  "arity": "binary",
  "roles": ["base", "exponent"],
  "governedBy": ["conv.exponent-scope"],
  "digest": ["meta.dominant-op-last"]
}
```

Validators (mirroring the law-layer validators): every `governedBy` resolves to a
real convention; every `digest` to a real metapattern; the `labels` partition the
`dominantOp` enum (each label owned by exactly one production); `astHead` is what
the `pnpm validate` op-class check keys off (an example's AST root head must
belong to its family's production). Audit line: production × convention coverage.

## Open questions

- **Root has no `dominantOp` label.** The enum is sum/difference/product/quotient/
  power — no "root". Either add it, or treat roots as grouping-atoms (rare enough
  at Skill-2 level). Decide during authoring.
- **Unary-minus scope.** `−a² = −(a²)` sits awkwardly between `prod.sign` and
  `prod.power` (N3 + N8). It is the same subtlety Skill 1 teaches as "negative
  base vs. negated square" — flag it, don't pretend the level is clean.
- **Surface positions for interactive drills.** CE gives the semantic tree
  (chunks, recursion, op-class) but **not** surface positions, and it reorders
  and normalizes. A "click the separating operator / mark the boundary" drill
  needs positioned boundaries on the *surface* string, which CE does not provide.
  That is a separate concern from this grammar (author boundaries, or a surface
  splitter) — unresolved, tracked with the generator work.
