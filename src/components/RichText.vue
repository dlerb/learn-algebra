<script setup lang="ts">
import { computed } from 'vue'
import MathExpr from './MathExpr.vue'

// Renders the prose format contract: plain text with inline $…$ KaTeX
// (docs/content_model.md, design decision 10). Deliberately NOT
// markdown — no parser, no HTML injection; the one feature prose needs is
// math. Unpaired $ falls through as literal text.

const props = defineProps<{ text: string }>()

const segments = computed(() => {
  const parts: { math: boolean; s: string }[] = []
  const re = /\$([^$]+)\$/g
  let last = 0
  for (let m = re.exec(props.text); m; m = re.exec(props.text)) {
    if (m.index > last) parts.push({ math: false, s: props.text.slice(last, m.index) })
    parts.push({ math: true, s: m[1] })
    last = m.index + m[0].length
  }
  if (last < props.text.length) parts.push({ math: false, s: props.text.slice(last) })
  return parts
})
</script>

<template>
  <span>
    <template v-for="(p, i) in segments" :key="i">
      <MathExpr v-if="p.math" :latex="p.s" /><template v-else>{{ p.s }}</template>
    </template>
  </span>
</template>
