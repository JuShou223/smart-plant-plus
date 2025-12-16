<template>
  <!-- 专业治疗包 -->
  <view v-if="treatmentPackages.length > 0" class="packages-section">
    <text class="section-title">专业治疗包</text>
    <text class="section-desc">系统化治疗方案，包含详细步骤和配套产品</text>

    <view class="package-list">
      <view v-for="pkg in treatmentPackages" :key="pkg.id" class="package-card" @click="goToPackage(pkg.id)">
        <!-- 推荐标签 -->
        <view class="package-badge" v-if="pkg.is_recommended">
          <u-icon name="star-fill" size="12" color="#fff"></u-icon>
          <text>推荐</text>
        </view>

        <!-- 套餐图片 -->
        <view class="package-header">
          <u-image :src="pkg.image_url || 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'"
            width="100%" height="320rpx" mode="aspectFill"></u-image>
        </view>

        <!-- 套餐内容 -->
        <view class="package-body">
          <text class="package-name">{{ pkg.name }}</text>

          <!-- 套餐元信息 -->
          <view class="package-meta">
            <view class="meta-item">
              <u-icon name="clock" size="12" color="#666"></u-icon>
              <text>{{ pkg.duration_days }}天疗程</text>
            </view>
            <view class="meta-item">
              <u-icon name="checkmark-circle" size="12" color="#666"></u-icon>
              <text>成功率{{ pkg.success_rate }}%</text>
            </view>
            <view class="meta-item difficulty" :class="classMap[pkg.difficulty_level]">
              <text>{{ pkg.difficulty_level }}</text>
            </view>
          </view>

          <!-- 套餐描述 -->
          <text class="package-desc">{{ pkg.description }}</text>

          <!-- 套餐底部 -->
          <view class="package-footer">
            <view class="price-section">
              <text v-if="pkg.discount_price" class="original-price">¥{{ pkg.total_price }}</text>
              <text class="current-price">¥{{ pkg.discount_price || pkg.total_price }}</text>
            </view>
            <!-- <view class="rating-section">
              <u-icon name="star-fill" size="12" color="#FFB800"></u-icon>
              <text>{{ pkg.rating }}</text>
            </view> -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'treatmentPackage',
  props: {
    treatmentPackages: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      classMap: {
        '简单': 'difficulty-easy',
        '中等': 'difficulty-medium',
        '困难': 'difficulty-hard'
      }
      // treatmentPackages: [],
    }
  },
  mounted() {
  },
  methods: {
    // 获取难度类名
    // getDifficultyClass(difficulty) {
    //   const classMap = {
    //     '简单': 'difficulty-easy',
    //     '中等': 'difficulty-medium',
    //     '困难': 'difficulty-hard'
    //   };
    //   return classMap[difficulty] || 'difficulty-medium';
    // },
    // 跳转到套餐详情
    goToPackage(packageId) {
      uni.navigateTo({
        url: `/pages-plants/plants/treatmentPackageDetail/treatmentPackageDetail?id=${packageId}`
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.packages-section {
  background: white;
  padding: 40rpx;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.section-desc {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.package-list {
  display: flex;
  flex-direction: column;
}

.package-card {
  position: relative;
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  border: 2rpx solid #e0e0e0;
  margin-bottom: 32rpx;
}

.package-card:last-child {
  margin-bottom: 0;
}

.package-badge {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 8rpx 20rpx;
  background: #FFB800;
  color: white;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.package-badge text {
  margin-left: 8rpx;
}

.package-header {
  width: 100%;
  height: 320rpx;
  background: #e8f5e9;
}

.package-body {
  padding: 32rpx;
}

.package-name {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  line-height: 1.2;
}

.package-meta {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  padding: 8rpx 20rpx;
  background: #f0f0f0;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #666;
  margin-right: 16rpx;
  margin-bottom: 8rpx;
}

.meta-item text {
  margin-left: 8rpx;
}

.meta-item.difficulty {
  font-weight: 600;
}

.difficulty-easy {
  background: #e8f5e9;
  color: #2e7d32;
}

.difficulty-medium {
  background: #fff3e0;
  color: #e65100;
}

.difficulty-hard {
  background: #ffebee;
  color: #c62828;
}

.package-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24rpx;
}

.package-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1rpx solid #e0e0e0;
}

.price-section {
  display: flex;
  align-items: center;
}

.original-price {
  font-size: 26rpx;
  color: #999;
  text-decoration: line-through;
  margin-right: 16rpx;
}

.current-price {
  font-size: 40rpx;
  font-weight: 700;
  color: #e74c3c;
}

.rating-section {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #666;
}

.rating-section text {
  margin-left: 8rpx;
}
</style>