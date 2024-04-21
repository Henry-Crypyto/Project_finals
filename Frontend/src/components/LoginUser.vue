<template>
  <div class="login-container">
    <h1>Login</h1>
    <div class="form-group">
      <input v-model="username" placeholder="Username" />
    </div>
    <div class="form-group">
      <input v-model="password" type="password" placeholder="Password" />
    </div>
    <button @click="login">Login</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://terrier-apt-honestly.ngrok-free.app/api/login', {
          username: this.username,
          password: this.password
        });
        // 使用 response 中的數據
        if (response.data && response.status === 200) {
          // 假設登入成功的消息在 response.data.message 中
          alert(response.data);
          // 可以進一步導航到其他路由或保存登入狀態/令牌
        } else {
          this.error = 'Invalid login credentials';
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = 'Failed to login due to server error';
        }
      }
    }
  }
}
</script>

<style>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #5c6bc0;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #3f51b5;
}

.error {
  color: #d32f2f;
  margin-top: 15px;
}
</style>