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
- [ ] Add prerequisites per family (which must be mastered first) — sequencing layer.
- [ ] Per-family variation dimensions (what varies / constant / discriminating feature) — variation theory (Marton / bianshi).

---

## Exercise generators — derive drills from `kind`

- [ ] `equivalence` → Same-or-Different + Odd-One-Out (needs `equivalents` + `pitfalls`)
- [ ] `classification` → Name-the-Structure (needs `examples` + `answer`)
- [ ] `decomposition` → Chunk-marking exercise (new format; needs `examples[].chunks`)
- [ ] `kind → available exercises` lookup table in code
- [ ] Generation params: per-family, which letters vary over which pools (respect shared binding for equivalence, independent for classification)
- [ ] Substitute on the MathJSON tree via Compute Engine (installed, unused) — avoids raw-LaTeX string-collision

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
- [ ] CI step running the schema validators over the JSON

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
