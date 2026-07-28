# Content model — design rationale

> ⚠️ **Partially superseded 2026-07-23/24.** The **fundament tower** (`fundamentals ·
> numbers · powers · terms`, `src/data/<layer>/cards.json`) is now the primary
> reference, and **`laws.json` / `conventions.json` and their registries
> (`lawGroups`/`lawKinds`/`conventionGroups`) were DELETED** — everything they held is
> a tower card, and skills cite card ids. Wherever this doc's older sections (the
> "Laws & Conventions view", the `lawGroup`/`conventionGroup` enums) describe those
> files as live, read them as history. The tower is documented in `docs/fundamentals.md`
> (format spec), the migration in memory `bridge`.
>
> **2026-07-24 updates:** (1) metapatterns were NOT split — kept as a central
> curated repository (see memory `metapatterns-split`). (2) **Every entity now has a
> single `id` field; all short display codes (A1/M7/S1…) were removed.** (3) The
> curated layers form a downward-only stack over the tower — errors and metapatterns
> cite cards ONLY, skills cite all three. The **"JSON format (current)"** section below
> is the current spec; the dated *Revision notes* at the bottom are left as history.
> The skills/drills/errors rationale still holds.
>
> **2026-07-27 updates:** metapatterns became **`rules.json`, the DO/IS
> registry** — a flat collection of student-facing one-liners, ids `rule.*`, route
> `/rules`. Three changes of substance: (1) the entry's `name` was always the rule
> ("The fraction bar is a bracket"), so `name` → `rule` and the gloss `rule` → `note`,
> plus a new `kind: is | do`; (2) **errors now cite rules directly** (`error.rules`),
> replacing a derivation through `corrupts` × `summarizes` that guessed and capped at
> two — the derivation survives as an audit line, which is what it was always good at;
> (3) `summarizes` is KEPT but demoted from mechanism to **bridge claim** — this
> sentence is the student-facing form of those cards. The registry carries no context
> of its own by design: errors and skills supply it, and the list exists only so one
> sentence is not written into twenty entries.

How the algebra content is structured. Everything lives under `src/data/` and is
validated by `skill.schema.ts` on load. The layers:

- **the fundament tower** (`src/data/<layer>/cards.json`, composed by
  `src/data/layers.ts`) — **the primary reference since 2026-07-23**: the axioms,
  conventions, definitions and theorems, each traced to what it rests on.
  `fundamentals · numbers · powers · terms`. See `docs/fundamentals.md`.
- **~~laws + conventions~~** — **deleted 2026-07-23.** These were the original law
  tower; everything they held is a card in the fundament tower now, and every reference
  from the skills side (`restsOn`, error `corrupts`, a rule's
  `summarizes`) resolves to a **card id**, checked at load by `validateLayerRefs` /
  `validateErrors` and at build by `sweep-layers`. The files, their display registries
  (`lawGroups`/`lawKinds`/`conventionGroups`), the Zod schemas and the reference view's
  law/convention segments all went with them; `ReferenceView` is now an errors page.
- **errors** (`errors.json`) — the error patterns that shadow the tower; each
  `corrupts` a card. Browsed at `/errors` (`ReferenceView`, now errors-only).
- **rules** (`rules.json`, renamed from `metapatterns.json` 2026-07-27) — the **DO/IS
  registry**: student-facing one-liners, each either what a written form IS (decoding) or
  what to DO with it. 25 sentences, 18 IS / 7 DO. Cited by errors (`error.rules`) and
  skills (`skill.rules`); each `summarizes` the tower cards it is the plain-language form
  of. Kept as a central curated repository (the 2026-07-24 split proposal was **rejected**
  — see memory `metapatterns-split`), browsed at `/rules` (`RulesView`).

  *(Note on the word: "layer" means both a **file/role** here and a **floor** of the
  fundament tower, in the sense of mathematical dependency. The two remain separate
  representations — the tower is not generated from the skills side or vice versa —
  but they are no longer disconnected: skills reach into the tower by card id, and
  `pnpm sweep-layers` fails if any reference resolves to neither a card nor an error/
  meta id.)*
