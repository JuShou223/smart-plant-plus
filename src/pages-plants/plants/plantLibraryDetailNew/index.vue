<template>
  <view class="min-h-screen bg-white pb-24 relative z-50">
    <!-- #ifdef MP-WEIXIN -->
    <up-navbar title="" bgColor="transparent" leftIcon="">
      <template #left>
        <hws-header>
          <view class="w-full box-border left-0 pr-4 flex justify-between items-center z-10">
            <button @click="handleBack"
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
              <text class="iconfont icon-lucide-chevron-left text-2xl"></text>
            </button>
            <view class="flex gap-3">
              <button @click="toggleFavorite"
                class="w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all active:scale-95 m-0 p-0 leading-none"
                :class="isFavorite ? 'bg-white text-rose-500' : 'bg-white/20 text-white hover:bg-white hover:text-rose-500'">
                <text class="iconfont icon-lucide-heart text-xl"></text>
              </button>
              <button
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
                <text class="iconfont icon-lucide-share-2 text-xl"></text>
              </button>
            </view>
          </view>
        </hws-header>
      </template>
    </up-navbar>
    <!-- #endif -->
    <view class="relative h-[50vh] w-full">
      <image :src="plant.image" :alt="plant.name" mode="aspectFill" class="w-full h-full" />
      <view class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white pointer-events-none"></view>

      <!-- #ifndef MP-WEIXIN -->
      <hws-header absolute>
        <view class="w-full box-border left-0 p-4 flex justify-between items-center z-10">
          <button @click="handleBack"
            class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
            <text class="iconfont icon-lucide-chevron-left text-2xl"></text>
          </button>
          <view class="flex gap-3">
            <button @click="toggleFavorite"
              class="w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all active:scale-95 m-0 p-0 leading-none"
              :class="isFavorite ? 'bg-white text-rose-500' : 'bg-white/20 text-white hover:bg-white hover:text-rose-500'">
              <text class="iconfont icon-lucide-heart text-xl"></text>
            </button>
            <button
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
              <text class="iconfont icon-lucide-share-2 text-xl"></text>
            </button>
          </view>
        </view>
      </hws-header>
      <!-- #endif -->

    </view>

    <view class="max-w-3xl mx-auto px-6 -mt-12 relative">

      <view class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 mb-8 border border-slate-50">
        <view class="flex justify-between items-start mb-2">
          <view>
            <text class="block text-2xl font-bold text-slate-900">{{ plant.name }}</text>
            <text class="block text-sm text-slate-400 italic mt-1">{{ plant.scientificName }}</text>
          </view>
          <view class="flex flex-col items-end">
            <text class="text-2xl font-bold text-emerald-600">¥{{ plant.price }}</text>
            <view class="flex items-center text-amber-400 text-xs font-bold mt-1">
              <text class="iconfont icon-lucide-star text-xs mr-1"></text>
              <text>{{ plant.rating }}</text>
              <text class="text-slate-300 ml-1 font-normal">({{ plant.sales }}+ 已售)</text>
            </view>
          </view>
        </view>

        <view class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          <view v-for="tag in plant.tags" :key="tag" class="px-2.5 py-1 bg-slate-100 rounded-lg">
            <text class="text-slate-600 text-xs font-medium">#{{ tag }}</text>
          </view>
        </view>
      </view>

      <view class="mb-8">
        <text class="block text-sm font-bold text-slate-900 mb-3">植物故事</text>
        <text class="block text-slate-600 text-sm leading-7 text-justify">
          {{ plant.description }}
        </text>
        <view v-if="plant.recommendReason" class="mt-4 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
          <text class="text-sm font-medium text-emerald-700 block">
            ✨ 推荐理由：{{ plant.recommendReason }}
          </text>
        </view>
      </view>


      <view v-if="activeFeatures.length > 0" class="mb-8">
        <view class="flex items-center mb-4 gap-2">
          <text class="iconfont icon-lucide-sparkles text-emerald-500 text-base"></text>
          <text class="text-sm font-bold text-slate-900">环境匹配度</text>
        </view>
        <view class="grid grid-cols-2 gap-3">
          <view v-for="(feature, idx) in activeFeatures" :key="idx"
            class="flex items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
            <view
              class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm mr-3 shrink-0">
              <text class="iconfont text-base" :class="feature.iconClass"></text>
            </view>
            <text class="text-sm font-medium text-emerald-900">{{ feature.label }}</text>
            <view class="ml-auto">
              <text class="iconfont icon-lucide-check-circle-2 text-emerald-500 text-base"></text>
            </view>
          </view>
        </view>
      </view>

      <view class="mb-8">
        <view class="text-sm font-bold text-slate-900 mb-4 flex items-center">
          <text class="iconfont icon-lucide-book-open text-emerald-500 mr-2 text-base"></text>
          <text>养护指南</text>
        </view>

        <view class="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <view class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
            <view class="bg-blue-100 p-2 rounded-lg shrink-0 flex items-center justify-center">
              <text class="iconfont icon-lucide-droplets text-blue-600"></text>
            </view>
            <view class="flex-1">
              <view class="font-bold text-slate-800 text-sm mb-1">水分管理</view>
              <text class="text-xs text-slate-600 leading-relaxed block">
                {{ plant.careTips.water || '遵循“见干见湿”原则，表土干透后再浇透水。注意避免盆内积水。' }}
              </text>
            </view>
          </view>

          <view class="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
            <view class="bg-amber-100 p-2 rounded-lg shrink-0 flex items-center justify-center">
              <text class="iconfont icon-lucide-sun text-amber-600"></text>
            </view>
            <view class="flex-1">
              <view class="font-bold text-slate-800 text-sm mb-1">光照条件</view>
              <text class="text-xs text-slate-600 leading-relaxed block">
                {{ plant.careTips.light || '置于明亮散射光处，避免夏季烈日暴晒，冬季可接受全日照。' }}
              </text>
            </view>
          </view>

          <view class="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
            <view class="bg-orange-100 p-2 rounded-lg shrink-0 flex items-center justify-center">
              <text class="iconfont icon-lucide-thermometer text-orange-600"></text>
            </view>
            <view class="flex-1">
              <view class="font-bold text-slate-800 text-sm mb-1">温度控制</view>
              <text class="text-xs text-slate-600 leading-relaxed block">
                {{ plant.careTips.temperature || '适宜生长温度为18-28℃，冬季需保持在10℃以上以免冻伤。' }}
              </text>
            </view>
          </view>

          <view class="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <view class="bg-emerald-100 p-2 rounded-lg shrink-0 flex items-center justify-center">
              <text class="iconfont icon-lucide-sprout text-emerald-600"></text>
            </view>
            <view class="flex-1">
              <view class="font-bold text-slate-800 text-sm mb-1">土壤与施肥</view>
              <text class="text-xs text-slate-600 leading-relaxed block">
                {{ plant.careTips.soil || '建议使用疏松透气的营养土。生长季每月施一次稀薄液肥。' }}
              </text>
            </view>
          </view>

        </view>
      </view>

      <view class="mb-8">
        <text class="block text-sm font-bold text-slate-900 mb-4">养护难度与环境需求</text>
        <view class="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">

          <view class="flex items-center justify-between mb-2">
            <text class="text-xs font-bold text-slate-500 uppercase tracking-wider">上手难度</text>
            <view class="px-2 py-0.5 rounded" :class="plant.difficulty === 'easy' ? 'bg-emerald-100' : 'bg-orange-100'">
              <text class="text-xs font-bold"
                :class="plant.difficulty === 'easy' ? 'text-emerald-700' : 'text-orange-700'">
                {{ plant.difficulty === 'easy' ? '新手友好' : plant.difficulty === 'medium' ? '需要经验' : '专家级' }}
              </text>
            </view>
          </view>

          <view>
            <view class="flex justify-between text-xs mb-1.5">
              <view class="flex items-center text-slate-600 gap-1.5">
                <text class="iconfont icon-lucide-sun text-sm"></text>
                <text>光照强度</text>
              </view>
              <text class="font-bold text-slate-800">
                {{ plant.requirements ? `${plant.requirements.light.min} - ${plant.requirements.light.max} Lux` :
                  (metrics.sun > 70 ? '喜阳' : '耐阴') }}
              </text>
            </view>
            <view class="h-2 bg-slate-200 rounded-full overflow-hidden">
              <view class="h-full bg-amber-400 rounded-full" :style="{ width: metrics.sun + '%' }"></view>
            </view>
          </view>

          <view>
            <view class="flex justify-between text-xs mb-1.5">
              <view class="flex items-center text-slate-600 gap-1.5">
                <text class="iconfont icon-lucide-droplets text-sm"></text>
                <text>适宜土壤湿度</text>
              </view>
              <text class="font-bold text-slate-800">
                {{ plant.requirements ?
                  `${plant.requirements.soilMoisture.min}% - ${plant.requirements.soilMoisture.max}%`
                  : (metrics.water > 70 ? '保持湿润' :
                    '干透浇透')
                }}
              </text>
            </view>
            <view class="h-2 bg-slate-200 rounded-full overflow-hidden">
              <view class="h-full bg-blue-400 rounded-full" :style="{ width: metrics.water + '%' }"></view>
            </view>
          </view>

          <view v-if="plant.requirements && plant.requirements.humidity">
            <view class="flex justify-between text-xs mb-1.5">
              <view class="flex items-center text-slate-600 gap-1.5">
                <text class="iconfont icon-lucide-cloud-rain text-sm"></text>
                <text>适宜空气湿度</text>
              </view>
              <text class="font-bold text-slate-800">
                {{ plant.requirements.humidity.min }}% - {{ plant.requirements.humidity.max }}%
              </text>
            </view>
            <view class="h-2 bg-slate-200 rounded-full overflow-hidden">
              <view class="h-full bg-sky-300 rounded-full"
                :style="{ width: ((plant.requirements.humidity.min + plant.requirements.humidity.max) / 2) + '%' }">
              </view>
            </view>
          </view>

          <view>
            <view class="flex justify-between text-xs mb-1.5">
              <view class="flex items-center text-slate-600 gap-1.5">
                <text class="iconfont icon-lucide-thermometer text-sm"></text>
                <text>适宜温度</text>
              </view>
              <text class="font-bold text-slate-800">
                {{ plant.requirements ?
                  `${plant.requirements.temperature.min}°C - ${plant.requirements.temperature.max}°C`
                  : '18°C - 28°C' }}
              </text>
            </view>

            <view class="h-2 bg-slate-200 rounded-full overflow-hidden relative">
              <template v-if="plant.requirements">
                <view class="absolute top-0 bottom-0 bg-emerald-400/30" :style="{
                  left: (plant.requirements.temperature.min / 40) * 100 + '%',
                  width: ((plant.requirements.temperature.max - plant.requirements.temperature.min) / 40) * 100 + '%'
                }"></view>
                <view class="absolute top-0 bottom-0 w-1 bg-slate-900 h-full" style="left: 60%"></view>
              </template>

              <template v-else>
                <view class="absolute top-0 bottom-0 bg-emerald-400/30 w-[40%] left-[30%]"></view>
                <view class="absolute top-0 bottom-0 w-1 bg-slate-900 h-full left-[60%]"></view>
              </template>
            </view>
          </view>

          <view
            class="pt-2 flex items-start gap-2 text-[10px] text-slate-500 bg-white p-3 rounded-lg border border-slate-100">
            <text class="iconfont icon-lucide-alert-triangle text-xs text-orange-400 shrink-0 mt-0.5"></text>
            <text class="leading-relaxed">注意：数值为植物生长的理想区间。智能传感器连接后，APP将自动监测并根据此标准提醒您。</text>
          </view>

        </view>
      </view>


      <view
        class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 flex items-center justify-between border border-indigo-100 mb-8">
        <view class="flex items-center gap-3">
          <view class="bg-white p-2 rounded-full shadow-sm">
            <text class="iconfont icon-lucide-message-circle-question-mark text-2xl text-indigo-500"></text>
          </view>
          <view>
            <text class="block text-sm font-bold text-indigo-900">不确定是否适合？</text>
            <text class="block text-xs text-indigo-600/80 mt-0.5">问问 AI 园艺师您的环境是否匹配</text>
          </view>
        </view>
        <button @click="handleOpenAI"
          class="px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-50 transition-colors m-0">
          咨询 AI
        </button>
      </view>

    </view>

    <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 shadow-lg z-50">
      <view class="max-w-3xl mx-auto flex items-center gap-4">
        <view class="flex flex-col">
          <text class="text-xs text-slate-400 font-medium">总价</text>
          <text class="text-2xl font-bold text-emerald-600 leading-none">¥{{ plant.price }}</text>
        </view>
        <view class="flex-1 flex gap-3 justify-end">
          <button @click="handleAddPlant"
            class="flex-1 bg-slate-100 text-slate-900 font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-slate-200 transition-colors m-0 flex items-center justify-center leading-none">
            加入花园
          </button>
          <button
            class="flex-[2] bg-emerald-600 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 m-0 leading-none">
            <text class="iconfont icon-lucide-shopping-bag text-base"></text>
            立即购买
          </button>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { usePlantLibrary, SCENE_CONFIGS } from '@/hooks/usePlantLibrary'

