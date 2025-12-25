<template>
  <view class="min-h-screen bg-slate-50 pb-32 relative z-50">
    <!-- #ifdef MP-WEIXIN -->
    <!-- <up-sticky customNavHeight="0"> -->
    <up-navbar title="" bgColor="transparent" leftIcon="">
      <template #left>
        <button @click="handleBack"
          class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors border-none m-0 flex items-center justify-center leading-none">
          <text class="iconfont icon-lucide-chevron-left text-xl text-white"></text>
        </button>
      </template>
    </up-navbar>
    <!-- </up-sticky> -->
    <!-- 1. Header Section -->
    <view
      class="pt-[64px] bg-emerald-600 text-white pb-12 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-lg shadow-emerald-200">
      <view class="relative z-10">
        <!-- Navbar -->
        <!-- <view class="flex items-center justify-between mb-6">
          <button @click="handleBack"
            class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors border-none m-0 flex items-center justify-center leading-none">
            <text class="iconfont icon-lucide-chevron-left text-xl text-white"></text>
          </button>
          <view
            class="text-[10px] font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-solid border-white/20 backdrop-blur-md text-white">
            正在执行治疗方案
          </view>
        </view> -->

        <!-- Title -->
        <text class="text-2xl font-black mb-1 block text-white">{{ treatment.bundleName }}</text>
        <view class="flex items-center text-emerald-100 text-[11px] mb-6 font-bold uppercase tracking-wider">
          <text class="iconfont icon-lucide-stethoscope text-xs mr-1.5"></text>
          <text>目标病害: {{ treatment.diseaseName }}</text>
          <text class="mx-2 opacity-50">/</text>
          <text>开始日期: {{ treatment.startDate }}</text>
        </view>

        <!-- Progress Card -->
        <view
          class="bg-white text-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between border border-solid border-emerald-500/10">
          <view>
            <text class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 block">治疗完成度</text>
            <view class="flex items-baseline gap-1">
              <text class="text-3xl font-black text-emerald-600">{{ progressPercent }}%</text>
              <text class="text-xs text-slate-400 font-bold">已完成</text>
            </view>
          </view>
          <!-- CSS Conic Gradient Progress Ring -->
          <view class="w-16 h-16 relative flex items-center justify-center rounded-full"
            :style="{ background: `conic-gradient(#10b981 ${progressPercent}%, #f1f5f9 0)` }">
            <view class="absolute inset-0 m-1.5 bg-white rounded-full flex items-center justify-center">
              <text class="iconfont icon-lucide-calendar-days text-2xl text-emerald-600"></text>
            </view>
          </view>
        </view>
      </view>
      <!-- Background Decor -->
      <view class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none">
      </view>
    </view>

    <!-- 2. Tabs Navigation -->
    <view class="flex justify-center -mt-6 relative z-20 mb-8 px-6">
      <view class="bg-white p-1.5 rounded-[2rem] shadow-lg border border-solid border-slate-100 flex w-full max-w-sm">
        <button @click="activeTab = 'timeline'"
          class="flex-1 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all border-none m-0 leading-normal"
          :class="activeTab === 'timeline' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 bg-transparent'">
          治疗时间轴
        </button>
        <button @click="activeTab = 'products'"
          class="flex-1 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all border-none m-0 leading-normal"
          :class="activeTab === 'products' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 bg-transparent'">
          我的药箱
        </button>
      </view>
    </view>

    <!-- 3. Main Content Container -->
    <view class="px-6">

      <!-- Tab: Timeline -->
      <view v-if="activeTab === 'timeline'" class="space-y-10 relative">
        <!-- Vertical Line -->
        <view class="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-200 z-0"></view>

        <view v-for="(step, idx) in treatment.schedule" :key="idx"
          class="relative z-10 pl-14 transition-all duration-500"
          :class="getStepStatus(idx, step).isLocked ? 'opacity-50 grayscale' : 'opacity-100'">
          <!-- Step Indicator Pin -->
          <view
            class="absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-solid transition-all duration-500 box-border"
            :class="getStepNodeClass(idx, step)">
            <text v-if="step.isCompleted" class="iconfont icon-lucide-circle-check text-2xl"></text>
            <text v-else class="font-black text-sm">{{ idx + 1 }}</text>
          </view>

          <!-- Step Card Content -->
          <view class="bg-white rounded-3xl p-6 border border-solid shadow-sm transition-all"
            :class="getStepStatus(idx, step).isActive ? 'border-emerald-500 ring-8 ring-emerald-50' : 'border-slate-100'">
            <!-- Step Header -->
            <view class="flex items-center justify-between mb-4">
              <view class="flex items-center gap-2">
                <!-- <view class="px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  :class="[getStepIcon(step.type).bg, getStepIcon(step.type).color]">
                  <text class="iconfont text-xs" :class="getStepIcon(step.type).icon"></text>
                  <text class="text-[10px] font-black uppercase tracking-wider">{{ getStepIcon(step.type).label
                  }}</text>
                </view> -->
                <text class="text-xs font-bold text-emerald-700 uppercase tracking-widest">{{ step.day
                  }}</text>
              </view>
              <view v-if="getStepStatus(idx, step).isActive" class="w-2 h-2 bg-emerald-500 rounded-full animate-ping">
              </view>
            </view>

            <text class="font-black text-lg mb-2 block"
              :class="getStepStatus(idx, step).isActive ? 'text-slate-900' : 'text-slate-700'">
              {{ step.title }}
            </text>

            <!-- Professional Descriptions -->
            <view class="space-y-4">
              <text class="text-xs text-slate-500 leading-relaxed font-medium block">
                {{ step.description }}
              </text>

              <!-- Environmental Intervention -->
              <view v-if="step.environmentAdvice" class="bg-sky-50 rounded-2xl p-4 border border-solid border-sky-100">
                <view class="flex items-center gap-2 mb-2 text-sky-600">
                  <text class="iconfont icon-lucide-wind text-xs"></text>
                  <text class="text-[9px] font-black uppercase tracking-widest">环境调控方案</text>
                </view>
                <text class="text-[11px] text-sky-800 leading-relaxed font-medium block">
                  {{ step.environmentAdvice }}
                </text>
              </view>

              <!-- Observation Points -->
              <view v-if="step.observationPoint"
                class="bg-amber-50 rounded-2xl p-4 border border-solid border-amber-100">
                <view class="flex items-center gap-2 mb-2 text-amber-600">
                  <text class="iconfont icon-lucide-scan-search text-xs"></text>
                  <text class="text-[9px] font-black uppercase tracking-widest">关键观察指标</text>
                </view>
                <text class="text-[11px] text-amber-800 leading-relaxed font-medium block">
                  {{ step.observationPoint }}
                </text>
              </view>

              <!-- Step Linked Products -->
              <view v-if="getStepProducts(step).length > 0" class="pt-2">
                <view class="flex items-center gap-2 mb-2">
                  <text class="iconfont icon-lucide-package text-xs text-slate-400"></text>
                  <text class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">本环节所需药品/工具</text>
                </view>
                <view class="space-y-2">
                  <view v-for="p in getStepProducts(step)" :key="p.id" @click="selectedStoreProduct = p"
                    class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-solid border-slate-100 active:bg-slate-100 transition-colors cursor-pointer">
                    <view class="flex items-center gap-3">
                      <image :src="p.image" class="w-8 h-8 rounded-lg" mode="aspectFill" />
                      <text class="text-xs font-bold text-slate-700">{{ p.name }}</text>
                    </view>
                    <text class="iconfont icon-lucide-arrow-up-right text-xs text-slate-300"></text>
                  </view>
                </view>
              </view>
            </view>

            <!-- Action Footer -->
            <button v-if="getStepStatus(idx, step).isActive" @click="handleCompleteStep(idx)"
              class="mt-6 w-full py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 uppercase active:scale-[0.98] transition-all border-none m-0 leading-normal">
              <text>确认执行并记录进度</text>
              <text class="iconfont icon-lucide-arrow-right text-sm"></text>
            </button>

            <view v-else-if="step.isCompleted"
              class="mt-4 pt-4  border-t border-solid border-slate-50 flex items-center text-[10px] text-emerald-600 font-black uppercase tracking-widest">
              <text class="iconfont icon-lucide-circle-check text-xs mr-1.5"></text>
              <text>任务已按照标准流程执行</text>
            </view>

            <view v-else
              class="mt-4 pt-4  border-t border-solid border-slate-50 flex items-center text-[10px] text-slate-300 font-black uppercase tracking-widest">
              <text class="iconfont icon-lucide-clock-4 text-xs mr-1.5"></text>
              <text>待执行：请遵循计划周期</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Tab: Products -->
      <view v-if="activeTab === 'products'" class="grid grid-cols-1 gap-6 pb-12 animate-fade-in">
        <view v-for="product in treatment.products" :key="product.id"
          class="bg-white rounded-[2.5rem] overflow-hidden border border-solid border-slate-100 shadow-sm flex flex-col active:scale-[0.99] transition-all">
          <!-- Top: Product Info -->
          <view @click="selectedStoreProduct = product"
            class="p-6 flex items-center gap-5 cursor-pointer hover:bg-slate-50/50 transition-all">
            <view
              class="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden shrink-0 border border-solid border-slate-100 relative">
              <image :src="product.image" class="w-full h-full" mode="aspectFill" />
            </view>
            <view class="flex-1 min-w-0 py-1">
              <view class="flex items-center justify-between mb-1.5">
                <text class="font-black text-slate-800 text-lg truncate leading-tight block">{{ product.name }}</text>
                <text class="iconfont icon-lucide-chevron-right text-xl text-slate-300"></text>
              </view>
              <view class="flex flex-wrap gap-2 mb-3">
                <text
                  class="text-[9px] text-emerald-600 font-black px-2 py-0.5 bg-emerald-50 rounded-lg uppercase tracking-wider">专业药剂</text>
                <text v-if="product.specs && product.specs[1]"
                  class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">规格: {{ product.specs[1].value
                  }}</text>
              </view>
              <view
                class="inline-flex items-center text-blue-600 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-xl">
                <text class="iconfont icon-lucide-circle-alert text-xs mr-1"></text>
                <text>查看详细规格说明</text>
              </view>
            </view>
          </view>

          <!-- Bottom: Detailed Instructions Card -->
          <view class="bg-slate-50/50  border-t border-solid border-slate-100 p-6 space-y-8">
            <view class="grid grid-cols-2 gap-4">
              <view class="bg-white p-4 rounded-3xl border border-solid border-slate-100 shadow-sm">
                <view class="flex items-center gap-1.5 mb-2">
                  <text class="iconfont icon-lucide-droplets text-sm text-blue-500"></text>
                  <text class="text-[9px] text-slate-400 font-black uppercase tracking-widest">推荐稀释比例</text>
                </view>
                <text class="text-sm font-black text-slate-800 block">
                  {{ (product.name.includes('药') || product.name.includes('菌')) ? '1:1000 稀释' : '按需施用' }}
                </text>
              </view>
              <view class="bg-white p-4 rounded-3xl border border-solid border-slate-100 shadow-sm">
                <view class="flex items-center gap-1.5 mb-2">
                  <text class="iconfont icon-lucide-clock-4 text-sm text-amber-500"></text>
                  <text class="text-[9px] text-slate-400 font-black uppercase tracking-widest">使用频率建议</text>
                </view>
                <text class="text-sm font-black text-slate-800 block">每 7-10 天/次</text>
              </view>
            </view>

            <!-- Step-by-Step Manual -->
            <view v-if="product.usageSteps && product.usageSteps.length > 0">
              <view class="flex items-center gap-2 mb-4">
                <view class="w-1.5 h-4 bg-emerald-500 rounded-full"></view>
                <view class="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                  <text class="iconfont icon-lucide-list-checks text-sm"></text>
                  <text>标准使用操作程序</text>
                </view>
              </view>
              <view class="space-y-4 pl-1">
                <view v-for="(step, idx) in product.usageSteps" :key="idx" class="flex gap-4">
                  <view
                    class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-solid border-emerald-200">
                    <text class="text-[10px] font-black">{{ idx + 1 }}</text>
                  </view>
                  <text class="text-xs text-slate-600 leading-relaxed font-medium flex-1">{{ step }}</text>
                </view>
              </view>
            </view>

            <!-- Precaution Warning -->
            <view v-if="product.precautions && product.precautions.length > 0"
              class="bg-rose-50 rounded-[2rem] p-6 border border-solid border-rose-100/50">
              <view class="flex items-center gap-2 mb-3 text-rose-600">
                <text class="iconfont icon-lucide-shield-alert text-sm"></text>
                <text class="text-[10px] font-black uppercase tracking-[0.15em]">核心注意事项</text>
              </view>
              <view class="space-y-2">
                <view v-for="(pre, idx) in product.precautions" :key="idx" class="flex items-start gap-2">
                  <text class="iconfont icon-lucide-triangle-alert text-xs mt-0.5 text-rose-700 shrink-0"></text>
                  <text class="text-[10px] text-rose-700 leading-relaxed font-bold italic flex-1">{{ pre }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- Expert Summary Note -->
        <view
          class="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300 group">
          <view class="relative z-10">
            <view class="flex items-center gap-3 mb-4">
              <view class="bg-emerald-500 p-2 rounded-xl">
                <text class="iconfont icon-lucide-shield-check text-xl text-white"></text>
              </view>
              <text class="font-black text-sm uppercase tracking-widest">专业医疗级品质承诺</text>
            </view>
            <text class="text-[11px] text-slate-400 leading-relaxed font-medium mb-6 block">
              所有推荐药剂均通过 SmartGreen 实验室生物活性及植物安全性测试。请严格遵守建议浓度，避免在植物极端压力期（如休眠、脱水、暴晒）用药。
            </text>
            <view class="flex items-center gap-4">
              <button
                class="flex-1 bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-solid border-white/10 flex items-center justify-center gap-2 border-solid m-0 leading-normal text-white">
                <text class="iconfont icon-lucide-book-open text-xs"></text>
                <text>电子说明书</text>
              </button>
              <button
                class="flex-1 bg-emerald-600 hover:bg-emerald-500 transition-colors py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900 flex items-center justify-center gap-2 border-none m-0 leading-normal text-white">
                <text class="iconfont icon-lucide-scan-search text-xs"></text>
                <text>重新诊断</text>
              </button>
            </view>
          </view>
          <text
            class="iconfont icon-lucide-package absolute -right-8 -bottom-8 text-[10rem] text-white opacity-[0.03] rotate-12 pointer-events-none"></text>
        </view>
      </view>
    </view>

    <!-- Confetti Overlay -->
    <view v-if="showConfetti"
      class="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center animate-fade-in">
      <view
        class="bg-slate-900/90 backdrop-blur-xl text-white px-8 py-6 rounded-[2.5rem] flex flex-col items-center shadow-2xl border border-solid border-white/10 scale-110">
        <view class="relative mb-3">
          <view class="absolute inset-0 bg-emerald-500/50 blur-xl animate-pulse"></view>
          <text class="iconfont icon-lucide-circle-check text-5xl text-emerald-400 relative z-10"></text>
        </view>
        <text class="font-black text-sm tracking-[0.2em] uppercase italic block mt-2">治疗记录已保存</text>
        <text class="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest block">治疗方案按计划推进中</text>
      </view>
    </view>

    <!-- Store Product Detail Modal (Simulated View) -->
    <view v-if="selectedStoreProduct" class="fixed inset-0 z-[100] bg-white animate-fade-in flex flex-col">
      <view class="flex-1 flex flex-col items-center justify-center p-8">
        <image :src="selectedStoreProduct.image" class="w-40 h-40 rounded-3xl mb-6 shadow-lg" mode="aspectFill"></image>
        <text class="text-xl font-bold text-slate-800 mb-2 block">{{ selectedStoreProduct.name }}</text>
        <text class="text-sm text-slate-500 text-center mb-8 block">这里是商品详情页的模拟视图。在真实应用中，这会是一个完整的商品详情页面。</text>
        <button @click="selectedStoreProduct = null"
          class="bg-slate-100 text-slate-600 px-8 py-3 rounded-full font-bold border-none">返回疗程</button>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useTreatmentPlan } from '@/hooks/useTreatmentPlan'
