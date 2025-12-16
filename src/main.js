import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import App from './App.vue'
import { routes } from './router/routes'
import { store } from './store/index'

const app = createApp(App)
app.use(routes)
app.use(store)
app.mount('#app')
