<template>
  <view class="min-h-screen bg-white relative z-50">

    <view class="p-6 pb-24 animate-fade-in">

      <view v-if="step === 1" class="flex flex-col items-center justify-center h-[70vh] space-y-8">
        <view class="relative w-64 h-80">
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
        <view class="flex items-center bg-white rounded-3xl relative overflow-hidden group">
          <view class="mr-4 w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative">
            <image :src="image" mode="aspectFill" class="w-full h-full" />
            <!-- <view @click="triggerPicker"
              class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity active:opacity-100">
              <text class="iconfont icon-lucide-image-plus text-xl text-white"></text>
            </view> -->
          </view>
          <view class="flex-1 min-w-0">
            <view class="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase mb-1">
              <text class="iconfont icon-lucide-circle-check text-xs leading-none"></text>
              <text>识别结束</text>
            </view>
            <text class="font-bold text-lg truncate text-slate-900 block">{{ formData.species }}</text>
            <view @click="showSpeciesPicker = true"
              class="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 mt-1">
              <text>不正确？手动更正品种</text>
              <text class="iconfont icon-lucide-arrow-right text-xs"></text>
            </view>
          </view>
        </view>


        <view class="space-y-4">
          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">植物照片</text>
            <view @click="handleChangeImage"
              class="h-[400rpx] relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-solid border-slate-100 bg-white shadow-sm cursor-pointer group">
              <image :src="image" mode="aspectFill" class="w-full h-full" />
              <view
                class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <view class="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <!-- <ImagePlus class="w-4 h-4 text-emerald-600" /> -->
                  <text class="text-xs font-bold text-slate-700">更换照片</text>
                </view>
              </view>
            </view>
          </view>
          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">植物昵称</text>
            <input type="text" v-model="formData.name"
              class="w-full box-border bg-slate-50 border border-solid border-slate-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium h-12"
              placeholder="例如：客厅的大龟背" />
          </view>

          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">品种 (AI 建议)</text>
            <input type="text" v-model="formData.species"
              class="w-full box-border bg-slate-50 border border-solid border-slate-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all h-12"
              placeholder="植物学名" />
          </view>

          <view>
            <text class="block text-sm font-bold text-slate-700 mb-2">摆放位置</text>
            <view class="flex flex-wrap">
              <view v-for="loc in LOCATIONS" :key="loc" @click="handleChangeLocation(loc)"
                class="px-4 py-2 rounded-lg text-xs font-bold border border-solid transition-all mb-2 mr-2" :class="formData.location === loc
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-400'">
                {{ loc }}
              </view>
            </view>
          </view>

          <!-- <view>
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
          </view> -->
        </view>

        <button @click="handleSave"
          class="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] mt-8 flex items-center justify-center">
          确认添加
        </button>
      </view>
    </view>
    <plantLibraryModal :show="showSpeciesPicker" @close="showSpeciesPicker = false" @confirm="handleSelectSpecies"
      @custom="handleCustomSelect">
    </plantLibraryModal>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { h5ImageToBase64, appImageToBase64, mpImageToBase64 } from '@/common/image2Base64'
import {
  getPlantDatabase,
  searchPlants,
  addPlant,
  updatePlant,
  getPlantDetail,
  getPlantDatabaseById
} from '@/apis/modules/plants';
import upload from '@/utils/upload';
import plantLibraryModal from './plantLibraryModal.vue';
import { usePlantLibrary } from '@/hooks/usePlantLibrary';
import { onLoad, onShow, onHide, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import projectConfig from '@/env.config.js';
import bus from '@/common/bus.js';


const { findPlant } = usePlantLibrary();

// ---------------- 配置区域 ----------------
// 注意：在实际项目中，ACCESS_TOKEN 应该从后端获取，不建议直接硬编码在前端
const ACCESS_TOKEN = '24.045d00c4dfeb7948774225591d4af331.2592000.1768372626.282335-120944777';

// const emit = defineEmits(['back', 'save']);

// const PLANT_TYPES = [
//   {
//     id: 'foliage',
//     label: '观叶植物',
//     iconClass: 'icon-lucide-leaf',
//     reqs: { soilMoisture: { min: 40, max: 70 }, light: { min: 800, max: 2000 }, temperature: { min: 18, max: 30 }, humidity: { min: 50, max: 70 } }
//   },
//   {
//     id: 'succulent',
//     label: '多肉/仙人掌',
//     iconClass: 'icon-lucide-sprout',
//     reqs: { soilMoisture: { min: 10, max: 30 }, light: { min: 2000, max: 5000 }, temperature: { min: 15, max: 32 }, humidity: { min: 20, max: 40 } }
//   },
//   {
//     id: 'flower',
//     label: '开花植物',
//     iconClass: 'icon-lucide-sprout',
//     reqs: { soilMoisture: { min: 50, max: 80 }, light: { min: 1500, max: 4000 }, temperature: { min: 15, max: 28 }, humidity: { min: 40, max: 60 } }
//   },
// ];

const LOCATIONS = ['客厅', '大厅', '阳台', '卧室', '书房', '办公室', '花园'];

// const safeAreaTop = ref(44);
// onMounted(() => safeAreaTop.value = uni.getSystemInfoSync().safeAreaInsets.top);

// const step = ref(1);
const step = ref(1);
const image = ref(null); // 存储本地文件路径用于预览
const isScanning = ref(false);
const error = ref('');
const loading = ref(false);
const showSpeciesPicker = ref(false)

const formData = reactive({
  name: '',
  species: '',
  location: '客厅',
  type: 'foliage',
  plantType: '',
  remark: ''
});

const isEditMode = ref(false);

// const onBack = () => emit('back');

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
    }
  });
};

const handleChangeImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      image.value = tempFilePath; // 设置预览图
    }
  });
};

const parsePlantInfo = (text) => {
  // 提取植物名称
  const nameMatch = text.match(/【(.+?)】/);
  const name = nameMatch ? nameMatch[1] : '';

  // 提取温度范围
  let temperature = { min: 0, max: 0 };
  // 修改：增加 \s* 允许减号周围有空格
  const tempMatch = text.match(/(?:适宜)?温度[：:]\s*(?:适宜的温度为)?(\d+)\s*-\s*(\d+)(?:摄氏度|°C)/);
  if (tempMatch) {
    temperature = { min: parseInt(tempMatch[1]), max: parseInt(tempMatch[2]) };
  }

  // 提取空气湿度范围
  // 【重点修改】：(\d+)%?  允许第一个数字后有 %
  let humidity = { min: 0, max: 0 };
  const humidityMatch = text.match(/空气湿度[：:]\s*(?:适宜的空气湿度为)?(\d+)%?\s*-\s*(\d+)%/);
  if (humidityMatch) {
    humidity = { min: parseInt(humidityMatch[1]), max: parseInt(humidityMatch[2]) };
  }

  // 提取土壤湿度范围
  // 【重点修改】：(\d+)%? 允许第一个数字后有 %
  let soilMoisture = { min: 0, max: 0 };
  const soilMatch = text.match(/土壤(?:含水量约|湿度[：:])\s*(\d+)%?\s*-\s*(\d+)%/);
  if (soilMatch) {
    soilMoisture = { min: parseInt(soilMatch[1]), max: parseInt(soilMatch[2]) };
  }

  // 提取光照范围
  let light = { min: 0, max: 0 };
  // 修改：([\d,]+) 确保能匹配带逗号的数字
  const lightMatch = text.match(/(?:适宜光照[：:]|每天约)\s*([\d,]+)\s*-\s*([\d,]+)\s*lux/i);
  if (lightMatch) {
    light = {
      min: parseInt(lightMatch[1].replace(/,/g, '')),
      max: parseInt(lightMatch[2].replace(/,/g, ''))
    };
  }

  // 提取养护提示 (保持原逻辑，稍作优化)
  const waterTip = text.match(/土壤湿度[：:](.+?)(?=\n|$)/)?.[1]?.trim() || '';
  const lightTip = text.match(/适宜光照[：:](.+?)(?=\n|$)/)?.[1]?.trim() || '';
  const tempTip = text.match(/(?:适宜)?温度[：:](.+?)(?=\n|$)/)?.[1]?.trim() || '';
  // 如果没有特定的tips，用整行作为fallback
  const soilTip = text.match(/土壤含水量[^。\n]+/)?.[0] || '';

  return {
    name,
    requirements: {
      temperature,
      humidity,
      soilMoisture,
      light
    },
    careTips: {
      water: waterTip,
      light: lightTip,
      temperature: tempTip,
      soil: soilTip
    }
  };
}

