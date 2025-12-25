<template>
  <view class="min-h-screen bg-[#FFFFFF] pb-24 relative z-50">
    <view class="animate-fade-in ">
      <up-navbar bgColor="transparent" fixed>
        <template #left>
          <hws-header inNavbar>
            <view class="flex align-center justify-between w-full">
              <!-- <view class="w-full box-border border-solid left-0 p-4 flex justify-between items-center z-10"> -->
              <button v-if="!isEditing" @click="handleBack"
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-solid border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
                <text class="iconfont icon-lucide-chevron-left text-2xl"></text>
              </button>
              <button v-else @click="toggleEdit"
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-solid border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95 m-0 p-0 leading-none">
                <text class="iconfont icon-lucide-x text-2xl"></text>
              </button>
              <view class="flex">
                <!-- <view v-if="!isEditing"
                  class="mr-2 box-border bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-solid border-white/10 text-white text-xs font-bold flex items-center gap-1.5">
                  <text class="iconfont icon-lucide-map-pin text-xs"></text>
                  <text>{{ plant.location || '未设置位置' }}</text>
                </view> -->
                <button @click="toggleEdit"
                  class="w-10 h-10 rounded-full backdrop-blur-md border border-solid border-white/10 flex items-center justify-center transition-all m-0 p-0 leading-none"
                  :class="isEditing ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white active:bg-white active:text-emerald-600'">
                  <text class="iconfont text-xl"
                    :class="isEditing ? 'icon-lucide-check' : 'icon-lucide-settings'"></text>
                </button>
              </view>
            </view>
          </hws-header>
          <!-- </view> -->
        </template>
      </up-navbar>



      <view v-if="plant.id" class="relative h-[45vh] w-full">
        <image v-if="isEditing" :url="editForm.image" :src="editForm.image" mode="aspectFill" class="w-full h-full" />
        <image v-else :url="plant.plantImage" :src="plant.plantImage" mode="aspectFill" class="w-full h-full" />
        <!-- Change Image Trigger in Edit Mode -->
        <view v-if="isEditing" class="absolute inset-0 flex items-center justify-center z-10">
          <button @click="handleChangeImage"
            class="bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 border border-white/20 shadow-xl active:bg-black/60 transition-all m-0">
            <text class="iconfont icon-lucide-camera text-xl"></text>
            <text class="font-bold">更换照片</text>
          </button>
        </view>
        <view :class="isEditing ? 'bg-[rgba(0,0,0,0.5)]' : 'bg-gradient-to-b'"
          class="absolute inset-0 from-black/40 via-transparent to-[#F8F9FA]"></view>
        <view class="absolute bottom-0 left-0 right-0 p-6 z-20">
          <view class="flex items-end justify-between mb-2">
            <view v-if="isEditing" class="space-y-3">
              <input type="text" v-model="editForm.name"
                class="mb-3 bg-white/20 backdrop-blur-md border-2 border-solid border-white/40 rounded-xl px-4 py-2 text-2xl font-bold text-white outline-none focus:border-emerald-400 transition-all placeholder-white/50"
                placeholder="输入植物名字..." />
              <view class="w-full">
                <view class="flex gap-2 pb-2">
                  <view v-for="loc in LOCATIONS" :key="loc.id" @click="editForm.location = loc"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-solid shrink-0 inline-flex"
                    :class="editForm.location === loc ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/10 text-white border-white/20'">
                    <!-- <text class="iconfont text-xs" :class="loc.icon"></text> -->
                    <text>{{ loc }}</text>
                  </view>
                </view>
              </view>
            </view>
            <view v-else>
              <view
                class="bg-emerald-500 text-white text-[20rpx] font-bold px-2 py-0.5 rounded-md w-fit mb-1 shadow-sm flex items-center gap-1 leading-none">
                <text class="iconfont icon-lucide-map-pin text-xs"></text>
                <text>{{ plant.location || '未设置位置' }}</text>
              </view>
              <view class="flex items-center">

                <view>
                  <text class="block text-3xl font-bold text-slate-800 leading-tight">{{ plant.plantName }}</text>
                  <text class="block text-sm text-slate-500 font-serif italic mt-1">{{ plant.species }}</text>
                </view>
                <button @click="handleGoLibrary"
                  class="ml-2 px-2 py-1 font-bold text-emerald-600 bg-white/60 rounded-lg hover:bg-white transition-colors flex items-center leading-none px-2">
                  <text class="text-xs leading-none">查看百科</text>
                  <text class="text-xs leading-none iconfont icon-lucide-arrow-right"></text>
                  <!-- <ArrowRight className="w-3 h-3" /> -->
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="plant.id" class="px-6 space-y-8 -mt-4 relative z-20">
        <!-- Edit Save Button Floating (Visual reminder) -->
        <view v-if="isEditing" class="animate-fade-in-up flex gap-3 justify-center">
          <button @click="showDeleteConfirm = true"
            class="bg-white text-rose-500 px-6 py-3 rounded-full font-bold shadow-xl border border-solid border-rose-100 flex items-center gap-2 active:bg-rose-50 transition-all m-0 leading-normal">
            <text class="iconfont icon-lucide-trash-2 text-lg"></text>
            <text>移除</text>
          </button>
          <button @click="handleSaveEdit"
            class="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-emerald-200 flex items-center gap-2 active:bg-emerald-700 transition-all m-0 leading-normal">
            <text class="iconfont icon-lucide-check text-lg"></text>
            <text>保存修改</text>
          </button>
        </view>

        <view v-else>
          <view v-if="!plant.healthCondition || plant.healthCondition === 'healthy'"
            class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-solid border-emerald-100 rounded-2xl p-5 mb-6 flex items-start gap-4 shadow-sm">
            <view class="bg-emerald-100 p-2.5 rounded-full shrink-0">
              <text class="iconfont icon-lucide-sparkles text-2xl text-emerald-600 leading-none"></text>
            </view>
            <view>
              <text class="block font-bold text-emerald-900 text-base">状态极佳</text>
              <text class="block text-xs text-emerald-700/80 mt-1 leading-relaxed">
                各项生长指标均在理想范围内。植物生机勃勃，请继续保持当前的养护节奏。
              </text>
            </view>
          </view>
          <view v-else>
            <view v-for="(healthConfig, index) in healthConfigs" :key="index"
              class="border border-solid rounded-2xl p-5 mb-6 shadow-sm relative overflow-hidden transition-all duration-500"
              :class="[healthConfig.bg, healthConfig.border]">
              <text class="iconfont absolute -right-4 -top-4 text-[96px] opacity-10 rotate-12"
                :class="[healthConfig.iconClass, healthConfig.textColor]"></text>

              <view class="relative z-10 flex items-start gap-4">
                <view class="p-2.5 rounded-full shrink-0 shadow-sm flex-shrink-0" :class="healthConfig.bgIcon">
                  <text class="iconfont text-xl leading-none"
                    :class="[healthConfig.iconClass, healthConfig.iconColor]"></text>
                </view>
                <view class="flex-1">
                  <view class="flex justify-between items-start">
                    <text class="font-bold text-base" :class="healthConfig.textColor">{{ healthConfig.title }}</text>
                    <text class="text-[20rpx] font-bold px-2 py-0.5 rounded-full bg-white/60"
                      :class="healthConfig.textColor">
                      需要处理
                    </text>
                  </view>

                  <text class="block text-xs opacity-90 mt-2 leading-relaxed font-medium"
                    :class="healthConfig.textColor">
                    {{ healthConfig.desc }}
                  </text>

                  <view v-if="healthConfig.hasDetail"
                    class="mt-3 bg-white/60 rounded-xl p-3 border border-solid border-white/40">
                    <view class="space-y-2">
                      <view v-for="(item, idx) in healthConfig.details" :key="idx"
                        class="flex justify-between items-center text-xs border-b border-dashed border-slate-300/30 pb-1.5 last:border-0 last:pb-0">
                        <text class="opacity-70" :class="healthConfig.textColor">{{ item.label }}</text>
                        <text class="font-bold" :class="healthConfig.textColor">{{ item.val }}</text>
                      </view>
                    </view>
                    <view v-if="healthConfig.tip" class="mt-2 text-[20rpx] opacity-80 flex items-start gap-1"
                      :class="healthConfig.textColor">
                      <text class="font-bold shrink-0">💡 提示:</text>
                      <text>{{ healthConfig.tip }}</text>
                    </view>
                  </view>

                  <view class="mt-4 flex items-center gap-2">
                    <button @click="handleHealthAction"
                      class="px-4 py-2 bg-white text-xs font-bold rounded-lg shadow-sm border border-solid border-transparent flex items-center gap-1.5 active:scale-95 transition-transform m-0"
                      :class="[healthConfig.textColor, `hover:border-${healthConfig.color}-200`]">
                      <text class="iconfont text-sm"
                        :class="plant.healthCondition === 'pest' ? 'icon-lucide-stethoscope' : 'icon-lucide-circle-check'"></text>
                      <text>{{ healthConfig.action }}</text>
                    </button>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="-mt-4">
          <view class="flex items-center justify-between mb-4">
            <view class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <text class="iconfont icon-lucide-activity text-xl text-emerald-600"></text>
              <text>实时监控</text>
            </view>
            <view class="flex items-center">
              <text v-if="currentSensorData.length > 0"
                class="text-[20rpx] text-slate-400 bg-white px-2 py-1 rounded-full shadow-sm border border-solid border-slate-100">
                {{ latestTime }}
              </text>
              <view v-if="currentSensorData.length > 0" @click="showUnbindModal = true"
                class="ml-2 px-2 py-1 bg-slate-100 text-slate-400 text-[20rpx] font-bold rounded-lg hover:bg-slate-200 inline-block m-0">
                解除绑定
              </view>
            </view>


          </view>

          <view v-if="currentSensorData.length > 0" class="grid grid-cols-2 gap-3">
            <view v-for="(metric, index) in sensorMetrics" :key="index"
              class="rounded-2xl p-4 border border-solid border-white/50 shadow-sm relative overflow-hidden"
              :class="metric.themeStyles.bg">
              <view class="flex justify-between items-start mb-3 relative z-10">
                <view class="p-2 rounded-xl" :class="metric.themeStyles.iconBg">
                  <text class="iconfont text-xl leading-none"
                    :class="[metric.iconClass, metric.themeStyles.icon]"></text>
                </view>
                <text class="text-xs font-bold px-2 py-1 rounded-full bg-white/60" :class="metric.statusInfo.color">
                  {{ metric.statusInfo.status }}
                </text>
              </view>

              <view class="relative z-10">
                <text class="text-xs text-slate-500 font-medium block mb-0.5">{{ metric.label }}</text>
                <view class="flex items-baseline space-x-1">
                  <text class="text-2xl font-bold text-slate-800">{{ metric.value !== undefined ? metric.value : '--'
                  }}</text>
                  <text class="text-xs text-slate-400 font-medium">{{ metric.unit }}</text>
                </view>
                <view class="mt-2 text-[20rpx] text-slate-400 flex items-center">
                  <text class="mr-1">目标:</text>
                  <text class="font-mono">{{ metric.range.min }}-{{ metric.range.max }}</text>
                </view>
              </view>

              <view class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <view class="h-full transition-all duration-1000" :class="metric.themeStyles.bar"
                  :style="{ width: metric.percentage + '%' }"></view>
              </view>
            </view>
          </view>

          <view v-else class="bg-white rounded-2xl p-8 border border-solid border-dashed border-slate-200 text-center">
            <text class="iconfont icon-lucide-activity text-4xl text-slate-200 mx-auto mb-3 block"></text>
            <text class="text-slate-400 text-sm block">未连接传感器设备</text>
            <button @click="showAddSensorModal = true"
              class="mt-4 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 inline-block m-0">
              绑定设备
            </button>
          </view>
        </view>

        <!-- <view
        class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden group">
        <view
          class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none">
        </view>
        <view class="relative z-10">
          <text class="block text-lg font-bold mb-1">AI 智能诊断</text>
          <text class="block text-emerald-100 text-xs mb-4 max-w-[80%]">
            基于当前传感器数据，让 Gemini AI 为您生成详细的健康报告和养护建议。
          </text>
          <button @click="onAnalyze(plant, sensorData)"
            class="bg-white text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-2 m-0 w-fit">
            <text class="iconfont icon-lucide-activity text-base"></text>
            <text>开始诊断</text>
          </button>
        </view>
      </view> -->

        <!-- <view>
        <view class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <text class="iconfont icon-lucide-circle-check text-xl text-emerald-600"></text>
          <text>养护作业</text>
        </view>
        <view class="grid grid-cols-4 gap-3">
          <view v-for="(action, index) in actionButtons" :key="index" @click="handleCareAction(action.type)"
            class="flex flex-col items-center p-3 rounded-2xl bg-white border border-solid border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 active:scale-95 transition-all group">
            <view
              class="w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
              :class="action.colorClass">
              <text class="iconfont text-xl" :class="action.iconClass"></text>
            </view>
            <text class="text-xs font-bold text-slate-700">{{ action.label }}</text>
            <view class="text-[20rpx] text-slate-400 mt-1 flex items-center">
              <text class="iconfont icon-lucide-history text-xs mr-0.5"></text>
              <text>{{ careHistory[action.type] }}</text>
            </view>
          </view>
        </view>
      </view> -->

        <!-- <view>
        <view class="flex items-center justify-between mb-4">
          <view class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <text class="iconfont icon-lucide-history text-xl text-emerald-600"></text>
            <text>近期记录</text>
          </view>
          <text class="text-xs font-bold text-emerald-600 hover:text-emerald-700">查看更多</text>
        </view>
        <view class="bg-white rounded-2xl p-5 shadow-sm border border-solid border-slate-100">
          <view class="space-y-5 relative">
            <view class="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-100"></view>

            <view v-for="log in logs" :key="log.id" class="relative pl-10 flex items-center justify-between group">
              <view
                class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10"
                :class="[log.bg, log.color]">
                <text class="iconfont text-base" :class="log.iconClass"></text>
              </view>

              <view>
                <text class="block text-sm font-bold text-slate-700">{{ log.label }}</text>
                <text class="block text-[20rpx] text-slate-400">常规养护操作</text>
              </view>
              <view class="flex items-center text-[20rpx] text-slate-400 font-medium">
                <text class="iconfont icon-lucide-clock text-xs mr-1"></text>
                <text>{{ log.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view> -->

        <view>
          <view class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <text class="iconfont icon-lucide-book-open text-xl text-emerald-600"></text>
            <text>详细养护指引</text>
          </view>

          <view class="space-y-4">

            <view
              class="bg-white rounded-2xl p-5 border border-solid border-blue-50 shadow-sm relative overflow-hidden">
              <view class="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 blur-xl"></view>

              <view class="relative z-10">
                <view class="flex items-center justify-between mb-3">
                  <view class="flex items-center gap-2">
                    <view class="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <text class="iconfont text-xl leading-none" :class="waterStrat.iconClass"></text>
                    </view>
                    <text class="font-bold text-slate-800">水分管理</text>
                  </view>
                  <view class="text-[20rpx] font-bold px-2 py-1 rounded-md" :class="waterStrat.color">
                    {{ waterStrat.tag }}
                  </view>
                </view>

                <text class="block text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  {{ waterStrat.desc }}
                </text>

                <view class="flex gap-2">
                  <view
                    class="flex-1 bg-slate-50 rounded-lg p-3 flex flex-col items-center text-center gap-1 border border-solid border-slate-100">
                    <text class="iconfont icon-lucide-thumbs-up text-base text-emerald-500 mb-1"></text>
                    <text class="text-[20rpx] text-slate-400 block">建议</text>
                    <text class="text-xs font-bold text-slate-700 block">{{ waterStrat.tip }}</text>
                  </view>
                  <view
                    class="flex-1 bg-slate-50 rounded-lg p-3 flex flex-col items-center text-center gap-1 border border-solid border-slate-100">
                    <text class="iconfont icon-lucide-ban text-base text-rose-500 mb-1"></text>
                    <text class="text-[20rpx] text-slate-400 block">避免</text>
                    <text class="text-xs font-bold text-slate-700 block">盆内积水</text>
                  </view>
                </view>
              </view>
            </view>

            <view
              class="bg-white rounded-2xl p-5 border border-solid border-amber-50 shadow-sm relative overflow-hidden">
              <view class="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -mr-10 -mt-10 blur-xl"></view>

              <view class="relative z-10">
                <view class="flex items-center justify-between mb-3">
                  <view class="flex items-center gap-2">
                    <view class="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <text class="iconfont text-xl leading-none" :class="lightStrat.iconClass"></text>
                    </view>
                    <text class="font-bold text-slate-800">光照方案</text>
                  </view>
                  <text class="text-[20rpx] font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-700">
                    {{ lightStrat.tag }}
                  </text>
                </view>

                <text class="block text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  {{ lightStrat.desc }}
                </text>

                <view
                  class="flex items-center gap-2 text-xs text-amber-700 bg-amber-50/50 p-3 rounded-xl border border-solid border-amber-100/50">
                  <text class="iconfont icon-lucide-triangle-alert text-base shrink-0"></text>
                  <text>注意：{{ lightStrat.avoid }}</text>
                </view>
              </view>
            </view>

            <view class="grid grid-cols-2 gap-4">
              <view class="bg-white rounded-2xl p-4 border border-solid border-slate-100 shadow-sm">
                <view class="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
                  <text class="iconfont icon-lucide-thermometer-sun text-base text-orange-500"></text>
                  <text>温度范围</text>
                </view>
                <view class="text-xs text-slate-500 leading-relaxed">
                  最适生长温度 <text class="font-bold text-slate-700">{{ plant.requirements.temperature.min }}-{{
                    plant.requirements.temperature.max }}°C</text>。冬季需防寒。
                </view>
              </view>
              <view class="bg-white rounded-2xl p-4 border border-solid border-slate-100 shadow-sm">
                <view class="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
                  <text class="iconfont icon-lucide-wind text-base text-teal-500"></text>
                  <text>环境通风</text>
                </view>
                <text class="text-xs text-slate-500 leading-relaxed block">
                  保持环境通风良好，特别是浇水后，防止细菌滋生。
                </text>
              </view>
            </view>

          </view>
        </view>

      </view>
    </view>
    <view v-if="showDeleteConfirm"
      class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <view class="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-fade-in-up">
        <view class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <text class="iconfont icon-lucide-triangle-alert text-3xl text-red-500"></text>
        </view>
        <text class="block text-xl font-bold text-slate-900 text-center mb-2">移除此植物？</text>
        <text class="block text-sm text-slate-500 text-center mb-8 leading-relaxed">
          移除后将无法查看该植物的历史养护记录和诊断报告。绑定的传感器将恢复空闲状态。
        </text>
        <view class="flex gap-4">
          <button @click="showDeleteConfirm = false"
            class="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 border-none m-0 leading-normal">取消</button>
          <button @click="handleDelete"
            class="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 border-none m-0 leading-normal">确认移除</button>
        </view>
      </view>
    </view>
    <addSensorModal v-if="showAddSensorModal" :plant="plant" @close="showAddSensorModal = false"
      @confirm="handleBindPlant">
    </addSensorModal>
    <hws-unbind-modal :sensorId="sensorId" :plantName="plant.plantName" v-if="showUnbindModal"
      @close="showUnbindModal = false" @success="handleUnbindSuccess"></hws-unbind-modal>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { loadSinglePlant } from '@/hooks/usePlants';
import { getDeviceDetail, getLatestTime } from '@/hooks/useDevices'
import { onLoad } from '@dcloudio/uni-app';
import addSensorModal from '@/components/addSensorModal.vue';
import { serviceInvoke } from '@/apis/modules/runtime.js';
import upload from '@/utils/upload';
import { bindPlant } from "@/apis/modules/sensors";
import {
  updatePlant,
  deletePlant
} from '@/apis/modules/plants';
import projectConfig from '@/env.config.js';
import bus from '@/common/bus.js';

const handleBack = () => uni.navigateBack();
const onAnalyze = (plant, data) => emit('analyze', plant, data);

// ==================== Constants ====================
const LOCATIONS = ['客厅', '阳台', '卧室', '书房', '办公室', '花园'];

// State
const careHistory = ref({
  water: '2天前',
  fertilize: '15天前',
  prune: '1个月前',
  clean: '5天前'
});
const logs = ref([
  { id: '1', label: '浇水', time: '10月24日 09:30', iconClass: 'icon-lucide-droplets', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: '2', label: '修剪', time: '10月20日 15:45', iconClass: 'icon-lucide-scissors', color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: '3', label: '施肥', time: '10月15日 10:00', iconClass: 'icon-lucide-sprout', color: 'text-amber-600', bg: 'bg-amber-100' },
]);
const currentSensorData = ref([]);
const plant = reactive({})
const sensorData = reactive({
  deviceId: '',
  id: ''
})
const sensorId = ref('')
const isEditing = ref(false);
const showDeleteConfirm = ref(false);
const showAddSensorModal = ref(false)
const editForm = reactive({
  name: '',
  location: '',
  image: ''
});
const showUnbindModal = ref(false)

// Action Buttons Config
const actionButtons = [
  { type: 'water', iconClass: 'icon-lucide-droplets', label: '浇水', colorClass: 'bg-blue-100 text-blue-600' },
  { type: 'fertilize', iconClass: 'icon-lucide-sprout', label: '施肥', colorClass: 'bg-amber-100 text-amber-600' },
  { type: 'prune', iconClass: 'icon-lucide-scissors', label: '修剪', colorClass: 'bg-rose-100 text-rose-600' },
  { type: 'clean', iconClass: 'icon-lucide-sparkles', label: '清洁', colorClass: 'bg-teal-100 text-teal-600' },
];

const handleCareAction = (type) => {
  // 1. Update text
  careHistory.value[type] = '刚刚';

  // 2. Add log
  const config = {
    water: { label: '浇水', iconClass: 'icon-lucide-droplets', color: 'text-blue-600', bg: 'bg-blue-100' },
    fertilize: { label: '施肥', iconClass: 'icon-lucide-sprout', color: 'text-amber-600', bg: 'bg-amber-100' },
    prune: { label: '修剪', iconClass: 'icon-lucide-scissors', color: 'text-rose-600', bg: 'bg-rose-100' },
    clean: { label: '清洁', iconClass: 'icon-lucide-sparkles', color: 'text-teal-600', bg: 'bg-teal-100' },
  }[type];

  const newLog = {
    id: Date.now().toString(),
    label: config.label,
    time: '刚刚',
    iconClass: config.iconClass,
    color: config.color,
    bg: config.bg
  };

  logs.value.unshift(newLog);
};

const handleHealthAction = () => {
  if (plant.healthCondition === 'pest') {
    onAnalyze(plant, sensorData);
  } else {
    handleCareAction('water');
  }
};

const toggleEdit = () => {
  if (isEditing.value) {
    // handleBack(); // Cancel edit acts like back in React logic, here we toggle
    isEditing.value = false;
  } else {
    editForm.name = plant.plantName;
    editForm.location = plant.location;
    editForm.image = plant.plantImage;
    isEditing.value = true;
  }
};

const handleChangeImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      editForm.image = tempFilePath; // 设置预览图
    }
  });
};

