<template>
  <view class="plant-wiki-detail-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="plant" class="page-content">
      <!-- 返回按钮 -->
      <!-- <button class="btn-back" @click="handleBack">
        <u-icon name="arrow-left" size="24" color="#333"></u-icon>
      </button> -->

      <!-- 植物图片区域 -->
      <view class="plant-hero">
        <view class="plant-image">
          <image :src="plant.mainImage" width="100%" height="100%" mode="aspectFill"></image>
        </view>
      </view>

      <!-- 植物内容区域 -->
      <view class="plant-content">
        <text class="plant-name">{{ plant.plantName }}</text>

        <!-- 信息表格 -->
        <view class="info-table">
          <view class="info-row">
            <text class="info-label">原产地</text>
            <text class="info-value">{{ plant.originPlace || '暂无数据' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">生产地</text>
            <text class="info-value">{{ plant.productionPlace || '中国' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">花期</text>
            <text class="info-value">{{ plant.bloomPeriod || '常绿观叶植物，罕见开花' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">类型</text>
            <text class="info-value">{{ plant.plantType }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">颜色</text>
            <text class="info-value">{{ plant.color || '叶片绿色' }}</text>
          </view>
          <view class="info-row long">
            <text class="info-label">简介</text>
            <text class="info-value">{{ getIntroduction() }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">尺寸规格</text>
            <text class="info-value">{{ plant.plantSize || '视具体品种而定' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">土壤</text>
            <text class="info-value">{{ plant.soilRequirement || '疏松透气的营养土' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">光照</text>
            <text class="info-value">{{ plant.light_requirement || '半阴' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">浇水</text>
            <text class="info-value">{{ getWateringGuide() }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">施肥</text>
            <text class="info-value">{{ getFertilizerGuide() }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">修剪</text>
            <text class="info-value">{{ plant.pruning_guide || '及时修剪枯叶' }}</text>
          </view>
        </view>

        <!-- 操作区域 -->
        <view class="action-section">
          <button class="btn-add-plant" @click="addToMyPlants">
            <text>添加到我的植物</text>
          </button>
        </view>
      </view>
      <view class="fab-container">
        <button class="fab-diagnosis" @click="goToProductDetail">
          <u-icon name="shopping-cart" color="#ffffff" size="36"></u-icon>
          <!-- <image src="/static/common/hospital.png"></image> -->
        </button>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading" class="empty-state">
      <view class="empty-icon">🌿</view>
      <text class="empty-text">植物信息加载失败</text>
      <button class="btn-retry" @click="loadPlant">重新加载</button>
    </view>
  </view>
</template>

<script>
import {
  getPlantDatabaseById,
} from '@/apis/modules/plants';

export default {
  name: 'PlantWikiDetail',
  data() {
    return {
      plant: null,
      loading: true,
      plantId: ''
    };
  },
  onLoad(options) {
    if (options.id) {
      this.plantId = options.id;
      this.loadPlant();
    }
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },

    // 加载植物详情
    async loadPlant() {
      try {
        this.loading = true;
        const response = await getPlantDatabaseById(this.plantId);
        console.log('植物库详情响应:', response);
        if (response.code === 200 && response.data) {
          this.plant = response.data;
        } else {
          this.plant = this.getMockPlant();
        }
      } catch (error) {
        console.error('加载植物详情失败:', error);
        this.plant = this.getMockPlant();
      } finally {
        this.loading = false;
      }
    },

    // 获取模拟数据（备用）
    getMockPlant() {
      return {
        id: this.plantId,
        name: '绿萝',
        scientific_name: 'Epipremnum aureum',
        image_url: 'https://images.pexels.com/photos/4503819/pexels-photo-4503819.jpeg?auto=compress&cs=tinysrgb&w=600',
        origin: '所罗门群岛',
        production_area: '中国',
        flowering_period: '常绿观叶植物，罕见开花',
        color: '叶片绿色',
        category: '观叶植物',
        care_difficulty: 2,
        size_spec: '中小型盆栽',
        soil_requirement: '疏松透气的营养土',
        light_requirement: '半阴',
        water_frequency: '每周1-2次',
        pruning_guide: '及时修剪枯叶',
        care_tips: '绿萝是非常适合室内养护的观叶植物，能够有效净化空气。'
      };
    },

    // 获取植物简介
    getIntroduction() {
      if (!this.plant) return '';

      const parts = [];

      if (this.plant.name) {
        parts.push(`${this.plant.name}`);
      }

      if (this.plant.care_difficulty) {
        const difficultyMap = {
          1: '坚强、善良、乐观',
          2: '坚韧、顽强',
          3: '高雅、纯洁'
        };
        const traits = difficultyMap[this.plant.care_difficulty] || '生命力旺盛';
        parts.push(`${this.plant.name}花语：${traits}`);
      }

      if (this.plant.category) {
        parts.push(`${this.plant.name}属于${this.plant.category}，有着顽强的生命力，被称作"生命之花"。`);
      }

      if (this.plant.care_tips) {
        parts.push(this.plant.care_tips);
      }

      if (this.plant.description) {
        parts.push(this.plant.description);
      }

      return parts.join('\n');
    },

    // 获取浇水指南
    getWateringGuide() {
      if (!this.plant) return '';
      const freq = this.plant.wateringMethod || '每周1-2次';
      return freq
    },

    // 获取施肥指南
    getFertilizerGuide() {
      if (!this.plant) return '';
      const freq = this.plant.fertilizingMethod || '每月1次';
      return freq
    },

    // 添加到我的植物
    addToMyPlants() {
      uni.navigateTo({
        url: `/pages-plants/plants/addPlants/addPlants?plantId=${this.plant.id}&plantName=${this.plant.plantName}`
      });
    },

    goToProductDetail() {
      uni.navigateTo({
        url: '/pages-plants/plants/productDetail/productDetail?id=plant_db_001&type=plant'
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.plant-wiki-detail-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f8f5 0%, #ffffff 50%);
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.btn-back {
  position: absolute;
  top: 32rpx;
  left: 32rpx;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  color: #333;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.plant-hero {
  width: 100%;
  height: 60vh;
  min-height: 400rpx;
  position: relative;
  overflow: hidden;
}

.plant-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #f5f8f5 0%, #ffffff 100%);
}

.plant-image image {
  width: 100%;
  height: 100%;
}

.plant-content {
  background-color: #f8f8f8;
  border-radius: 48rpx 48rpx 0 0;
  margin-top: -48rpx;
  padding: 60rpx 30rpx;
  position: relative;
  z-index: 1;
}

.plant-name {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 60rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.info-table {
  background-color: white;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 60rpx;
}

.info-row {
  display: flex;
  border-bottom: 1rpx solid #f0f0f0;
  min-height: 112rpx;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.long {
  flex-direction: column;
}

.info-row.long .info-label {
  border-right: none;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row.long .info-value {
  padding: 30rpx;
}

.info-label {
  width: 160rpx;
  flex-shrink: 0;
  padding: 30rpx;
  background-color: #fafafa;
  border-right: 1rpx solid #f0f0f0;
  font-size: 28rpx;
  color: #999;
  display: flex;
  align-items: center;
}

.info-value {
  flex: 1;
  padding: 30rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  display: flex;
  align-items: center;
  white-space: pre-line;
}

.action-section {
  padding: 30rpx 0;
}

.btn-add-plant {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 8rpx 24rpx rgba(60, 156, 255, 0.3);
}

.btn-add-plant:active {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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
  margin-bottom: 40rpx;
}

.btn-retry {
  padding: 24rpx 48rpx;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.btn-retry:active {
  opacity: 0.9;
}

.fab-container {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.fab-diagnosis {
  width: 128rpx;
  height: 128rpx;
  background: linear-gradient(135deg, #2ecc71 0%, #00c896 100%);
  box-shadow: 0 8rpx 32rpx rgba(46, 204, 113, 0.4);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab-records image {
  width: 48rpx;
  height: 48rpx;
}

.fab-diagnosis image {
  width: 48rpx;
  height: 48rpx;
}
</style>