<template>
  <view class="sensor-detail">
    <!-- <view class="header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <view class="actions">
        <button @click="showSettings = true">设置</button>
      </view>
    </view> -->

    <u-sticky zIndex="98" :customNavHeight="0">
      <u-navbar @leftClick="goBack" :fixed="false" bgColor="#ffffff">
        <!-- <template slot="left">
          <h1>我的传感器</h1>
        </template> -->
        <template slot="right">
          <view class="actions">
            <button @click="showSettings = true">设置</button>
          </view>
        </template>
      </u-navbar>
    </u-sticky>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else-if="device" class="device-list">
      <view class="device-card">
        <view class="device-header">
          <view>
            <h1>{{ device.deviceName }}</h1>
            <text class="device-code">{{ device.serialNumber }}</text>
          </view>
          <view class="status-info">
            <text :class="['status', device.status == 3 ? 'online' : 'offline']">
              {{ DEVICE_STATUS_MAP[device.status] }}
            </text>
            <!-- <text class="battery" :class="getBatteryClass(device.battery_level)">
              电量 {{ device.battery_level }}%
            </text> -->
          </view>
        </view>

        <view v-if="plant" class="bound-info">
          <image :src="plant.plantImage || '/static/plant-placeholder.png'"></image>
          <view class="plant-details">
            <!-- <h3>{{ plant.plantName }}</h3> -->
            <text>{{ plant.plantName }}</text>
          </view>
          <button @click="unbind" class="unbind-btn">解绑</button>
        </view>
        <!-- 未绑定植物时的绑定按钮 -->
        <view v-else class="unbound-info">
          <view class="unbound-content">
            <text class="unbound-text">未绑定植物</text>
            <button :disabled="device.status !== 3" @click="openBindModal" class="bind-btn">立即绑定</button>
          </view>
        </view>
      </view>

      <view v-if="device.thingsModels && device.thingsModels.length > 0" class="current-readings">
        <view class="readings-header">
          <h2>当前数据</h2>
          <text class="update-time">{{ getLatestTime(device) }}更新</text>
        </view>
        <view class="readings-grid">
          <view v-for="model in device.thingsModels" :key="model.id" class="reading-card">
            <!-- <view class="icon">💧</view> -->
            <view class="reading-info">
              <text class="label">{{ model.name }}</text>
              <text class="value">{{ model.shadow || model.value || 0 }}{{ model.datatype.unit }}</text>
              <!-- <text v-if="threshold" class="range">
                最佳: {{ threshold.optimal_min }}-{{ threshold.optimal_max }}%
              </text> -->
            </view>
          </view>
        </view>
      </view>

      <!-- 替换原来的 history-section 部分 -->
      <DeviceHistoryChart v-if="loadChart" :device="device" />

      <view v-if="alerts.length > 0" class="alerts-section">
        <h2>最近告警</h2>
        <view class="alerts-list">
          <view v-for="alert in alerts.slice(0, 5)" :key="alert.id" :class="['alert-item', alert.alert_level]">
            <view class="alert-info">
              <text class="alert-type">{{ alert.alert_type }}</text>
              <text class="alert-message">{{ alert.message }}</text>
              <text class="alert-time">{{ formatTime(alert.created_at) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showSettings" class="modal" @click="showSettings = false">
      <view class="modal-content" @click.stop>
        <h2>传感器设置</h2>
        <form @submit.prevent="saveSettings">
          <!-- <view class="form-group">
            <text class="label">设备名称</text>
            <u-input v-model="settings.device_name" required />
          </view> -->

          <view v-if="threshold" class="threshold-settings">
            <h3>湿度阈值设置</h3>
            <view class="form-group">
              <text class="label">最低湿度告警阈值 (%)</text>
              <u-input type="number" v-model.number="thresholdSettings.min_moisture" min="0" max="100" />
            </view>
            <view class="form-group">
              <text class="label">最高湿度告警阈值 (%)</text>
              <u-input type="number" v-model.number="thresholdSettings.max_moisture" min="0" max="100" />
            </view>
            <view class="form-group">
              <text class="label">理想湿度下限 (%)</text>
              <u-input type="number" v-model.number="thresholdSettings.optimal_min" min="0" max="100" />
            </view>
            <view class="form-group">
              <text class="label">理想湿度上限 (%)</text>
              <u-input type="number" v-model.number="thresholdSettings.optimal_max" min="0" max="100" />
            </view>
            <view class="form-group">
              <label class="checkbox-label">
                <checkbox :checked="thresholdSettings.alert_enabled" @change="onAlertEnabledChange" />
                <text class="checkbox-text">启用告警通知</text>
              </label>
            </view>
          </view>

          <!-- <view class="form-actions">
            <button type="button" @click="showSettings = false">取消</button>
            <button type="submit">保存</button>
          </view> -->

          <view class="danger-zone">
            <button type="button" @click="deleteDevice" class="delete-btn">删除设备</button>
          </view>
        </form>
      </view>
    </view>

    <!-- 绑定植物弹窗 -->
    <view v-if="showBindModal" class="modal" @click="showBindModal = false">
      <view class="modal-content plants-modal" @click.stop>
        <h2>绑定植物</h2>

        <!-- 植物列表 -->
        <view v-if="loadingPlants && bindPlantParams.pageNum === 1" class="loading-modal">
          <text>加载植物列表...</text>
        </view>

        <view v-else-if="userPlants.length === 0" class="empty">
          <text>还没有添加植物</text>
          <button class="btn-add-first" @click="handleAddPlant">
            <u-icon name="plus" color="#fff" size="16"></u-icon>
            <text class="btn-text">添加新植物</text>
          </button>
          <!-- <navigator url="/pages/plants/add" class="add-plant-link">去添加植物</navigator> -->
        </view>

        <view v-else class="plants-container">
          <scroll-view class="plants-scroll" scroll-y :style="{ height: scrollHeight + 'px' }"
            @scrolltolower="loadMorePlants">
            <view class="plants-list">
              <view v-for="plant in userPlants" :key="plant.id" class="plant-item" @click="confirmBind(plant)">
                <image :src="plant.plantImage || '/static/plant-placeholder.png'" class="plant-image"></image>
                <view class="plant-info">
                  <h4>{{ plant.plantName }}</h4>
                  <text class="plant-desc">{{ plant.plantSpecies || '未知品种' }}</text>
                </view>
              </view>

              <!-- 加载更多 -->
              <view v-if="userPlants.length > 0" class="loadmore-section">
                <u-loadmore :status="bindPlantLoadStatus" v-if="bindPlantTotal > bindPlantParams.pageSize"
                  loading-text="加载中..." loadmoreText="上拉加载更多" nomoreText="没有更多植物了" marginTop="20" marginBottom="20" />
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 关闭按钮 -->
        <view class="modal-actions">
          <button class="close-btn" @click="showBindModal = false">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getLatestReading,
  getThreshold,
  getDeviceBinding,
  getDeviceById,
  deleteDevice,
  bindPlant,
  unbindPlant
} from '@/apis/modules/sensors';
import { getPlantDetail, getUserPlants } from '@/apis/modules/plants';
import { getRunningStatus, getDevice, cacheJsonThingsModel } from '@/apis/modules/device';
import { getDeviceHistory } from '@/apis/modules/deviceLog';
import { DEVICE_STATUS_MAP } from '@/common/constants';
import { serviceInvoke } from '@/apis/modules/runtime.js';
import DeviceHistoryChart from './historyChart.vue'
export default {
  name: 'SensorDetail',
  data() {
    return {
      device: null,
      binding: null,
      latestReading: null,
      threshold: null,
      stats: null,
      alerts: [],
      loading: true,
      showSettings: false,
      timeRange: 24,
      settings: {
        device_name: ''
      },
      thresholdSettings: {
        min_moisture: 20,
        max_moisture: 80,
        optimal_min: 40,
        optimal_max: 60,
        alert_enabled: true
      },
      chart: null,
      DEVICE_STATUS_MAP,
      listId: null,
      plant: null,

      // 绑定植物相关数据
      showBindModal: false,
      loadingPlants: false,
      userPlants: [],
      bindPlantParams: {
        pageNum: 1,
        pageSize: 10
      },
      bindPlantTotal: 0,
      bindPlantLoadStatus: 'loadmore',
      scrollHeight: 400,
      loadChart: false
    };
  },
  components: {
    DeviceHistoryChart
  },
  onLoad(options) {
    this.deviceId = options.deviceId;
    this.listId = options.id
    if (options.plantId) {
      this.plantId = options.plantId
      getPlantDetail(this.plantId, false).then(res => {
        if (res.code === 200) {
          this.plant = res.data;
        }
      })
    }
    this.connectMqtt()
  },
  onUnload() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.mqttUnSubscribe([this.device])
  },
  methods: {
    /**
     * 计算滚动区域高度
     */
    calculateScrollHeight() {
      const systemInfo = uni.getSystemInfoSync();
      this.scrollHeight = systemInfo.windowHeight * 0.6;
    },
    /**
     * 加载用户植物列表
     */
    async loadUserPlants() {
      try {
        this.loadingPlants = true;

        const result = await getUserPlants(this.bindPlantParams);
        console.log('植物列表响应:', result);

        if (result.code === 200) {
          const plants = result.rows || [];
          this.bindPlantTotal = result.total || 0;

          // 处理分页数据
          if (this.bindPlantParams.pageNum === 1) {
            this.userPlants = plants;
          } else {
            this.userPlants = [...this.userPlants, ...plants];
          }

          // 更新加载状态
          const hasMore = this.userPlants.length < this.bindPlantTotal;
          this.bindPlantLoadStatus = hasMore ? 'loadmore' : 'nomore';

          console.log(`植物分页: 当前${this.userPlants.length}/总数${this.bindPlantTotal}, 状态: ${this.bindPlantLoadStatus}`);
        } else {
          uni.showToast({
            title: result.msg || '加载植物列表失败',
            icon: 'none'
          });

          if (this.bindPlantParams.pageNum > 1) {
            this.bindPlantParams.pageNum--;
          }
        }
      } catch (error) {
        console.error('加载植物列表失败:', error);
        uni.showToast({
          title: '加载植物列表失败: ' + error.message,
          icon: 'none'
        });

        if (this.bindPlantParams.pageNum > 1) {
          this.bindPlantParams.pageNum--;
        }
      } finally {
        this.loadingPlants = false;
      }
    },
    /**
    * 加载更多植物
    */
    async loadMorePlants() {
      if (this.bindPlantLoadStatus === 'loadmore' && !this.loadingPlants) {
        console.log('触发加载更多植物');
        this.bindPlantParams.pageNum++;
        await this.loadUserPlants();
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

    /**
     * 确认绑定植物
     */
    async confirmBind(plant) {
      const publishResult = await this.mqttPublish(this.device, {
        id: 'plant_id',
        name: '植物ID',
        type: 2,
        shadow: plant.id
      })
      if (publishResult.code !== 200) {
        uni.showToast({
          title: publishResult.msg,
          icon: 'none'
        });
        return
      }
      try {
        const bindResult = await bindPlant({
          id: this.listId,
          plantId: plant.id
        });

        if (bindResult.code === 200) {
          this.showBindModal = false;
          this.plant = plant;
          uni.showToast({
            title: '绑定成功!',
            icon: 'success'
          });

          // 触发刷新事件，让其他页面也更新
          uni.$emit('refreshDeviceList');
          uni.$emit('refreshPlantDetail');
        } else {
          uni.showToast({
            title: bindResult.msg || '绑定失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '绑定失败: ' + error.message,
          icon: 'none'
        });
      }
    },

    /**
     * 解绑植物
     */
    async unbind() {
      uni.showModal({
        title: '确认解绑',
        content: '确定要解绑这个植物吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const unbindResult = await unbindPlant({ id: this.listId });
              if (unbindResult.code === 200) {
                this.plant = null;
                uni.showToast({
                  title: '解绑成功!',
                  icon: 'success'
                });

                // 触发刷新事件
                uni.$emit('refreshDeviceList');
                uni.$emit('refreshPlantDetail');
              } else {
                uni.showToast({
                  title: unbindResult.msg || '解绑失败',
                  icon: 'none'
                });
              }
            } catch (error) {
              uni.showToast({
                title: '解绑失败: ' + error.message,
                icon: 'none'
              });
            }
          }
        }
      });
    },

    /**
     * 打开绑定植物弹窗
     */
    async openBindModal() {
      if (this.device.status !== 3) {
        uni.showToast({
          title: '设备不在线',
          icon: 'none'
        })
        return
      }
      this.showBindModal = true;

      // 重置分页参数
      this.bindPlantParams.pageNum = 1;
      this.bindPlantLoadStatus = 'loadmore';
      this.userPlants = [];

      // 计算高度
      this.$nextTick(() => {
        this.calculateScrollHeight();
      });

      // 加载植物列表
      await this.loadUserPlants();
    },
    /**获取设备详情*/
    getDevice() {
      this.loading = true;
      getDevice(this.deviceId).then(async response => {
        try {
          this.loading = false
          let data = response.data;
          this.device = data
          console.log(this.device)
          this.mqttSubscribe([data]);
          await this.loadDevicesRunningStatus();
          this.loadChart = true
          uni.stopPullDownRefresh();
          //Mqtt订阅
          // this.deviceForm = data;
        } catch (e) {
          console.log(e);
        }
      });
    },
    // 在MQTT回调中处理时间更新
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

          // for (let i = 0; i < this.devices.length; i++) {
          if (this.device.serialNumber == deviceNum) {
            this.device.status = message.status;
            this.device.isShadow = message.isShadow;
            this.device.rssi = message.rssi;
            return;
          }
          // }
        }

        // 物模型数据更新
        if (topics[3] == 'function' || topics[3] == 'property') {
          console.log('接收到【物模型数据functionproperty】主题:', topic);
          console.log('接收到【物模型数据functionproperty】内容:', message);
        }
        if (topic.endsWith('ws/service')) {
          console.log('接收到【物模型数据】主题:', topic);
          console.log('接收到【物模型数据】内容:', message);
          const newMessage = message.message
          // const deviceIndex = this.devices.findIndex(
          //   device => device.serialNumber == deviceNum && device.thingsModels
          // );

          // if (deviceIndex === -1) return;

          const currentTime = new Date().toISOString();

          // 创建新的 thingsModels 数组
          const updatedThingsModels = this.device.thingsModels.map(model => {
            // 查找是否有更新
            const updateData = newMessage.find(item => item.id == model.id);

            if (updateData) {
              // 返回新对象,触发响应式更新
              return {
                ...model,
                shadow: updateData.value,
                ts: currentTime || updateData.ts
              };
            }

            return model;
          });

          // 使用 $set 替换整个 thingsModels 数组
          this.$set(
            this.device,
            'thingsModels',
            updatedThingsModels
          );

          console.log('更新后的设备数据:', this.device);
        }
      });
    },

    // 订阅消息
    mqttSubscribe(list) {
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

    /** Mqtt取消订阅主题 */
    mqttUnSubscribe(list) {
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

    // 连接Mqtt消息服务器
    async connectMqtt() {
      if (this.$mqttTool.client == null) {
        await this.$mqttTool.connect(this.vuex_token);
      }
      this.mqttCallback();
      this.getDevice();
    },

    // 获取最新时间
    getLatestTime(device) {
      if (!device.thingsModels || device.thingsModels.length === 0) {
        return '暂无数据';
      }

      // 从所有物模型数据中找出最新的时间戳
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

    // 更精确的时间格式化方法
    formatRelativeTime(timestamp) {
      const now = new Date().getTime();
      const diff = now - timestamp;

      // 转换为秒
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
      // const { getRunningStatus, cacheJsonThingsModel } = require('@/apis/modules/device');

      // for (let i = 0; i < this.devices.length; i++) {
      try {
        // 1. 获取缓存物模型(包含中文名称)
        const cacheResponse = await cacheJsonThingsModel(this.device.productId);
        let cacheThingsModel = {};
        if (cacheResponse.code === 200 && cacheResponse.data) {
          cacheThingsModel = JSON.parse(cacheResponse.data);
        }

        // 将所有物模型展平为一维数组,方便查找
        const cacheThingsModelAll = Object.values(cacheThingsModel).flat();

        // 2. 获取设备运行状态
        const statusResponse = await getRunningStatus(this.device.deviceId, this.device.slaveId || 1);
        if (statusResponse.code === 200 && statusResponse.data) {
          let allThingsModels = statusResponse.data.thingsModels || [];
          // 3. 合并中文名称
          allThingsModels = allThingsModels.map(item => {
            const cacheModel = cacheThingsModelAll.find(model => model.id === item.id);
            if (cacheModel) {
              item.name = cacheModel.name || cacheModel.name_zh_CN || item.id;
            }
            return item;
          });

          const thingsModels = allThingsModels.filter(item => item.isChart === 1)
          // 将运行状态数据添加到设备对象
          this.$set(this.device, 'thingsModels', thingsModels);
          this.$set(this.device, 'allThingsModels', allThingsModels);
          console.log(`设备 ${this.device.deviceName} 运行状态:`, this.device.thingsModels);
        }
      } catch (error) {
        console.error(`加载设备 ${this.device.deviceId} 运行状态失败:`, error);
      }
      // }
    },

    goBack() {
      uni.navigateBack();
    },
    onAlertEnabledChange(e) {
      this.thresholdSettings.alert_enabled = e.detail.value;
    },
    async loadData() {
      try {
        this.loading = true;

        const deviceResult = await getDeviceById({ 'device_id': this.deviceId });
        console.log('设备详情响应:', deviceResult);
        if (deviceResult.code === 200) {
          this.device = deviceResult.data
        }
        const bindingResult = await getDeviceBinding({ 'device_id': this.deviceId });
        console.log('绑定详情响应:', bindingResult);
        if (bindingResult.code === 200) {
          this.binding = bindingResult.data
        }
        const readingResult = await getLatestReading({ 'device_id': this.deviceId });
        console.log('传感器数据响应:', readingResult);
        if (readingResult.code === 200) {
          this.latestReading = readingResult.data
        }

        if (this.binding.user_plant_id) {
          const thresholdResult = await getThreshold({ 'user_plant_id': this.binding.user_plant_id });
          console.log('阈值设置响应:', thresholdResult);
          if (thresholdResult.code === 200) {
            this.threshold = thresholdResult.data
          }
        }

        this.settings.device_name = this.device.device_name;

        if (this.threshold) {
          this.thresholdSettings = { ...this.threshold };
        }

        // await this.loadAlerts();
      } catch (error) {
        uni.showToast({
          title: '加载数据失败: ' + error.message,
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    // ============ 10. 修改图表渲染方法 ============
    getCanvasSize() {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.chart-container').boundingClientRect(data => {
          if (data) {
            // 减去padding和边距,获取实际可用宽度
            this.chartWidth = data.width - 30 || 700; // 默认700
            this.chartHeight = 300; // 高度固定

            console.log('Canvas尺寸:', this.chartWidth, 'x', this.chartHeight);
          }
          resolve();
        }).exec();
      });
    },
    formatChartTime(date) {
      const d = new Date(date);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      if (this.timeRange <= 24) {
        return `${hours}:${minutes}`; // 24小时显示时:分
      } else {
        return `${month}/${day}`; // 7天/30天显示月/日
      }
    },
    async loadAlerts() {
      try {
        const userId = 'mock_user_001'
        const allAlerts = await getUserAlerts(userId);
        this.alerts = allAlerts.filter(a => a.device_id === this.deviceId);
      } catch (error) {
        console.error('加载告警失败:', error);
      }
    },
    async saveSettings() {
      try {
        await updateDevice(this.deviceId, {
          device_name: this.settings.device_name
        });

        if (this.binding.user_plant_id) {
          const userId = this.$store.state.user.id;
          await setThreshold(
            this.binding.user_plant_id,
            userId,
            this.thresholdSettings
          );
        }

        this.showSettings = false;
        await this.loadData();
        uni.showToast({
          title: '设置已保存',
          icon: 'success'
        });
      } catch (error) {
        uni.showToast({
          title: '保存失败: ' + error.message,
          icon: 'none'
        });
      }
    },
    async deleteDevice() {
      this.showSettings = false
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个设备吗？所有历史数据将被清除！',
        success: async (res) => {
          if (res.confirm) {
            try {
              const deleteResult = await deleteDevice(this.listId);
              // uni.redirectTo({
              //   url: '/pages/sensors/index'
              // });
              if (deleteResult.code === 200) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                uni.$emit('refreshPlantDetail');
                uni.$emit('refreshDeviceList');
                setTimeout(() => {
                  uni.navigateBack()
                }, 500)
              } else {
                uni.showToast({
                  title: deleteResult.msg,
                  icon: 'none'
                });
              }
            } catch (error) {
              uni.showToast({
                title: '删除失败: ' + error.message,
                icon: 'none'
              });
            }
          }
        }
      });
    },
    getBatteryClass(level) {
      if (level > 50) return 'high';
      if (level > 20) return 'medium';
      return 'low';
    },
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      return date.toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    // 加载历史数据
    getDeviceHistory() {
      getDeviceHistory({
        serialNumber: 'D147L442028Y',
        beginTime: '2025-11-27',
        endTime: '2025-11-27 23:59:59',
        productId: '147'
      })
    },
    /**
     * 添加植物
     */
    handleAddPlant() {
      uni.navigateTo({
        url: '/pages-plants/plants/addPlants/addPlants'
      });
    },
  }
};
</script>

