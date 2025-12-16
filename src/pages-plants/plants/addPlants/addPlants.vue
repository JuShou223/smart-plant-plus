<template>
  <view class="plant-add-page">
    <!-- 表单内容 -->
    <view class="page-content">
      <form @submit="handleSubmit">
        <!-- 选择植物类型 -->
        <view class="form-section">
          <text class="section-title">选择植物类型<text class="required">*</text></text>

          <!-- 搜索框 -->
          <view class="search-wrap">
            <u-search v-model="searchQuery" placeholder="搜索植物名称" @change="handleSearchInput" @clear="handleClearSearch"
              :show-action="false"></u-search>
          </view>

          <!-- 搜索加载状态 -->
          <view v-if="searching" class="search-loading">
            <u-loading-icon size="20"></u-loading-icon>
            <text>搜索中...</text>
          </view>

          <!-- 搜索结果 -->
          <view v-if="searchResults.length > 0 && !searching" class="search-results">
            <view v-for="plant in searchResults" :key="plant.id" class="result-item" @click="selectPlant(plant)">
              <u-image :src="plant.mainImage" width="96rpx" height="96rpx" radius="8" mode="aspectFill"></u-image>
              <view class="result-info">
                <text class="result-name">{{ plant.plantName }}</text>
              </view>
            </view>
          </view>

          <!-- 无搜索结果 -->
          <view v-if="searchQuery && !searching && searchResults.length === 0 && hasSearched" class="no-results">
            <text class="no-results-icon">🔍</text>
            <text class="no-results-text">未找到相关植物</text>
          </view>

          <!-- 已选择的植物 -->
          <view v-if="selectedPlant" class="selected-plant">
            <view class="selected-card">
              <u-image :src="selectedPlant.main_image || selectedPlant.mainImage" width="120rpx" height="120rpx"
                radius="10" mode="aspectFill"></u-image>
              <view class="selected-info">
                <text class="plant-name">{{ selectedPlant.plant_name || selectedPlant.plantName }}</text>
                <text class="scientific-name">{{ selectedPlant.scientific_name }}</text>
              </view>
              <view class="btn-remove" @click="removeSelectedPlant">
                <u-icon name="close-circle" size="24" color="#999"></u-icon>
              </view>
            </view>
          </view>
        </view>

        <!-- 植物信息 -->
        <view class="form-section">
          <text class="section-title">植物信息</text>

          <!-- 植物照片 -->
          <view class="form-item">
            <text class="form-label">植物照片<text class="required">*</text></text>
            <view class="image-upload">
              <view v-if="imagePreview" class="image-preview-wrap">
                <u-image :src="imagePreview" width="100%" height="400rpx" radius="10" mode="aspectFill"></u-image>
                <view class="btn-remove-image" @click="removeImage">
                  <u-icon name="close-circle-fill" size="28" color="#fff"></u-icon>
                </view>
              </view>
              <view v-else class="upload-placeholder" @click="chooseImage">
                <u-icon name="camera" size="48" color="#ccc"></u-icon>
                <text class="upload-text">点击上传植物照片</text>
                <text class="upload-hint">支持 JPG、PNG 格式</text>
              </view>
            </view>
          </view>

          <!-- 植物昵称 -->
          <view class="form-item">
            <text class="form-label">植物昵称 <text class="required">*</text></text>
            <u-input v-model="formData.nickname" placeholder="给你的植物起个名字"></u-input>
          </view>

          <!-- 摆放位置 -->
          <view class="form-item">
            <text class="form-label">摆放位置</text>
            <u-input v-model="formData.location" placeholder="例如:客厅阳台(非必填)"></u-input>
          </view>

          <!-- 购买日期 -->
          <view class="form-item">
            <text class="form-label">购买日期</text>
            <view class="date-input" @click="showDatePicker = true">
              <text v-if="formData.purchase_date" class="date-value">{{ formData.purchase_date }}</text>
              <text v-else class="date-placeholder">选择日期(非必填)</text>
              <u-icon name="calendar" size="18" color="#999"></u-icon>
            </view>
          </view>

          <!-- 备注 -->
          <view class="form-item">
            <text class="form-label">备注</text>
            <u-textarea v-model="formData.notes" placeholder="记录一些特别的信息(非必填)" :maxlength="200" count></u-textarea>
          </view>
        </view>

        <!-- 错误提示 -->
        <view v-if="error" class="error-message">
          <u-icon name="info-circle" size="16" color="#f56c6c"></u-icon>
          <text>{{ error }}</text>
        </view>

        <!-- 提交按钮 -->
        <view class="form-actions">
          <template v-if="isEditMode">
            <button class="btn btn-secondary" @click="handleCancel">取消</button>
            <button class="btn btn-primary" :disabled="loading || !selectedPlant" @click="handleSubmit(true)">
              <text v-if="!loading">保存修改</text>
              <u-loading-icon v-else mode="circle" color="#fff"></u-loading-icon>
            </button>
          </template>
          <template v-else>
            <button class="btn btn-secondary" @click="handleCancel">取消</button>
            <button class="btn btn-primary" :disabled="loading || !selectedPlant" @click="handleSubmit(false)">
              <text v-if="!loading">添加植物</text>
              <u-loading-icon v-else mode="circle" color="#fff"></u-loading-icon>
            </button>
          </template>
        </view>
      </form>
    </view>

    <!-- 日期选择器 -->
    <u-datetime-picker :show="showDatePicker" v-model="dateValue" mode="date" @confirm="confirmDate"
      @cancel="showDatePicker = false"></u-datetime-picker>

    <!-- 加载提示 -->
    <u-loading-page :loading="loading" bg-color="#f5f5f5" loadingText="加载中..."></u-loading-page>
  </view>
