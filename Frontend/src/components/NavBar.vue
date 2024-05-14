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
  background-color: #12111004; /* 更鲜明的蓝色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影以增强深度感 */
  padding: 0.5rem 0; /* 保持原有的填充设置 */
}

.b-navbar-nav {
  align-items: center; /* 确保导航项目垂直居中 */
}

.b-nav-item {
  margin: 0 20px; /* 增加水平间距以提高可读性 */
  padding: 0.5rem 0.75rem; /* 调整按钮填充 */
  font-size: 5rem; /* 适当减小字体大小以适应更多屏幕 */
  font-weight: 500; /* 字体加粗，保持500即可 */
  color: #ffffff; /* 维持白色文字 */
  cursor: pointer; /* 确保指针样式为光标 */
  transition: color 0.3s ease, transform 0.3s ease; /* 平滑的颜色和变换过渡 */
}

.b-nav-item:hover, .b-nav-item:focus {
  color: #FFD700; /* 鼠标悬停时变为金色 */
  transform: translateY(-3px); /* 轻微上移，增加交互感 */
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* 添加文本阴影增强可读性 */
}

.b-container {
  width: 100%; /* 确保容器宽度为100%，这在原样式中已设定 */
}
</style>

