<template>
  <view
    class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative box-border"
    @click="handleNavigateToDetail">
    <!-- Card Header -->
    <view class="relative h-48 overflow-hidden">
      <view
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
      <image :src="displayPlant.plantImage" mode="aspectFill"
        class="w-full h-full object-cover transition-transform duration-700" />
      <!-- Status Badge -->
      <view
        class="flex items-center justify-center absolute top-4 right-4 px-3 py-1 rounded-full border backdrop-blur-md z-20 shadow-sm space-x-1"
        :class="getStatusConfig.className">
        <text class="iconfont" :class="getStatusConfig.icon"></text>
        <text class="text-xs font-bold leading-none">{{ getStatusConfig.text }}</text>
      </view>
      <!-- Title -->
      <view class="absolute bottom-4 left-4 z-20 text-white">
        <text class="text-xl font-bold tracking-tight block">{{ displayPlant.plantName }}</text>
        <text class="text-sm text-emerald-100 font-medium italic opacity-90">{{ displayPlant.species }}</text>
      </view>
    </view>

    <view class="p-5">
      <view v-if="currentSensorData && currentSensorData.length > 0" class="grid grid-cols-2 gap-3">
        <!-- Soil Moisture -->
        <view v-for="currentSData in currentSensorData" :key="currentSData.id" class="metric-item"
          :class="getMetricStyle(currentSData.value, displayPlant.requirements[currentSData.id]).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont text-sm"
                :class="`${getMetricStyle(currentSData.value, displayPlant.requirements[currentSData.id]).color} ${getSensorIcon(currentSData.id)}`"></text>
              <text class="text-xs text-slate-500 font-medium">{{ currentSData.name }}</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(currentSData.value, displayPlant.requirements[currentSData.id]).color">
                {{ getMetricStyle(currentSData.value, displayPlant.requirements[currentSData.id]).label
                }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ currentSData.value || 0
                }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">{{ currentSData.datatype.unit }}</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">
                  {{
                    displayPlant.requirements[currentSData.id].min
                  }}-{{
                    displayPlant.requirements[currentSData.id].max
                  }}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- <view class="metric-item"
          :class="getMetricStyle(currentSensorData.readings.soilMoisture, displayPlant.requirements.soilMoisture).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-droplets text-sm"
                :class="getMetricStyle(currentSensorData.readings.soilMoisture, displayPlant.requirements.soilMoisture).color"></text>
              <text class="text-xs text-slate-500 font-medium">土壤湿度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(currentSensorData.readings.soilMoisture, displayPlant.requirements.soilMoisture).color">
                {{ getMetricStyle(currentSensorData.readings.soilMoisture, displayPlant.requirements.soilMoisture).label
                }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ currentSensorData.readings.soilMoisture
              }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">%</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ displayPlant.requirements.soilMoisture.min
                }}-{{
                    displayPlant.requirements.soilMoisture.max }}</text>
              </view>
            </view>
          </view>
        </view> -->

        <!-- Light -->
        <!-- <view class="metric-item"
          :class="getMetricStyle(currentSensorData.readings.light, displayPlant.requirements.light).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-sun text-sm"
                :class="getMetricStyle(currentSensorData.readings.light, displayPlant.requirements.light).color"></text>
              <text class="text-xs text-slate-500 font-medium">光照强度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(currentSensorData.readings.light, displayPlant.requirements.light).color">
                {{ getMetricStyle(currentSensorData.readings.light, displayPlant.requirements.light).label }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ currentSensorData.readings.light }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">Lx</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ displayPlant.requirements.light.min }}-{{
                  displayPlant.requirements.light.max }}</text>
              </view>
            </view>
          </view>
        </view> -->

        <!-- Temp -->
        <!-- <view class="metric-item"
          :class="getMetricStyle(currentSensorData.readings.temperature, displayPlant.requirements.temperature).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-thermometer text-sm"
                :class="getMetricStyle(currentSensorData.readings.temperature, displayPlant.requirements.temperature).color"></text>
              <text class="text-xs text-slate-500 font-medium">环境温度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(currentSensorData.readings.temperature, displayPlant.requirements.temperature).color">
                {{ getMetricStyle(currentSensorData.readings.temperature, displayPlant.requirements.temperature).label
                }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ currentSensorData.readings.temperature
              }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">°C</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ displayPlant.requirements.temperature.min }}-{{
                  displayPlant.requirements.temperature.max }}</text>
              </view>
            </view>
          </view>
        </view> -->

        <!-- Humidity -->
        <!-- <view class="metric-item"
          :class="getMetricStyle(currentSensorData.readings.humidity, displayPlant.requirements.humidity).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-cloud-rain text-sm"
                :class="getMetricStyle(currentSensorData.readings.humidity, displayPlant.requirements.humidity).color"></text>
              <text class="text-xs text-slate-500 font-medium">空气湿度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(currentSensorData.readings.humidity, displayPlant.requirements.humidity).color">
                {{ getMetricStyle(currentSensorData.readings.humidity, displayPlant.requirements.humidity).label }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ currentSensorData.readings.humidity
              }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">%</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ displayPlant.requirements.humidity.min }}-{{
                  displayPlant.requirements.humidity.max }}</text>
              </view>
            </view>
          </view>
        </view> -->
      </view>

      <view v-else
        class="relative py-7 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <!-- <button
          class="absolute top-2 right-2 text-[20rpx] flex items-center gap-1 text-emerald-600 bg-white border border-emerald-100 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm">
          <text class="iconfont icon-lucide-link text-sm leading-none"></text>绑定设备
        </button> -->
        <button @click.stop="showAddSensorModal = true"
          class="mb-2 text-[20rpx] flex items-center gap-1 text-emerald-600 bg-white border border-emerald-100 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm">
          <text class="iconfont icon-lucide-link text-sm leading-none"></text>绑定设备
        </button>
        <!-- <text class="iconfont icon-lucide-activity text-3xl mb-2 opacity-20"></text> -->
        <text class="text-xs">暂无传感器数据</text>
      </view>

      <button @click.stop="handleAnalyze"
        class="mt-5 w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-100">
        <text class="iconfont icon-lucide-activity text-base"></text>
        <text>AI 智能诊断</text>
      </button>
    </view>

    <addSensorModal v-if="showAddSensorModal" :plant="plant" @close="showAddSensorModal = false"
      @confirm="handleBindPlant"></addSensorModal>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch, onUnmounted } from 'vue';
