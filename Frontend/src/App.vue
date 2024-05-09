<template>
  <v-app>
    <!-- 使用 Vuetify 的工具列组件 -->
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>CouponKing</v-toolbar-title>
    </v-app-bar>

    <!-- 主內容區域，這裡根據選擇動態顯示 -->
    <v-main>
      <NavBar @change-section="handleSectionChange"/>
      <ShoppingCart :items="cartItems" />
      <component :is="currentView" @add-to-cart="addToCart" />
    </v-main>

    <!-- 底部 -->
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2024</span>
    </v-footer>
  </v-app>
</template>

<script>

import NavBar from './components/NavBar.vue'; // 確保路徑正確
import ShoppingCart from './components/ShoppingCart.vue';
import ShowCoupon from './components/ShowCoupon.vue';
import ShowMainCourse from './components/ShowMainCourse.vue';
import ShowBeverage from './components/ShowBeverage.vue';
import ShowSnack from './components/ShowSnack.vue';

export default {
  components: {
    NavBar, // 確保這裡註冊了 NavBar
    ShoppingCart,
    ShowCoupon,
    ShowMainCourse,
    ShowBeverage,
    ShowSnack
  },
  computed: {
    cartItems() {
      return this.$store.state.cartItems;
    },
    currentView() {
      return this.$store.state.currentView;
    }
  },
  methods: {
    handleSectionChange(section) {
      const viewMap = {
        'mainCourse': 'ShowMainCourse',
        'beverage': 'ShowBeverage',
        'snack': 'ShowSnack',
        'coupon': 'ShowCoupon'
      };
      this.$store.commit('setView', viewMap[section] || 'ShowCoupon');
    },
    addToCart(item) {
      this.$store.commit('addToCart', item);
    }
  },
  created() {
    this.$store.dispatch('fetchNextCouponId');
  }
}
</script>

<style>
/* Add your styles here */
</style>
