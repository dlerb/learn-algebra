# Algebra visualised

(Part 1 · algebra without special blocks · Part 2 · the special blocks — to come.)

## Part 0

We already know the numbers and their properties, and the operations between them. We will need them. The goal is to map the numbers onto a straight line, which we call the *number line*, and visualise the operations as moves on this line.

### 1 · Mapping the rational numbers onto the number line

>Select an arbitrary point on the line and name it $0$. Select another point to the right and name it $1$. Any step on the line that is as wide as the one between points $0$ to $1$ is called a *unit step*.

To map the other numbers (only the rational numbers) onto the number line in a systematic way, we need to introduce *moves*. Moves help us to move along the line in unit steps.

#### 1a · Walking along the number line

A move consists of a number of unit steps. Moves are written as an arrow: the arrow shows which way you walk, the number above it says how many steps.

>**Def: Moves**
>
>- $\xrightarrow{3}$ = "wherever you are on the line, move $3$ unit steps to the *right*"
>- $\xleftarrow{3}$ = "wherever you are on the line, move $3$ unit steps to the *left*"
>- $\xrightarrow[3]{2}$ = "cut the unit step into $3$ equal parts, take the width of one part as the new step size, then move $2$ steps to the *right*"
>
>A minus on the number turns the move round:
>
>- $\xrightarrow{-3}$ = "move $3$ unit steps to the *left*"
>- $\xleftarrow{-3}$ = "move $3$ unit steps to the *right*"
>
>Generally a move has the form $$\xrightarrow[\text{cuts of the unit step}]{\text{steps}} \qquad\text{or}\qquad \xleftarrow[\text{cuts of the unit step}]{\text{steps}}$$ If no number of cuts is given it is $1$, and the step is the unit step.

So the *arrow* says which way, and a *minus on the number* turns that round. Two ways of saying the same thing, and both are allowed:

$$\xrightarrow{-3}\quad=\quad\xleftarrow{3} \qquad\qquad \xleftarrow{-3}\quad=\quad\xrightarrow{3}$$

Once there are numbers on the line, we can also say where the move starts:

- $0\xrightarrow{3}$ = "starting from point $0$, make the move"
- $0\xleftarrow{3}$ = "starting from point $0$, make the move"

Note that

- $\xrightarrow{3}\quad=\quad\xrightarrow[1]{3}$
- $\xrightarrow[3]{2}\quad=\quad\xrightarrow[6]{4}$
- the step size of $\ \xrightarrow[3]{2}\ $ is $\tfrac13$

#### 1b · Mapping the rational numbers onto the number line

Every rational number can now be reached: start at point $0$ and make one move.

>**Def: Numbers are moves from point $0$**
>
>- the number $3$ is the move $0\xrightarrow{3}$
>- the number $-3$ is the move $0\xleftarrow{3}$
>- the number $\tfrac23$ is the move $0\xrightarrow[3]{2}$
>- the number $0$ is the move $0\xrightarrow{0}$
>- the number $1$ is the move $0\xrightarrow{1}$
>
>Generally, the rational number $\tfrac pq$ is the move $$0\xrightarrow[q\ \text{cuts of the unit step}]{p\ \text{steps}}$$ and a whole number $p$ is the move $$0\xrightarrow{p\ \text{steps}}$$

>**Note:** The number is the arrow *and* its label together. $0\xrightarrow{3}$ is $3$ and $0\xleftarrow{3}$ is $-3$ — same label, different number, because the arrows point different ways.

### 2 · Visualising adding and subtracting numbers

>**Picture:** The plus operator $+$ means: make the moves one after the other.

- $3+4$ becomes $0\xrightarrow{3}\;\xrightarrow{4}$. Walking it out gives $0\xrightarrow{7}$, the number $7$.
- $3+-4$ becomes $0\xrightarrow{3}\;\xrightarrow{-4}$. Walking it out gives $0\xleftarrow{1}$, the number $-1$.
- $4+\tfrac23$ becomes $0\xrightarrow{4}\;\xrightarrow[3]{2}$. To count the steps as one move they must be the same size, so take $\tfrac13$ throughout: $0\xrightarrow[3]{12}\;\xrightarrow[3]{2}=0\xrightarrow[3]{14}$, the number $\tfrac{14}{3}$.

