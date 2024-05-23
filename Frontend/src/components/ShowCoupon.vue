<template>
  <b-container class="mt-5">
    <b-row class="justify-content-center mb-4">
      <!-- Brand Selection Menu -->
      <b-col md="2" class="mb-3">
        <b-form-group label="品牌:" label-for="brand-select" class="custom-form-group">
          <b-form-select id="brand-select" v-model="selectedBrand" class="custom-select">
            <b-form-select-option value="">所有品牌</b-form-select-option>
            <b-form-select-option v-for="brand in brandOptions" :key="brand.brand_id" :value="brand.brand_name">
              {{ brand.brand_name }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <!-- Price Filter Menu -->
      <b-col md="2" class="mb-3">
        <b-form-group label="价格:" label-for="price-select" class="custom-form-group">
          <b-form-select id="price-select" v-model="selectedPrice" class="custom-select">
            <b-form-select-option value="">所有價格</b-form-select-option>
            <b-form-select-option value="0-300">0~300元</b-form-select-option>
            <b-form-select-option value="301-600">301~600元</b-form-select-option>
            <b-form-select-option value="601-900">601~900元</b-form-select-option>
            <b-form-select-option value="901-1200">901~1200元</b-form-select-option>
            <b-form-select-option value="1201+">1201元以上</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <!-- Date Range Selection -->
      <b-col md="3" class="mb-3">
        <b-form-group label="开始日期:" label-for="startDate" class="custom-form-group">
          <b-input-group>
            <b-form-input id="startDate" type="date" v-model="startDate" class="custom-date"></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-secondary" @click="clearDate('start')">清空</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      
      <b-col md="3" class="mb-3">
        <b-form-group label="结束日期:" label-for="endDate" class="custom-form-group">
          <b-input-group>
            <b-form-input id="endDate" type="date" v-model="endDate" :min="minEndDate" class="custom-date"></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-secondary" @click="clearDate('end')">清空</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- Search Button -->
      <b-col md="2" class="mb-3 align-self-end">
        <b-button variant="primary" class="search-button" @click="fetchCoupons">搜尋</b-button>
      </b-col>
    </b-row>

    <!-- Display Coupons Information for Selected Brand, Price, and Date Range -->
    <b-row>
      <b-col v-if="selectedCoupons.length > 0">
      <b-card v-for="coupon in paginatedCoupons" :key="coupon.coupon_ID" class="mb-3 custom-card">          <b-card-body class="d-flex justify-content-between align-items-center">
            <div class="card-title-container">
              <h5 class="card-title" @click="coupon.expanded = !coupon.expanded">
                <span class="discount-price">$ {{ coupon.discount_price }}</span> {{ coupon.coupon_name }}
              </h5>
            </div>
            <div class="d-flex flex-column">
              <b-button variant="danger" size="sm" class="mb-2" @click="deleteCoupon(coupon.coupon_id)" v-if="userDeveloper === 'add'">删除</b-button>
              <b-button variant="primary" size="sm" @click="editCoupon(coupon)" v-if="userDeveloper === 'update'">编辑</b-button>
            </div>
          </b-card-body>
          <b-card-body v-if="coupon.items && coupon.items.length">
            <div v-if="coupon.items.some(item => item.ItemType === 'mainCourse')" class="item-section">
              <div class="item-type-title-container">
                <h6 class="item-type-title">主食</h6>
              </div>
              <b-row>
                <b-col v-for="item in coupon.items.filter(item => item.ItemType === 'mainCourse')" :key="item.ItemName" class="d-flex align-items-center item-col">
                  <div>
                    <p>{{ item.ItemName }} x {{ item.Quantity }}</p>
                    <img v-if="item.Image" :src="item.Image" :alt="item.ItemName" class="coupon-item-image" />
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-if="coupon.items.some(item => item.ItemType === 'beverage')" class="item-section">
              <div class="item-type-title-container">
                <h6 class="item-type-title">飲料</h6>
              </div>
              <b-row>
                <b-col v-for="item in coupon.items.filter(item => item.ItemType === 'beverage')" :key="item.ItemName" class="d-flex align-items-center item-col">
                  <div>
                    <p>{{ item.ItemName }} x {{ item.Quantity }}</p>
                    <img v-if="item.Image" :src="item.Image" :alt="item.ItemName" class="coupon-item-image" />
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-if="coupon.items.some(item => item.ItemType === 'snack')" class="item-section">
              <div class="item-type-title-container">
                <h6 class="item-type-title">點心</h6>
              </div>
              <b-row>
                <b-col v-for="item in coupon.items.filter(item => item.ItemType === 'snack')" :key="item.ItemName" class="d-flex align-items-center item-col">
                  <div>
                    <p>{{ item.ItemName }} x {{ item.Quantity }}</p>
                    <img v-if="item.Image" :src="item.Image" :alt="item.ItemName" class="coupon-item-image" />
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-card-body>
          <b-card-text class="pl-8" v-if="coupon.expanded">
            {{ coupon.coupon_content }}<br>
            開始日期: {{ new Date(coupon.start_date).toLocaleDateString() }}<br>
            原價: {{ coupon.original_price }}, 折扣價: {{ coupon.discount_price }}<br>
            到期日期: {{ new Date(coupon.expire_date).toLocaleDateString() }}<br>
            使用限制: {{ coupon.use_restriction || '無特别限制' }}
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="selectedCoupons.length > 0">
      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="selectedCoupons.length"
          :per-page="pageSize"
          aria-controls="coupon-container"
          align="center"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import axios from 'axios';
import { getFullApiUrl } from '../../config.js';
import { mapMutations, mapState } from 'vuex';

export default {
  data: () => ({
    selectedBrand: '',
    selectedCoupons: [],
    selectedPrice: '',
    startDate: '',
    endDate: '',
    minEndDate: '',
    currentPage: 1,
    pageSize: 12,
    pageCount: 0 // 用于存储最小结束日期
  }),
  created() {
    this.$store.dispatch('fetchBrandOptions');
    this.$store.dispatch('fetchMainCourses');
    this.$store.dispatch('fetchBeverages');
    this.$store.dispatch('fetchSnacks');
    this.fetchCoupons();
  },
  methods: {
    ...mapMutations(['setBrandOptions', 'dulplicateInfoToNewCoupon', 'setUserDeveloper']),

    fetchCoupons() {
      const url = getFullApiUrl('/all_coupons_with_items');
      axios.get(url)
        .then(response => {
          let allCoupons = response.data.map(coupon => ({
            ...coupon,
            expanded: false, // Track whether the coupon details are shown
            items: [].concat(
              coupon.main_courses.map(course => {
                const itemName = course.split(' x ')[0];
                const quantity = parseInt(course.split(' x ')[1]);
                const mainCourse = this.mainCourses.find(mc => mc.brand_name === coupon.brand_name && mc.name === itemName);
                const image = mainCourse ? mainCourse.image : null;
                // console.log('Main Course Image:', image);
                return {
                  ItemType: 'mainCourse',
                  ItemName: itemName,
                  Quantity: quantity,
                  ItemBrand: coupon.brand_name,
                  Image: image
                };
              }),
              coupon.beverages.map(beverage => {
                const itemName = beverage.split(' x ')[0];
                const quantity = parseInt(beverage.split(' x ')[1]);
                const beverageItem = this.beverages.find(b => b.brand_name === coupon.brand_name && b.name === itemName);
                const image = beverageItem ? beverageItem.image : null;
                // console.log('Beverage Image Path:', imagePath);
                return {
                  ItemType: 'beverage',
                  ItemName: itemName,
                  Quantity: quantity,
                  ItemBrand: coupon.brand_name,
                  Image: image
                };
              }),
              coupon.snacks.map(snack => {
                const itemName = snack.split(' x ')[0];
                const quantity = parseInt(snack.split(' x ')[1]);
                const snackItem = this.snacks.find(s => s.brand_name === coupon.brand_name && s.name === itemName);
                const image = snackItem ? snackItem.image : null;
                // console.log('Snack Image Path:', imagePath);
                return {
                  ItemType: 'snack',
                  ItemName: itemName,
                  Quantity: quantity,
                  ItemBrand: coupon.brand_name,
                  Image: image
                };
              })
            )
          }));
          this.selectedCoupons = this.filterCoupons(allCoupons);
          this.pageCount = Math.ceil(this.selectedCoupons.length / this.pageSize);
        })
        .catch(error => {
          console.error('Error fetching coupons:', error);
          this.selectedCoupons = [];
        });
    },

    deleteCoupon(couponId) {
      // 提示用户确认删除
      if (confirm("确定要删除此折扣券吗？")) {
        const url = getFullApiUrl(`/delete_coupon/${couponId}`);
        axios.delete(url)
          .then(() => {
            // 删除成功后重新获取折扣券信息
            this.fetchCoupons();
            // 显示删除成功的提示框
            alert("折扣券删除成功！");
          })
          .catch(error => {
            console.error('Error deleting coupon:', error);
            // 处理删除失败的情况
            alert("折扣券删除失败：" + error.message);
          });
      }
    },
    clearDate(type) {
      if (type === 'start') {
        this.startDate = '';
      } else if (type === 'end') {
        this.endDate = '';
      }
    },
    filterCoupons(allCoupons) {
      return allCoupons.filter(coupon => {
        const matchesBrand = this.selectedBrand ? coupon.brand_name === this.selectedBrand : true;
        const matchesPrice = this.selectedPrice ? this.matchesPriceCondition(coupon.discount_price) : true;
        const matchesDate = this.matchesDateCondition(coupon.expire_date, coupon.start_date);
        const matchesCartItems = this.matchesCartItems(coupon);
        return matchesBrand && matchesPrice && matchesDate && matchesCartItems;
      });
    },
    editCoupon(coupon) {
      this.$store.commit('dulplicateInfoToNewCoupon', coupon);
      this.$store.dispatch('fetchCouponMainCourseRelation', coupon.coupon_id);
      this.$store.dispatch('fetchCouponBeverageRelation', coupon.coupon_id);
      this.$store.dispatch('fetchCouponSnackRelation', coupon.coupon_id);
      this.$store.commit('setView', 'ShowMainCourse');
    },
    matchesPriceCondition(price) {
      const ranges = {
        "0-300": price <= 300,
        "301-600": price > 300 && price <= 600,
        "601-900": price > 600 && price <= 900,
        "901-1200": price > 900 && price <= 1200,
        "1201+": price > 1200
      };
      return this.selectedPrice ? ranges[this.selectedPrice] : true;
    },
    matchesDateCondition(expireDate, startDate) {
      const toLocalDate = (dateStr) => {
        const date = new Date(dateStr);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };
      const filterStartDate = this.startDate ? toLocalDate(this.startDate) : null;
      const filterEndDate = this.endDate ? toLocalDate(this.endDate) : new Date('2099-12-31');
      const expiration = toLocalDate(expireDate);
      const start = toLocalDate(startDate);
      return (!filterStartDate || start >= filterStartDate) && (!filterEndDate || expiration <= filterEndDate);
    },
    matchesCartItems(coupon) {
      return this.cartItems.every(cartItem => {
        if (cartItem.preference === 1) {
          // 确保折价券中包含该品项
          return coupon.items.some(couponItem => 
            couponItem.ItemName === cartItem.name && couponItem.brand_name === cartItem.brand_name && couponItem.ItemType === cartItem.productType
          );
        } else if (cartItem.preference === 0) {
          // 确保折价券中不包含该品项
          return !coupon.items.some(couponItem => 
            couponItem.ItemName === cartItem.name && couponItem.brand_name === cartItem.brand_name && couponItem.ItemType === cartItem.productType
          );
        }
        return true; // 对于其他情况，不影响匹配
      });
    }
  },
  computed: {
    ...mapState(['brandOptions', 'newCoupon', 'nextCouponId', 'userDeveloper', 'cartItems', 'mainCourses', 'beverages', 'snacks']),
    paginatedCoupons() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.selectedCoupons.slice(start, end);
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
  }
}
</script>

<style scoped>
.custom-form-group {
  margin-bottom: 1.5rem; /* 增加底部间距 */
}

.custom-select, .custom-date {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #aaa;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-size: 16px;
  color: #333;
  cursor: pointer;
  outline: none; /* 移除焦点时的轮廓 */
  appearance: none; /* 移除默认样式 */
  position: relative;
  background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.custom-select:focus, .custom-date:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0,86,179,0.8);
}

