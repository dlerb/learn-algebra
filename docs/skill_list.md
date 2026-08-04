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
$3x = 3 \cdot x$. Here the sections name the content; fluency is something a drill measures.

**The test for N — applied strictly:** a notation item says *this mark on the page means this*.
The moment a line needs a law to be true, it is a move and it leaves. Seven lines left on that
test (see the end).

**Card marks.** `[ix.…]` names the tower card that already carries the convention.
**`[no card]` means the tower does not say it yet** — those are the candidates for new `ix.`
cards, collected at the bottom.

---

## V · The words this file uses

### Why split an expression at all

Everything below is machinery for one purpose, and it is worth saying before the machinery:

> **A block is an island. You may work on it on its own, and whatever it becomes goes back in
> the same place — the REST of the expression neither notices nor changes. But check its walls
> on the way back in.**

That is the permission the whole file rests on. It is why $3(x+1) - 2(x-1)$ is workable at all:
you are never facing the whole thing, only one island at a time.

⚠️ **The second sentence is not a hedge, and leaving it off makes the first one FALSE at the
boundary.** Rewriting a block can change its top operator, and a block that no longer outranks
its surroundings has to be walled. Take $2x - 2(x+1)$: the island $2(x+1)$ expands to $2x+2$
quite correctly, but put back bare it reads $(2x-2x)+2$. It was a product and it is now a sum,
and a sum in that position is outbid `[§0.4]`, so it needs a wall it did not need a moment ago —
$2x - (2x+2)$.

⚠️ **And that question is not asked anywhere else in this file.** §0.4 and S.2 both ask whether
an INSERTED expression needs walls; nothing asks it after a REWRITE. Same question, same
criterion, different trigger — and the trigger is the half that is not automatic. It is
probably a rule aimed at the outside of a block rather than at its inside. See the brainstorm
at the foot of this file.

⚠️ **And it is S read backwards.** S.1 says a rule stated over letters holds when a letter is
replaced by any expression. The island principle says a part may be rewritten in place. **Same
fact, two directions** — which is why S is not a late extra bolted onto the grammar, but the
thing V has been building towards since its first line.

### The words

**Two different questions, and the words must not be mixed.** *What an expression IS* is
settled by what sits at its top `[V1, V2]`. *What a part DOES* is settled by the split it came
from. An expression can be both at once: $\frac{a}{b}$ in $\frac{a}{b} + c$ **is** a container
and **acts as** a summand.

| word | German | what it is |
|------|--------|-----------|
| **expression** | Term | anything written: $a$, $3x$, $3x + 2y$ are all expressions. Scale-free — an expression is made of expressions |
| **block** | Block, Baustein | ⚠️ a ROLE, not a kind: one of the parts you get when you SPLIT an expression `[V1]`. Always a block *of* something. A block is itself an expression, and you move it without opening it |
| **summand** | Summand | a block of a sum. $3x + 2y$ has two |
| **factor** | Faktor | a block of a product. $3xy$ has three |
| **container** | Container | an expression with WALLS and something inside — a bracket, a fraction, a root, a power `[V1]`. Wherever it appears as a part, it appears as exactly ONE block |
| **slot** | Platz | a place INSIDE a container — numerator and denominator, base and exponent `[V2]`. A slot holds a block |
| **atom** | Atom | an expression with **nothing inside**: ONE numeral or ONE letter. $7$ and $x$ are atoms; $3x$ is not (it splits into two), $a^2$ is not (a container). **It is where descending stops** |

⚠️ **"Is $X$ a block?" is a malformed question**, and asking it is what muddled this section
for a day. $2x$ SPLITS into two blocks, always. $2x$ APPEARS AS one block of $3x + 2x$. Both
are true and they are different questions; only the second is about context.

⚠️ **Blocks nest, and the counting only ever looks at ONE level.** $(ab)^n$ is **one** block —
a power — whose base is a block containing **two**. Saying "one block" is never a claim that
there is nothing inside; it is a claim about the top. You reach the rest by descending, which
is step 4 of the test.

⚠️ **THE MINUS: one glyph, and its POSITION says which job it is doing.** This is N5.1 made
load-bearing, and it is the whole answer to "how many blocks has $3x - 2y$":

> **A minus with something to its left is a SEAM. A minus with nothing to its left belongs to
> the block that follows it.**

- $3x - 2y$ is a **difference**: the minus separates, and the blocks are $3x$ and $2y$ — which
  is what a student reads off the page, and it is right `[P.14]`.
- $-3x + 2y$ is a **sum**: the leading minus has nothing to its left, so it is part of the
  first block, $-3x$ `[P.7]`.
- $a + (-b)$ is a **sum** whose second block is $(-b)$.

⚠️ **$3x - 2y$ and $3x + (-2y)$ are the same value in two spellings, and their blocks differ.**
Nothing is absorbed until §3 is actually applied — **§3 is a MOVE, not a reading** `[E.18]`.
Same discipline the ladder already enforces one level up: *count as written, do not convert and
then count* `[T]`.

⚠️ **A minus is never part of an ATOM.** Descend into $-a$ and it is a product of two factors,
$(-1)$ and $a$ `[N5.4]`. So **$-3$ is not an atom**: an atom is ONE numeral or ONE letter, the
atom inside $-3$ is $3$, and the minus is the block wrapping it. That follows from this
project's notation reckoning — one unary minus, no sign living inside a numeral — and it is
worth saying out loud, because a student will call $-3$ a number and be right. It is a number;
it is not an atom.

### V1 · What sits at the top — the four shapes

**An expression is classified by the shape of its topmost operator**, and there are only four.
This is the axis V2 and V3 were both circling: V2 names the TYPE, V3 names the MARK, and this
names the SHAPE that decides how both behave.

| shape | example | splits into blocks? | ever needs brackets? |
|-------|---------|--------------------|----------------------|
| **nothing at all** | $x$, $7$ | no — nothing inside | **never** — an atom |
| **circumfix** — walls around it | $(a+b)$, $\frac{a}{b}$, $\sqrt{a}$, $x^2$ | no — open it first | **never** — a container |
| **prefix** — before one operand | $-a$, $-3$ | no — but it HAS a top operator | ⚠️ **sometimes** |
| **infix** — a seam between operands | $a+b$, $a-b$, $2x$, $a : b$ | **yes** — that is the split | sometimes |

⚠️ **The names are not ours.** *Infix* and *prefix* are standard; the walling shape is
**circumfix** in linguistics and **matchfix** in Mathematica. The category is open — $|x|$ would
join it if absolute value ever arrives.

**This is what "resistant to position" actually rests on**, and it is not walls as such:

> **An expression never needs brackets exactly when it has no top operator that could be
> outbid** — either nothing at all (atom), or walls, which bind maximally by construction.

⚠️ **So $-a$ is NOT a container**, and the shape column says why: prefix, no walls. Its operator
binds looser than a power, so it can be outbid — which is precisely why $(-b)^2$ needs its
brackets while $\sqrt{b}^2$ does not. Nothing splits $-a$, and it is still not safe to move.

⚠️ **And the power is a HYBRID, which is why it is awkward everywhere in this file.** The
superscript position is circumfix around the EXPONENT only; on the base side there is no wall
at all, and what bounds it is the closest-block rule `[N4.5, V3]`. Circumfix on one side, not
the other. Every power oddity in N4 traces back to this one asymmetry.

### V2 · What an expression IS — the five types

Read off the page, and load-bearing rather than vocabulary for its own sake: **every rule
below is conditioned on the type**, so naming it is the first move and not a formality.

| type | German | separated by | its parts are called | and they are |
|------|--------|--------------|----------------------|--------------|
| **sum** | Summe | $+$ | summands (Summanden) | blocks |
| **difference** | Differenz | $-$ | the blocks either side of the minus — summands only after §3 `[E.18]` | blocks |
| **product** | Produkt | $\cdot$ or nothing at all | factors (Faktoren) | blocks |
| **quotient** | Quotient | the bar, or $:$ | numerator and denominator (Zähler, Nenner) | **slots** |
| **power** | Potenz | *nothing — the position is the operator* | base and exponent (Basis, Exponent) | **slots** |

⚠️ **"Part" is two different things, and both words are needed.** A sum or a product separates
into any number of interchangeable parts, walked along a seam: those are **blocks**, and you
COUNT them. A quotient or a power has exactly two parts in fixed, non-interchangeable roles:
those are **slots**, and you NAME them — which is what §5 exists to say ($2^3 \neq 3^2$). A
slot is filled BY a block: the base of $(ab)^n$ is the block $(ab)$, standing in the base slot.
P.17 and N6.3 already say "slot"; this table used to say "blocks" and was the odd one out.

⚠️ **And it is forced, not chosen.** If base and exponent counted as blocks of the expression
they sit in, $(ab)^n$ would count TWO and the ladder's "container = one block" collapses `[T]`.

⚠️ **The root is missing from this table, and the file uses it as a sixth type** — P.10 answers
"a root", and the ladder says *container (quotient, power, root)*. It is not a sixth type: a
root IS a power, $\sqrt[n]{a} = a^{1/n}$ `[§25]`, so it belongs in the power row and appears as
its own written form in `[V5]`. ⚠️ *Author to confirm — the alternative is to admit six types
and say so in this table.*

**How the type is found: brackets first `[N3.1]`, then binding strength `[N4.1]`.** The
operator that binds LOOSEST is the seam; the ones that bind tighter are the glue inside the
blocks. So in $a \cdot b + c$ the $\cdot$ builds a block and the $+$ separates — the expression
**is a sum**, of a product and a letter.

⚠️ **Why the loosest and not the tightest.** "Which operator is the main one" invites the wrong
answer, because $\cdot$ grabs its operands first and so feels dominant. Name the RESULT instead
of ranking the operators: $a \cdot b + c$ *is a sum*. There is no importance claim in that, and
it is the sentence every rule keys off. The tightest-binding operator is the one done FIRST and
lives deepest inside; the loosest is done LAST and is what the expression is.

⚠️ **Two of the five types are the other two in disguise, and this is the most useful thing in
V.** A difference is a sum whose blocks may carry a minus `[def.sub]`, and a quotient is a
product whose blocks may be reciprocals `[def.div]`. Neither conversion is free — each is a
move — but once made, the sum-and-product rules apply and nothing else has to be learned. That
is why $a - b$ can be reordered at all, and it is the same trick twice, one level apart.

⚠️ **And it really is the SAME trick, which this file doubted for a day.** Counted as written,
both conversions OPEN the expression — $b \to (-b)$ turns an atom into a product, and
$\frac{a}{b} \to a \cdot \frac{1}{b}$ turns one container into two factors. So both are
expanding `[E.18, E.19]`, both have a collecting twin `[C.15, C.17]`, and §3 and §4 are
symmetric after all. The asymmetry once recorded here came from counting one of them after
converting and the other as written.

**Power is the odd one out and stays odd**: no symbol separates its two blocks, the position
does, and the two blocks are not interchangeable in any way. $2^3 \neq 3^2$.

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

### V3 · Separating operators and grouping symbols

Not every operator separates. This is the distinction the counting rests on, and it was
missing until $(ab)^n$ forced it out:

| | which | what they do | blocks at the top |
|---|---|---|---|
| **separating operators** | $+$ $-$ $\cdot$ (and $/$ $:$ on a line) | sit BETWEEN blocks of the same kind, any number of them — you can walk along the seam | as many as there are: summands, factors |
| **grouping symbols** | written brackets · the fraction bar · the radical · the superscript position | group what is written INSIDE them, by geometry. No seam, and the two parts need not be the same kind of thing | **one** — the whole thing is a single block |

So $(ab)^n$ is **one block**: nothing separates at the top. $a^n \cdot b^n$ is **two blocks**:
the $\cdot$ is a seam and the powers are the glue inside. Likewise
$\frac{a}{b} \cdot \frac{c}{d}$ is two blocks and $\frac{ac}{bd}$ is one.

**A grouping symbol's parts still exist — one level down.** A quotient has a numerator and a
denominator `[P.16]`, a power has a base and an exponent `[P.17]`. They are simply not blocks
of the expression they sit in; you reach them by descending, not by counting.

**Three spellings of one quotient, and they do NOT have the same blocks:**

| written | blocks | why |
|---|---|---|
| $\frac{a}{b}$ | **one** | the bar is a grouping symbol. NOT an atom — inside are two SLOTS, numerator and denominator, each holding an atom here |
| $a : b$ | **two**, $a$ and $b$ | the colon is a separating operator, so it is a seam like any other |
| $a \cdot \frac{1}{b}$ | **two**, $a$ and $\frac{1}{b}$ | a product; the second block is a container holding two atoms |

Same value, three forms, one block or two. **This is exactly why §4 is a move and not a
reading** — going from the first row to the third opens the expression `[E.19]` — and it is the
minus story one level up `[V2]`.

**And the grouping symbol is PART OF the block it makes.** The block in $3(x+1)$ is $(x+1)$,
not $x+1$ — a block is a piece of written notation you move without opening, and $x+1$ moved
on its own does not survive the trip. The same for the bar and the radical: $\frac{a}{b}$ is
the block, bar included. ⚠️ **But only a bracket that SURVIVES belongs to anything.** In
$a + (b+c)$ the bracket is flattened `[V4]` and is part of nothing at all. So the counting
decides which brackets exist, and the survivors join their block.

**A CONTAINER IS A BLOCK WITH WALLS.**

That is the whole idea, and the walls are what make it **resistant to position**. Said
carefully, because "is one block" is the malformed phrasing V warns about: $2x$ **splits** into
two blocks and merely *appears as* one block of the sum it sits in, while $\frac{a}{b}$
**appears as exactly one block in every context there is** — nothing splits it until you open
it. That difference is the walls.

| container | its walls | chambers |
|---|---|---|
| **bracket** $(x+1)$ | the two marks | one, unnamed |
| **fraction** $\frac{a}{b}$ | the two ends of the stroke | **two** — the bar is wall AND divider |
| **root** $\sqrt{a+b}$ | the hook opens, the right end of the bar closes | one, under a roof |
| **power** $b^2$ | ⚠️ **one wall only** — see below | one, the exponent |

The chambers are the slots `[V2]`. A bracket has one and it has no name, which is exactly why a
bracket adds no meaning and why a second one around it adds no reading `[N3.4]`.

⚠️ **The bracket is the container that creates no TYPE.** A bar makes a quotient, a radical
makes a root, the superscript makes a power — the bracket makes nothing new, it only walls off
what is already there. That is why the ladder's container rung lists quotient, power and root
and not the bracket `[T]`, and it is precisely what the open V4 question turns on.

⚠️ **The power has one wall, and this is where the model has to be exact.** The exponent is
walled by being raised. The BASE end has no mark at all — what bounds it is the binding rule,
*the closest block* `[N4.5]`. Three cases, one rule:

- **nothing is grouped** → the closest block is an atom: $2x^3 = 2 \cdot (x^3)$, and $-2a^2 =
  -2(a^2)$. The $2$ is outside because $x$ is already a whole block on its own `[N4.5a]`
- **a grouping symbol has already closed something** → that whole container is the closest
  block: $\left(\frac{a}{b}\right)^2$ squares the fraction, not the numerator `[N4.5a]`
