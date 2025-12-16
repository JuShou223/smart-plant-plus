<template>
  <view class="product-detail-page page-wrapper">
    <u-sticky zIndex="98" :customNavHeight="0">
      <view class="page-header">
        <button class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#333"></u-icon>
        </button>
        <text class="page-title">商品详情</text>
        <view class="cart-icon" @click="goToCart">
          <image src="/static/cart.png" class="cart-image"></image>
          <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
        </view>
      </view>
    </u-sticky>

    <view v-if="loading" class="loading-container">
      <view class="loading"></view>
    </view>

    <view v-else-if="product || plant" class="page-content">
      <view class="product-images">
        <image :src="productImage" :alt="productName" class="product-img" />
      </view>

      <view class="product-main-info">
        <view v-if="isAccessory" class="product-header">
          <view class="product-category">
            <text class="category-icon">{{ product.category_icon }}</text>
            <text class="category-text">{{ product.category_name }}</text>
          </view>
          <view v-if="product.tags && product.tags.length > 0" class="product-tags">
            <text v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</text>
          </view>
        </view>

        <text class="product-title">{{ productName }}</text>
        <text v-if="isPlant" class="product-subtitle">{{ plant.scientific_name }}</text>

        <view class="product-tags" v-if="isPlant">
          <text class="tag">{{ plant.category }}</text>
          <text v-if="plant.care_difficulty <= 2" class="tag tag-easy">易养</text>
          <text v-if="plant.beauty_score >= 9" class="tag tag-beauty">高颜值</text>
        </view>

        <view class="product-price-section">
          <view class="price-main">
            <text class="current-price">¥{{ displayPrice }}</text>
            <text v-if="selectedSpec && selectedSpec.original_price" class="original-price">¥{{
              selectedSpec.original_price }}</text>
          </view>
          <text v-if="isAccessory" class="product-sales">已售{{ product.sales }}件</text>
        </view>
      </view>

      <view class="specs-section">
        <text class="section-title">选择规格</text>
        <text v-if="specTypeDisplay" class="spec-type-label">{{ specTypeDisplay }}</text>
        <view class="specs-list">
          <view v-for="spec in specifications" :key="spec.id" class="spec-item" :class="{
            active: selectedSpec && selectedSpec.id === spec.id,
            'out-of-stock': isAccessory && spec.stock <= 0
          }" @click="selectSpec(spec)">
            <view class="spec-info">
              <text class="spec-name">{{ spec.size_spec || spec.spec_name }}</text>
              <view class="spec-price">
                <text class="current">¥{{ spec.price }}</text>
                <text v-if="spec.original_price" class="original">¥{{ spec.original_price }}</text>
              </view>
              <text v-if="isAccessory && spec.stock <= 0" class="stock-label">缺货</text>
            </view>
            <view v-if="selectedSpec && selectedSpec.id === spec.id" class="spec-check">
              <text class="check-icon">✓</text>
            </view>
          </view>
        </view>
      </view>

      <view class="service-section">
        <text class="section-title">选择服务套餐</text>
        <view class="service-list">
          <view v-for="pkg in servicePackages" :key="pkg.id" class="service-item"
            :class="{ active: selectedService && selectedService.id === pkg.id }" @click="selectService(pkg)">
            <view class="service-main">
              <text class="service-name">{{ pkg.name }}</text>
              <text class="service-price">
                <text v-if="pkg.price_adjustment > 0">+¥{{ pkg.price_adjustment }}</text>
                <text v-else>免费</text>
              </text>
            </view>
            <text class="service-desc">{{ pkg.description }}</text>
            <view v-if="isPlant" class="service-features">
              <text v-if="pkg.include_delivery" class="feature-tag">包邮</text>
              <text v-if="pkg.include_planting" class="feature-tag">上门种植</text>
              <text v-if="pkg.include_warranty" class="feature-tag">{{ pkg.warranty_days }}天包换</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="isPlant" class="care-guide-section">
        <text class="section-title">养护指南</text>
        <view class="guide-grid">
          <view class="guide-item">
            <text class="guide-label">光照需求</text>
            <text class="guide-value">{{ plant.light_requirement }}</text>
          </view>
          <view class="guide-item">
            <text class="guide-label">浇水频率</text>
            <text class="guide-value">{{ plant.water_frequency }}</text>
          </view>
          <view class="guide-item">
            <text class="guide-label">适宜温度</text>
            <text class="guide-value">{{ plant.temperature_range }}</text>
          </view>
          <view class="guide-item">
            <text class="guide-label">湿度要求</text>
            <text class="guide-value">{{ plant.humidity_requirement }}</text>
          </view>
        </view>
        <view class="care-tips">
          <text class="care-tips-title">养护要点</text>
          <text class="care-tips-content">{{ plant.care_tips }}</text>
        </view>
      </view>

      <view v-if="isAccessory" class="product-details-section">
        <view v-if="product.specifications" class="detail-block">
          <text class="section-title">规格说明</text>
          <text class="detail-text">{{ product.specifications }}</text>
        </view>

        <view v-if="product.description" class="detail-block">
          <text class="section-title">商品介绍</text>
          <text class="detail-text">{{ product.description }}</text>
        </view>

        <view v-if="product.usage_guide" class="detail-block">
          <text class="section-title">使用说明</text>
          <text class="detail-text">{{ product.usage_guide }}</text>
        </view>
      </view>

      <view v-if="recommendedProducts.length > 0" class="recommended-section">
        <text class="section-title">{{ isPlant ? '配套推荐' : '相关推荐' }}</text>
        <text v-if="isPlant" class="section-subtitle">为您的{{ productName }}推荐以下养护用品</text>
        <view class="recommended-products" :class="{ 'recommended-grid': isAccessory }">
          <view v-for="item in recommendedProducts" :key="item.id" class="recommended-item"
            @click="viewRecommendedProduct(item)">
            <view class="rec-image">
              <image :src="item.image_url" :alt="item.name" class="rec-img" />
            </view>
            <view class="rec-info">
              <text class="rec-name">{{ item.name }}</text>
              <text v-if="isPlant && item.recommendation_reason" class="rec-reason">{{ item.recommendation_reason
              }}</text>
              <view class="rec-bottom">
                <text class="rec-price">¥{{ item.price }}{{ isAccessory ? '起' : '' }}</text>
                <button v-if="isPlant" class="btn-quick-add" @click.stop="quickAddToCart(item.id)">
                  <text class="add-icon">+</text>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-bar">
        <view class="total-price">
          <text class="price-label">总价</text>
          <text class="price-value">¥{{ totalPrice }}</text>
        </view>
        <button class="btn-add-cart" @click="addToCart"
          :disabled="isAccessory && selectedSpec && selectedSpec.stock <= 0">
          加入购物车
        </button>
        <button class="btn-buy-now" @click="buyNow" :disabled="isAccessory && selectedSpec && selectedSpec.stock <= 0">
          立即购买
        </button>
      </view>
    </view>
  </view>
