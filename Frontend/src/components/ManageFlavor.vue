<template>
    <div>
      <div class="add-flavor">
        <input v-model="newFlavor" class="input-field" placeholder="新增口味名稱" />
        <button class="add-button" @click="confirmAdd">新增</button>
      </div>
  
      <ul class="flavor-list">
        <li v-for="flavor in flavors" :key="flavor.flavor_id" class="flavor-item">
          <div v-if="editingFlavorId === flavor.flavor_id">
            <input v-model="editingFlavorName" class="input-field" />
            <div class="button-group">
              <button class="save-button" @click="confirmSaveEdit(flavor.flavor_id)">保存</button>
              <button class="cancel-button" @click="cancelEdit">取消</button>
            </div>
          </div>
          <div v-else class="flavor-name-group">
            <span>{{ flavor.flavor_name }}</span>
            <div class="button-group">
              <button class="edit-button" @click="startEdit(flavor.flavor_id, flavor.flavor_name)">編輯</button>
              <button class="delete-button" @click="confirmDelete(flavor.flavor_id)">刪除</button>
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
        flavors: [],
        newFlavor: '',
        editingFlavorId: null,
        editingFlavorName: ''
      };
    },
    watch: {
      selectedOption(newVal) {
        if (newVal === 'main_course_flavor' || newVal === 'snack_flavor') {
          this.fetchFlavors();
        }
      }
    },
    created(){
      this.fetchFlavors();
    },
    methods: {
      fetchFlavors() {
        let url = getFullApiUrl('/all_flavor');
        axios.get(url)
          .then(response => {
            this.flavors = response.data;
          })
          .catch(error => {
            console.error('Error fetching flavors:', error);
          });
      },
      confirmDelete(flavorId) {
        if (confirm('確定要刪除此口味嗎？')) {
          this.deleteFlavor(flavorId);
        }
      },
      confirmAdd() {
        if (this.checkDuplicateFlavorName(this.newFlavor)) {
          alert('口味名稱已存在');
          return;
        }
        if (confirm('確定要新增此口味嗎？')) {
          this.addFlavor();
        }
      },
      confirmSaveEdit(flavorId) {
        if (this.checkDuplicateFlavorName(this.editingFlavorName, flavorId)) {
          alert('口味名稱已存在');
          return;
        }
        if (confirm('確定要保存對此口味的修改嗎？')) {
          this.saveEdit(flavorId);
        }
      },
      deleteFlavor(flavorId) {
        let url = getFullApiUrl(`/delete_flavor/${flavorId}`);
        axios.delete(url)
          .then(() => {
            this.flavors = this.flavors.filter(flavor => flavor.flavor_id !== flavorId);
          })
          .catch(error => {
            console.error('Error deleting flavor:', error);
          });
      },
      addFlavor() {
        if (this.newFlavor.trim() === '') {
          alert('口味名稱不能為空');
          return;
        }
        let url = getFullApiUrl('/add_flavor');
        axios.post(url, { flavor_name: this.newFlavor })
          .then(() => {
            this.fetchFlavors();
            this.newFlavor = '';
          })
          .catch(error => {
            console.error('Error adding flavor:', error);
          });
      },
      startEdit(flavorId, flavorName) {
        this.editingFlavorId = flavorId;
        this.editingFlavorName = flavorName;
      },
      cancelEdit() {
        this.editingFlavorId = null;
        this.editingFlavorName = '';
      },
      saveEdit(flavorId) {
        if (this.editingFlavorName.trim() === '') {
          alert('口味名稱不能為空');
          return;
        }
        let url = getFullApiUrl(`/update_flavor/${flavorId}`);
        axios.put(url, { flavor_name: this.editingFlavorName })
          .then(() => {
            this.fetchFlavors();
            this.cancelEdit();
          })
          .catch(error => {
            console.error('Error updating flavor:', error);
          });
      },
      checkDuplicateFlavorName(flavorName, flavorId = null) {
        return this.flavors.some(flavor => flavor.flavor_name === flavorName && flavor.flavor_id !== flavorId);
      }
    }
  };
  </script>
  
  <style scoped>
  .add-flavor {
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
  
  .flavor-list {
    margin-top: 20px;
    padding: 0;
    list-style: none;
    width: 300px;
  }
  
  .flavor-item {
    padding: 10px;
    margin: 5px 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .flavor-name-group {
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
  
  .flavor-item input {
    width: 150px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  </style>
  