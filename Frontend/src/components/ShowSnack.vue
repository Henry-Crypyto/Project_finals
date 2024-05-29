<template>
  <b-container class="page-container">
    <b-container class="snack-container">
      <b-row>
        <b-col>
          <h1 class="text-center" style="text-align: center;">小吃選單</h1>
          <div v-if="userDeveloper === 'addOrDeleteItem'" class="mb-4">
  <b-form @submit.prevent="handleAddSnack">
    <b-form-group label-for="snack-brand">
      <template #label>
        <span style="color: white;">品牌</span>
      </template>
      <b-form-select id="snack-brand" v-model="newSnack.brand" :options="brandOptions.map(brand => ({ value: brand.brand_name, text: brand.brand_name }))" required></b-form-select>
    </b-form-group>
    <b-form-group label-for="snack-name">
      <template #label>
        <span style="color: white;">品項名稱</span>
      </template>
      <b-form-input id="snack-name" v-model="newSnack.name" required></b-form-input>
    </b-form-group>
    <b-form-group label-for="snack-price">
      <template #label>
        <span style="color: white;">單價</span>
      </template>
      <b-form-input type="number" id="snack-price" v-model="newSnack.price" required></b-form-input>
    </b-form-group>
    <b-form-group label-for="snack-flavor">
      <template #label>
        <span style="color: white;">口味</span>
      </template>
      <b-form-select id="snack-flavor" v-model="newSnack.flavor" :options="flavorOptions" required></b-form-select>
    </b-form-group>
    <b-form-group label-for="snack-size">
      <template #label>
        <span style="color: white;">大小</span>
      </template>
      <b-form-select id="snack-size" v-model="newSnack.size" :options="sizeOptions" required></b-form-select>
    </b-form-group>
    <b-form-group label-for="snack-image">
      <template #label>
        <span style="color: white;">上傳圖片</span>
      </template>
      <input type="file" id="snack-image" @change="handleImageUpload" accept="image/png" ref="fileInput" required>
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
              <img :src="getSnackImage(snack.image_path)" alt="Snack Image" class="card-img-top"/>
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
                  <b-button 
                      class="custom-love-button" 
                      variant="primary" 
                      @click="handleAddLoveToCart(snack)" 
                      v-if="userDeveloper !== 'updateItem'">
                      😍喜歡
                   </b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="d-flex justify-content-center mt-2">
                  <b-button 
                     class="custom-hate-button" 
                     @click="handleAddHateToCart(snack)" 
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
    this.fetchNextSnackId();
    this.fetchFlavors();
  },
  data() {
    return {
      localBrandSelect: '',  // This will be used for the local select input
      localFlavorSelect: '', // This will be used for the flavor select input
      localSizeSelect: '', // This will be used for the size select input
      newSnack: {
        id:null,
        brand: '',
        name: '',
        price: '',
        flavor: '',
        size: '',
        image_path: null
      },
      editingSnack: null, // 用於編輯的小吃對象
      flavorOptions: [],
      sizeOptions: [], // Initialize as empty array
      currentPage: 1, // Current page number
      itemsPerPage: 12 // Number of items per page
    };
  },
  computed: {
    ...mapState(['snacks', 'brandOptions', 'brandSelect', 'cartItems', 'userDeveloper','apiUrl']),
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
    fetchNextSnackId() {
        const url = getFullApiUrl('/next_snack_id');
        axios.get(url)
          .then(response => {
            // 假设响应是一个数组，并且我们需要第一个元素的 next_coupon_id
            const nextSnackId = response.data[0].next_snack_id; 
            this.newSnack.id=nextSnackId;
          })
          .catch(error => {
            console.error('Error fetching next snack ID:', error);
          });
    },
    getSnackImage(imagePath) {
      const baseUrl=this.apiUrl;
      if (!imagePath) {
       return require('@/assets/image/default.png'); // 预设图片路径
    }
  return `${baseUrl}${imagePath}`;
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
      


      let url = getFullApiUrl('/add_snack');
      const category = encodeURIComponent('snack');

      if(this.newSnack.image){
        const customFilename = `${category}_${this.newSnack.id}.png`;
        formData.append('image', this.newSnack.image,customFilename);
        const brand = encodeURIComponent(this.newSnack.brand);
        url += `?brand=${brand}&category=${category}&filename=${encodeURIComponent(customFilename)}`;  // Include category and encoded filename in URL parameters

        axios.post(url, formData,{
          headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
          this.$store.dispatch('fetchSnacks');
          alert('Snackadded successfully');
          // Reset the newSnack object to clear the input fields
          this.newSnack = {
            brand: '',
        name: '',
        price: '',
        flavor: '',
        size: '',
        image_path: null
          };
          // Reset the file input
          this.$refs.fileInput.value = '';
          this.fetchNextSnackId();
        })
        .catch(error => {
          console.error('Error adding Snack:', error);
          alert('Failed to add Snack: ' + error.message);
        });
      }else{
        url += `?brand=${encodeURIComponent(this.newSnack.brand)}&category=${category}`;  // Add category to URL
        axios.post(url, formData,{
          headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
          this.$store.dispatch('fetchSnacks');
          alert('Course added successfully');
          // Reset the newSnack object to clear the input fields
          this.newSnack = {
            brand: '',
        name: '',
        price: '',
        flavor: '',
        size: '',
        image_path: null
          };
          // Reset the file input
          this.$refs.fileInput.value = '';
          this.fetchNextSnackId();
        })
        .catch(error => {
          console.error('Error adding Snack:', error);
          alert('Failed to add Snack: ' + error.message);
        });
      }
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

    let url = getFullApiUrl('/update_snack');  // Use a general endpoint like /update_item
    const category = encodeURIComponent('snack');  // Add category field

    if (this.editingSnack.image) {
        const customFilename = `${category}_${this.editingSnack.id}.png`;  // Use category in the filename
        formData.append('image', this.editingSnack.image, customFilename);  // Ensure this doesn't need changes
        const brand = encodeURIComponent(this.editingSnack.brand_name);  // Assume `brand_name` is the brand field
        url += `?brand=${brand}&category=${category}&filename=${encodeURIComponent(customFilename)}`;  // Include category and encoded filename in URL parameters

        axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
            this.$store.dispatch('fetchSnacks');  // Use a general fetch action like fetchItems
            alert('Item updated successfully');
            this.editingSnack = null;  // Clear the editing item data
        })
        .catch(error => {
            console.error('Error updating item:', error);
            alert('Failed to update item: ' + error.message);
        });
    } else {
        // Perform the update operation even if there is no image
        url += `?brand=${encodeURIComponent(this.editingSnack.brand_name)}&category=${category}`;  // Add category to URL
        axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
            this.$store.dispatch('fetchSnacks');  // Use a general fetch action like fetchItems
            alert('Item updated successfully');
            this.editingSnack = null;  // Clear the editing item data
        })
        .catch(error => {
            console.error('Error updating item:', error);
            alert('Failed to update item: ' + error.message);
        });
    }
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
    },
    fetchFlavors() {
        let url = getFullApiUrl('/all_flavor');
        axios.get(url)
          .then(response => {
            this.flavorOptions = response.data.map(flavor => ({ value: flavor.flavor_name, text: flavor.flavor_name }));
          })
          .catch(error => {
            console.error('Error fetching flavors:', error);
          });
      },

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


.snack-container {
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
  font-size: 30px;
}

.b-card-text {
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
