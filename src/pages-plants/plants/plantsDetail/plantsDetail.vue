<template>
  <view class="plant-detail-page page-wrapper">
    <!-- 页面头部 -->
    <!-- <u-sticky zIndex="98" :customNavHeight="0">
      <view class="page-header">
        <button class="btn-back" @click="handleBack">
          <u-icon name="arrow-left" size="20" color="#333"></u-icon>
        </button>
        <text class="page-title">植物详情</text>
        <button v-if="plant" class="btn-more" @click="showMenu = !showMenu">
          <u-icon name="more-dot-fill" size="20" color="#333"></u-icon>
        </button>
        <button v-else class="btn-back">
        </button>
      </view>
    </u-sticky> -->

    <u-sticky zIndex="98" :customNavHeight="0">
      <view>
        <u-navbar @leftClick="handleBack" :fixed="false" bgColor="#ffffff" title="植物详情">
          <template slot="right">
            <button v-if="plant" class="btn-more" @click="showMenu = !showMenu">
              <u-icon name="more-dot-fill" size="20" color="#333"></u-icon>
            </button>
          </template>
        </u-navbar>
        <hTabs></hTabs>
      </view>
    </u-sticky>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <u-loading-icon></u-loading-icon>
    </view>

    <!-- 页面内容 -->
    <view v-else-if="plant" class="page-content">
      <!-- 植物头部信息 -->
      <view class="plant-header">
        <view class="plant-image-large">
          <u-image :src="getPlantImage(plant)" width="100%" height="600rpx" mode="aspectFill" radius="16"></u-image>
        </view>
        <view class="plant-basic-info">
          <text class="plant-name">{{ plant.plantName }}</text>
          <text v-if="plant.plant_database" class="plant-type">{{ plant.plant_database.plantName }}</text>
          <StatusList :statuses="plantStatuses" class="plant-detail-statuses" />
        </view>
      </view>

      <!-- 基本信息卡片 -->
      <view class="info-cards">
        <view class="info-card">
          <view class="info-icon">
            <u-icon name="calendar" size="24" color="#2ecc71"></u-icon>
          </view>
          <view class="info-content">
            <text class="info-label">购买日期</text>
            <text class="info-value">{{ plant.purchaseDate || '未记录' }}</text>
          </view>
        </view>

        <view class="info-card">
          <view class="info-icon">
            <u-icon name="map" size="24" color="#2ecc71"></u-icon>
          </view>
          <view class="info-content">
            <text class="info-label">摆放位置</text>
            <text class="info-value">{{ plant.location || '未设置' }}</text>
          </view>
        </view>
      </view>

      <!-- 传感器监测 -->
      <SensorMonitor v-if="plant" ref="sensorMonitor" :sensorList="plant.sensorList" :plantId="plantId"
        @update="handleSensorUpdate" />

      <!-- 诊断记录 -->
      <view class="diagnosis-section">
        <view class="section-header">
          <text class="section-title">诊断记录</text>
          <button v-if="diseaseRecords.length > 0" class="btn-view-all" @click="viewAllDiseaseRecords">
            <text>查看全部</text>
            <u-icon name="arrow-right" size="14" color="#2ecc71"></u-icon>
          </button>
        </view>

        <view v-if="diseaseRecords.length === 0" class="empty-diagnosis">
          <view class="empty-icon">🔬</view>
          <text class="empty-text">暂无诊断记录</text>
        </view>

        <view v-else class="diagnosis-list">
          <view v-for="record in diseaseRecords" :key="record.id" class="diagnosis-card"
            @click="viewDiseaseRecord(record.id)">
            <view class="diagnosis-image">
              <u-image :src="record.diseaseImageUrl" width="160rpx" height="160rpx" mode="aspectFill"
                radius="8"></u-image>
              <!-- <view class="confidence-badge">
                {{ (record.confidence * 100).toFixed(0) }}%
              </view> -->
            </view>
            <view class="diagnosis-info">
              <view class="diagnosis-header">
                <text class="diagnosis-title">{{ record.diseaseType }}</text>
                <view class="status-badge-small" :class="'status-' + statusMap[record.status]">
                  <text>{{ statusArr[record.status] }}</text>
                </view>
              </view>
              <text class="diagnosis-date">{{ record.createdTime }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 治疗状态卡片 -->
      <TreatmentProgress></TreatmentProgress>

      <!-- 养护记录 -->
      <view class="care-history">
        <text class="section-title">养护记录</text>
        <view v-if="careRecords.length === 0" class="empty-records">
          <text class="empty-text">暂无养护记录</text>
        </view>
        <view v-else :key="careRecords.length" class="history-timeline">
          <view v-for="record in careRecords" :key="record.id" class="timeline-item">
            <view class="timeline-dot" :class="'dot-' + classesMap[record.care_type]"></view>
            <view class="timeline-content">
              <view class="timeline-header">
                <text class="timeline-action">
                  <text class="care-type-icon">{{ iconsMap[record.care_type] }}</text>
                  {{ record.care_type }}
                </text>
                <text class="timeline-date">{{ record.maintenanceTime }}</text>
              </view>
              <text v-if="record.remark" class="timeline-notes">{{ record.remark }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 养护指南 -->
      <view v-if="plant.plant_database" class="care-guide">
        <text class="section-title">养护指南</text>
        <view class="guide-grid">
          <view class="guide-item">
            <view class="guide-icon">☀️</view>
            <text class="guide-label">光照需求</text>
            <text class="guide-value">{{ plant.plant_database.lightRequirement || '适中' }}</text>
          </view>
          <view class="guide-item">
            <view class="guide-icon">💧</view>
            <text class="guide-label">浇水频率</text>
            <text class="guide-value">{{ plant.plant_database.wateringMethod || '每周' }}</text>
          </view>
          <view class="guide-item">
            <view class="guide-icon">💊</view>
            <text class="guide-label">施肥</text>
            <text class="guide-value">{{ plant.plant_database.fertilizingMethod || '15-25℃' }}</text>
          </view>
          <view class="guide-item">
            <view class="guide-icon">✂️</view>
            <text class="guide-label">修剪要求</text>
            <text class="guide-value">{{ plant.plant_database.pruningMethod || '适中' }}</text>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view v-if="plant.remark" class="notes-section">
        <text class="section-title">备注</text>
        <text class="notes-text">{{ plant.remark }}</text>
      </view>

      <!-- 悬浮按钮 -->
      <view class="fab-container">
        <view v-if="showFab" class="fab-overlay" @click="showFab = false"></view>
        <transition name="fab-items">
          <view v-if="showFab" class="fab-items">
            <view class="fab-item" @click="recordCare">
              <text class="fab-label">记录养护</text>
              <button class="fab-button fab-care">
                <u-icon name="checkmark" size="20" color="#fff"></u-icon>
              </button>
            </view>
            <view class="fab-item" @click="viewAllDiseaseRecords">
              <text class="fab-label">诊断历史</text>
              <button class="fab-button fab-history">
                <u-icon name="file-text" size="20" color="#fff"></u-icon>
              </button>
            </view>
            <view class="fab-item" @click="startDiagnosis">
              <text class="fab-label">健康诊断</text>
              <button class="fab-button fab-diagnosis">
                <u-icon name="info-circle" size="20" color="#fff"></u-icon>
              </button>
            </view>
          </view>
        </transition>
        <button class="fab-main" @click="showFab = !showFab" :class="{ active: showFab }">
          <u-icon :name="showFab ? 'close' : 'plus'" size="24" color="#fff"></u-icon>
        </button>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <view class="empty-illustration">
        <image
          src="https://xym-test.oss-cn-beijing.aliyuncs.com/ChatGPT%20Image%202025%E5%B9%B411%E6%9C%887%E6%97%A5%2011_112_34_%E5%89%AF%E6%9C%AC.png"
          width="200" height="200" mode="aspectFit">
          <!-- <template v-slot:error>
							<text class="empty-placeholder">🌱</text>
						</template> -->
        </image>
      </view>
      <text class="empty-title">植物不存在或者植物已被删除</text>
      <!-- <text class="empty-description">点击下方添加您的第一个植物</text>
      <button class="btn-add-first" @click="handleAddPlant">
        <u-icon name="plus" color="#fff" size="16"></u-icon>
        <text class="btn-text">添加新植物</text>
      </button> -->
    </view>

    <!-- 操作菜单 -->
    <u-popup :show="showMenu" @close="showMenu = false" mode="bottom" round="20">
      <view class="action-menu">
        <view class="menu-content">
          <button class="menu-item" @click="editPlant">
            <u-icon name="edit-pen" size="20" color="#333"></u-icon>
            <text>编辑信息</text>
          </button>
          <button class="menu-item danger" @click="deletePlant">
            <u-icon name="trash" size="20" color="#f56c6c"></u-icon>
            <text>删除植物</text>
          </button>
        </view>
      </view>
    </u-popup>

    <!-- 记录养护弹窗 -->
    <RecordCareModal :show="showCareModal" :plant="plant" @close="showCareModal = false" @success="handleCareSuccess" />
  </view>
</template>

<script>
import {
  getPlantDetail,
  // getPlantStatus,
  getCareRecords,
  deletePlant,
  getPlantDatabaseById,
} from '@/apis/modules/plants';
import { getPlantDiseaseRecord } from '@/apis/modules/disease';
import TreatmentProgress from '../components/treatmentProgress.vue';
import RecordCareModal from '../components/recordCareModal.vue';
import StatusList from '../components/statusList.vue';
import SensorMonitor from '../components/sensorMonitor.vue';

export default {
  name: 'PlantDetail',
  components: {
    RecordCareModal,
    StatusList,
    SensorMonitor,
    TreatmentProgress
  },
  data() {
    return {
      careTypes: ['浇水', '施肥', '修剪', '换盆'],
      plant: null,
      plantStatuses: [
        // {
        //   id: "status_002",
        //   user_plant_id: "user_plant_002",
        //   status_type: "缺光",
        //   severity: "严重",
        //   trigger_source: "传感器",
        //   sensor_value: 15,
        //   threshold_value: 30,
        //   description: "缺少光照",
        //   is_resolved: false,
        //   started_at: "2025-11-09T08:00:00Z",
        // },
      ],
      careRecords: [],
      diseaseRecords: [],
      allSensorBindings: [],
      sensorReadings: {},
      sensorThreshold: null,
      loading: true,
      showMenu: false,
      showCareModal: false,
      showFab: false,
      showBindDeviceModal: false,
      showSensorManagement: false,
      availableDevices: [],
      loadingDevices: false,
      isPageHided: false,
      statusMap: ['diagnosed', 'treating', 'cured'],
      statusArr: ['已诊断', '治疗中', '已治愈'],
      classesMap: {
        '浇水': 'water',
        '施肥': 'fertilize',
        '修剪': 'prune',
        '换盆': 'repot'
      },
      iconsMap: {
        '浇水': '💧',
        '施肥': '🌱',
        '修剪': '✂️',
        '换盆': '🪴'
      }
    }
  },
  onLoad(options) {
    // console.log('PlantDetail onLoad options:', options);
    if (options.plantId) {
      this.plantId = options.plantId;
      this.loadPlantData();
    }
    uni.$on('refreshPlantDetail', this.loadPlant)
  },
  onUnload() {
    // console.log('卸载')
    if (this.$refs.sensorMonitor) {
      this.$refs.sensorMonitor.mqttUnSubscribe();
    }
  },
  onShow() {
    if (this.$refs.sensorMonitor) {
      this.$refs.sensorMonitor.mqttSubscribe();
    }
  },
  onHide() {
    if (this.$refs.sensorMonitor) {
      this.$refs.sensorMonitor.mqttUnSubscribe();
    }
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },

    // 获取植物图片
    getPlantImage(plant) {
      if (plant.plantImage) {
        return plant.plantImage;
      }
      return plant.plantImage
    },

    // 加载植物数据
    async loadPlantData() {
      try {
        // await Promise.all([
        await this.loadPlant()
        // await this.loadPlantStatuses()
        await this.loadCareRecords()
        await this.loadDiseaseRecords()
        // ]);
      } catch (error) {
        console.error('加载植物数据失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    async loadPlant() {
      try {
        const response = await getPlantDetail(this.plantId, false);
        console.log('加载植物详情响应:', response);
        if (response.code === 200) {
          this.plant = response.data;
          const plantDataBase = await getPlantDatabaseById(this.plant.plantType);
          if (plantDataBase.code === 200) {
            this.plant.plant_database = plantDataBase.data
          }
          this.loadPlantStatuses()
          // console.log('plantDataBase', plantDataBase)
        }
      } catch (error) {
        console.error('加载植物详情失败:', error);
      }
    },

    async loadPlantStatuses() {
      const plantStatuses = this.plant.plantStatus.split(',')
      const weakStatuses = plantStatuses.filter(item => item != '健康')
      if (weakStatuses.length > 0) {
        this.plantStatuses = weakStatuses.map(item => ({
          name: item,
          type: 'bad'
        }))
      } else {
        this.plantStatuses = plantStatuses.map(item => ({
          name: item,
          type: 'good'
        }))
      }
      // this.plantStatuses = this.plant.pla
      // try {
      //   const response = await getPlantStatus(this.plantId);
      //   console.log('加载植物状态响应:', response);
      //   if (response.code === 200) {
      //     this.plantStatuses = response.data;
      //   } else {
      //     this.plantStatuses = [{
      //       status_type: '健康',
      //       severity: '中等'
      //     }];
      //   }
      // } catch (error) {
      //   console.error('加载植物状态失败:', error);
      //   this.plantStatuses = [{
      //     status_type: '健康',
      //     severity: '中等'
      //   }];
      // }
    },

    async loadCareRecords() {
      try {
        const response = await getCareRecords(this.plantId, { 'plantId': this.plantId, pageNum: 1, pageSize: 10 });
        console.log('加载养护记录响应:', response);
        if (response.code === 200) {
          this.careRecords = response.rows.map(item => {
            item.care_type = this.careTypes[item.maintenanceType]
            item.maintenanceTime = this.formatDateTime(item.maintenanceTime)
            return item
          });
          console.log('this.careRecords===', this.careRecords)
        }
      } catch (error) {
        console.error('加载养护记录失败:', error);
      }
    },

    async loadDiseaseRecords() {
      try {
        // const userId = this.plant.user_id;
        const response = await getPlantDiseaseRecord(this.plantId);
        console.log('加载诊断记录响应:', response);
        if (response.code === 200) {
          this.diseaseRecords = response.data.slice(0, 3).map(item => {
            return {
              createdTime: this.formatDateTime(item.createdTime),
              ...item
            }
          });
        }
      } catch (error) {
        console.error('加载诊断记录失败:', error);
      }
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '未记录';
      const d = new Date(date);
      const now = new Date();
      const diff = now - d;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days === 0) {
        if (hours === 0) return '刚刚';
        return `${hours}小时前`;
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return `${d.getMonth() + 1}月${d.getDate()}日`;
      }
    },

    // 获取养护类型图标
    getCareTypeIcon(type) {
      const icons = {
        '浇水': '💧',
        '施肥': '🌱',
        '修剪': '✂️',
        '换盆': '🪴'
      };
      return icons[type] || '🌿';
    },

    getCareTypeClass(type) {
      const classes = {
        '浇水': 'water',
        '施肥': 'fertilize',
        '修剪': 'prune',
        '换盆': 'repot'
      };
      return classes[type] || 'default';
    },

    // 记录养护
    recordCare() {
      this.showCareModal = true;
      this.showFab = false;
    },

    // 养护记录成功
    async handleCareSuccess() {
      await Promise.all([
        this.loadPlant(),
        // this.loadPlantStatuses(),
        this.loadCareRecords()
      ]);
      // 刷新传感器数据
      // if (this.$refs.sensorMonitor) {
      //   this.$refs.sensorMonitor.getDevice();
      // }
    },

    async handleSensorUpdate() {
      // 传感器数据更新后,可以选择刷新植物状态等
      // this.loadPlantStatuses();
      await this.loadPlant()
      // if (this.$refs.sensorMonitor) {
      //   this.$refs.sensorMonitor.getDevice()
      // }
    },


    // 查看诊断记录
    viewDiseaseRecord(recordId) {
      uni.navigateTo({
        url: `/pages-plants/plants/diseaseRecordsDetail/diseaseRecordsDetail?id=${recordId}`
      });
    },

    // 查看所有诊断记录
    viewAllDiseaseRecords() {
      uni.navigateTo({
        url: `/pages-plants/plants/diseaseRecords/diseaseRecords?plantId=${this.plant.id}`
      });
      this.showFab = false;
    },

    // 开始诊断
    startDiagnosis() {
      uni.navigateTo({
        url: `/pages-plants/plants/plantsDiagnose/plantsDiagnose?plantId=${this.plant.id}`
      });
      this.showFab = false;
    },

    // 获取疾病状态类名
    // getDiseaseStatusClass(status) {
    //   const statusMap = {
    //     '诊断中': 'pending',
    //     '已诊断': 'diagnosed',
    //     '治疗中': 'treating',
    //     '已治愈': 'cured'
    //   };
    //   return statusMap[status] || 'pending';
    // },
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
    // 编辑植物
    editPlant() {
      uni.navigateTo({
        url: `/pages-plants/plants/addPlants/addPlants?mode=edit&plantId=${this.plant.id}`
      });
      this.showMenu = false;
    },

    // 删除植物
    async deletePlant() {
      this.showMenu = false;
      try {
        const confirmResult = await new Promise((resolve) => {
          uni.showModal({
            title: '确认删除',
            content: '确定要删除这株植物吗？',
            success: (res) => resolve(res.confirm)
          });
        });

        if (!confirmResult) return;

        const response = await deletePlant(this.plantId);
        if (response.code === 200) {
          uni.$emit('refreshPlantList');
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error('删除失败:', error);
        uni.showToast({
          title: '删除失败',
          icon: 'error'
        });
      }
    },

  }
};
</script>

<style lang="scss" scoped>
.plant-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  animation: statusPulse 2s ease-in-out infinite;
}

button {
  cursor: pointer;
  outline: none;
  border: none;
  background: none;
  margin: 0;
  line-height: 1;
}

button:after {
  content: "";
  border: none;
  outline: none;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.btn-back,
.btn-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  background-color: transparent;
  border: none;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;
}

.page-content {
  padding-bottom: 120rpx;
}

.plant-header {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.plant-image-large {
  width: 100%;
  height: 600rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
}

.plant-basic-info {
  text-align: center;
}

.plant-name {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.plant-type {
  display: block;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.plant-detail-statuses {
  justify-content: center;
  min-height: 64rpx;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.info-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  color: #2ecc71;
  margin-right: 10rpx;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.info-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.care-history,
.diagnosis-section,
.sensor-section,
.care-guide,
.notes-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 0 30rpx 30rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.btn-view-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: transparent;
  border: none;
  color: #2ecc71;
  font-size: 28rpx;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.timeline-item {
  display: flex;
  flex-direction: row;
}

.timeline-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  margin-top: 12rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.timeline-content {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-action {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.timeline-date {
  font-size: 24rpx;
  color: #999;
}

.timeline-notes {
  font-size: 26rpx;
  color: #999;
  margin-top: 16rpx;
  line-height: 1.5;
}

.care-type-icon {
  margin-right: 8rpx;
}

.empty-records,
.empty-diagnosis {
  text-align: center;
  padding: 60rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: 20rpx;
}

.dot-water {
  background-color: #2196F3;
}

.dot-fertilize {
  background-color: #4CAF50;
}

.dot-prune {
  background-color: #FF9800;
}

.dot-repot {
  background-color: #9C27B0;
}

.care-guide {
  .guide-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;
  }

  .guide-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 30rpx 20rpx;
    background-color: #f8f8f8;
    border-radius: 16rpx;
  }

  .guide-icon {
    font-size: 64rpx;
    margin-bottom: 16rpx;
  }

  .guide-label {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
  }

  .guide-value {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }
}

.diagnosis-list {
  display: flex;
  flex-direction: column;
}

.diagnosis-card {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.diagnosis-image {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.confidence-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.diagnosis-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.diagnosis-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.status-badge-small {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-badge-small.status-pending {
  background-color: rgba(158, 158, 158, 0.1);
  color: #999;
}

.status-badge-small.status-diagnosed {
  background-color: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.status-badge-small.status-treating {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.status-badge-small.status-cured {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.diagnosis-date {
  font-size: 24rpx;
  color: #999;
}

.notes-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #666;
}

.fab-container {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  z-index: 999;
}

.fab-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

.fab-main {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(60, 156, 255, 0.4);
  position: relative;
  z-index: 999;
}

.fab-items {
  position: absolute;
  bottom: 140rpx;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  z-index: 1001;
}

.fab-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.fab-label {
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  margin-right: 24rpx;
  font-size: 26rpx;
  white-space: nowrap;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.fab-button {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.25);
}

.fab-care {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.fab-history {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.fab-diagnosis {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.action-menu {
  background-color: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 30rpx;
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 30rpx;
  background-color: transparent;
  border: none;
  border-radius: 16rpx;
  color: #333;
  font-size: 30rpx;
}

.menu-item.danger {
  color: #f56c6c;
}

/* 样式3: 呼吸式内阴影 */
.breathe-shadow {
  animation: breatheShadow 2s ease-in-out infinite;
}

@keyframes breatheShadow {

  0%,
  100% {
    box-shadow: inset 0 0 20rpx rgba(255, 0, 0, 0.1);
  }

  50% {
    box-shadow: inset 0 0 60rpx rgba(255, 0, 0, 5);
  }
}

/* 样式2: 闪烁警告 */
.blink-shadow {
  animation: blinkShadow 1s ease-in-out infinite;
}

@keyframes blinkShadow {

  0%,
  49% {
    box-shadow: inset 0 0 0 rgba(255, 0, 0, 0);
  }

  50%,
  100% {
    box-shadow: inset 0 0 100rpx rgba(255, 0, 0, 0.45);
  }
}


/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200rpx);
}

.empty-illustration {
  margin-bottom: 40rpx;
}

.empty-placeholder {
  font-size: 120rpx;
  line-height: 200rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #999;
  margin-bottom: 20rpx;
}

.empty-description {
  font-size: 28rpx;
  color: #ccc;
  margin-bottom: 60rpx;
}

.btn-add-first {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 24rpx 48rpx;
  line-height: 1;
  background: #2ecc71;
  border-radius: 50rpx;
  border: none;
  box-shadow: 0 8rpx 20rpx rgba(60, 156, 255, 0.3);
}

.btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}
</style>