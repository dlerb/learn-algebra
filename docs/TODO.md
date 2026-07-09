# TODO

Status legend: [ ] not started · [~] in progress · [x] done

---

## Done — Taxonomy as data + reference library

- [x] Project setup (Vue 3, Vite, Pinia, Naive UI, UnoCSS, KaTeX)
- [x] Family schema as Zod (`src/data/family.schema.ts`) — single source for validator + `Family` type
  - [x] `kind` discriminator: `equivalence` (correct forms + `pitfalls`), `classification` (`examples` + `answer` + `pitfalls`), `decomposition` (chunking)
  - [x] Exercise type derived from `kind`, not stored; `skill`/`flag`/`code` dropped as redundant
  - [x] Readable slug ids (`notation.<slug>` / `structure.<slug>`); namespace = skill
- [x] All 54 families authored as JSON, one file per group (`src/data/families/*.json`)
- [x] Groups + meta-patterns as namespaced data (`groups.json`, `metapatterns.json`), referenced by families
- [x] Load-time validation: schema, unique ids, group refs, meta-pattern refs (throws with offending id)
- [x] Read-only card view (`TaxonomyView.vue`) — green true-forms vs red pitfalls
- [x] Retired the old pre-refactor path (families.ts, generator, SessionView, old schema docs)
- [x] Dependency graph: `requires` + pitfall-level `revise` in schema, graph validators, ~70 edges authored; notation ranked as a strict 1–28 sequence, structure 1–15, consistent with the DAG
- [x] Misconception wave (2026-07-08): 10 new families (like-terms/conjoining group, embedded-minus pair, multiplying-into-a-bracket, power-of-a-sum, roots pair, no-cancelling-in-a-sum) + meta-pattern M6 (linearity illusion) — 64 families total
- [x] Card view as inspection tool: drilling-order mode, family ids on cards, per-card raw-JSON disclosure

---

## NEXT SESSION — Skill 2 (structure) content pass

Skill-1 (notation) content pass declared done 2026-07-09. The 21 structure
families are already authored (classification / decomposition / 1 equivalence);
this pass completes them the way skill 1 was completed:

- [ ] **Decide Familiar-Shapes representation** (blocking the rest of the D-group pass). The group (difference-of-squares, perfect-square, quadratic, …) fits `classification` poorly — the real skill is "name the shape," which the dominant-op `answer` can't express. Options: a `shape` field, or a new recognition `kind`. Currently authored as classification with the shape in the note.
- [ ] **Resolve chunks-in-sum vs implicit-chunking overlap** (same example expressions, different emphasis) — merge or sharpen the contrast.
- [ ] **Inspect + tag the 21 structure families** (18 untagged). Expect sparse law coordinates by design — structure is about parsing, so mostly conventions (`conv.brackets-group`, `conv.precedence`, `conv.fraction-bar`, `conv.exponent-scope`); only the shapes group and `same-value-different-structure` cite theorems. Add pitfall `cites` to the classification whys.
- [ ] **Migrate the 4 structure notes** (+ 2 whys) still in unicode math to `$…$` (audit counts them).
- [ ] **Empty pitfalls in structure** (12 families): for the 5 basic forms that may be fine (no tempting wrong label); for the shapes group it isn't — decide per card.
- [ ] Decomposition drill format is still undefined (generator section) — the chunking group's data should be inspected with that open question in mind.

## Content — Skill 1 leftovers (non-blocking, incremental)

