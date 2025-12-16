<template>
  <view class="disease-library">
    <!-- 页面头部 -->
    <!-- <view class="header">
      <text class="title">植物疾病库</text>
      <text class="subtitle">了解常见植物病害，科学防治</text>
    </view> -->

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="search-box">
        <u-input v-model="searchText" placeholder="搜索疾病名称、症状..." @input="handleSearch" border="none" clearable>
          <template #prefix>
            <u-icon name="search" size="18" color="#999"></u-icon>
          </template>
        </u-input>
      </view>

      <!-- <view class="filters">
  <view class="filter-item">
    <u-select v-model="showCategorySelect" :list="categoryOptions" @confirm="confirmCategory">
      <view class="filter-select" @click="showCategorySelect = true">
        <text class="filter-text">{{ selectedCategory || '全部分类' }}</text>
        <u-icon name="arrow-down" size="14" color="#666"></u-icon>
      </view>
    </u-select>
  </view>

  <view class="filter-item">
    <u-select v-model="showSeveritySelect" :list="severityOptions" @confirm="confirmSeverity">
      <view class="filter-select" @click="showSeveritySelect = true">
        <text class="filter-text">{{ selectedSeverity || '全部严重度' }}</text>
        <u-icon name="arrow-down" size="14" color="#666"></u-icon>
      </view>
    </u-select>
  </view>
