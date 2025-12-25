<template>
  <view class="min-h-screen bg-[#FAFAFA] relative z-50">
    <up-navbar title="" bgColor="transparent" leftIcon="">
      <template #left>
        <button @click="handleBack"
          class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
          <text class="iconfont icon-lucide-chevron-left text-2xl"></text>
        </button>
      </template>
    </up-navbar>
    <view class="flex items-end sm:items-center justify-center pointer-events-auto">
      <view
        class="bg-white w-full max-w-lg sm:rounded-2xl rounded-t-3xl relative z-10 flex flex-col animate-fade-in-up">

        <view class="relative h-48 shrink-0">
          <image :src="selectedDisease.image" mode="aspectFill" class="w-full h-full" />
          <view class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <text class="block text-2xl font-bold text-white">{{ selectedDisease.name }}</text>
            <text class="block text-slate-300 text-sm italic">{{ selectedDisease.alias }}</text>
          </view>
        </view>

        <view class="flex-1 overflow-hidden bg-white">
          <view class="p-6 space-y-8">

            <view class="flex gap-2">
              <view class="text-xs px-2 py-1 rounded-md font-bold border border-solid"
                :class="getTypeLabel(selectedDisease.type).color.replace('bg-', 'border-').replace('text-', 'text-')">
                {{ getTypeLabel(selectedDisease.type).text }}
              </view>
              <view
                class="text-xs px-2 py-1 rounded-md font-bold border border-solid border-slate-200 text-slate-500 flex items-center gap-1">
                <text class="iconfont icon-lucide-alert-triangle text-xs"></text>
                <text>危害: {{ selectedDisease.severity.toUpperCase() }}</text>
              </view>
            </view>

            <view v-if="selectedDisease.bundle"
              class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 shadow-sm">
              <view class="flex items-center space-x-2 mb-3">
                <text class="iconfont icon-lucide-package text-xl text-emerald-600"></text>
                <text class="text-base font-bold text-emerald-900">专家治疗方案包</text>
              </view>

              <view class="mb-4">
                <view class="flex justify-between items-start mb-1">
                  <text class="font-bold text-slate-800">{{ selectedDisease.bundle.name }}</text>
                  <view class="text-right">
                    <text class="text-lg font-bold text-emerald-600">¥{{ selectedDisease.bundle.price }}</text>
                    <text class="text-xs text-slate-400 line-through ml-1">¥{{ selectedDisease.bundle.originalPrice
                      }}</text>
                  </view>
                </view>
                <text class="text-xs text-slate-500 leading-relaxed block">{{ selectedDisease.bundle.description
                  }}</text>
              </view>

              <view class="mb-5">
                <text class="text-[10px] font-bold text-slate-400 uppercase mb-2 block">包含商品</text>
                <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap w-full">
                  <view class="flex gap-3">
                    <view v-for="prod in selectedDisease.bundle.products" :key="prod.id"
                      class="w-20 shrink-0 inline-block">
                      <view class="w-20 h-20 rounded-lg bg-white border border-slate-200 mb-1 overflow-hidden">
                        <image :src="prod.image" mode="aspectFill" class="w-full h-full" />
                      </view>
                      <text class="text-[10px] font-bold text-slate-700 truncate block">{{ prod.name }}</text>
                      <text class="text-[9px] text-slate-400 truncate block">{{ prod.description }}</text>
                    </view>
                  </view>
                </scroll-view>
              </view>

              <view class="bg-white rounded-xl p-4 border border-emerald-100">
                <view class="flex items-center space-x-2 mb-3">
                  <text class="iconfont icon-lucide-calendar-clock text-base text-emerald-500"></text>
                  <text class="text-xs font-bold text-emerald-800">疗程时刻表</text>
                </view>
                <view class="space-y-4 relative">
                  <view class="absolute left-2 top-1 bottom-1 w-[1px] bg-emerald-100"></view>

                  <view v-for="(step, idx) in selectedDisease.bundle.schedule" :key="idx" class="relative pl-6">
                    <view
                      class="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white border-solid border-2 border-emerald-400 z-10">
                    </view>
                    <view class="flex flex-col">
                      <view
                        class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded w-fit mb-0.5">
                        {{ step.day }}</view>
                      <text class="text-xs font-bold text-slate-700 block">{{ step.title }}</text>
                      <!-- <text class="text-[10px] text-slate-500 mt-0.5 leading-relaxed block">{{ step.description
                        }}</text> -->
                    </view>
                  </view>
                </view>
              </view>

              <button @click="handleBuy" :disabled="isProcessingBuy"
                class="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors m-0"
                :class="isProcessingBuy ? 'bg-slate-400 cursor-not-allowed' : ''">
                <view v-if="isProcessingBuy" class="flex items-center gap-2">
                  <text class="iconfont icon-lucide-loader-2 text-base animate-spin"></text>
                  <text>生成疗程中...</text>
                </view>
                <view v-else class="flex items-center gap-2">
                  <text class="iconfont icon-lucide-shopping-bag text-base"></text>
                  <text>一键购买治疗包 (¥{{ selectedDisease.bundle.price }})</text>
                </view>
              </button>
            </view>

            <view v-else class="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
              <text class="text-xs text-slate-500">暂无组合治疗包，请参考下方建议进行处理。</text>
            </view>

            <view>
              <view class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <text class="iconfont icon-lucide-search text-base text-emerald-500"></text>
                <text>识别症状</text>
              </view>
              <view class="space-y-2">
                <view v-for="(sym, idx) in selectedDisease.symptoms" :key="idx"
                  class="flex items-start text-sm text-slate-600">
                  <view class="mr-2 mt-1.5 w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0"></view>
                  <text>{{ sym }}</text>
                </view>
              </view>
            </view>

            <view class="grid grid-cols-1 gap-6">
              <view>
                <view class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <text class="iconfont icon-lucide-shield-check text-base text-emerald-500"></text>
                  <text>通用防治方法</text>
                </view>
                <view class="bg-white rounded-xl p-4 border border-solid border-slate-100 shadow-sm">
                  <view class="space-y-2">
                    <view v-for="(treat, idx) in selectedDisease.treatment" :key="idx"
                      class="flex items-start text-sm text-slate-700">
                      <text
                        class="iconfont icon-lucide-circle-check text-base mr-2 text-emerald-500 shrink-0 mt-0.5"></text>
                      <text>{{ treat }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <view>
                <view class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <text class="iconfont icon-lucide-thermometer text-base text-emerald-500"></text>
                  <text>预防建议</text>
                </view>
                <view
                  class="text-sm text-slate-600 leading-relaxed bg-orange-50/50 p-4 rounded-xl border border-orange-100 block">
                  {{ selectedDisease.prevention }}
                </view>
              </view>
            </view>

            <view class="h-8"></view>

          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePlantDiseases } from '@/hooks/useDisease'
