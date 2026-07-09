# Laws & notation conventions — design rationale

Layer 1 (laws) and layer 2 (notation conventions) of the three-layer model.
The families (layer 3) are curated cells of the laws × conventions matrix,
selected by classroom reality. Layers 1+2 are the *coordinate system* the
families live in — they justify and audit the families, they do not generate
them.

**Source of truth: the JSON files** — `src/data/laws.json` (axioms,
definitions, theorems), `conventions.json`, `errors.json` (false laws +
misreadings), validated by `family.schema.ts` on load. Browse them in the
app's **Laws & Conventions view**, which renders the cards, statements, and
derivation chains. This document deliberately does NOT duplicate the content
tables (they would drift); it records the design decisions and the narrative
that are not data.

Ids are sort-prefixed slugs so a derivation chain reads like a proof:
`ax.add-commutative`, `def.subtraction`, `thm.collect-like-terms`,
`conv.juxtaposition`, `anti.linearity`, `mis.exponent-scope`. Each entry also
carries a short display `code` (A1, D3, T11, N1, Ā1, R7) — display data for
chips and discussion, never identity: families cite slugs, not codes.

---

## Design decisions

1. **Three sorts of law**: `axiom` (accepted, not proven in school — the list
   is school-honest, NOT a minimal axiomatization), `definition` (introduces a
   new operation via old ones; carries `basedOn` — what the definition
   *presupposes*), `theorem` (derivable, carries `derivedFrom` — what *proves*
   it). The two link kinds stay separate because they mean different things;
   the acyclicity validator runs over their union.
2. **Error patterns are first-class citizens.** False laws and misreadings
   live in ONE addressable list (`errors.json`), because tracking errors is
   what will diagnose what goes wrong in a student's mind. Each entry has a
   sort — `false-law` (algebra that isn't true, linked via `of` to the true
   law it distorts) or `misreading` (parsing the notation wrong, linked to the
   convention it violates) — and an id that pitfalls cite (`cites`).
   Per-error-pattern analytics thereby work from the first day of drill data;
   no learner-model machinery is built yet, only the ids it will need.
3. **Dual citation** is allowed and expected where both readings are
   plausible: $-(a+b) = -a+b$ cites `anti.partial-distribution` *and*
   `mis.minus-roles-confused`.
4. **Conventions are not laws.** $1 \cdot a = a$ is an axiom about numbers;
   "we don't write the 1" is a convention of the writing system.
5. **`def.integer-multiple` stays a definition.** In a field $3a = a+a+a$ is
   provable from distributivity, but school treats it as the *meaning* of
   $3a$ — the sorts record how the material is honestly presented in class,
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
   third independent taxonomy. Each meta-pattern carries `refs` to the
   law/convention/error ids it summarizes, so the classroom voice cannot
   drift from the layer it digests.
9. **Localization.** Prose fields (names, texts, notes, family titles,
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

Structure-skill families sit outside this tower: they cite conventions
(brackets, precedence, fraction bar, exponent scope — parsing), not laws,
except `structure.same-value-different-structure` and the familiar-shapes
group (binomial square, difference of squares).

---

## Resolved questions (2026-07-08)

1. Pitfalls may cite a false law and a misreading together (→ design
   decision 3).
2. `def.integer-multiple` stays a definition (→ design decision 5).
3. **Right-distribution of division.** `thm.split-numerator` splits over the
   numerator only ($\frac{c}{a+b}$ does NOT split); no family drilled that
   asymmetry — first genuine gap the matrix audit surfaced. → Family
   `notation.no-splitting-the-denominator` added (fractions group,
   contrasting with `notation.splitting-a-fraction`; pitfall cites
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
