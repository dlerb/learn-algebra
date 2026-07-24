<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import {
  NConfigProvider, NGlobalStyle, NLayoutHeader, NMenu, NPopover,
  NButton, NRadioGroup, NRadioButton, type MenuOption,
} from 'naive-ui'
import { lang } from './lang'
import { layers } from './data/layers'

// Global app chrome: brand · page nav · settings. Page-specific controls stay
// in the pages; only truly global state (language now, dark mode later) lives
// in the settings popover. Dark mode is deliberately NOT surfaced yet — the
// content views still use hardcoded colors, so flipping NConfigProvider's theme
// would darken only this chrome, not the pages. Enabling it later is one prop
// (`:theme="darkTheme"`) once the views move to color tokens.
const route = useRoute()
const router = useRouter()

// Two catalog groups + two activities. The tower layers nest under one dropdown
// and the curated pedagogy (skills, errors, metapatterns) under another, so the
// bar stays four wide however many layers the tower grows. Group keys are suffixed `-menu` so
// they never collide with a route name; only leaf keys are route names, and a
// parent with children just expands (never navigates), so `go` only ever sees a
// leaf. `route.name` matching a leaf key auto-highlights that leaf and its parent.
const menuOptions: MenuOption[] = [
  {
    label: 'Fundament', key: 'tower-menu',
    children: layers.map(l => ({ label: l.title, key: l.slug })),
  },
  {
    // Ordered to echo the reference stack bottom-up: the Fundament dropdown (the
    // tower/floor) sits left, then within Curated the two lenses that cite only
    // cards (Errors, Metapatterns), then Skills on top, which cites all three.
    label: 'Curated', key: 'curated-menu',
    children: [
      { label: 'Errors', key: 'errors' },
      { label: 'Metapatterns', key: 'metapatterns' },
      { label: 'Skills', key: 'skills' },
    ],
  },
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
  <NConfigProvider>
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
.brand { font-weight: 700; font-size: 1.05rem; color: #111827; text-decoration: none; flex-shrink: 0; }
.nav { min-width: 0; }
.spacer { flex: 1; }
.gear { font-size: 1.1rem; line-height: 1; }
.settings { min-width: 200px; padding: .25rem; }
.settings-title { font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; color: #9ca3af; margin-bottom: .6rem; }
.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.setting-label { font-size: .85rem; color: #4b5563; }
</style>
