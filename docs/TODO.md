# TODO

Status legend: [ ] not started · [~] in progress · [x] done

---

## MVP — Get a usable drill session working

- [x] Project setup (Vue 3, Vite, Pinia, Naive UI, UnoCSS, KaTeX)
- [x] Family schema (TypeScript types + example data)
- [x] Template substitution (parameter slots → concrete expressions)
- [x] MathExpr component (KaTeX rendering)
- [x] Type 1: Same or Different exercise + auto-advance
- [x] Basic session view with score counter
- [ ] Type 2: Odd One Out exercise component
- [ ] Type 3: Name the Structure exercise component (Skill 2)
- [ ] Wire Skill 2 families into session

---

## Content — Fill out the taxonomy

- [ ] Add redundant bracket variants to all Skill 1 families
- [ ] Code all Skill 1 families (currently 2 of ~22)
  - [ ] Group A: A2, A3, A4, A5
  - [ ] Group B: B1, B2, B3, B5, B6, B7
  - [ ] Group C: C1, C2, C3, C4, C5
  - [ ] Group D: D1, D2, D3, D4, D5
  - [ ] Group E: E1, E2, E3, E4
  - [ ] Group F: F1, F2, F3, F4
- [ ] Code all Skill 2 families (currently 1 of ~15)
  - [ ] Group A: A1–A5 (five basic forms)
  - [ ] Group B: B1–B6 (misleading surface forms)
  - [ ] Group C: C1–C4 (chunking)
  - [ ] Group D: D1–D5 (familiar shapes)
  - [ ] Group E: E1–E2 (full classification)
- [ ] Fine-tune taxonomy based on using the app (ongoing)
- [ ] Add explicit prerequisites per family (which families must be mastered first)
- [ ] Add variation dimensions per family: what varies / what is constant / discriminating feature
  - This gives the session logic enough to sequence families intelligently
  - Based on variation theory (Marton) — the framework behind Chinese bianshi teaching

---

## Research to lean on

- [ ] Read Arcavi (1994) "Symbol Sense" — closest academic description of Skill 1+2 combined
- [ ] Read Hoch & Dreyfus (2004–2006) "Structure Sense" — directly maps to Skill 2
- [ ] Study variation theory / bianshi practice for exercise design principles
  - Contrast, Generalization, Separation, Fusion as design dimensions
  - Chinese teachers use this explicitly; it's the "why" behind their better results

---

## App features — Session and progression

- [ ] Proper session structure (fixed length ~12–15 items, mixed families)
- [ ] Mastery tracking per family (threshold: 8 correct without error)
- [ ] Spaced repetition (mastered families re-enter review queue)
- [ ] Local storage persistence for mastery state
- [ ] Progress overview screen (mastered / in progress / not started)
- [ ] Level progression (introduce harder param values after mastery of level 1)
- [ ] Diagnostic entry test (surfaces the gap at first launch)
- [ ] Meta-pattern lookup library (browsable reference, triggered by errors)

---

## App features — Teacher dashboard

- [ ] Per-student progress view (families mastered / stuck)
- [ ] Identify families with highest error rates across class
- [ ] Last session date per student
- [ ] Student account setup (teacher-issued codes or self-register)

---

## Technical

- [ ] Replace string substitution with Compute Engine tree substitution
- [ ] Mobile layout polish (large tap targets, readable on phone)
- [ ] PWA setup (installable, offline capable)
- [ ] Schema validator (enforce: ≥2 forms, distractors required for S1, etc.)
- [ ] Split families.ts into per-group files as content grows

---

## Deferred — Skill 3 (Manipulation)

Blocked on: math input UX + equivalence verification complexity.

- [ ] Research MathLive as input component
- [ ] Design Skill 3 exercise format
- [ ] Integrate Compute Engine for equivalence checking
- [ ] Define Skill 3 taxonomy (equivalence rules, strategic choices)
