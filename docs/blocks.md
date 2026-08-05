# Blocks

The model, written for the class. Self-contained, no references. Nothing here is settled —
this is the document we fiddle with until it is right.

**The one image the whole thing runs on: things PULL at each other, and four special things
hold against the pull.**

---

## 0 · What this is for

*(For us, not for the class.)*

1. **Teach that focusing on the VARIABLES is the wrong focus.** What matters is what pulls at
   what, and what holds together.
2. **Teach why that is the right thing to focus on.**
3. **Teach what each of the four special things can do** — as a plain list, one list per thing.
4. **Add no new abstraction.** End on the names they must own: *Kommutativgesetz*,
   *Assoziativgesetz*, *Distributivgesetz*, *ausmultiplizieren*, *ausklammern*.

⚠️ **The word budget is ZERO.** Every word below is one the student already has. Our own
words — *Block*, *Wand* — are at the foot of the document and never reach the class.

⚠️ **§5 does NOT try to show that the four are the same mechanism underneath.** They are four
lists. The unification is real and it is ours; it is not how the class thinks, and pushing it
would cost more than it saves.

**The four things they have to be able to do:**

1. see where the **multiplication** is, including where it is hidden `[§2]`
2. **identify** the four special things `[§3]`
3. **umstellen** — rearrange what is joined by $+$, $-$ and $\cdot$ `[§4]`
4. know the **laws of each of the four** `[§5]`

---

## 1 · Punkt zieht stärker als Strich

Write down

$$x+1$$

It says: **add 1 to $x$.**

Now put a 3 in front.

$$3x+1$$

**It does not say that any more.** The 1 is now added to $3x$.

Here is what happened. **The 3 pulls at the $x$.** The $+$ is holding on to the $x$ as well —
but it is weaker, so it lets go. The $x$ goes over to the 3.

> **Punkt vor Strich heisst: das Mal zieht stärker als das Plus und das Minus.**

And therefore:

> **In $3x+1$ gibt es kein $x+1$.** The marks are on the page, side by side. The thing is not
> there.

---

## 2 · Zwei Zeichen, die man nicht schreibt

Beide sind da. Beide muss man sehen können.

### Das Mal

$$3x \;=\; 3\cdot x$$

| | das versteckte Mal |
|---|---|
| $3x$ | zwischen Zahl und Buchstabe |
| $3(x+1)$ | vor der Klammer |
| $-x$ | **das Minus ist ein $\cdot(-1)$** |
| $x^2$ | die Potenz **ist** ein Produkt: $x\cdot x$ |
| $\dfrac{3x}{4}$ | der Bruchstrich **ist** ein $\cdot\frac14$ |
| $\sqrt2\,\sqrt3$ | zwischen zwei Wurzeln |
| $2\tfrac12$ | ⚠️ **kein Mal — das ist ein Plus.** Die einzige Ausnahme |

### Die Klammer um ein einzelnes Zeichen

> **Steht in einer Klammer nur eine Zahl oder nur ein Buchstabe, schreibt man sie nicht.**

| geschrieben | gemeint |
|---|---|
| $3x$ | $3\cdot(x)$ |
| $x^2$ | $(x)^2$ |
| $-x^2$ | $-(x)^2$, also $-(x\cdot x)$ |

Das ist dieselbe Faulheit wie beim Mal, und sie ist genauso informativ: **steht keine Klammer
da, dann ist drin genau ein Zeichen.** Deshalb ist in $3x^2$ nur das $x$ quadriert und nicht
das $3x$ — die Klammer, die man nicht schreibt, geht nur um das $x$.

⚠️ Und deshalb braucht $(x+1)^2$ ihre Klammer wirklich: da drin steht mehr als ein Zeichen.

---

## 3 · Die vier, die zusammenhalten

So when is the 3 unable to take the $x$ away? When one of **four** things is around it:

$$3\,(x+1) \qquad 3\,\frac{x+1}{x} \qquad 3\,(x+1)^2 \qquad 3\sqrt{x+1}$$

