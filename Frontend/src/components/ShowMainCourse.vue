<template>
  <b-container class="page-container">
    <b-container class="main-course-container">
      <b-row>
        <b-col>
          <h1 class="text-center">主菜選單</h1>
        </b-col>
      </b-row>
      <b-row v-if="filteredMainCourses.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="course in filteredMainCourses" :key="course.id" class="mb-4">
          <b-card
            hover
            shadow
            class="h-100 custom-card"
          >
            <b-card-title class="text-center mb-2">{{ course.name }}</b-card-title>
            <b-card-text><strong>原價:</strong> {{ course.price }}</b-card-text>
            <b-card-text><strong>肉類類型:</strong> {{ course.meat_type_name || '不詳' }}</b-card-text>
            <b-card-text><strong>品牌:</strong> {{ course.brand_name }}</b-card-text>
            <b-form-group label="數量" label-for="quantity-input-{{ course.id }}">
              <b-form-input
                id="quantity-input-{{ course.id }}"
                type="number"
                v-model="course.quantity"
                min="1"
                placeholder="數量"
              ></b-form-input>
            </b-form-group>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="primary" @click="handleAddToCart(course)">加入購物車</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
          <p>正在加載數據或沒有數據顯示...</p>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  created() {
    this.$store.dispatch('fetchMainCourses');
  },
  computed: {
    ...mapState(['mainCourses']),
    filteredMainCourses() {
      if (this.$store.state.brandSelect === 'all') {
        return this.mainCourses;
      } else {
        return this.mainCourses.filter(course => course.brand_name === this.$store.state.brandSelect);
      }
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),
    handleAddToCart(course) {
      if (this.$store.state.cartItems.length === 0) {
        if (!confirm(`购物车当前为空。你确定要添加 ${course.brand_name} 品牌的商品到购物车吗？`)) {
          return;
        }
      }
      this.setBrandSelect(course.brand_name);
      this.addToCart({
        product: course,
        productType: this.$store.state.productType[0]  // 假设你正在使用数组中的第一个产品类型
      });
    },
  }
}
</script>

<style scoped>
.page-container {
  border: 3px solid black;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 67px;
}

.main-course-container {
  background-color: #f8f9fa;
  padding-top: 20px;
  padding-bottom: 20px;
}

.custom-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
}

.card-title {
  color: #4a90e2;
  font-size: 30px; /* Larger font size for titles */
}

b-card-text {
  padding-left: 20px; /* Better alignment for text */
  line-height: 1.5; /* Improved line spacing for readability */
}
</style>
