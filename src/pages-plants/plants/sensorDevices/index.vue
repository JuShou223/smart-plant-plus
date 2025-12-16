<template>
  <view class="sensor-devices">
    <u-sticky zIndex="98" :customNavHeight="0">
      <u-navbar :fixed="false" bgColor="#ffffff" leftText="我的传感器">
        <template slot="left">
          <h1>我的传感器</h1>
        </template>
        <template slot="right">
          <button class="add-btn" @click="showAddDevice = true">+ 添加设备</button>
        </template>
      </u-navbar>
    </u-sticky>

    <!-- <u-sticky zIndex="98" :customNavHeight="0">
      <view class="header">
        <h1>我的传感器</h1>
        <button class="add-btn" @click="showAddDevice = true">+ 添加设备</button>
      </view>
    </u-sticky> -->

    <view v-if="loading && queryParams.pageNum === 1" class="loading-state">
      <view class="loading-spinner"></view>
      <text>加载中...</text>
    </view>

    <view v-else-if="devices.length === 0" class="empty">
      <text>还没有添加传感器设备</text>
      <text class="tip">添加设备后可以实时监测植物土壤湿度</text>
      <button @click="showAddDevice = true">立即添加</button>
    </view>

    <view v-else class="devices-grid">
      <view>
        <view v-for="device in devices" :key="device.deviceId" class="device-card" @click="viewDevice(device)">
          <view class="device-header">
            <view class="device-info">
              <h3>{{ device.deviceName }}</h3>
            </view>
            <view class="right-wrap">
              <view class="device-status">
                <text :class="['status-badge', device.status == 3 ? 'online' : 'offline']">
                  {{ DEVICE_STATUS_MAP[device.status] }}
                </text>
              </view>
              <view class="status-wrap">
                <u--text v-if="device.status == 3 && device.rssi >= '-55'" lines="1" prefixIcon="/static/wifi_4.png"
                  iconStyle="margin-right:6rpx;" size="24"></u--text>
                <u--text v-else-if="device.status == 3 && device.rssi >= '-70' && device.rssi < '-55'" lines="1"
                  prefixIcon="/static/wifi_3.png" iconStyle="margin-right:6rpx;" size="24"></u--text>
                <u--text v-else-if="device.status == 3 && device.rssi >= '-85' && device.rssi < '-70'" lines="1"
                  prefixIcon="/static/wifi_2.png" iconStyle="margin-right:6rpx;" size="24"></u--text>
                <u--text v-else-if="device.status == 3 && device.rssi >= '-100' && device.rssi < '-85'" lines="1"
                  prefixIcon="/static/wifi_1.png" iconStyle="margin-right:6rpx;" size="24"></u--text>
                <u--text v-else lines="1" prefixIcon="/static/wifi_0.png" iconStyle="margin-right:6rpx;" size="12">
                </u--text>
              </view>
            </view>
          </view>

          <view v-if="device.plantId && device.plantName" class="bound-plant">
            <image :src="device.plantImage || '/static/plant-placeholder.png'">
            </image>
            <text>{{ device.plantName }}</text>
          </view>
          <view v-else class="unbound">
            <text>未绑定植物</text>
            <button :disabled="device.status !== 3" @click.stop="bindDevice(device)" class="bind-btn">立即绑定</button>
          </view>

          <!-- 监测数据显示 -->
          <view v-if="device.thingsModels && device.thingsModels.length > 0" class="latest-reading">
            <view class="reading-header">
              <text class="reading-title">实时数据</text>
              <text class="reading-time">{{ getLatestTime(device) }}</text>
            </view>

            <view class="reading-grid">
              <view v-for="model in device.thingsModels" :key="model.id" class="reading-item">
                <view class="reading-content">
                  <text class="label">{{ model.name }}</text>
                  <text class="value">{{ model.shadow || model.value || 0 }}{{ model.datatype.unit }}</text>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="no-reading">
            <text>暂无数据</text>
          </view>
        </view>
      </view>
      <!-- 加载更多提示 -->
      <view v-if="total > queryParams.pageSize && devices.length > 0" style="padding: 24rpx 0">
        <u-loadmore :status="loadStatus" loading-text="努力加载中..." loadmoreText="轻轻上拉" nomoreText="没有更多了" marginTop="15"
          marginBottom="15" />
      </view>
    </view>



    <!-- 添加设备弹窗 -->
    <view v-if="showAddDevice" class="modal" @click="showAddDevice = false">
      <view class="modal-content" @click.stop>
        <h2>添加传感器设备</h2>
        <form @submit.prevent="addDevice">
          <view class="form-group">
            <text class="label">设备编码 *</text>
            <u-input v-model="newDevice.device_code" required placeholder="请输入设备编号" />
          </view>
          <view class="form-actions">
            <button type="button" @click="showAddDevice = false">取消</button>
            <button type="submit" @click="onBindDevice" :disabled="submitting">
              {{ submitting ? '添加中...' : '添加设备' }}
            </button>
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
        </view>

        <view v-else class="plants-container">
          <!-- 使用 scroll-view 监听滚动 -->
          <scroll-view class="plants-scroll" scroll-y :style="{ height: scrollHeight + 'px' }"
            @scrolltolower="loadMorePlants">
            <view class="plants-list">
              <view v-for="plant in userPlants" :key="plant.id" class="plant-item" @click="confirmBind(plant)">
                <image :src="plant.plantImage || '/static/plant-placeholder.png'" class="plant-image"></image>
                <view class="plant-info">
                  <h4>{{ plant.plantName }}</h4>
                  <!-- <text class="plant-desc">{{ plant.plantSpecies || '未知品种' }}</text> -->
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
import { getUserDevices, bindDevice, bindPlant } from '@/apis/modules/sensors';
import { getUserPlants } from '@/apis/modules/plants';
import { getRunningStatus, cacheJsonThingsModel } from '@/apis/modules/device';
import { DEVICE_STATUS_MAP } from '@/common/constants';
import { serviceInvoke } from '@/apis/modules/runtime.js';

