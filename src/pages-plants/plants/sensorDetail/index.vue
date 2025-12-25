<template>
  <view class="min-h-screen bg-slate-50 elative z-50 pb-24 font-sans">

    <!-- 1. Header Card -->
    <view v-if="sensor"
      class="bg-slate-900 text-white pt-6 pb-12 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-xl">
      <!-- Background Pattern -->
      <view class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;"></view>

      <view class="relative z-10">
        <!-- Navbar -->
        <view class="flex justify-between items-center mb-8">
          <button @click="handleBack"
            class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md border-none m-0 flex items-center justify-center">
            <text class="iconfont icon-lucide-chevron-left text-xl text-white"></text>
          </button>
          <!-- <text class="font-mono text-sm tracking-widest uppercase text-slate-400">Device Settings</text> -->
          <!-- <button @click="isEditing = !isEditing"
            class="p-2 rounded-full transition-all backdrop-blur-md border-none m-0 flex items-center justify-center"
            :class="isEditing ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'">
            <text class="iconfont text-xl" :class="isEditing ? 'icon-lucide-x' : 'icon-lucide-settings'"></text>
          </button> -->
        </view>

        <!-- Main Info -->
        <view class="flex items-center gap-5">
          <view
            class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg border border-solid border-white/10 shrink-0">
            <text class="iconfont icon-lucide-activity text-4xl text-white"></text>
          </view>
          <view class="flex-1">
            <view v-if="isEditing" class="flex gap-2">
              <input type="text" v-model="newName"
                class="bg-white/10 border border-solid border-white/20 rounded-xl px-3 py-2 text-white font-bold outline-none flex-1 h-10 box-border"
                focus />
              <button @click="handleSaveName"
                class="p-2 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors border-none m-0 flex items-center justify-center w-10 h-10">
                <text class="iconfont icon-lucide-check text-xl text-white"></text>
              </button>
            </view>
            <view v-else class="flex items-center gap-2 group">
              <text class="text-2xl font-bold text-white">{{ sensor.deviceName }}</text>
              <text class="iconfont icon-lucide-edit-2 text-sm text-slate-500 opacity-50"></text>
            </view>

            <view class="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
              <view class="flex items-center gap-1 font-bold"
                :class="sensor.status === 3 ? 'text-emerald-400' : 'text-slate-400'">
                <text class="iconfont text-xs" :class="signalInfo"></text>
                <text>{{ DEVICE_STATUS_MAP[sensor.status] || '未知状态' }}</text>
              </view>
              <!-- <text>ID: {{ sensor.serialNumber }}</text> -->
            </view>
          </view>
        </view>

        <!-- Status Grid -->
        <!-- <view class="mt-8 grid grid-cols-3 gap-4">
          <view class="bg-white/5 rounded-xl p-3 border border-solid border-white/10 flex flex-col items-center">
            <text class="iconfont icon-lucide-battery text-lg text-emerald-400 mb-1"></text>
            <text class="text-lg font-bold text-white">100%</text>
          </view>
          <view class="bg-white/5 rounded-xl p-3 border border-solid border-white/10 flex flex-col items-center">
            <text class="iconfont text-lg mb-1" :class="[signalInfo.icon, signalInfo.color]"></text>
            <text class="text-lg font-bold text-white">{{ sensor.signalStrength || '--' }}</text>
          </view>
          <view class="bg-white/5 rounded-xl p-3 border border-solid border-white/10 flex flex-col items-center">
            <text class="iconfont icon-lucide-cpu text-lg text-blue-400 mb-1"></text>
            <text class="text-lg font-bold text-white">v1.0</text>
          </view>
        </view> -->
      </view>
    </view>

    <!-- 2. Content Body -->
    <view class="px-6 -mt-6 relative z-20 space-y-6">

      <!-- Linked Plant Card -->
      <view v-if="linkedPlant"
        class="bg-white rounded-2xl p-4 shadow-sm border border-solid border-slate-100 flex items-center justify-between">
        <view class="flex items-center gap-3">
          <image :src="linkedPlant.plantImage" mode="aspectFill" class="w-12 h-12 rounded-lg bg-slate-100" />
          <view>
            <text class="text-[10px] text-slate-400 block">当前监测</text>
            <text class="font-bold text-slate-800 text-sm">{{ linkedPlant.plantName }}</text>
          </view>
        </view>
        <view @click="showUnbindConfirm = true" class="flex items-center gap-2">
          <view class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
            解除绑定
          </view>
          <!-- <button
            class="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-colors border-none m-0 flex items-center justify-center">
            <text class="iconfont icon-lucide-unlink text-sm"></text>
          </button> -->
        </view>
      </view>
      <view v-else
        class="bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 py-6">
        <view class="text-center">
          <text class="text-xs font-bold mb-1 block">未绑定任何植物</text>
          <text class="text-[10px] block">设备处于空闲状态</text>
          <view @click="showBindModal = true"
            class="mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
            绑定植物
          </view>
        </view>
      </view>

      <!-- Charts Section -->
      <!-- <view class="bg-white rounded-3xl p-6 shadow-sm border border-solid border-slate-100">
        <view class="flex items-center justify-between mb-6">
          <text class="font-bold text-slate-800">历史趋势</text>
          <view class="flex bg-slate-100 p-1 rounded-lg">
            <view v-for="t in tabs" :key="t.key" @click="activeTab = t.key"
              class="p-1.5 rounded-md transition-all flex items-center justify-center w-8 h-8"
              :class="activeTab === t.key ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'">
              <text class="iconfont text-base" :class="t.icon"></text>
            </view>
          </view>
        </view>

        <view class="h-40 w-full relative">
          <svg viewBox="0 0 300 120" class="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient :id="'grad-' + chartColor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" :stop-color="chartColor" stop-opacity="0.2" />
                <stop offset="100%" :stop-color="chartColor" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path :d="`M${chartData.points.split(' ')[0]} L${chartData.fillPath} Z`" :fill="`url(#grad-${chartColor})`"
              stroke="none" />
            <polyline :points="chartData.points" fill="none" :stroke="chartColor" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round" />
            <circle :cx="300" :cy="chartData.points.split(' ').pop().split(',')[1]" r="4" fill="white"
              :stroke="chartColor" stroke-width="2" />
          </svg>
        </view>
      </view> -->
      <view
        class="bg-white rounded-2xl p-4 shadow-sm border border-solid border-slate-100 flex items-center justify-around">
        <view v-for="thingsModel in thingsModels" :key="thingsModel.id" class="flex flex-col">
          <view class="flex items-center gap-1 mb-1">
            <text :class="getReadingIcon(thingsModel.id)" class="iconfont text-slate-400 text-xs"></text>
            <text class="text-xs text-slate-400">{{ thingsModel.name }}</text>
          </view>
          <text class="text-xl font-semibold text-slate-700">{{ thingsModel.shadow || thingsModel.value || 0 }}
            {{ thingsModel.datatype.unit }}</text>
        </view>
      </view>

      <!-- Action List -->
      <view class="bg-white rounded-2xl shadow-sm border border-solid border-slate-100 overflow-hidden">
        <!-- <button @click="isEditing = true"
          class="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 bg-white m-0 leading-normal text-left">
          <view class="p-2 bg-slate-100 rounded-lg text-slate-600 flex items-center justify-center">
            <text class="iconfont icon-lucide-edit-2 text-lg"></text>
          </view>
          <view class="flex-1">
            <text class="block text-sm font-bold text-slate-700">重命名设备</text>
            <text class="text-[10px] text-slate-400 block">修改设备在列表中的显示名称</text>
          </view>
        </button>

        <button
          class="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 bg-white m-0 leading-normal text-left">
          <view class="p-2 bg-slate-100 rounded-lg text-slate-600 flex items-center justify-center">
            <text class="iconfont icon-lucide-rotate-ccw text-lg"></text>
          </view>
          <view class="flex-1">
            <text class="block text-sm font-bold text-slate-700">重新校准</text>
            <text class="text-[10px] text-slate-400 block">如果传感器数值读数异常</text>
          </view>
        </button> -->

        <button @click="showDeleteConfirm = true"
          class="w-full flex items-center gap-3 p-4 hover:bg-rose-50 transition-colors bg-white m-0 leading-normal text-left group">
          <view class="p-2 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center">
            <text class="iconfont icon-lucide-trash-2 text-lg"></text>
          </view>
          <view class="flex-1">
            <text class="block text-sm font-bold text-rose-600">删除设备</text>
            <text class="text-[10px] text-rose-400 block">将此设备从您的账号中彻底移除</text>
          </view>
        </button>
      </view>
    </view>

    <!-- Delete Confirmation Modal -->
    <view v-if="showDeleteConfirm"
      class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <view class="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-fade-in-up">
        <view class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <text class="iconfont icon-lucide-triangle-alert leading-none text-3xl text-red-500"></text>
        </view>
        <text class="text-xl font-bold text-slate-900 text-center mb-2 block">删除设备？</text>
        <text class="text-sm text-slate-500 text-center mb-8 leading-relaxed block">
          将此设备从您的账号中彻底移除。如果设备已损坏或不再使用，请执行此操作。此操作不可撤销。
        </text>
        <view class="flex gap-4">
          <button @click="showDeleteConfirm = false"
            class="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 border-none m-0 leading-normal">取消</button>
          <button @click="handleDelete"
            class="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 border-none m-0 leading-normal">确认删除</button>
        </view>
      </view>
    </view>

    <hws-unbind-modal :sensorId="sensorId" :plantName="linkedPlant.plantName" v-if="showUnbindConfirm && linkedPlant"
      @close="showUnbindConfirm = false" @success="handleUnbindSuccess"></hws-unbind-modal>
    <hws-choose-plant :show="showBindModal" @close="showBindModal = false"
      @confirm="handleBindPlantConfirm"></hws-choose-plant>
  </view>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { getDeviceDetail } from '@/hooks/useDevices';
