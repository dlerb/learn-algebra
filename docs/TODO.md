# TODO

Status legend: [ ] not started · [~] in progress · [x] done

---

## Done — Taxonomy as data + reference library

- [x] Project setup (Vue 3, Vite, Pinia, Naive UI, UnoCSS, KaTeX)
- [x] Family schema as Zod (`src/data/family.schema.ts`) — single source for validator + `Family` type
  - [x] `kind` discriminator = the family's *mental step*: `equivalence` (equal-forms set), `recognition` (equal-forms set, but a Skill-2 "same value across different structure" step), `classification` (`examples` + `answer`), `chunking` (`examples[].chunks`); `transformation` reserved for Skill 3.
  - [x] Exercise type derived from `kind`, not stored; `flag`/`code` dropped as redundant
  - [x] Readable slug ids **kind-prefixed** (`<kind>.<slug>`), mirroring law `ax/def/thm`. `skill` (equivalence/classification/transformation) is DERIVED from kind via `skillOf()`, not stored, not in the id — the notation/structure namespace was retired 2026-07-13 (commit a05749f) because it conflated skill with naming and couldn't hold a third skill.
- [x] All 54 families authored as JSON, one file per group (`src/data/families/*.json`)
- [x] Groups + meta-patterns as namespaced data (`familyGroups.json`, `metapatterns.json`), referenced by families
- [x] Load-time validation: schema, unique ids, group refs, meta-pattern refs (throws with offending id)
- [x] Read-only card view (`TaxonomyView.vue`) — green true-forms vs red pitfalls
- [x] Retired the old pre-refactor path (families.ts, generator, SessionView, old schema docs)
- [x] Dependency graph: `requires` + pitfall-level `revise` in schema, graph validators, ~70 edges authored; notation ranked as a strict 1–28 sequence, structure 1–15, consistent with the DAG
- [x] Misconception wave (2026-07-08): 10 new families (like-terms/conjoining group, embedded-minus pair, multiplying-into-a-bracket, power-of-a-sum, roots pair, no-cancelling-in-a-sum) + meta-pattern M6 (linearity illusion) — 64 families total
- [x] Card view as inspection tool: drilling-order mode, family ids on cards, per-card raw-JSON disclosure
- [x] **Skill-1 (notation) content COMPLETE (2026-07-10):** all 44 notation families carry law/convention coordinates (`justifiedBy` / `conventions`); cited distractors added wherever a tempting wrong form exists (the empty pitfalls that remain — the basic-identity families like `divide-by-one`, `bracket-types`, the commutativity pair — are distractor-free *by decision*, not omission); all 12 remaining notation notes migrated to the inline `$…$` prose contract. Notation audit now reads 0 untagged, 0 unmigrated prose. Commits `5bba71c`→`8b77b2c`. Two loose threads deferred (both incremental, see Skill-1 leftovers): German family prose, and 4 exponent-extension distractors left uncited (no matching error pattern exists yet).

---

## NEXT SESSION — Skill 2 (structure) content pass

Skill-1 (notation) content is **fully complete** as of 2026-07-10 (tags +
distractors + prose contract — see the Done section). The 21 structure
families are already authored (`structure` / `chunking` / 1 equivalence);
this pass completes them the way skill 1 was completed.

