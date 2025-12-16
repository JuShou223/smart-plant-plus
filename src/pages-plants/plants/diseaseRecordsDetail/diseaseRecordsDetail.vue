<template>
  <view class="disease-record-detail-page page-wrapper">
    <!-- 页面头部 -->
    <!-- <view class="page-header">
      <button class="btn-back" @click="handleBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </button>
      <text class="page-title">诊断详情</text>
      <view class="header-spacer"></view>
    </view> -->

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="record" class="page-content">
      <!-- 状态头部 -->
      <view class="status-header">
        <view class="status-badge" :class="'status-' + statusMap[record.status]">
          <text>{{ statusArr[record.status] }}</text>
        </view>
        <text class="record-date">{{ formatFullDate }}</text>
      </view>

      <!-- 诊断图片 -->
      <view class="record-image-container">
        <u-image :src="record.diseaseImageUrl" width="100%" height="400rpx" mode="aspectFit" radius="16"></u-image>
      </view>

      <!-- 诊断结果卡片 -->
      <view class="diagnosis-card">
        <view class="card-header">
          <view style="margin-bottom: 0" class="card-title">诊断结果</view>
          <view class="confidence-display">
            <!-- <text class="confidence-label">置信度</text> -->
            <!-- <text class="confidence-value">{{ (record.confidence * 100).toFixed(1) }}%</text> -->
          </view>
        </view>

        <view class="disease-type-display">
          <!-- <view class="disease-icon">
            <text>{{ getDiseaseIcon(record.diseaseType) }}</text>
          </view> -->
          <text class="disease-type">{{ record.diseaseType }}</text>
        </view>

        <view class="diagnosis-content">
          <text class="content-subtitle">诊断说明</text>
          <text class="content-text">{{ record.symptoms }}</text>
        </view>
      </view>

      <!-- 关联植物信息 -->
      <view v-if="record.plantName" class="plant-info-card">
        <view class="card-title">关联植物</view>
        <view class="plant-display">
          <!-- <view class="plant-avatar"> -->
          <!-- <text>🌿</text> -->
          <!-- <image :src="plant.plantImage" mode="aspectFit"></image> -->
          <!-- </view> -->
          <view class="plant-text">
            <text>🌿</text>
            <text class="plant-name">{{ record.plantName }}</text>
            <!-- <text class="plant-type">{{ record.user_plants.plant_database && record.user_plants.plant_database.name -->
            <!-- }}</text> -->
          </view>
          <button class="btn-view-plant" @click="viewPlant(record.plantId)">
            <text>查看</text>
          </button>
        </view>
      </view>

      <!-- 治疗方案 -->
      <view class="treatment-card">
        <view class="card-title">治疗方案</view>
        <text class="treatment-content">{{ record.treatmentPlan }}</text>
      </view>

      <!-- 专业治疗包 -->
      <view class="package-card">
        <treatmentPackage :treatmentPackages="treatmentPackages"></treatmentPackage>
      </view>

      <!-- 推荐产品 -->
      <view v-if="recommended_products && recommended_products.length > 0" class="products-card">
        <view class="card-title">推荐产品</view>
        <view class="products-grid">
          <view v-for="product in recommended_products" :key="product.id" class="product-item" @click="goToShop">
            <u-image :src="product.image" width="100%" height="240rpx" mode="aspectFill"></u-image>
            <view class="product-details">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-price">¥{{ product.price }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作区域 -->
      <view class="actions-section">
        <view class="status-selector">
          <text class="selector-label">更新状态</text>
          <picker :value="selectedStatusIndex" :range="statusOptions" @change="onStatusChange" class="status-select">
            <view class="picker-display">
              <text>{{ statusOptions[selectedStatusIndex] }}</text>
              <u-icon name="arrow-down" size="16" color="#666"></u-icon>
            </view>
          </picker>
        </view>

        <button class="btn btn-primary" @click="updateStatus" :disabled="selectedStatus === record.status || updating">
          <text v-if="!updating">保存状态</text>
          <u-loading-icon v-else mode="circle" color="#fff"></u-loading-icon>
        </button>
      </view>

      <!-- 错误信息 -->
      <view v-if="error" class="error-message">
        <u-icon name="info-circle" size="16" color="#f56c6c"></u-icon>
        <text>{{ error }}</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading" class="empty-state">
      <view class="empty-icon">🔍</view>
      <text class="empty-text">诊断记录不存在</text>
      <!-- <button class="btn btn-primary" @click="handleBack">
        <text>返回</text>
      </button> -->
    </view>
  </view>
