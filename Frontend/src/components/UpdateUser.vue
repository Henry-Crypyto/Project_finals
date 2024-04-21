<template>
  <div>
    <h2>Update User</h2>
    <form @submit.prevent="updateUser">
      <div>
        <label for="userId">ID:</label>
        <input id="userId" v-model="userData.id" type="text" disabled>
      </div>
      <div>
        <label for="name">Name:</label>
        <input id="name" v-model="userData.name" type="text" required>
      </div>
      <div>
        <label for="address">Address:</label>
        <input id="address" v-model="userData.address" type="text" required>
      </div>
      <div>
        <label for="tel">Telephone:</label>
        <input id="tel" v-model="userData.tel" type="tel" required>
      </div>
      <el-button type="primary" native-type="submit">Update User</el-button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    user: Object
  },
  data() {
    return {
      userData: {
        id: '',
        name: '',
        address: '',
        tel: ''
      }
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        this.userData = { ...newValue };
      }
    }
  },
  methods: {
    updateUser() {
      axios.put(`https://terrier-apt-honestly.ngrok-free.app/api/update/${this.userData.id}`, this.userData)
        .then(response => {
          if (response.status === 200) {
            alert('User updated successfully');
            this.$emit('userUpdated'); // Notify parent component
          } else {
            alert('Failed to update user');
          }
        })
        .catch(error => {
          console.error('Error updating user:', error);
          alert('Error updating user');
        });
    }
  }
};
</script>