import { getDeviceDetail } from '@/hooks/useDevices'
import { loadSinglePlant } from '@/hooks/usePlants'
import addSensorModal from './addSensorModal.vue';
import { bindPlant } from "@/apis/modules/sensors";
import { serviceInvoke } from '@/apis/modules/runtime.js';
import bus from '@/common/bus.js';

const props = defineProps({
  plant: {
    type: Object,
    required: true
  },
  sensorData: {
    type: Object,
    default: null
  }
});

// const emit = defineEmits(['analyze']);

// 内部维护的传感器数据，支持从 props 传入或自行加载
const currentSensorData = ref([]);
const showAddSensorModal = ref(false)
const deviceDetail = ref(null)

// 监听 props 变化
watch(() => props.sensorData, (val) => {
  currentSensorData.value = val;
});

// 组件挂载时，如果存在 deviceId，则请求设备详情
onMounted(async () => {
  // if (props.plant.deviceId) {
  try {
    const plantDetail = await loadSinglePlant(props.plant.id);
    if (plantDetail && plantDetail.sensorList && plantDetail.sensorList.length > 0) {
      const sensor = plantDetail.sensorList[0];
      loadSensor(sensor.device_id)
      // const deviceDetailResult = await getDeviceDetail(sensor.device_id);
      // const data = await getDeviceDetail(plantDetail.deviceId);
      // if (deviceDetailResult) {
      //   currentSensorData.value = deviceDetailResult.thingsModels;
      //   deviceDetail.value = deviceDetailResult
      // }
    }
    // const data = await getDeviceDetail('270');
    // if (data) {
    //   currentSensorData.value = data.thingsModels;
    // }
    bus.on('refreshPlantSensor_' + props.plant.id, (sensorId) => {
      console.log('refreshPlantSensor_', sensorId)
      if (sensorId) {
        loadSensor(sensorId)
      } else {
        currentSensorData.value = []
        deviceDetail.value = null
      }
    })
  } catch (error) {
    console.error('PlantCard fetch device error:', error);
  }
  // }
});
onUnmounted(() => {
  bus.off('refreshPlantSensor_' + props.plant.id)
})
// 计算属性：合并 props.plant 和模拟数据
const displayPlant = computed(() => {
  const p = props.plant;
  // 如果已有完整数据，直接返回
  return p;
  // 否则根据 ID（或名称）计算哈希索引，确保同一植物每次显示相同的模拟数据
});

