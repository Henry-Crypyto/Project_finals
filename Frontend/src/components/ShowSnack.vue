<template>
  <b-container class="page-container">
    <b-container class="snack-container">
      <b-row>
        <b-col>
          <h1 class="text-center">小吃選單</h1>
          <div v-if="userDeveloper === 'addOrDeleteItem'" class="mb-4">
            <b-form @submit.prevent="handleAddSnack">
              <b-form-group label="品牌">
                <b-form-select v-model="newSnack.brand" :options="brandOptions.map(brand => ({ value: brand.brand_name, text: brand.brand_name }))" required></b-form-select>
              </b-form-group>
              <b-form-group label="品項名稱">
                <b-form-input v-model="newSnack.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="newSnack.price" required></b-form-input>
              </b-form-group>
              <b-form-group label="口味">
                <b-form-select v-model="newSnack.flavor" :options="flavorOptions" required></b-form-select>
              </b-form-group>
              <b-form-group label="大小">
                <b-form-select v-model="newSnack.size" :options="sizeOptions" required></b-form-select>
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
                <select id="flavor-select" class="form-control custom-select" v-model="localFlavorSelect">
                  <option value="">所有口味</option>
                  <option v-for="flavor in flavorOptions" :key="flavor.value" :value="flavor.value">
                    {{ flavor.text }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-2 mb-3">
              <div class="form-group">
                <select id="size-select" class="form-control custom-select" v-model="localSizeSelect">
                  <option value="">所有大小</option>
                  <option v-for="size in sizeOptions" :key="size.value" :value="size.value">
                    {{ size.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="paginatedSnacks.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="snack in paginatedSnacks" :key="snack.id" class="mb-4">
          <b-card hover shadow class="h-100 custom-card">
            <div v-if="editingSnack && editingSnack.id === snack.id">
              <b-form-group label="品項名稱">
                <b-form-input v-model="editingSnack.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="editingSnack.price" required></b-form-input>
              </b-form-group>
              <b-form-group label="上傳圖片">
                <input type="file" @change="handleEditImageUpload" accept="image/png" ref="editFileInput">
              </b-form-group>
              <b-button variant="success" @click="handleSaveEdit">保存編輯</b-button>
            </div>
            <div v-else>
              <b-button v-if="userDeveloper === 'addOrDeleteItem'" variant="danger" class="position-absolute top-0 end-0 mt-2 me-2" @click="handleDeleteSnack(snack)">
                X
              </b-button>
              <b-button v-if="userDeveloper === 'updateItem'" variant="warning" class="position-absolute top-0 end-0 mt-5 me-2" @click="handleEditSnack(snack)">
                編輯
              </b-button>
              <img :src="getSnackImage(snack.image)" alt="Snack Image" class="card-img-top"/>
              <b-card-title class="text-center mb-2">{{ snack.name.trim() }}</b-card-title>
              <b-card-text><strong>原價:</strong> {{ snack.price }}</b-card-text>
              <b-card-text><strong>大小:</strong> {{ snack.snack_size || '無' }}</b-card-text>
              <b-card-text><strong>口味:</strong> {{ snack.flavor_name }}</b-card-text>
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
            </div>
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
import axios from 'axios';
import { getFullApiUrl } from '../../config.js';

export default {
  created() {
    this.$store.dispatch('fetchSnacks');
    this.$store.dispatch('fetchBrandOptions');
    this.fetchSnackSize();
  },
  data() {
    return {
      localBrandSelect: '',  // This will be used for the local select input
      localFlavorSelect: '', // This will be used for the flavor select input
      localSizeSelect: '', // This will be used for the size select input
      newSnack: {
        brand: '',
        name: '',
        price: '',
        flavor: '',
        size: '',
        image: null
      },
      editingSnack: null, // 用於編輯的小吃對象
      flavorOptions: [
        { value: '酸', text: '酸' },
        { value: '甜', text: '甜' },
        { value: '苦', text: '苦' },
        { value: '辣', text: '辣' },
        { value: '鹹', text: '鹹' }
      ],
      sizeOptions: [], // Initialize as empty array
      currentPage: 1, // Current page number
      itemsPerPage: 16 // Number of items per page
    };
  },
  computed: {
    ...mapState(['snacks', 'brandOptions', 'brandSelect', 'cartItems', 'userDeveloper']),
    filteredSnacks() {
      return this.snacks.filter(snack => {
        const brandMatch = this.localBrandSelect === '' || snack.brand_name === this.localBrandSelect;
        const flavorMatch = this.localFlavorSelect === '' || snack.flavor_name === this.localFlavorSelect;
        const sizeMatch = this.localSizeSelect === '' || snack.snack_size === this.localSizeSelect;
        return brandMatch && flavorMatch && sizeMatch;
      });
    },
    paginatedSnacks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSnacks.slice(start, end);
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
    localFlavorSelect() {
      this.currentPage = 1;
    },
    localSizeSelect() {
      this.currentPage = 1;
    }
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
    },
    handleAddSnack() {
      const formData = new FormData();
      formData.append('brand', this.newSnack.brand);
      formData.append('name', this.newSnack.name);
      formData.append('price', this.newSnack.price);
      formData.append('flavor', this.newSnack.flavor);
      formData.append('size', this.newSnack.size);
      formData.append('image', this.newSnack.image);

      axios.post(getFullApiUrl('/add_snack'), formData)
        .then(() => {
          this.$store.dispatch('fetchSnacks');
          alert('Snack added successfully');
          // Reset the newSnack object to clear the input fields
          this.newSnack = {
            brand: '',
            name: '',
            price: '',
            flavor: '',
            size: '',
            image: null
          };
          // Reset the file input
          this.$refs.fileInput.value = '';
        })
        .catch(error => {
          console.error('Error adding snack:', error);
          alert('Failed to add snack: ' + error.message);
        });
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newSnack.image = file;
    },
    handleEditSnack(snack) {
      this.editingSnack = { ...snack };
    },
    handleSaveEdit() {
      const formData = new FormData();
      formData.append('id', this.editingSnack.id);
      formData.append('name', this.editingSnack.name);
      formData.append('price', this.editingSnack.price);
      if (this.editingSnack.image) {
        formData.append('image', this.editingSnack.image);
      }

      axios.put(getFullApiUrl('/update_snack'), formData)
        .then(() => {
          this.$store.dispatch('fetchSnacks');
          alert('Snack updated successfully');
          this.editingSnack = null;
        })
        .catch(error => {
          console.error('Error updating snack:', error);
          alert('Failed to update snack: ' + error.message);
        });
    },
    handleEditImageUpload(event) {
      const file = event.target.files[0];
      this.editingSnack.image = file;
    },
    handleDeleteSnack(snack) {
      if (confirm(`Are you sure you want to delete ${snack.name}?`)) {
        this.deleteSnack(snack.id);
      }
    },
    deleteSnack(snackId) {
      const url = getFullApiUrl(`/delete_snack/${snackId}`);
      axios.delete(url)
        .then(() => {
          this.$store.dispatch('fetchSnacks');
          alert('小吃刪除完成');
        })
        .catch(error => {
          console.error('Error deleting snack:', error);
          alert("小吃删除失败：" + error.message);
        });
    },
    fetchSnackSize() {
      const url = getFullApiUrl('/all_snack_size');
      axios.get(url)
        .then(response => {
          this.sizeOptions = response.data.map(size => ({ value: size.size_type, text: size.size_type }));
        })
        .catch(error => {
          console.error('Error fetching snack sizes:', error);
        });
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
  flex-direction: column;
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
