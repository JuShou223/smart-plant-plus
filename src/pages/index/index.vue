<template>
  <!-- <view class="min-h-screen bg-[#f0fdf4] text-slate-800 font-sans selection:bg-emerald-100"> -->
  <view class="min-h-screen bg-[#FAFAFA] pb-24 animate-fade-in font-sans">
    <!-- #ifdef MP-WEIXIN -->
    <up-navbar :fixed="false" title="" bgColor="transparent" leftIcon="">
      <template #left>
        <view>
          <text class="text-2xl font-bold text-slate-800 block">早安, 园艺师 🌿</text>
        </view>
      </template>
    </up-navbar>
    <!-- #endif -->

    <view class="flex justify-between items-center px-4 mb-6">
      <view>
        <!-- #ifndef MP-WEIXIN -->
        <text class="text-2xl font-bold text-slate-800 mt-4 block">早安, 园艺师 🌿</text>
        <!-- #endif -->
        <text class="text-slate-500 text-sm mt-1 block">
          {{ attentionCount > 0 ? `今天有 ${attentionCount} 株植物需要您的照顾` : '所有植物都生长得很健康' }}
        </text>
      </view>
      <view
        class="bg-white p-2 rounded-full shadow-sm border border-solid border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors">
        <text class="iconfont icon-lucide-bell text-slate-600"></text>
        <view v-if="attentionCount > 0"
          class="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></view>
      </view>
    </view>

    <view class="flex flex-col gap-3 px-4 mb-5">
      <view class="flex items-center space-x-2 px-1">
        <text class="iconfont icon-lucide-heart-pulse text-sm text-rose-500"></text>
        <text class="font-bold text-slate-800 text-sm">植物健康中心</text>
      </view>

      <view class="grid grid-cols-2 gap-4">
        <view @click="handleDiagnose"
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
            style="font-size: 96px;"></text>
        </view>

        <view @click="handleNavigateToDL('DISEASE_LIBRARY')"
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
            style="font-size: 96px;"></text>
        </view>

        <view @click="handleNavigateToProfile('DISEASE_LIBRARY')"
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
            style="font-size: 96px;"></text>
        </view>

        <view @click="handleNavigateToList('DISEASE_LIBRARY')"
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
            style="font-size: 96px;"></text>
        </view>
      </view>
    </view>

    <view class="mb-1 px-4" v-if="activeTreatments.length > 0">
      <view class="flex items-center justify-between px-1 mb-3">
        <view class="text-slate-800 flex items-center space-x-2">
          <text class="iconfont icon-lucide-pill text-sm text-emerald-600"></text>
          <text class="font-bold  text-sm">治疗进行中</text>
        </view>
        <view class="flex items-center" @click="handleNavigateToList">
          <!-- <view class="text-[20rpx] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full mr-2">
            {{ activeTreatments.length }} 个任务
          </view> -->
          <text class="text-xs text-slate-400 font-medium">全部治疗包</text>
          <text class="text-xs text-slate-400 iconfont icon-lucide-chevron-right font-medium"></text>
        </view>
      </view>

      <!-- <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap w-full"> -->
      <!-- <view class="flex gap-4 pb-2 px-1"> -->
      <up-scroll-list>
        <view v-for="treatment in activeTreatments" :key="treatment.id" @click="handleNavigateToPlan(treatment.id)"
          class="mr-4 shrink-0 bg-white rounded-[2rem] p-5 shadow-lg shadow-emerald-100/50 border border-solid border-emerald-50 relative overflow-hidden group cursor-pointer inline-block align-top box-border"
          :class="activeTreatments.length > 1 ? 'w-[85vw] sm:w-[700rpx]' : 'w-full'">
          <view class="absolute top-0 left-0 bottom-0 bg-emerald-50/50 z-0 transition-all duration-1000"
            :style="{ width: (treatment.currentStepIndex / treatment.totalSteps) * 100 + '%' }"></view>

          <view class="relative z-10 flex items-center justify-between h-full">
            <view class="flex items-center gap-4 min-w-0 flex-1">
              <view
                class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                <image v-if="treatment.products && treatment.products[0]" :src="treatment.products[0].image"
                  mode="aspectFill" class="w-full h-full" />
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
    <!-- My Plants Section -->
    <view class="mb-1 px-4">
      <view class="flex justify-between items-end mb-4">
        <!-- <text class="text-lg font-bold text-slate-800">我的植物</text> -->
        <view class="flex items-center space-x-2 px-1">
          <text class="iconfont icon-lucide-sprout text-sm text-emerald-600"></text>
          <text class="font-bold text-slate-800 text-sm">我的植物</text>
        </view>
        <view class="flex items-center">
          <text class="text-xs text-slate-400 font-medium active:opacity-70" @click="onNavigate('PLANTS')">
            全部植物
          </text>
          <text class="text-xs text-slate-400 iconfont icon-lucide-chevron-right font-medium"></text>
        </view>

      </view>
      <!-- Horizontal Scroll View -->
      <!-- <scroll-view scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false"> -->
      <!-- <view class="flex space-x-4 px-4 pb-4"> -->
      <up-scroll-list>
        <button @click="handleNavigateToAdd"
          class="snap-start shrink-0 w-20 mr-4 sm:w-24 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all active:scale-95">
          <view class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
            <!-- <Plus class="w-5 h-5" /> -->
            <text class="iconfont icon-lucide-plus text-xl"></text>
          </view>
          <span class="text-[20rpx] font-bold">添加</span>
        </button>
        <view @click="handleNavigateToDetail" v-for="plant in plants.slice(0, 3)" :key="plant.id"
          class="inline-block min-w-[600rpx] w-[600rpx] mr-4 pb-2">
          <PlantCard :plant="plant" :sensorData="getSensorForPlant(plant)" @analyze="handleAnalyze" />
        </view>
      </up-scroll-list>

      <!-- Padding for scroll end -->
      <!-- <view class="inline-block w-2"></view> -->
      <!-- </view> -->
      <!-- </scroll-view> -->
    </view>

    <!-- My Sensors Section -->
    <view class="px-4">
      <view class="flex justify-between items-end mb-4">
        <!-- <text class="text-lg font-bold text-slate-800">环境监测</text> -->
        <view class="flex items-center space-x-2 px-1">
          <text class="iconfont icon-lucide-activity text-sm text-blue-500"></text>
          <text class="font-bold text-slate-800 text-sm">环境监测</text>
        </view>
        <view class="flex items-center">
          <text class="text-xs text-slate-400 font-medium active:opacity-70" @click="onNavigate('PLANTS')">
            全部传感器
          </text>
          <text class="text-xs text-slate-400 iconfont icon-lucide-chevron-right font-medium"></text>
        </view>
      </view>
      <view class="space-y-4">
        <view v-for="sensor in sensors.slice(0, 2)" :key="sensor.id">
          <SensorCard :sensor="sensor" />
        </view>
      </view>
    </view>
  </view>
  <!-- </view> -->
