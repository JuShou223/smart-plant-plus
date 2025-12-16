<template>
  <view class="min-h-screen bg-slate-50 pb-24 animate-fade-in relative z-50">

    <view
      class="bg-emerald-600 text-white pt-6 pb-12 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-lg shadow-emerald-200">
      <view
        class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none">
      </view>

      <view class="relative z-10">
        <view class="flex items-center justify-between mb-6">
          <button @click="handleBack"
            class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors m-0 leading-none">
            <text class="iconfont icon-lucide-chevron-left text-xl text-white"></text>
          </button>
          <text
            class="text-xs font-bold bg-emerald-700/50 px-3 py-1 rounded-full border border-solid border-emerald-500/50 backdrop-blur-md">
            治疗进行中
          </text>
        </view>

        <text class="block text-2xl font-bold mb-1">{{ treatment.bundleName }}</text>
        <view class="flex items-center text-emerald-100 text-sm mb-6">
          <text class="iconfont icon-lucide-shield-check text-base mr-1.5"></text>
          <text>针对: {{ treatment.diseaseName }}</text>
          <text class="mx-2">•</text>
          <text>开始于: {{ treatment.startDate }}</text>
        </view>

        <view class="bg-white text-slate-800 p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <view>
            <text class="block text-xs text-slate-400 font-bold uppercase mb-1">疗程进度</text>
            <view class="flex items-baseline space-x-1">
              <text class="text-2xl font-bold text-emerald-600">{{ progressPercent }}%</text>
              <text class="text-xs text-slate-400">已完成</text>
            </view>
          </view>
          <view class="w-16 h-16 relative flex items-center justify-center">
            <qiun-data-charts type="arcbar" :opts="arcbarOpts" :chartData="arcbarData" :canvas2d="true"
              background="none" />
            <text class="iconfont icon-lucide-calendar-days text-2xl text-emerald-600 absolute"></text>
          </view>
        </view>
      </view>
    </view>

    <view class="flex justify-center -mt-6 relative z-20 mb-6">
      <view class="bg-white p-1 rounded-full shadow-sm border border-solid border-slate-100 inline-flex">
        <button @click="setActiveTab('timeline')"
          class="px-6 py-2 rounded-full text-xs font-bold transition-all m-0 leading-none"
          :class="activeTab === 'timeline' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-emerald-600 bg-transparent'">
          治疗时间轴
        </button>
        <button @click="setActiveTab('products')"
          class="px-6 py-2 rounded-full text-xs font-bold transition-all m-0 leading-none"
          :class="activeTab === 'products' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-emerald-600 bg-transparent'">
          我的药箱
        </button>
      </view>
    </view>

    <view class="px-6">
      <view v-if="activeTab === 'timeline'" class="space-y-6 relative">

        <view class="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 z-0"></view>

        <view v-for="(step, idx) in treatment.schedule" :key="idx"
          class="relative z-10 pl-12 transition-all duration-500"
          :class="getStepStatus(step, idx).isLocked ? 'opacity-60 grayscale' : 'opacity-100'">
          <view
            class="absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center border-4 border-solid transition-colors duration-300"
            :class="getStepNodeClass(step, idx)">
            <text v-if="step.isCompleted" class="iconfont icon-lucide-check-circle-2 text-xl"></text>
            <text v-else class="font-bold text-sm">{{ idx + 1 }}</text>
          </view>

          <view class="bg-white rounded-2xl p-5 border border-solid shadow-sm transition-all"
            :class="getStepStatus(step, idx).isActive ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100'">
            <view class="flex justify-between items-start mb-2">
              <view class="text-xs font-bold px-2 py-0.5 rounded-md"
                :class="getStepStatus(step, idx).isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ step.day }}
              </view>

              <view v-if="step.productsUsed.length > 0" class="flex space-x-1">
                <template v-for="pid in step.productsUsed" :key="pid">
                  <view v-if="getProductById(pid)"
                    class="w-6 h-6 rounded bg-slate-100 overflow-hidden border border-solid border-slate-200">
                    <image :src="getProductById(pid).image" mode="aspectFill" class="w-full h-full" />
                  </view>
                </template>
              </view>
            </view>

            <text class="block font-bold text-base mb-1"
              :class="getStepStatus(step, idx).isActive ? 'text-emerald-900' : 'text-slate-800'">
              {{ step.title }}
            </text>
            <text class="block text-xs text-slate-500 leading-relaxed mb-4">
              {{ step.description }}
            </text>

            <button v-if="getStepStatus(step, idx).isActive" @click="handleCompleteStep(idx)"
              class="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center m-0">
              <text>完成打卡</text>
              <text class="iconfont icon-lucide-arrow-right text-sm ml-1.5"></text>
            </button>

            <view v-else-if="step.isCompleted"
              class="flex items-center text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
              <text class="iconfont icon-lucide-check-circle-2 text-sm mr-1.5"></text>
              <text>已完成</text>
            </view>

            <view v-else class="flex items-center text-xs text-slate-400 bg-slate-50 p-2 rounded-lg">
              <text class="iconfont icon-lucide-clock text-sm mr-1.5"></text>
              <text>待解锁</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="grid grid-cols-1 gap-4">
        <view v-for="product in treatment.products" :key="product.id"
          class="bg-white rounded-2xl p-4 border border-solid border-slate-100 shadow-sm flex items-center space-x-4">
          <view class="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-solid border-slate-200">
            <image :src="product.image" :alt="product.name" mode="aspectFill" class="w-full h-full" />
          </view>
          <view class="flex-1">
            <text class="block font-bold text-slate-800">{{ product.name }}</text>
            <text class="block text-xs text-slate-500 mt-1">{{ product.description }}</text>
            <view
              class="mt-2 inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg">
              <text class="iconfont icon-lucide-package text-xs mr-1"></text>
              <text>剩余可用: 充足</text>
            </view>
          </view>
        </view>

        <view class="bg-amber-50 border border-solid border-amber-100 rounded-xl p-4 flex items-start space-x-3">
          <text class="iconfont icon-lucide-alert-circle text-xl text-amber-500 shrink-0 mt-0.5"></text>
          <view>
            <text class="block font-bold text-amber-900 text-xs">用药安全提示</text>
            <text class="block text-[10px] text-amber-700/80 mt-1 leading-relaxed">
              请严格按照说明书比例稀释药剂。喷洒时请佩戴手套和口罩，避免接触皮肤。请将药剂存放在儿童和宠物无法触及的地方。
            </text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showConfetti" class="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
      <view
        class="bg-black/70 backdrop-blur-sm text-white px-6 py-4 rounded-2xl animate-bounce-slow flex flex-col items-center">
        <text class="text-3xl mb-2">🎉</text>
        <text class="font-bold">打卡成功！</text>
        <text class="text-xs text-slate-300">离康复又近了一步</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

