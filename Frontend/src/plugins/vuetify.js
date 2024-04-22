// plugins/vuetify.js

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // 在此处可以添加更多的配置，如主题配置、全局配置等
  theme: {
    defaultTheme: 'light', // 默认主题
    themes: {
      light: {
        primary: '#1976D2', // 例如，定义一些颜色
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
    },
  }
})
