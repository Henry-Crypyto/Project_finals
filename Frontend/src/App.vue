<template>
  <div id="app">
    <!-- <ListAllUser/> -->
    <Login/>
  </div>
</template>

<script>

// import ListAllUser from './components/ListAllUser.vue';
import Login from './components/LoginUser.vue' // 假設你的 Login.vue 位於 components 文件夾中
// import ShowNearByCoupons from './components/ShowNearByCoupon.vue' 
export default {
  name: 'App',
  components: {
    Login,
    // ShowNearByCoupons,
    // ListAllUser
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>