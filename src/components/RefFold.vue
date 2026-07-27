<script setup lang="ts">
// A REFERENCE FOLD for the row strip: `rests on 3`, `breaks 1`, `reading rules 2`.
//
// A native `<details>` — no component state, keyboard-operable for free.
//
// This is the app's ONE answer to "where do pointers at other entries go", and it
// replaced two others. Bare grey text after grey prose reads as more prose and
// the eye slides off it; pills at full size became the second-loudest thing on a
// row, louder than the mistake they hung off. A closed fold is neither: it is
// chrome until you ask, and what it opens is plain middot-separated names at the
// strip's own size.
defineProps<{
  label: string
  links: { id: string; to: string; name: string }[]
}>()
</script>

<template>
  <details v-if="links.length" class="fold">
    <summary>{{ label }} <span class="n">{{ links.length }}</span></summary>
    <span class="fold-body">
      <RouterLink v-for="l in links" :key="l.id" class="ref" :to="l.to">{{ l.name }}</RouterLink>
    </span>
  </details>
</template>

<style scoped>
.fold { font-size: .62rem; min-width: 0; }
.fold summary { cursor: pointer; color: var(--text-faint); list-style: none; }
.fold summary::-webkit-details-marker { display: none; }
.fold summary::before { content: '▸ '; }
.fold[open] summary::before { content: '▾ '; }
.fold summary:hover { color: var(--text-muted); }
.n { opacity: .7; font-variant-numeric: tabular-nums; }
.fold-body { display: inline-flex; flex-wrap: wrap; gap: .3rem .5rem; padding: .25rem 0 0 .8rem; }
.ref { color: var(--text-muted); text-decoration: none; }
.ref:hover { color: var(--accent); text-decoration: underline; }
</style>