>**Picture:** The minus operator $-$ means the same, except that the second arrow is *turned round*.

- $4-3$ becomes $0\xrightarrow{4}\;\xleftarrow{3}$. Walking it out gives $0\xrightarrow{1}$, the number $1$.
- $4--3$ becomes $0\xrightarrow{4}\;\xleftarrow{-3}$. The arrow points left and the minus turns it round again, so it is $3$ to the right: $0\xrightarrow{7}$, the number $7$.

The four cases side by side. Notice that the middle two land on the same number by different routes:

| | | |
|---|---|---|
| $4+3$ | $0\xrightarrow{4}\;\xrightarrow{3}$ | $7$ |
| $4+-3$ | $0\xrightarrow{4}\;\xrightarrow{-3}$ | $1$ |
| $4-3$ | $0\xrightarrow{4}\;\xleftarrow{3}$ | $1$ |
| $4--3$ | $0\xrightarrow{4}\;\xleftarrow{-3}$ | $7$ |

>**Rule:** $+-\ \rightarrow\ -\qquad -+\ \rightarrow\ -\qquad --\ \rightarrow\ +$

Two minuses meet in $4--3$: one is the *operator*, which turns the arrow round, the other is the *sign of the number*, which turns it round again. Turning round twice leaves you facing the way you started.

Sequences of arrows get long, so moves that are alike may be written on one arrow:

>**Def: Compact form.** Moves may share an arrow when they run the *same way* and have the *same step size*.
>
>- $0\xrightarrow{3}\;\xrightarrow{4}\quad=\quad0\xrightarrow{3\mid4}$
>- $0\xrightarrow{3}\;\xrightarrow{-4}\quad=\quad0\xrightarrow{3\mid-4}$
>- $0\xrightarrow[5]{3}\;\xrightarrow[5]{4}\quad=\quad0\xrightarrow[5]{3\mid4}$
>
>$0\xrightarrow{4}\;\xleftarrow{3}$ does **not** compress: the arrows run different ways.


### 3 · Visualising multiplication of numbers

In $3\cdot4$ the two factors do different jobs. The $4$ is a *move*. The $3$ is an *instruction* telling you what to do with that move. We write an instruction in square brackets, in front of the arrow it acts on:

>**Def:** $[3]$ = "make the move that follows $3$ times over".

$$3\cdot4 \quad\longrightarrow\quad 0\,[3]\xrightarrow{4} \quad\longrightarrow\quad 0\xrightarrow{4\mid4\mid4} \quad\longrightarrow\quad 0\xrightarrow{12}$$

>**Note:** The brackets are scaffolding. They make it visible that the first factor is not a move but something done *to* a move. Once that is second nature, they can be dropped.

A *negative* instruction does the same and then turns the arrow round.

>**Def:** $[-3]$ = "make the move $3$ times over, then turn the arrow round".

$$-3\cdot4 \quad\longrightarrow\quad 0\,[-3]\xrightarrow{4} \quad\longrightarrow\quad 0\xleftarrow{4\mid4\mid4} \quad\longrightarrow\quad 0\xleftarrow{12}$$

The four cases side by side. The **instruction** decides which way the arrow points, the **move** carries its own sign in the label:

| | | | |
|---|---|---|---|
| $3\cdot4$ | $0\,[3]\xrightarrow{4}$ | $0\xrightarrow{4\mid4\mid4}$ | $12$ |
| $3\cdot-4$ | $0\,[3]\xrightarrow{-4}$ | $0\xrightarrow{-4\mid-4\mid-4}$ | $-12$ |
| $-3\cdot4$ | $0\,[-3]\xrightarrow{4}$ | $0\xleftarrow{4\mid4\mid4}$ | $-12$ |
| $-3\cdot-4$ | $0\,[-3]\xrightarrow{-4}$ | $0\xleftarrow{-4\mid-4\mid-4}$ | $12$ |

>**Rule:** $\;+\cdot-\ \rightarrow\ -\qquad -\cdot+\ \rightarrow\ -\qquad -\cdot-\ \rightarrow\ +$

