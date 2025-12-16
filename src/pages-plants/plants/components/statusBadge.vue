<template>
  <view class="status-badge" :class="['type-' + type.toLowerCase()]" :style="{
    backgroundColor: bgColor,
    color: textColor,
    borderColor: textColor
  }">
    <text class="status-text">{{ statusType }}</text>
  </view>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    statusType: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'normal' // 'good', 'bad', 'normal'
    }
  },
  computed: {
    textColor() {
      const config = this.getStatusConfig(this.statusType, this.type);
      return config.color;
    },
    bgColor() {
      const config = this.getStatusConfig(this.statusType, this.type);
      return config.bgColor;
    }
  },
  methods: {
    getStatusConfig(statusType, type) {
      // 根据type返回不同的配色方案
      if (type === 'good') {
        return { color: '#059669', bgColor: '#D1FAE5' };
      } else if (type === 'bad') {
        return { color: '#DC2626', bgColor: '#FEE2E2' };
      }

      // 默认配色或根据状态名称返回特定配色
      const configs = {
        '健康': { color: '#059669', bgColor: '#D1FAE5' },
        '干燥': { color: '#D97706', bgColor: '#FEF3C7' },
        '过湿': { color: '#2563EB', bgColor: '#DBEAFE' },
        '缺光': { color: '#4B5563', bgColor: '#F3F4F6' },
        '光照过强': { color: '#D97706', bgColor: '#FEF3C7' },
        '温度过低': { color: '#2563EB', bgColor: '#DBEAFE' },
        '温度过高': { color: '#DC2626', bgColor: '#FEE2E2' },
        '营养不良': { color: '#65A30D', bgColor: '#ECFCCB' },
        '虫害': { color: '#DC2626', bgColor: '#FEE2E2' },
        '病害': { color: '#B91C1C', bgColor: '#FEE2E2' }
      };
      return configs[statusType] || { color: '#4B5563', bgColor: '#F3F4F6' };
    }
  }
};
</script>

<style lang="scss" scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  margin-right: 10rpx;
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  font-size: 24rpx;
  font-weight: 600;
  border: none;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.08);
}

.status-badge:active {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.12);
}

.status-text {
  line-height: 1;
  letter-spacing: 0.4rpx;
}

/**.type-bad {
  animation: statusPulse 2s ease-in-out infinite;
}**/

@keyframes statusPulse {

  0%,
  100% {
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.08), 0 0 0 0 currentColor;
  }

  50% {
    box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.12), 0 0 0 8rpx rgba(220, 38, 38, 0.2);
  }
}
</style>