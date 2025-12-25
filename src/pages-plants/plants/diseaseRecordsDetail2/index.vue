<template>
  <view class="container">

    <view v-if="result" class="flex-1 overflow-y-auto pb-24">

      <view class="relative h-64 w-full bg-slate-900">
        <image :src="result.image" mode="aspectFill" class="w-full h-full opacity-80" />
        <view class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></view>

        <view class="absolute bottom-0 left-0 right-0 p-6">
          <view class="flex items-end justify-between mb-2">
            <view>
              <view
                class="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase mb-2 shadow-lg">
                <text class="iconfont icon-lucide-circle-check text-xs leading-none"></text>
                <text>AI 分析完成</text>
              </view>
              <view class="flex align-items justify-center">
                <text class="block text-2xl font-bold text-white leading-tight">{{ result.title }}</text>
                <view v-if="matchedDisease.id" @click="handleNavToDisease"
                  class="ml-2 font-bold text-emerald-600 bg-white/60 rounded-lg hover:bg-white transition-colors flex items-center leading-none px-2">
                  <text class="text-xs leading-none">查看百科</text>
                  <text class="text-xs leading-none iconfont icon-lucide-arrow-right"></text>
                  <!-- <ArrowRight className="w-3 h-3" /> -->
                </view>
              </view>
            </view>
            <view class="text-center">
              <text class="block text-3xl font-bold leading-none"
                :class="getColorClass(result.status, 'text', '400')">{{
                  result.score }}</text>
              <text class="text-[10px] text-white/60 font-bold uppercase">健康评分</text>
            </view>
          </view>
        </view>
      </view>

      <view class="px-6 -mt-6 relative z-10 space-y-6">

        <view
          class="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-solid border-slate-50 flex items-center justify-between">
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
              class="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-solid border-slate-200">
              {{ sym }}
            </view>
          </view>
        </view>

        <view v-if="matchedDisease && matchedDisease.bundle"
          class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-solid border-emerald-100 relative overflow-hidden group">
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

            <view class="bg-white/60 rounded-xl p-3 border border-solid border-white/50 flex gap-3 items-center mb-4">
              <view class="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-solid border-slate-100">
                <image :src="matchedDisease.bundle.image" mode="aspectFill" class="w-full h-full" />
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

        <!-- <view class="bg-slate-50 rounded-2xl p-5 border border-solid border-slate-100">
            <view class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <text class="iconfont icon-lucide-file-text text-base text-emerald-600"></text>
              <text>详细诊断报告</text>
            </view>
            <text class="block text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-line">
              {{ result.analysis }}
            </text>
          </view> -->

        <view v-if="!matchedDisease || (!matchedDisease.bundle && result.status !== 'healthy')">
          <view class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <text class="iconfont icon-lucide-stethoscope text-base text-emerald-600"></text>
            <text>建议处理方案</text>
          </view>
          <view class="space-y-3">
            <view v-for="(stepText, i) in result.treatment" :key="i"
              class="flex gap-3 items-start bg-white p-4 rounded-xl border border-solid border-slate-100 shadow-sm">
              <view
                class="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {{ i + 1 }}
              </view>
              <text class="text-sm text-slate-700 leading-snug">{{ stepText }}</text>
            </view>
          </view>
        </view>

      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getDiseaseRecord } from '@/apis/modules/disease';
import { onLoad } from '@dcloudio/uni-app';
import { usePlantDiseases } from '@/hooks/useDisease'
import { useTreatmentPlan } from '@/hooks/useTreatmentPlan'
import bus from '@/common/bus.js';

// 定义 Props
// const props = defineProps({
//   records: {
//     type: Array,
//     default: () => []
//   }
// });
const { findDiseaseById, findDiseaseByName, searchDiseases } = usePlantDiseases()
const { createPlan } = useTreatmentPlan()

const records = [
  {
    id: 'diag-001',
    date: '2024-03-20 14:30',
    plantName: '龟背竹',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop',
    score: 92,
    status: 'healthy',
    title: '植物状态良好',
    confidence: 98,
    symptoms: ['叶色翠绿', '生长旺盛', '无病斑'],
    analysis: '植物整体生长状况非常健康，叶片颜色深绿且有光泽，未发现明显的病虫害迹象。新叶展开正常。建议继续保持目前的养护方式。',
    treatment: ['定期清理叶片灰尘', '保持土壤湿润'],
  },
  {
    id: 'diag-002',
    date: '2024-03-15 09:15',
    plantName: '琴叶榕',
    image: 'https://images.unsplash.com/photo-1598544485038-782813589c3f?q=80&w=800&auto=format&fit=crop',
    score: 75,
    status: 'warning',
    title: '疑似轻微缺水',
    confidence: 85,
    symptoms: ['叶片下垂', '叶缘微卷'],
    analysis: '检测到叶片呈现轻微萎蔫状态，且叶缘有向内卷曲的趋势。结合近期干燥的天气，推测为土壤水分不足导致的暂时性缺水。',
    treatment: ['立即浇透水一次', '向叶面喷雾增加湿度', '避免强光直射'],
  },
  {
    id: 'diag-003',
    date: '2024-02-28 16:45',
    plantName: '月季',
    image: 'https://images.unsplash.com/photo-1563214552-6d4590c7662c?q=80&w=800&auto=format&fit=crop',
    score: 45,
    status: 'danger',
    title: '检测到白粉病',
    confidence: 94,
    symptoms: ['白色粉末斑点', '叶片畸形'],
    analysis: '叶片表面覆盖有明显的白色粉状物，符合白粉病的典型特征。这种真菌病害会阻碍光合作用，严重时导致落叶。',
    treatment: ['修剪严重病叶', '喷洒代森锰锌溶液', '加强通风'],
    matchedDiseaseId: 'd3'
  }
];

