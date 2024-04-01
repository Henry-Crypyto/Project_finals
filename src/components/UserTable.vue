<!-- UserTable.vue -->
<template>
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Telephone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.tel }}</td>
          </tr>
        </tbody>
      </table>
      <el-button type="primary" @click="fetchData">获取用户数据</el-button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [], // 初始化用户数据数组
      };
    },
    methods: {
      fetchData() {
        axios.get('http://127.0.0.1/list/all') 
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
      }
    },
    // 如果你希望在组件加载时就获取数据，可以在这里调用 fetchData
  };
  </script>
  