import { onLoad } from '@dcloudio/uni-app';
import { DEVICE_STATUS_MAP } from '@/common/constants';
import { getLatestTime } from '@/hooks/useDevices';
import { getPlantDetail } from '@/apis/modules/plants';
import {
  deleteDevice,
  bindPlant,
} from '@/apis/modules/sensors';
import bus from '@/common/bus.js';
import { serviceInvoke } from '@/apis/modules/runtime.js';
// ==================== Mock Data & Constants ====================
const HISTORY_DATA = {
  soil: [30, 29, 28, 28, 27, 26, 25, 25, 60, 58, 55, 52],
  temp: [18, 17, 16, 16, 17, 19, 22, 24, 25, 24, 22, 20],
  light: [0, 0, 0, 100, 500, 1200, 2500, 1800, 600, 100, 0, 0]
};

const tabs = [
  { key: 'soil', icon: 'icon-lucide-droplets' },
  { key: 'temp', icon: 'icon-lucide-thermometer' },
  { key: 'light', icon: 'icon-lucide-sun' }
];

// ==================== State ====================
const sensor = ref(null);
const thingsModels = ref([])
const linkedPlant = ref(null);

// const activeTab = ref('soil');
const isEditing = ref(false);
const newName = ref('');
const showDeleteConfirm = ref(false);
const showUnbindConfirm = ref(false);
const showBindModal = ref(false)
const sensorId = ref('')
// ==================== Computed ====================

