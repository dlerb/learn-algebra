// Prose clipping, shared by every layer's cells (extracted from LayerView
// 2026-07-27 when /errors needed it too).
//
// WHY EVERY PROSE CELL CLIPS: ragged row heights. On the tower all 34 intuitions
// exceed 180 characters (median 393, about seven lines) and notes run to 1336; on
// /errors a quoted metapattern rule runs to seven lines in an 18rem column, which
// strands the ✗/✓ pairs at the top of a row twice their height. A clipped cell
// with an expander keeps the row scannable and the full text one click away.

/** Truncate on a word boundary WITHOUT splitting an inline `$…$` span — cutting
 *  inside one hands KaTeX an unterminated expression and prints an error box
 *  mid-page. Tracks whether it is inside math and only ever cuts outside. */
export function truncateProse(s: string, max: number): { head: string; clipped: boolean } {
  if (s.length <= max) return { head: s, clipped: false }
  let inMath = false
  let lastSafe = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '$') inMath = !inMath
    if (i > max && !inMath) break
    if (!inMath && (s[i] === ' ' || s[i] === ',' || s[i] === '.')) lastSafe = i
  }
  if (lastSafe === 0) return { head: s, clipped: false }
  return { head: s.slice(0, lastSafe).trimEnd(), clipped: true }
}

export interface Clipped { full: string; head: string; clipped: boolean }

/** The cut is per CALL SITE, not global: a cell's character budget depends on
 *  how wide its column is (26rem on the tower, 18rem for a quoted rule). */
export const clipProse = (text: string, max: number): Clipped => {
  const { head, clipped } = truncateProse(text, max)
  return { full: text, head, clipped }
}
