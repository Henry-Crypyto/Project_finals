<template>
    <div class="container">
      <h1>Hello, World!</h1>
      <select class="dropdown" v-model="selectedOption" @change="handleSelectChange">
        <option value="all">請選擇</option>
        <option value="brand">品牌</option>
        <option value="main_course_flavor">主食口味</option>
        <option value="main_course_meat">主食肉類</option>
        <option value="beverage_temp">飲料冷熱</option>
        <option value="beverage_size">飲料容量</option>
        <option value="snack_flavor">點心口味</option>
        <option value="snack_size">點心大小</option>

      </select>
      <ManageBrand v-if="selectedOption === 'brand'" :selectedOption="selectedOption" />
      <ManageFlavor v-if="selectedOption === 'main_course_flavor' || selectedOption === 'snack_flavor'" :selectedOption="selectedOption" />
      <ManageMeatType v-if="selectedOption === 'main_course_meat'" :selectedOption="selectedOption" />
      <ManageIcedHot v-if="selectedOption === 'beverage_temp'" :selectedOption="selectedOption" />
      <ManageBeverageSize v-if="selectedOption === 'beverage_size'" :selectedOption="selectedOption" />
      <ManageSnackSize v-if="selectedOption === 'snack_size'" :selectedOption="selectedOption" />

    </div>
  </template>
  
  <script>
  import ManageBrand from './ManageBrand.vue';
  import ManageFlavor from './ManageFlavor.vue';
  import ManageMeatType from './ManageMeatType.vue';
  import ManageIcedHot from './ManageIcedHot.vue';
  import ManageBeverageSize from './ManageBeverageSize.vue';
  import ManageSnackSize from './ManageSnackSize.vue';


  
  
  export default {
    components: {
      ManageBrand,
      ManageFlavor,
      ManageMeatType,
      ManageIcedHot,
      ManageBeverageSize,
      ManageSnackSize
    },
    data() {
      return {
        selectedOption: ''
      };
    },
    methods: {
      handleSelectChange() {
        // 可根據選擇的選項執行其他操作
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  .dropdown {
    margin-top: 20px;
    padding: 10px;
    font-size: 16px;
  }
  </style>
  