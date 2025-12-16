<template>
  <view class="cart-page page-wrapper">
    <!-- <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title">购物车</text>
    </view> -->

    <view v-if="loading" class="loading-container">
      <view class="loading"></view>
    </view>

    <view v-else-if="cartItems.length === 0" class="empty-cart">
      <image src="/static/icons/empty-cart.png" class="empty-image"></image>
      <text class="empty-text">购物车是空的</text>
      <button class="btn-primary" @click="goToShop">去逛逛</button>
    </view>

    <view v-else class="page-content">
      <view class="cart-items">
        <view v-for="item in cartItems" :key="item.id" class="cart-item">
          <view class="item-image">
            <image :src="getItemImage(item)" :alt="getItemName(item)" class="item-img" />
          </view>
          <view class="item-info">
            <text class="item-name">{{ getItemName(item) }}</text>
            <text class="item-spec">{{ getItemSpec(item) }}</text>
            <view v-if="item.service_package" class="item-service">
              <text class="service-badge">{{ item.service_package.display_name || item.service_package.name }}</text>
            </view>
            <view class="item-bottom">
              <text class="item-price">¥{{ calculateItemPrice(item) }}</text>
              <view class="item-quantity">
                <button @click="updateQuantity(item, item.quantity - 1)" class="quantity-btn">-</button>
                <text class="quantity-text">{{ item.quantity }}</text>
                <button @click="updateQuantity(item, item.quantity + 1)" class="quantity-btn">+</button>
              </view>
            </view>
          </view>
          <view class="item-delete" @click="removeItem(item.id)">
            <text class="delete-icon">×</text>
          </view>
        </view>
      </view>

      <view v-if="recommendedProducts.length > 0" class="recommended-section">
        <text class="section-title">为你推荐</text>
        <scroll-view class="recommended-scroll" scroll-x="true">
          <view v-for="product in recommendedProducts" :key="product.id" class="recommended-card"
            @click="viewAccessory(product.id)">
            <view class="recommended-image">
              <image :src="product.image_url" :alt="product.name" class="recommended-img" />
            </view>
            <view class="recommended-info">
              <text class="recommended-name">{{ product.name }}</text>
              <text class="recommended-reason">{{ product.recommendation_reason }}</text>
              <view class="recommended-footer">
                <text class="recommended-price">¥{{ product.price }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="bottom-bar">
        <view class="total-section">
          <text class="total-label">合计：</text>
          <text class="total-amount">¥{{ totalAmount }}</text>
        </view>
        <button class="btn-checkout" @click="checkout">去结算</button>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getPlantRelatedProducts,
  getCart
} from '@/apis/modules/shop';

export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [],
      loading: false,
      recommendedProducts: []
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((total, item) => {
        let productPrice = 0;

        if (item.product_type === 'plant') {
          productPrice = parseFloat(item.plant_product.price || 0);
        } else {
          productPrice = parseFloat(item.accessory_specification.price || 0);
        }

        const servicePrice = parseFloat(item.service_package.price_adjustment || 0);
        const quantity = parseInt(item.quantity || 1);
        return total + (productPrice + servicePrice) * quantity;
      }, 0);
    }
  },
  async onLoad() {
    await this.loadCart();
    await this.loadRecommendations();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToShop() {
      uni.switchTab({
        url: '/pages/shop/index'
      });
    },
    async loadCart() {
      try {
        this.loading = true;
        const cartItemsData = await getCart();
        if (cartItemsData.code === 200) {
          this.cartItems = cartItemsData.data || [];
        }
      } catch (error) {
        console.error('加载购物车失败:', error);
      } finally {
        this.loading = false;
      }
    },
    getItemName(item) {
      if (item.product_type === 'plant') {
        return item.plant_product.name || '未知商品';
      } else {
        const accessory = item.accessory_specification.accessory;
        const specName = item.accessory_specification.spec_name;
        return accessory ? `${accessory.name} - ${specName}` : '未知商品';
      }
    },
    getItemImage(item) {
      if (item.product_type === 'plant') {
        return item.plant_product.image_url || item.plant_product.plant.image_url;
      } else {
        return item.accessory_specification.accessory.image_url;
      }
    },
    getItemSpec(item) {
      if (item.product_type === 'plant') {
        return item.plant_product.size_spec || '';
      } else {
        return item.accessory_specification.spec_name || '';
      }
    },
    calculateItemPrice(item) {
      let productPrice = 0;

      if (item.product_type === 'plant') {
        productPrice = parseFloat(item.plant_product.price || 0);
      } else {
        productPrice = parseFloat(item.accessory_specification.price || 0);
      }

      const servicePrice = parseFloat(item.service_package.price_adjustment || 0);
      const quantity = parseInt(item.quantity || 1);
      return (productPrice + servicePrice) * quantity;
    },
    async updateQuantity(item, newQuantity) {
      if (newQuantity < 1) return;
      try {
        await cartService.updateQuantity(item.id, newQuantity);
        await this.loadCart();
      } catch (error) {
        console.error('更新数量失败:', error);
      }
    },
    async removeItem(itemId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该商品吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await cartService.removeFromCart(itemId);
              await this.loadCart();
            } catch (error) {
              console.error('删除失败:', error);
            }
          }
        }
      });
    },
    checkout() {
      if (this.cartItems.length === 0) {
        uni.showToast({
          title: '购物车是空的',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: '/pages/checkout/index'
      });
    },
    async loadRecommendations() {
      if (this.cartItems.length === 0) return;
      try {
        const plantIds = this.cartItems
          .filter(item => item.plant_product && item.plant_product.id)
          .map(item => item.plant_product.id);
        if (plantIds.length > 0) {
          const productsData = await getPlantRelatedProducts({ plantId: plantIds[0], limit: 8 });
          if (productsData.code === 200) {
            this.recommendedProducts = productsData.data.filter(product =>
              !this.cartItems.some(item => item.plant_product && item.plant_product.id === product.id)
            );
          }

        }
      } catch (error) {
        console.error('加载推荐商品失败:', error);
        this.recommendedProducts = [];
      }
    },
    viewAccessory(productId) {
      uni.navigateTo({
        url: `/pages/shop/accessoryDetail?id=${productId}`
      });
    }
  }
};
</script>
<style scoped>
.cart-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 200rpx;
}

