import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import 'katex/dist/katex.min.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
