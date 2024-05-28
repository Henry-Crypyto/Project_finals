<template>
    <div>
      <div class="add-beverage-size">
        <input v-model="newBeverageSize" class="input-field" placeholder="新增飲料容量選項" />
        <button class="add-button" @click="confirmAdd">新增</button>
      </div>
  
      <ul class="beverage-size-list">
        <li v-for="beverageSize in beverageSizes" :key="beverageSize.id" class="beverage-size-item">
          <div v-if="editingBeverageSizeId === beverageSize.id">
            <input v-model="editingBeverageSizeName" class="input-field" />
            <div class="button-group">
              <button class="save-button" @click="confirmSaveEdit(beverageSize.id)">保存</button>
              <button class="cancel-button" @click="cancelEdit">取消</button>
            </div>
          </div>
          <div v-else class="beverage-size-name-group">
            <span>{{ beverageSize.beverage_size }}</span>
            <div class="button-group">
              <button class="edit-button" @click="startEdit(beverageSize.id, beverageSize.beverage_size)">編輯</button>
              <button class="delete-button" @click="confirmDelete(beverageSize.id)">刪除</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { getFullApiUrl } from '../../config.js';
  
  export default {
    props: ['selectedOption'],
    data() {
      return {
        beverageSizes: [],
        newBeverageSize: '',
        editingBeverageSizeId: null,
        editingBeverageSizeName: ''
      };
    },
    watch: {
      selectedOption(newVal) {
        if (newVal === 'beverage_size') {
          this.fetchBeverageSizes();
        }
      }
    },
    created(){
      this.fetchBeverageSizes();
    },
    methods: {
      fetchBeverageSizes() {
        let url = getFullApiUrl('/all_beverage_size');
        axios.get(url)
          .then(response => {
            this.beverageSizes = response.data;
          })
          .catch(error => {
            console.error('Error fetching beverage sizes:', error);
          });
      },
      confirmDelete(beverageSizeId) {
        if (confirm('確定要刪除此選項嗎？')) {
          this.deleteBeverageSize(beverageSizeId);
        }
      },
      confirmAdd() {
        if (this.checkDuplicateBeverageSizeName(this.newBeverageSize)) {
          alert('選項名稱已存在');
          return;
        }
        if (confirm('確定要新增此選項嗎？')) {
          this.addBeverageSize();
        }
      },
      confirmSaveEdit(beverageSizeId) {
        if (this.checkDuplicateBeverageSizeName(this.editingBeverageSizeName, beverageSizeId)) {
          alert('選項名稱已存在');
          return;
        }
        if (confirm('確定要保存對此選項的修改嗎？')) {
          this.saveEdit(beverageSizeId);
        }
      },
      deleteBeverageSize(beverageSizeId) {
        let url = getFullApiUrl(`/delete_beverage_size/${beverageSizeId}`);
        axios.delete(url)
          .then(() => {
            this.beverageSizes = this.beverageSizes.filter(beverageSize => beverageSize.id !== beverageSizeId);
          })
          .catch(error => {
            console.error('Error deleting beverage size:', error);
          });
      },
      addBeverageSize() {
        if (this.newBeverageSize.trim() === '') {
          alert('選項名稱不能為空');
          return;
        }
        let url = getFullApiUrl('/add_beverage_size');
        axios.post(url, { name: this.newBeverageSize })
          .then(() => {
            this.fetchBeverageSizes();
            this.newBeverageSize = '';
          })
          .catch(error => {
            console.error('Error adding beverage size:', error);
          });
      },
      startEdit(beverageSizeId, beverageSizeName) {
        this.editingBeverageSizeId = beverageSizeId;
        this.editingBeverageSizeName = beverageSizeName;
      },
      cancelEdit() {
        this.editingBeverageSizeId = null;
        this.editingBeverageSizeName = '';
      },
      saveEdit(beverageSizeId) {
        if (this.editingBeverageSizeName.trim() === '') {
          alert('選項名稱不能為空');
          return;
        }
        let url = getFullApiUrl(`/update_beverage_size/${beverageSizeId}`);
        axios.put(url, { name: this.editingBeverageSizeName })
          .then(() => {
            this.fetchBeverageSizes();
            this.cancelEdit();
          })
          .catch(error => {
            console.error('Error updating beverage size:', error);
          });
      },
      checkDuplicateBeverageSizeName(beverageSizeName, beverageSizeId = null) {
        return this.beverageSizes.some(beverageSize => beverageSize.beverate_size === beverageSizeName && beverageSize.id !== beverageSizeId);
      }
    }
  };
  </script>
  
  <style scoped>
  .add-beverage-size {
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
  
  .beverage-size-list {
    margin-top: 20px;
    padding: 0;
    list-style: none;
    width: 300px;
  }
  
  .beverage-size-item {
    padding: 10px;
    margin: 5px 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .beverage-size-name-group {
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
  
  .beverage-size-item input {
    width: 150px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  </style>
  