<template>
  <div>
    <div class="add-brand">
      <form @submit.prevent="confirmAdd">
        <input v-model="newBrand.name" class="input-field" placeholder="新增品牌名稱" />
        <input type="file" @change="handleFileUpload($event, 'new')" accept="image/png" required/>
        <button type="submit" class="add-button">新增</button>
      </form>
    </div>

    <ul class="brand-list">
      <li v-for="brand in brands" :key="brand.brand_id" class="brand-item">
        <div v-if="editingBrandId === brand.brand_id">
          <form @submit.prevent="confirmSaveEdit(brand.brand_id)">
            <input v-model="editingBrandName" class="input-field" />
            <input type="file" @change="handleFileUpload($event, 'edit')" accept="image/png"  />
            <div class="button-group">
              <button type="submit" class="save-button">保存</button>
              <button type="button" class="cancel-button" @click="cancelEdit">取消</button>
            </div>
          </form>
        </div>
        <div v-else class="brand-name-group">
          <span>{{ brand.brand_name }}</span>
          <div class="button-group">
            <button class="edit-button" @click="startEdit(brand.brand_id, brand.brand_name)">編輯</button>
            <button class="delete-button" @click="confirmDelete(brand.brand_id)">刪除</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { getFullApiUrl } from '../../config.js'

export default {
  props: ['selectedOption'],
  data() {
    return {
      brands: [],
      newBrand: {
        id:null,
        name:''
      },
      editingBrandId: null,
      editingBrandName: '',
      newBrandImage: null,
      editingBrandImage: null,
    }
  },
  watch: {
    selectedOption(newVal) {
      if (newVal === 'brand') {
        this.fetchBrands()
      }
    }
  },
  created(){
    this.fetchBrands();
  },
  methods: {
    fetchBrands() {
      let url = getFullApiUrl('/all_brand')
      axios.get(url)
        .then(response => {
          this.brands = response.data
        })
        .catch(error => {
          console.error('Error fetching brands:', error)
        })
    },
    fetchNextbrandId() {
        const url = getFullApiUrl('/next_brand_id');
        axios.get(url)
          .then(response => {
            // 假设响应是一个数组，并且我们需要第一个元素的 next_coupon_id
            const nextbrandId = response.data[0].next_brand_id; 
            this.newBrand.id=nextbrandId;
          })
          .catch(error => {
            console.error('Error fetching next coupon ID:', error);
          });
    },
    confirmDelete(brandId) {
      if (confirm('確定要刪除此品牌嗎？')) {
        this.deleteBrand(brandId)
      }
    },
    confirmAdd() {
      if (this.checkDuplicateBrandName(this.newBrand.name)) {
        alert('品牌名稱已存在')
        return
      }
      if (confirm('確定要新增此品牌嗎？')) {
        this.addBrand()
      }
    },
    confirmSaveEdit(brandId) {
      if (this.checkDuplicateBrandName(this.editingBrandName, brandId)) {
        alert('品牌名稱已存在')
        return
      }
      if (confirm('確定要保存對此品牌的修改嗎？')) {
        this.saveEdit(brandId)
      }
    },
    deleteBrand(brandId) {
      let url = getFullApiUrl(`/delete_brand/${brandId}`)
      axios.delete(url)
        .then(() => {
          this.brands = this.brands.filter(brand => brand.brand_id !== brandId)
        })
        .catch(error => {
          console.error('Error deleting brand:', error)
        })
    },
    addBrand() {
      if (this.newBrand.name.trim() === '') {
        alert('品牌名稱不能為空')
        return
      }

      let formData = new FormData()
      formData.append('id', this.newBrand.id)
      formData.append('brand_name', this.newBrand.name)
      if (this.newBrandImage) {
        formData.append('image', this.newBrandImage)
      }

      let url = getFullApiUrl('/add_brand')
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          this.fetchBrands()
          this.newBrand.name = ''
          this.newBrandImage = null
        })
        .catch(error => {
          console.error('Error adding brand:', error)
        })
    },
    startEdit(brandId, brandName) {
      this.editingBrandId = brandId
      this.editingBrandName = brandName
    },
    cancelEdit() {
      this.editingBrandId = null
      this.editingBrandName = ''
      this.editingBrandImage = null
    },
    saveEdit(brandId) {
      if (this.editingBrandName.trim() === '') {
        alert('品牌名稱不能為空')
        return
      }

      let formData = new FormData()
      formData.append('brand_name', this.editingBrandName)
      if (this.editingBrandImage) {
        formData.append('image', this.editingBrandImage)
      }

      let url = getFullApiUrl(`/update_brand/${brandId}`)
      axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          this.fetchBrands()
          this.cancelEdit()
        })
        .catch(error => {
          console.error('Error updating brand:', error)
        })
    },
    checkDuplicateBrandName(brandName, brandId = null) {
      return this.brands.some(brand => brand.brand_name === brandName && brand.brand_id !== brandId)
    },
    handleFileUpload(event, type) {
      const file = event.target.files[0]
      if (type === 'new') {
        this.newBrandImage = file
      } else if (type === 'edit') {
        this.editingBrandImage = file
      }
    }
  }
}
</script>

<style scoped>
.add-brand {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  width: 200px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.brand-list {
  margin-top: 20px;
  padding: 0;
  list-style: none;
  width: 300px;
}

.brand-item {
  padding: 10px;
  margin: 5px 0;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-name-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.button-group {
  display: flex;
  gap: 5px;
}

.add-button,
.save-button,
.cancel-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
}

.add-button:hover,
.save-button:hover,
.cancel-button:hover {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c;
}

.delete-button:hover {
  background-color: #c0392b;
}

.edit-button {
  background-color: #f39c12;
}

.edit-button:hover {
  background-color: #e67e22;
}

.brand-item input {
  width: 150px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
