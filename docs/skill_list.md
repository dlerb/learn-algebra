# The skill list — rebuild

What a student should be able to do, written out from scratch. **No rules, no mistakes, no
ids, no schema** — those get attached later, once the list itself is right. The in-place
revision of `src/data/curated/skills/` stalled on regrouping, so this file is the structure
argument, held separately from the data until it settles.

**Numbers are handles, not ids.** Reorder, renumber, split and merge freely — nothing points
at them. What matters is that every line is *one thing a student can do*, small enough to be
practised on its own. **Granularity is the point**: where the old skill layer went wrong was
bundling, so when in doubt, split.

**V · N · P · T together are THE GRAMMAR OF ALGEBRA** — what a written expression says, how it
is parsed, and what may be done to it without changing what it names. S is the first thing
that is not grammar.

⚠️ **Grammar is not the same axis as "fluency", and the old layer conflated them.** Fluency is
*automaticity* — a property an item can have, measurable per item, wanted on late items as
much as early ones. Grammar is *what the item is about*. `fluency.json` was named for a degree
of mastery and then filled by topic, which is how the binomial formulas ended up beside
`3x = 3 \cdot x`. Here the sections name the content; fluency is something a drill measures.

**The test for N — applied strictly:** a notation item says *this mark on the page means this*.
The moment a line needs a law to be true, it is a move and it leaves. Seven lines left on that
test (see the end).

**Card marks.** `[ix.…]` names the tower card that already carries the convention.
**`[no card]` means the tower does not say it yet** — those are the candidates for new `ix.`
cards, collected at the bottom.

---

## V · The words this file uses

The T buckets count *blocks*, so the blocks need names before the counting means anything.
This section exists because that assumption was hidden and got caught.

| word | German | what it is |
|------|--------|-----------|
| **expression** | Term | anything written: `a`, `3x`, `3x + 2y` are all expressions. Scale-free — an expression is made of expressions |
| **block** | Block, Baustein | one of the parts an expression separates into. A block is itself an expression, and you move it without opening it |
| **summand** | Summand | a block of a sum. `3x + 2y` has two |
| **factor** | Faktor | a block of a product. `3xy` has three |

### V0 · What an expression IS — the five types

Read off the page, and load-bearing rather than vocabulary for its own sake: **every rule
below is conditioned on the type**, so naming it is the first move and not a formality.

| type | German | separated by | its blocks are called |
|------|--------|--------------|----------------------|
| **sum** | Summe | `+` | summands (Summanden) |
| **difference** | Differenz | `-` | summands, once the sign is absorbed |
| **product** | Produkt | `\cdot` or nothing at all | factors (Faktoren) |
| **quotient** | Quotient | the bar, or `:` | numerator and denominator (Zähler, Nenner) |
| **power** | Potenz | *nothing — the position is the operator* | base and exponent (Basis, Exponent) |

**How the type is found: brackets first `[N3.1]`, then binding strength `[N4.1]`.** The
operator that binds LOOSEST is the seam; the ones that bind tighter are the glue inside the
blocks. So in `a \cdot b + c` the `\cdot` builds a block and the `+` separates — the expression
**is a sum**, of a product and a letter.

⚠️ **Why the loosest and not the tightest.** "Which operator is the main one" invites the wrong
answer, because `\cdot` grabs its operands first and so feels dominant. Name the RESULT instead
of ranking the operators: `a \cdot b + c` *is a sum*. There is no importance claim in that, and
it is the sentence every rule keys off. The tightest-binding operator is the one done FIRST and
lives deepest inside; the loosest is done LAST and is what the expression is.

⚠️ **Two of the five types are the other two in disguise, and this is the most useful thing in
V.** A difference is a sum whose blocks may carry a minus `[def.sub]`, and a quotient is a
product whose blocks may be reciprocals `[def.div]`. Neither conversion is free — each is a
move — but once made, the sum-and-product rules apply and nothing else has to be learned. That
is why `a - b` can be reordered at all, and it is the same trick twice, one level apart.

**Power is the odd one out and stays odd**: no symbol separates its two blocks, the position
does, and the two blocks are not interchangeable in any way. `2^3 \neq 3^2`.

⚠️ **"Term" is a false friend, and the data has already fallen for it.** English school usage
says *term* for a block of a sum ("like terms", "a three-term expression") and *expression*
for the whole; German `Term` is the whole and is scale-free, with `Summand` for the block.
Near enough to look translatable, different enough to lie. What the pools do today:

- `rule.fraction-cancel` — EN "never one **term** of a sum" / DE "nie einen **Summanden**" ✓
- `anti.cancel-over-sum` — EN "one **term** out of a sum" / DE "einen einzelnen **Summanden**" ✓
- `rule.unlike-terms-stay` — EN "unlike **terms**" / DE "Ungleiche **Terme**" — the same concept,
  now with `Term` for the block
- `rule.read-the-term-first`, `rule.nothing-to-do`, `mis.term-misread` — `Term` for the whole

So the English side means two different things by one word, and the German side is
inconsistent about which word names the block. **This file uses `expression` for the whole and
never bare "term"**; the pools should be swept the same way when the rebuild lands.

### V1 · Counting through a bracket

`a + (b + c)` is **three** summands, not two. The rule, and it is not a convenience:

> **A bracket is flattened when removing it changes nothing, and counted when it does not.**

That is N3.4's ground — a bracket that alters no reading is not there — so the counting rule
is not a new idea, it is an existing item doing a second job.

| expression | blocks | why |
|---|---|---|
| `a + (b + c)` | 3 summands | `+` in front of a `+` bracket: drop it, nothing changes |
| `a - (b + c)` | **2** summands | drop it and every inner sign flips — the bracket is load-bearing |
| `a \cdot (b \cdot c)` | 3 factors | same operator, drops freely |
| `a \cdot (b + c)` | **2** factors | different operator; the sum is one factor |

