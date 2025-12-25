<template>
  <view class="w-full">
    <view>
      <view class="flex items-center justify-between mb-4 px-6">
        <view class="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <text class="iconfont icon-lucide-activity text-emerald-600" style="font-size: 20rpx;"></text>
          <text>专家数据选植</text>
        </view>
      </view>

      <!-- <scroll-view class="w-full whitespace-nowrap -mx-6 px-6" scroll-x :show-scrollbar="false"> -->
      <view class="px-3 box-border">
        <up-scroll-list>

          <view
            class="mx-3 flex-shrink-0 w-[560rpx] bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col box-border">
            <view class="flex items-center justify-between mb-2">
              <view>
                <view class="font-bold text-slate-800 text-sm">选择困难症?</view>
                <view class="text-xs text-slate-400">网红植物五维能力对比</view>
              </view>
              <view class="p-2 bg-emerald-50 rounded-lg">
                <text class="iconfont icon-lucide-users text-emerald-500" style="font-size: 16rpx;"></text>
              </view>
            </view>
            <view class="h-[360rpx] w-full">
              <qiun-data-charts type="radar" :opts="radarOpts" :chartData="radarData" :canvas2d="true"
                background="none" />
            </view>
            <view
              class="mt-2 text-[20rpx] text-slate-500 border-t border-slate-50 pt-2 leading-relaxed whitespace-normal">
              <text>💡 </text>
              <text class="font-bold text-emerald-600">专家点评：</text>
              <text> 新手推荐龟背竹，耐阴且性价比更高；追求设计感选琴叶榕。</text>
            </view>
          </view>

          <view
            class="mx-3 flex-shrink-0 w-[560rpx] bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col box-border">
            <view class="flex items-center justify-between mb-4">
              <view>
                <view class="font-bold text-slate-800 text-sm">新房甲醛克星</view>
                <view class="text-xs text-slate-400">NASA 认证净化能力排名</view>
              </view>
              <view class="p-2 bg-cyan-50 rounded-lg">
                <text class="iconfont icon-lucide-wind text-cyan-500"></text>
              </view>
            </view>
            <view class="flex-1 pt-3 px-1">
              <view v-for="(item, idx) in barData" :key="idx" class="mb-4 group cursor-pointer">
                <view class="flex justify-between text-[24rpx] text-slate-600 font-bold mb-1.5">
                  <view class="flex items-center gap-2">
                    <view
                      class="min-w-[32rpx] flex items-center justify-center text-[20rpx] bg-slate-100 rounded-full text-slate-500 px-1">
                      {{ item.icon }}
                    </view>
                    <text>{{ item.label }}</text>
                  </view>
                  <text>{{ item.value }}分</text>
                </view>
                <view class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <view class="h-full rounded-full relative overflow-hidden transition-all duration-500"
                    :class="item.colorClass" :style="{ width: item.value + '%' }">
                    <view class="absolute inset-0 bg-white/20 animate-shimmer"></view>
                  </view>
                </view>
              </view>
              <view class="pt-2 text-[20rpx] text-slate-400 text-center whitespace-normal">
                *基于 NASA 空气净化研究报告数据
              </view>
            </view>
            <view
              class="mt-4 w-full py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg text-center active:bg-rose-100 transition-colors"
              @click="handleBuy">
              购买橡皮树 →
            </view>
          </view>
        </up-scroll-list>
      </view>
      <!-- </scroll-view> -->
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// ------------------- 雷达图配置 -------------------
const radarData = ref({
  categories: ['颜值', '耐阴', '性价比', '净化', '耐旱'],
  series: [
    {
      name: '龟背竹',
      data: [90, 80, 70, 70, 60]
    },
    {
      name: '琴叶榕',
      data: [95, 50, 50, 60, 40]
    }
  ]
});

const radarOpts = ref({
  color: ['#10b981', '#3b82f6', '#FAC858', '#EE6666'],
  padding: [5, 5, 5, 5],
  dataLabel: false,
  legend: {
    show: true,
    position: 'bottom',
    lineHeight: 16,
    fontSize: 10
  },
  extra: {
    radar: {
      gridType: 'radar',
      gridColor: '#e2e8f0',
      gridCount: 4,
      opacity: 0.3,
      max: 100,
      labelShow: true,
      labelColor: '#64748b',
    }
  }
});

// ------------------- 折线图配置 -------------------
const lineData = ref({
  categories: ['0', '2', '4', '6', '8', '10', '12'],
  series: [
    {
      name: '天堂鸟',
      data: [20, 35, 55, 75, 90, 110, 130]
    },
    {
      name: '量天尺',
      data: [20, 22, 25, 28, 32, 36, 40],
      lineType: 'dash' // 虚线设置
    }
  ]
});

const lineOpts = ref({
  color: ['#10b981', '#94a3b8'],
  padding: [15, 15, 0, 15],
  dataLabel: false,
  dataPointShape: false,
  legend: { show: false },
  xAxis: {
    disableGrid: true,
    fontColor: '#94a3b8',
    fontSize: 10,
    axisLine: false
  },
  yAxis: {
    gridType: 'dash',
    dashLength: 4,
    gridColor: '#f1f5f9',
    fontColor: '#94a3b8',
    data: [
      { min: 0, max: 150, axisLine: false } // yAxis 需要数组格式
    ]
  },
  extra: {
    line: {
      type: 'curve', // 曲线
      width: 2,
      activeType: 'hollow'
    }
  }
});

// ------------------- 柱状图数据 (HTML实现) -------------------
const barData = ref([
  { label: '橡皮树', value: 95, colorClass: 'bg-rose-500', icon: '🏆' },
  { label: '虎皮兰', value: 88, colorClass: 'bg-emerald-500', icon: '2' },
  { label: '绿萝', value: 82, colorClass: 'bg-teal-400', icon: '3' }
]);

const handleBuy = () => {
  uni.showToast({
    title: '跳转购买页面',
    icon: 'none'
  });
};
</script>

<style scoped>
/* 自定义动画 - Tailwind 预设可能不支持 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.iconfont {
  font-family: 'iconfont' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 确保 box-sizing */
.box-border {
  box-sizing: border-box;
}
</style>