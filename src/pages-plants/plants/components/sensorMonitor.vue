<template>
  <view class="sensor-monitor">
    <!-- 传感器监测区域 -->
    <view class="sensor-section">
      <view class="section-header">
        <text class="section-title">传感器监测</text>
        <button v-if="devices.length > 0" class="btn-view-all" @click="showSensorManagement = true">
          <text>管理设备</text>
          <u-icon name="arrow-right" size="14" color="#2ecc71"></u-icon>
        </button>
      </view>

      <!-- 有传感器设备 -->
      <view v-if="devices.length > 0">
        <view v-for="binding in devices" :key="binding.id" class="sensor-card"
          @click="handleViewSensor(binding.deviceId)">
          <view class="sensor-status">
            <view :class="['status-dot', binding.status == 3 ? 'online' : 'offline']"></view>
            <view class="device-name">{{ binding.deviceName }}</view>
            <view class="device-status">
              <text :class="['status-badge', binding.status == 3 ? 'online' : 'offline']">
                {{ DEVICE_STATUS_MAP[binding.status] }}
              </text>
            </view>
          </view>

          <view class="sensor-readings">
            <view class="reading-item" v-for="model in binding.thingsModels" :key="model.id">
              <view class="reading-data">
                <text class="reading-label">{{ model.name }}</text>
                <text class="reading-value">{{ model.shadow || 0 }}{{ model.datatype.unit }}</text>
              </view>
            </view>

            <view class="reading-time">
              {{ getLatestTime(binding) }}更新
            </view>
          </view>
        </view>

        <button class="btn-add-more-sensor" @click="openBindDeviceModal">
          <u-icon name="plus" size="16" color="#2ecc71"></u-icon>
          <text>绑定更多设备</text>
        </button>
      </view>

      <!-- 无传感器设备 -->
      <view v-else class="sensor-prompt">
        <view class="prompt-icon">📡</view>
        <text class="prompt-title">添加传感器实时监测</text>
        <text class="prompt-desc">连接土壤湿度传感器,实时了解植物状态</text>
        <view class="sensor-action-buttons">
          <button @click="openBindDeviceModal" class="btn-add-sensor btn-primary">
            <text>绑定已有设备</text>
          </button>
          <button @click="showAddDeviceModal = true" class="btn-add-sensor btn-secondary">
            <text>添加新设备</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 添加新设备弹窗 -->
    <u-popup :show="showAddDeviceModal" @close="showAddDeviceModal = false" mode="bottom" round="20">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">添加传感器设备</text>
          <view class="btn-close" @click="showAddDeviceModal = false">
            <u-icon name="close" size="20" color="#666"></u-icon>
          </view>
        </view>

        <view class="modal-body">
          <form @submit.prevent="addDevice">
            <view class="form-group">
              <text class="label">设备编码 *</text>
              <u-input v-model="newDevice.device_code" required placeholder="请输入设备编号" class="form-input" />
            </view>

            <view class="form-actions">
              <button type="button" @click="showAddDeviceModal = false" class="btn btn-secondary">取消</button>
              <button type="submit" @click="addDevice" :disabled="submitting" class="btn btn-primary">
                {{ submitting ? '添加中...' : '添加设备' }}
              </button>
            </view>
          </form>
        </view>
      </view>
    </u-popup>

    <!-- 绑定设备弹窗 -->
    <u-popup :show="showBindDeviceModal" @close="showBindDeviceModal = false" mode="bottom" round="20">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">绑定传感器设备</text>
          <view class="btn-close" @click="showBindDeviceModal = false">
            <u-icon name="close" size="20" color="#666"></u-icon>
          </view>
        </view>

        <view class="modal-body">
          <view v-if="loadingDevices" class="loading-state">
            <u-loading-icon></u-loading-icon>
            <text>加载设备中...</text>
          </view>

          <view v-else-if="availableDevices.length === 0" class="empty-state">
            <view class="empty-icon">📡</view>
            <text class="empty-title">暂无可用设备</text>
            <text class="empty-hint">请先添加传感器设备</text>
            <button @click="handleAddNewDevice" class="btn btn-primary">添加新设备</button>
          </view>

          <scroll-view v-else class="devices-scroll" scroll-y @scrolltolower="onScrollToLower" lower-threshold="100">
            <view class="devices-list">
              <view v-for="device in availableDevices" :key="device.id" class="device-item"
                @click="bindDeviceToPlant(device)">
                <view class="device-icon">
                  <u-icon name="grid" size="28" color="#fff"></u-icon>
                </view>
                <view class="device-info">
                  <view class="device-name">{{ device.deviceName }}</view>
                  <text class="device-code">{{ device.serialNumber }}</text>
                </view>
                <view class="device-status">
                  <view :class="['status-badge', device.status === 3 ? 'online' : 'offline']">
                    <text>{{ DEVICE_STATUS_MAP[device.status] }}</text>
                  </view>
                </view>
              </view>

              <!-- 加载中状态 -->
              <view v-if="loadingMore" class="loading-more">
                <u-loading-icon size="24"></u-loading-icon>
                <text>加载中...</text>
              </view>

              <!-- 没有更多数据 -->
              <view v-if="!hasMore && availableDevices.length > 0 && pagination.pageNum > 1" class="no-more">
                <text>没有更多设备了</text>
              </view>
            </view>
          </scroll-view>
          <button class="btn btn-primary btn-block" @click="handleAddNewDevice">
            <u-icon name="plus" size="16" color="#fff"></u-icon>
            <text>添加新设备</text>
          </button>
        </view>
      </view>
    </u-popup>

    <!-- 管理设备弹窗 -->
    <u-popup :show="showSensorManagement" @close="showSensorManagement = false" mode="bottom" round="20">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">管理传感器设备</text>
          <view class="btn-close" @click="showSensorManagement = false">
            <u-icon name="close" size="20" color="#666"></u-icon>
          </view>
        </view>

        <view class="modal-body">
          <view class="management-list">
            <view v-for="binding in devices" :key="binding.id" class="management-item">
              <view class="device-icon">
                <u-icon name="grid" size="28" color="#fff"></u-icon>
              </view>
              <view class="device-info">
                <view class="device-name">{{ binding.deviceName }}</view>
                <view :class="['status-badge-small', binding.status === 3 ? 'online' : 'offline']">
                  <text>{{ DEVICE_STATUS_MAP[binding.status] }}</text>
                </view>
              </view>
              <view class="device-actions">
                <view class="btn-icon" @click="handleViewSensor(binding.deviceId)">
                  <u-icon name="eye" size="18" color="#666"></u-icon>
                </view>
                <view class="btn-icon danger" @click="unbindDevice(binding)">
                  <u-icon name="trash" size="18" color="#f56c6c"></u-icon>
                </view>
              </view>
            </view>
          </view>

          <button class="btn btn-primary btn-block" @click="handleAddMoreDevice">
            <u-icon name="plus" size="16" color="#fff"></u-icon>
            <text>添加更多设备</text>
          </button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {
  // getPlantAllBindings,
  // getLatestReading,
  // getThreshold,
  getUserDevices,
  bindDevice,
  bindPlant
} from '@/apis/modules/sensors';
// import projectConfig from '@/env.config.js';
import { DEVICE_STATUS_MAP } from '@/common/constants';
import { getRunningStatus, cacheJsonThingsModel, getDevice } from '@/apis/modules/device';
import { serviceInvoke } from '@/apis/modules/runtime.js';

