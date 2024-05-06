<template>
  <v-app>
    <!-- 使用 Vuetify 的工具列组件 -->
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>我的 Vue 應用</v-toolbar-title>
    </v-app-bar>

    <!-- 主內容區域，這裡根據選擇動態顯示 -->
    <v-main>
      <NavBar @change-section="handleSectionChange"/>
      <component :is="currentView" />
    </v-main>

    <!-- 底部 -->
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2024</span>
    </v-footer>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import ShowCoupon from './components/ShowCoupon.vue';
import ShowMainCourse from './components/ShowMainCourse.vue';  // 確保 MainCourse 正確導入
import ShowBeverage from './components/ShowBeverage.vue';
import ShowSnack from './components/ShowSnack.vue';
export default {
  components: {
    NavBar,
    ShowCoupon,
    ShowMainCourse,
    ShowSnack  // 加入組件
  },
  data() {
    return {
      currentView: 'ShowCoupon'  // 預設顯示 ShowCoupon
    };
  },
  methods: {
    handleSectionChange(section) {
      if (section === 'mainCourse') {
        this.currentView = ShowMainCourse;  // 切換到 MainCourse 組件
      } else if (section === 'beverage') {
        this.currentView = ShowBeverage;  // 切換到 MainCourse 組件
      }else if (section === 'snack') {
        this.currentView = ShowSnack; 
      }else{
        this.currentView = ShowCoupon;  // 其他情况显示 HomePage 或根据需要调整
      }
    }
  }
}
</script>

<style>

</style>
