#!/usr/bin/env python3
"""Derive src/data/mistakes.json from errors.json's GENERAL half.

The split: a mistake pool entry keeps what is true of the misconception itself
(the false sentence, its diagnosis, how often it is made, the rule it breaks, the
cards it corrupts). What it does NOT take is `instances` and `fix` — those work a
CASE, and a case belongs to a skill.

`mistake` and `latex` are authored here; everything else carries over unchanged so
the two files cannot disagree about frequency, kind, topic or the edges.

Raw strings: a `\\;` in a normal string loses its backslash and KaTeX compiles the
result happily, because semicolons are valid LaTeX.
"""
import json, collections, sys, difflib, pathlib

# id -> (en sentence, de sentence, [false claims as LaTeX])
# THE SENTENCE IS THE CORRECTION, AND ITS MOOD IS PICKED BY `kind` (2026-07-29).
# It was briefly the belief stated from inside ("Every minus is a subtraction"),
# which was wrong on the page: under a ✗ the reader has to negate a false sentence
# themselves before it means anything. Stated as a correction it needs no
# unpacking, and the kind decides the mood:
#
#   anti-law   "Don't …"      a prohibition on a specific generative move
#   omission   "Don't …"      the same, for a step simply not taken
#   misreading "A is not B"   a decoding correction
#   salience   "A is not B"   the same, for what was looked at
#
# ⚠️ THE ONE AUTHORING RULE THAT KEEPS THE TWO POOLS APART. 14 of the 28 are 1:1
# with a rule, so a mistake phrased as a GENERAL prohibition just is that rule in
# the negative. Name the SPECIFIC tempting move — "Don't stop at the first term in
# the bracket", never "Only multiplication distributes".
M = {
 'mis.minus-roles-confused': (
   'Not every minus is a subtraction',
   'Nicht jedes Minus ist eine Subtraktion',
   [r'-(-a) \neq a']),
 'anti.commute-everything': (
   'Don’t swap across a minus or a fraction bar',
   'Nicht über ein Minus oder einen Bruchstrich hinweg vertauschen',
   [r'a - b = b - a', r'\frac{a}{b} = \frac{b}{a}']),
 'omi.adjacent-signs': (
   'Don’t leave a negative unbracketed after an operator',
   'Eine negative Zahl nach einem Operator nicht ohne Klammer lassen',
   []),
 'mis.subtraction-as-times-negative': (
   'Subtracting is not multiplying by the negative',
   'Subtrahieren ist nicht Multiplizieren mit dem Negativen',
   [r'a - b = a \cdot (-b)']),
 'mis.precedence-ignored': (
   'Left to right is not the order',
   'Von links nach rechts ist nicht die Reihenfolge',
   [r'2 + 3 \cdot 4 = 20']),
 'mis.exponent-scope': (
   'A power does not reach back past one symbol',
   'Eine Potenz greift nicht weiter zurück als ein Zeichen',
   [r'-a^2 = (-a)^2', r'ab^2 = (ab)^2']),
 'anti.bracket-dissolved': (
   'Don’t drop a bracket without multiplying it out',
   'Eine Klammer nicht weglassen, ohne auszumultiplizieren',
   [r'(a+b)c = a + bc']),
 'sal.loudest-op-wins': (
   'The loudest operation is not the main one',
   'Die auffälligste Operation ist nicht die Hauptoperation',
   []),
 'omi.redundant-brackets-kept': (
   'Don’t keep a bracket that changes nothing',
   'Eine Klammer, die nichts ändert, nicht stehen lassen',
   [r'(ab)c \neq abc']),
 'anti.linearity': (
   'Don’t spread a power or a root over a plus',
   'Eine Potenz oder Wurzel nicht über ein Plus verteilen',
   [r'(a+b)^n = a^n + b^n', r'\sqrt{a+b} = \sqrt{a} + \sqrt{b}']),
 'anti.partial-distribution': (
   'Don’t stop at the first term in the bracket',
   'Nicht beim ersten Term in der Klammer aufhören',
   [r'a(b+c) = ab + c']),
 'anti.power-of-product-partial': (
   'Don’t let the power skip a factor',
   'Die Potenz keinen Faktor überspringen lassen',
   [r'(ab)^n = ab^n']),
 'anti.exponent-arithmetic': (
   'Don’t copy the operation down into the exponents',
   'Die Operation nicht in die Exponenten übernehmen',
   [r'x^a \cdot x^b = x^{ab}', r'(x^a)^b = x^{a+b}']),
 'anti.repetition-confusion': (
   'Don’t read a square as a double',
   'Ein Quadrat nicht als das Doppelte lesen',
   [r'a^2 = 2a']),
 'anti.zero-exponent': (
   'Don’t read a zero exponent as a zero answer',
   'Einen Exponenten null nicht als Ergebnis null lesen',
   [r'a^0 = 0']),
 'mis.negative-exponent-negates': (
   'A minus in the exponent is not a minus on the value',
   'Ein Minus im Exponenten ist kein Minus am Wert',
   [r'x^{-1} = -x']),
 'mis.root-scope': (
   'The root bar does not stop after the first term',
   'Der Wurzelstrich hört nicht nach dem ersten Term auf',
   [r'\sqrt{a+b} = \sqrt{a} + b']),
 'anti.fraction-addition': (
   'Don’t add fractions straight across',
   'Brüche nicht einfach quer addieren',
   [r'\frac{a}{b} + \frac{c}{d} = \frac{a+c}{b+d}']),
 'anti.minus-on-both-parts': (
   'Don’t put one minus in two places',
   'Ein Minus nicht an zwei Stellen setzen',
   [r'-\frac{a}{b} = \frac{-a}{-b}']),
 'mis.fraction-bar-grouping-lost': (
   'The first term alone is not the numerator',
   'Der erste Term allein ist nicht der Zähler',
   [r'\frac{a+b}{c} = a + \frac{b}{c}']),
 'mis.linear-slash-overgrouped': (
   'Everything before the slash is not the numerator',
   'Alles vor dem Schrägstrich ist nicht der Zähler',
   [r'a + b/c = \frac{a+b}{c}']),
 'mis.bar-not-division': (
   'The bar is not a new operation',
   'Der Bruchstrich ist keine neue Operation',
   [r'\frac{3}{4} \neq 3 : 4']),
 'anti.conjoining': (
   'Don’t force unlike terms together',
   'Ungleiche Terme nicht zusammenzwingen',
   [r'2 + 3x = 5x', r'3x + 2y = 5xy']),
 'mis.juxtaposition-as-plus': (
   'Side by side is not plus',
   'Nebeneinander ist nicht plus',
   [r'3x = 3 + x']),
 'mis.invisible-one-lost': (
   'A missing number in front is not a missing term',
   'Eine fehlende Zahl davor ist kein fehlender Term',
   [r'a + 3a = 3a']),
 'sal.implicit-op-overlooked': (
   'No sign does not mean no operation',
   'Kein Zeichen heisst nicht keine Operation',
   []),
 'mis.letters-differ': (
   'A letter is not a word or a unit',
   'Ein Buchstabe ist kein Wort und keine Einheit',
   [r'a + a \neq 2a']),
 'mis.order-blindness': (
   'The other way round is not a different term',
   'Andersherum ist kein anderer Term',
   [r'a \cdot 3 \neq 3a']),
 'anti.quadratic-pair-unchecked': (
   'Don’t copy the numbers out of the term',
   'Die Zahlen nicht aus dem Term abschreiben',
   [r'x^2 + 5x + 6 = (x+5)(x+6)']),
}