As in (2), turning round twice leaves you facing the way you started. The middle two rows land on the same number by different routes — one turns the arrow, the other the label.

#### 3a · An instruction that is not whole

Making a move "one third of a time" is not a picture of anything. But an instruction can do a second thing besides saying how often: it can make the steps *smaller*.

>**Def:** $[\tfrac pq]$ = "take $p$ times as many steps, each one cut into $q$".

The cutting works on the steps the move *already has*, whatever size those are.

- The move of $6$ steps in **units**, so cutting each step into three gives **thirds**.
- The move of $\tfrac45$ steps in **fifths**, so cutting each step into three gives **a third of a fifth**.

And a third of a fifth is a **fifteenth**: cut the unit into five, then cut one of those fifths into three, and the unit stands cut into fifteen. That is the only thing to see here, and it can be counted.

$$\tfrac23\cdot6 \quad\longrightarrow\quad 0\,[\tfrac23]\xrightarrow{6} \quad\longrightarrow\quad 0\xrightarrow[3]{6\mid6} \quad\longrightarrow\quad 0\xrightarrow[3]{12} \;=\; 4$$

$$\tfrac23\cdot\tfrac45 \quad\longrightarrow\quad 0\,[\tfrac23]\xrightarrow[5]{4} \quad\longrightarrow\quad 0\xrightarrow[15]{4\mid4} \quad\longrightarrow\quad 0\xrightarrow[15]{8} \;=\; \tfrac8{15}$$

The middle step is where the work happens: the label doubles because there are twice as many steps, and the number below goes from $5$ to $15$ because each fifth was cut into three.

>**Note:** A whole number is the case $q=1$ — nothing is cut, and the move is simply made $p$ times. So $[3]$ and $[\tfrac23]$ are one kind of instruction, not two.

- $6\cdot\tfrac23$ becomes $0\,[6]\xrightarrow[3]{2}=0\xrightarrow[3]{2\mid2\mid2\mid2\mid2\mid2}=0\xrightarrow[3]{12}$ — the number $4$, the same arrow $\tfrac23\cdot6$ reached.
- $-\tfrac23\cdot6$ becomes $0\,[-\tfrac23]\xrightarrow{6}=0\xleftarrow[3]{12}$, the number $-4$: the minus turns the arrow round, exactly as before.

#### 3a′ · Two instructions in a row

$2\cdot3\cdot4$ has one move and two instructions. They stand side by side, and the one **nearest the arrow** acts first:

$$0\,[2][3]\xrightarrow{4} \;\to\; 0\,[2]\xrightarrow{4\mid4\mid4} \;\to\; 0\,[2]\xrightarrow{12} \;\to\; 0\xrightarrow{12\mid12} \;\to\; 0\xrightarrow{24}$$

Take them the other way round and you get $0\,[3]\xrightarrow{8}$, then $0\xrightarrow{24}$ — the same arrow. So the order of the instructions makes no difference, which is $2\cdot(3\cdot4)=(2\cdot3)\cdot4$ as a picture.

Two instructions in a row are themselves one instruction: making a move three times and then making *that* twice is making it six times.

>**Rule:** $[2][3]=[6]$

The same with cutting, and this is where it earns its keep:

$$[\tfrac12][\tfrac23]$$

Steps: twice as many, then as many again — twice as many in all. Cutting: into three, and then each of those into two — **into six**. So $[\tfrac12][\tfrac23]=[\tfrac26]=[\tfrac13]$, which is $\tfrac12\cdot\tfrac23=\tfrac13$.

>**Note:** The denominators multiplied because *cutting composes*: cut into three, cut each into two, and you have cut into six. Nothing was multiplied but pieces counted.

#### 3b · Why multiplication has to go first

Adding *chains* arrows. Multiplying works *inside* one arrow. That alone settles which comes first, without a rule having to be handed down:

- $3+4\cdot5$ becomes $0\xrightarrow{3}\;\xrightarrow{20}$ — two links, and $4\cdot5$ is what the second link is *made of*.
- $3\cdot4+5$ becomes $0\xrightarrow{12}\;\xrightarrow{5}$ — again two links, and this time the product is the first one.