</template>

<script>
// import { plantProductsService } from '@/services/plantProducts';
// import { accessoriesService } from '@/services/accessories';
// import { cartService } from '@/services/cart';
// import { recommendationsService } from '@/services/recommendations';

import {
  getRecommendedPlants,
  getProductCategories,
  getAccessoryProducts,
  getCartCount,
  getProductsByPlant,
  getAccessoryDetail,
  getAccessorySpecifications,
  getAccessoryServicePackages,
  getPlantRelatedProducts
} from '@/apis/modules/shop';
import { getRecommendedProducts, getServicePackages } from '@/apis/modules/plants';


export default {
  name: 'ProductDetail',
  data() {
    return {
      productType: 'plant',
      plant: null,
      product: null,
      specifications: [],
      servicePackages: [],
      recommendedProducts: [],
      selectedSpec: null,
      selectedService: null,
      cartCount: 0,
      loading: false,
      productId: null
    };
  },
  computed: {
    isPlant() {
      return this.productType === 'plant';
    },
    isAccessory() {
      return this.productType === 'accessory';
    },
    productName() {
      if (this.isPlant) {
        return this.plant.name || '';
      }
      return this.product.name || '';
    },
    productImage() {
      if (this.isPlant) {
        return this.plant.image_url || '';
      }
      return this.product.image_url || '';
    },
    displayPrice() {
      return this.selectedSpec ? this.selectedSpec.price : (this.product.price || 0);
    },
    totalPrice() {
      if (!this.selectedSpec) return '0.00';
      const productPrice = parseFloat(this.selectedSpec.price);
      const servicePrice = this.selectedService ? parseFloat(this.selectedService.price_adjustment) : 0;
      return (productPrice + servicePrice).toFixed(2);
    },
    specTypeDisplay() {
      if (!this.isAccessory || !this.selectedSpec) return '';
      const types = {
        'weight': '重量',
        'volume': '容量',
        'size': '尺寸',
        'model': '型号'
      };
      return types[this.selectedSpec.spec_type] || '规格';
    }
  },
  onLoad(options) {
    console.log('路由参数:', options);
    this.productId = options.id;
    this.productType = options.type;
    this.loadData();
    this.loadCartCount();
    this.loadRecommendations();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    // determineProductType() {
    //   const route = getCurrentPages()[getCurrentPages().length - 1];
    //   const path = route.route;
    //   if (path.includes('plant')) {
    //     this.productType = 'plant';
    //   } else if (path.includes('accessory')) {
    //     this.productType = 'accessory';
    //   }
    // },
    async loadData() {
      try {
        this.loading = true;

        if (this.isPlant) {
          await this.loadPlantData();
        } else {
          await this.loadAccessoryData();
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    async loadPlantData() {
      const [plantsData, productsData, packagesData] = await Promise.all([
        getRecommendedPlants(),
        getProductsByPlant({ plantId: this.productId }),
        getServicePackages()
      ]);
      const plants = plantsData.code === 200 ? plantsData.data : [];
      const products = productsData.code === 200 ? productsData.data : [];
      const packages = packagesData.code === 200 ? packagesData.data : [];
      console.log('加载数据响应:', { plants, products, packages });

      this.plant = plants.find(p => p.id === this.productId);
      this.specifications = products;
      this.servicePackages = packages;

      if (this.specifications.length > 0) {
        this.selectedSpec = this.specifications[0];
      }
      if (this.servicePackages.length > 0) {
        const defaultPackage = this.servicePackages.find(pkg => pkg.is_default);
        this.selectedService = defaultPackage || this.servicePackages[0];
      }
    },
    async loadAccessoryData() {
      const [productData, specsData, packagesData] = await Promise.all([
        getAccessoryDetail({ productId: this.productId }),
        getAccessorySpecifications({ productId: this.productId }),
        getAccessoryServicePackages()
      ]);
      console.log('加载配件数据响应:', { productData, specsData, packagesData });
      const product = productData.code === 200 ? productData.data : null;
      const specs = specsData.code === 200 ? specsData.data : [];
      const packages = packagesData.code === 200 ? packagesData.data : [];
      this.product = product;
      this.specifications = specs;
      this.servicePackages = packages;

      if (this.specifications.length > 0) {
        const defaultSpec = this.specifications.find(s => s.is_default && s.stock > 0);
        this.selectedSpec = defaultSpec || this.specifications.find(s => s.stock > 0) || this.specifications[0];
      }
      if (this.servicePackages.length > 0) {
        const defaultPackage = this.servicePackages.find(pkg => pkg.is_default);
        this.selectedService = defaultPackage || this.servicePackages[0];
      }
    },
    async loadCartCount() {
      try {
        const cartCountData = await getCartCount();
        if (cartCountData.code === 200) {
          this.cartCount = cartCountData.data || 0;
        }
      } catch (error) {
        console.error('加载购物车数量失败:', error);
      }
    },
    async loadRecommendations() {
      try {
        if (this.isPlant) {
          const recommendedProductsData = await getPlantRelatedProducts({ plantId: this.productId, limit: 6 });
          console.log('加载推荐商品响应:', recommendedProductsData);
          if (recommendedProductsData.code === 200) {
            this.recommendedProducts = recommendedProductsData.data || [];
          }
        } else if (this.product && this.product.category_name) {
          const productsData = await getAccessoryProducts(
            {
              categoryName: this.product.category_name,
              limit: 6
            }
          );
          if (productsData.code === 200) {
            const products = productsData.data || [];
            this.recommendedProducts = products.filter(p => p.id !== this.product.id).slice(0, 4);
          }
        }
      } catch (error) {
        console.error('加载推荐商品失败:', error);
      }
    },
    selectSpec(spec) {
      if (this.isAccessory && spec.stock <= 0) {
        return;
      }
      this.selectedSpec = spec;
    },
    selectService(service) {
      this.selectedService = service;
    },
    async addToCart() {
      if (!this.selectedSpec) {
        uni.showToast({
          title: '请选择规格',
          icon: 'none'
        });
        return;
      }

      if (this.isAccessory && this.selectedSpec.stock <= 0) {
        uni.showToast({
          title: '该规格已售罄',
          icon: 'none'
        });
        return;
      }

      try {
        await cartService.addToCart(
          this.selectedSpec.id,
          this.selectedService ? this.selectedService.id : null,
          1,
          this.productType
        );
        this.cartCount++;
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
      } catch (error) {
        console.error('添加购物车失败:', error);
        uni.showToast({
          title: '添加失败，请重试',
          icon: 'none'
        });
      }
    },
    async buyNow() {
      if (!this.selectedSpec) {
        uni.showToast({
          title: '请选择规格',
          icon: 'none'
        });
        return;
      }

      await this.addToCart();
      uni.navigateTo({
        url: '/pages/cart/index'
      });
    },
    async quickAddToCart(productId) {
      try {
        await cartService.addToCart(productId, null, 1, 'accessory');
        this.cartCount++;
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
      } catch (error) {
        console.error('添加购物车失败:', error);
        uni.showToast({
          title: '添加失败，请重试',
          icon: 'none'
        });
      }
    },
    viewRecommendedProduct(item) {
      uni.navigateTo({
        url: `/pages/shop/accessoryDetail?id=${item.id}`
      });
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
.product-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 200rpx;
}

.page-header {
  position: relative;
  padding: 32rpx;
  background-color: #ffffff;
  border-bottom: 2rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 32rpx;
  padding: 0;
  color: #333333;
}

.back-text {
  font-size: 40rpx;
  font-weight: 600;
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
  top: -16rpx;
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

.product-images {
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  position: relative;
  background-color: #ffffff;
}

.product-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.product-main-info {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.product-category {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 8rpx 24rpx;
  border-radius: 16rpx;
  margin-right: 16rpx;
}

.category-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

.category-text {
  font-size: 24rpx;
  color: #666666;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24rpx;
}

.tag {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  background-color: #f5f5f5;
  color: #666666;
  margin-right: 16rpx;
  margin-bottom: 8rpx;
}

.tag:last-child {
  margin-right: 0;
}

.tag-easy {
  background-color: #4caf50;
  color: white;
}

.tag-beauty {
  background-color: #ff5722;
  color: white;
}

.product-title {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.product-subtitle {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 24rpx;
}

.product-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 2rpx solid #e0e0e0;
}

.price-main {
  display: flex;
  align-items: baseline;
}

.current-price {
  font-size: 56rpx;
  font-weight: 700;
  color: #ff4444;
  margin-right: 24rpx;
}

.original-price {
  font-size: 32rpx;
  color: #666666;
  text-decoration: line-through;
}

.product-sales {
  font-size: 26rpx;
  color: #666666;
}

.specs-section,
.service-section,
.care-guide-section,
.product-details-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 32rpx;
}

.spec-type-label {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 24rpx;
}

.specs-list,
.service-list {
  display: flex;
  flex-direction: column;
}

.spec-item,
.service-item {
  border: 4rpx solid #e0e0e0;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.spec-item:last-child,
.service-item:last-child {
  margin-bottom: 0;
}

.spec-item.active,
.service-item.active {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.spec-item.out-of-stock {
  opacity: 0.5;
  background-color: #f5f5f5;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.spec-price .current {
  font-size: 36rpx;
  font-weight: 600;
  color: #ff4444;
  margin-right: 16rpx;
}

.spec-price .original {
  font-size: 28rpx;
  color: #666666;
  text-decoration: line-through;
}

.stock-label {
  font-size: 24rpx;
  color: #ff4444;
  margin-top: 8rpx;
}

.check-icon {
  color: #4CAF50;
  font-size: 36rpx;
  font-weight: 600;
}

.service-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.service-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
}

.service-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #4CAF50;
}

.service-desc {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.service-features {
  display: flex;
}

.feature-tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background-color: #f5f5f5;
  color: #666666;
  border-radius: 16rpx;
  margin-right: 16rpx;
}

.feature-tag:last-child {
  margin-right: 0;
}

.guide-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -16rpx 32rpx -16rpx;
}

.guide-item {
  text-align: center;
  width: calc(50% - 32rpx);
  margin: 0 16rpx 32rpx 16rpx;
}

.guide-label {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 8rpx;
}

.guide-value {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
}

.care-tips-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.care-tips-content {
  display: block;
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.detail-block {
  margin-bottom: 40rpx;
}

.detail-block:last-child {
  margin-bottom: 0;
}

.detail-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #666666;
  white-space: pre-wrap;
}

.recommended-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 200rpx;
}

.section-subtitle {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 32rpx;
}

.recommended-products {
  display: flex;
  flex-direction: column;
}

.recommended-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -16rpx;
}

.recommended-item {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.recommended-grid .recommended-item {
  flex-direction: column;
  padding: 0;
  background-color: transparent;
  width: calc(50% - 32rpx);
  margin: 0 16rpx 32rpx 16rpx;
}

.recommended-item:last-child {
  margin-bottom: 0;
}

.rec-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.recommended-grid .rec-image {
  width: 100%;
  aspect-ratio: 1;
  margin-right: 0;
  margin-bottom: 16rpx;
}

.rec-img {
  width: 100%;
  height: 100%;
}

.rec-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.rec-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8rpx;
}

.recommended-grid .rec-name {
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rec-reason {
  display: block;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 16rpx;
  line-height: 1.4;
  flex: 1;
}

.rec-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rec-price {
  font-size: 36rpx;
  font-weight: 600;
  color: #ff4444;
}

.recommended-grid .rec-price {
  font-size: 32rpx;
}

.btn-quick-add {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  border: none;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 36rpx;
  font-weight: 600;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 2rpx solid #e0e0e0;
  padding: 32rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.total-price {
  flex: 1;
  margin-right: 24rpx;
}

.price-label {
  display: block;
  font-size: 24rpx;
  color: #666666;
}

.price-value {
  display: block;
  font-size: 44rpx;
  font-weight: 600;
  color: #ff4444;
}

.btn-add-cart,
.btn-buy-now {
  padding: 24rpx 40rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  margin-left: 16rpx;
}

.btn-add-cart {
  background-color: #ff9800;
  color: white;
}

.btn-buy-now {
  background-color: #4CAF50;
  color: white;
}

.btn-add-cart:disabled,
.btn-buy-now:disabled {
  opacity: 0.5;
}
</style>
