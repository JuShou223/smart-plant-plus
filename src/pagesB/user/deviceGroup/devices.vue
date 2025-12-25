<template>
	<page-meta>
		<navigation-bar title="选择设备" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="device-group-devices">
		<u-sticky>
			<view class="search-wrap">
				<div class="left-wrap">
					<u-search v-model="queryParams.deviceName" shape="square" @search="handleSearch"
						@custom="handleSearch" :inputStyle="{height: '64rpx'}"
						:actionStyle="{ backgroundColor: '#398ade', color: '#fff', padding: '0 12rpx', borderRadius: '6rpx', height: '64rpx', lineHeight: '64rpx'}"></u-search>
				</div>
				<div class="right-wrap">
					<u-button @click="handleDeviceSelected()" type="success" text="保存"
						customStyle="width:120rpx; height: 64rpx" size="small"></u-button>
				</div>
			</view>
		</u-sticky>

		<view class="group-wrap">
			<u--text lines="2" lineHeight="24" size="32rpx" text="选择设备" margin="0 20rpx 20rpx"></u--text>
			<u-checkbox-group v-model="checkBoxValue" placement="column" iconPlacement="right" :borderBottom="false">
				<div class="item-wrap" v-for="(item, index) in dataList" :key="index">
					<u-checkbox :customStyle="{ margin: '40rpx 20rpx 60rpx' }" :label="item.deviceName"
						:name="item.deviceId" labelSize="28rpx" @change="checkboxChange($event, item)" :disabled="item.disabled"></u-checkbox>
					<text class="des">
						{{item.serialNumber}}
					</text>
				</div>
			</u-checkbox-group>
		</view>
		<u-empty mode="list" :show="total == 0" marginTop="30"></u-empty>
		<u-loadmore :status="status" v-if="total > queryParams.pageSize" marginTop="10" />
	</view>
</template>

<script>
	import { getDeviceIds, updateDeviceGroups } from '@/apis/modules/group';
	import { listDeviceByGroup } from '@/apis/modules/device';

	export default {
		data () {
			return {
				status: 'nomore', // 加载更多
				dataList: [
				], // 列表数据
				checkBoxValue: [], // 复选框值
				checkBoxValueOld: [],
				total: 0, // 总条数
				groupId: 0, // 分组ID
				queryParams: {
					pageNum: 1,
					pageSize: 20,
					deviceName: null,
				}
			};
		},
		onLoad (option) {
			this.groupId = option.groupId;
			this.queryParams.userId = option.groupUserId;
			this.getDeviceIdsByGroupId();
		},
		methods: {
			// 复选框改变事件
			checkboxChange (value, item) {
				let index = this.checkBoxValueOld.indexOf(item.deviceId);
				if (index == -1 && value) {
					this.checkBoxValueOld.push(item.deviceId); // 不存在且选中
				} else if (index != -1 && !value) {
					this.checkBoxValueOld.splice(index, 1); // 存在且取消选中
				}
			},
			// 更新分组下的设备
			handleDeviceSelected () {
				// 分组设备更新参数
				let deviceGroup = {
					groupId: this.groupId,
					deviceIds: this.checkBoxValueOld
				};
				updateDeviceGroups(deviceGroup).then(response => {
					uni.showToast({ icon: 'success', title: '设备更新成功' });
					// 返回
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1000);
				});
			},
			// 获取分组下关联的设备ID数组
			getDeviceIdsByGroupId () {
				getDeviceIds(this.groupId).then(response => {
					this.checkBoxValue = response.data;
					this.checkBoxValueOld = response.data;
					this.getList();
				});
			},
			// 获取列表数据
			getList () {
				listDeviceByGroup(this.queryParams).then(response => {
					if (this.queryParams.pageNum == 1) {
						response.rows = response.rows.filter(item => item.deviceId !== 118);
						this.dataList = response.rows;
						console.log(this.dataList)
					} else {
						this.dataList = this.dataList.concat(response.rows);
					}
					this.total = response.total;
					uni.stopPullDownRefresh();
				});
			},
			// 搜索
			handleSearch (value) {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				this.getList();
			},
			// 下拉刷新
			onPullDownRefresh () {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				this.getDeviceIdsByGroupId(); // Http获取列表
			},
			// 上拉加载
			onReachBottom () {
				this.queryParams.pageNum = this.queryParams.pageNum + 1;
				if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
					this.status = 'nomore';
				} else {
					this.getList();
					this.status = 'loading';
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #eef3f7;
	}

	.device-group-devices {
		padding-bottom: 40rpx;

		.search-wrap {
			padding: 20rpx;
			background: #ffffff;
			display: flex;
			flex-direction: row;
			align-items: center;

			.left-wrap {
				flex: 1;
			}

			.right-wrap {
				margin-left: 20rpx;
			}
		}

		.group-wrap {
			padding: 10px;
			margin-top: 10px;

			.item-wrap {
				position: relative;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				background-color: #fff;

				.des {
					position: absolute;
					top: 78rpx;
					left: 20rpx;
					font-size: 24rpx;
					color: #868686;
				}
			}
		}
	}
</style>