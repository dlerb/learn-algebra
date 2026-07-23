# Content model — design rationale

How the algebra content is structured. Everything lives under `src/data/` and is
validated by `skill.schema.ts` on load. The layers:

- **the fundament tower** (`src/data/<layer>/cards.json`, composed by
  `src/data/layers.ts`) — **the primary reference since 2026-07-23**: the axioms,
  conventions, definitions and theorems, each traced to what it rests on.
  `fundament0 · numbers · powers · algebra`. See `docs/fundament0.md`.
- **~~laws + conventions~~** — **deleted 2026-07-23.** These were the original law
  tower; everything they held is a card in the fundament tower now, and every reference
  from the skills side (`justifiedBy`, `governedBy`, error `corrupts`, meta-pattern
  `summarizes`) resolves to a **card code**, checked at load by `validateLayerRefs` /
  `validateErrors` and at build by `sweep-layers`. The files, their display registries
  (`lawGroups`/`lawKinds`/`conventionGroups`), the Zod schemas and the reference view's
  law/convention segments all went with them; `ReferenceView` is now an errors page.
- **errors** (`errors.json`) — the error patterns that shadow the above.
- **meta-patterns** (`metapatterns.json`) — student-facing digests of them.

  *(Note on the word: "layer" means both a **file/role** here and a **floor** of the
  fundament tower, in the sense of mathematical dependency. The two remain separate
  representations — the tower is not generated from the skills side or vice versa —
  but they are no longer disconnected: skills reach into the tower by card code, and
  `pnpm sweep-layers` fails if any reference resolves to neither a card nor a
  surviving legacy id.)*
- **skills** (`skills/*.json`) — curated *strategies/skills* built on the
  laws × conventions coordinate system: what is worth drilling, and why. Each
  skill's concrete material lives separately in…
- **drills** (`drills/*.json`) — the format-specific drill material for each
  skill. See "Skills vs drills" below.

Laws + conventions are the *coordinate system* skills live in — they justify
and audit skills, they do not generate them. Group **display** metadata
(title, order, blurb) lives in sibling registries (`lawGroups.json`,
`conventionGroups.json`, `skillGroups.json`), each a flat list validated so a
title can't drift from the values entries carry. Browse laws/conventions/errors
in the app's **Laws & Conventions view**, skills in the **Taxonomy view**.
This doc records the *why*, not the content tables (they would drift).

Ids are kind-prefixed slugs so a derivation chain reads like a proof:
`ax.add-commutative`, `def.subtraction`, `thm.collect-like-terms`,
`conv.juxtaposition`, `anti.linearity`, `equivalence.juxtaposition-product`.
Each entry also carries a short display `code` (A1, D3, T11, N1, Ā1, M7) —
display data for chips, never identity: everything cites slugs, not codes.
(Skills carry no code.)

### Two classifiers: `kind` and `group`

Every content entry is classified on at most two independent axes; the files use
one word for each:

- **`kind`** — the *intrinsic category* of the entry, and (where present) its id
  prefix. Laws: `axiom | definition | theorem` (also drives the link kind).
  Errors: `anti-law | misreading | salience`. Skills: `equivalence |
  classification | chunking | transformation` — an **open-ended category label**
  (a *strategy type*), which is why the skill schema is one uniform shape rather
  than a per-kind union.
- **`group`** — a *topical* bucket for browsing; it **cross-cuts** `kind` (the
  `powers` group holds a definition and five theorems) and is kept out of the
  id, because grouping is a soft revisable call while ids are hard identity.

Applied: **laws** carry `kind` + `group` (topics addition … binomials).
**Conventions** carry only a `group` (reading / grouping / form) — a writing rule
has no axiom/definition/theorem analog. **Errors** carry `kind`, no group (it's
derivable from `corrupts`). **Skills** carry `kind` + `group`.

**There is no skill axis in the data.** The "Tier 1/2/3" framing (equivalence /
classification / transformation) is only a coarse rollup the docs and app apply
for presentation. It was tried as a stored, then a derived, field and removed:
the kinds are finer and open-ended, so nothing should freeze a fixed 3-way skill.

### Skills vs drills — strategy vs material

A **skill** is a curated *strategy*, not a problem set. It says what the skill
is, why it matters, and links into the other layers — nothing format-specific:
`note` (the rationale), one canonical `illustration`, `errors` (the misconception
catalog → error-pattern ids), `justifiedBy` / `governedBy` / `metaPatterns`
links, `requires` (prerequisite skills), plus `kind` + `group`.

