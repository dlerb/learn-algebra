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
| **atom** | Atom | a block with nothing inside: ONE number or ONE letter. `7` and `x` are atoms; `3x` is not (two blocks), `a^2` is not (a power over an atom). It is where descending stops |

⚠️ **Blocks nest, and the counting only ever looks at ONE level.** `(ab)^n` is **one** block —
a power — whose base is a block containing **two**. Saying "one block" is never a claim that
there is nothing inside; it is a claim about the top. You reach the rest by descending, which
is step 4 of the test.

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

### V1 · Separating operators and grouping symbols

Not every operator separates. This is the distinction the counting rests on, and it was
missing until `(ab)^n` forced it out:

| | which | what they do | blocks at the top |
|---|---|---|---|
| **separating operators** | `+` `-` `\cdot` (and `/` `:` on a line) | sit BETWEEN blocks of the same kind, any number of them — you can walk along the seam | as many as there are: summands, factors |
| **grouping symbols** | written brackets · the fraction bar · the radical · the superscript position | group what is written INSIDE them, by geometry. No seam, and the two parts need not be the same kind of thing | **one** — the whole thing is a single block |

So `(ab)^n` is **one block**: nothing separates at the top. `a^n \cdot b^n` is **two blocks**:
the `\cdot` is a seam and the powers are the glue inside. Likewise `\frac{a}{b} \cdot
\frac{c}{d}` is two blocks and `\frac{ac}{bd}` is one.

**A grouping symbol's parts still exist — one level down.** A quotient has a numerator and a
denominator `[P.16]`, a power has a base and an exponent `[P.17]`. They are simply not blocks
of the expression they sit in; you reach them by descending, not by counting.

**"Grouping symbol" is the standard term, not ours.** English curricula patch PEMDAS into
**G**EMDAS for exactly this reason and list the fraction bar with the brackets; the German rule
carries the same rider — *die Seiten eines Bruchstrichs und der Strich des Wurzelzeichens
werden wie Klammern behandelt*.

⚠️ **But "der Bruchstrich ist eine Klammer" is too loose to say to a class, and it was in this
file until 2026-08-02.** A bracket is a PAIR of marks: one opens, one closes, and the region
between them is the block. A bar is one stroke. What plays the part of the two marks is:

> **Wo der Strich anfängt und wo er aufhört — das ist die Klammer.**

That is not a metaphor. `a - \overline{b+c}` delimited exactly the region a pair would, and the
delimiters were the two ends of the stroke. Two consequences worth saying out loud:

- **Length is meaning.** With `(` and `)` the delimiters are glyphs you cannot draw sloppily.
  With a bar they are the ends of one stroke, so a bar drawn too short or too long says
  something else `[§0.1, §0.2]`.
- **A fraction bar is two brackets in one stroke** — it delimits the region above AND the
  region below, which no bracket pair does. The root is the ordinary case: the hook opens and
  the right end of the bar closes.

⚠️ **And the bar is not LIKE a bracket, it WAS one.** The horizontal line has a name — the
**vinculum** — and before parentheses were adopted in the eighteenth century it *was* the
bracketing device: `a - \overline{b + c}` meant `a - (b+c)`. Parentheses replaced it almost
everywhere, and it survives in exactly the two places this file keeps arguing about, over the
radicand and between numerator and denominator. So N7.2's "a bracket you do not write" is not
an analogy — it is the older bracket that never got replaced there. Which is also why the
fraction bar and the root bar behave identically `[N6.5, N7.2]`: they are the same symbol.

⚠️ **Why the bar is one block, stated on the right ground.** NOT because `:` binds tighter than
`\cdot` — there is no such rung, they share one and are read left to right `[N4.1b]`. Because
the bar is a grouping symbol. And that settles the apparent clash with V2 rather than creating
one: the bar is a bracket that can never be removed, so V2's rule counts it with no special
case.

### V2 · Counting through a bracket


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

