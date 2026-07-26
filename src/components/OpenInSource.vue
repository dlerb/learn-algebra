<script setup lang="ts">
// DEV-ONLY: jump from an entity on the page to its line in the source JSON.
//
// One component for all seven layers, because it needs nothing but the id — the
// server resolves file and line (scripts/vite-content-locator.mjs). That is why
// it can sit in a fundament card, an error, a meta-pattern and a skill without
// knowing anything about their four different tree shapes.
//
// Renders NOTHING outside dev, and unlike src/inspect.ts there is no `?inspect`
// escape hatch: the endpoint it talks to is `apply: 'serve'` and does not exist in
// a build, so the button would be inert even if it appeared. `import.meta.env.DEV`
// is a compile-time constant, but it has to be read here in the script — Vue
// template expressions cannot contain `import.meta` — which means the minifier
// may leave the (unreachable) fetch code in the bundle. Nothing renders it.
import { ref } from 'vue'

const DEV = import.meta.env.DEV

// `label` lets the trigger BE the thing it points at rather than a button beside
// it — the row layout makes the card's id itself the source link, which is one
// affordance instead of two and puts it where the eye already looks for the id.
const props = withDefaults(defineProps<{ id: string; label?: string }>(), { label: 'source' })

// null = idle. A string is the last outcome, shown next to the button: either a
// failure reason or, when the editor could not be launched, the `file:line` the
// user can paste. Never a modal — this is author plumbing, not a user flow.
const status = ref<string | null>(null)
const busy = ref(false)

async function open() {
  busy.value = true
  status.value = null
  try {
    const res = await fetch(`/__content/locate?id=${encodeURIComponent(props.id)}`)
    const hit = await res.json()
    if (!res.ok) throw new Error(hit.error ?? `locate failed (${res.status})`)

    const spec = `${hit.file}:${hit.line}`
    // Vite's own middleware, the same one its error overlay uses.
    const opened = await fetch(`/__open-in-editor?file=${encodeURIComponent(spec)}`)
    // launch-editor answers 200 even when the editor did not come up, so treat a
    // non-2xx as the only definite failure and otherwise fall silent. The spec is
    // still shown on failure so the jump can be made by hand.
    if (!opened.ok) throw new Error(spec)
  } catch (e) {
    status.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <span v-if="DEV" class="open-src">
    <button
      class="open-src-btn"
      :disabled="busy"
      :title="`Open ${id} in the editor`"
      @click="open"
    >{{ label }}</button>
    <code v-if="status" class="open-src-status" :title="status">{{ status }}</code>
  </span>
</template>

<style scoped>
.open-src { display: inline-flex; align-items: center; gap: .3rem; }
.open-src-btn {
  padding: 0 .3rem; border: 1px solid var(--border); border-radius: 4px;
  background: transparent; color: var(--text-faint);
  /* .62rem to match the strip's other affordances (`rests on`, `json`), which are
     the same size and colour — the three read as one row of controls. */
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .62rem;
  line-height: 1.5; cursor: pointer;
}
.open-src-btn:hover:not(:disabled) { color: var(--text-muted); border-color: var(--text-faint); }
.open-src-btn:disabled { opacity: .5; cursor: default; }
.open-src-status {
  max-width: 22ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-size: .58rem; color: var(--text-faint);
}
</style>
