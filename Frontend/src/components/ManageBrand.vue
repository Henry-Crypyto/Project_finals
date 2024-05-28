<template>
    <div>
      <div class="add-brand">
        <input v-model="newBrand" class="input-field" placeholder="新增品牌名稱" />
        <button class="add-button" @click="confirmAdd">新增</button>
      </div>
  
      <ul class="brand-list">
        <li v-for="brand in brands" :key="brand.brand_id" class="brand-item">
          <div v-if="editingBrandId === brand.brand_id">
            <input v-model="editingBrandName" class="input-field" />
            <div class="button-group">
              <button class="save-button" @click="confirmSaveEdit(brand.brand_id)">保存</button>
              <button class="cancel-button" @click="cancelEdit">取消</button>
            </div>
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
        newBrand: '',
        editingBrandId: null,
        editingBrandName: ''
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
      confirmDelete(brandId) {
        if (confirm('確定要刪除此品牌嗎？')) {
          this.deleteBrand(brandId)
        }
      },
      confirmAdd() {
        if (this.checkDuplicateBrandName(this.newBrand)) {
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
        if (this.newBrand.trim() === '') {
          alert('品牌名稱不能為空')
          return
        }
        let url = getFullApiUrl('/add_brand')
        axios.post(url, { brand_name: this.newBrand })
          .then(() => {
            this.fetchBrands()
            this.newBrand = ''
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
      },
      saveEdit(brandId) {
        if (this.editingBrandName.trim() === '') {
          alert('品牌名稱不能為空')
          return
        }
        let url = getFullApiUrl(`/update_brand/${brandId}`)
        axios.put(url, { brand_name: this.editingBrandName })
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
  