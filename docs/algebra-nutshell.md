# Algebra in a Nutshell

(Part 1 · algebra without special blocks · Part 2 · the special blocks — to come.)

## Part 0

What numbers mean before any letter appears. We start with the positive whole numbers (natural numbers) on the number line and construct the negative and rational numbers from those, using simple images and instructions. Then we derive the typical calculation laws from these pictures. Not included in the discussion are the construction of the irrational numbers.

>**Note:** You already know these numbers and how to work with them. This part does not define them again — it *draws* them on a line, so that what you **do** with them can be seen, and so that the rules in Part 1 look inevitable rather than arbitrary.

>**Note:** That is why most of what follows is marked **Picture** and not **Def**. A *Picture* shows you something you already do. A **Def** appears only three times, at the three places where something genuinely had to be **chosen** — and each one says so.

### 1 · The number line

>Every number is a *point on a line*. The number $0$ is the starting point of the line, and the step from $0$ to $1$ is a *unit step*. 

The line and its points are there already — you have used them since primary school. What matters here is **how you get to them**, because those few moves are what every rule later on is made of.

On the number line:

- To find $3$, take three unit steps to the *right* from $0$. Every natural number says how many steps to take.
- To find $\tfrac13$ ("$1$ over $3$"), *cut* the unit step into *three equal parts*; the first part ends at $\tfrac13$. To find $\tfrac35$ ("$3$ over $5$"), cut the unit step into *five* parts and *join three* copies of one such part. The number below says into how many parts to *cut*, the number above how many to *join*. A whole number needs no cutting: $3$ is three unit steps *joined*.
- To find $-3$ (*negative $3$*), *mirror* the point $3$ across $0$: you land three steps to the left of $0$.

>**Note:** The negative sign is an *instruction* — mirror across $0$ — and not part of the digit. Mirror $3$ and you get $-3$; mirror $-3$ and you get $3$ back, so $--3=3$. And $0$ is its own mirror image: $-0=0$.

>**Note:** $--3$ needs no bracket — it is simply two mirrors, one after the other. You will sometimes see it written $-(-3)$, but the bracket changes nothing here, so we leave it out.

Every rational point on the line is reached by these moves — *stepping*, *cutting*, *joining*, *mirroring*. The irrational points are on the line too; we will not discuss how they are reached.

>**Picture:** A number on the number line further to the right of another number is *bigger*, a number further to the left of another number is *smaller*.

Example: $2$ is smaller than $3$, and both are bigger than $0$. $-2$ is bigger than $-3$ and both are smaller than $0$.

### 3 · Adding and subtracting is moving

(1) said how to *reach* each number. Those same moves are what adding uses. Every number carries one: $3$ carries *three unit steps to the right*, $-3$ carries *three unit steps to the left*, $\tfrac13$ carries *a third of a step to the right*. A move is a length and a direction, so it can be made from anywhere — not only from $0$.

>**Picture:** $5+3$ ($5$ *plus* $3$) means: **join** $5$'s move and $3$'s move — carry out one, then the other.

$$5+3 = 8$$

Five unit steps to the right, then three more. The word *join* comes back in (4), there with copies of a single move.

Nothing new is needed for a negative number, because it carries a move like any other:

$$5+-3 = 2$$

Five to the right, then three to the *left*. Notice that this is *smaller* than $5$: adding does not always make things bigger — you go whichever way the second move points, and only a positive number points right.

And we also have

$$-5+3=-2\qquad -5+-3=-8$$

Fractions carry moves too (1). Three thirds fill the piece from $0$ to $1$ exactly:

$$\tfrac13+\tfrac13 = \tfrac23 \qquad\qquad \tfrac13+\tfrac13+\tfrac13 = 1$$

You already know subtracting as *taking away*: $5$ things, take $3$ away, $2$ left. On the line that is going three unit steps to the left, so it is the same thing. It only runs out when what you take away is itself negative — taking away $-3$ things is not a picture of anything.

Subtracting is the same as adding, with one word changed:

>**Picture:** $5-3$ ($5$ *minus* $3$) means: join $5$'s move and the **mirror** of $3$'s move — same length, the other way.

$$5-3 = 2$$

The two definitions differ only in that one word, which is why

$$5-3 \;=\; 5+-3$$

and it settles $5--3$ in one reading: $-3$ carries *three to the left*; mirrored, that is *three to the right*.

$$5--3 = 8$$

Thus we have recovered the rules you already know from primary school:

>**Rule:** $\;--\;$ becomes $+$, and $\;+-\;$ becomes $-$.

#### The minus has two jobs

In $5--3$ and $5+-3$ two signs stand next to each other, and they are doing different things.

>**Note:** In $5-3$ the minus is an *operator*: it says subtract. In $-3$ it is a *negative sign*: it says mirror across $0$.

Which is which is never in doubt, because position decides it. The first minus has a number on its left, so it can only subtract — there is nothing for it to mirror. The second has an operator on its left, so it can only mirror — there is nothing for it to subtract from.

>**Note:** You will often see this written $5-(-3)$, and $5+(-3)$ instead of $5+-3$. It means exactly the same. Again, as with $--3$, we leave those brackets out, so that a bracket always signals something essential.

