<template>
    <div>
      <div class="add-iced-hot">
        <input v-model="newIcedHot" class="input-field" placeholder="新增飲料冷熱選項" />
        <button class="add-button" @click="confirmAdd">新增</button>
      </div>
  
      <ul class="iced-hot-list">
        <li v-for="icedHot in icedHotOptions" :key="icedHot.iced_hot_id" class="iced-hot-item">
          <div v-if="editingIcedHotId === icedHot.iced_hot_id">
            <input v-model="editingIcedHotName" class="input-field" />
            <div class="button-group">
              <button class="save-button" @click="confirmSaveEdit(icedHot.iced_hot_id)">保存</button>
              <button class="cancel-button" @click="cancelEdit">取消</button>
            </div>
          </div>
          <div v-else class="iced-hot-name-group">
            <span>{{ icedHot.iced_hot_name }}</span>
            <div class="button-group">
              <button class="edit-button" @click="startEdit(icedHot.iced_hot_id, icedHot.iced_hot_name)">編輯</button>
              <button class="delete-button" @click="confirmDelete(icedHot.iced_hot_id)">刪除</button>
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
        icedHotOptions: [],
        newIcedHot: '',
        editingIcedHotId: null,
        editingIcedHotName: ''
      };
    },
    watch: {
      selectedOption(newVal) {
        if (newVal === 'beverage_temp') {
          this.fetchIcedHotOptions();
        }
      }
    },
    created(){
      this.fetchIcedHotOptions();
    },
    methods: {
      fetchIcedHotOptions() {
        let url = getFullApiUrl('/all_iced_hot');
        axios.get(url)
          .then(response => {
            this.icedHotOptions = response.data;
          })
          .catch(error => {
            console.error('Error fetching iced/hot options:', error);
          });
      },
      confirmDelete(icedHotId) {
        if (confirm('確定要刪除此選項嗎？')) {
          this.deleteIcedHot(icedHotId);
        }
      },
      confirmAdd() {
        if (this.checkDuplicateIcedHotName(this.newIcedHot)) {
          alert('選項名稱已存在');
          return;
        }
        if (confirm('確定要新增此選項嗎？')) {
          this.addIcedHot();
        }
      },
      confirmSaveEdit(icedHotId) {
        if (this.checkDuplicateIcedHotName(this.editingIcedHotName, icedHotId)) {
          alert('選項名稱已存在');
          return;
        }
        if (confirm('確定要保存對此選項的修改嗎？')) {
          this.saveEdit(icedHotId);
        }
      },
      deleteIcedHot(icedHotId) {
        let url = getFullApiUrl(`/delete_iced_hot/${icedHotId}`);
        axios.delete(url)
          .then(() => {
            this.icedHotOptions = this.icedHotOptions.filter(icedHot => icedHot.id !== icedHotId);
            this.fetchIcedHotOptions();
          })
          .catch(error => {
            console.error('Error deleting iced/hot option:', error);
          });
      },
      addIcedHot() {
        if (this.newIcedHot.trim() === '') {
          alert('選項名稱不能為空');
          return;
        }
        let url = getFullApiUrl('/add_iced_hot');
        axios.post(url, { name: this.newIcedHot })
          .then(() => {
            this.fetchIcedHotOptions();
            this.newIcedHot = '';
          })
          .catch(error => {
            console.error('Error adding iced/hot option:', error);
          });
      },
      startEdit(icedHotId, icedHotName) {
        this.editingIcedHotId = icedHotId;
        this.editingIcedHotName = icedHotName;
      },
      cancelEdit() {
        this.editingIcedHotId = null;
        this.editingIcedHotName = '';
      },
      saveEdit(icedHotId) {
        if (this.editingIcedHotName.trim() === '') {
          alert('選項名稱不能為空');
          return;
        }
        let url = getFullApiUrl(`/update_iced_hot/${icedHotId}`);
        axios.put(url, { name: this.editingIcedHotName })
          .then(() => {
            this.fetchIcedHotOptions();
            this.cancelEdit();
          })
          .catch(error => {
            console.error('Error updating iced/hot option:', error);
          });
      },
      checkDuplicateIcedHotName(icedHotName, icedHotId = null) {
        return this.icedHotOptions.some(icedHot => icedHot.name === icedHotName && icedHot.id !== icedHotId);
      }
    }
  };
  </script>
  
  <style scoped>
  .add-iced-hot {
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
  
  .iced-hot-list {
    margin-top: 20px;
    padding: 0;
    list-style: none;
    width: 300px;
  }
  
  .iced-hot-item {
    padding: 10px;
    margin: 5px 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .iced-hot-name-group {
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
  
  .iced-hot-item input {
    width: 150px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  </style>
  