- **skills** (`skills/*.json`) — curated *strategies/skills* pointing into the tower:
  what is worth drilling, and why. `restsOn` is **card ids** now
  (was law / convention ids). Each skill's concrete material lives separately in…
- **drills** (`drills/*.json`) — the format-specific drill material for each
  skill. See "Skills vs drills" below.

The tower is the *coordinate system* skills live in — they cite cards to justify
and audit themselves, they do not generate them. Group **display** metadata
(title, order, blurb) is authored **inline** in the per-kind skill tree files
(a group node carries its own title/blurb; array order = display order) — the old
sibling registries `skillGroups.json` / `skillKinds.json` were absorbed and
deleted (2026-07-24), and `parseSkillTree` derives the flat `groups` / `skillKinds`
lists from the tree. Browse errors at `/errors`, skills in the **Taxonomy view**
(`/skills`), the tower one page per layer (`/fundamentals`, `/numbers`, `/powers`,
`/terms`).
This doc records the *why*, not the content tables (they would drift).

Ids are kind-prefixed slugs so a derivation chain reads like a proof:
`ax.add-commutative`, `def.sub`, `th.collect-like-terms`, `ix.juxtaposition`,
`anti.linearity`, `equivalence.juxtaposition-product`. **The `id` is the single
identifier for every entity** — cards, errors, rules and skills alike.
(The old short display codes — A1/D3/T11/N1/Ā1/M7 — were removed 2026-07-24; there
is now nothing but the slug.)

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
catalog → error-pattern ids), `restsOn` / `rules`
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
its student-facing digest (the rules registry) are part of the same fundament.

**Skills are the layer that makes the fundamentals learnable.** A skill is
authored *curation*: it selects a coherent coordinate-region of the fundamentals
and declares "this intersection is one thing worth getting fluent at." Nothing
derives skills from the fundamentals — the "what matters" judgement is human,
the same reason meta-pattern assignment stays authored, not derived. This is why
a skill has just three cross-layer arrays and no more, **one into each lens over
the tower** — `restsOn` → cards (the fundament it rests on, laws and notation
conventions alike; the original `justifiedBy`/`governedBy` split collapsed once
laws and conventions became one tower, since the card prefix already says which),
`errors` → error patterns (the negative image), `metaPatterns` → the digest. A
skill draws together *coordinates*, not drill *material* — the material is authored
separately in `drills/`.

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
skills. The **`transformation` kind was seeded 2026-07-24** (7 skills: expand,
factor, collect, simplify-power, cancel, combine-fractions) — the active
manipulation half of "read *and practice*", the recognition half being
equivalence/classification/chunking. It is still partial (roots, more binomials),
and the powers/roots law region is thinly skilled. Axioms are excluded from the "unused" mark: a skill
reaches them transitively through the theorems it cites.

## JSON format (current — 2026-07-24)

The five entity kinds — the tower **card** plus the four curated files (**skill ·
error · meta-pattern · drill**) — share one identity convention (a single `id` slug,
no display codes) and one prose convention (`LocalizedString`, LaTeX compile-checked).
Their field-by-field formats follow.

**Heading convention:** every **entity** (card, error, skill, meta-pattern) names its
display heading **`name`**; every **structural container** (a layer, a section, a
group) names its heading **`title`**. So `name` = "the heading of a thing", `title` =
"the heading of a level of the tree" — never mixed.

### Files at a glance

The fundament tower (cards) is the floor; the three curated files are lenses over
it. **Every entity is identified by a single `id` — a kind-prefixed slug; there are
no display codes.**

| File | Entry | `kind` values | `group` | id prefix |
|---|---|---|---|---|
| `fundament/<layer>/cards.json` | card (the tower) | section kinds: `preliminary`·`signature`·`convention`·`axiom`·`definition`·`theorem`·`remark` | structural (nested) | `pre.`/`op.`/`ix.`/`ax.`/`def.`/`th.`/`pl.`/`rk.` |
| `errors.json` | error pattern | `anti-law`·`misreading`·`salience` | — (from `corrupts`) | `anti.`/`mis.`/`sal.` |
| `rules.json` | rule (DO/IS sentence) | `is`·`do` | — | `rule.` |
| `cheatsheets.json` | sheet (presentation) | — | — | `sheet.` |
| `skills/<kind>.json` | skill (strategy) | `equivalence`·`classification`·`chunking`·`transformation` | structural (nested) | `<kind>.` |
| `drills/<kind>-<group>.json` | drill (material) | mirrors its skill | — | keyed by `skill` id |