**This is what makes R.8 rearranging and E.9 expanding**, which is the whole reason it has to
be stated. `a + (b+c) = a + b + c` is 3 against 3 — nothing was gained, only the grouping
moved, so it is R. `a - (b+c) = a - b - c` is 2 against 3 — the bracket was load-bearing and
removing it *is* the move, so it is E. Count them the other way and both answers flip.

---

## N · Notation — reading what is written

### N1 · Multiplication that is not written

- **N1.1** `3a = 3 \cdot a` — a number against a letter is a product `[ix.juxtaposition]`
- **N1.2** `ab = a \cdot b` — a letter against a letter is a product `[no card]`
- **N1.3** `3(x+1) = 3 \cdot (x+1)` — a number against a bracket is a product `[no card]`
- **N1.4** `a(x+1) = a \cdot (x+1)` — a letter against a bracket is a product `[no card]`
- **N1.5** `(x+1)(x+2) = (x+1) \cdot (x+2)` — a bracket against a bracket is a product `[no card]`
- **N1.6** `2\sqrt{3} = 2 \cdot \sqrt{3}` — a number against a root is a product `[no card]`
- **N1.7** `3a`, not `a3` — the coefficient is written in front `[ix.coefficient-front]`
- **N1.8** `a3` reads as a name, not as a product `[ix.coefficient-front]`
- **N1.9** `a \cdot b` — the dot is what this course writes; `\times` and `*` are read, never written `[no card]`
- **N1.10** ⚠️ **the one exception, and it contradicts N1.1**: `2\tfrac{1}{2} = 2 + \tfrac{1}{2}` — in a mixed number, side by side means PLUS. *Decide: teach it as the trap it is, or refuse the notation and always write `\tfrac{5}{2}`.* `[no card]`

### N2 · Marks that are omitted

A `1` that is present in the value and absent from the page. Three of them, and no more —
each is a symbol you must be able to write back in.

- **N2.1** `a = 1 \cdot a` — the coefficient `1` is never written `[ix.invisible-one]`
- **N2.2** `a = a^1` — the exponent `1` is never written `[ix.invisible-one → ix.pow]`
- **N2.3** `\sqrt{a} = \sqrt[2]{a}` — the root index `2` is never written `[ix.root]`

### N3 · Brackets

- **N3.1** `a \cdot (b + c)` — brackets say what to compute first `[ix.brackets]`
- **N3.2** `(a + b)` is **one object** — a whole bracket is a single thing `[no card]`
- **N3.3** `(a+b) = [a+b] = \{a+b\}` — round, square and curly do one job; the shape only helps the eye when they nest `[no card]`
- **N3.4** `((a+b)) = (a+b)` — a second bracket around a bracket adds no reading `[no card]`

### N4 · Precedence — the grouping nobody writes

- **N4.1** `\text{power} \succ \cdot \succ +` — the whole ranking, in one line `[ix.precedence, ix.power-precedence]`
- **N4.2** `a + b \cdot c = a + (b \cdot c)` — a product inside a sum needs no brackets `[ix.precedence]`
- **N4.3** `a \cdot b^n = a \cdot (b^n)` — the exponent reaches only what it touches `[ix.power-precedence]`
- **N4.4** `3a^2 = 3 \cdot (a^2)`, and `(3a)^2` is a different term `[ix.power-precedence]`
- **N4.5** `ab^2 = a \cdot (b^2)` — it binds to the one symbol before it, not to the product `[ix.power-precedence]`
- **N4.6** `(ab)^2` — a bracket is the only way to give the exponent more than one symbol `[ix.power-precedence]`
- **N4.7** `-a^2 = -(a^2)`, and `(-a)^2` is a different term `[ix.power-precedence]`
- **N4.8** `a - b - c = (a - b) - c` — a chain of one operator is read left to right `[ix.left-to-right]`
- **N4.9** `a : b : c = (a : b) : c` — the same for division, where it bites hardest `[ix.left-to-right]`

### N5 · The minus sign

- **N5.1** `-3` is a negative number; `a - b` is a subtraction — two jobs, one glyph `[no card]`
- **N5.2** `a + (-b) = a - b` — an operator and a unary minus never stand side by side `[§3]` `[ix.no-adjacent-operator]`
- **N5.3** `a \cdot (-b)` — a negative used as a factor takes brackets, so it reads as one factor `[ix.negative-factor]`
- **N5.4** `-a = (-1) \cdot a` — a leading minus is a coefficient of `-1` `[ix.negative-factor]`
- **N5.5** `-3x = (-3) \cdot x` — with a number in front, the minus joins the coefficient `[ix.negative-factor]`
- **N5.6** `-(a+b) = (-1) \cdot (a+b)` — in front of a bracket it is that same factor, and nothing has been done to the bracket yet `[ix.negative-factor]`

### N6 · Powers and roots

- **N6.1** `a^n` — read "*a* to the *n*-th": `n` factors of `a` `[ix.pow]`
- **N6.2** `a^2 = a \cdot a` — the smallest case, automatic `[ix.pow]`
- **N6.3** base and exponent are two slots that do not draw from the same place: `2^3` and `3^2` `[§5]` `[ix.pow]`
- **N6.4** `\sqrt[n]{a} = a^{1/n}` — radical and exponent are two spellings of one thing `[ix.root]`
- **N6.5** `\sqrt{a+b}` — the radical bar is a bracket: everything under it is one object `[no card]`
- **N6.6** `\sqrt{a} \cdot b` against `\sqrt{ab}` — where the bar ends is the whole question `[no card]`

