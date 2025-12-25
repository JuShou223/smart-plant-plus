<template>
  <view class="min-h-screen bg-white animate-fade-in relative z-50 flex flex-col">
    <!-- Header -->
    <!-- <view class="px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white z-10"
      :style="{ paddingTop: safeAreaTop + 'px' }">
      <button @click="handleBack"
        class="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors bg-transparent border-none flex items-center justify-center m-0 leading-none">
        <text class="iconfont icon-lucide-chevron-left text-2xl text-slate-600"></text>
      </button>
      <text class="font-bold text-slate-800 text-base">添加新设备</text>
      <view class="w-10"></view>
    </view> -->

    <view class="flex-1 flex flex-col relative w-full h-full">

      <!-- Step: Scanning -->
      <view v-if="step === 'scanning'"
        class="flex-1 flex flex-col items-center justify-center p-8 text-center h-[80vh]">
        <view class="relative mb-12">
          <view class="absolute inset-0 bg-emerald-500/20 rounded-full animate-ripple"></view>
          <view class="absolute inset-0 bg-emerald-500/10 rounded-full animate-ripple delay-1000"></view>
          <view
            class="relative z-10 w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200">
            <text class="iconfont icon-lucide-wifi text-5xl text-white animate-pulse"></text>
          </view>
        </view>
        <text class="text-2xl font-bold text-slate-800 mb-2 block">正在搜索附近的设备</text>
        <text
          class="text-slate-400 text-sm max-w-[60%] block mx-auto leading-relaxed">请确保您的传感器已开启，且手机蓝牙与位置权限已处于开启状态。</text>

        <view class="mt-12 flex flex-col items-center gap-4">
          <view class="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
            <text class="iconfont icon-lucide-loader-2 text-sm animate-spin"></text>
            <text>发现协议：Bluetooth 5.0 / Zigbee</text>
          </view>
          <text @click="openScanner"
            class="text-emerald-600 text-xs font-bold underline decoration-2 underline-offset-4 active:text-emerald-700 transition-colors">
            无法识别？扫码或手动添加
          </text>
        </view>
      </view>

      <!-- Step: Discovered List -->
      <view v-if="step === 'discovered'" class="p-6 space-y-6 animate-fade-in-up">
        <view>
          <text class="text-2xl font-bold text-slate-800 mb-2 block">发现 {{ foundDevices.length }} 个设备</text>
          <text class="text-sm text-slate-400 block">请选择您想要添加的传感器进行连接</text>
        </view>

        <view class="space-y-3">
          <view v-for="device in foundDevices" :key="device.id" @click="handleSetup(device)"
            class="w-full bg-white border border-solid border-slate-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm active:border-emerald-500 active:shadow-md transition-all group">
            <view
              class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
              <text class="iconfont icon-lucide-cpu text-3xl"></text>
            </view>
            <view class="flex-1 min-w-0">
              <text class="font-bold text-slate-800 block text-base">{{ device.name }}</text>
              <view class="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400">
                <view class="flex items-center gap-1 uppercase">
                  <text class="iconfont icon-lucide-bluetooth text-xs"></text>
                  <text>BLE Connected</text>
                </view>
                <view class="flex items-center gap-1 uppercase">
                  <text class="iconfont icon-lucide-zap text-xs"></text>
                  <text>RSSI: {{ device.rssi }}dBm</text>
                </view>
              </view>
            </view>
            <view
              class="w-8 h-8 rounded-full border border-solid border-slate-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all">
              <text class="iconfont icon-lucide-check text-sm"></text>
            </view>
          </view>
        </view>

        <view class="space-y-3 pt-4">
          <button @click="startScanning"
            class="w-full py-4 text-sm font-bold text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl active:bg-slate-50 transition-colors bg-white flex items-center justify-center">
            没看到我的设备？重新扫描
          </button>
          <button @click="openScanner"
            class="w-full py-4 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-2xl flex items-center justify-center gap-2 border-none">
            <text class="iconfont icon-lucide-scan text-base"></text>
            <text>扫码获取编号添加</text>
          </button>
        </view>
      </view>

      <!-- Step: Setup / Connecting -->
      <view v-if="step === 'setup'"
        class="flex-1 flex flex-col p-8 items-center justify-center text-center animate-fade-in h-[80vh]">
        <view class="w-20 h-20 mb-8 relative flex items-center justify-center">
          <text
            class="iconfont icon-lucide-loader-2 w-full h-full text-6xl text-emerald-600 animate-spin absolute inset-0"></text>
          <text class="iconfont icon-lucide-smartphone text-3xl text-slate-800 relative z-10"></text>
        </view>
        <text class="text-2xl font-bold text-slate-800 mb-6 block">正在同步配置...</text>

        <view class="w-full max-w-xs space-y-4">
          <view class="text-left space-y-2">
            <text class="text-xs font-bold text-slate-400 uppercase ml-1 block">给设备起个名字</text>
            <input type="text" v-model="sensorName"
              class="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-50 outline-none" />
          </view>
          <view class="bg-slate-50 p-4 rounded-2xl text-left border border-solid border-slate-100">
            <view class="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-2 uppercase">
              <text class="iconfont icon-lucide-shield-check text-xs text-emerald-500"></text>
              <text>安全配对中</text>
            </view>
            <view class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <view class="h-full bg-emerald-500 animate-progress-loading"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- Step: Success -->
      <view v-if="step === 'success'"
        class="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in h-[80vh]">
        <view class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 transform scale-110">
          <text class="iconfont icon-lucide-check-circle-2 text-5xl text-emerald-600"></text>
        </view>
        <text class="text-2xl font-bold text-slate-800 mb-2 block">绑定成功！</text>
        <text class="text-slate-400 block">传感器已正式加入您的智能花园网络。</text>
      </view>

      <!-- --- Manual Entry Modal --- -->
      <view v-if="isManualModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-fade-in">
        <!-- Backdrop -->
        <view class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="handleBack"></view>

        <!-- Modal Card -->
        <view class="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative z-10 animate-fade-in-up">
          <view class="flex justify-between items-center mb-6">
            <view class="p-3 bg-emerald-50 rounded-2xl">
              <text class="iconfont icon-lucide-link-2 text-xl text-emerald-600 leading-none"></text>
            </view>
            <button @click="handleBack"
              class="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors border-none flex items-center justify-center m-0">
              <text class="iconfont icon-lucide-x text-base"></text>
            </button>
          </view>

          <text class="text-xl font-bold text-slate-900 mb-2 block">输入设备信息</text>
          <text class="text-xs text-slate-400 mb-8 leading-relaxed block">
            请输入传感器编号
          </text>

          <view class="space-y-5">
            <view class="space-y-2">
              <text class="text-[10px] font-bold text-slate-400 uppercase ml-1 block">设备编号</text>
              <view class="relative group flex items-center bg-slate-50 rounded-2xl border-2 border-slate-100 px-4">
                <text class="iconfont icon-lucide-hash text-xl text-slate-300 mr-2"></text>
                <input type="text" placeholder="例如: SG-88AB-99CD" v-model="manualId"
                  class="flex-1 py-4 font-mono font-bold text-slate-800 bg-transparent border-none outline-none h-full" />
              </view>
            </view>

            <!-- <view class="space-y-2">
              <text class="text-[10px] font-bold text-slate-400 uppercase ml-1 block">设备名称</text>
              <input type="text" placeholder="如: 客厅龟背竹传感器" v-model="sensorName"
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 font-bold text-slate-800 outline-none" />
            </view> -->

            <view class="bg-amber-50 rounded-2xl p-4 border border-solid border-amber-100 flex gap-3">
              <text class="iconfont icon-lucide-zap text-base text-amber-500 shrink-0"></text>
              <text class="text-[10px] text-amber-700 leading-relaxed font-medium">
                <!-- 提示：请确保设备已开启配对模式（指示灯闪烁中）。 -->
                提示：请确保设备已开启（指示灯闪烁中）。
              </text>
            </view>

            <button @click="handleManualSubmit" :disabled="!manualId.trim() || !sensorName.trim()"
              class="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:bg-emerald-700 disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-2 transition-all border-none">
              <text>添加设备</text>
              <text class="iconfont icon-lucide-arrow-right text-base"></text>
            </button>
          </view>
        </view>
      </view>

      <!-- --- QR Scanner UI (Full Screen Overlay) --- -->
      <view v-if="isScannerOpen" class="fixed inset-0 z-[110] bg-black flex flex-col animate-fade-in">
        <!-- Camera View -->
        <view class="flex-1 relative flex items-center justify-center overflow-hidden">

          <!-- H5 Implementation (Simulation / Video) -->
          <!-- #ifdef H5 -->
          <video id="web-camera" :src-object="videoStream" autoplay playsinline
            class="absolute inset-0 w-full h-full object-cover opacity-60"></video>
          <!-- #endif -->

          <!-- App/MP Implementation -->
          <!-- #ifndef H5 -->
          <camera mode="scanCode" @scancode="handleScanCode" device-position="back" flash="off"
            class="absolute inset-0 w-full h-full" style="opacity: 0.6;">
          </camera>
          <!-- #endif -->

          <!-- Scanning Overlay Grid -->
          <view class="absolute inset-0 pointer-events-none z-20">
            <view class="absolute inset-0 bg-black/40"></view>
            <view v-if="isScanSuccess" class="absolute inset-0 bg-emerald-500/40 animate-pulse z-20"></view>
            <!-- Clear Scan Area -->
            <view class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <view
                class="relative w-64 h-64 border-2 border-emerald-500/50 rounded-3xl overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                <!-- Scanner Line -->
                <view v-if="!isScanSuccess"
                  class="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-scan">
                </view>
                <view v-else
                  class="absolute inset-0 flex items-center justify-center bg-emerald-500/20 animate-fade-in">
                  <!-- <CheckCircle2 className="w-20 h-20 text-emerald-400" /> -->
                  <text class="iconfont icon-lucide-circle-check text-emerald-400 text-[128rpx]"></text>
                </view>
                <!-- Corners -->
                <view :class="isScanSuccess ? 'border-emerald-400' : 'border-emerald-500'"
                  class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl">
                </view>
                <view :class="isScanSuccess ? 'border-emerald-400' : 'border-emerald-500'"
                  class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl">
                </view>
                <view :class="isScanSuccess ? 'border-emerald-400' : 'border-emerald-500'"
                  class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl">
                </view>
                <view :class="isScanSuccess ? 'border-emerald-400' : 'border-emerald-500'"
                  class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-xl">
                </view>
              </view>
              <view class="flex flex-col items-center mt-4">
                <text class="text-white font-bold text-lg mb-2">对准设备二维码</text>
                <text class="text-white/60 text-xs mb-12">将传感器背部的二维码置于框内即可自动识别</text>
              </view>
              <!-- <view
                class="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl text-white/60 transition-all"
                :class="isScanSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : ''">
                <text class="text-xs font-bold uppercase tracking-wider">
                  {{ isScanSuccess ? '扫码成功' : 'Analyzing Visual Stream...' }}
                </text>
              </view> -->
            </view>

          </view>

          <!-- Status Header -->
          <view class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-30"
            :style="{ paddingTop: (safeAreaTop + 10) + 'px' }">
            <button @click="closeScanner"
              class="p-3 bg-black/30 backdrop-blur-md rounded-full border border-solid border-white/20 hover:bg-black/50 transition-colors flex items-center justify-center m-0">
              <text class="iconfont icon-lucide-x text-xl text-white"></text>
            </button>
            <view
              class="px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-full text-xs font-bold tracking-widest border border-solid border-white/10 uppercase flex items-center gap-2">
              <view class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></view>
              <text>扫描设备二维码</text>
            </view>
            <view class="w-12"></view>
          </view>

          <!-- Text Instructions & Manual Switch Button -->
          <view class="absolute bottom-[128rpx] left-0 right-0 flex flex-col items-center px-8 z-30">
            <view class="flex flex-col gap-4 w-full max-w-xs">
              <!-- <view
                class="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl border border-solid border-white/10 px-6 py-4 rounded-2xl text-white/60">
                <text class="iconfont icon-lucide-loader-2 text-base animate-spin"></text>
                <text class="text-xs font-bold uppercase tracking-wider">Analyzing Visual Stream...</text>
              </view> -->

              <button @click="switchToManual"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all border-none w-full">
                <text class="iconfont icon-lucide-keyboard text-xl"></text>
                <text>手动输入编号</text>
              </button>
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { bindDevice } from '@/apis/modules/sensors';
import bus from '@/common/bus.js'

