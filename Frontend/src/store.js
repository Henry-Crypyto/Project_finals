import { createStore } from 'vuex';
import axios from 'axios';
import { getFullApiUrl } from '../config.js';

export default createStore({
  state: {
    currentView: 'ShowMainCourse',
    brandSelect: 'all',
    brandOptions: [],
    cartItems: [],
    nextCouponId: '',
    productType: ['mainCourse', 'beverage', 'snack'], 
    newCoupon: {
      coupon_id: null,
      brand_name: '',
      coupon_name: '',
      original_price: null,
      discount_price: null,
      start_date: '',
      expire_date: '',
      use_restriction: ''
    },
    selectedCoupons: [],
    mainCourses: [],
    beverages:[],
    snacks:[],
    editOrAdd:0
  },
  mutations: {
    setEditOrAdd(state, value) {
      state.editOrAdd= value;
      console.log(state.editOrAdd);
    },
    setView(state, view) {
      state.currentView = view;
    },
    updateOriginalTotalPrice(state,totalPrice){
        state.newCoupon.original_price=totalPrice;
    },
    dulplicateInfoToNewCoupon(state,coupon){
      console.log('Editing coupon:', coupon);
      state.brandSelect=coupon.brand_name;
      state.nextCouponId=coupon.coupon_id;
      state.newCoupon.coupon_id=coupon.coupon_id;
      state.newCoupon.brand_name=coupon.brand_name;
      state.newCoupon.coupon_name=coupon.coupon_name;
      state.newCoupon.original_price=coupon.original_price;
      state.newCoupon.discount_price=coupon.discount_price;
      state.newCoupon.start_date = coupon.start_date.substring(0,10); 
      state.newCoupon.expire_date = coupon.expire_date.substring(0,10); 
      state.newCoupon.use_restriction=coupon.use_restriction;
    },
    addToCart(state, payload) {
        const { product, productType } = payload;
        const item = state.cartItems.find(item => item.id === product.id 
          && item.productType === productType);        
          if (item) {
          item.quantity += product.quantity;
        } else {
          state.cartItems.push({
            nextCouponId:state.nextCouponId,
            id: product.id,
            productType: productType,
            name: product.name,
            price: product.price,
            quantity: product.quantity
          });
        }
        console.log("购物车内容:", state.cartItems.length);
      },
    setBrandSelect(state, newBrandSelect) {
        state.brandSelect = newBrandSelect;
        state.newCoupon.brand_name = newBrandSelect; 
        console.log(state.brandSelect); // 同步更新 newCoupon 中的 brand_name
      },
      removeFromCart(state, payload) {
        const { id, productType } = payload;
        state.cartItems = state.cartItems.filter(item => !(item.id === id && item.productType === productType));
        // After removing the item, check if the cart is empty and update brand select if needed
        if (state.cartItems.length === 0) {
          this.commit('setBrandSelect', 'all');  // 使用commit调用另一个mutation
        }
      },
    setNextCouponId(state, id) {
      state.nextCouponId = id;
      state.newCoupon.coupon_id = id;
    },
    resetNewCoupon(state) {
      state.newCoupon = {
        coupon_id: null,
        brand_name: '',
        coupon_name: '',
        original_price: null,
        discount_price: null,
        start_date: '',
        expire_date: '',
        use_restriction: ''
      };
      state.cartItems=[];
      this.commit('setBrandSelect', 'all');
      },
    setMainCourses(state, courses) {
      state.mainCourses = courses;
    },
    clearCartItems(state) {
      state.cartItems = []; // Clear cart items array
    },
    setBeverages(state, beverages) {
      state.beverages = beverages;
    },
    setSnacks(state, snacks) {
      state.snacks = snacks;
    },
    setBrandOptions(state, brandOptions) {
      state.brandOptions = []; // 先清空现有数组
      if (Array.isArray(brandOptions)) {
        brandOptions.forEach(brandOption => {
          state.brandOptions.push({
            brand_id: brandOption.brand_id,
            brand_name: brandOption.brand_name
          });
        });
      } else {
        state.brandOptions.push({
          brand_id: brandOptions.brand_id,
          brand_name: brandOptions.brand_name
        });
      }
    },
  },
  actions: {
    fetchBrandOptions({ commit }) {
      const url = getFullApiUrl('/brand_append');
      axios.get(url)
        .then(response => {
          commit('setBrandOptions', response.data);
        })
        .catch(error => {
          console.error('Error fetching brands:', error);
        });
    },
    fetchNextCouponId({ commit }) {
        const url = getFullApiUrl('/next_coupon_id');
        axios.get(url)
          .then(response => {
            // 假设响应是一个数组，并且我们需要第一个元素的 next_coupon_id
            const nextCouponId = response.data[0].next_coupon_id;      
            commit('setNextCouponId', nextCouponId);
          })
          .catch(error => {
            console.error('Error fetching next coupon ID:', error);
          });
      },      
    submitCoupon({ state, commit,dispatch}) {
      const urlA = getFullApiUrl('/add_coupon');
      const urlB=getFullApiUrl('/add_coupon_items_relation');
      axios.post(urlA, state.newCoupon)
        .then(response => {
          console.log('Coupon added successfully:', response);
          return axios.post(urlB, state.cartItems);
        })
        .then(response => {
          console.log('Coupon items relation added successfully:', response);
          alert('折扣券成功新增！');
          commit('resetNewCoupon');
          dispatch('fetchNextCouponId');
        })
        .catch(error => {
          console.error('Error submitting coupon:', error);
          alert('新增折扣券失败: ' + error.message);
        });
      },
      updateCoupon({ state, commit,dispatch}) {
        const urlA = getFullApiUrl('/update_coupon');
        const urlB= getFullApiUrl('/update_coupon_items_relation');
        axios.post(urlA, state.newCoupon)
          .then(response => {
            console.log('Coupon updated successfully:', response);
            return axios.post(urlB, state.cartItems);
          })
          .then(response => {
            console.log('Coupon items relation added successfully:', response);
            alert('折扣券成功更新！');
            commit('resetNewCoupon');
            dispatch('fetchNextCouponId');
          })
          .catch(error => {
            console.error('Error submitting coupon:', error);
            alert('更新折扣券失败: ' + error.message);
          });
        },
      fetchMainCourses({ commit }) {
        const url = getFullApiUrl('/all_main_course');
        axios.get(url)
          .then(response => {
            commit('setMainCourses', response.data.map(course => ({
              ...course,
              quantity: 1  // 初始化数量为 1
            })));
          })
          .catch(error => {
            console.error('Error fetching main courses:', error);
          });
      },
      fetchBeverages({ commit }) {
        const url = getFullApiUrl('/all_beverage');
        axios.get(url)
          .then(response => {
            commit('setBeverages', response.data.map(beverage => ({
              ...beverage,
              quantity: 1  // 初始化数量为 1
            })));
          })
          .catch(error => {
            console.error('Error fetching main beverages:', error);
          });
      },
      fetchSnacks({ commit }) {
        const url = getFullApiUrl('/all_snack');
        axios.get(url)
          .then(response => {
            commit('setSnacks', response.data.map(snack => ({
              ...snack,
              quantity: 1  // 初始化数量为 1
            })));
          })
          .catch(error => {
            console.error('Error fetching main snacks:', error);
          });
      },
      fetchCouponMainCourseRelation({ commit, state }, couponId) {
        commit('clearCartItems');
        const url = getFullApiUrl(`/get_coupon_main_course_relation/${couponId}`);
        axios.get(url)
          .then(response => {
            response.data.forEach(product => {
              commit('addToCart', {
                product: product,
                productType: state.productType[0] // 使用第一个产品类型
              });
            });
          })
          .catch(error => {
            console.error('Error fetching brands:', error);
          });
      },
      fetchCouponBeverageRelation({ commit, state }, couponId) {
        commit('clearCartItems');
        const url = getFullApiUrl(`/get_coupon_beverage_relation/${couponId}`);
        axios.get(url)
          .then(response => {
            response.data.forEach(product => {
              commit('addToCart', {
                product: product,
                productType: state.productType[1] // 使用第一个产品类型
              });
            });
          })
          .catch(error => {
            console.error('Error fetching brands:', error);
          });
      },
      fetchCouponSnackRelation({ commit, state }, couponId) {
        commit('clearCartItems');
        const url = getFullApiUrl(`/get_coupon_snack_relation/${couponId}`);
        axios.get(url)
          .then(response => {
            response.data.forEach(product => {
              commit('addToCart', {
                product: product,
                productType: state.productType[2] // 使用第一个产品类型
              });
            });
          })
          .catch(error => {
            console.error('Error fetching brands:', error);
          });
      }
  }
});
