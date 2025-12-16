<template>
  <view class="diagnosis-page page-wrapper">
    <!-- 页面头部 -->
    <!-- <view class="page-header">
      <button class="btn-back" @click="handleBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </button>
      <text class="page-title">植物健康诊断</text>
      <view class="header-spacer"></view>
    </view> -->

    <view class="page-content">
      <!-- 上传诊断区域 -->
      <view v-if="!diagnosisResult" class="upload-section">
        <!-- 植物选择器 -->
        <view class="plant-selector-section">
          <view class="selector-header">
            <text class="selector-title">选择要诊断的植物（可选）</text>
            <button class="btn-toggle" @click="showPlantSelector = !showPlantSelector">
              <u-icon :name="showPlantSelector ? 'arrow-up' : 'arrow-down'" size="16" color="#666"></u-icon>
            </button>
          </view>

          <view v-if="selectedPlantId" class="selected-plant-info">
            <view class="info-icon">
              <u-icon name="tags" size="20" color="#2ecc71"></u-icon>
            </view>
            <text class="info-text">正在为 <text class="plant-name">{{ selectedPlantName }}</text> 进行诊断</text>
            <button class="btn-clear" @click="clearPlantSelection">
              <u-icon name="close" size="16" color="#999"></u-icon>
            </button>
          </view>
          <view v-else class="selected-plant-info generic">
            <view class="info-icon">
              <u-icon name="info-circle" size="20" color="#999"></u-icon>
            </view>
            <text class="info-text">独立诊断（不关联植物）</text>
          </view>

          <view v-if="showPlantSelector" class="plant-selector-panel">
            <view v-if="loadingPlants" class="loading-plants">
              <u-loading-icon></u-loading-icon>
            </view>
            <view v-else-if="userPlants.length === 0" class="empty-plants">
              <text class="empty-text">暂无植物，可进行通用诊断</text>
            </view>
            <scroll-view v-else class="plants-scroll" scroll-x @scrolltolower="loadMorePlants" lower-threshold="50"
              :scroll-left="scrollLeft">
              <view class="plants-scroll-content">
                <view v-for="plant in userPlants" :key="plant.id" class="plant-option"
                  :class="{ selected: selectedPlantId === plant.id }" @click="selectPlant(plant.id)">
                  <view class="plant-option-image">
                    <image :src="plant.plantImage" width="100%" height="100%" mode="aspectFill"></image>
                    <view v-if="selectedPlantId === plant.id" class="check-mark">
                      <u-icon name="checkmark" size="12" color="#fff"></u-icon>
                    </view>
                  </view>
                  <view class="plant-option-info">
                    <text class="plant-option-name">{{ plant.plantName }}</text>
                    <text class="plant-option-status">{{ plant.status }}</text>
                  </view>
                </view>

                <!-- 加载更多指示器 -->
                <view v-if="loadingMore" class="loading-more">
                  <u-loading-icon size="20"></u-loading-icon>
                </view>

                <!-- 没有更多数据提示 -->
                <view v-if="!hasMorePlants && userPlants.length > 0" class="no-more">
                  <text class="no-more-text">没有更多了</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>

        <!-- 上传引导 -->
        <view v-if="!previewUrl" class="upload-guide">
          <view class="guide-icon">
            <u-icon name="photo" size="80" color="#4CAF50"></u-icon>
          </view>
          <text class="guide-title">上传植物照片</text>
          <text class="guide-description">拍摄或选择病变部位的清晰照片</text>
        </view>

        <!-- 图片预览 -->
        <view class="image-preview" v-if="previewUrl">
          <u-image :src="previewUrl" width="100%" height="400rpx" mode="aspectFit"></u-image>
          <button class="btn-remove-image" @click="removeImage">
            <u-icon name="close" size="20" color="#fff"></u-icon>
          </button>
        </view>

        <!-- 上传操作 -->
        <view class="upload-actions">
          <button class="btn btn-outline" @click="chooseImage">
            <u-icon name="photo" size="20" color="#2ecc71"></u-icon>
            <text>从相册选择</text>
          </button>
          <button class="btn btn-primary" @click="handleAnalyze" :disabled="!selectedFile || analyzing">
            <text v-if="!analyzing">开始诊断</text>
            <u-loading-icon v-else mode="circle" color="#fff"></u-loading-icon>
          </button>
        </view>

        <!-- 错误信息 -->
        <view v-if="error" class="error-message">
          <u-icon name="info-circle" size="16" color="#f56c6c"></u-icon>
          <text>{{ error }}</text>
        </view>
      </view>

      <!-- 诊断结果区域 -->
      <view v-else class="result-section">
        <!-- <view class="result-header">
          <view class="result-icon">
            <u-icon name="info-circle" size="60" color="#ffc107"></u-icon>
          </view>
          <text class="result-title">诊断结果</text>
        </view> -->

        <view class="result-card">
          <view class="result-image">
            <u-image :src="diagnosisResult.diseaseImageUrl" width="100%" height="300rpx" mode="aspectFit"></u-image>
          </view>

          <view class="result-info">
            <view class="info-item">
              <text class="info-label">病变类型</text>
              <text class="info-value">{{ diagnosisResult.diseaseType }}</text>
            </view>
            <!-- <view class="info-item">
              <text class="info-label">识别置信度</text>
              <text class="info-value confidence">{{ (diagnosisResult.confidence * 100).toFixed(1) }}%</text>
            </view> -->
          </view>
        </view>

        <view class="diagnosis-detail">
          <text class="detail-title">诊断说明</text>
          <text class="detail-text">{{ diagnosisResult.symptoms }}</text>
        </view>

        <view class="treatment-plan">
          <text class="detail-title">治疗方案</text>
          <text class="detail-text">{{ diagnosisResult.treatmentPlan }}</text>
        </view>

        <!-- 专业治疗包 -->
        <view class="package-card">
          <treatmentPackage :treatmentPackages="treatmentPackages"></treatmentPackage>
        </view>

        <view v-if="recommended_products && recommended_products.length > 0" class="recommended-products">
          <text class="detail-title">推荐产品</text>
          <view class="products-list">
            <view v-for="product in recommended_products" :key="product.id" class="product-card"
              @click="viewProduct(product.id)">
              <u-image :src="product.image" width="120rpx" height="120rpx" mode="aspectFill" radius="8"></u-image>
              <view class="product-info">
                <text class="product-name">{{ product.name }}</text>
                <text class="product-price">¥{{ product.price }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="result-actions">
          <button class="btn btn-secondary" @click="resetDiagnosis">
            <text>重新诊断</text>
          </button>
          <button class="btn btn-primary" @click="saveDiagnosis">
            <text>保存记录</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { diseaseService } from '@/apis/modules/disease';
import { getUserPlants, getPlantDetail } from '@/apis/modules/plants';
import { analyzeDiseaseWithAI, getDiseaseRelatedProducts, createDiagnosis, getPackagesByDisease } from '@/apis/modules/disease';
import upload from '@/utils/upload';
import treatmentPackage from '../components/treatmentPackage.vue'

export default {
  name: 'PlantDiagnosis',
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      analyzing: false,
      diagnosisResult: null,
      error: null,
      selectedPlantId: null,
      userPlants: [],
      loadingPlants: false,
      loadingMore: false, // 加载更多状态
      showPlantSelector: false,
      recommended_products: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      totalPlants: 0, // 植物总数
      scrollLeft: 0, // 滚动位置
      treatmentPackages: []
    };
  },
  components: {
    treatmentPackage
  },
  onLoad(options) {
    if (options.plantId) {
      this.selectedPlantId = options.plantId;
      this.loadPlant()
    } else {
      this.loadUserPlants();
    }
  },
  computed: {
    selectedPlantName() {
      const plant = this.userPlants.find(p => p.id == this.selectedPlantId);
      console.log('plant', plant, this.userPlants)
      return plant ? plant.plantName : '';
    },
    hasMorePlants() {
      return this.userPlants.length < this.totalPlants;
    }
  },
  methods: {
    // 加载植物数据
    async loadPlant() {
      try {
        const response = await getPlantDetail(this.selectedPlantId, false);
        console.log('加载植物详情响应:', response);
        if (response.code === 200) {
          this.userPlants = [response.data];
          // console.log('plantDataBase', plantDataBase)
        }
      } catch (error) {
        console.error('加载植物详情失败:', error);
      }
    },

    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },

    // 加载用户植物列表
    async loadUserPlants() {
      if (this.loadingPlants || this.loadingMore) return;
      try {
        this.loadingPlants = true;
        const response = await getUserPlants(this.queryParams);
        if (response.code === 200 && response.rows) {
          this.userPlants = response.rows || [];
          this.totalPlants = response.total || 0;
        }
      } catch (error) {
        console.error('加载植物列表失败:', error);
      } finally {
        this.loadingPlants = false;
      }
    },

    // 加载更多植物
    async loadMorePlants() {
      // 如果正在加载或没有更多数据,则不执行
      if (this.loadingMore || !this.hasMorePlants) return;

      try {
        this.loadingMore = true;
        this.queryParams.pageNum += 1;

        const response = await getUserPlants(this.queryParams);

        if (response.code === 200 && response.rows) {
          // 追加新数据
          this.userPlants = [...this.userPlants, ...response.rows];
          this.totalPlants = response.total || 0;
        }
      } catch (error) {
        console.error('加载更多植物失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
        // 加载失败时回退页码
        this.queryParams.pageNum -= 1;
      } finally {
        this.loadingMore = false;
      }
    },

    // 选择植物
    selectPlant(plantId) {
      this.selectedPlantId = plantId;
      this.showPlantSelector = false;
    },

    // 清除植物选择
    clearPlantSelection() {
      this.selectedPlantId = null;
      this.queryParams.pageNum = 1;
      this.userPlants = [];
      this.loadUserPlants()
    },

    // 获取选中植物名称
    getSelectedPlantName() {
      const plant = this.userPlants.find(p => p.id === this.selectedPlantId);
      return plant ? plant.plantName : '';
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: async (res) => {
          uni.showLoading({
            title: '上传中...',
          });
          this.selectedFile = res.tempFilePaths[0];
          // this.tempFilePaths = res.tempFilePaths[0];
          const uploadResult = await upload({
            url: '/common/upload',
            method: 'post',
            filePath: res.tempFilePaths[0]
          });
          if (uploadResult.code === 200) {
            uni.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1500
            });
            this.previewUrl = uploadResult.url;
            console.log(this.previewUrl)
            // this.formData.custom_image = uploadResult.url;
          } else {
            uni.showToast({
              title: uploadResult.msg || '上传失败',
              icon: 'none',
              duration: 1500
            });
          }
          // this.h5ImageToBase64(this.previewUrl)
          this.error = null;
        },
        fail: (error) => {
          console.error('选择图片失败:', error);
          uni.showToast({
            title: '选择图片失败',
            icon: 'error'
          });
        }
      });
    },

    // 移除图片
    removeImage() {
      this.selectedFile = null;
      this.previewUrl = null;
    },

    // 开始分析
    async handleAnalyze() {
      console.log(this.selectedFile)
      if (!this.selectedFile) return;

      this.analyzing = true;
      this.error = null;

      try {
        // 模拟上传图片（实际项目中需要调用真实接口）
        const imageUrl = this.previewUrl;
        const base64Image = await this.h5ImageToBase64(this.selectedFile)
        // console.log(base64Image, imageUrl)
        // 调用AI分析服务
        uni.showLoading({
          title: '诊断中...',
        })
        const response = await analyzeDiseaseWithAI({
          base64Image,
          diseaseImageUrl: imageUrl
        });
        console.log('AI诊断响应:', response);
        if (response.code === 200 && response.data) {
          this.diagnosisResult = {
            ...response.data,
            imageUrl
          };
          this.loadTreatmentPackage()
          // 获取推荐产品
          // const productsResponse = await getDiseaseRelatedProducts({ 'disease_type': response.data.disease_type });
          // console.log('推荐产品响应:', productsResponse);
          // if (productsResponse.code === 200 && productsResponse.data) {
          //   this.recommended_products = productsResponse.data;
          // }
        } else {
          throw new Error(response.msg);
        }
      } catch (error) {
        console.error('诊断失败:', error);
        this.error = error.message || '诊断失败，请重试';
        uni.showToast({
          title: '诊断失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
        this.analyzing = false;
      }
    },


    h5ImageToBase64(tempFilePath) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = tempFilePath;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          // console.log('base64', base64)
          // 去掉 data:image/jpeg;base64, 前缀
          const pureBase64 = base64.replace(/^data:image\/jpeg;base64,/, '');
          resolve(pureBase64);
        };
      });
    },

    appImageToBase64(tempFilePath) {
      return new Promise((resolve, reject) => {
        const relativePath = tempFilePath.replace('file://', '');
        plus.io.resolveLocalFileSystemURL(relativePath, (entry) => {
          entry.file((file) => {
            const fileReader = new plus.io.FileReader();
            fileReader.onloadend = (e) => {
              resolve(e.target.result);
            };
            fileReader.onerror = reject;
            fileReader.readAsDataURL(file);
          });
        });
      });
    },

    mpImageToBase64(tempFilePath) {
      return new Promise((resolve, reject) => {
        const fileManager = wx.getFileSystemManager();
        fileManager.readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (res) => {
            // 微信小程序返回的是纯base64，需要拼接data URL
            const base64 = `data:image/jpeg;base64,${res.data}`;
            resolve(base64);
          },
          fail: reject
        });
      });
    },

    // 重置诊断
    resetDiagnosis() {
      this.diagnosisResult = null;
      this.removeImage();
    },

    // 保存诊断记录
    async saveDiagnosis() {
      try {
        const recordData = {
          plantId: this.selectedPlantId || '',
          plantName: this.selectedPlantName || '',
          diseaseImageUrl: this.diagnosisResult.diseaseImageUrl,
          diseaseType: this.diagnosisResult.diseaseType,
          symptoms: this.diagnosisResult.symptoms,
          treatmentPlan: this.diagnosisResult.treatmentPlan,
        };
        console.log(recordData)
        // return
        const response = await createDiagnosis(recordData);

        if (response.code === 200) {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });

          uni.$emit('refreshPlantList');
          uni.$emit('refreshPlantDetail');
          await this.$t.wait()
          // 根据是否有选择植物跳转到不同页面
          if (this.selectedPlantId) {
            uni.redirectTo({
              url: `/pages-plants/plants/plantsDetail/plantsDetail?plantId=${this.selectedPlantId}`
            });
          } else {
            uni.navigateTo({
              url: '/pages-plants/plants/diseaseRecords/diseaseRecords'
            });
          }
        } else {
          throw new Error(response.msg || '保存失败');
        }
      } catch (error) {
        console.error('保存失败:', error);
        // this.error = error.message || '保存失败，请重试';
        uni.showToast({
          title: error.message || '保存失败，请重试',
          icon: 'none'
        });
      }
    },

    // 查看产品详情
    viewProduct(productId) {
      uni.navigateTo({
        url: `/pages/shop/product?id=${productId}`
      });
    },
    async loadTreatmentPackage() {
      // 加载治疗套餐
      const packagesResponse = await getPackagesByDisease({ id: '7c32c55b-e271-40ca-abc1-ebf0db6e013b' });
      console.log('packagesResponse', packagesResponse)
      if (packagesResponse.code === 200) {
        this.treatmentPackages = packagesResponse.data || [];
      }

    },
  }
};
</script>

