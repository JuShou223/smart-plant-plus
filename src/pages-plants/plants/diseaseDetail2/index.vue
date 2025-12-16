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
                      <text class="text-[10px] text-slate-500 mt-0.5 leading-relaxed block">{{ step.description
                      }}</text>
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
  const foundData = DISEASES.find(item => item.id === options.id);

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