- **you want more than the closest block** → **a bracket is how you build the missing wall
  yourself**: $(ab)^2$ `[N4.6]`

So N4.6 is not a separate rule to learn. A bracket supplies the wall the power hasn't got.

⚠️ **Walls only protect you if they are drawn honestly.** A bar drawn too long or too short
moves the wall, and then it is a different container — §0.1's *genau zeichnen*, and the reason
the length of a stroke is the meaning `[§0.1, §0.2]`.

**"Grouping symbol" is the standard term, not ours.** English curricula patch PEMDAS into
**G**EMDAS for exactly this reason and list the fraction bar with the brackets; the German rule
carries the same rider — *die Seiten eines Bruchstrichs und der Strich des Wurzelzeichens
werden wie Klammern behandelt*.

⚠️ **But "der Bruchstrich ist eine Klammer" is too loose to say to a class, and it was in this
file until 2026-08-02.** A bracket is a PAIR of marks: one opens, one closes, and the region
between them is the block. A bar is one stroke. What plays the part of the two marks is:

> **Wo der Strich anfängt und wo er aufhört — das ist die Klammer.**

That is not a metaphor. $a - \overline{b+c}$ delimited exactly the region a pair would, and the
delimiters were the two ends of the stroke. Two consequences worth saying out loud:

- **Length is meaning.** With $($ and $)$ the delimiters are glyphs you cannot draw sloppily.
  With a bar they are the ends of one stroke, so a bar drawn too short or too long says
  something else `[§0.1, §0.2]`.
- **A fraction bar is two brackets in one stroke** — it delimits the region above AND the
  region below, which no bracket pair does. The root is the ordinary case: the hook opens and
  the right end of the bar closes.

⚠️ **And the bar is not LIKE a bracket, it WAS one.** The horizontal line has a name — the
**vinculum** — and before parentheses were adopted in the eighteenth century it *was* the
bracketing device: $a - \overline{b + c}$ meant $a - (b+c)$. Parentheses replaced it almost
everywhere, and it survives in exactly the two places this file keeps arguing about, over the
radicand and between numerator and denominator. So N7.2's "a bracket you do not write" is not
an analogy — it is the older bracket that never got replaced there. Which is also why the
fraction bar and the root bar behave identically `[N6.5, N7.2]`: they are the same symbol.

⚠️ **Why the bar is one block, stated on the right ground.** NOT because $:$ binds tighter than
$\cdot$ — there is no such rung, they share one and are read left to right `[N4.1b]`. Because
the bar is a grouping symbol. And that settles the apparent clash with V4 rather than creating
one: the bar is a bracket that can never be removed, so V4's rule counts it with no special
case.

### V4 · Counting through a bracket


$a + (b + c)$ is **two** blocks, $a$ and $(b+c)$. There is nothing to decide and nothing to
test first:

> **Split at the loosest-binding top operator. A bracket is a wall, so nothing inside it is
> ever a block of what is outside.**

⚠️ **THIS REVERSES THE RULE THIS SECTION CARRIED UNTIL 2026-08-03**, which read *"a bracket is
flattened when removing it changes nothing, and counted when it does not"* — and gave three
summands here. The reversal is worth its own paragraph, below, because the old rule was not
silly; it bought something real.

| expression | blocks | why |
|---|---|---|
| $a + (b + c)$ | **2**: $a$, $(b+c)$ | the bracket is a wall `[V1]`; what is inside is one level down |
| $a - (b + c)$ | **2**: $a$, $-(b+c)$ | same count — the minus joins the block, it does not change the split |
| $a \cdot (b \cdot c)$ | **2**: $a$, $(b \cdot c)$ | a wall is a wall whatever it groups |
| $a + b + c$ | **3** | no walls at all, so three blocks — and this is a DIFFERENT expression from the first row |
| $a \cdot (b + c)$ | **2** factors | unchanged by the reversal |

**Why the old rule existed, and what it cost.** It was there to make dropping a harmless
bracket come out as *rearranging*: $a + (b+c) = a+b+c$ counted 3 against 3, so R. But it worked
by **removing a bracket first and counting afterwards** — normalise, then count — which is
exactly the *convert-then-count* error the ladder was corrected for twice, on §4 and then on §3
`[T]`. This was the last place it survived.

**What the reversal buys.**

- **One rule instead of two.** Counting no longer needs a hypothetical (*would removing this
  bracket change the reading?*) run before you are allowed to count. Find the loosest operator,
  count the seams. A first-year student can do that; the hypothetical is a mini-proof.
- ***Klammern auflösen* stops being split across two buckets.** Under the old rule
  $a + (b+c) = a+b+c$ was R while $a - (b+c) = a-b-c$ was E — one classroom act, two answers.
  Now both are E `[E.20, E.12]`, and both have a collecting twin: putting a bracket in
  `[C.18]`.
- **The context-dependence goes.** $(x+1)$ used to be one block as a factor and two standing
  alone. Now it is one block always, which is what "container" already claimed `[V1]`.

**What it costs, stated so nobody re-litigates it.** $a + (b+c) = a + b + c$ is now
**expanding** — 2 blocks against 3. That reads oddly beside *ausmultiplizieren* until you say
it as *Klammer auflösen*, which is what it is.

**What the walls guarantee.** No block of a sum is itself a bare sum, and no block of a product
is itself a bare product — not because anything flattens, but because **a bare sum inside a sum
has nothing separating it from the outside**, so its summands simply belong to the outer sum.
To put a sum inside a sum you must wall it. Worth saying to a class: *wenn du zerlegt hast,
ist kein Summand mehr eine Summe — ausser er steht in Klammern.*

⚠️ **And that is close to an argument for why brackets exist at all**: they are the only way to
make a sum a block of a sum. The old rule obscured this by throwing such brackets away.

### V5 · The written forms — what can stand beside what

V2 says what an expression IS; this says what it LOOKS like, which is the question `[§0.3]`
has to answer before it can range over anything. **Nothing here is invented**: it is V's two
atoms plus V3's grouping symbols, collected in one place for the first time.

| form | German | example | it is |
|------|--------|---------|-------|
| **numeral** | Zahl | $3$, $23$ | an atom — however many digits |
| **letter** | Buchstabe | $a$, $x$ | an atom |
| **bracket** | Klammer | $(x+1)$ | a grouping symbol |
| **fraction** | Bruch | $\frac{c}{d}$ | a grouping symbol |
| **root** | Wurzel | $\sqrt{3}$ | a grouping symbol |
| **power** | Potenz | $b^2$ | a grouping symbol — the superscript position |

**Why exactly these six.** A block may stand beside another without a dot when it is already
visually self-contained: an atom, or something a grouping symbol has closed. A sum, a
difference or an inline $a : b$ is not, and has to be bracketed first — which is precedence
`[N4.1]`, not a new demand. So §0.3's tail, *make clear what a block is*, is derivable.

**Six forms, four behaviours — and every exception is about numerals:**

| left · right | what it reads as |
|---|---|
| numeral · numeral | ONE number — place value, never a product `[N1.2]` |
| numeral · fraction | the mixed number — **refused by this course** `[N1.7]` |
| letter · numeral | a NAME, not a product `[N1.4]` |
| numeral to the RIGHT of anything else | a product, but never written — the numeral goes in front `[N1.3, N1.5]` |
| everything else | a product, written freely `[N1.1]` |

So **numeral** is special in every direction, **letter** only as the thing a name is built on,
**fraction** only when a numeral precedes it, and **bracket · root · power** are plain: they
multiply either way and carry no exception at all. That is the whole type system this file
needs, and it is what lets §0.3 state its limits as one sentence about numerals rather than a
list of unrelated cases.

⚠️ **This is the section to attack first.** Everything downstream counts blocks, and the file
taught the counting long before it named the forms. That order is itself the finding: the forms
are hardly ever made explicit to a class, and then the difficulties turn up exactly where this
table is.

---

## Rules in student language — first draft

**Written from scratch; the existing pool is deliberately not consulted.** One sentence per
permission, **conditioned on the type** `[V2]` and stated over blocks:

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

### Reading and writing

⚠️ **Numbered from zero so that the move rules keep their numbers.** These come FIRST when the
set is re-based: the notation rules precede the moves, as N precedes T.

⚠️ **"and writing" is not decoration.** Every rule in this section ends in a demand about how
something is DRAWN or written — *genau zeichnen*, the numeral in front — and that half cannot
be drilled by an app that takes clicks and typed answers. §0 is where the production demands
live, so the heading says so.

**§0.1 · Der Bruchstrich** `#fraction-bar-groups`
> **Alles, was über und unter dem Bruchstrich steht, gehört zum Bruch und bildet einen Block.
> Also genau lesen — und genau zeichnen.**
>
> *Everything above and below the fraction bar belongs to the fraction and forms one block. So
> read it exactly — and draw it exactly.* — N7.2, N7.3, N7.7, N7.8; read by P.9

**§0.2 · Der Wurzelstrich** `#root-bar-groups`
> **Alles, was unter dem waagrechten Strich der Wurzel steht, gehört unter die Wurzel und
> bildet einen Block. Also genau lesen — und genau zeichnen.**
>
> *Everything under the horizontal bar of the root belongs under the root and forms one block.
> So read it exactly — and draw it exactly.* — N6.5, N6.6, P.10

⚠️ **Deliberately the same sentence twice**, because it is the same symbol twice — the vinculum
`[V3]`. And the tail is not decoration: *wo der Strich anfängt und wo er aufhört, ist die
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

**§0.3 · Der unsichtbare Punkt** `#the-invisible-dot`
> **Zwei Blöcke nebeneinander bedeuten mal. Dabei muss klar sein, was ein Block ist —
> nötigenfalls mit Klammern: $ab^2$ ist $a \cdot b^2$, nicht $(ab)^2$.**
>
> **Die Ausnahmen betreffen alle die Zahlen:** zwei Zahlen nebeneinander sind EINE Zahl
> ($23$ ist nicht $2 \cdot 3$); eine Zahl nach einem Buchstaben ist ein Name ($a3$); und die
> Zahl steht immer vorn ($3a$ und $2\sqrt{3}$, nie $\sqrt{3}2$). Eine Zahl vor einem Bruch
> wäre eine gemischte Zahl — **die schreiben wir nicht.**
>
> *Two blocks side by side mean times, and it must be clear what a block is. The exceptions are
> all about numerals.* — N1.1–N1.7. The six forms it ranges over are `[V5]`, and the name is
> the one `rule.juxtaposition` already carries in the pool rather than a new coinage.

**§0.4 · Zwei Sorten Klammern** `#two-kinds-of-required-bracket`
> **Manche Klammern muss man setzen, weil der Term sonst etwas ANDERES bedeutet. Andere setzt
> man, weil man zwei Rechenzeichen nicht nebeneinander schreibt — der Term wäre auch ohne sie
> eindeutig.**
>
> **Nötig:** $(-b)^2$ — ohne Klammer heisst $-b^2$ etwas anderes `[N4.7]`.
> **Nur Schreibweise:** $1 - (-3)$ — $1--3$ wäre lesbar, aber so schreibt man nicht `[N5.2]`.
>
> *Some brackets are required because the reading changes without them; others because we do
> not write two operation signs side by side.* — N4.7, N5.2, N5.3, N5.5

⚠️ **The distinction is binding strength, and only the first kind is grammar.** A block keeps
its wall exactly where it lands somewhere that binds TIGHTER than its own top operator `[V1]`.
The unary minus binds looser than a power, so $-b$ as a base must be walled or it says
something else. After a binary minus nothing competes, so $1--3$ is unambiguous — parsers and
calculators accept it — and the bracket is legibility.

⚠️ **Why it earns a rule of its own.** A student told "you must bracket" in both cases learns
one demand where there are two, and cannot tell which one to relax when notation gets dense.
The first kind can be drilled against a right answer; the second is a writing habit, which is
the same production/reading split §0.1's tail already names — the third instance of it, and the
reason this section is called *Lesen und Schreiben*.

⚠️ **The `.1`/`.2` convention collides in this section.** Everywhere else `.1` is a permission
and `.2` its limit; in §0 the second digit already names WHICH grouping symbol. So §0.3's
exceptions ride inside the rule instead of becoming a §0.3.2. Worth fixing when the set is
re-based — the pairing is real structure and this is the one place it cannot be written down.

### Rearranging

**§1.1 · Reihenfolge** `#order-is-free`
> **In einer Summe dürfen die Summanden in beliebiger Reihenfolge stehen. In einem Produkt
> dürfen die Faktoren in beliebiger Reihenfolge stehen.**
>
> *In a sum the summands may stand in any order; in a product, the factors.* — R.1–R.5, R.9,
> and C.16 where the swap is spent

**§1.2 · … aber nicht in einer Differenz oder einem Quotienten** `#order-is-not-free-in-a-difference`
> **Solange ein Minus oder ein Bruchstrich trennt, darf die Reihenfolge nicht geändert werden:
> $a - b \neq b - a$, $\frac{a}{b} \neq \frac{b}{a}$.**
>
> *While a minus or a bar still separates, the order may not be changed.* — R.10–R.13

**§2.1 · Klammern** `#grouping-is-free`
> **In einer Summe dürfen Klammern, die nur Summanden zusammenfassen, weggelassen oder anders
> gesetzt werden. In einem Produkt gilt dasselbe für Faktoren.**
>
> *In a sum, brackets that only group summands may be dropped or set differently; in a product
> the same holds for factors.* — R.6, R.7, R.8; and E.20, E.21 with C.18, C.19, which is
> where dropping and setting a bracket now live `[V4]`

**§2.2 · … aber nicht in einer Differenz oder einem Quotienten** `#grouping-is-not-free-in-a-difference`
> **$(a - b) - c \neq a - (b - c)$, $(a : b) : c \neq a : (b : c)$.**
>
> *Grouping may not be moved while a minus or a bar separates.* — R.14–R.16

**§3 · Das Minus gehört zum Block** *(the pivot — the highest-value sentence here)* `#minus-belongs-to-its-block`
> **Ein Minus gehört zu dem Block, der ihm folgt. Danach ist die Differenz eine Summe, und
> §1.1 und §2.1 gelten.**
>
> *A minus belongs to the block that follows it; the difference is then a sum.* — E.18, C.15,
> C.16; licenses N5.2 and P.14a. It is what lets §1.1 reach $a - b + c$ at all, and it is why
> §1.2 exists: **a student who absorbs the minus first never meets the boundary.**
>
> ⚠️ **This rule is a MOVE, and the sentence has to be read that way.** *Gehört zu* describes
> what is true AFTER it is applied, not what the page already says: until then $3x - 2y$ is a
> difference with blocks $3x$ and $2y$ `[P.14]`. The §1.2 line above is the proof — a boundary
> that only exists before the absorption needs the un-absorbed reading to be a real state.

**§4 · Der Bruchstrich ebenso** *(the same trick one level up)* `#dividing-is-multiplying-by-the-reciprocal`
> **Durch $b$ teilen heisst mit $\frac{1}{b}$ malnehmen. Danach ist der Quotient ein Produkt,
> und §1.1 und §2.1 gelten.**
>
> *Dividing by $b$ is multiplying by $1/b$; the quotient is then a product.* — E.19, C.17.
> ⚠️ **Writing this rule is what found E.19** — the item did not exist until the rule needed
> one, and applying the ladder to it later found C.17 the same way.

