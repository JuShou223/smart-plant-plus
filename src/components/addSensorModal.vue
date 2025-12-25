<template>
  <view
    class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    @click.self="handleClose">
    <view
      class="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh]"
      @click.stop>

      <!-- Header -->
      <view class="flex justify-between items-start mb-6">
        <view>
          <text class="text-xl font-bold text-slate-900 block">绑定传感器</text>
          <text class="text-xs text-slate-400 mt-1 block">为 <text class="text-emerald-600 font-bold">{{ plant.plantName
              }}</text> 选择监测设备</text>
        </view>
        <view class="flex items-center gap-2">
          <!-- <button
            @click="handleAddNewDevice"
            class="p-2 bg-emerald-50 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center justify-center m-0 border-none leading-none"
            title="添加新设备"
          >
            <text class="iconfont icon-lucide-plus text-xl"></text>
          </button> -->
          <button @click="handleClose"
            class="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center m-0 border-none leading-none">
            <text class="iconfont icon-lucide-x text-xl"></text>
          </button>
        </view>
      </view>

      <!-- Search Bar Mock (Commented out per request) -->
      <!-- <view class="relative mb-6">
        <text class="iconfont icon-lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-300"></text>
        <input
          type="text"
          placeholder="搜索附近的设备..."
          class="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-50 transition-all h-12 box-border"
          disabled
        />
      </view> -->

      <!-- Sensor List -->
      <scroll-view scroll-y class="overflow-hidden space-y-3 no-scrollbar pb-6 box-border" style="height: 500rpx;"
        @scrolltolower="handleScrollToLower">
        <view class="space-y-3">
          <template v-if="availableSensors.length > 0">
            <view v-for="sensor in availableSensors" :key="sensor.id" @click="handleConfirm(sensor)"
              class="bg-white border border-solid border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group active:scale-[0.98]">
              <view
                class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors shrink-0">
                <text class="iconfont icon-lucide-activity text-xl"></text>
              </view>
              <view class="flex-1 min-w-0">
                <!-- 兼容 name 或 deviceName 字段 -->
                <text class="font-bold text-slate-800 text-sm truncate block">{{ sensor.name || sensor.deviceName
                  }}</text>
                <view class="flex items-center gap-3 mt-1">
                  <view class="flex items-center gap-1 text-[10px] text-slate-400">
                    <text class="iconfont icon-lucide-wifi text-xs"></text>
                    <text>{{ sensor.rssi || sensor.signalStrength || '--' }} dBm</text>
                  </view>
                  <!-- 电池电量 (如果有) -->
                  <view v-if="sensor.batteryLevel" class="flex items-center gap-1 text-[10px] text-slate-400">
                    <text class="iconfont icon-lucide-battery text-xs"></text>
                    <text>{{ sensor.batteryLevel }}%</text>
                  </view>
                </view>
              </view>
              <view
                class="w-8 h-8 rounded-full border border-solid border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                <text class="iconfont icon-lucide-check text-sm"></text>
              </view>
            </view>

            <!-- Load More Spinner -->
            <view v-if="deviceLoadStatus === 'loading'" class="py-4 flex justify-center w-full">
              <u-loading-icon mode="circle"></u-loading-icon>
            </view>


          </template>

          <template v-else-if="!deviceLoading">
            <view class="py-12 text-center flex flex-col items-center">
              <view class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <text class="iconfont icon-lucide-wifi text-3xl text-slate-200"></text>
              </view>
              <text class="text-sm font-medium text-slate-400 block">未发现空闲的在线设备</text>
              <text class="text-[10px] text-slate-300 mt-1 mb-8 block">请确保传感器已开机并处于配对状态</text>

              <button @click="handleAddNewDevice"
                class="px-8 py-3 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto border-none">
                <text class="iconfont icon-lucide-plus text-base"></text>
                <text>添加新设备</text>
              </button>
            </view>
          </template>

          <!-- Initial Loading -->
          <view v-else class="py-12 flex justify-center w-full">
            <u-loading-icon mode="circle"></u-loading-icon>
          </view>
        </view>
      </scroll-view>
      <button @click="handleAddNewDevice"
        class="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 bg-transparent m-0">
        <text class="iconfont icon-lucide-plus text-base"></text>
        <text>添加并绑定新设备</text>
      </button>
      <!-- Footer info -->
      <view class="pt-4 border-t border-solid border-slate-50">
        <text class="text-[10px] text-slate-400 leading-relaxed block">
          * 每个传感器同时只能监测一盆植物。绑定后，系统将自动根据该植物的生长习性配置预警阈值。
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDevices } from '@/hooks/useDevices';

const props = defineProps({
  plant: {
    type: Object,
    required: true,
    default: () => ({ plantName: 'Unknown' })
  }
  // 移除 availableSensors prop，改为内部 hook 获取
});

const emit = defineEmits(['close', 'confirm', 'addNewDevice']);

// 使用 useDevices Hook 获取数据和分页状态
const {
  devices: availableSensors,
  getDevices,
  deviceLoadStatus,
  deviceQueryParams,
  deviceLoading
} = useDevices();

const handleClose = () => {
  emit('close');
};

const handleConfirm = (sensor) => {
  emit('confirm', sensor);
};

const handleAddNewDevice = () => {
  emit('addNewDevice');
};

// 滚动到底部触发加载更多
const handleScrollToLower = () => {
  if (deviceLoadStatus.value === 'loadmore') {
    deviceQueryParams.pageNum++;
    getDevices(true); // true 表示加载更多，不是刷新
  }
};

// 组件挂载时获取第一页数据
onMounted(() => {
  // 重置分页为 1
  deviceQueryParams.pageNum = 1;
  getDevices();
});
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

/* Scrollbar hide */
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>