import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
// Dev-only: resolves a card id to its source line so the page can open it in the
// editor. `apply: 'serve'` inside, so it contributes nothing to a build.
import { contentLocator } from './scripts/vite-content-locator.mjs'

export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    contentLocator(),
  ],
})

