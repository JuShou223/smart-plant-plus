<!--
 * @Date: 2025-12-09 16:40:17
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-25 12:03:41
 * @Description:
-->
<template>
  <view className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
    <view class="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-fade-in-up">
      <view class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <!-- <Unplug class="w-8 h-8 text-amber-500" /> -->
        <text class="text-2xl leading-none iconfont icon-lucide-unlink text-amber-500"></text>
      </view>
      <h3 class="text-xl font-bold text-slate-900 text-center mb-2">解除绑定？</h3>
      <p class="text-sm text-slate-500 text-center mb-8 leading-relaxed">
        确定要解除{{ plantName }}与当前传感器的绑定吗？解除后将停止自动记录监测数据。
      </p>
      <view class="flex gap-4">
        <button @click="handleClose"
          class="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">取消</button>
        <button @click="handleUnBind"
          class="flex-1 py-3.5 bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-200">
          确认解除
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
// import { computed, ref, onMounted } from 'vue';
import bus from '@/common/bus.js';
import {
  unbindPlant
} from '@/apis/modules/sensors';
const props = defineProps({
  sensorId: {
    type: [String, Number],
    default: ''
  },
  plantName: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['close', 'success']);

const handleClose = () => {
  emit('close')
}

const handleUnBind = async () => {
  try {
    const unbindResult = await unbindPlant({ id: props.sensorId });
    if (unbindResult.code === 200) {
      uni.showToast({
        title: '解绑成功!',
        icon: 'success'
      });

      // 触发刷新事件
      bus.emit('refreshPlantList');
      emit('success')
      // uni.$emit('refreshDeviceList');
      // uni.$emit('refreshPlantDetail');
    } else {
      uni.showToast({
        title: unbindResult.msg || '解绑失败',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '解绑失败: ' + error.message,
      icon: 'none'
    });
  }
}
</script>

<style scoped>
.safe-container {
  /* 默认样式 */
  transition: width 0.3s ease;
}
</style>