<template>
  <view class="pb-24 animate-fade-in bg-[#FAFAFA] min-h-screen relative font-sans">
    <!-- 主界面内容 -->
    <view>
      <!-- Search Header -->
      <up-sticky customNavHeight="0">
        <!-- #ifndef MP-WEIXIN -->
        <up-navbar :fixed="false" title="" :height="24" bgColor="#FAFAFA" leftIcon=""></up-navbar>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <up-navbar :fixed="false" title="" :height="0" bgColor="#FAFAFA" leftIcon="">
        </up-navbar>
        <!-- #endif -->
        <hws-header>
          <view class="z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 box-border px-3">
            <view class="relative">
              <text
                class="iconfont icon-lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-400"></text>
              <input type="text" placeholder="搜索您心仪的植物..." v-model="searchQuery"
                class="w-full box-border bg-slate-100 border-none rounded-xl px-[70rpx] text-sm focus:ring-2 focus:ring-emerald-500 transition-all h-10" />
            </view>
          </view>
        </hws-header>
        <!-- #ifndef MP-WEIXIN -->
        <up-gap height="12" bgColor="#FAFAFA"></up-gap>
        <!-- #endif -->
      </up-sticky>
      <view class="pt-6 space-y-8">

        <!-- Carousel / Recommendation Section -->
        <view v-if="activeFilter === '全部' && !searchQuery && difficultyFilter === 'all'">

          <!-- 1. Featured Collections (Carousel) -->
          <view class="relative mb-4">
            <view class="flex px-6 mb-3 items-end justify-between">
              <text class="text-xl font-bold text-slate-800 tracking-tight">精选专题</text>
              <text class="text-xs text-slate-400 font-medium">向左滑动探索更多 →</text>
            </view>
            <up-swiper duration="1000" interval="5000" circular :list="FEATURED_COLLECTIONS" @change="change"
              @click="click" :height="swiperHeight">
              <template v-slot:default="{ item }">
                <view class="box-border w-[100vw] h-[56vw] px-3">

                  <view @click="handleToArticle(item.id)"
                    class="w-full h-full relative rounded-3xl overflow-hidden group shadow-lg shadow-slate-200 cursor-pointer active:scale-95 transition-transform">
                    <image :src="item.image" mode="aspectFill"
                      class="w-full h-full absolute inset-0 transition-transform duration-700" />
                    <view
                      class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white whitespace-normal">
                      <view
                        class="inline-flex items-center space-x-1 backdrop-blur-md px-2.5 py-1 rounded-lg text-[20rpx] font-bold uppercase w-fit mb-3 shadow-sm"
                        :class="item.tagColor">
                        <text class="iconfont icon-lucide-star text-xs"></text>
                        <text>{{ item.tag }}</text>
                      </view>
                      <text class="text-2xl font-bold mb-1 leading-tight block">{{ item.title }}</text>
                      <text class="text-sm text-slate-300 line-clamp-2 mb-4 font-medium opacity-90 block">{{
                        item.subtitle }}</text>
                      <view
                        class="bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center w-fit">
                        <text>浏览专题</text>
                        <text class="iconfont icon-lucide-arrow-right ml-1.5 text-xs"></text>
                      </view>
                    </view>
                  </view>
                </view>

              </template>
            </up-swiper>
          </view>

          <!-- 2. Editor's Choice -->
          <!-- <view class="px-6 mb-8">
            <view
              class="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300 group cursor-pointer transition-all duration-500">
              <view class="absolute inset-0 bg-slate-900">
                <image :src="PLANT_OF_THE_MONTH.image" mode="aspectFill"
                  class="w-full h-full opacity-60 mix-blend-overlay transition-transform duration-[2s]" />
                <view class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></view>
                <view class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full"></view>
              </view>

              <view class="relative z-10 p-6 sm:p-8 flex flex-col h-full text-white">
                <view class="flex justify-between items-start mb-6">
                  <view>
                    <view class="flex items-center space-x-2 mb-1">
                      <view class="h-[1px] w-6 bg-amber-400"></view>
                      <text class="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Editor's Choice</text>
                    </view>
                    <text class="text-3xl font-serif font-bold text-white tracking-tight leading-none mt-2 block">{{
                      PLANT_OF_THE_MONTH.name }}</text>
                    <text class="text-slate-400 text-xs font-serif italic mt-1 block">{{ PLANT_OF_THE_MONTH.subtitle
                    }}</text>
                  </view>
                  <view
                    class="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-2 min-w-[70px]">
                    <text class="text-[10px] text-amber-400 font-bold uppercase mb-0.5">Ends In</text>
                    <view class="flex items-center space-x-1 font-mono text-sm font-bold">
                      <text class="iconfont icon-lucide-timer text-xs"></text>
                      <text>{{ timeLeft.h }}:{{ String(timeLeft.m).padStart(2, '0') }}:{{ String(timeLeft.s).padStart(2,
                        '0') }}</text>
                    </view>
                  </view>
                </view>

                <view class="relative pl-4 mb-8">
                  <view class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-transparent">
                  </view>
                  <text class="text-slate-200 text-sm font-serif italic leading-relaxed opacity-90 block">
                    {{ PLANT_OF_THE_MONTH.desc }}
                  </text>
                  <view class="mt-2 flex items-center space-x-2">
                    <view class="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                      <text class="text-slate-900 font-serif font-bold text-xs">S</text>
                    </view>
                    <text class="text-[10px] text-amber-400/80 uppercase tracking-widest">{{ PLANT_OF_THE_MONTH.editor
                    }}</text>
                  </view>
                </view>

                <view class="mt-auto flex items-center justify-between">
                  <view class="flex items-end space-x-2">
                    <text class="text-3xl font-serif font-bold text-white">¥{{ PLANT_OF_THE_MONTH.price }}</text>
                    <view class="flex flex-col mb-1">
                      <text class="text-slate-500 text-xs line-through decoration-slate-500/50">¥{{
                        PLANT_OF_THE_MONTH.originalPrice }}</text>
                      <text class="text-[10px] text-emerald-400 font-bold">Save 30%</text>
                    </view>
                  </view>
                  <button
                    class="bg-white text-slate-900 px-5 py-3 rounded-xl text-xs font-bold flex items-center shadow-lg shadow-black/20"
                    hover-class="bg-amber-400">
                    <text class="iconfont icon-lucide-shopping-bag mr-2 text-sm"></text>
                    <text>立即抢购</text>
                  </button>
                </view>
              </view>
            </view>
          </view> -->

          <!-- 3. Live Hot List -->
          <view class="pb-2">
            <view class="px-6 flex items-center justify-between mb-4">
              <view class="flex items-center space-x-2">
                <view class="relative">
                  <text class="text-xl font-bold text-slate-800 tracking-tight relative z-10">实时热榜</text>
                  <view class="absolute bottom-1 left-0 right-0 h-2 bg-rose-200/50 -skew-x-12 z-0"></view>
                </view>
                <view
                  class="bg-rose-500 text-white rounded px-1.5 py-0.5 text-[20rpx] font-bold flex items-center animate-pulse">
                  <text class="iconfont icon-lucide-flame text-xs mr-1"></text>
                  <text>LIVE</text>
                </view>
              </view>
            </view>

            <!-- <scroll-view scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false"> -->
            <!-- <view class="flex space-x-4 px-6 pb-6"> -->
            <view class="px-3">
              <up-scroll-list>
                <view v-for="(plant, idx) in TRENDING_LIST" :key="plant.id"
                  class="flex-shrink-0 mx-3 box-border inline-block w-[480rpx] bg-white rounded-2xl p-3 border border-slate-100 shadow-sm relative group active:scale-95 transition-transform">
                  <!-- Rank Badge -->
                  <view
                    class="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full text-white font-serif font-bold text-lg shadow-lg z-20 border-2 border-white"
                    :class="getRankClass(idx)">
                    <text v-if="idx <= 2"
                      class="iconfont icon-lucide-trophy text-yellow-500 text-xs absolute -top-3 hidden"></text>
                    <text>{{ idx + 1 }}</text>
                  </view>

                  <view class="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-50 w-full">
                    <image :src="plant.image" mode="aspectFill" class="w-full h-full" />
                    <!-- Social Proof Overlay -->
                    <view
                      class="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex items-center justify-between">
                      <view class="flex items-center space-x-1 text-[20rpx] text-white font-medium">
                        <text class="iconfont icon-lucide-eye text-emerald-400 text-xs"></text>
                        <text>{{ plant.viewers }}人围观</text>
                      </view>
                    </view>
                  </view>

                  <view class="flex-1 whitespace-normal">
                    <text class="font-bold text-slate-800 text-base block truncate">{{ plant.name }}</text>
                    <view class="flex items-center space-x-1 mb-2">
                      <view class="flex space-x-0.5">
                        <text v-for="i in 5" :key="i" class="iconfont icon-lucide-star text-[20rpx]"
                          :class="i <= Math.floor(plant.rating) ? 'text-amber-400' : 'text-slate-200'"></text>
                      </view>
                      <text class="text-[20rpx] text-slate-400">({{ plant.sales }})</text>
                    </view>
                    <view class="flex items-center justify-between mt-auto">
                      <text class="text-lg font-bold text-emerald-600">¥{{ plant.price }}</text>
                      <view class="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-900 hover:text-white transition-colors">
                        <text class="iconfont icon-lucide-shopping-bag text-xs"></text>
                      </view>
                    </view>
                  </view>
                </view>
              </up-scroll-list>
            </view>
            <!-- </view> -->
            <!-- </scroll-view> -->
          </view>

          <expertPicksSection></expertPicksSection>
        </view>


        <!-- Filters and Grid Container -->
        <view class="px-6 space-y-6">
          <!-- Filters -->
          <view>
            <view class="flex items-center justify-between mb-3">
              <text class="font-bold text-lg text-slate-800">发现植物</text>
              <view @click="isFilterOpen = true"
                class="p-2 rounded-lg transition-colors flex items-center justify-center"
                :class="difficultyFilter !== 'all' || sortBy !== 'recommended' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'">
                <text class="iconfont icon-lucide-filter text-base"></text>
              </view>
            </view>

            <scroll-view scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false">
              <view class="flex space-x-2 pb-2 px-1">
                <view v-for="filter in FILTERS" :key="filter" @click="activeFilter = filter"
                  class="inline-block px-4 py-2 rounded-full text-xs font-bold transition-all border" :class="activeFilter === filter
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200'">
                  {{ filter }}
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- Product Grid -->
          <view class="grid grid-cols-2 gap-3 sm:gap-6">
            <view v-for="plant in filteredPlants" :key="plant.id" @click="handleToDetail(plant.id)"
              class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full active:opacity-90 transition-opacity">
              <!-- Image Area -->
              <view class="relative aspect-[4/5] overflow-hidden bg-slate-100 h-[360rpx]">
                <image :src="plant.image" mode="aspectFill" class="w-full h-full" />
                <view
                  class="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <text class="iconfont icon-lucide-heart text-xs"></text>
                </view>

                <!-- Tags overlay -->
                <view class="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                  <text v-for="tag in plant.tags.slice(0, 1)" :key="tag"
                    class="text-[20rpx] bg-black/40 backdrop-blur-md text-white px-1.5 py-0.5 rounded">
                    {{ tag }}
                  </text>
                </view>
              </view>

              <!-- Content Area -->
              <view class="p-3 sm:p-4 flex-1 flex flex-col">
                <view class="flex justify-between items-start mb-1 gap-1">
                  <view class="min-w-0 flex-1">
                    <text class="font-bold text-slate-800 text-sm sm:text-lg leading-tight block truncate">{{
                      plant.name }}</text>
                    <text class="text-[20rpx] sm:text-xs text-slate-400 italic font-serif block truncate">{{
                      plant.scientificName }}</text>
                  </view>
                  <view
                    class="flex items-center text-amber-400 text-[20rpx] font-bold bg-amber-50 px-1 py-0.5 rounded shrink-0">
                    <text class="iconfont icon-lucide-star text-[20rpx] mr-0.5"></text>
                    <text>{{ plant.rating }}</text>
                  </view>
                </view>

                <text class="text-[20rpx] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed mb-3 flex-1">
                  {{ plant.description }}
                </text>

                <!-- Difficulty Badge -->
                <view class="hidden sm:block">
                  <!-- Mobile usually hides this to save space, keeping logic same as React -->
                </view>

                <!-- Footer Action -->
                <view class="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                  <view class="flex items-baseline space-x-0.5">
                    <text class="text-xs font-bold text-emerald-600">¥</text>
                    <text class="text-lg sm:text-xl font-bold text-emerald-700">{{ plant.price }}</text>
                  </view>
                  <view
                    class="bg-emerald-600 text-white p-2 rounded-lg shadow-lg shadow-emerald-200 flex items-center justify-center space-x-1.5">
                    <text class="iconfont icon-lucide-shopping-bag text-xs"></text>
                    <text class="text-xs font-bold pr-1 hidden sm:inline">购买</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- End of list CTA -->
          <view v-if="filteredPlants.length > 0"
            class="bg-emerald-50 border border-dashed border-emerald-200 rounded-2xl p-6 text-center">
            <view class="flex justify-center mb-2">
              <text class="iconfont icon-lucide-leaf text-2xl text-emerald-300"></text>
            </view>
            <text class="text-emerald-800 font-bold mb-1 block">没找到喜欢的？</text>
            <text class="text-xs text-emerald-600/80 mb-3 block">我们的植物专家可以为您推荐最适合您环境的植物。</text>
            <text @click="handleOpenAI" class="text-xs font-bold text-emerald-700 underline">
              咨询 AI 专家 &rarr;
            </text>
          </view>

          <!-- Empty State -->
          <view v-if="filteredPlants.length === 0" class="text-center py-12">
            <view class="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <text class="iconfont icon-lucide-search text-2xl text-slate-300"></text>
            </view>
            <text class="text-slate-800 font-bold mb-2 block">未找到相关植物</text>
            <text class="text-slate-400 text-sm block">请尝试调整筛选条件或搜索关键词</text>
            <text @click="resetFilters" class="mt-4 text-emerald-600 font-bold text-sm block underline">
              重置所有筛选
            </text>
          </view>
        </view>
      </view>

      <!-- Floating AI Consultant Button -->
      <view class="fixed bottom-24 right-6 z-40 animate-fade-in-up" @click="handleOpenAI">
        <view
          class="group flex items-center justify-center bg-white/90 backdrop-blur-md border border-emerald-100 shadow-xl shadow-emerald-100/50 text-emerald-600 rounded-full p-3 transition-all duration-300 hover:pr-5 hover:bg-emerald-50 active:scale-95">
          <view class="relative">
            <view
              class="absolute inset-0 bg-emerald-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse">
            </view>
            <text class="iconfont icon-lucide-message-circle-question-mark text-2xl relative z-10"></text>
          </view>
          <!-- UniApp CSS hover text reveal is tricky, simpler to just show icon or use text -->
        </view>
      </view>

      <!-- Filter Bottom Sheet / Modal -->
      <view v-if="isFilterOpen"
        class="fixed top-0 w-[100vw] h-[100vh] z-50 flex items-end justify-center sm:items-center">
        <!-- Backdrop -->
        <view class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="isFilterOpen = false">
        </view>

        <!-- Sheet Content -->
        <view
          class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10 animate-fade-in-up shadow-2xl">
          <view class="flex items-center justify-between mb-6">
            <text class="text-xl font-bold text-slate-800">筛选与排序</text>
            <view @click="isFilterOpen = false"
              class="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center">
              <text class="iconfont icon-lucide-x text-sm text-slate-500"></text>
            </view>
          </view>

          <view class="space-y-6">
            <!-- Sort Section -->
            <view>
              <text class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 block">排序方式</text>
              <view class="grid grid-cols-2 gap-3">
                <view v-for="opt in sortOptions" :key="opt.id" @click="sortBy = opt.id"
                  class="py-3 px-4 rounded-xl text-sm font-bold border flex items-center justify-between transition-all"
                  :class="sortBy === opt.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-100 text-slate-600'">
                  <text>{{ opt.label }}</text>
                  <text v-if="sortBy === opt.id" class="iconfont icon-lucide-check text-xs"></text>
                </view>
              </view>
            </view>

            <!-- Difficulty Section -->
            <view>
              <text class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 block">养护难度</text>
              <view class="flex space-x-3">
                <view v-for="opt in difficultyOptions" :key="opt.id" @click="difficultyFilter = opt.id"
                  class="flex-1 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center"
                  :class="difficultyFilter === opt.id
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-500 border-slate-200'">
                  <text>{{ opt.label }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- Footer Buttons -->
          <view class="mt-8 flex space-x-4">
            <button @click="resetFilters"
              class="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">
              重置
            </button>
            <button @click="isFilterOpen = false"
              class="flex-[2] py-3.5 rounded-xl font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all text-sm">
              显示结果 ({{ filteredPlants.length }})
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import expertPicksSection from './expertPicksSection.vue';

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
  {
    id: 'lib-1',
    name: '天堂鸟',
    scientificName: 'Strelitzia Nicolai',
    price: 128,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1463320898484-cdee8141c787.png',
    rating: 4.8,
    difficulty: 'medium',
    tags: ['网红绿植', '净化空气', '大型植物'],
    description: '不仅是植物，更是家中的艺术品。巨大的叶片带来浓郁的热带风情，让您的花园瞬间提升档次。',
    recommendReason: '拉高层高的视觉焦点',
    sales: 1200,
    viewers: 45
  },
  {
    id: 'lib-2',
    name: '爱心球兰',
    scientificName: 'Hoya Kerrii',
    price: 39,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1620803366004-119b57f54cd6.png',
    rating: 4.9,
    difficulty: 'easy',
    tags: ['新手友好', '送礼首选', '多肉'],
    description: '在这个快节奏的世界里，送自己一颗永不凋谢的爱心。极其耐旱，哪怕一个月忘记浇水也能茁壮成长。',
    recommendReason: '表达爱意的最佳载体',
    sales: 3500,
    viewers: 128
  },
  {
    id: 'lib-3',
    name: '宝莲灯',
    scientificName: 'Medinilla Magnifica',
    price: 299,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1669148911895-a95de51d09ca.png',
    rating: 4.7,
    difficulty: 'hard',
    tags: ['稀有', '开花植物', '高端'],
    description: '植物界的贵族，粉色的花朵如同华丽的宫灯垂下。拥有它，您的花园将成为邻居羡慕的焦点。',
    recommendReason: '自带贵族气息的宫灯花',
    sales: 150,
    viewers: 32
  },
  {
    id: 'lib-4',
    name: '镜面草',
    scientificName: 'Pilea Peperomioides',
    price: 58,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1674237276501-595398f90f87.png',
    rating: 4.6,
    difficulty: 'easy',
    tags: ['招财', '宠物安全', '小型'],
    description: '圆圆的叶片象征着团圆和财富。它不仅可爱，而且对猫狗完全无毒，是铲屎官的完美选择。',
    recommendReason: '宠物友好的招财萌物',
    sales: 890,
    viewers: 67
  },
  {
    id: 'lib-5',
    name: '油画竹芋',
    scientificName: 'Calathea Fusion White',
    price: 88,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1676321046535-848a104819ca.png',
    rating: 4.5,
    difficulty: 'medium',
    tags: ['色彩斑斓', '耐阴', '需保湿'],
    description: '大自然的调色盘。每一片叶子都是独一无二的油画作品，为单调的角落带来生机勃勃的色彩。',
    recommendReason: '点亮暗角的自然油画',
    sales: 420,
    viewers: 29
  },
  {
    id: 'lib-6',
    name: '橄榄树',
    scientificName: 'Olea Europaea',
    price: 158,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1681807326535-621ae5ef9da3.png',
    rating: 4.8,
    difficulty: 'medium',
    tags: ['北欧风', '喜光', '木本'],
    description: '简约而不简单的北欧风格代表。银灰色的叶片在阳光下闪闪发光，象征着和平与智慧。',
    recommendReason: '极简北欧风的灵魂',
    sales: 680,
    viewers: 55
  }
];

