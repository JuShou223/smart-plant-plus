<template>
  <view class="container font-sans">

    <!-- ==================== 0. 补货中视图 (NotFoundView) ==================== -->
    <view v-if="missingProductLibId" class="min-h-screen bg-white animate-fade-in flex flex-col pb-24 z-[300] relative">
      <view class="px-6 py-4 flex items-center gap-4 border-b border-slate-50"
        :style="{ paddingTop: safeAreaTop + 'px' }">
        <button @click="missingProductLibId = null"
          class="p-2 bg-slate-50 rounded-full border-none m-0 flex items-center justify-center">
          <text class="iconfont icon-lucide-chevron-left text-xl text-slate-600"></text>
        </button>
        <text class="font-bold text-slate-800 text-lg">补货状态</text>
      </view>
      <scroll-view scroll-y class="flex-1">
        <view class="p-10 text-center flex flex-col items-center">
          <view class="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 relative">
            <text class="iconfont icon-lucide-timer text-5xl text-amber-500 animate-pulse"></text>
            <view class="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
              <text class="iconfont icon-lucide-alert-circle text-xl text-amber-600"></text>
            </view>
          </view>
          <text class="text-xl font-black text-slate-900 mb-2 italic uppercase block">该品种上架中</text>
          <text class="text-sm text-slate-500 leading-relaxed max-w-xs block">
            您关注的 <text class="text-emerald-600 font-bold">{{ missingLibItemName }}</text> 正在培育基地进行最后的光照硬化，预计下周一开启抢购。
          </text>
          <button
            class="mt-8 flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all border-none m-0">
            <text class="iconfont icon-lucide-bell text-lg"></text>
            <text>开启到货提醒</text>
          </button>
        </view>
        <view class="px-6 mt-4">
          <view class="flex items-center justify-between mb-6">
            <text class="text-xs font-black text-slate-400 uppercase tracking-widest">猜你喜欢 Recommended</text>
            <view class="h-px bg-slate-100 flex-1 ml-4"></view>
          </view>
          <view class="grid grid-cols-2 gap-4">
            <view v-for="p in recommendations" :key="p.id" @click="handleRecommendClick(p)"
              class="bg-slate-50 rounded-2xl p-3 border border-transparent hover:border-emerald-100 transition-all">
              <image :src="p.image" class="w-full aspect-square object-cover rounded-xl mb-3 shadow-sm"
                mode="aspectFill" />
              <text class="text-xs font-bold text-slate-800 truncate px-1 block">{{ p.name }}</text>
              <view class="flex justify-between items-center mt-2 px-1">
                <text class="text-sm font-black text-emerald-600">¥{{ p.price }}</text>
                <view class="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <text class="iconfont icon-lucide-plus text-xs text-slate-400"></text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- ==================== 1. 商品详情页模式 (StoreProductDetail) ==================== -->
    <view v-else-if="selectedProduct" class="fixed inset-0 z-[200] bg-white animate-fade-in">
      <scroll-view scroll-y class="h-full pb-32">
        <view class="relative h-[50vh]">
          <image :src="selectedProduct.image" mode="aspectFill" class="w-full h-full" />
          <button @click="selectedProduct = null"
            class="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
            :style="{ marginTop: safeAreaTop + 'px' }">
            <text class="iconfont icon-lucide-chevron-left text-2xl text-white"></text>
          </button>
        </view>
        <view class="p-6 -mt-10 relative z-10 bg-white rounded-t-[2.5rem] min-h-[50vh]">
          <!-- Header Info -->
          <view class="flex justify-between items-start mb-4">
            <view class="flex-1 mr-4">
              <text class="text-2xl font-black text-slate-900 block leading-tight">{{ selectedProduct.name }}</text>
              <view class="flex items-center gap-2 mt-2 flex-wrap">
                <view class="bg-emerald-100 px-2 py-0.5 rounded text-emerald-700 text-xs font-bold">
                  {{ getCategoryLabel(selectedProduct.category) }}
                </view>
                <view v-if="selectedProduct.tag"
                  class="bg-rose-100 px-2 py-0.5 rounded text-rose-700 text-xs font-bold">
                  {{ selectedProduct.tag }}
                </view>
                <text class="text-xs text-slate-400">销量 {{ selectedProduct.sales }}</text>
              </view>
            </view>
            <view class="flex flex-col items-end shrink-0">
              <text class="text-3xl font-black text-emerald-600">¥{{ selectedProduct.price }}</text>
              <text v-if="selectedProduct.originalPrice" class="text-sm text-slate-300 line-through">¥{{
                selectedProduct.originalPrice }}</text>
            </view>
          </view>

          <!-- Library Link -->
          <view v-if="selectedProduct.libraryId" class="mb-6">
            <button @click="openLibrary(selectedProduct.libraryId)"
              class="w-full py-3 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-between px-4 border border-blue-100 active:bg-blue-100 transition-colors">
              <view class="flex items-center gap-2">
                <text class="iconfont icon-lucide-book-open text-lg"></text>
                <text class="text-xs font-bold">查看植物百科与养护指南</text>
              </view>
              <text class="iconfont icon-lucide-chevron-right text-sm"></text>
            </button>
          </view>

          <!-- Details & Specs -->
          <view class="space-y-8">
            <view v-if="selectedProduct.details">
              <text class="text-sm font-bold text-slate-900 block mb-2">商品详情</text>
              <text class="text-sm text-slate-500 leading-relaxed block">{{ selectedProduct.details }}</text>
            </view>

            <view v-if="selectedProduct.specs">
              <text class="text-sm font-bold text-slate-900 block mb-2">规格参数</text>
              <view class="grid grid-cols-2 gap-3">
                <view v-for="(spec, idx) in selectedProduct.specs" :key="idx" class="bg-slate-50 p-3 rounded-xl">
                  <text class="text-[10px] text-slate-400 block mb-1">{{ spec.label }}</text>
                  <text class="text-xs font-bold text-slate-700 block">{{ spec.value }}</text>
                </view>
              </view>
            </view>

            <view v-if="selectedProduct.usageSteps">
              <text class="text-sm font-bold text-slate-900 block mb-2">使用方法</text>
              <view class="space-y-2">
                <view v-for="(step, idx) in selectedProduct.usageSteps" :key="idx" class="flex gap-3">
                  <view
                    class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <text class="text-xs font-bold">{{ idx + 1 }}</text>
                  </view>
                  <text class="text-sm text-slate-600 leading-relaxed">{{ step }}</text>
                </view>
              </view>
            </view>

            <view v-if="selectedProduct.precautions">
              <view class="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <view class="flex items-center gap-2 mb-2">
                  <text class="iconfont icon-lucide-alert-circle text-rose-500 text-sm"></text>
                  <text class="text-xs font-bold text-rose-700">注意事项</text>
                </view>
                <view class="space-y-1">
                  <view v-for="(item, idx) in selectedProduct.precautions" :key="idx" class="flex gap-2">
                    <text class="text-rose-400 text-xs mt-1">•</text>
                    <text class="text-xs text-rose-600/80 leading-relaxed">{{ item }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- Detail Footer -->
      <view
        class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex items-center gap-4 pb-8 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <view @click="isCartOpen = true" class="relative p-3 bg-slate-50 rounded-xl cursor-pointer active:bg-slate-100">
          <text class="iconfont icon-lucide-shopping-bag text-xl text-slate-700"></text>
          <view v-if="cartCount > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {{ cartCount }}
          </view>
        </view>
        <view class="flex items-center border border-slate-200 rounded-xl h-12 px-2 bg-white">
          <button @click="detailQty = Math.max(1, detailQty - 1)"
            class="w-10 h-full flex items-center justify-center bg-transparent border-none text-slate-400 m-0"><text
              class="iconfont icon-lucide-minus"></text></button>
          <text class="w-8 text-center font-bold text-slate-800">{{ detailQty }}</text>
          <button @click="detailQty++"
            class="w-10 h-full flex items-center justify-center bg-transparent border-none text-slate-800 m-0"><text
              class="iconfont icon-lucide-plus"></text></button>
        </view>
        <button @click="handleAddToCartFromDetail"
          class="flex-1 h-12 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-transform border-none m-0">
          <text>加入购物车</text>
        </button>
      </view>
    </view>


    <!-- ==================== 2. 主商店列表模式 ==================== -->
    <view v-else class="pb-24 animate-fade-in bg-[#FAFAFA] min-h-screen relative">
      <!-- Header -->
      <view class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4"
        :style="{ paddingTop: safeAreaTop + 'px' }">
        <view class="flex items-center justify-between mb-4">
          <text class="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Smart Shop</text>
          <view @click="isCartOpen = true"
            class="relative p-2 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
            <text class="iconfont icon-lucide-shopping-bag text-xl text-slate-700"></text>
            <view v-if="cartCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-breathe">
              {{ cartCount }}
            </view>
          </view>
        </view>
        <view class="relative">
          <text
            class="iconfont icon-lucide-search absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"></text>
          <input type="text" placeholder="搜索传感器、治疗药剂或绿植..." v-model="searchQuery"
            class="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium h-10 box-border" />
        </view>
      </view>

      <!-- Category Slider -->
      <scroll-view scroll-x class="whitespace-nowrap w-full" :show-scrollbar="false">
        <view class="pt-6 px-6 flex gap-5 pb-2">
          <view v-for="cat in CATEGORIES" :key="cat.id" @click="activeCategory = cat.id"
            class="flex flex-col items-center gap-2 min-w-[140rpx] transition-all inline-flex"
            :class="activeCategory === cat.id ? 'scale-110 opacity-100' : 'opacity-60'">
            <view class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
              :class="activeCategory === cat.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border border-slate-100 text-slate-500'">
              <text class="iconfont text-2xl" :class="cat.icon"></text>
            </view>
            <text class="text-[10px] font-black uppercase tracking-widest"
              :class="activeCategory === cat.id ? 'text-slate-900' : 'text-slate-400'">
              {{ cat.label }}
            </text>
          </view>
        </view>
      </scroll-view>

      <!-- Product Grid -->
      <view class="px-6 mt-6 pb-24">
        <view class="grid grid-cols-2 gap-5">
          <view v-for="product in filteredProducts" :key="product.id" @click="openProductDetail(product)"
            class="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm flex flex-col h-full active:scale-[0.98] transition-all">
            <view class="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
              <image :src="product.image" mode="aspectFill" class="w-full h-full" />
              <view v-if="product.tag"
                class="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-wider">
                {{ product.tag }}
              </view>
            </view>
            <text
              class="font-bold text-slate-800 text-sm line-clamp-2 px-1 mb-2 leading-tight h-10 block overflow-hidden">{{
                product.name }}</text>
            <view class="mt-auto px-1 flex items-center justify-between">
              <view class="flex flex-col">
                <text class="text-base font-black text-emerald-600">¥{{ product.price }}</text>
              </view>
              <view @click.stop="handleQuickAdd(product)"
                class="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg active:bg-emerald-600 transition-colors">
                <text class="iconfont icon-lucide-plus text-sm"></text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Cart Modal -->
      <view v-if="isCartOpen" class="fixed inset-0 z-[120] flex items-end justify-center">
        <view class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" @click="isCartOpen = false">
        </view>
        <view
          class="bg-white w-full max-w-lg rounded-t-[3rem] p-8 relative z-10 animate-fade-in-up flex flex-col max-h-[85vh] shadow-2xl">
          <view class="flex items-center justify-between mb-8">
            <view>
              <text class="text-2xl font-black text-slate-900 italic uppercase block">我的购物车</text>
              <text class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 block">共 {{ cartCount }}
                件商品</text>
            </view>
            <button @click="isCartOpen = false"
              class="p-3 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors border-none m-0 flex items-center justify-center">
              <text class="iconfont icon-lucide-x text-lg"></text>
            </button>
          </view>

          <scroll-view scroll-y class="flex-1 space-y-6 pr-1" style="height: 0;">
            <template v-if="cart.length > 0">
              <view v-for="item in cart" :key="item.id" class="flex gap-5 items-center mb-6">
                <view
                  class="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 shadow-sm relative">
                  <image :src="item.image" mode="aspectFill" class="w-full h-full" />
                </view>
                <view class="flex-1 min-w-0">
                  <text class="font-bold text-slate-800 text-base truncate block">{{ item.name }}</text>
                  <view class="flex justify-between items-center mt-3">
                    <text class="text-emerald-600 font-black">¥{{ item.price }}</text>
                    <view class="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button @click="updateQuantity(item.id, -1)"
                        class="w-7 h-7 flex items-center justify-center text-slate-400 bg-transparent border-none p-0 m-0"><text
                          class="iconfont icon-lucide-minus text-xs"></text></button>
                      <text class="w-8 text-center text-xs font-black text-slate-900">{{ item.quantity }}</text>
                      <button @click="updateQuantity(item.id, 1)"
                        class="w-7 h-7 flex items-center justify-center text-slate-400 bg-transparent border-none p-0 m-0"><text
                          class="iconfont icon-lucide-plus text-xs"></text></button>
                    </view>
                  </view>
                </view>
              </view>
            </template>

            <view v-else class="py-20 text-center flex flex-col items-center">
              <text class="iconfont icon-lucide-shopping-bag text-4xl text-slate-100 mb-4"></text>
              <text class="text-slate-400 font-bold uppercase tracking-widest text-sm">购物车是空的</text>
            </view>
          </scroll-view>

          <view class="mt-8 pt-8 border-t border-slate-100">
            <view class="flex justify-between items-end mb-6">
              <text class="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">总金额</text>
              <text class="text-3xl font-black text-slate-900 italic">¥{{ cartTotal.toFixed(2) }}</text>
            </view>
            <button @click="handleCheckout" :disabled="isCheckingOut || cart.length === 0"
              class="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-none m-0 leading-normal"
              :class="(isCheckingOut || cart.length === 0) ? 'opacity-50' : ''">
              <view v-if="isCheckingOut" class="flex items-center gap-2">
                <view class="w-2 h-2 bg-white rounded-full animate-bounce"></view>
                <view class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></view>
                <view class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.4s"></view>
              </view>
              <template v-else>
                <text class="iconfont icon-lucide-credit-card text-lg"></text>
                <text>立即结算</text>
              </template>
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePlantLibrary } from '@/hooks/usePlantLibrary';