// ==================== State ====================
const safeAreaTop = ref(44);
const step = ref(''); // 'scanning' | 'discovered' | 'setup' | 'success'
const isManualModalOpen = ref(false);
const isScannerOpen = ref(true);
const foundDevices = ref([]);
const selectedDevice = ref(null);
const sensorName = ref('我的新传感器');
const manualId = ref('');
const videoStream = ref(null);
const isScanSuccess = ref(false);

// ==================== Logic ====================

// Start Bluetooth/Zigbee Scanning Simulation
const startScanning = () => {
  // step.value = 'scanning';
  foundDevices.value = [];
  setTimeout(() => {
    foundDevices.value = [
      { id: 'S-NEW-88', name: 'SmartGreen Multi-V2', rssi: -42, type: 'multi' },
      { id: 'S-NEW-92', name: 'SmartGreen Light-V2', rssi: -65, type: 'light' }
    ];
    // step.value = 'discovered';
  }, 3000);
};

// Handle selecting a device to setup
const handleSetup = (device) => {
  selectedDevice.value = device;
  isManualModalOpen.value = false;
  isScannerOpen.value = false;
  step.value = 'setup';

  setTimeout(() => {
    // Save logic would go here
    step.value = 'success';
    setTimeout(() => {
      // Return to previous page with result
      uni.showToast({ title: '添加成功', icon: 'success' });

      // Emit event or save to store
      // const newSensor = { id: device.id, name: sensorName.value, ... };
      // uni.$emit('sensorAdded', newSensor);

      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }, 1500);
  }, 2500);
};