- **N4.1** **Two tiers, not one chain.** First the **grouping symbols** `[V1]` — written brackets, the fraction bar, the radical, the superscript position — which group by geometry and are settled before any ranking is consulted. Then, among what is left on the line: `\text{power} \succ \cdot \; / \; : \; \succ + \; -`, same rung read left to right `[ix.precedence, ix.power-precedence]`
- **N4.1a** the classroom form: **Klammern → Potenz → Punkt → Strich**, *wobei Bruchstrich und Wurzelstrich Klammern sind* — that rider is the whole content, and it is what English curricula patch PEMDAS into **G**EMDAS for `[V1]`
- **N4.1b** `\cdot`, `/` and `:` share ONE rung: `a / b \cdot c = (a/b) \cdot c`, never `a/(b \cdot c)`. ⚠️ The stacked bar is NOT on this rung — it is a grouping symbol, which is why `\frac{a}{b} \cdot c` needs no brackets and `a / b \cdot c` does `[no card]`
- **N4.2** `a + b \cdot c = a + (b \cdot c)` — a product inside a sum needs no brackets `[ix.precedence]`
- **N4.3** `a \cdot b^n = a \cdot (b^n)` — the exponent reaches only what it touches `[ix.power-precedence]`
- **N4.4** `3a^2 = 3 \cdot (a^2)`, and `(3a)^2` is a different term `[ix.power-precedence]`
- **N4.5** `ab^2 = a \cdot (b^2)` — **the power binds to the closest BLOCK before it** `[ix.power-precedence]`
- **N4.5a** and "block" is the word that makes it exceptionless. `-2a^2 = -2(a^2)`: nothing is grouped, so the closest block is the atom `a`. `\left(\frac{a}{b}\right)^2`: the bar has ALREADY grouped, so the closest block is the whole fraction — and *not* the numerator. Same rule, opposite-looking answers; "closest symbol" is a shortcut that holds only while nothing has been grouped `[no card]`
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
- **N6.5** `\sqrt{a+b}` — the radical bar is a bracket: everything under it is one object `[§0.2]` `[no card]`
- **N6.6** `\sqrt{a} \cdot b` against `\sqrt{ab}` — where the bar ends is the whole question `[no card]`
- **N6.8** `a^0 = 1` — read it off the same-base rule rather than as a decree: `a^m \cdot a^0 = a^{m+0} = a^m`, so `a^0` can only be `1` `[§28]` `[no card]`
- **N6.7** `a^{b^c}` is read TOP-DOWN, `a^{(b^c)}`, never `(a^b)^c`: `3^{3^3} = 3^{27}`, which is 7 625 597 484 987 and not 19 683 `[no card]`

### N7 · Division and the fraction bar

- **N7.1** `\frac{a}{b} = a : b = a/b` — spellings of one operation `[ix.division-symbols]` ⚠️ *`\div` retired; the open todo on `division-variants` proposes retiring `:` too*
- **N7.2** `\frac{a+b}{c} = (a+b) : c` — the bar is a bracket you do not write `[§0.1]` `[ix.fraction-bar]`
- **N7.3** `\frac{c}{a+b} = c : (a+b)` — it groups below the bar just as hard `[ix.fraction-bar]`
- **N7.4** writing a stacked fraction on one line makes the brackets reappear `[ix.fraction-bar]`
- **N7.5** `\frac{1}{2}x` against `\frac{1}{2x}` — where the bar ends, again `[no card]`
- **N7.6** `\frac{\frac{a}{b}}{c}` against `\frac{a}{\frac{b}{c}}` — the main bar is the long one, and the two are different numbers `[no card]`
- **N7.7** `\frac{a}{b}` is one object, one number — not an unfinished division `[no card]`
- **N7.8** **The bar's extent is the fraction's scope**, and it settles the reading in both directions: sideways, `\frac{1}{2}x` against `\frac{1}{2x}` `[N7.5]`; upward, a superscript ABOVE the bar and within its span belongs to the numerator, one PAST the bar's right end belongs to the whole fraction `[no card]`
- **N7.9** `\frac{a^2}{b}` against `\left(\frac{a}{b}\right)^2` — where the exponent is written decides what it is applied to. ⚠️ `\frac{a^2}{b}` needs NO bracket around `a^2`: the bar already brackets the numerator, so `\frac{(a^2)}{b}` is a bracket that changes no reading `[N3.4]`. The brackets in the second are needed because the exponent stands outside the bar `[no card]`
- **N7.10** in handwriting the bar has no precise right end — but that is the writer's to fix, not the reader's to guess `[§0.1]`. It is the real reason to write `\left(\frac{a}{b}\right)^n` rather than trust the geometry. ⚠️ Typeset, the bare form is NOT ambiguous — it reads as the whole fraction — and it is worth not marking it wrong `[no card]`

---

## P · Parsing — naming the blocks

The step every T item spends and no item states. V2 already does it — "count the summands,
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
- **P.18** `a + (b+c)` → 3 summands, but `a - (b+c)` → 2 ⇐ V2
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

**THE TEST.** It reads V's words, and V exists because this test needed them. The types sit on
a ladder, loosest first — which is the inverse of binding strength:

> **sum ⟶ product ⟶ container** (quotient, power, root) **⟶ atom**

1. Name each side's **type** `[V0]` and count its **blocks** `[V1, V2]`.
2. **The type moved UP the ladder → E. Down → C.**
3. Same type: **more blocks → E, fewer → C.**
4. Same type and same count: **descend into the blocks and ask again.**
5. Nothing differs at any level — only order or grouping — → **R**.

That is *ausmultiplizieren* against *zusammenfassen* made mechanical: **expanding opens an
expression up the ladder, collecting closes it down, rearranging leaves it where it is.**

Worked, including the three cases that forced this shape:

| move | left | right | why |
|------|------|-------|-----|
| `a(b+c) = ab+ac` | product, 2 | sum, 2 | **up** the ladder → E, though the count never moved |
| `(ab)^n = a^n b^n` | container, 1 | product, 2 | up → E |
| `x^a x^b = x^{a+b}` | product, 2 | container, 1 | **down** → C |
| `2 \cdot 3x = 6x` | product, 3 | product, 2 | same type, fewer → C |
| `a+(b+c) = a+b+c` | sum, 3 | sum, 3 | same, same → descend → nothing differs → R |
| `\frac{ak}{bk} = \frac{a}{b}` | container, 1 | container, 1 | descend: numerator `ak` (2) against `a` (1) → C |
| `a - (b+c) = a-b-c` | sum, 2 | sum, 3 | same type, more → E |

⚠️ **This corrected an earlier reading of `\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}`.** It
was called rearranging, by applying §4 first and counting afterwards — but applying §4 is
already a move. Counted as written it is product(2) → container(1): **down the ladder,
collecting**. Adding fractions is collecting too. What separates the two is not the bucket but
the COST — one needs a common denominator and the other does not.

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

*The power spellings — same rung on the ladder, so rearranging `[V1]`:*

- **R.22** `a^{-n} = \frac{1}{a^n}` — a negative exponent is the reciprocal spelling `[§27]` `[rule.minus-in-exponent]`
- **R.23** `\sqrt[n]{a} = a^{1/n}` — radical and fractional exponent are two spellings of one thing ⇐ N6.4 `[§25]` `[ix.root]`
- **R.24** `\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}` — root and power in either order. ⚠️ *Involutive: the move is its own reverse, which is exactly why it lands in R and not in E or C* `[§26]` `[rule.root-of-power]`

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

*The power and root laws that open — container → product, so expanding `[V1]`:*

- **E.22** `(ab)^n = a^n b^n` — the power reaches every factor `[§24]` `[rule.power-over-product]`
- **E.23** `\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}` — top and bottom each. ⚠️ *Not a new law: it is E.22 with a reciprocal `[§4]`* `[§24]` `[rule.power-over-quotient]`
- **E.24** `\sqrt[n]{ab} = \sqrt[n]{a} \cdot \sqrt[n]{b}` — ⚠️ *and not a new law either: it is E.22 read with `n = \frac{1}{2}` `[R.23]`* `[§24, §25]` `[rule.root-over-product]`
- **E.25** `\sqrt[n]{\frac{a}{b}} = \frac{\sqrt[n]{a}}{\sqrt[n]{b}}` — E.23 the same way `[§24, §25]` `[rule.root-over-quotient]`
- **E.26** `a^{m+n} = a^m \cdot a^n` — split an exponent sum. The general form of E.15 `[§21]` `[rule.same-base]`
- **E.27** `\frac{a}{b} : \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}` — dividing by a fraction opens into a product `[§30]` `[rule.fraction-divide]`

*The binomial formulas, expanding:*

- **E.28** `(a+b)^2 = a^2 + 2ab + b^2` — container(1) → sum(3) `[§33]` `[rule.binomial-square]`
- **E.29** `(a-b)^2 = a^2 - 2ab + b^2` — ⚠️ *the same formula with `b := -b` `[S.1]`, not a second one to learn* `[§33]` `[rule.square-of-difference]`
- **E.30** `(a+b)(a-b) = a^2 - b^2` — product(2) → sum(2), still up the ladder `[§33]` `[rule.difference-of-squares]`
- **E.31** `(x+m)(x+n) = x^2 + (m+n)x + mn` `[§34]` `[rule.quadratic-pair]`

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

*The power laws that close — product → container, so collecting `[V1]`:*

- **C.20** `a^m \cdot a^n = a^{m+n}` — same base: add the exponents `[§21]` `[rule.same-base]`
- **C.21** `\frac{a^m}{a^n} = a^{m-n}` — ⚠️ *not a fourth law: C.20 after `[§4]`* `[§22]` `[rule.same-base-divide]`
- **C.22** `(a^m)^n = a^{mn}` — the tower gets one storey shorter `[§23]` `[rule.power-of-power]`
- **C.23** `a^n b^n = (ab)^n` — E.22 read backwards `[§24]` `[rule.power-over-product]`

*The fraction laws that close:*

- **C.24** `\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}` — product(2) → container(1). ⚠️ *Multiplying fractions needs nothing first, which is what "no common denominator" really means* `[§29]` `[rule.fraction-multiply]`
- **C.25** `\frac{a}{b} + \frac{c}{b} = \frac{a+c}{b}` — same denominator, add the numerators `[§31]` `[rule.fraction-common-denominator]`
- **C.26** `\frac{a}{b} + \frac{c}{d} = \frac{ad+bc}{bd}` — different denominators: make them the same first `[§31]` `[rule.fraction-common-denominator]`
- **C.27** `c + \frac{a}{b} = \frac{cb+a}{b}` — a whole number is a fraction over `1` `[§31]` `[rule.fraction-plus-whole]`
- **C.28** `\frac{\frac{a}{b}}{c} = \frac{a}{bc}` — a double fraction collapses; which bar is the main one decides everything ⇐ N7.6 `[§32]` `[rule.double-fraction]`

