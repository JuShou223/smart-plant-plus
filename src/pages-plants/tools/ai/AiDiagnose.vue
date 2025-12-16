<template>
  <view class="min-h-screen bg-slate-50 animate-fade-in relative z-50 flex flex-col">
    <view class="flex-1 flex flex-col">

      <view v-if="step === 'upload'" class="flex-1 flex flex-col p-6">
        <view class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <text class="block text-xl font-bold text-slate-800 mb-2">拍摄植物照片</text>
          <text class="block text-sm text-slate-400 mb-6">
            请确保光线充足，将植物病灶部位（如黄叶、斑点）置于画面中心。
          </text>

          <view @click="handleChooseImage"
            class="aspect-[4/3] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all group relative overflow-hidden">
            <image v-if="plant?.image" :src="plant.image" mode="aspectFill"
              class="absolute inset-0 w-full h-full opacity-20 pointer-events-none" />

            <view
              class="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
              <text class="iconfont icon-lucide-camera text-3xl text-emerald-600"></text>
            </view>
            <text class="font-bold text-slate-500 group-hover:text-emerald-600 relative z-10">点击拍照 / 上传</text>
          </view>
        </view>

        <view class="bg-blue-50 rounded-2xl p-4 flex gap-3 border border-blue-100">
          <text class="iconfont icon-lucide-stethoscope text-xl text-blue-600 shrink-0 mt-0.5"></text>
          <view>
            <text class="block font-bold text-blue-900 text-sm">诊断小贴士</text>
            <text class="block text-xs text-blue-700/80 mt-1 leading-relaxed">
              Gemini Pro 视觉模型支持识别 2000+ 种常见植物病虫害。如需更准确结果，请尽量靠近拍摄叶片细节。
            </text>
          </view>
        </view>
      </view>

      <view v-if="step === 'scanning' && image"
        class="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
        <image :src="image" mode="aspectFill" class="absolute inset-0 w-full h-full opacity-60" />

        <view class="absolute inset-0 bg-grid-pattern opacity-30"></view>

        <view class="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] animate-scan">
        </view>

        <view
          class="relative z-20 w-full max-w-xs bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
          <view class="flex justify-center mb-4">
            <text class="iconfont icon-lucide-loader-2 text-3xl text-emerald-500 animate-spin"></text>
          </view>
          <text class="block text-emerald-400 font-mono font-bold text-lg mb-2">{{ scanProgress }}%</text>
          <view class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
            <view class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: scanProgress + '%' }">
            </view>
          </view>
          <text class="text-white/80 text-xs font-mono">{{ scanText }}</text>
        </view>
      </view>

      <view v-if="step === 'result' && result && image" class="flex-1 overflow-y-auto pb-24">

        <view class="relative h-64 w-full bg-slate-900">
          <image :src="image" mode="aspectFill" class="w-full h-full opacity-80" />
          <view class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></view>

          <view class="absolute bottom-0 left-0 right-0 p-6">
            <view class="flex items-end justify-between">
              <view>
                <view
                  class="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase mb-2 shadow-lg">
                  <text class="iconfont icon-lucide-check-circle-2 text-xs"></text>
                  <text>AI Analysis Complete</text>
                </view>
                <text class="block text-2xl font-bold text-white leading-tight">{{ result.title }}</text>
              </view>
              <view class="text-center">
                <text class="block text-3xl font-bold" :class="getColorClass(result.status, 'text', '400')">{{
                  result.score }}</text>
                <text class="text-[10px] text-white/60 font-bold uppercase">健康评分</text>
              </view>
            </view>
          </view>
        </view>

        <view class="px-6 -mt-6 relative z-10 space-y-6">

          <view
            class="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-50 flex items-center justify-between">
            <view class="flex gap-4">
              <view class="text-center">
                <text class="block text-xs text-slate-400 mb-1">置信度</text>
                <text class="font-bold text-slate-800 text-lg">{{ result.confidence }}%</text>
              </view>
              <view class="w-[1px] bg-slate-100 h-10"></view>
              <view class="text-center">
                <text class="block text-xs text-slate-400 mb-1">风险等级</text>
                <text class="font-bold text-lg" :class="getColorClass(result.status, 'text', '600')">
                  {{ result.status === 'healthy' ? '低' : result.status === 'warning' ? '中' : '高' }}
                </text>
              </view>
            </view>
            <view class="w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm"
              :class="getColorClass(result.status, 'bg', '50')">
              <text class="iconfont icon-lucide-activity text-2xl"
                :class="getColorClass(result.status, 'text', '500')"></text>
            </view>
          </view>

          <view v-if="result.symptoms.length > 0">
            <view class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <text class="iconfont icon-lucide-search text-base text-emerald-600"></text>
              <text>检测特征</text>
            </view>
            <view class="flex flex-wrap gap-2">
              <view v-for="(sym, i) in result.symptoms" :key="i"
                class="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                {{ sym }}
              </view>
            </view>
          </view>

          <view v-if="matchedDisease && matchedDisease.bundle"
            class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 relative overflow-hidden group">
            <view class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl transition-colors">
            </view>

            <view class="relative z-10">
              <view class="flex items-center gap-2 mb-3">
                <view class="bg-emerald-600 text-white p-1.5 rounded-lg">
                  <text class="iconfont icon-lucide-package text-base"></text>
                </view>
                <view>
                  <text class="block text-sm font-bold text-emerald-900">AI 处方推荐</text>
                  <text class="block text-[10px] text-emerald-700">匹配到 {{ matchedDisease.name }} 最佳治疗方案</text>
                </view>
              </view>

              <view class="bg-white/60 rounded-xl p-3 border border-white/50 flex gap-3 items-center mb-4">
                <view class="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-100">
                  <image :src="matchedDisease.bundle.products[0].image" mode="aspectFill" class="w-full h-full" />
                </view>
                <view class="flex-1 min-w-0">
                  <text class="block font-bold text-slate-800 text-sm truncate">{{ matchedDisease.bundle.name }}</text>
                  <view class="flex items-center gap-2 mt-1">
                    <text class="text-emerald-600 font-bold">¥{{ matchedDisease.bundle.price }}</text>
                    <text class="text-[10px] text-slate-400 line-through">¥{{ matchedDisease.bundle.originalPrice
                      }}</text>
                  </view>
                  <view class="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                    <text class="iconfont icon-lucide-package text-xs"></text>
                    <text>包含 {{ matchedDisease.bundle.products.length }} 件专业用品</text>
                  </view>
                </view>
              </view>

              <button @click="onStartTreatment(matchedDisease, matchedDisease.bundle)"
                class="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all m-0">
                <text class="iconfont icon-lucide-shopping-bag text-base"></text>
                <text>购买并开始治疗</text>
              </button>
            </view>
          </view>

          <view class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <view class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <text class="iconfont icon-lucide-file-text text-base text-emerald-600"></text>
              <text>详细诊断报告</text>
            </view>
            <text class="block text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-line">
              {{ result.analysis }}
            </text>
          </view>

          <view v-if="!matchedDisease?.bundle && result.status !== 'healthy'">
            <view class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <text class="iconfont icon-lucide-stethoscope text-base text-emerald-600"></text>
              <text>建议处理方案</text>
            </view>
            <view class="space-y-3">
              <view v-for="(stepText, i) in result.treatment" :key="i"
                class="flex gap-3 items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <view
                  class="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {{ i + 1 }}
                </view>
                <text class="text-sm text-slate-700 leading-snug">{{ stepText }}</text>
              </view>
            </view>
          </view>

        </view>

        <view
          class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex gap-3 z-50">
          <button @click="resetDiagnosis"
            class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm m-0">
            <text class="iconfont icon-lucide-refresh-cw text-base"></text>
            <text>重新诊断</text>
          </button>
          <button @click="handleSave" :disabled="isSaved"
            class="flex-[2] py-3 font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-sm m-0"
            :class="isSaved ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'">
            <text class="iconfont text-base"
              :class="isSaved ? 'icon-lucide-check-circle-2' : 'icon-lucide-share-2'"></text>
            <text>{{ isSaved ? '已保存到记录' : '保存报告' }}</text>
          </button>
        </view>

      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
