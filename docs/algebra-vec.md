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

- $3+4$ becomes $0\xrightarrow{3}\xrightarrow{4}$. Walking it out gives $0\xrightarrow{7}$, the number $7$.
- $3+-4$ becomes $0\xrightarrow{3}\xrightarrow{-4}$. Walking it out gives $0\xleftarrow{1}$, the number $-1$.
- $4+\tfrac23$ becomes $0\xrightarrow{4}\xrightarrow[3]{2}$. To count the steps as one move they must be the same size, so take $\tfrac13$ throughout: $0\xrightarrow[3]{12}\xrightarrow[3]{2}=0\xrightarrow[3]{14}$, the number $\tfrac{14}{3}$.

>**Picture:** The minus operator $-$ means the same, except that the second arrow is *turned round*.

- $4-3$ becomes $0\xrightarrow{4}\xleftarrow{3}$. Walking it out gives $0\xrightarrow{1}$, the number $1$.
- $4--3$ becomes $0\xrightarrow{4}\xleftarrow{-3}$. The arrow points left and the minus turns it round again, so it is $3$ to the right: $0\xrightarrow{7}$, the number $7$.

The four cases side by side. Notice that the middle two land on the same number by different routes:

| | | |
|---|---|---|
| $4+3$ | $0\xrightarrow{4}\xrightarrow{3}$ | $7$ |
| $4+-3$ | $0\xrightarrow{4}\xrightarrow{-3}$ | $1$ |
| $4-3$ | $0\xrightarrow{4}\xleftarrow{3}$ | $1$ |
| $4--3$ | $0\xrightarrow{4}\xleftarrow{-3}$ | $7$ |

>**Rule:** $+-\ \rightarrow\ -\qquad -+\ \rightarrow\ -\qquad --\ \rightarrow\ +$

Two minuses meet in $4--3$: one is the *operator*, which turns the arrow round, the other is the *sign of the number*, which turns it round again. Turning round twice leaves you facing the way you started.

Sequences of arrows get long, so moves that are alike may be written on one arrow:

>**Def: Compact form.** Moves may share an arrow when they run the *same way* and have the *same step size*.
>
>- $0\xrightarrow{3}\xrightarrow{4}\quad=\quad0\xrightarrow{3\mid4}$
>- $0\xrightarrow{3}\xrightarrow{-4}\quad=\quad0\xrightarrow{3\mid-4}$
>- $0\xrightarrow[5]{3}\xrightarrow[5]{4}\quad=\quad0\xrightarrow[5]{3\mid4}$
>
>$0\xrightarrow{4}\xleftarrow{3}$ does **not** compress: the arrows run different ways.


### 3 · Visualising multiplication of numbers

>**Picture:** The multiplication $3\cdot4$ means: take the move of $4$ and make it $3$ times over.

- $3\cdot4$ becomes $0\xrightarrow{4\mid4\mid4}$, which is $0\xrightarrow{12}$, the number $12$.
- $3\cdot-4$ becomes $0\xrightarrow{-4\mid-4\mid-4}$: three times a move that goes left, so $0\xleftarrow{12}$, the number $-12$.

>**Picture:** A *negative* factor does the same and then turns the arrow round.

- $-3\cdot4$ becomes $0\xleftarrow{4\mid4\mid4}$, which is $0\xleftarrow{12}$, the number $-12$.
- $-3\cdot-4$ becomes $0\xleftarrow{-4\mid-4\mid-4}$: the arrow points left and the minus on the number turns it round again, so $0\xrightarrow{12}$, the number $12$.

The four cases side by side. The **first** factor decides which way the arrow points, the **second** rides in the label:

| | | |
|---|---|---|
| $3\cdot4$ | $0\xrightarrow{4\mid4\mid4}$ | $12$ |
| $3\cdot-4$ | $0\xrightarrow{-4\mid-4\mid-4}$ | $-12$ |
| $-3\cdot4$ | $0\xleftarrow{4\mid4\mid4}$ | $-12$ |
| $-3\cdot-4$ | $0\xleftarrow{-4\mid-4\mid-4}$ | $12$ |

>**Rule:** $\;+\cdot-\ \rightarrow\ -\qquad -\cdot+\ \rightarrow\ -\qquad -\cdot-\ \rightarrow\ +$

As in (2), turning round twice leaves you facing the way you started. Notice also that the middle two rows land on the same number by different routes — one turns the arrow, the other the label.

#### 3a · A factor that is not whole

Making a move "one third of a time" is not a picture of anything. But a fraction has a second job: it can change the *step size*, and that is written under the arrow.

>**Picture:** Multiplying by $\tfrac13$ cuts the step into three.

- $\tfrac13\cdot12$ becomes $0\xrightarrow[3]{12}$: twelve steps, each a third of a unit, so $0\xrightarrow{4}$, the number $4$.
- $\tfrac23\cdot12$ becomes $0\xrightarrow[3]{12\mid12}$: the move is made twice *and* the step is cut into three, so $0\xrightarrow{8}$, the number $8$.

>**Def:** Multiplying by $\tfrac pq$ makes the move $p$ times and cuts the step size into $q$. $$\tfrac pq\cdot\ \text{move}\quad=\quad\xrightarrow[q]{\text{move}\mid\cdots\mid\text{move}}\ \ (p\ \text{times})$$

>**Note:** A whole number is the case $q=1$: nothing is cut, and the move is simply made $p$ times. So (3) and (3a) are one rule, not two.

- $\tfrac{-2}{3}\cdot12$ becomes $0\xleftarrow[3]{12\mid12}$, the number $-8$: the minus turns the arrow round, exactly as before.
