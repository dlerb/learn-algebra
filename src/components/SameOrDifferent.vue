<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import MathExpr from './MathExpr.vue'
import type { SameOrDifferentItem } from '../lib/generator'

const props = defineProps<{ item: SameOrDifferentItem }>()
const emit = defineEmits<{ answered: [correct: boolean] }>()

const choice = ref<'same' | 'different' | null>(null)
const isCorrect = computed(() => choice.value === props.item.correct)

function answer(c: 'same' | 'different') {
  if (choice.value !== null) return
  choice.value = c
  emit('answered', c === props.item.correct)
}
</script>

<template>
  <div class="flex flex-col gap-8">

    <!-- Expressions -->
    <div class="flex flex-wrap justify-center items-center gap-6">
      <div class="expr-box">
        <MathExpr :latex="item.left" :display="true" />
      </div>
      <div class="text-2xl text-gray-400">vs</div>
      <div class="expr-box">
        <MathExpr :latex="item.right" :display="true" />
      </div>
    </div>

    <!-- Buttons -->
    <NSpace justify="center" size="large">
      <NButton
        size="large"
        :type="choice === 'same' ? (isCorrect ? 'success' : 'error') : 'default'"
        :disabled="choice !== null && choice !== 'same'"
        style="min-width: 120px"
        @click="answer('same')"
      >
        Same
      </NButton>
      <NButton
        size="large"
        :type="choice === 'different' ? (isCorrect ? 'success' : 'error') : 'default'"
        :disabled="choice !== null && choice !== 'different'"
        style="min-width: 120px"
        @click="answer('different')"
      >
        Different
      </NButton>
    </NSpace>

    <!-- Feedback -->
    <Transition name="fade">
      <div
        v-if="choice !== null"
        class="rounded-lg px-5 py-4 text-center"
        :class="isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
      >
        <div class="font-semibold mb-1">{{ isCorrect ? 'Correct' : 'Incorrect' }}</div>
        <div v-if="!isCorrect" class="text-sm leading-relaxed">{{ item.feedbackNote }}</div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.expr-box {
  min-width: 130px;
  padding: 1.25rem 2rem;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