<style lang="scss" scoped>
.diagnosis-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  background-color: transparent;
  border: none;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.header-spacer {
  width: 64rpx;
}

.upload-section {
  padding: 60rpx 30rpx;
}

.plant-selector-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 60rpx;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.selector-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.btn-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  background-color: transparent;
  border: 1rpx solid #ddd;
  border-radius: 50%;
  color: #666;
}

.selected-plant-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  margin-top: 20rpx;
}

.selected-plant-info.generic {
  background-color: #f5f5f5;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.plant-name {
  font-weight: 600;
  color: #2ecc71;
}

.btn-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  color: #999;
}

.plant-selector-panel {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #eee;
}

.loading-plants {
  display: flex;
  justify-content: center;
  padding: 60rpx;
}

.empty-plants {
  text-align: center;
  padding: 60rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.plants-scroll {
  width: 100%;
  white-space: nowrap;
}

.plants-scroll-content {
  display: inline-flex;
  padding: 10rpx 0;
}

.plant-option {
  flex-shrink: 0;
  width: 200rpx;
  margin-right: 20rpx;
}

.plant-option.selected .plant-option-image {
  border-color: #2ecc71;
}

.plant-option-image {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  border: 4rpx solid transparent;
}

.plant-option-image image {
  width: 100%;
  height: 100%;
}

.check-mark {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  background-color: #2ecc71;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.plant-option-info {
  text-align: center;
}

.plant-option-name {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-option-status {
  font-size: 22rpx;
  color: #999;
}

.loading-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 200rpx;
}

.no-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 150rpx;
  height: 200rpx;
}

