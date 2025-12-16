<template>
  <!-- 植物选择弹窗 -->
  <u-popup title="立即治疗" :show="showPlantSelectModal" mode="center" close-icon-pos="top-right" round="20">
    <!-- 植物选择器 -->
    <view class="plant-selector-section">
      <view class="selector-header">
        <text class="selector-title">立即开始治疗</text>
        <button class="btn-toggle" @click="showPlantSelector = !showPlantSelector">
          <u-icon :name="showPlantSelector ? 'arrow-up' : 'arrow-down'" size="16" color="#666"></u-icon>
        </button>
      </view>

      <view v-if="selectedPlantId" class="selected-plant-info">
        <view class="info-icon">
          <u-icon name="tags" size="20" color="#2ecc71"></u-icon>
        </view>
        <text class="info-text">开始为 <text class="plant-name">{{ selectedPlantName }}</text> 进行治疗</text>
        <button class="btn-clear" @click="clearPlantSelection">
          <u-icon name="close" size="16" color="#999"></u-icon>
        </button>
      </view>
      <view v-else class="selected-plant-info generic">
        <view class="info-icon">
          <u-icon name="info-circle" size="20" color="#999"></u-icon>
        </view>
        <text class="info-text">不关联植物</text>
      </view>

      <view v-if="showPlantSelector" class="plant-selector-panel">
        <view v-if="loadingPlants" class="loading-plants">
          <u-loading-icon></u-loading-icon>
        </view>
        <view v-else-if="userPlants.length === 0" class="empty-plants">
          <text class="empty-text">暂无植物，可进行治疗</text>
        </view>
        <scroll-view v-else class="plants-scroll" scroll-x @scrolltolower="loadMorePlants" lower-threshold="50"
          :scroll-left="scrollLeft">
          <view class="plants-scroll-content">
            <view v-for="plant in userPlants" :key="plant.id" class="plant-option"
              :class="{ selected: selectedPlantId === plant.id }" @click="selectPlant(plant.id)">
              <view class="plant-option-image">
                <image :src="plant.plantImage" width="100%" height="100%" mode="aspectFill"></image>
                <view v-if="selectedPlantId === plant.id" class="check-mark">
                  <u-icon name="checkmark" size="12" color="#fff"></u-icon>
                </view>
              </view>
              <view class="plant-option-info">
                <text class="plant-option-name">{{ plant.plantName }}</text>
                <text class="plant-option-status">{{ plant.status }}</text>
              </view>
            </view>

            <!-- 加载更多指示器 -->
            <view v-if="loadingMore" class="loading-more">
              <u-loading-icon size="20"></u-loading-icon>
            </view>

            <!-- 没有更多数据提示 -->
            <view v-if="!hasMorePlants && userPlants.length > 0" class="no-more">
              <text class="no-more-text">没有更多了</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 底部操作按钮 -->
      <view class="modal-footer">
        <button class="btn btn-outline" @click="showPlantSelectModal = false">取消</button>
        <button class="btn btn-primary" @click="submitCare">
          <text>立即开始</text>
          <!-- <u-loading-icon v-else mode="circle" color="#fff"></u-loading-icon> -->
        </button>
      </view>
    </view>
  </u-popup>
</template>

<script>
// import { plantsService } from '@/apis/modules/plants';
import { getUserPlants } from '@/apis/modules/plants';