# ── FAMILIES (2026-07-30) ────────────────────────────────────────────────────
# The same mechanism as a rule's `family`, one level deep, and it exists because
# `kind` is too coarse to be one: `anti.linearity` and `anti.partial-distribution`
# are both anti-laws and are not the same failure at all — one INVENTED a move,
# the other made the right move and stopped early. The family is what makes an
# error message read the way a teacher says it:
#
#     Forced move · Don't spread a power or a root over a plus
# id -> (en, de) THE HANDLE, not the sentence — the same field a rule carries and
# for the same reason: /skills prints the name in the ✗ column and links out, and
# a name trains recognition where a sentence only gets read.
SHORT = {
 # ⚠️ A MISTAKE'S NAME MUST READ AS AN ERROR UNDER A ✗ (2026-07-31). A rule's
 # shortName names what you do RIGHT; a mistake's must name what GOES WRONG, and
 # the pool has exactly two shapes that pass: the PROHIBITION ("Kein Kürzen über
 # Summen") and the DONE-WRONG PARTICIPLE ("übersehen", "gerechnet"). Anything
 # else is a topic label wearing an error's clothes — "Von links nach rechts" is
 # an order, "Von links nach rechts gerechnet" is a mistake.
 #
 # ⚠️ AND IT MUST BE A NAME A STUDENT HEARS, not one a teacher reads. Nine
 # candidates were rejected on this: "Linearitätsfehler" is a term from
 # maths-education RESEARCH, and "Zusammenziehen" / "Buchstabe als Etikett" are
 # diagnosis language — what a teacher says ABOUT a student. Better no shortName
 # than a contrived one; most of this pool correctly has none.
 'mis.precedence-ignored':      ('Computed left to right', 'Von links nach rechts gerechnet'),
 'sal.implicit-op-overlooked':  ('Invisible dot missed',   'Unsichtbarer Punkt übersehen'),
 'mis.invisible-one-lost':      ('Invisible one missed',   'Unsichtbare Eins übersehen'),
 'anti.commute-everything':     ('No swapping across a minus', 'Kein Vertauschen über Minus'),
 'anti.partial-distribution':   ('Half-distributed',       'Halb ausmultipliziert'),
}

