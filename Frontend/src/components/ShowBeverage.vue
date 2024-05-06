<template>
    <div class="beverage-container">
      <h1 class="text-center">飲料選單</h1>
      <ul class="beverage-list" v-if="beverages.length > 0">
        <li v-for="beverage in beverages" :key="beverage.beverage_id" class="beverage-item card">
          <div class="card-body">
            <h3 class="card-title">{{ beverage.beverage_name.trim() }}</h3>
            <p class="card-text">容量: {{ beverage.beverage_size }}</p>
            <p class="card-text">類型: {{ beverage.iced_hot_name }}</p>
            <p class="card-text">品牌: {{ beverage.all_brand_name }}</p>
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
  
  export default {
    data() {
      return {
        beverages: []
      };
    },
    created() {
      this.fetchBeverages();
    },
    methods: {
      fetchBeverages() {
        axios.get('/api/all_beverage') // 確保 URL 正確並根據您的配置進行調整
          .then(response => {
            this.beverages = response.data;
          })
          .catch(error => {
            console.error('Error fetching beverages:', error);
          });
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
  