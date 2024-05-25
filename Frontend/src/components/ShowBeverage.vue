<template>
  <b-container class="page-container">
    <b-container class="beverage-container">
      <b-row>
        <b-col>
          <h1 class="text-center">飲料選單</h1>
          <div v-if="userDeveloper === 'addOrDeleteItem'" class="mb-4">
            <b-form @submit.prevent="handleAddBeverage">
              <b-form-group label="品牌">
                <b-form-select v-model="newBeverage.brand" :options="brandOptions.map(brand => ({ value: brand.brand_name, text: brand.brand_name }))" required></b-form-select>
              </b-form-group>
              <b-form-group label="品項名稱">
                <b-form-input v-model="newBeverage.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="newBeverage.price" required></b-form-input>
              </b-form-group>
              <b-form-group label="類型">
                <b-form-select v-model="newBeverage.iced_hot" :options="icedHotOptions" required></b-form-select>
              </b-form-group>
              <b-form-group label="容量">
                <b-form-select v-model="newBeverage.size" :options="sizeOptions" required></b-form-select>
              </b-form-group>
              <b-form-group label="上傳圖片">
                <input type="file" @change="handleImageUpload" accept="image/png" ref="fileInput" required>
              </b-form-group>
              <b-button type="submit" variant="success">新增品項</b-button>
            </b-form>
          </div>
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
                  <option v-for="size in sizeOptions" :key="size.value" :value="size.value">
                    {{ size.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="paginatedBeverages.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="beverage in paginatedBeverages" :key="beverage.id" class="mb-4">
          <b-card hover shadow class="h-100 custom-card">
            <div v-if="editingBeverage && editingBeverage.id === beverage.id">
              <b-form-group label="品項名稱">
                <b-form-input v-model="editingBeverage.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="editingBeverage.price" required></b-form-input>
              </b-form-group>
              <b-form-group label="上傳圖片">
                <input type="file" @change="handleEditImageUpload" accept="image/png" ref="editFileInput">
              </b-form-group>
              <b-button variant="success" @click="handleSaveEdit">保存編輯</b-button>
            </div>
            <div v-else>
              <b-button v-if="userDeveloper === 'addOrDeleteItem'" variant="danger" class="position-absolute top-0 end-0 mt-2 me-2" @click="handleDeleteBeverage(beverage)">
                X
              </b-button>
              <b-button v-if="userDeveloper === 'updateItem'" variant="warning" class="position-absolute top-0 end-0 mt-5 me-2" @click="handleEditBeverage(beverage)">
                編輯
              </b-button>
              <img :src="getBeverageImage(beverage.image)" alt="Beverage Image" class="card-img-top"/>
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
                  <b-button 
                      class="custom-love-button" 
                      variant="primary" 
                      @click="handleAddLoveToCart(course)" 
                      v-if="userDeveloper !== 'updateItem'">
                      😍喜歡
                   </b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="d-flex justify-content-center mt-2">
                  <b-button 
                     class="custom-hate-button" 
                     @click="handleAddHateToCart(course)" 
                     v-if="userDeveloper === 'user'">
                     🤮討厭
                   </b-button>  
                </b-col>
              </b-row>
            </div>
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
import axios from 'axios';
import { getFullApiUrl } from '../../config.js';

export default {
  created() {
    this.$store.dispatch('fetchBeverages');
    this.$store.dispatch('fetchBrandOptions');
    this.fetchBeverageSize();
  },
  data() {
    return {
      localBrandSelect: '',  // This will be used for the local select input
      localIcedHotSelect: '', // This will be used for the iced/hot select input
      localSizeSelect: '', // This will be used for the size select input
      newBeverage: {
        brand: '',
        name: '',
        price: '',
        iced_hot: '',
        size: '',
        image: null
      },
      editingBeverage: null, // 用於編輯的飲料對象
      icedHotOptions: [
        { value: '冰', text: '冰' },
        { value: '熱', text: '熱' }
      ],
      sizeOptions: [], // Initialize as empty array
      currentPage: 1, // Current page number
      itemsPerPage: 12 // Number of items per page
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
    localBrandSelect() {
      this.currentPage = 1;
    },
    localIcedHotSelect() {
      this.currentPage = 1;
    },
    localSizeSelect() {
      this.currentPage = 1;
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),
    getBeverageImage(image64) {
      if (!image64) {
        return require('@/assets/image/default.png'); // 預設圖片路徑
      }
      return image64;
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
    },
    handleAddBeverage() {
      const formData = new FormData();
      formData.append('brand', this.newBeverage.brand);
      formData.append('name', this.newBeverage.name);
      formData.append('price', this.newBeverage.price);
      formData.append('iced_hot', this.newBeverage.iced_hot);
      formData.append('size', this.newBeverage.size);
      formData.append('image', this.newBeverage.image);

      axios.post(getFullApiUrl('/add_beverage'), formData)
        .then(() => {
          this.$store.dispatch('fetchBeverages');
          alert('Beverage added successfully');
          // Reset the newBeverage object to clear the input fields
          this.newBeverage = {
            brand: '',
            name: '',
            price: '',
            iced_hot: '',
            size: '',
            image: null
          };
          // Reset the file input
          this.$refs.fileInput.value = '';
        })
        .catch(error => {
          console.error('Error adding beverage:', error);
          alert('Failed to add beverage: ' + error.message);
        });
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newBeverage.image = file;
    },
    handleEditBeverage(beverage) {
      this.editingBeverage = { ...beverage };
    },
    handleSaveEdit() {
      const formData = new FormData();
      formData.append('id', this.editingBeverage.id);
      formData.append('name', this.editingBeverage.name);
      formData.append('price', this.editingBeverage.price);

      if (this.editingBeverage.image) {
        formData.append('image', this.editingBeverage.image);
      }

      axios.put(getFullApiUrl('/update_beverage'), formData)
        .then(() => {
          this.$store.dispatch('fetchBeverages');
          alert('Beverage updated successfully');
          this.editingBeverage = null;
        })
        .catch(error => {
          console.error('Error updating beverage:', error);
          alert('Failed to update beverage: ' + error.message);
        });
    },
    handleEditImageUpload(event) {
      const file = event.target.files[0];
      this.editingBeverage.image = file;
    },
    handleDeleteBeverage(beverage) {
      if (confirm(`Are you sure you want to delete ${beverage.name}?`)) {
        this.deleteBeverage(beverage.id);
      }
    },
    deleteBeverage(beverageId) {
      const url = getFullApiUrl(`/delete_beverage/${beverageId}`);
      axios.delete(url)
        .then(() => {
          this.$store.dispatch('fetchBeverages');
          alert('飲料刪除完成');
        })
        .catch(error => {
          console.error('Error deleting beverage:', error);
          alert("飲料删除失败：" + error.message);
        });
    },
    fetchBeverageSize() {
      const url = getFullApiUrl('/all_beverage_size');
      axios.get(url)
        .then(response => {
          this.sizeOptions = response.data.map(size => ({ value: size.beverage_size, text: size.beverage_size }));
        })
        .catch(error => {
          console.error('Error fetching beverage sizes:', error);
        });
    }
  }
}
</script>




<style scoped>
.custom-hate-button {
  background-image: linear-gradient(to right, #ff416c, #ff4b2b); /* 漸變背景色 */
  color: white; /* 文字顏色 */
  padding: 10px 20px; /* 內邊距 */
  border: none; /* 無邊框 */
  border-radius: 25px; /* 圓角 */
  font-size: 16px; /* 字體大小 */
  font-weight: bold; /* 字體粗細 */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); /* 盒子陰影 */
  cursor: pointer; /* 鼠標指標 */
  transition: all 0.3s ease; /* 過渡動畫 */
  outline: none; /* 去除點擊後的輪廓 */
}

.custom-hate-button:hover {
  background-image: linear-gradient(to right, #ff4b2b, #ff416c); /* 懸停時的漸變背景色 */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25); /* 懸停時的陰影 */
  transform: scale(1.05); /* 懸停時稍微放大 */
}

.custom-hate-button:focus {
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5); /* 焦點時的外框陰影 */
}
.custom-love-button {
  background-image: linear-gradient(to right, #ff7e5f, #feb47b); /* 漸變背景色 */
  color: white; /* 文字顏色 */
  padding: 10px 20px; /* 內邊距 */
  border: none; /* 無邊框 */
  border-radius: 25px; /* 圓角 */
  font-size: 16px; /* 字體大小 */
  font-weight: bold; /* 字體粗細 */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); /* 盒子陰影 */
  cursor: pointer; /* 鼠標指標 */
  transition: all 0.3s ease; /* 過渡動畫 */
  outline: none; /* 去除點擊後的輪廓 */
}

.custom-love-button:hover {
  background-image: linear-gradient(to right, #feb47b, #ff7e5f); /* 懸停時的漸變背景色 */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); /* 懸停時的陰影 */
  transform: scale(1.05); /* 懸停時稍微放大 */
}

.custom-love-button:focus {
  box-shadow: 0 0 0 2px rgba(255, 105, 135, 0.5); /* 焦點時的外框陰影 */
}
.page-container {
  border: 3px solid black; /* Bold rectangular border around the page */
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 67px; /* Optional: Adds rounded corners */
  background-image: linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%); background-blend-mode: multiply,multiply; background-blend-mode: multiply,multiply;  
}

.beverage-container {
  background-image: linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%); background-blend-mode: multiply,multiply; background-blend-mode: multiply,multiply;  
  padding-top: 20px;
  padding-bottom: 20px;
}

.custom-card {
  background: linear-gradient(to bottom, #7FFFD4 7.5%, #AFCBD6 72.5%);
  padding: 20px;
  border-radius: 15px;
}

.card-title {
  color: #4a90e2;
  font-size: 30px; /* Larger font size for titles */
}

.b-card-text {
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
