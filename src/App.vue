<script setup lang="ts">
import { ref } from 'vue'
import { NConfigProvider, NGlobalStyle } from 'naive-ui'
import TaxonomyView from './views/TaxonomyView.vue'
import ReferenceView from './views/ReferenceView.vue'

const view = ref<'taxonomy' | 'reference'>('taxonomy')
</script>

<template>
  <NConfigProvider>
    <NGlobalStyle />
    <nav class="topnav">
      <button :class="{ active: view === 'taxonomy' }" @click="view = 'taxonomy'">Taxonomy</button>
      <button :class="{ active: view === 'reference' }" @click="view = 'reference'">Laws & Conventions</button>
    </nav>
    <TaxonomyView v-if="view === 'taxonomy'" />
    <ReferenceView v-else />
  </NConfigProvider>
</template>

<style scoped>
.topnav { max-width: 1100px; margin: 0 auto; padding: .9rem 1rem 0; display: flex; gap: .4rem; }
.topnav button { font-size: .82rem; padding: .3rem .85rem; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; color: #4b5563; cursor: pointer; }
.topnav button.active { background: #111827; border-color: #111827; color: #fff; }
</style>
