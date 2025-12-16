<!--
 * @Date: 2025-11-10 09:44:24
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-11-28 09:41:54
 * @Description:
-->
<template>
  <view class="status-list">
    <StatusBadge v-for="(status, index) in displayStatuses" :key="index" :statusType="status.name"
      :type="status.type || 'normal'" @click="$emit('status-click', status)" />
    <text @click="onShowAll" v-if="moreCount > 0" class="more-count">+{{ moreCount }}</text>
  </view>
</template>

<script>
import StatusBadge from './statusBadge.vue';

export default {
  name: 'StatusList',
  components: {
    StatusBadge
  },
  props: {
    statuses: {
      type: Array,
      default: () => []
    },
    // maxDisplay: {
    //   type: Number,
    //   default: 3
    // }
  },
  data() {
    return {
      maxDisplay: 4
    }
  },
  computed: {
    sortedStatuses() {
      return this.sortStatusesByType([...this.statuses]);
    },
    displayStatuses() {
      if (this.maxDisplay === 0) {
        return this.sortedStatuses
      } else {
        return this.sortedStatuses.slice(0, this.maxDisplay);
      }
    },
    moreCount() {
      if (this.maxDisplay === 0) {
        return 0
      } else {
        return Math.max(0, this.sortedStatuses.length - this.maxDisplay);
      }
    }
  },
  methods: {
    onShowAll() {
      this.maxDisplay = 0
    },
    sortStatusesByType(statuses) {
      // 按照类型排序：bad > normal > good
      const typeOrder = {
        'bad': 3,
        'normal': 2,
        'good': 1
      };

      console.log('sortStatusesByType', statuses);

      return statuses.sort((a, b) => {
        const typeDiff = (typeOrder[b.type] || 0) - (typeOrder[a.type] || 0);
        if (typeDiff !== 0) return typeDiff;

        // 如果type相同，按照started_at排序（如果有的话）
        if (a.started_at && b.started_at) {
          return new Date(b.started_at) - new Date(a.started_at);
        }
        return 0;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.status-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}

.more-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56rpx;
  height: 56rpx;
  padding: 0 16rpx;
  background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
  color: #4B5563;
  border-radius: 28rpx;
  font-size: 22rpx;
  font-weight: 700;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.more-count:active {
  transform: scale(1.05);
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.12);
}
</style>