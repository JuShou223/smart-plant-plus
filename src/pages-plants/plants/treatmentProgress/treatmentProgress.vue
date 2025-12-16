<template>
  <view class="treatment-progress">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="treatmentData" class="content">
      <!-- 顶部信息卡片 -->
      <view class="header-card">
        <view class="header-image">
          <u-image :src="headerImageUrl" width="100%" height="400rpx" mode="aspectCover" radius="24"></u-image>
        </view>

        <view class="header-info">
          <text class="package-name">{{ treatmentData.package.name }}</text>

          <!-- 治疗包信息（未使用时显示） -->
          <view v-if="treatmentData.status === 'unused'" class="package-info">
            <view class="info-row">
              <text class="label">疗程：</text>
              <text class="value">{{ treatmentData.package.course_days }}天</text>
            </view>
            <view class="info-row">
              <text class="label">成功率：</text>
              <text class="value">{{ treatmentData.package.success_rate }}</text>
            </view>
            <view class="info-row">
              <text class="label">难度：</text>
              <text class="value">{{ treatmentData.package.difficulty }}</text>
            </view>
            <view class="package-description">
              <text>{{ treatmentData.package.description }}</text>
            </view>
            <view class="price-rating">
              <text class="price">¥{{ treatmentData.package.current_price }}</text>
              <view class="rating">
                <!-- <u-icon name="star-fill" size="20" color="#FFB800"></u-icon> -->
                <!-- <text>{{ treatmentData.package.rating }}</text> -->
              </view>
            </view>
          </view>

          <view class="plant-info" v-if="treatmentData.plant">
            <!-- <u-icon name="leaf" size="20" color="#27ae60"></u-icon> -->
            <text>{{ treatmentData.plant.name }}</text>
          </view>

          <!-- 未使用状态提示 -->
          <view v-if="treatmentData.status === 'unused'" class="unused-notice">
            <u-icon name="info-circle" size="24" color="#1976d2"></u-icon>
            <!-- <text>此治疗包尚未开始使用，点击"开始治疗"选择植物并启动治疗流程</text> -->
            <text>此治疗包尚未开始使用，点击"开始治疗"启动治疗流程</text>
          </view>

          <view v-if="treatmentData.status !== 'unused'" class="date-range">
            <view class="date-item">
              <text class="date-label">开始日期</text>
              <text class="date-value">{{ formattedStartDate }}</text>
            </view>
            <view class="date-divider"></view>
            <view class="date-item">
              <text class="date-label">预计结束</text>
              <text class="date-value">{{ formattedEndDate }}</text>
            </view>
          </view>

          <!-- 总体进度 -->
          <view v-if="treatmentData.status !== 'unused'" class="overall-progress">
            <view class="progress-header">
              <text class="progress-label">总体进度</text>
              <text class="progress-percent">{{ treatmentData.overall_progress }}%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: treatmentData.overall_progress + '%' }"></view>
            </view>
            <text class="progress-status">已完成 {{ treatmentData.completed_steps }}/{{ treatmentData.total_steps
              }}个步骤</text>
          </view>
        </view>
      </view>

      <!-- 步骤时间线（未使用时显示预览） -->
      <view class="timeline-section" v-if="treatmentData.status !== 'unused' || expandedSteps.length > 0">
        <text class="section-title">治疗步骤</text>

        <view class="timeline">
          <view v-for="(step, index) in treatmentData.steps" :key="step.id" class="timeline-item" :class="step.status">
            <!-- 时间线连接线：根据上一步是否完成来展示 -->
            <view v-if="index > 0 && treatmentData.status !== 'unused'" class="timeline-connector"
              :class="{ completed: treatmentData.steps[index - 1].status === 'completed' }">
            </view>

            <!-- 步骤节点 -->
            <view class="timeline-node" :class="step.status">
              <u-icon v-if="step.status === 'completed'" name="checkmark" size="24" color="#fff"></u-icon>
              <text v-else>{{ index + 1 }}</text>
            </view>

            <!-- 步骤内容 -->
            <view class="step-content" @click="toggleStep(step.id)">
              <view class="step-header">
                <view class="step-title-area">
                  <view class="step-phase-badge" :class="step.phaseClass">
                    <text>{{ step.phase }}</text>
                  </view>
                  <text class="step-title">{{ step.title }}</text>
                </view>
                <text class="step-days">{{ step.day_range }}</text>
              </view>

              <text class="step-description">{{ step.description }}</text>

              <!-- 步骤详情（可展开） -->
              <view v-if="expandedSteps.includes(step.id)" class="step-details">
                <!-- 操作清单 -->
                <view v-if="step.action_items && step.action_items.length > 0" class="action-checklist">
                  <text class="checklist-title">操作清单</text>
                  <view v-for="(action, idx) in step.action_items" :key="idx" class="action-item"
                    :class="{ disabled: treatmentData.status === 'unused' }"
                    @click.stop="treatmentData.status !== 'unused' && toggleAction(step.id, idx)">
                    <view class="checkbox" :class="{
                      checked: step.action_completed_states && step.action_completed_states[idx],
                      disabled: treatmentData.status === 'unused'
                    }">
                      <u-icon v-if="step.action_completed_states && step.action_completed_states[idx]" name="checkmark"
                        size="16" color="#fff"></u-icon>
                    </view>
                    <text :class="{ 'disabled-text': treatmentData.status === 'unused' }">{{ action }}</text>
                  </view>
                </view>

                <!-- 提示信息 -->
                <view v-if="step.tips" class="step-tips">
                  <u-icon name="info-circle" size="20" color="#e65100"></u-icon>
                  <text>{{ step.tips }}</text>
                </view>

                <!-- 照片记录（未使用时隐藏） -->
                <view v-if="treatmentData.status !== 'unused'" class="photo-section">
                  <text class="photo-title">进度照片</text>
                  <view class="photo-grid">
                    <view v-for="(photo, idx) in stepPhotos[step.id] || []" :key="idx" class="photo-item"
                      @click="previewPhoto(photo.url)">
                      <u-image :src="photo.url" width="100%" height="160rpx" mode="aspectCover" radius="8"></u-image>
                      <text class="photo-date">{{ photo.formattedDate }}</text>
                    </view>
                    <view class="photo-add" @click.stop="uploadPhoto(step.id)">
                      <u-icon name="camera" size="40" color="#999"></u-icon>
                      <text>添加照片</text>
                    </view>
                  </view>
                </view>

                <!-- 备注（未使用时隐藏） -->
                <view v-if="treatmentData.status !== 'unused'" class="note-section">
                  <text class="note-title">备注</text>
                  <textarea v-model="stepNotes[step.id]" class="note-input" placeholder="记录一些观察或想法..." maxlength="200"
                    @blur="saveNote(step.id)"></textarea>
                </view>

                <!-- 步骤操作按钮 -->
                <view v-if="step.status === 'in_progress' && treatmentData.status !== 'unused'" class="step-actions">
                  <button class="btn-complete-step" @click.stop="completeStep(step.id)">
                    <u-icon name="checkmark-circle" size="20" color="#fff"></u-icon>
                    <text>完成本步骤</text>
                  </button>
                </view>
              </view>

              <!-- 展开/收起按钮 -->
              <view class="expand-btn" @click.stop="toggleStep(step.id)">
                <text>{{ expandedSteps.includes(step.id) ? '收起' : '展开详情' }}</text>
                <u-icon :name="expandedSteps.includes(step.id) ? 'arrow-up' : 'arrow-down'" size="16"
                  color="#999"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 配套产品 -->
      <view class="products-section">
        <text class="section-title">配套产品</text>
        <view class="product-list">
          <view v-for="item in treatmentData.products" :key="item.id" class="product-card">
            <view class="product-image">
              <u-image :src="item.product.image_url" width="120rpx" height="120rpx" mode="aspectCover"
                radius="8"></u-image>
            </view>
            <view class="product-info">
              <text class="product-name">{{ item.product.name }}</text>
              <text class="product-usage">{{ item.usage_frequency }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="bottom-bar">
        <button v-if="treatmentData.status === 'unused'" class="btn-start" @click="startTreatment">
          <u-icon name="play-circle" size="20" color="#fff"></u-icon>
          <text>开始治疗</text>
        </button>
        <template v-else>
          <button class="btn-pause" @click="pauseTreatment">
            <u-icon name="pause-circle" size="20" color="#666"></u-icon>
            <text>暂停治疗</text>
          </button>
          <button class="btn-help" @click="getHelp">
            <u-icon name="question-circle" size="20" color="#27ae60"></u-icon>
            <text>寻求帮助</text>
          </button>
        </template>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading" class="empty-state">
      <u-icon name="file-text" size="80" color="#ccc"></u-icon>
      <text class="empty-text">治疗记录不存在</text>
      <button class="btn-back" @click="goBack">
        <text>返回</text>
      </button>
    </view>

    <!-- 选择植物弹窗 -->
    <selectPlantModal ref="SelectPlantModal"></selectPlantModal>
  </view>
</template>

<script>
import selectPlantModal from '../components/selectPlantModal.vue';
export default {
  name: 'TreatmentProgress',
  data() {
    return {
      loading: false,
      recordId: '',
      treatmentData: null,
      expandedSteps: [], // 展开的步骤ID列表
      completedActions: {}, // 已完成的操作项 { stepId: [actionIndex] }
      stepNotes: {}, // 步骤备注 { stepId: 'note text' }
      stepPhotos: {}, // 步骤照片 { stepId: [{ url, date, formattedDate }]
      classMap: {
        '初期': 'phase-early',
        '中期': 'phase-middle',
        '后期': 'phase-late'
      }
    }
  },
  components: {
    selectPlantModal
  },
  computed: {
    // 头部图片URL
    headerImageUrl() {
      if (!this.treatmentData) return '';
      return this.treatmentData.plant ? this.treatmentData.plant.image_url : this.treatmentData.package.image_url;
    },
    // 格式化开始日期
    formattedStartDate() {
      if (!this.treatmentData || !this.treatmentData.start_date) return '';
      return this.formatDate(this.treatmentData.start_date);
    },
    // 格式化结束日期
    formattedEndDate() {
      if (!this.treatmentData || !this.treatmentData.estimated_end_date) return '';
      return this.formatDate(this.treatmentData.estimated_end_date);
    }
  },
  onLoad(options) {
    if (options && options.recordId) {
      // this.recordId = 'unused';
      this.recordId = options.recordId;
    }
    this.loadTreatmentProgress();
  },
  methods: {
    startTreatment() {
      this.$refs.SelectPlantModal.startTreatment()
    },
    async loadTreatmentProgress() {
      this.loading = true;
      try {
        await this.simulateApiCall();
        console.log('treatmentData', this.treatmentData)
        // 如果是未使用状态，默认展开第一个步骤供预览
        if (this.treatmentData && this.treatmentData.status === 'unused' && this.treatmentData.steps.length > 0) {
          if (!this.expandedSteps.includes(this.treatmentData.steps[0].id)) {
            this.expandedSteps.push(this.treatmentData.steps[0].id);
          }
        } else if (this.treatmentData && this.treatmentData.steps) {
          // 默认展开当前进行中的步骤（如果有）
          const currentStep = (this.treatmentData && this.treatmentData.steps) ? this.treatmentData.steps.find(s => s.status === 'in_progress') : null;
          if (currentStep) {
            if (!this.expandedSteps.includes(currentStep.id)) this.expandedSteps.push(currentStep.id);
          }
        }
      } catch (error) {
        console.error('加载治疗进度失败:', error);
        uni.showToast({ title: '加载失败', icon: 'error' });
      } finally {
        this.loading = false;
      }
    },

    initData() {
      // 初始化已完成的操作项
      const initCompleted = {};
      this.treatmentData.steps.forEach(s => {
        initCompleted[s.id] = [];

        // 预处理操作完成状态
        if (s.action_items) {
          s.action_completed_states = {};
          s.action_items.forEach((_, idx) => {
            s.action_completed_states[idx] = false;
          });
        }
      });

      if (this.treatmentData.status !== 'unused') {
        // 模拟：s1 全完成，s2 前两项完成
        initCompleted['s1'] = [0, 1, 2, 3];
        initCompleted['s2'] = [0, 1];

        // 更新预处理的状态
        this.treatmentData.steps.forEach(step => {
          if (step.action_completed_states) {
            Object.keys(step.action_completed_states).forEach(idx => {
              step.action_completed_states[idx] = initCompleted[step.id].includes(parseInt(idx));
            });
          }
        });
      }

      this.completedActions = {};
      Object.keys(initCompleted).forEach(k => {
        this.$set(this.completedActions, k, initCompleted[k]);
      });

      // 初始化步骤的样式类
      this.treatmentData.steps.forEach(step => {
        this.$set(step, 'phaseClass', this.getPhaseClass(step.phase));
      });

      // 初始化照片数据（未使用时为空）
      this.stepPhotos = {};
      if (this.treatmentData.status !== 'unused') {
        const s1Photos = [
          { url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg', date: '2025-11-10' },
          { url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg', date: '2025-11-12' }
        ];
        // 为照片添加格式化日期
        s1Photos.forEach(photo => {
          photo.formattedDate = this.formatPhotoDate(photo.date);
        });
        this.$set(this.stepPhotos, 's1', s1Photos);
      }

      // 初始化备注
      this.treatmentData.steps.forEach(s => {
        if (!this.stepNotes[s.id]) this.$set(this.stepNotes, s.id, '');
      });
    },

    async simulateApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 模拟未使用状态的数据
          if (this.recordId === 'unused') {
            this.treatmentData = {
              id: this.recordId,
              status: 'unused',
              package: {
                id: 'pkg4',
                name: '白粉病综合治疗包',
                image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg',
                course_days: 14,
                success_rate: '92%',
                difficulty: '简单',
                description: '针对白粉病的系统治疗方案，包含初期控制、中期治疗、后期巩固三个阶段，配套专业杀菌剂和营养液，14天疗程有效控制病情。适用于多种观叶植物的白粉病治疗。',
                current_price: '128.00',
                rating: '4.8'
              },
              steps: [
                {
                  id: 's1',
                  phase: '初期',
                  title: '紧急隔离与清理',
                  description: '立即隔离病株，清除感染部位',
                  day_range: '第1-3天',
                  status: 'not_started',
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
                  status: 'not_started',
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
          } else {
            // 原有进行中状态的数据
            this.treatmentData = {
              id: this.recordId || 'rec1',
              status: 'ongoing',
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
              overall_progress: 40,
              completed_steps: 2,
              total_steps: 5,
              steps: [{
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
              }],
              products: [{
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
              }]
            };
          }

          // 初始化数据
          this.initData();
          resolve();
        }, 500);
      });
    },

    formatDate(dateString) {
      if (!dateString) return '';
      // 兼容移动端解析，手工解析 yyyy-mm-dd
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

      // 更新步骤的完成状态
      const step = this.treatmentData.steps.find(s => s.id === stepId);
      if (step && step.action_completed_states) {
        step.action_completed_states[actionIndex] = actions.includes(actionIndex);
        // 确保响应式更新
        this.$set(step, 'action_completed_states', { ...step.action_completed_states });
      }

      // 保证响应：Vue.set
      this.$set(this.completedActions, stepId, actions);
    },

    isActionCompleted(stepId, actionIndex) {
      const arr = this.completedActions[stepId] || [];
      return arr.includes(actionIndex);
    },

    uploadPhoto(stepId) {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePath = (res && res.tempFilePaths) ? res.tempFilePaths[0] : null;
          if (!tempFilePath) return;

          if (!this.stepPhotos[stepId]) this.$set(this.stepPhotos, stepId, []);

          const newPhoto = {
            url: tempFilePath,
            date: new Date().toISOString().split('T')[0],
            formattedDate: this.formatPhotoDate(new Date().toISOString().split('T')[0])
          };

          this.stepPhotos[stepId].push(newPhoto);
          // 确保响应
          this.$set(this.stepPhotos, stepId, this.stepPhotos[stepId]);

          uni.showToast({ title: '照片已添加', icon: 'success' });
        }
      });
    },

    previewPhoto(url) {
      uni.previewImage({ urls: [url], current: url });
    },

    saveNote(stepId) {
      // stepNotes 已由 v-model 双向绑定，直接保存到服务器
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

        // 确保响应
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
}
</script>