const PLANT_OF_THE_MONTH = {
  id: 'promo-1',
  name: '红宝石橡皮树',
  subtitle: 'Ficus Elastica Ruby',
  desc: '“它深邃的酒红色叶片如同陈年红酒，能瞬间提升空间的艺术张力。这是一株有生命力的雕塑。”',
  editor: 'Sarah. J - 首席选品官',
  image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1463320898484-cdee8141c787.png',
  price: 89,
  originalPrice: 129,
  tags: ['限时6折', '耐阴大神'],
  endTime: new Date(Date.now() + 48 * 60 * 60 * 1000)
};

const TRENDING_LIST = [MOCK_PRODUCTS[1], MOCK_PRODUCTS[0], MOCK_PRODUCTS[3], MOCK_PRODUCTS[5]];

const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: "把森林搬回家",
    subtitle: "适合城市公寓的大型观叶植物指南",
    image: "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/photo-1592150621744-aca64f48394a.png",
    tag: "本周精选",
    tagColor: "bg-emerald-500",
    // icon: Star, // 逻辑里不直接使用组件对象，改为在模板写死图标类名
    author: "Dr. Green",
    publishDate: "2024.03.15",
    intro: "在这个钢筋水泥的城市里，我们都渴望拥有一片属于自己的绿色避难所...",
    content: ["首先推荐的是极具气质的橄榄树...", "如果你想要更热带...", "而对于追求独特花期体验..."],
    tips: ["大型植物通常需要...", "定期擦拭叶片...", "搭配编织篮..."],
    linkedPlantIds: ['lib-6', 'lib-1', 'lib-3']
  },
  {
    id: 2,
    title: "治愈系桌面绿洲",
    subtitle: "打造让人放松的办公桌微景观",
    image: "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/ceyda-ciftci-dDVU6D_6T80-unsplash.jpg",
    tag: "热销榜",
    tagColor: "bg-orange-500",
    author: "Lisa Plant",
    publishDate: "2024.03.12",
    intro: "工作压力大的时候...",
    content: ["多肉植物是桌面绿植的首选...", "如果你喜欢更有生机...", "而想要给沉闷的桌面一点色彩..."],
    tips: ["桌面通常比较干燥...", "小心不要把水浇到电脑...", "选择底部有托盘的花盆..."],
    linkedPlantIds: ['lib-2', 'lib-4', 'lib-5']
  },
  {
    id: 3,
    title: "有宠家庭的绿植法则",
    subtitle: "让毛孩子与植物和谐共处",
    image: "https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/julia-smklv-yU8dRCOgnAc-unsplash.jpg",
    tag: "养宠必读",
    tagColor: "bg-rose-500",
    // icon: Cat,
    author: "Vet. Wang",
    publishDate: "2024.03.10",
    intro: "很多铲屎官因为担心植物有毒而不敢养花，其实大可不必因噎废食。只要选对品种，猫狗双全和绿意盎然完全可以兼得。这里为您精选了几款对宠物完全无毒的安全植物。",
    content: [
      "镜面草不仅长相可爱，更重要的是它在ASPCA（美国防止虐待动物协会）的无毒名单上。即便家里的猫咪偶尔调皮咬上一口，也不会有生命危险，是真正的'防猫神器'。",
      "竹芋类植物也是非常安全的选择，尤其是油画竹芋。它们对光照要求不高，适合放在低处的花架上。不过要注意，虽然无毒，但其叶片摆动的特性可能会激起猫咪的捕猎欲。",
      "如果你想要开花的植物，球兰是安全的。它们厚实的叶片通常不招猫咪喜欢（口感不好），且汁液无毒。挂在稍微高一点的地方，既美观又安全。"
    ],
    tips: [
      "虽然植物无毒，但大量误食仍可能引起宠物肠胃不适，建议配合猫草种植。",
      "避免使用化肥和杀虫剂，选择天然有机肥料。",
      "将植物放置在稳固的花盆中，防止被宠物打翻。"
    ],
    linkedPlantIds: ['lib-4', 'lib-5', 'lib-2']
  },
];