</template>

<script>
import { getDiseaseRecord, getDiseaseRelatedProducts, updateDiagnosisStatus, getPackagesByDisease } from '@/apis/modules/disease';
import treatmentPackage from '../components/treatmentPackage.vue'
import {
  getPlantDetail,
} from '@/apis/modules/plants';

export default {
  name: 'DiseaseRecordDetail',
  data() {
    return {
      loading: false,
      updating: false,
      record: null,
      selectedStatus: '',
      selectedStatusIndex: 0,
      error: null,
      statusOptions: ['已诊断', '治疗中', '已治愈'],
      recordId: '',
      recommended_products: null,
      treatmentPackages: [],
      plant: null,
      statusMap: ['diagnosed', 'treating', 'cured'],
      statusArr: ['已诊断', '治疗中', '已治愈']
    };
  },
  components: {
    treatmentPackage
  },
  computed: {
    formatFullDate() {
      const dateString = this.record.createdTime
      if (!dateString) return '';

      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.recordId = options.id;
      this.loadRecord();
    }
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },

    // 加载诊断记录
    async loadRecord() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getDiseaseRecord(this.recordId);
        console.log('诊断记录详情响应:', response);
        if (response.code === 200 && response.data) {
          this.record = response.data;
          this.selectedStatus = this.getStatusName(this.record.status);
          this.selectedStatusIndex = this.statusOptions.indexOf(this.selectedStatus);
          //  加载植物信息
          this.loadPlant(this.record.plantId)
          this.loadTreatmentPackage()
          // 加载推荐产品
          // const productsResponse = await getDiseaseRelatedProducts({ 'disease_type': this.record.disease_type });
          // if (productsResponse.code === 200 && productsResponse.data) {
          //   this.recommended_products = productsResponse.data;
          // }
        } else {
          throw new Error(response.msg || '记录不存在');
        }
      } catch (error) {
        console.error('加载诊断记录失败:', error);
        this.error = error.message || '加载诊断记录失败';
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    // 状态选择变化
    onStatusChange(e) {
      const index = e.detail.value;
      this.selectedStatusIndex = index;
      this.selectedStatus = this.statusOptions[index];
    },

    // 更新状态
    async updateStatus() {
      this.updating = true;
      this.error = null;
      try {
        const response = await updateDiagnosisStatus(this.recordId, {
          status: this.selectedStatusIndex
        });

        if (response.code === 200) {
          this.record.status = this.selectedStatus;
          uni.showToast({
            title: '状态更新成功',
            icon: 'success'
          });
        } else {
          throw new Error(response.msg || '更新失败');
        }
      } catch (error) {
        console.error('更新状态失败:', error);
        this.error = error.message || '更新状态失败';
        uni.showToast({
          title: '更新失败',
          icon: 'error'
        });
      } finally {
        this.updating = false;
      }
    },

    async loadPlant(plantId) {
      try {
        const response = await getPlantDetail(plantId, false);
        console.log('加载植物详情响应:', response);
        if (response.code === 200) {
          this.plant = response.data;
        }
      } catch (error) {
        console.error('加载植物详情失败:', error);
      }
    },


    // 查看植物详情
    viewPlant(plantId) {
      uni.navigateTo({
        url: `/pages-plants/plants/plantsDetail/plantsDetail?plantId=${plantId}`
      });
    },

    // 前往商城
    goToShop() {
      uni.navigateTo({
        url: '/pages/shop/index'
      });
    },

    // 格式化完整日期
    // formatFullDate(dateString) {
    //   if (!dateString) return '';

    //   const date = new Date(dateString);
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');
    //   const hours = String(date.getHours()).padStart(2, '0');
    //   const minutes = String(date.getMinutes()).padStart(2, '0');

    //   return `${year}-${month}-${day} ${hours}:${minutes}`;
    // },

    // 获取状态类名
    getStatusName(status) {
      const statusArr = ['已诊断', '治疗中', '已治愈'];
      return statusArr[status];
    },
    // getStatusClass(status) {
    //   const statusMap = {
    //     '诊断中': 'pending',
    //     '已诊断': 'diagnosed',
    //     '治疗中': 'treating',
    //     '已治愈': 'cured'
    //   };
    //   return statusMap[this.getStatusName(status)] || 'pending';
    // },

    // 获取疾病图标
    getDiseaseIcon(diseaseType) {
      const iconMap = {
        '叶片褐斑病': '🍂',
        '根部腐烂': '🌱',
        '虫害': '🐛',
        '叶片发黄': '🍁',
        '健康': '✅'
      };
      return iconMap[diseaseType] || '🔍';
    },

    async loadTreatmentPackage() {
      // 加载治疗套餐
      const packagesResponse = await getPackagesByDisease({ id: '7c32c55b-e271-40ca-abc1-ebf0db6e013b' });
      console.log('packagesResponse', packagesResponse)
      if (packagesResponse.code === 200) {
        this.treatmentPackages = packagesResponse.data || [];
      }

    },
  }
};
</script>

