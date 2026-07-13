# Content model — design rationale

How the algebra content is structured. Everything lives under `src/data/` and is
validated by `family.schema.ts` on load. The layers:

- **laws** (`laws.json`) — the logical tower: axioms, definitions, theorems.
- **conventions** (`conventions.json`) — the rules of the writing system.
- **errors** (`errors.json`) — the error patterns that shadow the above.
- **meta-patterns** (`metapatterns.json`) — student-facing digests of them.
- **families** (`families/*.json`) — curated *strategies/skills* built on the
  laws × conventions coordinate system: what is worth drilling, and why. Each
  family's concrete material lives separately in…
- **drills** (`drills/*.json`) — the format-specific drill material for each
  family. See "Families vs drills" below.

Laws + conventions are the *coordinate system* families live in — they justify
and audit families, they do not generate them. Group **display** metadata
(title, order, blurb) lives in sibling registries (`lawGroups.json`,
`conventionGroups.json`, `familyGroups.json`), each a flat list validated so a
title can't drift from the values entries carry. Browse laws/conventions/errors
in the app's **Laws & Conventions view**, families in the **Taxonomy view**.
This doc records the *why*, not the content tables (they would drift).

Ids are kind-prefixed slugs so a derivation chain reads like a proof:
`ax.add-commutative`, `def.subtraction`, `thm.collect-like-terms`,
`conv.juxtaposition`, `anti.linearity`, `equivalence.juxtaposition-product`.
Each entry also carries a short display `code` (A1, D3, T11, N1, Ā1, M7) —
display data for chips, never identity: everything cites slugs, not codes.
(Families carry no code.)

### Two classifiers: `kind` and `group`

Every content entry is classified on at most two independent axes; the files use
one word for each:

- **`kind`** — the *intrinsic category* of the entry, and (where present) its id
  prefix. Laws: `axiom | definition | theorem` (also drives the link kind).
  Errors: `anti-law | misreading | salience`. Families: `equivalence |
  classification | chunking | transformation` — an **open-ended category label**
  (a *strategy type*), which is why the family schema is one uniform shape rather
  than a per-kind union.
- **`group`** — a *topical* bucket for browsing; it **cross-cuts** `kind` (the
  `powers` group holds a definition and five theorems) and is kept out of the
  id, because grouping is a soft revisable call while ids are hard identity.

Applied: **laws** carry `kind` + `group` (topics addition … binomials).
**Conventions** carry only a `group` (reading / grouping / form) — a writing rule
has no axiom/definition/theorem analog. **Errors** carry `kind`, no group (it's
derivable from `corrupts`). **Families** carry `kind` + `group`.

**There is no skill axis in the data.** The "Skill 1/2/3" framing (equivalence /
classification / transformation) is only a coarse rollup the docs and app apply
for presentation. It was tried as a stored, then a derived, field and removed:
the kinds are finer and open-ended, so nothing should freeze a fixed 3-way skill.

### Families vs drills — strategy vs material

A **family** is a curated *strategy*, not a problem set. It says what the skill
is, why it matters, and links into the other layers — nothing format-specific:
`note` (the rationale), one canonical `illustration`, `errors` (the misconception
catalog → error-pattern ids), `justifiedBy` / `governedBy` / `metaPatterns`
links, `requires` (prerequisite families), plus `kind` + `group`.

All the concrete material lives in the **drill** layer (`drills/<kind>-<group>
.json`, one entry per family, keyed by `family` id): `equivalents` / `examples` /
`answer` / `chunks`, and `pitfalls` (each a wrong form + `explainedBy` naming
which error it tests, + optional `revise`). *How* a family is drilled is the
drill's business.

