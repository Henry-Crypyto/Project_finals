import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './plugins/webfontloader'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store';
import { BootstrapVue3 } from 'bootstrap-vue-3'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

loadFonts()

// 添加 Font Awesome 圖標到 library
library.add(fas)

const app = createApp(App)

// 全域註冊 Font Awesome 圖標
app.component('font-awesome-icon', FontAwesomeIcon)

app
  .use(BootstrapVue3)
  .use(store)
  .mount('#app')