**§5 · Potenz** `#power-slots-do-not-swap`
> **In einer Potenz darf nichts vertauscht werden: Basis und Exponent sind verschiedene
> Rollen. $2^3 \neq 3^2$.**
>
> *In a power nothing may be swapped: base and exponent are different roles.* — licenses N6.3
> and P.17, and **no T item at all**: in a power there is no move to make, only a reading to
> get right. A rule may exist purely to forbid.

### Expanding

**§6.1 · Ausmultiplizieren** `#a-factor-reaches-every-summand`
> **Ist ein Block eines Produkts eine Summe, so wird der andere Block mit JEDEM Summanden
> einzeln multipliziert.**
>
> *If one block of a product is a sum, the other multiplies EVERY summand.* — E.1–E.7. The word
> carrying the weight is *jedem*. Reversed by §13.

**§6.2 · … und nur ein Faktor tut das** `#nothing-else-reaches-in`
> **Nur ein Faktor erreicht jeden Summanden. Eine Potenz und eine Wurzel tun das nicht:
> $(a+b)^2 \neq a^2 + b^2$, $\sqrt{a+b} \neq \sqrt{a} + \sqrt{b}$.**
>
> *Only a factor reaches every summand; a power and a root do not.* — E.23–E.25

**§7 · Jeder mit jedem** `#both-sums-multiply-out`
> **Sind beide Blöcke Summen, so wird jeder Summand des einen mit jedem Summanden des anderen
> multipliziert.**
>
> *If both blocks are sums, every summand of the one multiplies every summand of the other.*
> — E.8. It is §6.1 twice, but it has its own classroom name and its own count ("vier
> Produkte"), so it is its own sentence.

**§8.1 · Summe über dem Bruchstrich** `#a-sum-over-the-bar-splits`
> **Ist der Zähler eine Summe, darf jeder Summand einzeln über den Nenner geschrieben werden.**
>
> *If the numerator is a sum, each summand may be written over the denominator on its own.*
> — E.9. ⚠️ **Derivable: §4 then §6.1** — dividing by $c$ is multiplying by $\frac{1}{c}$, and
> then the factor reaches every summand.

**§8.2 · … aber nie unter dem Bruchstrich** `#a-sum-under-the-bar-does-not-split`
> **Eine Summe im NENNER wird nicht zerlegt: $\frac{c}{a+b} \neq \frac{c}{a} + \frac{c}{b}$.**
>
> *A sum in the denominator does not split.* — E.22

**§9 · Minus vor der Klammer** `#a-leading-minus-is-a-factor`
> **Ein Minus vor einer Klammer ist der Faktor $(-1)$. Multipliziert man aus, wird aus jedem
> Summanden seine Gegenzahl.**
>
> *A minus in front of a bracket is the factor $(-1)$; expanding replaces every summand by its
> opposite.* — E.6, E.10–E.13. Stated with *Gegenzahl* rather than "sign", because a numeral
> has no sign inside it: there is one unary minus and it belongs to a block `[§3]`.

**§10 · Potenz auffalten** `#a-power-may-be-unfolded`
> **Eine Potenz darf in ihre Faktoren aufgefaltet werden — ganz oder teilweise:
> $a^3 = a \cdot a \cdot a = a \cdot a^2$.**
>
> *A power may be unfolded into its factors, wholly or partly.* — E.14, E.15. Reversed by §15.

**§11 · Vielfaches auffalten** `#a-multiple-may-be-unfolded`
> **Ein Vielfaches darf in Summanden aufgefaltet werden — ganz oder teilweise:
> $3a = a + a + a = a + 2a$.**
>
> *A multiple may be unfolded into summands, wholly or partly.* — E.16, E.17. The exact twin of
> §10 one level down. Reversed by §16.

### Collecting

**§12.1 · Gleichartige Summanden** `#alike-summands-collect`
> **Zwei Summanden sind gleichartig, wenn sie sich nur in der Zahl davor unterscheiden.
> Gleichartige Summanden werden zusammengefasst: die Zahlen werden addiert, der Rest bleibt
> stehen.**
>
> *Two summands are alike when they differ only in the number in front; collect them by adding
> the numbers and keeping the rest.* — C.1–C.4. The definition is half the rule, which is why
> it is inside it.

**§12.2 · … und nur Gleichartiges** `#unalike-summands-stay`
> **Summanden, die sich in mehr als der Zahl davor unterscheiden, bleiben stehen:
> $2 + 3x$, $3x + 2y$, $x^2 + x$, $a^2 + b^2$.**
>
> *Summands differing in more than the number in front stay as they are.* — C.20–C.23.
> ⚠️ Say the companion out loud: **nicht zusammenfassbar heisst nicht unveränderbar** —
> $x^2 + x$ does not collect and still factors `[§13]`.

**§13 · Gemeinsamer Faktor** `#a-shared-factor-comes-out`
> **Steht in jedem Summanden derselbe Faktor, darf er vor die Klammer gezogen werden.**
>
> *If every summand contains the same factor, it may be pulled out in front of a bracket.*
> — C.5–C.7. The reverse of §6.1, and the harder direction: §6.1 is carried out, this must
> first be **seen**.

**§14 · Zahlen zusammenrechnen** `#numbers-in-a-product-multiply`
> **In einem Produkt dürfen die Zahlen zusammengerechnet werden — die Faktoren dürfen ja in
> beliebiger Reihenfolge stehen `[§1.1]`.**
>
> *In a product the numbers may be multiplied together, since the factors may stand in any
> order.* — C.8, C.9, C.12

**§15 · Gleiche Faktoren werden zur Potenz** `#equal-factors-make-a-power`
> **Gleiche Faktoren in einem Produkt werden als Potenz geschrieben: $a \cdot a = a^2$.**
>
> *Equal factors in a product are written as a power.* — C.10, C.12, C.13. The reverse of §10.

**§16 · Gleiche Summanden werden zum Vielfachen** `#equal-summands-make-a-multiple`
> **Gleiche Summanden werden als Vielfaches geschrieben: $a + a = 2a$.**
>
> *Equal summands are written as a multiple.* — C.11. The reverse of §11.

**§17.1 · Kürzen** `#cancel-a-shared-whole-factor`
> **Gekürzt wird ein Faktor, den der GANZE Zähler und der GANZE Nenner haben:
> $\frac{ak}{bk} = \frac{a}{b}$.**
>
> *Cancel a factor shared by the whole numerator and the whole denominator.* — C.14

**§17.2 · … nie ein einzelner Summand** `#never-cancel-a-summand`
> **$\frac{3x+2}{3}$ bleibt: die $3$ ist kein Faktor des ganzen Zählers.**
>
> *Never a single summand.* — C.24. This pair is the clearest case for the `.1`/`.2`
> numbering: the mistake happens *inside* the legal move, so the two sentences are useless
> apart.

### Substituting

**§18 · Einsetzen** `#any-expression-may-be-substituted`
> **Wo ein einzelner Buchstabe steht, darf ein ganzer Term stehen. Die Regel gilt weiter.**
>
> *Where a single letter stands, a whole expression may stand. The rule still holds.* — S.1.
> The sentence that makes every rule above infinitely applicable, and the one a student who
> "knows the formula but cannot use it" is missing.

**§19 · Klammern beim Einsetzen** `#bracket-what-you-substitute`
> **Setze ein und frage dann: Ändert das Weglassen der Klammer die Lesart? Wenn ja, bleibt sie.
> Wenn nein, kommt sie weg.**
>
> *Substitute, then ask whether removing the bracket would change the reading.* — S.2–S.8, S.16.
> ⚠️ Nothing new: this is V4 applied at the substitution site. Over the bar and under the root
> the answer is always "no brackets", because there is already one `[§0.1, §0.2]`.

**§20 · Passt die Regel?** `#a-rule-fits-slot-by-slot`
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

**§21 · Gleiche Basis** `#same-base-adds-exponents`
> **Potenzen mit gleicher Basis werden multipliziert, indem man die Exponenten addiert:
> $a^m \cdot a^n = a^{m+n}$. Rückwärts gelesen zerlegt sie eine Potenz.**
>
> *Same base, multiplied: add the exponents; read backwards it splits one.* — C.25, E.30.
> ⚠️ Boundaries C.38 and C.39 belong with it: different bases do not collect, and a SUM of
> powers is not what this rule is about.

**§22 · Gleiche Basis, geteilt** `#same-base-subtracts-exponents`
> **Beim Dividieren werden die Exponenten subtrahiert: $\frac{a^m}{a^n} = a^{m-n}$.**
>
> *Dividing: subtract the exponents.* — C.26. ⚠️ **Not a fourth law**: it is §21 after §4,
> and worth showing that way once.

**§23 · Potenz einer Potenz** `#powers-multiply-exponents`
> **Bei einer Potenz einer Potenz werden die Exponenten multipliziert: $(a^m)^n = a^{mn}$.**
>
> *A power of a power: multiply the exponents.* — C.27

**§24 · Potenz eines Produkts** `#a-power-reaches-every-factor`
> **Eine Potenz erreicht jeden FAKTOR: $(ab)^n = a^n b^n$, und ebenso Zähler und Nenner.**
>
> *A power reaches every factor — and numerator and denominator alike.* — E.26, E.27, C.28.
> ⚠️ Its limit is already written: §6.2. A power reaches every factor and NO summand.

**§25 · Wurzel ist Potenz** `#a-root-is-a-power`
> **$\sqrt[n]{a} = a^{1/n}$. Damit sind die Wurzelgesetze keine neuen Gesetze — es sind die
> Potenzgesetze mit einem Bruch im Exponenten.**
>
> *A root is a power with a fraction in the exponent, so the root laws are not new laws.*
> — R.18, E.28, E.29. **The most economical sentence in the set**: it retires four rules
> before they are written, and it is `ix.root`'s own argument.

**§26 · Wurzel und Potenz vertauschen** `#root-and-power-commute`
> **$\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}$ — erst wurzeln oder erst potenzieren, das
> Ergebnis ist dasselbe.**
>
> *Root first or power first: same answer.* — R.19. ⚠️ Its own reverse, which is why its item
> sits in R.

**§27 · Negativer Exponent** `#a-negative-exponent-is-a-reciprocal`
> **$a^{-n} = \frac{1}{a^n}$ — ein negativer Exponent ist der Kehrwert, kein negatives
> Ergebnis.**
>
> *A negative exponent means the reciprocal, not a negative result.* — R.17

**§28 · Exponent null** `#exponent-zero-is-forced`
> **$a^0 = 1$ — nicht verordnet, sondern erzwungen: $a^m \cdot a^0 = a^m$ `[§21]`, also muss
> $a^0$ gleich $1$ sein.**
>
> *Forced by §21 rather than decreed.* — N6.8

### The fraction laws

**§29 · Brüche multiplizieren** `#fractions-multiply-straight-across`
> **Zähler mal Zähler, Nenner mal Nenner: $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$.
> Dafür braucht es KEINEN gemeinsamen Nenner.**
>
> *Numerator times numerator, denominator times denominator — no common denominator needed.*
> — C.29

**§30 · Brüche dividieren** `#flip-and-multiply`
> **Durch einen Bruch teilen heisst mit seinem Kehrwert malnehmen — und zwar mit dem Kehrwert
> dessen, durch das man teilt.**
>
> *Dividing by a fraction is multiplying by its reciprocal — of the one you divide BY.* — E.31

**§31 · Brüche addieren** `#fractions-need-one-denominator`
> **Gleicher Nenner: Zähler addieren. Ungleicher Nenner: zuerst gleichnamig machen. Eine ganze
> Zahl ist ein Bruch mit Nenner $1$.**
>
> *Same denominator: add the numerators. Different: make them the same first.* — C.30–C.32.
> ⚠️ Beside §29 this is the pair worth teaching together: **multiplying asks nothing first,
> adding asks for the denominators** — that is the whole difference and it is why one feels
> easy and the other does not.

**§32 · Doppelbruch** `#the-main-bar-decides`
> **Im Doppelbruch entscheidet der HAUPTBRUCHSTRICH — der längere. $\frac{\frac{a}{b}}{c}$ und
> $\frac{a}{\frac{b}{c}}$ sind verschiedene Zahlen.**
>
> *In a double fraction the main bar — the longer one — decides.* — C.33, N7.6. ⚠️ Another
> place where the length of a stroke is the whole meaning `[§0.1]`.

### The binomial formulas

**§33 · Die binomischen Formeln** `#the-binomial-formulas`
> **$(a+b)^2 = a^2 + 2ab + b^2$, $(a-b)^2 = a^2 - 2ab + b^2$, $(a+b)(a-b) = a^2 - b^2$.
> Vorwärts gelesen multipliziert man aus, rückwärts gelesen faktorisiert man.**
>
> *Forwards they expand, backwards they factorise.* — E.32–E.34, C.34–C.36.
> ⚠️ The second is the first with $b := -b$ `[S.1]` — one formula, not three.

**§34 · Das Paar finden** `#find-the-pair`
> **$x^2 + px + q = (x+m)(x+n)$, wenn $m \cdot n = q$ und $m + n = p$. Beide Bedingungen
> müssen gelten, sonst ist das Paar falsch.**
>
> *Both conditions or the pair is wrong.* — E.35, C.37

### What this draft shows

- **Forty-four rules, 181 items** (counted 2026-08-03, not estimated). ⚠️ **The old "186" was
  wrong** — the true figure before §0.3 landed was 179, which is exactly the number of slugs
  the slug pass produced, so the slug count had been right and the prose had not. Today's pool
  is 63 rules — so the sizes were never far
  apart. What differs is the vocabulary: the pool talks about operations, these talk about
  blocks and types.
- **THE FLATTENING RULE IS GONE, 2026-08-03, and it was the last normalise-then-count.** V4 used
  to drop a bracket that changed no reading and count afterwards; now a wall is a wall and
  $a + (b+c)$ is TWO blocks. What it buys: counting stops needing a hypothetical run before you
  may count, *Klammer auflösen* stops being split across two buckets (E.20 and E.12 are now
  both E, with twins C.18 and C.19), and $(x+1)$ stops being one block in context and two
  standing alone. What it costs, said plainly: dropping a harmless bracket is now EXPANDING.
  ⚠️ **The bracket also joins the ladder's container rung**, and step 4 had to say that it
  descends by MATCHING blocks, not pairing them left to right — otherwise associativity returns
  no verdict. Neither is a special case; both are the test written down more exactly.
- **THE LADDER WAS TURNED ON ITSELF, 2026-08-03, and moved three items.** The two conversions
  had been counted after converting rather than as written — the same error the fraction
  product was corrected for weeks earlier. Counted honestly they OPEN, so §3 and §4 became
  **E.18/E.19** with twins **C.15/C.17**, and the asymmetry open question 6 recorded turned out
  to be an artefact of counting the two of them differently. ⚠️ **No new bucket, no special
  case, no change to the test** — one of its inputs is simply applied everywhere now.
