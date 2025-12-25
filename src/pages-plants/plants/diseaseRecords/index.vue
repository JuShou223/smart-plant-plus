<template>
  <view class="container">
    <view class="min-h-screen bg-[#FAFAFA] pb-24 animate-fade-in relative z-50">
      <view class="p-4 space-y-4">
        <template v-if="records.length > 0">
          <view v-for="record in records" :key="record.id" @click="handleToDetail(record.id)"
            class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all">

            <view class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <image :src="record.diseaseImageUrl" mode="aspectFill" class="w-full h-full" />
            </view>

            <view class="flex-1 min-w-0">
              <view class="flex justify-between items-start">
                <text class="font-bold text-slate-800 text-sm truncate pr-2 block">{{ record.diseaseType }}</text>
                <text class="text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0" :class="[
                  record.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                    record.status === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ record.status === 'healthy' ? '健康' : record.status === 'warning' ? '异常' : '危险' }}
                </text>
              </view>
              <text class="block text-xs text-slate-400 mt-0.5 mb-2">{{ record.plantName }}</text>
              <view class="flex items-center text-[10px] text-slate-400 gap-1">
                <text class="iconfont icon-lucide-calendar text-xs"></text>
                <text>{{ record.createdTime }}</text>
              </view>
            </view>

            <text class="iconfont icon-lucide-chevron-right text-base text-slate-300"></text>
          </view>
        </template>

        <view v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
          <view class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <text class="iconfont icon-lucide-file-text text-4xl opacity-40"></text>
          </view>
          <text class="text-sm font-medium">暂无诊断记录</text>
          <text class="text-xs mt-2 opacity-60">使用 AI 诊断功能生成的报告会保存在这里</text>
        </view>
        <up-loadmore v-if="records.length > 0" :status="loadStatus" loading-text="努力加载中..." loadmore-text="轻轻上拉"
          nomore-text="没有更多了" marginTop="15" />
      </view>
    </view>

  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { getDiseaseRecords } from '@/apis/modules/disease';
// 1. 引入生命周期钩子
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
// loadStatus: 'loadmore' (加载前/上拉加载), 'loading' (加载中), 'noMore' (没有更多)

const records = ref([])
const loadStatus = ref('loadmore');

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)

// 定义 Events
const emit = defineEmits(['back']);

// 返回上一级
const onBack = () => {
  emit('back');
};

// 核心加载逻辑
const loadRecords = async () => {
  loadStatus.value = 'loading'

  try {
    const response = await getDiseaseRecords({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize
    });

    if (response.code === 200) {
      const newRecords = response.rows || [];

      // 数据处理：映射状态颜色等
      const processedRecords = newRecords.map(item => ({
        ...item,
        // 如果后端没有返回 status 字段，这里做个转换示例
        status: item.diseaseType === '无病害' ? 'healthy' : 'warning',
        // 假设后端可能没返回 symptoms 数组，做个兜底
        symptoms: item.symptoms || []
      }));

      //如果是第一页，覆盖；否则追加
      if (queryParams.pageNum === 1) {
        records.value = processedRecords;
      } else {
        records.value = [...records.value, ...processedRecords];
      }

      total.value = response.total || 0;

      // 判断是否还有更多数据
      if (records.value.length >= total.value) {
        loadStatus.value = 'noMore';
      } else {
        loadStatus.value = 'loadmore';
      }

    } else {
      uni.showToast({ title: response.msg || '加载失败', icon: 'none' });
      // 加载失败如果是在第一页，清空
      if (queryParams.pageNum === 1) records.value = [];
      loadStatus.value = 'loadmore'; // 失败后允许重试
    }
  } catch (error) {
    console.error('加载诊断记录失败:', error);
    uni.showToast({ title: '加载失败', icon: 'error' });
    loadStatus.value = 'loadmore'; // 失败后允许重试
  } finally {
    // 停止下拉刷新动画
    uni.stopPullDownRefresh();
  }
}

// 2. 页面触底事件（上拉加载更多）
onReachBottom(() => {
  // 如果正在加载中，或者没有更多数据了，则不执行
  if (loadStatus.value === 'loading' || loadStatus.value === 'noMore') return;

  // 页码 +1
  queryParams.pageNum++;
  // 加载数据
  loadRecords();
});

// 3. 下拉刷新事件
onPullDownRefresh(() => {
  // 重置页码
  queryParams.pageNum = 1;
  // 重置加载状态（可选，loadRecords会设为loading）
  loadStatus.value = 'loadmore';
  // 重新加载
  loadRecords();
});

// 初始化
onLoad(() => {
  loadRecords()
})

/**
 * 样式工具函数保持不变
 */
const getStatusColor = (status, type) => {
  let color = 'slate';
  switch (status) {
    case 'healthy': color = 'emerald'; break;
    case 'warning': color = 'orange'; break;
    case 'danger': color = 'red'; break;
    default: color = 'slate';
  }
  if (type === 'text') return `text-${color}-600`;
  if (type === 'bg-light') return `bg-${color}-50`;
  return '';
};

const handleToDetail = (id) => {
  uni.navigateTo({ url: '/pages-plants/plants/diseaseRecordsDetail2/index?id=' + id });
}
</script>
<style scoped>
/* 确保 Iconfont 正常显示 (假设你全局已经引入了字体文件，这里只是辅助类) */
.iconfont {
  display: inline-block;
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
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

.animate-fade-in {
  animation: fadeInUp 0.3s ease-out;
}
</style>