### 4 · Multiplying is stretching

Multiplying is repeated adding.

>**Picture:** $3\cdot 4$ ($3$ *times* $4$) means: add $4$ three times over. $$\;3\cdot4 = 4+4+4$$

$$3\cdot 4 = 12 \qquad 1\cdot 4 = 4 \qquad 3\cdot -4=-12 \qquad 0\cdot 4 = 0 \qquad 4\cdot 0 = 0$$

The last two are not special cases. *Zero copies of $4$* means you never leave $0$; and *four copies of $0$* is $0+0+0+0$, which also never leaves $0$. And it is $3\cdot -4= -4+-4+-4 = -12$.

On the line $3\cdot 4$ looks like this: take the distance from $0$ to $4$ and *join* three copies of it, end to end. You land *three times* as far from $0$ as $4$ is. Multiplying *stretches away from $0$*. The first factor is not a point on the line, but an instruction that tells you how often to join copies. This factor is also called the *stretching factor*.


#### A stretching factor that is not whole

Here the definition runs out. *Add $12$, one third times over* is not a picture of anything. But there is a second instruction available, and it is the opposite of the first one:

>**Def:** $\tfrac13\cdot 12$ means: **cut** the distance from $0$ to $12$ into three equal parts and take the first one. $\;\tfrac13\cdot12 = 4$

So the first factor names a number and one of two opposite jobs:

| first factor | instruction |
|---|---|
| $3$ | **join** $3$ copies |
| $\tfrac13$ | **cut** into $3$ parts |
| $\tfrac35$ | **cut** into $5$ parts, then **join** $3$ copies of the first one |

$$\tfrac23\cdot 12 = 8 \qquad\qquad \tfrac12\cdot 4 = 2$$

>**Note:** The last row covers everything, because a whole number is a fraction too: $3 = \tfrac31$. Cut into one part — that is, do not cut — and join three. **One recipe, and the two earlier ones are the cases where a verb does nothing.**

>**Note:** A fraction has only *one* meaning, and it is the instruction. When it stands alone as a number, the instruction has simply been carried out on $1$:
>$$\tfrac23 \;=\; \tfrac23\cdot 1$$
>Cut the unit step into three, join two — which is exactly how (1) located the point. So there are not two kinds of fraction. There is one, and (1) was the case where the thing being cut was the unit step.

>**Note:** Why should cutting be the right reading? Because the other order is already fixed and cannot be argued with. Twelve copies of $\tfrac13$, joined end to end, make $4$ — three thirds to each whole, four wholes:
>$$12\cdot\tfrac13 \;=\; \underbrace{\tfrac13+\tfrac13+\cdots+\tfrac13}_{12} \;=\; 4$$
>So if $\tfrac13\cdot12$ is to mean anything sensible, it must be $4$ as well — and cutting into three is what delivers it.

And here an old habit breaks:

$$\tfrac12\cdot 4 = 2$$

which is *smaller* than $4$. Multiplying does not always make things bigger. A factor bigger than $1$ stretches out, a factor between $0$ and $1$ pulls in, and $1$ itself changes nothing. That habit came from the days when every factor was a whole number — from multiplying being repeated adding. The same thing happened to adding and to taking away in (3).

#### A negative factor

Here both instructions run out. You cannot join $-3$ copies, and you cannot cut into $-3$ parts. So write down what is already fixed and see whether there is any room left. Each step down in the first factor takes away one $4$:

$$3\cdot4 = 12 \quad 2\cdot4 = 8 \quad 1\cdot4 = 4 \quad 0\cdot4 = 0 \quad -1\cdot4 = -4 \quad -2\cdot4 = -8$$

There is only one way to carry on, so we take it:

>**Def:** A *negative* factor is an instruction with **two steps**: carry out what its size says — join or cut — and then **mirror** across $0$ (1).

So $-4$ says *join four copies, then mirror*, and you can watch it happen:

$$-4\cdot3: \qquad 3 \;\xrightarrow{\ \text{join 4}\ }\; 12 \;\xrightarrow{\ \text{mirror}\ }\; -12$$

>**Note:** We are not discovering what $-4\cdot3$ means — there is nothing there to discover. We are *choosing* the only reading that keeps everything above true.

>**Note:** The answer is the same as $-(4\cdot3)$, but that is not the same way of looking at it. There the minus sits *outside* and mirrors the answer; here it belongs to the factor, and the factor stays what (4) said it was — **one instruction**, now with two steps. Keeping it inside is what lets $-4\cdot-3$ be read straight off: join four copies of the $(-3)$-distance, giving $-12$, then mirror, giving $12$. One mirror, and it comes from the factor.

>**Rule:** A negative factor stretches *and mirrors*.

>**Note:** The mirror belongs to the *factor*, not to the number being stretched. In $3\cdot-4$ the factor is $3$, which is positive, so nothing is mirrored — you simply join three copies of a distance that already runs to the left.
>$$3\cdot-4 = -12$$

With two negatives the mirror is applied twice, and *mirroring twice brings you back* (1):