# id -> {'en'/'de': device}. A MEMORY DEVICE — rhyme, acronym, cadence.
# ⚠️ If it is merely short it belongs in SHORT. The rules pool had 3 of 7 wrong.
MNEM = {}

FAMILY = {
 # The one shape inside the forced-move basket worth naming on its own.
 'anti.linearity':           'anti.freshmans-dream',
 # Lesefehler — every mistake that breaks a `rule.read-the-term-first` rule.
 'mis.precedence-ignored':         'mis.term-misread',
 'mis.exponent-scope':             'mis.term-misread',
 'anti.bracket-dissolved':         'mis.term-misread',
 'sal.loudest-op-wins':            'mis.term-misread',
 'omi.redundant-brackets-kept':    'mis.term-misread',
 'anti.repetition-confusion':      'mis.term-misread',
 'mis.root-scope':                 'mis.term-misread',
 'mis.fraction-bar-grouping-lost': 'mis.term-misread',
 'mis.linear-slash-overgrouped':   'mis.term-misread',
 'mis.bar-not-division':           'mis.term-misread',
 'mis.juxtaposition-as-plus':      'mis.term-misread',
 'mis.invisible-one-lost':         'mis.term-misread',
 'sal.implicit-op-overlooked':     'mis.term-misread',
 'mis.letters-differ':             'mis.term-misread',
 'mis.order-blindness':            'mis.term-misread',
 'anti.conjoining':          'anti.forced-move',
 'anti.fraction-addition':   'anti.forced-move',
 'anti.exponent-arithmetic': 'anti.forced-move',
 'anti.commute-everything':  'anti.forced-move',
 'anti.minus-on-both-parts': 'anti.forced-move',
}