// ==================== Constants Data ====================

const CATEGORIES = [
  { id: 'all', label: '全部', icon: 'icon-lucide-layers' },
  { id: 'plant', label: '精品绿植', icon: 'icon-lucide-sprout' },
  { id: 'device', label: '智能硬件', icon: 'icon-lucide-cpu' },
  { id: 'medicine', label: '药剂肥料', icon: 'icon-lucide-flask-conical' },
  { id: 'tool', label: '园艺工具', icon: 'icon-lucide-scissors' },
  { id: 'soil', label: '配方土壤', icon: 'icon-lucide-droplets' },
];

const STORE_PRODUCTS = [
  /* --- 1. 智能硬件 --- */
  {
    id: 's100', category: 'device', name: 'SmartGreen V2 增强型传感器', price: 129, originalPrice: 159, image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=400&auto=format&fit=crop', rating: 5.0, sales: 1200, tag: '旗舰爆款',
    details: '搭载最新一代电化学传感器，支持土壤湿度、环境温湿度、光照、电导率(EC)监测。',
    specs: [{ label: '连接方式', value: '蓝牙 5.2 / Zigbee' }, { label: '防水等级', value: 'IP67 全身防水' }, { label: '续航时间', value: '365天' }],
    usageSteps: [
      '开启手机蓝牙并确保定位权限已打开',
      '将传感器金属探针垂直插入盆土 2/3 深度，避免碰撞石块',
      '在 APP 首页点击“添加设备”进行搜索配对',
      '配对完成后在设备详情中绑定对应的植物品种以激活预警'
    ],
    precautions: [
      '探针忌长时间浸泡在纯水中，以免传感器失效',
      '更换电池后请确保底部密封圈安装到位，否则将失去防水能力',
      '请勿在极寒环境（-10℃以下）长期暴露'
    ]
  },
  {
    id: 's102', category: 'device', name: 'WiFi 智能网关 V2', price: 88, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop', rating: 4.8, sales: 3500, tag: '远程必备',
    details: '让传感器数据实时上云，支持跨房间连接，覆盖半径达 15 米。',
    usageSteps: [
      '接入 Type-C 电源并插入插座',
      '等待指示灯蓝光闪烁，进入 APP 配对流程',
      '输入家庭 WiFi 密码完成组网',
      '将附近的蓝牙传感器添加至网关子设备列表即可实现远程监控'
    ],
    precautions: [
      '请避开大型金属遮挡物，以免信号大幅衰减',
      '建议安装在离地 1 米以上的开阔位置'
    ]
  },

  /* --- 2. 精品绿植 --- */
  {
    id: 'p1', category: 'plant', name: '白犀牛海芋 ( M-Size )', libraryId: 'lib-p1', price: 268, image: 'https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 240, tag: '稀缺品种',
    details: '海芋界的“银色奇迹”。叶片质感坚硬如鳞片，银灰色的金属光泽赋予了它极高的艺术装饰价值。',
    usageSteps: [
      '收到后请放置在阴凉通风处缓苗 3-5 天，切忌直接暴晒',
      '使用透气性极佳的颗粒土（颗粒石占比建议 50% 以上）',
      '保持环境湿度在 70% 以上，干燥季节需使用加湿器',
      '环境温度低于 15℃ 时需严格控水，使其进入休眠'
    ],
    precautions: [
      '海芋全株汁液有微量毒性，请放置在儿童和宠物触碰不到的地方',
      '忌盆土长期积水，否则极易诱发根腐病'
    ]
  },
  {
    id: 'p2', category: 'plant', name: '北欧琴叶榕 ( 1.2m )', libraryId: 'lib-p2', price: 189, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop', rating: 4.8, sales: 8500, tag: '人气王',
    details: '经典的阔叶植物，具有极强的耐阴性和空气净化能力。',
    usageSteps: [
      '放置在明亮散射光处，如窗边或阳台侧边',
      '盆土表面干透约 1/2 时进行浇水，直到盆底流出水为止',
      '定期用温湿抹布清洁巨大的叶面，有助于植物呼吸',
      '春季生长期建议每两周施用一次高氮水溶肥'
    ],
    precautions: [
      '严禁突然改变光照环境（如从阴暗处搬到烈日下），会导致叶片晒伤脱落',
      '对空调直吹非常敏感，应避开出风口'
    ]
  },
  {
    id: 'p3', category: 'plant', name: '北欧原生 橄榄树 ( L-Size )', libraryId: 'lib-p3', price: 450, image: 'https://images.unsplash.com/photo-1615485737457-f07082c77813?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 600, tag: '中古风',
    details: '地中海风格的灵魂绿植。银绿色的叶片在阳光下闪烁，极具电影感的骨架形态。',
    usageSteps: [
      '橄榄树极度喜阳，必须摆放在全日照环境',
      '遵循“宁干勿湿”原则，土面下 3cm 干透后再浇水',
      '定期修剪交叉枝和过密枝，以保持其艺术化的骨架感'
    ],
    precautions: [
      '不耐阴，长期光照不足会导致严重掉叶',
      '冬季室温不宜过高，适当的低温（5-10℃）有利于翌年花芽分化'
    ]
  },

  /* --- 3. 药剂肥料 --- */
  {
    id: 's1', category: 'medicine', name: '日本住友 小白药 (内吸型)', price: 28, image: 'https://images.unsplash.com/photo-1628608832049-563b72803893?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 5300, tag: '杀虫必备',
    usageSteps: [
      '每 10cm 盆径使用 1-2g 药剂',
      '均匀撒在盆土表面',
      '使用耙子轻轻划锄入土 1-2cm',
      '浇透水以利于药剂溶解并被根系内吸'
    ],
    precautions: [
      '本品为内吸杀虫剂，仅对取食汁液的害虫有效',
      '请务必密封保存在阴凉处，严禁儿童接触'
    ]
  },
  {
    id: 's6', category: 'medicine', name: '广谱杀菌 多菌灵 (50g)', price: 15, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop', rating: 4.8, sales: 9200, tag: '根腐克星',
    usageSteps: [
      '日常预防：1g 兑水 1000ml 进行全株喷洒',
      '治疗烂根：1g 兑水 500ml 稀释后进行根部灌溉',
      '伤口处理：直接将药粉涂抹在修剪后的植物剪口处'
    ],
    precautions: [
      '不可与强碱性农药混用',
      '建议在傍晚或阴天使用，避免高温强光'
    ]
  },
  {
    id: 's7', category: 'medicine', name: '高活性 生根粉 (速效)', price: 12, image: 'https://images.unsplash.com/photo-1599591037488-82605663787c?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 8500, tag: '促根神器',
    usageSteps: [
      '扦插：1g 兑水 500ml，插穗浸泡 2 小时',
      '移栽：1g 兑水 1000ml 灌根，诱发新根萌发',
      '叶喷：1g 兑水 2000ml，增强植物抗性'
    ]
  },
  {
    id: 's8', category: 'medicine', name: '螯合铁液 (黄叶转绿)', price: 32, image: 'https://images.unsplash.com/photo-1587334274328-641c50ce3f05?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 1500, tag: '补铁专用',
    usageSteps: [
      '针对新叶发黄但脉络保持绿色的“缺铁症”',
      '取 5ml 原液兑水 1000ml 稀释',
      '进行全株叶面喷施，正反面均需喷到',
      '每隔 10 天使用一次，连续使用 3 次'
    ],
    precautions: [
      '避开中午高温，以免烧叶'
    ]
  },
  {
    id: 's9', category: 'medicine', name: '高纯 磷酸二氢钾', price: 25, image: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?q=80&w=400&auto=format&fit=crop', rating: 5.0, sales: 12000, tag: '促花保果',
    usageSteps: [
      '花期前一个月开始使用',
      '1g 兑水 1000ml 稀释',
      '每周进行一次叶面喷施或根部浇灌',
      '有助于茎干粗壮和花芽分化'
    ]
  },
  {
    id: 's10', category: 'medicine', name: '速效 补氮水溶肥', price: 18, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop', rating: 4.7, sales: 3200, tag: '长叶专用',
    usageSteps: [
      '针对生长期缓慢、全株发黄的情况',
      '稀释比例 1:1000',
      '仅在生长期（春季、初夏）使用',
      '结合浇水同步进行'
    ]
  },

  /* --- 4. 工具及土壤 --- */
  {
    id: 't1', category: 'tool', name: '纳米 细雾喷壶 (300ml)', price: 39, image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 5600, tag: '雾化极佳',
    usageSteps: [
      '注入清水或稀释后的肥料/药剂',
      '连续按压手柄以产生持续的超细水雾',
      '适合喷洒热带植物叶面以增加环境湿度'
    ]
  },
  {
    id: 't2', category: 'tool', name: '日本原产 园艺剪', price: 188, image: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?q=80&w=400&auto=format&fit=crop', rating: 5.0, sales: 890, tag: '专业之选',
    usageSteps: [
      '修剪残花：在花下第一对叶片处斜剪',
      '疏剪密枝：靠近主干基部平剪',
      '修根：剪除黑腐烂根'
    ],
    precautions: [
      '使用后请擦干汁液并涂油防锈',
      '刀刃极度锋利，严禁儿童玩耍'
    ]
  },
  {
    id: 'm1', category: 'soil', name: '进口泥炭通用土 (10L)', price: 45, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop', rating: 4.8, sales: 9200, tag: '松软透气',
    usageSteps: [
      '直接作为主基质使用',
      '建议根据植物习性加入 20%-40% 的颗粒石',
      '上盆前建议先用水淋至微潮状态'
    ]
  },
  {
    id: 'm2', category: 'soil', name: '轻质 颗粒土调配包', price: 38, image: 'https://images.unsplash.com/photo-1620127435905-645069796071?q=80&w=400&auto=format&fit=crop', rating: 4.9, sales: 4500, tag: '多肉专用',
    usageSteps: [
      '包含麦饭石、火山岩、珍珠岩等',
      '适合与泥炭土 7:3 或 8:2 混合使用',
      '提供绝佳的排水性和透气性，防止闷根'
    ]
  }
];

