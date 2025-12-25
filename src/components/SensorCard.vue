<!--
 * @Date: 2025-12-08 17:16:31
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-25 13:39:34
 * @Description:
-->
<template>
  <view @click="goDetail"
    class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden box-border">
    <!-- Background Decoration -->
    <view class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 z-0 pointer-events-none">
    </view>

    <view class="flex justify-between items-start mb-3 relative z-10">
      <view>
        <view class="flex items-center space-x-2">
          <text class="font-bold text-slate-800 text-lg">{{ sensor.deviceName }}</text>
          <view class="px-2 py-0.5 bg-blue-50 rounded-md">
            <span :class="getStatusStyle(sensor.status)" class="text-[20rpx] font-bold uppercase tracking-wider">
              {{ DEVICE_STATUS_MAP[sensor.status] }}
            </span>
          </view>
        </view>
        <!-- <text class="text-xs text-slate-400 mt-1 block">ID: {{ sensor.serialNumber }}</text> -->
        <view v-if="sensor.plantName"
          class="flex items-center gap-1 mt-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit border border-solid border-emerald-100">
          <!-- <Sprout class="w-3 h-3" /> -->
          <span class="text-[20rpx] font-bold">{{ sensor.plantName }}</span>
        </view>
        <view v-else class="text-[20rpx] text-slate-300 mt-2 font-medium bg-slate-50 px-2 py-1 rounded-md w-fit">未绑定植物
        </view>
      </view>
      <view className="flex flex-col items-end gap-2">
        <view class="flex items-center space-x-1">
          <text class="text-xs font-medium" :class="batteryColorClass">
            100%
          </text>
          <text class="iconfont icon-lucide-battery text-base" :class="batteryColorClass"></text>
        </view>
        <view v-if="sensor.plantName" @click.stop="handleUnbind"
          class="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 text-[10px] font-bold rounded-md transition-colors">
          解除绑定
        </view>
        <view v-else @click.stop="handleBind"
          class="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 text-[10px] font-bold rounded-md transition-colors">
          绑定植物
        </view>
      </view>
    </view>

    <view class="grid grid-cols-2 gap-4 relative z-10">
      <!-- <view v-if="sensor.readings.temperature !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-thermometer text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">温度</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.temperature }}°C</text>
      </view> -->

      <!-- <view v-if="sensor.readings.humidity !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-cloud-rain text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">湿度</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.humidity }}%</text>
      </view> -->

      <!-- <view v-if="sensor.readings.soilMoisture !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-droplets text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">土壤</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.soilMoisture }}%</text>
      </view> -->

      <!-- <view v-if="sensor.readings.light !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-sun text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">光照</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.light }} Lx</text>
      </view> -->

      <view v-for="thingsModel in sensor.thingsModels" :key="thingsModel.id" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text :class="getReadingIcon(thingsModel.id)" class="iconfont text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">{{ thingsModel.name }}</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ thingsModel.shadow || thingsModel.value || 0 }}
          {{ thingsModel.datatype.unit }}</text>
      </view>
    </view>

    <view class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center relative z-10">
      <text class="text-[20rpx] text-slate-400">上次更新: {{ latestTime }}</text>
      <text :class="getSignalConfig()" class="iconfont text-xs"></text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { DEVICE_STATUS_MAP } from '@/common/constants';
import { getLatestTime } from '@/hooks/useDevices';

const props = defineProps({
  sensor: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['unbind', 'bind']);

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

const goDetail = () => {
  uni.navigateTo({
    url: '/pages-plants/plants/sensorDetail/index?id=' + props.sensor.deviceId + '&sensorId=' + props.sensor.id + '&plantId=' + props.sensor.plantId
  })
}

const handleUnbind = () => {
  emit('unbind', { sensorId: props.sensor.id, plantName: props.sensor.plantName, plantId: props.sensor.plantId })
}

const handleBind = () => {
  emit('bind', props.sensor)
}

</script>