# ── POOL-ONLY ENTRIES ────────────────────────────────────────────────────────
# ⚠️ THESE HAVE NO errors.json TWIN, AND CANNOT HAVE ONE. `errorInstance.wrong` is
# REQUIRED, and an inactivity error writes nothing at all — so errors.json, which
# exists to carry concrete wrong→right instances, has no way to express it. That
# is itself the evidence that the model had no room for the stop signal.
#
# ⚠️ BOTH ARE TASK-RELATIVE, and they are the only two entries here that are.
# Every other mistake is false whatever was asked — `3x = 3+x` is wrong on any
# page. "You did nothing" and "you did something" are mistakes only GIVEN A JOB,
# so they may be shown inside a drill with a stated task, and on a page only where
# the task is stated.
#
# ⚠️ `topic` IS OMITTED ON A HEAD. A family cuts across topics: forced moves happen
# in distributing, fractions, powers and terms alike, so naming one would be a lie.
POOL_ONLY = [
 {
  'id': 'anti.forced-move',
  'kind': 'anti-law',
  'head': True,
  'frequency': 3,
  'mistake': {
    'en': 'Forced move',
    'de': 'Erzwungener Schritt',
  },
  'latex': [],
  'note': {
    'en': 'A move invented because one seemed to be required. The belief underneath is that every expression can be made shorter, so a rule is reached for that does not apply here. ⚠️ This is the FAMILY, never the diagnosis: where a specific tempting move can be named, name it — a student who wrote $\\sqrt{a^2+b^2} = a+b$ needs to hear that a root does not spread over a plus, not that they invented a move.',
    'de': 'Ein Schritt wird erfunden, weil einer verlangt schien. Dahinter steht die Annahme, jeder Term lasse sich kürzer schreiben — also wird eine Regel geholt, die hier nicht gilt. ⚠️ Das ist die FAMILIE, nie die Diagnose: Wo sich ein bestimmter verlockender Schritt benennen lässt, wird er benannt.',
  },
  'breaks': [],
  'corrupts': [],
 },
 # ── FOUND BY THE PROHIBITION SWEEP (2026-07-31) ──────────────────────────────
 # Three rules stated a prohibition in their own sentence with NO mistake naming
 # it — the anti-law hiding inside a rule, the same shape as the orphaned rules
 # the skills pass turned up. Found by testing every rule sentence for a
 # never/only/nicht/nur and asking which had nothing in `breaks` pointing back.
 #
 # ⚠️ THESE ARE NOT IN errors.json AND MUST NOT BE ADDED TO IT. That file is
 # legacy; POOL_ONLY is where a mistake is authored now. They declare their own
 # `topic` rather than inheriting one from the errors tree.
 # ── LESEFEHLER (2026-07-31), and its membership is DERIVED, not chosen ───────
 # The ✗ counterpart of the rules pool's `rule.read-the-term-first`, which had no
 # mirror. A mistake belongs here iff it BREAKS a rule in that family — 15 do, and
 # none of them had a family before, so nothing had to be taken from anywhere.
 #
 # ⚠️ IT IS NOT `kind` UNDER ANOTHER NAME, which is the obvious objection and it
 # was checked: the 15 span all four kinds (10 misreading, 2 anti-law, 2 salience,
 # 1 omission), and 4 of the 13 misreadings stay OUT because they are about what a
 # symbol MEANS rather than how far it REACHES.
 {
  'id': 'mis.term-misread',
  'kind': 'misreading',
  'head': True,
  'frequency': 3,
  'mistake': {
    'en': 'The term was read wrong before anything was done to it',
    'de': 'Der Term wurde falsch gelesen, bevor überhaupt gerechnet wurde',
  },
  'shortName': {'en': 'Misreading', 'de': 'Lesefehler'},
  'latex': [],
  'note': {
    'en': 'Nothing here is a wrong MOVE — the move may even be correct for the term the student saw. What failed is the reading: how far a bar, a root, an exponent or an invisible operator reaches. That is why these sit together despite spanning every kind, and why the cure is always the same one: read the term first, name the main operation, and only then reach for a rule.',
    'de': 'Keiner dieser Fehler ist ein falscher SCHRITT — der Schritt kann für den Term, den man gesehen hat, sogar richtig sein. Falsch war das Lesen: wie weit ein Bruchstrich, eine Wurzel, ein Exponent oder ein unsichtbarer Operator reicht. Darum gehören sie zusammen, obwohl sie jede Art umfassen, und darum ist die Abhilfe immer dieselbe: zuerst den Term lesen, die Hauptoperation benennen, und erst dann zu einer Regel greifen.',
  },
  'breaks': [],
  'corrupts': [],
 },
 # ── FRESHMAN'S DREAM (2026-07-31, the author's) ──────────────────────────────
 # $f(a+b) = f(a) + f(b)$ for an $f$ that does no such thing. `anti.forced-move`
 # stays the general basket; this is the one shape inside it common enough to be
 # worth naming, and the name is the standard one for $(a+b)^n = a^n + b^n$.
 #
 # ⚠️ THE SHORTNAME IS THE SAME IN BOTH LANGUAGES — deliberate, and the only entry
 # like it. There is no German version in classroom use ("Traum des Erstsemesters"
 # is a translation nobody says), and the English is memorable enough to be worth
 # borrowing whole. It passes the reads-as-an-error test by IRONY rather than by
 # grammar: a dream is exactly a thing that is not true.
 {
  'id': 'anti.freshmans-dream',
  'kind': 'anti-law',
  'head': True,
  'frequency': 3,
  'mistake': {
    'en': 'Not every operation spreads over a plus',
    'de': 'Nicht jede Operation verteilt sich über ein Plus',
  },
  'shortName': {'en': "Freshman's dream", 'de': "Freshman's dream"},
  'latex': [],
  'note': {
    'en': 'The wish that every operation behaves like multiplication. Multiplication really does spread over a plus, and it is met first and used constantly, so it becomes the shape every other operation is expected to have. It never is: a power, a root and a denominator all fail it. ⚠️ This is the FAMILY, never the diagnosis — a student who wrote $\\sqrt{a^2+b^2} = a+b$ needs to hear which operation failed, not that they dreamt.',
    'de': 'Der Wunsch, jede Operation verhalte sich wie die Multiplikation. Die Multiplikation verteilt sich wirklich über ein Plus, man begegnet ihr zuerst und braucht sie ständig — also wird sie zur Form, die man von jeder anderen Operation erwartet. Sie hat sie nie: Potenz, Wurzel und Nenner scheitern alle daran. ⚠️ Das ist die FAMILIE, nie die Diagnose: Wer $\\sqrt{a^2+b^2} = a+b$ schreibt, muss hören, welche Operation versagt, nicht dass sie geträumt hat.',
  },
  'breaks': [],
  'corrupts': [],
 },
 {
  'id': 'anti.cancel-over-sum',
  'kind': 'anti-law',
  'family': 'anti.forced-move',
  'topic': 'fractions',
  'frequency': 3,
  'mistake': {
    'en': 'Don’t cancel one term out of a sum',
    'de': 'Nicht einen einzelnen Summanden wegkürzen',
  },
  'shortName': {
    'en': 'Cancelling over a sum',
    'de': 'Kein Kürzen über Summen',
  },
  'latex': [r'\frac{a+b}{b} = a', r'\frac{2x+3}{2} = x+3'],
  'note': {
    'en': 'Cancelling divides top and bottom by the same number, so that number has to be a factor of the WHOLE of each — and a summand is not. Check with numbers: $\frac{2+4}{2}$ is $3$, not $4$. The pull is that the $b$ is visible in both places, which looks like permission.',
    'de': 'Kürzen teilt oben und unten durch dieselbe Zahl, diese Zahl muss also Faktor des GANZEN sein — ein Summand ist das nicht. Mit Zahlen prüfen: $\frac{2+4}{2}$ ist $3$, nicht $4$. Verlockend ist es, weil das $b$ oben und unten sichtbar dasteht, was wie eine Erlaubnis aussieht.',
  },
  'breaks': ['rule.fraction-cancel'],
  'corrupts': ['th.cancel-common-factor'],
 },
 {
  'id': 'anti.split-denominator',
  'kind': 'anti-law',
  'family': 'anti.freshmans-dream',
  'topic': 'fractions',
  'frequency': 2,
  'mistake': {
    'en': 'Don’t split a sum in the denominator',
    'de': 'Eine Summe im Nenner nicht aufteilen',
  },
  'shortName': {
    'en': 'Splitting the denominator',
    'de': 'Kein Aufteilen im Nenner',
  },
  'latex': [r'\frac{c}{a+b} = \frac{c}{a} + \frac{c}{b}'],
  'note': {
    'en': 'The numerator splits because dividing by $c$ is multiplying by $\frac{1}{c}$, and multiplication distributes. Nothing distributes over the denominator. Check with numbers: $\frac{12}{2+4} = 2$, while $\frac{12}{2} + \frac{12}{4} = 9$. It is the mirror of a move that IS legal, which is what makes it tempting.',
    'de': 'Der Zähler lässt sich aufteilen, weil Teilen durch $c$ Multiplizieren mit $\frac{1}{c}$ ist und die Multiplikation sich verteilt. Über den Nenner verteilt sich nichts. Mit Zahlen prüfen: $\frac{12}{2+4} = 2$, aber $\frac{12}{2} + \frac{12}{4} = 9$. Es ist das Spiegelbild eines erlaubten Schrittes, und genau das macht es verlockend.',
  },
  'breaks': ['rule.split-numerator'],
  'corrupts': ['th.split-numerator'],
 },
 {
  'id': 'anti.associate-everything',
  'kind': 'anti-law',
  'family': 'anti.forced-move',
  'topic': 'minus',
  'frequency': 2,
  'mistake': {
    'en': 'Don’t regroup across a minus or a division',
    'de': 'Nicht über ein Minus oder ein Geteilt hinweg umklammern',
  },
  'shortName': {
    'en': 'Regrouping anything',
    'de': 'Kein Umklammern über Minus',
  },
  'latex': [r'(a-b)-c = a-(b-c)', r'(a:b):c = a:(b:c)'],
  'note': {
    'en': 'The exact counterpart of swapping across a minus, and it comes from the same belief: that brackets in a chain never matter. In a pure sum or product they do not, which is why $a+b+c$ needs none — but $(8-3)-2 = 3$ while $8-(3-2) = 7$.',
    'de': 'Das genaue Gegenstück zum Vertauschen über ein Minus, und es kommt aus derselben Annahme: Klammern in einer Kette seien egal. In einer reinen Summe oder einem reinen Produkt sind sie es, darum braucht $a+b+c$ keine — aber $(8-3)-2 = 3$ und $8-(3-2) = 7$.',
  },
  'breaks': ['rule.only-plus-and-times-associate'],
  'corrupts': ['ax.add-associative', 'ax.mul-associative'],
 },
 {
  'id': 'omi.no-move-attempted',
  'kind': 'omission',
  'frequency': 2,
  'mistake': {
    'en': 'Nothing attempted',
    'de': 'Nichts versucht',
  },
  'latex': [],
  'note': {
    'en': 'The form was left standing although a rule applies to it. Nothing false is written — the shape was simply not recognised, which is why it shows as a blank rather than as a wrong answer, and why the only justification such a skill has is that other skills require it.',
    'de': 'Der Term bleibt stehen, obwohl eine Regel darauf passt. Es wird nichts Falsches geschrieben — die Gestalt wurde schlicht nicht erkannt. Darum steht hier kein falscher Term, sondern nichts, und darum rechtfertigt sich eine solche Fertigkeit nur dadurch, dass andere sie voraussetzen.',
  },
  'breaks': [],
  'corrupts': [],
 },
]

