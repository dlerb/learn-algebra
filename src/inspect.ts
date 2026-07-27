// The presentation / inspection switch — now for ALL SEVEN layers, not just the
// curated three (2026-07-27, with the row shell).
//
// Every page has two audiences with one body of content: a STUDENT reading the
// mistakes, and the AUTHOR checking the data. Rather than two pages that drift
// apart, one page with two modes — and PRESENTATION IS THE DEFAULT, deliberately.
// The author sits in this app far more than any student does; if inspection were
// the default, the student view would rot silently until the day it went on the
// projector. This way every visit shows what they see.
//
// Inspection hides nothing that is content — a mistake's `corrupts` target is
// real teaching material and gets rendered as prose in presentation too. What it
// adds is the plumbing: ids, kind tags, raw JSON, the unused/coverage warnings.
import { ref, watch } from 'vue'

// THE GATE IS DEV, NOT A URL PARAMETER (docs/TODO.md, decided 2026-07-26). The
// `source` deep link beside it talks to an `apply: 'serve'` endpoint that does
// not exist in a build, and production needs no `json` either — so the whole of
// the author plumbing keys off one compile-time constant and the `?inspect`
// escape hatch is gone with it.
//
// The toggle itself STAYS (LayerPage renders it), because it is what lets the
// author preview the student view — the reason presentation is the default in the
// first place. A pure `DEV` gate with no switch would mean the author never sees
// the page a student sees.
export const inspectAvailable = import.meta.env.DEV

const stored = localStorage.getItem('inspect') === '1'
export const inspect = ref(inspectAvailable && stored)
watch(inspect, v => localStorage.setItem('inspect', v ? '1' : '0'))
