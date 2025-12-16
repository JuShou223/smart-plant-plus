<template>
  <view class="disease-records-page page-wrapper">
    <!-- 页面头部 -->
    <!-- <u-sticky zIndex="98" :customNavHeight="0">
      <view class="page-header">
        <button class="btn-back" @click="handleBack">
          <u-icon name="arrow-left" size="20" color="#333"></u-icon>
        </button>
        <text class="page-title">{{ plantName ? plantName + '的诊断记录' : '诊断记录' }}</text>
        <button class="btn-new btn-primary" @click="startNewDiagnosis">
          <text>+ 开始诊断</text>
        </button>
      </view>
    </u-sticky> -->

    <u-sticky zIndex="98" :customNavHeight="0">
      <u-navbar @leftClick="handleBack" :fixed="false" bgColor="#ffffff" leftText="诊断记录">
        <!-- <template slot="left">
          <h1>我的传感器</h1>
        </template> -->
        <template slot="right">
          <button class="btn-new btn-primary" @click="startNewDiagnosis">
            <text>+ 开始诊断</text>
          </button>
        </template>
      </u-navbar>
    </u-sticky>

    <!-- 加载状态 -->
    <view v-if="loading && records.length === 0" class="loading-container">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else class="page-content">
      <!-- 筛选标签 -->
      <view class="filter-tabs">
        <button v-for="status in statusFilters" :key="status.value" class="filter-tab"
          :class="{ active: currentFilter === status.value }" @click="handleFilterChange(status.value)">
          <text>{{ status.label }}</text>
        </button>
      </view>

      <!-- 空状态 -->
      <view v-if="records.length === 0 && !loading" class="empty-state">
        <view class="empty-icon">
          <u-icon name="file-text" size="80" color="#ddd"></u-icon>
        </view>
        <text class="empty-text">暂无诊断记录</text>
        <button class="btn btn-primary" @click="startNewDiagnosis">
          <text>开始诊断</text>
        </button>
      </view>

      <!-- 记录列表 -->
      <view v-else class="records-scroll">
        <view class="records-list">
          <view v-for="record in records" :key="record.id" class="record-card" @click="viewRecordDetail(record.id)">
            <view class="record-image">
              <image :src="record.diseaseImageUrl" width="240rpx" height="240rpx" mode="aspectFill"></image>
              <!-- <view class="confidence-badge">
                <text>{{ (record.confidence * 100).toFixed(0) }}%</text>
              </view> -->
            </view>

            <view class="record-info">
              <view class="record-header">
                <text class="record-title">{{ record.diseaseType }}</text>
                <view class="status-badge" :class="'status-' + statusMap[record.status]">
                  <text>{{ statusArr[record.status] }}</text>
                </view>
              </view>

              <text class="record-plant" v-if="record.plantName">
                植物:{{ record.plantName }}
              </text>

              <text class="record-diagnosis">{{ record.symptoms }}</text>

              <view class="record-footer">
                <text class="record-date">{{ record.createdTimeFormat }}</text>
                <button class="btn-detail" @click.stop="viewRecordDetail(record.id)">
                  <text>查看详情</text>
                  <u-icon name="arrow-right" size="16" color="#2ecc71"></u-icon>
                </button>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="total > pageSize && records.length > 0" style="padding: 24rpx 0">
          <u-loadmore :status="loadStatus" loading-text="努力加载中..." loadmoreText="轻轻上拉" nomoreText="没有更多了" marginTop="15"
            marginBottom="15" />
        </view>
      </view>
      <view class="fab-container">
        <button class="fab-diagnosis" @click="goToDiseaseLibrary">
          <image src="/static/common/hospital.png"></image>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { getDiseaseRecords } from '@/apis/modules/disease';

