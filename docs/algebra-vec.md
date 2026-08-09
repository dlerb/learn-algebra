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

