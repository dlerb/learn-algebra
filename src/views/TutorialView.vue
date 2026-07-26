<script setup lang="ts">
import { NEmpty } from 'naive-ui'
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>Tutorial</h1>
      <p>
        A guided path through the skills — a traversal of the <code>requires</code>
        graph, taking one prerequisite-ordered step at a time and drilling it. It
        drives the same runner as <router-link to="/drills">Drills</router-link>;
        the difference is guided sequence vs. free choice.
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
