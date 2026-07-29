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
import json, collections, sys

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
   [r'(a+b)^2 = a^2 + b^2', r'\sqrt{a+b} = \sqrt{a} + \sqrt{b}']),
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

src = json.load(open('src/data/errors.json'))
out = []
for sec in src['sections']:
    for g in sec['groups']:
        for e in g['errors']:
            if e['id'] not in M:
                sys.exit(f'unauthored mistake: {e["id"]}')
            en, de, latex = M[e['id']]
            out.append({
                'id': e['id'],
                'kind': e['kind'],
                'topic': sec['slug'],
                'frequency': e.get('frequency', 1),
                'mistake': {'en': en, 'de': de},
                'latex': latex,
                # The diagnosis carries over untouched: it was always a statement
                # about the misconception, never about one case of it.
                'note': e['note'],
                'breaks': e.get('rules', []),
                'corrupts': e.get('corrupts', []),
            })

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
json.dump(doc, open('src/data/mistakes.json', 'w'), ensure_ascii=False, indent=2)
print(f'{len(out)} mistakes; latex on {sum(1 for m in out if m["latex"])}, '
      f'{sum(1 for m in out if not m["latex"])} deliberately without')
print('by kind:', dict(collections.Counter(m['kind'] for m in out)))
print('by topic:', dict(collections.Counter(m['topic'] for m in out)))
