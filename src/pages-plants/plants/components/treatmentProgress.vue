<template>
  <view v-if="treatmentData" class="treatment-status-section">
    <view class="section-header">
      <text class="section-title">治疗进行中</text>
      <view class="treatment-badge treating">
        <text>治疗中</text>
      </view>
    </view>

    <view class="treatment-card active" @click="goToTreatmentProgress">
      <view class="treatment-left">
        <u-image :src="treatmentData.package.image_url" width="120rpx" height="120rpx" mode="aspectCover"
          radius="12"></u-image>
      </view>

      <view class="treatment-right">
        <text class="treatment-name">{{ treatmentData.package.name }}</text>

        <view class="treatment-meta">
          <text class="treatment-day">第 {{ treatmentData.current_day }}/{{ treatmentData.total_days }} 天</text>
          <text class="treatment-step">第 {{ treatmentData.current_step }}/{{ treatmentData.total_steps }} 步</text>
        </view>

        <!-- 进度条 -->
        <view class="progress-container">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: treatmentData.progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ treatmentData.progress }}%</text>
        </view>

        <!-- 下一步提示 -->
        <view class="next-action">
          <u-icon name="info-circle" size="16" color="#e65100"></u-icon>
          <text>{{ treatmentData.next_action }}</text>
        </view>
      </view>

      <view class="treatment-arrow">
        <u-icon name="arrow-right" size="16" color="#999"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'treatmentProgress',
  props: {
    recordId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      treatmentData: null,
      expandedSteps: [], // 展开的步骤ID列表
      completedActions: {}, // 已完成的操作项 { stepId: [actionIndex] }
      stepNotes: {}, // 步骤备注 { stepId: 'note text' }
      stepPhotos: {} // 步骤照片 { stepId: [{ url, date }] }
    }
  },
  mounted() {
    this.loadTreatmentProgress()
  },
  methods: {
    async loadTreatmentProgress() {
      this.loading = true;
      try {
        await this.simulateApiCall();

        // 默认展开当前进行中的步骤（如果有）
        const currentStep = (this.treatmentData && this.treatmentData.steps) ? this.treatmentData.steps.find(s => s.status === 'in_progress') : null;
        if (currentStep) {
          if (!this.expandedSteps.includes(currentStep.id)) this.expandedSteps.push(currentStep.id);
        }
      } catch (error) {
        console.error('加载治疗进度失败:', error);
        uni.showToast({ title: '加载失败', icon: 'error' });
      } finally {
        this.loading = false;
      }
    },

    async simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 保留完整的假数据
          this.treatmentData = {
            id: this.recordId || 'rec1',
            package: {
              id: 'pkg1',
              name: '绿萝白粉病综合治疗包',
              image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
            },
            plant: {
              id: 'p1',
              name: '客厅绿萝',
              image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
            },
            start_date: '2025-11-10',
            estimated_end_date: '2025-12-03',
            current_day: 12,
            total_days: 28,
            current_step: 2,
            total_steps: 5,
            progress: 40,
            next_action: '今日需要喷洒杀菌剂',
            completed_steps: 2,
            steps: [
              {
                id: 's1',
                phase: '初期',
                title: '紧急隔离与清理',
                description: '立即隔离病株，清除感染部位',
                day_range: '第1-3天',
                status: 'completed',
                action_items: [
                  '将病株移至通风良好的隔离区',
                  '用酒精擦拭剪刀进行消毒',
                  '剪除所有白粉覆盖的叶片',
                  '清理掉落的病叶'
                ],
                tips: '操作时戴手套，避免孢子扩散'
              },
              {
                id: 's2',
                phase: '初期',
                title: '首次杀菌处理',
                description: '使用杀菌剂进行第一轮治疗',
                day_range: '第4-7天',
                status: 'in_progress',
                action_items: [
                  '配置杀菌剂溶液（1:800稀释）',
                  '均匀喷洒在叶片正反面',
                  '重点喷洒曾患病区域',
                  '保持环境通风'
                ],
                tips: '避开强光直射时段，建议傍晚进行'
              },
              {
                id: 's3',
                phase: '中期',
                title: '巩固治疗',
                description: '继续杀菌，观察恢复情况',
                day_range: '第8-14天',
                status: 'not_started',
                action_items: [
                  '每3天喷洒一次杀菌剂',
                  '检查是否有新的感染',
                  '适当补充营养液',
                  '拍照记录恢复进度'
                ],
                tips: '注意观察新叶生长情况'
              },
              {
                id: 's4',
                phase: '后期',
                title: '营养恢复',
                description: '停止用药，加强营养补充',
                day_range: '第15-21天',
                status: 'not_started',
                action_items: [
                  '停止使用杀菌剂',
                  '每周施用营养液一次',
                  '增加光照时间',
                  '保持适当湿度'
                ],
                tips: '此阶段重点是促进新陈代谢'
              },
              {
                id: 's5',
                phase: '后期',
                title: '观察巩固',
                description: '最后观察期，确保完全康复',
                day_range: '第22-28天',
                status: 'not_started',
                action_items: [
                  '每日观察植株状态',
                  '检查是否有复发迹象',
                  '拍摄最终对比照片',
                  '记录治疗效果'
                ],
                tips: '如无异常，治疗即将完成'
              }
            ],
            products: [
              {
                id: '1',
                product: {
                  id: 'p1',
                  name: '白粉病专用杀菌剂',
                  image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
                },
                usage_frequency: '每3天使用一次'
              },
              {
                id: '2',
                product: {
                  id: 'p2',
                  name: '植物营养液',
                  image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
                },
                usage_frequency: '每周使用一次'
              }
            ]
          };

          // 初始化已完成的操作项（兼容所有步骤）
          const initCompleted = {};
          this.treatmentData.steps.forEach(s => { initCompleted[s.id] = []; });
          // 模拟：s1 全完成，s2 前两项完成
          initCompleted['s1'] = [0, 1, 2, 3];
          initCompleted['s2'] = [0, 1];
          // 使用 Vue.set 保证响应性
          this.completedActions = {};
          Object.keys(initCompleted).forEach(k => { this.$set(this.completedActions, k, initCompleted[k]); });

          // 初始化照片数据
          this.stepPhotos = {};
          this.$set(this.stepPhotos, 's1', [
            { url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg', date: '2025-11-10' },
            { url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg', date: '2025-11-12' }
          ]);

          // 初始化备注（保证 v-model 有引用）
          this.treatmentData.steps.forEach(s => {
            if (!this.stepNotes[s.id]) this.$set(this.stepNotes, s.id, '');
          });

          resolve();
        }, 500);
      });
    },

    goToTreatmentProgress() {
      if (!this.treatmentData.id) {
        uni.showToast({ title: '数据加载中', icon: 'none' });
        return;
      }
      uni.navigateTo({
        url: `/pages-plants/plants/treatmentProgress/treatmentProgress?recordId=${this.treatmentData.id}`
      });
    },

    // 保留其他方法以便在详细页面中使用
    formatDate(dateString) {
      if (!dateString) return '';
      const parts = dateString.split('-');
      if (parts.length >= 3) {
        return `${Number(parts[1])}月${Number(parts[2])}日`;
      }
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },

    formatPhotoDate(dateString) {
      if (!dateString) return '';
      const parts = dateString.split('-');
      if (parts.length >= 3) return `${Number(parts[1])}/${Number(parts[2])}`;
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },

    getStepClass(step) {
      return {
        'completed': step.status === 'completed',
        'in-progress': step.status === 'in_progress',
        'not-started': step.status === 'not_started'
      };
    },

    getNodeClass(step) {
      if (step.status === 'completed') return 'completed';
      if (step.status === 'in_progress') return 'in-progress';
      return 'not-started';
    },

    getPhaseClass(phase) {
      const classMap = {
        '初期': 'phase-early',
        '中期': 'phase-middle',
        '后期': 'phase-late'
      };
      return classMap[phase] || 'phase-middle';
    },

    toggleStep(stepId) {
      const index = this.expandedSteps.indexOf(stepId);
      if (index > -1) {
        this.expandedSteps.splice(index, 1);
      } else {
        this.expandedSteps.push(stepId);
      }
    },

    toggleAction(stepId, actionIndex) {
      if (!this.completedActions[stepId]) {
        this.$set(this.completedActions, stepId, []);
      }

      const actions = this.completedActions[stepId];
      const index = actions.indexOf(actionIndex);

      if (index > -1) {
        actions.splice(index, 1);
      } else {
        actions.push(actionIndex);
      }

      this.$set(this.completedActions, stepId, actions);
    },

    isActionCompleted(stepId, actionIndex) {
      const arr = this.completedActions[stepId] || [];
      return arr.includes(actionIndex);
    },

    getStepPhotos(stepId) {
      return this.stepPhotos[stepId] || [];
    },

    uploadPhoto(stepId) {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePath = (res && res.tempFilePaths) ? res.tempFilePaths[0] : null;
          if (!tempFilePath) return;

          if (!this.stepPhotos[stepId]) this.$set(this.stepPhotos, stepId, []);

          this.stepPhotos[stepId].push({
            url: tempFilePath,
            date: new Date().toISOString().split('T')[0]
          });
          this.$set(this.stepPhotos, stepId, this.stepPhotos[stepId]);

          uni.showToast({ title: '照片已添加', icon: 'success' });
        }
      });
    },

    previewPhoto(url) {
      uni.previewImage({ urls: [url], current: url });
    },

    saveNote(stepId) {
      uni.showToast({ title: '备注已保存', icon: 'success' });
    },

    completeStep(stepId) {
      const step = this.treatmentData.steps.find(s => s.id === stepId);
      const allActionsCompleted = step.action_items.every((_, idx) => this.isActionCompleted(stepId, idx));

      if (!allActionsCompleted) {
        uni.showModal({
          title: '提示',
          content: '还有操作项未完成，确定要完成本步骤吗？',
          success: (res) => {
            if (res.confirm) this.finishStep(stepId);
          }
        });
      } else {
        this.finishStep(stepId);
      }
    },

    finishStep(stepId) {
      uni.showToast({ title: '步骤已完成', icon: 'success' });

      const stepIndex = this.treatmentData.steps.findIndex(s => s.id === stepId);
      if (stepIndex > -1) {
        this.$set(this.treatmentData.steps[stepIndex], 'status', 'completed');

        if (stepIndex < this.treatmentData.steps.length - 1) {
          this.$set(this.treatmentData.steps[stepIndex + 1], 'status', 'in_progress');
          this.expandedSteps = [this.treatmentData.steps[stepIndex + 1].id];
        } else {
          this.goToRating();
        }

        this.treatmentData.completed_steps++;
        this.treatmentData.overall_progress = Math.round((this.treatmentData.completed_steps / this.treatmentData.total_steps) * 100);

        this.treatmentData = { ...this.treatmentData };
      }
    },

    pauseTreatment() {
      uni.showModal({
        title: '暂停治疗',
        content: '确定要暂停这个治疗吗？可以随时恢复。',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已暂停', icon: 'success' });
            setTimeout(() => { uni.navigateBack(); }, 1500);
          }
        }
      });
    },

    getHelp() {
      uni.showModal({
        title: '寻求帮助',
        content: '遇到问题了吗？您可以：\n1. 查看产品使用说明\n2. 联系在线客服\n3. 拍照咨询专家',
        confirmText: '联系客服',
        success: (res) => { if (res.confirm) { uni.showToast({ title: '客服功能开发中', icon: 'none' }); } }
      });
    },

    goToRating() {
      uni.redirectTo({ url: `/pages/treatment-rating/treatment-rating?recordId=${this.recordId}` });
    },

    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
