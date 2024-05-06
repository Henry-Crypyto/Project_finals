<template>
    <div class="snack-container">
      <h1 class="text-center">小吃選單</h1>
      <ul class="snack-list" v-if="snacks.length > 0">
        <li v-for="snack in snacks" :key="snack.snack_id" class="snack-item card">
          <div class="card-body">
            <h3 class="card-title">{{ snack.snack_name.trim() }}</h3>
            <p class="card-text" v-if="snack.snack_size">大小: {{ snack.snack_size }}</p>
            <p class="card-text">風味: {{ snack.flavor_name }}</p>
            <p class="card-text">品牌: {{ snack.all_brand_name }}</p>
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
        snacks: []
      };
    },
    created() {
      this.fetchSnacks();
    },
    methods: {
      fetchSnacks() {
        axios.get('/api/all_snack') // 確保 URL 正確並根據您的配置進行調整
          .then(response => {
            this.snacks = response.data;
          })
          .catch(error => {
            console.error('Error fetching snacks:', error);
          });
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
  