// 响应式植物数据
// const plant = reactive({ ...defaultPlant });

// 其他状态
const isFavorite = ref(false);
// const safeAreaTop = ref(44);
const loading = ref(true); // 加载状态
const error = ref(''); // 错误信息
const { library, loadLibrary } = usePlantLibrary()
const plantId = ref('')

const plant = computed(() => {
  const foundPlant = library.value.find(item => item.id === plantId.value);

  return foundPlant
})

// 定义 Emits
const emit = defineEmits(['back', 'openAI']);

// 在 onLoad 中获取路由参数并设置植物数据
onLoad(async (options) => {
  console.log('页面参数:', options);

  // 从路由参数获取 id
  plantId.value = options.id || options.plantId || '';

  if (!plantId) {
    error.value = '未找到植物ID';
    loading.value = false;
    return;
  }

  loadLibrary()

  // 从 MOCK_PRODUCTS 中查找对应的植物
  // const foundPlant = MOCK_PRODUCTS.find(item => item.id === plantId);

  // if (foundPlant) {
  //   // 更新响应式数据
  //   Object.assign(plant, foundPlant);

  //   // 可以在这里设置页面标题
  //   uni.setNavigationBarTitle({
  //     title: plant.name
  //   });

  //   // 模拟加载延迟
  //   setTimeout(() => {
  //     loading.value = false;
  //   }, 500);
  // } else {
  //   error.value = '未找到对应的植物信息';
  //   loading.value = false;

  //   // 设置为默认植物
  //   Object.assign(plant, {
  //     ...defaultPlant,
  //     id: plantId,
  //     name: `植物 ${plantId}`
  //   });
  // }

  // console.log('当前植物数据:', plant);
});