// Handle manual ID submission
const handleManualSubmit = async () => {
  if (!manualId.value.trim()) return;
  // const mockDevice = {
  //   id: manualId.value.trim().toUpperCase(),
  //   name: sensorName.value,
  //   type: 'multi',
  //   rssi: -50
  // };
  // handleSetup(mockDevice);
  try {
    // 4. 调用绑定接口
    const response = await bindDevice({ serialNumber: manualId.value.trim() });

    if (response.code === 200) {
      // step.value = 'success';
      uni.showToast({ title: '绑定成功', icon: 'success' });
      // uni.$emit('refreshDeviceList');
      bus.emit('refreshDeviceList')

      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      throw new Error(response.msg || '绑定失败');
    }
  } catch (error) {
    console.error('绑定设备异常:', error);
    uni.showToast({
      title: error.message || '连接超时，请重试',
      icon: 'none',
      duration: 2000
    });

    // 体验优化：失败后跳转到手动输入框
    setTimeout(() => {
      step.value = '';
      manualId.value = serialNumber;
      isManualModalOpen.value = true;
    }, 1500);
  }
};

// ==================== Scanner Logic ====================

let scanTimer = null;

const openScanner = async () => {
  isScannerOpen.value = true;

  // Simulation: Detect a code after 3.5 seconds
  // scanTimer = setTimeout(() => {
  //   if (isScannerOpen.value && !isManualModalOpen.value) {
  //     manualId.value = 'SG-SCAN-' + Math.floor(Math.random() * 9000 + 1000);
  //     isScannerOpen.value = false;
  //     isManualModalOpen.value = true;
  //     uni.vibrateShort(); // Haptic feedback on scan
  //   }
  // }, 3500);

  // #ifdef H5
  // Web Camera Logic
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      // We need to set srcObject on the video element directly in DOM or via special binding
      // In UniApp H5 Vue3, we can use a ref but srcObject binding isn't standard props.
      // We'll use a document selector for simplicity in this specific H5 case.
      nextTick(() => {
        const videoEl = document.querySelector('#web-camera');
        if (videoEl) videoEl.srcObject = stream;
        videoStream.value = stream;
      });
    }
  } catch (err) {
    console.error("Camera access denied", err);
    // Fallback if camera fails
    isScannerOpen.value = false;
    isManualModalOpen.value = true;
  }
  // #endif
};

