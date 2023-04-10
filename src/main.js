import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import SmartTable from 'vuejs-smart-table'
// import { BootstrapVue, IconsPlugin,DropdownPlugin, TablePlugin } from 'bootstrap'

// import './assets/main.css'


const app = createApp(App)
// app.use(BootstrapVue)
app.use(SmartTable)
app.mount('#app')

