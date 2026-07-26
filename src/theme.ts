// App-wide light/dark switch, in the shape lang.ts and inspect.ts already use:
// a module-level ref, persisted, imported by whoever needs it.
//
// The mechanism is one attribute. `data-theme="dark"` on the root element selects
// the second token block in src/styles/tokens.css, and every view reads those
// tokens rather than hex, so nothing below the shell has to know the theme exists.
// App.vue additionally hands naive-ui its own `darkTheme`, since its components
// (header, menu, popover, radio) style themselves and cannot see our variables.
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

// No stored preference means follow the SYSTEM. A teacher who runs their laptop
// dark should not have to find this switch to stop being flashbanged; a stored
// value always wins afterwards, because an explicit choice outranks a guess.
const stored = localStorage.getItem('theme')
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
export const theme = ref<Theme>(stored === 'dark' || stored === 'light' ? stored : (systemDark ? 'dark' : 'light'))

const apply = (t: Theme) => document.documentElement.setAttribute('data-theme', t)
apply(theme.value)
watch(theme, t => {
  localStorage.setItem('theme', t)
  apply(t)
})

// Track the system only while the user has expressed no preference of their own.
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', e => {
  if (!localStorage.getItem('theme')) theme.value = e.matches ? 'dark' : 'light'
})
