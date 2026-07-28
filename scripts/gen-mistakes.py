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
# THE SENTENCE IS THE BELIEF, STATED AS THE STUDENT HOLDS IT — so it reads as a
# claim that can be marked ✗, exactly as `rule.rule` reads as one that can be
# marked ✓. The error layer's `name` names the mistake from outside ("Losing one
# of two minuses"); this states it from inside ("Every minus is a subtraction").
M = {
 'mis.minus-roles-confused': (
   'Every minus is a subtraction',
   'Jedes Minus ist eine Subtraktion',
   [r'-(-a) \neq a']),
 'anti.commute-everything': (
   'Anything either side of an operator may be swapped',
   'Was links und rechts von einem Operator steht, darf vertauscht werden',
   [r'a - b = b - a', r'\frac{a}{b} = \frac{b}{a}']),
 'mis.adjacent-signs': (
   'Two operators may stand next to each other',
   'Zwei Operatoren dürfen nebeneinander stehen',
   []),
 'mis.subtraction-as-times-negative': (
   'Subtracting is multiplying by the negative',
   'Subtrahieren heisst mit dem Negativen multiplizieren',
   [r'a - b = a \cdot (-b)']),
 'mis.precedence-ignored': (
   'A term is worked out from left to right',
   'Ein Term wird von links nach rechts abgearbeitet',
   [r'2 + 3 \cdot 4 = 20']),
 'mis.exponent-scope': (
   'A power applies to everything written before it',
   'Eine Potenz gilt für alles, was davor steht',
   [r'-a^2 = (-a)^2', r'ab^2 = (ab)^2']),
 'mis.bracket-dissolved': (
   'A bracket may be dropped without multiplying out',
   'Eine Klammer darf man weglassen, ohne auszumultiplizieren',
   [r'(a+b)c = a + bc']),
 'sal.loudest-op-wins': (
   'The operation that catches the eye is the main one',
   'Die Operation, die ins Auge springt, ist die Hauptoperation',
   []),
 'mis.redundant-brackets-kept': (
   'Every bracket changes the reading',
   'Jede Klammer ändert die Lesart',
   [r'(ab)c \neq abc']),
 'anti.linearity': (
   'Every operation spreads over a plus',
   'Jede Operation verteilt sich über ein Plus',
   [r'(a+b)^2 = a^2 + b^2', r'\sqrt{a+b} = \sqrt{a} + \sqrt{b}']),
 'anti.partial-distribution': (
   'The factor in front reaches only the first term',
   'Der Faktor davor erreicht nur den ersten Term',
   [r'a(b+c) = ab + c']),
 'anti.power-of-product-partial': (
   'A power on a bracket reaches only one factor',
   'Eine Potenz auf einer Klammer erreicht nur einen Faktor',
   [r'(ab)^n = ab^n']),
 'anti.exponent-arithmetic': (
   'The operation on the powers is the operation on the exponents',
   'Die Operation auf den Potenzen ist die Operation auf den Exponenten',
   [r'x^a \cdot x^b = x^{ab}', r'(x^a)^b = x^{a+b}']),
 'anti.repetition-confusion': (
   'A power and a coefficient repeat the same operation',
   'Potenz und Koeffizient wiederholen dieselbe Operation',
   [r'a^2 = 2a']),
 'anti.zero-exponent': (
   'An exponent of zero makes the whole power zero',
   'Ein Exponent null macht die ganze Potenz null',
   [r'a^0 = 0']),
 'mis.negative-exponent-negates': (
   'A minus in the exponent makes the value negative',
   'Ein Minus im Exponenten macht den Wert negativ',
   [r'x^{-1} = -x']),
 'mis.root-scope': (
   'The root bar covers only the first term',
   'Der Wurzelstrich deckt nur den ersten Term',
   [r'\sqrt{a+b} = \sqrt{a} + b']),
 'anti.fraction-addition': (
   'Fractions add numerator to numerator and denominator to denominator',
   'Brüche addiert man Zähler zu Zähler und Nenner zu Nenner',
   [r'\frac{a}{b} + \frac{c}{d} = \frac{a+c}{b+d}']),
 'mis.fraction-bar-grouping-lost': (
   'Only the first term of the numerator is divided',
   'Nur der erste Term des Zählers wird geteilt',
   [r'\frac{a+b}{c} = a + \frac{b}{c}']),
 'mis.linear-slash-overgrouped': (
   'Everything written before a slash is divided by what follows',
   'Alles vor dem Schrägstrich wird durch das Folgende geteilt',
   [r'a + b/c = \frac{a+b}{c}']),
 'mis.bar-not-division': (
   'A fraction is a different kind of object from a division',
   'Ein Bruch ist etwas anderes als eine Division',
   [r'\frac{3}{4} \neq 3 : 4']),
 'anti.conjoining': (
   'Every sum can be collapsed into a single term',
   'Jede Summe lässt sich zu einem einzigen Term zusammenfassen',
   [r'2 + 3x = 5x', r'3x + 2y = 5xy']),
 'mis.juxtaposition-as-plus': (
   'Two things written side by side are added',
   'Zwei Dinge nebeneinander werden addiert',
   [r'3x = 3 + x']),
 'mis.invisible-one-lost': (
   'A term with no coefficient written has none to count',
   'Ein Term ohne geschriebenen Koeffizienten zählt nicht mit',
   [r'a + 3a = 3a']),
 'sal.implicit-op-overlooked': (
   'Where no sign is written there is no operation',
   'Wo kein Zeichen steht, ist keine Operation',
   []),
 'mis.letters-differ': (
   'A letter is a word or a unit, not a number',
   'Ein Buchstabe ist ein Wort oder eine Einheit, keine Zahl',
   [r'a + a \neq 2a']),
 'mis.order-blindness': (
   'Writing the factors the other way round changes the term',
   'Die Faktoren anders herum zu schreiben ändert den Term',
   [r'a \cdot 3 \neq 3a']),
 'anti.quadratic-pair-unchecked': (
   'The numbers in the brackets can be read off the term',
   'Die Zahlen in den Klammern kann man am Term ablesen',
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