</template>

<script>
import {
  getPlantDatabase,
  searchPlants,
  addPlant,
  updatePlant,
  getPlantDetail,
  getPlantDatabaseById
} from '@/apis/modules/plants';
import upload from '@/utils/upload';

export default {
  name: 'PlantAdd',
  data() {
    return {
      // 模式
      isEditMode: false,
      plantId: '',

      // 搜索
      searchQuery: '',
      searchResults: [],
      selectedPlant: null,
      searchTimer: null,
      searching: false,
      hasSearched: false,

      // 表单数据
      formData: {
        plant_id: '',
        nickname: '',
        location: '',
        purchase_date: '',
        notes: '',
        custom_image: null
      },

      // 图片
      imagePreview: null,
      uploadingImage: false,

      // 日期选择
      showDatePicker: false,
      dateValue: Number(new Date()),

      // 状态
      loading: false,
      error: null,
    };
  },
  onLoad(options) {
    console.log('options', options)
    if (options.plantId && options.mode === 'edit') {
      this.isEditMode = true;
      this.plantId = options.plantId;
      this.loadPlantForEdit();
      uni.setNavigationBarTitle({ title: '编辑植物' });
    } else if (options.plantId) {
      // this.searchQuery = options.plantName
      // console.log('this.searchQuery=====', this.searchQuery)
      this.loadPlantFromDatabaseById(options.plantId);
    }
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },
  methods: {
    /**
     * 加载植物信息(编辑模式)
     */
    async loadPlantForEdit() {
      try {
        this.loading = true;
        const response = await getPlantDetail(this.plantId);
        console.log('植物详情:', response);
        if (response.code === 200) {
          const plant = response.data;
          this.formData = {
            plant_id: plant.id,
            nickname: plant.plantName,
            location: plant.location,
            purchase_date: plant.purchaseDate,
            notes: plant.remark
          };

          this.imagePreview = plant.plantImage;
          this.loadPlantFromDatabaseById(plant.plantType);
          // if (plant.custom_image) {
          //   this.imagePreview = plant.custom_image;
          // }

          // if (plant.plant_database) {
          //   this.selectedPlant = plant.plant_database;
          //   this.searchQuery = plant.plant_database.name;
          // }
        }
      } catch (error) {
        console.error('加载植物信息失败:', error);
        this.$u.toast('加载失败');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 从植物库加载
     */
    async loadPlantFromDatabase(plantId) {
      try {
        const response = await getPlantDatabase({ plantId });
        console.log('植物库响应:', response);
        if (response.code === 200 && response.rows) {
          const plant = response.rows[0];
          this.selectedPlant = plant;
          this.searchQuery = plant.plant_name;
          this.formData.nickname = '我的' + plant.plant_name;
          this.selectPlant(plant);
        }
      } catch (error) {
        console.error('加载植物失败:', error);
      }
    },


    // 获取植物志详情
    async loadPlantFromDatabaseById(plantId) {
      try {
        const response = await getPlantDatabaseById(plantId);
        console.log('植物库响应:', response);
        if (response.code === 200 && response.data) {
          const plant = response.data;
          // this.selectedPlant = plant;
          // this.searchQuery = plant.plant_name;
          // this.formData.nickname = '我的' + plant.plant_name;
          this.selectPlant(plant);
        }
      } catch (error) {
        console.error('加载植物失败:', error);
      }
    },

    /**
     * 处理搜索输入 - 防抖
     */
    handleSearchInput(value) {
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 如果输入为空,清空搜索结果
      if (!value || !value.trim()) {
        this.searchResults = [];
        this.searching = false;
        this.hasSearched = false;
        return;
      }

      // 设置搜索中状态
      this.searching = true;
      this.hasSearched = false;

      // 设置新的定时器,500ms后执行搜索
      this.searchTimer = setTimeout(() => {
        this.performSearch(value);
      }, 1000);
    },

    /**
     * 执行搜索
     */
    async performSearch(query) {
      if (!query || !query.trim()) {
        this.searching = false;
        return;
      }

      try {
        console.log('执行搜索:', query);
        const response = await searchPlants(query);
        console.log('response', response)
        if (response.code === 200) {
          this.searchResults = (response.rows || []).slice(0, 5);
          console.log(response.rows)
          console.log(this.searchResults)
          this.hasSearched = true;
        }
      } catch (error) {
        console.error('搜索失败:', error);
        this.$u.toast('搜索失败');
      } finally {
        this.searching = false;
      }
    },

    /**
     * 清空搜索
     */
    handleClearSearch() {
      this.searchQuery = '';
      this.searchResults = [];
      this.searching = false;
      this.hasSearched = false;

      // 清除定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
    },

    /**
     * 选择植物
     */
    async selectPlant(plant) {
      this.selectedPlant = plant;
      this.formData.plant_id = plant.id;
      // this.searchResults = [];
      // this.searchQuery = plant.plant_name;
      // this.hasSearched = false;
      this.handleClearSearch()
      if (!this.isEditMode) {
        this.formData.nickname = '我的' + (plant.plant_name || plant.plantName)
        this.imagePreview = plant.mainImage;
      }
      // if (plant.mainImage) {
      //   this.imagePreview = plant.mainImage;
      // }
    },

    /**
     * 移除已选择的植物
     */
    removeSelectedPlant() {
      this.selectedPlant = null;
      this.formData.plant_id = '';
      this.searchQuery = '';
      this.imagePreview = null;
    },

    /**
     * 选择图片
     */
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          uni.showLoading({
            title: '上传中...',
          });
          const uploadResult = await upload({
            url: '/common/upload',
            method: 'post',
            filePath: res.tempFilePaths[0]
          });
          console.log('uploadResult', uploadResult);
          if (uploadResult.code === 200) {
            uni.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1500
            });
            this.imagePreview = uploadResult.url;
            this.formData.custom_image = uploadResult.url;
          } else {
            uni.showToast({
              title: uploadResult.msg || '上传失败',
              icon: 'none',
              duration: 1500
            });
          }
        }
      });
    },

    /**
     * 移除图片
     */
    removeImage() {
      this.imagePreview = null;
      this.formData.custom_image = null;
    },

    /**
     * 确认日期
     */
    confirmDate(value) {
      const date = new Date(value.value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.formData.purchase_date = year + '-' + month + '-' + day;
      this.showDatePicker = false;
    },

    /**
     * 提交表单
     */
    async handleSubmit() {
      console.log('handleSubmit');
      // 验证
      if (!this.selectedPlant) {
        this.error = '请先选择植物类型';
        return;
      }

      if (!this.imagePreview) {
        this.error = '请先上传植物图片';
        return;
      }

      if (!this.formData.nickname) {
        this.error = '请输入植物昵称';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const formData = {
          location: this.formData.location,
          plantImage: this.imagePreview,
          plantName: this.formData.nickname,
          plantType: this.selectedPlant.id,
          purchaseDate: this.formData.purchase_date,
          remark: this.formData.notes
        }
        if (this.isEditMode) {
          // 更新植物
          const updateData = Object.assign({}, formData);
          updateData.id = this.plantId;

          const response = await updatePlant(this.plantId, updateData);

          if (response.code === 200) {
            uni.showToast({
              icon: 'success',
              title: '保存成功'
            });
            uni.$emit('refreshPlantDetail');
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            this.error = response.msg || '保存失败';
          }
        } else {
          // 添加植物
          const response = await addPlant(formData);

          if (response.code === 200) {
            uni.showToast({
              icon: 'success',
              title: '添加成功'
            });
            uni.$emit('refreshPlantList');
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            this.error = response.msg || '添加失败';
          }
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.error = '操作失败,请重试';
      } finally {
        this.loading = false;
      }
    },

    /**
     * 取消
     */
    handleCancel() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.plant-add-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-content {
  padding: 30rpx;
  padding-bottom: 120rpx;
}

/* 表单区域 */
.form-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
}

/* 搜索 */
.search-wrap {
  margin-bottom: 20rpx;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 40rpx;
  color: #999;
  font-size: 26rpx;
}

.search-results {
  max-height: 600rpx;
  overflow-y: auto;
  border: 1rpx solid #eee;
  border-radius: 16rpx;
  margin-top: 20rpx;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:active {
  background: #f8f8f8;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.result-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-left: 20rpx;
}

/* 无结果 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 30rpx;
  text-align: center;
}

.no-results-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.no-results-text {
  font-size: 28rpx;
  color: #999;
}

/* 已选植物 */
.selected-plant {
  margin-top: 30rpx;
}

.selected-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: rgba(60, 156, 255, 0.05);
  border: 2rpx solid #2ecc71;
  border-radius: 16rpx;
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.plant-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-left: 20rpx;
}

.scientific-name {
  font-size: 24rpx;
  color: #999;
  font-style: italic;
  margin-left: 20rpx;
}

.btn-remove {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 表单项 */
.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

.required {
  color: #f56c6c;
}

/* 图片上传 */
.image-upload {
  width: 100%;
}

.image-preview-wrap {
  position: relative;
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
}

.btn-remove-image {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 400rpx;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
  background: #f8f8f8;
}

.upload-text {
  font-size: 28rpx;
  color: #666;
}

.upload-hint {
  font-size: 24rpx;
  color: #999;
}

/* 日期输入 */
.date-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8f8f8;
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

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  background: rgba(245, 108, 108, 0.1);
  border: 1rpx solid #f56c6c;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  font-size: 26rpx;
  color: #f56c6c;
}

/* 提交按钮 */
.form-actions {
  display: flex;
  gap: 20rpx;
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
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: #fff !important;
}

.btn-secondary {
  background: #fff;
  color: #666;
  border: 2rpx solid #ddd;
  margin-right: 20rpx;
}

.btn:disabled {
  opacity: 0.6;
}
</style>