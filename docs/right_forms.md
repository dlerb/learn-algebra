# Restructuring `right[]` — plan

*Written 2026-08-01, during the rules/mistakes revision.*
**Step 1 is BUILT (2026-08-01).** Steps 2 and 3 are not — see Phases.

## Why

`wrong[]` and `right[]` describe the two halves of the same row and have different
shapes:

```jsonc
"wrong": [{ "latex": "2 + 3x = 5x", "mistake": "anti.conjoining" }]   // reference per entry
"right": ["5x"],                                                      // bare forms
"rules": ["rule.unlike-terms-stay"]                                   // reference per SKILL
```

The consequence is that a right form cannot say what licenses **it**. The rules sit
on the skill, so where several forms need several rules the pairing is lost — and,
worse, a missing rule is invisible. Measured on the four skills that carry more than
one right form and more than one rule:

- `product-with-brackets` — `(x+1)·2` is licensed by **commutativity, not cited**
- `coefficient-negative-one` — `-1a → -a` is **`invisible-one` read backwards, not cited**
- `minus-over-difference` — cites `three-minuses` + `implicit-op-before-bracket`; its
  forms actually need `minus-over-bracket` and commutativity. **Mis-cited**, and its
  sibling `minus-over-sum` cites the pair differently for the same move.

Three of four had a hole. A schema that lets a hole hide is part of the hole — the
same argument `skill.mistakes` already makes by being derived from `wrong[]`
("deriving makes that class of mis-wiring unrepresentable").

## Target shape

```ts
export const TERMINAL      = '\\blacksquare'  // right[]: nothing to do
export const INEXPRESSIBLE = '\\ldots'        // wrong[]: nothing was written

const rightForm = z.object({
  latex: z.string(),              // ALWAYS present; TERMINAL when the form is finished
  rule: z.string().optional(),    // the ONE rule this form adds — see below
})
right: z.array(rightForm).default([])

// and the mirror, changed at the same time:
wrongForm = { latex: z.string(), mistake: z.string() }   // latex now REQUIRED
```

