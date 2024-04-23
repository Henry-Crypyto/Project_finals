<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <!-- 品牌选择菜单 -->
      <div class="col-md-3 mb-3">
        <div class="form-group">
          <label for="brand-select" class="form-label">品牌:</label>
          <select id="brand-select" class="form-control" v-model="selectedBrand" @change="fetchCoupons">
            <option disabled value="">请选择一个品牌</option>
            <option v-for="brand in brandOptions" :key="brand.brand_ID" :value="brand.brand_name">
              {{ brand.brand_name }}
            </option>
          </select>
        </div>
      </div>
      <!-- 价格筛选菜单 -->
      <div class="col-md-3 mb-3">
        <div class="form-group">
          <label for="price-select" class="form-label">价格:</label>
          <select id="price-select" class="form-control" v-model="selectedPrice" @change="fetchCoupons">
            <option value="">所有价格</option>
            <option value="0-300">0~300元</option>
            <option value="301-600">301~600元</option>
            <option value="601-900">601~900元</option>
            <option value="901-1200">901~1200元</option>
            <option value="1201">1200元以上</option>
          </select>
        </div>
      </div>
      <!-- 日期范围选择 -->
      <div class="col-md-3 mb-3">
        <div class="form-group">
          <label for="startDate" class="form-label">开始日期:</label>
          <input type="date" id="startDate" class="form-control" v-model="startDate" @change="fetchCoupons">
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="form-group">
          <label for="endDate" class="form-label">结束日期:</label>
          <input type="date" id="endDate" class="form-control" v-model="endDate" :min="minEndDate" @change="fetchCoupons">
        </div>
      </div>
    </div>
    <!-- 显示选定品牌、价格和日期范围的折扣券信息 -->
    <div class="row">
      <div class="col-12" v-if="selectedCoupons.length > 0">
        <h3 class="mb-3">折扣券信息</h3>
        <div v-for="coupon in selectedCoupons" :key="coupon.coupon_ID" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ coupon.coupon_name }}</h5>
            <p class="card-text">{{ coupon.coupon_content }}</p>
            <p class="card-text">
              原价: {{ coupon.original_price }}, 折扣价: {{ coupon.discount_price }}
              <br>
              到期日期: {{ new Date(coupon.expire_date).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data: () => ({
    brandOptions: [],
    isLoaded: false,
    selectedBrand: '',
    selectedCoupons: [],
    selectedPrice: '',
    startDate: '',
    endDate: ''
  }),
  created() {
    this.fetchBrandOptions();
    this.fetchCoupons();
  },
  methods: {
  fetchBrandOptions() {
    axios.get('http://localhost:3000/brand_append')
      .then(response => {
        this.brandOptions = response.data;
        this.isLoaded = true;
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
        this.isLoaded = true;
      });
  },
  fetchCoupons() {
    axios.get(`http://localhost:3000/all_coupon`)
      .then(response => {
        let allCoupons = response.data;
        let filteredCoupons = allCoupons.filter(coupon => {
          const matchesPrice = this.selectedPrice ? this.matchesPriceCondition(coupon.discount_price) : true;
          const matchesDate = this.startDate || this.endDate ? this.matchesDateCondition(coupon.expire_date) : true;
          const matchesBrand = this.selectedBrand ? coupon.brand_name === this.selectedBrand : true;
          return matchesPrice && matchesDate && matchesBrand;
        });
        this.selectedCoupons = filteredCoupons;
      })
      .catch(error => {
        console.error('Error fetching coupons:', error);
        this.selectedCoupons = [];
      });
  },
  matchesPriceCondition(price) {
    const ranges = {
      "0-300": price <= 300,
      "301-600": price > 300 && price <= 600,
      "601-900": price > 600 && price <= 900,
      "901-1200": price > 900 && price <= 1200,
      "1201": price > 1200
    };
    return this.selectedPrice ? ranges[this.selectedPrice] : true;
  },
  matchesDateCondition(expireDate) {
    const startDate = this.startDate ? new Date(this.startDate) : null;
    const endDate = this.endDate ? new Date(this.endDate) : new Date('2099-12-31');
    const expiration = new Date(expireDate);
    return (!startDate || expiration >= startDate) && (!endDate || expiration <= endDate);
  }
},
watch: {
    startDate(newVal) {
      if (newVal) {
        this.minEndDate = newVal;  // 设置最小结束日期为新的开始日期
        if (this.endDate && new Date(this.endDate) < new Date(newVal)) {
          this.endDate = '';  // 如果当前结束日期小于新的开始日期，则清空结束日期
        }
      }
    }
  },

}
</script>




<style scoped>
.form-group {
  margin-bottom: 10px;  /* 调整底部间距 */
}

.form-control {
  height: auto;  /* 如果需要，可以调整输入框的高度 */
}
.container {
  max-width: 960px; /* 限制最大宽度，使内容在大屏幕上居中显示 */
  margin: auto;
  padding: 20px;
  background-color: #f8f9fa; /* 轻灰色背景色提供柔和的视觉效果 */
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px; /* 增加底部间距以分隔表单组 */
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem; /* 在标签和输入框之间提供足够的空间 */
}

.form-control {
  width: 100%;
  padding: 0.8rem 0.75rem; /* 增加填充以提升输入的舒适度 */
  line-height: 1.5;
  border-radius: 0.25rem; /* 圆角边框 */
  border: 1px solid #ced4da;
  transition: all 0.2s ease-in-out; /* 平滑的过渡效果 */
}

.form-control:focus {
  border-color: #80bdff; /* 聚焦时边框颜色变化 */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* 添加轻微的聚焦阴影 */
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加卡片阴影 */
  transition: transform 0.3s ease-in-out; /* 鼠标悬浮时的变换效果 */
}

.card:hover {
  transform: translateY(-5px); /* 轻微上移，增加交互感 */
}

.card-body {
  padding: 1.25rem; /* 卡片内边距 */
}

.card-title {
  font-size: 1.25rem; /* 卡片标题字体大小 */
  color: #0056b3; /* 标题颜色 */
}

.card-text {
  color: #333; /* 正文颜色，提高可读性 */
}
</style>