**id prefix = `kind`** wherever a kind exists — the validator enforces prefix↔kind
for errors (`anti`/`mis`/`sal`) and skills (`<kind>.`); a rule's `kind` is not in its id,
so rules take the fixed `rule.` prefix; card prefixes mark epistemic role but are not kind-validated.
Skills are now grouped **structurally**, like the tower: one file per kind holds a
`kind → groups[] → skills[]` tree (2026-07-24), so a skill's `kind` and `group` are
positional (the file, and the group node it sits in) and re-attached at load by
`parseSkillTree`; `{ slug, title, blurb? }` display metadata lives inline on each
group node, array order = display order. The old `skillGroups.json`/`skillKinds.json`
registries were absorbed and deleted. The tower mirrors this — a card nests inside its
group inside its section in `cards.json`.

### Card format — the tower cards

**One schema, 15 fields, two of them required.** Every card in the four tower layers
(`fundamentals`, `numbers`, `powers`, `terms`) validates against the same `Card`
interface in `src/data/layers.ts`; there is no per-kind schema and no field in the
data that the interface does not declare. `LocalizedString` is `{ en, de }`.

| field | type | in | what it is |
|---|---|---|---|
| `id` | string | **all** | the key. Unique **tower-wide**, slug-style, never numbered. Prefix marks the role: `pre. op. ix. ax. def. th. pl. rk.` |
| `name` | LocalizedString | **all** | card title. **Plain text** — rendered with `{{ }}`, so no `$…$` and no LaTeX |
| `concerns` | string[] | most | multi-tag over `add · mul · eq · order · completeness`. Required for every kind except `preliminary` |
| `symbol` | LaTeX | few | the glyph, e.g. `+`. **Its presence selects the signature tile layout** |
| `type` | LaTeX | few | signature, e.g. `\mathbb{R} \times \mathbb{R} \to \mathbb{R}` |
| `latex` | LaTeX | most | the statement, rendered display-style |
| `avoid` / `prefer` | LaTeX | few | the ✗/✓ pair, used *instead of* `latex` by rewrite conventions |
| `forall` | LaTeX | many | **domain** of the card's free variables, rendered "for all …" / "für alle …" |
| `cond` | LaTeX | some | **restriction** on those variables, rendered "provided …" / "sofern …" |
| `basedOn` | id[] | many | standing dependencies → the "rests on" chips |
| `derivation` | LaTeX | some | the proof chain, collapsed behind a toggle |
| `derivedFrom` | id[] | some | what the chain uses → chips under the derivation |
| `note` | LocalizedString | most | prose. RichText: `$…$` inline maths and `*emph*` only |
| `intuition` | LocalizedString | some | the picture **and where it stops**, collapsed behind a toggle |

**Prose fields carry no markdown beyond `*emph*` and no em dashes** — they render
literally, and `—` also reads as `−`. `scripts/sweep-layers.mjs` fails the build on
either, and KaTeX-checks every LaTeX field with **no macros defined**.

**`forall` is the domain, `cond` is the restriction.** `forall` = where the free
variables live (`a \in \mathbb{R}`, `n \in \mathbb{N}`, `S \subseteq \mathbb{R}`);
`cond` = what is additionally required of them (`a \ne 0`, `a > 0`); a `cond` never
appears without a `forall`. `def.div` reads *for all a, b ∈ ℝ · provided b ≠ 0*. The
separation is not cosmetic: for generating exercises the **domain says where to sample
and the condition says what to filter**, unrecoverable once merged into one string or
inlined into `latex`. The quantifier is **not** a field — these prefixes are always
universal (they scope the free variables), and every existential in the tower is
*inside* the statement where its variable is bound.

**Field clusters are a convention, not a schema.** Which fields are populated follows
from `kind` but nothing enforces it and the view no longer branches on it:
`preliminary` → `note` alone; `signature` → `symbol`+`type`; `convention` → `latex`
*or* `avoid`/`prefer`; `axiom`/`definition`/`theorem`/`remark` → `latex` +
domain/condition + citations. A missing `forall` is not a deviation — it means the
card has no free variables.