const getStatusConfig = computed(() => {
  const p = displayPlant.value;
  // Priority logic: Pest > Water > Temp > Light > Healthy
  const hasCondition = c => p.healthCondition === c;
  const count = p.issueCount;
  const suffix = count > 1 ? ` +${count - 1}` : '';

  // 1. High Priority Specific Conditions
  if (hasCondition('pest')) {
    return {
      text: `虫害风险${suffix}`,
      icon: 'icon-lucide-bug',
      className: 'bg-red-500 text-white border-red-600 shadow-red-200'
    };
  }
  if (hasCondition('water-low')) {
    return {
      text: `缺水警报${suffix}`,
      icon: 'icon-lucide-droplets',
      className: 'bg-blue-500 text-white border-blue-600 shadow-blue-200'
    };
  }
  if (hasCondition('temp-issue')) {
    return {
      text: `温度异常${suffix}`,
      icon: 'icon-lucide-thermometer',
      className: 'bg-orange-500 text-white border-orange-600 shadow-orange-200'
    };
  }
  if (hasCondition('light-low')) {
    return {
      text: `光照不足${suffix}`,
      icon: 'icon-lucide-sun',
      className: 'bg-amber-500 text-white border-amber-600 shadow-amber-200'
    };
  }
  if (hasCondition('healthy')) {
    return {
      text: `非常健康`,
      icon: 'icon-lucide-check',
      className: 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200'
    };
  }

  // Default fallback
  return {
    text: `非常健康`,
    icon: 'icon-lucide-check',
    className: 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200'
  };
});

const getMetricStyle = (value, range) => {
  if (value === undefined || !range) return { label: '--', color: 'text-slate-400', bg: 'bg-slate-50', isOk: false };

  if (value < range.min) {
    return { label: '偏低', color: 'text-blue-600', bg: 'bg-blue-50', isOk: false };
  } else if (value > range.max) {
    return { label: '偏高', color: 'text-amber-600', bg: 'bg-amber-50', isOk: false };
  } else {
    return { label: '适宜', color: 'text-emerald-600', bg: 'bg-emerald-50', isOk: true };
  }
};

const getSensorIcon = (type) => {
  if (type === "soil_moisture") {
    return 'icon-lucide-droplets';
  } else if (type === 'light') {
    return 'icon-lucide-sun';
  }
}

// const handleAnalyze = () => {
//   emit('analyze', displayPlant.value, currentSensorData.value);
// };

const handleNavigateToDetail = () => {
  uni.navigateTo({ url: `/pages-plants/plants/myPlantDetail/index?plantId=${displayPlant.value.id}` });
}
const mqttPublish = async (device, model) => {
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
}

const handleBindPlant = async (sensor) => {
  console.log('sensor', sensor)
  // / console.log('this.currentDevice', this.currentDevice)
  // 将植物ID传给设备端
  const publishResult = await mqttPublish(sensor, {
    id: 'plant_id',
    name: '植物ID',
    type: 2,
    shadow: displayPlant.value.id
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
      id: sensor.id,
      plantId: displayPlant.value.id
    });

    if (bindResult.code === 200) {
      // this.showBindModal = false;
      showAddSensorModal.value = false
      loadSensor(sensor.deviceId)
      bus.emit('refreshDeviceList')
      // this.refreshDevices();
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
}

const loadSensor = async (deviceId) => {
  const deviceDetailResult = await getDeviceDetail(deviceId);
  // const data = await getDeviceDetail(plantDetail.deviceId);
  if (deviceDetailResult) {
    currentSensorData.value = deviceDetailResult.thingsModels;
    deviceDetail.value = deviceDetailResult
  }
}



const handleAnalyze = () => uni.navigateTo({ url: '/pages-plants/tools/ai/AiDiagnose?plantId=' + displayPlant.value.id });


</script>

<style scoped>
.metric-item {
  @apply flex flex-col p-3 rounded-xl transition-all duration-300 min-h-[160rpx];
}
</style>