export default {
  name: 'SensorMonitor',
  props: {
    plantId: {
      type: [String, Number],
      required: true
    },
    sensorList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      devices: [],
      sensorReadings: {},
      sensorThreshold: null,
      showAddDeviceModal: false,
      showBindDeviceModal: false,
      showSensorManagement: false,
      availableDevices: [],
      loadingDevices: false,
      submitting: false,
      newDevice: {
        device_code: ''
      },
      DEVICE_STATUS_MAP,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loadingMore: false,
      hasMore: true
    };
  },
  watch: {
    // 监听 sensorList 变化
    sensorList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.loadDevicesFromSensorList();
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // 初始化时加载设备
    console.log(this.sensorList)
    if (this.sensorList && this.sensorList.length > 0) {
      this.loadDevicesFromSensorList();
    }
  },
  beforeDestroy() {
    // 组件销毁时取消订阅
    if (this.devices.length > 0) {
      this.mqttUnSubscribe();
    }
  },
  methods: {
    /**
     * 从 sensorList 加载设备数据
     */
    async loadDevicesFromSensorList() {
      if (!this.sensorList || this.sensorList.length === 0) {
        this.devices = [];
        return;
      }

      try {
        // 提取所有设备ID
        const deviceIds = this.sensorList.map(item => item.device_id);
        console.log('deviceIds', deviceIds)
        // 批量获取设备详情
        const devicePromises = deviceIds.map(deviceId =>
          getDevice(deviceId).catch(err => {
            console.error(`获取设备 ${deviceId} 失败:`, err);
            return null;
          })
        );

        const responses = await Promise.all(devicePromises);

        // 过滤掉失败的请求,只保留成功的设备数据
        this.devices = responses
          .filter(response => response && response.code === 200)
          .map(response => response.data);

        console.log('加载的设备列表:', this.devices);

        // 加载设备运行状态
        await this.loadDevicesRunningStatus();

        // 连接 MQTT 并订阅
        await this.connectMqtt();

      } catch (error) {
        console.error('加载设备数据失败:', error);
        uni.showToast({
          title: '加载设备失败',
          icon: 'none'
        });
      }
    },

    // 获取最新时间
    getLatestTime(device) {
      if (!device.thingsModels || device.thingsModels.length === 0) {
        return '暂无数据';
      }

      let latestTime = null;

      device.thingsModels.forEach(model => {
        if (model.ts) {
          const modelTime = new Date(model.ts).getTime();
          if (!latestTime || modelTime > latestTime) {
            latestTime = modelTime;
          }
        }
      });

      if (!latestTime) {
        return '暂无数据';
      }

      return this.formatRelativeTime(latestTime);
    },

    // 格式化相对时间
    formatRelativeTime(timestamp) {
      const now = new Date().getTime();
      const diff = now - timestamp;
      const seconds = Math.floor(diff / 1000);

      if (seconds < 10) {
        return '刚刚';
      } else if (seconds < 60) {
        return `${seconds}秒前`;
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分钟前`;
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours}小时前`;
      } else if (seconds < 2592000) {
        const days = Math.floor(seconds / 86400);
        return `${days}天前`;
      } else {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    },

    // 加载设备运行状态
    async loadDevicesRunningStatus() {
      for (let i = 0; i < this.devices.length; i++) {
        try {
          // 1. 获取缓存物模型
          const cacheResponse = await cacheJsonThingsModel(this.devices[i].productId);
          let cacheThingsModel = {};
          if (cacheResponse.code === 200 && cacheResponse.data) {
            cacheThingsModel = JSON.parse(cacheResponse.data);
          }

          const cacheThingsModelAll = Object.values(cacheThingsModel).flat();

          // 2. 获取设备运行状态
          const statusResponse = await getRunningStatus(this.devices[i].deviceId, this.devices[i].slaveId || 1);
          if (statusResponse.code === 200 && statusResponse.data) {
            let allThingsModels = statusResponse.data.thingsModels || [];
            // let thingsModels = statusResponse.data.thingsModels || [];

            // 3. 合并中文名称
            allThingsModels = allThingsModels.map(item => {
              const cacheModel = cacheThingsModelAll.find(model => model.id === item.id);
              if (cacheModel) {
                item.name = cacheModel.name || cacheModel.name_zh_CN || item.id;
              }
              return item;
            });
            const thingsModels = allThingsModels.filter(item => item.isChart === 1);
            this.$set(this.devices[i], 'thingsModels', thingsModels);
            this.$set(this.devices[i], 'allThingsModels', allThingsModels);
          }
        } catch (error) {
          console.error(`加载设备 ${this.devices[i].deviceId} 运行状态失败:`, error);
        }
      }
    },

    // MQTT 回调处理
    mqttCallback() {
      this.$mqttTool.client.on('message', (topic, message, buffer) => {
        let topics = topic.split('/');
        let productId = topics[1];
        let deviceNum = topics[2];

        try {
          message = JSON.parse(message.toString());
        } catch (error) {
          console.error('JSON解析失败:', error);
          return;
        }

        if (!message) return;

        // 设备状态更新
        if (topics[3] == 'status') {
          console.log('接收到【设备状态】主题:', topic);
          console.log('接收到【设备状态】内容:', message);

          const deviceIndex = this.devices.findIndex(
            device => device.serialNumber == deviceNum
          );

          if (deviceIndex !== -1) {
            const updatedDevice = {
              ...this.devices[deviceIndex],
              status: message.status,
              isShadow: message.isShadow,
              rssi: message.rssi
            };

            this.$set(this.devices, deviceIndex, updatedDevice);
          }
          return;
        }

        // 物模型数据更新
        if (topic.endsWith('ws/service')) {
          console.log('接收到【物模型数据】主题:', topic);
          console.log('接收到【物模型数据】内容:', message);

          const newMessage = message.message;
          const deviceIndex = this.devices.findIndex(
            device => device.serialNumber == deviceNum && device.thingsModels
          );

          if (deviceIndex === -1) return;

          const currentTime = new Date().toISOString();

          const updatedThingsModels = this.devices[deviceIndex].thingsModels.map(model => {
            const updateData = newMessage.find(item => item.id == model.id);

            if (updateData) {
              return {
                ...model,
                shadow: updateData.value,
                ts: currentTime || updateData.ts
              };
            }

            return model;
          });

          this.$set(
            this.devices[deviceIndex],
            'thingsModels',
            updatedThingsModels
          );
        }
      });
    },

    // 订阅 MQTT 消息
    mqttSubscribe(list = this.devices) {
      if (list.length === 0) return
      let topics = [];
      for (let i = 0; i < list.length; i++) {
        let topicStatus = '/' + list[i].productId + '/' + list[i].serialNumber + '/status/post';
        let topicProperty = '/' + list[i].productId + '/' + list[i].serialNumber + '/property/post';
        let topicFunction = '/' + list[i].productId + '/' + list[i].serialNumber + '/function/post';
        let topicService = '/' + list[i].productId + '/' + list[i].serialNumber + '/ws/service';
        topics.push(topicStatus, topicProperty, topicFunction, topicService);
      }
      this.$mqttTool.subscribe(topics);
    },

    // 取消订阅 MQTT
    mqttUnSubscribe() {
      console.log('取消订阅');
      if (!this.devices) return
      if (this.devices.length === 0) return
      const list = this.devices;
      let topics = [];
      for (let i = 0; i < list.length; i++) {
        let topicStatus = '/' + list[i].productId + '/' + list[i].serialNumber + '/status/post';
        let topicProperty = '/' + list[i].productId + '/' + list[i].serialNumber + '/property/post';
        let topicFunction = '/' + list[i].productId + '/' + list[i].serialNumber + '/function/post';
        let topicService = '/' + list[i].productId + '/' + list[i].serialNumber + '/ws/service';
        topics.push(topicStatus, topicProperty, topicFunction, topicService);
      }
      this.$mqttTool.unsubscribe(topics);
      console.log('取消订阅', topics);
    },

    // 连接 MQTT
    async connectMqtt() {
      if (this.devices.length === 0) return;

      if (this.$mqttTool.client == null) {
        await this.$mqttTool.connect(this.vuex_token);
      }
      this.mqttCallback();
      this.mqttSubscribe(this.devices);
    },

    // 添加新设备
    async addDevice() {
      if (!this.newDevice.device_code.trim()) {
        uni.showToast({
          title: '请输入设备编码',
          icon: 'none'
        });
        return;
      }

      try {
        this.submitting = true;
        const bindResult = await bindDevice({ serialNumber: this.newDevice.device_code });

        if (bindResult.code !== 200) {
          uni.showToast({
            title: '添加设备失败: ' + (bindResult.data || bindResult.msg),
            icon: 'none'
          });
          return;
        }

        uni.showToast({
          title: '设备添加成功!',
          icon: 'success'
        });

        this.showAddDeviceModal = false;
        this.newDevice.device_code = '';
        this.openBindDeviceModal();

      } catch (error) {
        console.error('添加设备失败:', error);
        uni.showToast({
          title: '添加设备失败: ' + error.message,
          icon: 'none'
        });
      } finally {
        this.submitting = false;
      }
    },

    async loadMoreDevices() {
      if (!this.hasMore || this.loadingMore) return;

      this.pagination.pageNum += 1;
      await this.loadAvailableDevices(true);
    },

    onScrollToLower() {
      this.loadMoreDevices();
    },

    async loadAvailableDevices(isLoadMore = false) {
      try {
        if (isLoadMore) {
          this.loadingMore = true;
        } else {
          this.loadingDevices = true;
          this.pagination.pageNum = 1;
          this.availableDevices = [];
        }

        const response = await getUserDevices({
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        });

        if (response.code === 200) {
          if (isLoadMore) {
            this.availableDevices = [...this.availableDevices, ...response.rows];
          } else {
            this.availableDevices = response.rows;
          }

          this.pagination.total = response.total;
          this.hasMore = this.availableDevices.length < response.total;
        }
      } catch (error) {
        console.error('加载可用设备失败:', error);
        uni.showToast({
          title: '加载设备失败',
          icon: 'none'
        });
      } finally {
        this.loadingDevices = false;
        this.loadingMore = false;
      }
    },

    // 打开绑定设备弹窗
    async openBindDeviceModal() {
      this.showBindDeviceModal = true;
      await this.loadAvailableDevices();
    },

    // 绑定设备到植物
    async bindDeviceToPlant(device) {
      if (device.status !== 3) {
        return uni.showToast({
          title: '设备不在线',
          icon: 'none'
        })
      }
      const publishResult = await this.mqttPublish(device, {
        id: 'plant_id',
        name: '植物ID',
        type: 2,
        shadow: this.plantId
      })
      if (publishResult.code !== 200) {
        uni.showToast({
          title: publishResult.msg,
          icon: 'none'
        });
        return
      }
      try {
        const response = await bindPlant({
          id: device.id,
          plantId: this.plantId
        });

        if (response.code === 200) {
          this.showBindDeviceModal = false;
          this.$emit('update');

          uni.showToast({
            title: '设备绑定成功',
            icon: 'success'
          });
        }
      } catch (error) {
        console.error('绑定设备失败:', error);
        uni.showToast({
          title: '绑定失败',
          icon: 'error'
        });
      }
    },

    async mqttPublish(device, model) {
      const command = {};
      command[model.id] = model.shadow;
      const data = {
        serialNumber: device.serialNumber,
        productId: device.productId,
        remoteCommand: command,
        identifier: model.id,
        modelName: model.name,
        isShadow: device.status != 3,
        type: model.type,
      }
      const invokeResult = await serviceInvoke(data)
      return Promise.resolve(invokeResult)
    },

    // 解绑设备
    async unbindDevice(binding) {
      try {
        // this.showSensorManagement = false
        const confirmResult = await new Promise((resolve) => {
          uni.showModal({
            title: '确认解绑',
            content: '确定要解绑这个传感器吗?',
            success: (res) => resolve(res.confirm)
          });
        });

        if (!confirmResult) return;

        // 这里需要调用解绑接口
        // const response = await sensorsService.unbindDevice(binding.device_id);
        // if (response.code === 200) {
        //   this.$emit('update');
        //   uni.showToast({
        //     title: '已解绑',
        //     icon: 'success'
        //   });
        // }

        console.log('解绑设备:', binding);
      } catch (error) {
        console.error('解绑失败:', error);
        uni.showToast({
          title: '解绑失败',
          icon: 'error'
        });
      }
    },

    // 添加更多设备
    handleAddMoreDevice() {
      this.showSensorManagement = false;
      this.openBindDeviceModal();
    },

    // 打开添加新设备弹窗
    handleAddNewDevice() {
      this.showBindDeviceModal = false;
      this.showAddDeviceModal = true;
    },

    // 查看传感器详情
    // handleViewSensor(deviceId) {
    //   if (deviceId) {
    //     uni.navigateTo({
    //       url: `/pages/sensors/detail?id=${deviceId}`
    //     });
    //   }
    // },

    /**
     * 查看设备详情
     */
    handleViewSensor(deviceId) {
      // console.log('device', device)
      const device = this.sensorList.find(item => item.device_id == deviceId)
      let url = `/pages-plants/plants/deviceDetail/deviceDetail?deviceId=${device.device_id}&id=${device.sensor_Id}&plantId=${this.plantId}`
      uni.navigateTo({ url });
    },

    // 刷新数据
    refresh() {
      this.loadDevicesFromSensorList();
    }
  }
};
</script>

