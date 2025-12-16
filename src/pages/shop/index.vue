<template>
  <view class="shop-page page-wrapper">
    <!-- <u-sticky zIndex="98" :customNavHeight="0">
      <view class="page-header">
        <text class="page-title">植物商城</text>
        <view class="cart-icon" @click="goToCart">
          <image src="/static/cart.png" class="cart-image"></image>
          <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
        </view>
      </view>
    </u-sticky> -->

    <u-sticky zIndex="98" :customNavHeight="0">
      <u-navbar :fixed="false" bgColor="#ffffff" title="植物商城">
        <template slot="left">
          <view></view>
        </template>
        <template slot="right">
          <view class="cart-icon" @click="goToCart">
            <image src="/static/cart.png" class="cart-image"></image>
            <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
          </view>
        </template>
      </u-navbar>
    </u-sticky>

    <view class="page-content">
      <view class="banner">
        <view class="banner-content">
          <text class="banner-title">精选好养植物 · 轻松打造绿色家居</text>
          <text class="banner-subtitle">配送+种植+包换 · 一站式无忧服务</text>
        </view>
      </view>

      <view class="category-nav">
        <scroll-view class="category-scroll" scroll-x="true">
          <view class="category-item" :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')">
            <text class="category-icon">🛒</text>
            <text class="category-name">全部</text>
          </view>
          <view class="category-item" :class="{ active: selectedCategory === 'plants' }"
            @click="selectCategory('plants')">
            <text class="category-icon">🌱</text>
            <text class="category-name">植物</text>
          </view>
          <view v-for="cat in categories" :key="cat.id" class="category-item"
            :class="{ active: selectedCategory === cat.name }" @click="selectCategory(cat.name)">
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </scroll-view>
      </view>

      <view class="recommended-section">
        <view class="section-header">
          <text class="section-title">推荐植物 TOP10</text>
          <text class="section-subtitle">好养易活 · 高颜值首选</text>
        </view>

        <view v-if="loading" class="loading-container">
          <view class="loading"></view>
        </view>

        <view v-else class="plants-grid">
          <view v-for="plant in recommendedPlants" :key="plant.id" class="plant-card"
            @click="viewPlantDetail(plant.id)">
            <view class="plant-image">
              <image :src="plant.image_url" :alt="plant.name" class="plant-img" />
              <view class="plant-badge">NO.{{ plant.recommendation_rank }}</view>
              <view class="plant-tags">
                <text v-if="plant.care_difficulty <= 2" class="tag tag-easy">易养</text>
                <text v-if="plant.beauty_score >= 9" class="tag tag-beauty">高颜值</text>
              </view>
            </view>
            <view class="plant-info">
              <text class="plant-name">{{ plant.name }}</text>
              <view class="plant-meta">
                <view class="meta-item">
                  <text class="meta-icon">⭐</text>
                  <text class="meta-text">{{ plant.beauty_score }}分</text>
                </view>
                <text class="meta-item difficulty">{{ getDifficultyText(plant.care_difficulty) }}</text>
              </view>
              <view class="plant-price">
                <text class="price-from">¥38起</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="all-products-section">
        <text class="section-title">{{ getCategoryTitle() }}</text>
        <view v-if="loadingProducts" class="loading-container">
          <view class="loading"></view>
        </view>
        <view v-else class="products-list">
          <view v-for="product in displayProducts" :key="product.id" class="product-item"
            @click="viewProductDetail(product)">
            <view class="product-image-small">
              <image :src="product.image_url" :alt="product.name" class="product-img" />
              <view v-if="product.tags && product.tags.length > 0" class="product-tags">
                <text v-for="tag in product.tags.slice(0, 2)" :key="tag" class="product-tag">{{ tag }}</text>
              </view>
            </view>
            <view class="product-info-main">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-spec">{{ product.size_spec || product.category_name }}</text>
              <view class="product-price-row">
                <text class="current-price">¥{{ product.price }}</text>
                <text v-if="product.original_price" class="original-price">¥{{ product.original_price }}</text>
              </view>
            </view>
            <button class="add-cart-btn" @click.stop="quickAddToCart(product)">
              {{ product.size_spec ? '加入' : '查看' }}
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { plantProductsService } from '@/services/plantProducts';
// import { cartService } from '@/services/cart';
// import { recommendationsService } from '@/services/recommendations';
import {
  getRecommendedPlants,
  getProductCategories,
  getAccessoryProducts,
  getCartCount
} from '@/apis/modules/shop';
import { getRecommendedProducts } from '@/apis/modules/plants';