- [ ] Tag the 36 untagged notation families (audit counts down; fold into any later pass).
- [ ] Migrate the 12 notation notes still in unicode math to `$…$`.
- [ ] Add distractors to pure-notation families whose `pitfalls` are empty (12 families: bracket-types, commutativity, division-variants, …) — needed before they can generate "DIFFERENT" drill items.
- [ ] German translations of family notes/whys (incremental; layer files and meta-patterns are already bilingual).
- [ ] Fine-tune taxonomy from classroom use (ongoing).
- [~] Prerequisites as a graph: `requires` + validators in schema; graph fully authored and priority-consistent (notation strict 1–29 after the 2026-07-09 insertion; structure basic forms 1–5, linear-form 14 with quadratic-form requiring it). The graph is a v1 hypothesis until drill data confirms it.
  - Open: `notation.minus-as-times-negative-one` stays unranked; it is the justification family for minus-over-sum/subtracting-a-sum (carried by meta.three-minuses / meta.implicit-op-before-bracket), drilled later or not at all — confirm.
- [~] **Layer 1+2 — laws & notation conventions**: IMPLEMENTED 2026-07-09 — SOURCE OF TRUTH is `laws.json` (37: 9 ax / 7 def / 21 thm), `conventions.json` (12), `errors.json` (20: 5 false laws + 15 misreadings); `docs/laws_and_conventions.md` is rationale only (no content tables — they'd drift). In-app **Laws & Conventions view** (`ReferenceView.vue`, tab in App.vue) renders law cards with derivation chains, conventions, error patterns. Schema + validators (sort↔id-prefix, DAG over `basedOn` ∪ `derivedFrom`, `of` refs, cross-layer refs), matrix-audit console report, meta-pattern `refs`, `justifiedBy`/`conventions` on families, `cites` on pitfalls. LocalizedString (`{en, de}`, en fallback, de = Schweizer Hochdeutsch) + de/en toggle. Power laws carry classroom names incl. quotient/root forms; `thm.power-same-base-quotient` added (was missing). New family `notation.no-splitting-the-denominator` ranked 26 (26–28 shifted to 27–29; notation now a strict 1–29 sequence). Meta-patterns migrated to slug ids (`meta.…` + display code M1–M6) with localized title/text (student-facing feedback takeaway); assignment stays authored — derivation tested and rejected (recovers all, over-generates); authored-⊆-derived is an audit line. Prose format contract: text + inline `$…$` KaTeX (`RichText.vue`; markdown rejected), `conditions` = pure LaTeX; load-time KaTeX compile check on every latex field and `$…$` segment. Remaining work is split into the skill-2 pass and skill-1 leftovers sections above; the audit reports live counts.
- [ ] Pitfall-level `revise` refs where an error points at a sharper gap than the family's `requires` (schema supports it on all three kinds; author only where family-level links aren't precise enough).
- [ ] Per-family variation dimensions (what varies / constant / discriminating feature) — variation theory (Marton / bianshi).

---

## Exercise generators — derive drills from `kind`

- [ ] `equivalence` → Same-or-Different + Odd-One-Out (needs `equivalents` + `pitfalls`)
- [ ] `classification` → Name-the-Structure (needs `examples` + `answer`)
- [ ] `decomposition` → Chunk-marking exercise (new format; needs `examples[].chunks`)
- [ ] `kind → available exercises` lookup table in code
- [ ] Generation params: per-family, which letters vary over which pools (respect shared binding for equivalence, independent for classification)
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
- [ ] `pnpm validate` script running the schema + graph validators from the CLI; run it in CI (later also Compute Engine checks: equivalents mutually equal, pitfalls non-equal, at sampled points)

---

## Research to lean on

- [ ] Arcavi (1994) "Symbol Sense" — closest description of Skill 1+2 combined
- [ ] Hoch & Dreyfus (2004–2006) "Structure Sense" — maps to Skill 2
- [ ] Variation theory / bianshi — Contrast, Generalization, Separation, Fusion as design dimensions

---

## Deferred — Skill 3 (Manipulation)

Blocked on: math input UX + equivalence verification.

- [ ] Research MathLive as input component
- [ ] Design Skill 3 exercise format
- [ ] Compute Engine for equivalence checking
- [ ] Define Skill 3 taxonomy; recapture the "also a Skill-3 tool" marker dropped from the schema