import { useStoreProducts } from '@/hooks/useShop'
const { findPlanById, completeStep } = useTreatmentPlan()
const { findProductByIds } = useStoreProducts()
import bus from '@/common/bus.js';
// plan_1766478487614
// ==================== Mock Data ====================
// In a real app, fetch this by ID

// ==================== State ====================
const treatment = reactive({
  id: '',
  diseaseId: '',
  diseaseName: '',
  bundleId: '',
  bundleName: '',
  bundlePrice: '',
  plantId: '',
  startDate: '',
  totalSteps: '',
  currentStepIndex: 0,
  status: "", // active, completed, abandoned
  schedule: [],
  products: [],
});
const activeTab = ref('timeline');
const showConfetti = ref(false);
const selectedStoreProduct = ref(null);
const safeAreaTop = ref(44);

// ==================== Computed ====================
const completedCount = computed(() => treatment.schedule.filter(s => s.isCompleted).length);
const progressPercent = computed(() => {
  if (treatment.totalSteps === 0) return 0;
  return Math.round((completedCount.value / treatment.totalSteps) * 100);
});

// ==================== Methods ====================

const getStepStatus = (index, step) => {
  const isActive = index === treatment.currentStepIndex && !step.isCompleted;
  const isPast = step.isCompleted;
  const isLocked = !isPast && !isActive;
  return { isActive, isPast, isLocked };
};