Why split: the family answers "what goes wrong with this skill" (its
misconception *catalog*), while the concrete distractors that surface it — and
*which* a given format uses — are drill-specific. A validator enforces the seam:
every drill distractor's `explainedBy` must be **⊆ its family's `errors`** (a
distractor can't test a misconception the skill never declared). The drill
discriminant is `kind` for now — the shape of the parked material; the real drill
layer will key on a **`format`** (same-or-different, odd-one-out, classify, …).

### Files, ids & codes at a glance

| File | Entry | `kind` values | `group` | id prefix | `code` |
|---|---|---|---|---|---|
| `laws.json` | law | `axiom` · `definition` · `theorem` | ✓ `lawGroups.json` | `ax.`/`def.`/`thm.` | A/D/T |
| `conventions.json` | convention | — | ✓ `conventionGroups.json` | `conv.` | N |
| `errors.json` | error pattern | `anti-law` · `misreading` · `salience` | — (from `corrupts`) | `anti.`/`mis.`/`sal.` | Ā/R/S |
| `metapatterns.json` | meta-pattern | — | — | `meta.` | M |
| `families/<kind>-<group>.json` | family (strategy) | `equivalence` · `classification` · `chunking` · (`transformation`) | ✓ `familyGroups.json` | `<kind>.` | — |
| `drills/<kind>-<group>.json` | drill (material) | mirrors its family | — | keyed by `family` id | — |

**Group registries** — all three are flat lists of `{ slug, title, blurb? }`
(array order = display order):

| File | Groups for | Validated |
|---|---|---|
| `lawGroups.json` | laws | slug set = the `lawGroup` enum exactly |
| `conventionGroups.json` | conventions | slug set = the `conventionGroup` enum exactly |
| `familyGroups.json` | families | a family's `group` must exist in the list (this list *is* the source of valid family groups) |

**Group vocabularies** — the slugs each defines (titles/blurbs live in the files):

- **`lawGroups.json`** → `addition` · `multiplication` · `distribution` · `signs` · `fractions` · `powers` · `roots` · `binomials`
- **`conventionGroups.json`** → `reading` · `grouping` · `form`
- **`familyGroups.json`** → `multiplication` · `like-terms` · `minus-sign` · `brackets` · `exponents` · `fractions` · `commutativity` · `basic-forms` · `misleading-forms` · `chunking` · `familiar-shapes` · `full-classification`

One rule ties the ids together: **id prefix = `kind`** wherever a kind exists —
the validator enforces prefix↔kind for laws (`ax`/`def`/`thm`), errors
(`anti`/`mis`/`sal`), and families (`<kind>.`); conventions and meta-patterns
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
   family lists the misconceptions its skill guards against in `errors`; a drill
   distractor names which one it instantiates via `explainedBy` (validated ⊆ the
   family's `errors`). Per-error-pattern analytics thereby work from the first
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
   Assignment to families stays **authored** (curation), never derived from
   refs (coverage): tested empirically 2026-07-09, derivation recovers every
   authored assignment but over-generates true-but-beside-the-point extras.
   The audit checks the subset relation (an authored meta-pattern a tagged
   family's coordinates can't support = missing tag or misfit citation).
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
10. **Localization.** Prose fields (names, texts, notes, family titles,
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

The `classification` and `chunking` families sit outside this tower: they cite
conventions (brackets, precedence, fraction bar, exponent scope — parsing), not
laws — except `equivalence.same-value-different-structure` and the
familiar-shapes group (binomial square, difference of squares).

---

## Resolved questions (2026-07-08)

1. A drill distractor may be `explainedBy` a false law and a misreading together
   (→ design decision 3).
2. `def.integer-multiple` stays a definition (→ design decision 5).
3. **Right-distribution of division.** `thm.split-numerator` splits over the
   numerator only ($\frac{c}{a+b}$ does NOT split); no family drilled that
   asymmetry — first genuine gap the matrix audit surfaced. → Family
   `equivalence.no-splitting-the-denominator` added (fractions group,
   contrasting with `equivalence.splitting-a-fraction`; pitfall cites
   `anti.linearity`).
4. **False laws stay flat** — no `derivedFrom` on error patterns; the
   machinery isn't worth it. (They do carry the `of` link to what they
   distort.)
5. **Conditions live on laws**; families inherit the conditions of the laws
   they cite via `justifiedBy` instead of restating them, keeping the
   family-level `conditions` field only for caveats that aren't law-derived.

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
`{en, de}` — the text is the student-facing feedback takeaway). Family
`metaPatterns` arrays cite slugs. Derivation experiment recorded in design
decision 8; authored-⊆-derived added to the audit.

**2026-07-09 (rev. 5, prose format contract):** prose = text with inline
`$…$` KaTeX (design decision 9), markdown considered and rejected;
`conditions` migrated to pure LaTeX everywhere; all layer-file texts and the
tagged families' notes migrated; audit counts remaining unicode-math prose
(16 family notes + 2 whys at time of writing).

**2026-07-13 (rev. 6, `kind`/`group` model + flat registries):** every content
list classified by `kind` (intrinsic type, = id prefix) + `group` (topic);
`lawGroups.json`/`conventionGroups.json`/`familyGroups.json` display registries
added; laws gained a topical `group`; `laws.json`/`errors.json` `sort` field
renamed `kind`; the second binomial formula added. `groups.json` →
`familyGroups.json`.

**2026-07-13 (rev. 7, skill axis removed):** the family id-namespace
`notation`/`structure` was tried as a kind prefix with a derived `skill`, then
dropped entirely — "Skill 1/2/3" is a docs/app lens, not data. Family ids are
`<kind>.<slug>` (`equivalence`/`classification`/`chunking`/`transformation`);
`familyGroups.json` and `metapatterns.json` flattened to plain lists; error kind
`false-law` → `anti-law` (so kind↔prefix is consistent); files `<kind>-<group>`.

**2026-07-14 (rev. 8, family = strategy, drill = material):** families split
into an abstract strategy (`families/`, one uniform shape — `note`,
`illustration`, `errors`, links) and a separate drill layer (`drills/`,
per-family material — equivalents/examples/answer/chunks/pitfalls). The
discriminated union moved to the drill; `kind` is now a plain family category
label. A drill's distractor `explainedBy` must be ⊆ its family's `errors`.