const signalInfo = computed(() => {
  // if (sensor.value.status !== 3) return { icon: 'icon-lucide-wifi-off', color: 'text-slate-400' };
  // const dbm = sensor.value.signalStrength ?? -100;
  // if (dbm > -60) return { icon: 'icon-lucide-wifi', color: 'text-emerald-400' };
  // if (dbm > -75) return { icon: 'icon-lucide-wifi-high', color: 'text-yellow-400' };
  // return { icon: 'icon-lucide-wifi-low', color: 'text-orange-400' };
  if (sensor.value.status !== 3) {
    return 'icon-lucide-wifi-off text-slate-400';
  }
  const dbm = sensor.value.rssi;
  console.log('sensor.value', dbm)
  if (dbm > -60) return 'icon-lucide-wifi text-emerald-400';
  if (dbm > -75) return 'icon-lucide-wifi-high text-yellow-400';
  if (dbm > -85) return 'icon-lucide-wifi-low text-orange-400';
  return 'icon-lucide-wifi-zero text-red-400';
});

// ==================== Methods ====================


const batteryColorClass = computed(() => {
  console.log('props', props.sensor);
  let level = props.sensor.battery;
  level = 100
  if (level > 50) return 'text-emerald-500';
  if (level > 20) return 'text-yellow-500';
  return 'text-red-500';
});

