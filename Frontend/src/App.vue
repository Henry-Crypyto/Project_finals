<template>
  <v-app>
    <!-- 使用 Vuetify 的工具列组件 -->
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>我的 Vue 應用</v-toolbar-title>
    </v-app-bar>

    <!-- 主內容區域，這裡引入 HomePage -->
    <v-main>
      <HomePage/>
    </v-main>

    <!-- 底部 -->
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2024</span>
    </v-footer>
  </v-app>
</template>

<script>
// 導入 HomePage 組件
import HomePage from './components/HomePage.vue';

export default {
  components: {
    HomePage
  }
}
</script>

<style>
</style>
