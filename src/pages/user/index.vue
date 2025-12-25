<template>
	<view class="min-h-screen bg-slate-50 animate-fade-in relative z-50">

		<view class="bg-emerald-600 h-64 relative overflow-hidden rounded-b-[2.5rem] shadow-lg shadow-emerald-200">
			<view
				class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none">
			</view>
			<view
				class="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/30 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none">
			</view>

			<view class="px-6 py-4 flex justify-between items-center relative z-10 text-white"
				:style="{ paddingTop: safeAreaTop + 'px' }">
				<!-- <button
          class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-md m-0 leading-none border-none">
          <text class="leading-none iconfont icon-lucide-chevron-left text-2xl text-white"></text>
        </button> -->
				<text class="font-bold text-lg">个人中心</text>
				<!-- <button class="p-2 hover:bg-white/20 rounded-full transition-colors m-0 leading-none bg-transparent">
          <text class="leading-none iconfont icon-lucide-settings text-2xl text-white"></text>
        </button> -->
			</view>

			<view class="px-6 pt-2 flex items-center gap-4 relative z-10">
				<view
					class="flex items-center justify-center w-20 h-20 rounded-full border-4 border-solid border-white/30 shadow-xl overflow-hidden bg-white shrink-0"
					@click="handleToAvatar">
					<!-- <text class="leading-none iconfont icon-lucide-sprout text-2xl text-emerald-600 leading-none"></text> -->
					<image
						:src="avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'"
						mode="aspectFill" class="w-full h-full" />
				</view>
				<view class="text-white">
					<text class="block text-2xl font-bold">{{ profile.nickName || 'Alex Gardener' }}</text>
					<view class="flex items-center gap-2 mt-1">
						<text
							class="bg-emerald-700/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold border border-solid border-emerald-400/30"
							@click="handleVipUpgrade">
							{{ isVipModel ? 'VIP会员' : 'LV.5 资深园丁' }}
						</text>
						<text class="text-xs text-emerald-100 opacity-80">ID: {{ profile.userId || '884920' }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="px-6 -mt-12 relative z-20 pb-4 space-y-6">

			<view class="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 flex justify-between items-center">
				<view class="text-center flex-1 border-r border-slate-100">
					<text class="block text-2xl font-bold text-slate-800">342</text>
					<text class="block text-xs text-slate-400 mt-1">种植天数</text>
				</view>
				<view class="text-center flex-1 border-r border-slate-100">
					<text class="block text-2xl font-bold text-slate-800">12</text>
					<text class="block text-xs text-slate-400 mt-1">我的植物</text>
				</view>
				<view class="text-center flex-1">
					<text class="block text-2xl font-bold text-slate-800">5</text>
					<text class="block text-xs text-slate-400 mt-1">诊断记录</text>
				</view>
			</view>

			<view class="bg-white rounded-2xl p-5 shadow-sm border border-solid border-slate-100">
				<view class="flex justify-between items-center mb-4">
					<text class="font-bold text-slate-800 text-sm">我的订单</text>
					<view class="text-xs text-slate-400 flex items-center hover:text-emerald-600">
						<text>全部订单</text>
						<text class="leading-none iconfont icon-lucide-chevron-right text-xs ml-0.5"></text>
					</view>
				</view>
				<view class="flex justify-between px-2">
					<view v-for="(item, idx) in orderItems" :key="idx" class="flex flex-col items-center gap-2 group">
						<view
							class="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors relative">
							<text class="leading-none iconfont text-xl" :class="item.iconClass"></text>
							<view v-if="idx === 1"
								class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
								1
							</view>
						</view>
						<text class="text-xs text-slate-600">{{ item.label }}</text>
					</view>
				</view>
			</view>

			<view class="bg-white rounded-2xl shadow-sm border border-solid border-slate-100 overflow-hidden">
				<view @click="gotoAccount"
					class="box-border w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-solid border-slate-50 cursor-pointer">
					<view class="flex items-center gap-3">
						<view class="p-2 bg-blue-50 text-blue-600 rounded-lg">
							<text class="leading-none iconfont icon-lucide-user text-xl"></text>
						</view>
						<text class="text-sm font-bold text-slate-700">账号信息</text>
					</view>
					<text class="leading-none iconfont icon-lucide-chevron-right text-base text-slate-400"></text>
				</view>

				<view @click="gotoAddressList"
					class="box-border w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-solid border-slate-50 cursor-pointer">
					<view class="flex items-center gap-3">
						<view class="p-2 bg-blue-50 text-blue-600 rounded-lg">
							<text class="leading-none iconfont icon-lucide-map-pin text-xl"></text>
						</view>
						<text class="text-sm font-bold text-slate-700">地址管理</text>
					</view>
					<text class="leading-none iconfont icon-lucide-chevron-right text-base text-slate-400"></text>
				</view>

				<!-- <view @click="onNavigate('DIAGNOSIS_HISTORY')"
          class="box-border w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-solid border-slate-50 cursor-pointer">
          <view class="flex items-center gap-3">
            <view class="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <text class="leading-none iconfont icon-lucide-clipboard-list text-xl"></text>
            </view>
            <text class="text-sm font-bold text-slate-700">植物诊断档案</text>
          </view>
          <text class="leading-none iconfont icon-lucide-chevron-right text-base text-slate-400"></text>
        </view> -->

				<view @click="gotoResetPsd"
					class="box-border w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-solid border-slate-50 cursor-pointer">
					<view class="flex items-center gap-3">
						<view class="p-2 bg-purple-50 text-purple-600 rounded-lg">
							<text class="leading-none iconfont icon-lucide-lock text-xl"></text>
						</view>
						<text class="text-sm font-bold text-slate-700">修改密码</text>
					</view>
					<text class="leading-none iconfont icon-lucide-chevron-right text-base text-slate-400"></text>
				</view>

				<!-- <view @click="handleBindWeChart"
          class="box-border w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-solid border-slate-50 cursor-pointer">
          <view class="flex items-center gap-3">
            <view class="p-2 bg-green-50 text-green-600 rounded-lg">
              <text class="leading-none iconfont icon-lucide-link text-xl"></text>
            </view>
            <text class="text-sm font-bold text-slate-700">{{ wxStatus ? '解绑微信' : '绑定微信' }}</text>
          </view>
          <text class="leading-none iconfont icon-lucide-chevron-right text-base text-slate-400"></text>
        </view> -->

				<!-- <view
          class="box-border w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
          <view class="flex items-center gap-3">
            <view class="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <text class="leading-none iconfont icon-lucide-help-circle text-xl"></text>
            </view>
            <text class="text-sm font-bold text-slate-700">帮助与反馈</text>
          </view>
          <text class="leading-none iconfont icon-lucide-chevron-right text-base text-slate-400"></text>
        </view> -->

			</view>

			<button @click="handleExit"
				class="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 transition-colors m-0 border-none">
				<text class="leading-none iconfont icon-lucide-log-out text-xl"></text>
				<text>退出登录</text>
			</button>

			<button @click="handleUnsubscribe"
				class="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 transition-colors m-0 border-none mt-2">
				<text class="leading-none iconfont icon-lucide-trash-2 text-xl"></text>
				<text>注销账户</text>
			</button>

			<text class="block text-center text-[10px] text-slate-300 pt-4 pb-4">
				猴卫士智能养植 v1.0.0 • Build 20251231
			</text>
		</view>

		<view v-if="modal.show" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
			<view class="bg-white p-6 rounded-lg w-80">
				<text class="block text-lg font-bold mb-4">提示</text>
				<text class="block mb-6">{{ modal.content }}</text>
				<view class="flex justify-end gap-4">
					<button @click="cancel" class="px-4 py-2 bg-slate-200 rounded">取消</button>
					<button v-if="modal.showConfirmButton" @click="confirm"
						class="px-4 py-2 bg-emerald-600 text-white rounded">确定</button>
				</view>
			</view>
		</view>

		<view v-if="show" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
			<view class="bg-white p-6 rounded-lg w-80">
				<text class="block text-lg font-bold mb-4">退出确认</text>
				<text class="block mb-6">确定要退出登录吗？</text>
				<view class="flex justify-end gap-4">
					<button @click="cancelExit" class="px-4 py-2 bg-slate-200 rounded">取消</button>
					<button @click="confirmExit" class="px-4 py-2 bg-emerald-600 text-white rounded">确定</button>
				</view>
			</view>
		</view>

		<view v-if="isUnsubscribe" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
			<view class="bg-white p-6 rounded-lg w-80">
				<text class="block text-lg font-bold mb-4">注销确认</text>
				<text class="block mb-6 text-red-500">注销后账号无法找回，确定要注销吗？</text>
				<view class="flex justify-end gap-4">
					<button @click="isUnsubscribe = false" class="px-4 py-2 bg-slate-200 rounded">取消</button>
					<button @click="confirmUnsubscribe" class="px-4 py-2 bg-red-600 text-white rounded">确定</button>
				</view>
			</view>
		</view>

		<vip-model v-if="isVipModel" @close="isVipModel = false"></vip-model>

	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import projectConfig from '@/env.config.js';
import vipModel from '@/components/model/vip-model.vue';
import { logout, secureBind, wechatBind, getProfile as getProfileApi } from '@/apis/modules/common';
import { deviceRelateUser } from '@/apis/modules/device';

const emit = defineEmits(['back', 'logout', 'navigate']);
const userStore = useUserStore();

// Safe Area
const safeAreaTop = ref(44);
onMounted(() => {
	try {
		const res = uni.getSystemInfoSync();
		if (res.safeAreaInsets && res.safeAreaInsets.top) {
			safeAreaTop.value = res.safeAreaInsets.top;
		}
	} catch (e) {
		console.error(e);
	}

	// Fetch profile on mount
	getProfile();
});

// Data
const orderItems = [
	{ label: '待付款', iconClass: 'icon-lucide-credit-card' },
	{ label: '待发货', iconClass: 'icon-lucide-package' },
	{ label: '待收货', iconClass: 'icon-lucide-truck' },
	{ label: '待评价', iconClass: 'icon-lucide-message-circle' },
];

// Reactive State
const avatarUrl = ref('');
const modal = ref({
	show: false,
	showConfirmButton: false,
	content: ''
});
const wxStatus = ref(false);
const scanJson = ref({});
const show = ref(false);
const isTopShow = ref(false);
const isUnsubscribe = ref(false);
const isBindWeChart = ref(false);
const isVipModel = ref(false);
const profile = ref({});

// Methods

// 获取用户信息
const getProfile = () => {
	getProfileApi().then(res => {
		userStore.setProfile(res.data);
		profile.value = res.data;
		avatarUrl.value = profile.value.avatar && projectConfig.baseUrl + profile.value.avatar;
		wxStatus.value = res.wxBind;
	}).catch(err => {
		uni.showToast({ title: err.msg || '获取用户信息失败', icon: 'none' });
	});
};

const handleExit = () => {
	show.value = true;
};

const cancelExit = () => {
	show.value = false;
};

const clearToken = () => {
	uni.setStorageSync('token', '');
};

const confirmExit = () => {
	logout().then(() => {
		clearToken();
		uni.reLaunch({
			url: '/pages/login/index'
		});
	});
};

const handleAppSecureBind = () => {
	uni.navigateTo({
		url: '/pagesB/user/secureBind'
	});
};

const gotoAddressList = () => {
	uni.navigateTo({ url: '/pages-plants/plants/addressList/addressList' });
}

const gotoAccount = () => {
	uni.navigateTo({ url: '/pagesB/user/account' });
};

const gotoAddDevice = () => {
	isTopShow.value = false;
	uni.navigateTo({
		url: '/pagesA/list/home/deviceAdd'
	});
};

const gotoRelateDevice = () => {
	isTopShow.value = false;
	uni.navigateTo({
		url: '/pagesA/list/home/deviceRelate'
	});
};

const gotoEmulator = () => {
	uni.navigateTo({
		url: '/pagesB/list/user/message'
	});
};

const gotoGroup = () => {
	uni.navigateTo({
		url: '/pagesB/user/deviceGroup/index'
	});
};

const openTop = () => {
	isTopShow.value = true;
};

const closeTop = () => {
	isTopShow.value = false;
};

const cancel = () => {
	modal.value = {
		show: false,
		showConfirmButton: false,
		content: ''
	};
};

const confirm = () => {
	cancel();
	let form = {
		deviceNumberAndProductIds: [{
			deviceNumber: scanJson.value.deviceNumber,
			productId: scanJson.value.productId
		}],
		userId: profile.value.userId
	};
	deviceRelateUser(form).then(res => {
		if (res.code == 200) {
			uni.showToast({
				icon: 'success',
				title: '保存成功'
			});
			isTopShow.value = false;
		} else {
			modal.value = {
				show: true,
				showConfirmButton: false,
				content: '发生错误：' + res.msg
			};
		}
	});
};

const openScan = () => {
	// #ifndef MP-WEIXIN || APP-PLUS
	uni.showToast({
		icon: 'none',
		title: '扫码只支持App和小程序'
	});
	// #endif
	// #ifdef MP-WEIXIN || APP-PLUS
	uni.scanCode({
		success: res => {
			console.log('条码类型：' + res.scanType);
			console.log('条码内容：' + res.result);
			let resultStr = res.result;
			if (resultStr.substr(0, 1) != '{') {
				resultStr = resultStr.substring(1);
			}
			try {
				scanJson.value = JSON.parse(resultStr);
				if (scanJson.value.type == 1) {
					modal.value = {
						show: true,
						showConfirmButton: true,
						content: '【设备编号:' + scanJson.value.deviceNumber + ', 产品名称:' + scanJson.value.productName + '】确定添加吗？'
					};
					return;
				}
				uni.showToast({
					icon: 'none',
					title: '解析二维码后，找不到对应处理类型'
				});
			} catch (error) {
				uni.showToast({
					icon: 'none',
					title: '解析二维码错误，格式不正确'
				});
			}
		}
	});
	// #endif
};

const handleUnsubscribe = () => {
	isUnsubscribe.value = true;
};

const gotoResetPsd = () => {
	uni.navigateTo({ url: '/pagesB/user/resetPsd' });
};

const confirmUnsubscribe = () => {
	logout().then(() => {
		clearToken();
		uni.reLaunch({
			url: '/pages/login/index'
		});
	});
};

const handleToAvatar = () => {
	const source = {
		album: '从手机相册选择',
		camera: '拍照',
	};

	const success = (res) => {
		const tempFilePaths = res.tempFilePaths;
		const image = tempFilePaths ? tempFilePaths[0] : res.tempFiles[0].path;
		uni.navigateTo({
			url: `/pagesB/user/avatar?url=${image}`
		});
	};

	const _uploadImage = (type) => {
		const sizeType = ['original', 'compressed'];
		uni.chooseImage({
			count: 1,
			sizeType,
			sourceType: [type],
			success
		});
	}

	const list = Object.entries(source);
	// #ifdef H5
	_uploadImage(list[0][0]);
	return;
	// #endif

	uni.showActionSheet({
		itemList: list.map(v => v[1]),
		success: ({ tapIndex: i }) => {
			// Note: Permissions handling for APP-PLUS might need specific plugin or API
			// dispatching to store is one way if you have that setup
			_uploadImage(list[i][0]);
		}
	});
};

const handleVipUpgrade = () => {
	isVipModel.value = true;
};

const handleUnbindWeChart = () => {
	uni.navigateTo({
		url: '/pagesB/user/secureBind'
	});
};

const handleBindWeChart = () => {
	if (wxStatus.value) {
		handleUnbindWeChart();
	} else {
		isBindWeChart.value = true;
		confirmBindWeChart();
	}
};

const confirmBindWeChart = () => {
	isBindWeChart.value = false;
	uni.login({
		provider: 'weixin',
		success: function (res) {
			if (res) {
				console.log('用户授权成功');
				let params = {};
				// #ifdef APP-PLUS
				params = {
					sourceClient: 'wechat_open_mobile',
					openId: res.authResult.openid,
					unionId: res.authResult.unionid,
				}
				// #endif
				// #ifdef MP-WEIXIN
				params = {
					code: res.code,
					sourceClient: 'wechat_open_mini_program',
				}
				// #endif
				wechatBind(params).then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: 'none',
							title: '绑定成功！',
						});
						getProfile();
					} else {
						uni.showToast({ title: res.msg, icon: 'none' });
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}
	})
};

const onBack = () => emit('back');
const onLogout = handleExit;
const onNavigate = (view) => emit('navigate', view);

</script>

<style scoped>
/* leading-none iconfont Helper */
.leading-none iconfont {
	display: inline-block;
	line-height: 1;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fadeInUp 0.3s ease-out;
}
</style>