// ==================== Hooks & Data ====================
// 使用之前定义的 Hook 来获取植物库数据，用于 NotFoundView 显示
const { library, loadLibrary } = usePlantLibrary();

// ==================== State ====================
const activeCategory = ref('all');
const selectedProduct = ref(null);
const missingProductLibId = ref(null);
const isCartOpen = ref(false);
const isCheckingOut = ref(false);
const searchQuery = ref('');
const cart = ref([]);
const detailQty = ref(1);
const safeAreaTop = ref(44);

// ==================== Computed ====================
const filteredProducts = computed(() => {
  return STORE_PRODUCTS.filter(p => {
    const matchesCategory = activeCategory.value === 'all' || p.category === activeCategory.value;
    const matchesSearch = p.name.includes(searchQuery.value);
    return matchesCategory && matchesSearch;
  });
});

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

const missingLibItemName = computed(() => {
  if (!missingProductLibId.value) return '稀有品种';
  const item = library.value.find(l => l.id === missingProductLibId.value);
  return item ? item.name : '稀有品种';
});

const recommendations = computed(() => {
  return STORE_PRODUCTS.filter(p => p.category === 'plant').slice(0, 4);
});

// ==================== Methods ====================

const getCategoryLabel = (catId) => {
  return CATEGORIES.find(c => c.id === catId)?.label || catId;
}

