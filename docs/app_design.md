# App Design — Algebra Fluency Trainer

---

## Purpose

A daily drill tool for first-year Swiss high school students to build automaticity in algebra reading and classification. Used outside class (10–15 min/day), complementing in-class instruction. Not a tutor — a fluency trainer.

---

## Technical Stack

- **Framework:** Vue 3 (Composition API)
- **UI Library:** Naive UI — clean defaults, TypeScript-first, unobtrusive
- **Utility CSS:** UnoCSS (Tailwind-compatible, on-demand, Vite-native)
- **Math rendering:** KaTeX — fast, lightweight LaTeX rendering in-browser
- **State management:** Pinia
- **Routing:** Vue Router
- **Build:** Vite + vue-tsc
- **Package manager:** pnpm

KaTeX is the critical dependency: all expressions must render as proper mathematical notation, not plain text. Every expression in the taxonomy is stored in LaTeX and rendered via KaTeX.

**Planned addition:** Compute Engine (`@cortex-js/compute-engine`) for template substitution via expression trees (MathJSON) and, eventually, Skill 3 equivalence verification. Currently installed but not yet used — template substitution uses simple regex replacement for the MVP.

---

## Core Concepts

### Family
One entry in the taxonomy (e.g. B4 — distributing a negative over a difference).
Each family has:
- A set of parameterized templates for generating items
- A meta-pattern link (shown in feedback)
- A mastery threshold (e.g. 8 correct in a row across sessions)

### Item
A single exercise, generated from a family template. Never stored — generated fresh each session.

### Mastery
A family is mastered when the student has answered correctly above threshold with no recent errors. Mastery decays over time (spaced repetition) — a family can move from mastered back to review.

### Session
A fixed-length set of items (around 12–15). Mix of:
- New families being introduced
- Families in progress
- Mastered families due for review

Session always has a clear end. Students never open the app and face an infinite queue.

---

## Exercise Types

### Type 1 — Same or Different?
**Covers:** Skill 1 (notation fluency)

Two expressions displayed side by side (or stacked on mobile).
Student taps SAME or DIFFERENT.

```
   3(x + 1)        3x + 1
   
   [ SAME ]    [ DIFFERENT ]
```

### Type 2 — Odd One Out
**Covers:** Skill 1 (notation fluency, deeper)

Four expressions displayed. Three are equivalent, one is not.
Student taps the odd one out.

```
   3(x+1)     3·(x+1)     (x+1)·3     3x+1
```

### Type 3 — Name the Structure
**Covers:** Skill 2 (structural recognition)

One expression displayed. Student taps the dominant operation.

```
        3(x + 1) − 2(x − 1)

  [ SUM ]  [ DIFFERENCE ]  [ PRODUCT ]  [ QUOTIENT ]  [ POWER ]
```

All three types require a single tap — no typing, no drag. Fast by design.

---

## Feedback

### Correct answer (fluency mode)
Subtle positive signal (brief green highlight, soft sound optional).
Next item loads immediately. Rhythm is not interrupted.

### Wrong answer (learning mode)
Triggered by: first encounter with a family, OR same error made twice in a row.

1. Show what the student answered and why it is wrong — specifically, not generically.
2. Show the correct answer with a one-line explanation.
3. Link to the relevant meta-pattern (tap to expand).
4. Same item repeats before moving on.

Example:
```
You answered: SAME
─────────────────────────────
  -(a - b)  ≠  -a - b

The minus distributes and flips the sign of every term inside.
-(a - b) = -a + b

→ See meta-pattern M2: minus before a bracket means × (−1)
```

### No gamification
No points, stars, streaks, leaderboards, or celebratory animations.
Progress is shown as mastered families — a real, meaningful number.

---

## Session Structure

1. **Open app** → see progress overview (X families mastered, Y in progress)
2. **Start session** → 12–15 items, drawn from:
   - 1–2 new families (introduced for first time)
   - 4–6 families in active learning
   - 3–4 mastered families due for spaced review
3. **During session** → items appear one at a time, full screen, no distractions
4. **End of session** → brief summary: how many correct, which families improved, which need more work
5. **Done** → clear stopping point, no pressure to continue

---

## Progression

### Introduction order
Families are introduced in priority order (as defined in each taxonomy).
A new family is not introduced until the previous one reaches a minimum threshold.

### Mastery definition
- 8 correct answers with no errors in the last 8 attempts = mastered
- Mastered families re-enter review queue after 3 days, then 1 week, then 2 weeks (spaced repetition)

### Adaptive difficulty
If a student errors on a family repeatedly:
- That family appears more often
- Simpler template variants are used first
- Harder variants (more complex parameters) introduced after mastery of simpler ones

---

## UI Principles

- **One thing per screen.** During a session, only the current item is shown.
- **Large tap targets.** Answer buttons must be comfortably tappable on a phone.
- **Math is the focus.** Expressions rendered large and clearly via KaTeX. No visual clutter around them.
- **Minimal chrome.** No persistent navigation during a session. Progress bar at top only.
- **Fast.** No loading states between items. Next item is pre-generated.
- **No dark patterns.** No notification guilt, no streak anxiety, no "don't break the chain" pressure.

---

## Teacher Dashboard

Separate view (not student-facing).
Shows per-student:
- Families mastered / in progress / not yet started
- Families with persistent errors (high miss rate)
- Last session date

Allows teacher to target class time at the families where most students are stuck.

---

## Scope

### In scope (v1)
- Skill 1 exercise types (Type 1 and Type 2)
- Skill 2 exercise type (Type 3)
- Taxonomy families A–F (Skill 1) and A–E (Skill 2)
- Spaced repetition and mastery tracking
- Meta-pattern lookup library
- Teacher dashboard (read-only)

### Out of scope (v1)
- Skill 3 (manipulation) — requires free input and CAS-based verification
- Authentication / multi-school deployment
- Mobile app (PWA is sufficient for v1)
- Localisation (Swiss German, French)

---

## Open Questions

- Should the app be usable without a teacher account (solo student)?
- How are student accounts created — teacher-issued codes, or self-registration?
- Local storage only (simple, private) vs. backend (required for teacher dashboard)?
- Which families should be in the diagnostic entry test, and how many items?