// Props
// const props = defineProps({
//   treatment: {
//     type: Object,
//     required: true,
//     default: () => ({
//       id: '',
//       bundleName: '',
//       diseaseName: '',
//       startDate: '',
//       totalSteps: 1,
//       currentStepIndex: 0,
//       schedule: [],
//       products: []
//     })
//   }
// });

// Emits
// const emit = defineEmits(['back', 'updateProgress']);


// State
const activeTab = ref('timeline');
const showConfetti = ref(false);
const treatment = reactive({
  id: 'tb-1',
  bundleName: '根腐病急救包',
  description: '针对烂根的一站式解决方案，含修剪、杀菌与促根产品。',
  price: 39.9,
  originalPrice: 55,
  diseaseName: "根腐病",
  currentStepIndex: 0,
  products: [
    { id: 'tp-1', name: '园艺修枝剪', price: 15, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop', description: '不锈钢消毒剪刀' },
    { id: 'tp-2', name: '多菌灵粉剂', price: 9.9, image: 'https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=200&auto=format&fit=crop', description: '50g 强效杀菌' },
    { id: 'tp-3', name: '生根粉', price: 12, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop', description: '快速恢复根系' }
  ],
  schedule: [
    { day: '第1天', title: '修剪与消毒', description: '脱盆洗根，剪掉所有发黑腐烂的根系。将根部浸泡在多菌灵溶液中30分钟。', productsUsed: ['tp-1', 'tp-2'] },
    { day: '第1天', title: '换土重植', description: '晾干根部伤口后，使用全新的透气土壤上盆。', productsUsed: [] },
    { day: '第3天', title: '灌根促长', description: '兑水稀释生根粉，沿盆边缓慢浇灌，促进新根萌发。', productsUsed: ['tp-3'] },
    { day: '第7天', title: '复查状态', description: '观察叶片是否停止发黄，保持土壤微湿，不可积水。', productsUsed: [] }
  ],
  totalSteps: 4,
  startDate: "2025/12/15"
})

const arcbarData = computed(() => ({
  series: [{
    name: "进度",
    data: progressPercent.value / 100, // uCharts 接收 0-1 之间的小数
    color: "#10b981"
  }]
}));

const arcbarOpts = ref({
  title: {
    name: "", // 不显示文字，只显示环
  },
  subtitle: {
    name: ""
  },
  extra: {
    arcbar: {
      type: "circle", // 整圆
      width: 6,       // 圆环宽度
      backgroundColor: "#f1f5f9", // 底色
      startAngle: 1.5, // 调整起始角度 (1.5PI 约等于 12点钟方向)
      endAngle: 0.25,
      radius: 28      // 半径
    }
  }
});
// Computed: Progress
const completedCount = computed(() => {
  return treatment.schedule.filter(s => s.isCompleted).length;
});

const progressPercent = computed(() => {
  if (!treatment.totalSteps) return 0;
  return Math.round((completedCount.value / treatment.totalSteps) * 100);
});

// Computed: SVG Stroke Offset (Circumference ~ 175)
const dashOffset = computed(() => {
  return 175 - (175 * progressPercent.value) / 100;
});

// Methods

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const handleBack = () => {
  uni.navigateBack()
};

const handleCompleteStep = (index) => {
  emit('updateProgress', treatment.id, index);
  if (index === treatment.currentStepIndex) {
    showConfetti.value = true;
    setTimeout(() => {
      showConfetti.value = false;
    }, 2000);
  }
};

const getProductById = (pid) => {
  return treatment.products.find(p => p.id === pid);
};

// Helper: Calculate Step Status
const getStepStatus = (step, idx) => {
  const isActive = idx === treatment.currentStepIndex && !step.isCompleted;
  const isPast = step.isCompleted;
  const isLocked = !isPast && !isActive;
  return { isActive, isPast, isLocked };
};

// Helper: Dynamic Classes for Step Node
const getStepNodeClass = (step, idx) => {
  const { isActive, isPast } = getStepStatus(step, idx);

  if (isPast) {
    return 'bg-emerald-600 border-emerald-100 text-white';
  } else if (isActive) {
    return 'bg-white border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-100 animate-pulse';
  } else {
    return 'bg-slate-100 border-slate-50 text-slate-300';
  }
};
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* Custom Animation for Confetti Bounce */
@keyframes bounceSlow {

  0%,
  100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce-slow {
  animation: bounceSlow 1s infinite;
}
</style>