const openProductDetail = (product) => {
  selectedProduct.value = product;
  detailQty.value = 1;
};

// Cart Logic
const addToCart = (product) => {
  const existing = cart.value.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
  uni.vibrateShort(); // Haptic feedback
};

const handleQuickAdd = (product) => {
  addToCart(product);
  uni.showToast({ title: '已加入购物车', icon: 'none' });
};

const handleAddToCartFromDetail = () => {
  if (!selectedProduct.value) return;

  const existing = cart.value.find(item => item.id === selectedProduct.value.id);
  if (existing) {
    existing.quantity += detailQty.value;
  } else {
    cart.value.push({ ...selectedProduct.value, quantity: detailQty.value });
  }

  uni.showToast({ title: '已加入购物车', icon: 'success' });
  isCartOpen.value = true;
  selectedProduct.value = null; // Close detail
};

const removeFromCart = (productId) => {
  const index = cart.value.findIndex(item => item.id === productId);
  if (index > -1) cart.value.splice(index, 1);
};

const updateQuantity = (productId, delta) => {
  const item = cart.value.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    }
  }
};

const clearCart = () => {
  cart.value = [];
};

const handleCheckout = () => {
  if (cart.value.length === 0) return;
  isCheckingOut.value = true;
  setTimeout(() => {
    isCheckingOut.value = false;
    isCartOpen.value = false;
    clearCart();
    uni.showToast({ title: '支付成功！', icon: 'success' });
  }, 2000);
};

