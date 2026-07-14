// App-wide language switch (docs/content_model.md, design decision 9).
// Prose switches between Schweizer Hochdeutsch and English; math notation does
// not — it stays Swiss regardless of language.
import { ref, watch } from 'vue'
import type { Lang } from './data/skill.schema'

const stored = localStorage.getItem('lang')
export const lang = ref<Lang>(stored === 'de' ? 'de' : 'en')
watch(lang, l => localStorage.setItem('lang', l))
