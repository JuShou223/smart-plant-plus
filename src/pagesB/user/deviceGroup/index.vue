<template>
	<page-meta><navigation-bar title="设备分组" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="device-group-wrap">
		<view class="search-wrap">
			<div class="left-wrap">
				<u-search v-model="queryParams.groupName" shape="square" @search="handleSearch" @custom="handleSearch"
					:inputStyle="{height: '64rpx'}"
					:actionStyle="{ backgroundColor: '#398ade', color: '#fff', padding: '0 12rpx', borderRadius: '6rpx', height: '64rpx', lineHeight: '64rpx' }"></u-search>
			</div>
			<div class="right-wrap">
				<u-button @click="handleAddGrup()" type="success" text="新增" icon="plus"
					:customStyle="{ width:'120rpx', height: '64rpx' }" size="small"></u-button>
			</div>
		</view>

		<view class="card-wrap" v-for="(item, index) in dataList" :key="index">
			<u-row gutter="10" customStyle="margin:0;">
				<u-col :span="6"
					customStyle="background-color:#3fd1ad; padding:30rpx; border-top-left-radius:10rpx; border-bottom-left-radius:10rpx;">
					<u--text prefixIcon="grid" iconStyle="color:#fff; font-size:32rpx; margin-right:6rpx;" bold
						lines="1" :text="item.groupName" customStyle="color:#fff;"></u--text>
				</u-col>
				<u-col :span="6">
					<view style="display:flex;">
						<u-button type="success" @click="handleAddDevice(item)" size="small"
							customStyle="width:160rpx;">添加设备</u-button>
						<u-button type="primary" @click="handleEdit(item)" size="small"
							customStyle="width:12rpx;">详情</u-button>
					</view>
				</u-col>
			</u-row>
		</view>

		<u-empty mode="list" :show="total === 0" marginTop="30"></u-empty>
		<u-loadmore :status="status" v-if="total > queryParams.pageSize" marginTop="20" />
	</view>
</template>

<script>
	import { getGroupList } from '@/apis/modules/group';

	export default {
		data () {
			return {
				status: 'nomore', // 加载更多
				dataList: [], // 列表数据
				total: 0, // 总条数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					userId: 0,
					groupName: null,
				}
			};
		},
		onLoad () {
			this.queryParams.userId = this.profile.userId;
			this.getList();
		},
		onShow () {
			let operate = getApp().globalData.operate;
			if (operate && operate == 'operate') {
				this.getList();
				// 置空 operate
				getApp().globalData.operate = "";
			}

		},
		methods: {
			// 获取列表数据
			getList () {
				getGroupList(this.queryParams).then(response => {
					if (this.queryParams.pageNum == 1) {
						console.log(response.rows)
						// for(let i=0;i<response.rows.length;i++){
						// 	if()
							
						// }
						this.dataList = response.rows;
						console.log(1)
						console.log(this.dataList)
					} else {
						this.dataList = this.dataList.concat(response.rows);
						console.log(2)
					}
					this.total = response.total;
					uni.stopPullDownRefresh();
				});
			},
			// 搜索
			handleSearch (value) {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				this.getList(true);
			},
			// 新增
			handleAddGrup () {
				uni.navigateTo({
					url: '/pagesB/user/deviceGroup/detail'
				});
			},
			// 编辑
			handleEdit (item) {
				uni.navigateTo({
					url: '/pagesB/user/deviceGroup/detail?groupId=' + item.groupId
				});
			},
			// 选择分组设备
			handleAddDevice (item) {
				uni.navigateTo({
					url: '/pagesB/user/deviceGroup/devices?groupId=' + item.groupId + '&groupUserId=' +
						item.userId
				});
			},
			// 下拉刷新
			onPullDownRefresh () {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				this.getList(); // Http获取列表
			},
			// 上拉加载
			onReachBottom () {
				this.status = 'loading';
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

	.device-group-wrap {
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

		.card-wrap {
			box-shadow: 0 2rpx 0 0 rgba(0, 0, 0, 0.1);
			border-radius: 10rpx;
			margin: 20rpx;
			background-color: #ffffff;
		}
	}
</style>