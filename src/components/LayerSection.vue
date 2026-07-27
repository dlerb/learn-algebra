<script setup lang="ts">
import { NPopover } from 'naive-ui'
import RichText from './RichText.vue'

// A SECTION AND ITS PANEL — the middle rung of the row shell.
//
// Structure (the heading, its note) sits on the PAGE plane, outside the panel;
// content sits on the raised surface INSIDE it, divided by hairlines. That is
// what settles the heading-versus-name competition without typography: the two
// are on different planes, so neither has to shout.
//
// ONE PANEL PER SECTION, not per group and not per entry. Per group it was 37
// panels across the tower, several wrapping a single row, which read as a box
// around one card; per entry it is 101 boxes and a mosaic. Group subheads go in
// the default slot as bands INSIDE the one surface.
defineProps<{
  title: string
  /** Visible under the heading, on the page plane. */
  note?: string
  /** Behind the info dot — the level of detail a reader asks for. */
  about?: string
}>()
</script>

<template>
  <section class="section">
    <!-- No rule under the heading: the panel's own top edge sits a few pixels
         below it, so a border here made two horizontal lines in a row. -->
    <div class="section-title">
      <h3>{{ title }}</h3>
      <NPopover v-if="about" trigger="click" placement="bottom-start">
        <template #trigger><button class="info" aria-label="About this section">i</button></template>
        <div class="pop"><RichText :text="about" /></div>
      </NPopover>
    </div>
    <p v-if="note" class="section-note"><RichText :text="note" /></p>

    <div class="rows">
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* The page's shared left edge — see LayerPage. */
.section-title, .section-note { padding: 0 calc(1rem + 1px); }
/* STRUCTURE IS THE PLAIN SANS; CONTENT IS THE SERIF. The headings were briefly
   set in mono, to tell them apart from card names that were then also sans. Now
   that names and prose are Latin Modern, the serif/sans split does that work on
   its own, so headings use the normal face and carry their level by size and
   weight alone — no small caps, which read as shouting. */
.section-title { display: flex; align-items: center; gap: .4rem; margin: 1.9rem 0 .5rem; }
.section-title h3 { font-size: .98rem; font-weight: 700; letter-spacing: -.005em; color: var(--text); margin: 0; }
.section-note { font-size: .82rem; line-height: 1.55; color: var(--text-muted); margin: -.1rem 0 .6rem; }

.info { width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); font-size: .7rem; font-style: italic; font-family: Georgia, serif; line-height: 1; cursor: pointer; padding: 0; }
.info:hover { color: var(--accent); border-color: var(--accent); }
.pop { max-width: 280px; font-size: .8rem; line-height: 1.45; color: var(--text); }

.rows { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 0 1rem; }
/* The panel's own edge is the first divider, whatever comes first — a row in a
   single-group section, a subhead band in a multi-group one. */
.rows > :deep(:first-child) { border-top: none; }
</style>
