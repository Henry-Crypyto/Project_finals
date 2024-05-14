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
  methods: {
    emitChange(section) {
      this.$emit('change-section', section);
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  background-color: rgba(18, 17, 16, 0.04); /* corrected color format with transparency */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.b-navbar-nav {
  align-items: center;
}

.b-nav-item {
  margin: 0 20px;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem; /* more practical font size */
  font-weight: 500;
  color: #d70909;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
}

.b-nav-item:hover, .b-nav-item:focus {
  color: #FFD700; /* golden color on hover/focus */
  transform: translateY(-3px); /* subtle raise effect */
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
</style>
