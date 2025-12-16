<template>
  <view class="orders-page page-wrapper">

    <view class="page-content">
      <view v-if="loading" class="loading-container">
        <view class="loading"></view>
      </view>

      <view v-else-if="orders.length === 0" class="empty-state">
        <text>暂无订单</text>
      </view>

      <view v-else class="orders-list">
        <view v-for="order in orders" :key="order.id" class="order-card">
          <view class="order-header">
            <text class="order-number">订单号：{{ order.order_number }}</text>
            <text class="order-status" :class="order.statusClass">{{ order.status }}</text>
          </view>

          <view class="order-items">
            <view v-for="item in order.order_items" :key="item.id" class="order-item-wrapper">
              <view v-if="item.product_type === 'plant'" class="order-item">
                <image :src="item.plant_product.image_url" :alt="item.plant_product.name" class="item-image" />
                <view class="item-info">
                  <text class="item-name">{{ item.plant_product.name }}</text>
                  <text class="item-spec">{{ item.plant_product.size_spec }}</text>
                  <text class="item-quantity">x{{ item.quantity }}</text>
                </view>
                <text class="item-price">¥{{ item.unit_price }}</text>
              </view>
              <view v-else class="order-item">
                <image :src="item.accessory_specification.accessory.image_url"
                  :alt="item.accessory_specification.accessory.name" class="item-image" />
                <view class="item-info">
                  <text class="item-name">{{ item.accessory_specification.accessory.name }}</text>
                  <text class="item-spec">{{ item.accessory_specification.spec_name }}</text>
                  <text class="item-quantity">x{{ item.quantity }}</text>
                </view>
                <text class="item-price">¥{{ item.unit_price }}</text>
              </view>
              <view v-if="item.service_package" class="service-tag" :class="serviceMap[item.service_package.name]">
                <text class="service-icon">⭐</text>
                <text class="service-text">{{ item.service_package.name }} +¥{{ item.service_package.price_adjustment
                }}</text>
              </view>
            </view>
          </view>

          <view class="order-footer">
            <view class="order-info">
              <view class="order-total">
                <text class="total-label">合计：</text>
                <text class="total-amount">¥{{ order.total_amount }}</text>
              </view>
              <button @click="viewOrderDetail(order.id)" class="btn-detail">查看详情</button>
            </view>
            <view class="order-actions">
              <button v-if="order.status === '待付款'" @click="payOrder(order.id)" class="btn btn-primary">去支付</button>
              <button v-if="order.status === '待收货'" @click="confirmOrder(order.id)"
                class="btn btn-primary">确认收货</button>
              <button v-if="order.status === '待付款'" @click="cancelOrder(order.id)" class="btn btn-outline">取消订单</button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrders } from '@/apis/modules/shop';

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      loading: false,
      serviceMap: {
        '基础版': 'service-basic',
        '标准版': 'service-standard',
        '尊享版': 'service-premium',
        '豪华版': 'service-luxury'
      }
    };
  },
  async onLoad() {
    await this.loadOrders();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadOrders() {
      try {
        this.loading = true;
        const ordersData = await getOrders({});
        console.log('订单数据:', ordersData);
        if (ordersData.code === 200) {
          this.orders = ordersData.data.map(item => {
            return {
              statusClass: this.getStatusClass(item.status),
              ...item,
            }
          });
        }
      } catch (error) {
        console.error('加载订单失败:', error);
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(status) {
      const map = {
        '待付款': 'pending',
        '待发货': 'processing',
        '待收货': 'shipping',
        '已完成': 'completed',
        '已取消': 'cancelled'
      };
      return map[status] || '';
    },
    viewOrderDetail(orderId) {
      uni.navigateTo({
        url: `/pages-plants/plants/orderDetail/orderDetail?id=${orderId}`
      });
    },
    payOrder(orderId) {
      uni.navigateTo({
        url: `/pages-plants/plants/payment/payment?orderId=${orderId}`
      });
    },
    async confirmOrder(orderId) {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await ordersService.confirmReceipt(orderId);
              uni.showToast({
                title: '确认成功',
                icon: 'success'
              });
              await this.loadOrders();
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
    async cancelOrder(orderId) {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await ordersService.cancelOrder(orderId);
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              });
              await this.loadOrders();
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
.orders-page {
  background-color: #f5f5f5;
  min-height: 100vh;
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
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx;
  color: #666666;
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

.orders-list {
  padding: 32rpx;
}

.order-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

.order-number {
  font-size: 26rpx;
  color: #666666;
}

.order-status {
  font-size: 26rpx;
  font-weight: 500;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
}

.order-status.pending {
  background-color: #fff3e0;
  color: #e65100;
}

.order-status.processing {
  background-color: #e3f2fd;
  color: #0277bd;
}

.order-status.shipping {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

.order-status.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.order-status.cancelled {
  background-color: #fafafa;
  color: #616161;
}

.order-items {
  padding: 32rpx;
}

.order-item-wrapper {
  margin-bottom: 32rpx;
}

.order-item-wrapper:last-child {
  margin-bottom: 0;
}

.order-item {
  display: flex;
  margin-bottom: 16rpx;
}

.item-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-right: 32rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  margin-right: 32rpx;
}

.item-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.item-spec,
.item-quantity {
  display: block;
  font-size: 24rpx;
  color: #666666;
}

.item-price {
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.service-tag {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-weight: 500;
  margin-left: 152rpx;
}

.service-icon {
  margin-right: 8rpx;
  font-size: 20rpx;
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

.order-footer {
  padding: 32rpx;
  border-top: 2rpx solid #e0e0e0;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.order-total {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 16rpx;
}

.total-amount {
  font-size: 36rpx;
  font-weight: 600;
  color: #ff4444;
}

.btn-detail {
  padding: 12rpx 32rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 500;
  border: 2rpx solid #e0e0e0;
  background-color: #ffffff;
  color: #666666;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 16rpx 32rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  margin-left: 16rpx;
}

.btn:first-child {
  margin-left: 0;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-outline {
  background-color: #ffffff;
  color: #666666;
  border: 2rpx solid #e0e0e0;
}
</style>
