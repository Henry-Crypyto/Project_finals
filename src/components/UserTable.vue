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
  
      <el-button type="primary" @click="listClicked">LIST ALL</el-button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        newUser: {
          name: '',
          address: '',
          tel: ''
        },
        listWasClicked: false, // 新增的标志变量
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
      },
      addUser() {
        axios.post('http://127.0.0.1/list/add', this.newUser)
          .then(response => {
            if (response.data.status === 200) {
              if (this.listWasClicked) {
                this.fetchData(); // 如果 LIST 被点击，添加用户后重新获取数据
              }
              this.newUser = { name: '', address: '', tel: '' }; // 重置 newUser 对象
              alert('用户添加成功');
            } else {
              alert('添加用户失败');
            }
          })
          .catch(error => {
            console.error('添加用户失败:', error);
          });
      },
      listClicked() {
        this.listWasClicked = true; // 当 LIST 被点击，设置标志为 true
        this.fetchData(); // 获取数据
      }
    },
  };
  </script>
  