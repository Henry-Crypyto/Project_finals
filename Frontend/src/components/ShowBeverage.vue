<template>
    <div class="beverage-container">
      <h1 class="text-center">飲料選單</h1>
      <ul class="beverage-list" v-if="filteredBeverages.length > 0">
        <li v-for="beverage in filteredBeverages" :key="beverage.beverage_id" class="beverage-item card">
          <div class="card-body">
            <h3 class="card-title">{{ beverage.beverage_name.trim() }}</h3>
            <p class="card-text">原價: {{ beverage.beverage_price }}</p>
            <p class="card-text">容量: {{ beverage.beverage_size }}</p>
            <p class="card-text">類型: {{ beverage.iced_hot_name }}</p>
            <p class="card-text">品牌: {{ beverage.all_brand_name }}</p>
            <div class="input-group mb-3">
              <input type="number" class="form-control" v-model="beverage.quantity" min="1" placeholder="數量">
              <div class="input-group-append">
                <button class="btn btn-primary" @click="addToCart(beverage)">加入購物車</button>
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
        beverages: [],
        nextCouponId: '',
        productType: 'beverage'
      };
    },
    created() {
      this.fetchBeverages();
      this.fetchNextCouponId();
    },
    computed: {
      filteredBeverages() {
        if (this.$root.brandSelect === 'all') {
          return this.beverages;
        } else {
          return this.beverages.filter(beverage => beverage.all_brand_name === this.$root.brandSelect);
        }
      }
    },
    methods: {
      fetchBeverages() {
        axios.get('/api/all_beverage')
          .then(response => {
            this.beverages = response.data.map(beverage => ({
              ...beverage,
              quantity: 1 // 將每個飲料的數量初始化為1
            }));
          })
          .catch(error => {
            console.error('Error fetching beverages:', error);
          });
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
      addToCart(beverage) {
        if (this.$root.brandSelect === 'all' && this.beverages.length > 0) {
          this.showAlertForBrand(beverage.all_brand_name);
        } else {
          this.$root.brandSelect = beverage.all_brand_name;
        }
        emitter.emit('add-to-cart', {
          nextCouponId: this.nextCouponId,
          id: beverage.beverage_id,
          name: beverage.beverage_name.trim(),
          productType:this.productType,
          quantity: beverage.quantity,
          price: beverage.beverage_price
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
  .beverage-container {
    width: 100%;
    padding: 20px;
    background-color: #f4f4f4;
    text-align: center;
  }
  
  .beverage-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: space-around;
  }
  
  .beverage-item {
    width: calc(25% - 20px);
    margin: 10px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease-in-out;
  }
  
  .beverage-item:hover {
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
    .beverage-item {
      width: calc(50% - 20px);
    }
  }
  
  @media (max-width: 480px) {
    .beverage-item {
      width: 100%;
    }
  }
  </style>
  