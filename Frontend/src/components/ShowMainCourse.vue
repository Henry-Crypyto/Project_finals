<template>
  <b-container class="page-container">
    <b-container class="main-course-container">
      <b-row>
        <b-col>
          <h1 class="text-center" style="text-align: center;">主菜選單</h1>
          <div v-if="userDeveloper === 'addOrDeleteItem'" class="mb-4">
            <b-form @submit.prevent="handleAddCourse">
              <b-form-group label-for="course-brand">
                <template #label>
                  <span style="color: white;">品牌</span>
                </template>
                <b-form-select v-model="newCourse.brand" :options="brandOptions.map(brand => ({ value: brand.brand_name, text: brand.brand_name }))" required></b-form-select>
              </b-form-group>
              <b-form-group label-for="course-name">
                <template #label>
                  <span style="color: white;">品項名稱</span>
                </template>
                <b-form-input id="course-name" v-model="newCourse.name" required></b-form-input>
              </b-form-group>
              <b-form-group label-for="course-price">
                <template #label>
                  <span style="color: white;">單價</span>
                </template>
                <b-form-input type="number" id="course-price" v-model="newCourse.price" :min="1" required></b-form-input>
              </b-form-group>
              <b-form-group label-for="course-flavor">
                <template #label>
                  <span style="color: white;">口味</span>
                </template>
                <b-form-select id="course-flavor" v-model="newCourse.flavor" :options="flavorOptions" required></b-form-select>
              </b-form-group>
              <b-form-group label-for="course-meat">
                <template #label>
                  <span style="color: white;">肉類</span>
                </template>
                <b-form-checkbox-group id="course-meat" v-model="newCourse.meatTypes" :options="meatSubmitOptions" class="white-text-options"></b-form-checkbox-group>
              </b-form-group>
              <b-form-group label-for="course-image">
                <template #label>
                  <span style="color: white;">上傳圖片</span>
                </template>
                <input type="file" id="course-image" @change="handleImageUpload" accept="image/png" ref="fileInput" required>
              </b-form-group>
              <b-button type="submit" variant="success">新增品項</b-button>
            </b-form>
          </div>
          <div class="mb-4">
            <div class="col-md-2 mb-3 mx-auto">
              <div class="form-group">
                <select id="brand-select" class="form-control custom-select" v-model="localBrandSelect">
                  <option value="all">所有品牌</option>
                  <option v-for="brand in brandOptions" :key="brand.brand_id" :value="brand.brand_name">
                    {{ brand.brand_name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <!-- 新增的篩選下拉選單 -->
          <div class="col-md-2 mb-3 mx-auto">
            <b-form-group label-for="filter-type">
              <b-form-select class="form-control custom-select" id="filter-type" v-model="meatFilterType" :options="meatFilterOptions" @change="handleMeatFilterChange"></b-form-select>
            </b-form-group>

            <!-- 篩選條件 -->
            <div>
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
            <div v-if="editingCourse && editingCourse.id === course.id">
              <b-form-group label="品項名稱">
                <b-form-input v-model="editingCourse.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="editingCourse.price" :min="1" required></b-form-input>
              </b-form-group>
              <b-form-group label="上傳圖片">
                <input type="file" @change="handleEditImageUpload" accept="image/png" ref="editFileInput">
              </b-form-group>
              <b-button variant="success" @click="handleSaveEdit">保存編輯</b-button>
              <b-button variant="danger" @click="cancelEdit">取消編輯</b-button>
            </div>
            <div v-else>
              <b-button v-if="userDeveloper === 'addOrDeleteItem'" variant="danger" class="position-absolute top-0 end-0 mt-2 me-2" @click="handleDeleteCourse(course)">
                X
              </b-button>
              <b-button v-if="userDeveloper === 'updateItem'" variant="warning" class="position-absolute top-0 end-0 mt-5 me-2" @click="handleEditCourse(course)">
                編輯
              </b-button>
              <img :src="getMainCourseImage(course.image_path)" alt="Main Course Image" class="card-img-top"/>
              <b-card-title class="text-center mb-2">{{ course.name }}</b-card-title>
              <b-card-text><strong>原價:</strong> {{ course.price }}</b-card-text>
              <b-card-text><strong>肉類類型:</strong> {{ course.meat_type || '無' }}</b-card-text>
              <b-card-text><strong>口味:</strong> {{ course.flavor_name || '無' }}</b-card-text>
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
import { getFullApiUrl } from '../../config.js';
import axios from 'axios';

export default {
  created() {    
    this.$store.dispatch('fetchMainCourses');
    this.$store.dispatch('fetchBrandOptions');
    this.fetchNextMainCourseId();
    this.fetchMeatTypes();
    this.fetchFlavors();
  },
  data() {
    return {
      localBrandSelect: '', // 本地品牌选择
      localMeatSelect: [],  // 本地不吃的肉类选择数组
      newCourse: {
        id: null,
        brand: '',
        name: '',
        price: '',
        flavor: '',
        meatTypes: [], // 新增的肉类选择
        image_path: null
      },
      editingCourse: null, // 用于编辑的课程对象
      flavorOptions: [],
      meatOptions: [],
      meatSubmitOptions: [],
      currentPage: 1, // 当前页数
      itemsPerPage: 12, // 每页显示的项目数
      meatFilterType: 'include', // 預設為篩選"我要吃的肉類"
      meatFilterOptions: [
        { value: 'include', text: '我要吃的肉類' },
        { value: 'exclude', text: '我不要吃的肉類' }
      ]
    };
  },
  computed: {
    ...mapState(['mainCourses', 'brandOptions', 'brandSelect', 'cartItems', 'userDeveloper','apiUrl']),
    filteredMainCourses() {
      return this.mainCourses.filter(course => {
        const brandMatch = this.localBrandSelect === '' || this.localBrandSelect === 'all' || course.brand_name === this.localBrandSelect;
        
        // 根據篩選類型篩選肉類
        const meatMatch = this.meatFilterType === 'include'
          ? this.localMeatSelect.every(meat => course.meat_type && course.meat_type.includes(meat))
          : this.localMeatSelect.every(meat => !(course.meat_type && course.meat_type.includes(meat)));
        
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
    meatFilterType() {
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
    cancelEdit() {
    this.editingCourse = null;
    this.editingCourseImage = null;
    },
    fetchMeatTypes() {
      let url = getFullApiUrl('/all_meat_type');
      axios.get(url)
        .then(response => {
          this.meatSubmitOptions = response.data.map(meat => {
            return {
              text: meat.meat_type_name,
              value: meat.meat_type_name
            };
          });
          this.meatOptions = response.data.map(meat => {
            return {
              text: `${meat.meat_type_name}`,
              value: meat.meat_type_name
            };
          });
        })
        .catch(error => {
          console.error('Error fetching meat types:', error);
        });
    },
    getMainCourseImage(imagePath) {
      const baseUrl = this.apiUrl;
      if (!imagePath) {
        return require('@/assets/image/default.png'); // 预设图片路径
      }
      return `${baseUrl}${imagePath}`;
    },
    fetchNextMainCourseId() {
      const url = getFullApiUrl('/next_main_course_id');
      axios.get(url)
        .then(response => {
          // 假设响应是一个数组，并且我们需要第一个元素的 next_coupon_id
          const nextMainCourseId = response.data[0].next_main_course_id;
          this.newCourse.id = nextMainCourseId;
        })
        .catch(error => {
          console.error('Error fetching next coupon ID:', error);
        });
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
        alert('品牌不一樣，不能這麼花心!!');
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
        alert('品牌不一樣，不能這麼花心!!');
      }
    },
    handleDeleteCourse(course) {
      if (confirm(`Are you sure you want to delete ${course.name}?`)) {
        // If the user confirms, proceed with the deletion
        this.deleteMainCourses(course.id);
      }
    },
    deleteMainCourses(courseId) {
      // 提示用户确认删除
      const url = getFullApiUrl(`/delete_main_course/${courseId}`);
      axios.delete(url)
        .then(() => {
          // 删除成功后重新获取主菜信息
          this.$store.dispatch('fetchMainCourses');
          alert('主餐刪除完成');
        })
        .catch(error => {
          console.error('Error deleting course:', error);
          // 处理删除失败的情况
          alert("主餐删除失败：" + error.message);
        });
    },
    handleAddCourse() {
      if (this.newCourse.price<1) {
      alert('品項名稱不能為空或是你價錢太少了');
      return;
    }
  if (confirm('确定要新增嗎？')) {
    const formData = new FormData();
    formData.append('brand', this.newCourse.brand);
    formData.append('name', this.newCourse.name);
    formData.append('price', this.newCourse.price);
    formData.append('flavor', this.newCourse.flavor);
    
    // Convert meat types to numerical IDs
    const meatTypeIds = this.newCourse.meatTypes.map(type => {
      switch (type) {
        case '牛':
          return 1;
        case '羊':
          return 2;
        case '豬':
          return 3;
        case '雞':
          return 4;
        case '海鮮':
          return 5;
        default:
          return null;
      }
    }).filter(id => id !== null);

    if (this.newCourse.meatTypes) {
      formData.append('meatTypes', meatTypeIds.join(',')); 
    } else {
      formData.append('meatTypes', null); 
    }

    // 将数组转换为逗号分隔的字符串
    let url = getFullApiUrl('/add_main_course');
    const category = encodeURIComponent('main_course');

    if (this.newCourse.image) {
      const customFilename = `${category}_${this.newCourse.id}.png`;
      formData.append('image', this.newCourse.image, customFilename);
      const brand = encodeURIComponent(this.newCourse.brand);
      url += `?brand=${brand}&category=${category}&filename=${encodeURIComponent(customFilename)}`;  // Include category and encoded filename in URL parameters

      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        this.$store.dispatch('fetchMainCourses');
        alert('Course added successfully');
        // Reset the newCourse object to clear the input fields
        this.newCourse = {
          brand: '',
          name: '',
          price: '',
          flavor: '',
          meatTypes: [],
          image: null
        };
        // Reset the file input
        this.$refs.fileInput.value = '';
        this.fetchNextMainCourseId();
      })
      .catch(error => {
        console.error('Error adding course:', error);
        alert('Failed to add course: ' + error.message);
      });
    } else {
      url += `?brand=${encodeURIComponent(this.newCourse.brand)}&category=${category}`;  // Add category to URL
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        this.$store.dispatch('fetchMainCourses');
        alert('Course added successfully');
        // Reset the newCourse object to clear the input fields
        this.newCourse = {
          brand: '',
          name: '',
          price: '',
          flavor: '',
          meatTypes: [],
          image_path: null
        };
        // Reset the file input
        this.$refs.fileInput.value = '';
        this.fetchNextMainCourseId();
      })
      .catch(error => {
        console.error('Error adding course:', error);
        alert('Failed to add course: ' + error.message);
      });
    }
  }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newCourse.image = file;
    },
    handleEditCourse(course) {
      this.editingCourse = { ...course };
    },
    handleSaveEdit() {
      if (!this.editingCourse.name.trim()||this.editingCourse.price<1) {
      alert('品項名稱不能為空或是你價錢太少了');
      return;
    }
    const formData = new FormData();
    formData.append('id', this.editingCourse.id);
    formData.append('name', this.editingCourse.name);
    formData.append('price', this.editingCourse.price);

    let url = getFullApiUrl('/update_main_course');  // Use a general endpoint like /update_item
    const category = encodeURIComponent('main_course');  // Add category field

    if (this.editingCourse.image) {
        const customFilename = `${category}_${this.editingCourse.id}.png`;  // Use category in the filename
        formData.append('image', this.editingCourse.image, customFilename);  // Ensure this doesn't need changes
        const brand = encodeURIComponent(this.editingCourse.brand_name);  // Assume `brand_name` is the brand field
        url += `?brand=${brand}&category=${category}&filename=${encodeURIComponent(customFilename)}`;  // Include category and encoded filename in URL parameters

        axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
            this.$store.dispatch('fetchMainCourses');  // Use a general fetch action like fetchItems
            alert('Item updated successfully');
            this.editingCourse = null;  // Clear the editing item data
        })
        .catch(error => {
            console.error('Error updating item:', error);
            alert('Failed to update item: ' + error.message);
        });
    } else {
        // Perform the update operation even if there is no image
        url += `?brand=${encodeURIComponent(this.editingCourse.brand_name)}&category=${category}`;  // Add category to URL
        axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => {
            this.$store.dispatch('fetchMainCourses');  // Use a general fetch action like fetchItems
            alert('Item updated successfully');
            this.editingCourse = null;  // Clear the editing item data
        })
        .catch(error => {
            console.error('Error updating item:', error);
            alert('Failed to update item: ' + error.message);
        });
    }
    },
    handleEditImageUpload(event) {
      const file = event.target.files[0];
      this.editingCourse.image = file;
    },
    handleMeatFilterChange() {
      this.localMeatSelect = []; // 當篩選類型改變時，清空已選中的肉類選項
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

.white-text-options .custom-control-label {
    color: white !important;
}

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


.main-course-container {
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
  color: #ffe0e0; 
  font-size: 16px;
}







</style>
