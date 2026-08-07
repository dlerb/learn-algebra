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

For whole numbers you can read $3\cdot 4$ as *four, three times over*. That stops working as soon as the factor is $\frac13$ or $-2$, so use the picture that always works:

>**Def:** $3\cdot 4$ means: take $4$ and *stretch it away from $0$* by the factor $3$.

$$3\cdot 4 = 12$$

What should a negative factor do? Nothing has to be decided — write the pattern down and there is only one way to continue it. Each step down in the first factor takes away one $4$:

$$3\cdot4 = 12 \qquad 2\cdot4 = 8 \qquad 1\cdot4 = 4 \qquad 0\cdot4 = 0$$

$$-1\cdot4 = -4 \qquad -2\cdot4 = -8$$

>**Rule:** A negative factor stretches *and mirrors*.

Now do the same on the other side. Each step down in the second factor adds one:

$$-1\cdot2 = -2 \qquad -1\cdot1 = -1 \qquad -1\cdot0 = 0 \qquad -1\cdot-1 = 1 \qquad -1\cdot-2 = 2$$

So the sign rule is nothing to memorise. It is *mirroring twice brings you back* (2), seen again:

$$-3\cdot-4 = 12$$

>**Rule:** $-\cdot-$ gives $+$, and $-\cdot+$ gives $-$.

>**Note:** Multiplying by $-1$ *is* the mirror from (2). That is why the minus sign and the times sign keep turning into each other.

>**Note:** This rule looks like the one in (3), and it is *not the same rule*. Tell them apart by asking what each sign is doing:

| | the signs | |
|---|---|---|
| $5--3$ | an *operator* meets a *negative sign*, side by side | they merge into one operator: $5+3$ |
| $-3\cdot-4$ | two *negative signs*, one on each number, with the operator between them | they fix the sign of the answer: $+12$ |

In (3) the two signs are neighbours and collapse into one. Here they are not neighbours at all — each belongs to its own number, and the $\cdot$ never goes away.

Stretching by $0$ collapses everything onto $0$, whatever you started with:

$$7\cdot 0 = 0 \qquad -3\cdot 0 = 0$$

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

### 6 · Two observations that run through everything

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
