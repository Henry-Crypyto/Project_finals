import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './plugins/webfontloader'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store';


loadFonts()

createApp(App)
  .use(store)
  .mount('#app')
