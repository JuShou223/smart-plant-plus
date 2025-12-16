<!--
 * @Date: 2025-12-09 16:40:17
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-11 16:10:42
 * @Description:
-->
<template>
  <view class="safe-container" :style="containerStyle">
    <slot />
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
const props = defineProps({
  absolute: {
    type: Boolean,
    default: false
  },
  left: {
    type: String,
    default: '0px'
  },
  top: {
    type: String,
    default: '0px'
  }
});
// 响应式宽度值
const containerWidth = ref('100vw');
const pdRight = ref('0px');

// 计算容器样式
const containerStyle = computed(() => {
  return {
    width: containerWidth.value,
    'box-sizing': 'border-box',
    'padding-right': pdRight.value,
    'position': props.absolute ? 'absolute' : 'relative',
    'left': props.left,
    'top': props.top
  };
});

// 获取胶囊信息并计算宽度
const calculateContainerWidth = () => {
  // 在 UniApp 中获取系统信息
  const systemInfo = uni.getSystemInfoSync();

  // 获取菜单按钮（胶囊）的位置信息
  let menuButtonInfo = {};
  try {
    menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  } catch (e) {
    // 如果获取失败，使用默认值或返回100%
    // console.warn('获取菜单按钮信息失败:', e);
    containerWidth.value = '100vw';
    pdRight.value = '0px';
    return;
  }

  // 胶囊通常在右侧，所以计算右侧空间
  const screenWidth = systemInfo.screenWidth || systemInfo.windowWidth;
  const capsuleRight = menuButtonInfo.right || 0;
  // const capsuleWidth = menuButtonInfo.width || 0;

  // 如果没有胶囊信息或不在小程序环境，使用全屏
  if (!capsuleRight || capsuleRight <= 0) {
    containerWidth.value = '100vw';
    pdRight.value = '0px';
    return;
  }

  // 计算可用宽度：屏幕宽度 - 胶囊右侧的空白区域
  // 通常胶囊右侧有一定间距，所以实际可用宽度是胶囊的left值
  const capsuleLeft = menuButtonInfo.left || 0;
  const availableWidth = capsuleLeft;

  // 添加安全边距（例如8px）
  const safeMargin = 8;
  const finalWidth = Math.max(availableWidth - safeMargin, 0);

  // 设置宽度，使用px或vw单位
  containerWidth.value = `${finalWidth}px`;
  pdRight.value = Math.max(screenWidth - finalWidth, 0);;
  // 或者使用vw单位：containerWidth.value = `${(finalWidth / screenWidth) * 100}vw`;
};

// 监听窗口变化
const onResize = () => {
  calculateContainerWidth();
};

// 生命周期
onMounted(() => {
  calculateContainerWidth();

  // 监听窗口变化
  if (typeof uni !== 'undefined' && uni.onWindowResize) {
    uni.onWindowResize(onResize);
  }
});
</script>

<style scoped>
.safe-container {
  /* 默认样式 */
  transition: width 0.3s ease;
}
</style>