const getStepNodeClass = (index, step) => {
  const { isActive, isPast } = getStepStatus(index, step);
  if (isPast) return 'bg-emerald-600 border-emerald-100 text-white';
  if (isActive) return 'bg-white border-emerald-500 text-emerald-600 shadow-lg';
  return 'bg-slate-100 border-slate-50 text-slate-300';
};

const getStepIcon = (type) => {
  switch (type) {
    case 'physical': return { icon: 'icon-lucide-scissors', color: 'text-rose-500', bg: 'bg-rose-50', label: '物理干预' };
    case 'medicine': return { icon: 'icon-lucide-flask-conical', color: 'text-indigo-500', bg: 'bg-indigo-50', label: '药剂处理' };
    case 'environment': return { icon: 'icon-lucide-wind', color: 'text-sky-500', bg: 'bg-sky-50', label: '环境调控' };
    case 'observation': return { icon: 'icon-lucide-eye', color: 'text-amber-500', bg: 'bg-amber-50', label: '状态观察' };
    default: return { icon: 'icon-lucide-zap', color: 'text-emerald-500', bg: 'bg-emerald-50', label: '常规护理' };
  }
};

const getStepProducts = (step) => {
  return treatment.products.filter(p => step.productsUsed.includes(p.id));
};

const handleCompleteStep = (index) => {
  if (treatment.schedule[index]) {
    treatment.schedule[index].isCompleted = true;
    if (index < treatment.schedule.length - 1) {
      treatment.currentStepIndex = index + 1;
    }
  }

  completeStep(treatment.id, index)

  if (index === treatment.currentStepIndex - (treatment.schedule[index].isCompleted ? 0 : 1)) {
    bus.emit('refreshTreatmentList');
    // setShowConfetti(true);
    // setTimeout(() => setShowConfetti(false), 2000);
  }
};

const handleBack = () => {
  uni.navigateBack();
};

// ==================== Lifecycle ====================
onLoad((options) => {
  if (options.id) {
    const findData = findPlanById(options.id)
    findData.products = findProductByIds(findData.products.map(item => item.id))
    Object.assign(treatment, findData)
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

@keyframes ping {

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Custom Scrollbar Hide */
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>