*The binomial formulas, collecting — the harder direction, because the shape must be SEEN:*

- **C.29** `a^2 + 2ab + b^2 = (a+b)^2` — sum(3) → container(1) `[§33]` `[rule.binomials-read-backwards]`
- **C.30** `a^2 - 2ab + b^2 = (a-b)^2` `[§33]` `[rule.binomials-read-backwards]`
- **C.31** `a^2 - b^2 = (a+b)(a-b)` — sum(2) → product(2), down the ladder `[§33]` `[rule.binomials-read-backwards]`
- **C.32** `x^2 + 5x + 6 = (x+2)(x+3)` — find the pair: product `6`, sum `5` `[§34]` `[rule.quadratic-pair]`

*Boundaries — powers and fractions that do not collect:*

- **C.33** `a^m \cdot b^n` — different bases do not collect `[§21]`
- **C.34** `a^m + a^n` — same base, but a SUM: the power laws are about products `[§21]`
- **C.35** `\frac{a+b}{a+c} \neq \frac{b}{c}` — the `a` is a summand, not a factor of the whole ⇐ C.19 `[§17.2]`

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

### Reading — the grouping symbols

⚠️ **Numbered from zero so that the move rules keep their numbers.** These come FIRST when the
set is re-based: the notation rules precede the moves, as N precedes T.

**§0.1 · Der Bruchstrich**
> **Alles, was über und unter dem Bruchstrich steht, gehört zum Bruch und bildet einen Block.
> Also genau lesen — und genau zeichnen.**
>
> *Everything above and below the fraction bar belongs to the fraction and forms one block. So
> read it exactly — and draw it exactly.* — N7.2, N7.3, N7.7, N7.8; read by P.9

**§0.2 · Der Wurzelstrich**
> **Alles, was unter dem waagrechten Strich der Wurzel steht, gehört unter die Wurzel und
> bildet einen Block. Also genau lesen — und genau zeichnen.**
>
> *Everything under the horizontal bar of the root belongs under the root and forms one block.
> So read it exactly — and draw it exactly.* — N6.5, N6.6, P.10

⚠️ **Deliberately the same sentence twice**, because it is the same symbol twice — the vinculum
`[V1]`. And the tail is not decoration: *wo der Strich anfängt und wo er aufhört, ist die
Klammer*, so a bar drawn carelessly says something the student did not mean.

⚠️ **"Draw it exactly" is a rule for the teacher's mouth, not for a drill — and that is a
category, not an exception.** An app that takes clicks and typed answers cannot observe a
student DRAWING, so no **production** skill can be drilled here. The reading half survives as
items and is perfectly drillable (given two bars of different length, which fraction is this? —
N7.8, N7.9). Only the writing demand rides along in the rule's tail. ⚠️ **Expect this again:**
"write the brackets when you raise a fraction to a power" `[N7.10]` is the same shape, and so
is every future rule about how something must be written down rather than read or transformed.

⚠️ **It is also a kind of MISTAKE the pools cannot hold.** Every entry in `mistakes.json` is a
misreading or a wrong move — something done to an expression already on the page. Drawing a
bar of the wrong length is neither: the student means the right thing and writes one that says
something else. `mis.fraction-bar-grouping-lost` and `mis.root-scope` are its reading-side
cousins, not the same failure. And it is worth saying to a class as a demand rather than a
subtlety: **the length of the bar is under your hand, so it is not too much to ask.**

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

### Substituting

**§18 · Einsetzen**
> **Wo ein einzelner Buchstabe steht, darf ein ganzer Term stehen. Die Regel gilt weiter.**
>
> *Where a single letter stands, a whole expression may stand. The rule still holds.* — S.1.
> The sentence that makes every rule above infinitely applicable, and the one a student who
> "knows the formula but cannot use it" is missing.

**§19 · Klammern beim Einsetzen**
> **Setze ein und frage dann: Ändert das Weglassen der Klammer die Lesart? Wenn ja, bleibt sie.
> Wenn nein, kommt sie weg.**
>
> *Substitute, then ask whether removing the bracket would change the reading.* — S.2–S.8, S.16.
> ⚠️ Nothing new: this is V2 applied at the substitution site. Over the bar and under the root
> the answer is always "no brackets", because there is already one `[§0.1, §0.2]`.