export default {
  name: 'DiseaseRecords',
  data() {
    return {
      loading: false,
      loadingMore: false,
      records: [],
      currentFilter: -1,
      plantId: null,
      plantName: '',
      statusFilters: [
        { label: '全部', value: -1 },
        { label: '已诊断', value: 0 },
        { label: '治疗中', value: 1 },
        { label: '已治愈', value: 2 }
      ],
      // 分页相关
      pageNum: 1,
      pageSize: 10,
      total: 0,
      noMore: false,
      loadStatus: 'loadmore',
      statusMap: ['diagnosed', 'treating', 'cured'],
      statusArr: ['已诊断', '治疗中', '已治愈']
    };
  },
  onLoad(options) {
    if (options.plantId) {
      this.plantId = options.plantId;
    }
    this.loadRecords();
  },
  onReachBottom() {
    this.loadMore()
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },

    // 开始新诊断
    startNewDiagnosis() {
      let url = '/pages-plants/plants/plantsDiagnose/plantsDiagnose';
      if (this.plantId) {
        url += `?plantId=${this.plantId}`;
      }
      uni.navigateTo({
        url: url
      });
    },

    // 切换筛选条件
    handleFilterChange(status) {
      if (this.currentFilter === status) return;
      this.currentFilter = status;
      this.resetPagination();
      this.loadRecords();
    },

    // 重置分页
    resetPagination() {
      this.pageNum = 1;
      this.records = [];
      this.noMore = false;
    },

    // 加载诊断记录
    async loadRecords() {
      // 如果是第一页,显示主加载状态
      if (this.pageNum === 1) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }

      try {
        const response = await getDiseaseRecords({
          status: this.currentFilter === -1 ? null : this.currentFilter,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });

        if (response.code === 200) {
          const newRecords = response.rows || [];

          // 第一页替换数据,后续页追加数据
          if (this.pageNum === 1) {
            this.records = newRecords.map(item => {
              return {
                createdTimeFormat: this.formatDate(item.createdTime),
                ...item
              }
            });
          } else {
            this.records = [...this.records, ...newRecords];
          }

          // 更新总数
          this.total = response.total || 0;

          // 判断是否还有更多数据
          this.noMore = this.records.length >= this.total;

          this.loadStatus = this.noMore ? 'nomore' : 'loadmore'

          // 设置植物名称(仅第一页需要)
          if (this.plantId && this.pageNum === 1 && this.records.length > 0 && this.records[0].user_plants) {
            const plant = this.records[0].user_plants;
            this.plantName = plant.nickname || (plant.plant_database && plant.plant_database.name) || '';
          }
        } else {
          if (this.pageNum === 1) {
            this.records = [];
          }
          uni.showToast({
            title: response.msg || '加载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载诊断记录失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        });
        if (this.pageNum === 1) {
          this.records = [];
        }
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    // 加载更多
    loadMore() {
      console.log('loadmore')
      // 如果正在加载或没有更多数据,则不执行
      if (this.loadingMore || this.noMore || this.loading) {
        return;
      }

      // 页码加1,加载下一页
      this.pageNum++;
      this.loadRecords();
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.resetPagination();
      this.loadRecords().then(() => {
        uni.stopPullDownRefresh();
      });
    },

    // 查看记录详情
    viewRecordDetail(recordId) {
      uni.navigateTo({
        url: `/pages-plants/plants/diseaseRecordsDetail/diseaseRecordsDetail?id=${recordId}`
      });
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
          const minutes = Math.floor(diff / (1000 * 60));
          return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
        }
        return `${hours}小时前`;
      } else if (days === 1) {
        return '昨天';
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    },

    // 获取状态类名
    // getStatusName(status) {
    //   const statusArr = ['已诊断', '治疗中', '已治愈'];
    //   return statusArr[status];
    // },
    // getStatusClass(status) {
    //   const statusMap = {
    //     '诊断中': 'pending',
    //     '已诊断': 'diagnosed',
    //     '治疗中': 'treating',
    //     '已治愈': 'cured'
    //   };
    //   return statusMap[this.getStatusName(status)] || 'pending';
    // },
    goToDiseaseLibrary() {
      uni.navigateTo({
        url: '/pages-plants/plants/treatmentRecords/treatmentRecords'
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.disease-records-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
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

.btn-new {
  padding: 12rpx 24rpx;
  background-color: transparent;
  border: none;
  font-size: 24rpx;
  border-radius: 24rpx;
}


.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
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

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filter-tabs {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  background-color: #fff;
  overflow-x: auto;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-tab {
  padding: 16rpx 32rpx;
  background-color: transparent;
  border: 1rpx solid #ddd;
  border-radius: 40rpx;
  color: #666;
  font-size: 28rpx;
  white-space: nowrap;
  transition: all 0.2s ease;
  margin-right: 10rpx;
}

.filter-tab.active {
  background-color: #2ecc71;
  border-color: #2ecc71;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 30rpx;
  text-align: center;
  min-height: 400rpx;
}

.empty-icon {
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #2ecc71 0%, #00c896 100%);
  color: #fff;
}

.records-scroll {
  flex: 1;
  height: 100%;
  padding: 30rpx;
}

.records-list {
  display: flex;
  flex-direction: column;
}

.record-card {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  align-items: center;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 30rpx;
}

.record-card:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.record-image {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
  margin-left: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.record-image image {
  width: 100%;
  height: 100%;
}

.confidence-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.record-info {
  flex: 1;
  padding: 26rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 8rpx;
}

.record-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-badge.status-pending {
  background-color: rgba(158, 158, 158, 0.1);
  color: #999;
}

.status-badge.status-diagnosed {
  background-color: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.status-badge.status-treating {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.status-badge.status-cured {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.record-plant {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.record-diagnosis {
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 20rpx;
}

.record-date {
  font-size: 24rpx;
  color: #999;
}

.btn-detail {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background-color: transparent;
  border: none;
  color: #2ecc71;
  font-size: 26rpx;
}

.load-more-container {
  padding: 0 40rpx 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-more {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.loading-more-text {
  font-size: 26rpx;
  color: #999;
}

.no-more-text {
  font-size: 26rpx;
  color: #999;
}


.fab-container {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.fab-records {
  width: 128rpx;
  height: 128rpx;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(33, 150, 243, 0.4);
  margin-bottom: 32rpx;
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

.fab-icon {
  font-size: 24px;
  color: white;
}
</style>