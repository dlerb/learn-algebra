<script setup lang="ts">
import { NConfigProvider, NGlobalStyle } from 'naive-ui'
import TaxonomyView from './views/TaxonomyView.vue'
</script>

<template>
  <NConfigProvider>
    <NGlobalStyle />
    <TaxonomyView />
  </NConfigProvider>
</template>
