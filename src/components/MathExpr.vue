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
  })
}

onMounted(render)
watch(() => props.latex, render)
</script>

<template>
  <span ref="el" />
</template>