⚠️ Making `wrong[].latex` required **reversed a decision recorded in the schema on
2026-07-30** ("Do NOT put `\ldots` in here to fill it — the field means 'the false
claim', and the whole point of these entries is that there is none"). That argument
is still true about the maths; it was overturned because absence is
indistinguishable from unfinished authoring and an explicit marker is not. The
schema note records the reversal rather than deleting the argument.

Symmetric with `wrong[]` in shape and in rendering. `skill.rules` **stays** (see
"strategy rules"), and the reverse index on `/rules` becomes the union of the two.

### Why the sentinels are literal, not absence

An earlier draft used *absence* (`latex` omitted, `right: []`) to mean "nothing to
do", mirroring `wrong[].latex` being optional. Explicit sentinels are better:

- `right: []` reads identically to "not authored yet". An explicit `∎` entry cannot.
  This removes the need for a "terminal skills" audit line invented only to
  disambiguate the two — **a design that removes a check beats one that adds one**.
- every entry has a `latex`, so the view renders uniformly and no branch is needed.
- `validateStacks` is untouched, and the `right.length === 0` convention retires
  along with its four comment sites.

⚠️ **Both sentinels must be exported constants, never repeated literals.** A drill
generating answer options from `right[]` has to know not to offer ∎ as a choice, and
it can only know that if there is one place to import it from.

⚠️ **The CE loop must skip `TERMINAL` BEFORE `ce.parse`, not after.** Measured: KaTeX
renders `\blacksquare` fine, but CE parses it to an Error node, returns `undefined`
from `isEqual` (undecided — the green-by-luck failure mode) and prints a
"compilation fallback" warning on every run.

## One rule per entry, not an array

`wrong[].mistake` is singular and required, and that constraint is what forced the
mistake pool to denoise. The same constraint is available here: measured, **zero of
the 78 skills genuinely needs two rules on one form.** Twelve look like they do, and
every one is something else:

| | count | what it really is |
|---|---|---|
| terminal skills | 4 | cite their why-rule **and** `nothing-to-do` |
| compressed chains | 3 | one entry standing for two steps |
| rule + strategy rule | 4 | the second qualifies the skill, not the form |
| mis-cited | 1 | `collect-like-terms` cites `invisible-one` it does not use |

**The terminal four dissolve.** Their why-rule is already reachable through the ✗
side — verified for all four: `anti.conjoining.breaks` → `unlike-terms-stay`,
`anti.root-over-sum.breaks` → `only-multiplication-distributes`, and so on. The ✓
entry keeps `nothing-to-do` alone and nothing is lost: *why* nothing works arrives
through the mistake, which is where it belongs.

**The chains resolve through inheritance** (next section), not by authoring
intermediate forms.

## Cite what the skill ADDS

`skill.requires` is acyclic, process-layered, 95 edges, zero running backwards — so
"what does this rule depend on" is already a graph walk. Measured: **26 of 72 skills
cite at least one rule a prerequisite already teaches.**

```
multiplying-into-a-bracket   inherits implicit-op-before-bracket   ADDS only-multiplication-distributes
no-cancelling-in-a-sum       inherits split-numerator              ADDS fraction-cancel
```

Both drop to one rule per entry with **no intermediate form authored**. Citing only
what a skill adds is derivable (the closure recovers the full set), makes every
citation mean "this is the new thing", and resolves the chain cases for free.

⚠️ **The cost is also the payoff: 17 skills would then cite nothing at all.** Each is
either a substitution instance of a skill already taught — the redundancy question —
or a skill that adds something real with no rule to name it. That list is the input
to the dedup pass, and it arrives for free.

⚠️ **Risk:** citations become dependent on the `requires` graph being right. A missing
prerequisite makes an inherited rule look new. Cite-all is robust to that; this is
not. Mitigate with an audit line reporting inherited citations, so drift shows up
rather than rotting.

## Strategy rules keep `skill.rules`

Four of the twelve doubles are a specific rule plus a *strategy* rule —
`binomials-read-backwards` on the two binomial skills, `dominant-op-tools` on the two
chunking skills. Those do not license a form; they qualify the approach.

That is a different relation, not a fallback bin, and it has a tell: those are also
the two rules in the pool with **no `summarizes`** — the strategy sentences. Form
level says *what licenses this form*; skill level says *what this skill teaches about
approach*.

## What it touches

| site | change |
|---|---|
| `skill.schema.ts:138` | the field, plus the `rightForm` object and the two constants |
| `skill.schema.ts:147` | `rules` — authored → union of `right[].rule` and skill-level |
| `skill.schema.ts:814` | `validateStacks` — unchanged, but its comment about empty `right[]` is stale |
| `skill.schema.ts:897` | `validateLatexCompiles` — check `r.latex`, skip sentinels |
| `scripts/validate.ts:65` | the CE loop — skip `TERMINAL` before parsing |
| `SkillsView.vue` | 162, 187, 308, 323 — row type and render; the terminal branch goes away |
| `citations.ts` | the `skill → rule` edge relabels to `right[i].rule` |
| `auditCoverage`, `validateRuleRefs`, `/rules` | read `skill.rules`; safe if derived under the same name |
| `WrongRight.vue:39,48` | the missing-latex branch becomes dead once `wrong[]` migrates |

Data: 82 right entries and 78 skills' `rules[]`, across the three `skills/*.json`.

## Phases

**Step 1 — mechanical, no content decisions. ✅ DONE 2026-08-01** (`f315dec`).
86 strings wrapped, 5 terminal sentinels, 10 inexpressible sentinels; schema, both
validators, the view and `citations.ts` updated; `rules[]` untouched at skill
level. The data and the code had to land in one commit — the schema change breaks
`pnpm validate` until the data matches, so they are not separable.

⚠️ THE INVARIANT THAT PROVED IT: `pnpm validate` said **78 checked** before and
after. Terminal skills gained five right entries, but they are skipped, so any
movement in that number would have meant something started or stopped being
compared.

**Step 2 — attribution, during the fluency pass.** As each skill is read, move the
rule it *adds* onto the form and drop what it inherits. Both fields coexist; an audit
line counts skills still holding form-level rules at skill level, giving a burndown
instead of a cliff.

**Step 3 — close.** When the burndown is near zero: make `rules` derived, delete the
authored field except for strategy rules, retire the stale `right.length === 0`
comments, migrate `wrong[]` to explicit `INEXPRESSIBLE`.

⚠️ **Sequencing with the dedup pass.** Dedup *deletes* skills, so it belongs before
the expensive step and after the cheap one: step 1 → dedup (the 17) → step 2. No
judgement work is then spent on a skill that is later merged away.

## Open decisions

1. **`rule` singular or `rules` array on a form.** The measurement says singular is
   sufficient and would force the same denoising `wrong[]` got. Recorded here as
   singular; reversible before step 2 begins, expensive after.
2. **`\times`.** Two stimuli use it (`explicit-vs-implicit-product`,
   `product-with-brackets`) and exist *to* introduce it. Dropping it is a teaching
   decision, not a data fix. Note that `2(x+1)` is already taken as a stimulus by
   `multiplying-into-a-bracket`, so `product-with-brackets` cannot simply adopt it —
   the options are keep `×`, take `2 \cdot (x+1)`, or merge the two skills.

## Not in scope

Rule→rule dependency edges in `rules.json`. The tower already carries both
dependency graphs (`derivedFrom` = why this is true, `basedOn` = what you must be
able to read), used almost disjointly, and rules inherit them through `summarizes` —
33 and 19 rules respectively. See the `tower-inheritance` decision.


## What the flag added afterwards

`reversible` (2026-08-01, `30da609`) turned out to name the distinction this
document could previously only describe in prose:

- a **↔** skill's `right[]` is a set of ALTERNATIVES — four notations for one
  product, three placements of one minus. Wrapping the strings is the whole job.
- a **→** skill's `right[]` is often a CHAIN, where each step has its own rule.
  That is where step 2's attribution has real work.

Swept over the twelve skills with more than one right form, five are chains and
seven are alternatives:

```
coefficient-negative-one   (-1)·a → (-1)a → -1a → -a    three steps, three rules
coefficient-zero           0·x → 0x → 0                 notation, then evaluation
redundant-brackets         ((a+b)) → (a+b) → a+b        same move twice
minus-over-sum             two steps, and DIRECTION-MIXED   (todo)
minus-over-difference      two steps, and DIRECTION-MIXED   (todo)
```

The last two carry `todo`s: some of their steps reverse and some do not, which
under one-flag-per-skill is a reason to split rather than to pick a flag.

`negative-numbers` (`-3` → `(-3)`, `0 - 3`) is a borderline the sweep flagged but
did not decide: both forms reverse, so `↔` stands, but `(-3)` is a notation variant
while `0 - 3` re-expresses the negative as a subtraction — not the same kind of
right form in one list.