import { useTreatmentPlan } from '@/hooks/useTreatmentPlan'
import { useStoreProducts } from '@/hooks/useShop'
import bus from '@/common/bus.js';

const { createPlan } = useTreatmentPlan()
const { findDisease } = usePlantDiseases()
const { findProductByIds } = useStoreProducts()
// Emits
const emit = defineEmits(['back', 'diagnose', 'startTreatment']);

// State
const activeTab = ref('all');
const searchQuery = ref('');
const selectedDisease = ref(null);
const isProcessingBuy = ref(false);

// 在 onLoad 中获取路由参数并设置植物数据
onLoad((options) => {
  console.log('页面参数:', options);

  // 从路由参数获取 id
  // const plantId = options.id || options.plantId || '';

  if (!options.id) {
    // error.value = '未找到植物ID';
    // loading.value = false;
    return;
  }

  // 从 MOCK_PRODUCTS 中查找对应的植物
  const foundData = findDisease(options.id);
  console.log('foundData', foundData)
  if (foundData.bundle) {
    foundData.bundle.products = findProductByIds(foundData.bundle.products.map(item => item.id))
  }
  if (foundData) {
    // 更新响应式数据
    // Object.assign(plant, foundPlant);
    selectedDisease.value = foundData
    // 可以在这里设置页面标题
    uni.setNavigationBarTitle({
      title: foundData.name
    });

    // 模拟加载延迟
    // setTimeout(() => {
    //   loading.value = false;
    // }, 500);
  } else {
    // error.value = '未找到对应的植物信息';
    // loading.value = false;

    // 设置为默认植物
    // Object.assign(plant, {
    //   ...defaultPlant,
    //   id: plantId,
    //   name: `植物 ${plantId}`
    // });
  }

  // console.log('当前植物数据:', plant);
});


// Methods

const handleBack = () => {
  uni.navigateBack();
};
const handleDiagnose = () => emit('diagnose');

const getTypeLabel = (type) => {
  switch (type) {
    case 'pest': return { text: '虫害', color: 'bg-red-100 text-red-600' };
    case 'fungus': return { text: '真菌', color: 'bg-purple-100 text-purple-600' };
    case 'environment': return { text: '环境', color: 'bg-orange-100 text-orange-600' };
    default: return { text: '细菌', color: 'bg-slate-100 text-slate-600' };
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-orange-500';
    default: return 'text-blue-500';
  }
};

const handleBuy = () => {
  if (!selectedDisease.value || !selectedDisease.value.bundle) return;
  isProcessingBuy.value = true;
  createPlan(selectedDisease.value, selectedDisease.value.bundle)
  bus.emit('refreshTreatmentList');

  // Simulate Payment Processing
  // setTimeout(() => {
  //   isProcessingBuy.value = false;
  //   const currentDisease = selectedDisease.value;
  //   const currentBundle = selectedDisease.value.bundle;

  //   closeModal();
  //   emit('startTreatment', { disease: currentDisease, bundle: currentBundle });

  //   uni.showToast({
  //     title: '治疗疗程已生成',
  //     icon: 'success'
  //   });
  // }, 1500);
};
</script>

<style scoped>
/* 辅助样式：
  1. 确保 iconfont 类已定义
  2. 隐藏滚动条样式
  3. 动画样式
*/

.iconfont {
  display: inline-block;
  line-height: 1;
}

/* 隐藏 scroll-view 滚动条 */
scroll-view ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* 简单的淡入上浮动画 */
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
  animation: fadeInUp 0.3s ease-out forwards;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>