### N7 · Division and the fraction bar

- **N7.1** `\frac{a}{b} = a : b = a/b` — spellings of one operation `[ix.division-symbols]` ⚠️ *`\div` retired; the open todo on `division-variants` proposes retiring `:` too*
- **N7.2** `\frac{a+b}{c} = (a+b) : c` — the bar is a bracket you do not write `[ix.fraction-bar]`
- **N7.3** `\frac{c}{a+b} = c : (a+b)` — it groups below the bar just as hard `[ix.fraction-bar]`
- **N7.4** writing a stacked fraction on one line makes the brackets reappear `[ix.fraction-bar]`
- **N7.5** `\frac{1}{2}x` against `\frac{1}{2x}` — where the bar ends, again `[no card]`
- **N7.6** `\frac{\frac{a}{b}}{c}` against `\frac{a}{\frac{b}{c}}` — the main bar is the long one, and the two are different numbers `[no card]`
- **N7.7** `\frac{a}{b}` is one object, one number — not an unfinished division `[no card]`

---

## P · Parsing — naming the blocks

The step every T item spends and no item states. V1 already does it — "count the summands,
flattening a bracket only where it changes nothing" *is* a parse — so this section is not new
material, it is the assumption written down and made practisable.

Two questions, in this order, and the second cannot be asked before the first: **what is this
expression** — a sum, a difference, a product, a quotient or a power `[V0]` — and **what are
its blocks**. Everything in T counts blocks, so a student who cannot do P cannot do T except
by imitation, which is exactly what a student who "knows the rule but not when to use it" is
doing.

⚠️ **The question is the TYPE, not "which operator is the main one".** Ranking the operators
invites the wrong answer, because `\cdot` grabs its operands first and so feels dominant; and
the student's own reading — *`\cdot` binds stronger, so `ab` forms a block and the `+` is the
seam* — is exactly right and is the same fact. `a \cdot b + c` **is a sum**. Naming the type
carries no claim about importance, and it is the sentence every rule is conditioned on.

⚠️ **This is where the old `chunking.json` lands**, nearly line for line: `basic-forms`,
`misleading-forms` and `finding-the-parts` are all "name the blocks", drawn as bracketed
answers rather than said. And `basic-forms` is `sum, difference, product, quotient, power` —
the type list of V0, authored two months ago under another name. It was never a process
between fluency and transformation: it is the reading step of the grammar, and the old model's
own defence gives it away — *fluency lets you see the structure, structure lets you see the
move.* Seeing structure is reading.

### P1 · What is this expression?

- **P.1** `3x + 2y` → a **sum**. One seam, and it is the answer
- **P.2** `3x \cdot 2y` → a **product**
- **P.3** `a \cdot b + c` → a **sum** — `\cdot` binds stronger, so `a \cdot b` is one block and the `+` is the seam ⇐ N4.2
- **P.4** `3(x+1)` → a **product**; the `+` is inside a block, not a seam ⇐ N3.1
- **P.5** `2x^2` → a **product**, not a power — the exponent reaches only `x` ⇐ N4.4
- **P.6** `(x+1)^2` → a **power**, because the bracket made the sum into one block ⇐ N4.6
- **P.7** `-3x + 2y` → a **sum**; the leading minus is part of the first block, not a seam ⇐ N5.4
- **P.8** `a - b` → a **difference**, which is a sum once the minus joins the block after it ⇐ V0
- **P.9** `\frac{3x+2}{x-1}` → a **quotient**; neither the `+` nor the `-` is a seam ⇐ N7.2
- **P.10** `\sqrt{a+b}` → a **root**, and the `+` is under the bar, inside one block ⇐ N6.5
- **P.11** `x`, `7` → an **atom**: no seam, and saying so is an answer, not a failure
- **P.12** the whole procedure, in order: **brackets first, then the loosest-binding operator is the seam** ⇐ N3.1 + N4.1

### P2 · What the blocks are

- **P.13** `3x + 2y` → two summands, `3x` and `2y`
- **P.14** `3x - 2y` → two summands, `3x` and `-2y` — the sign travels with the block `[§3]` ⇐ N5.4
- **P.15** `3 \cdot x \cdot (x+1)` → three factors, `3`, `x`, `(x+1)`
- **P.16** `\frac{3x+2}{x-1}` → two blocks, the numerator and the denominator
- **P.17** `(x+1)^2` → two slots, the base `(x+1)` and the exponent `2` `[§5]` ⇐ N6.3
- **P.18** `a + (b+c)` → 3 summands, but `a - (b+c)` → 2 ⇐ V1
- **P.19** `3(x+1) - 2(x-1)` → two summands first, and only then two factors inside each — the parse is recursive
- **P.20** `3x` inside `3x + 2y` → parse a block with the same two questions, until you reach atoms

## T · Transforming an expression

Everything here needs a law to be true, which is what kept it out of N. Sorted **not by which
law it spends** — that is the item's justification, and justification belongs on the rule it
cites — but by **what the move does to the expression**, which is what the student is actually
doing and the word they would use for it:

| bucket | what happens | classroom word |
|--------|--------------|----------------|
| **R · rearranging** | the same blocks, differently placed | umstellen, vertauschen |
| **E · expanding** | more blocks | ausmultiplizieren |
| **C · collecting** | fewer blocks | zusammenfassen, ausklammern |

**The test, in full.** It reads V's words, and V exists because this test needed them:

1. Count the **summands** on both sides, flattening brackets by V1.
2. More on the right → **E**. Fewer → **C**.
3. Equal, and each side is a single summand → count its **factors**. More → **E**. Fewer → **C**.
4. Equal again → **R**.