export default {
  name: 'SensorDevices',
  data() {
    return {
      devices: [],
      loading: true,
      showAddDevice: false,
      showBindModal: false,
      currentDevice: null,
      submitting: false,
      // 植物绑定相关数据
      loadingPlants: false,
      userPlants: [],
      bindPlantParams: {
        pageNum: 1,
        pageSize: 10  // 每页显示10个植物
      },
      bindPlantTotal: 0,
      bindPlantLoadStatus: 'loadmore',
      newDevice: {
        device_code: ''
      },
      queryParams: {
        pageNum: 1,
        pageSize: 3
      },
      DEVICE_STATUS_MAP,
      loadStatus: 'loadmore',
      total: 0,
      scrollHeight: 400 // 默认高度，在 mounted 中动态计算
    };
  },

  onLoad() {
    this.connectMqtt();
    this.calculateScrollHeight()
    uni.$on('refreshDeviceList', this.refreshDevices);
  },

  onShow() {
    if (this.devices && this.devices.length > 0) {
      this.mqttSubscribe(this.devices);
    }
  },

  onUnload() {
    uni.$off('refreshDeviceList', this.refreshDevices);
    if (this.devices && this.devices.length > 0) {
      this.mqttUnSubscribe(this.devices);
    }
  },

  onHide() {
    if (this.devices && this.devices.length > 0) {
      this.mqttUnSubscribe(this.devices);
    }
  },

  onPullDownRefresh() {
    this.refreshDevices();
  },

  onReachBottom() {
    console.log('触发上拉加载更多', this.loadStatus);
    if (this.loadStatus === 'loadmore') {
      this.queryParams.pageNum++;
      this.getDevices();
    }
  },

  methods: {
    /**
     * 计算滚动区域高度
     */
    calculateScrollHeight() {
      // 根据窗口高度计算合适的滚动区域高度
      const systemInfo = uni.getSystemInfoSync();
      this.scrollHeight = systemInfo.windowHeight * 0.6; // 屏幕高度的60%
    },

    /**
     * 刷新设备列表
     */
    refreshDevices() {
      console.log('刷新设备列表');
      this.queryParams.pageNum = 1;
      this.loadStatus = 'loadmore';
      this.getDevices();
    },

    /**
     * 获取设备列表
     */
    async getDevices() {
      try {
        // 只在第一页时显示加载状态
        this.loading = this.queryParams.pageNum === 1;

        const response = await getUserDevices(this.queryParams);
        console.log('获取设备列表响应:', response);

        if (response.code === 200) {
          const devices = response.rows || [];

          // 过滤掉不需要的设备
          const filteredDevices = devices.filter(device => device.deviceId !== 118);

          // 处理分页数据
          if (this.queryParams.pageNum === 1) {
            this.devices = filteredDevices;
          } else {
            this.devices = [...this.devices, ...filteredDevices];
          }

          this.total = response.total || 0;

          // 更新加载状态
          const hasMore = this.devices.length < this.total;
          this.loadStatus = hasMore ? 'loadmore' : 'nomore';

          console.log(`分页信息: 当前${this.devices.length}/总数${this.total}, 状态: ${this.loadStatus}`);

          // 为每个设备加载运行状态数据
          await this.loadDevicesRunningStatus();

          // 订阅消息
          if (this.devices && this.devices.length > 0) {
            this.mqttSubscribe(this.devices);
          }

        } else {
          uni.showToast({
            title: response.msg || '加载失败',
            icon: 'none'
          });

          // 加载失败时恢复页码
          if (this.queryParams.pageNum > 1) {
            this.queryParams.pageNum--;
          }
        }
      } catch (error) {
        console.error('加载设备列表失败:', error);
        uni.showToast({
          title: '加载失败,请重试',
          icon: 'none'
        });

        // 加载失败时恢复页码
        if (this.queryParams.pageNum > 1) {
          this.queryParams.pageNum--;
        }
      } finally {
        this.loading = false;
        uni.stopPullDownRefresh();
      }
    },

    /**
     * 连接MQTT
     */
    async connectMqtt() {
      if (this.$mqttTool.client == null) {
        await this.$mqttTool.connect(this.vuex_token);
      }
      this.mqttCallback();
      this.getDevices();
    },

    /**
     * MQTT消息回调
     */
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

          for (let i = 0; i < this.devices.length; i++) {
            if (this.devices[i].serialNumber == deviceNum) {
              this.devices[i].status = message.status;
              this.devices[i].isShadow = message.isShadow;
              this.devices[i].rssi = message.rssi;
              return;
            }
          }
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

          this.$set(this.devices[deviceIndex], 'thingsModels', updatedThingsModels);
        }
      });
    },

    /**
     * 订阅MQTT主题
     */
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

    /**
     * 取消订阅MQTT主题
     */
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

    /**
     * 加载设备运行状态
     */
    async loadDevicesRunningStatus() {
      for (let i = 0; i < this.devices.length; i++) {
        try {
          // 获取缓存物模型
          const cacheResponse = await cacheJsonThingsModel(this.devices[i].productId);
          let cacheThingsModel = {};
          if (cacheResponse.code === 200 && cacheResponse.data) {
            cacheThingsModel = JSON.parse(cacheResponse.data);
          }

          const cacheThingsModelAll = Object.values(cacheThingsModel).flat();

          // 获取设备运行状态
          const statusResponse = await getRunningStatus(
            this.devices[i].deviceId,
            this.devices[i].slaveId || 1
          );

          if (statusResponse.code === 200 && statusResponse.data) {
            let allThingsModels = statusResponse.data.thingsModels || [];
            // 合并中文名称
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

    /**
     * 添加设备
     */
    onBindDevice() {
      if (!this.newDevice.device_code) {
        uni.showToast({
          title: '请输入设备编码',
          icon: 'none'
        });
        return;
      }

      this.submitting = true;
      bindDevice({ serialNumber: this.newDevice.device_code })
        .then(result => {
          console.log('绑定设备响应:', result);
          if (result.code !== 200) {
            uni.showToast({
              title: '添加设备失败: ' + (result.data || result.msg),
              icon: 'none'
            });
            return;
          }

          this.showAddDevice = false;
          this.newDevice.device_code = '';
          this.refreshDevices();

          uni.showToast({
            title: '设备添加成功!',
            icon: 'success'
          });
        })
        .catch(error => {
          uni.showToast({
            title: '添加设备失败: ' + error.message,
            icon: 'none'
          });
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    /**
     * 绑定设备到植物 - 打开弹窗
     */
    async bindDevice(device) {
      if (device.status !== 3) {
        uni.showToast({
          title: '设备不在线',
          icon: 'none'
        })
        return
      }
      this.currentDevice = device;
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

          // 加载失败时恢复页码
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

        // 加载失败时恢复页码
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
      // console.log('this.currentDevice', this.currentDevice)
      // 将植物ID传给设备端
      const publishResult = await this.mqttPublish(this.currentDevice, {
        id: 'plant_id',
        name: '植物ID',
        type: 2,
        shadow: plant.id
      })
      // const publishResult = await this.mqttPublish(this.currentDevice, {
      //   id: 'time_set',
      //   name: '时间设置',
      //   type: 2,
      //   shadow: '100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100'
      // })
      // console.log('publishResult', publishResult)
      if (publishResult.code !== 200) {
        uni.showToast({
          title: publishResult.msg,
          icon: 'none'
        });
        return
      }
      try {
        const bindResult = await bindPlant({
          id: this.currentDevice.id,
          plantId: plant.id
        });

        if (bindResult.code === 200) {
          this.showBindModal = false;
          this.refreshDevices();
          uni.showToast({
            title: '绑定成功!',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: bindResult.msg,
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
     * 查看设备详情
     */
    viewDevice(device) {
      let url = `/pages-plants/plants/deviceDetail/deviceDetail?deviceId=${device.deviceId}&id=${device.id}&plantId=${device.plantId || ''}`
      uni.navigateTo({ url });
    },

    /**
     * 获取最新时间
     */
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

    /**
     * 格式化相对时间
     */
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
.sensor-devices {
  background-color: #f8f9fa;
}

.right-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-wrap {
  margin-left: 16rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 40rpx;
}

h1 {
  font-size: 48rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.add-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 40rpx;
}

.loading-state text {
  font-size: 28rpx;
  color: #666;
  margin-top: 32rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

.devices-grid {
  margin: 0 -20rpx;
  padding: 20rpx 60rpx 40rpx;
  box-sizing: border-box;
}

.device-card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  border: 2rpx solid #e0e0e0;
  margin: 0 0 40rpx 0;
  width: 100%;
  box-sizing: border-box;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32rpx;
}

.device-info h3 {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.device-type {
  font-size: 24rpx;
  color: #666;
}

.device-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status-badge {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.status-badge.online {
  background: #e8f5e9;
  color: #4CAF50;
}

.status-badge.offline {
  background: #fce4ec;
  color: #e91e63;
}

.battery {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
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

.bound-plant {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.bound-plant image {
  width: 96rpx;
  height: 96rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.bound-plant text {
  font-size: 28rpx;
  font-weight: 500;
}

.unbound {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #fafafa;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.unbound text {
  font-size: 28rpx;
  color: #999;
}

.bind-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12rpx 32rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
}

.latest-reading {
  border-top: 2rpx solid #e0e0e0;
  padding-top: 32rpx;
}

.reading-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.reading-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
}

.reading-time {
  font-size: 22rpx;
  color: #999;
}

.reading-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8rpx;
}

.reading-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: #fafafa;
  border-radius: 16rpx;
  margin: 0 8rpx 16rpx 8rpx;
  width: calc(50% - 16rpx);
  box-sizing: border-box;
}

.reading-item .icon {
  font-size: 40rpx;
  line-height: 1;
  margin-right: 16rpx;
}

.reading-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.reading-item .label {
  font-size: 22rpx;
  color: #999;
  line-height: 1;
  margin-bottom: 8rpx;
}

.reading-item .value {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1;
}

.no-reading {
  padding: 64rpx 32rpx;
  text-align: center;
  color: #999;
  font-size: 26rpx;
  border-top: 2rpx solid #e0e0e0;
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
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-content h2 {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 40rpx;
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

.loading-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  color: #666;
}

.loading-modal::before {
  content: '';
  width: 64rpx;
  height: 64rpx;
  border: 6rpx solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24rpx;
}

.plants-container {
  flex: 1;
  margin-bottom: 20rpx;
}

.plants-scroll {
  width: 100%;
}

.loadmore-section {
  padding: 20rpx 0;
}

.modal-actions {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.close-btn {
  width: 100%;
  background: #f8f8f8;
  color: #333;
  border: none;
  padding: 20rpx;
  border-radius: 12rpx;
}

.add-plant-link {
  color: #007AFF;
  text-decoration: underline;
  margin-top: 20rpx;
  display: inline-block;
}

/* 确保弹窗内容可以滚动 */
.modal-content {
  max-height: 80vh;
  overflow: hidden;
}

.btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}
</style>