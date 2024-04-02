<template>
  <div id="app">
    <AddUser @userAdded="onUserAdded" />
    <ListAll ref="ListAll" @listClicked="onListClicked" @editUser="onEditUser" />
    <!-- Conditionally render UpdateUser if there's a currentUser -->
    <UpdateUser v-if="currentUser" :user="currentUser" @userUpdated="onUserUpdated" />
  </div>
</template>

<script>
import AddUser from './components/AddUser.vue';
import ListAll from './components/ListAllUser.vue';
import UpdateUser from './components/UpdateUser.vue';

export default {
  components: {
    AddUser,
    ListAll,
    UpdateUser
  },
  data() {
    return {
      shouldFetchAfterAdd: false,
      currentUser: null,
    };
  },
  methods: {
    onUserAdded() {
      if (this.shouldFetchAfterAdd) {
        this.$refs.ListAll.fetchData();
        this.shouldFetchAfterAdd = false;
      }
    },
    onListClicked() {
      this.shouldFetchAfterAdd = true;
    },
    onEditUser(user) {
      this.currentUser = user; // 设置当前要编辑的用户
    },
    onUserUpdated() {
      this.$refs.ListAll.fetchData(); // 更新完成后刷新用户列表
      this.currentUser = null; // 清空当前编辑的用户
    }
  }
};
</script>
