<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import {
  NConfigProvider, NGlobalStyle, NLayoutHeader, NMenu, NPopover,
  NButton, NRadioGroup, NRadioButton, darkTheme, type MenuOption,
} from 'naive-ui'
import { lang } from './lang'
import { theme } from './theme'
import { layersOf } from './data/layers'

// Global app chrome: brand · page nav · settings. Page-specific controls stay
// in the pages; only truly global state — language and theme — lives in the
// settings popover.
//
// DARK MODE IS TWO SEPARATE THINGS. src/theme.ts stamps `data-theme` on the root,
// which switches the token block every view reads; naive-ui cannot see those
// variables, so its own components need `darkTheme` handed to NConfigProvider
// here. Miss either half and you get a dark shell over light pages, or the
// reverse.
const route = useRoute()
const router = useRouter()

// Two catalog groups + two activities. BOTH dropdowns are generated from the one
// manifest (src/data/layers.ts) by `family`, so the bar stays four wide however
// many layers either family grows, and adding a layer touches no code here.
// Group keys are suffixed `-menu` so they never collide with a route name; only
// leaf keys are route names, and a parent with children just expands (never
// navigates), so `go` only ever sees a leaf. `route.name` matching a leaf key
// auto-highlights that leaf and its parent.
// ⚠️ FLAT, AND DELIBERATELY (2026-07-31). The menu used to draw a `└` and indent
// by a `level` field. It could not tell the truth: the curated layers are a DAG,
// not a tree — skills cite mistakes AND rules AND cards — so a single indent
// column has to pick one parent and hide the rest. It picked whatever sat above,
// which made Skills read as a child of Cheat sheets, an edge that does not exist.
// Demoting mistakes under rules to repair that was worse still: `breaks` is a
// cross-reference, not composition. A sheet owns nothing and is empty without the
// pool; a mistake owns every word it says and merely cites one.
//
// So the nav is now a plain list, and the DAG is drawn where it can be drawn
// properly — the Overview graph at `/`, with one labelled arrow per field.
const layerMenu = (family: 'fundament' | 'curated') =>
  layersOf(family).map(l => ({ label: l.title, key: l.slug }))

const menuOptions: MenuOption[] = [
  { label: 'Fundament', key: 'tower-menu', children: layerMenu('fundament') },
  // Curated is still ORDERED bottom-up in the manifest — rules, sheets,
  // mistakes, skills — which claims only "read them in this order", never
  // "this one is under that one".
  { label: 'Curated', key: 'curated-menu', children: layerMenu('curated') },
  { label: 'Tutorial', key: 'tutorial' },
  { label: 'Drills', key: 'drills' },
]
const activeKey = computed<string | null>(() => (route.name as string) ?? null)
function go(key: string | number) {
  const name = String(key)
  if (name.endsWith('-menu')) return  // a group header, not a route
  router.push({ name })
}
</script>

<template>
  <NConfigProvider :theme="theme === 'dark' ? darkTheme : null">
    <NGlobalStyle />
    <NLayoutHeader bordered class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand">Algebra</RouterLink>
        <NMenu
          mode="horizontal"
          responsive
          :options="menuOptions"
          :value="activeKey"
          class="nav"
          @update:value="go"
        />
        <div class="spacer" />
        <NPopover trigger="click" placement="bottom-end">
          <template #trigger>
            <NButton quaternary circle aria-label="Settings">
              <span class="gear" aria-hidden="true">⚙</span>
            </NButton>
          </template>
          <div class="settings">
            <div class="settings-title">Settings</div>
            <div class="setting-row">
              <span class="setting-label">Language</span>
              <NRadioGroup
                size="small"
                :value="lang"
                @update:value="(v: string) => (lang = v as 'en' | 'de')"
              >
                <NRadioButton value="de">DE</NRadioButton>
                <NRadioButton value="en">EN</NRadioButton>
              </NRadioGroup>
            </div>
            <div class="setting-row">
              <span class="setting-label">Theme</span>
              <NRadioGroup
                size="small"
                :value="theme"
                @update:value="(v: string) => (theme = v as 'light' | 'dark')"
              >
                <NRadioButton value="light">Light</NRadioButton>
                <NRadioButton value="dark">Dark</NRadioButton>
              </NRadioGroup>
            </div>
          </div>
        </NPopover>
      </div>
    </NLayoutHeader>

    <main class="app-body">
      <RouterView />
    </main>
  </NConfigProvider>
</template>

<style scoped>
.app-body { min-height: calc(100vh - 52px); background: var(--bg); }
.app-header { position: sticky; top: 0; z-index: 10; }
.header-inner {
  max-width: 1100px; margin: 0 auto; padding: 0 1rem;
  display: flex; align-items: center; gap: 1rem; height: 52px;
}
.brand { font-weight: 700; font-size: 1.05rem; color: var(--text); text-decoration: none; flex-shrink: 0; }
.nav { min-width: 0; }
.spacer { flex: 1; }
.gear { font-size: 1.1rem; line-height: 1; }
.settings { min-width: 200px; padding: .25rem; }
.settings-title { font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-faint); margin-bottom: .6rem; }
.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.setting-label { font-size: .85rem; color: var(--text-muted); }
</style>
