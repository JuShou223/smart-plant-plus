<template>
  <view
    class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative box-border"
    @click="handleNavigateToDetail">
    <!-- Card Header -->
    <view class="relative h-48 overflow-hidden">
      <view
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
      <image :src="plant.image" mode="aspectFill"
        class="w-full h-full object-cover transition-transform duration-700" />
      <!-- Status Badge -->
      <view class="absolute top-4 right-4 px-3 py-1 rounded-full border backdrop-blur-md z-20 shadow-sm"
        :class="statusClasses">
        <text class="text-xs font-bold">{{ statusText }}</text>
      </view>
      <!-- Title -->
      <view class="absolute bottom-4 left-4 z-20 text-white">
        <text class="text-xl font-bold tracking-tight block">{{ plant.name }}</text>
        <text class="text-sm text-emerald-100 font-medium italic opacity-90">{{ plant.species }}</text>
      </view>
    </view>

    <view class="p-5">
      <view v-if="sensorData" class="grid grid-cols-2 gap-3">
        <!-- Soil Moisture -->
        <view class="metric-item"
          :class="getMetricStyle(sensorData.readings.soilMoisture, plant.requirements.soilMoisture).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-droplets text-sm"
                :class="getMetricStyle(sensorData.readings.soilMoisture, plant.requirements.soilMoisture).color"></text>
              <text class="text-xs text-slate-500 font-medium">土壤湿度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(sensorData.readings.soilMoisture, plant.requirements.soilMoisture).color">
                {{ getMetricStyle(sensorData.readings.soilMoisture, plant.requirements.soilMoisture).label }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ sensorData.readings.soilMoisture }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">%</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ plant.requirements.soilMoisture.min }}-{{
                  plant.requirements.soilMoisture.max }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Light -->
        <view class="metric-item" :class="getMetricStyle(sensorData.readings.light, plant.requirements.light).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-sun text-sm"
                :class="getMetricStyle(sensorData.readings.light, plant.requirements.light).color"></text>
              <text class="text-xs text-slate-500 font-medium">光照强度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(sensorData.readings.light, plant.requirements.light).color">
                {{ getMetricStyle(sensorData.readings.light, plant.requirements.light).label }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ sensorData.readings.light }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">Lx</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ plant.requirements.light.min }}-{{
                  plant.requirements.light.max }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Temp -->
        <view class="metric-item"
          :class="getMetricStyle(sensorData.readings.temperature, plant.requirements.temperature).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-thermometer text-sm"
                :class="getMetricStyle(sensorData.readings.temperature, plant.requirements.temperature).color"></text>
              <text class="text-xs text-slate-500 font-medium">环境温度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(sensorData.readings.temperature, plant.requirements.temperature).color">
                {{ getMetricStyle(sensorData.readings.temperature, plant.requirements.temperature).label }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ sensorData.readings.temperature }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">°C</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ plant.requirements.temperature.min }}-{{
                  plant.requirements.temperature.max }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Humidity -->
        <view class="metric-item" :class="getMetricStyle(sensorData.readings.humidity, plant.requirements.humidity).bg">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center space-x-1.5">
              <text class="iconfont icon-lucide-cloud-rain text-sm"
                :class="getMetricStyle(sensorData.readings.humidity, plant.requirements.humidity).color"></text>
              <text class="text-xs text-slate-500 font-medium">空气湿度</text>
            </view>
            <view class="px-1.5 py-0.5 rounded-md bg-white/60">
              <text class="text-[20rpx] font-bold"
                :class="getMetricStyle(sensorData.readings.humidity, plant.requirements.humidity).color">
                {{ getMetricStyle(sensorData.readings.humidity, plant.requirements.humidity).label }}
              </text>
            </view>
          </view>
          <view class="mt-auto">
            <view class="flex items-baseline">
              <text class="text-xl font-bold text-slate-700 leading-none">{{ sensorData.readings.humidity }}</text>
              <text class="text-xs text-slate-400 font-medium ml-0.5">%</text>
            </view>
            <view class="mt-1.5 flex items-center">
              <text class="text-[20rpx] text-slate-400 mr-1.5">宜</text>
              <view class="bg-white/50 px-1.5 py-0.5 rounded-sm">
                <text class="text-[20rpx] text-slate-500 font-medium">{{ plant.requirements.humidity.min }}-{{
                  plant.requirements.humidity.max }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-else
        class="py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <text class="iconfont icon-lucide-activity text-3xl mb-2 opacity-20"></text>
        <text class="text-xs">暂无传感器数据</text>
      </view>

      <button @click.stop="handleAnalyze"
        class="mt-5 w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-100">
        <text class="iconfont icon-lucide-activity text-base"></text>
        <text>AI 智能诊断</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

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

const emit = defineEmits(['analyze']);

const statusClasses = computed(() => {
  switch (props.plant.status) {
    case 'healthy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'needs-attention': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'warning': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
});

const statusText = computed(() => {
  switch (props.plant.status) {
    case 'healthy': return '健康';
    case 'needs-attention': return '需关注';
    case 'warning': return '异常';
    default: return '未知';
  }
});

const getMetricStyle = (value, range) => {
  if (value === undefined) return { label: '--', color: 'text-slate-400', bg: 'bg-slate-50', isOk: false };

  if (value < range.min) {
    return { label: '偏低', color: 'text-blue-600', bg: 'bg-blue-50', isOk: false };
  } else if (value > range.max) {
    return { label: '偏高', color: 'text-amber-600', bg: 'bg-amber-50', isOk: false };
  } else {
    return { label: '适宜', color: 'text-emerald-600', bg: 'bg-emerald-50', isOk: true };
  }
};

const handleAnalyze = () => {
  emit('analyze', props.plant, props.sensorData);
};

const handleNavigateToDetail = () => {
  uni.navigateTo({ url: '/pages-plants/plants/myPlantDetail/index' });
}

</script>

<style scoped>
.metric-item {
  @apply flex flex-col p-3 rounded-xl transition-all duration-300 min-h-[160rpx];
}
</style>