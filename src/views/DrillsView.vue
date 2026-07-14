<script setup lang="ts">
import { NEmpty } from 'naive-ui'
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>Drills</h1>
      <p>
        Practice over the skill material — pick a skill (or a composition of
        skills) and drill it. The drill material already exists in
        <code>drills/</code>; what's missing is the runner that turns it into
        exercises. One runner, shared with
        <router-link to="/tutorial">Tutorial</router-link>.
      </p>
    </header>
    <NEmpty description="Not built yet." class="stub" />
  </div>
</template>

<style scoped>
.page { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: #1f2937; }
.page-head h1 { font-size: 1.6rem; font-weight: 700; margin: 0 0 .25rem; }
.page-head p { color: #6b7280; max-width: 60ch; margin: 0; line-height: 1.5; }
.page-head code { font-size: .85em; background: #f3f4f6; padding: .05rem .3rem; border-radius: 4px; }
.stub { margin-top: 4rem; }
</style>