**Klammer · Bruch · Potenz · Wurzel.** In each of these the 1 is still added to the $x$. The 3
still pulls — it just cannot get in. *Der 3er kriegt nicht das $x$, sondern das ganze $x+1$.*

**Und so sehen die vier aus, wenn man wegdenkt, was drin steht:**

**Rot sind die Zeichen, die den Block ausmachen. Die $\bigcirc$ sind seine Plätze.**

| | Form | Plätze |
|---|---|---|
| **Klammer** | ${\color{red}(}\bigcirc{\color{red})}$ | einer |
| **Bruch** | ${\color{red}\dfrac{\color{black}\bigcirc}{\color{black}\bigcirc}}$ | zwei: oben und unten |
| **Potenz** | ${\color{red}(}\bigcirc{\color{red})}^{\bigcirc}$ | zwei: Basis und Exponent |
| **Wurzel** | ${\color{red}\sqrt{\color{black}\bigcirc}}$ | einer |

**Das ist die ganze Liste.** In jedes $\bigcirc$ darf alles hinein — eine Zahl, ein Buchstabe,
eine Summe, wieder ein Block. Und was drin steht, ist geschützt.

⚠️ **Auf dem Papier fehlt bei der Potenz die Klammer meistens**, weil in der Basis nur ein
Zeichen steht `[§2]`. $x^2$ ist $(x)^2$, und $(x+1)^2$ schreibt seine Klammer, weil da mehr
drin steht. **Es ist derselbe Block, einmal faul und einmal vollständig geschrieben.**

⚠️ **Die Potenz hat zwei Wände, aber nur eine kann man anmalen.** Die Klammer ist ein Zeichen.
Das Hochstellen des Exponenten ist keins — es ist eine **Stelle**. Deshalb ist es die einzige
Wand, die man beim Schreiben verlieren kann:

$$x^{2y} \qquad\text{gegen}\qquad x^2y$$

Dieselben drei Zeichen; nur die Höhe des $y$ entscheidet. **Hier hilft nur: genau zeichnen.**

**These four are the only things on the page that hold against a pull.** Recognising them is
half of reading algebra; the other half is §5, what each of them can do.

> Note: From now on when you look at an expression, observe where the *, +, - and the special blocks are. Of course special blocks can also contain +, *, and - and special blocks, but first just focus on the first level --> drill

⚠️ **Zwei Zeichen, und sie bedeuten Verschiedenes.**

> $\bigcirc$ ist **ein Platz** in einem Block. $\square$ ist **ein ganzer Block**.
> Der **Rahmen** zeigt, **wie weit** ein Block reicht.

**Ein ganzer Ausdruck, mit allen vieren drin:**

$$3x \;-\; 2\underbrace{(x+1)}_{\text{Klammer}} \;+\; \underbrace{x^2}_{\text{Potenz}} \;-\; \underbrace{\frac{x-3}{x}}_{\text{Bruch}}\cdot\underbrace{\sqrt{x+4}}_{\text{Wurzel}}$$

Rahmen drum, Inhalt raus — **jetzt sieht man beides auf einmal, die Grenze und die Plätze:**

$$3x \;-\; 2\,{\color{gray}\boxed{\color{black}(\bigcirc)}} \;+\; {\color{gray}\boxed{\color{black}\bigcirc^{\bigcirc}}} \;-\; {\color{gray}\boxed{\color{black}\dfrac{\bigcirc}{\bigcirc}}}\cdot{\color{gray}\boxed{\color{black}\sqrt{\bigcirc}}}$$

**Das ist die erste Ebene**, und sie ist auf einmal einfach: **vier Summanden**, und in ihnen
nur Zahlen, Buchstaben, Mal — und vier Rahmen. Was *in* den Rahmen steht, ist die zweite Ebene
und kommt später dran.

Wer bloss zählen will, macht die Rahmen ganz zu:

$$3x \;-\; 2\,\square \;+\; \square \;-\; \square\cdot\square \qquad\text{— vier Summanden.}$$

