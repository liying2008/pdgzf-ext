import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from '~/plugins/axios'
import '../styles'

const app = createApp(App)
app.use(router)

app.provide('$axios', axios)

app.mount('#app')
