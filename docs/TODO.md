# TODO

Status legend: [ ] not started · [~] in progress · [x] done

---

## fundament0 + naturals — current thread (2026-07-22)

Isolated clean rebuild of the field-axioms bedrock, separate from the `laws.json`
tower. Full rationale, structure, and design decisions in **`docs/fundament0.md`**.
Built and live at `/fundament0`: now the **full complete ordered field ℝ** (tag
`≙ ℝ`) — operations + relations (`+ · = <`) + infix convention + field/order/
completeness axioms + definitions + theorems, with a collapsed per-axiom
`intuition` field.

**Thread state:**
- [x] ~~Refine/extend the intuition layer.~~ **2026-07-22: every `intuition` that
  offers a *model* now names its own stopping point** (where the picture fails), in
  both layers. Rationale + the list in `docs/fundament0.md` (Design decisions).
- [ ] **School-facing simplification of the fundament (user's instinct, 2026-07-22).**
  The layers are deliberately deep and none of it is student-facing as written. The
  hypothesis to test later: **most of this can be collapsed for school use while
  keeping the important concepts *separate*** — the separation is the load-bearing
  part (definition vs theorem vs picture; opposite vs negative; object vs name), the
  depth is not. Related to but distinct from the second-field item below: that one
  adds prose per card, this one asks which cards a school version needs at all.
  Not started, no design yet.
- [ ] **A second, classroom-facing prose field per axiom/theorem** (name TBD, a
  sibling of `intuition`, not a replacement). `intuition` is written for the reader of
  the page — a teacher, or the author checking dependencies; what is missing is the
  same statement said the way it would be said to a 15-year-old. Two audiences, two
  failure modes, so two fields. **Deferred on purpose**: the field name and the
  writing standard both need deciding, and part of this may belong in the skills
  tower instead, which is the pedagogical bridge. Touches: both `cards.json` trees,
  `LayerView.vue` (a second collapsed toggle), `scripts/sweep-layers.mjs`.
- [x] ~~Powers (natural) as the ℕ-indexed layer *above* the field.~~ **Built
  2026-07-22 as the `naturals` layer** (`src/data/powers/cards.json`, `/powers`,
  tag `≙ ℕ ⊂ ℝ`) — see **`docs/powers-nat-act.md`**. The parked `pre.nat` import card was
  **rejected as false**: `def.nat` carves ℕ out of ℝ as the smallest inductive
  subset, so the layer assumes *nothing* and induction (`th.ind`) is a theorem.
  Cards: `pre.count` · `ix.pow`, `ix.juxtaposition` · `def.nat`, `def.numeral`,
  `def.multiple`, `def.pow` · `th.ind`, `th.numerals-distinct`,
  `th.multiple-is-product`, `pl.same-base`, `pl.of-power`, `pl.of-product`,
  `pl.no-sum-law`, `th.negative-base`. `0 ∉ ℕ` here (stated on the card as a
  *convention, not a fact*); decimal numerals deferred. **Revised 2026-07-22 after
  user pushback**: the "counter vs element" framing is RETIRED (ℕ ⊆ ℝ, so nothing is
  identified; the distinction is the ℤ-module/characteristic story, which ℝ dissolves).
  Replaced by the domain fact (`a^n` only for `n ∈ ℕ`) and "`n ↦ aⁿ` is a restriction
  of no field operation, `n·a` is". Card `th.numeral-arithmetic` added (`2+3=5`,
  `2·3=6` are theorems). Sources checked in `docs/powers-nat-act.md`.