const getStatusStyle = (status) => {
  switch (status) {
    case 3: return 'bg-blue-50 text-blue-600'; // 在线
    case 4: return 'bg-slate-100 text-slate-500'; // 离线
    case 2: return 'bg-red-50 text-red-600'; // 禁用
    default: return 'bg-gray-50 text-gray-500'; // 未激活
  }
};

const latestTime = computed(() => {
  return getLatestTime(props.sensor);
});

const getSignalConfig = () => {
  if (props.sensor.status !== 3) {
    return 'icon-lucide-wifi-off text-slate-400';
  }
  const dbm = props.sensor.rssi;
  if (dbm > -60) return 'icon-lucide-wifi text-emerald-400';
  if (dbm > -75) return 'icon-lucide-wifi-high text-yellow-400';
  if (dbm > -85) return 'icon-lucide-wifi-low text-orange-400';
  return 'icon-lucide-wifi-zero text-red-400';
};

const getReadingIcon = (readingType) => {
  switch (readingType) {
    case 'temperature': return 'icon-lucide-thermometer';
    case 'humidity': return 'icon-lucide-cloud-rain';
    case 'soil_moisture': return 'icon-lucide-droplets';
    case 'light': return 'icon-lucide-sun';
    default: return '';
  }
};

const handleBack = () => {
  uni.navigateBack();
};

const handleSaveName = () => {
  if (!newName.value.trim()) return;
  sensor.value.name = newName.value;
  isEditing.value = false;
  uni.showToast({ title: '修改成功', icon: 'success' });
};


// 确认绑定
const handleBindPlantConfirm = async (plant) => {
  try {
    const pubRes = await mqttPublish(sensor.value, {
      id: 'plant_id', name: '植物ID', type: 2, shadow: plant.id
    });
    if (pubRes.code !== 200) throw new Error(pubRes.msg);
    const bindRes = await bindPlant({ id: sensorId.value, plantId: plant.id });
    if (bindRes.code !== 200) throw new Error(bindRes.msg);
    bus.emit('refreshPlantSensor_' + plant.id, sensor.value.deviceId)
    showBindModal.value = false;
    bus.emit('refreshDeviceList')
    loadPlant(plant.id)
    // refreshDevices();
    uni.showToast({ title: '绑定成功!', icon: 'success' });
  } catch (e) {
    uni.showToast({ title: '绑定失败: ' + e.message, icon: 'none' });
  }
};


const loadSensor = async (deviceId) => {
  const deviceDetailResult = await getDeviceDetail(deviceId);
  // const data = await getDeviceDetail(plantDetail.deviceId);
  if (deviceDetailResult) {
    thingsModels.value = deviceDetailResult.thingsModels;
    sensor.value = deviceDetailResult
  }
}

const handleDelete = async () => {
  const deleteResult = await deleteDevice(sensorId.value);
  if (deleteResult.code === 200) {
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
    bus.emit('refreshDeviceList');
    bus.emit('refreshPlantSensor_' + linkedPlant.value.id)
  }
}

const handleUnbindSuccess = () => {
  bus.emit('refreshDeviceList');
  bus.emit('refreshPlantSensor_' + linkedPlant.value.id)
  linkedPlant.value = null
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

const loadPlant = (plantId) => {
  getPlantDetail(plantId, false).then(res => {
    if (res.code === 200) {
      linkedPlant.value = res.data;
    }
  })
}

// ==================== Lifecycle ====================
onLoad((options) => {
  if (options.id) {
    loadSensor(options.id)
  }
  if (options.sensorId) {
    sensorId.value = options.sensorId
  }
  if (options.plantId) {
    loadPlant(options.plantId)
  }
});
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>