⚠️ **Das $3x$ bekommt keinen Rahmen.** Es ist keiner der vier — es ist einfach eine Zahl mal
einen Buchstaben. Es hält zwar auch zusammen, aber nur, **weil das Mal stärker zieht als das
Plus** `[§1]`, nicht weil etwas drumherum steht. *Rahmen gibt es nur für die vier.*

**Noch einer, mit einem Block im Block:**

$$\underbrace{\left(\frac{2x}{x-1}\right)^2}_{\text{Potenz}} \;-\; \underbrace{\sqrt x}_{\text{Wurzel}} \;+\; 4x \;-\; 5$$

$${\color{gray}\boxed{\color{black}\left({\color{gray}\boxed{\color{black}\dfrac{\bigcirc}{\bigcirc}}}\right)^{\bigcirc}}} \;-\; {\color{gray}\boxed{\color{black}\sqrt{\bigcirc}}} \;+\; 4x \;-\; 5$$

**Rahmen im Rahmen** — die Potenz hat einen Bruch als Basis. Zwei Blöcke ineinander, auf der
ersten Ebene trotzdem **einer**: der äussere Rahmen ist ein einziger Summand.

**Und der Fall, der am häufigsten vorkommt: zuoberst steht schon ein Block.**

$$\frac{5x-2(x+1)}{\sqrt{x+4}+1} \qquad\longrightarrow\qquad {\color{gray}\boxed{\color{black}\dfrac{\bigcirc}{\bigcirc}}}$$

Die erste Ebene ist **ein einziger Rahmen** — der ganze Ausdruck ist ein Bruch. Kein Plus,
kein Minus, kein Mal steht draussen. Alles Interessante ist eine Ebene tiefer, und dort macht
man dasselbe noch einmal:

$$\text{oben: } 5x-2(x+1) \;\to\; 5x-2\,{\color{gray}\boxed{\color{black}(\bigcirc)}} \qquad\qquad \text{unten: } \sqrt{x+4}+1 \;\to\; {\color{gray}\boxed{\color{black}\sqrt{\bigcirc}}}+1$$

Dasselbe bei einer Wurzel zuoberst: $\sqrt{\frac{2x}{x-1}-5}$ ist erste Ebene
${\color{gray}\boxed{\color{black}\sqrt{\bigcirc}}}$, zweite Ebene
${\color{gray}\boxed{\color{black}\dfrac{\bigcirc}{\bigcirc}} - 5}$.

⚠️ **Und das ist nicht nur Lesen — es sagt einem, was man überhaupt darf.** Wer zuoberst
steht, bestimmt, welche Liste aus §5 zuoberst gilt: bei einem Bruch die Bruch-Liste `[§5.2]`,
bei einer Wurzel die Wurzel-Liste `[§5.3]`. **Man sucht sich die Regel nicht aus — der
äusserste Block sagt sie an.**

> **Die Übung ist immer dieselbe: Kästchen malen, dann zählen, was das $+$ und das $-$
> verbinden — und wenn nur ein Kästchen dasteht, eine Ebene tiefer gehen.** --> Drill

⚠️ *(For us.)* In the app the boxes are not needed — the four get a **grey background** in the
real expression instead, which says the same thing without hiding anything. KaTeX does this
with `\colorbox{#eee}{$\ldots$}`, or more simply with a CSS class on the rendered span. Here in
the document, `\underbrace` is the portable version.


---

## 4 · Umstellen

What is joined by the **same** sign may be reordered and regrouped freely:

$$3x \cdot 2 = 2 \cdot 3x \qquad a+b+c = c+b+a \qquad 17+(3+8) = (17+3)+8$$

Two things to watch, and they are the two mistakes:

**Das Minus reist mit.** In $3x-2y$ the parts are $3x$ and $-2y$, so the swap is
$3x-2y = -2y+3x$, never $2y-3x$.

**Nur umstellen, was auf derselben Ebene steht.** In $3x+1$ the $+$ joins $3x$ and $1$ — the
$x$ alone is not one of them, the 3 has it.

