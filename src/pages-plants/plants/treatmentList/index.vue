<template>
  <view class="min-h-screen bg-[#FAFAFA] pb-24 relative z-50">

    <up-sticky>
      <view class="bg-white z-30">
        <!-- <view class="px-4 py-3 flex items-center space-x-3">
        <button @click="handleBack" class="p-2 rounded-full hover:bg-slate-100 transition-colors m-0 leading-none">
          <text class="iconfont icon-lucide-chevron-left text-2xl text-slate-600"></text>
        </button>
        <text class="text-lg font-bold text-slate-800">我的疗程本</text>
      </view> -->

        <view class="flex px-4 gap-6">
          <view @click="setActiveTab('active')"
            class="flex-1 py-3 text-sm font-bold border-b-2 transition-colors relative text-center"
            :class="activeTab === 'active' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'">
            进行中 ({{ activeTreatments.length }})
          </view>
          <view @click="setActiveTab('completed')"
            class="flex-1 py-3 text-sm font-bold border-b-2 transition-colors relative text-center"
            :class="activeTab === 'completed' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600'">
            已完成 ({{ completedTreatments.length }})
          </view>
        </view>
      </view>
    </up-sticky>

    <view class="p-4 space-y-4">
      <template v-if="displayTreatments.length > 0">
        <view v-for="treatment in displayTreatments" :key="treatment.id" @click="handleSelectTreatment(treatment.id)"
          class="bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
          :class="activeTab === 'completed' ? 'opacity-80 border-slate-100 grayscale-[0.3]' : 'border-emerald-50'">
          <view class="flex justify-between items-start mb-4">
            <view class="flex gap-4">
              <view class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                :class="activeTab === 'completed' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-600'">
                <text v-if="activeTab === 'completed'" class="iconfont icon-lucide-archive text-2xl"></text>
                <text v-else class="iconfont icon-lucide-pill text-2xl"></text>
              </view>
              <view>
                <text class="block font-bold text-slate-800 text-base">{{ treatment.bundleName }}</text>
                <view class="flex items-center text-xs text-slate-500 mt-1">
                  <text class="bg-slate-100 px-1.5 py-0.5 rounded font-medium">{{ treatment.diseaseName }}</text>
                  <text class="mx-2">•</text>
                  <text class="iconfont icon-lucide-clock text-xs mr-1"></text>
                  <text>{{ treatment.startDate }} 开始</text>
                </view>
              </view>
            </view>
          </view>

          <view class="space-y-2">
            <view class="flex justify-between text-xs font-medium">
              <text :class="activeTab === 'completed' ? 'text-slate-500' : 'text-emerald-600'">
                {{ activeTab === 'completed' ? '疗程已结束' : `进度: ${calculateProgress(treatment)}%` }}
              </text>
              <text class="text-slate-400">
                {{ getCompletedStepCount(treatment) }}/{{ treatment.totalSteps }} 步
              </text>
            </view>
            <view class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <view class="h-full rounded-full transition-all duration-1000"
                :class="activeTab === 'completed' ? 'bg-slate-400' : 'bg-emerald-500'"
                :style="{ width: calculateProgress(treatment) + '%' }"></view>
            </view>
          </view>

          <view v-if="activeTab === 'active'"
            class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <view class="flex items-center gap-2 max-w-[85%]">
              <view class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></view>
              <text class="text-xs text-slate-600 truncate">
                <text class="font-bold">下一步:</text> {{ treatment.schedule[treatment.currentStepIndex].title }}
              </text>
            </view>
            <text class="iconfont icon-lucide-arrow-right text-base text-slate-300"></text>
          </view>

          <view v-if="activeTab === 'completed'"
            class="mt-4 pt-4 border-t border-slate-50 flex items-center text-emerald-600 font-bold text-xs">
            <text class="iconfont icon-lucide-check-circle-2 text-base mr-1.5"></text>
            <text>康复归档</text>
          </view>
        </view>
      </template>

      <template v-else>
        <view class="flex flex-col items-center justify-center py-20 text-slate-400">
          <view class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <text class="iconfont icon-lucide-clipboard-pen text-3xl opacity-40"></text>
          </view>
          <text class="text-sm font-medium">暂无{{ activeTab === 'active' ? '进行中' : '已完成' }}的疗程</text>
          <text v-if="activeTab === 'active'" class="text-xs mt-2 opacity-60">植物都很健康，太棒了！</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  treatments: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['back', 'selectTreatment']);

// State
const activeTab = ref('active');

// Helper Logic
const isTreatmentComplete = (t) => {
  return t.schedule.every(step => step.isCompleted);
};

// Computed: Filtered Lists
const activeTreatments = computed(() => {
  return props.treatments.filter(t => !isTreatmentComplete(t));
});

const completedTreatments = computed(() => {
  return props.treatments.filter(t => isTreatmentComplete(t));
});

const displayTreatments = computed(() => {
  return activeTab.value === 'active' ? activeTreatments.value : completedTreatments.value;
});

// Helper Methods for Template
const getCompletedStepCount = (treatment) => {
  return treatment.schedule.filter(s => s.isCompleted).length;
};

const calculateProgress = (treatment) => {
  if (!treatment.totalSteps) return 0;
  return Math.round((getCompletedStepCount(treatment) / treatment.totalSteps) * 100);
};

// Actions
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const handleBack = () => {
  emit('back');
};

const handleSelectTreatment = (id) => {
  emit('selectTreatment', id);
};
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* 确保动画类生效 (通常依赖 tailwind，这里补充定义以防万一) */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 简单的淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>