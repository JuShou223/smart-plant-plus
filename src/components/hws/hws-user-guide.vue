<template>
  <view class="fixed inset-0 z-[999] overflow-hidden pointer-events-auto" @touchmove.stop.prevent="() => { }">
    <!-- 1. Backdrop / Spotlight Effect -->
    <!-- 如果没有 targetRect (居中步骤)，显示全屏遮罩 -->
    <view v-if="!targetRect" class="absolute inset-0 bg-slate-900/75 transition-opacity duration-500"></view>

    <!-- 如果有 targetRect，使用 box-shadow 技术制造镂空效果 -->
    <view v-else
      class="absolute rounded-2xl border-2 border-emerald-400 transition-all duration-300 ease-out animate-pulse-border"
      :style="spotlightStyle"></view>

    <!-- 2. Tooltip Card -->
    <view
      class="absolute bg-white p-6 rounded-3xl shadow-2xl transition-all duration-300 ease-out flex flex-col items-start gap-3 border border-slate-100 box-border"
      :style="tooltipStyle">
      <!-- Header -->
      <view class="flex justify-between items-start w-full">
        <view
          class="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
          Step {{ currentStepIndex + 1 }}/{{ STEPS.length }}
        </view>
        <view @click="handleComplete" class="text-slate-300 hover:text-slate-500 transition-colors p-1">
          <text class="iconfont icon-lucide-x text-base"></text>
        </view>
      </view>

      <!-- Content -->
      <view>
        <text class="text-lg font-bold text-slate-900 mb-1 block">{{ currentStep.title }}</text>
        <text class="text-sm text-slate-500 leading-relaxed block">{{ currentStep.description }}</text>
      </view>

      <!-- Footer Actions -->
      <view class="flex justify-between items-center w-full mt-2">
        <view @click="handleComplete"
          class="text-xs font-bold text-slate-400 active:text-slate-600 transition-colors py-2">
          跳过引导
        </view>
        <button @click="handleNext"
          class="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all border-none m-0 leading-normal">
          <text>{{ currentStepIndex === STEPS.length - 1 ? '开始体验' : '下一步' }}</text>
          <text class="iconfont text-sm"
            :class="currentStepIndex === STEPS.length - 1 ? 'icon-lucide-check' : 'icon-lucide-arrow-right'"></text>
        </button>
      </view>

      <!-- Tooltip Arrow (Optional visual cue) -->
      <view v-if="targetRect" class="absolute w-3 h-3 bg-white rotate-45" :class="arrowClass"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue';

// ==================== Props & Emits ====================
const emit = defineEmits(['complete']);

// ==================== Constants ====================
const STEPS = [
  {
    // Step 1: 欢迎页 (居中)
    title: '欢迎来到 智能养植',
    description: '您的私人智能植物管家。只需几步，带您快速上手打理您的花园。',
    position: 'center'
  },
  {
    // Step 2: AI 诊断 (位于页面顶部 -> 提示框在下方)
    targetId: 'guide-ai-chat',
    title: 'AI 植物专家',
    description: '植物生病了？叶片发黄？点击这里拍照，AI 助手将为您即时诊断病情并提供治疗方案。',
    position: 'bottom'
  },
  {
    // Step 3: 病害百科 (位于页面顶部 -> 提示框在下方)
    targetId: 'guide-nav',
    title: '植物百科全书',
    description: '在这里查阅常见病虫害图鉴和缺素症状，学习专业的养护知识。',
    position: 'bottom'
  },
  {
    // Step 4: 添加植物 (位于页面中部 -> 提示框在上方)
    targetId: 'guide-add-plant',
    title: '打造您的花园',
    description: '点击“添加”，通过 AI 识别或搜索库，将您的植物加入管理，生成专属养护计划。',
    position: 'top'
  },
  {
    // Step 5: 连接传感器 (位于页面底部 -> 提示框在上方)
    targetId: 'guide-sensors',
    title: '连接智能传感器',
    description: '绑定硬件设备，实时监控土壤湿度、光照和温度，异常情况即时报警，科学养护更轻松。',
    position: 'top'
  }
];

// ==================== State ====================
const currentStepIndex = ref(0);
const targetRect = ref(null); // { left, top, width, height, bottom, right }
const windowInfo = ref(uni.getSystemInfoSync());
const instance = getCurrentInstance(); // 用于获取组件上下文

