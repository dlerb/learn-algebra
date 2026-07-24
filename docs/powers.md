# powers — one operation, three acts

The third and last layer of the tower, on top of **numbers** (`docs/numbers.md`).
Data: `src/data/powers/cards.json`; page: `/powers`. Tag: **`≙ aⁿ, n ∈ ℕ → ℤ → ℚ`**.

Merged 2026-07-23 out of the former `naturals` / `integers` / `rationals` layers.
Their design records survive one per act: `docs/powers-nat-act.md`,
`docs/powers-int-act.md`, `docs/powers-rat-act.md`. Read those for *why* each card
says what it says; this file is the layer-level structure.

## What it is

**Extending one operation across a widening exponent set** — and the three
extensions are not the same kind of step:

| act | exponent | the step | who supplies the value |
|---|---|---|---|
| ℕ | counts factors | **construction** by recursion; laws are theorems | we build it |
| ℤ | `a⁰`, `a⁻ⁿ` | **choice by permanence**; the law is the constraint, the definition the output | the field already has it |
| ℚ | roots | **existence**; the demand describes what the field cannot produce | `ax.completeness` must give it |

The unifier: **permanence always demands a value; what changes act to act is who
can supply it.** ℕ builds it, ℤ finds it, ℚ must be given it.

The arrow **reverses** at ℤ: below it, definitions came first and laws were proved
from them; from there on the law is named first and the definition falls out of it.

## Why one layer and not three (2026-07-23)

Once `def.nat`/`def.int`/`def.rat` moved down to **numbers**, what was left of the
three layers was 6 + 4 + 7 cards, all of them about the same operation. Three pages
for one three-act story is a worse reading order than one page, so long as the acts
stay visible — they do, as ten sections whose titles are prefixed `ℕ ·`, `ℤ ·`, `ℚ ·`.

The blocker had been that **`kind` keyed the section list**, so a layer could hold
only one `definition` section. Fixed in two lines: `Section` gained an optional
`slug`, `LayerView` keys on `s.slug ?? s.kind`, and the kind filter chips dedupe
(`[...new Set(...)]`) so one `definition` chip governs all three sections.
`validate()` now throws on a duplicate section key within a layer.

**The three old layer notes were not discarded**: each became the opening `note` of
its act's first section, which is why the acts still announce themselves. The
layer-level `meta.note` is new, and tells the three-act arc.

## Page order

```
ℕ · Notation                              ix.pow
ℕ · Natural exponents                     def.pow
ℕ · Power laws                            pl.same-base, pl.of-power, pl.of-product,
                                          pl.no-sum-law, th.negative-base
ℤ · Extending a definition                pre.permanence
ℤ · Integer exponents                     def.pow-zero, def.pow-neg
ℤ · The laws survive                      th.inverse-is-power, th.pow-laws-int
ℚ · When a demand names what is not there pre.existence
ℚ · Radical notation                      ix.root
ℚ · Roots and rational exponents          def.root, def.pow-rat
ℚ · Existence, uniqueness, and the fence  th.root-exists, th.principal-root,
                                          th.exponent-well-defined, th.pow-laws-rat,
                                          th.base-fence
```

Sections are **(act, kind)** pairs; `kind` is still the epistemic role, `slug` is
the key. Ids are slug-style throughout the tower (2026-07-23) — no numbered ids.

## Where the layer stops

`a^√2` is **not reachable** from here: there is no rational name to read, and no
algebraic demand settles it. Permanence fails a third way — not silence (`a⁰`), not
contradiction (negative bases), but **underdetermination**: Cauchy's functional
equation has infinitely many solutions that agree with `a^q` at every rational `q`.

⚠️ The ℚ act's note used to close by saying continuity settles it, "a new idea rather
than a new axiom". **That claim was deleted 2026-07-23** on the user's instruction —
it was wrong twice over. What is needed is a **tie-breaker**, and the cheapest one is
**monotonicity**, which the tower already owns through `ax.order-mul`; and both
routes to the value (`sup{a^q : q<x}` or a limit) rest on `ax.completeness` anyway,
so it is not axiom-free. **Completeness gives existence, order gives selection.**
Full sketch in `docs/powers-rat-act.md` and `docs/TODO.md`.