const handleSaveEdit = async () => {
  if (!editForm.name.trim()) return;
  const pattern = /^(https?:\/\/)/;
  let imageUrl = editForm.image;
  console.log('Image URL:', imageUrl);
  console.log('Pattern Test:', pattern.test(imageUrl));
  if (!pattern.test(imageUrl)) {
    const uploadResult = await upload({
      url: '/common/upload',
      method: 'post',
      filePath: imageUrl,
    });
    if (uploadResult.code === 200) {
      imageUrl = projectConfig.baseUrl + uploadResult.fileName;
    } else {
      throw new Error('图片上传失败');
    }
  }
  // Call API to update plant
  const updateData = {
    plantId: plant.id,
    plantName: editForm.name,
    location: editForm.location,
    plantImage: imageUrl,
    plantType: 1
  };
  const response = await updatePlant(plant.id, updateData);
  if (response.code === 200) {
    plant.plantName = editForm.name;
    plant.location = editForm.location;
    plant.plantImage = editForm.image;
    uni.showToast({
      icon: 'success',
      title: '保存成功'
    });
    // uni.$emit('refreshPlantDetail');
    // setTimeout(() => {
    //   uni.navigateBack();
    // }, 1500);
  } else {
    error.value = response.msg || '保存失败';
    uni.showToast({ title: error.value, icon: 'none' });
  }
  uni.showToast({ title: '保存成功', icon: 'success' });
  isEditing.value = false;
};

