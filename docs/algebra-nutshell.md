# Algebra in a Nutshell

(Part 1 · algebra without special blocks · Part 2 · the special blocks — to come.)

## Part 0

What numbers mean before any letter appears.

### 1 · The number line

>Every number is a *point on a line*. That is all a number is here.

- $0$ is the mark we start from.
- $3$ is the point three steps to the *right* of $0$.
- $-3$ (negative 3) is the point three steps to the *left* of $0$.
- $1.5$ lies halfway between $1$ and $2$; every point on the line is a number.

$$\cdots\;-3\;\;-2\;\;-1\;\;\;0\;\;\;1\;\;\;2\;\;\;3\;\cdots$$

>**Def:** A number further to the right is *bigger*, a number further to the left is *smaller*.

Example: $-3$ is smaller than $-2$, and both are smaller than $0$.

### 2 · The negative sign is a mirror

>**Note:** $-3$ is not "three with something stuck on it". It is the point you get by *mirroring $3$ across $0$*: three steps to the left of $0$, as in (1). So the negative sign is an *instruction* — mirror across $0$ — and not part of the digit.

$$3 \;\xrightarrow{\text{ mirror }}\; -3 \qquad\qquad -3 \;\xrightarrow{\text{ mirror }}\; 3$$

Two consequences:

- Mirroring twice brings you back: $--3 = 3$.
- $0$ is its own mirror image: $-0 = 0$.

>**Note:** $--3$ needs no bracket — it is two mirrors applied one after the other. You will sometimes see it written $-(-3)$, but the bracket changes nothing here, so we leave it out.

### 3 · Adding and subtracting is moving

>**Def:** $5+3$ ($5$ *plus* $3$) means: start at $5$ and make the move that takes you from $0$ to $3$.

As we move $3$ steps to the right, we get

$$5+3 = 8$$

What about $5+-3$? The move from $0$ to $-3$ is three steps to the left, since $-3$ is the mirror of $3$ (2). Starting at $5$ and making that move:

$$5+-3 = 2$$

Notice that $5+-3$ is *smaller* than $5$. Adding does not always make things bigger — it moves you in whichever direction the number lies from $0$. Only adding a positive number moves you to the right.

And we also have

$$-5+3=-2\qquad -5+-3=-8$$

You already know subtracting as *taking away*: $5$ things, take $3$ away, $2$ left. On the line that is moving $3$ steps to the left, so it is the same thing. It only runs out when what you take away is itself negative — taking away $-3$ things is not a picture of anything.

So subtracting is defined in the same shape as adding, with the mirror put in:

>**Def:** $5-3$ ($5$ *minus* $3$) means: start at $5$ and make the move that takes you from $0$ to the *mirror image* of $3$. In short, $5-3 = 5+-3$.

Consequence:

$$5--3=5+3=8$$

The definition says: make the move from $0$ to the mirror image of $-3$. The mirror of $-3$ is $3$ (2), and the move from $0$ to $3$ is three steps to the right — which is exactly the move $5+3$ asks for.

Thus we have recovered the rules you already know from primary school:

>**Rule:** $\;--\;$ becomes $+$, and $\;+-\;$ becomes $-$.

#### The minus has two jobs

In $5--3$ and $5+-3$ two signs stand next to each other, and they are doing different things.

>**Note:** In $5-3$ the minus is an *operator*: it says subtract. In $-3$ it is a *negative sign*: it says mirror across $0$.

Which is which is never in doubt, because position decides it. The first minus has a number on its left, so it can only subtract — there is nothing for it to mirror. The second has an operator on its left, so it can only mirror — there is nothing for it to subtract from.

>**Note:** You will often see this written $5-(-3)$, and $5+(-3)$ instead of $5+-3$. It means exactly the same. Again, as with $--3$, we leave those brackets out, so that a bracket always signals something essential.

### 4 · Multiplying is stretching

Multiplying is repeated adding, and nothing new is needed to say so:

>**Def:** $3\cdot 4$ ($3$ *times* $4$) means: add $4$ three times over. $\;3\cdot4 = 4+4+4$

$$3\cdot 4 = 12 \qquad\qquad 1\cdot 4 = 4 \qquad\qquad 0\cdot 4 = 0 \qquad\qquad 4\cdot 0 = 0$$

The last two are not special cases. *Zero copies of $4$* means you never leave $0$; and *four copies of $0$* is $0+0+0+0$, which also never leaves $0$.

This already covers a negative number, because (3) told us how to add one:

