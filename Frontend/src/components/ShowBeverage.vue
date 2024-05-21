<template>
  <b-container class="page-container">
    <b-container class="beverage-container">
      <b-row>
        <b-col>
          <h1 class="text-center">飲料選單</h1>
          <div class="d-flex flex-column align-items-center mb-4">
            <div class="col-md-2 mb-3">
              <div class="form-group">
                <select id="brand-select" class="form-control custom-select" v-model="localBrandSelect">
                  <option value="">所有品牌</option>
                  <option v-for="brand in brandOptions" :key="brand.brand_id" :value="brand.brand_name">
                    {{ brand.brand_name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2 mb-3">
              <div class="form-group">
                <select id="iced-hot-select" class="form-control custom-select" v-model="localIcedHotSelect">
                  <option value="">所有類型</option>
                  <option value="冰">冰</option>
                  <option value="熱">熱</option>
                </select>
              </div>
            </div>
            <div class="col-md-2 mb-3">
              <div class="form-group">
                <select id="size-select" class="form-control custom-select" v-model="localSizeSelect">
                  <option value="">所有容量</option>
                  <option value="450ml">450ml</option>
                  <option value="650ml">650ml</option>
                  <option value="950ml">950ml</option>
                </select>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="paginatedBeverages.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="beverage in paginatedBeverages" :key="beverage.id" class="mb-4">
          <b-card hover shadow class="h-100 custom-card">
            <img :src="getMainCourseImage(beverage.image_path)" alt="Main Course Image" class="card-img-top"/>
            <b-card-title class="text-center mb-2">{{ beverage.name.trim() }}</b-card-title>
            <b-card-text><strong>原價:</strong> {{ beverage.price }}</b-card-text>
            <b-card-text><strong>容量:</strong> {{ beverage.beverage_size }}</b-card-text>
            <b-card-text><strong>類型:</strong> {{ beverage.iced_hot_name }}</b-card-text>
            <b-card-text><strong>品牌:</strong> {{ beverage.brand_name }}</b-card-text>
            <b-form-group label="數量" label-for="quantity-input-{{ beverage.id }}">
              <b-form-input
                id="quantity-input-{{ beverage.id }}"
                type="number"
                v-model="beverage.quantity"
                min="1"
                placeholder="數量"
              ></b-form-input>
            </b-form-group>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="primary" @click="handleAddLoveToCart(beverage)">喜歡</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="danger" @click="handleAddHateToCart(beverage)" v-if="userDeveloper === 'user'">討厭</b-button>
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
      <b-row class="mt-4" v-if="filteredBeverages.length > 0">
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="filteredBeverages.length"
            :per-page="itemsPerPage"
            aria-controls="beverage-container"
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
    this.$store.dispatch('fetchBeverages');
    this.$store.dispatch('fetchBrandOptions'); // Fetch brand options when component is created
  },
  data() {
    return {
      localBrandSelect: '',  // This will be used for the local select input
      localIcedHotSelect: '', // This will be used for the iced/hot select input
      localSizeSelect: '', // This will be used for the size select input
      currentPage: 1, // Current page number
      itemsPerPage: 20 // Number of items per page
    };
  },
  computed: {
    ...mapState(['beverages', 'brandOptions', 'brandSelect', 'cartItems', 'userDeveloper']),
    filteredBeverages() {
      return this.beverages.filter(beverage => {
        const brandMatch = this.localBrandSelect === '' || beverage.brand_name === this.localBrandSelect;
        const icedHotMatch = this.localIcedHotSelect === '' || beverage.iced_hot_name === this.localIcedHotSelect;
        const sizeMatch = this.localSizeSelect === '' || beverage.beverage_size === this.localSizeSelect;
        return brandMatch && icedHotMatch && sizeMatch;
      });
    },
    paginatedBeverages() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBeverages.slice(start, end);
    }
  },
  watch: {
    // Watch for changes in the Vuex store's brandSelect and update the localBrandSelect accordingly
    brandSelect(newBrandSelect) {
      this.localBrandSelect = newBrandSelect;
    },
    localBrandSelect(){
      this.currentPage=1;
    },
    localIcedHotSelect(){
      this.currentPage=1;
    },
    localSizeSelect(){
      this.currentPage=1;
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),
    getMainCourseImage(imagePath) {
      if (!imagePath) {
        return require('@/assets/image/default.png'); // 預設圖片路徑
      }
      return require(`@/assets/image/${imagePath}`);
    },
    handleAddLoveToCart(beverage) {
      if (this.cartItems.some(item => item.id === beverage.id && item.preference === 0 && item.productType === this.$store.state.productType[1])) {
        alert('小兄弟，你不能同時喜歡和討厭，你那叫愛');
        return;
      }
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(beverage.brand_name);
      }
      if (this.brandSelect === beverage.brand_name) {
        this.addToCart({
          product: beverage,
          preference: 1,
          productType: this.$store.state.productType[1]  // 假设你正在使用数组中的第一个产品类型
        });
      } else {
        alert('品牌不匹配，无法添加到购物车。');
      }
    },
    handleAddHateToCart(beverage) {
      if (this.cartItems.some(item => item.id === beverage.id && item.preference === 1 && item.productType === this.$store.state.productType[1])) {
        alert('小兄弟，你不能同時喜歡和討厭，你那叫愛');
        return;
      }
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(beverage.brand_name);
      }
      if (this.brandSelect === beverage.brand_name) {
        this.addToCart({
          product: beverage,
          preference: 0,
          productType: this.$store.state.productType[1]  // 假设你正在使用数组中的第一个产品类型
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
  border: 3px solid black; /* Bold rectangular border around the page */
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 67px; /* Optional: Adds rounded corners */
  background-color: #f8f9fa; /* Matches inner container background */
}

.beverage-container {
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
