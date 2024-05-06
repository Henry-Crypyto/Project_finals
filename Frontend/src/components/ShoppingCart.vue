<template>
    <div class="shopping-cart-container">
      <h1 class="text-center">購物車</h1>
      <!-- 购物车列表 -->
      <ul class="cart-items-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>数量: {{ item.quantity }}</p>
            <p>单价: ${{ item.price }}</p>
            <p>小计: ${{ item.quantity * item.price }}</p>
          </div>
          <button class="btn btn-danger" @click.prevent="removeFromCart(item.id)">移除</button>
        </li>
      </ul>
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>购物车是空的。</p>
      </div>
  
      <!-- 新增折扣券表单 -->
      <h2 class="form-title">新增折扣券</h2>
      <form @submit.prevent="submitCoupon" class="coupon-form">
        <div class="form-row">
          <input type="text" v-model="newCoupon.brand_name" placeholder="品牌名称" required>
          <input type="text" v-model="newCoupon.coupon_name" placeholder="折扣券名称" required>
        </div>
        <div class="form-row">
          <input type="number" v-model="totalPrice" placeholder="原价" required readonly>
          <input type="number" v-model="newCoupon.discount_price" placeholder="折扣价" required>
        </div>
        <div class="form-row">
          <input type="date" v-model="newCoupon.start_date" placeholder="开始日期" required>
          <input type="date" v-model="newCoupon.expire_date" placeholder="结束日期" required>
        </div>
        <input type="text" v-model="newCoupon.use_restriction" placeholder="使用限制" class="full-width">
        <button type="submit" class="btn btn-success full-width">新增折扣券</button>
      </form>
    </div>
</template>

<script>
import { emitter } from './eventBus';

export default {
  data() {
    return {
      cartItems: [],
      newCoupon: {
        brand_name: '',
        coupon_name: '',
        original_price: null,
        discount_price: null,
        start_date: '',
        expire_date: '',
        use_restriction: ''
      }
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  methods: {
    addToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.cartItems.push({
          ...item,
          id: item.id
        });
      }
    },
    removeFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    },
    submitCoupon() {
      console.log('Submitting coupon:', this.newCoupon);
      // 在这里实现提交到后端的逻辑
      // axios.post('/api/coupon', this.newCoupon) 或其他 AJAX 调用
    }
  },
  mounted() {
    emitter.on('add-to-cart', this.addToCart);
  },
  beforeUnmount() {
    emitter.off('add-to-cart', this.addToCart);
  }
}
</script>

  
  <style scoped>
.shopping-cart-container {
  width: 80%;
  margin: 20px auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.text-center {
  text-align: center;
}

.cart-items-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.item-details h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.empty-cart p {
  text-align: center;
  color: #666;
}

.form-title {
  margin-top: 20px;
}

.coupon-form .form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.coupon-form input[type="text"],
.coupon-form input[type="number"],
.coupon-form input[type="date"] {
  width: 48%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.coupon-form .full-width {
  width: 100%;
}

.btn {
  cursor: pointer;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  color: white;
}

.btn-danger {
  background-color: #e53935;
}

.btn-success {
  background-color: #4caf50;
}
</style>
  