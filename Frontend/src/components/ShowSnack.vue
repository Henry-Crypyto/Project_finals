<template>
  <b-container class="page-container">
    <b-container class="snack-container">
      <b-row>
        <b-col>
          <h1 class="text-center">小吃選單</h1>
        </b-col>
      </b-row>
      <b-row v-if="filteredSnacks.length > 0">
        <b-col cols="12" sm="6" md="4" lg="3" v-for="snack in filteredSnacks" :key="snack.id" class="mb-4">
          <b-card
            hover
            shadow
            class="h-100 custom-card"
          >
            <b-card-title class="text-center mb-2">{{ snack.name.trim() }}</b-card-title>
            <b-card-text v-if="snack.snack_size"><strong>大小:</strong> {{ snack.snack_size }}</b-card-text>
            <b-card-text><strong>原價:</strong> {{ snack.price }}</b-card-text>
            <b-card-text><strong>風味:</strong> {{ snack.flavor_name }}</b-card-text>
            <b-card-text><strong>品牌:</strong> {{ snack.brand_name }}</b-card-text>
            <b-form-group label="數量" label-for="quantity-input-{{ snack.id }}">
              <b-form-input
                id="quantity-input-{{ snack.id }}"
                type="number"
                v-model="snack.quantity"
                min="1"
                placeholder="數量"
              ></b-form-input>
            </b-form-group>
            <b-row>
              <b-col class="d-flex justify-content-center mt-2">
                <b-button variant="primary" @click="handleAddToCart(snack)">加入購物車</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
          <p>正在加載數據或沒有數據顯示...</p>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  created() {
    this.$store.dispatch('fetchSnacks');
  },
  computed: {
    ...mapState(['snacks']),
    filteredSnacks() {
      if (this.$store.state.brandSelect === 'all') {
        return this.snacks;
      } else {
        return this.snacks.filter(snack => snack.brand_name === this.$store.state.brandSelect);
      }
    }
  },
  methods: {
    ...mapMutations(['addToCart', 'setBrandSelect']),
    handleAddToCart(snack) {
      if (this.$store.state.cartItems.length === 0) {
        if (!confirm(`购物车当前为空。你确定要添加 ${snack.brand_name} 品牌的商品到购物车吗？`)) {
          return;
        }
      }
      this.setBrandSelect(snack.brand_name);
      this.addToCart({
        product: snack,
        productType: this.$store.state.productType[2]  // Assuming you are using the third product type
      });
    }
  }
}
</script>

<style scoped>
.page-container {
  border: 3px solid black; /* Bold rectangular border around the page */
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 67px; /* Optional: Adds rounded corners */
  background-color: #f8f9fa; /* Matches inner container background */
}

.snack-container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.custom-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
}

.card-title {
  color: #4a90e2;
  font-size: 30ppx; /* Larger font size for titles */
}

b-card-text {
  padding-left: 20px; /* Better alignment for text */
  line-height: 1.5; /* Improved line spacing for readability */
}
</style>