Something you look at, not something you judge — the standard `rule.involutive` is held to.
The three cases that decide the shape of the test:

- `a - (b+c) = a - b - c` — 2 summands against 3, so **E**, even though nothing was multiplied
  and no symbol was added. Step 1 alone gets it right.
- `2 \cdot 3x = 6x` — one summand each side, 3 factors against 2, so **C**. That is step 3, and
  it is why step 3 exists.
- `a \cdot a = a^2` — one summand each side, 2 factors against 1, so **C**; read the other way
  it is 1 against 2, so **E**. Step 3 has to be symmetric or the same equation gets two answers.

**⚠️ WHERE N AND T MEET.** `a \cdot a = a^2` is also N6.2, where it says what the notation
*means*. That is not a duplicate: **N states the identity, T is the act of using it in a
direction**, and only an ATOM can sit on both sides of that line. Anything composite is
unambiguously T — `abca = a^2bc` never touches N, because getting there needs a swap first
and then the fusion; the notation reading is one of its prerequisites, not what it is. So the
border question only ever arises for single identities, and the answer there is: the meaning
in N, the two moves in T, `⇐` pointing back.

**The law rides along as a tag** — `[comm]`, `[assoc]`, `[distr]` — so nothing is lost and the
old sections are still derivable. Two things worth noticing about those tags: rearranging is
exactly the two laws that came out INVOLUTIVE in the direction audit (a swap swaps back, a
regrouping regroups back), while distributivity is one-way and splits into E and C by
direction. The student-facing axis has a formal shadow; it is not merely a concession.

**There is no "mixed" bucket.** A move that spends two buckets is a SEQUENCE, and the data
already says that with `requires` — written `⇐` here. That is why `3x + 2 + 5x = 8x + 2` is in
C with `⇐ R.11 + C.1` rather than in a fourth section that would otherwise swallow the list.

**⚠️ THE AXIS IS BIGGER THAN THESE THREE LAWS.** It classifies the whole law layer, and the
rest lands here as it is written: `(a+b)^2 = a^2 + 2ab + b^2` is expanding, its reverse is
collecting, `\sqrt{ab} = \sqrt{a}\sqrt{b}` is expanding, `x^a \cdot x^b = x^{a+b}` is
collecting, `\frac{a}{b} + \frac{c}{d} = \frac{ad+bc}{bd}` is collecting. This section holds
only what the three laws produce so far; the power, root, fraction and binomial moves join
the same three buckets rather than getting sections of their own.

### R · Rearranging — the blocks stay, the order changes

- **R.1** `a + b = b + a` — two summands may be swapped `[§1.1]` `[comm, ax.add-commutative]`
- **R.2** `ab = ba` — two factors may be swapped `[§1.1]` `[comm, ax.mul-commutative]`
- **R.3** `3x` and `x \cdot 3` are the same expression — recognise a swap that has already happened `[§1.1]` `[comm]`
- **R.4** `a^2 b = b a^2` — a power is one factor, and swaps like any other `[§1.1]` `[comm]`
- **R.5** `y \cdot 3 = 3y` — swap so the coefficient comes first, which is what N1.7 asks for `[§1.1]` `[comm]`
- **R.6** `(a + b) + c = a + (b + c)` — a sum may be regrouped `[§2.1]` `[assoc, ax.add-associative]`
- **R.7** `(ab)c = a(bc)` — a product may be regrouped `[§2.1]` `[assoc, ax.mul-associative]`
- **R.8** `a + (b + c) = a + b + c` — a bracket regrouping a pure sum comes off `[§2.1]` `[assoc]` *(not N4.8: the convention says `a+b+c` MEANS `(a+b)+c`; this says the other grouping has the same value)*
- **R.9** `a(bc) = abc` — the same in a pure product `[§2.1]` `[assoc]`
- **R.10** `17 + (3 + 8) = (17 + 3) + 8` — regroup to make the arithmetic easy `[§2.1]` `[assoc]`
- **R.11** `a + b + c = c + b + a` — reorder a chain of three ⇐ R.1 + R.6 `[§1.1, §2.1]` `[comm, assoc]`

*The two conversions — they change what the expression IS, and everything above depends on them:*

- **R.12** `a - b = a + (-b)` — a difference read as a sum, each minus absorbed into the block after it `[§3]` `[def.sub]`
- **R.13** `\frac{a}{b} = a \cdot \frac{1}{b}` — a quotient read as a product `[§4]` `[def.div]`
- **R.14** `-b + a = a - b` — the conversion used: once it is a sum, §1.1 applies ⇐ R.12 `[§3, §1.1]` `[comm]`

*Boundaries — what may not be rearranged while it is still a difference or a quotient:*

- **R.15** `a - b \neq b - a` — subtraction does not commute `[§1.2]` `[comm]`
- **R.16** `8 - 3 \neq 3 - 8` — and the check is a number, not an argument `[§1.2]`
- **R.17** `\frac{a}{b} \neq \frac{b}{a}` — division does not commute `[§1.2]` `[comm]`
- **R.18** `\frac{8}{2} \neq \frac{2}{8}` — checked the same way `[§1.2]`
- **R.19** `(a - b) - c \neq a - (b - c)` — subtraction does not associate `[§2.2]` `[assoc]`
- **R.20** `(8 - 3) - 2 \neq 8 - (3 - 2)` — the number check `[§2.2]`
- **R.21** `(a : b) : c \neq a : (b : c)` — division does not associate `[§2.2]` `[assoc]`

### E · Expanding — the blocks grow

