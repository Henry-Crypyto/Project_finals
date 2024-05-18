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
            <b-form-select v-model="couponAction" class="ml-2">
              <b-form-select-option value="user">使用者模式</b-form-select-option>
              <b-form-select-option value="add">新增或刪除折價券</b-form-select-option>
              <b-form-select-option value="update">更新折價券</b-form-select-option>
            </b-form-select>
          </b-form-group>
          <b-form-group>
            <b-form-input type="text" :value="nextCouponId" placeholder="折價券ID" readonly v-if="editOrAdd!==2"></b-form-input>
            <b-form-input type="text" v-model="brandSelect" readonly v-if="editOrAdd!==2"></b-form-input>
            <b-form-input type="text" v-model="newCoupon.coupon_name" placeholder="折價券名稱" required v-if="editOrAdd!==2"></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-input type="number" v-model="totalPrice" placeholder="原價" required readonly v-if="editOrAdd!==2"></b-form-input>
            <b-form-input type="number" v-model.number="newCoupon.discount_price" placeholder="折價" min="0" required v-if="editOrAdd!==2"></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-input type="date" v-model="newCoupon.start_date" placeholder="開始日期" required v-if="editOrAdd!==2"></b-form-input>
            <b-form-input type="date" v-model="newCoupon.expire_date" placeholder="結束日期" required v-if="editOrAdd!==2"></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-input type="text" v-model="newCoupon.use_restriction" placeholder="使用限制" v-if="editOrAdd!==2"></b-form-input>
          </b-form-group>
          <b-button :class="buttonClass" type="submit" :disabled="totalPrice <= 0" v-if="editOrAdd!==2" class="d-block mx-auto" >
            {{ buttonText }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-list-group v-if="cartItems.length > 0">
      <b-list-group-item v-for="item in cartItems" :key="item.id">
        <b-row>
          <b-col>
            <h3>{{ item.name }}</h3>
            <p>數量: {{ item.quantity }}</p>
            <p>單價: ${{ item.price }}</p>
            <p>小計: ${{ item.quantity * item.price }}</p>
          </b-col>
          <b-col cols="auto">
            <b-button-group>
              <b-button variant="success" @click.prevent="increaseQuantity(item)" v-if="editOrAdd!==2">+</b-button>
              <b-button variant="info" @click.prevent="decreaseQuantity(item)" v-if="editOrAdd!==2">-</b-button>
              <b-button variant="danger" @click.prevent="removeFromCart(item)">移除</b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>









  
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      couponAction: 'add'  // 默认设置为新增
    };
  },
  computed: {
    ...mapState(['cartItems', 'brandSelect', 'newCoupon', 'nextCouponId', 'editOrAdd','currentView']),
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    buttonText() {
  if (this.couponAction === 'add') {
    return '新增折價券';
  } else if (this.couponAction === 'update') {
    return '更新折價券';
  } 
  return '';
},
buttonClass() {
  if (this.couponAction === 'add') {
    return 'btn btn-success';
  } else if (this.couponAction === 'update') {
    return 'btn btn-primary';
  } else if (this.couponAction === 'user') {
    return 'btn btn-info'; // You can choose any appropriate class
  }
  return '';
}
  },
  methods: {
    ...mapMutations(['removeFromCart', 'updateOriginalTotalPrice', 'setEditOrAdd','setView']),
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
    submitCoupon() {
      this.$store.dispatch('submitCoupon');
    },
    updateCoupon() {
      this.$store.dispatch('updateCoupon');
    },
    handleSubmit() {
      console.log(this.couponAction);
      if (this.couponAction === 'add') {
        this.submitCoupon();
      } else if(this.couponAction === 'update') {
        this.updateCoupon();
      }
    },
    handleReset() {
      this.$store.commit('resetNewCoupon');
    }
  },
  watch: {
    couponAction(newValue) {
      if (newValue === 'update') {
        this.$store.commit('setEditOrAdd', 0);
        this.handleReset();
        this.$store.commit('setView','ShowCoupon');
      } else if (newValue === 'add') {
        this.$store.dispatch('fetchNextCouponId');
        this.$store.commit('setEditOrAdd', 1);
        this.handleReset();
        this.$store.commit('setView','ShowMainCourse');
      }else{
        this.$store.commit('setEditOrAdd', 2);
        this.handleReset();
        this.$store.commit('setView','ShowCoupon');
      }
    },
    totalPrice(newTotal) {
    this.$store.commit('updateOriginalTotalPrice', newTotal);
    }
  }
}
</script>



  

  
<style scoped>
.select-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px; /* 为按钮和选择框添加间隙 */
  margin: 20px 0;
}

select {
  width: 200px;
  padding: 10px 15px;
  border: 2px solid #aaa;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-size: 16px;
  color: #333;
  cursor: pointer;
  outline: none; /* 移除焦点时的轮廓 */
  appearance: none; /* 移除默认样式 */
  position: relative;
  background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

select:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0,86,179,0.8);
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
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px; /* 确保表单元素之间有适当的间隙 */
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
.quantity-btn {
  font-weight: bold;
  color: white;
  width: 36px; /* Fixed width for alignment */
  height: 36px; /* Fixed height for alignment */
  padding: 0; /* Remove padding to make button square */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px; /* Increase font size for visibility */
}

.btn-success {
  background-color: #28a745; /* Bootstrap default green */
}

.btn-success:hover {
  background-color: #218838; /* Darken on hover */
}

.btn-info {
  background-color: #17a2b8; /* Bootstrap default blue */
}

.btn-info:hover {
  background-color: #e50f3d; /* Darken on hover */
}

.btn-warning {
  background-color: #ffc107; /* Bootstrap default yellow */
  color: black; /* Change text color for better contrast */
}

.btn-warning:hover {
  background-color: #e0a800; /* Darken on hover */
}

</style>