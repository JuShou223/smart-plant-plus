<template>
  <view class="checkout-page page-wrapper">
    <!-- <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title">确认订单</text>
    </view> -->

    <view v-if="loading" class="loading-container">
      <view class="loading"></view>
    </view>

    <view v-else class="page-content">
      <view class="address-section" @click="showAddressSelector">
        <view v-if="selectedAddress" class="address-info">
          <view class="address-header">
            <text class="receiver-name">{{ selectedAddress.receiver_name }}</text>
            <text class="receiver-phone">{{ selectedAddress.phone }}</text>
          </view>
          <text class="address-detail">
            {{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{
              selectedAddress.detailed_address }}
          </text>
        </view>
        <view v-else class="address-empty">
          <text class="address-icon">🏠</text>
          <text class="address-text">请选择收货地址</text>
        </view>
        <text class="arrow-right">›</text>
      </view>

      <view class="products-section">
        <text class="section-title">商品清单</text>
        <view v-for="item in cartItems" :key="item.id" class="product-item-group">
          <view class="product-item">
            <image v-if="item.product_type === 'plant'" :src="item.plant_product.image_url"
              :alt="item.plant_product.name" class="product-img" />
            <image v-else :src="item.accessory_specification.accessory.image_url"
              :alt="item.accessory_specification.accessory.name" class="product-img" />
            <view class="product-info">
              <text v-if="item.product_type === 'plant'" class="product-name">{{ item.plant_product.name }}</text>
              <text v-else class="product-name">{{ item.accessory_specification.accessory.name }}</text>

              <text v-if="item.product_type === 'plant'" class="product-spec">{{ item.plant_product.size_spec }}</text>
              <text v-else class="product-spec">{{ item.accessory_specification.spec_name }}</text>

              <text v-if="item.product_type === 'plant'" class="product-price-inline">¥{{ item.plant_product.price }}
                x{{ item.quantity }}</text>
              <text v-else class="product-price-inline">¥{{ item.accessory_specification.price }} x{{ item.quantity
              }}</text>
            </view>
            <text v-if="item.product_type === 'plant'" class="product-subtotal">¥{{
              (parseFloat(item.plant_product.price) * item.quantity).toFixed(2) }}</text>
            <text v-else class="product-subtotal">¥{{ (parseFloat(item.accessory_specification.price) *
              item.quantity).toFixed(2) }}</text>
          </view>

          <view v-if="item.service_package" class="service-simple-card">
            <view class="service-title-row">
              <text class="service-name">{{ item.service_package.name }}</text>
              <text class="service-price">+¥{{ item.service_package.price_adjustment }}</text>
            </view>
            <text class="service-description">{{ getServiceDescription(item.service_package) }}</text>
          </view>

          <view class="item-total-row">
            <text class="item-total-label">小计</text>
            <text class="item-total-price">¥{{ calculateItemTotal(item) }}</text>
          </view>
        </view>
      </view>

      <view class="notes-section">
        <u-input v-model="notes" type="text" placeholder="订单备注（选填）" class="notes-input" />
      </view>

      <view class="summary-section">
        <view class="summary-row">
          <text>商品总价</text>
          <text>¥{{ totalAmount }}</text>
        </view>
        <view class="summary-row">
          <text>运费</text>
          <text>免运费</text>
        </view>
        <view class="summary-row total">
          <text>实付款</text>
          <text class="total-price">¥{{ totalAmount }}</text>
        </view>
      </view>

      <view class="bottom-bar">
        <view class="total-amount">
          <text class="total-label">合计：</text>
          <text class="amount">¥{{ totalAmount }}</text>
        </view>
        <button class="btn-submit" @click="submitOrder">提交订单</button>
      </view>
    </view>

    <view v-if="showAddressModal" class="modal-overlay" @click="showAddressModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">选择收货地址</text>
        <view class="address-list">
          <view v-for="addr in addresses" :key="addr.id" class="address-item"
            :class="{ selected: selectedAddress && selectedAddress.id === addr.id }" @click="selectAddress(addr)">
            <view class="addr-header">
              <text class="addr-name">{{ addr.receiver_name }}</text>
              <text class="addr-phone">{{ addr.phone }}</text>
            </view>
            <text class="addr-detail">
              {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detailed_address }}
            </text>
          </view>
        </view>
        <button class="btn-add-address" @click="addNewAddress">+ 新增地址</button>
      </view>
    </view>
  </view>
</template>

<script>
// import { cartService } from '@/services/cart';
// import { ordersService } from '@/services/orders';
import { getCart, getAddresses } from '@/apis/modules/shop';

