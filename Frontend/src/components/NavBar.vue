<template>
    <nav class="navbar navbar-expand-lg navbar-light custom-navbar">
      <div class="container">
        <div class="navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" @click="emitChange('coupon')">折價券</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="emitChange('mainCourse')">主食</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="emitChange('beverage')">飲料</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="emitChange('snack')">點心</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="emitChange('shoppingCart')">購物車車</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    methods: {
    emitChange(section) {
    this.$emit('change-section', section);
  }
}
  }
  </script>
  
  <style scoped>
  .custom-navbar {
    background-color: #004085; /* 更亮的藍色背景 */
    padding: 0.5rem 0; /* 減少上下填充 */
  }
  
  .navbar-nav {
    align-items: center; /* 垂直居中導航項目 */
  }
  
  .nav-link {
    margin: 0 15px; /* 增加水平間隔 */
    padding: 0.5rem 0.75rem; /* 調整按鈕填充 */
    font-size: 1.5rem; /* 字體大小 */
    font-weight: 500; /* 字體加粗 */
    color: #ffffff; /* 文字顏色為白色 */
    transition: color 0.3s, transform 0.3s; /* 平滑過渡效果 */
    cursor: pointer;
  }
  
  .nav-link:hover, .nav-link:focus {
    color: #95abf2; /* 滑鼠懸停時變為淺藍色 */
    transform: scale(1.05); /* 文字放大5% */
  }
  
  .container {
    width: 100%; /* 容器寬度為100% */
  }
  </style>
  