<style scoped>
.sensor-detail {}

.device-list {
  padding: 40rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48rpx;
}

.back-btn {
  background: white;
  border: 2rpx solid #ddd;
  padding: 16rpx 32rpx;
  border-radius: 16rpx;
}

.actions button {
  background: #2196F3;
  color: white;
  border: none;
  padding: 16rpx 32rpx;
  border-radius: 16rpx;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  color: #666;
}

.loading::before {
  content: '';
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 32rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.device-card {
  background: white;
  border-radius: 24rpx;
  padding: 36rpx;
  margin-bottom: 48rpx;
  border: 2rpx solid #e0e0e0;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40rpx;
}

.device-header h1 {
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.device-code {
  color: #666;
  font-size: 28rpx;
}

.status-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status {
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.status.online {
  background: #e8f5e9;
  color: #4CAF50;
}

.status.offline {
  background: #ffebee;
  color: #f44336;
}

.battery {
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.battery.high {
  background: #e8f5e9;
  color: #4CAF50;
}

.battery.medium {
  background: #fff3e0;
  color: #ff9800;
}

.battery.low {
  background: #ffebee;
  color: #f44336;
}

.bound-info {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
}

.bound-info image {
  width: 128rpx;
  height: 128rpx;
  border-radius: 16rpx;
  margin-right: 32rpx;
}

.plant-details {
  flex: 1;
  margin-right: 32rpx;
}

.plant-details h3 {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.plant-details text {
  font-size: 28rpx;
  color: #666;
}

.unbind-btn {
  background: white;
  border: 2rpx solid #ddd;
  padding: 16rpx 32rpx;
  border-radius: 12rpx;
}

.current-readings {
  background: white;
  border-radius: 24rpx;
  padding: 36rpx;
  margin-bottom: 48rpx;
  border: 2rpx solid #e0e0e0;
}

.readings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.readings-header h2 {
  font-size: 40rpx;
  font-weight: 600;
  margin: 0;
}

.update-time {
  font-size: 24rpx;
  color: #999;
}

.readings-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -16rpx;
}

.reading-card {
  display: flex;
  padding: 32rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  margin: 0 16rpx 32rpx 16rpx;
  width: calc(50% - 32rpx);
  box-sizing: border-box;
}

.reading-card .icon {
  font-size: 64rpx;
  margin-right: 24rpx;
}

.reading-info {
  display: flex;
  flex-direction: column;
}

.reading-info .label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.reading-info .value {
  font-size: 48rpx;
  font-weight: 600;
  color: #2196F3;
  margin-bottom: 8rpx;
}

.reading-info .range {
  font-size: 22rpx;
  color: #999;
}

.reading-info .unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.history-section {
  background: white;
  border-radius: 24rpx;
  padding: 36rpx;
  margin-bottom: 48rpx;
  border: 2rpx solid #e0e0e0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.section-header h2 {
  font-size: 36rpx;
  font-weight: 600;
}

.time-tabs {
  display: flex;
}

.time-tabs button {
  padding: 12rpx 32rpx;
  border: 2rpx solid #ddd;
  background: white;
  border-radius: 12rpx;
  font-size: 28rpx;
  margin-left: 16rpx;
}

.time-tabs button:first-child {
  margin-left: 0;
}

.time-tabs button.active {
  background: #2196F3;
  color: white;
  border-color: #2196F3;
}


.alerts-section {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  border: 2rpx solid #e0e0e0;
}

.alerts-section h2 {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 32rpx;
}

.alerts-list {
  display: flex;
  flex-direction: column;
}

.alert-item {
  padding: 32rpx;
  border-radius: 16rpx;
  border-left: 8rpx solid;
  margin-bottom: 24rpx;
}

.alert-item:last-child {
  margin-bottom: 0;
}

.alert-item.info {
  background: #e3f2fd;
  border-color: #2196F3;
}

.alert-item.warning {
  background: #fff3e0;
  border-color: #ff9800;
}

.alert-item.critical {
  background: #ffebee;
  border-color: #f44336;
}

.alert-info {
  display: flex;
  flex-direction: column;
}

.alert-type {
  font-weight: 600;
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

.alert-message {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.alert-time {
  font-size: 24rpx;
  color: #999;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  width: 90%;
  max-width: 1000rpx;
  max-height: 160vh;
  box-sizing: border-box;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 40rpx;
}

.threshold-settings {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 2rpx solid #e0e0e0;
}

.threshold-settings h3 {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 32rpx;
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

.form-group input {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.checkbox-text {
  margin-left: 16rpx;
}

.form-actions {
  display: flex;
  margin-top: 48rpx;
}

.form-actions button {
  flex: 1;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  margin: 0 12rpx;
}

.form-actions button:first-child {
  margin-left: 0;
}

.form-actions button:last-child {
  margin-right: 0;
}

.form-actions button[type="button"] {
  background: white;
  border: 2rpx solid #ddd;
  color: #666;
}

.form-actions button[type="submit"] {
  background: #4CAF50;
  border: none;
  color: white;
}

.danger-zone {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 2rpx solid #e0e0e0;
}

.delete-btn {
  width: 100%;
  padding: 24rpx;
  background: white;
  border: 2rpx solid #f44336;
  color: #f44336;
  border-radius: 16rpx;
  font-size: 28rpx;
}

/* 绑定植物相关样式 */
.unbound-info {
  padding: 40rpx 0;
  border-top: 2rpx solid #f0f0f0;
  margin-top: 40rpx;
}

.unbound-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unbound-text {
  color: #999;
  font-size: 28rpx;
}

.bind-btn {
  background: #007AFF;
  color: white;
  border: none;
  padding: 24rpx 48rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
}

.plants-container {
  flex: 1;
  margin-bottom: 40rpx;
}

.plants-scroll {
  width: 100%;
}

.loadmore-section {
  padding: 40rpx 0;
}

.modal-actions {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 40rpx;
}

.close-btn {
  width: 100%;
  background: #f8f8f8;
  color: #333;
  border: none;
  padding: 40rpx;
  border-radius: 24rpx;
}

.add-plant-link {
  color: #007AFF;
  text-decoration: underline;
  margin-top: 40rpx;
  display: inline-block;
}

/* 确保弹窗内容可以滚动 */
.modal-content {
  max-height: 160vh;
  overflow: hidden;
}

.plants-list {
  display: flex;
  flex-direction: column;
}

.plant-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.plant-item:last-child {
  margin-bottom: 0;
}

.plant-item image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.plant-info h4 {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.plant-info text {
  font-size: 28rpx;
  color: #666;
}

/* 加载和空状态 */
.loading-state,
.empty-state,
.empty-chart {
  text-align: center;
  padding: 80rpx 40rpx;
  color: #999;
  font-size: 28rpx;
}

.empty {
  text-align: center;
  padding: 60rpx 40rpx;
}

.empty .tip {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 48rpx;
}

.btn-add-first {
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 48rpx;
  line-height: 1;
  background: #2ecc71;
  border-radius: 50rpx;
  border: none;
  text-align: center;
  box-shadow: 0 8rpx 20rpx rgba(60, 156, 255, 0.3);
}

.btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}
</style>