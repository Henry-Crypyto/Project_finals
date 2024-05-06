<template>
    <div class="main-course-container">
      <h1>主菜選單</h1>
      <ul class="main-course-list" v-if="mainCourses.length > 0">
        <li v-for="course in mainCourses" :key="course.main_course_id" class="main-course-item">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">{{ course.main_course_name }}</h3>
              <p class="card-text">肉類類型: {{ course.meat_type_name || '不詳' }}</p>
              <p class="card-text">品牌: {{ course.brand_name }}</p>
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
  
  export default {
    data() {
      return {
        mainCourses: []
      };
    },
    created() {
      this.fetchMainCourses();
    },
    methods: {
      fetchMainCourses() {
        axios.get('/api/all_main_course') // 確保 URL 正確並根據您的配置進行調整
          .then(response => {
            this.mainCourses = response.data;
          })
          .catch(error => {
            console.error('Error fetching main courses:', error);
          });
      }
    }
  }
  </script>
  
  <style scoped>
  .main-course-container {
    width: 100%;
    padding: 20px;
    background-color: #f4f4f4;
    text-align: center;
  }
  
  .main-course-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .main-course-item {
    width: calc(25% - 20px);
    margin: 10px;
  }
  
  .card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transition: all 0.3s;
  }
  
  .card:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
  
  .card-body {
    padding: 15px;
    text-align: center;
  }
  
  .card-title {
    font-size: 1.25rem;
    color: #076b92;
  }
  
  .card-text {
    color: #666;
    font-size: 1rem;
    margin-top: 5px;
  }
  
  @media (max-width: 768px) {
    .main-course-item {
      width: calc(50% - 20px);
    }
  }
  
  @media (max-width: 480px) {
    .main-course-item {
      width: 100%;
      margin: 10px 0;
    }
  }
  </style>
  