$$3\cdot-4 \;=\; -4+-4+-4 \;=\; -4-4-4 \;=\; -12$$

**On the line** it looks like this: three copies of the distance from $0$ to $4$, laid end to end, land you *three times as far from $0$* as $4$ is. Multiplying **stretches away from $0$**.

>**Note:** *Three times as far* is shorthand for *lay the distance out three times*, and nothing more. Read the other way round it would be using multiplying to explain multiplying.

The picture is worth keeping because it survives where the counting does not. *Four, one third times over* is not a picture of anything, but *one third as far* still is:

>**Note:** For $1.2$ times as far, cut the distance from $0$ to $4$ into **ten equal parts** and lay out **twelve** of them. Any fraction works the same way: $\frac pq$ times as far means cut into $q$ parts and lay out $p$.
>$$1.2\cdot 4 = 4.8 \qquad\qquad \tfrac13\cdot 12 = 4$$

#### A negative factor

Here the definition genuinely runs out. You cannot lay a distance out $-3$ times. So write down what is already fixed and see whether there is any room left. Each step down in the first factor takes away one $4$:

$$3\cdot4 = 12 \quad 2\cdot4 = 8 \quad 1\cdot4 = 4 \quad 0\cdot4 = 0 \quad -1\cdot4 = -4 \quad -2\cdot4 = -8$$

There is only one way to carry on, so we take it:

>**Def:** For a *negative* factor, lay the distance out as many times as its size says, and then **mirror** across $0$ (2). $\;-3\cdot4 = -12$

>**Note:** We are not discovering what $-3\cdot4$ means — there is nothing there to discover. We are *choosing* the only reading that keeps everything above true.

>**Rule:** A negative factor stretches *and mirrors*.

>**Note:** The mirror belongs to the *factor*, not to the number being stretched. In $3\cdot-4$ the factor is $3$, which is positive, so nothing is mirrored — the point $-4$ was already on the left, and it simply moves three times further out.
>$$3\cdot-4 = -12$$

With two negatives the mirror is applied twice, and *mirroring twice brings you back* (2):

$$-1\cdot-1 = 1 \qquad\qquad -3\cdot-4 = 12$$

>**Rule:** And we have recovered another rule from primary school: $-\cdot-$ gives $+$, and $-\cdot+$ gives $-$.

>**Note:** Multiplying by $-1$ *is* the mirror from (2). That is why the minus sign and the times sign keep turning into each other.

>**Note:** This rule looks like the one in (3), and it is *not the same rule*. Tell them apart by asking what each sign is doing:

| | the signs | |
|---|---|---|
| $5--3$ | an *operator* meets a *negative sign*, side by side | they merge into one operator: $5+3$ |
| $-3\cdot-4$ | two *negative signs*, one on each number, with the operator between them | they fix the sign of the answer: $+12$ |

In (3) the two signs are neighbours and collapse into one. Here they are not neighbours at all — each belongs to its own number, and the $\cdot$ never goes away.

Stretching the point $0$ leads nowhere, because $0$ is no distance from $0$ to begin with:

$$7\cdot 0 = 0 \qquad\qquad -3\cdot 0 = 0$$

### 5 · $\frac13$ is the undo of $\cdot\, 3$

>**Def:** $\frac13$ is the number that turns $3$ back into $1$.

$$3\cdot\tfrac13 = 1$$

Stretching by $3$ makes things three times as far from $0$; stretching by $\frac13$ brings them back. Every number has such an undo — with one exception, and (6) comes back to it.

Dividing is not a new operation either:

>**Def:** To divide by a number, you multiply by its undo.

$$\frac{12}{3} \;=\; 12\cdot\tfrac13 \;=\; 4$$

>**Rule:** Subtracting is adding the mirror. Dividing is multiplying by the undo.

The same idea twice — which means there are really only *two* operations, $+$ and $\cdot$.

#### Three ways to write it, and we use one

$$12:3 \qquad\qquad 12/3 \qquad\qquad \frac{12}{3}$$

All three mean the same thing. From here on we write only $\dfrac{12}{3}$.

This is not fussiness. The bar *holds the top and the bottom together*, so it says on the page what the other two need a rule for:

| | |
|---|---|
| $12:3+1$ | needs a convention to know whether the $+1$ is inside |
| $\dfrac{12}{3}+1 \;=\; 5$ | says it |
| $\dfrac{12}{3+1} \;=\; 3$ | says the other one |

>**Note:** Choosing the notation removes the question instead of answering it.