// 方法
const handleBack = () => {
  uni.navigateBack();
};

const handleOpenAI = () => {
  // 调用AI分析功能
  uni.navigateTo({
    url: `/pages/ai-analysis/ai-analysis?plantId=${plant.id}`
  });
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;

  // 可以在这里调用API保存收藏状态
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'success'
  });
};

// 计算属性：养护数值
const metrics = computed(() => {
  console.log('plant', plant)
  const { tags, difficulty } = plant.value;
  const isSucculent = tags.includes('多肉') || tags.includes('耐旱');
  const isTropical = tags.includes('雨林') || tags.includes('需保湿') || tags.includes('耐阴');

  return {
    sun: isSucculent ? 90 : (isTropical ? 30 : 60),
    water: isSucculent ? 20 : (isTropical ? 80 : 50),
    temp: isTropical ? 80 : 50,
    hardiness: difficulty === 'easy' ? 90 : (difficulty === 'medium' ? 60 : 30)
  };
});

// 计算属性：特性标签
const activeFeatures = computed(() => {
  console.log('plant', plant.value)
  const { tags, difficulty } = plant.value;
  const allFeatures = [
    // 对应 Wind
    { iconClass: 'icon-lucide-wind', label: '净化空气', active: tags.some(t => t.includes('净化')) },
    // 对应 Cat
    { iconClass: 'icon-lucide-cat', label: '宠物友好', active: tags.includes('宠物安全') },
    // 对应 ShieldCheck
    { iconClass: 'icon-lucide-shield-check', label: '新手友好', active: difficulty === 'easy' },
    // 对应 Leaf
    { iconClass: 'icon-lucide-leaf', label: '耐阴植物', active: tags.includes('耐阴') },
  ];
  return allFeatures.filter(f => f.active);
});

// 计算属性：格式化价格
const formattedPrice = computed(() => {
  return `¥${plant.price}`;
});

// 计算属性：格式化评分
const formattedRating = computed(() => {
  return plant.rating.toFixed(1);
});

// 计算属性：格式化销量
const formattedSales = computed(() => {
  if (plant.sales >= 10000) {
    return `${(plant.sales / 10000).toFixed(1)}万`;
  }
  return plant.sales.toString();
});

// 添加到购物车
const addToCart = () => {
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success'
  });

  // 这里可以调用购物车API
  console.log('添加商品到购物车:', plant);
};

// 立即购买
const buyNow = () => {
  uni.navigateTo({
    url: `/pages/order/confirm?plantId=${plant.id}&quantity=1`
  });
};

// 分享功能
const sharePlant = () => {
  uni.share({
    title: `${plant.name} - 推荐给你`,
    path: `/pages/plant-detail/plant-detail?id=${plant.id}`,
    imageUrl: plant.image,
    success: () => {
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      });
    }
  });
};

const handleAddPlant = () => {
  uni.navigateTo({
    url: '/pages-plants/plants/addPlants2/index?plantId=' + plantId.value
  })
}
</script>

<style scoped></style>