- [x] ~~**ℤ layer — choice by permanence.**~~ **Built 2026-07-22** as the `integers`
  layer (`src/data/powers/cards.json`, `/powers`, tag `≙ aⁿ, n ∈ ℤ`) — see
  **`docs/powers-int-act.md`**. The arrow reverses: `pre.permanence` (Peacock 1834 / Hankel
  1867, a *method*, neither axiom nor theorem) → `def.int` · `def.pow-zero`
  (`a⁰ := 1`, forced; `0⁰` left undefined *and explained*) · `def.pow-neg`
  (`a⁻ⁿ := (aⁿ)⁻¹`, existence via `(a⁻¹)ⁿ` and `pl.of-product`) → `th.inverse-is-power`
  (fundament0's atomic `a⁻¹` notation is retroactively justified — closes the
  exponent-`-1` backlog item) · `th.pow-laws-int` (all three laws survive on ℤ).
  Payoff: **three species of "convention" side by side** — arbitrary (`0 ∈ ℕ`, `0⁰`),
  determined (`a⁰ = 1`), proved (the laws on ℤ).
- [x] ~~fundament0 `th.zero-product` **zero product**~~ (`ab = 0 ⇒ a = 0 or b = 0`) — added
  2026-07-22 alongside the ℤ layer. Converse of `th.zero-times`, one line from `ax.multiplicative-inverse`, and the
  basis of solving by factoring. Its stopping point: a property of *fields*, not of
  multiplication (`2·3 = 0` mod `6`).
- [ ] **Layer manifest follow-ups.** `src/data/layers.ts` + `LayerView` shipped
  2026-07-22 (routes + nav generated, citations resolve tower-wide,
  `pnpm sweep-layers` runs the KaTeX/refs/prose checks). Open: the layers are still
  separate *pages*; composing several into one scrolling page is unbuilt.