<style lang="scss" scoped>
.sensor-monitor {
  width: 100%;
}

.sensor-section {
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

.sensor-card {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.sensor-status {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.status-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.status-dot.online {
  background: #4CAF50;
}

.status-dot.offline {
  background: #f44336;
}

.device-name {
  flex: 1;
  font-weight: 500;
  color: #333;
  font-size: 28rpx;
}

.device-type-badge {
  padding: 4rpx 16rpx;
  background-color: rgba(60, 156, 255, 0.1);
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #2ecc71;
}

.battery {
  font-size: 24rpx;
  color: #666;
  padding: 8rpx 16rpx;
  background: white;
  border-radius: 8rpx;
}

.sensor-readings {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.reading-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: white;
  border-radius: 16rpx;
}

.reading-icon {
  font-size: 48rpx;
}

.reading-data {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reading-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.reading-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #2196F3;
}

.reading-optimal {
  font-size: 22rpx;
  color: #999;
}

.reading-time {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;
}

.no-sensor-data {
  text-align: center;
  padding: 40rpx;
  color: #999;
}

.btn-add-more-sensor {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  background-color: #f8f8f8;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
  color: #666;
  font-size: 28rpx;
  font-weight: 500;
}

.sensor-prompt {
  background-color: #fff;
  border: 2rpx dashed #ddd;
  border-radius: 20rpx;
  padding: 60rpx 30rpx;
  text-align: center;
}

.prompt-icon {
  font-size: 80rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.prompt-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.prompt-desc {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 60rpx;
  line-height: 1.5;
}

.sensor-action-buttons {
  display: flex;
  gap: 30rpx;
}

.btn-add-sensor {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-add-sensor.btn-primary {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  margin-right: 20rpx;
  color: #fff;
}

.btn-add-sensor.btn-secondary {
  background: #fff;
  color: #2ecc71;
  border: 2rpx solid #2ecc71;
}

// 弹窗样式
.modal-content {
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.btn-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #666;
  border-radius: 16rpx;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 30rpx;
}

.form-group {
  margin-bottom: 32rpx;
}

.form-group .label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  padding: 120rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 30rpx;
  text-align: center;
}

.empty-state .empty-icon {
  font-size: 100rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-state .empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.empty-state .empty-hint {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.btn-icon {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
  color: #666;
  margin-left: 16rpx;
}

.btn-icon.danger {
  border-color: #f56c6c;
  color: #f56c6c;
}

.btn-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: #fff;
}

.btn-secondary {
  background: #fff;
  color: #666;
  border: 2rpx solid #ddd;
  margin-right: 20rpx;
}

.devices-scroll {
  max-height: 500rpx;
}


.devices-list {
  display: flex;
  flex-direction: column;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 30rpx;
  padding: 30rpx;
  background-color: #f8f8f8;
  border: 2rpx solid #f0f0f0;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.device-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 16rpx;
  margin-right: 30rpx;
  background: linear-gradient(135deg, #2ecc71 0%, #2979ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.device-info {
  flex: 1;
  min-width: 0;
}

.device-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.device-type {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.device-code {
  font-size: 22rpx;
  color: #999;
  font-family: monospace;
}

.status-badge {
  padding: 8rpx 24rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.online {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-badge.offline {
  background-color: rgba(158, 158, 158, 0.1);
  color: #999;
}

.status-badge-small {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.device-actions {
  display: flex;
  gap: 16rpx;
}

.management-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.management-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
}

.device-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}

.no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}
</style>