<template>
  <div>
    <!-- 标题栏 -->
    <NavBar @change-section="handleSectionChange" />

    <!-- 下拉式選單 -->
    <b-container class="my-3">
      <div class="form-group select-container">
        <select v-model="localUserDeveloper" @change="updateUserDeveloper" class="form-control custom-select">
          <option value="user">使用者模式</option>
          <option value="add">新增和刪除折價券</option>
          <option value="update">更新折價券</option>
          <option value="addOrDeleteItem">新增或刪除品項</option>
          <option value="updateItem">更新品項</option>
        </select>
      </div>
    </b-container>

    <!-- 主内容区域 -->
    <b-container class="my-3">
      <!-- <ShoppingCart :items="cartItems" /> -->
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
import { mapState } from 'vuex';

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
      localUserDeveloper: this.userDeveloper // Bind the local data to Vuex state
    };
  },
  computed: {
    ...mapState(['userDeveloper']),

    cartItems() {
      return this.$store.state.cartItems;
    },
    currentView() {
      return this.$store.state.currentView;
    }
  },
  watch: {
    userDeveloper(newVal) {
      this.localUserDeveloper = newVal;
      this.$store.commit('clearCartItems');
    }
  },
  methods: {
    handleSectionChange(section) {
      const viewMap = {
        'mainCourse': 'ShowMainCourse',
        'beverage': 'ShowBeverage',
        'snack': 'ShowSnack',
        'coupon': 'ShowCoupon',
        'shoppingCart': 'ShoppingCart'
      };
      this.$store.commit('setView', viewMap[section] || 'ShowCoupon');
    },
    addToCart(item) {
      this.$store.commit('addToCart', item);
    },
    updateUserDeveloper() {
      this.$store.commit('setUserDeveloper', this.localUserDeveloper);
      this.$store.commit('clearCartItems');
    }
  },
  created() {
    this.$store.dispatch('fetchNextCouponId');
    this.$store.dispatch('fetchBrandOptions');
    this.$store.dispatch('fetchMainCourses');
    this.$store.dispatch('fetchBeverages');
    this.$store.dispatch('fetchSnacks');
    this.$store.dispatch('fetchCoupons');
  }
}
</script>

<style scoped>
/* Add your styles here */
.custom-select {
  width: 200px;
  padding: 10px 15px;
  border: 2px solid #aaa;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-size: 16px;
  color: #333;
  cursor: pointer;
  outline: none; /* 移除焦點時的輪廓 */
  appearance: none; /* 移除默認樣式 */
  position: relative;
  background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.custom-select:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0,86,179,0.8);
}
</style>
