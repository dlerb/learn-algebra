# legacy

Parked content. **Nothing here is loaded, validated, formatted or shipped** — this
directory sits outside `src/data`, so `contentFiles()` never walks it.

## `errors_legacy.json` — the retired error layer (parked 2026-07-31)

Backed `/errors` until the page was removed. Its general half — the misconception,
its frequency, the rule it breaks, the cards it corrupts — lives on in
`src/data/mistakes.json`, which has since outgrown it (38 entries against 29, and
`anti.linearity` was split into two and retired from the pool while this file
still carries it).

**What is HERE and nowhere else, and why it was not migrated:**

| | n | |
|---|---|---|
| `instances` | 52 | worked wrong answers, `{from, wrong, hint?}` — 24 have a twin in `skill.wrong` |
| `fix` | 29 | how to correct it; **22 work a concrete numeric case**, 7 restate the rule |
| `hint` | 14 | |

⚠️ **These are DRILL-shaped, not reference-shaped.** A `fix` is feedback after an
attempt; an `instance` is a worked case. Neither belongs on a skill or a mistake,
which is why moving them there was rejected — it would have put them in the wrong
home purely to avoid deleting them, and baked in guesses about a drill layer whose
shape is still open. The drill layer may reuse this material as it stands or start
from scratch; that is unknown today, and this file is kept so the choice stays
open.

⚠️ Its ids are the SAME as `mistakes.json`'s, which is why `content-ids.mjs` used
to shadow one of the two. Out here it is invisible to the walk, so that exclusion
is gone and every shipped id is now globally unique on its own terms.