**§20 · Passt die Regel?**
> **Eine Regel passt, wenn jeder Buchstabe durch genau einen Block ersetzt werden kann — und
> derselbe Buchstabe überall durch denselben Block. Sonst passt sie nicht, auch wenn sie fast
> passt.**
>
> *A rule fits when every letter can be replaced by exactly one block, the same letter by the
> same block throughout. Otherwise it does not fit, however nearly it does.* — S.9–S.12, S.14,
> S.15

### The power and root laws

⚠️ **One rule per LAW, not per direction — and that is the same test as everywhere else.** A
direction earns its own rule when the classroom has its own word for it (ausmultiplizieren /
ausklammern, kürzen / erweitern). "Potenzgesetz" has one name and is read both ways, so one
sentence serves both, and the two directions are two ITEMS in E and C.

**§21 · Gleiche Basis**
> **Potenzen mit gleicher Basis werden multipliziert, indem man die Exponenten addiert:
> `a^m \cdot a^n = a^{m+n}`. Rückwärts gelesen zerlegt sie eine Potenz.**
>
> *Same base, multiplied: add the exponents; read backwards it splits one.* — C.20, E.26.
> ⚠️ Boundaries C.33 and C.34 belong with it: different bases do not collect, and a SUM of
> powers is not what this rule is about.

**§22 · Gleiche Basis, geteilt**
> **Beim Dividieren werden die Exponenten subtrahiert: `\frac{a^m}{a^n} = a^{m-n}`.**
>
> *Dividing: subtract the exponents.* — C.21. ⚠️ **Not a fourth law**: it is §21 after §4,
> and worth showing that way once.

**§23 · Potenz einer Potenz**
> **Bei einer Potenz einer Potenz werden die Exponenten multipliziert: `(a^m)^n = a^{mn}`.**
>
> *A power of a power: multiply the exponents.* — C.22

**§24 · Potenz eines Produkts**
> **Eine Potenz erreicht jeden FAKTOR: `(ab)^n = a^n b^n`, und ebenso Zähler und Nenner.**
>
> *A power reaches every factor — and numerator and denominator alike.* — E.22, E.23, C.23.
> ⚠️ Its limit is already written: §6.2. A power reaches every factor and NO summand.

**§25 · Wurzel ist Potenz**
> **`\sqrt[n]{a} = a^{1/n}`. Damit sind die Wurzelgesetze keine neuen Gesetze — es sind die
> Potenzgesetze mit einem Bruch im Exponenten.**
>
> *A root is a power with a fraction in the exponent, so the root laws are not new laws.*
> — R.23, E.24, E.25. **The most economical sentence in the set**: it retires four rules
> before they are written, and it is `ix.root`'s own argument.

**§26 · Wurzel und Potenz vertauschen**
> **`\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}` — erst wurzeln oder erst potenzieren, das
> Ergebnis ist dasselbe.**
>
> *Root first or power first: same answer.* — R.24. ⚠️ Its own reverse, which is why its item
> sits in R.

**§27 · Negativer Exponent**
> **`a^{-n} = \frac{1}{a^n}` — ein negativer Exponent ist der Kehrwert, kein negatives
> Ergebnis.**
>
> *A negative exponent means the reciprocal, not a negative result.* — R.22

**§28 · Exponent null**
> **`a^0 = 1` — nicht verordnet, sondern erzwungen: `a^m \cdot a^0 = a^m` `[§21]`, also muss
> `a^0` gleich `1` sein.**
>
> *Forced by §21 rather than decreed.* — N6.8

### The fraction laws

**§29 · Brüche multiplizieren**
> **Zähler mal Zähler, Nenner mal Nenner: `\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}`.
> Dafür braucht es KEINEN gemeinsamen Nenner.**
>
> *Numerator times numerator, denominator times denominator — no common denominator needed.*
> — C.24

**§30 · Brüche dividieren**
> **Durch einen Bruch teilen heisst mit seinem Kehrwert malnehmen — und zwar mit dem Kehrwert
> dessen, durch das man teilt.**
>
> *Dividing by a fraction is multiplying by its reciprocal — of the one you divide BY.* — E.27

**§31 · Brüche addieren**
> **Gleicher Nenner: Zähler addieren. Ungleicher Nenner: zuerst gleichnamig machen. Eine ganze
> Zahl ist ein Bruch mit Nenner `1`.**
>
> *Same denominator: add the numerators. Different: make them the same first.* — C.25–C.27.
> ⚠️ Beside §29 this is the pair worth teaching together: **multiplying asks nothing first,
> adding asks for the denominators** — that is the whole difference and it is why one feels
> easy and the other does not.

**§32 · Doppelbruch**
> **Im Doppelbruch entscheidet der HAUPTBRUCHSTRICH — der längere. `\frac{\frac{a}{b}}{c}` und
> `\frac{a}{\frac{b}{c}}` sind verschiedene Zahlen.**
>
> *In a double fraction the main bar — the longer one — decides.* — C.28, N7.6. ⚠️ Another
> place where the length of a stroke is the whole meaning `[§0.1]`.

