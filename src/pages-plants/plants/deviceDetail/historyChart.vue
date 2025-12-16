<template>
  <view class="device-history-chart">
    <!-- 头部 - 时间范围选择 -->
    <view class="chart-header">
      <text class="header-title">历史数据</text>
      <view class="time-range-tabs">
        <view v-for="range in timeRanges" :key="range.value"
          :class="['time-tab', { active: currentTimeRange === range.value }]" @click="changeTimeRange(range.value)">
          {{ range.label }}
        </view>
      </view>
    </view>

    <!-- 物模型Tab切换 -->
    <view v-if="chartTabs.length > 0" class="model-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view class="tabs-container">
          <view v-for="tab in chartTabs" :key="tab.id" :class="['model-tab', { active: activeTabId === tab.id }]"
            @click="changeTab(tab.id)">
            <text class="tab-name">{{ tab.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 加载状态 -->
    <!-- <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view> -->

    <!-- 无数据状态 -->
    <view v-if="chartTabs.length === 0" class="empty-container">
      <text class="empty-text">暂无可图表化的数据</text>
    </view>

    <!-- 内容区域 -->
    <view v-else>
      <!-- 统计卡片 -->
      <view v-if="statistics" class="statistics-cards">
        <view class="stat-card">
          <text class="stat-label">平均值</text>
          <text class="stat-value">{{ statistics.avg }}{{ statistics.unit }}</text>
        </view>
        <view class="stat-card">
          <text class="stat-label">最小值</text>
          <text class="stat-value stat-min">{{ statistics.min }}{{ statistics.unit }}</text>
        </view>
        <view class="stat-card">
          <text class="stat-label">最大值</text>
          <text class="stat-value stat-max">{{ statistics.max }}{{ statistics.unit }}</text>
        </view>
        <view class="stat-card">
          <text class="stat-label">数据点</text>
          <text class="stat-value">{{ statistics.count }}</text>
        </view>
      </view>

      <!-- 图表 -->
      <view v-if="hasChartData" class="chart-wrapper">
        <qiun-data-charts :loadingType="5" type="area" :opts="chartOptions" :chartData="chartData" :canvas2d="true" />
      </view>

      <!-- 数据不足提示 -->
      <view v-else class="no-data-container">
        <text class="no-data-text">数据点不足，无法生成图表</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getDeviceHistory } from '@/apis/modules/deviceLog';

export default {
  name: 'DeviceHistoryChart',

  props: {
    // 设备信息
    device: {
      type: Object,
      required: true,
      validator: (val) => {
        return val.serialNumber && val.productId && val.thingsModels;
      }
    },

    // 默认时间范围(小时)
    defaultTimeRange: {
      type: Number,
      default: 24
    },

    // 图表高度
    chartHeight: {
      type: Number,
      default: 300
    },

    // 图表主题色
    themeColor: {
      type: String,
      default: '#1890FF'
    }
  },

  data() {
    return {
      // 时间范围选项
      timeRanges: [
        { label: '24小时', value: 24 },
        { label: '7天', value: 168 },
        { label: '30天', value: 720 }
      ],

      // 当前时间范围
      currentTimeRange: this.defaultTimeRange,

      // 图表tabs
      chartTabs: [],

      // 当前选中的物模型ID
      activeTabId: '',

      // 原始历史数据
      rawHistoryData: {},

      // 统计数据
      statistics: null,

      // 图表数据
      chartData: {},

      // 加载状态
      loading: false,

      // 图表配置
      chartOptions: {
        type: 'area',
        canvasId: `deviceChart_${Date.now()}`,
        canvas2d: true,
        background: '#FFFFFF',
        animation: true,
        color: [this.themeColor],
        padding: [15, 20, 0, 10],
        enableScroll: false,
        dataLabel: false,
        legend: {
          show: false
        },
        xAxis: {
          disableGrid: true,
          scrollShow: true,
          itemCount: 0,
          boundaryGap: 'justify',
          labelCount: 0
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
          splitNumber: 5,
          showTitle: true,
          data: [{
            min: 0,
            max: 100
          }]
        },
        extra: {
          line: {
            type: 'curve',
            width: 2,
            activeType: 'hollow',
            linearType: 'none'
          }
        }
      }
    };
  },

  computed: {
    // 是否有图表数据
    hasChartData() {
      return this.chartData.categories &&
        this.chartData.categories.length >= 2 &&
        this.chartData.series &&
        this.chartData.series.length > 0;
    }
  },

  watch: {
    // 监听设备变化
    'device.serialNumber': {
      handler() {
        this.initComponent();
      },
      immediate: true
    },
  },

  methods: {
    // ============ 初始化组件 ============
    async initComponent() {
      if (!this.device || !this.device.serialNumber) {
        console.warn('设备信息不完整');
        return;
      }

      // 初始化图表tabs
      this.initChartTabs();

      // 加载历史数据
      if (this.chartTabs.length > 0) {
        await this.loadHistoryData();
      }
    },

    // ============ 初始化图表Tabs ============
    initChartTabs() {
      try {
        console.log('initChartTabs', this.device)
        if (!this.device.thingsModels || this.device.thingsModels.length === 0) {
          this.chartTabs = [];
          return;
        }

        // 筛选可图表化的物模型
        this.chartTabs = this.device.thingsModels
          .filter(model => model.isChart === 1)
          .map(model => ({
            id: model.identity || model.id,
            name: model.name,
            unit: model.datatype.unit || '',
            type: model.type
          }));

        console.log(this.chartTabs)
        // 设置默认选中第一个
        if (this.chartTabs.length > 0) {
          this.activeTabId = this.chartTabs[0].id;
        }

        console.log('初始化图表Tabs:', this.chartTabs);
      } catch (error) {
        console.log(error)
      }
    },

    // ============ 加载历史数据 ============
    async loadHistoryData() {
      try {
        this.loading = true;

        // 计算时间范围
        const { beginTime, endTime } = this.calculateTimeRange(this.currentTimeRange);

        console.log('加载历史数据:', {
          serialNumber: this.device.serialNumber,
          productId: this.device.productId,
          beginTime,
          endTime
        });

        // 调用API
        const result = await getDeviceHistory({
          serialNumber: this.device.serialNumber,
          productId: this.device.productId,
          beginTime,
          endTime
        });

        if (result.code === 200 && result.data) {
          this.rawHistoryData = result.data;

          // 过滤掉没有数据的tabs
          this.chartTabs = this.chartTabs.filter(tab => {
            const hasData = this.rawHistoryData[tab.id] &&
              this.rawHistoryData[tab.id].length > 0;
            return hasData;
          });

          // 如果当前选中的tab没有数据，切换到第一个有数据的tab
          if (this.chartTabs.length > 0) {
            const currentTabExists = this.chartTabs.some(tab => tab.id === this.activeTabId);
            if (!currentTabExists) {
              this.activeTabId = this.chartTabs[0].id;
            }
          }

          // 处理当前tab的数据
          this.processCurrentTabData();

          // 触发数据加载完成事件
          this.$emit('data-loaded', {
            tabs: this.chartTabs,
            rawData: this.rawHistoryData
          });

        } else {
          uni.showToast({
            title: result.msg || '加载失败',
            icon: 'none'
          });

          this.$emit('load-error', result);
        }

      } catch (error) {
        console.error('加载历史数据失败:', error);
        uni.showToast({
          title: '加载失败: ' + error.message,
          icon: 'none'
        });

        this.$emit('load-error', error);

      } finally {
        this.loading = false;
      }
    },

    // ============ 计算时间范围 ============
    calculateTimeRange(hours) {
      const now = new Date();
      const endTime = this.formatDateTime(now);

      let startTime;
      if (hours <= 24) {
        // 24小时内：从当天0点开始
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        startTime = this.formatDateTime(todayStart);
      } else {
        // 7天/30天：从当前时间往前推
        const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
        startTime = this.formatDateTime(start);
      }

      console.log('时间范围:', { startTime, endTime, hours });
      return { beginTime: startTime, endTime };
    },

    // ============ 格式化日期时间 ============
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // ============ 切换时间范围 ============
    async changeTimeRange(hours) {
      if (this.currentTimeRange === hours || this.loading) return;

      this.currentTimeRange = hours;

      // 触发时间范围变化事件
      this.$emit('time-range-change', hours);

      await this.loadHistoryData();
    },

    // ============ 切换物模型Tab ============
    changeTab(tabId) {
      if (this.activeTabId === tabId || this.loading) return;

      this.activeTabId = tabId;

      // 触发tab变化事件
      const currentTab = this.chartTabs.find(tab => tab.id === tabId);
      this.$emit('tab-change', currentTab);

      this.processCurrentTabData();
    },

    // ============ 处理当前Tab数据 ============
    processCurrentTabData() {
      if (!this.activeTabId || !this.rawHistoryData[this.activeTabId]) {
        this.statistics = null;
        this.chartData = {};
        return;
      }

      // 获取原始数据
      const rawData = this.rawHistoryData[this.activeTabId];

      if (!rawData || rawData.length === 0) {
        this.statistics = null;
        this.chartData = {};
        return;
      }

      console.log('rawData', rawData)
      // 数据聚合
      const aggregateInterval = this.getAggregateInterval(this.currentTimeRange);
      const aggregatedData = this.aggregateData(rawData, aggregateInterval);

      // 计算统计值
      this.statistics = this.calculateStatistics(rawData);

      // 转换为图表数据
      this.convertToChartData(aggregatedData);

      console.log('处理完成:', {
        tabId: this.activeTabId,
        originalCount: rawData.length,
        aggregatedCount: aggregatedData.length,
        statistics: this.statistics
      });
    },

    // ============ 获取聚合间隔 ============
    getAggregateInterval(hours) {
      if (hours <= 24) {
        return 60;    // 1小时聚合
      } else if (hours <= 168) {
        return 1440;  // 1天聚合 (24*60)
      } else {
        return 1440;  // 1天聚合
      }
    },

    // ============ 数据聚合 ============
    aggregateData(rawData, intervalMinutes) {
      if (!rawData || rawData.length === 0) return [];

      const intervalMs = intervalMinutes * 60 * 1000;
      const grouped = {};

      // 按时间窗口分组
      rawData.forEach(item => {
        const timestamp = new Date(item.time).getTime();
        const bucketKey = Math.floor(timestamp / intervalMs) * intervalMs;

        if (!grouped[bucketKey]) {
          grouped[bucketKey] = [];
        }
        grouped[bucketKey].push(parseFloat(item.value) || 0);
      });

      // 计算每组的平均值
      const aggregated = Object.keys(grouped)
        .sort((a, b) => a - b)
        .map(key => {
          const values = grouped[key];
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

          return {
            time: new Date(parseInt(key)),
            value: Math.round(avg * 100) / 100,
            count: values.length
          };
        });

      // 对于24小时范围，确保只包含当天的数据点
      if (this.currentTimeRange <= 24) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return aggregated.filter(item => item.time >= today);
      }

      return aggregated;
    },

    // ============ 计算统计值 ============
    calculateStatistics(rawData) {
      if (!rawData || rawData.length === 0) {
        return null;
      }

      const values = rawData.map(item => parseFloat(item.value) || 0);
      const sum = values.reduce((a, b) => a + b, 0);

      // 获取当前物模型的单位
      const currentTab = this.chartTabs.find(tab => tab.id === this.activeTabId);
      const unit = currentTab.unit || '';

      return {
        avg: (sum / values.length).toFixed(1),
        min: Math.min(...values).toFixed(1),
        max: Math.max(...values).toFixed(1),
        count: rawData.length,
        unit: unit
      };
    },

    // ============ 转换为图表数据 ============
    convertToChartData(aggregatedData) {
      console.log('aggregatedData', aggregatedData)
      if (!aggregatedData || aggregatedData.length === 0) {
        this.chartData = {};
        return;
      }

      // 获取当前物模型信息
      const currentTab = this.chartTabs.find(tab => tab.id === this.activeTabId);
      const unit = currentTab.unit || '';

      // 提取X轴和Y轴数据
      const categories = aggregatedData.map(item => this.formatChartTime(item.time));
      const seriesData = aggregatedData.map(item => item.value);

      // 计算Y轴范围
      const minValue = Math.min(...seriesData);
      const maxValue = Math.max(...seriesData);

      // 添加一些边距让图表显示更美观
      const range = maxValue - minValue;
      const yMin = minValue - (range * 0.1);
      const yMax = maxValue + (range * 0.1);

      // 更新Y轴配置
      this.chartOptions.yAxis.data[0].min = yMin;
      this.chartOptions.yAxis.data[0].max = yMax;
      this.chartOptions.yAxis.data[0].title = unit;

      // 构建图表数据
      this.chartData = {
        categories: categories,
        series: [{
          name: `${currentTab.name || '数据'}(${unit})`, // 在系列名中也加上单位
          data: seriesData
        }]
      };
      console.log('this.chartData', this.chartData)
    },

    // ============ 格式化图表时间标签 ============
    formatChartTime(date) {
      const d = new Date(date);

      if (this.currentTimeRange <= 24) {
        // 24小时内：显示小时:分钟（如 14:00）
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      } else {
        // 7天/30天：显示月/日（如 11/27）
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${month}/${day}`;
      }
    },

    // ============ 刷新数据(外部调用) ============
    refresh() {
      return this.loadHistoryData();
    }
  }
};
</script>

<style lang="scss" scoped>
.device-history-chart {
  background: #f8f9fa;
  border-radius: 32rpx;
  padding: 36rpx;
}

/* ============ 头部 ============ */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.time-range-tabs {
  display: flex;
}

.time-tab {
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  background: white;
  color: #666;
  font-size: 26rpx;
  border: 2rpx solid #e0e0e0;
  transition: all 0.3s;
  cursor: pointer;
  margin-right: 16rpx;
}

.time-tab.active {
  background: #1890FF;
  color: white;
  border-color: #1890FF;
}

.time-tab:active {
  opacity: 0.7;
}

/* ============ 物模型Tabs ============ */
.model-tabs {
  margin-bottom: 30rpx;
}

.tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.tabs-container {
  display: inline-flex;
}

.model-tab {
  display: inline-flex;
  align-items: center;
  padding: 16rpx 32rpx;
  border-radius: 16rpx;
  background: white;
  border: 4rpx solid #e0e0e0;
  transition: all 0.3s;
  margin-right: 20rpx;
  cursor: pointer;
}

.model-tab.active {
  background: #1890FF;
  border-color: #1890FF;
  box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.3);
}

.tab-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.model-tab.active .tab-name {
  color: white;
}

.model-tab:active {
  opacity: 0.7;
  transform: scale(0.98);
}

/* ============ 统计卡片 ============ */
.statistics-cards {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 30rpx;
}

.stat-card {
  width: calc(50% - 80rpx);
  background: white;
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 24rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.stat-label {
  display: block;
  color: #999;
  font-size: 26rpx;
  margin-bottom: 16rpx;
}

.stat-value {
  display: block;
  color: #1890FF;
  font-size: 44rpx;
  font-weight: bold;
}

.stat-min {
  color: #52C41A;
}

.stat-max {
  color: #FA8C16;
}

/* ============ 图表 ============ */
.chart-wrapper {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  position: relative;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* ============ 状态提示 ============ */
.loading-container,
.empty-container,
.no-data-container {
  text-align: center;
  padding: 100rpx 40rpx;
  background: white;
  border-radius: 24rpx;
  margin-top: 30rpx;
}

.loading-text,
.empty-text,
.no-data-text {
  color: #999;
  font-size: 28rpx;
}

.loading-text::after {
  content: '...';
  animation: loading 1.5s infinite;
}

@keyframes loading {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}


/* ============ 深色模式支持 ============ */
@media (prefers-color-scheme: dark) {
  .device-history-chart {
    background: #1a1a1a;
  }

  .header-title {
    color: #fff;
  }

  .time-tab {
    background: #2a2a2a;
    color: #ccc;
    border-color: #444;
  }

  .model-tab {
    background: #2a2a2a;
    border-color: #444;
  }

  .tab-name {
    color: #ccc;
  }

  .stat-card {
    background: #2a2a2a;
  }

  .stat-label {
    color: #999;
  }

  .chart-wrapper {
    background: #2a2a2a;
  }

  .loading-container,
  .empty-container,
  .no-data-container {
    background: #2a2a2a;
  }

  .loading-text,
  .empty-text,
  .no-data-text {
    color: #999;
  }
}
</style>