$$-1\cdot-1 = 1 \qquad\qquad -3\cdot-4 = 12$$

>**Rule:** And we have recovered another rule from primary school: $-\cdot-$ gives $+$, and $-\cdot+$ gives $-$.

>**Note:** Multiplying by $-1$ *is* the mirror from (1). That is why the minus sign and the times sign keep turning into each other.

>**Note:** This rule looks like the one in (3), and it is *not the same rule*. Tell them apart by asking what each sign is doing:

| | the signs | |
|---|---|---|
| $5--3$ | an *operator* meets a *negative sign*, side by side | they merge into one operator: $5+3$ |
| $-3\cdot-4$ | two *negative signs*, one on each number, with the operator between them | they fix the sign of the answer: $+12$ |

In (3) the two signs are neighbours and collapse into one. Here they are not neighbours at all — each belongs to its own number, and the $\cdot$ never goes away.

Joining or cutting the point $0$ leads nowhere, because $0$ is no distance from $0$ to begin with:

$$7\cdot 0 = 0 \qquad\qquad -3\cdot 0 = 0$$

### 5 · $\frac13$ is the undo of $\cdot\, 3$

The two instructions in (4) are opposites, and that is the whole of this section:

>**Rule:** Joining $3$ copies and cutting into $3$ parts undo each other. Do one, then the other, and you are back where you started.

Cut $1$ into three parts and you have $\tfrac13$; join three of those parts and you have $1$ again:

$$3\cdot\tfrac13 = 1$$

Nothing new has been claimed — it is the old meaning of $\tfrac13$ read with a times sign. But it gives the fraction a second description, and this one turns out to be the useful one:

>**Picture:** $\frac13$ is the number that *undoes* $\cdot\,3$. Multiply by $3$, then by $\frac13$, and you are back where you started.

Every number has such an undo — with one exception, and (6) comes back to it.

#### Every fraction is built from the undo

The table in (4) said $\tfrac35$ means *cut into five parts, then join three copies of the first one*. The cutting on its own is $\tfrac15$, and joining three of those is multiplying by $3$. Written with a times sign:

$$\tfrac35 \;=\; 3\cdot\tfrac15 \qquad\qquad \tfrac23 = 2\cdot\tfrac13$$

Every fraction splits like this: the number below is the cutting, the number above is the joining.

>**Note:** This settles the signs without a single new rule. $\tfrac{-4}{3}$ is $-4\cdot\tfrac13$ — a *negative scaling factor* (4), so: cut into three, join four, mirror. And $\tfrac{4}{-3} = -\tfrac43$ likewise, and $\tfrac{-4}{-3} = \tfrac43$, because mirroring twice brings you back (1).

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

$$3+-3 = 0 \qquad\qquad \tfrac13+-\tfrac13 = 0$$

and the same holds for every number. For multiplying, it is the undo:

$$3\cdot\tfrac13 = 1 \qquad\qquad 5\cdot\tfrac15 = 1$$

and the same holds for every number *except one*. And each of the two operations has a number that changes nothing:

$$3+0 = 3 \qquad\qquad 3\cdot 1 = 3$$

These two are not just curiosities. **$0$ is where moves start from; $1$ is where stretches start from** — which is why each operation has exactly one number that changes nothing, and why a number can be read as an *instruction* at all. $3$ is a move applied to $0$ (three unit steps right) and a stretch applied to $1$ (join three copies). Adding (3) uses the first reading, multiplying (4) the second.

*(The names, in case you meet them: $0$ and $1$ are the neutral elements, and the mirror image and the undo are the inverses. The names are not the point — the lines above are.)*

The exception is the only one in all of Part 0, and it is worth its own line:

>**Rule:** $0$ has no undo. Stretching $0$ leaves it at $0$, whatever the factor, so no number turns $0$ into $1$. That means $\frac10$ does not exist, and *dividing by $0$ is not allowed*.

Everything you will ever be told about "not allowed" in algebra comes back to this.

#### Order does not matter

$$5+3 \;=\; 3+5 \qquad\qquad 3\cdot4 \;=\; 4\cdot3$$

For adding you can see it on the line. Two moves, one of $5$ and one of $3$: it makes no difference which you make first, you arrive at the same point.

For multiplying the line does *not* show it — $3\cdot4$ lays the $4$-distance out three times, $4\cdot3$ lays the $3$-distance out four times, and nothing about the line makes those obviously equal. What shows it is a **rectangle of dots**: three rows of four is four columns of three, one and the same rectangle counted two ways.

>**Note:** The rectangle can also be written out. Split each $4$ into $3+1$ and sort the pieces:
>$$3\cdot4 \;=\; 4+4+4 \;=\; (3{+}1)+(3{+}1)+(3{+}1) \;=\; \underbrace{3+3+3}_{} \;+\; \underbrace{1+1+1}_{=\;3} \;=\; 3+3+3+3 \;=\; 4\cdot3$$
>This is the same rectangle read down the columns instead of across the rows. And notice what the sorting step needs: *swapping and regrouping summands*. **Multiplication can be swapped because addition can** — the second rests on the first.

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

>**Picture:** A bracket says: *this is one thing — deal with it first.*

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
