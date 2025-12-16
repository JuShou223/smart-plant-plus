<template>
  <view class="disease-detail">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="disease" class="content">
      <!-- 头部图片区域 -->
      <view class="hero-section">
        <u-image :src="disease.image_url || 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'"
          width="100%" height="600rpx" mode="aspectCover"></u-image>
        <view class="hero-overlay">
          <view class="hero-content">
            <text class="disease-name">{{ disease.name }}</text>
            <text class="name-en">{{ disease.name_en }}</text>
            <view class="meta-tags">
              <view class="tag category-tag">
                <text>{{ disease.category }}</text>
              </view>
              <view class="tag severity-tag" :class="classMap[disease.severity]">
                <text>{{ disease.severity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 主要内容区域 -->
      <view class="main-content">
        <!-- 疾病描述 -->
        <view class="info-section">
          <text class="section-title">疾病描述</text>
          <text class="section-content">{{ disease.description }}</text>
        </view>

        <!-- 症状表现 -->
        <view class="info-section">
          <text class="section-title">症状表现</text>
          <text class="section-content">{{ disease.symptoms }}</text>
          <view v-if="disease.affected_parts && disease.affected_parts.length > 0" class="affected-parts">
            <text class="label">受影响部位：</text>
            <view class="parts-list">
              <view v-for="part in disease.affected_parts" :key="part" class="part-tag">
                <text>{{ part }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 发病原因 -->
        <view v-if="disease.causes" class="info-section">
          <text class="section-title">发病原因</text>
          <text class="section-content">{{ disease.causes }}</text>
        </view>

        <!-- 传播方式 -->
        <view v-if="disease.spread_method" class="info-section">
          <text class="section-title">传播方式</text>
          <text class="section-content">{{ disease.spread_method }}</text>
        </view>

        <!-- 预防措施 -->
        <view v-if="disease.prevention" class="info-section highlight-section">
          <text class="section-title">预防措施</text>
          <text class="section-content">{{ disease.prevention }}</text>
        </view>

        <!-- 治疗方法 -->
        <view v-if="disease.treatment" class="info-section highlight-section">
          <text class="section-title">治疗方法</text>
          <text class="section-content">{{ disease.treatment }}</text>
        </view>

        <!-- 专业治疗包 -->
        <treatmentPackage :treatmentPackages="treatmentPackages"></treatmentPackage>

        <!-- 单品推荐 -->
        <view v-if="treatmentProducts.length > 0" class="products-section">
          <text class="section-title">单品推荐</text>
          <text class="section-desc">也可以单独购买治疗产品</text>

          <view class="product-list">
            <view v-for="item in treatmentProducts" :key="item.id" class="product-card"
              @click="goToProduct(item.product.id)">
              <view class="product-image">
                <u-image
                  :src="item.product.image_url || 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'"
                  width="200rpx" height="200rpx" mode="aspectCover" radius="8"></u-image>
                <view v-if="item.effectiveness" class="effectiveness-badge">
                  <text>{{ item.effectiveness }}</text>
                </view>
              </view>
              <view class="product-info">
                <text class="product-name">{{ item.product.name }}</text>
                <text class="product-desc">{{ item.product.description }}</text>
                <view class="product-footer">
                  <text class="price">¥{{ item.product.price }}</text>
                  <text class="stock" :class="{ 'out-of-stock': item.product.stock <= 0 }">
                    {{ item.product.stock > 0 ? '有货' : '缺货' }}
                  </text>
                </view>
                <text v-if="item.usage_notes" class="usage-notes">
                  <text class="notes-label">使用说明：</text>{{ item.usage_notes }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- 操作栏 -->
        <view class="action-bar">
          <button class="btn-back" @click="handleBack">
            <text>返回</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading" class="empty-state">
      <u-icon name="file-text" size="80" color="#ccc"></u-icon>
      <text class="empty-text">疾病信息加载失败</text>
      <button class="btn-retry" @click="loadDiseaseDetail">
        <text>重新加载</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getDiseaseDetail, getPackagesByDisease } from '@/apis/modules/disease';
// import { treatmentPackageService } from '@/apis/modu .les/treatmentPackages';
import treatmentPackage from '../components/treatmentPackage.vue'

export default {
  name: 'DiseaseDetail',
  data() {
    return {
      disease: null,
      treatmentPackages: [],
      treatmentProducts: [],
      loading: false,
      diseaseId: '',
      classMap: {
        '轻度': 'severity-low',
        '中度': 'severity-medium',
        '重度': 'severity-high',
        '致命': 'severity-critical'
      }
    }
  },
  components: {
    treatmentPackage
  },
  onLoad(options) {
    if (options.id) {
      this.diseaseId = options.id;
      this.loadDiseaseDetail();
    }
  },
  methods: {
    async loadDiseaseDetail() {
      this.loading = true;
      try {
        // 加载疾病详情
        const diseaseResponse = await getDiseaseDetail({ id: this.diseaseId });
        if (diseaseResponse.code === 200 && diseaseResponse.data) {
          this.disease = diseaseResponse.data;
        } else {
          throw new Error('疾病详情加载失败');
        }

        // 加载治疗套餐
        const packagesResponse = await getPackagesByDisease({ id: this.diseaseId });
        console.log('packagesResponse', packagesResponse)
        if (packagesResponse.code === 200) {
          this.treatmentPackages = packagesResponse.data || [];
        }

        // 加载治疗产品
        // const productsResponse = await diseaseLibraryService.getTreatmentProducts(this.diseaseId);
        // if (productsResponse.code === 200) {
        //   this.treatmentProducts = productsResponse.data || [];
        // }

      } catch (error) {
        console.error('加载疾病详情失败:', error);
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

    // 跳转到产品详情
    goToProduct(productId) {
      uni.navigateTo({
        url: `/pages/shop/product?id=${productId}`
      });
    },

    // 获取严重度类名
    // getSeverityClass(severity) {
    //   const classMap = {
    //     '轻度': 'severity-low',
    //     '中度': 'severity-medium',
    //     '重度': 'severity-high',
    //     '致命': 'severity-critical'
    //   };
    //   return classMap[severity] || 'severity-medium';
    // },
  }
}
</script>

<style lang="scss" scoped>
.disease-detail {
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

.hero-section {
  position: relative;
  width: 100%;
  height: 600rpx;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 80rpx 40rpx 40rpx;
}

.hero-content {
  display: flex;
  flex-direction: column;
}

.disease-name {
  font-size: 56rpx;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  margin-bottom: 16rpx;
}

.name-en {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  margin-bottom: 16rpx;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  padding: 12rpx 24rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  font-weight: 500;
  margin-right: 16rpx;
  margin-bottom: 8rpx;
}

.category-tag {
  background: rgba(255, 255, 255, 0.9);
  color: #27ae60;
}

.severity-tag {
  color: white;
}

.severity-low {
  background: rgba(52, 152, 219, 0.95);
}

.severity-medium {
  background: rgba(241, 196, 15, 0.95);
}

.severity-high {
  background: rgba(231, 76, 60, 0.95);
}

.severity-critical {
  background: rgba(155, 89, 182, 0.95);
}

.main-content {
  padding: 40rpx;
}

.info-section {
  background: white;
  padding: 40rpx;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #27ae60;
}

.section-content {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.highlight-section {
  background: #f0f9ff;
  border-left: 8rpx solid #27ae60;
}

.affected-parts {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #e0e0e0;
}

.label {
  font-weight: 500;
  color: #333;
  margin-right: 16rpx;
  font-size: 28rpx;
}

.parts-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16rpx;
}

.part-tag {
  padding: 8rpx 20rpx;
  background: #ecf0f1;
  color: #27ae60;
  border-radius: 8rpx;
  font-size: 24rpx;
  margin-right: 16rpx;
  margin-bottom: 8rpx;
}

.products-section {
  background: white;
  padding: 40rpx;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.product-list {
  display: flex;
  flex-direction: column;
}

.product-card {
  display: flex;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.product-card:last-child {
  margin-bottom: 0;
}

.product-image {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  overflow: hidden;
  background: white;
  margin-right: 24rpx;
}

.effectiveness-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  padding: 4rpx 16rpx;
  background: #27ae60;
  color: white;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  margin-bottom: 16rpx;
}

.product-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.price {
  font-size: 36rpx;
  color: #e74c3c;
  font-weight: 600;
}

.stock {
  font-size: 24rpx;
  color: #27ae60;
  font-weight: 500;
}

.stock.out-of-stock {
  color: #999;
}

.usage-notes {
  font-size: 24rpx;
  color: #666;
  background: white;
  padding: 16rpx;
  border-radius: 8rpx;
  line-height: 1.4;
}

.notes-label {
  font-weight: 600;
  color: #27ae60;
}

.action-bar {
  padding: 40rpx 0;
  text-align: center;
}

.btn-back {
  padding: 24rpx 80rpx;
  background: white;
  color: #27ae60;
  border: 2rpx solid #27ae60;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
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
  .package-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .package-card {
    width: 48%;
  }

  .product-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .product-card {
    width: 48%;
  }
}
</style>