- **THE LADDER HELD.** This was the falsification test — R/E/C was invented on three basic
  laws and claimed to sort every move. Thirty-four power, root, fraction and binomial moves
  were added and **not one needed a new bucket or a special case.** Two that looked awkward
  resolved cleanly: $\left(\frac{a}{b}\right)^n$ (container → container) is E once read through
  §4, and $\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}$ is R — which the involutive audit had
  already said, from the other side, three days earlier.
- **Writing the rules first kept finding items.** Six more this round: $a^{m+n} = a^m a^n$
  (E.30), the root laws as instances rather than laws (E.28, E.29), $a^0 = 1$ derived rather
  than decreed (N6.8), and the two power boundaries C.38/C.39 — *different bases do not
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
| V, N (50), P (21) | 71 | **§0.1–§0.4**, plus where §5, §27, §28 land |
| **R** | 19 | §1.1, §1.2, §2.1, §2.2, §5, §26, §27 — **no longer §3, §4, or dropping a bracket** |
| **E** | 35 | **§2.1, §3, §4**, §6.1–§11, §21, §24, §25, §30, §33, §34 |
| **C** | 40 | **§2.1, §3, §4**, §12.1–§17.2, §21–§24, §29, §31–§34 |
| **S** | 16 | **§18–§20** |

- **The blocks got named, 2026-08-03.** V5 collects the six written forms, §0.3 states
  juxtaposition once, and N1 went from ten items to seven — six of which had been an ad-hoc
  slice of a 36-cell cross-product. **The enumeration is what produced the finding**: every
  exception is about numerals, so the rule's limit is one sentence rather than a list. Same
  method as the rules, one level down — write the thing that ranges over the cases, and the
  cases sort themselves.

**Done as of 2026-08-02** — the power, root, fraction and binomial laws are in, and the ladder
took them without a special case. **What is left:** the strategy layer that S.13 opens (an
expression matches several rules — which to take), and the mistakes, which are not in this file
at all. The boundaries here are their skeleton: every $\neq$ item is a mistake waiting to be
written from the other side.

---

## N · Notation — reading what is written

### N1 · Multiplication that is not written

⚠️ **Was six items, now one.** N1.1–N1.6 used to enumerate pairs — number·letter,
letter·letter, number·bracket, letter·bracket, bracket·bracket, number·root — which is six of
the thirty-six pairs `[V5]` allows, picked ad hoc. They are one skill over different forms, and
difficulty between them is a binding range, not a second item. What survives beside the merged
item is only what the rule does NOT predict.

- **N1.1** $3a = 3 \cdot a$, $ab = a \cdot b$, $3(x+1)$, $a(x+1)$, $(x+1)(x+2)$, $2\sqrt{3}$, $a\frac{c}{d}$, $ab^2$ — **two blocks side by side are a product**, whatever the two forms are `[V5]` `[§0.3]` `[ix.juxtaposition]` `#blocks-side-by-side-are-a-product`
- **N1.2** $23 \neq 2 \cdot 3$ — a numeral is ONE atom however many digits it has, so two numerals never stand side by side `[§0.3]` `[no card]` `#a-numeral-is-one-atom`
- **N1.3** $3a$, not $a3$ — the numeral is written in front `[§0.3]` `[ix.coefficient-front]` `#coefficient-in-front`
- **N1.4** $a3$ reads as a NAME, not as a product — worth meeting now rather than later, because it comes back as $a_1$ `[§0.3]` `[ix.coefficient-front]` `#letter-then-number-is-a-name`
- **N1.5** $\sqrt{3}2$ — a product by the rule, and never written: the numeral goes in front `[N1.3]`, and a bar drawn a little too long says $\sqrt{32}$ `[§0.2]`. The same verdict covers $(x+1)3$ and $a^2 3$ `[§0.3]` `[no card]` `#numeral-after-a-container`
- **N1.6** $a \times b = a \cdot b = ab$ — three spellings of one operation. $\times$ and $*$ are READ, never written; this course writes the dot `[no card]` `#spellings-of-multiplication`
- **N1.7** $2\tfrac{1}{3}$ — the mixed number, **refused by this course**: write $\tfrac{7}{3}$. Side by side would mean PLUS here and times everywhere else, so the notation is not taught, only recognised when it turns up `[§0.3]` `[no card]` `#mixed-number-refused`

### N2 · Marks that are omitted

A $1$ that is present in the value and absent from the page. Three of them, and no more —
each is a symbol you must be able to write back in.

- **N2.1** $a = 1 \cdot a$ — the coefficient $1$ is never written `[ix.invisible-one]` `#unwritten-coefficient-one`
- **N2.2** $a = a^1$ — the exponent $1$ is never written `[ix.invisible-one → ix.pow]` `#unwritten-exponent-one`
- **N2.3** $\sqrt{a} = \sqrt[2]{a}$ — the root index $2$ is never written `[ix.root]` `#unwritten-root-index`

### N3 · Brackets

- **N3.1** $a \cdot (b + c)$ — brackets say what to compute first `[ix.brackets]` `#brackets-say-what-first`
- **N3.2** $(a + b)$ is **one object** — a whole bracket is a single thing `[no card]` `#bracket-is-one-block`
- **N3.3** $(a+b) = [a+b] = \{a+b\}$ — round, square and curly do one job; the shape only helps the eye when they nest `[no card]` `#bracket-shapes`
- **N3.4** $((a+b)) = (a+b)$ — a second bracket around a bracket adds no reading. ⚠️ *It states an IDENTITY; taking the outer wall off is a move, one wall fewer, so it collects `[V4, C.18]`* `[no card]` `#doubled-bracket`

### N4 · Precedence — the grouping nobody writes

- **N4.1** **Two tiers, not one chain.** First the **grouping symbols** `[V3]` — written brackets, the fraction bar, the radical, the superscript position — which group by geometry and are settled before any ranking is consulted. Then, among what is left on the line: $\text{power} \succ \cdot \; / \; : \; \succ + \; -$, same rung read left to right `[ix.precedence, ix.power-precedence]` `#two-tiers`
- **N4.1a** the classroom form: **Klammern → Potenz → Punkt → Strich**, *wobei Bruchstrich und Wurzelstrich Klammern sind* — that rider is the whole content, and it is what English curricula patch PEMDAS into **G**EMDAS for `[V3]` `#klammer-potenz-punkt-strich`
- **N4.1b** $\cdot$, $/$ and $:$ share ONE rung: $a / b \cdot c = (a/b) \cdot c$, never $a/(b \cdot c)$. ⚠️ The stacked bar is NOT on this rung — it is a grouping symbol, which is why $\frac{a}{b} \cdot c$ needs no brackets and $a / b \cdot c$ does `[no card]` `#times-and-divide-share-a-rung`
- **N4.2** $a + b \cdot c = a + (b \cdot c)$ — a product inside a sum needs no brackets `[ix.precedence]` `#product-inside-a-sum`
- **N4.3** $a \cdot b^n = a \cdot (b^n)$ — the exponent reaches only what it touches `[ix.power-precedence]` `#exponent-reaches-what-it-touches`
- **N4.4** $3a^2 = 3 \cdot (a^2)$, and $(3a)^2$ is a different term `[ix.power-precedence]` `#coefficient-is-outside-the-power`
- **N4.5** $ab^2 = a \cdot (b^2)$ — **the power binds to the closest BLOCK before it** `[ix.power-precedence]` `#power-binds-closest-block`
- **N4.5a** and "block" is the word that makes it exceptionless. $2x^3 = 2 \cdot (x^3)$ and $-2a^2 = -2(a^2)$: nothing is grouped, so the closest block is the atom, and the coefficient stays outside. $\left(\frac{a}{b}\right)^2$: the bar has ALREADY grouped, so the closest block is the whole fraction — and *not* the numerator. Same rule, opposite-looking answers; "closest symbol" is a shortcut that holds only while nothing has been grouped `[no card]` `#closest-block-not-closest-symbol`
- **N4.6** $(ab)^2$ — a bracket is the only way to give the exponent more than the closest block: **it builds the wall the power has not got** `[V3]` `[ix.power-precedence]` `#bracket-widens-the-power`
- **N4.7** $-a^2 = -(a^2)$, and $(-a)^2$ is a different term — so the bracket here is **grammar**: without it the expression says something else `[§0.4]` `[ix.power-precedence]` `#negated-square`
- **N4.8** $a - b - c = (a - b) - c$ — a chain of one operator is read left to right `[ix.left-to-right]` `#chain-left-to-right`
- **N4.9** $a : b : c = (a : b) : c$ — the same for division, where it bites hardest `[ix.left-to-right]` `#division-chain-left-to-right`

### N5 · The minus sign

- **N5.1** $-3$ is a negative number; $a - b$ is a subtraction — two jobs, one glyph `[no card]` `#minus-has-two-jobs`
- **N5.2** $a + (-b) = a - b$ — an operator and a unary minus never stand side by side. ⚠️ *A writing habit, not grammar: $1--3$ is unambiguous and still not written* `[§0.4]` `[§3]` `[ix.no-adjacent-operator]` `#no-two-operators-side-by-side`
- **N5.3** $a \cdot (-b)$ — a negative used as a factor takes brackets, so it reads as one factor. ⚠️ *Also a writing habit — $a \cdot -b$ is unambiguous* `[§0.4]` `[ix.negative-factor]` `#negative-factor-takes-brackets`
- **N5.4** $-a = (-1) \cdot a$ — a leading minus is a coefficient of $-1$ `[ix.negative-factor]` `#leading-minus-is-minus-one`
- **N5.5** $-3x = (-3) \cdot x$ — with a number in front, the minus joins the coefficient `[ix.negative-factor]` `#minus-joins-the-coefficient`
- **N5.6** $-(a+b) = (-1) \cdot (a+b)$ — in front of a bracket it is that same factor, and nothing has been done to the bracket yet `[ix.negative-factor]` `#minus-before-a-bracket-is-a-factor`

### N6 · Powers and roots

- **N6.1** $a^n$ — read "*a* to the *n*-th": $n$ factors of $a$ `[ix.pow]` `#reading-a-power`
- **N6.2** $a^2 = a \cdot a$ — the smallest case, automatic `[ix.pow]` `#square-is-two-factors`
- **N6.3** base and exponent are two slots that do not draw from the same place: $2^3$ and $3^2$ `[§5]` `[ix.pow]` `#base-and-exponent-are-two-slots`
- **N6.4** $\sqrt[n]{a} = a^{1/n}$ — radical and exponent are two spellings of one thing `[ix.root]` `#radical-is-a-fractional-exponent`
- **N6.5** $\sqrt{a+b}$ — the radical bar is a bracket: everything under it is one object `[§0.2]` `[no card]` `#radical-bar-is-a-bracket`
- **N6.6** $\sqrt{a} \cdot b$ against $\sqrt{ab}$ — where the bar ends is the whole question `[no card]` `#where-the-radical-bar-ends`
- **N6.8** $a^0 = 1$ — read it off the same-base rule rather than as a decree: $a^m \cdot a^0 = a^{m+0} = a^m$, so $a^0$ can only be $1$ `[§28]` `[no card]` `#exponent-zero-is-one`
- **N6.7** $a^{b^c}$ is read TOP-DOWN, $a^{(b^c)}$, never $(a^b)^c$: $3^{3^3} = 3^{27}$, which is 7 625 597 484 987 and not 19 683 `[no card]` `#exponent-tower-reads-top-down`

### N7 · Division and the fraction bar

- **N7.1** $\frac{a}{b} = a : b = a/b$ — spellings of one operation `[ix.division-symbols]` ⚠️ *$\div$ retired; the open todo on `division-variants` proposes retiring $:$ too* `#spellings-of-division`
- **N7.2** $\frac{a+b}{c} = (a+b) : c$ — the bar is a bracket you do not write `[§0.1]` `[ix.fraction-bar]` `#bar-brackets-the-numerator`
- **N7.3** $\frac{c}{a+b} = c : (a+b)$ — it groups below the bar just as hard `[ix.fraction-bar]` `#bar-brackets-the-denominator`
- **N7.4** writing a stacked fraction on one line makes the brackets reappear `[ix.fraction-bar]` `#on-one-line-brackets-reappear`
- **N7.5** $\frac{1}{2}x$ against $\frac{1}{2x}$ — where the bar ends, again `[no card]` `#where-the-bar-ends-sideways`
- **N7.6** $\frac{\frac{a}{b}}{c}$ against $\frac{a}{\frac{b}{c}}$ — the main bar is the long one, and the two are different numbers `[no card]` `#which-bar-is-the-main-one`
- **N7.7** $\frac{a}{b}$ is one object, one number — not an unfinished division `[no card]` `#fraction-is-one-number`
- **N7.8** **The bar's extent is the fraction's scope**, and it settles the reading in both directions: sideways, $\frac{1}{2}x$ against $\frac{1}{2x}$ `[N7.5]`; upward, a superscript ABOVE the bar and within its span belongs to the numerator, one PAST the bar's right end belongs to the whole fraction `[no card]` `#the-bars-extent-is-its-scope`
- **N7.9** $\frac{a^2}{b}$ against $\left(\frac{a}{b}\right)^2$ — where the exponent is written decides what it is applied to. ⚠️ $\frac{a^2}{b}$ needs NO bracket around $a^2$: the bar already brackets the numerator, so $\frac{(a^2)}{b}$ is a bracket that changes no reading `[N3.4]`. The brackets in the second are needed because the exponent stands outside the bar `[no card]` `#exponent-inside-or-outside-the-bar`
- **N7.10** in handwriting the bar has no precise right end — but that is the writer's to fix, not the reader's to guess `[§0.1]`. It is the real reason to write $\left(\frac{a}{b}\right)^n$ rather than trust the geometry. ⚠️ Typeset, the bare form is NOT ambiguous — it reads as the whole fraction — and it is worth not marking it wrong `[no card]` `#handwritten-bar-needs-care`

---

## P · Parsing — naming the blocks

The step every T item spends and no item states. V4 already does it — "count the summands,
flattening a bracket only where it changes nothing" *is* a parse — so this section is not new
material, it is the assumption written down and made practisable.

Two questions, in this order, and the second cannot be asked before the first: **what is this
expression** — a sum, a difference, a product, a quotient or a power `[V2]` — and **what are
its blocks**. Everything in T counts blocks, so a student who cannot do P cannot do T except
by imitation, which is exactly what a student who "knows the rule but not when to use it" is
doing.

⚠️ **The question is the TYPE, not "which operator is the main one".** Ranking the operators
invites the wrong answer, because $\cdot$ grabs its operands first and so feels dominant; and
the student's own reading — *$\cdot$ binds stronger, so $ab$ forms a block and the $+$ is the
seam* — is exactly right and is the same fact. $a \cdot b + c$ **is a sum**. Naming the type
carries no claim about importance, and it is the sentence every rule is conditioned on.

⚠️ **This is where the old `chunking.json` lands**, nearly line for line: `basic-forms`,
`misleading-forms` and `finding-the-parts` are all "name the blocks", drawn as bracketed
answers rather than said. And `basic-forms` is `sum, difference, product, quotient, power` —
the type list of V2, authored two months ago under another name. It was never a process
between fluency and transformation: it is the reading step of the grammar, and the old model's
own defence gives it away — *fluency lets you see the structure, structure lets you see the
move.* Seeing structure is reading.