In both, the $+$ says where one arrow ends and the next begins, so it can only cut the chain *between* the products, never through one. There is nowhere for $4\cdot5$ to be split across two arrows, because a product is not a chain of moves — it is one move.

>**Rule:** *Punkt vor Strich.* Multiplication is done before addition — not by decree, but because a product is a single arrow and a sum is a chain of them.

To make a sum into one link you have to say so, and that is what a bracket does:

- $(3+4)\cdot5$ becomes $0\xrightarrow{35}$: the bracket makes $3+4$ into one move first, and the $5$ then multiplies *that*.

---

## Appendix · Brackets as stacks

*Draft, not yet folded into (1)–(3): a bracket is written as a column, and the compact form $\xrightarrow{4\mid4}$ is dropped — the column does that job too.*

### A · The one replacement

"Three times over" is three links, and a chain of links is a column:

$$[3]\xrightarrow{4}\quad=\quad\begin{pmatrix}\xrightarrow4\\\xrightarrow4\\\xrightarrow4\end{pmatrix}\quad=\quad\xrightarrow{12}$$

So $\mid$ is not needed. It was doing two jobs: showing "so many times over", and showing when a chain may be written on one arrow. The column does the first, and the second stays exactly as it was in (2), only now it is about a column:

>**Rule:** A column becomes one arrow only when its rows run the *same way* and have the *same step size*.

### B · The two columns

A bracket can be the move, or it can be the instruction. The brackets already say which, as in (3): round holds arrows, square holds instructions.

>**Def: The two columns**
>
>- $\begin{pmatrix}\xrightarrow4\\\xrightarrow5\end{pmatrix}$ is the bracket $(4+5)$ standing as a *move* — a chain of moves written downwards.
>- $\begin{bmatrix}2\\3\end{bmatrix}$ is the bracket $(2+3)$ standing as an *instruction* — "make the move twice, then three times more".

>**Picture:** An instruction reaches *every row* of a column. A column of instructions gives *one row each*.

$$[2]\begin{pmatrix}\xrightarrow4\\\xrightarrow5\end{pmatrix}=\begin{pmatrix}[2]\xrightarrow4\\{}[2]\xrightarrow5\end{pmatrix}\qquad\qquad\begin{bmatrix}2\\3\end{bmatrix}\xrightarrow4=\begin{pmatrix}[2]\xrightarrow4\\{}[3]\xrightarrow4\end{pmatrix}$$

On the right the bracket changes shape, because the answer is a chain of moves and no longer a chain of instructions.

### C · Worked examples

**1 · $2\cdot3\cdot4$ — no bracket, so no column.**

$$0\,[2][3]\xrightarrow4\;=\;0\,[6]\xrightarrow4\;=\;0\xrightarrow{24}$$

Instructions side by side *compose*, as in (3a′). Nothing here is a chain, so nothing stacks.

**2 · $2(3+4)$ — one column.**

$$0\,[2]\begin{pmatrix}\xrightarrow3\\\xrightarrow4\end{pmatrix}=0\begin{pmatrix}[2]\xrightarrow3\\{}[2]\xrightarrow4\end{pmatrix}=0\begin{pmatrix}\xrightarrow6\\\xrightarrow8\end{pmatrix}=0\xrightarrow{14}$$

Stopping after the first row leaves

$$0\begin{pmatrix}[2]\xrightarrow3\\\xrightarrow4\end{pmatrix}$$

which gives $10$. The second row has a gap where its $[2]$ should be, so the half-done job *looks* half-done before anything is checked.

**3 · $(2+3)(4+5)$ — a column each way is a grid.**

$$0\begin{bmatrix}2\\3\end{bmatrix}\begin{pmatrix}\xrightarrow4\\\xrightarrow5\end{pmatrix}=0\begin{pmatrix}[2]\xrightarrow4&[2]\xrightarrow5\\{}[3]\xrightarrow4&[3]\xrightarrow5\end{pmatrix}=0\begin{pmatrix}\xrightarrow8&\xrightarrow{10}\\\xrightarrow{12}&\xrightarrow{15}\end{pmatrix}=0\xrightarrow{45}$$