const FILTERS = ['全部', '新手友好', '宠物安全', '净化空气', '耐阴', '开花'];

const sortOptions = [
  { id: 'recommended', label: '综合推荐' },
  { id: 'rating', label: '评分最高' },
  { id: 'price_asc', label: '价格: 低到高' },
  { id: 'price_desc', label: '价格: 高到低' },
];

const difficultyOptions = [
  { id: 'all', label: '全部' },
  { id: 'easy', label: '简单' },
  { id: 'medium', label: '中等' },
  { id: 'hard', label: '困难' },
];

// --- STATE ---
const activeCollection = ref(null);
const activeFilter = ref('全部');
const searchQuery = ref('');
const isFilterOpen = ref(false);
const sortBy = ref('recommended');
const difficultyFilter = ref('all');
const timeLeft = reactive({ h: 47, m: 59, s: 59 });
let timer = null;
const loading = ref(true);
const screenWidth = ref(0)
const swiperHeight = ref(0)

// --- LIFECYCLE ---
onMounted(() => {
  loading.value = false;
  console.log('Plant Library Mounted');
  // 同步获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  screenWidth.value = systemInfo.windowWidth || systemInfo.screenWidth

  // 计算 48% 的宽度
  swiperHeight.value = screenWidth.value * 0.56

  console.log('屏幕宽度:', screenWidth.value)
  console.log('48%屏幕宽度:', swiperHeight.value)

  timer = setInterval(() => {
    if (timeLeft.s > 0) {
      timeLeft.s--;
    } else if (timeLeft.m > 0) {
      timeLeft.m--;
      timeLeft.s = 59;
    } else if (timeLeft.h > 0) {
      timeLeft.h--;
      timeLeft.m = 59;
      timeLeft.s = 59;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// --- COMPUTED ---
const filteredPlants = computed(() => {
  let result = MOCK_PRODUCTS.filter(plant => {
    const matchesSearch = plant.name.includes(searchQuery.value) || plant.scientificName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesTag = activeFilter.value === '全部' || plant.tags.includes(activeFilter.value);
    const matchesDifficulty = difficultyFilter.value === 'all' || plant.difficulty === difficultyFilter.value;
    return matchesSearch && matchesTag && matchesDifficulty;
  });

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  return result;
});

// --- METHODS ---
const getRankClass = (idx) => {
  if (idx === 0) return 'bg-gradient-to-br from-yellow-300 to-yellow-600';
  if (idx === 1) return 'bg-gradient-to-br from-slate-300 to-slate-500';
  if (idx === 2) return 'bg-gradient-to-br from-orange-300 to-orange-600';
  return 'bg-slate-800 text-sm w-6 h-6';
};

const renderDifficultyBadge = (difficulty) => {
  // 逻辑在模板中实现或者返回类名，Vue里通常直接在template判断
};

const resetFilters = () => {
  activeFilter.value = '全部';
  searchQuery.value = '';
  difficultyFilter.value = 'all';
  sortBy.value = 'recommended';
};

const handleOpenAI = () => {
  uni.showToast({
    title: '打开 AI 顾问',
    icon: 'none'
  });
};

const handleToDetail = (id) => {
  uni.navigateTo({ url: '/pages-plants/plants/plantLibraryDetailNew/index?id=' + id });
};

const handleToArticle = (id) => {
  uni.navigateTo({ url: '/pages-plants/plants/plantArticle/index?id=' + id });
};

</script>

<style scoped>
/* 隐藏滚动条 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* 动画定义 */
@keyframes fade-in-up {
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
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>