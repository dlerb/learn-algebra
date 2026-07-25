// The presentation / inspection switch for the curated pages.
//
// Every curated page (/errors first, metapatterns and skills to follow) has two
// audiences with one body of content: a STUDENT reading the mistakes, and the
// AUTHOR checking the data. Rather than two pages that drift apart, one page with
// two modes — and PRESENTATION IS THE DEFAULT, deliberately. The author sits in
// this app far more than any student does; if inspection were the default, the
// student view would rot silently until the day it went on the projector. This
// way every visit shows what they see.
//
// Inspection hides nothing that is content — a mistake's `corrupts` target is
// real teaching material and gets rendered as prose in presentation too. What it
// adds is the plumbing: ids, kind tags, raw JSON, the unused/coverage warnings.
import { ref, watch } from 'vue'

// Out of a student's reach: the toggle only appears in dev, or when the URL asks
// for it explicitly (`?inspect`), so a build shows presentation and nothing else.
export const inspectAvailable =
  import.meta.env.DEV || new URLSearchParams(location.search).has('inspect')

const stored = localStorage.getItem('inspect') === '1'
export const inspect = ref(inspectAvailable && stored)
watch(inspect, v => localStorage.setItem('inspect', v ? '1' : '0'))
