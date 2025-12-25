<template>
  <view class="min-h-screen bg-[#FAFAFA] pb-24 relative z-50 animate-fade-in">
    <up-sticky>
      <view class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <view class="px-4 py-3 box-border">
          <view class="relative">
            <text
              class="iconfont icon-lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-400"></text>
            <input type="text" placeholder="搜索症状或病害名称..." v-model="searchQuery"
              class="box-border w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all h-10" />
          </view>
        </view>

        <scroll-view scroll-x :show-scrollbar="false" class="whitespace-nowrap w-full">
          <view class="px-4 pb-0 flex space-x-6">
            <view v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab.id)"
              class="pb-3 text-sm font-bold border-b-2 transition-colors inline-block"
              :class="activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'">
              {{ tab.label }}
            </view>
          </view>
        </scroll-view>
      </view>
    </up-sticky>

    <view class="p-4">

      <view @click="handleDiagnose"
        class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg mb-6 flex items-center justify-between cursor-pointer group">
        <view>
          <view class="font-bold text-lg mb-1 flex items-center gap-2">
            <text class="iconfont icon-lucide-stethoscope text-xl text-emerald-400"></text>
            <text>不确定是什么病？</text>
          </view>
          <text class="text-slate-300 text-xs block">拍照上传，让 AI 专家为您精准诊断</text>
        </view>
        <view class="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
          <text class="iconfont icon-lucide-scan-line text-2xl text-white"></text>
        </view>
      </view>

      <view class="grid grid-cols-1 gap-4">
        <view v-for="disease in filteredDiseases" :key="disease.id" @click="openModal(disease)"
          class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <view class="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
            <image :src="disease.image" mode="aspectFill" class="w-full h-full" />
            <view v-if="disease.bundle"
              class="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-[9px] font-bold text-center py-1">
              含治疗包
            </view>
          </view>
          <view class="flex-1 min-w-0 flex flex-col justify-between py-1">
            <view>
              <view class="flex justify-between items-start">
                <text class="font-bold text-slate-800 text-base">{{ disease.name }}</text>
                <view class="text-[10px] px-2 py-0.5 rounded-md font-bold" :class="getTypeLabel(disease.type).color">
                  {{ getTypeLabel(disease.type).text }}
                </view>
              </view>
              <text class="text-xs text-slate-400 italic mt-0.5 block">{{ disease.alias }}</text>
            </view>

            <view>
              <view class="text-xs text-slate-500 line-clamp-2 mb-2">
                <text class="font-bold text-slate-700">症状：</text>
                <text>{{ disease.symptoms.join('，') }}</text>
              </view>
              <view class="flex items-center text-[10px] gap-1">
                <text class="iconfont icon-lucide-alert-triangle text-xs"
                  :class="getSeverityColor(disease.severity)"></text>
                <text class="text-slate-400">危害程度: </text>
                <text class="font-bold uppercase" :class="getSeverityColor(disease.severity)">
                  {{ disease.severity === 'high' ? '高' : disease.severity === 'medium' ? '中' : '低' }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePlantDiseases, DISEASE_TYPES } from '@/hooks/useDisease'

const { diseases, loadDiseases } = usePlantDiseases()
// Emits
const emit = defineEmits(['back', 'diagnose', 'startTreatment']);

const tabs = DISEASE_TYPES;
// State
const activeTab = ref('all');
const searchQuery = ref('');
const selectedDisease = ref(null);
const isProcessingBuy = ref(false);


// Computed
const filteredDiseases = computed(() => {
  return diseases.value.filter(d => {
    const matchesTab = activeTab.value === 'all' || d.type === activeTab.value;
    const matchesSearch = d.name.includes(searchQuery.value) || (d.alias && d.alias.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchesTab && matchesSearch;
  });
});

// Methods
const setActiveTab = (id) => {
  activeTab.value = id;
};

const handleBack = () => emit('back');
const handleDiagnose = () => {
  uni.navigateTo({ url: '/pages-plants/tools/ai/AiDiagnose' });
}

const openModal = (disease) => {
  // selectedDisease.value = disease;
  uni.navigateTo({ url: '/pages-plants/plants/diseaseDetail2/index?id=' + disease.id });
};

const closeModal = () => {
  selectedDisease.value = null;
};

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

  // Simulate Payment Processing
  setTimeout(() => {
    isProcessingBuy.value = false;
    const currentDisease = selectedDisease.value;
    const currentBundle = selectedDisease.value.bundle;

    closeModal();
    emit('startTreatment', { disease: currentDisease, bundle: currentBundle });

    uni.showToast({
      title: '治疗疗程已生成',
      icon: 'success'
    });
  }, 1500);
};

onLoad(() => {
  loadDiseases()
})
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