</template>

<script setup>
import { ref, computed } from 'vue';
import PlantCard from '@/components/PlantCard.vue';
import SensorCard from '@/components/SensorCard.vue';

// Mock Data
const plants = ref([
  {
    id: 'p1',
    name: '龟背竹',
    species: 'Monstera Deliciosa',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1669148911895-a95de51d09ca.png',
    status: 'healthy',
    sensorId: 's1',
    requirements: {
      temperature: { min: 18, max: 30 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 70 },
      light: { min: 1000, max: 2500 }
    }
  },
  {
    id: 'p2',
    name: '虎尾兰',
    species: 'Sansevieria Trifasciata',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1620803366004-119b57f54cd6.png',
    status: 'needs-attention',
    sensorId: 's2',
    requirements: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 10, max: 40 },
      light: { min: 500, max: 2000 }
    }
  },
  {
    id: 'p3',
    name: '琴叶榕',
    species: 'Ficus Lyrata',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1681807326535-621ae5ef9da3.png',
    status: 'healthy',
    sensorId: 's3',
    requirements: {
      temperature: { min: 20, max: 35 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 50, max: 80 },
      light: { min: 2000, max: 4000 }
    }
  }
]);

const sensors = ref([
  {
    id: 's1',
    name: '客厅传感器 A',
    batteryLevel: 85,
    lastUpdate: '10分钟前',
    readings: {
      temperature: 24.5,
      humidity: 68,
      soilMoisture: 55,
      light: 1200
    }
  },
  {
    id: 's2',
    name: '阳台传感器 B',
    batteryLevel: 42,
    lastUpdate: '5分钟前',
    readings: {
      temperature: 28.2,
      humidity: 45,
      soilMoisture: 8, // Low
      light: 3500
    }
  },
  {
    id: 's3',
    name: '卧室传感器 C',
    batteryLevel: 15, // Low
    lastUpdate: '1小时前',
    readings: {
      temperature: 22.0,
      humidity: 55,
      soilMoisture: 60,
      light: 800
    }
  }
]);