- **E.1** `a(b + c) = ab + ac` — multiply into a sum `[§6.1]` `[distr, ax.distributivity]`
- **E.2** `a(b - c) = ab - ac` — into a difference `[§6.1]` `[distr]`
- **E.3** `(b + c)a = ba + ca` — the factor may stand on the right `[§6.1]` `[distr]`
- **E.4** `3(x + 2) = 3x + 6` — with a number, where the arithmetic gets done too `[§6.1]` `[distr]`
- **E.5** `a(b + c + d) = ab + ac + ad` — a longer sum, every summand `[§6.1]` `[distr]`
- **E.6** `-3(x + 2) = -3x - 6` — a negative factor also reaches every summand `[§6.1, §9]` `[distr]`
- **E.7** `x(x + 1) = x^2 + x` — a variable factor; the first product becomes a power ⇐ E.1 + C.10 `[§6.1]` `[distr]`
- **E.8** `(a + b)(c + d) = ac + ad + bc + bd` — every summand of the one against every summand of the other `[§7]` `[distr, comm]`
- **E.9** `\frac{a + b}{c} = \frac{a}{c} + \frac{b}{c}` — a sum over the bar splits `[§8.1]` `[distr]`
- **E.10** `-(a + b) = -a - b` — the leading minus is the factor `(-1)` ⇐ N5.6 `[§9]` `[distr]`
- **E.11** `-(a - b) = -a + b` — the same, and the last block is where the marks go ⇐ N5.6 `[§9]` `[distr]`
- **E.12** `a - (b + c) = a - b - c` ⇐ R.12 + E.10 `[§3, §9]` `[distr]`
- **E.13** `a - (b - c) = a - b + c` ⇐ R.12 + E.11 `[§3, §9]` `[distr]`
- **E.14** `a^2 = a \cdot a` — unfold the smallest power. *The atom: the same identity as N6.1, used in a direction* ⇐ N6.1 `[§10]` `[ix.pow]`
- **E.15** `a^3 = a \cdot a^2` — **peel one factor off a power** and keep the rest as a power. The general move, and the useful one — it is what makes `\frac{a^3}{a^2}` collapse `[§10]` `[ix.pow]`
- **E.16** `2a = a + a` — unfold the smallest multiple. *The additive atom* ⇐ N1.1 `[§11]` `[th.multiple-is-product]`
- **E.17** `3a = a + 2a` — **peel one summand off a multiple** and keep the rest as a multiple. What makes `3a - a` visible `[§11]` `[th.multiple-is-product]`

*Boundaries — what does not expand:*

- **E.18** `\frac{c}{a + b} \neq \frac{c}{a} + \frac{c}{b}` — never under the bar `[§8.2]`
- **E.19** `(a + b)^2 \neq a^2 + b^2` — a power does not reach the summands one at a time `[§6.2]`
- **E.20** `\sqrt{a + b}` — nothing to expand, and nothing to do `[§6.2]`
- **E.21** only multiplication reaches into a sum — not a power, not a root `[§6.2]`

### C · Collecting — the blocks shrink

- **C.1** `3x + 2x = 5x` — collect like summands; distributivity read backwards `[§12.1]` `[distr]`
- **C.2** `x + 2x = 3x` — collecting needs the invisible one back first ⇐ N2.1 `[§12.1]` `[distr]`
- **C.3** `ab + ba = 2ab` — they are alike only once one of them is swapped ⇐ R.2 `[§1.1, §12.1]` `[comm, distr]`
- **C.4** `3x + 2 + 5x = 8x + 2` — reorder, then collect what matches ⇐ R.11 + C.1 `[§1.1, §12.1]` `[comm, assoc, distr]`
- **C.5** `ab + ac = a(b + c)` — pull out a common factor. *A different skill from E.1: it must be **found**, not carried out* `[§13]` `[distr]`
- **C.6** `3x + 6 = 3(x + 2)` — with a number, finding it means seeing the divisor `[§13]` `[distr]`
- **C.7** `x^2 + x = x(x + 1)` — pull out a variable factor; seeing it needs `x^2 = x \cdot x` ⇐ C.5 + E.14 `[§13]` `[distr]`
- **C.8** `2 \cdot 3x = 6x` — regroup so the numbers meet, then multiply them `[§14]` `[assoc]`
- **C.9** `3x \cdot 2y = 6xy` — sort the factors, then group the numbers ⇐ R.2 + R.7 `[§1.1, §14]` `[comm, assoc]`
- **C.10** `a \cdot a = a^2` — repeated factors become a power ⇐ N6.1 `[§15]` `[ix.pow]`
- **C.11** `a + a = 2a` — repeated summands become a multiple `[§16]` `[th.multiple-is-product]`
- **C.12** `x \cdot 3 \cdot x = 3x^2` — sort, then fuse the equal factors ⇐ R.2 + C.10 `[§1.1, §14, §15]` `[comm, assoc]`
- **C.13** `abca = a^2bc` — the same on a longer product ⇐ R.2 + C.10. *Purely a move: it never touches N, because the notation reading is one of its prerequisites rather than what it is* `[§1.1, §15]`
- **C.14** `\frac{ak}{bk} = \frac{a}{b}` — cancel a factor the whole numerator and the whole denominator share `[§17.1]`

*Boundaries — what does not collect. Every one of these is an expression a student wants to
"finish" and cannot:*

- **C.15** `2 + 3x` — a number and a variable summand do not collect `[§12.2]`
- **C.16** `3x + 2y` — different letters do not collect `[§12.2]`
- **C.17** `x^2 + x` — same letter, different power, does not collect. ⚠️ *And yet C.7 factors it. Not a contradiction and worth saying out loud: **nicht zusammenfassbar, aber ausklammerbar** — collecting and factoring are different questions* `[§12.2]`
- **C.18** `a^2 + b^2` — nothing to pull out, nothing to collect `[§12.2]`
- **C.19** `\frac{3x + 2}{3}` — a sum over a number does not cancel summand by summand `[§17.2]`

