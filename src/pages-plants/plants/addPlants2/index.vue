<template>
  <view class="min-h-screen bg-white animate-fade-in relative z-50">

    <view class="p-6 pb-24">

      <view v-if="step === 1" class="flex flex-col items-center justify-center h-[70vh] space-y-8">
        <view class="relative w-64 h-64">
          <view v-if="image" class="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative">
            <image :src="image" mode="aspectFill" class="w-full h-full" />

            <view v-if="isScanning" class="absolute inset-0 bg-emerald-500/20 z-10 pointer-events-none">
              <view
                class="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-scan">
              </view>
              <view class="absolute inset-0 flex items-center justify-center">
                <view
                  class="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                  <text class="iconfont icon-lucide-loader-2 text-sm animate-spin"></text>
                  <text>AI 正在识别品种...</text>
                </view>
              </view>
            </view>
          </view>

          <view v-else @click="handleChooseImage"
            class="w-full h-full rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all cursor-pointer group">
            <view
              class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <text class="iconfont icon-lucide-camera text-3xl text-slate-400 group-hover:text-emerald-500"></text>
            </view>
            <text class="font-bold text-slate-500 group-hover:text-emerald-600">拍照或上传图片</text>
            <text class="text-xs text-slate-400 mt-2">支持 AI 自动识别</text>
          </view>
        </view>

        <view v-if="!isScanning && !image" class="text-center space-y-4 w-full max-w-xs">
          <text class="text-sm text-slate-400 block">
            拍摄清晰的植物叶片或整体照片，<br />我们将自动为您匹配养护方案。
          </text>
        </view>
      </view>

      <view v-if="step === 2" class="space-y-6 animate-fade-in-up">
        <view class="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-solid border-slate-100">
          <view class="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
            <image :src="image" mode="aspectFill" class="w-full h-full" />
          </view>
          <view>
            <view class="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
              <text class="iconfont icon-lucide-scan-line text-sm"></text>
              <text>AI 识别完成</text>
            </view>
            <text class="text-xs text-slate-400 block">已根据图像特征自动匹配植物类型</text>
            <text v-if="formData.species" class="text-xs text-slate-600 font-bold mt-1">
              识别为: {{ formData.species }}
            </text>
          </view>
        </view>

        <view class="space-y-4">
          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">植物昵称</text>
            <input type="text" v-model="formData.name"
              class="w-full box-border bg-slate-50 border border-solid border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium h-12"
              placeholder="例如：客厅的大龟背" />
          </view>

          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">品种 (AI 建议)</text>
            <input type="text" v-model="formData.species"
              class="w-full box-border bg-slate-50 border border-solid border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all h-12"
              placeholder="植物学名" />
          </view>

          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">摆放位置</text>
            <view class="flex flex-wrap">
              <view v-for="loc in LOCATIONS" :key="loc" @click="formData.location = loc"
                class="px-4 py-2 rounded-lg text-xs font-bold border border-solid transition-all mb-2 mr-2" :class="formData.location === loc
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-400'">
                {{ loc }}
              </view>
            </view>
          </view>

          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">植物类型</text>
            <view class="grid grid-cols-1 gap-3">
              <view v-for="type in PLANT_TYPES" :key="type.id" @click="formData.type = type.id"
                class="flex items-center p-3 rounded-xl border border-solid transition-all text-left" :class="formData.type === type.id
                  ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-emerald-300'">
                <view class="p-2 rounded-lg mr-3 shrink-0"
                  :class="formData.type === type.id ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'">
                  <text class="iconfont text-xl" :class="type.iconClass"></text>
                </view>
                <view class="flex-1">
                  <text class="block text-sm font-bold"
                    :class="formData.type === type.id ? 'text-emerald-900' : 'text-slate-700'">
                    {{ type.label }}
                  </text>
                  <text class="text-[10px] text-slate-400 block">自动匹配最佳养护方案</text>
                </view>
                <text v-if="formData.type === type.id"
                  class="iconfont icon-lucide-check-circle-2 text-xl text-emerald-500 ml-auto"></text>
              </view>
            </view>
          </view>
        </view>

        <button @click="handleSave"
          class="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] mt-8 flex items-center justify-center">
          确认添加
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { h5ImageToBase64, appImageToBase64, mpImageToBase64 } from '@/common/image2Base64'
// ---------------- 配置区域 ----------------
// 注意：在实际项目中，ACCESS_TOKEN 应该从后端获取，不建议直接硬编码在前端
const ACCESS_TOKEN = '24.045d00c4dfeb7948774225591d4af331.2592000.1768372626.282335-120944777';

const emit = defineEmits(['back', 'save']);

