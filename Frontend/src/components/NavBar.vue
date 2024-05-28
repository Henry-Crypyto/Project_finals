<template>
  <b-navbar toggleable="lg" type="light" class="custom-navbar">
    <b-container class="justify-center">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto d-flex align-items-center">
          <b-nav-item href="#" class="nav-link" @click="emitChange('coupon')">🎟️ 折價券</b-nav-item>
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-decoration"></span>
          </div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('mainCourse')">🍔 主食</b-nav-item>
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-decoration"></span>
          </div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('beverage')">🥤 飲料</b-nav-item>
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-decoration"></span>
          </div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('snack')">🍪 點心</b-nav-item>
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-decoration"></span>
          </div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('shoppingCart')">{{ shoppingCartLabel }}</b-nav-item>
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-decoration"></span>
          </div>
          <b-nav-item href="#" class="nav-link" @click="emitChange('developer')">管理者頁面</b-nav-item>
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
      return this.cartItems.length > 0 ? `🛒 購物車-${this.cartItems.length}項` : '🛒 購物車';
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);  padding: 0.5rem;
}

.nav-link {
  font-size: 1.8rem;
  font-weight: bold;
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
  display: flex;
  align-items: center;
  margin: 0 1rem;
}

.divider-line {
  width: 1px;
  height: 2rem;
  background-color: #0a0909;
}

.divider-decoration {
  width: 10px;
  height: 10px;
  background-color: #0a0909;
  border-radius: 50%;
  margin: 0 0.5rem;
}

.logo {
  height: 40px;
}
</style>
