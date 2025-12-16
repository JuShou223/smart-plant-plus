<template>
  <view class="address-page page-wrapper">
    <!-- <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
    </view> -->

    <view class="page-content">
      <view class="form-section">
        <view class="form-group">
          <text class="form-label">收货人</text>
          <u-input v-model="form.receiver_name" type="text" class="form-input" placeholder="请输入收货人姓名" />
        </view>

        <view class="form-group">
          <text class="form-label">联系电话</text>
          <u-input v-model="form.phone" type="number" class="form-input" placeholder="请输入手机号码" />
        </view>

        <view class="form-group">
          <text class="form-label">所在地区</text>
          <view class="region-selector" @click="showRegionPicker = true">
            <text v-if="form.province" class="region-text">
              {{ form.province }} {{ form.city }} {{ form.district }}
            </text>
            <text v-else class="region-placeholder">请选择省市区</text>
            <text class="arrow-icon">›</text>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">详细地址</text>
          <textarea v-model="form.detailed_address" class="form-textarea" placeholder="街道、楼牌号等详细信息"
            maxlength="100"></textarea>
        </view>

        <view class="form-group">
          <label class="form-checkbox">
            <checkbox :checked="form.is_default" @change="onDefaultChange" />
            <text class="checkbox-text">设为默认地址</text>
          </label>
        </view>
      </view>

      <view class="button-section">
        <button v-if="isEdit" class="btn btn-danger" @click="deleteAddress">删除地址</button>
        <button class="btn btn-primary" @click="saveAddress">保存</button>
      </view>
    </view>

    <view v-if="showRegionPicker" class="modal-overlay" @click="showRegionPicker = false">
      <view class="modal-content region-picker" @click.stop>
        <view class="picker-header">
          <button @click="showRegionPicker = false" class="picker-btn">取消</button>
          <text class="picker-title">选择地区</text>
          <button @click="confirmRegion" class="picker-btn confirm">确定</button>
        </view>
        <view class="picker-tabs">
          <view class="picker-tab" :class="{ active: regionStep === 0 }" @click="regionStep = 0">
            <text>{{ tempRegion.province || '省份' }}</text>
          </view>
          <view v-if="tempRegion.province" class="picker-tab" :class="{ active: regionStep === 1 }"
            @click="regionStep = 1">
            <text>{{ tempRegion.city || '城市' }}</text>
          </view>
          <view v-if="tempRegion.city" class="picker-tab" :class="{ active: regionStep === 2 }" @click="regionStep = 2">
            <text>{{ tempRegion.district || '区县' }}</text>
          </view>
        </view>
        <scroll-view class="picker-content" scroll-y="true">
          <view v-for="item in currentRegionList" :key="item" class="picker-item" @click="selectRegion(item)">
            <text>{{ item }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
// import { ordersService } from '@/services/orders';
import { getAddresses } from '@/apis/modules/shop';

export default {
  name: 'AddressManage',
  data() {
    return {
      isEdit: false,
      addressId: null,
      form: {
        receiver_name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detailed_address: '',
        is_default: false
      },
      showRegionPicker: false,
      regionStep: 0,
      tempRegion: {
        province: '',
        city: '',
        district: ''
      },
      regions: {
        provinces: ['北京市', '上海市', '广东省', '江苏省', '浙江省', '四川省', '湖北省', '湖南省', '河南省', '山东省'],
        cities: {
          '北京市': ['北京市'],
          '上海市': ['上海市'],
          '广东省': ['广州市', '深圳市', '东莞市', '佛山市', '珠海市', '中山市'],
          '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
          '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市'],
          '四川省': ['成都市', '绵阳市', '德阳市', '南充市', '宜宾市'],
          '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市'],
          '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市'],
          '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市'],
          '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市']
        },
        districts: {
          '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区'],
          '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区'],
          '广州市': ['天河区', '越秀区', '海珠区', '荔湾区', '白云区', '黄埔区'],
          '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区'],
          '成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区'],
          '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区'],
          '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区'],
          '武汉市': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区']
        }
      }
    };
  },
  computed: {
    currentRegionList() {
      if (this.regionStep === 0) {
        return this.regions.provinces;
      } else if (this.regionStep === 1) {
        return this.regions.cities[this.tempRegion.province] || [];
      } else {
        return this.regions.districts[this.tempRegion.city] || ['其他区'];
      }
    }
  },
  async onLoad(options) {
    if (options.id) {
      this.isEdit = true;
      this.addressId = options.id;
      await this.loadAddress();
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    onDefaultChange(e) {
      this.form.is_default = e.detail.value;
    },
    async loadAddress() {
      try {
        const addressesData = await getAddresses();
        if (addressesData.code === 200) {
          const addresses = addressesData.data;
          const address = addresses.find(a => a.id === this.addressId);
          if (address) {
            this.form = { ...address };
            this.tempRegion = {
              province: address.province,
              city: address.city,
              district: address.district
            };
          }
        }
      } catch (error) {
        console.error('加载地址失败:', error);
        uni.showToast({
          title: '加载地址失败',
          icon: 'none'
        });
      }
    },
    selectRegion(item) {
      if (this.regionStep === 0) {
        this.tempRegion.province = item;
        this.tempRegion.city = '';
        this.tempRegion.district = '';
        this.regionStep = 1;
      } else if (this.regionStep === 1) {
        this.tempRegion.city = item;
        this.tempRegion.district = '';
        this.regionStep = 2;
      } else {
        this.tempRegion.district = item;
        this.confirmRegion();
      }
    },
    confirmRegion() {
      if (this.tempRegion.province && this.tempRegion.city && this.tempRegion.district) {
        this.form.province = this.tempRegion.province;
        this.form.city = this.tempRegion.city;
        this.form.district = this.tempRegion.district;
        this.showRegionPicker = false;
      } else {
        uni.showToast({
          title: '请选择完整的省市区',
          icon: 'none'
        });
      }
    },
    async saveAddress() {
      if (!this.form.receiver_name) {
        uni.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        });
        return;
      }
      if (!this.form.phone) {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none'
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        });
        return;
      }
      if (!this.form.province || !this.form.city || !this.form.district) {
        uni.showToast({
          title: '请选择所在地区',
          icon: 'none'
        });
        return;
      }
      if (!this.form.detailed_address) {
        uni.showToast({
          title: '请输入详细地址',
          icon: 'none'
        });
        return;
      }

      try {
        if (this.isEdit) {
          await ordersService.updateAddress(this.addressId, this.form);
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
        } else {
          await ordersService.addAddress(this.form);
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          });
        }
        setTimeout(() => {
          this.goBack();
        }, 1500);
      } catch (error) {
        console.error('保存失败:', error);
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    },
    async deleteAddress() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个地址吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await ordersService.deleteAddress(this.addressId);
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              setTimeout(() => {
                this.goBack();
              }, 1500);
            } catch (error) {
              console.error('删除失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: 'none'
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.address-page {
  background-color: #f5f5f5;
  min-height: 100vh;
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

.form-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16rpx;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 30rpx;
  color: #333333;
  box-sizing: border-box;
}

.form-textarea {
  height: 160rpx;
}

.region-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
}

.region-text {
  font-size: 30rpx;
  color: #333333;
}

.region-placeholder {
  font-size: 30rpx;
  color: #999999;
}

.arrow-icon {
  color: #999999;
  font-size: 36rpx;
  font-weight: 600;
}

.form-checkbox {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333333;
}

.checkbox-text {
  margin-left: 16rpx;
}

.button-section {
  padding: 32rpx;
  display: flex;
}

.button-section .btn {
  flex: 1;
  padding: 32rpx;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
  margin-right: 24rpx;
}

.button-section .btn:last-child {
  margin-right: 0;
}

.btn-danger {
  background-color: #ff4444;
  color: white;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.region-picker {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 2rpx solid #e0e0e0;
}

.picker-btn {
  background: none;
  border: none;
  color: #666666;
  font-size: 30rpx;
}

.picker-btn.confirm {
  color: #4CAF50;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.picker-tabs {
  display: flex;
  border-bottom: 2rpx solid #e0e0e0;
  background-color: #f5f5f5;
}

.picker-tab {
  flex: 1;
  padding: 24rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  position: relative;
}

.picker-tab.active {
  color: #4CAF50;
  font-weight: 500;
}

.picker-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  right: 25%;
  height: 4rpx;
  background-color: #4CAF50;
}

.picker-content {
  flex: 1;
  height: 600rpx;
}

.picker-item {
  padding: 32rpx;
  border-bottom: 2rpx solid #e0e0e0;
  font-size: 30rpx;
  color: #333333;
}
</style>