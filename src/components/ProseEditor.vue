<script setup lang="ts">
// DEV-ONLY: edit an entity's prose in place, on the page, next to the rendered
// card (2026-07-25).
//
// The whole point of the exercise: the author fixes wording while LOOKING at the
// card in its layer, with the cards above and below it visible, instead of
// hunting for the string in a 1000-line JSON file where the surrounding context
// is invisible. Editing in the app is only worth doing for what the app can do
// that an editor cannot — so the one affordance beyond a textarea is the live
// KaTeX preview of `$…$`.
//
// It takes ONLY an id. Everything else — which fields exist, what they currently
// say, whether they are `{en,de}` or an English-only bare string — comes from the
// server, which reads the file. That is why one component serves all seven
// layers: it knows nothing of cards vs errors vs meta-patterns vs skills, and
// nothing of the four differing tree shapes they live in.
//
// It also decides NOTHING about what may be written. The allowlist, the
// must-already-exist rule and the prose rules are all enforced in
// scripts/content-write.mjs; this only renders an input per field the server
// offered, and shows the reasons it gives back. A UI guard would be a courtesy;
// the server's is the one that counts.
import { ref, computed, watch } from 'vue'
import RichText from './RichText.vue'

const props = defineProps<{ id: string }>()

const DEV = import.meta.env.DEV

// One editor open at a time, across every instance on the page. Saving triggers
// an HMR reload, so a second editor with unsaved text in it would lose that text
// without warning — better that it was never openable.
const openId = ref<string | null>(null)
const isOpen = computed(() => openId.value === props.id)

interface Field { en: string; de: string; bare: boolean }
const fields = ref<Record<string, Field> | null>(null)
const drafts = ref<Record<string, Field>>({})
const file = ref('')
const busy = ref(false)
const error = ref<string | null>(null)
const problems = ref<string[]>([])

const LANGS = ['en', 'de'] as const
type Lang = typeof LANGS[number]

const dirty = computed(() => {
  const out: { field: string; lang: Lang; value: string }[] = []
  if (!fields.value) return out
  for (const [name, loaded] of Object.entries(fields.value)) {
    for (const lang of LANGS) {
      const value = drafts.value[name]?.[lang] ?? ''
      if (value !== loaded[lang]) out.push({ field: name, lang, value })
    }
  }
  return out
})