.page-header {
  position: relative;
  padding: 32rpx;
  background-color: #ffffff;
  border-bottom: 2rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 32rpx;
  color: #333333;
}

.back-text {
  font-size: 40rpx;
  font-weight: 600;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.loading-container,
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
  text-align: center;
}

.loading {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 32rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #666666;
  margin: 32rpx 0;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 24rpx 64rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.cart-items {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
}

.cart-item {
  position: relative;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  margin-bottom: 32rpx;
}

.cart-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-right: 32rpx;
  flex-shrink: 0;
}

.item-img {
  width: 100%;
  height: 100%;
}

.item-info {
  flex: 1;
}

.item-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.item-spec {
  display: block;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 8rpx;
}

.item-service {
  margin-bottom: 8rpx;
}

.service-badge {
  display: inline-block;
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background-color: #4CAF50;
  color: white;
  border-radius: 16rpx;
  font-weight: 500;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24rpx;
}

.item-price {
  font-size: 36rpx;
  font-weight: 600;
  color: #ff4444;
}

.item-quantity {
  display: flex;
  align-items: center;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  overflow: hidden;
}

.quantity-btn {
  width: 56rpx;
  height: 56rpx;
  border: none;
  background-color: #f5f5f5;
  color: #333333;
  font-size: 32rpx;
  text-align: center;
  line-height: 56rpx;
  padding: 0;
}

.quantity-text {
  min-width: 64rpx;
  text-align: center;
  font-size: 28rpx;
}

.item-delete {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  color: #666666;
}

.delete-icon {
  font-size: 40rpx;
  font-weight: 600;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 2rpx solid #e0e0e0;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.total-section {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 16rpx;
}

.total-amount {
  font-size: 48rpx;
  font-weight: 600;
  color: #ff4444;
}

.btn-checkout {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 24rpx 64rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.recommended-section {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin: 0 32rpx 32rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 32rpx;
}

.recommended-scroll {
  white-space: nowrap;
  padding-bottom: 16rpx;
}

.recommended-card {
  display: inline-block;
  width: 360rpx;
  background-color: #f5f5f5;
  border-radius: 24rpx;
  overflow: hidden;
  margin-right: 32rpx;
}

.recommended-card:last-child {
  margin-right: 0;
}

.recommended-image {
  width: 100%;
  height: 240rpx;
  overflow: hidden;
  background-color: #e0e0e0;
}

.recommended-img {
  width: 100%;
  height: 100%;
}

.recommended-info {
  padding: 24rpx;
}

.recommended-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommended-reason {
  display: block;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 24rpx;
  line-height: 2.8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 68rpx;
  white-space: normal;
}

.recommended-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.recommended-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #4CAF50;
}
</style>
