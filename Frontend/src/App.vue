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
import NavBar from './components/NavBar.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ShowCoupon from './components/ShowCoupon.vue';
import ShowMainCourse from './components/ShowMainCourse.vue';
import ShowBeverage from './components/ShowBeverage.vue';
import ShowSnack from './components/ShowSnack.vue';
import axios from 'axios';

export default {
  components: {
    NavBar,
    ShoppingCart,
    ShowCoupon,
    ShowMainCourse,
    ShowBeverage,
    ShowSnack
  },
  data() {
    return {
      brandSelect: 'all',
      nextCouponId: '',
      currentView: 'ShowCoupon',  // 預設顯示 ShowCoupon
      cartItems: []  // 購物車項目
    };
  },
  methods: {
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    handleSectionChange(section) {
      switch (section) {
        case 'mainCourse':
          this.currentView = 'ShowMainCourse';
          break;
        case 'beverage':
          this.currentView = 'ShowBeverage';
          break;
        case 'snack':
          this.currentView = 'ShowSnack';
          break;
        default:
          this.currentView = 'ShowCoupon';
      }
    },
    addToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.cartItems.push({...item, quantity: 1});
      }
    },
    fetchNextCouponId() {
      axios.get('/api/next_coupon_id')
        .then(response => {
          this.nextCouponId = response.data[0] ? response.data[0].next_coupon_id : null;
        })
        .catch(error => {
          console.error('Error fetching next coupon ID:', error);
        });
    },
  },
  
  created() {
    // 封裝 handleSectionChange 為防抖函數
    this.fetchNextCouponId();
    this.handleSectionChange = this.debounce(this.handleSectionChange, 60);
  }
}
</script>

<style>
/* Add your styles here */
</style>
