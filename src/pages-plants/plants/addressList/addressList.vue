<template>
  <view class="address-list-page page-wrapper">
    <!-- <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title">收货地址</text>
    </view> -->

    <view class="page-content">
      <view v-if="loading" class="loading-container">
        <view class="loading"></view>
      </view>

      <view v-else-if="addresses.length === 0" class="empty-state">
        <image src="/static/icons/empty-address.png" class="empty-image"></image>
        <text class="empty-text">暂无收货地址</text>
        <button class="btn btn-primary" @click="addAddress">添加地址</button>
      </view>

      <view v-else>
        <view class="address-list">
          <view v-for="address in addresses" :key="address.id" class="address-card" @click="editAddress(address.id)">
            <view class="address-header">
              <view class="address-name">
                <text class="receiver">{{ address.receiver_name }}</text>
                <text class="phone">{{ address.phone }}</text>
              </view>
              <text v-if="address.is_default" class="default-badge">默认</text>
            </view>
            <text class="address-detail">
              {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detailed_address }}
            </text>
            <view class="address-actions">
              <button class="action-btn" @click.stop="setDefault(address.id)" v-if="!address.is_default">
                设为默认
              </button>
              <button class="action-btn" @click.stop="editAddress(address.id)">
                编辑
              </button>
              <button class="action-btn delete" @click.stop="deleteAddress(address.id)">
                删除
              </button>
            </view>
          </view>
        </view>

        <view class="add-button">
          <button class="btn btn-primary" @click="addAddress">新增地址</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { ordersService } from '@/services/orders';
import { getAddresses } from '@/apis/modules/shop';

export default {
  name: 'AddressList',
  data() {
    return {
      addresses: [],
      loading: false
    };
  },
  async onLoad() {
    await this.loadAddresses();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadAddresses() {
      try {
        this.loading = true;
        const addressesData = await getAddresses();
        if (addressesData.code === 200) {
          this.addresses = addressesData.data;
        }
      } catch (error) {
        console.error('加载地址失败:', error);
      } finally {
        this.loading = false;
      }
    },
    addAddress() {
      uni.navigateTo({
        url: '/pages-plants/plants/addressManagement/addressManagement'
      });
    },
    editAddress(addressId) {
      uni.navigateTo({
        url: `/pages-plants/plants/addressManagement/addressManagement?id=${addressId}`
      });
    },
    async setDefault(addressId) {
      try {
        await ordersService.updateAddress(addressId, { is_default: true });
        await this.loadAddresses();
      } catch (error) {
        console.error('设置失败:', error);
        uni.showToast({
          title: '设置失败，请重试',
          icon: 'none'
        });
      }
    },
    async deleteAddress(addressId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个地址吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await ordersService.deleteAddress(addressId);
              await this.loadAddresses();
            } catch (error) {
              console.error('删除失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
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
.address-list-page {
  background-color: #f5f5f5;
  min-height: 100vh;
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

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
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

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #666666;
  margin: 16px 0;
}

.address-list {
  padding: 16px;
}

.address-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.address-name {
  display: flex;
  align-items: center;
}

.receiver {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-right: 16px;
}

.phone {
  font-size: 14px;
  color: #666666;
}

.default-badge {
  background-color: #4CAF50;
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.address-detail {
  display: block;
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.address-actions {
  display: flex;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #666666;
  margin-right: 12px;
}

.action-btn:last-child {
  margin-right: 0;
}

.action-btn.delete {
  color: #ff4444;
  border-color: #ff4444;
}

.add-button {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
}

.add-button .btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}
</style>