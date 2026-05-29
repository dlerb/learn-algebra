<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard } from 'naive-ui'
import SameOrDifferent from '../components/SameOrDifferent.vue'
import { generateItem } from '../lib/generator'
import { families } from '../data/families'
import type { ExerciseItem } from '../lib/generator'

const drillFamilies = families.filter(f =>
  f.exerciseTypes.includes('same_or_different')
)

const correct = ref(0)
const total = ref(0)
const itemKey = ref(0)

function nextFamily() {
  return drillFamilies[total.value % drillFamilies.length]
}

const item = ref<ExerciseItem>(generateItem(nextFamily()))

function onAnswered(wasCorrect: boolean) {
  total.value++
  if (wasCorrect) correct.value++

  // Auto-advance: quickly on correct, longer on wrong (to read feedback)
  const delay = wasCorrect ? 700 : 2200
  setTimeout(() => {
    item.value = generateItem(nextFamily())
    itemKey.value++
  }, delay)
}

const score = computed(() =>
  total.value === 0 ? '—' : `${correct.value} / ${total.value}`
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">

    <div class="w-full max-w-xl mb-6 flex justify-between items-center">
      <span class="text-lg font-semibold text-gray-700">Algebra Fluency</span>
      <span class="text-sm text-gray-500">Score: {{ score }}</span>
    </div>

    <NCard class="w-full max-w-xl" :bordered="true">
      <template #header>
        <div class="text-sm text-gray-500">Same or Different?</div>
      </template>

      <SameOrDifferent
        v-if="item.type === 'same_or_different'"
        :key="itemKey"
        :item="item"
        @answered="onAnswered"
      />
    </NCard>

  </div>
</template>