<style lang="scss" scoped>
.disease-record-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  background-color: transparent;
  border: none;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.header-spacer {
  width: 64rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;
  gap: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
}

.status-badge {
  padding: 8rpx 24rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.status-badge.status-pending {
  background-color: rgba(158, 158, 158, 0.15);
  color: #999;
}

.status-badge.status-diagnosed {
  background-color: rgba(255, 193, 7, 0.15);
  color: #f57c00;
}

.status-badge.status-treating {
  background-color: rgba(33, 150, 243, 0.15);
  color: #1976d2;
}

.status-badge.status-cured {
  background-color: rgba(76, 175, 80, 0.15);
  color: #388e3c;
}

.record-date {
  font-size: 26rpx;
  color: #999;
}

.record-image-container {
  width: 100%;
}

.diagnosis-card,
.plant-info-card,
.treatment-card,
.products-card,
.actions-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 0 30rpx 30rpx;
}

.package-card {
  margin: 0 30rpx 30rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
}

.confidence-display {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.confidence-label {
  font-size: 26rpx;
  color: #666;
}

.confidence-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffc107;
}

.disease-type-display {
  display: flex;
  align-items: center;
  gap: 30rpx;
  padding: 30rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
}

.disease-icon {
  font-size: 48rpx;
  margin-right: 30rpx;
}

.disease-type {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.diagnosis-content {
  padding-top: 30rpx;
  border-top: 1rpx solid #eee;
}

.content-subtitle {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.content-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.6;
  color: #666;
}

.plant-display {
  display: flex;
  align-items: center;
  gap: 30rpx;
  margin-top: 30rpx;
}

.plant-avatar {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  font-size: 48rpx;
  margin-right: 30rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.plant-avatar image {
  width: 100%;
  height: 100%;
}

.plant-text {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.plant-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-left: 8rpx;
}

.plant-type {
  display: block;
  font-size: 26rpx;
  color: #666;
}

.btn-view-plant {
  padding: 12rpx 32rpx;
  background-color: #f8f8f8;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  color: #333;
  font-size: 26rpx;
}

.treatment-content {
  display: block;
  font-size: 28rpx;
  line-height: 1.8;
  color: #666;
  white-space: pre-wrap;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  overflow: hidden;
}

.product-item:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.product-details {
  padding: 20rpx;
}

.product-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 30rpx;
  font-weight: 600;
  color: #f56c6c;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.status-selector {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.selector-label {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
  color: #333;
}

.status-select {
  width: 100%;
}

.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #f8f8f8;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 0 30rpx 30rpx;
  padding: 20rpx 30rpx;
  background-color: rgba(245, 108, 108, 0.1);
  border: 1rpx solid #f56c6c;
  border-radius: 16rpx;
  color: #f56c6c;
  font-size: 26rpx;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;
  padding: 60rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 60rpx;
}
</style>