<template>
    <div>
      <div class="add-meat-type">
        <input v-model="newMeatType" class="input-field" placeholder="新增肉類名稱" />
        <button class="add-button" @click="confirmAdd">新增</button>
      </div>
  
      <ul class="meat-type-list">
        <li v-for="meatType in meatTypes" :key="meatType.meat_type_id" class="meat-type-item">
          <div v-if="editingMeatTypeId === meatType.meat_type_id">
            <input v-model="editingMeatTypeName" class="input-field" />
            <div class="button-group">
              <button class="save-button" @click="confirmSaveEdit(meatType.meat_type_id)">保存</button>
              <button class="cancel-button" @click="cancelEdit">取消</button>
            </div>
          </div>
          <div v-else class="meat-type-name-group">
            <span>{{ meatType.meat_type_name }}</span>
            <div class="button-group">
              <button class="edit-button" @click="startEdit(meatType.meat_type_id, meatType.meat_type_name)">編輯</button>
              <button class="delete-button" @click="confirmDelete(meatType.meat_type_id)">刪除</button>
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
        meatTypes: [],
        newMeatType: '',
        editingMeatTypeId: null,
        editingMeatTypeName: ''
      };
    },
    created(){
      this.fetchMeatTypes();
    },
    watch: {
      selectedOption(newVal) {
        if (newVal === 'main_course_meat') {
          this.fetchMeatTypes();
        }
      }
    },
    methods: {
      fetchMeatTypes() {
        let url = getFullApiUrl('/all_meat_type');
        axios.get(url)
          .then(response => {
            this.meatTypes = response.data;
          })
          .catch(error => {
            console.error('Error fetching meat types:', error);
          });
      },
      confirmDelete(meatTypeId) {
        if (confirm('確定要刪除此肉類嗎？')) {
          this.deleteMeatType(meatTypeId);
        }
      },
      confirmAdd() {
        if (this.checkDuplicateMeatTypeName(this.newMeatType)) {
          alert('肉類名稱已存在');
          return;
        }
        if (confirm('確定要新增此肉類嗎？')) {
          this.addMeatType();
        }
      },
      confirmSaveEdit(meatTypeId) {
        if (this.checkDuplicateMeatTypeName(this.editingMeatTypeName, meatTypeId)) {
          alert('肉類名稱已存在');
          return;
        }
        if (confirm('確定要保存對此肉類的修改嗎？')) {
          this.saveEdit(meatTypeId);
        }
      },
      deleteMeatType(meatTypeId) {
        let url = getFullApiUrl(`/delete_meat_type/${meatTypeId}`);
        axios.delete(url)
          .then(() => {
            this.meatTypes = this.meatTypes.filter(meatType => meatType.meat_type_id !== meatTypeId);
          })
          .catch(error => {
            console.error('Error deleting meat type:', error);
          });
      },
      addMeatType() {
        if (this.newMeatType.trim() === '') {
          alert('肉類名稱不能為空');
          return;
        }
        let url = getFullApiUrl('/add_meat_type');
        axios.post(url, { meat_type_name: this.newMeatType })
          .then(() => {
            this.fetchMeatTypes();
            this.newMeatType = '';
          })
          .catch(error => {
            console.error('Error adding meat type:', error);
          });
      },
      startEdit(meatTypeId, meatTypeName) {
        this.editingMeatTypeId = meatTypeId;
        this.editingMeatTypeName = meatTypeName;
      },
      cancelEdit() {
        this.editingMeatTypeId = null;
        this.editingMeatTypeName = '';
      },
      saveEdit(meatTypeId) {
        if (this.editingMeatTypeName.trim() === '') {
          alert('肉類名稱不能為空');
          return;
        }
        let url = getFullApiUrl(`/update_meat_type/${meatTypeId}`);
        axios.put(url, { meat_type_name: this.editingMeatTypeName })
          .then(() => {
            this.fetchMeatTypes();
            this.cancelEdit();
          })
          .catch(error => {
            console.error('Error updating meat type:', error);
          });
      },
      checkDuplicateMeatTypeName(meatTypeName, meatTypeId = null) {
        return this.meatTypes.some(meatType => meatType.meat_type_name === meatTypeName && meatType.meat_type_id !== meatTypeId);
      }
    }
  };
  </script>
  
  <style scoped>
  .add-meat-type {
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
  
  .meat-type-list {
    margin-top: 20px;
    padding: 0;
    list-style: none;
    width: 300px;
  }
  
  .meat-type-item {
    padding: 10px;
    margin: 5px 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .meat-type-name-group {
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
  
  .meat-type-item input {
    width: 150px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  </style>
  