src = json.load(open('src/data/errors.json'))
out = []
for sec in src['sections']:
    for g in sec['groups']:
        for e in g['errors']:
            if e['id'] not in M:
                sys.exit(f'unauthored mistake: {e["id"]}')
            en, de, latex = M[e['id']]
            entry = {
                'id': e['id'],
                'kind': e['kind'],
            }
            if e['id'] in FAMILY:
                entry['family'] = FAMILY[e['id']]
            entry.update({
                'topic': sec['slug'],
                'frequency': e.get('frequency', 1),
                'mistake': {'en': en, 'de': de},
            })
            if e['id'] in SHORT:
                sen, sde = SHORT[e['id']]
                entry['shortName'] = {k: v for k, v in (('en', sen), ('de', sde)) if v}
            entry['latex'] = latex
            # The diagnosis carries over untouched: it was always a statement
            # about the misconception, never about one case of it.
            entry['note'] = e['note']
            if e['id'] in MNEM:
                entry['mnemonic'] = MNEM[e['id']]
            entry.update({
                'breaks': e.get('rules', []),
                'corrupts': e.get('corrupts', []),
            })
            out.append(entry)

# The pool-only entries go last: they carry no `topic`, so they belong to no
# section of the errors tree and have no position in it to inherit.
out.extend(POOL_ONLY)