const closeScanner = () => {
  isScannerOpen.value = false;
  stopCamera();
  handleBack();
  // uni.navigateBack()
};

const switchToManual = () => {
  // We keep scanner background or close it? React code implied closing scanner view logic.
  isScannerOpen.value = false;
  stopCamera();
  isManualModalOpen.value = true;
};

const stopCamera = () => {
  clearTimeout(scanTimer);
  // #ifdef H5
  if (videoStream.value) {
    videoStream.value.getTracks().forEach(track => track.stop());
    videoStream.value = null;
  }
  // #endif
};

const handleBack = () => {
  // if (step.value === 'setup') return; // Prevent back during setup
  // if (step.value === 'discovered') {
  // step.value = 'scanning'; // Go back to scanning? or exit
  // Usually user expects back to leave page
  // uni.navigateBack();
  // return;
  // }
  // bus.emit('refreshDeviceList')
  uni.navigateBack();
};

const handleScanCode = async (res) => {
  // console.log('扫描出的信息', JSON.stringify(res))
  // 1. 防抖：如果正在连接或已成功，忽略后续扫描
  if (isScanSuccess.value) return;

  const rawResult = res.detail.result;
  if (!rawResult) {
    uni.showToast({ title: '未识别到有效信息', icon: 'none' });
    return;
  }

  // 视觉反馈：闪烁屏幕
  isScanSuccess.value = true;
  // uni.vibrateShort(); // 震动反馈

  let serialNumber = rawResult;

  // 2. 尝试解析 JSON 格式
  // if (rawResult.trim().startsWith('{')) {
  //   try {
  //     const jsonRes = JSON.parse(rawResult);
  //     if (jsonRes.deviceNumber) serialNumber = jsonRes.deviceNumber;
  //     else if (jsonRes.serialNumber) serialNumber = jsonRes.serialNumber;
  //     else if (jsonRes.id) serialNumber = jsonRes.id;
  //   } catch (e) {
  //     console.warn('非JSON格式二维码，使用原始字符串:', e);
  //   }
  // }

  console.log('解析后的设备号:', serialNumber);

  // 3. 更新 UI 状态
  // 稍微延迟关闭扫码器，让用户看到闪烁动画
  setTimeout(async () => {
    isScannerOpen.value = false;
    isManualModalOpen.value = true;
    // setTimeout(() => {
    step.value = '';
    manualId.value = serialNumber;
    // }, 1500);
    // step.value = 'setup';

    // try {
    //   // 4. 调用绑定接口
    //   const response = await bindDevice({ serialNumber });

    //   if (response.code === 200) {
    //     step.value = 'success';
    //     uni.showToast({ title: '绑定成功', icon: 'success' });
    //     uni.$emit('refreshDeviceList');

    //     setTimeout(() => {
    //       uni.navigateBack();
    //     }, 1500);
    //   } else {
    //     throw new Error(response.msg || '绑定失败');
    //   }
    // } catch (error) {
    //   console.error('绑定设备异常:', error);
    //   uni.showToast({
    //     title: error.message || '连接超时，请重试',
    //     icon: 'none',
    //     duration: 2000
    //   });

    //   // 体验优化：失败后跳转到手动输入框
    //   setTimeout(() => {
    //     step.value = '';
    //     manualId.value = serialNumber;
    //     isManualModalOpen.value = true;
    //   }, 1500);
    // }
  }, 500);
}


// ==================== Lifecycle ====================
onLoad(() => {
  const sys = uni.getSystemInfoSync();
  if (sys.safeAreaInsets?.top) {
    safeAreaTop.value = sys.safeAreaInsets.top;
  }
  startScanning();
});

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* Ripple Animation */
@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

/* Scanner Line Animation */
@keyframes scan {

  0%,
  100% {
    top: 0%;
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  50% {
    top: 100%;
    opacity: 1;
  }

  90% {
    opacity: 1;
  }
}

.animate-scan {
  animation: scan 2.5s ease-in-out infinite;
}

/* Progress Loading */
@keyframes progress-loading {
  0% {
    width: 0%;
  }

  100% {
    width: 100%;
  }
}

.animate-progress-loading {
  animation: progress-loading 2.5s linear forwards;
}

/* Fade Ins */
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
  animation: fadeInUp 0.3s ease-out;
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
</style>