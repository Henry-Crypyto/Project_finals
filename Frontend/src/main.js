import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './plugins/webfontloader'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store';
import { BootstrapVue3 } from 'bootstrap-vue-3'

loadFonts()

createApp(App)
  .use(BootstrapVue3)
  .use(store)
  .mount('#app')