That is why $:$ and $/$ are not used from here on, except where we are talking about them.

### 6 · Four observations that run through everything

Every number has a partner that cancels it out. For adding, it is the mirror image:

$$3+-3 = 0 \qquad\qquad 1.5+-1.5 = 0$$

and the same holds for every number. For multiplying, it is the undo:

$$3\cdot\tfrac13 = 1 \qquad\qquad 5\cdot\tfrac15 = 1$$

and the same holds for every number *except one*. And each of the two operations has a number that changes nothing:

$$3+0 = 3 \qquad\qquad 3\cdot 1 = 3$$

*(The names, in case you meet them: $0$ and $1$ are the neutral elements, and the mirror image and the undo are the inverses. The names are not the point — the lines above are.)*

The exception is the only one in all of Part 0, and it is worth its own line:

>**Rule:** $0$ has no undo. Stretching $0$ leaves it at $0$, whatever the factor, so no number turns $0$ into $1$. That means $\frac10$ does not exist, and *dividing by $0$ is not allowed*.

Everything you will ever be told about "not allowed" in algebra comes back to this.

#### Order does not matter

$$5+3 \;=\; 3+5 \qquad\qquad 3\cdot4 \;=\; 4\cdot3$$

For adding you can see it on the line. Two moves, one of $5$ and one of $3$: it makes no difference which you make first, you arrive at the same point.

For multiplying the line does *not* show it — $3\cdot4$ lays the $4$-distance out three times, $4\cdot3$ lays the $3$-distance out four times, and nothing about the line makes those obviously equal. What shows it is a **rectangle of dots**: three rows of four is four columns of three, one and the same rectangle counted two ways.

>**Rule:** In a sum you may swap the summands, and in a product you may swap the factors.

#### Grouping does not matter

$$(5+3)+2 \;=\; 5+(3+2) \qquad\qquad (3\cdot4)\cdot2 \;=\; 3\cdot(4\cdot2)$$

For adding, again the line: three moves one after another, and where you pause makes no difference to where you end up.

>**Rule:** In a sum of several numbers, and in a product of several numbers, it does not matter how you group them.

>**Note:** The rectangle only counts whole numbers, and it cannot be drawn for $\frac13$ or for $-4$. For those the two rules are *carried over*, not shown — the same move as the negative factor in (4): we keep the rules that already hold and let them fix the rest. Nothing goes wrong if you do, and a great deal would go wrong if you did not.

These last two look too obvious to write down. They are not — Part 1 is almost entirely built on them.

### 7 · Working things out: what comes first

An expression like $2+3\cdot 4$ can be read in two ways, so there is a convention:

>**Rule:** Multiplication comes before addition and subtraction.

$$2+3\cdot 4 \;=\; 2+12 \;=\; 14 \qquad \text{not } 5\cdot4 = 20$$

And several minuses in a row? The convention is *left to right*:

$$10-4-3 \;=\; 6-3 \;=\; 3$$

But you never actually need that one, because (3) already settled it. Read the minuses as mirrors and the parts are $10$, $-4$ and $-3$; add them in any order and you still land on $3$.

And for dividing there is nothing left to settle at all, because we write fractions (5). $12:3\cdot 2$ needs a rule; $\dfrac{12}{3}\cdot 2$ does not.

#### Brackets

>**Def:** A bracket says: *this is one thing — deal with it first.*

$$(2+3)\cdot 4 \;=\; 5\cdot 4 \;=\; 20$$

A bracket is how you say something the convention would otherwise say differently. So there are two kinds, and only one of them is doing work:

- $2+(3\cdot 4)$ and $2+3\cdot 4$ are the same. The bracket only makes the reading visible.
- $(2+3)\cdot 4$ and $2+3\cdot 4$ are *not* the same. Remove that bracket and the number changes.

>**Rule:** Take the bracket away and read again. Same thing → it was optional. Different thing → it was doing work.

This is why we left the brackets out of $--3$ and $5+-3$ (2, 3). Those change nothing, and a bracket that changes nothing is worth less than a bracket that always means something.

### 8 · Why any of this matters for algebra

Everything above is about *numbers*, and not one letter has appeared. Algebra puts letters where the numbers were.

>**Rule:** A letter stands for a number. So anything that is true for *all* numbers may be used as a rule for letters.

That is the whole licence. "Every number plus its mirror image gives $0$" is a fact about every number, so it becomes a rule you may apply to $x$, to $2y$, or to anything else standing in that place — without knowing which number it is.

*Part 1 is that licence, used carefully.*