Every cell is one link of the chain, and the order they are walked in does not matter. Filling only the diagonal gives $8+15=23$ — with two cells standing empty.

**4 · $(2+3+4)(5+6)$ — three rows, two columns.**

$$0\begin{bmatrix}2\\3\\4\end{bmatrix}\begin{pmatrix}\xrightarrow5\\\xrightarrow6\end{pmatrix}=0\begin{pmatrix}\xrightarrow{10}&\xrightarrow{12}\\\xrightarrow{15}&\xrightarrow{18}\\\xrightarrow{20}&\xrightarrow{24}\end{pmatrix}=0\xrightarrow{99}$$

Three rows and two columns make six cells. That is all *how many terms* has ever meant.

**5 · $(2+3)(3+4)(5+6)$ — two instructions and a move.**

Only the last bracket is the move; the other two are instructions, and instructions side by side compose. A column composed with a column is a grid of instructions:

$$\begin{bmatrix}2\\3\end{bmatrix}\begin{bmatrix}3\\4\end{bmatrix}=\begin{bmatrix}[2][3]&[2][4]\\{}[3][3]&[3][4]\end{bmatrix}=\begin{bmatrix}6&8\\9&12\end{bmatrix}=[35]$$

which is $5\cdot7$. That one instruction then meets the move column:

$$0\,[35]\begin{pmatrix}\xrightarrow5\\\xrightarrow6\end{pmatrix}=0\begin{pmatrix}\xrightarrow{175}\\\xrightarrow{210}\end{pmatrix}=0\xrightarrow{385}$$

>**Note:** The instruction grid could have been left standing and each of its four cells sent against each of the two rows — eight cells, $30+36+40+48+45+54+60+72=385$, the same number. Two links, two links, two links: $2\cdot2\cdot2$ cells. The links inside a bracket *add*, the cells across brackets *multiply*.

### D · One example, two layouts

Example 3 again, $(2+3)(4+5)$. The algebra is identical; the question is which layout explains *itself*.

**Layout 1 · labels inside the cells**

$$0\begin{bmatrix}2\\3\end{bmatrix}\begin{pmatrix}\xrightarrow4\\\xrightarrow5\end{pmatrix}=0\begin{pmatrix}[2]\xrightarrow4&[2]\xrightarrow5\\{}[3]\xrightarrow4&[3]\xrightarrow5\end{pmatrix}=0\begin{pmatrix}\xrightarrow8&\xrightarrow{10}\\\xrightarrow{12}&\xrightarrow{15}\end{pmatrix}=0\xrightarrow{45}$$

**Layout 2 · labels on the edges**

$$\begin{array}{c|cc|c} & \xrightarrow{4} & \xrightarrow{5} & \Sigma \\ \hline [2] & \xrightarrow{8} & \xrightarrow{10} & \xrightarrow{18} \\ {}[3] & \xrightarrow{12} & \xrightarrow{15} & \xrightarrow{27} \\ \hline \Sigma & \xrightarrow{20} & \xrightarrow{25} & \xrightarrow{45} \end{array}$$

The second is the *Einmaleins* table, which needs no introduction, with the two brackets written along its edges.

| | layout 1 | layout 2 |
|---|---|---|
| which column is which | bracket shape | bracket shape |
| why one column turns sideways | not shown | *drawn* — one edge is down, the other across |
| what fixes the grid's shape | nothing | the two edges |
| where the last number comes from | not shown | the margins, collapsed twice |
| size | compact | wide |

### E · The half-done job, in both

Stopping after the first row of the instruction column:

$$0\begin{pmatrix}[2]\xrightarrow4&[2]\xrightarrow5\\{}[3]\xrightarrow4\end{pmatrix}\qquad\qquad\begin{array}{c|cc|c} & \xrightarrow{4} & \xrightarrow{5} & \Sigma \\ \hline [2] & \xrightarrow{8} & \xrightarrow{10} & \xrightarrow{18} \\ {}[3] & \xrightarrow{12} & & \\ \hline \Sigma & \xrightarrow{20} & & \end{array}$$

