<template>
  <view class="order-detail-page page-wrapper">
    <!-- <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title">订单详情</text>
    </view> -->

    <view v-if="loading" class="loading-container">
      <view class="loading"></view>
    </view>

    <view v-else-if="order" class="page-content">
      <view class="section order-info-section">
        <view class="info-row">
          <text class="label">订单号</text>
          <text class="value">{{ order.order_number }}</text>
        </view>
        <view class="info-row">
          <text class="label">下单时间</text>
          <text class="value">{{ order.created_at }}</text>
        </view>
        <view class="info-row">
          <text class="label">订单状态</text>
          <text class="value status" :class="statusClass">{{ order.status }}</text>
        </view>
        <view class="info-row">
          <text class="label">支付状态</text>
          <text class="value status" :class="order.payment_status === '已支付' ? 'paid' : 'unpaid'">{{ order.payment_status
            }}</text>
        </view>
        <view v-if="order.paid_at" class="info-row">
          <text class="label">支付时间</text>
          <text class="value">{{ order.paid_at }}</text>
        </view>
      </view>

      <view class="section address-section">
        <text class="section-title">收货地址</text>
        <view class="address-card">
          <view class="address-header">
            <text class="receiver-name">{{ order.shipping_address.receiver_name }}</text>
            <text class="receiver-phone">{{ order.shipping_address.phone }}</text>
          </view>
          <text class="address-detail">
            {{ order.shipping_address.province }}
            {{ order.shipping_address.city }}
            {{ order.shipping_address.district }}
            {{ order.shipping_address.detailed_address }}
          </text>
        </view>
      </view>

      <view class="section products-section">
        <text class="section-title">商品信息</text>
        <view v-for="item in order.order_items" :key="item.id" class="product-item-group">
          <view class="product-item">
            <image v-if="item.product_type === 'plant'" :src="item.plant_product.image_url"
              :alt="item.plant_product.name" class="product-image" />
            <image v-else :src="item.accessory_specification.accessory.image_url"
              :alt="item.accessory_specification.accessory.name" class="product-image" />
            <view class="product-info">
              <text v-if="item.product_type === 'plant'" class="product-name">{{ item.plant_product.name }}</text>
              <text v-else class="product-name">{{ item.accessory_specification.accessory.name }}</text>

              <text v-if="item.product_type === 'plant'" class="product-spec">{{ item.plant_product.size_spec }}</text>
              <text v-else class="product-spec">{{ item.accessory_specification.spec_name }}</text>

              <text class="product-quantity">x{{ item.quantity }}</text>
            </view>
            <text class="product-price">¥{{ item.unit_price }}</text>
          </view>

          <view v-if="item.service_package" class="service-detail-card">
            <view class="service-header">
              <view class="service-badge" :class="serviceMap[item.service_package.name]">
                <text class="service-icon">⭐</text>
                <text class="service-text">{{ item.service_package.name }}</text>
              </view>
            </view>
            <text class="service-description">{{ item.service_package.description }}</text>

            <view class="service-features">
              <text class="features-title">服务明细</text>
              <view class="feature-list">
                <view v-if="item.service_package.include_delivery" class="feature-item">
                  <view class="feature-icon">
                    <text class="icon-text">🚚</text>
                  </view>
                  <view class="feature-content">
                    <text class="feature-name">包邮配送</text>
                    <text class="feature-desc">免费送货到家</text>
                  </view>
                  <text class="feature-price">免费</text>
                </view>

                <view v-if="item.service_package.include_planting" class="feature-item">
                  <view class="feature-icon">
                    <text class="icon-text">🌱</text>
                  </view>
                  <view class="feature-content">
                    <text class="feature-name">上门种植服务</text>
                    <text class="feature-desc">专业人员上门种植</text>
                  </view>
                  <text class="feature-price">+¥{{ calculatePlantingPrice(item.service_package) }}</text>
                </view>

                <view v-if="item.service_package.include_warranty" class="feature-item">
                  <view class="feature-icon">
                    <text class="icon-text">🛡️</text>
                  </view>
                  <view class="feature-content">
                    <text class="feature-name">{{ item.service_package.warranty_days }}天枯萎包换保障</text>
                    <text class="feature-desc">保障期内免费更换</text>
                  </view>
                  <text class="feature-price">+¥{{ calculateWarrantyPrice(item.service_package) }}</text>
                </view>
              </view>
            </view>

            <view class="service-total">
              <text class="service-total-label">套餐费用</text>
              <text class="service-total-price">+¥{{ item.service_package.price_adjustment }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section price-section">
        <text class="section-title">价格明细</text>
        <view class="price-list">
          <view class="price-item">
            <text class="price-label">商品小计</text>
            <text class="price-value">¥{{ calculateProductTotal() }}</text>
          </view>
          <view class="price-item">
            <text class="price-label">服务套餐</text>
            <text class="price-value">+¥{{ calculateServiceTotal() }}</text>
          </view>
          <view class="price-item total">
            <text class="price-label">订单总额</text>
            <text class="price-value">¥{{ order.total_amount }}</text>
          </view>
        </view>
      </view>

      <view v-if="order.notes" class="section notes-section">
        <text class="section-title">订单备注</text>
        <text class="notes-text">{{ order.notes }}</text>
      </view>

      <view class="bottom-actions">
        <button v-if="order.status === '待付款'" @click="payOrder" class="btn btn-primary">去支付</button>
        <button v-if="order.status === '待收货'" @click="confirmOrder" class="btn btn-primary">确认收货</button>
        <button v-if="order.status === '待付款'" @click="cancelOrder" class="btn btn-outline">取消订单</button>
      </view>
    </view>
  </view>
</template>

<script>
// import { ordersService } from '@/services/orders';
import { getOrder } from '@/apis/modules/shop';

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      loading: false,
      orderId: null,
      sttausMap: {
        '待付款': 'pending',
        '待发货': 'processing',
        '待收货': 'shipping',
        '已完成': 'completed',
        '已取消': 'cancelled'
      },
      serviceMap: {
        '基础版': 'service-basic',
        '标准版': 'service-standard',
        '尊享版': 'service-premium',
        '豪华版': 'service-luxury'
      }
    }
  },
  async onLoad(options) {
    this.orderId = options.id;
    await this.loadOrder();
  },
  computed: {
    statusClass() {
      const map = {
        '待付款': 'pending',
        '待发货': 'processing',
        '待收货': 'shipping',
        '已完成': 'completed',
        '已取消': 'cancelled'
      };
      return map[this.order.status] || '';
    },
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadOrder() {
      try {
        this.loading = true;
        const orderData = await getOrder({ orderId: this.orderId });
        if (orderData.code === 200) {
          this.order = orderData.data;
          this.order.created_at = this.formatDate(this.this.order.created_at)
          this.order.paid_at = this.formatDate(this.this.order.paid_at)
        }
      } catch (error) {
        console.error('加载订单详情失败:', error);
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
        this.goBack();
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    calculatePlantingPrice(servicePackage) {
      const totalPrice = parseFloat(servicePackage.price_adjustment);
      if (!servicePackage.include_planting) return 0;

      if (servicePackage.include_warranty) {
        return (totalPrice * 0.6).toFixed(2);
      } else {
        return (totalPrice * 0.7).toFixed(2);
      }
    },
    calculateWarrantyPrice(servicePackage) {
      const totalPrice = parseFloat(servicePackage.price_adjustment);
      if (!servicePackage.include_warranty) return 0;

      if (servicePackage.include_planting) {
        return (totalPrice * 0.4).toFixed(2);
      } else {
        return (totalPrice * 0.5).toFixed(2);
      }
    },
    calculateProductTotal() {
      if (!this.order || !this.order.order_items) return 0;
      return this.order.order_items.reduce((total, item) => {
        return total + (parseFloat(item.unit_price) * item.quantity);
      }, 0).toFixed(2);
    },
    calculateServiceTotal() {
      if (!this.order || !this.order.order_items) return 0;
      return this.order.order_items.reduce((total, item) => {
        if (item.service_package) {
          return total + parseFloat(item.service_package.price_adjustment);
        }
        return total;
      }, 0).toFixed(2);
    },
    payOrder() {
      uni.navigateTo({
        url: `/pages/payment/index?orderId=${this.order.id}`
      });
    },
    async confirmOrder() {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await ordersService.confirmReceipt(this.order.id);
              uni.showToast({
                title: '确认成功',
                icon: 'success'
              });
              await this.loadOrder();
            } catch (error) {
              console.error('确认失败:', error);
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    async cancelOrder() {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await ordersService.cancelOrder(this.order.id);
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              });
              await this.loadOrder();
            } catch (error) {
              console.error('取消失败:', error);
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.order-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100px;
}

.page-header {
  position: relative;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 16px;
  color: #333333;
}

.back-text {
  font-size: 20px;
  font-weight: 600;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.loading {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page-content {
  padding: 16px;
}

.section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
}

.order-info-section .info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.order-info-section .info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-size: 14px;
  color: #666666;
}

.info-row .value {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

.info-row .value.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
}

.status.pending {
  background-color: #fff3e0;
  color: #e65100;
}

.status.processing {
  background-color: #e3f2fd;
  color: #0277bd;
}

.status.shipping {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

.status.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.cancelled {
  background-color: #fafafa;
  color: #616161;
}

.status.paid {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.unpaid {
  background-color: #ffebee;
  color: #c62828;
}

.address-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.receiver-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.receiver-phone {
  font-size: 15px;
  color: #666666;
}

.address-detail {
  display: block;
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
}

.product-item-group {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.product-item-group:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.product-item {
  display: flex;
  margin-bottom: 16px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 16px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-right: 16px;
}

.product-name {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
}

.product-spec {
  display: block;
  font-size: 13px;
  color: #666666;
  margin-bottom: 4px;
}

.product-quantity {
  display: block;
  font-size: 13px;
  color: #666666;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.service-detail-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
}

.service-header {
  margin-bottom: 12px;
}

.service-badge {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.service-icon {
  margin-right: 6px;
  font-size: 14px;
}

.service-basic {
  background-color: #f5f5f5;
  color: #757575;
}

.service-standard {
  background-color: #e3f2fd;
  color: #1976d2;
}

.service-premium {
  background-color: #fff3e0;
  color: #f57c00;
}

.service-luxury {
  background-color: #fff8e1;
  color: #f9a825;
}

.service-description {
  display: block;
  font-size: 13px;
  color: #666666;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.service-features {
  margin-bottom: 16px;
}

.features-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.feature-list {
  display: flex;
  flex-direction: column;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.icon-text {
  font-size: 16px;
}

.feature-content {
  flex: 1;
  margin-right: 12px;
}

.feature-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 2px;
}

.feature-desc {
  display: block;
  font-size: 12px;
  color: #666666;
}

.feature-price {
  font-size: 15px;
  font-weight: 600;
  color: #4CAF50;
  flex-shrink: 0;
}

.service-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.service-total-label {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
}

.service-total-price {
  font-size: 18px;
  font-weight: 600;
  color: #4CAF50;
}

.price-list {
  display: flex;
  flex-direction: column;
}

.price-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
}

.price-item.total {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  margin-top: 12px;
}

.price-label {
  font-size: 14px;
  color: #666666;
}

.price-item.total .price-label {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.price-value {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
}

.price-item.total .price-value {
  font-size: 20px;
  font-weight: 600;
  color: #ff4444;
}

.notes-text {
  display: block;
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-right: 12px;
}

.btn:last-child {
  margin-right: 0;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-outline {
  background-color: #ffffff;
  color: #666666;
  border: 1px solid #e0e0e0;
}
</style>