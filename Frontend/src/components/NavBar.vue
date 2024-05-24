<template>
  <b-navbar toggleable="lg" type="light" class="custom-navbar">
    <b-container class="justify-center">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto d-flex align-items-center">
          <b-nav-item href="#" class="nav-link" @click="emitChange('coupon')">折價券</b-nav-item>
          <div class="divider"></div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('mainCourse')">主食</b-nav-item>
          <div class="divider"></div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('beverage')">飲料</b-nav-item>
          <div class="divider"></div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('snack')">點心</b-nav-item>
          <div class="divider"></div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('shoppingCart')">{{ shoppingCartLabel }}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  methods: {
    emitChange(section) {
      this.$emit('change-section', section);
    }
  },
  computed: {
    ...mapState(['cartItems']),
    shoppingCartLabel() {
      return this.cartItems.length > 0 ? `購物車-${this.cartItems.length}項` : '購物車';
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  background-color: #e6e6fa; /* 淡紫色背景 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.nav-link {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link:hover, .nav-link:focus {
  color: #f6e05e;
  transform: scale(1.25); /* 放大效果 */
}

.divider {
  width: 1px;
  height: 2rem;
  background-color: #0a0909;
  margin: 0 1rem;
  display: inline-block;
}

.logo {
  height: 40px;
}
</style>