// 植物详情页 - 治疗状态卡片
.treatment-status-section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 0 30rpx 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }

  .treatment-badge {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 600;

    &.treating {
      background: #e3f2fd;
      color: #1976d2;
    }
  }
}

.treatment-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-top: 20rpx;

  &.active {
    border: 2rpx solid #27ae60;
    background: #e8f5e9;
  }
}

.treatment-left {
  margin-right: 20rpx;
}

.treatment-right {
  flex: 1;
}

.treatment-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.treatment-meta {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.treatment-day,
.treatment-step {
  font-size: 24rpx;
  color: #666;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #66bb6a);
  border-radius: 6rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #27ae60;
  min-width: 60rpx;
  text-align: right;
}

.next-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  background: #fff3cd;
  border-radius: 8rpx;
}

.next-action text {
  font-size: 24rpx;
  color: #856404;
}

.treatment-arrow {
  margin-left: 16rpx;
}

// 诊断记录卡片的治疗按钮
.diagnosis-action {
  margin-top: 16rpx;
}

.btn-view-treatment,
.btn-start-treatment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 100%;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
}

.btn-view-treatment {
  background: #e8f5e9;
  color: #27ae60;
}

.btn-start-treatment {
  background: #27ae60;
  color: white;
}

// 状态徽章
.status-badges {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
  justify-content: center;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 600;

  &.treating {
    background: linear-gradient(135deg, #1976d2, #42a5f5);
    color: white;
  }
}
</style>