// Navigation
const openLibrary = (libraryId) => {
  // 假设 libraryId 对应的就是植物的 ID，跳转到详情页
  // 这里需要解析 libraryId，因为 mock 数据中是 'lib-p1' 这种格式，
  // 而实际 plant library 可能用不同的 ID。这里简单做个映射或者直接跳转。
  // 如果 libraryId 对应的是植物库列表的某个筛选，则跳列表。
  // 如果对应的是植物详情，则跳植物详情。
  // 这里假设跳植物详情：
  const plantId = libraryId.replace('lib-', ''); // 简单处理
  uni.navigateTo({
    url: `/pages-plants/plants/myPlantDetail/index?plantId=${plantId}`
  });
};

const handleRecommendClick = (p) => {
  missingProductLibId.value = null;
  selectedProduct.value = p;
};

// Lifecycle
onLoad((options) => {
  const sys = uni.getSystemInfoSync();
  if (sys.safeAreaInsets?.top) {
    safeAreaTop.value = sys.safeAreaInsets.top;
  }

  loadLibrary(); // Ensure library data is loaded for NotFoundView

  if (options.productId) {
    const id = options.productId;
    if (id.startsWith('missing-')) {
      missingProductLibId.value = id.replace('missing-', '');
      selectedProduct.value = null;
    } else {
      const product = STORE_PRODUCTS.find(p => p.id === id);
      if (product) {
        selectedProduct.value = product;
        missingProductLibId.value = null;
      }
    }
  }
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

@keyframes breathe {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.animate-breathe {
  animation: breathe 2s infinite ease-in-out;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

.animate-bounce {
  animation: bounce 0.6s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>