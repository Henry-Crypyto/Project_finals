<template>
  <div class="main-course-container">
    <h1 class="text-center">主菜選單</h1>
    <ul class="main-course-list" v-if="filteredMainCourses.length > 0">
      <li v-for="course in filteredMainCourses" :key="course.main_course_id" class="main-course-item">
        <h3>{{ course.main_course_name }}</h3>
        <p>原價: {{ course.main_course_price}}</p>
        <p>肉類類型: {{ course.meat_type_name || '不詳' }}</p>
        <p>品牌: {{ course.brand_name }}</p>
        <div class="input-group mb-3">
          <input type="number" class="form-control" v-model="course.quantity" min="1" placeholder="數量">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="addToCart(course)">加入購物車</button>
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
      mainCourses: [],
      productType: 'mainCourse'  
    };
  },
  created() {
    this.fetchMainCourses();
  },
  computed: {
    filteredMainCourses() {
      if (this.$root.brandSelect === 'all') {
        return this.mainCourses;
      } else {
        return this.mainCourses.filter(course => course.brand_name === this.$root.brandSelect);
      }
    }
  },
  methods: {
    fetchMainCourses() {
      axios.get('/api/all_main_course')
        .then(response => {
          this.mainCourses = response.data.map(course => ({
            ...course,
            quantity: 1
          }));
        })
        .catch(error => {
          console.error('Error fetching main courses:', error);
        });
    },
    addToCart(course) {
      if (this.$root.brandSelect === 'all' && this.mainCourses.length > 0) {
        this.showAlertForBrand(course.brand_name);
      } else {
        this.$root.brandSelect = course.brand_name; // 将品牌设置为所选品牌
      }
      emitter.emit('add-to-cart', {
        nextCouponId: this.$root.nextCouponId,  // 使用 this.nextCouponId 确保是响应式数据
        id: course.main_course_id,
        name: course.main_course_name,
        productType: this.productType,  // 确保 productType 正确引用
        quantity: course.quantity,
        price: course.main_course_price || 10
      });
    },
    showAlertForBrand(brandName) {
      if (confirm(`是否要选择 ${brandName} 品牌的商品？`)) {
        this.$root.brandSelect = brandName;
      }
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
  justify-content: space-around;
}

.main-course-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: calc(25% - 20px);
  border-radius: 10px;
  transition: transform 0.3s;
}

.main-course-item:hover {
  transform: translateY(-5px);
}

.input-group {
  width: 100%;
}

@media (max-width: 768px) {
  .main-course-item {
    width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .main-course-item {
    width: 100%;
  }
}
</style>
