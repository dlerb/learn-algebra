<script setup lang="ts">
import katex from 'katex'
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  latex: string
  display?: boolean
}>()

const el = ref<HTMLElement | null>(null)

function render() {
  if (!el.value) return
  katex.render(props.latex, el.value, {
    throwOnError: false,
    displayMode: props.display ?? false,
    // Number typography for fundament0, in one place. \num{n}: numeral in a
    // distinct font (apart from variables). \nnum{n}: a negative number — same
    // font with a shorter minus, so its sign reads apart from the operator minus.
    macros: { '\\num': '\\mathtt{#1}', '\\nnum': '\\raisebox{0.07em}{\\scriptsize-}\\mathtt{#1}' },
  })
}

onMounted(render)
watch(() => props.latex, render)
</script>

<template>
  <span ref="el" />
</template>
