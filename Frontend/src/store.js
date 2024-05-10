import { createStore } from 'vuex';
import axios from 'axios';
import { getFullApiUrl } from '../config.js';

export default createStore({
  state: {
    currentView: 'ShowCoupon',
    brandSelect: 'all',
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
    mainCourses: [],
    beverages:[],
    snacks:[]
  },
  mutations: {
    setView(state, view) {
      state.currentView = view;
    },
    updateOriginalTotalPrice(state,totalPrice){
        state.newCoupon.original_price=totalPrice;
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
        state.newCoupon.brand_name = newBrandSelect;  // 同步更新 newCoupon 中的 brand_name
      },
      removeFromCart(state, payload) {
        const { id, productType } = payload;
        state.cartItems = state.cartItems.filter(item => !(item.id === id && item.productType === productType));
    },
    setNextCouponId(state, id) {
      state.nextCouponId = id;
      state.newCoupon.coupon_id = id;
    },
    updateCoupon(state, couponData) {
      state.newCoupon = { ...state.newCoupon, ...couponData };
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
      state.brandSelect='all';
    },
    setMainCourses(state, courses) {
      state.mainCourses = courses;
    },
    setBeverages(state, beverages) {
      state.beverages = beverages;
    },
    setSnacks(state, snacks) {
      state.snacks = snacks;
    }
  },
  actions: {
    fetchNextCouponId({ commit }) {
        axios.get('/api/next_coupon_id')
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
      const url = getFullApiUrl('/add_coupon');
      axios.post(url, state.newCoupon)
        .then(response => {
          console.log('Coupon added successfully:', response);
          return axios.post('/api/add_coupon_items_relation', state.cartItems);
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
      }
  }
});