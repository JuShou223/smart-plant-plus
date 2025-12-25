<template>
  <!-- <view class="min-h-screen bg-[#f0fdf4] text-slate-800 font-sans selection:bg-emerald-100"> -->
  <view class="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
    <!-- #ifdef MP-WEIXIN -->
    <up-navbar :fixed="false" title="" bgColor="transparent" leftIcon="">
      <template #left>
        <view>
          <text class="text-2xl font-bold text-slate-800 block">{{ greeting }}, 园艺师 🌿</text>
        </view>
      </template>
    </up-navbar>
    <!-- #endif -->

    <view class="flex justify-between items-center px-4 mb-6">
      <view>
        <!-- #ifndef MP-WEIXIN -->
        <text class="text-2xl font-bold text-slate-800 mt-4 block">{{ greeting }}, 园艺师 🌿</text>
        <!-- #endif -->
        <text class="text-slate-500 text-sm mt-1 block">
          {{ attentionCount > 0 ? `今天有 ${attentionCount} 株植物需要您的照顾` : '所有植物都生长得很健康' }}
        </text>
      </view>
      <view
        class="bg-white p-2 rounded-full shadow-sm border border-solid border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors">
        <text class="iconfont icon-lucide-bell text-slate-600"></text>
        <view v-if="attentionCount > 0"
          class="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-solid  border-white"></view>
      </view>
    </view>

    <view v-if="abnormalPlants.length > 0" class="animate-fade-in-down mb-2">
      <view class="font-bold text-slate-800 text-sm mb-3 ml-5 flex items-center gap-2">
        <view class="relative flex h-3 w-3">
          <view class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></view>
          <view class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></view>
        </view>
        <text>待处理事项 ({{ abnormalPlants.length }})</text>
      </view>

      <scroll-view scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false">
        <view class="flex gap-4 px-4 pb-2">
          <view v-for="plant in abnormalPlants" :key="plant.id" @click="onPlantClick(plant)"
            class="box-border rounded-2xl p-4 flex items-center gap-4 min-w-[560rpx] border border-solid shadow-sm cursor-pointer active:scale-95 transition-transform inline-flex"
            :class="getAlertStyles(getAlertConfig(plant, plant.healthCondition || 'healthy').color).bg">
            <view class="relative w-16 h-16 shrink-0">
              <image :src="plant.plantImage" mode="aspectFill" class="w-full h-full rounded-xl" />
              <view
                class="box-border absolute -bottom-2 -right-2 text-white rounded-full p-1.5 border-2 border-solid border-white shadow-sm flex items-center justify-center w-7 h-7"
                :class="getAlertStyles(getAlertConfig(plant, plant.healthCondition).color).iconBg">
                <text class="iconfont text-xs" :class="getAlertConfig(plant, plant.healthCondition).iconClass"></text>
              </view>
            </view>

            <view class="flex-1 min-w-0">
              <text class="block font-bold text-slate-800 text-sm truncate">{{ plant.plantName }}</text>
              <text class="block text-[20rpx] font-medium mt-0.5 truncate"
                :class="getAlertStyles(getAlertConfig(plant, plant.healthCondition).color).text">
                {{ getAlertConfig(plant, plant.healthCondition).desc }}
              </text>

              <button @click.stop="handleAlertAction(plant, getAlertConfig(plant, plant.healthCondition))"
                class="mt-2 bg-white text-[20rpx] font-bold px-3 py-1.5 rounded-lg border border-solid flex items-center gap-1 w-fit shadow-sm m-0 leading-none"
                :class="getAlertStyles(getAlertConfig(plant, plant.healthCondition).color).btn">
                <text class="iconfont text-xs"
                  :class="getAlertConfig(plant, plant.healthCondition).color === 'pest' ? 'icon-lucide-scan-line' : 'icon-lucide-check'"></text>
                <text>{{ getAlertConfig(plant, plant.healthCondition).actionLabel }}</text>
              </button>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="flex flex-col gap-3 px-4 mb-5">
      <view class="flex items-center space-x-2 px-1">
        <text class="iconfont icon-lucide-heart-pulse text-sm text-rose-500"></text>
        <text class="font-bold text-slate-800 text-sm">植物健康中心</text>
      </view>

      <view class="grid grid-cols-2 gap-4">
        <view id="guide-ai-chat" @click="handleDiagnose"
          class="bg-emerald-50 rounded-[1.5rem] p-4 border border-solid border-emerald-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:bg-emerald-100 transition-all group relative overflow-hidden h-28 box-border">
          <view class="relative z-10 flex flex-col justify-between h-full">
            <view>
              <text class="block font-bold text-emerald-900 text-sm mb-0.5">拍照诊断</text>
              <text class="block text-[20rpx] text-emerald-700/70">AI 识别病虫害</text>
            </view>
            <view
              class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
              <text class="iconfont icon-lucide-scan-line text-base"></text>
            </view>
          </view>
          <text class="iconfont icon-lucide-stethoscope absolute -bottom-4 -right-4 text-emerald-500/10 rotate-12"
            style="font-size: 192rpx;"></text>
        </view>

        <view id="guide-nav" @click="onNavigate('DISEASE_LIBRARY')"
          class="bg-indigo-50 rounded-[1.5rem] p-4 border border-solid border-indigo-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:bg-indigo-100 transition-all group relative overflow-hidden h-28 box-border">
          <view class="relative z-10 flex flex-col justify-between h-full">
            <view>
              <text class="block font-bold text-indigo-900 text-sm mb-0.5">病害百科</text>
              <text class="block text-[20rpx] text-indigo-700/70">常见病症图鉴</text>
            </view>
            <view
              class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
              <text class="iconfont icon-lucide-book text-base"></text>
            </view>
          </view>
          <text class="iconfont icon-lucide-activity absolute -bottom-4 -right-4 text-indigo-500/10 -rotate-12"
            style="font-size: 192rpx;"></text>
        </view>

        <view @click="onNavigate('DIAGNOSIS_HISTORY')"
          class="bg-orange-50 rounded-[1.5rem] p-4 border border-solid border-orange-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:bg-orange-100 transition-all group relative overflow-hidden h-28 box-border">
          <view class="relative z-10 flex flex-col justify-between h-full">
            <view>
              <text class="block font-bold text-orange-900 text-sm mb-0.5">诊断记录</text>
              <text class="block text-[20rpx] text-orange-700/70">查看历史报告</text>
            </view>
            <view
              class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
              <text class="iconfont icon-lucide-notepad-text text-base"></text>
            </view>
          </view>
          <text class="iconfont icon-lucide-file-text absolute -bottom-4 -right-4 text-orange-500/10 -rotate-12"
            style="font-size: 192rpx;"></text>
        </view>

        <view @click="onNavigate('TREATMENT_LIST')"
          class="bg-blue-50 rounded-[1.5rem] p-4 border border-solid border-blue-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:bg-blue-100 transition-all group relative overflow-hidden h-28 box-border">
          <view class="relative z-10 flex flex-col justify-between h-full">
            <view>
              <text class="block font-bold text-blue-900 text-sm mb-0.5">我的疗程</text>
              <text class="block text-[20rpx] text-blue-700/70">治疗方案管理</text>
            </view>
            <view
              class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <text class="iconfont icon-lucide-package text-base"></text>
            </view>
          </view>
          <text class="iconfont icon-lucide-pill absolute -bottom-4 -right-4 text-blue-500/10 -rotate-12"
            style="font-size: 192rpx;"></text>
        </view>
      </view>
    </view>

    <view class="mb-1 px-4" v-if="activeTreatments.length > 0">
      <view class="flex items-center justify-between px-1 mb-3">
        <view class="text-slate-800 flex items-center space-x-2">
          <text class="iconfont icon-lucide-pill text-sm text-emerald-600"></text>
          <text class="font-bold  text-sm">治疗进行中</text>
        </view>
        <view class="flex items-center">
          <!-- <view class="text-[20rpx] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full mr-2">
            {{ activeTreatments.length }} 个任务
          </view> -->
          <text class="text-xs text-slate-400 font-medium">全部治疗包</text>
          <text class="text-xs text-slate-400 iconfont icon-lucide-chevron-right font-medium"></text>
        </view>
      </view>

      <!-- <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap w-full"> -->
      <!-- <view class="flex gap-4 pb-2 px-1"> -->
      <up-scroll-list :indicator="activeTreatments.length > 1">
        <view v-for="treatment in activeTreatments" :key="treatment.id" @click="onViewTreatment(treatment.id)"
          class="mr-4 shrink-0 bg-white rounded-[2rem] p-5 shadow-lg shadow-emerald-100/50 border border-solid border-emerald-50 relative overflow-hidden group cursor-pointer inline-block align-top box-border"
          :class="activeTreatments.length > 1 ? 'w-[85vw] sm:w-[700rpx]' : 'w-full'">
          <view class="absolute top-0 left-0 bottom-0 bg-emerald-50/50 z-0 transition-all duration-1000"
            :style="{ width: (treatment.currentStepIndex / treatment.totalSteps) * 100 + '%' }"></view>

          <view class="relative z-10 flex items-center justify-between h-full">
            <view class="flex items-center gap-4 min-w-0 flex-1">
              <view
                class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                <image v-if="treatment.products && treatment.products[0]" :src="treatment.bundleImage" mode="aspectFill"
                  class="w-full h-full" />
                <text v-else class="iconfont icon-lucide-pill text-2xl text-emerald-600"></text>
              </view>
              <view class="min-w-0 flex-1">
                <view class="flex items-center gap-2 mb-1">
                  <text class="font-bold text-slate-800 truncate text-sm block">{{ treatment.bundleName }}</text>
                  <text
                    class="text-[20rpx] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold shrink-0 block">待办</text>
                </view>
                <text class="text-xs text-slate-500 truncate block">
                  {{ treatment.schedule[treatment.currentStepIndex].title || '疗程已完成' }}
                </text>
              </view>
            </view>
            <view
              class="w-8 h-8 rounded-full bg-white border border-solid border-emerald-100 shadow-sm flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shrink-0 ml-2">
              <text class="iconfont icon-lucide-arrow-right text-base"></text>
            </view>
          </view>
        </view>
      </up-scroll-list>

      <!-- </view> -->
      <!-- </scroll-view> -->
    </view>
    <!-- 我的植物 Section -->
    <view class="mb-4 px-4">
      <view class="flex justify-between items-end mb-4">
        <view class="flex items-center space-x-2 px-1">
          <text class="iconfont icon-lucide-sprout text-sm text-emerald-600"></text>
          <text class="font-bold text-slate-800 text-sm">我的植物</text>
        </view>
        <view class="flex items-center">
          <text class="text-xs text-slate-400 font-medium active:opacity-70">
            全部植物
          </text>
          <text class="text-xs text-slate-400 iconfont icon-lucide-chevron-right font-medium"></text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="plants.length === 0" id="guide-add-plant"
        class="mb-4 relative w-full h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2rem] border-2 border-dashed border-emerald-200/60 flex flex-col items-center justify-center cursor-pointer group hover:bg-emerald-100/50 transition-all overflow-hidden shadow-sm"
        @click="onNavigate('ADD_PLANT')">
        <view class="relative z-10 flex flex-col items-center text-center px-6">
          <view
            class="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
            <text class="text-xl iconfont icon-lucide-plus text-emerald-500"></text>
          </view>
          <text class="text-emerald-900 font-bold text-lg">打造您的智能花园</text>
          <text class="text-emerald-700/70 text-xs mt-1 font-medium">添加第一株植物，开启 AI 智能养护之旅</text>
        </view>
      </view>

      <!-- 植物横向滚动列表 -->
      <scroll-view v-else scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false"
        @scrolltolower="onPlantScrollToLower" :lower-threshold="50">
        <view class="inline-flex gap-4 pb-2">
          <!-- 添加按钮 -->
          <view @click="onNavigate('ADD_PLANT')"
            class="snap-start shrink-0 w-20 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all active:scale-95">
            <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <text class="iconfont icon-lucide-plus text-xl"></text>
            </view>
            <text class="text-[20rpx] font-bold">添加</text>
          </view>

          <!-- 植物卡片列表 -->
          <view v-for="plant in plants" :key="plant.id" class="inline-block w-[600rpx]">
            <PlantCard :plant="plant" @analyze="handleAnalyze" />
          </view>

          <!-- 加载状态 -->
          <view v-if="loadStatus === 'loading'" class="inline-flex items-center justify-center w-[600rpx] h-[460rpx]">
            <view class="flex flex-col items-center gap-2">
              <view class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></view>
              <text class="text-xs text-slate-400">加载中...</text>
            </view>
          </view>

          <!-- 没有更多 -->
          <!-- <view v-if="loadStatus === 'nomore' && plants.length > 0"
            class="inline-flex items-center justify-center w-32 h-[460rpx]">
            <text class="text-xs text-slate-400">没有更多了</text>
          </view> -->

          <!-- 右侧间距 -->
          <view class="inline-block w-4"></view>
        </view>
      </scroll-view>
    </view>


    <!-- 环境监测 Section -->
    <view class="px-4">
      <view class="flex justify-between items-end mb-4">
        <view class="flex items-center space-x-2 px-1">
          <text class="iconfont icon-lucide-activity text-sm text-blue-500"></text>
          <text class="font-bold text-slate-800 text-sm">环境监测</text>
        </view>
        <view class="flex items-center">
          <text class="text-xs text-slate-400 font-medium active:opacity-70" @click="onNavigate('SENSORS')">
            全部传感器
          </text>
          <text class="text-xs text-slate-400 iconfont icon-lucide-chevron-right font-medium"></text>
        </view>
      </view>

      <!-- 空状态 -->
      <view id="guide-sensors" v-if="devices.length === 0" @click="onNavigate('ADD_SENSOR')"
        class="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] border-2 border-dashed border-blue-200/60 flex flex-col items-center justify-center">
        <view class="relative z-10 flex flex-col items-center text-center px-6">
          <view class="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-3">
            <text class="text-xl iconfont icon-lucide-activity text-blue-500"></text>
          </view>
          <text class="text-blue-900 font-bold text-lg">还没有传感器</text>
          <text class="text-blue-700/70 text-xs mt-1 font-medium">添加传感器开始监测环境数据</text>
        </view>
      </view>

      <!-- 传感器横向滚动列表 -->
      <scroll-view v-else scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false"
        @scrolltolower="onDeviceScrollToLower" :lower-threshold="50">
        <view class="inline-flex gap-4 pb-2">
          <!-- 添加按钮 -->
          <view @click="onNavigate('ADD_SENSOR')"
            class="snap-start shrink-0 w-20 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all active:scale-95">
            <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <text class="iconfont icon-lucide-plus text-xl"></text>
            </view>
            <text class="text-[20rpx] font-bold">添加</text>
          </view>
          <!-- 传感器卡片列表 -->
          <view v-for="sensor in devices" :key="sensor.id" class="inline-block w-[600rpx]">
            <SensorCard :sensor="sensor" @unbind="handleUnbind" @bind="handleBindPlant" />
          </view>

          <!-- 加载状态 -->
          <view v-if="deviceLoadStatus === 'loading'" class="inline-flex items-center justify-center w-[600rpx] h-40">
            <view class="flex flex-col items-center gap-2">
              <view class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></view>
              <text class="text-xs text-slate-400">加载中...</text>
            </view>
          </view>

          <!-- 没有更多 -->
          <view v-if="deviceLoadStatus === 'nomore' && devices.length > 0"
            class="inline-flex items-center justify-center w-32 h-40">
            <text class="text-xs text-slate-400">没有更多了</text>
          </view>

          <!-- 右侧间距 -->
          <view class="inline-block w-4"></view>
        </view>
      </scroll-view>
    </view>
    <hws-unbind-modal :sensorId="sensorId" :plantName="unbindPlantName" v-if="showUnbindModal"
      @close="showUnbindModal = false" @success="handleUnbindSuccess"></hws-unbind-modal>
    <hws-choose-plant :show="showBindModal" @close="showBindModal = false"
      @confirm="handleBindPlantConfirm"></hws-choose-plant>
    <hws-user-guide v-if="showUserGuide" @complete="showUserGuide = false"></hws-user-guide>
  </view>
  <!-- </view> -->