.no-more-text {
  font-size: 24rpx;
  color: #999;
}

.upload-guide {
  text-align: center;
  margin-bottom: 120rpx;
}

.guide-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.guide-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.guide-description {
  display: block;
  font-size: 28rpx;
  color: #999;
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 600rpx;
  margin: 0 auto 60rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #fff;
  padding: 20rpx;
}

.btn-remove-image {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
}

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  max-width: 600rpx;
  margin: 0 auto;
}

.btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #2ecc71 0%, #4CAF50 100%);
  color: #fff;
}

.btn-outline {
  background: #fff;
  color: #2ecc71;
  border: 2rpx solid #2ecc71;
  margin-bottom: 30rpx;
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

.error-message {
  display: flex;
  align-items: center;
  gap: 12rpx;
  max-width: 600rpx;
  margin: 30rpx auto 0;
  padding: 20rpx 30rpx;
  background-color: rgba(245, 108, 108, 0.1);
  border: 1rpx solid #f56c6c;
  border-radius: 16rpx;
  color: #f56c6c;
  font-size: 26rpx;
  text-align: center;
}

.result-section {
  padding: 30rpx;
}

.result-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.result-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.result-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.result-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.result-image {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  background-color: #f8f8f8;
  padding: 20rpx;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #999;
}

.info-value {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.info-value.confidence {
  color: #ffc107;
}

.diagnosis-detail,
.treatment-plan {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.detail-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.detail-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.recommended-products {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.product-info {
  flex: 1;
  margin-left: 20rpx;
}

.product-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.product-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #f56c6c;
}

.result-actions {
  display: flex;
  gap: 30rpx;
}

.result-actions .btn {
  flex: 1;
}

button[disabled] {
  color: rgba(255, 255, 255, 0.8);
}
</style>