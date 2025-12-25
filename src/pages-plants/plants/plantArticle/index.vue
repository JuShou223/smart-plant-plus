<template>
  <view class="min-h-screen bg-white pb-24">
    <!-- #ifdef MP-WEIXIN -->
    <up-navbar title="" bgColor="transparent" leftIcon="">
      <template #left>
        <hws-header>
          <view class="w-full box-border left-0 pr-4 flex justify-between items-center z-10">
            <button @click="handleBack"
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
              <text class="iconfont icon-lucide-chevron-left text-2xl"></text>
            </button>
            <view class="flex gap-3">
              <button @click="toggleFavorite"
                class="w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all active:scale-95 m-0 p-0 leading-none"
                :class="isFavorite ? 'bg-white text-rose-500' : 'bg-white/20 text-white hover:bg-white hover:text-rose-500'">
                <text class="iconfont icon-lucide-heart text-xl"></text>
              </button>
              <button
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
                <text class="iconfont icon-lucide-share-2 text-xl"></text>
              </button>
            </view>
          </view>
        </hws-header>
      </template>
    </up-navbar>
    <!-- #endif -->

    <!-- <view class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 transition-all"
      :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <view class="flex justify-between items-center h-16">
          <button @click="handleBack"
            class="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors group m-0 bg-transparent p-0 leading-none">
            <view class="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
              <text class="iconfont icon-lucide-chevron-left text-xl"></text>
            </view>
            <text class="text-sm font-bold hidden sm:block">返回图鉴</text>
          </button>

          <text
            class="text-sm font-bold text-slate-800 opacity-0 sm:opacity-100 transition-opacity truncate max-w-[150px] sm:max-w-none">
            {{ collection.title }}
          </text>

          <view class="flex space-x-1">
            <button
              class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 bg-transparent m-0 leading-none">
              <text class="iconfont icon-lucide-bookmark text-xl"></text>
            </button>
            <button
              class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 bg-transparent m-0 leading-none">
              <text class="iconfont icon-lucide-share-2 text-xl"></text>
            </button>
          </view>
        </view>
      </view>
    </view> -->

    <view class="relative h-[40vh] lg:h-[50vh] w-full group overflow-hidden">
      <image :src="collection.image" :alt="collection.title" mode="aspectFill"
        class="w-full h-full transition-transform duration-[20s] ease-linear group-hover:scale-110" />
      <view class="absolute inset-0 bg-black/20 pointer-events-none"></view>
      <view class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
      </view>
      <!-- #ifndef MP-WEIXIN -->
      <hws-header absolute>
        <view class="w-full box-border left-0 p-4 flex justify-between items-center z-10">
          <button @click="handleBack"
            class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
            <text class="iconfont icon-lucide-chevron-left text-2xl"></text>
          </button>
          <view class="flex gap-3">
            <button @click="toggleFavorite"
              class="w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all active:scale-95 m-0 p-0 leading-none"
              :class="isFavorite ? 'bg-white text-rose-500' : 'bg-white/20 text-white hover:bg-white hover:text-rose-500'">
              <text class="iconfont icon-lucide-heart text-xl"></text>
            </button>
            <button
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
              <text class="iconfont icon-lucide-share-2 text-xl"></text>
            </button>
          </view>
        </view>
      </hws-header>
      <!-- #endif -->
      <view class="absolute bottom-0 left-0 w-full p-6 lg:p-12">
        <view class="max-w-7xl mx-auto animate-fade-in-up">
          <view
            class="inline-flex items-center space-x-2 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 shadow-lg backdrop-blur-none"
            :class="collection.tagColor || 'bg-emerald-500'">
            <!-- <text v-if="collection.iconName" class="iconfont text-sm fill-current"
              :class="`icon-lucide-${toKebabCase(collection.iconName)}`"></text> -->
            <text>{{ collection.tag }}</text>
          </view>
          <text class="block text-3xl sm:text-5xl font-serif font-bold text-white leading-tight mb-3 drop-shadow-md">
            {{ collection.title }}
          </text>
          <text class="block text-white/90 text-sm sm:text-lg font-medium max-w-2xl drop-shadow-sm leading-relaxed">
            {{ collection.subtitle }}
          </text>
        </view>
      </view>
    </view>

    <view class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <view class="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-24 relative">

        <view class="lg:col-span-7 xl:col-span-8">

          <view class="flex items-center space-x-4 border-b border-slate-100 pb-8 mb-8">
            <view
              class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
              <text>{{ collection.author ? collection.author.charAt(0) : 'A' }}</text>
            </view>
            <view>
              <text class="block text-sm font-bold text-slate-900">{{ collection.author }}</text>
              <text class="block text-xs text-slate-500 uppercase tracking-wide">认证植物学家 • {{ collection.publishDate
              }}</text>
            </view>
          </view>

          <view v-if="collection.intro" class="mb-10">
            <text
              class="block font-serif text-xl sm:text-2xl leading-relaxed text-slate-700 italic border-l-4 border-emerald-500 pl-5 text-justify">
              {{ collection.intro }}
            </text>
          </view>

          <view class="text-slate-600">
            <view v-for="(paragraph, idx) in collection.content" :key="idx" class="mb-10">
              <text class="block leading-8 text-justify font-sans mb-5">
                {{ paragraph }}
              </text>

              <view v-if="linkedProducts[idx]" @click="handleToDetail(linkedProducts[idx].id)"
                class="lg:hidden animate-fade-in-up bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex gap-4 items-center group relative overflow-hidden">
                <view class="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-50">
                  <image :src="linkedProducts[idx].image" :alt="linkedProducts[idx].name" mode="aspectFill"
                    class="w-full h-full transition-transform duration-500 group-hover:scale-110" />
                </view>

                <view class="flex-1 min-w-0 py-0.5">
                  <view class="flex justify-between items-start mb-1">
                    <view>
                      <text class="block font-serif font-bold text-slate-900 text-sm leading-tight">{{
                        linkedProducts[idx].name }}</text>
                      <text class="block text-[10px] text-slate-400 italic truncate">{{
                        linkedProducts[idx].scientificName }}</text>
                    </view>
                    <text class="text-sm font-bold text-emerald-700">¥{{ linkedProducts[idx].price }}</text>
                  </view>

                  <view v-if="linkedProducts[idx].recommendReason"
                    class="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] text-emerald-700 font-medium mb-1.5">
                    <text class="iconfont icon-lucide-sparkles text-xs mr-1"></text>
                    <text>{{ linkedProducts[idx].recommendReason }}</text>
                  </view>

                  <view class="flex justify-end">
                    <button
                      class="flex items-center space-x-1 text-[10px] font-bold bg-slate-900 text-white px-2.5 py-1 rounded-full hover:bg-emerald-600 transition-colors m-0 leading-none">
                      <text class="iconfont icon-lucide-shopping-bag text-xs mr-1"></text>
                      <text>查看详情</text>
                    </button>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="my-12 bg-[#F0FAF5] rounded-3xl p-8 relative overflow-hidden border border-emerald-100">
            <text
              class="iconfont icon-lucide-leaf absolute -top-6 -right-6 text-[128px] text-emerald-100 opacity-50 rotate-12"></text>

            <view class="text-lg font-serif font-bold text-emerald-900 mb-6 flex items-center relative z-10">
              <text class="iconfont icon-lucide-quote text-xl mr-2 text-emerald-600"></text>
              <text>专家贴士</text>
            </view>
            <view class="grid gap-4 relative z-10">
              <view v-for="(tip, idx) in collection.tips" :key="idx"
                class="flex items-start bg-white rounded-xl p-4 shadow-sm border border-emerald-50">
                <view
                  class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mr-3 shrink-0 shadow-sm">
                  {{ idx + 1 }}
                </view>
                <text class="text-sm text-slate-700 font-medium leading-relaxed flex-1">{{ tip }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="hidden lg:block lg:col-span-5 xl:col-span-4 relative">
          <view class="sticky top-28 space-y-8">
            <view class="flex items-center justify-between pb-4 border-b border-slate-100">
              <text class="font-serif text-xl font-bold text-slate-900">
                本期推荐清单
              </text>
              <text class="text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded-md">
                {{ linkedProducts.filter(Boolean).length }} items
              </text>
            </view>

            <scroll-view scroll-y class="space-y-6 max-h-[70vh] pr-4 custom-scrollbar">
              <template v-for="(plant, idx) in linkedProducts" :key="idx">
                <view v-if="plant"
                  class="group flex items-start p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300 border border-transparent hover:border-slate-100 cursor-pointer">
                  <view class="w-20 h-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 relative shadow-sm">
                    <image :src="plant.image" :alt="plant.name" mode="aspectFill"
                      class="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </view>
                  <view class="ml-4 flex-1 flex flex-col h-24 justify-between py-0.5">
                    <view>
                      <text
                        class="block font-serif font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{{
                          plant.name }}</text>
                      <text class="block text-xs text-slate-400 italic mt-0.5 font-serif">{{ plant.scientificName
                      }}</text>
                    </view>

                    <text v-if="plant.recommendReason"
                      class="block text-[10px] text-emerald-600 font-medium line-clamp-1">
                      {{ plant.recommendReason }}
                    </text>

                    <view class="flex items-center justify-between mt-1">
                      <text class="text-emerald-700 font-bold font-mono text-lg">¥{{ plant.price }}</text>
                      <button
                        class="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm m-0 p-0 leading-none">
                        <text class="iconfont icon-lucide-plus text-base"></text>
                      </button>
                    </view>
                  </view>
                </view>
              </template>
            </scroll-view>

            <view
              class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 text-center border border-emerald-100/50">
              <text class="block font-serif font-bold text-emerald-900 mb-2">打造您的专属花园</text>
              <text class="block text-xs text-emerald-700/80 mb-4 leading-relaxed">不知道选哪一株？告诉 AI 您的环境，我们将为您定制方案。</text>
              <button @click="handleOpenAI"
                class="text-xs font-bold bg-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center w-full hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all m-0">
                咨询 AI 园艺师
                <text class="iconfont icon-lucide-external-link text-xs ml-1.5"></text>
              </button>
            </view>
          </view>
        </view>

      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePlantLibrary } from '@/hooks/usePlantLibrary'

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
  {
    id: '1061',
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
    viewers: 45,
    buyerData: { percentage: 88, tag: '室内设计师选择' },
    requirements: {
      light: { min: 2000, max: 5000 },
      temperature: { min: 18, max: 30 },
      humidity: { min: 60, max: 80 },
      soilMoisture: { min: 40, max: 60 }
    },
    careTips: {
      water: '喜湿润，夏季多浇水并向叶面喷雾，冬季微干。',
      light: '喜充足阳光，但也耐半阴，避开夏季烈日暴晒。',
      temperature: '不耐寒，冬季保持10℃以上，最适20-30℃。',
      soil: '喜疏松肥沃、排水良好的砂质土壤，需深盆。'
    }
  },
  {
    id: '1062',
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
    viewers: 128,
    buyerData: { percentage: 95, tag: '送礼用户首选' },
    requirements: {
      light: { min: 800, max: 2500 },
      temperature: { min: 15, max: 28 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 10, max: 30 }
    },
    careTips: {
      water: '极耐旱，“宁干勿湿”，土干透后再浇水。',
      light: '喜明亮散射光，忌强光直射，光照不足生长慢。',
      temperature: '适宜18-28℃，冬季保持5℃以上即可。',
      soil: '需使用排水性极佳的多肉专用土或颗粒土。'
    }
  },
  {
    id: '1063',
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
    viewers: 32,
    requirements: {
      light: { min: 1500, max: 3000 },
      temperature: { min: 20, max: 30 },
      humidity: { min: 70, max: 90 },
      soilMoisture: { min: 50, max: 70 }
    },
    careTips: {
      water: '喜高湿，经常喷雾增湿，盆土保持湿润不积水。',
      light: '喜半阴，忌强光，明亮散射光利于开花。',
      temperature: '极不耐寒，冬季需15℃以上，注意保暖。',
      soil: '喜疏松透气、富含腐殖质的微酸性土壤。'
    }
  },
  {
    id: '1064',
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
    viewers: 67,
    buyerData: { percentage: 92, tag: '养宠家庭选择' },
    requirements: {
      light: { min: 1000, max: 3000 },
      temperature: { min: 15, max: 28 },
      humidity: { min: 50, max: 70 },
      soilMoisture: { min: 30, max: 50 }
    },
    careTips: {
      water: '见干见湿，保持微湿。定期擦拭叶片灰尘。',
      light: '喜明亮散射光，耐阴。避免暴晒防卷叶。',
      temperature: '较耐寒，0℃以上可过冬，适宜15-25℃。',
      soil: '对土壤要求不严，排水良好的沙质壤土即可。'
    }
  },
  {
    id: '1065',
    name: '油画竹芋',
    scientificName: 'Calathea Fusion White',
    price: 88,
    image: 'https://hws-smart-planting.oss-cn-beijing.aliyuncs.com/premium_photo-1676321046535-848a104819ca.png',
    rating: 4.5,
    difficulty: 'medium',
    tags: ['色彩斑斓', '耐阴', '需保湿', '雨林'],
    description: '大自然的调色盘。每一片叶子都是独一无二的油画作品，为单调的角落带来生机勃勃的色彩。',
    recommendReason: '点亮暗角的自然油画',
    sales: 420,
    viewers: 29,
    requirements: {
      light: { min: 500, max: 1500 },
      temperature: { min: 18, max: 26 },
      humidity: { min: 70, max: 90 },
      soilMoisture: { min: 50, max: 80 }
    },
    careTips: {
      water: '对水敏感，保持湿润。必须经常喷雾防焦边。',
      light: '喜阴，完全避光直射，光强会褪色灼伤。',
      temperature: '喜温暖，适温20-30℃，冬季不低于15℃。',
      soil: '需疏松、排水良好且保水性强的微酸性土。'
    }
  },
  {
    id: '1066',
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
    viewers: 55,
    buyerData: { percentage: 80, tag: '极简主义者青睐' },
    requirements: {
      light: { min: 3000, max: 6000 },
      temperature: { min: 10, max: 35 },
      humidity: { min: 40, max: 60 },
      soilMoisture: { min: 20, max: 50 }
    },
    careTips: {
      water: '较耐旱，土干透浇透。室内养护注意通风。',
      light: '极喜光，需全日照，光照不足会大量落叶。',
      temperature: '耐寒性较强，耐短时-5℃，适宜20-30℃。',
      soil: '喜碱性土壤，需排水性极佳，可混入颗粒。'
    }
  }
];

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
    intro: "在这个钢筋水泥的城市里，我们都渴望拥有一片属于自己的绿色避难所。打造'城市森林'风格并不需要豪宅，只需要几株恰到好处的大型观叶植物，就能让家充满呼吸感。",
    content: [
      "首先推荐的是极具气质的橄榄树。对于采光良好的客厅，它是营造高级感的绝佳选择。它的叶片带有灰绿色的质感，枝干纤细优雅，与简约的现代家居风格完美融合，仿佛把地中海的微风带进了室内。",
      "如果你想要更热带、更狂野的感觉，那么叶片巨大的天堂鸟（鹤望兰）绝对是不二之选。它高大的身形能瞬间拉升空间的纵深感，巨大的叶片如同一把把绿色的扇子，是绝对的视觉焦点。",
      "而对于追求独特花期体验的进阶玩家，宝莲灯是不可多得的珍品。虽然它需要更细心的呵护，但当粉色的花序像宫灯一样垂下时，那种华丽震撼的美感会让所有的付出都变得值得。"
    ],
    tips: [
      "大型植物通常需要更稳定的光照环境，避免频繁移动。",
      "定期擦拭叶片灰尘，不仅为了美观，更能帮助植物呼吸。",
      "搭配编织篮或水泥盆，能瞬间提升植物的装饰格调。"
    ],
    linkedPlantIds: ['1066', '1061', '1063']
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
    intro: "工作压力大的时候，抬头看一眼桌上的那一抹绿，心情似乎也能瞬间平静下来。桌面植物不需要很大，但一定要精致、耐看，最重要的是——不能太难养，以免增加额外的负担。",
    content: [
      "多肉植物是桌面绿植的首选，而爱心球兰则以其独特的心形叶片成为了表达爱意（包括爱自己）的最佳载体。它生长缓慢，不会占据你宝贵的工作空间，极其耐旱的特性让你忙碌时忘记浇水也无妨。",
      "如果你喜欢更有生机和互动感的朋友，镜面草是完美工位伴侣。它圆圆的叶片在风中微微颤动，仿佛在为你加油打气。更重要的是，它对猫狗完全无毒，带回家也不用担心毛孩子的安全。",
      "而想要给沉闷的桌面一点色彩，油画竹芋绝对惊艳。它那如画般的叶片纹理，能在台灯下展现出细腻的色彩变化，工作累了盯着它发呆，就是最好的眼部SPA。"
    ],
    tips: [
      "桌面通常比较干燥，可以在植物旁边放一杯水增加局部湿度。",
      "小心不要把水浇到电脑或文件上，推荐使用长嘴壶。",
      "选择底部有托盘的花盆，防止漏水。"
    ],
    linkedPlantIds: ['1062', '1064', '1065']
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
    linkedPlantIds: ['1064', '1065', '1062']
  },
];