.search-button {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.search-button:hover {
  background-color: #004494;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.b-button {
  border-radius: 0.25rem; /* 圆角边框 */
  padding: 0.5rem 1rem; /* 内边距 */
  font-size: 1rem; /* 字体大小 */
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* 过渡效果 */
}

.b-button:hover {
  background-color: #0056b3; /* 悬停时背景颜色变化 */
  border-color: #0056b3; /* 悬停时边框颜色变化 */
}

.custom-card {
  border: 3px solid black; /* 黑色粗线 */
  border-radius: 30px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加卡片阴影 */
  transition: transform 0.3s ease-in-out; /* 鼠标悬浮时的变换效果 */
}

.custom-card:hover {
  transform: translateY(-5px); /* 轻微上移，增加交互感 */
}

.card-body {
  padding: 1.25rem; /* 卡片内边距 */
}

.card-title-container {
  text-align: center; /* Center the title within its container */
  flex-grow: 1; /* Ensure the container takes up available space */
}

.card-title {
  display: inline-block; /* Center the element within the container */
  cursor: pointer; /* Add a pointer cursor for interactivity */
  font-size: 1.25rem; /* Card title font size */
  color: #0056b3; /* Title color */
}

.card-text {
  color: #333; /* 正文颜色，提高可读性 */
}

.discount-price {
  background-color: #dc3545; /* 红色背景 */
  color: #fff; /* 白色文字 */
  padding: 2px 6px; /* 填充 */
  border-radius: 4px; /* 圆角 */
  font-weight: bold; /* 加粗字体 */
  margin-left: 10px; /* 左边距 */
}

.pl-6 { 
  padding-left: 1.5rem; 
}

.pl-8 { 
  padding-left: 3rem; 
}

.coupon-item-image {
  display: block;
  max-width: 100px; /* Set a max width for the image */
  max-height: 100px; /* Set a max height for the image */
  margin-top: 10px;
}

.item-section {
  margin-bottom: 2rem; /* Add spacing between sections */
}

.item-type-title-container {
  text-align: center; /* Center the title within its container */
}

.item-type-title {
  display: inline-block; /* Makes the border match the width of the text */
  font-size: 2.25rem;
  font-weight: bold;
  color: #0056b3;
  margin: 0 auto 1rem auto; /* Center the element and add bottom margin */
  text-align: center;
  border: 2px solid #0056b3; /* Add border around the text */
  padding: 10px 20px; /* Increase padding for better spacing */
  border-radius: 12px; /* Add more rounded corners */
  background: linear-gradient(to right, #e0f7ff, #f1f9ff); /* Add a subtle gradient background */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow for depth */
}

.item-col {
  margin-bottom: 1rem; /* Add spacing between items */
}

</style>