### P1 · What is this expression?

- **P.1** $3x + 2y$ → a **sum**. One seam, and it is the answer `#type-of-a-sum`
- **P.2** $3x \cdot 2y$ → a **product** `#type-of-a-product`
- **P.3** $a \cdot b + c$ → a **sum** — $\cdot$ binds stronger, so $a \cdot b$ is one block and the $+$ is the seam ⇐ N4.2 `#type-when-times-binds-tighter`
- **P.4** $3(x+1)$ → a **product**; the $+$ is inside a block, not a seam ⇐ N3.1 `#type-of-a-bracketed-product`
- **P.5** $2x^2$ → a **product**, not a power — the exponent reaches only $x$ ⇐ N4.4 `#type-of-a-coefficient-times-power`
- **P.6** $(x+1)^2$ → a **power**, because the bracket made the sum into one block ⇐ N4.6 `#type-of-a-bracket-raised`
- **P.7** $-3x + 2y$ → a **sum**; the leading minus has nothing to its left, so it is part of the first block and not a seam ⇐ N5.1 + N5.4 `#type-with-a-leading-minus`
- **P.8** $a - b$ → a **difference**, and it stays one until §3 is applied — *a sum once the minus joins the block after it* is the result of a MOVE, not of reading ⇐ V2 `#type-of-a-difference`
- **P.9** $\frac{3x+2}{x-1}$ → a **quotient**; neither the $+$ nor the $-$ is a seam ⇐ N7.2 `#type-of-a-quotient`
- **P.10** $\sqrt{a+b}$ → a **root**, and the $+$ is under the bar, inside one block ⇐ N6.5 `#type-of-a-root`
- **P.11** $x$, $7$ → an **atom**: no seam, and saying so is an answer, not a failure `#type-of-an-atom`
- **P.12** the whole procedure, in order: **brackets first, then the loosest-binding operator is the seam** ⇐ N3.1 + N4.1 `#how-to-find-the-type`

### P2 · What the blocks are

- **P.13** $3x + 2y$ → two summands, $3x$ and $2y$ `#summands-of-a-sum`
- **P.14** $3x - 2y$ → two blocks, $3x$ and $2y$ — a minus with something to its left is a SEAM, so it separates and nothing is absorbed ⇐ N5.1 `#blocks-of-a-difference`
- **P.14a** $3x + (-2y)$ → two summands, $3x$ and $-2y$ — the same value written as a sum, and NOW the sign travels with the block. Parsing it needs no move; GETTING here from P.14 is §3 `[E.18]` ⇐ N5.4 `#summands-carry-their-sign`
- **P.15** $3 \cdot x \cdot (x+1)$ → three factors, $3$, $x$, $(x+1)$ `#factors-of-a-product`
- **P.16** $\frac{3x+2}{x-1}$ → two blocks, the numerator and the denominator `#blocks-of-a-quotient`
- **P.17** $(x+1)^2$ → two slots, the base $(x+1)$ and the exponent $2$ `[§5]` ⇐ N6.3 `#slots-of-a-power`
- **P.18** $a + (b+c)$ → 2 blocks, $a$ and $(b+c)$; $a + b + c$ → 3. **A wall is a wall, and the two are different expressions** ⇐ V4 `#blocks-through-a-bracket`
- **P.19** $3(x+1) - 2(x-1)$ → two summands first, and only then two factors inside each — the parse is recursive `#parsing-is-recursive`
- **P.20** $3x$ inside $3x + 2y$ → parse a block with the same two questions, until you reach atoms `#parse-a-block-again`

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

> **sum ⟶ product ⟶ container ⟶ atom**

where **container** is any expression a wall closes — a bracket, a fraction, a root, a power
`[V1]`. ⚠️ **The bracket joined this rung on 2026-08-03**; before that the rung was listed as
*quotient, power, root* and brackets were flattened away before counting `[V4]`.

1. Name each side's **type** `[V2]` and count its **blocks** `[V3, V4]`.
2. **The type moved UP the ladder → E. Down → C.**
3. Same type: **more blocks → E, fewer → C.**
4. Same type and same count: **descend and ask again — MATCHING the blocks, not pairing them
   off left to right.** $(a+b)+c = a+(b+c)$ has {container, atom} on both sides and is R;
   compared position by position it would look like one block going down and another going up,
   and the test would return nothing.
5. Nothing differs at any level — only order or grouping — → **R**.

That is *ausmultiplizieren* against *zusammenfassen* made mechanical: **expanding opens an
expression up the ladder, collecting closes it down, rearranging leaves it where it is.**

Worked, including the three cases that forced this shape:

| move | left | right | why |
|------|------|-------|-----|
| $a(b+c) = ab+ac$ | product, 2 | sum, 2 | **up** the ladder → E, though the count never moved |
| $(ab)^n = a^n b^n$ | container, 1 | product, 2 | up → E |
| $x^a x^b = x^{a+b}$ | product, 2 | container, 1 | **down** → C |
| $2 \cdot 3x = 6x$ | product, 3 | product, 2 | same type, fewer → C |
| $a+(b+c) = a+b+c$ | sum, **2** | sum, 3 | same type, more → **E** — *Klammer auflösen* `[E.20]` |
| $(a+b)+c = a+(b+c)$ | sum, 2 | sum, 2 | same, same → descend, MATCHING: {container, atom} both sides → R |
| $\frac{ak}{bk} = \frac{a}{b}$ | container, 1 | container, 1 | descend: numerator $ak$ (2) against $a$ (1) → C |
| $a - (b+c) = a-b-c$ | sum, 2 | sum, 3 | same type, more → E |

⚠️ **This corrected an earlier reading of $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$.** It
was called rearranging, by applying §4 first and counting afterwards — but applying §4 is
already a move. Counted as written it is product(2) → container(1): **down the ladder,
collecting**. Adding fractions is collecting too. What separates the two is not the bucket but
the COST — one needs a common denominator and the other does not.

⚠️ **And on 2026-08-03 the same rule was turned on the CONVERSIONS, which had been exempt.**
$a - b = a + (-b)$ was called R by reading the difference as a sum before counting it — the
identical mistake, one level down. Counted as written, $a - b$ is a difference with blocks $a$
and $b$; descend and $b$ (an atom) becomes $(-b)$ (a product), so it **opens** `[E.18]`. Both
conversions are now E with a C twin apiece, and §3 and §4 are symmetric again `[V2]`.

⚠️ **This is the ladder's FIRST re-classification, so it is worth being clear what it cost.**
Nothing structural: no new bucket, no special case, no change to the test. What changed is one
input to it — *count as written* is now applied everywhere rather than everywhere except the
two conversions. The test survived by being applied to itself.

**⚠️ WHERE N AND T MEET.** $a \cdot a = a^2$ is also N6.2, where it says what the notation
*means*. That is not a duplicate: **N states the identity, T is the act of using it in a
direction**, and only an ATOM can sit on both sides of that line. Anything composite is
unambiguously T — $abca = a^2bc$ never touches N, because getting there needs a swap first
and then the fusion; the notation reading is one of its prerequisites, not what it is. So the
border question only ever arises for single identities, and the answer there is: the meaning
in N, the two moves in T, `⇐` pointing back.

**The law rides along as a tag** — `[comm]`, `[assoc]`, `[distr]` — so nothing is lost and the
old sections are still derivable. Two things worth noticing about those tags: rearranging is
exactly the two laws that came out INVOLUTIVE in the direction audit (a swap swaps back, a
regrouping regroups back), while distributivity is one-way and splits into E and C by
direction. The student-facing axis has a formal shadow; it is not merely a concession.

**There is no "mixed" bucket.** A move that spends two buckets is a SEQUENCE, and the data
already says that with `requires` — written `⇐` here. That is why $3x + 2 + 5x = 8x + 2$ is in
C with `⇐ R.9 + C.1` rather than in a fourth section that would otherwise swallow the list.

**⚠️ THE AXIS IS BIGGER THAN THESE THREE LAWS.** It classifies the whole law layer, and the
rest lands here as it is written: $(a+b)^2 = a^2 + 2ab + b^2$ is expanding, its reverse is
collecting, $\sqrt{ab} = \sqrt{a}\sqrt{b}$ is expanding, $x^a \cdot x^b = x^{a+b}$ is
collecting, $\frac{a}{b} + \frac{c}{d} = \frac{ad+bc}{bd}$ is collecting. This section holds
only what the three laws produce so far; the power, root, fraction and binomial moves join
the same three buckets rather than getting sections of their own.

### R · Rearranging — the blocks stay, the order changes

- **R.1** $a + b = b + a$ — two summands may be swapped `[§1.1]` `[comm, ax.add-commutative]` `#swap-two-summands`
- **R.2** $ab = ba$ — two factors may be swapped `[§1.1]` `[comm, ax.mul-commutative]` `#swap-two-factors`
- **R.3** $3x$ and $x \cdot 3$ are the same expression — recognise a swap that has already happened `[§1.1]` `[comm]` `#recognise-a-swap`
- **R.4** $a^2 b = b a^2$ — a power is one factor, and swaps like any other `[§1.1]` `[comm]` `#swap-a-power-factor`
- **R.5** $y \cdot 3 = 3y$ — swap so the coefficient comes first, which is what N1.3 asks for `[§1.1]` `[comm]` `#swap-coefficient-to-front`
- **R.6** $(a + b) + c = a + (b + c)$ — a sum may be regrouped `[§2.1]` `[assoc, ax.add-associative]` `#regroup-a-sum`
- **R.7** $(ab)c = a(bc)$ — a product may be regrouped `[§2.1]` `[assoc, ax.mul-associative]` `#regroup-a-product`
- **R.8** $17 + (3 + 8) = (17 + 3) + 8$ — regroup to make the arithmetic easy `[§2.1]` `[assoc]` `#regroup-for-easy-arithmetic`
- **R.9** $a + b + c = c + b + a$ — reorder a chain of three ⇐ R.1 + R.6 `[§1.1, §2.1]` `[comm, assoc]` `#reorder-a-chain-of-three`

⚠️ **Two departures, both on 2026-08-03, and both for one reason: R is now only what leaves the
BLOCKS THEMSELVES alone.** The two conversions went to `[E.18, E.19]` with twins
`[C.15, C.16, C.17]` — counted as written they open the expression. And *dropping a bracket*
went the same way `[E.22, E.23]` with twins `[C.20, C.21]`: once a bracket is a wall `[V4]`,
taking it off changes the block count, so it is a move and not a re-placement. What is left
here is swapping, and regrouping that keeps the walls where they are.

*Boundaries — what may not be rearranged while it is still a difference or a quotient:*

- **R.10** $a - b \neq b - a$ — subtraction does not commute `[§1.2]` `[comm]` `#subtraction-does-not-commute`
- **R.11** $8 - 3 \neq 3 - 8$ — and the check is a number, not an argument `[§1.2]` `#subtraction-number-check`
- **R.12** $\frac{a}{b} \neq \frac{b}{a}$ — division does not commute `[§1.2]` `[comm]` `#division-does-not-commute`
- **R.13** $\frac{8}{2} \neq \frac{2}{8}$ — checked the same way `[§1.2]` `#division-number-check`
- **R.14** $(a - b) - c \neq a - (b - c)$ — subtraction does not associate `[§2.2]` `[assoc]` `#subtraction-does-not-associate`
- **R.15** $(8 - 3) - 2 \neq 8 - (3 - 2)$ — the number check `[§2.2]` `#association-number-check`
- **R.16** $(a : b) : c \neq a : (b : c)$ — division does not associate `[§2.2]` `[assoc]` `#division-does-not-associate`

*The power spellings — same rung on the ladder, so rearranging `[V3]`:*

- **R.17** $a^{-n} = \frac{1}{a^n}$ — a negative exponent is the reciprocal spelling `[§27]` `[rule.minus-in-exponent]` `#negative-exponent-is-reciprocal`
- **R.18** $\sqrt[n]{a} = a^{1/n}$ — radical and fractional exponent are two spellings of one thing ⇐ N6.4 `[§25]` `[ix.root]` `#radical-as-power`
- **R.19** $\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}$ — root and power in either order. ⚠️ *Involutive: the move is its own reverse, which is exactly why it lands in R and not in E or C* `[§26]` `[rule.root-of-power]` `#root-and-power-either-order`

### E · Expanding — the blocks grow

- **E.1** $a(b + c) = ab + ac$ — multiply into a sum `[§6.1]` `[distr, ax.distributivity]` `#multiply-into-a-sum`
- **E.2** $a(b - c) = ab - ac$ — into a difference `[§6.1]` `[distr]` `#multiply-into-a-difference`
- **E.3** $(b + c)a = ba + ca$ — the factor may stand on the right `[§6.1]` `[distr]` `#factor-on-the-right`
- **E.4** $3(x + 2) = 3x + 6$ — with a number, where the arithmetic gets done too `[§6.1]` `[distr]` `#multiply-a-number-into-a-sum`
- **E.5** $a(b + c + d) = ab + ac + ad$ — a longer sum, every summand `[§6.1]` `[distr]` `#multiply-into-a-longer-sum`
- **E.6** $-3(x + 2) = -3x - 6$ — a negative factor also reaches every summand `[§6.1, §9]` `[distr]` `#multiply-a-negative-into-a-sum`
- **E.7** $x(x + 1) = x^2 + x$ — a variable factor; the first product becomes a power ⇐ E.1 + C.10 `[§6.1]` `[distr]` `#multiply-a-variable-into-a-sum`
- **E.8** $(a + b)(c + d) = ac + ad + bc + bd$ — every summand of the one against every summand of the other `[§7]` `[distr, comm]` `#every-summand-against-every`
- **E.9** $\frac{a + b}{c} = \frac{a}{c} + \frac{b}{c}$ — a sum over the bar splits `[§8.1]` `[distr]` `#split-the-numerator`
- **E.10** $-(a + b) = -a - b$ — the leading minus is the factor $(-1)$ ⇐ N5.6 `[§9]` `[distr]` `#minus-over-a-sum`
- **E.11** $-(a - b) = -a + b$ — the same, and the last block is where the marks go ⇐ N5.6 `[§9]` `[distr]` `#minus-over-a-difference`
- **E.12** $a - (b + c) = a - b - c$ ⇐ E.18 + E.10 `[§3, §9]` `[distr]` `#subtract-a-sum`
- **E.13** $a - (b - c) = a - b + c$ ⇐ E.18 + E.11 `[§3, §9]` `[distr]` `#subtract-a-difference`
- **E.14** $a^2 = a \cdot a$ — unfold the smallest power. *The atom: the same identity as N6.1, used in a direction* ⇐ N6.1 `[§10]` `[ix.pow]` `#unfold-a-square`
- **E.15** $a^3 = a \cdot a^2$ — **peel one factor off a power** and keep the rest as a power. The general move, and the useful one — it is what makes $\frac{a^3}{a^2}$ collapse `[§10]` `[ix.pow]` `#peel-a-factor-off-a-power`
- **E.16** $2a = a + a$ — unfold the smallest multiple. *The additive atom* ⇐ N1.1 `[§11]` `[th.multiple-is-product]` `#unfold-a-double`
- **E.17** $3a = a + 2a$ — **peel one summand off a multiple** and keep the rest as a multiple. What makes $3a - a$ visible `[§11]` `[th.multiple-is-product]` `#peel-a-summand-off-a-multiple`