const { library, loadLibrary } = usePlantLibrary()

const defaultArticle = {
  title: 'Collection Title',
  subtitle: '',
  tag: 'Guide',
  image: '',
  author: '',
  publishDate: '',
  content: [],
  tips: []
}

const collection = reactive({ ...defaultArticle })

const emit = defineEmits(['back', 'openAI']);

const safeAreaTop = ref(0);
const loading = ref(true); // 加载状态
const error = ref(''); // 错误信息
// const linkedProducts = ref([])
const articleId = ref('');

const linkedProducts = computed(() => {
  const foundArticle = FEATURED_COLLECTIONS.find(item => item.id == articleId.value);
  Object.assign(collection, foundArticle);
  console.log('foundArticle', foundArticle)
  console.log(library.value)
  return foundArticle.linkedPlantIds.map(pid =>
    library.value.find(p => p.id == pid)
  ).filter(Boolean);

});


onLoad((options) => {
  console.log('页面参数:', options);

  // 从路由参数获取 id
  articleId.value = options.id;
  loadLibrary()

  // if (!plantId) {
  //   error.value = '未找到ID';
  //   loading.value = false;
  //   return;
  // }

  // 从 MOCK_PRODUCTS 中查找对应的植物
  // const foundArticle = FEATURED_COLLECTIONS.find(item => item.id == articleId);
  // console.log(foundArticle)
  // if (foundArticle) {
  //   // 更新响应式数据
  //   Object.assign(collection, foundArticle);
  //   linkedProducts.value = foundArticle.linkedPlantIds.map(pid =>
  //     MOCK_PRODUCTS.find(p => p.id == pid)
  //   ).filter(Boolean);
  //   // 可以在这里设置页面标题
  //   // uni.setNavigationBarTitle({
  //   //   title: plant.name
  //   // });

  //   // 模拟加载延迟
  //   setTimeout(() => {
  //     loading.value = false;
  //   }, 500);
  // } else {
  //   error.value = '未找到对应的信息';
  //   loading.value = false;

  //   // 设置为默认植物
  //   // Object.assign(plant, {
  //   //   ...defaultPlant,
  //   //   id: plantId,
  //   //   name: `植物 ${plantId}`
  //   // });
  // }

  // console.log('当前数据:', collection);
  // console.log('当前数据:', linkedProducts.value);
});

// 方法
const handleBack = () => {
  uni.navigateBack();
};

const handleToDetail = (id) => {
  uni.navigateTo({ url: '/pages-plants/plants/plantLibraryDetailNew/index?id=' + id });
};

const handleOpenAI = () => {
  emit('openAI');
};

// 辅助函数：驼峰转中划线 (用于 icon name 转换)
const toKebabCase = (str) => {
  if (!str) return '';
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};
</script>

<style scoped>
/* 隐藏滚动条 (Tailwind 可能不支持自定义滚动条伪类，需手动添加) */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>