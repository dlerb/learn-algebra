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

---

## Content — Open items

- [ ] **Decide Familiar-Shapes representation.** The D-group (difference-of-squares, perfect-square, quadratic, …) fits `classification` poorly — the real skill is "name the shape," which the dominant-op `answer` can't express. Options: a `shape` field, or a new recognition `kind`. Currently authored as classification with the shape in the note.
- [ ] Add distractors to pure-notation families whose `pitfalls` are empty (bracket-types, commutativity, division-variants, …) — needed before they can generate "DIFFERENT" drill items.
- [ ] Fine-tune taxonomy from classroom use (ongoing).
- [~] Prerequisites as a graph: `requires` + validators in schema; graph fully authored and priority-consistent. Notation renumbered to a topological order 1–17 (B1→2, D1→5, E1→12; order inversions fixed: B2 now before B5, A1 moved to 1, A2 to 8); structure basic forms 1–5, linear-form 14 with quadratic-form requiring it. E1/E2/F4 de-duplicated (E1 = pure notation incl. `a : b`; `a·b⁻¹` removed from E1; F4 equivalents no longer duplicate E2). The graph is a v1 hypothesis until drill data confirms it.
  - Open: chunks-in-sum vs implicit-chunking overlap substantially (same example expressions, different emphasis) — merge or sharpen the contrast.
  - Open: C5 minus-before-bracket stays unranked; it is the justification family for B3/B4 (carried by meta-pattern M2/M3), drilled later or not at all — confirm.
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