*The two conversions — they change what the expression IS, and everything in R depends on them.
Both OPEN it, which is why they sit here and not in R `[V2]`:*

- **E.18** $a - b = a + (-b)$ — read a difference as a sum, the minus absorbed into the block after it. ⚠️ *Counted as written this opens: the block $b$ is an atom, $(-b)$ is a product* `[§3]` `[def.sub]` `#difference-as-a-sum`
- **E.19** $\frac{a}{b} = a \cdot \frac{1}{b}$ — read a quotient as a product. ⚠️ *container(1) → product(2), the same opening one level up* `[§4]` `[def.div]` `#quotient-as-a-product`

*Taking a wall down — **Klammer auflösen**. Two blocks become three, so it expands `[V4]`:*

- **E.20** $a + (b + c) = a + b + c$ — a bracket around a pure sum comes off, and the summands join the outer sum `[§2.1]` `[assoc]` *(not N4.8: the convention says $a+b+c$ MEANS $(a+b)+c$; this says the other grouping has the same value)* `#drop-a-sum-bracket`
- **E.21** $a(bc) = abc$ — the same in a pure product `[§2.1]` `[assoc]` `#drop-a-product-bracket`

*Boundaries — what does not expand:*

- **E.22** $\frac{c}{a + b} \neq \frac{c}{a} + \frac{c}{b}$ — never under the bar `[§8.2]` `#never-split-the-denominator`
- **E.23** $(a + b)^2 \neq a^2 + b^2$ — a power does not reach the summands one at a time `[§6.2]` `#power-does-not-reach-summands`
- **E.24** $\sqrt{a + b}$ — nothing to expand, and nothing to do `[§6.2]` `#root-of-a-sum-stays`
- **E.25** only multiplication reaches into a sum — not a power, not a root `[§6.2]` `#only-a-factor-reaches-in`

*The power and root laws that open — container → product, so expanding `[V3]`:*

- **E.26** $(ab)^n = a^n b^n$ — the power reaches every factor `[§24]` `[rule.power-over-product]` `#power-of-a-product`
- **E.27** $\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$ — top and bottom each. ⚠️ *Not a new law: it is E.26 with a reciprocal `[§4]`* `[§24]` `[rule.power-over-quotient]` `#power-of-a-quotient`
- **E.28** $\sqrt[n]{ab} = \sqrt[n]{a} \cdot \sqrt[n]{b}$ — ⚠️ *and not a new law either: it is E.26 read with $n = \frac{1}{2}$ `[R.18]`* `[§24, §25]` `[rule.root-over-product]` `#root-of-a-product`
- **E.29** $\sqrt[n]{\frac{a}{b}} = \frac{\sqrt[n]{a}}{\sqrt[n]{b}}$ — E.27 the same way `[§24, §25]` `[rule.root-over-quotient]` `#root-of-a-quotient`
- **E.30** $a^{m+n} = a^m \cdot a^n$ — split an exponent sum. The general form of E.15 `[§21]` `[rule.same-base]` `#split-an-exponent-sum`
- **E.31** $\frac{a}{b} : \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}$ — dividing by a fraction opens into a product `[§30]` `[rule.fraction-divide]` `#divide-by-a-fraction`

*The binomial formulas, expanding:*

- **E.32** $(a+b)^2 = a^2 + 2ab + b^2$ — container(1) → sum(3) `[§33]` `[rule.binomial-square]` `#square-of-a-sum`
- **E.33** $(a-b)^2 = a^2 - 2ab + b^2$ — ⚠️ *the same formula with $b := -b$ `[S.1]`, not a second one to learn* `[§33]` `[rule.square-of-difference]` `#square-of-a-difference`
- **E.34** $(a+b)(a-b) = a^2 - b^2$ — product(2) → sum(2), still up the ladder `[§33]` `[rule.difference-of-squares]` `#sum-times-difference`
- **E.35** $(x+m)(x+n) = x^2 + (m+n)x + mn$ `[§34]` `[rule.quadratic-pair]` `#product-of-two-binomials`

### C · Collecting — the blocks shrink

- **C.1** $3x + 2x = 5x$ — collect like summands; distributivity read backwards `[§12.1]` `[distr]` `#collect-like-summands`
- **C.2** $x + 2x = 3x$ — collecting needs the invisible one back first ⇐ N2.1 `[§12.1]` `[distr]` `#collect-with-the-invisible-one`
- **C.3** $ab + ba = 2ab$ — they are alike only once one of them is swapped ⇐ R.2 `[§1.1, §12.1]` `[comm, distr]` `#collect-after-a-swap`
- **C.4** $3x + 2 + 5x = 8x + 2$ — reorder, then collect what matches ⇐ R.9 + C.1 `[§1.1, §12.1]` `[comm, assoc, distr]` `#reorder-then-collect`
- **C.5** $ab + ac = a(b + c)$ — pull out a common factor. *A different skill from E.1: it must be **found**, not carried out* `[§13]` `[distr]` `#pull-out-a-common-factor`
- **C.6** $3x + 6 = 3(x + 2)$ — with a number, finding it means seeing the divisor `[§13]` `[distr]` `#pull-out-a-number`
- **C.7** $x^2 + x = x(x + 1)$ — pull out a variable factor; seeing it needs $x^2 = x \cdot x$ ⇐ C.5 + E.14 `[§13]` `[distr]` `#pull-out-a-variable`
- **C.8** $2 \cdot 3x = 6x$ — regroup so the numbers meet, then multiply them `[§14]` `[assoc]` `#multiply-the-numbers`
- **C.9** $3x \cdot 2y = 6xy$ — sort the factors, then group the numbers ⇐ R.2 + R.7 `[§1.1, §14]` `[comm, assoc]` `#sort-then-multiply-numbers`
- **C.10** $a \cdot a = a^2$ — repeated factors become a power ⇐ N6.1 `[§15]` `[ix.pow]` `#equal-factors-become-a-power`
- **C.11** $a + a = 2a$ — repeated summands become a multiple `[§16]` `[th.multiple-is-product]` `#equal-summands-become-a-multiple`
- **C.12** $x \cdot 3 \cdot x = 3x^2$ — sort, then fuse the equal factors ⇐ R.2 + C.10 `[§1.1, §14, §15]` `[comm, assoc]` `#sort-then-fuse-factors`
- **C.13** $abca = a^2bc$ — the same on a longer product ⇐ R.2 + C.10. *Purely a move: it never touches N, because the notation reading is one of its prerequisites rather than what it is* `[§1.1, §15]` `#sort-and-fuse-a-longer-product`
- **C.14** $\frac{ak}{bk} = \frac{a}{b}$ — cancel a factor the whole numerator and the whole denominator share `[§17.1]` `#cancel-a-common-factor`

*The two conversions read backwards — twins that were missing from the list until the ladder
was applied to E.18 and E.19 `[V2]`:*

- **C.15** $a + (-b) = a - b$ — fold a sum back into a difference; the reverse of E.18 `[§3]` `[def.sub]` `#sum-back-to-a-difference`
- **C.16** $-b + a = a - b$ — swap first, then fold: this is what "once it is a sum, §1.1 applies" actually costs ⇐ R.1 + C.15 `[§1.1, §3]` `[comm]` `#commute-then-fold`
- **C.17** $a \cdot \frac{1}{b} = \frac{a}{b}$ — fold a product back into one fraction; the reverse of E.19, and the item rule-first found `[§4]` `[def.div]` `#product-back-to-a-fraction`

*Putting a wall up — **Klammer setzen**. The twins of E.20 and E.21, and neither existed until
the wall reading forced them out:*

- **C.18** $a + b + c = a + (b + c)$ — wall off two summands; three blocks become two `[§2.1]` `[assoc]` `#set-a-sum-bracket`
- **C.19** $abc = a(bc)$ — the same in a product. ⚠️ *Rarely worth doing on its own — it earns its place as the FIRST STEP of regrouping for easy arithmetic* ⇐ R.8 `[§2.1]` `[assoc]` `#set-a-product-bracket`

*Boundaries — what does not collect. Every one of these is an expression a student wants to
"finish" and cannot:*

- **C.20** $2 + 3x$ — a number and a variable summand do not collect `[§12.2]` `#number-and-term-stay`
- **C.21** $3x + 2y$ — different letters do not collect `[§12.2]` `#different-letters-stay`
- **C.22** $x^2 + x$ — same letter, different power, does not collect. ⚠️ *And yet C.7 factors it. Not a contradiction and worth saying out loud: **nicht zusammenfassbar, aber ausklammerbar** — collecting and factoring are different questions* `[§12.2]` `#different-powers-stay`
- **C.23** $a^2 + b^2$ — nothing to pull out, nothing to collect `[§12.2]` `#sum-of-squares-stays`
- **C.24** $\frac{3x + 2}{3}$ — a sum over a number does not cancel summand by summand `[§17.2]` `#no-cancelling-a-summand`

*The power laws that close — product → container, so collecting `[V3]`:*

- **C.25** $a^m \cdot a^n = a^{m+n}$ — same base: add the exponents `[§21]` `[rule.same-base]` `#same-base-multiplied`
- **C.26** $\frac{a^m}{a^n} = a^{m-n}$ — ⚠️ *not a fourth law: C.25 after `[§4]`* `[§22]` `[rule.same-base-divide]` `#same-base-divided`
- **C.27** $(a^m)^n = a^{mn}$ — the tower gets one storey shorter `[§23]` `[rule.power-of-power]` `#power-of-a-power`
- **C.28** $a^n b^n = (ab)^n$ — E.26 read backwards `[§24]` `[rule.power-over-product]` `#collect-into-a-power-of-a-product`

*The fraction laws that close:*

- **C.29** $\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}$ — product(2) → container(1). ⚠️ *Multiplying fractions needs nothing first, which is what "no common denominator" really means* `[§29]` `[rule.fraction-multiply]` `#multiply-fractions`
- **C.30** $\frac{a}{b} + \frac{c}{b} = \frac{a+c}{b}$ — same denominator, add the numerators `[§31]` `[rule.fraction-common-denominator]` `#add-fractions-same-denominator`
- **C.31** $\frac{a}{b} + \frac{c}{d} = \frac{ad+bc}{bd}$ — different denominators: make them the same first `[§31]` `[rule.fraction-common-denominator]` `#add-fractions-different-denominator`
- **C.32** $c + \frac{a}{b} = \frac{cb+a}{b}$ — a whole number is a fraction over $1$ `[§31]` `[rule.fraction-plus-whole]` `#whole-number-plus-fraction`
- **C.33** $\frac{\frac{a}{b}}{c} = \frac{a}{bc}$ — a double fraction collapses; which bar is the main one decides everything ⇐ N7.6 `[§32]` `[rule.double-fraction]` `#collapse-a-double-fraction`

*The binomial formulas, collecting — the harder direction, because the shape must be SEEN:*

- **C.34** $a^2 + 2ab + b^2 = (a+b)^2$ — sum(3) → container(1) `[§33]` `[rule.binomials-read-backwards]` `#trinomial-to-a-square`
- **C.35** $a^2 - 2ab + b^2 = (a-b)^2$ `[§33]` `[rule.binomials-read-backwards]` `#trinomial-to-a-square-of-a-difference`
- **C.36** $a^2 - b^2 = (a+b)(a-b)$ — sum(2) → product(2), down the ladder `[§33]` `[rule.binomials-read-backwards]` `#difference-of-squares-factored`
- **C.37** $x^2 + 5x + 6 = (x+2)(x+3)$ — find the pair: product $6$, sum $5$ `[§34]` `[rule.quadratic-pair]` `#factor-by-finding-the-pair`

*Boundaries — powers and fractions that do not collect:*

- **C.38** $a^m \cdot b^n$ — different bases do not collect `[§21]` `#different-bases-stay`
- **C.39** $a^m + a^n$ — same base, but a SUM: the power laws are about products `[§21]` `#sum-of-powers-stays`
- **C.40** $\frac{a+b}{a+c} \neq \frac{b}{c}$ — the $a$ is a summand, not a factor of the whole ⇐ C.24 `[§17.2]` `#no-cancelling-over-a-sum`

## S · Substitution — an expression may stand where an atom stood

The first section that is not grammar. Everything above works on an expression as written; this
one changes what may be written.

> **Every rule in T is stated with atoms, and holds when any atom is replaced by any
> expression.** $a(b+c) = ab + ac$ is not a fact about three letters. It settles
> $2x(y+3) = 2xy + 6x$ and every other instance there will ever be.

**Why it is not grammar.** Using it needs three things at once: a parse (P — what would $a$
have to be?), a rule (T — which one has this shape?), and a choice (which of several readings
is worth taking). The first two are grammar; the third is strategy, and this is the first place
in the list where a student can be **correct and unhelpful**.

**What is genuinely new here is smaller than it looks — and it is not the bracket rule.** The
only question substitution raises is when the inserted expression needs brackets, and that is
`[V4]` unchanged: **keep the bracket exactly when removing it would change the reading.**
Nothing new to learn, one thing to apply in a new place. A student who has done N3.4, V4 and
§0.1 already owns every answer below.

⚠️ **And the difficulty is SYNTACTIC, not semantic.** Küchemann's levels of letter-use — letter
ignored, as object, as specific unknown, as generalised number, as variable, as parameter — are
all about what a letter *denotes*, and by that account this step needs nothing new: $2x+3$
denotes a number, so a generalised-number reading already licenses it. The wall is elsewhere.
It is seeing that the written form $2x+3$ may occupy the position a single letter held, and
that doing so sometimes needs a bracket. A semantic account of letters cannot teach that; the
block vocabulary can, because it is the only one in which the bracket question has an answer.

### S1 · Putting an expression where an atom stood

- **S.1** $a(b+c) = ab+ac$ with $a := 2x$ — the rule is not about the letter, and this is the claim the whole section rests on `[§18]` `#a-rule-holds-for-any-expression`
- **S.2** decide the bracket by asking whether the inserted expression would be OUTBID where it lands — it keeps its wall exactly when its own top operator binds looser than the context's `[V1]` ⇐ N3.4 `[§19]` `#bracket-by-the-reading-test`
- **S.3** $a := 2x+3$ into $a(b+c)$ → $(2x+3)(b+c)$ — **brackets**: a sum inside a product `[§19]` `#substitute-a-sum-into-a-product`
- **S.4** $a := 2x$ into $a(b+c)$ → $2x(b+c)$ — **none**: a product inside a product changes nothing `[§19]` `#substitute-a-product-into-a-product`
- **S.5** $a := 2x$ into $a^2$ → $(2x)^2$ — **brackets**: $2x^2$ would be $2(x^2)$ ⇐ N4.5 `[§19]` `#substitute-into-a-base`
- **S.6** $a := x+1$ into $\frac{a}{b}$ → $\frac{x+1}{b}$ — **none**: the bar is already the bracket ⇐ §0.1 `[§19]` `#substitute-into-a-numerator`
- **S.7** $a := x+1$ into $\sqrt{a}$ → $\sqrt{x+1}$ — **none**, and for the same reason ⇐ §0.2 `[§19]` `#substitute-under-a-root`
- **S.8** $a := b+c$ into $-a$ → $-(b+c)$ — **brackets** `[§19]` `#substitute-behind-a-minus`
- **S.9** a letter that occurs twice is replaced **everywhere or nowhere**: $a \cdot a = a^2$ with $a := 2x$ gives $(2x)(2x) = (2x)^2$ `[§20]` `#replace-every-occurrence`

