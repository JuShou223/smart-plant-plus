<!--
 * @Date: 2025-12-11 08:38:55
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-11 08:55:21
 * @Description:
-->
<template>
  <view
    class="fixed w-[100vw] h-[100vh] top-0 z-[60] flex items-center justify-center bg-white/30 transition-all duration-300 animate-fade-in"
    style="backdrop-filter: blur(2px);">
    <view class="relative flex flex-col items-center justify-center">
      <!-- Container for the spinner and icon -->
      <view class="relative w-16 h-16 flex items-center justify-center">
        <!-- Spinning Ring Track (Light Green) -->
        <view class="absolute inset-0 border-4 border-emerald-100 rounded-full box-border"></view>

        <!-- Spinning Indicator (Dark Green) -->
        <view
          class="absolute inset-0 border-4 border-emerald-500 border-t-transparent border-l-transparent rounded-full animate-spin box-border">
        </view>

        <!-- Center Icon (Static Anchor) -->
        <view
          class="relative z-10 bg-white rounded-full p-2 shadow-sm border border-emerald-50 flex items-center justify-center">
          <!-- 图标：使用 iconfont -->
          <text class="iconfont icon-lucide-sprout text-xl text-emerald-600"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 纯展示组件，无需逻辑
</script>

<style scoped>
/* 定义旋转动画 */
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

/* 定义淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* 确保边框计算在尺寸内 */
.box-border {
  box-sizing: border-box;
}
</style>