- [x] ~~Order + completeness slab (upgrades field → ℝ; unblocks roots).~~ **Built
  2026-07-18:** `op.lt` + `the four `ax.order-*`` (`ax.order-mul`'s `0<c` condition = the flip rule) + `ax.completeness`
  supremum axiom; positive/negative defined on `op.lt`; theorems th.opposite-flips (opposite
  flips positive/negative), th.minus-times-minus (`(−1)(−1)=1`, no order used), th.square-positive (non-zero
  square positive), th.zero-less-than-one (`0<1`). Tag moved to `≙ ℝ`; the word "sign" retired.
- [x] ~~**ℚ layer — existence** (roots + rational powers).~~ **Built 2026-07-22** as the
  `rationals` layer (`src/data/powers/cards.json`, `/powers`, tag `≙ aⁿ, n ∈ ℚ`) —
  see **`docs/powers-rat-act.md`**. `pre.existence` → `ix.root` → `def.rat` · `def.root`
  (by *description*, licensed by the theorem below it) · `def.pow-rat` →
  `th.root-exists` (**the first and only use of `ax.completeness`** — uniqueness is order,
  existence is completeness) · `th.principal-root` · `th.exponent-well-defined` (ℚ is
  the first layer with non-unique exponent *names*) · `th.pow-laws-rat` ·
  `th.base-fence`. Added `def.abs` to fundament0 for `√(x²) = |x|`.
  **The powers tower is complete: ℕ builds, ℤ finds, ℚ must be given.**
- [ ] **ℝ layer — real exponents (sketched 2026-07-22, not started; build LAST).**
  Small, ~5 cards, and worth it mainly to stop the fundament ending on a dangling
  "and then, analysis". **Behind the school-facing simplification**, which has far more
  classroom value per hour.

  **Permanence fails a third way here.** At `0⁰` it falls silent; at negative bases it
  contradicts itself; for irrational exponents it is **massively underdetermined**. The
  laws say `f(x+y) = f(x)·f(y)`, `f(1) = a` — Cauchy's functional equation — which has
  infinitely many solutions besides `aˣ` (Hamel basis). The sharp fact: those solutions
  **agree with `a^q` at every rational `q`** (forced by the equation) and differ at the
  irrationals. So all of ℚ can be pinned down and `a^√2` still is not.

  **Completeness = existence, order = selection.** Both routes to the value work and
  both rest on `ax.completeness`: `aˣ := sup{a^q : q ∈ ℚ, q < x}` (a>1), or `lim a^{q_k}` for
  `q_k → x`. But neither *selects*: the step "`q_k → x` therefore `a^{q_k} → aˣ`" is not
  a deduction, it is the assumption that the extension respects limits, i.e. continuity
  chosen by the method. What pins it down is an extra condition on the **function**, and
  **monotonicity suffices** — no continuity, no limits, and monotone is `ax.order-mul`
  vocabulary the tower already owns. Contrast with `th.root-exists`, which needed no
  extra criterion because it pinned an **element**, where order gave uniqueness free.
  The object being determined changed from an element to a function; that is the layer.

  **Use sup, not sequences.** `ax.completeness` is stated as a supremum axiom, so the sup version
  uses it directly. The sequence route needs convergence and Cauchy sequences defined
  first, well-definedness across sequences, and quietly the Archimedean property. Same
  destination, more machinery — and sup keeps the layer inside the fundament's existing
  vocabulary, which is the only reason it is cheap enough to consider.

  Cards: `pre.underdetermination` · `def.pow-real` (sup; a>1 / a=1 / a<1) ·
  `th.agrees-on-rationals` (the agreement-on-overlap beat, the first that genuinely
  could have failed) · `th.pow-laws-real` · **`th.unique-monotone`** (the payoff: `aˣ`
  is the unique monotone law-abiding extension — the only card in the tower where a
  definition is pinned by a *property* rather than a construction or a demand).
  Optional sixth, and the one school-facing idea: **the role swap** — fix `a`, let `x`
  run, and `x ↦ aˣ` becomes a *function*, the doorway to growth and logarithms.
  Caveat that belongs on a card, not in a footnote: the wild solutions need the axiom
  of choice; without it, it is consistent that all solutions are continuous.
- [x] ~~**Correction owed to `docs/powers-rat-act.md` + `src/data/powers/cards.json`**~~ —
  **done 2026-07-23**: the continuity sentence was deleted from the layer data on the
  user's instruction. The sketch below is kept as the record of *why* it was wrong. The
  layer note's closing line says `aˣ` "needs continuity, a new idea rather than a new
  axiom". Truer: it needs a **tie-breaker**, and the cheapest one is **monotonicity**,
  which the tower already owns. Fix whether or not the ℝ layer is built.

**Untangling backlog** — the conflations that make algebra hard (a concept living
in several layers at once; detail in `docs/fundament0.md`):
- [ ] Equality **number vs variable** (`a=a` trivial for a number, a universal claim
  for a variable; symmetry near-empty for numbers, load-bearing for variables).
- [x] ~~`3a = a+a+a` (definition) vs `3·a` (theorem) vs "three copies" (intuition).~~
  **Resolved 2026-07-22** — three separate cards in the naturals layer
  (`def.multiple` / `th.multiple-is-product` / its collapsed `intuition`).
- [ ] `1.23·a` — repeated addition breaks → forces `r·a` (product); needs decimal numerals.
- [x] ~~Minus / sign / subtraction — one glyph, three meanings.~~ **Resolved 2026-07-17:
  there are only *two* minuses — unary (`ax.additive-inverse`, `-a` and `-2` alike) and binary
  (`def.sub`). The third ("a number's own sign") does not exist in the notation.
  Shipped in `ax.additive-inverse` + `th.negative-one-times` + `ix.negative-factor`. Extended 2026-07-18: positive/negative built
  via order (`op.lt` + `ax.order-trichotomy`, `th.opposite-flips`), and the word "sign" retired from the data.**
- [x] ~~**Atomic object, composite name** — `-2² = -4` (parse the name) vs
  `(-2)² = 4` (square the object).~~ **Shipped 2026-07-22** as `th.negative-base`
  in the naturals layer: derived via `th.negative-one-times` + `ix.precedence` rather than decreed, brackets
  as the notation's name-maker (`ix.negative-factor`), and the "completion, not a correction"
  teaching stance in the card's `intuition`.
- [~] Powers & roots — the *theorem* half is built (natural exponents, by induction,
  plus `pl.no-sum-law`); definition-by-permanence (ℤ) and existence (ℚ, roots) remain.
- [ ] The exponent `-1`/`-n` — `b^{-1}` inverse-*notation* (fundament0) vs `a^{-1}` the literal-`-1` power vs `a^{-n}` operator-on-variable.
- [ ] Inverse-notation asymmetry — unary-minus *prefix* for `+`, no prefix for `·` (postfix `a^{-1}`). `a^{-1}` (primitive) vs `1/a` (derived, needs division); reserve "reciprocal" for `1/a`.
- [x] ~~Sign vs unary minus — "sign/Vorzeichen" = literal's sign only.~~ **Superseded
  2026-07-17 (too weak: `-2`'s minus is the unary *operator* too), then RETIRED
  2026-07-18: the word "sign" is dropped from the data entirely — only
  positive/negative/zero, each defined via `<`. See `docs/fundament0.md`.**

---

## Done — Taxonomy as data + reference library

- [x] Project setup (Vue 3, Vite, Pinia, Naive UI, UnoCSS, KaTeX)
- [x] Skill schema as Zod (`src/data/skill.schema.ts`) — single source for validator + `Skill` type
  - [x] `kind` discriminator = the skill's *mental step*: `equivalence` (equal-forms set), `recognition` (equal-forms set, but a Tier-2 "same value across different structure" step), `classification` (`examples` + `answer`), `chunking` (`examples[].chunks`); `transformation` reserved for Tier 3.
  - [x] Exercise type derived from `kind`, not stored; `flag`/`code` dropped as redundant
  - [x] Readable slug ids **kind-prefixed** (`<kind>.<slug>`), mirroring law `ax/def/thm`. `skill` (equivalence/classification/transformation) is DERIVED from kind via `skillOf()`, not stored, not in the id — the notation/structure namespace was retired 2026-07-13 (commit a05749f) because it conflated skill with naming and couldn't hold a third skill.
- [x] All 54 skills authored as JSON, one file per group (`src/data/skills/*.json`)
- [x] Groups + meta-patterns as namespaced data (`skillGroups.json`, `metapatterns.json`), referenced by skills
- [x] Load-time validation: schema, unique ids, group refs, meta-pattern refs (throws with offending id)
- [x] Read-only card view (`TaxonomyView.vue`) — green true-forms vs red pitfalls
- [x] Retired the old pre-refactor path (skills.ts, generator, SessionView, old schema docs)
- [x] Dependency graph: `requires` + pitfall-level `revise` in schema, graph validators, ~70 edges authored; notation ranked as a strict 1–28 sequence, structure 1–15, consistent with the DAG
- [x] Misconception wave (2026-07-08): 10 new skills (like-terms/conjoining group, embedded-minus pair, multiplying-into-a-bracket, power-of-a-sum, roots pair, no-cancelling-in-a-sum) + meta-pattern M6 (linearity illusion) — 64 skills total
- [x] Card view as inspection tool: drilling-order mode, skill ids on cards, per-card raw-JSON disclosure
- [x] **Tier-1 (notation) content COMPLETE (2026-07-10):** all 44 notation skills carry law/convention coordinates (`justifiedBy` / `conventions`); cited distractors added wherever a tempting wrong form exists (the empty pitfalls that remain — the basic-identity skills like `divide-by-one`, `bracket-types`, the commutativity pair — are distractor-free *by decision*, not omission); all 12 remaining notation notes migrated to the inline `$…$` prose contract. Notation audit now reads 0 untagged, 0 unmigrated prose. Commits `5bba71c`→`8b77b2c`. Two loose threads deferred (both incremental, see Tier-1 leftovers): German skill prose, and 4 exponent-extension distractors left uncited (no matching error pattern exists yet).

---

## NEXT SESSION — Tier 2 (structure) content pass

Tier-1 (notation) content is **fully complete** as of 2026-07-10 (tags +
distractors + prose contract — see the Done section). The 21 structure
skills are already authored (`structure` / `chunking` / 1 equivalence);
this pass completes them the way tier 1 was completed.

**Working hypotheses going in** (from the 2026-07-09 discussion — tier 1's
deep structure was laws + conventions; tier 2's is the **expression tree**):

- Dominant operation = root node; chunks = subtrees; the `structure` kind = naming
  the root; `chunking` = reading one level; the conventions (precedence,
  brackets, fraction bar, exponent scope) are the parsing rules from written
  string to tree. The tree is to tier 2 what the tower is to tier 1.
- Expect the five-way answer set (sum/difference/product/quotient/power) to
  come under pressure: `def.subtraction` collapses difference into sum
  (`structure.leading-minus` already answers "sum" for $-3x+2y$),
  `def.division` collapses quotient into product. Likely outcome: keep five
  (school-honest — students see five), but RECORD the collapse, as D3 records
  "provable but taught as definition."
- Familiar shapes are named TREE TEMPLATES ($a^2-b^2$ as pattern) — a
  different sort from root-naming, which is why the dominant-op `answer` fits
  them poorly. RESOLVED 2026-07-11: kept in `structure` but flagged
  `gateway: true` (Tier 2 → Tier 3 hinge), rather than a separate layer — see
  the resolved item below.
- The chunks-in-sum vs implicit-chunking overlap should dissolve once trees
  are the coordinate system: same tree operation through different devices.
- None of this is throwaway: MathJSON (Compute Engine, installed) IS the
  expression tree — this layer is the data structure the generator's
  degeneracy checks and the chunk-marking exercise need anyway.

**Timeline note (corrected 2026-07-10):** the earlier "students need it ~Sept /
school starts mid-Aug" deadline was LLM-invented, not the user's — real algebra
training starts later in the semester, so time is not the binding constraint.
The user works **bottom-up by preference**: finish a layer properly before the
next vertical step. Notation content is now fully done, so there is no tier-1
backfill left to parallelize; the vertical slice's critical path still runs
through notation equivalence skills (Same-or-Different first), which are
drill-ready. Sequencing is the user's call, not deadline-driven.

**The pass itself:**

- [x] **Familiar-Shapes representation DECIDED (2026-07-11).** Kept the 5 shapes (difference-of-squares, perfect-square-trinomial, common-factor, linear-form, quadratic-form) in the `structure` kind but flagged `gateway: true` — *classification-with-intent* that hinges Tier 2 → Tier 3 (recognising the shape is the trigger for a transformation). Chose the flag over a separate `kind`/`shape` field: the drill is still "name the dominant operation," the gateway just marks it as a Tier-3 trigger. Schema: `gateway: z.boolean().default(false)` on the structure variant (commit 7400524).
- [ ] **Resolve chunks-in-sum vs implicit-chunking overlap** (same example expressions, different emphasis) — merge or sharpen the contrast.
- [ ] **Inspect + tag the 21 structure skills** (18 untagged). Expect sparse law coordinates by design — structure is about parsing, so mostly conventions (`conv.brackets-group`, `conv.precedence`, `conv.fraction-bar`, `conv.exponent-scope`); only the shapes group and `same-value-different-structure` cite theorems. Add pitfall `cites` to the `structure` whys.
- [ ] **Migrate the 4 structure notes** (+ 2 whys) still in unicode math to `$…$` (audit counts them).
- [ ] **Empty pitfalls in structure** (12 skills): for the 5 basic forms that may be fine (no tempting wrong label); for the shapes group it isn't — decide per card.
- [ ] `chunking` drill format is still undefined (generator section) — the chunking group's data should be inspected with that open question in mind.

## Content — Tier 1 leftovers

Notation content is **complete (2026-07-10)** — the tagging, prose-migration,
and distractor items below are done. Only incremental threads remain.

- [x] Tag the 36 untagged notation skills → all 44 now carry coordinates (0 untagged).
- [x] Migrate the 12 notation notes in unicode math to `$…$` → notation prose fully on the contract.
- [x] Distractors for empty-pitfall notation skills → cited where a tempting wrong form fits; remaining empties (basic identities: `divide-by-one`, `bracket-types`, `redundant-brackets`, commutativity pair, `fraction-as-reciprocal-product`, `splitting-a-fraction`) are distractor-free by decision.
- [ ] German translations of skill notes/whys (incremental & cross-skill — better as one bilingual pass over notation + structure; layer files and meta-patterns already bilingual).
- [ ] Cite the 4 uncited exponent-extension distractors (`zero-and-one-exponent`, `negative-exponent`, `fractional-exponent-root`, `negative-fractional-exponent`) — blocked on an error pattern that fits, not on authoring.
- [ ] **Candidate metapattern: "multiplication makes bigger"** (2026-07-22). Not among
  M1–M10, which are all notation/structure. This one is a different kind: a property
  smuggled from the ℕ-model into ℝ (sibling: expecting `a^r` to behave like `aⁿ`).
  Errors-layer work; rationale in `docs/powers-nat-act.md`.
- [ ] Fine-tune taxonomy from classroom use (ongoing).
- [~] Prerequisites as a graph: `requires` + validators in schema; graph fully authored and priority-consistent (notation strict 1–29 after the 2026-07-09 insertion; structure basic forms 1–5, linear-form 14 with quadratic-form requiring it). The graph is a v1 hypothesis until drill data confirms it.
  - Open: `notation.minus-as-times-negative-one` stays unranked; it is the justification skill for minus-over-sum/subtracting-a-sum (carried by meta.three-minuses / meta.implicit-op-before-bracket), drilled later or not at all — confirm.
- [~] **Layer 1+2 — laws & notation conventions**: IMPLEMENTED 2026-07-09 — SOURCE OF TRUTH is `laws.json` (37: 9 ax / 7 def / 21 thm), `conventions.json` (12), `errors.json` (20: 5 false laws + 15 misreadings); `docs/content_model.md` is rationale only (no content tables — they'd drift). In-app **Laws & Conventions view** (`ReferenceView.vue`, tab in App.vue) renders law cards with derivation chains, conventions, error patterns. Schema + validators (sort↔id-prefix, DAG over `basedOn` ∪ `derivedFrom`, `of` refs, cross-layer refs), matrix-audit console report, meta-pattern `refs`, `justifiedBy`/`conventions` on skills, `cites` on pitfalls. LocalizedString (`{en, de}`, en fallback, de = Schweizer Hochdeutsch) + de/en toggle. Power laws carry classroom names incl. quotient/root forms; `thm.power-same-base-quotient` added (was missing). New skill `notation.no-splitting-the-denominator` ranked 26 (26–28 shifted to 27–29; notation now a strict 1–29 sequence). Meta-patterns migrated to slug ids (`meta.…` + display code M1–M6) with localized title/text (student-facing feedback takeaway); assignment stays authored — derivation tested and rejected (recovers all, over-generates); authored-⊆-derived is an audit line. Prose format contract: text + inline `$…$` KaTeX (`RichText.vue`; markdown rejected), `conditions` = pure LaTeX; load-time KaTeX compile check on every latex field and `$…$` segment. Remaining work is split into the tier-2 pass and tier-1 leftovers sections above; the audit reports live counts.
- [ ] Pitfall-level `revise` refs where an error points at a sharper gap than the skill's `requires` (schema supports it on all three kinds; author only where skill-level links aren't precise enough).
- [ ] Per-skill variation dimensions (what varies / constant / discriminating feature) — variation theory (Marton / bianshi).

---

## Exercise generators — derive drills from `kind`

- [ ] `equivalence` → Same-or-Different + Odd-One-Out (needs `equivalents` + `pitfalls`)
- [ ] `structure` → Name-the-Structure (needs `examples` + `answer`)
- [ ] `chunking` → Chunk-marking exercise (new format; needs `examples[].chunks`)
- [ ] `kind → available exercises` lookup table in code
- [ ] Generation params: per-skill, which letters vary over which pools (respect shared binding for equivalence, independent for `structure`). **The pool choice is the Tier-1↔Tier-3 selector** (atoms → Tier 1 recognition drill; compound/nested → Tier 3 drill of the same skill) — see vision.md #4 corollary.
- [ ] Substitute on the MathJSON tree via Compute Engine (installed, unused) — avoids raw-LaTeX string-collision
- [ ] Degeneracy checks on generated items: a drawn DIFFERENT pair must be verifiably non-equal (e.g. `b = 0` makes `-a+b` equal `-a-b`); respect `conditions`
- [ ] Skill workbench (dev-only view): skill card + live-generated drill items + degeneracy warnings — build after the generator exists

---

## Drill / session + progression

- [ ] Session structure (~12–15 items, mixed skills, clear end)
- [ ] Mastery tracking per skill (threshold e.g. 8 correct without error)
- [ ] Spaced repetition (mastered skills re-enter review queue)
- [ ] localStorage persistence for mastery + runtime state
- [ ] Progress overview screen (mastered / in progress / not started)
- [ ] Sequencing driven by `priority` + prerequisites; level progression (harder params after mastery)
- [ ] Diagnostic entry test (surfaces the gap on trivial-looking items)
- [ ] Meta-pattern lookup (the card view can serve as browsable reference, triggered by errors)

---

## Teacher dashboard (later)

- [ ] Per-student progress (skills mastered / stuck), highest error-rate skills across class, last session date
- [ ] Student account setup (teacher-issued codes or self-register) — implies a backend

---

## Technical / housekeeping

- [x] ~~`package.json` name is still `tmp`; README is the stock Vite template~~ — both
  fixed 2026-07-22: package is `learn-algebra` with a description, and the README now
  documents the two towers, the pages, the scripts, the prose contract and the doc index.
- [ ] Mobile layout polish (large tap targets, phone-readable)
- [ ] PWA setup (installable, offline)
- [ ] JSON Schema for IDE authoring: generate via `z.toJSONSchema(skill, { io: 'input' })`, register in `.vscode/settings.json` (`json.schemas`) for `src/data/skills/*.json` — autocomplete + inline validation while editing
- [ ] Consider renaming the `examples` field for the **`chunking`** kind (`{expr, chunks, op}`): each entry carries its *own* answer, so it's labeled ground-truth data, not illustrative "examples" — `cases` / `items` reads truer. Cosmetic; **bundle it with any future `{expr, ast}` migration** rather than churning it alone (touches schema + `TaxonomyView.vue` + all chunking JSON). Note: `structure` kind's `examples` (multiple exprs sharing one `answer`) is fine as-is — genuine examples of one class.
- [~] `pnpm validate` script (`scripts/validate.ts`, via `vite-node`) — runs the schema + graph validators (import side-effects) **plus** Compute-Engine AST checks on Tier 2 (root op-class vs `answer`/`op`; chunk count vs the tree's maximal root operands). CE first use; kept out of the app bundle. TODO: wire into CI; extend CE checks to Tier 1 (`equivalents` mutually equal, `pitfalls` non-equal at sampled points) and Tier-3 endpoint-grading; add full per-chunk structural match (needs sum/difference + sign reconciliation).

---

## Research to lean on

- [ ] Arcavi (1994) "Symbol Sense" — closest description of Tier 1+2 combined
- [ ] Hoch & Dreyfus (2004–2006) "Structure Sense" — maps to Tier 2
- [ ] Variation theory / bianshi — Contrast, Generalization, Separation, Fusion as design dimensions
- [ ] Devlin (2008) "It Ain't No Repeated Addition" (MAA) — multiplication is not
  repeated addition; the model breaks at fractions, scaling is the general notion.
  Directly under `th.multiple-is-product` and the deferred `1.23·a` card; also a live
  teacher argument, so worth knowing before a colleague raises it.

---

## Deferred — Tier 3 (Transformation / *Umformung*)

Blocked on: math input UX + equivalence verification.

**Design model (2026-07-11 discussion).** Tier 3 is *directed* equivalence:
Tiers 1 and 3 are both equivalence, split as **static** (Tier 1: "these are equal",
recognition) vs. **dynamic/directed** (Tier 3: "rewrite toward a goal", production).
Tier 3 = chains Tier 1 equivalences, located via Tier 2 parsing, toward a target — so it
*requires* both. A Tier 3 skill = Tier 1 equivalences + Tier 2 parsing + **a target**.

- The distinction from a Tier 1 *directed* drill is *given-vs-selected* /
  *isolated-vs-embedded*, not move count: Tier 1 = "know the move" (bare pattern,
  one forced rewrite, target implicit); Tier 3 = "know when/where/whether" (embedded,
  selected, sequenced). A single-move-but-embedded problem is already Tier 3.
- **`target: { direction, done }`** field. `direction` = the named intent
  (`factor`/`expand`/`combine`/`simplify`/…) and *is* the Tier 3 sub-taxonomy; one
  skill = one direction (multiple valid targets for an expression live *across*
  skills, chosen by the drill). `done` = a **predicate** (combine/simplify have
  no fixed endpoint); template skills like factor `a²−b²` carry a concrete
  target instead.
- **Endpoint-graded** — any valid route to the normal form passes. Needs a
  canonical **normalizer per direction** (equivalence = normalize-both-and-compare;
  `factor` is the awkward case). `steps` demote to teaching aid, not answer key;
  map common wrong endpoints to causes in `pitfalls`.
- New `kind:"transformation"` (greenfield — not yet in schema) + a new id-prefix
  namespace (e.g. `transform.`). The `structure` `gateway: true` skills are the
  Tier 2→Tier 3 recognition hinge that feeds it.

- [ ] Research MathLive as input component
- [ ] Design Tier 3 exercise format (endpoint-graded per above)
- [ ] Compute Engine for equivalence checking + per-direction normalizers
- [ ] **Drill "dirty" expressions** — Tier-3 terms will need to contain messy sub-forms (`a/1`, `--a`, unsimplified coefficients) that the student must handle/clean as part of the transformation. Deferred, but a real requirement for the transformation drills.
- [ ] Add the `transformation` `kind` to the schema (`target` field); ids get the `transformation.` prefix like every other kind (no separate namespace — skill derives from kind)
- [ ] Author Tier 3 skills; wire the `gateway` shapes as their recognition triggers
- [ ] **Coefficient-lens chunking** (`2x(x+1) → [2x, (x+1)]`, keeping the coefficient with its variable): operation-relative grouping, the recognition-half of an *expand* move — author as a Tier-3 skill. The example was removed from the Tier-2 `chunking.chunks-in-product` card on 2026-07-11 (Tier-2 chunking is maximal/flat: `[2, x, (x+1)]`); this is where its coefficient-lens version lands.

## Open questions — salvaged from archived taxonomy docs (2026-07-13)

Rescued from `docs/archive/taxonomy_skill{1,2}_*.md` before archiving; the rest of
those docs' questions are already resolved (drilling priority now lives in the
`priority` field; the Tier-2↔3 gateway is decided via `gateway`/`recognition`).

- [ ] Are there Swiss/German textbook notation conventions that differ from the authored set? (audit against a local textbook)
- [ ] Should `ab`-as-a-product vs a two-letter variable name get its own skill? (matters in physics/chemistry contexts)
- [ ] Meta-patterns: taught explicitly in class *before* drilling starts, or embedded only in drill feedback?
- [ ] Is "linear form" trivial enough to drop as a familiar-shape skill, or does naming it explicitly earn its place?