const PLANT_TYPES = [
  {
    id: 'foliage',
    label: '观叶植物',
    iconClass: 'icon-lucide-leaf',
    reqs: { soilMoisture: { min: 40, max: 70 }, light: { min: 800, max: 2000 }, temperature: { min: 18, max: 30 }, humidity: { min: 50, max: 70 } }
  },
  {
    id: 'succulent',
    label: '多肉/仙人掌',
    iconClass: 'icon-lucide-sprout',
    reqs: { soilMoisture: { min: 10, max: 30 }, light: { min: 2000, max: 5000 }, temperature: { min: 15, max: 32 }, humidity: { min: 20, max: 40 } }
  },
  {
    id: 'flower',
    label: '开花植物',
    iconClass: 'icon-lucide-sprout',
    reqs: { soilMoisture: { min: 50, max: 80 }, light: { min: 1500, max: 4000 }, temperature: { min: 15, max: 28 }, humidity: { min: 40, max: 60 } }
  },
];

const LOCATIONS = ['客厅', '阳台', '卧室', '书房', '办公室', '花园'];

const safeAreaTop = ref(44);
// onMounted(() => safeAreaTop.value = uni.getSystemInfoSync().safeAreaInsets.top);

const step = ref(1);
const image = ref(null); // 存储本地文件路径用于预览
const isScanning = ref(false);

const formData = ref({
  name: '',
  species: '',
  location: '客厅',
  type: 'foliage'
});

const onBack = () => emit('back');


// 1. 选择图片
const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'], // 建议压缩，避免Base64过大
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      image.value = tempFilePath; // 设置预览图
      let base64Image = ''
      // 2. 读取文件为 Base64 并开始识别
      // #ifdef H5
      base64Image = await h5ImageToBase64(tempFilePath);
      // #endif
      // #ifdef MP-WEIXIN
      base64Image = await mpImageToBase64(tempFilePath);
      // #endif
      // #ifdef APP-PLUS
      base64Image = await appImageToBase64(tempFilePath);
      // #endif
      identifyPlant(base64Image);
      // const fsm = uni.getFileSystemManager();
      // fsm.readFile({
      //   filePath: tempFilePath,
      //   encoding: 'base64',
      //   success: (data) => {
      //     identifyPlant(data.data);
      //   },
      //   fail: (err) => {
      //     console.error('读取文件失败', err);
      //     uni.showToast({ title: '图片读取失败', icon: 'none' });
      //   }
      // });
    }
  });
};

// 3. 调用百度 API
const identifyPlant = (base64Image) => {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === 'YOUR_BAIDU_ACCESS_TOKEN_HERE') {
    uni.showModal({
      title: '配置提示',
      content: '请先在代码中配置百度的 ACCESS_TOKEN',
      showCancel: false
    });
    // 模拟流程以便 UI 测试
    setTimeout(() => {
      step.value = 2;
      formData.value.name = '未识别植物';
      formData.value.species = '未配置Token';
    }, 1000);
    return;
  }

  isScanning.value = true;

  // 百度API要求去掉可能存在的 data URI scheme 头
  // uni.getFileSystemManager 返回的 base64 通常是不带头的，但为了保险起见处理一下
  // const imageContent = base64Image.replace(/^data:image\/\w+;base64,/, '');
  // Uniapp readFile 返回的通常纯内容，直接用即可

  uni.request({
    url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=' + ACCESS_TOKEN,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      image: base64Image,
      baike_num: 1
    },
    success: (res) => {
      console.log('API Result:', res.data);

      if (res.data.result && res.data.result.length > 0) {
        const bestMatch = res.data.result[0];

        // 自动填充表单
        formData.value.name = bestMatch.name;
        formData.value.species = bestMatch.name;

        // 简单根据名称猜测类型（实际逻辑可更复杂）
        if (bestMatch.name.includes('兰') || bestMatch.name.includes('花')) {
          formData.value.type = 'flower';
        } else if (bestMatch.name.includes('掌') || bestMatch.name.includes('肉')) {
          formData.value.type = 'succulent';
        } else {
          formData.value.type = 'foliage';
        }

        step.value = 2; // 进入下一步
      } else {
        uni.showToast({ title: '未识别到植物', icon: 'none' });
        step.value = 2; // 即使失败也允许用户手动输入
      }
    },
    fail: (err) => {
      console.error('Request Fail:', err);
      uni.showToast({ title: '网络请求失败', icon: 'none' });
      step.value = 2;
    },
    complete: () => {
      isScanning.value = false;
    }
  });
};

const handleSave = () => {
  const selectedType = PLANT_TYPES.find(t => t.id === formData.value.type) || PLANT_TYPES[0];

  const newPlant = {
    id: `p-${Date.now()}`,
    name: formData.value.name || '我的植物',
    species: formData.value.species,
    image: image.value || 'https://images.unsplash.com/photo-1598544485038-782813589c3f?q=80&w=800&auto=format&fit=crop',
    dateAdded: new Date().toLocaleDateString(),
    location: formData.value.location,
    status: 'healthy',
    healthCondition: 'healthy',
    requirements: selectedType.reqs,
    careTips: {
      water: '根据植物类型自动生成建议...',
      light: '根据植物类型自动生成建议...',
      temperature: '根据植物类型自动生成建议...',
      soil: '根据植物类型自动生成建议...'
    }
  };

  emit('save', newPlant);
};
</script>

<style scoped>
.iconfont {
  display: inline-block;
  line-height: 1;
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

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
</style>