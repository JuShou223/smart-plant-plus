<template>
  <u-popup :show="show" @close="closeModal" mode="bottom" round="20" closeable>
    <view class="modal-content">
      <view class="modal-header">
        <text class="modal-title">记录养护</text>
      </view>

      <view class="modal-body">
        <view class="form-group">
          <text class="form-label">养护类型</text>
          <view class="care-type-grid">
            <button v-for="type in careTypes" :key="type" class="care-type-btn"
              :class="{ active: selectedType === type }" @click="selectedType = type">
              <text class="care-icon">{{ getCareIcon(type) }}</text>
              <text>{{ type }}</text>
            </button>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">养护时间</text>
          <view class="date-input" @click="showDatePicker = true">
            <text v-if="careDateTime" class="date-value">{{ format(careDateTime) }}</text>
            <text v-else class="date-placeholder">选择时间</text>
            <u-icon name="calendar" size="18" color="#999"></u-icon>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">备注（可选）</text>
          <u-textarea v-model="notes" placeholder="记录养护细节、植物状态等..." height="160" count></u-textarea>
        </view>

        <view v-if="error" class="error-message">
          <u-icon name="info-circle" size="16" color="#f56c6c"></u-icon>
          <text>{{ error }}</text>
        </view>
      </view>

      <view class="modal-footer">
        <button class="btn btn-outline" @click="closeModal">取消</button>
        <button class="btn btn-primary" @click="submitCare" :disabled="!selectedType || submitting">
          <text v-if="!submitting">保存</text>
          <u-loading-icon v-else mode="circle" color="#fff"></u-loading-icon>
        </button>
      </view>
    </view>

    <!-- 日期时间选择器 -->
    <u-datetime-picker :show="showDatePicker" v-model="dateValue" mode="datetime" @confirm="confirmDate"
      @cancel="showDatePicker = false"></u-datetime-picker>
  </u-popup>
</template>

<script>
import { addCareRecord } from '@/apis/modules/plants';
// import { plantsService } from '@/apis/modules/plants';

export default {
  name: 'RecordCareModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    plant: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      careTypes: ['浇水', '施肥', '修剪', '换盆'],
      selectedType: '',
      careDateTime: '',
      notes: '',
      submitting: false,
      error: '',
      showDatePicker: false,
      dateValue: Number(new Date())
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    resetForm() {
      this.selectedType = '';
      this.notes = '';
      this.error = '';
      this.careDateTime = new Date().toISOString();
      this.dateValue = Number(new Date());
    },
    getCareIcon(type) {
      const icons = {
        '浇水': '💧',
        '施肥': '🌱',
        '修剪': '✂️',
        '换盆': '🪴'
      };
      return icons[type] || '🌿';
    },

    closeModal() {
      this.$emit('close');
    },

    format(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    format2(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    },

    confirmDate(value) {
      const date = new Date(value.value);
      this.careDateTime = date.toISOString();
      this.showDatePicker = false;
    },

    async submitCare() {
      if (!this.selectedType) {
        this.error = '请选择养护类型';
        return;
      }

      if (!this.plant || !this.plant.id) {
        this.error = '植物信息缺失';
        return;
      }

      this.submitting = true;
      this.error = '';

      try {
        const careDate = new Date(this.careDateTime);
        console.log(careDate, this.careDateTime)
        const recordData = {
          plantId: this.plant.id,
          maintenanceType: this.careTypes.indexOf(this.selectedType),
          maintenanceTime: this.careDateTime,
          remark: this.notes || null
        };
        console.log('recordData', recordData)
        const response = await addCareRecord(recordData);
        console.log('response', response)
        if (response.code === 200) {
          const updates = {};
          if (this.selectedType === '浇水') {
            updates.last_watered = this.careDateTime;
          } else if (this.selectedType === '施肥') {
            updates.last_fertilized = this.careDateTime;
          }

          // if (Object.keys(updates).length > 0) {
          //   await plantsService.updateUserPlant(this.plant.id, updates);
          // }

          this.$emit('success');
          this.closeModal();
          uni.showToast({
            title: '记录成功',
            icon: 'success'
          });
        } else {
          this.error = response.msg || '保存失败';
        }
      } catch (error) {
        console.error('记录养护失败:', error);
        this.error = '保存失败，请重试';
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.modal-content {
  background-color: #fff;
  border-radius: 40rpx 40rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 30rpx;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
}

.care-type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.care-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 30rpx 20rpx;
  background-color: #f8f8f8;
  border: 2rpx solid transparent;
  border-radius: 20rpx;
  color: #333;
  font-size: 28rpx;
  transition: all 0.2s ease;
}

.care-type-btn:active {
  background-color: #f0f0f0;
}

.care-type-btn.active {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
  color: #4CAF50;
}

.care-icon {
  font-size: 64rpx;
}

.date-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
}

.date-value {
  font-size: 28rpx;
  color: #333;
}

.date-placeholder {
  font-size: 28rpx;
  color: #999;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  background-color: rgba(245, 108, 108, 0.1);
  border-left: 3rpx solid #f56c6c;
  border-radius: 12rpx;
  color: #f56c6c;
  font-size: 26rpx;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #2ecc71 0%, #2ecc71 100%);
  color: #fff;
}

.btn-outline {
  background: #fff;
  color: #666;
  border: 2rpx solid #ddd;
  margin-right: 20rpx;
}

.btn:disabled {
  opacity: 0.6;
}
</style>