// 定义 Events
const emit = defineEmits(['back']);

// 状态
const result = ref(null);
const matchedDisease = ref(null)

// 返回上一级
const onBack = () => {
  emit('back');
};

const getColorClass = (status, type, shade) => {
  let color = 'slate';
  if (status === 'healthy') color = 'emerald';
  else if (status === 'warning') color = 'orange';
  else if (status === 'danger') color = 'red';
  return `${type}-${color}-${shade}`;
};

/**
 * 获取状态对应的颜色样式类
 * @param {String} status - healthy | warning | danger
 * @param {String} type - 'text' | 'bg' | 'bg-light'
 */
const getStatusColor = (status, type) => {
  let color = 'slate';
  switch (status) {
    case 'healthy': color = 'emerald'; break;
    case 'warning': color = 'orange'; break;
    case 'danger': color = 'red'; break;
    default: color = 'slate';
  }

  // Tailwind 动态 Class 映射
  // 为了确保 Uniapp/小程序编译器能正确提取 class，最好不要过度拼接字符串，
  // 但如果你配置了 weapp-tailwindcss-webpack-plugin，简单的拼接通常也支持。
  // 下面这种写法在 Vue 中是有效的：

  if (type === 'text') return `text-${color}-600`; // e.g. text-emerald-600
  if (type === 'bg-light') return `bg-${color}-50`; // e.g. bg-emerald-50

  return '';
};

const loadDiseaseDetail = async (id) => {
  const response = await getDiseaseRecord(id)
  if (response.code === 200) {
    let mockStatus = response.data.diseaseType === '无病害' ? 'healthy' : 'warning';
    const healthyScore = Math.floor(Math.random() * 11) + 90;
    const warningScore = Math.floor(Math.random() * 11) + 50;
    const confidence = Math.floor(Math.random() * 11) + 90;
    const mockStructuredResult = {
      image: response.data.diseaseImageUrl,
      score: mockStatus === 'healthy' ? healthyScore : warningScore,
      status: mockStatus,
      title: mockStatus === 'healthy' ? '植物状态良好' : response.data.diseaseType,
      confidence: confidence,
      symptoms: mockStatus === 'healthy' ? ['叶色翠绿', '无明显斑点'] : [response.data.symptoms],
      analysis: '',
      treatment: mockStatus === 'healthy'
        ? ['继续保持当前养护', '定期清洁叶片']
        : response.data.treatmentPlan.split(/(?=\d+\.)/)
          .filter(item => item.trim().length > 0)
          .map(item => item.replace(/^\d+\.\s*/, '').trim()),
      matchedDiseaseId: ''
    };
    matchedDisease.value = matchBestDisease(response.data)
    result.value = mockStructuredResult
    console.log('mockStructuredResult', mockStructuredResult)
  }
}

const matchBestDisease = (diagnosisResult) => {
  // if (diseases.value.length === 0) loadDiseases();
  if (!diagnosisResult) return null;

  const { diseaseType, symptoms } = diagnosisResult;
  const searchString = (symptoms || "").toLowerCase();

  // 1. 尝试直接名称匹配 (如果 API 返回了精准名称，如 "红蜘蛛")
  const exactMatch = findDiseaseByName(diseaseType);
  if (exactMatch) return exactMatch;

  // 2. 关键词模糊匹配策略 (处理 "黄化病" 这种大类)
  // 定义关键词到具体 ID 的映射规则
  // 优先级：先匹配具体的化学元素缺乏，再匹配通用症状
  const keywordMap = [
    { keywords: ["缺铁", "失绿", "新叶黄", "铁"], targetId: "d8" }, // 缺铁症 (优先推荐带套装的 d8)
    { keywords: ["缺氮", "生长缓慢", "老叶黄", "黄化", "氮"], targetId: "d7" }, // 缺氮症
    { keywords: ["缺镁", "叶脉绿", "镁"], targetId: "d9" }, // 缺镁症
    { keywords: ["红蜘蛛", "螨"], targetId: "d2" }, // 红蜘蛛
    { keywords: ["烂根", "腐烂", "水多", "根腐"], targetId: "d1" }, // 根腐病
    { keywords: ["晒伤", "焦枯"], targetId: "d4" }, // 叶焦
    { keywords: ["白粉", "白斑"], targetId: "d3" }, // 白粉病
  ];

  // 遍历规则，如果在 API 返回的症状描述中找到了关键词，直接返回对应的 ID
  for (const rule of keywordMap) {
    const hasMatch = rule.keywords.some((keyword) =>
      searchString.includes(keyword)
    );
    if (hasMatch) {
      return findDiseaseById(rule.targetId);
    }
  }

  // 3. 兜底策略：全文搜索
  // 如果没有命中特定规则，尝试用 diseaseType 去本地数据库进行模糊搜索，取第一个结果
  const fallbackResults = searchDiseases(diseaseType);
  if (fallbackResults && fallbackResults.length > 0) {
    return fallbackResults[0];
  }

  return null;
};

const handleNavToDisease = () => {
  uni.navigateTo({ url: '/pages-plants/plants/diseaseDetail2/index?id=' + matchedDisease.value.id });
}

const onStartTreatment = () => {
  createPlan(matchedDisease.value, matchedDisease.value.bundle)
  bus.emit('refreshTreatmentList');
};

onLoad((options) => {
  if (options.id) {
    loadDiseaseDetail(options.id)
  }
})

</script>

<style scoped>
/* 确保 Iconfont 正常显示 (假设你全局已经引入了字体文件，这里只是辅助类) */
.iconfont {
  display: inline-block;
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
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