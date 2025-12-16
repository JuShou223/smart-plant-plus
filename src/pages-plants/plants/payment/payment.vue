<template>
  <view class="payment-page page-wrapper">
    <!-- <view class="page-header">
      <text class="page-title">订单支付</text>
    </view> -->

    <view v-if="loading" class="loading-container">
      <view class="loading"></view>
    </view>

    <view v-else-if="order" class="page-content">
      <view class="order-info">
        <text class="order-number">订单号：{{ order.order_number }}</text>
        <view class="order-amount">
          <text class="amount-label">应付金额</text>
          <text class="amount">¥{{ order.total_amount }}</text>
        </view>
      </view>

      <view class="payment-methods">
        <text class="section-title">选择支付方式</text>
        <view class="payment-method" :class="{ active: paymentMethod === 'alipay' }" @click="paymentMethod = 'alipay'">
          <view class="method-info">
            <view class="method-icon alipay-icon">
              <text class="icon-text">支</text>
            </view>
            <text class="method-name">支付宝</text>
          </view>
          <view v-if="paymentMethod === 'alipay'" class="check-icon">
            <text class="check-text">✓</text>
          </view>
        </view>

        <view class="payment-method" :class="{ active: paymentMethod === 'wechat' }" @click="paymentMethod = 'wechat'">
          <view class="method-info">
            <view class="method-icon wechat-icon">
              <text class="icon-text">微</text>
            </view>
            <text class="method-name">微信支付</text>
          </view>
          <view v-if="paymentMethod === 'wechat'" class="check-icon">
            <text class="check-text">✓</text>
          </view>
        </view>
      </view>

      <view class="payment-notice">
        <text class="notice-text">此为模拟支付环境，点击确认支付后订单将自动完成支付</text>
      </view>

      <button class="btn-pay" @click="confirmPayment">确认支付</button>
    </view>
  </view>
</template>

<script>
import { getOrder } from '@/apis/modules/shop';
// import { ordersService } from '@/services/orders';

export default {
  name: 'Payment',
  data() {
    return {
      order: null,
      paymentMethod: 'alipay',
      loading: false,
      orderId: null
    };
  },
  async onLoad(options) {
    this.orderId = options.orderId;
    await this.loadOrder();
  },
  methods: {
    async loadOrder() {
      try {
        this.loading = true;
        const orderData = await getOrder({ orderId: this.orderId });
        if (orderData.code === 200) {
          this.order = orderData.data;
        }
      } catch (error) {
        console.error('加载订单失败:', error);
        uni.showToast({
          title: '加载订单失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    async confirmPayment() {
      try {
        const methodName = this.paymentMethod === 'alipay' ? '支付宝' : '微信支付';
        await payOrder(this.order.id, methodName);

        uni.showToast({
          title: '支付成功！',
          icon: 'success'
        });

        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/orders/index'
          });
        }, 1500);
      } catch (error) {
        console.error('支付失败:', error);
        uni.showToast({
          title: '支付失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.payment-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
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

.order-info {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 16px;
  text-align: center;
}

.order-number {
  display: block;
  font-size: 13px;
  color: #666666;
  margin-bottom: 16px;
}

.order-amount {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.amount {
  font-size: 32px;
  font-weight: 600;
  color: #ff4444;
}

.payment-methods {
  background-color: #ffffff;
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

.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
}

.payment-method.active {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.method-info {
  display: flex;
  align-items: center;
}

.method-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.alipay-icon {
  background-color: #1677FF;
}

.wechat-icon {
  background-color: #09BB07;
}

.icon-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.method-name {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
}

.check-icon {
  color: #4CAF50;
}

.check-text {
  font-size: 16px;
  font-weight: bold;
}

.payment-notice {
  background-color: #fff3e0;
  padding: 16px;
  margin: 0 16px 20px;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.notice-text {
  display: block;
  font-size: 13px;
  color: #e65100;
}

.btn-pay {
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}
</style>