<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Telephone</th>
          <th>Actions</th> <!-- 新增列用于 "编辑" 按钮 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.tel }}</td>
          <td>
            <!-- "编辑" 按钮，点击时发射 editUser 事件并传递当前用户信息 -->
            <el-button type="primary" size="small" @click="editUser(user)">Edit</el-button>
          </td>
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
    listClicked() {
      this.$emit('listClicked');
      this.fetchData();
    },
    editUser(user) {
      // 发射 editUser 事件，携带要编辑的用户信息
      this.$emit('editUser', user);
    }
  },
};
</script>
