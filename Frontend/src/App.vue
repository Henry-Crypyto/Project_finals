<template>
  <div>
    <!-- 标题栏 -->
    <NavBar @change-section="handleSectionChange" />

    <!-- 主内容区域 -->
    <b-container class="my-3">
     
      <ShoppingCart :items="cartItems" />
      <component :is="currentView" @add-to-cart="addToCart" />
    </b-container>

    <!-- 底部 -->
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