export default {
  name: 'selectPlantModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      showPlantSelectModal: false,
      showPlantSelector: false,
      loadingPlants: false,
      loadingMore: false,
      userPlants: [],
      selectedPlantId: '',
      scrollLeft: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      totalPlants: 0
    };
  },
  mounted() {
    console.log('123')
  },
  computed: {
    hasMorePlants() {
      return this.userPlants.length < this.totalPlants;
    },
    selectedPlantName() {
      const plant = this.userPlants.find(p => p.id == this.selectedPlantId);
      console.log('plant', plant, this.userPlants)
      return plant ? plant.plantName : '';
    },
  },
  watch: {
    show(newVal) {
      console.log(newVal)
      if (newVal) {
        // this.resetForm();
        this.startTreatment()
      }
    }
  },
  methods: {
    // 开始治疗 - 显示植物选择弹窗
    startTreatment() {
      this.showPlantSelectModal = true;
      // 重置状态
      this.queryParams.pageNum = 1;
      this.userPlants = [];
      this.selectedPlantId = '';
      this.loadUserPlants();
    },

    // 加载用户植物列表
    async loadUserPlants() {
      if (this.loadingPlants || this.loadingMore) return;

      try {
        this.loadingPlants = true;
        const response = await getUserPlants(this.queryParams);

        if (response.code === 200 && response.rows) {
          this.userPlants = response.rows || [];
          this.totalPlants = response.total || 0;
        }
      } catch (error) {
        console.error('加载植物列表失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loadingPlants = false;
      }
    },

    // 加载更多植物（横向滚动触发）
    async loadMorePlants() {
      // 如果正在加载或没有更多数据,则不执行
      if (this.loadingMore || !this.hasMorePlants) return;

      try {
        this.loadingMore = true;
        this.queryParams.pageNum += 1;

        const response = await getUserPlants(this.queryParams);

        if (response.code === 200 && response.rows) {
          // 追加新数据
          this.userPlants = [...this.userPlants, ...response.rows];
          this.totalPlants = response.total || 0;
        }
      } catch (error) {
        console.error('加载更多植物失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
        // 加载失败时回退页码
        this.queryParams.pageNum -= 1;
      } finally {
        this.loadingMore = false;
      }
    },

    // 选择植物
    selectPlant(plantId) {
      this.selectedPlantId = plantId;
    },

    // 获取健康状态样式类
    // getStatusClass(status) {
    //   const classMap = {
    //     '健康': 'status-healthy',
    //     '一般': 'status-normal',
    //     '需要关注': 'status-warning',
    //     '患病': 'status-sick'
    //   };
    //   return classMap[status] || 'status-normal';
    // },

    // 跳过植物选择
    skipPlantSelection() {
      uni.showModal({
        title: '确认跳过',
        content: '跳过后可以在"我的治疗"中随时关联植物',
        confirmText: '确认跳过',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.selectedPlantId = '';
            this.confirmStartTreatment();
          }
        }
      });
    },

    // 确认开始治疗
    async confirmStartTreatment() {
      uni.showLoading({
        title: '启动治疗中...'
      });

      try {
        // 调用API启动治疗
        const res = await startTreatmentPackage({
          record_id: this.recordId,
          plant_id: this.selectedPlantId || null,
          package_id: this.treatmentData.package.id
        });

        uni.hideLoading();

        if (res.code === 200) {
          uni.showToast({
            title: '治疗已开始',
            icon: 'success'
          });

          // 关闭弹窗
          this.showPlantSelectModal = false;

          // 刷新页面数据，重新加载为进行中状态
          setTimeout(() => {
            this.recordId = res.data.treatment_record_id || this.recordId;
            this.loadTreatmentProgress();
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '启动失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('启动治疗失败:', error);
        uni.showToast({
          title: '启动失败，请重试',
          icon: 'none'
        });
      }
    },

    // 前往添加植物页面
    goToAddPlant() {
      this.showPlantSelectModal = false;
      uni.navigateTo({
        url: '/pages/plant/add-plant'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/* 植物选择弹窗样式 */
/* 植物选择弹窗样式 */
.plant-select-modal {
  width: 680rpx;
  max-height: 80vh;
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  padding: 40rpx 40rpx 16rpx;
}

.modal-subtitle {
  display: block;
  font-size: 26rpx;
  color: #999;
  text-align: center;
  padding: 0 40rpx 32rpx;
}

.modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.loading-text {
  font-size: 26rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 横向滚动容器 */
.plants-scroll-container {
  padding: 0 40rpx 32rpx;
}

.plants-horizontal-scroll {
  white-space: nowrap;
  width: 100%;
}

.plants-horizontal-content {
  display: inline-flex;
  padding: 8rpx 0;
}

/* 植物卡片 - 横向布局 */
.plant-card {
  display: inline-block;
  width: 200rpx;
  margin-right: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  overflow: hidden;
  transition: all 0.3s;
  vertical-align: top;
}

.plant-card:last-child {
  margin-right: 0;
}

.plant-card.selected {
  background: #e8f5e9;
  box-shadow: 0 0 0 3rpx #27ae60;
  transform: scale(1.02);
}

.plant-card-image {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
}

.check-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(39, 174, 96, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-badge {
  width: 64rpx;
  height: 64rpx;
  background: #27ae60;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(39, 174, 96, 0.3);
}

.plant-card-info {
  padding: 20rpx;
  white-space: normal;
}

.plant-card-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plant-card-type {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plant-card-status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin-right: 8rpx;
}

.status-healthy {
  background: #27ae60;
}

.status-normal {
  background: #3498db;
}

.status-warning {
  background: #f39c12;
}

.status-sick {
  background: #e74c3c;
}

.plant-card-status text {
  font-size: 22rpx;
  color: #666;
}

/* 加载更多卡片 */
.loading-more-card,
.no-more-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 280rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-left: 24rpx;
  vertical-align: top;
}

.loading-more-text,
.no-more-text {
  font-size: 22rpx;
  color: #999;
  margin-top: 16rpx;
}

/* 滚动提示 */
.scroll-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  padding: 12rpx 24rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
}

.scroll-hint text {
  font-size: 22rpx;
  color: #999;
  margin: 0 12rpx;
}

/* 空状态 */
.modal-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #666;
  margin-top: 32rpx;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.btn-add-plant {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 48rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 48rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.btn-add-plant text {
  margin-left: 8rpx;
}

/* 底部操作按钮 */
.modal-actions {
  display: flex;
  padding: 32rpx 40rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-skip,
.btn-confirm {
  flex: 1;
  padding: 28rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.btn-skip {
  background: #f5f5f5;
  color: #666;
  margin-right: 16rpx;
}

.btn-confirm {
  background: #27ae60;
  color: white;
}

.btn-confirm[disabled] {
  background: #e0e0e0;
  color: #999;
  opacity: 0.6;
}

.plant-selector-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  width: 80vw;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.selector-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.btn-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  background-color: transparent;
  border: 1rpx solid #ddd;
  border-radius: 50%;
  color: #666;
}

.selected-plant-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  margin-top: 20rpx;
}

.selected-plant-info.generic {
  background-color: #f5f5f5;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.plant-name {
  font-weight: 600;
  color: #2ecc71;
}

.btn-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  color: #999;
}

.plant-selector-panel {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #eee;
}

.loading-plants {
  display: flex;
  justify-content: center;
  padding: 60rpx;
}

.empty-plants {
  text-align: center;
  padding: 60rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.plants-scroll {
  width: 100%;
  white-space: nowrap;
}

.plants-scroll-content {
  display: inline-flex;
  padding: 10rpx 0;
}

.plant-option {
  flex-shrink: 0;
  width: 200rpx;
  margin-right: 20rpx;
}

.plant-option.selected .plant-option-image {
  border-color: #2ecc71;
}

.plant-option-image {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  border: 4rpx solid transparent;
}

.plant-option-image image {
  width: 100%;
  height: 100%;
}

.check-mark {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  background-color: #2ecc71;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.plant-option-info {
  text-align: center;
}

.plant-option-name {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-option-status {
  font-size: 22rpx;
  color: #999;
}

.loading-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 200rpx;
}

.no-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 150rpx;
  height: 200rpx;
}

.no-more-text {
  font-size: 24rpx;
  color: #999;
}

.modal-footer {
  display: flex;
  margin-top: 30rpx;
}

.btn {
  flex: 1;
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
  background: linear-gradient(135deg, #2ecc71 0%, #2ecc71 100%);
  color: #fff;
}

.btn-outline {
  background: #fff;
  color: #666;
  border: 2rpx solid #ddd;
  margin-right: 20rpx;
}

.btn:disabled {
  opacity: 0.6;
}
</style>