<template>
  <view class="min-h-screen bg-[#FAFAFA] pb-24 relative z-50">
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

// Emits
const emit = defineEmits(['back', 'diagnose', 'startTreatment']);

// Mock Data
const DISEASES = [
  {
    id: 'd1',
    name: '根腐病',
    alias: 'Root Rot',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D2877563340%2C2181624480%26fm%3D253%26app%3D138%26f%3DJPEG%20%281%29.jpeg',
    type: 'fungus',
    severity: 'high',
    symptoms: ['叶片发黄、枯萎', '根部发黑、腐烂', '植物生长停滞', '土壤有霉味'],
    treatment: ['立即停止浇水', '剪除腐烂根系', '更换透气新土', '使用多菌灵灌根'],
    prevention: '控制浇水频率，确保盆底排水良好，避免土壤长期积水。',
    bundle: {
      id: 'tb-1',
      name: '根腐病急救包',
      description: '针对烂根的一站式解决方案，含修剪、杀菌与促根产品。',
      price: 39.9,
      originalPrice: 55,
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
      ]
    }
  },
  {
    id: 'd2',
    name: '红蜘蛛',
    alias: 'Spider Mites',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D1631170119%2C4290503434%26fm%3D3074%26app%3D3074%26f%3DJPEG.jpeg',
    type: 'pest',
    severity: 'medium',
    symptoms: ['叶片出现细小黄斑', '叶背有红色小点', '严重时有丝网', '叶片失去光泽'],
    treatment: ['用高压水枪冲洗叶背', '喷洒螨危或阿维菌素', '增加环境湿度'],
    prevention: '经常向叶面喷雾，保持环境通风湿润，红蜘蛛怕湿。',
    bundle: {
      id: 'tb-2',
      name: '红蜘蛛歼灭套装',
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
  },
  {
    id: 'd3',
    name: '白粉病',
    alias: 'Powdery Mildew',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/088691d963eaa67825172eecc6513dfe.png',
    type: 'fungus',
    severity: 'medium',
    symptoms: ['叶片出现白色粉末状斑点', '叶片卷曲变形', '光合作用受阻'],
    treatment: ['剪除病叶集中销毁', '喷洒代森锰锌或粉锈宁', '使用小苏打水擦拭'],
    prevention: '加强通风，增加光照，避免氮肥过多，叶面不要积水。'
  },
  {
    id: 'd4',
    name: '叶焦/晒伤',
    alias: 'Leaf Scorch',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1627474480590-40c23de6b0b9.png',
    type: 'environment',
    severity: 'low',
    symptoms: ['叶尖或叶缘干枯发黄', '叶片出现褐色焦斑', '斑点边界清晰'],
    treatment: ['移至阴凉通风处', '剪去严重焦枯部分', '适量喷水降温'],
    prevention: '夏季避免正午阳光直射，喜阴植物严格遮阴。'
  },
  {
    id: 'd5',
    name: '蚜虫',
    alias: 'Aphids',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/u%3D3650439281%2C352198504%26fm%3D253%26app%3D138%26f%3DJPEG.jpeg',
    type: 'pest',
    severity: 'medium',
    symptoms: ['嫩叶卷曲、畸形', '叶面有粘液（蜜露）', '可能诱发煤污病'],
    treatment: ['数量少可人工刷除', '喷洒吡虫啉或护花神', '悬挂黄板诱杀'],
    prevention: '保持通风，及时清除周边杂草，定期检查嫩梢。'
  },
  {
    id: 'd6',
    name: '缺铁性黄叶',
    alias: 'Iron Deficiency',
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/5290577f163670964e40f315db36d0dd%20%281%29.png',
    type: 'environment',
    severity: 'low',
    symptoms: ['新叶叶肉发黄', '叶脉保持绿色', '严重时全叶发白'],
    treatment: ['使用硫酸亚铁溶液灌根', '喷施螯合铁叶面肥', '改善土壤酸碱度'],
    prevention: '喜酸性植物定期施用酸性肥料（如硫酸亚铁）。'
  }
];

// State
const activeTab = ref('all');
const searchQuery = ref('');
const selectedDisease = ref(null);
const isProcessingBuy = ref(false);

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pest', label: '虫害' },
  { id: 'fungus', label: '病害' },
  { id: 'environment', label: '环境' },
];

// Computed
const filteredDiseases = computed(() => {
  return DISEASES.filter(d => {
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
const handleDiagnose = () => emit('diagnose');

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