export default {
  name: 'Shop',
  data() {
    return {
      recommendedPlants: [],
      allProducts: [],
      accessoryProducts: [],
      categories: [],
      selectedCategory: 'all',
      cartCount: 0,
      loading: false,
      loadingProducts: false
    };
  },
  computed: {
    displayProducts() {
      if (this.selectedCategory === 'all') {
        return [...this.allProducts, ...this.accessoryProducts];
      } else if (this.selectedCategory === 'plants') {
        return this.allProducts;
      } else {
        return this.accessoryProducts.filter(p => p.category_name === this.selectedCategory);
      }
    }
  },
  async onLoad() {
    await this.loadData();
    await this.loadCategories();
    await this.loadAccessories();
    await this.loadCartCount();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        const recommendedPlantsResult = await getRecommendedPlants();
        if (recommendedPlantsResult.code === 200) {
          this.recommendedPlants = recommendedPlantsResult.data
          console.log('推荐植物:', this.recommendedPlants);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }

      try {
        this.loadingProducts = true;
        const allProductsResult = await getRecommendedProducts(30);
        if (allProductsResult.code === 200) {
          this.allProducts = allProductsResult.data;
        }
      } catch (error) {
        console.error('加载商品失败:', error);
      } finally {
        this.loadingProducts = false;
      }
    },

    async loadCategories() {
      try {
        const categoriesResult = await getProductCategories();
        if (categoriesResult.code === 200) {
          this.categories = categoriesResult.data
          console.log('植物分类响应', this.categories)
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    },

    async loadAccessories() {
      try {
        const accessoryProductsData = await getAccessoryProducts({ categoryName: null, limit: 50 });
        if (accessoryProductsData.code === 200) {
          this.accessoryProducts = accessoryProductsData.data;
        }
      } catch (error) {
        console.error('加载养护用品失败:', error);
      }
    },

    async selectCategory(category) {
      this.selectedCategory = category;
    },

    getCategoryTitle() {
      if (this.selectedCategory === 'all') return '全部商品';
      if (this.selectedCategory === 'plants') return '植物专区';
      return this.selectedCategory;
    },

    async loadCartCount() {
      try {
        const cartCountData = await getCartCount();
        console.log('购物车数量响应:', cartCountData);
        if (cartCountData.code === 200) {
          this.cartCount = cartCountData.data;
        }
      } catch (error) {
        console.error('加载购物车数量失败:', error);
      }
    },

    getDifficultyText(level) {
      const texts = { 1: '非常容易', 2: '容易', 3: '中等', 4: '较难', 5: '困难' };
      return texts[level] || '未知';
    },

    viewPlantDetail(plantId) {
      uni.navigateTo({
        url: `/pages-plants/plants/productDetail/productDetail?id=${plantId}&type=plant`
      });
    },

    viewProductDetail(product) {
      console.log('查看商品详情:', product);
      if (product.size_spec) {
        uni.navigateTo({
          url: `/pages/shop/productDetail?id=${product.id}`
        });
      } else {
        uni.navigateTo({
          url: `/pages-plants/plants/productDetail/productDetail?id=${product.id}&type=accessory`
        });
      }
    },

    async quickAddToCart(product) {
      if (product.size_spec) {
        await addToCart(product.id, null, 1, 'plant');
        this.cartCount++;
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
      } else {
        uni.navigateTo({
          url: `/pages/shop/accessoryDetail?id=${product.id}`
        });
      }
    },

    goToCart() {
      uni.navigateTo({
        url: '/pages-plants/plants/cart/cart'
      });
    }
  }
};
</script>

<style scoped>
.shop-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  position: relative;
  padding: 0 32rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.cart-icon {
  position: absolute;
  right: 32rpx;
  color: #333333;
}

.cart-image {
  width: 48rpx;
  height: 48rpx;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  background-color: #ff4444;
  color: white;
  font-size: 20rpx;
  border-radius: 20rpx;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
}

.banner {
  background: linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%);
  padding: 48rpx 32rpx;
  text-align: center;
}