// 图像内容理解发起请求获取task_id
const getAITaskId = (base64Image) => {
  // 这是什么植物，植物名称用【】包裹,给出适宜光照、土壤湿度、空气湿度、适宜温度数值，光照用lux单位，其他用百分比。格式为适宜光照：xxx、土壤湿度：xxx、空气湿度：xxx、适宜温度：xxx
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/request?access_token=' + ACCESS_TOKEN,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        image: base64Image,
        // question: '这是什么植物，植物名称用【】包裹,给出具体的适宜光照、土壤湿度、空气湿度、适宜温度数值，光照用lux，其他用百分比。格式为适宜光照：xxx、土壤湿度：xxx、空气湿度：xxx、适宜温度：xxx',
        question: '这是什么植物，植物名称用【】包裹,在给出这些数值适宜光照：xx-xx lux、土壤湿度：x%-x%、空气湿度：x%-x%、适宜温度：x-x',
      },
      success: (res) => {
        console.log('API Response:', res.data);
        if (res.data.result && res.data.result.task_id) {
          setTimeout(() => {
            resolve(res.data.result.task_id);
          }, 2000)
        } else {
          reject('No result');
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 图像内容理解发起请求获取结果
// 先打印完整响应看看实际结构
const getAITaskResult = async (taskId, maxRetries = 20, retryDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url: `https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/get-result?access_token=${ACCESS_TOKEN}`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { task_id: taskId },
          success: (res) => {
            console.log('完整API响应:', JSON.stringify(res.data)); // 调试用
            resolve(res);
          },
          fail: reject
        });
      });

      const result = response.data;
      console.log('解析后的数据:', result); // 调试用

      // 根据实际API响应调整判断逻辑
      if (result && result.result) {
        // 查看实际 ret_code 的值
        console.log('ret_code:', result.result.ret_code);
        console.log('result结构:', result.result);

        // 百度API常见的成功码可能是 0 或其他，请查阅文档
        if (result.result.ret_code === 0) { // 或 result.result.status === 'success'
          return result.result.description || result.result.content;
        } else if (result.result.ret_code === 1) {
          // 任务处理中
          console.log(`第${i + 1}次轮询，任务进行中...`);
          await sleep(retryDelay);
          continue;
        }
      } else if (result && result.description) {
        // 也可能是直接返回 description
        console.log('直接返回description');
        return result.description;
      }

      // 如果到这里，说明响应格式不符合预期
      throw new Error('响应格式不符合预期: ' + JSON.stringify(result));

    } catch (error) {
      console.error(`第${i + 1}次请求失败:`, error);
      if (i === maxRetries - 1) throw error;
      await sleep(retryDelay);
    }
  }

  throw new Error('任务处理超时');
};
// 3. 调用百度 API
const identifyPlant = async (base64Image) => {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === 'YOUR_BAIDU_ACCESS_TOKEN_HERE') {
    uni.showModal({
      title: '配置提示',
      content: 'ACCESS_TOKEN失效',
      showCancel: false
    });
    // 模拟流程以便 UI 测试
    // setTimeout(() => {
    //   step.value = 2;
    //   formData.value.name = '未识别植物';
    //   formData.value.species = '未配置Token';
    // }, 1000);
    return;
  }

  isScanning.value = true;
  try {
    const taskId = await getAITaskId(base64Image);
    console.log('API 识别结果:', taskId);
    const result = await getAITaskResult(taskId);
    console.log('API 识别描述:', result);
    const matchResult = parsePlantInfo(result);
    console.log('matchResult', matchResult)
    // if (bestMatchName && bestMatchName[1]) {
    const machName = matchResult.name.includes('名称') ? '未知' : matchResult.name;
    formData.name = formData.location + (machName === '未知' ? '植物' : machName);
    formData.species = machName;
    console.log('findPlant', findPlant(machName))
    const findPlantData = findPlant(machName)
    if (findPlantData) {
      formData.plantType = findPlantData.id
      formData.remark = JSON.stringify({
        careTips: findPlantData.careTips,
        requirements: findPlantData.requirements,
      })
    } else {
      formData.plantType = 99999999
      formData.remark = JSON.stringify({
        careTips: [],
        requirements: matchResult.requirements,
      })
    }
    // console.log('findPlant', findPlant(matchResult.name))
    // }
    // // 自动填充表单
    // // 简单根据名称猜测类型（实际逻辑可更复杂）
    // if (bestMatch.name.includes('兰') || bestMatch.name.includes('花')) {
    //   formData.value.type = 'flower';
    // } else if (bestMatch.name.includes('掌') || bestMatch.name.includes('肉')) {
    //   formData.value.type = 'succulent';
    // } else {
    //   formData.value.type = 'foliage';
    // }

    step.value = 2; // 进入下一步
  } catch (error) {
    console.error('识别失败:', error);
    uni.showToast({ title: '未识别到植物', icon: 'none' });
    formData.plantType = 99999999
    step.value = 2; // 即使失败也允许用户手动输入
  } finally {
    isScanning.value = false;
  }
};