> Das ist das **Kommutativgesetz** (vertauschen) und das **Assoziativgesetz** (umgruppieren).
> Sie ändern nur, wo etwas steht — nie, was da ist.

--> Drill

---

## 5 · Was jede der vier kann

Four lists. **Das ist der Stoff.**

Jede Liste endet mit ihren **Bedingungen**, denn manche Gesetze gelten nur manchmal. Und das
ist einfacher, als es aussieht:

> **In der ganzen Algebra gibt es nur zwei verbotene Dinge:**
> **durch $0$ teilen — und die Wurzel aus einer negativen Zahl.**
> **Jede Bedingung unten ist eines von diesen beiden.**

### 5.1 · Die Klammer — $(\bigcirc)$

Sie hält nur zusammen und tut sonst nichts — deshalb darf man sie setzen und weglassen, und
deshalb ist ihre ganze Liste eine Liste über **Hinein und Hinaus**.

**Weglassen, wenn nichts davor steht**

$$3+(4+5) = 3+4+5 \qquad a\cdot(b\cdot c) = a\cdot b\cdot c$$

**Ausmultiplizieren** — was hineingeht, geht zu **jedem** Summanden

$$a(b+c) = ab+ac$$
$$-(a+b) = -a-b \qquad \text{(das ist } (-1)(a+b) \text{, siehe §2)}$$
$$(a+b)(c+d) = ac+ad+bc+bd$$

**Die binomischen Formeln** — dasselbe, nur auswendig

$$(a+b)^2 = a^2+2ab+b^2 \qquad (a-b)^2 = a^2-2ab+b^2 \qquad (a+b)(a-b) = a^2-b^2$$

**Ausklammern** — derselbe Weg zurück

$$ab+ac = a(b+c) \qquad 3x+3 = 3(x+1)$$

**Klammer setzen, weil man muss.** Umformen kann ändern, *was* ein Teil ist — und dann zieht
plötzlich etwas daran, das vorher nicht drankam:

$$2x - \underbrace{2(x+1)}_{\text{ein Produkt}} \;\longrightarrow\; 2x - \underbrace{(2x+2)}_{\text{jetzt eine Summe — Klammer nötig}}$$

Ohne die Klammer steht da $2x-2x+2$: das Minus hat sich das $2x$ geholt und das $+2$ stehen
lassen. **Das ist §1, einen Schritt später.**

**Bedingungen: keine.** Alles oben gilt für alle Zahlen, immer. Die Klammer teilt nicht und
zieht keine Wurzel — es gibt also nichts, was verboten sein könnte.

> Alles hier ist das **Distributivgesetz**. Hinein heisst **ausmultiplizieren**, hinaus heisst
> **ausklammern**.

### 5.2 · Der Bruch — $\dfrac{\bigcirc}{\bigcirc}$

**Kürzen** — und nur das ist der Grund, warum §1 überhaupt wichtig ist:

$$\frac{a\cdot k}{b\cdot k} = \frac ab \qquad\qquad \frac{3x}{x} = 3 \qquad\qquad \frac{x+1}{x} \neq 1+1$$

- oben in $\frac{3x}{x}$ steht ein **Mal** — das $x$ ist ein **Faktor**
- oben in $\frac{x+1}{x}$ steht ein **Plus** — das $x$ ist ein **Summand**
- **Kürzen streicht Faktoren. Kein Faktor, kein Kürzen.**

⚠️ Nichts am Buchstaben $x$ unterscheidet die beiden. Das Zeichen über dem Bruchstrich
unterscheidet sie sofort.

**Erweitern**

$$\frac ab = \frac{a\cdot k}{b\cdot k}$$

**Addieren**

$$\frac ac+\frac bc = \frac{a+b}{c} \qquad\qquad \frac ab+\frac cd = \frac{ad+bc}{bd}$$

**Multiplizieren und dividieren**

$$\frac ab\cdot\frac cd = \frac{ac}{bd} \qquad\qquad \frac ab:\frac cd = \frac ab\cdot\frac dc$$

