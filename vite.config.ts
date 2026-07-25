import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
// Dev-only: the card editor's server side — resolve an id to its source line, read
// its prose, write one field back. `apply: 'serve'` inside, so it contributes
// nothing to a build.
import { contentEditor } from './scripts/vite-content-editor.mjs'

export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    contentEditor(),
  ],
})