### S2 · Reading a rule as a pattern — the other direction

- **S.10** $(2x+3)^2$ is $(a+b)^2$ with $a := 2x$, $b := 3$ — the same claim read backwards, and the harder half: it must be **found** `[§20]` `#recognise-a-rules-shape`
- **S.11** report what each letter must be: $9x^2 - 4$ against $a^2 - b^2$ gives $a := 3x$, $b := 2$ `[§20]` `#report-what-each-letter-is`
- **S.12** check **every** slot, not the shape of two: $x^2 + 6x + 9$ matches $(a+b)^2$ with $a := x$, $b := 3$, because $2ab$ really is $6x$ and $b^2$ really is $9$ `[§20]` `#check-every-slot`
- **S.13** one expression may match several rules; which to take is a **choice**, and the first thing in this file that grammar cannot settle `#several-rules-may-fit`

*Boundaries — when a shape nearly matches:*

- **S.14** $x^2 + 5x + 6$ is not a perfect square: $b^2 = 6$ and $2b = 5$ cannot both hold. Nearly-matching is not matching `[§20]` `#a-near-miss-is-a-miss`
- **S.15** $a^2 + b^2$ matches no binomial formula, however much it looks like one ⇐ C.23 `#sum-of-squares-matches-nothing`
- **S.16** what is inserted must be **one block** or become one: you cannot read $2x+3$ as the $a$ of $ab$ and write $2x+3b$ `[§19]` `#what-is-inserted-must-be-one-block`

### S3 · Strategy — WHICH rule, when several fit

⚠️ **A NOTE, NOT A SECTION. Nothing here is written yet.** Parked so it is not lost, because
S.13 is where the file stops being grammar and nothing after this point follows from the
sections above.

The grammar answers *may I?* — every rule in T is a permission, and a move is legal or it is
not. It never answers *should I?*, and from S.13 on that is the only question left:

- $x^2 - 4$ matches **§33** (difference of squares) and also **§34** (find the pair). Both are
  correct; one is faster.
- $3(x+2) + 6$ can be expanded first `[§6.1]` or factored first `[§13]`. Both are correct; one
  leads somewhere.
- $\frac{a^2 - b^2}{a - b}$ cannot be cancelled until it is factored `[§17.1, §33]` — here the
  order is not taste, it is the difference between finishing and not.

What a strategy layer would have to hold, none of it decided:

1. **Goal states.** "Simplified" is undefined in this file. Every T rule is legal in both
   directions, so without a target *expand* and *collect* are equally valid forever. Probably
   the first thing to write, and probably the hardest.
   - 🟢 **THE FIRST CONCRETE LEAD ON THIS, 2026-08-03 (the author's):** *which move is right is
     often decided by the CONTAINER the block is in.* Goal states may not be free-floating —
     the container may supply them. In a fraction you factor, because factoring is what permits
     cancelling `[§17.1]`; under a root you factor, because that is what permits extracting; in
     a bare sum you are shortening, so you expand in order to collect. That converts *which
     move do I want* into *where am I standing*, which the grammar CAN answer — and this
     section was parked precisely because nothing in the grammar seemed to reach it.
   - ⚠️ **It does not solve S.13.** A container-keyed target says which direction to head; it
     does not rank two legal moves inside the same container, which is where "correct and
     unhelpful" lives. The marking problem below stands untouched.
   - ⚠️ **And the classification it would need is NOT decided** — see the brainstorm at the
     foot of this file. Recorded here as a lead, not as a design.
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
exactly **one runs backwards**: **E.7** ($x(x+1) = x^2 + x$) needs **C.10** ($a \cdot a = a^2$),
because the first product has to become a power. So E.7 is the one item that cannot be taught
in its own milestone — defer it to C, or drop it as a compound. That is the same check
`validateSkillLinks` performs on the old layer's processes, and it wants to exist here too
before the milestones are built on.

⚠️ **Re-run after the conversions moved (2026-08-03): still exactly one, still E.7.** But the
move left an ordering wrinkle INSIDE E that the milestone check cannot see: **E.12 and E.13
need E.18**, which sits six items later. No milestone is violated — they are all in E — but
"order is array position" makes that a real defect once this becomes data. The conversions
belong at the FRONT of E; they are at E.18 only because inserting them there was the change
that did not renumber thirty other items by hand.

### The drill that covers most of it: **equivalent or not**

Show two forms, ask whether they say the same thing. It fits every section because nearly every
item in this file IS an equation, and the distractors are already written — **the boundaries
and the $\neq$ items are the distractor bank.**

| milestone | the question | distractors come from |
|---|---|---|
| **N** | is $3x$ the same as $3 + x$? | N's own wrong readings; `mis.juxtaposition-as-plus` and its family |
| **P1** | what IS this — sum, difference, product, quotient, power, atom? | the tempting operator: $3(x+1)$ looks like a sum, $2x^2$ like a power |
| **P2** | which decomposition is right? | the old `chunking.json` right[] forms are literally the answer key |
| **R** | is this rearrangement legal? | R.10–R.16, the whole "not in a difference or quotient" family |
| **E** | is this expansion legal? | E.22–E.25: Freshman's dream, and never under the bar |
| **C** | is this collected correctly? | C.20–C.23, C.38–C.40: what does not collect |

### ⚠️ Five items the equivalence drill cannot hold

Not everything here is an equation. **N1.3** ($3a$, not $a3$), **N4.1**, **N4.1a**, **N4.1b**
(the two tiers and the ranking) state a convention or a procedure, and there is no second form
to compare against. They need a different question — "what does this say?", or a ranking to put
in order — or they are teacher's material and not drilled at all. Decide per item; do not
stretch the format over them.

⚠️ **Was five; N1.9 left the list by being split** (2026-08-03). Its reading half is now N1.6,
$a \times b = a \cdot b = ab$, which IS an equation and drills like any other; only the writing
half — *this course writes the dot* — was undrillable, and it is prose now. **That split is the
move to try on the other four**, and `[§0.1]`'s tail says why it will not always work.

### The second drill type, which R/E/C earn: **what did that move DO?**

Show one legal step and ask: rearranged, expanded, or collected? It drills the ladder `[T]`
directly, it is markable against a single answer, and it is **the bridge to S**: a student who
can name what a move does can be asked *which do you want here* — and "do I want to open or
close?" is where choosing a rule starts. Worth building before S is written, not after.

### The drill types, as far as they are known

⚠️ **What the items are filtered BY is a live question, and topic is the weak answer.** *Every
item about fractions* is a set of unrelated moves that happen to share a symbol. *Every item
where a factor reaches every block inside a wall* is **one move in four costumes** —
$a(b+c) = ab+ac$ `[E.1]`, $(ab)^n = a^n b^n$ `[E.26]`, $\frac{a+b}{c} = \frac{a}{c}+\frac{b}{c}$
`[E.9]`, $\sqrt{ab} = \sqrt{a}\sqrt{b}$ `[E.28]` — which is exactly the thing a student needs
to see and which topic scatters across four groups. §6.2 already says it as a rule; no field
says it about the items. **A structural filter is worth more than a topical one**, and that is
the argument for whatever classification eventually lands `[brainstorm]`. ⚠️ Not decided, and
deliberately not built into the schema yet.

Kept as a list because it is clearly not closed. **A drill is a TYPE plus a filtered set of
items** — "equivalent or not, over everything tagged multiplication" — so the item layer owes
the drill layer nothing but the tags to filter on.

1. **Equivalent or not.** Two forms, same or different. The broadest by far, because nearly
   every item is an equation and the $\neq$ items are the distractor bank.
2. **What did that move do?** — rearranged, expanded, collected. Drills the ladder `[T]`,
   marks against one answer, and is **the bridge to S**: a student who can name what a move
   does can be asked which they want.
3. **What IS this?** — the type, six options `[P1]`.
4. **Which decomposition?** — the blocks `[P2]`.
5. **Put the brackets in** — insert brackets so the expression says what it already says
   (redundant, `[N3.4]`), or so it says something else. Drills grouping directly, and it is the
   only type so far that asks for PRODUCTION of notation rather than recognition — which is the
   category §0.1's tail says this app cannot otherwise reach.
6. **How many ways?** — rewrite an expression without changing it, as many ways as possible.
   Open-ended, scores by count, and drills R specifically: it is the only type where "more
   answers" is the goal rather than one.
7. **Which rule licenses this?** — show a step, pick the `§`. The reverse index of type 2, and
   the one that makes the rule sheet worth having.

⚠️ **Types 5 and 6 do not mark against a single answer either** — 5 has several correct
bracketings, 6 has no fixed count. They are not strategy, but they share strategy's marking
problem, so whatever solves it there probably serves here too.

⚠️ **And the limit, stated once so the drill layer is not designed around a false hope:**
from S.13 on, several answers are right and differ in quality. Everything above marks against
one answer; strategy does not. That is a different kind of exercise and probably a different
kind of screen.

## When this becomes data — decided 2026-08-02, not yet built

Nothing here is implemented. It is written down so the review pass has it in front of it and
so none of it gets re-argued.

### The shape

```
item
  id             SLUG, kebab-case, stable            ← never the number
  section        "N1" · "P1" · "R" · "E" · "C" · "S1"
  latex          the equation — the item's identity
  note           {en, de}                            the sentence after the dash
  right[]        {latex, rule?}                      the equivalence drill's answer key
  wrong[]        {latex, mistake?}                   the distractor bank
  basedOnRules[] slugs
  basedOnCards[] card ids — ONLY where there is no rule
  basedOnSkills[] slugs — the ⇐ marks
  tags[]         ["multiplication", "brackets"]      filtering only

rule
  id             slug
  text           {de, en}                            German is the authored side
  limitOf        slug of the rule this one limits    ← what ".2" encodes today
  basedOnCards[] optional

section
  id · title {en, de} · blurb? {en, de}
```

### The decisions behind it

- **No `name` field.** An item is a formula plus a sentence; a name would be a third thing
  restating the second, 190 times, with nothing checking it. `shortName` optional, authored
  only where a link needs something shorter than the note — the discipline `rules.json` already
  uses.
- **`id` is a slug; ORDER IS ARRAY POSITION; the number is DERIVED.** Reorder the array and the
  numbers recompute. Renumbering stops being a task — which matters, because two renumbering
  accidents happened in this file on the day it was written.
- **`.1`/`.2` becomes `limitOf`.** The pairing is real structure and is currently living inside
  a string. Explicit, checkable, and it survives reordering.
- **`section` is a field, not an id prefix**, for the same reason.
- **V4 is admitted as a SKILL** — "how many summands does $a - (b+c)$ have?" is a drill
  question, and it is the one V entry that is a *doing* rather than a naming. V2 and V3 stay
  glossary.
- **Retired from the old skill schema**: `process` (the section is the process), `group` (topic
  returns as a `tag`, which is the honest role it always had — a filter, never a spine), and
  **`reversible`** (direction is now the bucket: an R item reads both ways, an E/C pair is one
  law in two directions). `mistakes` stays derived from `wrong[]`.

### The invariant, as an audit line and not a validator

> **Every item reaches the tower** — directly by `basedOnCards`, or through its rule's
> `summarizes`, or through a `basedOnSkills` prerequisite that does.

Measured today: all 90 T items have a rule; 29 of 53 N items have a card and only 6 have a
rule; **18 of 20 P items have neither**, and that is correct rather than a gap — P states
nothing new, it APPLIES N, and its `⇐` marks are its anchor. Some items are legitimately
unanchored (N1.6, "this course writes the dot", is a course decision), which is why
this warns rather than throws.

### How the slugs get added

1. ✅ **DONE 2026-08-02 — 179 item slugs and 42 rule slugs, none duplicated across either
   space, all kebab-case.** Rule slugs are English like the items' (the id is developer-facing;
   the German title is the student-facing name, exactly as `rules.json` already does it), and
   they are worded so no rule collides with the item it licenses — §6.1 is
   `a-factor-reaches-every-summand` where E.1 is `multiply-into-a-sum`.
   The old note: Each line ends in
   `` `#slug` ``, greppable and visually distinct from the `[…]` reference tags. **They are a
   first draft and the review overrules them** — naming an item and reviewing it are the same
   act, and the author knows which handle a class would recognise.
2. **Cross-references stay NUMERIC in the markdown.** `⇐ N4.2` is not rewritten by hand — the
   converter maps number → slug once, at conversion.
3. **A check for uniqueness and kebab-case**, run before conversion.
4. **After conversion the JSON is the source and this file keeps the arguments** — the ladder,
   the vinculum, why "term" is banned — the way `content_model.md` relates to the data. Plus a
   script asserting every id in one exists in the other, or the file quietly rots.

## What left N, and why

Each failed N's test: it needs a law to be true, so it is a move, and it is in T if it is
anywhere.

| was | why it left |
|-----|-------------|
| $3 = +3$ | **deleted outright, not moved.** There is no unary plus: $-3$ names the additive inverse (`ax.additive-inverse`), $+3$ names nothing. A rule saying "the plus is never written" would reintroduce the sign-carrying numeral this project retired — there is one unary minus, and positive/negative are defined by $<$. |
| $a = \frac{a}{1}$ | not an omission — nothing on the page hides a denominator. It is $\frac{a}{1} = a$, a law. |
| $a + 2a = 1a + 2a = 3a$ | collecting like terms, wearing the invisible one as a disguise. |
| $(a+b)+c = a+b+c$ | associativity. |
| $a \cdot (b \cdot c) = abc$ | associativity. |
| $a - (b-c) \neq a-b-c$ | the law about brackets after a minus. |
| naming the main operation | a reading *task* built on N4, not a convention. |
| $-\frac{a}{b} = \frac{-a}{b} = \frac{a}{-b}$ | three places, one value — a theorem. |

## Conventions the tower does not carry yet

`[no card]` above, gathered. Each is either a card `src/data/fundament/` should grow, or an
admission that it is a course decision rather than a mathematical convention.

1. **Juxtaposition beyond $3a$** (N1.1). `ix.juxtaposition` argues the case for a number
   against a letter, from `th.multiple-is-product`. Letter·letter, anything·bracket and
   number·root are the same convention with a different justification — dropping a dot between
   two factors, which needs no theorem at all. ⚠️ **The card should be written over the six
   FORMS `[V5]`, not over the pairs**, now that §0.3 states it once.
2. **Which multiplication sign this course writes** (N1.6) — a course decision, not a card.
3. **A numeral is one atom, however many digits** (N1.2) — place value, and the tower does not
   say it. It is what makes "two numerals side by side" impossible rather than exceptional.
