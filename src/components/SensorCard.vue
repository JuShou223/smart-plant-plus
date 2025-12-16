<!--
 * @Date: 2025-12-08 17:16:31
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-08 17:16:57
 * @Description:
-->
<template>
  <view class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden box-border">
    <!-- Background Decoration -->
    <view class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 z-0 pointer-events-none">
    </view>

    <view class="flex justify-between items-start mb-6 relative z-10">
      <view>
        <view class="flex items-center space-x-2">
          <text class="font-bold text-slate-800 text-lg">{{ sensor.name }}</text>
          <view class="px-2 py-0.5 bg-blue-50 rounded-md">
            <text class="text-blue-600 text-[10px] font-bold uppercase tracking-wider">Online</text>
          </view>
        </view>
        <text class="text-xs text-slate-400 mt-1 block">ID: {{ sensor.id }}</text>
      </view>
      <view class="flex items-center space-x-1">
        <text class="text-xs font-medium" :class="batteryColorClass">
          {{ sensor.batteryLevel }}%
        </text>
        <text class="iconfont icon-lucide-battery text-base" :class="batteryColorClass"></text>
      </view>
    </view>

    <view class="grid grid-cols-2 gap-4 relative z-10">
      <view v-if="sensor.readings.temperature !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-thermometer text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">温度</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.temperature }}°C</text>
      </view>

      <view v-if="sensor.readings.humidity !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-cloud-rain text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">湿度</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.humidity }}%</text>
      </view>

      <view v-if="sensor.readings.soilMoisture !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-droplets text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">土壤</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.soilMoisture }}%</text>
      </view>

      <view v-if="sensor.readings.light !== undefined" class="flex flex-col">
        <view class="flex items-center gap-1 mb-1">
          <text class="iconfont icon-lucide-sun text-slate-400 text-xs"></text>
          <text class="text-xs text-slate-400">光照</text>
        </view>
        <text class="text-xl font-semibold text-slate-700">{{ sensor.readings.light }} Lx</text>
      </view>
    </view>

    <view class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center relative z-10">
      <text class="text-[10px] text-slate-400">上次更新: {{ sensor.lastUpdate }}</text>
      <text class="iconfont icon-lucide-wifi text-emerald-500 text-xs"></text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  sensor: {
    type: Object,
    required: true
  }
});

const batteryColorClass = computed(() => {
  const level = props.sensor.batteryLevel;
  if (level > 50) return 'text-emerald-500';
  if (level > 20) return 'text-yellow-500';
  return 'text-red-500';
});
</script>