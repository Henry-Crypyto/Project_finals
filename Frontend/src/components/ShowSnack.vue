<template>
    <div class="snack-container">
      <h1 class="text-center">小吃選單</h1>
      <ul class="snack-list" v-if="filteredSnacks.length > 0">
        <li v-for="snack in filteredSnacks" :key="snack.snack_id" class="snack-item card">
          <div class="card-body">
            <h3 class="card-title">{{ snack.snack_name.trim() }}</h3>
            <p class="card-text" v-if="snack.snack_size">大小: {{ snack.snack_size }}</p>
            <p class="card-text">原價: {{ snack.snack_price }}</p>
            <p class="card-text">風味: {{ snack.flavor_name }}</p>
            <p class="card-text">品牌: {{ snack.all_brand_name }}</p>
            <div class="input-group mb-3">
              <input type="number" class="form-control" v-model="snack.quantity" min="1" placeholder="數量">
              <div class="input-group-append">
                <button class="btn btn-primary" @click="addToCart(snack)">加入購物車</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else>
        <p>正在加載數據或沒有數據顯示...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { emitter } from './eventBus';


  export default {
    data() {
      return {
        snacks: [],
        productType: 'snack'
      };
    },
    created() {
      this.fetchSnacks();
    },
    computed: {
      filteredSnacks() {
        if (this.$root.brandSelect === 'all') {
          return this.snacks;
        } else {
          return this.snacks.filter(snack => snack.all_brand_name === this.$root.brandSelect);
        }
      }
    },
    methods: {
      fetchSnacks() {
        axios.get('/api/all_snack')
          .then(response => {
            this.snacks = response.data.map(snack => ({
              ...snack,
              quantity: 1 // 將每個小吃的數量初始化為1
            }));
          })
          .catch(error => {
            console.error('Error fetching snacks:', error);
          });
      },
      addToCart(snack) {
        if (this.$root.brandSelect === 'all' && this.snacks.length > 0) {
          this.showAlertForBrand(snack.all_brand_name);
        } else {
          this.$root.brandSelect = snack.all_brand_name;
        }
        emitter.emit('add-to-cart', {
          nextCouponId: this.$root.nextCouponId,
          id: snack.snack_id,
          name: snack.snack_name.trim(),
          productType:this.productType,
          quantity: snack.quantity,
          price: snack.snack_price
        });
      },
      showAlertForBrand(brandName) {
        if (confirm(`是否要選擇 ${brandName} 品牌的商品？`)) {
          this.$root.brandSelect = brandName;
        }
      }
    }
  }
  </script>
  
  
  <style scoped>
  .snack-container {
    width: 100%;
    padding: 20px;
    background-color: #f4f4f4;
    text-align: center;
  }
  
  .snack-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: space-around;
  }
  
  .snack-item {
    width: calc(25% - 20px);
    margin: 10px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease-in-out;
  }
  
  .snack-item:hover {
    transform: translateY(-5px);
  }
  
  .card-body {
    padding: 15px;
  }
  
  .card-title {
    color: #076b92;
    margin-bottom: 5px;
  }
  
  .card-text {
    color: #666;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .snack-item {
      width: calc(50% - 20px);
    }
  }
  
  @media (max-width: 480px) {
    .snack-item {
      width: 100%;
    }
  }
  </style>
  