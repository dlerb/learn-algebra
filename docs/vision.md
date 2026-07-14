# Goals

**Primary goal:** Bring first-year Swiss high school students to algebra fluency during the first half-year, with a target of ~90% reaching fluency.

**Secondary goal:** Make the time investment high-ROI — offload high-volume drilling to an app outside class time, freeing the 4 lessons/week for other curriculum demands (functions, equations, etc.) while the app handles the repetition.

**Scope:** The focus is exclusively on the three foundational bottleneck skills, not algebra procedures in general.

---

# The Three Core Skills

These form a strict progression. Each step depends on the previous one being solid. Current instruction typically jumps to step 3 without steps 1 and 2 in place — this is the root of the problem.

**Skill 1 — Equivalence fluency (Read):** *Static* recognition of when two expressions are — and are not — the same object. Each Skill-1 skill is a source-layer statement (a definition, axiom, or theorem) made student-facing: *rendered* through conventions, *equated* by a law. Knowing that `3x`, `3·x`, `3×x`, `x·3` are one object (convention); that `ab = ba` (axiom); that `a² = a·a` (definition); reading `-(a-b)`, minus signs, and brackets correctly however they appear. Just as central are the tempting **non-**equivalences to resist: `a²` is not `2a`, `a²+b²` is not `(a+b)²`. These equivalences are the atoms Skill 3 later chains toward a goal — Skill 1 is knowing them cold, not searching for which to apply.

**Skill 2 — Structural recognition (Classify):** The ability to identify the dominant operation of an expression before acting on it. Seeing `3(x+1) − 2(x−1)` as "fundamentally a subtraction between two products." Classifying the shape first, computing second.

**Skill 3 — Manipulation (Transform):** Applying equivalence rules to rewrite expressions. This introduces its own "three ways to do it" problem: multiple valid manipulation paths exist (expand, factor, rearrange), all correct but leading to different results. Choosing the right one requires having classified the structure first (Skill 2). Skill 3 cannot be fluent without Skills 1 and 2 as foundation.

---

# Core Principles

**1. Understanding ≠ fluency.**
A student who can explain a rule when prompted does not automatically recognize it in context. Declarative knowledge is a precondition, not fluency itself. Fluency requires automaticity, which requires massive varied exposure.

**2. The language analogy.**
Algebra fluency is the same cognitive mechanism as language fluency. A word understood in isolation is not a word you can read at speed mid-paragraph. An algebraic form explained in class is not a form you can recognize under cognitive load. The implication: methods that build language fluency — high volume, varied contexts, spaced repetition — should build algebra fluency.

**3. Isolate before embedding.**
Each of the three skills must be trained in isolation before being combined. Exercises that require reading, classifying, and computing simultaneously train none of the three well.

**4. The expression skill is the basic unit.**
The curriculum unit is not the exercise, it's the *expression skill*: a set of surface forms that are equivalent or structurally related. Students build automaticity across all variants of a skill. New variants are introduced in controlled sequence; old ones are revisited via spaced repetition.

*Corollary — skill membership belongs to skills and drills, not to expressions.* Asking whether an expression like `3a(b+c)` "is Skill 1 or Skill 3" is malformed. The *skill* `a(b+c) = ab+ac` is Skill 1 (a static equivalence — a fact). `3a(b+c)` is a Skill-3 *drill* that deploys that skill (with `a := 3a`) and composes it with another Skill-1 skill (regrouping `3a·b → 3ab`). Skill-3 difficulty just *is* how many Skill-1 atoms a drill composes; Skill 1 is the degenerate floor (one atom, bare pattern, recognised not produced). So the Skill-1↔Skill-3 line is a **generation parameter, not a taxonomy decision**: when a skill's slots range over single *atoms* it is a Skill-1 recognition drill; when they are filled with *compound or nested* terms that force further normalisation, the same skill becomes a Skill-3 drill. Keeping this straight is the filter that stops the taxonomy from bloating with near-duplicate "harder" skills.

**5. Controlled sequencing, not flooding.**
Each skill has its own "three ways to do it" problem. The solution is deliberate ordering — core forms first, variants after, each drilled to automaticity before the next is added.

**6. High volume, immediate feedback, low stakes.**
Automaticity is built through rapid-fire repetition with instant correction. This is what classroom instruction is structurally bad at. Sessions must be short (≤15 min), feedback per item immediate, and pressure absent.

**7. Diagnostic shock as entry point.**
Students who believe they already know algebra must discover their own gap — not be told about it. A short diagnostic that surfaces errors on items that look trivial is both the most effective motivational tool and the most honest starting point.

**8. Teacher expertise is in curation, not delivery.**
The hard work is building and sequencing the taxonomy of expression skills. The app delivers it. The taxonomy is the real product.

---

# App Design Principles

- Sessions ≤ 15 minutes
- Immediate feedback per item
- Skill 1 and Skill 2 exercises require no computation — pure reading and classification
- Visible mastery indicator per expression skill
- Spaced repetition for revisiting older skills
- Teacher dashboard: per-student progress and stuck points
- Diagnostic entry test as mandatory starting point
