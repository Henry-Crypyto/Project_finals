<template>
  <b-navbar toggleable="lg" type="light" class="custom-navbar">
    <b-container>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto">
          <b-nav-item @click="emitChange('coupon')">折價券</b-nav-item>
          <b-nav-item @click="emitChange('mainCourse')">主食</b-nav-item>
          <b-nav-item @click="emitChange('beverage')">飲料</b-nav-item>
          <b-nav-item @click="emitChange('snack')">點心</b-nav-item>
          <b-nav-item @click="emitChange('shoppingCart')">購物車</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      activeSection: null // 将默认激活项设置为 null
    };
  },
  methods: {
    emitChange(section) {
      this.activeSection = section; // 更新当前激活项
      this.$emit('change-section', section);
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  background-color: #0b79ef; /* 指定导航栏的背景颜色 */
  padding: 0.5rem 0; /* 减少上下填充 */
}

.b-navbar-nav {
  align-items: center; /* 垂直居中导航项目 */
}

.b-nav-item {
  margin: 0 15px; /* 增加水平间隔 */
  padding: 0.5rem 0.75rem; /* 调整按钮填充 */
  font-size: 2rem; /* 字体大小 */
  font-weight: 500; /* 字体加粗 */
  color: #ffffff; /* 文字颜色为白色 */
  cursor: pointer;
}

.b-nav-item:hover, .b-nav-item:focus {
  color: #95abf2; /* 鼠标悬停时变为浅蓝色 */
  transform: scale(1.1); /* 鼠标悬停时放大字体 */
}

.b-container {
  width: 100%; /* 容器宽度为100% */
}
</style>
