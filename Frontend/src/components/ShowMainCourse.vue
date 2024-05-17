<template>
  <b-container class="page-container">
    <b-container class="main-course-container">
      <b-row>
        <b-col>
          <h1 class="text-center">主菜選單</h1>
          <div class="mb-4">
            <div class="col-md-2 mb-3 mx-auto">
              <div class="form-group">
                <select id="brand-select" class="form-control custom-select" v-model="localBrandSelect">
                  <option value="">所有品牌</option>
                  <option v-for="brand in brandOptions" :key="brand.brand_id" :value="brand.brand_name">
                    {{ brand.brand_name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2 mb-3 mx-auto">
              <div class="form-group">
                <select id="meat-select" class="form-control custom-select" v-model="localMeatSelect">
                  <option value="">所有肉類</option>
                  <option value="牛">牛</option>
                  <option value="豬">豬</option>
                  <option value="雞">雞</option>
                  <option value="海鮮">海鮮</option>
                  <option value="羊">羊</option>
                </select>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="filteredMainCourses.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="course in filteredMainCourses" :key="course.id" class="mb-4">
          <b-card hover shadow class="h-100 custom-card">
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
                <b-button variant="primary" @click="handleAddLoveToCart(course)">喜歡</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="danger" @click="handleAddHateToCart(course)" v-if="editOrAdd===2">討厭</b-button>
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
    this.$store.dispatch('fetchBrandOptions'); // Fetch brand options when component is created
  },
  data() {
    return {
      localBrandSelect: '',  // This will be used for the local select input
      localMeatSelect: '' // 新增的肉類篩選選項
    };
  },
  computed: {
    ...mapState(['mainCourses', 'brandOptions', 'brandSelect', 'cartItems','editOrAdd']),
    filteredMainCourses() {
      return this.mainCourses.filter(course => {
        const brandMatch = this.localBrandSelect === '' || this.localBrandSelect === 'all' || course.brand_name === this.localBrandSelect;
        const meatMatch = this.localMeatSelect === '' || course.meat_type_name === this.localMeatSelect;
        return brandMatch && meatMatch;
      });
    }
  },
  watch: {
    // Watch for changes in the Vuex store's brandSelect and update the localBrandSelect accordingly
    brandSelect(newBrandSelect) {
      this.localBrandSelect = newBrandSelect;
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),

    handleAddLoveToCart(course) {
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(course.brand_name);
      }
      if (this.brandSelect === course.brand_name) {
        this.addToCart({
          product: course,
          preference: 1,
          productType: this.$store.state.productType[0]  // 假设你正在使用数组中的第一个产品类型
        });
      } else {
        alert('品牌不匹配，无法添加到购物车。');
      }
    },
    handleAddHateToCart(course) {
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(course.brand_name);
      }
      if (this.brandSelect === course.brand_name) {
        this.addToCart({
          product: course,
          preference: 0,
          productType: this.$store.state.productType[0]  // 假设你正在使用数组中的第一个产品类型
        });
      } else {
        alert('品牌不匹配，无法添加到购物车。');
      }
    }
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

.select-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center;
  justify-content: center;
  gap: 20px; /* 增加間距 */
  margin: 20px 0;
}

.custom-select {
  width: 200px;
  padding: 10px 15px;
  border: 2px solid #aaa;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-size: 16px;
  color: #333;
  cursor: pointer;
  outline: none; /* 移除焦點時的輪廓 */
  appearance: none; /* 移除默認樣式 */
  position: relative;
  background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.custom-select:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0,86,179,0.8);
}
</style>