// ==================== Computed Styles ====================

const currentStep = computed(() => STEPS[currentStepIndex.value]);

/**
 * 聚光灯样式
 * 使用 box-shadow: 0 0 0 9999px ... 来创建遮罩
 */
const spotlightStyle = computed(() => {
  if (!targetRect.value) return {};
  const padding = 8;
  return {
    top: `${targetRect.value.top - padding}px`,
    left: `${targetRect.value.left - padding}px`,
    width: `${targetRect.value.width + padding * 2}px`,
    height: `${targetRect.value.height + padding * 2}px`,
    // 核心技巧：巨大的阴影形成遮罩
    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75)'
  };
});

/**
 * 提示框位置计算
 */
const tooltipStyle = computed(() => {
  // 1. 居中情况
  if (!targetRect.value || currentStep.value.position === 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '320px'
    };
  }

  // 2. 跟随目标情况
  const margin = 20;
  const tooltipWidth = 280;
  let top = 0;
  let left = 0;
  let transform = '';

  const rect = targetRect.value;
  const sys = windowInfo.value;

  // 简单的位置逻辑
  if (currentStep.value.position === 'bottom') {
    top = rect.bottom + margin;
    left = rect.left + (rect.width / 2);
    transform = 'translateX(-50%)';

    // 边界检查 Right
    if (left + (tooltipWidth / 2) > sys.windowWidth) {
      left = sys.windowWidth - margin;
      transform = 'translateX(-100%)';
    }
    // 边界检查 Left
    if (left - (tooltipWidth / 2) < 0) {
      left = margin;
      transform = 'translateX(0)';
    }
  } else {
    // Top (Default fallback)
    top = rect.top - margin; // 会被 transform 向上推
    left = rect.left + (rect.width / 2);
    transform = 'translate(-50%, -100%)'; // 向上偏移自身高度

    // 边界检查 Right
    if (left + (tooltipWidth / 2) > sys.windowWidth) {
      left = sys.windowWidth - margin;
      transform = 'translate(-100%, -100%)';
    }
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: transform,
    width: `${tooltipWidth}px`
  };
});

/**
 * 箭头位置样式类
 */
const arrowClass = computed(() => {
  if (currentStep.value.position === 'bottom') {
    return '-top-1.5 left-1/2 -translate-x-1/2';
  }
  return '-bottom-1.5 left-1/2 -translate-x-1/2';
});

// ==================== Logic ====================

const updateTargetRect = () => {
  const step = STEPS[currentStepIndex.value];

  if (step.targetId) {
    // Uniapp 查询节点
    // 注意：如果是查询页面中的节点，需要确保组件挂载在页面根部，
    // 或者将 createSelectorQuery 上下文指向页面
    const query = uni.createSelectorQuery(); // 在全局/页面范围内查找 ID
    query.select('#' + step.targetId).boundingClientRect(data => {
      if (data) {
        console.log('Target found:', step.targetId, data);
        targetRect.value = data;
      } else {
        console.warn('Target not found:', step.targetId);
        targetRect.value = null; // 找不到则居中显示
      }
    }).exec();
  } else {
    targetRect.value = null;
  }
};

const handleNext = () => {
  if (currentStepIndex.value < STEPS.length - 1) {
    currentStepIndex.value++;
    // 等待 DOM 更新（如果有变化）后重新计算位置
    nextTick(() => {
      // 稍微延迟以确保页面布局稳定
      setTimeout(updateTargetRect, 100);
    });
  } else {
    handleComplete();
  }
};

const handleComplete = () => {
  emit('complete');
};

// ==================== Lifecycle ====================
onMounted(() => {
  // 延迟初始化，确保页面元素已渲染
  setTimeout(() => {
    updateTargetRect();
  }, 300);
  // setInterval(() => {
  //   updateTargetRect();
  // }, 1000)
});
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* Animations */
@keyframes pulse-border {

  0%,
  100% {
    box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.75), 0 0 0 0px rgba(52, 211, 153, 0.6);
  }

  50% {
    box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.75), 0 0 0 10px rgba(52, 211, 153, 0);
  }
}

.animate-pulse-border {
  animation: pulse-border 2s infinite;
}
</style>
