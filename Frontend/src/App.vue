<template>
  <div>
    <!-- 標題列 -->
    <header style="background-color: #3f51b5; color: #ffffff; padding: 16px;">
      <h1 style="margin: 0;">CouponKing</h1>
    </header>

    <!-- 主內容區域 -->
    <main>
      <NavBar @change-section="handleSectionChange"/>
      <ShoppingCart :items="cartItems" />
      <component :is="currentView" @add-to-cart="addToCart" />
    </main>

    <!-- 底部 -->
    <footer style="background-color: #3f51b5; color: #ffffff; padding: 16px;">
      <span>&copy; 2024</span>
    </footer>
  </div>
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
    NavBar,
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