doc = {
  'layer': 'mistakes',
  'title': {'en': 'All mistakes', 'de': 'Alle Fehler'},
  'blurb': {
    'en': 'Every misconception worth naming, one false sentence each — and the rule it breaks.',
    'de': 'Jede Fehlvorstellung, die einen Namen verdient, je ein falscher Satz — und die Regel, die sie verletzt.',
  },
  'note': {
    'en': "The anti-registry, and the negative face of `rules.json`: a flat collection of the false sentences students actually believe, each one saying what a written form is wrongly taken to mean or what may wrongly be done to it. Like the rules it carries no context of its own — the skills supply that by citing it alongside worked examples — but unlike a rule it is *defined against* something: `breaks` names the rule it violates, which is the one place in this design where one pool cites another. `frequency` is evidence from docs/common_mistakes.md and is the field that can live nowhere else: a rule is not more or less true, a mistake is more or less made.",
    'de': "Das Anti-Register und die negative Seite von `rules.json`: eine flache Sammlung der falschen Sätze, die Schülerinnen und Schüler tatsächlich glauben — was eine Schreibweise fälschlich bedeuten soll oder was man fälschlich mit ihr tun darf. Wie die Regeln trägt ein Eintrag keinen eigenen Kontext; den liefern die Fertigkeiten, die ihn mit Beispielen zitieren. Anders als eine Regel ist er aber *gegen etwas* definiert: `breaks` nennt die verletzte Regel — die einzige Stelle in diesem Entwurf, an der ein Pool einen anderen zitiert. `frequency` stammt aus docs/common_mistakes.md und kann nirgends sonst leben: eine Regel ist nicht mehr oder weniger wahr, ein Fehler wird mehr oder weniger oft gemacht.",
  },
  'mistakes': out,
}
# --check is the DRIFT GUARD, and it is why this file may be regenerated but
# never hand-edited. mistakes.json derives its frequency, kind, topic, corrupts
# and breaks from errors.json; while both files exist, an edit to one silently
# stops matching the other, and nothing else in the pipeline would notice.
TARGET = 'src/data/mistakes.json'
text = json.dumps(doc, ensure_ascii=False, indent=2) + '\n'
if '--check' in sys.argv:
    on_disk = pathlib.Path(TARGET).read_text()
    if on_disk != text:
        diff = difflib.unified_diff(on_disk.splitlines(), text.splitlines(),
                                    'on disk', 'regenerated', lineterm='', n=1)
        print('✗ mistakes.json has drifted from errors.json + the generator.')
        print('\n'.join(list(diff)[:40]))
        print('\n  run: python3 scripts/gen-mistakes.py')
        sys.exit(1)
    print(f'✓ mistakes.json matches errors.json ({len(out)} mistakes).')
    sys.exit(0)

pathlib.Path(TARGET).write_text(text)
print(f'{len(out)} mistakes; latex on {sum(1 for m in out if m["latex"])}, '
      f'{sum(1 for m in out if not m["latex"])} deliberately without')
print('by kind:', dict(collections.Counter(m['kind'] for m in out)))
print('by topic:', dict(collections.Counter(m.get('topic', '—') for m in out)))