On the left a cell is simply *absent*, and nothing says how many there should have been. On the right the edges say there are four, one square is *empty*, and both margins that run through it are unfinished. The mistake has somewhere to show.

>**Note:** The row margin is $[2]\xrightarrow9$ and $[3]\xrightarrow9$ — the *move* bracket done first. The column margin is $[5]\xrightarrow4$ and $[5]\xrightarrow5$ — the *instruction* bracket done first. The two margins meet in the corner at $45$, so the table *shows* that either bracket may go first instead of saying so.

>**Note:** $\Sigma$ is the only new glyph in the whole of Part 0, and it is not yet earned. A blank corner, or the word *ganz*, would do the same work.

### F · A different starting point — one meaning per direction

*Not an extension of A–E but an alternative to them. It would replace (3), not follow it.*

The grid above arrives late and unannounced. It does that because the two directions on the page have no fixed jobs yet: across means *add* for moves but *multiply* for instructions, and down means *add* all over again. Give each direction one job and the grid stops being a device.

| direction | reading | operation |
|---|---|---|
| across | the walk | adding |
| down | again | multiplying |

**1 · $3\cdot4$ — three rows.**

$$3\cdot4 \quad\longrightarrow\quad \begin{array}{c}\xrightarrow4\\\xrightarrow4\\\xrightarrow4\end{array} \quad=\quad \xrightarrow{12}$$

Multiplication is two rows deep before any bracket exists. There is no $[3]$ — the $3$ is the *number of rows*, and you can count them.

**2 · $3(4+5)$ — three rows of two.**

$$\begin{array}{c|c}\xrightarrow4&\xrightarrow5\\\xrightarrow4&\xrightarrow5\\\xrightarrow4&\xrightarrow5\end{array}$$

Nothing was introduced to write this. A row is the walk $4+5$; there are three of them, because *down* means again. The rectangle is simply what a repeated walk looks like.

Now add it up, and there are two ways round:

- *across, then down* — each row is $\xrightarrow9$, and three rows of $\xrightarrow9$ is $\xrightarrow{27}$.
- *down, then across* — the columns are $\xrightarrow{12}$ and $\xrightarrow{15}$, and $\xrightarrow{12}\;\xrightarrow{15}$ is $\xrightarrow{27}$.

>**Rule:** One rectangle, added two ways. That is the distributive law, and there is nothing to hold in the head beyond *across or down*.

**3 · $(2+3)\cdot4$ — the grouping moves to the side.**

$$\begin{array}{c}\xrightarrow4\\\xrightarrow4\\\hline\xrightarrow4\\\xrightarrow4\\\xrightarrow4\end{array}$$

Two rows and then three more is five rows. So the second bracket-form is not a second law: it is the same picture cut *down the side* instead of *across the top*.

**4 · $(2+3)(4+5)$ — both edges cut.**

$$\begin{array}{c|c}\xrightarrow4&\xrightarrow5\\\xrightarrow4&\xrightarrow5\\\hline\xrightarrow4&\xrightarrow5\\\xrightarrow4&\xrightarrow5\\\xrightarrow4&\xrightarrow5\end{array}$$

Five rows across gives five $\xrightarrow9$, so $\xrightarrow{45}$. Two columns down gives $\xrightarrow{20}$ and $\xrightarrow{25}$, so $\xrightarrow{45}$. And the two cuts make four blocks: $8$, $10$, $12$, $15$.

>**Note:** Those four blocks are the grid of (C3) — but here nobody put a grid there. It is one rectangle with two cuts in it, and the earlier grid is this picture with the arrows rubbed out and only the edge labels kept. A block cannot be forgotten, because the cuts run the whole way across.

**5 · Turning it a quarter turn.**

Written in unit steps, $3\cdot4$ is three rows of four:

$$\begin{array}{cccc}\xrightarrow1&\xrightarrow1&\xrightarrow1&\xrightarrow1\\\xrightarrow1&\xrightarrow1&\xrightarrow1&\xrightarrow1\\\xrightarrow1&\xrightarrow1&\xrightarrow1&\xrightarrow1\end{array}$$

