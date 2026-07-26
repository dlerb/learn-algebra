# Latin Modern Roman (webfont)

The content serif — card names and prose. Latin Modern is the Unicode successor to
Donald Knuth's Computer Modern, maintained by the GUST e-foundry, and it is the
face LaTeX documents are set in by default. Using it here is not decoration: the
inline `$…$` fragments inside prose are rendered by KaTeX in Computer Modern, so
prose set in anything else changes typeface at every formula.

- Source: <https://github.com/sugina-dev/latin-modern-web> (`font/lmroman-*-webfont.woff`),
  built from the GUST e-foundry originals at <https://www.gust.org.pl/projects/e-foundry/latin-modern>
- Licence: GUST Font License (GFL), a LaTeX Project Public License variant that
  permits redistribution and `@font-face` embedding.
- 96 KB for the three faces, self-hosted so the app keeps working offline.

## Why not the alternatives

- **KaTeX's own fonts** would match exactly, and they ship with the app already —
  but `KaTeX_Main` has no `ä`, `ö` or `ü` (measured). Half this content is German,
  so every umlaut would silently substitute mid-word.
- **A system book-serif stack** (Palatino, Georgia, Iowan Old Style) has full
  coverage but is a different genre of face — humanist old-style against Computer
  Modern's high-contrast modern — and resolves differently per operating system.
- **The `computer-modern` npm package** ships TTF only, at ~450 KB per weight
  against 30 KB here.

Latin Modern lacks `≙ ℝ ℕ → ≠ –`; that is safe because the prose contract keeps
all mathematics inside `$…$`, where KaTeX renders it. Verified: zero bare Unicode
math characters in the tower's prose. If that ever changes, those glyphs will fall
back to another face mid-sentence.