## Rules in student language — first draft

**Written from scratch; the existing pool is deliberately not consulted.** One sentence per
permission, **conditioned on the type** `[V0]` and stated over blocks:

> **In a `<type>`, you may `<move>`.**

**`.1` is the permission, `.2` is its limit.** They are one rule and are always taught
together — the mistake is nearly always made in the act of doing the legal version, so a
boundary that drifts away from its permission is a boundary nobody reads. The numbering says
so structurally, which the item list cannot: on the item side a permission and its boundary
are just two lines in different parts of a section.

⚠️ **Direction pairs are NOT numbered together** — §6.1 (ausmultiplizieren) and §13
(ausklammern) are one law read two ways, and so are §10/§15 and §11/§16. That relation is
already carried by the E/C buckets, and a number can only encode one thing. Each names its
twin in its text instead.

German first, because that is the language a student reads them in.

### Rearranging

**§1.1 · Reihenfolge**
> **In einer Summe dürfen die Summanden in beliebiger Reihenfolge stehen. In einem Produkt
> dürfen die Faktoren in beliebiger Reihenfolge stehen.**
>
> *In a sum the summands may stand in any order; in a product, the factors.* — R.1–R.5, R.11, R.14

**§1.2 · … aber nicht in einer Differenz oder einem Quotienten**
> **Solange ein Minus oder ein Bruchstrich trennt, darf die Reihenfolge nicht geändert werden:
> `a - b \neq b - a`, `\frac{a}{b} \neq \frac{b}{a}`.**
>
> *While a minus or a bar still separates, the order may not be changed.* — R.15–R.18

**§2.1 · Klammern**
> **In einer Summe dürfen Klammern, die nur Summanden zusammenfassen, weggelassen oder anders
> gesetzt werden. In einem Produkt gilt dasselbe für Faktoren.**
>
> *In a sum, brackets that only group summands may be dropped or set differently; in a product
> the same holds for factors.* — R.6–R.10

**§2.2 · … aber nicht in einer Differenz oder einem Quotienten**
> **`(a - b) - c \neq a - (b - c)`, `(a : b) : c \neq a : (b : c)`.**
>
> *Grouping may not be moved while a minus or a bar separates.* — R.19–R.21

**§3 · Das Minus gehört zum Block** *(the pivot — the highest-value sentence here)*
> **Ein Minus gehört zu dem Block, der ihm folgt. Danach ist die Differenz eine Summe, und
> §1.1 und §2.1 gelten.**
>
> *A minus belongs to the block that follows it; the difference is then a sum.* — R.12, R.14;
> licenses N5.2 and P.14. It is what lets §1.1 reach `a - b + c` at all, and it is why §1.2
> exists: **a student who absorbs the minus first never meets the boundary.**

**§4 · Der Bruchstrich ebenso** *(the same trick one level up)*
> **Durch `b` teilen heisst mit `\frac{1}{b}` malnehmen. Danach ist der Quotient ein Produkt,
> und §1.1 und §2.1 gelten.**
>
> *Dividing by `b` is multiplying by `1/b`; the quotient is then a product.* — R.13.
> ⚠️ **Writing this rule is what found R.13** — the item did not exist until the rule needed one.

**§5 · Potenz**
> **In einer Potenz darf nichts vertauscht werden: Basis und Exponent sind verschiedene
> Rollen. `2^3 \neq 3^2`.**
>
> *In a power nothing may be swapped: base and exponent are different roles.* — licenses N6.3
> and P.17, and **no T item at all**: in a power there is no move to make, only a reading to
> get right. A rule may exist purely to forbid.

### Expanding

**§6.1 · Ausmultiplizieren**
> **Ist ein Block eines Produkts eine Summe, so wird der andere Block mit JEDEM Summanden
> einzeln multipliziert.**
>
> *If one block of a product is a sum, the other multiplies EVERY summand.* — E.1–E.7. The word
> carrying the weight is *jedem*. Reversed by §13.

**§6.2 · … und nur ein Faktor tut das**
> **Nur ein Faktor erreicht jeden Summanden. Eine Potenz und eine Wurzel tun das nicht:
> `(a+b)^2 \neq a^2 + b^2`, `\sqrt{a+b} \neq \sqrt{a} + \sqrt{b}`.**
>
> *Only a factor reaches every summand; a power and a root do not.* — E.19–E.21