4. ~~Mixed numbers~~ — **DECIDED 2026-08-03: the notation is refused** ($\tfrac{7}{3}$, never
   $2\tfrac{1}{3}$), so no card is needed. It survives as N1.7, a thing not to write.
5. **A bracket is one object** (N3.2), and **the bracket shapes** (N3.3), and **a doubled
   bracket** (N3.4). `ix.brackets` says what brackets *do*, not what they *are*.
6. **The two jobs of the minus glyph** (N5.1). The tower has the unary minus and subtraction
   separately; nothing says the reader must decide which one a given $-$ is.
7. **The radical bar as a bracket** (N6.5, N6.6). `ix.fraction-bar` does exactly this job for
   the fraction bar; the root has no counterpart — and they are the SAME SYMBOL, the vinculum,
   so one card should cover both. **The first one to write.**
8. **Reading a stacked fraction** (N7.5–N7.10): where a bar ends, which bar is the main one,
   that a fraction is one number, and that the bar's extent settles the reading upward as well
   as sideways.
9. **The two tiers of the order of operations** (N4.1, N4.1a, N4.1b). `ix.precedence` and
   `ix.power-precedence` give the ranking; nothing in the tower says the grouping symbols are
   settled FIRST, or that $\cdot$, $/$ and $:$ share one rung while the stacked bar does not.
10. **The power binds to the closest BLOCK** (N4.5a) — the refinement that makes $-2a^2$ and
   $\left(\frac{a}{b}\right)^2$ one rule instead of two.
11. **$a^{b^c}$ reads top-down** (N6.7).

## Open questions

1. ~~N1.10, mixed numbers — teach the exception or refuse the notation.~~ **ANSWERED
   2026-08-03: refused.** $2\tfrac{1}{3}$ is not written; $\tfrac{7}{3}$ is. The author's
   reason is that it is already one of the first things said at the start of high school, so
   the course is not choosing a position here, it is recording one. It stays in the list as
   N1.7 because students still MEET the notation — recognising it and writing it are different
   demands, which is the §0 split again.
2. **N7.1** — does $:$ survive? If not, this line is the bar and the slash.
3. **What comes next.** The equals sign as a claim, $\neq$/$<$/$>$, decimal comma vs point.
   Own section, or not skills at all? *(Naming the parts is answered — it is V.)*
4. **Where do the number-checks live?** R.11, R.13, R.15 substitute numbers to settle a
   question. That is one skill — "test a claim with numbers" — applied three times, not three
   skills, and it only ever appears attached to something else. Cross-cutting, like "read the
   expression aloud" and "estimate the answer"; they may need a section of their own.
5. ~~Does C.6 belong in C?~~ **Answered by step 3 of the test**: summands first, factors
   second. $2 \cdot 3x = 6x$ is collecting at the factor level.
6. ✅ **ANSWERED 2026-08-03 — option (a), and it took BOTH conversions, not one.** The
   question asked whether $\frac{a}{b} = a \cdot \frac{1}{b}$ still counted as R, and recorded
   an asymmetry: $a - b = a + (-b)$ "stays put because difference and sum share a rung". **That
   asymmetry was an artefact.** It came from counting the minus conversion AFTER absorbing and
   the bar conversion AS WRITTEN. Count both as written and both open: $b \to (-b)$ is atom →
   product, $\frac{a}{b} \to a \cdot \frac{1}{b}$ is container(1) → product(2). So §3 and §4
   ARE the same trick at two levels, exactly as V2 always claimed. Now **E.18, E.19** with twins
   **C.15, C.17** — and C.17 is the missing item the question predicted, found by rule-first for
   the fifth time. Option (b) is dead: it existed to explain an asymmetry that is not there.
7. **Does N keep both directions of an identity, or only the meaning?** Decided as: N states
   what the notation means, T holds the two moves (E.12/C.10, E.13/C.11), `⇐` pointing back.
   The alternative — N owns the identity and T cites it without items of its own — would leave
   C.12 ($abca = a^2bc$) depending on something no item performs.
6. **The reverse readings hold.** C.4/C.5 (pull out) are separate items from E.1/E.4
   (multiply in), by the rule that a backward reading with its own classroom name is its own
   skill — and here the two directions now land in different BUCKETS, which is the strongest
   evidence yet that the rule is right.

---

## 🧠 Brainstorm — walls on blocks, and what each container is FOR

**The author's, 2026-08-03. Nothing here is decided and nothing is implemented.** Recorded
because two of the three threads land on parts of the file that are already written, and one of
them says something in V is too strong.

### 1 · Do BLOCKS have walls?

Only if the block is itself a container — walls are not something a block has by being a block.
In $2x - \sqrt{y}$ the two blocks are $2x$, which has none, and $\sqrt{y}$, which has its own.

⚠️ **And here is the catch, which is new: REWRITING a block in place can create the need for
walls that were not there before.**

$$2x - 2(x+1)$$

The second block is $2(x+1)$. Expand it on its own — legitimately, it is an island — and it
becomes $2x+2$. Put that back bare and you have written

$$2x - 2x + 2 \qquad \text{which reads } (2x-2x)+2 \text{ — wrong}$$

when what the island principle promised was $2x - (2x+2)$. **The block's top operator changed**
— it was a product, it is now a sum — and a sum in that position is outbid, so it needs a wall
it did not need a moment ago.

⚠️ **THIS QUALIFIES THE ISLAND PRINCIPLE AT THE TOP OF V, WHICH IS CURRENTLY TOO STRONG.** It
says the rest of the expression "neither notices nor changes". True of the *rest*; not true of
the *boundary*. The honest version:

> A block is an island. Work on it alone, and what it becomes goes back in the same place —
> **but check its walls on the way back in.** Rewriting can change a block's top operator, and
> a block that no longer outranks its surroundings must be walled.

**So a rule is missing, and it is one "aimed at the outside".** Everything the file has about
brackets is aimed inward — §0.4 asks whether an INSERTED expression needs walls `[S.2]`. Nothing
asks the question after a rewrite, which is the same question with the same answer and a
different trigger. It is not automatic and it does not come for free.

⚠️ **A mistake-layer consequence worth chasing: two different mistakes produce the same
string.** $2x - 2(x+1) = 2x - 2x + 2$ can be *failing to distribute the minus over the second
summand*, or *expanding the block correctly and dropping its walls*. Same wrong page, different
repair. The pool almost certainly only has the first.

### 2 · Does the structural vocabulary earn its keep?

The claim: yes, because it is **load-bearing rather than descriptive**. "Container" is not a
label for a family of shapes — it carries one property they all share and then divides them by
the properties they do not.

**Shared by every container:** invariance to position `[V1]`.

**Different for each container:** what may be done INSIDE it, and this is where the power laws,
the root laws and the fraction laws stop being a list to memorise. Each container distributes
over ONE inner operation in ONE slot, and refuses the other:

| container | slot | inner $+$ | inner $\cdot$ |
|---|---|---|---|
| **power** | base | ✗ $(a+b)^2 \neq a^2+b^2$ `[E.23]` | ✓ $(ab)^n = a^n b^n$ `[E.26]` |
| **power** | exponent | ✓ $a^{m+n} = a^m a^n$ `[E.30]` | ✓ $a^{mn} = (a^m)^n$ `[C.27]` |
| **root** | radicand | ✗ $\sqrt{a+b}$ `[E.24]` | ✓ $\sqrt[n]{ab} = \sqrt[n]{a}\sqrt[n]{b}$ `[E.28]` |
| **fraction** | numerator | ✓ $\frac{a+b}{c} = \frac{a}{c}+\frac{b}{c}$ `[E.9]` | — |
| **fraction** | denominator | ✗ $\frac{c}{a+b}$ `[E.22]` | ✓ $\frac{c}{ab} = \frac{c}{a}\cdot\frac{1}{b}$ |
| **bracket** | its one chamber | — it performs no operation, so there is nothing to distribute over | — |

⚠️ **The brainstorm's original form said "a container over a multiplication splits, over a sum
it does not". That is right for the power and the root and BACKWARDS for the fraction
numerator**, where a sum splits and is the whole of §8.1. The correction makes the structure
better, not worse: the rule is not *sums never split*, it is **each container has its own
operation and its own slot**, which is why §8.1 and §8.2 are a pair and why §6.2 exists.

**And the deeper pattern, if it holds:** a container TRANSLATES one operation into another. An
exponent's $+$ becomes a $\cdot$ outside `[E.30]`; an exponent's $\cdot$ becomes a nesting
`[C.27]`; a numerator's $+$ stays a $+$ `[E.9]`. Worth testing against the rest of the law
layer — if it survives, the power and fraction laws are one idea with five instances rather
than five laws.

**Inside a block there are only the three moves** — expanding, collecting, rearranging `[T]`.
Nothing else has turned up, which is the ladder's falsification test passing from a third
direction.

### 3 · The consequence for S3, which is currently parked and empty

> **Which of the three moves is the right one is often decided by the container the block is
> IN.**

That is the first concrete principle S3 has had. S3 asks *which rule, when several fit* and
currently answers "undecided, and goal states are probably the hardest part". This says goal
states are not free-floating — **the container sets them**:

- inside a **fraction** → factor, because factoring is what lets you cancel `[§17.1]`
- under a **root** → factor, because factoring is what lets you pull something out
- in a bare **sum** you are trying to shorten → expand, because expanding is what lets you
  collect like summands
- in a **power's base** → depends, and this is the one to think about

⚠️ Not a claim that strategy reduces to a lookup table. But it converts "which move do I want?"
from taste into a question about **where you are standing**, and that is structural — which was
the point of the whole vocabulary.

### 4 · Reading of the above — what is solid, what is a correction, what is untested

Written by Claude, 2026-08-03, kept separate so the brainstorm above stays the author's. Five
verdicts and their grounds.

**① The island defect is real, and it has been FIXED in V rather than left here.** The
principle claimed the rest of the expression "neither notices nor changes"; that holds for the
rest and fails at the boundary, and $2x - 2(x+1)$ is a two-line proof. The qualified form is now
at the top of V. ⚠️ **Note what kind of error it was**: not a wrong claim about algebra, but a
promise stated without its precondition — the most expensive kind in a file whose method is
*write the rule first*, because a rule that overpromises still produces items that are each
individually correct.

**② The missing rule is genuinely missing, and its shape is predictable.** Every bracket
question here points inward, at something being INSERTED — §0.4, S.2, S.3–S.8. The rewrite case
has the same criterion (does the block's top operator get outbid where it stands?) and no home.
Writing it should follow the file's own method — state the rule, then hunt the items — and the
items are likely to be several: the minus case above, the same over a fraction bar, the same
under a root.

**③ The "multiplication splits, a sum does not" claim was BACKWARDS for the fraction, and the
correction is the interesting part.** Power and root distribute over $\cdot$ and refuse $+$; the
fraction numerator does the opposite `[§8.1]`, and the denominator refuses both `[§8.2]`. So the
generalisation is not about which operation is friendly — it is that **each container has its
own operation in its own slot**, which is exactly why §8.1/§8.2 are a numbered pair and why §6.2
must exist separately. Stated the first way the rule would have been memorable, wrong, and would
have licensed refusing $\frac{a+b}{c} = \frac{a}{c}+\frac{b}{c}$.

**④ The translation pattern is the biggest claim in the section and it is UNTESTED.** *A
container translates one operation into another* — exponent-$+$ to outer-$\cdot$ `[E.30]`,
exponent-$\cdot$ to nesting `[C.27]`, numerator-$+$ to outer-$+$ `[E.9]`. If it survives the
whole law layer it is worth more than anything else here: the power and fraction laws collapse
from five laws into one idea with five instances — the same economy §25 achieved when *eine
Wurzel ist eine Potenz* retired the four root laws before they were written. **Test it the way
the ladder was tested**: assert it, throw every law in T at it, and look for the one needing a
special case. Until then it is a conjecture, and this file has been wrong before about patterns
that looked this clean.

**⑤ The S3 consequence is the most immediately usable thing in the brainstorm.** S3 is parked
with its hardest problem named — *goal states are undefined; every T rule is legal in both
directions, so without a target expand and collect are equally valid forever*. **The container
supplies the target.** In a fraction you factor because factoring is what permits cancelling;
under a root because that is what permits extracting; in a sum you are shortening, so you expand
in order to collect. That converts *which move do I want* into *where am I standing*, which the
grammar can answer — and S3 was parked precisely because nothing in the grammar seemed to reach
it.

⚠️ **What it does NOT solve, so the parking notice stays accurate.** S.13's real difficulty is
that several answers are right and differ in quality, and a container-keyed target does not rank
two legal moves inside the same container. The marking problem is untouched.

### 5 · Measured — is the structural position DERIVABLE? (2026-08-03)

The axis the brainstorm points at — *where does a move sit relative to a wall* — was tested for
derivability before deciding whether it needs a field. **All 94 T items hand-labelled** against
a stated four-way criterion, then a heuristic run over the `latex` alone and compared.

    between   no wall on either side
    wall      a wall is built / removed / relocated / exchanged; nothing distributed
    across    something is distributed INTO, or factored OUT OF, a walled region
    inside    the move happens within one surviving container's slots
    none      no relation stated (the boundary items)

| axis | derivable from latex alone |
|---|---|
| **4-way** between · wall · across · inside | **71 %** |
| **3-way** between · involves-a-wall · inside | **93 %** |
| **2-way** block-level · container-level | **96 %** |

⚠️ **So the answer depends entirely on how many values the axis has, and that is the finding.**
A fine axis must be AUTHORED — 71 % is not a rate to build a drill filter on. A coarse one can
be DERIVED with about five items to hand-check.

**The 71 % fails systematically, not randomly.** Twenty of the twenty-seven misses are one
confusion, `across` ↔ `wall`, from three causes:

1. **Numerals and the minus are invisible to a surface count.** $3(x+2) = 3x+6$ distributes a
   $3$, but the arithmetic hides the duplication; $-(a+b) = -a-b$ distributes a minus, which is
   not a symbol to count; $x(x+1) = x^2+x$ has two $x$ a side because the exponent absorbed one.
2. **Unfolding a power looks exactly like distributing.** $a^2 = a \cdot a$ doubles the $a$ with
   nothing crossing anything.
3. **Container exchange looks like crossing.** $a^{-n} = \frac{1}{a^n}$ and
   $\sqrt[n]{a} = a^{1/n}$ respell one container as another; nothing moves in or out.

⚠️ **§0.4 turns out to be load-bearing for DERIVATION, not only for teaching.** $a - b = a + (-b)$
misderives because the test counts the bracket in $(-b)$ as a wall — and §0.4 has just
established that it is a writing habit and not one. Marking the two kinds of bracket in the data
would remove those misses outright. That is an argument for §0.4 becoming a field, quite
separate from why it was written.

⚠️ **Caveat on the number, because it changes how much to trust it.** The same author wrote the
hand labels AND the heuristic, so this measures *can a mechanical rule reproduce that judgment*,
not *is the axis objectively derivable*. The `wall`/`across` boundary is exactly where the
labelling was least certain, so **71 % is the soft figure and 93 % / 96 % are the robust ones** —
they do not depend on that boundary at all.

**Script**: written to the session scratchpad, not committed. Re-deriving it is ten minutes; the
numbers above are what matter.