async function load() {
  busy.value = true
  error.value = null
  problems.value = []
  try {
    const res = await fetch(`/__content/fields?id=${encodeURIComponent(props.id)}`)
    const body = await res.json()
    if (!res.ok) throw new Error(body.error ?? `load failed (${res.status})`)
    fields.value = body.fields
    file.value = body.file
    drafts.value = JSON.parse(JSON.stringify(body.fields))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

function toggle() {
  if (isOpen.value) { openId.value = null; return }
  openId.value = props.id
  load()
}

async function save() {
  busy.value = true
  error.value = null
  problems.value = []
  // Set BEFORE the write. A successful save changes a file the app imports, so
  // Vite reloads the page out from under this component; landing back on the card
  // afterwards depends on the hash already being there. replaceState rather than
  // assignment, so saving does not pile up history entries.
  history.replaceState(null, '', `#${props.id}`)
  try {
    for (const edit of dirty.value) {
      const res = await fetch('/__content/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: props.id, ...edit }),
      })
      const body = await res.json()
      if (!res.ok) {
        // Stop at the first rejection rather than pressing on: the fields left
        // unwritten stay in the boxes, so nothing typed is lost.
        error.value = body.problems?.length ? `${edit.field}.${edit.lang} rejected` : (body.error ?? `save failed (${res.status})`)
        problems.value = body.problems ?? []
        return
      }
    }
    // Everything written. The reload is imminent; until it lands, show the state
    // as saved rather than leaving a stale "unsaved" count on screen.
    fields.value = JSON.parse(JSON.stringify(drafts.value))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

// Textareas size to their content — prose fields run from four words to a full
// paragraph, and a fixed height would be wrong for both.
const rows = (s: string) => Math.min(16, Math.max(2, Math.ceil((s.length || 1) / 55)))

// The preview earns its space only where the text renders differently from what
// is typed, which is exactly when it carries math.
const previewable = (s: string) => s.includes('$')

watch(() => props.id, () => { if (isOpen.value) openId.value = null })
</script>

<!-- Placed at the END of a card's body, alongside the `▸ intuition` and
     `▸ derivation` toggles it deliberately resembles: the panel needs the card's
     full width, which it could not have from inside the card-top row where the
     `source` button sits. -->
<template>
  <div v-if="DEV" class="pe">
    <button
      class="pe-btn"
      :class="{ on: isOpen }"
      :title="`Edit ${id}'s prose`"
      @click="toggle"
    >{{ isOpen ? '▾ edit prose' : '▸ edit prose' }}</button>

    <div v-if="isOpen" class="pe-panel">
      <div class="pe-head">
        <code class="pe-file">{{ file || '…' }}</code>
        <span class="pe-actions">
          <span v-if="dirty.length" class="pe-count">{{ dirty.length }} unsaved</span>
          <button class="pe-save" :disabled="busy || !dirty.length" @click="save">save</button>
        </span>
      </div>

      <p v-if="error" class="pe-error">
        {{ error }}
        <span v-for="p in problems" :key="p" class="pe-problem">{{ p }}</span>
      </p>

      <p v-if="fields && !Object.keys(fields).length" class="pe-empty">
        No editable prose on this entity.
      </p>

      <div v-for="(f, name) in (fields ?? {})" :key="name" class="pe-field">
        <div class="pe-label">
          {{ name }}
          <span v-if="f.bare" class="pe-hint" title="English-only in the source; typing German promotes it to an en/de pair">English-only</span>
        </div>
        <div v-for="lang in LANGS" :key="lang" class="pe-lang">
          <span class="pe-lang-tag">{{ lang }}</span>
          <div class="pe-input">
            <textarea
              v-model="drafts[name][lang]"
              :rows="rows(drafts[name][lang])"
              :class="{ changed: drafts[name][lang] !== f[lang] }"
              spellcheck="true"
            />
            <p v-if="previewable(drafts[name][lang])" class="pe-preview">
              <RichText :text="drafts[name][lang]" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pe { display: inline-flex; }
.pe-btn {
  padding: 0 .3rem; border: 1px solid var(--border); border-radius: 4px;
  background: transparent; color: var(--text-faint);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .58rem;
  line-height: 1.5; cursor: pointer;
}
.pe-btn:hover { color: var(--text-muted); border-color: var(--text-faint); }
.pe-btn.on { color: var(--text); border-color: var(--text-muted); }

.pe-panel {
  margin: .6rem 0 0; padding: .6rem .65rem; border: 1px solid var(--border);
  border-radius: 6px; background: var(--code-bg);
}
/* A card's three prose fields in two languages can run past a thousand pixels,
   which would leave `save` and the rejection message scrolled off the top while
   the author is typing at the bottom. 4.5rem clears the app header, the same
   offset the cards use for `scroll-margin-top`. */
.pe-head {
  position: sticky; top: 4.5rem; z-index: 1;
  display: flex; align-items: center; gap: .5rem;
  margin: -.6rem -.65rem .5rem; padding: .45rem .65rem;
  background: var(--code-bg); border-bottom: 1px solid var(--border);
  border-radius: 6px 6px 0 0;
}
.pe-file {
  flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-size: .6rem; color: var(--text-faint);
}
.pe-actions { display: inline-flex; align-items: center; gap: .4rem; }
.pe-count { font-size: .6rem; color: var(--text-muted); }
.pe-save {
  padding: .1rem .5rem; border: 1px solid var(--text-faint); border-radius: 4px;
  background: transparent; color: var(--text); font-size: .62rem; cursor: pointer;
}
.pe-save:disabled { opacity: .4; cursor: default; }

.pe-error { margin: 0 0 .5rem; font-size: .65rem; color: #b91c1c; }
.pe-problem { display: block; margin-top: .15rem; font-family: ui-monospace, monospace; font-size: .6rem; }
.pe-empty { margin: 0; font-size: .65rem; color: var(--text-faint); }

.pe-field { margin-bottom: .55rem; }
.pe-label {
  display: flex; align-items: center; gap: .4rem; margin-bottom: .2rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .6rem;
  color: var(--text-muted);
}
.pe-hint { font-size: .55rem; color: var(--text-faint); border: 1px solid var(--border); border-radius: 3px; padding: 0 .2rem; }
.pe-lang { display: flex; gap: .35rem; margin-bottom: .25rem; }
.pe-lang-tag { flex: none; width: 1.2rem; font-size: .58rem; color: var(--text-faint); padding-top: .3rem; }
.pe-input { flex: 1; min-width: 0; }
.pe-input textarea {
  width: 100%; padding: .3rem .4rem; border: 1px solid var(--border); border-radius: 4px;
  background: var(--bg, #fff); color: var(--text);
  font: inherit; font-size: .72rem; line-height: 1.45; resize: vertical;
}
.pe-input textarea.changed { border-color: #b45309; }
.pe-preview {
  margin: .2rem 0 0; padding: .2rem .4rem; font-size: .72rem; line-height: 1.45;
  color: var(--text-muted); border-left: 2px solid var(--border);
}
</style>