// 假设已存在这些服务和数据
// import { analyzePlantHealth } from '../services/geminiService';
// import { DISEASES } from './DiseaseLibrary';

// Mock Constants (Replace with imports)
const DISEASES = [
  { id: 'd2', name: '红蜘蛛', bundle: { name: '红蜘蛛歼灭套装', price: 28.8, originalPrice: 45, products: [{ image: 'https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=200&auto=format&fit=crop' }] } }
];
const analyzePlantHealth = async (plant) => {
  // Mock API Call
  return new Promise(resolve => setTimeout(() => resolve('根据视觉特征分析，叶片呈现典型的红蜘蛛侵害症状，表现为叶片失绿、有细小黄斑。建议检查叶背是否有红色小虫。'), 2000));
};

const props = defineProps({
  plant: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['back', 'startTreatment', 'saveReport']);

// Safe Area
const safeAreaTop = ref(44); // uni.getSystemInfoSync().safeAreaInsets.top

// State
const step = ref('upload');
const image = ref(null);
const scanProgress = ref(0);
const scanText = ref('初始化视觉引擎...');
const result = ref(null);
const isSaved = ref(false);

let scanInterval = null;

// Methods
const onBack = () => emit('back');
const onStartTreatment = (disease, bundle) => emit('startTreatment', disease, bundle);
const onSaveReport = (record) => emit('saveReport', record);

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      image.value = tempFilePath;

      // In uniapp, we usually work with tempFilePath.
      // If base64 is needed for Gemini API, use uni.getFileSystemManager().readFile

      startAnalysis(tempFilePath);
    }
  });
};

