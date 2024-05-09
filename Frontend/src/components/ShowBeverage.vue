<template>
    <div class="beverage-container">
      <h1 class="text-center">飲料選單</h1>
      <ul class="beverage-list" v-if="filteredBeverages.length > 0">
        <li v-for="beverage in filteredBeverages" :key="beverage.id" class="beverage-item card">
          <div class="card-body">
            <h3 class="card-title">{{ beverage.name.trim() }}</h3>
            <p class="card-text">原價: {{ beverage.price }}</p>
            <p class="card-text">容量: {{ beverage.beverage_size }}</p>
            <p class="card-text">類型: {{ beverage.iced_hot_name }}</p>
            <p class="card-text">品牌: {{ beverage.brand_name }}</p>
            <div class="input-group mb-3">
              <input type="number" class="form-control" v-model="beverage.quantity" min="1" placeholder="數量">
              <div class="input-group-append">
                <button class="btn btn-primary" @click="handleAddToCart(beverage)">加入購物車</button>
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
  import { mapMutations } from 'vuex';

  export default {
    data() {
      return {
        beverages: [],
        productType: 'beverage'
      };
    },
    created() {
      this.fetchBeverages();
      
    },
    computed: {
      filteredBeverages() {
        if (this.$store.state.brandSelect === 'all') {
          return this.beverages;
        } else {
          return this.beverages.filter(beverage => beverage.brand_name === this.$store.state.brandSelect);
        }
      }
    },
    methods: {
        ...mapMutations(['addToCart','setBrandSelect']),
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

      
      handleAddToCart(beverage) {
  // 如果购物车为空，则询问用户是否要继续添加商品
  if (this.$store.state.cartItems.length === 0) {
    if (!confirm(`购物车当前为空。你确定要添加 ${beverage.brand_name} 品牌的商品到购物车吗？`)) {
      return; // 如果用户不确认，直接返回不执行添加操作
    }
  }
  this.setBrandSelect(beverage.brand_name);
  this.addToCart({
    product:beverage,
    productType: this.$store.state.productType[1]  // 假设你正在使用数组中的第一个产品类型
  });
},
showAlertForBrand(brandName) {
      if (confirm(`是否要选择 ${brandName} 品牌的商品？`)) {
        this.$store.commit('setBrandSelect', brandName);  // 更新品牌选择
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
  