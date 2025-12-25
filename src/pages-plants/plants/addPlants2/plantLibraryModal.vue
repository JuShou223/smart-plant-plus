<template>
  <up-popup :show="show" mode="bottom">
    <!-- Species Selection Modal -->
    <view
      class="box-border animate-fade-in bg-white w-full max-w-lg rounded-t-[3rem] p-8 shadow-2xl animate-fade-in-up flex flex-col max-h-[92vh]">
      <view class="flex justify-between items-center mb-6">
        <text class="text-xl font-bold text-slate-900">选择品种</text>
        <button @click="() => emit('close')"
          class="p-2 bg-slate-100 rounded-full text-slate-400 border-none m-0 flex items-center justify-center">
          <text class="iconfont icon-lucide-x text-xl"></text>
        </button>
      </view>

      <view class="relative mb-6">
        <text
          class="iconfont icon-lucide-search absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-300"></text>
        <input type="text" placeholder="搜索品种名称，如'绿萝'..." v-model="speciesSearch"
          class="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-50 outline-none font-bold h-12 box-border" />
      </view>

      <scroll-view scroll-y class="overflow-hidden space-y-3 no-scrollbar" style="height: 800rpx;">
        <template v-if="filteredLibrary.length > 0">
          <view v-for="p in filteredLibrary" :key="p.id" @click="handleSelectSpecies(p)"
            class="mb-3 flex items-center gap-4 p-4 rounded-2xl border border-solid border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group active:bg-slate-50">
            <image :src="p.image" mode="aspectFill" class="w-14 h-14 rounded-xl bg-slate-100 shadow-sm" />
            <view class="flex-1 min-w-0">
              <text class="font-bold text-slate-800 text-sm block">{{ p.name }}</text>
              <text class="text-[10px] text-slate-400 italic truncate block">{{ p.scientificName }}</text>
            </view>
            <text class="iconfont icon-lucide-chevron-right text-lg text-slate-200"></text>
          </view>
        </template>

        <view v-else class="py-20 text-center">
          <text class="text-sm font-bold text-slate-400 block">未找到匹配品种</text>
          <text @click="handleUseSearchAsName" class="mt-4 text-emerald-600 text-xs font-bold underline block">
            直接使用 "{{ speciesSearch }}" 作为品种名
          </text>
        </view>
      </scroll-view>
    </view>
  </up-popup>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { usePlantLibrary } from '@/hooks/usePlantLibrary';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false
  }
  // 移除 availableSensors prop，改为内部 hook 获取
});

const emit = defineEmits(['close', 'confirm', 'custom']);


// ==================== Hooks & Data ====================
const { library, loadLibrary } = usePlantLibrary();

// ==================== State ====================
const showSpeciesPicker = ref(false);
const speciesSearch = ref('');

// ==================== Computed ====================
const filteredLibrary = computed(() => {
  if (!speciesSearch.value.trim()) return library.value;
  return library.value.filter(p =>
    p.name.includes(speciesSearch.value) ||
    (p.scientificName && p.scientificName.toLowerCase().includes(speciesSearch.value.toLowerCase()))
  );
});

// ==================== Logic ====================


// Handle Selection from Library
const handleSelectSpecies = (p) => {
  // formData.species = p.name;
  // if (p.requirements) {
  //   formData.requirements = p.requirements;
  // }
  // // Use library image if user hasn't uploaded one
  // if (!image.value) {
  //   image.value = p.image;
  // }
  // showSpeciesPicker.value = false;
  // step.value = 2;
  // // Auto-fill name if empty
  // if (!formData.name) {
  //   formData.name = p.name;
  // }
  emit('confirm', p)
};

const handleUseSearchAsName = () => {
  // formData.species = speciesSearch.value;
  // showSpeciesPicker.value = false;
  // step.value = 2;
  emit('custom', speciesSearch.value)
};



// ==================== Lifecycle ====================
onMounted(() => {
  loadLibrary(); // Ensure mock data is loaded
});
</script>

<style scoped>
/* Iconfont Helper */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* Animations */
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

@keyframes ping {

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes loading-bar {
  0% {
    width: 0%;
  }

  100% {
    width: 100%;
  }
}

.animate-loading-bar {
  animation: loading-bar 1.5s ease-in-out forwards;
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>