export default {
  name: 'Checkout',
  data() {
    return {
      cartItems: [],
      addresses: [],
      selectedAddress: null,
      notes: '',
      loading: false,
      showAddressModal: false
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
    await this.loadData();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    calculateItemTotal(item2) {
      return [item2].reduce((total, item) => {
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
    },
    getServiceDescription(servicePackage) {
      const features = [];
      if (servicePackage.include_delivery) features.push('配送');
      if (servicePackage.include_planting) features.push('上门种植');
      if (servicePackage.include_warranty) features.push(`${servicePackage.warranty_days}天枯萎包换`);
      features.push('免费养护指导');
      return features.join('+');
    },
    async loadData() {
      try {
        this.loading = true;
        const [items, addrs] = await Promise.all([
          getCart(),
          getAddresses()
        ]);
        if (items.code === 200) {
          this.cartItems = items.data;
        }
        if (addrs.code === 200) {
          this.addresses = addrs.data;
        }
        if (this.addresses.length > 0) {
          this.selectedAddress = this.addresses.find(a => a.is_default) || this.addresses[0];
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    showAddressSelector() {
      if (this.addresses.length === 0) {
        this.addNewAddress();
      } else {
        this.showAddressModal = true;
      }
    },
    selectAddress(addr) {
      this.selectedAddress = addr;
      this.showAddressModal = false;
    },
    addNewAddress() {
      this.showAddressModal = false;
      uni.navigateTo({
        url: '/pages-plants/plants/addressList/addressList'
      });
    },
    async submitOrder() {
      if (!this.selectedAddress) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        });
        return;
      }

      if (this.cartItems.length === 0) {
        uni.showToast({
          title: '购物车是空的',
          icon: 'none'
        });
        return;
      }

      try {
        const order = await createOrder(
          this.cartItems,
          this.selectedAddress.id,
          this.notes
        );

        uni.navigateTo({
          url: `/pages/payment/index?orderId=${order.id}`
        });
      } catch (error) {
        console.error('创建订单失败:', error);
        uni.showToast({
          title: '创建订单失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.checkout-page {
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

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80rpx;
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

.address-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.address-info {
  flex: 1;
  margin-right: 32rpx;
}

.address-header {
  display: flex;
  margin-bottom: 16rpx;
}

.receiver-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-right: 32rpx;
}

.receiver-phone {
  font-size: 28rpx;
  color: #666666;
}

.address-detail {
  display: block;
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
}

.address-empty {
  flex: 1;
  display: flex;
  align-items: center;
  margin-right: 32rpx;
}

.address-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.address-text {
  color: #666666;
}

.arrow-right {
  color: #666666;
  font-size: 40rpx;
  font-weight: 600;
}

.products-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 32rpx;
}

.product-item-group {
  margin-bottom: 40rpx;
  padding-bottom: 40rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

.product-item-group:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.product-item {
  display: flex;
  margin-bottom: 24rpx;
}

.product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  margin-right: 32rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-right: 32rpx;
}

.product-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.product-spec {
  display: block;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 8rpx;
}

.product-price-inline {
  display: block;
  font-size: 26rpx;
  color: #666666;
}

.product-subtotal {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.service-simple-card {
  background-color: #f5f5f5;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 24rpx;
}

.service-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.service-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.service-price {
  font-size: 28rpx;
  font-weight: 600;
  color: #4CAF50;
}

.service-description {
  display: block;
  font-size: 24rpx;
  color: #666666;
}

.item-total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 16rpx;
}

.item-total-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 32rpx;
}

.item-total-price {
  font-size: 34rpx;
  font-weight: 600;
  color: #ff4444;
}

.notes-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.notes-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.summary-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #666666;
}

.summary-row.total {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  padding-top: 24rpx;
  border-top: 2rpx solid #e0e0e0;
}

.total-price {
  font-size: 40rpx;
  color: #ff4444;
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

.total-amount {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 16rpx;
}

.amount {
  font-size: 44rpx;
  font-weight: 600;
  color: #ff4444;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 24rpx 64rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx;
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 32rpx;
}

.address-list {
  margin-bottom: 32rpx;
}

.address-item {
  padding: 32rpx;
  border: 4rpx solid #e0e0e0;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.address-item.selected {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.addr-header {
  display: flex;
  margin-bottom: 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.addr-name {
  margin-right: 32rpx;
}

.addr-detail {
  display: block;
  font-size: 26rpx;
  color: #666666;
}

.btn-add-address {
  width: 100%;
  padding: 32rpx;
  border: 2rpx dashed #e0e0e0;
  background-color: transparent;
  color: #4CAF50;
  border-radius: 16rpx;
  font-size: 30rpx;
}
</style>