### The binomial formulas

**§33 · Die binomischen Formeln**
> **`(a+b)^2 = a^2 + 2ab + b^2`, `(a-b)^2 = a^2 - 2ab + b^2`, `(a+b)(a-b) = a^2 - b^2`.
> Vorwärts gelesen multipliziert man aus, rückwärts gelesen faktorisiert man.**
>
> *Forwards they expand, backwards they factorise.* — E.28–E.30, C.29–C.31.
> ⚠️ The second is the first with `b := -b` `[S.1]` — one formula, not three.

**§34 · Das Paar finden**
> **`x^2 + px + q = (x+m)(x+n)`, wenn `m \cdot n = q` und `m + n = p`. Beide Bedingungen
> müssen gelten, sonst ist das Paar falsch.**
>
> *Both conditions or the pair is wrong.* — E.31, C.32

### What this draft shows

- **Forty-two rules, 186 items.** Today's pool is 63 rules — so the sizes were never far
  apart. What differs is the vocabulary: the pool talks about operations, these talk about
  blocks and types.
- **THE LADDER HELD.** This was the falsification test — R/E/C was invented on three basic
  laws and claimed to sort every move. Thirty-four power, root, fraction and binomial moves
  were added and **not one needed a new bucket or a special case.** Two that looked awkward
  resolved cleanly: `\left(\frac{a}{b}\right)^n` (container → container) is E once read through
  §4, and `\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}` is R — which the involutive audit had
  already said, from the other side, three days earlier.
- **Writing the rules first kept finding items.** Six more this round: `a^{m+n} = a^m a^n`
  (E.26), the root laws as instances rather than laws (E.24, E.25), `a^0 = 1` derived rather
  than decreed (N6.8), and the two power boundaries C.33/C.34 — *different bases do not
  collect*, and *a SUM of powers is not what the power laws are about* — which no item had
  covered and which is where half of `anti.exponent-arithmetic` lives.
- **§25 is the most economical sentence in the set.** *Eine Wurzel ist eine Potenz* retires the
  four root laws before they are written: they become instances of §21 and §24 with a fraction
  in the exponent. That is `ix.root`'s own argument, and it is the strongest case in the file
  for teaching the exponent form early.
- **Three rules are derivations and should be labelled as such**: §22 is §21 after §4, §23's
  root twin is §25, and §8.1 is §4 then §6.1. A student needs each as a sentence, but knowing
  which are load-bearing decides what survives when the sheet is one page.
- **§29 beside §31 is the pair worth teaching together**, and the ladder is what makes the
  contrast sayable: multiplying fractions asks nothing first, adding them asks for the
  denominators. Same bucket, different cost.
- **One rule per LAW, not per direction** — a direction earns its own rule only when the
  classroom has its own word for it (ausmultiplizieren / ausklammern, kürzen / erweitern).
  "Potenzgesetz" has one name, so §21 serves both directions and the two readings are two
  ITEMS. That is the same name-test that decides `reversible` in the old skill schema.

### Coverage

| section | items | rules |
|---------|-------|-------|
| V, N (45), P (20) | 65 | **§0.1, §0.2**, plus where §3, §5, §27, §28 land |
| **R** | 24 | **§1.1–§5**, §26, §27 |
| **E** | 31 | **§6.1–§11**, §21, §24, §25, §30, §33, §34 |
| **C** | 35 | **§12.1–§17.2**, §21–§24, §29, §31–§34 |
| **S** | 16 | **§18–§20** |

**Done as of 2026-08-02** — the power, root, fraction and binomial laws are in, and the ladder
took them without a special case. **What is left:** the strategy layer that S.13 opens (an
expression matches several rules — which to take), and the mistakes, which are not in this file
at all. The boundaries here are their skeleton: every `\neq` item is a mistake waiting to be
written from the other side.

---

## S · Substitution — an expression may stand where an atom stood

The first section that is not grammar. Everything above works on an expression as written; this
one changes what may be written.

> **Every rule in T is stated with atoms, and holds when any atom is replaced by any
> expression.** `a(b+c) = ab + ac` is not a fact about three letters. It settles
> `2x(y+3) = 2xy + 6x` and every other instance there will ever be.

**Why it is not grammar.** Using it needs three things at once: a parse (P — what would `a`
have to be?), a rule (T — which one has this shape?), and a choice (which of several readings
is worth taking). The first two are grammar; the third is strategy, and this is the first place
in the list where a student can be **correct and unhelpful**.

**What is genuinely new here is smaller than it looks — and it is not the bracket rule.** The
only question substitution raises is when the inserted expression needs brackets, and that is
`[V2]` unchanged: **keep the bracket exactly when removing it would change the reading.**
Nothing new to learn, one thing to apply in a new place. A student who has done N3.4, V2 and
§0.1 already owns every answer below.