</view> -->
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <u-loading-icon></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-else-if="diseases.length === 0" class="empty-state">
      <u-icon name="file-text" size="80" color="#ccc"></u-icon>
      <text class="empty-text">没有找到相关疾病</text>
    </view>

    <!-- 疾病网格 -->
    <view v-else class="disease-grid">
      <view v-for="disease in diseases" :key="disease.id" class="disease-card" @click="goToDetail(disease.id)">
        <view class="disease-image">
          <u-image :src="disease.image_url || 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'"
            width="100%" height="360rpx" mode="aspectFill"></u-image>
          <view class="severity-badge" :class="classMap[disease.severity]">
            <text>{{ disease.severity }}</text>
          </view>
        </view>

        <view class="disease-info">
          <text class="disease-name">{{ disease.name }}</text>
          <text class="disease-name-en">{{ disease.name_en }}</text>
          <view class="disease-meta">
            <view class="category-tag">
              <text>{{ disease.category }}</text>
            </view>
          </view>
          <text class="disease-desc">{{ truncateText(disease.description, 60) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getDiseaseList,
} from '@/apis/modules/disease';

export default {
  name: 'DiseaseLibrary',
  data() {
    return {
      diseases: [],
      loading: false,
      searchText: '',
      selectedCategory: '',
      selectedSeverity: '',
      searchTimeout: null,
      showCategorySelect: false,
      showSeveritySelect: false,
      categoryOptions: [
        { label: '全部分类', value: '' },
        { label: '真菌病害', value: '真菌病害' },
        { label: '细菌病害', value: '细菌病害' },
        { label: '病毒病害', value: '病毒病害' },
        { label: '虫害', value: '虫害' },
        { label: '生理病害', value: '生理病害' }
      ],
      severityOptions: [
        { label: '全部严重度', value: '' },
        { label: '轻度', value: '轻度' },
        { label: '中度', value: '中度' },
        { label: '重度', value: '重度' }
      ],
      classMap: {
        '轻度': 'severity-low',
        '中度': 'severity-medium',
        '重度': 'severity-high'
      }
    }
  },
  onLoad() {
    this.loadDiseases()
  },
  methods: {
    async loadDiseases() {
      this.loading = true
      try {
        const diseasesResult = await getDiseaseList({
          pageNum: 1,
          pageSize: 10
        })
        if (diseasesResult.code === 200) {
          this.diseases = diseasesResult.data
        }
        console.log('this.diseases', this.diseases)
      } catch (error) {
        console.error('加载疾病列表失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    // 获取模拟数据
    getMockDiseases() {
      return [
        {
          id: 1,
          name: '叶片褐斑病',
          name_en: 'Leaf Spot Disease',
          category: '真菌病害',
          severity: '中度',
          description: '由真菌感染引起的常见病害，主要表现为叶片上出现圆形或不规则的褐色斑点。',
          image_url: 'https://images.pexels.com/photos/6231137/pexels-photo-6231137.jpeg'
        },
        {
          id: 2,
          name: '白粉病',
          name_en: 'Powdery Mildew',
          category: '真菌病害',
          severity: '轻度',
          description: '叶片表面出现白色粉末状霉层，影响植物光合作用。',
          image_url: 'https://images.pexels.com/photos/6231138/pexels-photo-6231138.jpeg'
        },
        {
          id: 3,
          name: '根腐病',
          name_en: 'Root Rot',
          category: '真菌病害',
          severity: '重度',
          description: '根系腐烂，植株萎蔫，严重时导致整株死亡。',
          image_url: 'https://images.pexels.com/photos/6231139/pexels-photo-6231139.jpeg'
        },
        {
          id: 4,
          name: '蚜虫危害',
          name_en: 'Aphid Damage',
          category: '虫害',
          severity: '轻度',
          description: '蚜虫吸食植物汁液，导致叶片卷曲、变黄。',
          image_url: 'https://images.pexels.com/photos/6231140/pexels-photo-6231140.jpeg'
        },
        {
          id: 5,
          name: '红蜘蛛',
          name_en: 'Spider Mite',
          category: '虫害',
          severity: '中度',
          description: '叶片出现黄白色小点，严重时叶片枯黄脱落。',
          image_url: 'https://images.pexels.com/photos/6231141/pexels-photo-6231141.jpeg'
        },
        {
          id: 6,
          name: '缺素症',
          name_en: 'Nutrient Deficiency',
          category: '生理病害',
          severity: '轻度',
          description: '由于缺乏某种营养元素导致的生长异常。',
          image_url: 'https://images.pexels.com/photos/6231142/pexels-photo-6231142.jpeg'
        }
      ]
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.loadDiseases()
      }, 500)
    },

    // 确认分类选择
    confirmCategory(e) {
      this.selectedCategory = e[0].value
      this.loadDiseases()
    },

    // 确认严重度选择
    confirmSeverity(e) {
      this.selectedSeverity = e[0].value
      this.loadDiseases()
    },

    // 跳转到详情页
    goToDetail(diseaseId) {
      uni.navigateTo({
        url: `/pages-plants/plants/diseaseDetail/diseaseDetail?id=${diseaseId}`
      })
    },

    // 获取严重度类名
    // getSeverityClass(severity) {
    //   const classMap = {
    //     '轻度': 'severity-low',
    //     '中度': 'severity-medium',
    //     '重度': 'severity-high'
    //   }
    //   return classMap[severity] || 'severity-medium'
    // },

    // 截断文本
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: #999;
}

.filter-bar {
  background: white;
  padding: 30rpx;
  border-radius: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.search-box {}

.filters {
  display: flex;
  gap: 20rpx;
}

.filter-item {
  flex: 1;
}

.filter-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  border: 1rpx solid #e0e0e0;
}

.filter-text {
  font-size: 28rpx;
  color: #333;
}

.disease-library {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 30rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 30rpx;
}

.disease-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.disease-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  width: 48%;
  margin-bottom: 30rpx;
}

.disease-image {
  position: relative;
  width: 100%;
  height: 360rpx;
  overflow: hidden;
  background: #f5f5f5;
}

.severity-badge {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: white;
}

.severity-low {
  background: rgba(52, 152, 219, 0.95);
}

.severity-medium {
  background: rgba(241, 196, 15, 0.95);
}

.severity-high {
  background: rgba(231, 76, 60, 0.95);
}

.disease-info {
  padding: 32rpx;
}

.disease-name {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.disease-name-en {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 24rpx;
  font-style: italic;
}

.disease-meta {
  margin-bottom: 24rpx;
}

.category-tag {
  display: inline-block;
  padding: 8rpx 20rpx;
  background: #ecf0f1;
  color: #27ae60;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.disease-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
</style>