// THE PROSE RULES, in one place (2026-07-25).
//
// Extracted from scripts/sweep-layers.mjs so the in-app prose editor cannot
// accept text that the sweep would later reject. Same argument as the single
// serializer in scripts/content-format.mjs: a checker and a writer that disagree
// give you a green save followed by a red build.
//
// TWO TIERS, deliberately:
//   - CORRECTNESS applies to every layer. A `$…$` fragment must compile with no
//     macros defined, and the delimiters must pair. Prose that fails this renders
//     as a KaTeX error box on the page for anyone reading it.
//   - STYLE applies to the FUNDAMENT TOWER ONLY, which is what sweep-layers reads.
//     errors.json uses em dashes in its own head and is right to; the retired
//     "sign"/"Vorzeichen" ban is a decision about the tower's notation (see
//     docs/fundamentals.md), not about the curated pages. Enforcing the tower's
//     house style on curated prose would reject text that is already committed.

import katex from 'katex'

/** Compile one LaTeX fragment with NO macros defined — proving nothing depends
 *  on the deleted \num/\nnum. Returns a one-line message, or null when it is fine. */
export function checkLatex(tex) {
  try {
    katex.renderToString(tex, { throwOnError: true, displayMode: false })
    return null
  } catch (e) {
    return `${e.message.split('\n')[0]}  <<${tex}>>`
  }
}

/** Check one prose string. `style` turns on the tower-only house rules.
 *  Returns `{ problems, fragments }` — `fragments` is the count of `$…$` spans
 *  compiled, which sweep-layers reports. */
export function checkProse(s, { style = false } = {}) {
  const problems = []
  let fragments = 0
  const re = /\$([^$]+)\$/g
  for (let m = re.exec(s); m; m = re.exec(s)) {
    fragments++
    const bad = checkLatex(m[1])
    if (bad) problems.push(`KaTeX: ${bad}`)
  }
  if ((s.match(/\$/g) || []).length % 2) problems.push('unpaired $')
  if (style) {
    // En dashes stay allowed: they spell ranges.
    if (/—/.test(s)) problems.push('em dash (use a comma, a colon, or an en dash for a range)')
    if (/ß/.test(s)) problems.push('sharp s (write ss)')
    if (/\b(signs?|Vorzeichen)\b/i.test(s)) problems.push('retired word "sign"/"Vorzeichen" — say positive/negative/zero')
  }
  return { problems, fragments }
}

/** The tower's four cards.json are the files the style tier applies to. */
export const isTowerFile = file => file.startsWith('src/data/fundament/')