.banner-title {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.banner-subtitle {
  display: block;
  font-size: 28rpx;
  color: #666666;
}

.recommended-section,
.all-products-section {
  padding: 40rpx 32rpx;
}

.section-header {
  margin-bottom: 32rpx;
}

.section-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.section-subtitle {
  display: block;
  font-size: 26rpx;
  color: #666666;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80rpx;
}

.loading {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f0f0f0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.plants-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -16rpx;
}

.plant-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  margin: 0 16rpx 32rpx 16rpx;
  width: calc(50% - 32rpx);
  box-sizing: border-box;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.plant-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.plant-img {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.plant-badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background-color: #4CAF50;
  color: white;
  font-size: 24rpx;
  font-weight: 600;
  padding: 8rpx 16rpx;
  border-radius: 24rpx;
}

.plant-tags {
  position: absolute;
  bottom: 16rpx;
  left: 16rpx;
  display: flex;
}

.tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 500;
  margin-right: 8rpx;
}

.tag:last-child {
  margin-right: 0;
}

.tag-easy {
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
}

.tag-beauty {
  background-color: rgba(255, 87, 34, 0.9);
  color: white;
}

.plant-info {
  padding: 24rpx;
}

.plant-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16rpx;
}

.plant-meta {
  display: flex;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: #666666;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-right: 24rpx;
}

.meta-item:last-child {
  margin-right: 0;
}

.meta-icon {
  margin-right: 4rpx;
}

.difficulty {
  padding: 4rpx 12rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}

.plant-price {
  font-size: 28rpx;
  color: #666666;
}

.products-list {
  display: flex;
  flex-direction: column;
}

.product-item {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-image-small {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-right: 32rpx;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
}

.product-info-main {
  flex: 1;
  margin-right: 32rpx;
}

.product-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.product-spec {
  display: block;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 12rpx;
}

.product-price-row {
  display: flex;
  align-items: baseline;
}

.current-price {
  font-size: 36rpx;
  font-weight: 600;
  color: #ff4444;
  margin-right: 16rpx;
}

.original-price {
  font-size: 26rpx;
  color: #666666;
  text-decoration: line-through;
}

.add-cart-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 16rpx 32rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  flex-shrink: 0;
}

.category-nav {
  background-color: #ffffff;
  padding: 32rpx 0;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 96rpx;
  z-index: 10;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 32rpx;
}

.category-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: 120rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.category-item:last-child {
  margin-right: 0;
}

.category-item.active {
  background-color: #f5f5f5;
}

.category-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.category-name {
  font-size: 24rpx;
  color: #333333;
  white-space: nowrap;
}

.category-item.active .category-name {
  font-weight: 600;
  color: #4CAF50;
}

.product-tags {
  position: absolute;
  bottom: 8rpx;
  left: 8rpx;
  display: flex;
  flex-wrap: wrap;
}

.product-tag {
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  font-weight: 500;
  margin-right: 8rpx;
  margin-bottom: 8rpx;
}

.product-tag:last-child {
  margin-right: 0;
}
</style>