const handleDelete = async () => {
  const response = await deletePlant(plant.id);
  if (response.code === 200) {
    uni.showToast({ title: '移除成功', icon: 'success' });
    // uni.$emit('refreshPlantList');
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } else {
    uni.showToast({ title: '移除失败', icon: 'none' });
  }
};

const handleBindPlant = async (sensor) => {
  console.log('sensor', sensor)
  sensorId.value = sensor.id
  // / console.log('this.currentDevice', this.currentDevice)
  // 将植物ID传给设备端
  const publishResult = await mqttPublish(sensor, {
    id: 'plant_id',
    name: '植物ID',
    type: 2,
    shadow: plant.id
  })
  // const publishResult = await this.mqttPublish(this.currentDevice, {
  //   id: 'time_set',
  //   name: '时间设置',
  //   type: 2,
  //   shadow: '100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100'
  // })
  // console.log('publishResult', publishResult)
  if (publishResult.code !== 200) {
    uni.showToast({
      title: publishResult.msg,
      icon: 'none'
    });
    return
  }
  try {
    const bindResult = await bindPlant({
      id: sensor.id,
      plantId: plant.id
    });

    if (bindResult.code === 200) {
      // this.showBindModal = false;
      showAddSensorModal.value = false
      loadSensor(sensor.deviceId)
      bus.emit('refreshDeviceList')
      // this.refreshDevices();
      uni.showToast({
        title: '绑定成功!',
        icon: 'success'
      });
    } else {
      uni.showToast({
        title: bindResult.msg,
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '绑定失败: ' + error.message,
      icon: 'none'
    });
  }
}

const mqttPublish = async (device, model) => {
  const command = {};
  command[model.id] = model.shadow;
  const data = {
    serialNumber: device.serialNumber,
    productId: device.productId,
    remoteCommand: command,
    identifier: model.id,
    modelName: model.name,
    isShadow: device.status != 3,
    type: model.type,
  }
  const invokeResult = await serviceInvoke(data)
  return Promise.resolve(invokeResult)
}

const loadSensor = async (deviceId) => {
  const deviceDetailResult = await getDeviceDetail(deviceId);
  // const data = await getDeviceDetail(plantDetail.deviceId);
  if (deviceDetailResult) {
    currentSensorData.value = deviceDetailResult.thingsModels;
    // deviceDetail.value = deviceDetailResult
    Object.assign(sensorData, deviceDetailResult);
    console.log(sensorData)
  }
}

const handleUnbindSuccess = () => {
  showUnbindModal.value = false
  currentSensorData.value = [];
  bus.emit('refreshPlantSensor_' + plant.plantId)
  bus.emit('refreshDeviceList');
  Object.assign(sensorData, null);
}

const handleGoLibrary = () => {
  uni.navigateTo({ url: '/pages-plants/plants/plantLibraryDetailNew/index?id=' + plant.plantType });
}

// --- Logic Helpers ---

// Status Value Helper
const getStatusForValue = (val, range) => {
  if (val === undefined) return { color: 'text-slate-300', status: '未知' };
  if (val < range.min) return { color: 'text-blue-500', status: '偏低' };
  if (val > range.max) return { color: 'text-orange-500', status: '偏高' };
  return { color: 'text-emerald-500', status: '适宜' };
};

// Health Config Computed
const healthConfigs = computed(() => {
  const conditions = plant.healthConditions;
  return conditions.map(condition => {
    if (!condition || condition === 'healthy') return {}; // Handle in template v-if

    const configMap = {
      'water-low': {
        color: 'blue',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconClass: 'icon-lucide-droplets',
        title: '缺水警报',
        desc: '土壤湿度已低于最低警戒线。建议根据盆径补充水分：',
        action: '建议浇透',
        hasDetail: true,
        details: [
          { label: '小盆 (10-15cm)', val: '200-300ml' },
          { label: '中盆 (15-25cm)', val: '500-800ml' },
          { label: '大盆 (>25cm)', val: '1.5L-2L' },
        ],
        tip: '原则：慢浇直至底部渗水'
      },
      'light-low': {
        color: 'amber',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconClass: 'icon-lucide-sun-dim',
        title: '光照不足',
        desc: '光合作用受阻。建议调整位置或增加补光灯：',
        action: '移至向阳处',
        hasDetail: true,
        details: [
          { label: '补光时长', val: '4-6小时/天' },
          { label: '推荐位置', val: '南向窗台/阳台' },
        ],
        tip: '注意：避免正午烈日直射'
      },
      'pest': {
        color: 'red',
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconClass: 'icon-lucide-bug',
        title: '虫害风险',
        desc: '检测到异常斑点。请立即隔离植物并检查叶背：',
        action: '拍照诊断',
        hasDetail: true,
        details: [
          { label: '检查重点', val: '叶背/茎杆连接处' },
          { label: '应急处理', val: '用清水冲洗叶片' },
        ],
        tip: '建议使用 AI 诊断确认虫害类型'
      },
      'temp-issue': {
        color: 'orange',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        iconClass: 'icon-lucide-thermometer',
        title: '温度异常',
        desc: '环境温度不适宜。请尽快调节室温防止冻伤/热害：',
        action: '调节室温',
        hasDetail: true,
        details: [
          { label: '适宜范围', val: `${plant.requirements.temperature.min}-${plant.requirements.temperature.max}°C` },
          { label: '当前措施', val: '移入室内/避开风口' },
        ],
        tip: '避免空调出风口直吹植物'
      }
    };

    const c = configMap[condition] || {
      color: 'slate',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconClass: 'icon-lucide-triangle-alert',
      title: '需关注',
      desc: '检测到环境参数波动，建议检查传感器连接或植物状态。',
      action: '检查设备',
      hasDetail: false,
      details: [],
      tip: ''
    };

    return {
      ...c,
      textColor: `text-${c.color}-700`,
      iconColor: `text-${c.color}-600`,
      bgIcon: `bg-${c.color}-100`
    };
  })
});

// Computed Sensor Metrics for v-for
const sensorMetrics = computed(() => {
  console.log('Current Sensor Data:', currentSensorData.value);
  if (currentSensorData.length > 0) return [];

  const readings = currentSensorData.value;
  const reqs = plant.requirements;

  const list = readings.map(item => {
    let readItem = {
      label: item.name,
      value: item.value || 0,
      unit: item.datatype.unit,
      range: reqs[item.id],
    }
    switch (item.id) {
      case 'soil_moisture':
        readItem.iconClass = "icon-lucide-droplets";
        readItem.theme = 'blue';
        break;
      case 'light':
        readItem.iconClass = "icon-lucide-sun";
        readItem.theme = 'amber';
        break;
      case 'temperature':
        readItem.iconClass = "icon-lucide-thermometer";
        readItem.theme = 'orange';
        break;
      case 'humidity':
        readItem.iconClass = "icon-lucide-cloud-rain";
        readItem.theme = 'sky';
        break;
    }
    return readItem;
  })

  // const list = [
  //   {
  //     label: "土壤湿度",
  //     value: readings.soilMoisture,
  //     unit: "%",
  //     iconClass: "icon-lucide-droplets",
  //     range: reqs.soilMoisture,
  //     theme: 'blue'
  //   },
  //   {
  //     label: "光照强度",
  //     value: readings.light,
  //     unit: "Lx",
  //     iconClass: "icon-lucide-sun",
  //     range: reqs.light,
  //     theme: 'amber'
  //   },
  //   {
  //     label: "环境温度",
  //     value: readings.temperature,
  //     unit: "°C",
  //     iconClass: "icon-lucide-thermometer",
  //     range: reqs.temperature,
  //     theme: 'orange'
  //   },
  //   {
  //     label: "空气湿度",
  //     value: readings.humidity,
  //     unit: "%",
  //     iconClass: "icon-lucide-cloud-rain",
  //     range: reqs.humidity,
  //     theme: 'sky'
  //   },
  // ];
  console.log('Sensor Metrics List:', list);
  return list.map(item => {
    const statusInfo = getStatusForValue(item.value, item.range);
    const percentage = item.value ? Math.min(100, Math.max(0, (item.value / (item.range.max * 1.5)) * 100)) : 0;

    const themeStyles = {
      blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: 'text-blue-600', bar: 'bg-blue-500' },
      amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', icon: 'text-amber-600', bar: 'bg-amber-500' },
      orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-100', icon: 'text-orange-600', bar: 'bg-orange-500' },
      sky: { bg: 'bg-sky-50', iconBg: 'bg-sky-100', icon: 'text-sky-600', bar: 'bg-sky-500' },
    }[item.theme];

    return { ...item, statusInfo, percentage, themeStyles };
  });
});

