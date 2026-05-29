<script setup lang="ts">
import { NConfigProvider, NGlobalStyle } from 'naive-ui'
import SessionView from './views/SessionView.vue'
</script>

<template>
  <NConfigProvider>
    <NGlobalStyle />
    <SessionView />
  </NConfigProvider>
</template>