Turn the page a quarter turn and it is four rows of three, which is $4\cdot3$. Same arrows, same count. So the order of the factors is a quarter turn rather than a claim.

>**Note: what this would cost.** The move-column of (B) disappears — moves are always *across*, and only repetition goes *down*. So (3), (3a) and (3a′) would be rewritten, and $[\;]$ demotes from an operator to a row count. And the walk *wraps*: row two starts back at the left instead of where row one ended, so the picture is a walk set on ruled lines rather than one unbroken walk. That last one is the decision; everything else follows from it.

### G · The second axis as an arrow

*Sketch. In (F) the number of rows is counted but never written. Here it gets an arrow of its own, and the grammar of (1) is left untouched.*

>**Def: The up arrow**
>
>- $\overset{3}{\big\uparrow}$ = "make what follows, three times over"
>- $\overset{3}{\big\downarrow}$ = the same, and then turned round
>- a minus on the label turns the arrow round: $\overset{-3}{\big\uparrow}=\overset{3}{\big\downarrow}$, exactly as in (1)

So $3\cdot4$ is $\overset{3}{\big\uparrow}\xrightarrow{4}$, and $[\;]$ is gone. The instruction was only ever an arrow on the other axis.

**1 · The four cases become four places.**

| | | | |
|---|---|---|---|
| $3\cdot4$ | up $3$ | right $4$ | $12$ |
| $3\cdot-4$ | up $3$ | left $4$ | $-12$ |
| $-3\cdot4$ | down $3$ | right $4$ | $-12$ |
| $-3\cdot-4$ | down $3$ | left $4$ | $12$ |

(2) and (3) each tell the *turn round twice* story once. Here it is told once for both, because there is one grammar and two axes. The four rows of (3) stop being four cases and become four corners of the page.

**2 · Cutting composes, drawn rather than argued.**

Cut the unit one way into thirds and the other way into fifths, and the unit square stands cut into fifteen. The rectangle $\tfrac23$ by $\tfrac45$ covers eight of them:

$$\begin{array}{ccccc}\bullet&\bullet&\bullet&\bullet&\cdot\\\bullet&\bullet&\bullet&\bullet&\cdot\\\cdot&\cdot&\cdot&\cdot&\cdot\end{array}\qquad=\qquad\tfrac8{15}$$

>**Note:** This is (3a)'s $\tfrac23\cdot\tfrac45$, and it lands on the same $\tfrac8{15}$. There the fifteenth is *argued*; here it is a cell you can point at.

**3 · What breaks.**

**(a) Three factors overflow the plane.** Consecutive arrows mean *plus* — that is (2), and it must hold on both axes or the grammar is not one grammar. So two up arrows in a row are $3+5$, never $3\cdot5$, and $3\cdot4\cdot5$ has nowhere to put its third number. It has to be read as $3\cdot(4\cdot5)$, with $4\cdot5$ worked out and brought back to the line first. Left-to-right reading is lost, and $(3\cdot4)$ on its own is not an arrow at all — it is a rectangle.

**(b) Unlike cuts leave the rows ragged.** $(\tfrac23+\tfrac14)\cdot5$ is two rows in *thirds* and then one row in *quarters*:

$$\begin{array}{c}\xrightarrow[3]{5}\\\xrightarrow[3]{5}\\\hline\xrightarrow[4]{5}\end{array}$$

⚠️ By the rule in (A) these cannot be counted as one until they share a step size. A **common denominator has appeared inside a product** — and (3b) had just established that multiplying never needs one. The picture now asks for the very thing it was used to explain away.

**(c) There is no extensible vertical arrow.** $\xrightarrow{\;}$ has no vertical twin, so the up arrow is a fixed glyph and cannot grow beside a tall block.

>**Note: the two objections do not point the same way.** (a) is a limit of the *plane* — two axes hold two factors however the up arrow is read, and no reading escapes it. (b) is a limit of *copies* alone: read the up arrow as a **length** on a second number line and $\tfrac23+\tfrac14$ is one side of one rectangle, $\tfrac{11}{12}$ long, with nothing ragged in it. So (b) is what decides between the two readings, and it decides against copies.