// Guide Computeds
const waterStrat = computed(() => {
  const minMoisture = plant.requirements.soil_moisture.min;
  if (minMoisture <= 25) return {
    tag: '干透浇透',
    color: 'bg-amber-100 text-amber-700',
    desc: '极耐旱。手指插入土中2指深，完全干燥后再浇水。',
    tip: '宁干勿湿',
    iconClass: 'icon-lucide-droplets'
  };
  if (minMoisture >= 50) return {
    tag: '保持湿润',
    color: 'bg-blue-100 text-blue-700',
    desc: '喜水植物。表土微干即需补水，由于蒸腾作用大，缺水易枯萎。',
    tip: '避免积水',
    iconClass: 'icon-lucide-cloud-rain'
  };
  return {
    tag: '见干见湿',
    color: 'bg-emerald-100 text-emerald-700',
    desc: '标准养护。观察土表颜色变浅发白后，一次性浇透到底部漏水。',
    tip: '土干再浇',
    iconClass: 'icon-lucide-droplets'
  };
});

const lightStrat = computed(() => {
  const maxLight = plant.requirements.light.max;
  if (maxLight >= 4000) return {
    tag: '全日照 / 直射光',
    desc: '请放置在朝南阳台或窗边，每天保证4小时以上阳光直射。',
    avoid: '长期阴暗会导致徒长',
    iconClass: 'icon-lucide-sun'
  };
  if (maxLight <= 1500) return {
    tag: '耐阴 / 散射光',
    desc: '适合室内明亮处（如客厅、书房）。避免阳光直射以免叶片灼伤。',
    avoid: '烈日暴晒',
    iconClass: 'icon-lucide-sun-dim'
  };
  return {
    tag: '明亮散射光',
    desc: '放置在距窗户1米左右的位置，光线明亮但不直射为佳。',
    avoid: '环境过于阴暗',
    iconClass: 'icon-lucide-sun'
  };
});

const latestTime = computed(() => {
  return getLatestTime(sensorData);
});


onLoad(async (options) => {
  // console.log('Options received', options);
  const plantId = options.plantId;
  if (plantId) {
    const plantDetail = await loadSinglePlant(plantId);
    console.log('Loaded plant detail', plantDetail);
    if (plantDetail) {
      Object.assign(plant, plantDetail);
      if (plantDetail.sensorList && plantDetail.sensorList.length > 0) {
        const sensor = plantDetail.sensorList[0];
        // const data = await getDeviceDetail(sensor.device_id);
        // // console.log('Loaded sensor detail', data);
        // if (data) {
        //   Object.assign(sensorData, data);
        //   currentSensorData.value = data.thingsModels;
        // }
        sensorId.value = sensor.sensor_Id
        loadSensor(sensor.device_id)
      }
    }
  }
});

</script>

<style scoped></style>