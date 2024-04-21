<template>
    <div>
      <!-- 删除按钮 -->
      <el-button type="danger" @click="deleteUser">Delete</el-button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      // 用户ID，作为属性从父组件传递进来
      userId: {
        type: [String, Number],
        required: true
      }
    },
    methods: {
      deleteUser() {
        // 确认是否要删除
        if (!confirm("Are you sure you want to delete this user?")) {
          return;
        }
  
        // 发送删除请求
        axios.delete(`https://terrier-apt-honestly.ngrok-free.app/api/delete/${this.userId}`)
          .then(response => {
            if (response.status === 200) {
              alert("User deleted successfully");
              this.$emit('deleted'); // 向父组件发出已删除的信号
            } else {
              alert("Failed to delete user");
            }
          })
          .catch(error => {
            console.error("Error deleting user:", error);
            alert("Error during deletion");
          });
      }
    }
  };
  </script>