⚠️ **And the difficulty is SYNTACTIC, not semantic.** Küchemann's levels of letter-use — letter
ignored, as object, as specific unknown, as generalised number, as variable, as parameter — are
all about what a letter *denotes*, and by that account this step needs nothing new: `2x+3`
denotes a number, so a generalised-number reading already licenses it. The wall is elsewhere.
It is seeing that the written form `2x+3` may occupy the position a single letter held, and
that doing so sometimes needs a bracket. A semantic account of letters cannot teach that; the
block vocabulary can, because it is the only one in which the bracket question has an answer.

### S1 · Putting an expression where an atom stood

- **S.1** `a(b+c) = ab+ac` with `a := 2x` — the rule is not about the letter, and this is the claim the whole section rests on `[§18]`
- **S.2** decide the bracket by asking whether removing it changes the reading ⇐ V2, N3.4 `[§19]`
- **S.3** `a := 2x+3` into `a(b+c)` → `(2x+3)(b+c)` — **brackets**: a sum inside a product `[§19]`
- **S.4** `a := 2x` into `a(b+c)` → `2x(b+c)` — **none**: a product inside a product changes nothing `[§19]`
- **S.5** `a := 2x` into `a^2` → `(2x)^2` — **brackets**: `2x^2` would be `2(x^2)` ⇐ N4.5 `[§19]`
- **S.6** `a := x+1` into `\frac{a}{b}` → `\frac{x+1}{b}` — **none**: the bar is already the bracket ⇐ §0.1 `[§19]`
- **S.7** `a := x+1` into `\sqrt{a}` → `\sqrt{x+1}` — **none**, and for the same reason ⇐ §0.2 `[§19]`
- **S.8** `a := b+c` into `-a` → `-(b+c)` — **brackets** `[§19]`
- **S.9** a letter that occurs twice is replaced **everywhere or nowhere**: `a \cdot a = a^2` with `a := 2x` gives `(2x)(2x) = (2x)^2` `[§20]`

### S2 · Reading a rule as a pattern — the other direction

- **S.10** `(2x+3)^2` is `(a+b)^2` with `a := 2x`, `b := 3` — the same claim read backwards, and the harder half: it must be **found** `[§20]`
- **S.11** report what each letter must be: `9x^2 - 4` against `a^2 - b^2` gives `a := 3x`, `b := 2` `[§20]`
- **S.12** check **every** slot, not the shape of two: `x^2 + 6x + 9` matches `(a+b)^2` with `a := x`, `b := 3`, because `2ab` really is `6x` and `b^2` really is `9` `[§20]`
- **S.13** one expression may match several rules; which to take is a **choice**, and the first thing in this file that grammar cannot settle

*Boundaries — when a shape nearly matches:*

- **S.14** `x^2 + 5x + 6` is not a perfect square: `b^2 = 6` and `2b = 5` cannot both hold. Nearly-matching is not matching `[§20]`
- **S.15** `a^2 + b^2` matches no binomial formula, however much it looks like one ⇐ C.18
- **S.16** what is inserted must be **one block** or become one: you cannot read `2x+3` as the `a` of `ab` and write `2x+3b` `[§19]`

### S3 · Strategy — WHICH rule, when several fit

⚠️ **A NOTE, NOT A SECTION. Nothing here is written yet.** Parked so it is not lost, because
S.13 is where the file stops being grammar and nothing after this point follows from the
sections above.

The grammar answers *may I?* — every rule in T is a permission, and a move is legal or it is
not. It never answers *should I?*, and from S.13 on that is the only question left:

- `x^2 - 4` matches **§33** (difference of squares) and also **§34** (find the pair). Both are
  correct; one is faster.
- `3(x+2) + 6` can be expanded first `[§6.1]` or factored first `[§13]`. Both are correct; one
  leads somewhere.
- `\frac{a^2 - b^2}{a - b}` cannot be cancelled until it is factored `[§17.1, §33]` — here the
  order is not taste, it is the difference between finishing and not.

What a strategy layer would have to hold, none of it decided:

1. **Goal states.** "Simplified" is undefined in this file. Every T rule is legal in both
   directions, so without a target *expand* and *collect* are equally valid forever. Probably
   the first thing to write, and probably the hardest.
2. **Ordering heuristics** — factor before cancelling; collect before expanding; look for a
   familiar shape before grinding.
3. **Recognition-first.** `rule.dominant-op-tools` in the old pool tried to say this (main
   operation → which family of tools) and carries a `todo` questioning whether it is a rule at
   all. It may be the seed of this section rather than a rule.
4. **Dead ends and backtracking** — the first move that is legal and useless.

⚠️ It is also the first place where a DRILL cannot mark by comparing to one right answer:
several answers are right and they differ in quality. That is a different kind of exercise from
everything the grammar produces, and worth knowing before the drill layer is designed.

## D · Milestones and drills

**The sections ARE the milestones, in their own order, and teaching runs the same sequence:**