const activeTreatments = ref([
  {
    id: 't1',
    bundleName: '龟背竹病虫害综合治疗包',
    products: [
      {
        id: 'prod1',
        name: '有机杀虫剂',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=80&q=80'
      }
    ],
    schedule: [
      { title: '喷洒杀虫剂', description: '均匀喷洒在叶片和茎干上', dayOffset: 0 },
      { title: '清理病叶', description: '剪除并处理受感染的叶片', dayOffset: 3 },
      { title: '复查病情', description: '观察植物恢复情况', dayOffset: 7 }
    ],
    currentStepIndex: 1,
    totalSteps: 3
  },
  {
    id: 'tb-2',
    bundleName: '红蜘蛛歼灭套装',
    description: '物理+化学双重防治，彻底清除红蜘蛛虫卵。',
    price: 28.8,
    originalPrice: 45,
    products: [
      { id: 'tp-4', name: '高压喷雾壶', price: 18, image: 'https://images.unsplash.com/photo-1527519965219-467406a45749?q=80&w=200&auto=format&fit=crop', description: '2L 气压式' },
      { id: 'tp-5', name: '阿维菌素', price: 15, image: 'https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=200&auto=format&fit=crop', description: '专杀螨虫' }
    ],
    schedule: [
      { day: '第1天', title: '强力冲洗', description: '使用高压喷壶调至水柱模式，冲洗叶片背面，物理去除成虫。', productsUsed: ['tp-4'] },
      { day: '第1天', title: '喷药杀虫', description: '叶片晾干后，喷洒阿维菌素，重点照顾叶背和茎杆连接处。', productsUsed: ['tp-4', 'tp-5'] },
      { day: '第4天', title: '二次用药', description: '红蜘蛛虫卵孵化周期短，需二次喷药彻底杀灭新孵化的幼虫。', productsUsed: ['tp-4', 'tp-5'] },
      { day: '日常', title: '增湿预防', description: '每天向叶面喷雾，增加空气湿度，营造红蜘蛛厌恶的环境。', productsUsed: ['tp-4'] }
    ]
  }
]);

// Computed
const attentionCount = computed(() => {
  return plants.value.filter(p => p.status !== 'healthy').length;
});

// Helper
const getSensorForPlant = (plant) => {
  return sensors.value.find(s => s.id === plant.sensorId);
};

// Handlers
const onNavigate = (view) => {
  uni.showToast({
    title: `跳转到: ${view}`,
    icon: 'none'
  });
  // 实际项目中这里可以使用 uni.navigateTo 或 uni.switchTab
};

const handleNavigateToDL = () => {
  uni.navigateTo({ url: '/pages-plants/plants/diseaseLibrary2/index' });
}

const handleNavigateToPlan = () => {
  uni.navigateTo({ url: '/pages-plants/plants/treatmentPlan/index' });
}

const handleNavigateToList = () => {
  uni.navigateTo({ url: '/pages-plants/plants/treatmentList/index' });
}

const handleNavigateToDetail = () => {
  uni.navigateTo({ url: '/pages-plants/plants/myPlantDetail/index' });
}

const handleNavigateToAdd = () => {
  uni.navigateTo({ url: '/pages-plants/plants/addPlants2/index' });
}

const handleNavigateToNote = () => {
  uni.switchTab({
    url: '/pages/diseaseRecords/diseaseRecords'
  })
}

const handleNavigateToProfile = () => {
  uni.navigateTo({
    url: '/pages-plants/plants/profile/index'
  })
}


const handleDiagnose = () => {
  uni.navigateTo({ url: '/pages-plants/tools/ai/AiDiagnose' });
};

const handleAnalyze = (plant, sensorData) => {
  uni.showModal({
    title: 'AI 诊断',
    content: `正在分析 ${plant.name} 的生长数据...\n\n(模拟功能)`,
    showCancel: false
  });
};
</script>

<style scoped></style>