// Handle Selection from Library
const handleSelectSpecies = (p) => {
  console.log('ppppppp', p)
  formData.plantType = p.id;
  formData.species = p.name;
  if (p.requirements) {
    formData.requirements = p.requirements;
  }
  // Use library image if user hasn't uploaded one
  // if (!image.value) {
  image.value = p.image;
  // }
  showSpeciesPicker.value = false;
  // step.value = 2;
  // Auto-fill name if empty
  // if (!formData.name) {
  formData.name = formData.location + p.name;
  // }
  // emit('confirm', p)
};

const handleCustomSelect = (name) => {
  formData.name = formData.location + name;
  formData.species = name;
  showSpeciesPicker.value = false;
  formData.plantType = 99999999
}

const handleChangeLocation = (loc) => {
  formData.location = loc
  formData.name = loc + (formData.species === '未知' ? '植物' : formData.species);

}

const handleSave = () => {
  handleSubmit();
  // const selectedType = PLANT_TYPES.find(t => t.id === formData.value.type) || PLANT_TYPES[0];

  // const newPlant = {
  //   id: `p-${Date.now()}`,
  //   name: formData.value.name || '我的植物',
  //   species: formData.value.species,
  //   image: image.value || 'https://images.unsplash.com/photo-1598544485038-782813589c3f?q=80&w=800&auto=format&fit=crop',
  //   dateAdded: new Date().toLocaleDateString(),
  //   location: formData.value.location,
  //   status: 'healthy',
  //   healthCondition: 'healthy',
  //   requirements: selectedType.reqs,
  //   careTips: {
  //     water: '根据植物类型自动生成建议...',
  //     light: '根据植物类型自动生成建议...',
  //     temperature: '根据植物类型自动生成建议...',
  //     soil: '根据植物类型自动生成建议...'
  //   }
  // };

  // emit('save', newPlant);
};

// ==================== 表单提交方法 ====================

/**
 * 提交表单
 */
const handleSubmit = async () => {
  console.log('提交表单');

  // 验证
  // if (!selectedPlant.value) {
  //   error.value = '请先选择植物类型';
  //   uni.showToast({ title: '请先选择植物类型', icon: 'none' });
  //   return;
  // }

  if (!image.value) {
    error.value = '请先上传植物图片';
    uni.showToast({ title: '请先上传植物图片', icon: 'none' });
    return;
  }

  if (!formData.name) {
    error.value = '请输入植物昵称';
    uni.showToast({ title: '请输入植物昵称', icon: 'none' });
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const pattern = /^(https?:\/\/)/;
    let imageUrl = image.value;
    if (!pattern.test(imageUrl)) {
      const uploadResult = await upload({
        url: '/common/upload',
        method: 'post',
        filePath: image.value,
      });
      if (uploadResult.code === 200) {
        imageUrl = uploadResult.fileName;
      } else {
        throw new Error('图片上传失败');
      }
    }
    const submitData = {
      location: formData.location,
      plantImage: projectConfig.baseUrl + imageUrl,
      plantName: formData.name,
      plantType: formData.plantType,
      remark: formData.remark
      // purchaseDate: formData.value.purchase_date,
      // remark: formData.value.notes
    };



    if (isEditMode.value) {
      // 更新植物
      const updateData = { ...submitData, id: plantId.value };
      const response = await updatePlant(plantId.value, updateData);

      if (response.code === 200) {
        uni.showToast({
          icon: 'success',
          title: '保存成功'
        });
        uni.$emit('refreshPlantDetail');
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        error.value = response.msg || '保存失败';
        uni.showToast({ title: error.value, icon: 'none' });
      }
    } else {
      // 添加植物
      const response = await addPlant(submitData);

      if (response.code === 200) {
        uni.showToast({
          icon: 'success',
          title: '添加成功'
        });
        bus.emit('refreshPlantList');
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        error.value = response.msg || '添加失败';
        uni.showToast({ title: error.value, icon: 'none' });
      }
    }
  } catch (error) {
    console.error('提交失败:', error);
    error.value = '操作失败,请重试';
    uni.showToast({ title: error.value, icon: 'none' });
  } finally {
    loading.value = false;
  }
};

onLoad((options) => {
  // 从路由参数获取 id
  if (options.plantId) {
    // plantId.value = options.plantId;
    step.value = 2
    const findPlantData = findPlant(options.plantId)
    if (findPlantData) {
      handleSelectSpecies(findPlantData)
    }
  }
})

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