**Auseinandernehmen — oben ja, unten nein**

$$\frac{a+b}{c} = \frac ac+\frac bc \qquad\qquad \frac{c}{a+b} \neq \frac ca+\frac cb$$

**Bedingungen — alle vom selben Verbot: kein Nenner darf $0$ sein.**

| | |
|---|---|
| $\dfrac ab$ | $b \neq 0$ — sonst gibt es den Bruch gar nicht |
| kürzen und erweitern mit $k$ | $k \neq 0$ — man darf nicht mit $0$ streichen |
| $\dfrac ab : \dfrac cd$ | $c \neq 0$ — ⚠️ **neu**, denn das $c$ stand vorher oben |
| $\dfrac{c}{a+b}$ | $a+b \neq 0$ — nicht $a\neq0$ und $b\neq0$ |

### 5.3 · Die Wurzel — $\sqrt{\bigcirc}$

> $\sqrt a$ ist die **nicht-negative** Zahl, deren Quadrat $a$ ist.
> $\sqrt 9 = 3$, nicht $-3$. **Eine Wurzel gibt nie etwas Negatives zurück.**

$$\sqrt{ab} = \sqrt a\,\sqrt b \qquad \sqrt{\frac ab} = \frac{\sqrt a}{\sqrt b} \qquad \sqrt{a^2} = a$$

**Und was nicht geht:**

$$\sqrt{a+b} \neq \sqrt a+\sqrt b$$

**Bedingungen — hier drohen beide Verbote auf einmal:**

| | |
|---|---|
| $\sqrt a$ | $a \geq 0$ |
| $\sqrt{\frac ab}$ | $a \geq 0$ **und** $b > 0$ — nicht nur $\neq 0$ |
| $\sqrt{a^2} = a$ | **nur für $a\geq0$.** $\sqrt{(-3)^2} = \sqrt9 = 3$, nicht $-3$ |

⚠️ **Und die eine, die man sich nicht denken kann.** $\sqrt{ab} = \sqrt a\sqrt b$ verlangt
$a\geq0$ **und** $b\geq0$ — obwohl links $a\cdot b \geq 0$ genügen würde:

$$\sqrt{(-2)(-3)} = \sqrt6 \quad\text{geht.}\qquad \sqrt{-2}\,\sqrt{-3} \quad\text{geht nicht.}$$

**Auseinandernehmen macht die Bedingung strenger.** Das ist der einzige Ort in diesem
Dokument, wo ein Schritt erlaubt aussieht und trotzdem verboten ist.

### 5.4 · Die Potenz — $(\bigcirc)^{\bigcirc}$

$$a^m\cdot a^n = a^{m+n} \qquad \frac{a^m}{a^n} = a^{m-n} \qquad (a^m)^n = a^{m\cdot n}$$

$$(ab)^n = a^n b^n \qquad \left(\frac ab\right)^n = \frac{a^n}{b^n}$$

$$a^0 = 1 \qquad a^{-n} = \frac1{a^n}$$

**Und was nicht geht:**

$$(a+b)^2 \neq a^2+b^2$$

⚠️ Für $(a+b)^2$ gibt es kein Potenzgesetz — dafür gibt es die binomische Formel `[§5.1]`.

**Und jetzt der Rückblick auf §5.3:**

$$\sqrt a = a^{1/2} \qquad \sqrt[n]{a} = a^{1/n}$$

**Die Wurzel ist der Exponent $\frac12$** — und damit sind die drei Wurzelgesetze gar keine
eigenen Gesetze, sondern drei Zeilen von oben:

| aus §5.3 | ist | mit |
|---|---|---|
| $\sqrt{ab} = \sqrt a\sqrt b$ | $(ab)^n = a^nb^n$ | $n=\frac12$ |
| $\sqrt{\frac ab} = \frac{\sqrt a}{\sqrt b}$ | $\left(\frac ab\right)^n = \frac{a^n}{b^n}$ | $n=\frac12$ |
| $\sqrt{a^2} = a$ | $(a^m)^n = a^{mn}$ | $m=2,\; n=\frac12$ |

