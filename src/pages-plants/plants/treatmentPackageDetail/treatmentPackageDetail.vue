<template>
  <view class="treatment-package-detail">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="packageData" class="content">
      <!-- 套餐头部图片 -->
      <view class="package-hero">
        <u-image
          :src="packageData.package.image_url || 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'"
          width="100%" height="480rpx" mode="aspectCover"></u-image>
        <view class="hero-badge" v-if="packageData.package.is_recommended">
          <u-icon name="star-fill" size="16" color="#fff"></u-icon>
          <text>推荐治疗包</text>
        </view>
      </view>

      <!-- 主要内容 -->
      <view class="main-content">
        <!-- 套餐基本信息 -->
        <view class="package-info-card">
          <text class="package-name">{{ packageData.package.name }}</text>

          <!-- 套餐统计信息 -->
          <view class="package-stats">
            <view class="stat-item">
              <view class="stat-icon">
                <u-icon name="clock" size="24" color="#27ae60"></u-icon>
              </view>
              <view class="stat-content">
                <text class="stat-label">疗程时长</text>
                <text class="stat-value">{{ packageData.package.duration_days }}天</text>
              </view>
            </view>

            <view class="stat-item">
              <view class="stat-icon">
                <u-icon name="checkmark-circle" size="24" color="#27ae60"></u-icon>
              </view>
              <view class="stat-content">
                <text class="stat-label">成功率</text>
                <text class="stat-value">{{ packageData.package.success_rate }}%</text>
              </view>
            </view>

            <view class="stat-item">
              <view class="stat-icon">
                <u-icon name="info-circle" size="24" color="#27ae60"></u-icon>
              </view>
              <view class="stat-content">
                <text class="stat-label">难度等级</text>
                <text class="stat-value" :class="classMap[packageData.package.difficulty_level]">
                  {{ packageData.package.difficulty_level }}
                </text>
              </view>
            </view>

            <!-- <view class="stat-item">
              <view class="stat-icon">
                <u-icon name="star-fill" size="24" color="#FFB800"></u-icon>
              </view>
              <view class="stat-content">
                <text class="stat-label">用户评分</text>
                <text class="stat-value">{{ packageData.package.rating }}</text>
              </view>
            </view> -->
          </view>

          <text class="package-description">{{ packageData.package.description }}</text>
        </view>

        <!-- 治疗方案 -->
        <view class="section">
          <text class="section-title">治疗方案</text>
          <text class="section-subtitle">按照以下步骤进行系统治疗，坚持完成疗程</text>

          <view class="steps-timeline">
            <view v-for="(step, index) in packageData.steps" :key="step.id" class="step-card">
              <view class="step-number">{{ index + 1 }}</view>

              <view class="step-content">
                <view class="step-header">
                  <text class="step-phase">{{ step.phase }}</text>
                  <text class="step-days">{{ step.day_range }}</text>
                </view>

                <text class="step-title">{{ step.title }}</text>
                <text class="step-description">{{ step.description }}</text>

                <view class="step-actions" v-if="step.action_items && step.action_items.length > 0">
                  <text class="actions-title">操作步骤：</text>
                  <view class="actions-list">
                    <view v-for="(action, idx) in step.action_items" :key="idx" class="action-item">
                      <u-icon name="checkmark" size="12" color="#27ae60"></u-icon>
                      <text>{{ action }}</text>
                    </view>
                  </view>
                </view>

                <view class="step-tips" v-if="step.tips">
                  <u-icon name="info-circle" size="16" color="#e65100"></u-icon>
                  <text>{{ step.tips }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 配套产品 -->
        <view class="section" v-if="packageData.products && packageData.products.length > 0">
          <text class="section-title">配套产品</text>
          <text class="section-subtitle">治疗包包含以下产品，无需单独购买</text>

          <view class="product-grid">
            <view v-for="item in packageData.products" :key="item.id" class="product-item">
              <view class="product-essential-badge" v-if="item.is_essential">
                <text>必需</text>
              </view>

              <view class="product-image">
                <u-image
                  :src="item.product.image_url || 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'"
                  width="160rpx" height="160rpx" mode="aspectCover" radius="8"></u-image>
              </view>

              <view class="product-details">
                <text class="product-name">{{ item.product.name }}</text>
                <text class="product-quantity">数量：{{ item.quantity }}个</text>
                <text class="product-frequency">{{ item.usage_frequency }}</text>
                <text class="product-instruction">{{ item.usage_instruction }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 购买区域 -->
        <view class="purchase-section">
          <view class="price-info">
            <text class="price-label">治疗包价格</text>
            <view class="price-value">
              <text v-if="packageData.package.discount_price" class="original-price">¥{{ packageData.package.total_price
                }}</text>
              <text class="current-price">¥{{ packageData.package.discount_price || packageData.package.total_price
                }}</text>
            </view>
            <text v-if="packageData.package.discount_price" class="price-saving">
              立省¥{{ (packageData.package.total_price - packageData.package.discount_price).toFixed(2) }}
            </text>
          </view>

          <button class="btn-purchase" @click="handlePurchase">
            <text>立即购买</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading" class="empty-state">
      <u-icon name="file-text" size="80" color="#ccc"></u-icon>
      <text class="empty-text">治疗包信息加载失败</text>
      <button class="btn-retry" @click="loadPackageDetail">
        <text>重新加载</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getPackageDetail, getPackageSteps, getPackageProducts } from '@/apis/modules/disease';

export default {
  name: 'TreatmentPackageDetail',
  data() {
    return {
      packageData: null,
      loading: false,
      packageId: '',
      classMap: {
        '简单': 'difficulty-easy',
        '中等': 'difficulty-medium',
        '困难': 'difficulty-hard'
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.packageId = options.id;
      this.loadPackageDetail();
    }
  },
  methods: {
    async loadPackageDetail() {
      this.loading = true;
      try {
        const [packageInfo, steps, products] = await Promise.all([
          getPackageDetail({ id: this.packageId }),
          getPackageSteps({ id: this.packageId }),
          getPackageProducts({ id: this.packageId })
        ]);
        console.log('packageInfo', packageInfo, steps, products)
        const result = {};
        if (packageInfo.code === 200) {
          result.package = packageInfo.data
        }
        if (steps.code === 200) {
          result.steps = steps.data
        }
        if (products.code === 200) {
          result.products = products.data
        }
        this.packageData = result
        console.log('this.packageData', result)
      } catch (error) {
        console.error('加载治疗包详情失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },

    // 获取难度类名
    // getDifficultyClass(difficulty) {
    //   const classMap = {
    //     '简单': 'difficulty-easy',
    //     '中等': 'difficulty-medium',
    //     '困难': 'difficulty-hard'
    //   };
    //   return classMap[difficulty] || 'difficulty-medium';
    // },

    // 处理购买
    handlePurchase() {
      uni.showModal({
        title: '购买确认',
        content: '确定要购买这个治疗包吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '购买成功',
              icon: 'success'
            });
            // 实际项目中这里会调用购买接口
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.treatment-package-detail {
  background: #f5f5f5;
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 240rpx 30rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

.package-hero {
  position: relative;
  width: 100%;
  height: 480rpx;
}

.hero-badge {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background: #FFB800;
  color: white;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.hero-badge text {
  margin-left: 12rpx;
}

.main-content {
  padding: 40rpx;
}

.package-info-card {
  background: white;
  padding: 40rpx;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
}

.package-name {
  display: block;
  font-size: 44rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 32rpx;
  line-height: 1.2;
}

.package-stats {
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.stat-value.difficulty-easy {
  color: #2e7d32;
}

.stat-value.difficulty-medium {
  color: #e65100;
}

.stat-value.difficulty-hard {
  color: #c62828;
}

.package-description {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.section {
  background: white;
  padding: 40rpx;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
}

.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.section-subtitle {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.steps-timeline {
  display: flex;
  flex-direction: column;
}

.step-card {
  display: flex;
  padding: 32rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
  border-left: 8rpx solid #27ae60;
  margin-bottom: 40rpx;
}

.step-card:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #27ae60;
  color: white;
  border-radius: 50%;
  font-size: 36rpx;
  font-weight: 700;
  margin-right: 32rpx;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.step-phase {
  padding: 8rpx 20rpx;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 16rpx;
}

.step-days {
  font-size: 24rpx;
  color: #999;
}

.step-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  margin-bottom: 16rpx;
}

.step-description {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.step-actions {
  display: flex;
  flex-direction: column;
  margin-bottom: 16rpx;
}

.actions-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.actions-list {
  display: flex;
  flex-direction: column;
}

.action-item {
  display: flex;
  align-items: flex-start;
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.action-item text {
  margin-left: 12rpx;
}

.step-tips {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: #fff3cd;
  border-radius: 12rpx;
  margin-top: 16rpx;
}

.step-tips text {
  font-size: 24rpx;
  color: #856404;
  line-height: 1.5;
  margin-left: 16rpx;
}

.product-grid {
  display: flex;
  flex-direction: column;
}

.product-item {
  position: relative;
  display: flex;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-essential-badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 6rpx 16rpx;
  background: #e74c3c;
  color: white;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: 600;
  z-index: 10;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: white;
  margin-right: 24rpx;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  margin-bottom: 8rpx;
}

.product-quantity {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.product-frequency {
  font-size: 24rpx;
  color: #27ae60;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.product-instruction {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.purchase-section {
  background: white;
  padding: 32rpx 40rpx;
  border-radius: 24rpx;
  margin-top: 40rpx;
}

.price-info {
  margin-bottom: 24rpx;
  text-align: center;
}

.price-label {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.price-value {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}

.original-price {
  font-size: 32rpx;
  color: #999;
  text-decoration: line-through;
  margin-right: 16rpx;
}

.current-price {
  font-size: 56rpx;
  font-weight: 700;
  color: #e74c3c;
}

.price-saving {
  display: block;
  font-size: 26rpx;
  color: #27ae60;
  font-weight: 600;
}

.btn-purchase {
  width: 100%;
  padding: 28rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 240rpx 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}

.btn-retry {
  padding: 20rpx 40rpx;
  background-color: #3c9cff;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
}

/* 平板适配 */
@media (min-width: 768px) {
  .package-stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .stat-item {
    width: 48%;
    margin-bottom: 24rpx;
  }

  .product-grid {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .product-item {
    width: 48%;
  }
}
</style>