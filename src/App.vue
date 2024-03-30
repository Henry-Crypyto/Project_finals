<template>
  <div>
    <button @click="get()">获取user表数据</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {};
  },

  methods: {
    get() {
      axios
        .get("http://127.0.0.1/user")
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log("获取数据失败" + err);
        });
    },
  },
};
</script>

<!-- <template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