**Bedingungen — zwei Sätze, und beide sagen nur, welches der zwei Verbote droht:**

> **Sobald ein Exponent negativ ist, darf die Basis nicht $0$ sein** — denn $a^{-n}$ *ist* ein
> Bruch, und $0$ darf nicht unten stehen.
> **Sobald ein Exponent ein Bruch ist, darf die Basis nicht negativ sein** — denn ein Bruch im
> Exponenten *ist* eine Wurzel `[§5.3]`.

Damit sind alle Fälle abgedeckt: $a^0=1$, $a^{-n}=\frac1{a^n}$ und $\frac{a^m}{a^n}=a^{m-n}$
brauchen $a\neq0$; $(a^m)^n = a^{mn}$ und $(ab)^n=a^nb^n$ brauchen $a,b\geq0$, sobald ein
Exponent kein ganzes ist.

⚠️ **Die dritte Zeile der Tabelle ist genau der Fall, in dem das Gesetz kippt** — und die
Bedingung dazu kennen sie schon aus §5.3:

$$\big((-3)^2\big)^{1/2} = \sqrt9 = 3 \qquad\text{aber}\qquad (-3)^{2\cdot\frac12} = -3$$

Deshalb steht bei $\sqrt{a^2}=a$ die Bedingung $a\geq0$ — nicht als Schikane, sondern weil
$(a^m)^n = a^{mn}$ sie braucht.

### 5.5 · Bedingungen verschwinden nicht

Die Bedingung liest man **am Schritt** ab, nicht am Resultat:

$$\frac{x(x-1)}{x} = x-1$$

Rechts steht $x-1$, und da ist nichts Verbotenes zu sehen. Trotzdem gilt die Zeile nur für
$x \neq 0$ — **das $x$, das man gekürzt hat, ist weg, seine Bedingung nicht.**

Dasselbe bei $\frac ab : \frac cd$: das $c$ wandert nach unten, und ab da darf es nicht $0$
sein. Und bei $\sqrt{ab}=\sqrt a\sqrt b$, wo aus einer Bedingung zwei werden.

> **Wer etwas wegkürzt, wegteilt oder auseinandernimmt, muss die Bedingung mitnehmen.**

---

## 6 · Unsere Wörter

*(For us. These never reach the class.)*

- **Block** — one of the things a sign joins. In class always said with the name it already
  has: *Summand*, *Faktor*, *Basis*, *Zähler*.
- **Wand** — what the four in §3 have in common. In class they are simply listed. We need the
  word because the data layer and the drill generator have to say *the parts of a split* and
  *the thing that resists a pull* without enumerating four cases every time.

⚠️ **What we give up by not teaching *Wand*:** a fifth resister — $|x|$, $f(\dots)$ — arrives
as a new fact instead of an instance. For a class that meets exactly these four, that is the
right trade.

⚠️ **And what we give up in §5:** $\frac{a+b}{c}$, $\sqrt{ab}$, $(ab)^n$ and $a(b+c)$ are one
move seen four times. The class gets four lists. That is deliberate — see §0.

---

## 7 · Open

1. Does the pull picture reach the **equation**? Solving is where they spend most of their
   time and the likeliest place for it to break. §5.5 is the half that already reaches it —
   *Definitionsbereich* is exactly "die Bedingung mitnehmen".
2. §5.1 has both *ausmultiplizieren* and the binomischen Formeln. Are the formulas worth
   memorising separately, or is $(a+b)(c+d)$ enough and the rest arithmetic?
3. ~~Which of Wurzel/Potenz comes first?~~ **Decided: Wurzel first, Potenz points back.** What
   is left open is whether the Rückblick table in §5.4 is a *lesson* or only a *remark* — it
   retro-compresses three laws they have already memorised, and that only pays if they are
   made to notice.
4. Is §1 the opening screen of the **app**? Show $3(x+1)$ and $3x+1$, ask only *wo ist das
   $x+1$?*, and the whole idea is tested in one question.
