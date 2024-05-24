<template>
  <b-container class="page-container">
    <b-container class="main-course-container">
      <b-row>
        <b-col>
          <h1 class="text-center" style="text-align: center; ">主菜選單</h1>
          <div v-if="userDeveloper === 'addOrDeleteItem'" class="mb-4">
            <b-form @submit.prevent="handleAddCourse">
              <b-form-group label="品牌">
                <b-form-select v-model="newCourse.brand" :options="brandOptions.map(brand => ({ value: brand.brand_name, text: brand.brand_name }))" required></b-form-select>
              </b-form-group>
              <b-form-group label="品項名稱">
                <b-form-input v-model="newCourse.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="newCourse.price" required></b-form-input>
              </b-form-group>
              <b-form-group label="口味">
                <b-form-select v-model="newCourse.flavor" :options="flavorOptions" required></b-form-select>
              </b-form-group>
              <b-form-group label="肉類">
                <b-form-checkbox-group v-model="newCourse.meatTypes" :options="meatSubmitOptions"></b-form-checkbox-group>
              </b-form-group>
              <b-form-group label="上傳圖片">
                <input type="file" @change="handleImageUpload" accept="image/png" ref="fileInput" required>
              </b-form-group>
              <b-button type="submit" variant="success">新增品項</b-button>
            </b-form>
          </div>
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
            <div v-if="editingCourse && editingCourse.id === course.id">
              <b-form-group label="品項名稱">
                <b-form-input v-model="editingCourse.name" required></b-form-input>
              </b-form-group>
              <b-form-group label="單價">
                <b-form-input type="number" v-model="editingCourse.price" required></b-form-input>
              </b-form-group>
              <b-form-group label="上傳圖片">
                <input type="file" @change="handleEditImageUpload" accept="image/png" ref="editFileInput">
              </b-form-group>
              <b-button variant="success" @click="handleSaveEdit">保存編輯</b-button>
            </div>
            <div v-else>
              <b-button v-if="userDeveloper === 'addOrDeleteItem'" variant="danger" class="position-absolute top-0 end-0 mt-2 me-2" @click="handleDeleteCourse(course)">
                X
              </b-button>
              <b-button v-if="userDeveloper === 'updateItem'" variant="warning" class="position-absolute top-0 end-0 mt-5 me-2" @click="handleEditCourse(course)">
                編輯
              </b-button>
              <img :src="getMainCourseImage(course.image)" alt="Main Course Image" class="card-img-top"/>
              <b-card-title class="text-center mb-2">{{ course.name }}</b-card-title>
              <b-card-text><strong>原價:</strong> {{ course.price }}</b-card-text>
              <b-card-text><strong>肉類類型:</strong> {{ course.meat_type || '不詳' }}</b-card-text>
              <b-card-text><strong>口味:</strong> {{ course.flavor_name || '不詳' }}</b-card-text>
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
                  <b-button variant="primary" @click="handleAddLoveToCart(course)" v-if="userDeveloper !== 'updateItem'">喜歡</b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="d-flex justify-content-center mt-2">
                  <b-button variant="danger" @click="handleAddHateToCart(course)" v-if="userDeveloper === 'user'">討厭</b-button>
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
  },
  data() {
    return {
      localBrandSelect: '', // 本地品牌选择
      localMeatSelect: [],  // 本地不吃的肉类选择数组
      newCourse: {
        brand: '',
        name: '',
        price: '',
        flavor: '',
        meatTypes: [], // 新增的肉类选择
        image: null
      },
      editingCourse: null, // 用于编辑的课程对象
      flavorOptions: [
        { value: '辣', text: '辣' },
        { value: '甜', text: '甜' },
        { value: '鹹', text: '鹹' },
        { value: '酸', text: '酸' }
      ],
      meatOptions: [
      { text: '不吃🐄', value: '牛'},
      { text: '不吃🐖', value: '豬'},
      { text: '不吃🐔', value: '雞'},
      { text: '不吃🐟', value: '海鮮'},
      { text: '不吃🐑', value: '羊'}
    ],
      meatSubmitOptions: [
        { text: '牛', value: '牛' },
        { text: '豬', value: '豬' },
        { text: '雞', value: '雞' },
        { text: '海鮮', value: '海鮮' },
        { text: '羊', value: '羊' }
      ],
      currentPage: 1, // 当前页数
      itemsPerPage: 8 // 每页显示的项目数
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
    getMainCourseImage(base64) {
      if (!base64) {
        return require('@/assets/image/default.png'); // 预设图片路径
      }
      return base64; // base64 字符串已经包含 "data:image/png;base64,"
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

      formData.append('meatTypes', meatTypeIds.join(',')); // 将数组转换为逗号分隔的字符串
      formData.append('image', this.newCourse.image);

      axios.post(getFullApiUrl('/add_main_course'), formData)
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
        })
        .catch(error => {
          console.error('Error adding course:', error);
          alert('Failed to add course: ' + error.message);
        });
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newCourse.image = file;
    },
    handleEditCourse(course) {
      this.editingCourse = { ...course };
    },
    handleSaveEdit() {
      const formData = new FormData();
      formData.append('id', this.editingCourse.id);
      formData.append('name', this.editingCourse.name);
      formData.append('price', this.editingCourse.price);

      if (this.editingCourse.image) {
        formData.append('image', this.editingCourse.image);
      }

      axios.put(getFullApiUrl('/update_main_course'), formData)
        .then(() => {
          this.$store.dispatch('fetchMainCourses');
          alert('Course updated successfully');
          this.editingCourse = null;
        })
        .catch(error => {
          console.error('Error updating course:', error);
          alert('Failed to update course: ' + error.message);
        });
    },
    handleEditImageUpload(event) {
      const file = event.target.files[0];
      this.editingCourse.image = file;
    }
  }
}
</script>








<style scoped>
.page-container {
  border: 3px solid black;
  background-image: linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%); background-blend-mode: multiply,multiply; background-blend-mode: multiply,multiply;  

  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 67px;
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