All the concrete material lives in the **drill** layer (`drills/<kind>-<group>
.json`, one entry per skill, keyed by `skill` id): `equivalents` / `examples` /
`answer` / `chunks`, and `pitfalls` (each a wrong form + `explainedBy` naming
which error it tests, + optional `revise`). *How* a skill is drilled is the
drill's business.

Why split: the skill answers "what goes wrong with this skill" (its
misconception *catalog*), while the concrete distractors that surface it — and
*which* a given format uses — are drill-specific. A validator enforces the seam:
every drill distractor's `explainedBy` must be **⊆ its skill's `errors`** (a
distractor can't test a misconception the skill never declared). The drill
discriminant is `kind` for now — the shape of the parked material; the real drill
layer will key on a **`format`** (same-or-different, odd-one-out, classify, …).

### Skills are the pedagogical bridge

Laws + conventions are the **fundamentals**: what is true and how it is written.
That layer is closed and derivable (the law DAG, the notation rules) — and, on
its own, *inert*: it cannot say what is worth learning or where a student
stumbles. Its shadow (errors — every error `corrupts` a law or convention) and
its student-facing digest (meta-patterns) are part of the same fundament.

**Skills are the layer that makes the fundamentals learnable.** A skill is
authored *curation*: it selects a coherent coordinate-region of the fundamentals
and declares "this intersection is one thing worth getting fluent at." Nothing
derives skills from the fundamentals — the "what matters" judgement is human,
the same reason meta-pattern assignment stays authored, not derived. This is why
a skill has exactly four cross-layer arrays and no more: they are **one arrow
into each face of the fundament** — `justifiedBy` → laws (truth), `governedBy` →
conventions (notation), `errors` → error patterns (the negative image),
`metaPatterns` → the digest. A skill draws together *coordinates* (justification),
not drill *material* — the material is authored separately in `drills/`.

A skill carries no linear order — only the `requires` **dependency** graph (a
partial order). This one graph feeds two different projections:

- **What to drill** — a skill joined with its `drills/` material. Happy with a
  *prioritised subset*: drill the high-value skills in any order.
- **A tutorial path** — a *traversal* of `requires` (plus mastery state). This
  needs a *spanning, gap-free* graph: any missing prerequisite is a hole a
  learner falls into. The path ambition raises the bar from "the important
  skills" to "a covering curriculum."

**Coverage holes.** A fundamental that no skill draws on is inert — nothing
drills it, no path reaches it. So it flags either a skill still to author or a
gap that would break a skill-based path. The `auditCoverage` report lists these
on load (`[audit] … cited by no skill`), and the **Laws & Conventions view**
marks each such card *unused* (amber, dashed). A hole is tolerable for a *catalog*
but disqualifying for a *path*. Most present holes are simply unimplemented
skills — notably the entire **`transformation` kind is empty** (all current
skills are recognition — equivalence/classification/chunking — none are the
active manipulation half of "read *and practice*"), and the powers/roots law
region is thinly skilled. Axioms are excluded from the "unused" mark: a skill
reaches them transitively through the theorems it cites.

### Files, ids & codes at a glance

| File | Entry | `kind` values | `group` | id prefix | `code` |
|---|---|---|---|---|---|
| `laws.json` | law | `axiom` · `definition` · `theorem` | ✓ `lawGroups.json` | `ax.`/`def.`/`thm.` | A/D/T |
| `conventions.json` | convention | — | ✓ `conventionGroups.json` | `conv.` | N |
| `errors.json` | error pattern | `anti-law` · `misreading` · `salience` | — (from `corrupts`) | `anti.`/`mis.`/`sal.` | Ā/R/S |
| `metapatterns.json` | meta-pattern | — | — | `meta.` | M |
| `skills/<kind>-<group>.json` | skill (strategy) | `equivalence` · `classification` · `chunking` · (`transformation`) | ✓ `skillGroups.json` | `<kind>.` | — |
| `drills/<kind>-<group>.json` | drill (material) | mirrors its skill | — | keyed by `skill` id | — |

**Group registries** — all three are flat lists of `{ slug, title, blurb? }`
(array order = display order):

| File | Groups for | Validated |
|---|---|---|
| `lawGroups.json` | laws | slug set = the `lawGroup` enum exactly |
| `conventionGroups.json` | conventions | slug set = the `conventionGroup` enum exactly |
| `skillGroups.json` | skills | a skill's `group` must exist in the list (this list *is* the source of valid skill groups) |

**Group vocabularies** — the slugs each defines (titles/blurbs live in the files):

- **`lawGroups.json`** → `addition` · `multiplication` · `distribution` · `signs` · `fractions` · `powers` · `roots` · `binomials`
- **`conventionGroups.json`** → `reading` · `grouping` · `form`
- **`skillGroups.json`** → `multiplication` · `like-terms` · `minus-sign` · `brackets` · `exponents` · `fractions` · `commutativity` · `basic-forms` · `misleading-forms` · `chunking` · `familiar-shapes` · `full-classification`

One rule ties the ids together: **id prefix = `kind`** wherever a kind exists —
the validator enforces prefix↔kind for laws (`ax`/`def`/`thm`), errors
(`anti`/`mis`/`sal`), and skills (`<kind>.`); conventions and meta-patterns
have no kind, so they take a fixed prefix.

---

## Design decisions

1. **Three kinds of law**: `axiom` (accepted, not proven in school — the list
   is school-honest, NOT a minimal axiomatization), `definition` (introduces a
   new operation via old ones; carries `basedOn` — what the definition
   *presupposes*), `theorem` (derivable, carries `derivedFrom` — what *proves*
   it). The two link kinds stay separate because they mean different things;
   the acyclicity validator runs over their union. **Conventions are not in this
   DAG.** A convention connects to the laws only by *denotation* ("juxtaposition
   is the notation *for* multiplication") — a different relation from
   *justification* (`derivedFrom`/`basedOn`): rewrite multiplication as
   `mul(a,b)` and every proof is unchanged, so the operation does not presuppose
   the notation and the notation is not proven by the axioms. That link is real
   but left informal (in prose) for now, deliberately not a field.
2. **Error patterns are first-class citizens.** They live in ONE addressable
   list (`errors.json`), because tracking errors is what will diagnose what goes
   wrong in a student's mind. Each has a kind naming what it `corrupts`:
   `anti-law` (algebra that isn't true — corrupts the law it distorts),
   `misreading` (parsing the notation wrong — corrupts a convention), or
   `salience` (parsing by what is visually loudest — corrupts a meta-pattern). A
   skill lists the misconceptions its skill guards against in `errors`; a drill
   distractor names which one it instantiates via `explainedBy` (validated ⊆ the
   skill's `errors`). Per-error-pattern analytics thereby work from the first
   day of drill data; no learner-model machinery is built yet, only the ids.
3. **Dual citation** is allowed and expected where both readings are
   plausible: the distractor $-(a+b) = -a+b$ is `explainedBy`
   `anti.partial-distribution` *and* `mis.minus-roles-confused`.
4. **Conventions are not laws.** $1 \cdot a = a$ is an axiom about numbers;
   "we don't write the 1" is a convention of the writing system.
5. **`def.integer-multiple` stays a definition.** In a field $3a = a+a+a$ is
   provable from distributivity, but school treats it as the *meaning* of
   $3a$ — the kinds record how the material is honestly presented in class,
   not the minimal axiomatization.
6. **The permanence principle is named.** The exponent extensions
   (`def.extended-exponents`, `def.fractional-exponent`) are *chosen* so the
   power rules keep holding — contrast `thm.zero-product`, which looks
   similar but is *forced* by the axioms. "$0 \cdot a = 0$ is forced on us;
   $a^0 = 1$ is our choice" is exactly the kind of insight this layer exists
   to surface.
7. **The three power laws are named and carry their extensions.** Same-base
   law (product and quotient form), same-exponent law (product form, quotient
   form, and the root forms — root of a product / of a quotient are the
   same-exponent law with exponent $1/n$), power-of-a-power law (whose root
   form is `thm.root-power-order`). The `derivedFrom` links encode this
   lineage explicitly. A root form of the *same-base* law has no
   school-standard shape below fractional exponents and is deliberately
   absent.
8. **Meta-patterns are the student-facing digest of these lists**, not a
   third independent taxonomy. Each meta-pattern carries `summarizes` links to
   the law/convention/error ids it digests, so the classroom voice cannot
   drift from the layer it digests. They follow the same id scheme as
   everything else (slug `meta.…` + display code M1–M10) and are localized —
   their `text` is the takeaway line a student reads in drill feedback.
   Assignment to skills stays **authored** (curation), never derived from
   refs (coverage): tested empirically 2026-07-09, derivation recovers every
   authored assignment but over-generates true-but-beside-the-point extras.
   The audit checks the subset relation (an authored meta-pattern a tagged
   skill's coordinates can't support = missing tag or misfit citation).
9. **Prose format contract.** Prose fields (notes, whys, texts) are plain
   text with inline `$…$` KaTeX — deliberately NOT markdown: the one feature
   prose needs is math, and the `$` contract avoids a parser, HTML injection,
   and sanitization (rendered by `RichText.vue`, ~20 lines, no dependency).
   Forward-compatible: markdown-it + KaTeX uses the same delimiters, so the
   contract survives if real markdown needs ever appear. `conditions` fields
   are NOT prose — they are pure LaTeX, rendered directly. Improvised unicode
   math (`2x²`, `√`) predates the contract; the audit counts what remains.
   A load-time compile check runs every latex field and every `$…$` segment
   through KaTeX with `throwOnError: true` — a typo'd escape fails at startup
   with its id and field named, instead of rendering as red mush in a card.
10. **Localization.** Prose fields (names, texts, notes, skill titles,
   pitfall explanations) are `LocalizedString`: a plain string (= English) or
   `{ en, de }`, with English fallback so nothing renders blank; `de` means
   Schweizer Hochdeutsch. LaTeX math is language-neutral and never
   translated. The *notation itself* stays Swiss and does not switch with the
   language: e.g. $a:b$ is division here, ratio in UK usage — if the app ever
   targets UK students (not just English text), conventions like
   `conv.division-signs` would need locale flags; out of scope for now.

---

## The tower — the law DAG in words

This is the hierarchy the library user should be able to see (the
`basedOn`/`derivedFrom` links carry it in the data):

1. **Addition** stands alone (its four axioms).
2. **Subtraction** is not a new operation: `def.subtraction` rewrites it as
   addition of the inverse. Everything about minus signs (minus over a sum,
   double negative, subtracting a sum, the moving minus of a fraction) is a
   consequence.
3. **Multiplication** gets its own axioms but connects to addition only
   through **distributivity** — the single most cited law in the taxonomy —
   and through `def.integer-multiple` (multiples as repeated addition).
4. **Division** is not a new operation: `def.division` rewrites it as
   multiplication by the reciprocal. All fraction rules follow.
5. **Powers** repeat multiplication (`def.power`) exactly as multiples repeat
   addition (`def.integer-multiple`) — the analogy `anti.repetition-confusion`
   shows students failing to keep apart. The power laws fall out of counting
   factors. **Roots** (`def.root`) name the reverse question; their rules
   inherit from the power laws.
6. **Extended exponents** (`def.extended-exponents`,
   `def.fractional-exponent`) are *chosen*, not discovered: defined by the
   permanence principle so the power laws keep holding.

The `classification` and `chunking` skills sit outside this tower: they cite
conventions (brackets, precedence, fraction bar, exponent scope — parsing), not
laws — except `equivalence.same-value-different-structure` and the
familiar-shapes group (binomial square, difference of squares).

---

## Resolved questions (2026-07-08)

1. A drill distractor may be `explainedBy` a false law and a misreading together
   (→ design decision 3).
2. `def.integer-multiple` stays a definition (→ design decision 5).
3. **Right-distribution of division.** `thm.split-numerator` splits over the
   numerator only ($\frac{c}{a+b}$ does NOT split); no skill drilled that
   asymmetry — first genuine gap the matrix audit surfaced. → Skill
   `equivalence.no-splitting-the-denominator` added (fractions group,
   contrasting with `equivalence.splitting-a-fraction`; pitfall cites
   `anti.linearity`).
4. **False laws stay flat** — no `derivedFrom` on error patterns; the
   machinery isn't worth it. (They do carry the `of` link to what they
   distort.)
5. **Conditions live on laws**; skills inherit the conditions of the laws
   they cite via `justifiedBy` instead of restating them, keeping the
   skill-level `conditions` field only for caveats that aren't law-derived.

## Revision notes

**2026-07-09 (rev. 2, after teacher markup):** KaTeX throughout; "device"
renamed *convention*; error patterns elevated to first-class (false laws Ā +
misreadings R, unified, `of`-linked); `conv.minus-roles` rewritten around the
literal-sign vs. operator distinction with the ×(−1) reading credited to
`thm.negative-one-times`; `conv.adjacent-signs` added; definitions reordered
(root directly after power) and the exponent extensions framed under the
permanence principle; `thm.root-power-order` extracted;
`thm.zero-product` annotated forced-vs-chosen; inverse-element wording with
*Gegenzahl*/*Kehrwert*; fraction bar preferred over ÷; new misreadings from
markup.

**2026-07-09 (rev. 3, implementation):** content moved to
`src/data/{laws,conventions,errors}.json` as source of truth; this doc
slimmed to rationale; in-app Laws & Conventions view renders the cards.
`basedOn` added to definitions; the three power laws named with classroom
names and extended: `thm.power-same-base-quotient` added (was missing
entirely — second gap the layer work surfaced), root rules named as the
same-exponent / power-of-a-power laws for roots.

**2026-07-09 (rev. 4, meta-pattern migration):** meta-patterns moved to the
standard id scheme (slug ids `meta.…`, globally unique across namespaces;
"M1" kept as per-namespace display code) and localized (title/text now
`{en, de}` — the text is the student-facing feedback takeaway). Skill
`metaPatterns` arrays cite slugs. Derivation experiment recorded in design
decision 8; authored-⊆-derived added to the audit.

**2026-07-09 (rev. 5, prose format contract):** prose = text with inline
`$…$` KaTeX (design decision 9), markdown considered and rejected;
`conditions` migrated to pure LaTeX everywhere; all layer-file texts and the
tagged skills' notes migrated; audit counts remaining unicode-math prose
(16 skill notes + 2 whys at time of writing).

**2026-07-13 (rev. 6, `kind`/`group` model + flat registries):** every content
list classified by `kind` (intrinsic type, = id prefix) + `group` (topic);
`lawGroups.json`/`conventionGroups.json`/`skillGroups.json` display registries
added; laws gained a topical `group`; `laws.json`/`errors.json` `sort` field
renamed `kind`; the second binomial formula added. `groups.json` →
`skillGroups.json`.

**2026-07-13 (rev. 7, skill axis removed):** the skill id-namespace
`notation`/`structure` was tried as a kind prefix with a derived `skill`, then
dropped entirely — "Tier 1/2/3" is a docs/app lens, not data. Skill ids are
`<kind>.<slug>` (`equivalence`/`classification`/`chunking`/`transformation`);
`skillGroups.json` and `metapatterns.json` flattened to plain lists; error kind
`false-law` → `anti-law` (so kind↔prefix is consistent); files `<kind>-<group>`.

**2026-07-14 (rev. 8, skill = strategy, drill = material):** skills split
into an abstract strategy (`skills/`, one uniform shape — `note`,
`illustration`, `errors`, links) and a separate drill layer (`drills/`,
per-skill material — equivalents/examples/answer/chunks/pitfalls). The
discriminated union moved to the drill; `kind` is now a plain skill category
label. A drill's distractor `explainedBy` must be ⊆ its skill's `errors`.

**2026-07-14 (rev. 9, family → skill; `priority` parked):** the entry formerly
called *family* is renamed **skill** throughout — files (`skills/*.json`,
`skill.schema.ts`, `skillGroups.json`), the drill key (`family` → `skill`), and
types/functions (`Skill`, `parseSkills`, `validateSkillLinks`). The word was
freed once the strategy/material split (rev. 8) removed the two original
objections to it — the fixed "Tier 1/2/3" partition and the skill↔drill
conflation; you drill a skill, or a composition of skills. The coarse
equivalence/classification/transformation presentation rollup is renamed
**tier** (Tier 1/2/3) so "skill" names only the entry and there is no "a Skill 1
is made of skills"; the docs were swept, data strings and the `skill2_grammar.md`
filename left for when those surfaces next change. The old skill-level
**`priority`** (a linear drilling rank) was
removed: a skill carries only the `requires` dependency graph (a partial order),
never a sequence — sequencing is a drill/session-layer concern, deferred. The 47
authored priority values are parked in `drills/_parked-priority.json` (not
loaded). The Taxonomy view's "drilling order" mode was dropped with it.