> **N → P1 → P2 → R → E → C**, and S is not touched until all six are standing.

⚠️ **Verified against the `⇐` edges, not assumed.** Of every prerequisite written in this file,
exactly **one runs backwards**: **E.7** (`x(x+1) = x^2 + x`) needs **C.10** (`a \cdot a = a^2`),
because the first product has to become a power. So E.7 is the one item that cannot be taught
in its own milestone — defer it to C, or drop it as a compound. That is the same check
`validateSkillLinks` performs on the old layer's processes, and it wants to exist here too
before the milestones are built on.

### The drill that covers most of it: **equivalent or not**

Show two forms, ask whether they say the same thing. It fits every section because nearly every
item in this file IS an equation, and the distractors are already written — **the boundaries
and the `\neq` items are the distractor bank.**

| milestone | the question | distractors come from |
|---|---|---|
| **N** | is `3x` the same as `3 + x`? | N's own wrong readings; `mis.juxtaposition-as-plus` and its family |
| **P1** | what IS this — sum, difference, product, quotient, power, atom? | the tempting operator: `3(x+1)` looks like a sum, `2x^2` like a power |
| **P2** | which decomposition is right? | the old `chunking.json` right[] forms are literally the answer key |
| **R** | is this rearrangement legal? | R.15–R.21, the whole "not in a difference or quotient" family |
| **E** | is this expansion legal? | E.18–E.21: Freshman's dream, and never under the bar |
| **C** | is this collected correctly? | C.15–C.18, C.33–C.35: what does not collect |

### ⚠️ Five items the equivalence drill cannot hold

Not everything here is an equation. **N1.7** (`3a`, not `a3`), **N1.9** (the dot is what this
course writes), **N4.1**, **N4.1a**, **N4.1b** (the two tiers and the ranking) state a
convention or a procedure, and there is no second form to compare against. They need a
different question — "what does this say?", or a ranking to put in order — or they are teacher's
material and not drilled at all. Decide per item; do not stretch the format over them.

### The second drill type, which R/E/C earn: **what did that move DO?**

Show one legal step and ask: rearranged, expanded, or collected? It drills the ladder `[T]`
directly, it is markable against a single answer, and it is **the bridge to S**: a student who
can name what a move does can be asked *which do you want here* — and "do I want to open or
close?" is where choosing a rule starts. Worth building before S is written, not after.

⚠️ **And the limit, stated once so the drill layer is not designed around a false hope:**
from S.13 on, several answers are right and differ in quality. Everything above marks against
one answer; strategy does not. That is a different kind of exercise and probably a different
kind of screen.

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
   the fraction bar; the root has no counterpart — and they are the SAME SYMBOL, the vinculum,
   so one card should cover both. **The first one to write.**
7. **Reading a stacked fraction** (N7.5–N7.10): where a bar ends, which bar is the main one,
   that a fraction is one number, and that the bar's extent settles the reading upward as well
   as sideways.
8. **The two tiers of the order of operations** (N4.1, N4.1a, N4.1b). `ix.precedence` and
   `ix.power-precedence` give the ranking; nothing in the tower says the grouping symbols are
   settled FIRST, or that `\cdot`, `/` and `:` share one rung while the stacked bar does not.
9. **The power binds to the closest BLOCK** (N4.5a) — the refinement that makes `-2a^2` and
   `\left(\frac{a}{b}\right)^2` one rule instead of two.
10. **`a^{b^c}` reads top-down** (N6.7).

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
6. ⚠️ **OPEN, awaiting review — R.13 no longer classifies as R.** Under the ladder,
   `\frac{a}{b} = a \cdot \frac{1}{b}` is container(1) → product(2), which is UP, so expanding.
   Note the asymmetry it exposes: `a - b = a + (-b)` stays put because difference and sum share
   a rung, while quotient and product do not — so §3 and §4 are not the same trick after all,
   and only one of them opens the expression. Two ways out: **(a)** move R.13 into E and add
   the missing C twin `a \cdot \frac{1}{b} = \frac{a}{b}` (folding a product back into a
   fraction, which is not in the list — the fifth item found by rule-first); **(b)** give the
   conversions their own class outside R/E/C, since both change what the expression IS rather
   than how much of it there is. Leaning (a): three buckets, one test.
7. **Does N keep both directions of an identity, or only the meaning?** Decided as: N states
   what the notation means, T holds the two moves (E.12/C.10, E.13/C.11), `⇐` pointing back.
   The alternative — N owns the identity and T cites it without items of its own — would leave
   C.12 (`abca = a^2bc`) depending on something no item performs.
6. **The reverse readings hold.** C.4/C.5 (pull out) are separate items from E.1/E.4
   (multiply in), by the rule that a backward reading with its own classroom name is its own
   skill — and here the two directions now land in different BUCKETS, which is the strongest
   evidence yet that the rule is right.
