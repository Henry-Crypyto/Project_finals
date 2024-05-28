<template>
  <b-container class="mt-5">
    <b-row class="justify-content-center mb-4">
      <!-- Brand Selection Menu -->
      <b-col md="2" class="mb-3">
        <b-form-group label-for="brand-select" class="custom-form-group">
          <template #label>
              <span style="color: white;">
                 <font-awesome-icon :icon="['fas', 'tag']" />品牌
              </span>
          </template>
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
        <b-form-group  label-for="price-select" class="custom-form-group">
          <template #label>
            <span style="color: white;">
              <font-awesome-icon :icon="['fas', 'dollar-sign']" />價格
            </span>
          </template>
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
        <b-form-group label-for="startDate" class="custom-form-group">
          <template #label>
            <span style="color: white;">            
              <font-awesome-icon :icon="['fas', 'calendar-days']" /> 開始日期
            </span>

          </template>
          <b-input-group>
            <b-form-input id="startDate" type="date" v-model="startDate" class="custom-date"></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-secondary" @click="clearDate('start')">清空</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      
      <b-col md="3" class="mb-3">
        <b-form-group  label-for="endDate" class="custom-form-group">
          <template #label>
            <span style="color: white;">            
            <font-awesome-icon :icon="['fas', 'calendar-days']" /> 結束日期
            </span>
          </template>
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
        <button class="search-button" @click="handleFetchCoupons">
       <font-awesome-icon :icon="['fas', 'search']" /> 搜索
         </button>   
       </b-col>
    </b-row>

    <!-- Display Coupons Information for Selected Brand, Price, and Date Range -->
    <b-row>
      <b-col v-if="selectedCoupons.length > 0">
        <b-card v-for="coupon in paginatedCoupons" :key="coupon.coupon_ID" class="mb-3 coupon-card" @click="coupon.expanded = !coupon.expanded">
          <b-card-body class="d-flex justify-content-between align-items-center">
               <img :src="require('@/assets/image/icon/龍貓.png')" alt="Totoro" class="totoro-image">
            <div class="card-title-container">
              <h5 class="card-title">
                <span class="discount-price">$ {{ coupon.discount_price }}</span> {{ coupon.coupon_name }}
              </h5>
            </div>
            <div class="d-flex flex-column">
              <b-button variant="danger" size="sm" class="mb-2" @click.stop="deleteCoupon(coupon.coupon_id)" v-if="userDeveloper === 'add'">删除</b-button>
              <b-button variant="primary" size="sm" @click.stop="editCoupon(coupon)" v-if="userDeveloper === 'update'">编辑</b-button>
            </div>
          </b-card-body>
          <b-collapse :id="'coupon-collapse-' + coupon.coupon_id" v-model="coupon.expanded">
            <b-card-body>
              <div v-if="coupon.items && coupon.items.length">
                <div v-if="coupon.items.some(item => item.ItemType === 'mainCourse')" class="item-section">
                  <div class="item-type-title-container">
                    <h6 class="item-type-title">主食</h6>
                  </div>
                  <b-row>
                    <b-col v-for="item in coupon.items.filter(item => item.ItemType === 'mainCourse')" :key="item.ItemName" class="d-flex align-items-center item-col">
                      <div>
                        <p>
                          <span class="item-name">{{ item.ItemName }}</span> 
                          <span class="item-separator">x</span> 
                          <span class="item-quantity">{{ item.Quantity }}</span>
                        </p>
                        <img v-if="getImageById(item.ItemId, item.ItemType)" 
                        :src="getImageById(item.ItemId, item.ItemType)" 
                        :alt="item.ItemName" 
                        class="coupon-item-image" />                      
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
                        <p>
                          <span class="item-name">{{ item.ItemName }}</span> 
                          <span class="item-separator">x</span> 
                          <span class="item-quantity">{{ item.Quantity }}</span>
                        </p>
                        <img v-if="getImageById(item.ItemId, item.ItemType)" 
                        :src="getImageById(item.ItemId, item.ItemType)" 
                        :alt="item.ItemName" 
                        class="coupon-item-image" />                      </div>
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
                        <p>
                          <span class="item-name">{{ item.ItemName }}</span> 
                          <span class="item-separator">x</span> 
                          <span class="item-quantity">{{ item.Quantity }}</span>
                        </p>
                        <img v-if="getImageById(item.ItemId, item.ItemType)" 
                        :src="getImageById(item.ItemId, item.ItemType)" 
                        :alt="item.ItemName" 
                        class="coupon-item-image" />                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <b-card-text class="pl-8">
                {{ coupon.coupon_content }}<br>
                開始日期: {{ new Date(coupon.start_date).toLocaleDateString() }}<br>
                原價: {{ coupon.original_price }}, 折扣價: {{ coupon.discount_price }}<br>
                到期日期: {{ new Date(coupon.expire_date).toLocaleDateString() }}<br>
                使用限制: {{ coupon.use_restriction || '無特别限制' }}
              </b-card-text>
            </b-card-body>
          </b-collapse>
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
import {getFullApiUrl } from '../../config.js';
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
    pageSize: 8,
    pageCount: 0 // 用于存储最小结束日期
  }),
  created() {
    this.handleFetchCoupons();
  },
  methods: {
    ...mapMutations(['setBrandOptions', 'dulplicateInfoToNewCoupon', 'setUserDeveloper']),

    getImageById(itemId, itemType) {
  let item;
  if (itemType === 'mainCourse') {
    item = this.mainCourses.find(mc => mc.id === itemId);
  } else if (itemType === 'beverage') {
    item = this.beverages.find(b => b.id === itemId);
  } else if (itemType === 'snack') {
    item = this.snacks.find(s => s.id === itemId);
  }

  if (item && item.image_path) {
    return `${this.apiUrl}/${item.image_path}`;
  }
  return null;
},
    async handleFetchCoupons() {
      await this.$store.dispatch('fetchCoupons');
      this.selectedCoupons = this.filterCoupons(this.allCoupons);
      this.pageCount = Math.ceil(this.selectedCoupons.length / this.pageSize);
    },
    deleteCoupon(couponId) {
      // 提示用户确认删除
      if (confirm("确定要删除此折扣券吗？")) {
        const url = getFullApiUrl(`/delete_coupon/${couponId}`);
        axios.delete(url)
          .then(() => {
            // 删除成功后重新获取折扣券信息
            this.handleFetchCoupons();
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
    ...mapState(['brandOptions', 'newCoupon', 'nextCouponId', 'userDeveloper', 'cartItems', 'mainCourses', 'beverages', 'snacks','allCoupons','apiUrl']),
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
  animation: pulse 1.5s infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  font-size: 16px;
  color: white;
  background-image: linear-gradient(145deg, #00c6ff, #0072ff);
  border: none;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.search-button:hover {
  background-image: linear-gradient(145deg, #0072ff, #0052D4);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

.search-button i {
  margin-right: 5px; /* 确保图标和文字之间有适当的空间 */
}


@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
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
.white-text {
  color: white;
}
.coupon-card {
  cursor: pointer;
  border: 2px inset #dc3545; /* 红色虚线边框 */
  border-radius: 70px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
  background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);  
  transition: transform 0.3s ease-in-out; /* 鼠标悬浮效果 */
  overflow: hidden; /* 防止内容溢出 */
  position: relative; /* 相对定位，用于标记 */
}

.coupon-card::before {
  content: ""; /* 必须有内容才能显示 */
  position: absolute; /* 绝对定位 */
  top: 60px;
  left: -30px;
  width: 150px; /* 緞帶宽度 */
  height: 44px; /* 緞帶高度 */
  background-color: #dc3545; /* 緞帶颜色 */
  border-radius: 0 0 5px 0; /* 圆角调整 */
  transform: rotate(-45deg); /* 旋转45度 */
  transform-origin: left top; /* 设置旋转的基点 */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.coupon-card:hover {
  transform: translateY(-5px); /* 鼠标悬浮时上移 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 加强阴影效果 */
}

.card-body {
  padding: 1.25rem; /* 卡片内边距 */
}

.card-title-container {
  text-align: center; /* 标题居中 */
  flex-grow: 1; /* 使容器占用可用空间 */
}

.card-title {
  display: inline-block; /* 居中标题 */
  cursor: pointer; /* 指针样式 */
  font-size: 1.25rem; /* 标题字体大小 */
  color: #E6E6FA; /* 标题颜色 */
}

.card-text {
  color: #e6e6fa; /* 正文颜色 */
  padding-left: 20px; /* 左侧内边距 */
}

.discount-price {
  background-color: #dc3545; /* 红色背景 */
  color: #fff; /* 白色文字 */
  padding: 2px 6px; /* 内边距 */
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
  max-width: 100px; /* 设置图像的最大宽度 */
  max-height: 100px; /* 设置图像的最大高度 */
  margin-top: 10px;
}

.item-section {
  margin-bottom: 2rem; /* 添加节之间的间距 */
}

.item-type-title-container {
  text-align: center; /* 标题居中 */
}

.item-type-title {
  display: inline-block; /* 使边框匹配文本的宽度 */
  font-size: 1.25rem; /* 标题字体大小 */
  font-weight: bold;
  color: #dc3545; /* 标题颜色 */
  margin: 0 auto 1rem auto; /* 居中元素并添加底部间距 */
  text-align: center;
  border: 2px solid #dc3545; /* 添加边框 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 10px; /* 圆角 */
  background: linear-gradient(to right, #ffe5e5, #ffcccc); /* 渐变背景 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.item-col {
  margin-bottom: 1rem; /* 项目之间的间距 */
}
.item-name {
  color: #e6e6fa; /* 淡紫色 */
}

.item-separator {
  color: #d8bfd8; /* 淡色系顏色，這裡用的是薰衣草紫色 */
}

.item-quantity {
  color: #add8e6; /* 水藍色 */
}
.collapse:not(.show) {
  display: block;
  overflow: hidden;
  height: 0;
  transition: height 0.6s ease;
}

.collapse.show {
  height: auto; /* Adjust this depending on your content */
  transition: height 0.6s ease;
}
</style>
