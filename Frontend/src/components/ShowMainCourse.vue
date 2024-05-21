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
              <div class="form-group d-flex justify-content-center">
                <div class="d-flex flex-row flex-wrap">
                  <div v-for="option in meatOptions" :key="option.value" class="mx-3 my-2">
                    <b-form-checkbox
                      :value="option.value"
                      v-model="localMeatSelect"
                      class="custom-checkbox"
                    >
                      {{ option.text }}
                    </b-form-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="paginatedMainCourses.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="course in paginatedMainCourses" :key="course.id" class="mb-4">
          <b-card hover shadow class="h-100 custom-card">
            <img :src="getMainCourseImage(course.image_path)" alt="Main Course Image" class="card-img-top"/>
            <b-card-title class="text-center mb-2">{{ course.name }}</b-card-title>
            <b-card-text><strong>原價:</strong> {{ course.price }}</b-card-text>
            <b-card-text><strong>肉類類型:</strong> {{ course.meat_type || '不詳' }}</b-card-text>
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
                <b-button variant="danger" @click="handleAddHateToCart(course)" v-if="userDeveloper === 'user'">討厭</b-button>
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
      <b-row class="mt-4" v-if="filteredMainCourses.length > 0">
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="filteredMainCourses.length"
            :per-page="itemsPerPage"
            aria-controls="main-course-container"
            align="center"
          ></b-pagination>
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
    this.$store.dispatch('fetchBrandOptions');
  },
  data() {
    return {
      localBrandSelect: '', // 本地品牌选择
      localMeatSelect: [],  // 本地不吃的肉类选择数组
      meatOptions: [
        { text: '不吃牛', value: '牛' },
        { text: '不吃豬', value: '豬' },
        { text: '不吃雞', value: '雞' },
        { text: '不吃海鮮', value: '海鮮' },
        { text: '不吃羊', value: '羊' }
      ],
      currentPage: 1, // 当前页数
      itemsPerPage: 20 // 每页显示的项目数
    };
  },
  computed: {
    ...mapState(['mainCourses', 'brandOptions', 'brandSelect', 'cartItems', 'userDeveloper']),
    filteredMainCourses() {
      return this.mainCourses.filter(course => {
        const brandMatch = this.localBrandSelect === '' || this.localBrandSelect === 'all' || course.brand_name === this.localBrandSelect;
        const meatMatch = this.localMeatSelect.every(meat => !(course.meat_type && course.meat_type.includes(meat)));
        return brandMatch && meatMatch;
      });
    },
    paginatedMainCourses() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMainCourses.slice(start, end);
    }
  },
  watch: {
    localBrandSelect() {
      this.currentPage = 1;
    },
    localMeatSelect() {
      this.currentPage = 1;
    },
    brandSelect(newBrandSelect) {
      this.localBrandSelect = newBrandSelect;
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),
    toggleMeatSelection(meat) {
      const index = this.localMeatSelect.indexOf(meat);
      if (index > -1) {
        this.localMeatSelect.splice(index, 1); // 如果已经选中，则取消选中
      } else {
        this.localMeatSelect.push(meat); // 如果未选中，则添加到数组中
      }
    },
    getMainCourseImage(imagePath) {
      if (!imagePath) {
        return require('@/assets/image/default.png'); // 预设图片路径
      }
      return require(`@/assets/image/${imagePath}`);
    },
    handleAddLoveToCart(course) {
      if (this.cartItems.some(item => item.id === course.id && item.preference === 0 && item.productType === this.$store.state.productType[0])) {
        alert('小兄弟，你不能同時喜歡和討厭，你那叫愛');
        return;
      }
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(course.brand_name);
      }
      if (this.brandSelect === course.brand_name) {
        this.addToCart({
          product: course,
          preference: 1,
          productType: this.$store.state.productType[0] // 假设你正在使用数组中的第一个产品类型
        });
      } else {
        alert('品牌不匹配，无法添加到购物车。');
      }
    },
    handleAddHateToCart(course) {
      if (this.cartItems.some(item => item.id === course.id && item.preference === 1 && item.productType === this.$store.state.productType[0])) {
        alert('小兄弟，你不能同時喜歡和討厭，你那叫愛');
        return;
      }
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(course.brand_name);
      }
      if (this.brandSelect === course.brand_name) {
        this.addToCart({
          product: course,
          preference: 0,
          productType: this.$store.state.productType[0] // 假设你正在使用数组中的第一个产品类型
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



.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  transition: all 0.3s ease;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}

.custom-checkbox:hover {
  background-color: #f0f8ff;
  border-color: #357ab7;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #4a90e2;
  border-color: #4a90e2;
}

.custom-checkbox .custom-control-input:focus ~ .custom-control-label::before {
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

.custom-checkbox .custom-control-label {
  margin-left: 8px;
  color: #333;
  font-size: 16px;
}

.custom-checkbox .custom-control-input {
  display: none;
}

.custom-checkbox .custom-control-label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: 2px solid #ccc;
  border-radius: 3px;
  transition: all 0.3s ease;
  background-color: #fff;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: -20px;
  margin-top: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg);
  transition: all 0.3s ease;
}

.custom-checkbox .custom-control-label::after {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  transition: all 0.3s ease;
}

</style>
