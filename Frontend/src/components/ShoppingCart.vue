<template>
  <b-container class="shopping-cart-container">
    <b-row class="justify-content-center">
      <b-col class="d-flex align-items-center justify-content-center">
        <h1 class="text-center">購物車</h1>
        <b-button variant="warning" @click="handleReset" class="ml-2">清空</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="6" offset-md="3">
        <b-form @submit.prevent="handleSubmit">
          <b-form-group class="d-flex justify-content-center">
          </b-form-group>
          <b-form-group>
            <b-form-input type="text" v-model="brandSelect" readonly v-if="userDeveloper !== 'user'"></b-form-input>
            <b-form-input type="text" v-model="newCoupon.coupon_name" placeholder="折價券名稱" required v-if="userDeveloper !== 'user'"></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-input type="number" v-model="totalPrice" placeholder="原價" required readonly v-if="userDeveloper !== 'user'"></b-form-input>
            <b-form-input type="number" v-model.number="newCoupon.discount_price" placeholder="折價" min="0" :max="totalPrice" required v-if="userDeveloper !== 'user'"></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-input type="date" v-model="newCoupon.start_date" placeholder="開始日期" @change="validateDates" required v-if="userDeveloper !== 'user'"></b-form-input>
            <b-form-input type="date" v-model="newCoupon.expire_date" :min="newCoupon.start_date" placeholder="結束日期" required v-if="userDeveloper !== 'user'"></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-input type="text" v-model="newCoupon.use_restriction" placeholder="使用限制" v-if="userDeveloper !== 'user'"></b-form-input>
          </b-form-group>
          <b-button :class="buttonClass" type="submit" :disabled="totalPrice <= 0" v-if="userDeveloper !== 'user'" class="d-block mx-auto">
            {{ buttonText }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="cartItems.length > 0">
      <b-col v-for="item in cartItems" :key="item.id" cols="12" md="6" lg="4" class="mb-4">
        <b-card class="cart-item-card" >
          <b-card-body>
            <b-card-title>
              {{ item.name }}
              <img v-if="item.preference === 1" :src="getIconImage('icon/heart.png')" alt="Heart Icon" class="icon" />
              <img v-if="item.preference === 0" :src="getIconImage('icon/angry.png')" alt="Angry Icon" class="icon" />
            </b-card-title>
            <b-card-text>
              <p>數量: {{ item.quantity }}</p>
              <p>單價: ${{ item.price }}</p>
              <p>小計: ${{ item.quantity * item.price }}</p>
            </b-card-text>
            <b-button-group class="w-100 tight-group">              
              <b-button variant="success" @click.prevent="increaseQuantity(item)" >+</b-button>
              <b-button variant="info" @click.prevent="decreaseQuantity(item)">-</b-button>
              <b-button variant="danger" @click.prevent="removeFromCart(item)">移除</b-button>
            </b-button-group>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      dateError: ''
    };
  },
  computed: {
    ...mapState(['cartItems', 'brandSelect', 'newCoupon', 'nextCouponId', 'userDeveloper', 'currentView', 'allCoupons', 'newCoupon']),
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    buttonText() {
      if (this.userDeveloper === 'add') {
        return '新增折價券';
      } else if (this.userDeveloper === 'update') {
        return '更新折價券';
      }
      return '';
    },
    buttonClass() {
      if (this.userDeveloper === 'add') {
        return 'btn btn-success';
      } else if (this.userDeveloper === 'update') {
        return 'btn btn-primary';
      } else if (this.userDeveloper === 'user') {
        return 'btn btn-info';
      }
      return '';
    }
  },
  methods: {
    ...mapMutations(['removeFromCart', 'updateOriginalTotalPrice', 'setUserDeveloper']),
    increaseQuantity(item) {
      this.$store.commit('increaseFromCart', {
        id: item.id,
        productType: item.productType
      });
    },
    decreaseQuantity(item) {
      this.$store.commit('decreaseFromCart', {
        id: item.id,
        productType: item.productType
      });
    },
    getItemImage(imagePath) {
      const baseUrl = this.apiUrl;
      console.log(imagePath);
      if (!imagePath) {
        return require('@/assets/image/default.png'); // 预设图片路径
      }
      return `${baseUrl}${imagePath}`;
    },
    getIconImage(imagePath) {
      if (!imagePath) {
        return require('@/assets/image/default.png');
      }
      return require(`@/assets/image/${imagePath}`);
    },
    submitCoupon() {
      this.$store.dispatch('submitCoupon');
    },
    updateCoupon() {
      this.$store.dispatch('updateCoupon');
    },
    handleSubmit() {
      if (this.userDeveloper === 'add') {
        const isDuplicate = this.allCoupons.some(coupon => coupon.coupon_name === this.newCoupon.coupon_name);
        if (isDuplicate) {
          alert('折扣券名稱已存在，請使用其他名稱。');
          return;
        }
        this.submitCoupon();
      } else if (this.userDeveloper === 'update') {
        this.updateCoupon();
      }
    },
    handleReset() {
      this.$store.commit('resetNewCoupon');
    },
    validateDates() {
      if (new Date(this.newCoupon.expire_date) < new Date(this.newCoupon.start_date)) {
        this.newCoupon.expire_date = this.newCoupon.start_date;
      }
    }
  },
  watch: {
    userDeveloper(newValue) {
      if (newValue === 'update') {
        this.$store.commit('setUserDeveloper', 'update');
        this.handleReset();
      } else if (newValue === 'add') {
        this.$store.dispatch('fetchNextCouponId');
        this.$store.commit('setUserDeveloper', 'add');
        this.handleReset();
      } else if (newValue === 'user') {
        this.$store.commit('setUserDeveloper', 'user');
        this.handleReset();
      }
    }
  }
}
</script>

<style scoped>
.shopping-cart-container {
  padding: 20px;
}

.text-center {
  text-align: center;
}

.btn-warning {
  margin-left: 10px;
  background-color: #ffc107;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.cart-items-list {
  margin-top: 20px;
}

.cart-item-card {
  border-radius: 60px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.cart-item-card:hover {
  transform: translateY(-5px);
}

.cart-item-card img {
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.item-details h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #333;
}

.item-details p {
  margin: 5px 0;
  color: #666;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-info {
  background-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.empty-cart p {
  text-align: center;
  color: #666;
}
.tight-group .btn {
    margin-right: -1px;  
}
.form-title {
  margin-top: 20px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px;
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

.quantity-btn {
  font-weight: bold;
  color: white;
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-info {
  background-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-warning:hover {
  background-color: #e0a800;
}
</style>