**Rendering is presence-driven.** `LayerView.vue` has **one template**; each part
appears iff its field is present, so a framing card is one with a `note` and nothing
else. `kind` is a claim about *knowledge*, not about layout, and no longer selects a
template — adding a kind needs no view change. The single layout variant is the
signature tile, keyed on `symbol`.

**What is validated, and where.** `validate()` in `src/data/layers.ts` throws at load
time on: a duplicate `id` tower-wide; a `basedOn`/`derivedFrom` entry that resolves to
nothing; a missing/unknown `concerns` on a non-`preliminary` card; a missing/duplicated
section `slug` within a layer. (The JSON is cast rather than parsed, so TypeScript
cannot enforce the required fields — `validate()` does.) `scripts/sweep-layers.mjs`
adds the KaTeX and prose checks. Neither tool checks *field clusters* — those are editorial.

Two orthogonal axes, deliberately represented differently: **`kind` / `group`** = the
*tree* (a partition → structural nesting: what a card *is*, and which section it's
filed under); **`concerns[]`** = a *tagging* (multi-valued → a field: what a card is
*about*). Bridges are emergent (`|concerns| > 1`).

Four cards, verbatim:

```jsonc
// signature — `symbol` is what puts it in the op grid
{ "id": "op.add", "concerns": ["add"],
  "symbol": "+", "type": "\\mathbb{R} \\times \\mathbb{R} \\to \\mathbb{R}",
  "name": { "en": "Addition", "de": "Addition" },
  "note": { "en": "A binary operation on $\\mathbb{R}$. Written $a + b$; …", "de": "…" } }

// convention — the ✗/✓ pair replaces `latex`
{ "id": "ix.coefficient-front", "concerns": ["mul"],
  "name": { "en": "Coefficient in front", "de": "Koeffizient nach vorne" },
  "avoid": "a \\cdot 3", "prefer": "3a",
  "note": { "en": "A coefficient goes before the variable. …", "de": "…" },
  "basedOn": ["op.mul", "ax.mul-commutative"] }

// theorem — statement, quantifier, chain, and what the chain used
{ "id": "th.zero-times", "concerns": ["add", "mul"],
  "name": { "en": "Zero times anything is zero", "de": "Null mal irgendetwas ist null" },
  "latex": "0 \\cdot a = 0",
  "forall": "a \\in \\mathbb{R}",
  "derivation": "0 \\cdot a = (0 + 0) \\cdot a = 0 \\cdot a + 0 \\cdot a",
  "derivedFrom": ["ax.zero-neutral", "ax.distributivity",
                  "ax.additive-inverse", "ax.eq-congruence"] }

// theorem — domain and restriction apart, and an EXISTENTIAL statement:
// `b` is bound inside the claim, which is why the prefix is still universal
{ "id": "th.root-exists", "concerns": ["mul", "order", "completeness"],
  "name": { "en": "Roots exist, and there is only one", "de": "…" },
  "latex": "\\text{there is exactly one } b > 0 \\text{ with } b^{n} = a",
  "forall": "a \\in \\mathbb{R},\\ n \\in \\mathbb{N}",
  "cond": "a > 0",
  "derivation": "…",
  "derivedFrom": ["ax.completeness", "ax.order-mul", "th.ind", "def.pow"],
  "note": { "en": "…", "de": "…" },
  "intuition": { "en": "…", "de": "…" } }
```

