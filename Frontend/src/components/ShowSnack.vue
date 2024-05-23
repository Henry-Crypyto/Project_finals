<template>
  <b-container class="page-container">
    <b-container class="snack-container">
      <b-row>
        <b-col>
          <h1 class="text-center">小吃選單</h1>
          <div class="d-flex justify-content-center mb-4">
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
          </div>
          <div class="d-flex justify-content-center mb-4">
            <div class="col-md-2 mb-3">
              <div class="form-group">
                <select id="flavor-select" class="form-control custom-select" v-model="localFlavorSelect">
                  <option value="">所有口味</option>
                  <option value="酸">酸</option>
                  <option value="甜">甜</option>
                  <option value="苦">苦</option>
                  <option value="辣">辣</option>
                  <option value="鹹">鹹</option>
                </select>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="paginatedSnacks.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="snack in paginatedSnacks" :key="snack.id" class="mb-4">
          <b-card hover shadow class="h-100 custom-card">
            <img :src="getSnackImage(snack.image)" alt="Main Course Image" class="card-img-top"/>
            <b-card-title class="text-center mb-2">{{ snack.name.trim() }}</b-card-title>
            <b-card-text v-if="snack.snack_size"><strong>大小:</strong> {{ snack.snack_size }}</b-card-text>
            <b-card-text><strong>原價:</strong> {{ snack.price }}</b-card-text>
            <b-card-text><strong>風味:</strong> {{ snack.flavor_name }}</b-card-text>
            <b-card-text><strong>品牌:</strong> {{ snack.brand_name }}</b-card-text>
            <b-form-group label="數量" label-for="quantity-input-{{ snack.id }}">
              <b-form-input
                id="quantity-input-{{ snack.id }}"
                type="number"
                v-model="snack.quantity"
                min="1"
                placeholder="數量"
              ></b-form-input>
            </b-form-group>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="primary" @click="handleAddLoveToCart(snack)">喜歡</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="danger" @click="handleAddHateToCart(snack)" v-if="userDeveloper === 'user'">討厭</b-button>
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
      <b-row class="mt-4" v-if="filteredSnacks.length > 0">
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="filteredSnacks.length"
            :per-page="itemsPerPage"
            aria-controls="snack-container"
            align="center"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
// import axios from 'axios';
// import { getFullApiUrl } from '../../config.js';
export default {
  created() {
    this.$store.dispatch('fetchSnacks');
    this.$store.dispatch('fetchBrandOptions');
  },
  data() {
    return {
      localBrandSelect: '',
      localFlavorSelect: '', // This will be used for the local flavor select input
      currentPage: 1, // Current page number
      itemsPerPage: 16 // Number of items per page
    };
  },
  computed: {
    ...mapState(['snacks', 'brandOptions', 'brandSelect', 'cartItems', 'userDeveloper']),
    filteredSnacks() {
      let snacks = this.snacks;
      if (this.localBrandSelect !== '' && this.localBrandSelect !== 'all') {
        snacks = snacks.filter(snack => snack.brand_name === this.localBrandSelect);
      }
      if (this.localFlavorSelect !== '' && this.localFlavorSelect !== 'all') {
        snacks = snacks.filter(snack => snack.flavor_name === this.localFlavorSelect);
      }
      return snacks;
    },
    paginatedSnacks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSnacks.slice(start, end);
    }
  },
  watch: {
    brandSelect(newBrandSelect) {
      this.localBrandSelect = newBrandSelect;
    },
    localBrandSelect(){
      this.currentPage=1;
    },
    localFlavorSelect(){
      this.currentPage=1;
    },
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),
    getSnackImage(image64) {
      if (!image64) {
        return require('@/assets/image/default.png'); // 預設圖片路徑
      }
      return image64;
    },
    handleAddLoveToCart(snack) {
      if (this.cartItems.some(item => item.id === snack.id && item.preference === 0 && item.productType === this.$store.state.productType[2])) {
        alert('小兄弟，你不能同時喜歡和討厭，你那叫愛');
        return;
      }
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(snack.brand_name);
      }
      if (this.brandSelect === snack.brand_name) {
        this.addToCart({
          product: snack,
          preference: 1,
          productType: this.$store.state.productType[2]
        });
      } else {
        alert('品牌不匹配，无法添加到购物车。');
      }
    },
    handleAddHateToCart(snack) {
      if (this.cartItems.some(item => item.id === snack.id && item.preference === 1 && item.productType === this.$store.state.productType[2])) {
        alert('小兄弟，你不能同時喜歡和討厭，你那叫愛');
        return;
      }
      if (this.cartItems.length === 0 && (this.brandSelect === '' || this.brandSelect === 'all')) {
        this.setBrandSelect(snack.brand_name);
      }
      if (this.brandSelect === snack.brand_name) {
        this.addToCart({
          product: snack,
          preference: 0,
          productType: this.$store.state.productType[2]
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
  background-color: #f8f9fa;
}

.snack-container {
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
  font-size: 30px;
}

b-card-text {
  padding-left: 20px;
  line-height: 1.5;
}

.select-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
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
  outline: none;
  appearance: none;
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
