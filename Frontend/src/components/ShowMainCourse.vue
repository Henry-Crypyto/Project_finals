<template>
  <div class="main-course-container">
    <h1 class="text-center">主菜選單</h1>
    <ul class="main-course-list" v-if="filteredMainCourses.length > 0">
      <li v-for="course in filteredMainCourses" :key="course.id" class="main-course-item">
        <h3>{{ course.name }}</h3>
        <p>原價: {{ course.price}}</p>
        <p>肉類類型: {{ course.meat_type_name || '不詳' }}</p>
        <p>品牌: {{ course.brand_name }}</p>
        <div class="input-group mb-3">
          <input type="number" class="form-control" v-model="course.quantity" min="1" placeholder="數量">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="handleAddToCart(course)">加入購物車</button>
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
import { mapMutations } from 'vuex';
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
  computed: {
    filteredMainCourses() {
      if (this.$store.state.brandSelect === 'all') {
        return this.mainCourses;
      } else {
        return this.mainCourses.filter(course => course.brand_name === this.$store.state.brandSelect);
      }
    }
  },
  methods: {
    ...mapMutations(['addToCart','setBrandSelect']), // 引入 Vuex mutation
    fetchMainCourses() {
      axios.get('/api/all_main_course')
        .then(response => {
          this.mainCourses = response.data.map(course => ({
            ...course,
            quantity: 1  // 初始化数量为 1
          }));
        })
        .catch(error => {
          console.error('Error fetching main courses:', error);
        });
    },
  handleAddToCart(course) {
  // 如果购物车为空，则询问用户是否要继续添加商品
  if (this.$store.state.cartItems.length === 0) {
    if (!confirm(`购物车当前为空。你确定要添加 ${course.brand_name} 品牌的商品到购物车吗？`)) {
      return; // 如果用户不确认，直接返回不执行添加操作
    }
  }
  this.setBrandSelect(course.brand_name);
  this.addToCart({
    product:course,
    productType: this.$store.state.productType[0]  // 假设你正在使用数组中的第一个产品类型
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