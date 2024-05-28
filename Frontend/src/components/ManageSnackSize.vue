<template>
    <div>
      <div class="add-snack-size">
        <input v-model="newSnackSize" class="input-field" placeholder="新增點心大小選項" />
        <button class="add-button" @click="confirmAdd">新增</button>
      </div>
  
      <ul class="snack-size-list">
        <li v-for="snackSize in snackSizes" :key="snackSize.size_id" class="snack-size-item">
          <div v-if="editingSnackSizeId === snackSize.size_id">
            <input v-model="editingSnackSizeName" class="input-field" />
            <div class="button-group">
              <button class="save-button" @click="confirmSaveEdit(snackSize.size_id)">保存</button>
              <button class="cancel-button" @click="cancelEdit">取消</button>
            </div>
          </div>
          <div v-else class="snack-size-name-group">
            <span>{{ snackSize.size_type }}</span>
            <div class="button-group">
              <button class="edit-button" @click="startEdit(snackSize.size_id, snackSize.size_type)">編輯</button>
              <button class="delete-button" @click="confirmDelete(snackSize.size_id)">刪除</button>
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
        snackSizes: [],
        newSnackSize: '',
        editingSnackSizeId: null,
        editingSnackSizeName: ''
      };
    },
    watch: {
      selectedOption(newVal) {
        if (newVal === 'snack_size') {
          this.fetchSnackSizes();
        }
      }
    },
    created(){
      this.fetchSnackSizes();
    },
    methods: {
      fetchSnackSizes() {
        let url = getFullApiUrl('/all_snack_size');
        axios.get(url)
          .then(response => {
            this.snackSizes = response.data;
          })
          .catch(error => {
            console.error('Error fetching snack sizes:', error);
          });
      },
      confirmDelete(snackSizeId) {
        if (confirm('確定要刪除此選項嗎？')) {
          this.deleteSnackSize(snackSizeId);
        }
      },
      confirmAdd() {
        if (this.checkDuplicateSnackSizeName(this.newSnackSize)) {
          alert('選項名稱已存在');
          return;
        }
        if (confirm('確定要新增此選項嗎？')) {
          this.addSnackSize();
        }
      },
      confirmSaveEdit(snackSizeId) {
        if (this.checkDuplicateSnackSizeName(this.editingSnackSizeName, snackSizeId)) {
          alert('選項名稱已存在');
          return;
        }
        if (confirm('確定要保存對此選項的修改嗎？')) {
          this.saveEdit(snackSizeId);
        }
      },
      deleteSnackSize(snackSizeId) {
        let url = getFullApiUrl(`/delete_snack_size/${snackSizeId}`);
        axios.delete(url)
          .then(() => {
            this.snackSizes = this.snackSizes.filter(snackSize => snackSize.id !== snackSizeId);
            this.fetchSnackSizes();

          })
          .catch(error => {
            console.error('Error deleting snack size:', error);
          });
      },
      addSnackSize() {
        if (this.newSnackSize.trim() === '') {
          alert('選項名稱不能為空');
          return;
        }
        let url = getFullApiUrl('/add_snack_size');
        axios.post(url, { name: this.newSnackSize })
          .then(() => {
            this.fetchSnackSizes();
            this.newSnackSize = '';
          })
          .catch(error => {
            console.error('Error adding snack size:', error);
          });
      },
      startEdit(snackSizeId, snackSizeName) {
        this.editingSnackSizeId = snackSizeId;
        this.editingSnackSizeName = snackSizeName;
      },
      cancelEdit() {
        this.editingSnackSizeId = null;
        this.editingSnackSizeName = '';
      },
      saveEdit(snackSizeId) {
        if (this.editingSnackSizeName.trim() === '') {
          alert('選項名稱不能為空');
          return;
        }
        let url = getFullApiUrl(`/update_snack_size/${snackSizeId}`);
        axios.put(url, { name: this.editingSnackSizeName })
          .then(() => {
            this.fetchSnackSizes();
            this.cancelEdit();
          })
          .catch(error => {
            console.error('Error updating snack size:', error);
          });
      },
      checkDuplicateSnackSizeName(snackSizeName, snackSizeId = null) {
        return this.snackSizes.some(snackSize => snackSize.size_type === snackSizeName && snackSize.id !== snackSizeId);
      }
    }
  };
  </script>
  
  <style scoped>
  .add-snack-size {
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
  
  .snack-size-list {
    margin-top: 20px;
    padding: 0;
    list-style: none;
    width: 300px;
  }
  
  .snack-size-item {
    padding: 10px;
    margin: 5px 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .snack-size-name-group {
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
  
  .snack-size-item input {
    width: 150px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  </style>
  