> A second, **classroom-facing** prose field per card (the axiom/theorem said to a
> 15-year-old, alongside `intuition` which is written for the page's reader) is
> *planned, not built* — field name and writing standard still to decide. See `docs/TODO.md`.

### Curated layers — JSON format

The three curated files are validated by `skill.schema.ts` on load (Zod → the TS
types). Cross-layer reference fields all hold **card ids** except where noted, and the
graph is a downward-only stack (cards ← errors ← skills, and rules ← both; errors must
NOT cite skills, since skills cite errors and it would close a cycle). Prose fields are
`LocalizedString` (a plain string = English, or `{ en, de }`); LaTeX fields are pure
KaTeX; both are compile-checked at load.

**skill** — a leaf in `skills/<kind>.json`, which is a tree
`{ kind, title, blurb?, groups: [ { slug, title, blurb?, skills: [ …leaf… ] } ] }`
(one file per kind, mirroring `<layer>/cards.json`). A leaf holds the fields below;
`kind` and `group` are **positional** (the file, and the group node it sits in) — not
written on the leaf — and re-attached at load by `parseSkillTree`, which also derives
the flat `groups` / `skillKinds` display registries from the tree.

| field | type | req | meaning |
|---|---|---|---|
| `id` | string `"<kind>.<slug>"` | ✓ | the identifier; prefix must equal the file's `kind` |
| `kind` | `equivalence`\|`classification`\|`chunking`\|`transformation` | positional | strategy category (= id prefix = file); not authored on the leaf |
| `group` | string | positional | topic slug = the containing group node's `slug`; not authored on the leaf |
| `name` | LocalizedString | ✓ | the display heading (like a card's `name`) |
| `note` | LocalizedString | ✓ | the rationale — why the skill matters |
| `illustration` | LaTeX | — | one canonical example that anchors the skill |
| `requires` | string[] (skill ids) | — | direct prerequisite skills; the acyclic dependency graph |
| `rules` | string[] (rule ids) | — | the DO/IS sentences this skill teaches |
| `restsOn` | string[] (card ids) | — | the tower cards it rests on — laws/defs/theorems it is justified by **and** the notation conventions it obeys (law vs convention is read off the card prefix). Merged 2026-07-24 from the old `justifiedBy` + `governedBy` |
| `errors` | string[] (error ids) | — | the misconception catalog it guards against |
| `conditions` | LaTeX | — | domain caveat not inherited from a cited card |

**error pattern** — `errors.json`, the tower's shadow:

| field | type | req | meaning |
|---|---|---|---|
| `id` | string `"(anti\|mis\|sal).<slug>"` | ✓ | the identifier; prefix must equal `kind` |
| `kind` | `anti-law`\|`misreading`\|`salience` | ✓ | anti-law = false algebra; misreading = mis-parsed notation; salience = parsing by what is loudest |
| `corrupts` | string[] (card ids) | — | the card(s) this error distorts (all kinds → cards, since the 2026-07-24 cleanup) |
| `name` | LocalizedString | ✓ | |
| `note` | LocalizedString | ✓ | what goes wrong, in prose (the counterpart to `instances`, as a card's `note` is to its `latex`) |
| `instances` | string[] (LaTeX) | — | typical wrong forms |

**rule** — `rules.json`, one student-facing sentence:

| field | type | req | meaning |
|---|---|---|---|
| `id` | string `"rule.<slug>"` | ✓ | the identifier |
| `kind` | `is`\|`do` | ✓ | IS = what a written form MEANS (decoding); DO = what to reach for |
| `rule` | LocalizedString | ✓ | **the sentence** — "The fraction bar is a bracket". Was `name` until 2026-07-27, and it always was the rule |
| `latex` | string[] | — | **the formula as data** (2026-07-28), not buried in the prose: a formulary cannot be typeset out of sentences with maths embedded in them. An ARRAY because one sentence can carry several lines worth showing and a table wants a row each. Empty is legitimate — 4 of 57 rules state something no equation states. ⚠️ **No words inside it**: `latex` is not localized, so `(n \text{ factors})` would ship English onto the German page |
| `note` | LocalizedString | ✓ | its gloss, one sentence with an example. Was `rule`, and it always was the gloss |
| `summarizes` | string[] (card ids) | — | the tower cards this heuristic reads (cards only — errors are the skills' concern) |

**drill** — `drills/<kind>-<group>.json`, the material for a skill (one entry per
skill, keyed by `skill` id, discriminated on `kind`): `equivalents` / `examples` /
`answer` / `chunks` per kind, plus `pitfalls` (each a wrong form + `explainedBy`
naming which of the skill's `errors` it instantiates, validated ⊆ that set, + optional
`revise` skill ids). See "Skills vs drills" above.

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
   `salience` (parsing by what is visually loudest — corrupts a structure card). A
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
8. **The rules registry is a collection of sentences, not a third taxonomy**
   (reframed 2026-07-27; it was "meta-patterns, the student-facing digest of the
   tower"). A rule is one student-facing one-liner, IS or DO, and it carries **no
   context of its own** — no errors, no skills, no ordering. Context comes from
   whoever cites it. The natural home of these sentences is the errors and skills
   that show them with examples; the list exists ONLY so one sentence is not
   written into twenty entries, and that is the whole justification for the layer.
   `summarizes` survives as a **bridge claim** — this sentence is the plain-language
   form of those cards — rather than as a mechanism, since errors and skills now
   cite rules directly.
   Assignment stays **authored** (curation), never derived from refs (coverage):
   tested empirically 2026-07-09 for skills, and again in 2026-07-27 for errors,
   where the card-mediated derivation guessed wrong on five of nineteen and could
   not be overruled. The derivations survive as audit QUESTIONS — what a rule's
   cards suggest that nobody cited, and what nothing cites at all — which is what
   they were always good at: it is how five missing reading rules were found.
   ⚠️ **Reach is garbage collection, never an admission test.** What belongs in the
   registry is whatever turns out to be important, however narrowly it is used;
   the audit only asks whether a sentence is left holding nothing.
9. **The two layers keep their own formulas** (2026-07-28). The fundament makes
   NO COMPROMISES IN NOTATION — it is the mathematics for the advanced reader, so
   `\cdot` stays explicit, `:=` stays, and `a \cdot b^{-1}` stays wherever the
   inverse is the subject. The curated side is the pedagogical derivative, and
   restating a formula at student level there is translation, not duplication.
   Measured before deciding: of 66 formulas in `rules.json`, 15 exactly match a
   card they summarize, 7 overlap and 44 differ — by register (`\cdot` against
   juxtaposition), by role (`:=` against `=`), by formulation (a definition
   against a usable form), and because a sheet needs `\neq` warning lines the
   tower has almost none of.
   Rejected with it: a `latex` reference from a rule to a card (it could address
   only a whole card, never one formula; "use the card's when possible" is a
   judgement made 66 times; and a tower edit could then reshape a sheet
   silently), and a drift audit over the pairs that match today — if the layers
   are independent by design, divergence is the translation improving.
   `summarizes` stays the link, and its job is COVERAGE (which cards have a
   student-facing form), not string comparison.

10. **Prose format contract.** Prose fields (notes, whys, texts) are plain
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
11. **Localization.** Prose fields (names, notes, rule sentences,
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
5. **Conditions live on the cards**; skills inherit the conditions of the
   cards they cite via `restsOn` instead of restating them, keeping the
   skill-level `conditions` field only for caveats that aren't card-derived.

## Revision notes

**2026-07-28 (rev. 12, `skill.wrong` + the mistakes pool — BOTH ON A BRANCH, UNDECIDED):**
two changes on `feat/skill-wrong-forms`, neither merged. See `docs/TODO.md` for the argument;
this records only the model.

**`wrong: string[]` on a skill** — the tempting form as a COMPLETE FALSE CLAIM (`3x = 3 + x`,
never a bare `3 + x`), so it stands alone under a ✗ and needs no stem column. Authored per
skill and never fetched from the cited errors: 70 (skill → error) citations point at 27
distinct errors, `anti.linearity` alone at 10, and two skills citing one error are tempted by
different forms ($-a+b$ vs $-a-b$), so the pair cannot be derived even in principle. Same
ruling as `rule.latex` vs `card.latex`. **Empty is meaningful** — the two contrast skills have
no tempting form, which is why they exist. 34 of 44 equivalence skills authored; the other
three kinds are untouched, and classification (2/16 notes carrying a negation) and chunking
(0/4) probably never get it, because their wrong answer is a NAME or a DECOMPOSITION rather
than a false equation.

**`mistakes.json` — the anti-registry**, a flat pool beside `rules.json` and the same kind of
object: general sentences carrying no context of their own. The insight is that
`anti.linearity` is not an example but a SENTENCE, and modelling it as an entry with instances
bolted on is what made its ten citing skills look like duplication — a pool entry cited ten
times is ordinary. It differs from `ruleDef` in five ways, in order of weight:

    breaks[]     THE STRUCTURAL ONE. A rule points only DOWN into the tower; a mistake
                 points down (corrupts) AND SIDEWAYS into the rules pool. The only
                 pool-to-pool edge in the design — so "same level as rules" is not quite
                 right, mistakes sit half a level above. Still a DAG.
    frequency    Can live nowhere else: a rule is not more or less true, a mistake is more
                 or less MADE. Evidence per misconception, from docs/common_mistakes.md.
    kind         Three values and a different question — anti-law/misreading/salience is a
                 CAUSAL taxonomy, where a rule's is|do is a REGISTER.
    topic        Kept from the errors tree; the file is flat and the VIEW sections on it.
    latex        Same field, INVERTED CONTRACT: every line is a FALSE claim, under a ✗.

⚠️ **`mistake` is the belief stated from the INSIDE** — "Every minus is a subtraction", not
the error layer's outside naming ("Losing one of two minuses") — so it reads as a claim that
can be marked ✗ exactly as a rule reads as one that can be marked ✓. That rewrite was the only
authoring; everything else is derived, which is why the file is GENERATED
(`scripts/gen-mistakes.py`) while `errors.json` still exists beside it.

**No `group` field, and none is wanted: `breaks` IS the family.** Six rules are broken by 2–3
mistakes each and 15 mistakes break a rule nobody else breaks. The grouping is causal rather
than editorial, gives a family weight its members lack (the fraction-bar cluster is ★2/★1/★1
apart and the biggest fraction problem together), and allows DUAL MEMBERSHIP —
`mis.precedence-ignored` breaks two rules and belongs to both families, which `group: string`
could not say. There is deliberately **no sheets analogue**: you do not hand a student a
formulary of falsehoods.

**2026-07-28 (rev. 11, cheat sheets):** a THIRD consumer of the rules pool, beside errors
and skills. `cheatsheets.json` groups and orders rules and **owns nothing** — a sheet names
ids, and every formula on the page is looked up from the rule it names, so there is no
second copy to drift. The split is the design: whether a sentence belongs in the pool is
editorial ("should a student know this?"), while which sheet it lands on and where is a
later question, answerable more than once for the same sentence — `rule.no-power-law-for-sums`
is on the powers sheet and the binomial sheet both.

⚠️ **`contains` on a rule was drafted and rejected.** It mixed layout into the content pool
and let a sentence belong to one parent only. What kept citability — an error naming "the
power laws" — is that a family name the teacher names is itself a pool entry
(`rule.power-laws`, atomic, no latex, no summarizes), which the sheet points at. Group
headings are plain titles: a heading is the teacher's arrangement, and arrangement is
presentation.

    sheet: id · rule (its citable identity) · groups[]
    group: title (localized) · layout `flow`|`table` · rules[] (pool ids)

`layout` has two values on purpose — `flow` wraps between formulas, `table` puts one row per
rule and one column per `latex` index so an algebraic form lines up under its root form. A
third value would be the start of a layout language, which was considered and rejected.

Also in this revision: `latex` on a rule (see the format table), the `meta.` → `rule.` id
rename, `error.rules` authored in place of the card-mediated derivation, and 6 sheets over
57 rules. Membership of a sheet is teaching experience, not a derivable test — the pool
carries the family names a teacher names, and nothing else about grouping is data.

**2026-07-27 (rev. 10, the rules registry):** `metapatterns.json` → `rules.json`, ids
`meta.*` → `rule.*`, `skill.metaPatterns` → `skill.rules`, route `/metapatterns` →
`/rules`, `MetapatternsView` → `RulesView`. Fields `name`→`rule`, `rule`→`note`, new
`kind: is|do`. **New `error.rules`**, authored, replacing the card-mediated derivation.
16 → 25 sentences (18 IS / 7 DO) — the nine added are the positive form of the
anti-laws, whose general statement was a LAW in the tower and had never been written in
a student's words. Two new audit questions: errors citing no rule (now 0) and rules
cited by nothing (0). The curated views moved onto the shared row shell in the same
sequence; see `docs/app_design.md`.

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