</template>

<script setup>
import { ref, computed, reactive, nextTick, onUnmounted } from 'vue';
import { onLoad, onShow, onHide, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user.js';
import bus from '@/common/bus.js';

// 组件
import PlantCard from '@/components/PlantCard.vue';
import SensorCard from '@/components/SensorCard.vue';

// API (仅保留绑定逻辑需要的)
import { bindPlant } from '@/apis/modules/sensors';

// Hooks
import { usePlants } from '@/hooks/usePlants';
import { useDevices } from '@/hooks/useDevices';
import { useMqtt } from '@/hooks/useMqtt';
import { useTreatmentPlan } from '@/hooks/useTreatmentPlan';

// ==================== 1. 初始化 Hooks ====================
const userStore = useUserStore();
const { vuex_token } = storeToRefs(userStore);

// 植物逻辑
const {
  plants, total, queryParams, loadStatus, loading,
  loadPlants, refreshPlants, onPlantScrollToLower
} = usePlants();

// 设备逻辑
const {
  devices, total: deviceTotal, queryParams: deviceParams, loadStatus: deviceLoadStatus, loading: deviceLoading, deviceMap,
  getDevices, refreshDevices, onDeviceScrollToLower
} = useDevices();

// MQTT 逻辑 (传入 deviceMap 以便回调中直接更新设备)
const { connectMqtt, mqttSubscribe, mqttUnSubscribe, mqttPublish } = useMqtt(deviceMap, vuex_token);


const { getActivePlans } = useTreatmentPlan()
// 绑定植物逻辑 (复用 usePlants 的能力，但管理独立的状态)
// const {
//   plants: bindablePlants,
//   total: bindTotal,
//   queryParams: bindParams,
//   loadStatus: bindLoadStatus,
//   loading: bindLoading,
//   loadPlants: loadBindablePlants,
//   onPlantScrollToLower
// } = usePlants();
// 实例化第二份 usePlants 用于弹窗

// ==================== 2. 常量定义 ====================
const ROUTE_MAP = {
  'PROFILE': '/pages-plants/plants/profile/index',
  'ADD_PLANT': '/pages-plants/plants/addPlants2/index',
  'DISEASE_LIBRARY': '/pages-plants/plants/diseaseLibrary2/index',
  'DIAGNOSIS_HISTORY': '/pages-plants/plants/diseaseRecords/index',
  'TREATMENT_LIST': '/pages-plants/plants/treatmentList/index',
  'PLANTS': '/pages-plants/plants/index',
  'SENSORS': '/pages-plants/plants/sensors/index',
  'ADD_SENSOR': '/pages-plants/plants/addSensor/index'
};

// ==================== 3. UI 状态管理 ====================
const showBindModal = ref(false);
const currentDevice = ref(null);
const showUnbindModal = ref(false)
// const showBindModal = ref(false)
const sensorId = ref('')
const unbindPlantName = ref('')
const unbindPlantId = ref('')
// 模拟数据
const activeTreatments = ref([]);
const showUserGuide = ref(true)

// 计算属性
const attentionCount = computed(() => plants.value.filter(p => p.hasIssues).length);
const abnormalPlants = computed(() => plants.value.filter(p => p.healthCondition && p.healthCondition !== 'healthy'));
const greeting = computed(() => {
  const h = new Date().getHours();
  return h < 12 ? '早安' : h < 18 ? '午安' : '晚上好';
});

// ==================== 4. 业务方法：绑定逻辑 ====================

// 打开绑定弹窗
const handleBindPlant = async (device) => {
  // if (device.status !== 3) return uni.showToast({ title: '设备不在线', icon: 'none' });
  currentDevice.value = device;
  showBindModal.value = true;
};

// 确认绑定
const handleBindPlantConfirm = async (plant) => {
  try {
    const pubRes = await mqttPublish(currentDevice.value, {
      id: 'plant_id', name: '植物ID', type: 2, shadow: plant.id
    });
    if (pubRes.code !== 200) throw new Error(pubRes.msg);
    const bindRes = await bindPlant({ id: currentDevice.value.id, plantId: plant.id });
    if (bindRes.code !== 200) throw new Error(bindRes.msg);
    bus.emit('refreshPlantSensor_' + plant.id, currentDevice.value.deviceId)
    showBindModal.value = false;
    refreshDevices();
    uni.showToast({ title: '绑定成功!', icon: 'success' });
  } catch (e) {
    uni.showToast({ title: '绑定失败: ' + e.message, icon: 'none' });
  }
};

// ==================== 5. 辅助与导航 ====================

const onNavigate = (view) => {
  const url = ROUTE_MAP[view];
  if (url) uni.navigateTo({ url });
};

const onPlantClick = (p) => uni.navigateTo({ url: `/pages-plants/plants/myPlantDetail/index?plantId=${p.id}` });
const onViewTreatment = (id) => uni.navigateTo({ url: `/pages-plants/plants/treatmentPlan/index?id=${id}` });
const onSensorClick = (d) => uni.navigateTo({ url: `/pages-plants/plants/deviceDetail/deviceDetail?deviceId=${d.deviceId}&id=${d.id}&plantId=${d.plantId || ''}` });
const handleDiagnose = () => uni.navigateTo({ url: '/pages-plants/tools/ai/AiDiagnose' });
const handleAnalyze = (plant) => uni.showModal({ title: 'AI 诊断', content: `分析 ${plant.name}...`, showCancel: false });

// Alert 配置
const getAlertConfig = (plant, condition) => {
  const configs = {
    'water-low': { color: 'blue', iconClass: 'icon-lucide-droplets', title: '缺水提醒', desc: '土壤湿度过低', actionLabel: '标记已浇' },
    'pest': { color: 'red', iconClass: 'icon-lucide-bug', title: '虫害预警', desc: '疑似虫害', actionLabel: 'AI 诊断' },
    'light-low': { color: 'amber', iconClass: 'icon-lucide-sun', title: '光照不足', desc: '建议移至向阳处', actionLabel: '查看建议' },
    'temp-issue': { color: 'orange', iconClass: 'icon-lucide-thermometer', title: '温度异常', desc: '超出适宜范围', actionLabel: '检查环境' }
  };
  return configs[condition] || { color: 'slate', iconClass: 'icon-lucide-alert-triangle', title: '需关注', desc: '状态不稳定', actionLabel: '详情' };
};

const getAlertStyles = (color) => {
  const map = {
    red: { bg: 'bg-red-50 border-red-100', text: 'text-red-600', btn: 'text-red-600 border-red-200', iconBg: 'bg-red-600' },
    blue: { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', btn: 'text-blue-600 border-blue-200', iconBg: 'bg-blue-600' },
    amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', btn: 'text-amber-600 border-amber-200', iconBg: 'bg-amber-600' },
    orange: { bg: 'bg-orange-50 border-orange-100', text: 'text-orange-600', btn: 'text-orange-600 border-orange-200', iconBg: 'bg-orange-600' },
    slate: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', btn: 'text-slate-600 border-slate-200', iconBg: 'bg-slate-600' }
  };
  return map[color] || map.slate;
};

const handleAlertAction = (plant, config) => {
  if (config.color === 'blue') uni.showToast({ title: `已记录浇水`, icon: 'none' });
  else if (config.color === 'red') handleAnalyze(plant);
  else onPlantClick(plant);
};

const loadActiveTreatmentsPlan = () => {
  activeTreatments.value = getActivePlans()
}

const handleUnbind = (info) => {
  showUnbindModal.value = true
  sensorId.value = info.sensorId
  unbindPlantName.value = info.plantName
  unbindPlantId.value = info.plantId
  console.log(info)
}

const handleUnbindSuccess = () => {
  bus.emit('refreshPlantSensor_' + unbindPlantId.value)
  showUnbindModal.value = false
  // refreshPlants()
  refreshDevices()
}
// ==================== 6. 生命周期 ====================

onLoad(() => {
  Promise.all([
    loadPlants(),
    // connectMqtt 连接成功后自动执行 getDevices 并订阅
    connectMqtt(() => getDevices().then(() => mqttSubscribe(devices.value)))
  ]);

  loadActiveTreatmentsPlan()

  bus.on('refreshPlantList', refreshPlants);
  bus.on('refreshDeviceList', refreshDevices);
  bus.on('refreshTreatmentList', loadActiveTreatmentsPlan);
});

onShow(() => {
  if (devices.value.length > 0) mqttSubscribe(devices.value);
});

onHide(() => {
  if (devices.value.length > 0) mqttUnSubscribe(devices.value);
});

onUnmounted(() => {
  bus.off('refreshPlantList', refreshPlants);
  bus.off('refreshDeviceList', refreshDevices);
  if (devices.value.length > 0) mqttUnSubscribe(devices.value);
});

onPullDownRefresh(() => {
  Promise.all([
    new Promise(r => { refreshPlants(); r(); }),
    new Promise(r => { refreshDevices(); r(); })
  ]).finally(() => uni.stopPullDownRefresh());
});

// 加载更多（弹窗内）
const onBindPlantScrollToLower = () => {
  if (bindLoadStatus.value === 'loadmore') {
    bindParams.pageNum++;
    loadBindablePlants(true);
  }
};
</script>

<style scoped></style>