<style lang="scss" scoped>
.treatment-progress {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

.header-card {
  background: white;
  margin-bottom: 24rpx;
}

.header-image {
  width: 100%;
  height: 400rpx;
  overflow: hidden;
}

.header-info {
  padding: 40rpx;
}

.package-name {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  margin-bottom: 24rpx;
}

.plant-info {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: #e8f5e9;
  border-radius: 20rpx;
  margin-bottom: 32rpx;
}

.plant-info text {
  font-size: 26rpx;
  color: #27ae60;
  margin-left: 8rpx;
}

.date-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.date-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.date-divider {
  width: 2rpx;
  height: 60rpx;
  background: #e0e0e0;
}

.overall-progress {
  padding: 32rpx;
  background: #e8f5e9;
  border-radius: 16rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.progress-label {
  font-size: 28rpx;
  color: #2e7d32;
  font-weight: 600;
}

.progress-percent {
  font-size: 36rpx;
  font-weight: 700;
  color: #27ae60;
}

.progress-bar {
  width: 100%;
  height: 20rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.progress-fill {
  height: 100%;
  background: #27ae60;
  border-radius: 10rpx;
}

.progress-status {
  display: block;
  font-size: 24rpx;
  color: #2e7d32;
}

.timeline-section {
  background: white;
  padding: 40rpx;
  margin-bottom: 24rpx;
}

.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 32rpx;
}

.timeline {
  position: relative;
}

.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: 40rpx;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-connector {
  position: absolute;
  left: 40rpx;
  top: -40rpx;
  width: 4rpx;
  height: 40rpx;
  background: #e0e0e0;
}

.timeline-connector.completed {
  background: #27ae60;
}

.timeline-node {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: 4rpx solid;
}

.timeline-node.completed {
  background: #27ae60;
  border-color: #27ae60;
  color: white;
}

.timeline-node.in-progress {
  background: #1976d2;
  border-color: #1976d2;
  color: white;
}

.timeline-node.not-started {
  background: white;
  border-color: #e0e0e0;
  color: #999;
}

.step-content {
  flex: 1;
  background: #f8f9fa;
  padding: 32rpx;
  border-radius: 16rpx;
}

.timeline-item.in-progress .step-content {
  background: #e3f2fd;
  border: 2rpx solid #1976d2;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.step-title-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.step-phase-badge {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.phase-early {
  background: #ffebee;
  color: #c62828;
}

.phase-middle {
  background: #fff3e0;
  color: #e65100;
}

.phase-late {
  background: #e8f5e9;
  color: #2e7d32;
}

.step-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.step-days {
  font-size: 24rpx;
  color: #999;
}

.step-description {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.step-details {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid rgba(0, 0, 0, 0.05);
}

.action-checklist {
  margin-bottom: 24rpx;
}

.checklist-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.action-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: white;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.action-item:last-child {
  margin-bottom: 0;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.checkbox.checked {
  background: #27ae60;
  border-color: #27ae60;
}

.action-item text {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.step-tips {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  background: #fff3cd;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.step-tips text {
  flex: 1;
  font-size: 26rpx;
  color: #856404;
  line-height: 1.5;
  margin-left: 16rpx;
}

.photo-section {
  margin-bottom: 24rpx;
}

.photo-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
}

.photo-item {
  position: relative;
  width: 32%;
  border-radius: 8rpx;
  overflow: hidden;
  background: white;
  margin-right: 2%;
  margin-bottom: 16rpx;
}

.photo-item:nth-child(3n) {
  margin-right: 0;
}

.photo-date {
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  padding: 4rpx 12rpx;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 20rpx;
  border-radius: 8rpx;
}

.photo-add {
  width: 32%;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2rpx dashed #e0e0e0;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

.photo-add text {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.note-section {
  margin-bottom: 24rpx;
}

.note-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.note-input {
  width: 100%;
  min-height: 160rpx;
  padding: 20rpx;
  background: white;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
  box-sizing: border-box;
}

.step-actions {
  margin-top: 24rpx;
}

.btn-complete-step {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.btn-complete-step text {
  margin-left: 12rpx;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  margin-top: 16rpx;
  background: white;
  border-radius: 12rpx;
}

.expand-btn text {
  font-size: 26rpx;
  color: #999;
  margin-right: 8rpx;
}

.products-section {
  background: white;
  padding: 40rpx;
  margin-bottom: 24rpx;
}

.product-list {
  display: flex;
  flex-direction: column;
}

.product-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.product-card:last-child {
  margin-bottom: 0;
}

.product-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
  margin-right: 24rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.product-usage {
  font-size: 24rpx;
  color: #27ae60;
  font-weight: 600;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 24rpx 40rpx;
  background: white;
}

.btn-pause,
.btn-help {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.btn-pause {
  background: #f5f5f5;
  color: #666;
  margin-right: 16rpx;
}

.btn-help {
  background: #e8f5e9;
  color: #27ae60;
}

.btn-pause text,
.btn-help text {
  margin-left: 8rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin: 32rpx 0;
}

.btn-back {
  padding: 24rpx 48rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
}

/* 平板适配 */
@media (min-width: 768px) {

  .photo-item,
  .photo-add {
    width: 24%;
    margin-right: 1.333%;
  }

  .photo-item:nth-child(3n) {
    margin-right: 1.333%;
  }

  .photo-item:nth-child(4n) {
    margin-right: 0;
  }
}

/* 新增未使用状态相关样式 */
.package-info {
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  font-size: 26rpx;
  color: #999;
}

.info-row .value {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
}

.package-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin: 20rpx 0;
  padding: 20rpx;
  background: white;
  border-radius: 8rpx;
}

.price-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.price {
  font-size: 32rpx;
  font-weight: 700;
  color: #e74c3c;
}

.rating {
  display: flex;
  align-items: center;
}

.rating text {
  font-size: 26rpx;
  color: #666;
  margin-left: 8rpx;
  font-weight: 600;
}

.unused-notice {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  background: #e3f2fd;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.unused-notice text {
  flex: 1;
  font-size: 26rpx;
  color: #1976d2;
  line-height: 1.5;
  margin-left: 16rpx;
}

/* 禁用状态样式 */
.action-item.disabled {
  opacity: 0.6;
}

.checkbox.disabled {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.disabled-text {
  color: #999 !important;
}

/* 开始治疗按钮样式 */
.btn-start {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.btn-start text {
  margin-left: 12rpx;
}
</style>