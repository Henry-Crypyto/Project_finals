<template>
    <div>
      <form @submit.prevent="addUser">
        <div>
          <label for="name">Name:</label>
          <input id="name" v-model="newUser.name" type="text" required>
        </div>
        <div>
          <label for="address">Address:</label>
          <input id="address" v-model="newUser.address" type="text" required>
        </div>
        <div>
          <label for="tel">Telephone:</label>
          <input id="tel" v-model="newUser.tel" type="tel" required>
        </div>
        <el-button type="success" native-type="submit">新增用户</el-button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        newUser: {
          name: '',
          address: '',
          tel: ''
        }
      };
    },
    // props: {
    // shouldFetchAfterAdd: Boolean
    // },
    methods: {
      addUser() {
        axios.post('http://localhost:3000/add', this.newUser)
          .then(response => {
            if (response.status === 201) {
              this.$emit('userAdded'); // 通知父组件用户已添加
              this.newUser = { name: '', address: '', tel: '' }; // 重置 newUser 对象
              alert('用户添加成功');
            } else {
              alert('添加用户失败');
            }
          })
          .catch(error => {
            console.error('添加用户失败:', error);
          });
      }
    },
  };
  </script>