const startAnalysis = async (imgSrc) => {
  step.value = 'scanning';
  scanProgress.value = 0;
  isSaved.value = false;

  // 1. Scanning Animation
  const scanSteps = [
    { p: 20, t: '正在分析叶片纹理...' },
    { p: 45, t: '检测叶绿素分布...' },
    { p: 70, t: '比对病害特征库...' },
    { p: 90, t: '生成诊断报告...' },
  ];

  let currentStep = 0;
  scanInterval = setInterval(() => {
    if (currentStep < scanSteps.length) {
      scanProgress.value = scanSteps[currentStep].p;
      scanText.value = scanSteps[currentStep].t;
      currentStep++;
    }
  }, 800);

  try {
    const aiText = await analyzePlantHealth(
      props.plant || { name: '未知植物', species: '未知', location: '未知' }
    );

    // Simulation Logic
    let matchedId = undefined;
    let mockStatus = 'healthy';

    // Demo Logic: chance to find disease
    const isSickSimulation = true; // Force sick for demo

    if (isSickSimulation) {
      mockStatus = 'warning';
      matchedId = 'd2'; // Demo: Red Spider Mites
    }

    const mockStructuredResult = {
      score: mockStatus === 'healthy' ? 95 : 62,
      status: mockStatus,
      title: mockStatus === 'healthy' ? '植物状态良好' : '检测到红蜘蛛危害',
      confidence: 92,
      symptoms: mockStatus === 'healthy' ? ['叶色翠绿', '无明显斑点'] : ['叶背红点', '叶片失绿', '有丝网'],
      analysis: aiText,
      treatment: mockStatus === 'healthy'
        ? ['继续保持当前养护', '定期清洁叶片']
        : ['建议立即隔离植物', '使用杀螨剂喷洒', '提高环境湿度'],
      matchedDiseaseId: matchedId
    };

    clearInterval(scanInterval);
    scanProgress.value = 100;
    setTimeout(() => {
      result.value = mockStructuredResult;
      step.value = 'result';
    }, 500);

  } catch (e) {
    clearInterval(scanInterval);
    step.value = 'upload';
    uni.showToast({ title: '诊断失败', icon: 'none' });
  }
};

const handleSave = () => {
  if (!result.value || !image.value) return;

  const newRecord = {
    id: `diag-${Date.now()}`,
    date: new Date().toLocaleString(),
    plantName: props.plant?.name || '未命名植物',
    image: image.value,
    ...result.value
  };

  onSaveReport(newRecord);
  isSaved.value = true;
};

const resetDiagnosis = () => {
  image.value = null;
  result.value = null;
  step.value = 'upload';
};

const getColorClass = (status, type, shade) => {
  let color = 'slate';
  if (status === 'healthy') color = 'emerald';
  else if (status === 'warning') color = 'orange';
  else if (status === 'danger') color = 'red';

  return `${type}-${color}-${shade}`;
};

// Computed
const matchedDisease = computed(() => {
  return result.value?.matchedDiseaseId ? DISEASES.find(d => d.id === result.value.matchedDiseaseId) : null;
});

// Cleanup
onUnmounted(() => {
  if (scanInterval) clearInterval(scanInterval);
});

</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* BG Grid Pattern */
.bg-grid-pattern {
  background-image: linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%);
}

/* Animations */
@keyframes scan {
  0% {
    top: 0;
    opacity: 0.5;
  }

  50% {
    top: 100%;
    opacity: 1;
  }

  100% {
    top: 0;
    opacity: 0.5;
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
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
  animation: fadeInUp 0.3s ease-out;
}
</style>