**§7 · Jeder mit jedem**
> **Sind beide Blöcke Summen, so wird jeder Summand des einen mit jedem Summanden des anderen
> multipliziert.**
>
> *If both blocks are sums, every summand of the one multiplies every summand of the other.*
> — E.8. It is §6.1 twice, but it has its own classroom name and its own count ("vier
> Produkte"), so it is its own sentence.

**§8.1 · Summe über dem Bruchstrich**
> **Ist der Zähler eine Summe, darf jeder Summand einzeln über den Nenner geschrieben werden.**
>
> *If the numerator is a sum, each summand may be written over the denominator on its own.*
> — E.9. ⚠️ **Derivable: §4 then §6.1** — dividing by `c` is multiplying by `\frac{1}{c}`, and
> then the factor reaches every summand.

**§8.2 · … aber nie unter dem Bruchstrich**
> **Eine Summe im NENNER wird nicht zerlegt: `\frac{c}{a+b} \neq \frac{c}{a} + \frac{c}{b}`.**
>
> *A sum in the denominator does not split.* — E.18

**§9 · Minus vor der Klammer**
> **Ein Minus vor einer Klammer ist der Faktor `(-1)`. Multipliziert man aus, wird aus jedem
> Summanden seine Gegenzahl.**
>
> *A minus in front of a bracket is the factor `(-1)`; expanding replaces every summand by its
> opposite.* — E.6, E.10–E.13. Stated with *Gegenzahl* rather than "sign", because a numeral
> has no sign inside it: there is one unary minus and it belongs to a block `[§3]`.

**§10 · Potenz auffalten**
> **Eine Potenz darf in ihre Faktoren aufgefaltet werden — ganz oder teilweise:
> `a^3 = a \cdot a \cdot a = a \cdot a^2`.**
>
> *A power may be unfolded into its factors, wholly or partly.* — E.14, E.15. Reversed by §15.

**§11 · Vielfaches auffalten**
> **Ein Vielfaches darf in Summanden aufgefaltet werden — ganz oder teilweise:
> `3a = a + a + a = a + 2a`.**
>
> *A multiple may be unfolded into summands, wholly or partly.* — E.16, E.17. The exact twin of
> §10 one level down. Reversed by §16.

### Collecting

**§12.1 · Gleichartige Summanden**
> **Zwei Summanden sind gleichartig, wenn sie sich nur in der Zahl davor unterscheiden.
> Gleichartige Summanden werden zusammengefasst: die Zahlen werden addiert, der Rest bleibt
> stehen.**
>
> *Two summands are alike when they differ only in the number in front; collect them by adding
> the numbers and keeping the rest.* — C.1–C.4. The definition is half the rule, which is why
> it is inside it.

**§12.2 · … und nur Gleichartiges**
> **Summanden, die sich in mehr als der Zahl davor unterscheiden, bleiben stehen:
> `2 + 3x`, `3x + 2y`, `x^2 + x`, `a^2 + b^2`.**
>
> *Summands differing in more than the number in front stay as they are.* — C.15–C.18.
> ⚠️ Say the companion out loud: **nicht zusammenfassbar heisst nicht unveränderbar** —
> `x^2 + x` does not collect and still factors `[§13]`.

**§13 · Gemeinsamer Faktor**
> **Steht in jedem Summanden derselbe Faktor, darf er vor die Klammer gezogen werden.**
>
> *If every summand contains the same factor, it may be pulled out in front of a bracket.*
> — C.5–C.7. The reverse of §6.1, and the harder direction: §6.1 is carried out, this must
> first be **seen**.

**§14 · Zahlen zusammenrechnen**
> **In einem Produkt dürfen die Zahlen zusammengerechnet werden — die Faktoren dürfen ja in
> beliebiger Reihenfolge stehen `[§1.1]`.**
>
> *In a product the numbers may be multiplied together, since the factors may stand in any
> order.* — C.8, C.9, C.12

**§15 · Gleiche Faktoren werden zur Potenz**
> **Gleiche Faktoren in einem Produkt werden als Potenz geschrieben: `a \cdot a = a^2`.**
>
> *Equal factors in a product are written as a power.* — C.10, C.12, C.13. The reverse of §10.

**§16 · Gleiche Summanden werden zum Vielfachen**
> **Gleiche Summanden werden als Vielfaches geschrieben: `a + a = 2a`.**
>
> *Equal summands are written as a multiple.* — C.11. The reverse of §11.

**§17.1 · Kürzen**
> **Gekürzt wird ein Faktor, den der GANZE Zähler und der GANZE Nenner haben:
> `\frac{ak}{bk} = \frac{a}{b}`.**
>
> *Cancel a factor shared by the whole numerator and the whole denominator.* — C.14

**§17.2 · … nie ein einzelner Summand**
> **`\frac{3x+2}{3}` bleibt: die `3` ist kein Faktor des ganzen Zählers.**
>
> *Never a single summand.* — C.19. This pair is the clearest case for the `.1`/`.2`
> numbering: the mistake happens *inside* the legal move, so the two sentences are useless
> apart.

### What this draft shows

- **Seventeen numbers, twenty-one sentences, covering all 111 items of R, E and C**, and
  reaching four more in N and P. Today's pool is 63 entries — so it was never far wrong in
  SIZE. It is wrong in VOCABULARY: it talks about operations where it should talk about blocks
  and types.
- **Writing the rule first found four missing items**, every one by the same route — the rule
  needed something to license and there was nothing there:
  - **R.13** `\frac{a}{b} = a \cdot \frac{1}{b}` (§4) — the quotient→product conversion
  - **E.6** `-3(x+2) = -3x - 6` (§6.1, §9) — a NEGATIVE factor reaching every summand
  - **E.7** `x(x+1) = x^2 + x` (§6.1) — a VARIABLE factor, where the first product becomes a power
  - **C.14** `\frac{ak}{bk} = \frac{a}{b}` (§17.1) — cancelling was missing entirely, with only
    its boundary present

  Keep working in that direction: **write the rule, then hunt for the item.** A gap is
  invisible from the item side and obvious from the rule side.
- **Three direction pairs**: §6.1/§13, §10/§15, §11/§16 — one law read two ways, landing in
  different buckets. That is the E/C split reappearing in the rules layer exactly where the
  item layer predicted it would.
- **§3, §4 and §8.1 are derivations rather than new content** (§8.1 is §4 then §6.1; §3 and §4
  are the two conversions). A student needs all three as sentences anyway — but recording which
  are load-bearing and which are convenience is what decides the cuts when the sheet is one
  page.
- **§5 licenses no move at all.** A rule may exist purely to forbid, which is another sign the
  rules layer is not parallel to T.

### Coverage

| section | items | rules |
|---------|-------|-------|
| V, N (39), P (20) | 59 | reached only where §3 and §5 land — 4 items |
| **R** | 21 | **§1.1–§5** |
| **E** | 21 | **§6.1–§11** |
| **C** | 19 | **§12.1–§17.2** |
| S | stub | none |

**Not yet touched, and the next block of work:** the power laws, the root laws, the fraction
laws and the binomial formulas. They are moves, so they sort into E and C by the same test —
`x^a \cdot x^b = x^{a+b}` collects, `(ab)^n = a^n b^n` expands, `(a+b)^2 = a^2+2ab+b^2` expands
and its reverse collects. **Known missing item, spotted while writing §10:** `(ab)^2 = a^2 b^2`
has a notation line (N4.6) but no move.

---

## S · Substitution — a letter may stand for a whole expression

**NOT WRITTEN YET.** What is settled is the boundary, and it is worth stating before the items
exist, because everything above was sorted by staying on the near side of it.

> **Every law in T is written with letters, and holds when each letter is replaced by ANY
> expression.** `(a+b)^2 = a^2 + 2ab + b^2` is not a fact about `a` and `b`; it is a fact about
> any two expressions, so it settles `(2x + 3y)^2` as well.

**Why this is not grammar.** Using it needs three things at once: a parse (P — what would `a`
have to be?), a law (T — which one has this shape?), and a choice (which of the several
readings is worth taking). The first two are grammar; the third is strategy, and it is the
first place in this list where a student can be *correct and unhelpful*.

It is also the leap that explains the most common wall in the first year: a student recites
the binomial formula perfectly and then cannot touch `(2x+3)^2`, because they learned it as a
fact about the letters `a` and `b`.

Candidates, in the order they would probably be written:

- read a law's letters as slots: `(a+b)^2` with `a := 2x`, `b := 3`
- match a written expression against a law's shape, and report what each letter must be
- see a repeated compound as one object: `(x+1)` in `3(x+1)^2 - 2(x+1)`
- name a compound and put it back afterwards
- and the boundary: when a shape *nearly* matches and the law does not apply

---

## What left N, and why

Each failed N's test: it needs a law to be true, so it is a move, and it is in T if it is
anywhere.

| was | why it left |
|-----|-------------|
| `3 = +3` | **deleted outright, not moved.** There is no unary plus: `-3` names the additive inverse (`ax.additive-inverse`), `+3` names nothing. A rule saying "the plus is never written" would reintroduce the sign-carrying numeral this project retired — there is one unary minus, and positive/negative are defined by `<`. |
| `a = \frac{a}{1}` | not an omission — nothing on the page hides a denominator. It is `\frac{a}{1} = a`, a law. |
| `a + 2a = 1a + 2a = 3a` | collecting like terms, wearing the invisible one as a disguise. |
| `(a+b)+c = a+b+c` | associativity. |
| `a \cdot (b \cdot c) = abc` | associativity. |
| `a - (b-c) \neq a-b-c` | the law about brackets after a minus. |
| naming the main operation | a reading *task* built on N4, not a convention. |
| `-\frac{a}{b} = \frac{-a}{b} = \frac{a}{-b}` | three places, one value — a theorem. |

## Conventions the tower does not carry yet

`[no card]` above, gathered. Each is either a card `src/data/fundament/` should grow, or an
admission that it is a course decision rather than a mathematical convention.

1. **Juxtaposition beyond `3a`** (N1.2–N1.6). `ix.juxtaposition` argues the case for a number
   against a letter, from `th.multiple-is-product`. Letter·letter, anything·bracket and
   number·root are the same convention with a different justification — dropping a dot between
   two factors, which needs no theorem at all.
2. **Which multiplication sign this course writes** (N1.9) — a course decision, not a card.
3. **Mixed numbers** (N1.10) — needs a decision before it can need a card.
4. **A bracket is one object** (N3.2), and **the bracket shapes** (N3.3), and **a doubled
   bracket** (N3.4). `ix.brackets` says what brackets *do*, not what they *are*.
5. **The two jobs of the minus glyph** (N5.1). The tower has the unary minus and subtraction
   separately; nothing says the reader must decide which one a given `-` is.
6. **The radical bar as a bracket** (N6.5, N6.6). `ix.fraction-bar` does exactly this job for
   the fraction bar; the root has no counterpart, and it is the same convention.
7. **Reading a stacked fraction** (N7.5–N7.7): where a bar ends, which bar is the main one,
   and that a fraction is one number.

## Open questions

1. **N1.10, mixed numbers** — teach the exception or refuse the notation.
2. **N7.1** — does `:` survive? If not, this line is the bar and the slash.
3. **What comes next.** The equals sign as a claim, `\neq`/`<`/`>`, decimal comma vs point.
   Own section, or not skills at all? *(Naming the parts is answered — it is V.)*
4. **Where do the number-checks live?** R.14, R.16, R.18 substitute numbers to settle a
   question. That is one skill — "test a claim with numbers" — applied three times, not three
   skills, and it only ever appears attached to something else. Cross-cutting, like "read the
   expression aloud" and "estimate the answer"; they may need a section of their own.
5. ~~Does C.6 belong in C?~~ **Answered by step 3 of the test**: summands first, factors
   second. `2 \cdot 3x = 6x` is collecting at the factor level.
6. **Does N keep both directions of an identity, or only the meaning?** Decided as: N states
   what the notation means, T holds the two moves (E.12/C.10, E.13/C.11), `⇐` pointing back.
   The alternative — N owns the identity and T cites it without items of its own — would leave
   C.12 (`abca = a^2bc`) depending on something no item performs.
6. **The reverse readings hold.** C.4/C.5 (pull out) are separate items from E.1/E.4
   (multiply in), by the rule that a backward reading with its own classroom name is its own
   skill — and here the two directions now land in different BUCKETS, which is the strongest
   evidence yet that the rule is right.
