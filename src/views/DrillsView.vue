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
.page { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: var(--text); }
.page-head h1 { font-size: 1.6rem; font-weight: 700; margin: 0 0 .25rem; }
.page-head p { color: var(--text-muted); max-width: 60ch; margin: 0; line-height: 1.5; }
/* Never styled, so they took the browser default #0000ee — 1.98:1 on a dark
   page, and only passable on a light one by accident. */
.page a { color: var(--accent); text-decoration: none; }
.page a:hover { text-decoration: underline; }
.page-head code { font-size: .85em; background: var(--chip-bg); padding: .05rem .3rem; border-radius: 4px; }
.stub { margin-top: 4rem; }
</style>