**Working hypotheses going in** (from the 2026-07-09 discussion — skill 1's
deep structure was laws + conventions; skill 2's is the **expression tree**):

- Dominant operation = root node; chunks = subtrees; the `structure` kind = naming
  the root; `chunking` = reading one level; the conventions (precedence,
  brackets, fraction bar, exponent scope) are the parsing rules from written
  string to tree. The tree is to skill 2 what the tower is to skill 1.
- Expect the five-way answer set (sum/difference/product/quotient/power) to
  come under pressure: `def.subtraction` collapses difference into sum
  (`structure.leading-minus` already answers "sum" for $-3x+2y$),
  `def.division` collapses quotient into product. Likely outcome: keep five
  (school-honest — students see five), but RECORD the collapse, as D3 records
  "provable but taught as definition."
- Familiar shapes are named TREE TEMPLATES ($a^2-b^2$ as pattern) — a
  different sort from root-naming, which is why the dominant-op `answer` fits
  them poorly. RESOLVED 2026-07-11: kept in `structure` but flagged
  `gateway: true` (Skill 2 → Skill 3 hinge), rather than a separate layer — see
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
next vertical step. Notation content is now fully done, so there is no skill-1
backfill left to parallelize; the vertical slice's critical path still runs
through notation equivalence families (Same-or-Different first), which are
drill-ready. Sequencing is the user's call, not deadline-driven.

**The pass itself:**

- [x] **Familiar-Shapes representation DECIDED (2026-07-11).** Kept the 5 shapes (difference-of-squares, perfect-square-trinomial, common-factor, linear-form, quadratic-form) in the `structure` kind but flagged `gateway: true` — *classification-with-intent* that hinges Skill 2 → Skill 3 (recognising the shape is the trigger for a transformation). Chose the flag over a separate `kind`/`shape` field: the drill is still "name the dominant operation," the gateway just marks it as a Skill-3 trigger. Schema: `gateway: z.boolean().default(false)` on the structure variant (commit 7400524).
- [ ] **Resolve chunks-in-sum vs implicit-chunking overlap** (same example expressions, different emphasis) — merge or sharpen the contrast.
- [ ] **Inspect + tag the 21 structure families** (18 untagged). Expect sparse law coordinates by design — structure is about parsing, so mostly conventions (`conv.brackets-group`, `conv.precedence`, `conv.fraction-bar`, `conv.exponent-scope`); only the shapes group and `same-value-different-structure` cite theorems. Add pitfall `cites` to the `structure` whys.
- [ ] **Migrate the 4 structure notes** (+ 2 whys) still in unicode math to `$…$` (audit counts them).
- [ ] **Empty pitfalls in structure** (12 families): for the 5 basic forms that may be fine (no tempting wrong label); for the shapes group it isn't — decide per card.
- [ ] `chunking` drill format is still undefined (generator section) — the chunking group's data should be inspected with that open question in mind.

## Content — Skill 1 leftovers

Notation content is **complete (2026-07-10)** — the tagging, prose-migration,
and distractor items below are done. Only incremental threads remain.

- [x] Tag the 36 untagged notation families → all 44 now carry coordinates (0 untagged).
- [x] Migrate the 12 notation notes in unicode math to `$…$` → notation prose fully on the contract.
- [x] Distractors for empty-pitfall notation families → cited where a tempting wrong form fits; remaining empties (basic identities: `divide-by-one`, `bracket-types`, `redundant-brackets`, commutativity pair, `fraction-as-reciprocal-product`, `splitting-a-fraction`) are distractor-free by decision.
- [ ] German translations of family notes/whys (incremental & cross-skill — better as one bilingual pass over notation + structure; layer files and meta-patterns already bilingual).
- [ ] Cite the 4 uncited exponent-extension distractors (`zero-and-one-exponent`, `negative-exponent`, `fractional-exponent-root`, `negative-fractional-exponent`) — blocked on an error pattern that fits, not on authoring.
- [ ] Fine-tune taxonomy from classroom use (ongoing).
- [~] Prerequisites as a graph: `requires` + validators in schema; graph fully authored and priority-consistent (notation strict 1–29 after the 2026-07-09 insertion; structure basic forms 1–5, linear-form 14 with quadratic-form requiring it). The graph is a v1 hypothesis until drill data confirms it.
  - Open: `notation.minus-as-times-negative-one` stays unranked; it is the justification family for minus-over-sum/subtracting-a-sum (carried by meta.three-minuses / meta.implicit-op-before-bracket), drilled later or not at all — confirm.
- [~] **Layer 1+2 — laws & notation conventions**: IMPLEMENTED 2026-07-09 — SOURCE OF TRUTH is `laws.json` (37: 9 ax / 7 def / 21 thm), `conventions.json` (12), `errors.json` (20: 5 false laws + 15 misreadings); `docs/content_model.md` is rationale only (no content tables — they'd drift). In-app **Laws & Conventions view** (`ReferenceView.vue`, tab in App.vue) renders law cards with derivation chains, conventions, error patterns. Schema + validators (sort↔id-prefix, DAG over `basedOn` ∪ `derivedFrom`, `of` refs, cross-layer refs), matrix-audit console report, meta-pattern `refs`, `justifiedBy`/`conventions` on families, `cites` on pitfalls. LocalizedString (`{en, de}`, en fallback, de = Schweizer Hochdeutsch) + de/en toggle. Power laws carry classroom names incl. quotient/root forms; `thm.power-same-base-quotient` added (was missing). New family `notation.no-splitting-the-denominator` ranked 26 (26–28 shifted to 27–29; notation now a strict 1–29 sequence). Meta-patterns migrated to slug ids (`meta.…` + display code M1–M6) with localized title/text (student-facing feedback takeaway); assignment stays authored — derivation tested and rejected (recovers all, over-generates); authored-⊆-derived is an audit line. Prose format contract: text + inline `$…$` KaTeX (`RichText.vue`; markdown rejected), `conditions` = pure LaTeX; load-time KaTeX compile check on every latex field and `$…$` segment. Remaining work is split into the skill-2 pass and skill-1 leftovers sections above; the audit reports live counts.
- [ ] Pitfall-level `revise` refs where an error points at a sharper gap than the family's `requires` (schema supports it on all three kinds; author only where family-level links aren't precise enough).
- [ ] Per-family variation dimensions (what varies / constant / discriminating feature) — variation theory (Marton / bianshi).

---

## Exercise generators — derive drills from `kind`

- [ ] `equivalence` → Same-or-Different + Odd-One-Out (needs `equivalents` + `pitfalls`)
- [ ] `structure` → Name-the-Structure (needs `examples` + `answer`)
- [ ] `chunking` → Chunk-marking exercise (new format; needs `examples[].chunks`)
- [ ] `kind → available exercises` lookup table in code
- [ ] Generation params: per-family, which letters vary over which pools (respect shared binding for equivalence, independent for `structure`). **The pool choice is the Skill-1↔Skill-3 selector** (atoms → S1 recognition drill; compound/nested → S3 drill of the same family) — see vision.md #4 corollary.
- [ ] Substitute on the MathJSON tree via Compute Engine (installed, unused) — avoids raw-LaTeX string-collision
- [ ] Degeneracy checks on generated items: a drawn DIFFERENT pair must be verifiably non-equal (e.g. `b = 0` makes `-a+b` equal `-a-b`); respect `conditions`
- [ ] Family workbench (dev-only view): family card + live-generated drill items + degeneracy warnings — build after the generator exists

---

## Drill / session + progression

- [ ] Session structure (~12–15 items, mixed families, clear end)
- [ ] Mastery tracking per family (threshold e.g. 8 correct without error)
- [ ] Spaced repetition (mastered families re-enter review queue)
- [ ] localStorage persistence for mastery + runtime state
- [ ] Progress overview screen (mastered / in progress / not started)
- [ ] Sequencing driven by `priority` + prerequisites; level progression (harder params after mastery)
- [ ] Diagnostic entry test (surfaces the gap on trivial-looking items)
- [ ] Meta-pattern lookup (the card view can serve as browsable reference, triggered by errors)

---

## Teacher dashboard (later)

- [ ] Per-student progress (families mastered / stuck), highest error-rate families across class, last session date
- [ ] Student account setup (teacher-issued codes or self-register) — implies a backend

---

## Technical / housekeeping

- [ ] `package.json` name is still `tmp`; README is the stock Vite template
- [ ] Mobile layout polish (large tap targets, phone-readable)
- [ ] PWA setup (installable, offline)
- [ ] JSON Schema for IDE authoring: generate via `z.toJSONSchema(family, { io: 'input' })`, register in `.vscode/settings.json` (`json.schemas`) for `src/data/families/*.json` — autocomplete + inline validation while editing
- [ ] Consider renaming the `examples` field for the **`chunking`** kind (`{expr, chunks, op}`): each entry carries its *own* answer, so it's labeled ground-truth data, not illustrative "examples" — `cases` / `items` reads truer. Cosmetic; **bundle it with any future `{expr, ast}` migration** rather than churning it alone (touches schema + `TaxonomyView.vue` + all chunking JSON). Note: `structure` kind's `examples` (multiple exprs sharing one `answer`) is fine as-is — genuine examples of one class.
- [~] `pnpm validate` script (`scripts/validate.ts`, via `vite-node`) — runs the schema + graph validators (import side-effects) **plus** Compute-Engine AST checks on Skill 2 (root op-class vs `answer`/`op`; chunk count vs the tree's maximal root operands). CE first use; kept out of the app bundle. TODO: wire into CI; extend CE checks to Skill 1 (`equivalents` mutually equal, `pitfalls` non-equal at sampled points) and Skill-3 endpoint-grading; add full per-chunk structural match (needs sum/difference + sign reconciliation).

---

## Research to lean on

- [ ] Arcavi (1994) "Symbol Sense" — closest description of Skill 1+2 combined
- [ ] Hoch & Dreyfus (2004–2006) "Structure Sense" — maps to Skill 2
- [ ] Variation theory / bianshi — Contrast, Generalization, Separation, Fusion as design dimensions

---

## Deferred — Skill 3 (Transformation / *Umformung*)

Blocked on: math input UX + equivalence verification.

**Design model (2026-07-11 discussion).** Skill 3 is *directed* equivalence:
Skills 1 and 3 are both equivalence, split as **static** (S1: "these are equal",
recognition) vs. **dynamic/directed** (S3: "rewrite toward a goal", production).
S3 = chains S1 equivalences, located via S2 parsing, toward a target — so it
*requires* both. A S3 family = S1 equivalences + S2 parsing + **a target**.

- The distinction from a S1 *directed* drill is *given-vs-selected* /
  *isolated-vs-embedded*, not move count: S1 = "know the move" (bare pattern,
  one forced rewrite, target implicit); S3 = "know when/where/whether" (embedded,
  selected, sequenced). A single-move-but-embedded problem is already S3.
- **`target: { direction, done }`** field. `direction` = the named intent
  (`factor`/`expand`/`combine`/`simplify`/…) and *is* the S3 sub-taxonomy; one
  family = one direction (multiple valid targets for an expression live *across*
  families, chosen by the drill). `done` = a **predicate** (combine/simplify have
  no fixed endpoint); template families like factor `a²−b²` carry a concrete
  target instead.
- **Endpoint-graded** — any valid route to the normal form passes. Needs a
  canonical **normalizer per direction** (equivalence = normalize-both-and-compare;
  `factor` is the awkward case). `steps` demote to teaching aid, not answer key;
  map common wrong endpoints to causes in `pitfalls`.
- New `kind:"transformation"` (greenfield — not yet in schema) + a new id-prefix
  namespace (e.g. `transform.`). The `structure` `gateway: true` families are the
  S2→S3 recognition hinge that feeds it.

- [ ] Research MathLive as input component
- [ ] Design Skill 3 exercise format (endpoint-graded per above)
- [ ] Compute Engine for equivalence checking + per-direction normalizers
- [ ] **Drill "dirty" expressions** — Skill-3 terms will need to contain messy sub-forms (`a/1`, `--a`, unsimplified coefficients) that the student must handle/clean as part of the transformation. Deferred, but a real requirement for the transformation drills.
- [ ] Add the `transformation` `kind` to the schema (`target` field); ids get the `transformation.` prefix like every other kind (no separate namespace — skill derives from kind)
- [ ] Author Skill 3 families; wire the `gateway` shapes as their recognition triggers
- [ ] **Coefficient-lens chunking** (`2x(x+1) → [2x, (x+1)]`, keeping the coefficient with its variable): operation-relative grouping, the recognition-half of an *expand* move — author as a Skill-3 family. The example was removed from the Skill-2 `chunking.chunks-in-product` card on 2026-07-11 (Skill-2 chunking is maximal/flat: `[2, x, (x+1)]`); this is where its coefficient-lens version lands.

## Open questions — salvaged from archived taxonomy docs (2026-07-13)

Rescued from `docs/archive/taxonomy_skill{1,2}_*.md` before archiving; the rest of
those docs' questions are already resolved (drilling priority now lives in the
`priority` field; the Skill-2↔3 gateway is decided via `gateway`/`recognition`).

- [ ] Are there Swiss/German textbook notation conventions that differ from the authored set? (audit against a local textbook)
- [ ] Should `ab`-as-a-product vs a two-letter variable name get its own family? (matters in physics/chemistry contexts)
- [ ] Meta-patterns: taught explicitly in class *before* drilling starts, or embedded only in drill feedback?
- [ ] Is "linear form" trivial enough to drop as a familiar-shape family, or does naming it explicitly earn its place?
