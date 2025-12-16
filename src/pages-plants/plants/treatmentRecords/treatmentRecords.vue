<template>
  <view class="my-treatments">
    <!-- 顶部标签切换 -->
    <view class="tabs">
      <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)">
        <text class="tab-text">{{ tab.label }}</text>
        <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 治疗记录列表 -->
    <view v-else class="treatment-list">
      <!-- 进行中的治疗 -->
      <view v-if="activeTab === 'ongoing' && ongoingTreatments.length > 0">
        <view v-for="record in ongoingTreatments" :key="record.id" class="treatment-card ongoing"
          @click="goToProgress(record.id)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="treatment-info">
              <text class="treatment-name">{{ record.package_name }}</text>
              <view class="plant-link" v-if="record.plant">
                <!-- <u-icon name="leaf" size="16" color="#27ae60"></u-icon> -->
                <text>{{ record.plant.name }}</text>
              </view>
            </view>
            <view class="status-badge ongoing-badge">
              <text>进行中</text>
            </view>
          </view>

          <!-- 植物图片（如果有） -->
          <view v-if="record.plant" class="plant-image">
            <u-image :src="record.plant.image_url" width="100%" height="200rpx" mode="aspectCover"
              radius="12"></u-image>
          </view>

          <!-- 时间信息 -->
          <view class="time-info">
            <view class="time-item">
              <u-icon name="calendar" size="16" color="#999"></u-icon>
              <text>开始于 {{ formatDate(record.start_date) }}</text>
            </view>
            <view class="time-item remaining">
              <u-icon name="clock" size="16" color="#e65100"></u-icon>
              <text>剩余 {{ record.remaining_days }} 天</text>
            </view>
          </view>

          <!-- 进度信息 -->
          <view class="progress-section">
            <view class="progress-header">
              <text class="progress-text">第 {{ record.current_step }} / {{ record.total_steps }} 步</text>
              <text class="progress-percent">{{ record.progress }}%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: record.progress + '%' }"></view>
            </view>
            <text class="current-step-name">{{ record.current_step_name }}</text>
          </view>

          <!-- 快捷操作 -->
          <view class="card-actions">
            <!-- <button class="btn-action primary" @click.stop="goToProgress(record.id)">
              <u-icon name="arrow-right" size="16" color="#fff"></u-icon>
              <text>继续治疗</text>
            </button> -->
            <button class="btn-action secondary" @click.stop="viewDetails(record.id)">
              <u-icon name="eye" size="16" color="#666"></u-icon>
              <text>查看详情</text>
            </button>
            <button class="btn-action warning" @click.stop="pauseTreatment(record.id)">
              <u-icon name="pause-circle" size="16" color="#ffffff"></u-icon>
              <text>暂停</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 已完成的治疗 -->
      <view v-if="activeTab === 'completed' && completedTreatments.length > 0">
        <view v-for="record in completedTreatments" :key="record.id" class="treatment-card completed">
          <view class="card-header">
            <view class="treatment-info">
              <text class="treatment-name">{{ record.package_name }}</text>
              <view class="plant-link" v-if="record.plant">
                <!-- <u-icon name="leaf" size="16" color="#27ae60"></u-icon> -->
                <text>{{ record.plant.name }}</text>
              </view>
            </view>
            <view class="status-badge completed-badge">
              <!-- <u-icon name="checkmark-circle" size="16" color="#fff"></u-icon> -->
              <text>已完成</text>
            </view>
          </view>

          <!-- 完成信息 -->
          <view class="completion-info">
            <view class="info-row">
              <text class="label">治疗时长：</text>
              <text class="value">{{ record.duration }} 天</text>
            </view>
            <view class="info-row">
              <text class="label">完成日期：</text>
              <text class="value">{{ formatDate(record.end_date) }}</text>
            </view>
          </view>

          <!-- 评价信息 -->
          <!-- <view v-if="record.rating" class="rating-section">
            <view class="rating-stars">
              <u-icon v-for="i in 5" :key="i" name="star-fill" size="20"
                :color="i <= record.rating ? '#FFB800' : '#e0e0e0'"></u-icon>
            </view>
            <text v-if="record.effect" class="effect-label">效果：{{ record.effect }}</text>
            <text v-if="record.comment" class="comment-text">{{ record.comment }}</text>
          </view>
          <view v-else class="no-rating">
            <text>未评价</text>
            <button class="btn-rate" @click.stop="rateCompleted(record.id)">
              <text>去评价</text>
            </button>
          </view> -->

          <!-- 操作按钮 -->
          <view class="card-actions">
            <button class="btn-action secondary" @click.stop="viewDetails(record.id)">
              <u-icon name="eye" size="16" color="#666"></u-icon>
              <text>查看详情</text>
            </button>
            <button class="btn-action primary" @click.stop="repurchase(record.package_id)">
              <u-icon name="reload" size="16" color="#fff"></u-icon>
              <text>再次购买</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 已中断的治疗 -->
      <view v-if="activeTab === 'paused' && pausedTreatments.length > 0">
        <view v-for="record in pausedTreatments" :key="record.id" class="treatment-card paused">
          <view class="card-header">
            <view class="treatment-info">
              <text class="treatment-name">{{ record.package_name }}</text>
              <view class="plant-link" v-if="record.plant">
                <!-- <u-icon name="leaf" size="16" color="#27ae60"></u-icon> -->
                <text>{{ record.plant.name }}</text>
              </view>
            </view>
            <view class="status-badge paused-badge">
              <text>已暂停</text>
            </view>
          </view>

          <!-- 暂停信息 -->
          <view class="pause-info">
            <view class="info-row">
              <text class="label">暂停于：</text>
              <text class="value">{{ formatDate(record.pause_date) }}</text>
            </view>
            <view class="info-row">
              <text class="label">已完成：</text>
              <text class="value">{{ record.current_step }} / {{ record.total_steps }} 步</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="card-actions">
            <button class="btn-action secondary" @click.stop="viewDetails(record.id)">
              <u-icon name="eye" size="16" color="#666"></u-icon>
              <text>查看详情</text>
            </button>
            <button class="btn-action primary" @click.stop="resumeTreatment(record.id)">
              <u-icon name="play-circle" size="16" color="#fff"></u-icon>
              <text>恢复治疗</text>
            </button>
            <!-- <button class="btn-action danger" @click.stop="deleteTreatment(record.id)">
              <u-icon name="trash" size="16" color="#fff"></u-icon>
              <text>删除</text>
            </button> -->
          </view>
        </view>
      </view>

      <!-- 未使用的治疗包 -->
      <!-- 未使用的治疗包 -->
      <view v-if="activeTab === 'unused' && unusedTreatments.length > 0">
        <view v-for="record in unusedTreatments" :key="record.id" class="treatment-card unused">
          <view class="card-header">
            <view class="treatment-info">
              <text class="treatment-name">{{ record.package_name }}</text>
              <!-- <view class="package-type">
                <u-icon name="box" size="16" color="#9c27b0"></u-icon>
                <text>{{ record.package_type }}</text>
              </view> -->
            </view>
            <view class="status-badge unused-badge">
              <text>未使用</text>
            </view>
          </view>

          <!-- 治疗包图片 -->
          <view class="package-image">
            <u-image :src="record.package_image" width="100%" height="200rpx" mode="aspectCover" radius="12"></u-image>
          </view>

          <!-- 疗程信息 -->
          <view class="course-info">
            <view class="course-tag">
              <u-icon name="clock" size="16" color="#666"></u-icon>
              <text>{{ record.course_days }}天疗程</text>
            </view>
            <view class="row-start">
              <view class="success-rate">
                <!-- <u-icon name="trending-up" size="16" color="#27ae60"></u-icon> -->
                <text>成功率{{ record.success_rate }}</text>
              </view>
              <view class="difficulty">
                <u-icon name="star" size="16" color="#f39c12"></u-icon>
                <text>{{ record.difficulty }}</text>
              </view>
            </view>
          </view>

          <!-- 治疗包描述 -->
          <view class="package-description">
            <text>{{ record.description }}</text>
          </view>

          <!-- 价格和评分 -->
          <!-- <view class="price-rating-section">
            <view class="price-info">
              <text class="original-price" v-if="record.original_price">¥{{ record.original_price }}</text>
              <text class="current-price">¥{{ record.current_price }}</text>
            </view>
            <view class="rating-info">
              <u-icon name="star-fill" size="20" color="#FFB800"></u-icon>
              <text class="rating-score">{{ record.rating }}</text>
            </view>
          </view> -->

          <!-- 购买信息 -->
          <view class="purchase-info">
            <view class="info-row">
              <text class="label">购买日期：</text>
              <text class="value">{{ formatDate(record.purchase_date) }}</text>
            </view>
            <!-- <view class="info-row">
              <text class="label">有效期至：</text>
              <text class="value">{{ formatDate(record.expiry_date) }}</text>
            </view> -->
          </view>

          <!-- 操作按钮 -->
          <view class="card-actions">
            <button class="btn-action secondary" @click.stop="viewPackageDetail(record.package_id)">
              <u-icon name="eye" size="16" color="#666"></u-icon>
              <text>查看详情</text>
            </button>
            <button class="btn-action primary" @click.stop="startTreatment(record.id)">
              <u-icon name="play-circle" size="16" color="#fff"></u-icon>
              <text>开始使用</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="getCurrentList().length === 0" class="empty-state">
        <u-icon name="file-text" size="80" color="#ccc"></u-icon>
        <text class="empty-text">{{ getEmptyText() }}</text>
        <button v-if="activeTab === 'ongoing' || activeTab === 'unused'" class="btn-browse" @click="goToBrowse">
          <text>浏览治疗包</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MyTreatments',
  data() {
    return {
      activeTab: 'ongoing',
      loading: false,
      tabs: [
        { key: 'ongoing', label: '进行中', count: 0 },
        { key: 'completed', label: '已完成', count: 0 },
        { key: 'paused', label: '已暂停', count: 0 },
        { key: 'unused', label: '未使用', count: 0 }
      ],
      ongoingTreatments: [],
      completedTreatments: [],
      pausedTreatments: [],
      unusedTreatments: []
    }
  },
  onLoad() {
    this.loadTreatments();
  },
  onShow() {
    // 页面显示时刷新数据
    this.loadTreatments();
  },
  methods: {
    async loadTreatments() {
      this.loading = true;
      try {
        // 模拟数据 - 实际项目中调用API
        await this.simulateApiCall();

        // 更新标签计数
        this.tabs[0].count = this.ongoingTreatments.length;
        this.tabs[1].count = this.completedTreatments.length;
        this.tabs[2].count = this.pausedTreatments.length;
        this.tabs[3].count = this.unusedTreatments.length;
      } catch (error) {
        console.error('加载治疗记录失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    // 模拟API调用
    async simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.ongoingTreatments = [
            {
              id: '1',
              package_id: 'pkg1',
              package_name: '白粉病综合治疗包',
              plant: {
                id: 'p1',
                name: '客厅绿萝',
                image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
              },
              start_date: '2025-11-10',
              remaining_days: 12,
              current_step: 2,
              total_steps: 5,
              progress: 40,
              current_step_name: '中期巩固治疗'
            }
          ];

          this.completedTreatments = [
            {
              id: '2',
              package_id: 'pkg2',
              package_name: '黑腐病救治方案',
              plant: {
                id: 'p2',
                name: '办公室多肉',
                image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
              },
              start_date: '2025-10-01',
              end_date: '2025-10-21',
              duration: 21,
              rating: 5,
              effect: '显著改善',
              comment: '治疗效果非常好，植物完全恢复了健康'
            }
          ];

          this.pausedTreatments = [
            {
              id: '3',
              package_id: 'pkg3',
              package_name: '烂根抢救包',
              plant: {
                id: 'p3',
                name: '阳台发财树',
                image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
              },
              pause_date: '2025-11-05',
              current_step: 1,
              total_steps: 4
            }
          ];

          this.unusedTreatments = [
            {
              id: '4',
              package_id: 'pkg4',
              package_name: '白粉病综合治疗包',
              package_type: '专业治疗包',
              package_image: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg',
              course_days: 14,
              success_rate: '92%',
              difficulty: '简单',
              description: '针对白粉病的系统治疗方案，包含初期控制、中期治疗、后期巩固三个阶段，配套专业杀菌剂和营养液，14天疗程有效控制病情。适用于多种观叶植物的白粉病治疗。',
              original_price: '156.00',
              current_price: '128.00',
              rating: '4.8',
              purchase_date: '2025-11-15',
              expiry_date: '2026-05-15'
            },
            {
              id: '5',
              package_id: 'pkg5',
              package_name: '多肉植物专用营养包',
              package_type: '营养型',
              package_image: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg',
              course_days: 30,
              success_rate: '95%',
              difficulty: '简单',
              description: '多肉植物专用营养补充包，促进生长和着色，包含多种微量元素和生长调节剂。',
              current_price: '89.00',
              rating: '4.7',
              purchase_date: '2025-11-12',
              expiry_date: '2026-02-12'
            }
          ];

          resolve();
        }, 500);
      });
    },

    switchTab(tab) {
      this.activeTab = tab;
    },

    getCurrentList() {
      const listMap = {
        'ongoing': this.ongoingTreatments,
        'completed': this.completedTreatments,
        'paused': this.pausedTreatments,
        'unused': this.unusedTreatments
      };
      return listMap[this.activeTab] || [];
    },

    getEmptyText() {
      const textMap = {
        'ongoing': '暂无进行中的治疗',
        'completed': '暂无完成的治疗记录',
        'paused': '暂无暂停的治疗',
        'unused': '暂无未使用的治疗包'
      };
      return textMap[this.activeTab];
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    },

    goToProgress(recordId) {
      uni.navigateTo({
        url: `/pages-plants/plants/treatmentProgress/treatmentProgress?recordId=${recordId}`
      });
    },

    pauseTreatment(recordId) {
      uni.showModal({
        title: '暂停治疗',
        content: '确定要暂停这个治疗吗？可以随时恢复。',
        success: (res) => {
          if (res.confirm) {
            // 调用暂停API
            uni.showToast({
              title: '已暂停',
              icon: 'success'
            });
            this.loadTreatments();
          }
        }
      });
    },

    resumeTreatment(recordId) {
      uni.showModal({
        title: '恢复治疗',
        content: '确定要恢复这个治疗吗？',
        success: (res) => {
          if (res.confirm) {
            // 调用恢复API
            uni.showToast({
              title: '已恢复',
              icon: 'success'
            });
            this.loadTreatments();
          }
        }
      });
    },

    deleteTreatment(recordId) {
      uni.showModal({
        title: '删除治疗',
        content: '确定要删除这个治疗记录吗？此操作不可恢复。',
        confirmColor: '#e74c3c',
        success: (res) => {
          if (res.confirm) {
            // 调用删除API
            uni.showToast({
              title: '已删除',
              icon: 'success'
            });
            this.loadTreatments();
          }
        }
      });
    },

    rateCompleted(recordId) {
      uni.navigateTo({
        url: `/pages/treatment-rating/treatment-rating?recordId=${recordId}`
      });
    },

    viewDetails(recordId) {
      this.goToProgress(recordId);
    },

    repurchase(packageId) {
      uni.navigateTo({
        url: `/pages/treatment-package-detail/treatment-package-detail?id=${packageId}`
      });
    },

    viewPackageDetail(packageId) {
      uni.navigateTo({
        url: `/pages/treatment-package-detail/treatment-package-detail?id=${packageId}`
      });
    },

    startTreatment(recordId) {
      uni.showModal({
        title: '开始治疗',
        content: '请选择要治疗的植物，然后开始使用此治疗包。',
        success: (res) => {
          if (res.confirm) {
            // 跳转到选择植物页面
            uni.navigateTo({
              url: `/pages-plants/plants/selectPlant/selectPlant?packageId=${recordId}`
            });
          }
        }
      });
    },

    goToBrowse() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.row-start {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.my-treatments {
  min-height: 100vh;
  background: #f5f5f5;
}

.tabs {
  display: flex;
  background: white;
  padding: 0 40rpx;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tab-item {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx 0;
}

.tab-text {
  font-size: 30rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #27ae60;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: #27ae60;
  border-radius: 3rpx;
}

.tab-badge {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: #e74c3c;
  color: white;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

.treatment-list {
  padding: 40rpx;
}

.treatment-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.treatment-info {
  flex: 1;
}

.treatment-name {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  line-height: 1.2;
}

.plant-link {
  display: flex;
  align-items: center;
  padding: 8rpx 20rpx;
  background: #e8f5e9;
  border-radius: 20rpx;
}

.plant-link text {
  font-size: 24rpx;
  color: #27ae60;
  margin-left: 8rpx;
}

.package-type {
  display: flex;
  align-items: center;
  padding: 8rpx 20rpx;
  background: #f3e5f5;
  border-radius: 20rpx;
}

.package-type text {
  font-size: 24rpx;
  color: #9c27b0;
  margin-left: 8rpx;
}

.status-badge {
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.ongoing-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.completed-badge {
  background: #e8f5e9;
  color: #27ae60;
}

.paused-badge {
  background: #fff3e0;
  color: #e65100;
}

.unused-badge {
  background: #f3e5f5;
  color: #9c27b0;
}

.plant-image,
.package-image {
  margin-bottom: 24rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.time-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.time-item {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.time-item text {
  margin-left: 8rpx;
}

.time-item.remaining {
  color: #e65100;
  font-weight: 600;
}

.progress-section {
  margin-bottom: 24rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.progress-text {
  font-size: 26rpx;
  color: #666;
}

.progress-percent {
  font-size: 28rpx;
  font-weight: 600;
  color: #27ae60;
}

.progress-bar {
  width: 100%;
  height: 16rpx;
  background: #e0e0e0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background: #27ae60;
  border-radius: 8rpx;
}

.current-step-name {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.completion-info,
.pause-info,
.purchase-info {
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  font-size: 26rpx;
  color: #999;
}

.info-row .value {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
}

.package-description {
  padding: 24rpx;
  background: #fffbf0;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.rating-section {
  padding: 24rpx;
  background: #fffbf0;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.rating-stars {
  display: flex;
  margin-bottom: 16rpx;
}

.effect-label {
  display: block;
  font-size: 26rpx;
  color: #27ae60;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.comment-text {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.no-rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.no-rating text {
  font-size: 26rpx;
  color: #999;
}

.btn-rate {
  padding: 12rpx 32rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.card-actions {
  display: flex;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin-right: 16rpx;
}

.btn-action:last-child {
  margin-right: 0;
}

.btn-action text {
  margin-left: 8rpx;
}

.btn-action.primary {
  background: #27ae60;
  color: white;
}

.btn-action.secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-action.danger {
  background: #e74c3c;
  color: white;
}

.btn-action.warning {
  background: #f39c12;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin: 32rpx 0;
}

.btn-browse {
  padding: 24rpx 48rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.course-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.course-tag,
.success-rate,
.difficulty {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.course-tag text,
.success-rate text,
.difficulty text {
  margin-left: 8rpx;
}

.success-rate {
  color: #27ae60;
}

.difficulty {
  color: #f39c12;
}

.price-rating-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background: #fffbf0;
  border-radius: 12rpx;
}

.price-info {
  display: flex;
  align-items: center;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-right: 16rpx;
}

.current-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #e74c3c;
}

.rating-info {
  display: flex;
  align-items: center;
}

.rating-score {
  font-size: 26rpx;
  color: #666;
  margin-left: 8rpx;
  font-weight: 600;
}

.purchase-info {
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}
</style>