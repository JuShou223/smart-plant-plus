<template>
	<view class="container">
		<view class="form-wrap">
			<u--form :model="accountForm" :rules="rules" ref="formRef" label-width="140rpx">

				<u-form-item prop="avatarUrl" label="用户头像" borderBottom @click="handleToAvatar">
					<template #right>
						<view class="item-right">
							<image :src="displayAvatar" style="width: 80rpx; border-radius: 10rpx;" mode="widthFix">
							</image>
							<!-- <u-icon name="arrow-right"></u-icon> -->
						</view>
					</template>
				</u-form-item>

				<u-form-item prop="nickName" label="用户昵称" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="accountForm.nickName" clearable border="none" inputAlign="right"
								placeholder="请输入用户昵称"></u--input>
							<!-- <u-icon name="arrow-right"></u-icon> -->
						</view>
					</template>
				</u-form-item>

				<u-form-item prop="email" label="电子邮箱" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="accountForm.email" clearable border="none" inputAlign="right"
								placeholder="请输入电子邮箱"></u--input>
							<!-- <u-icon name="arrow-right"></u-icon> -->
						</view>
					</template>
				</u-form-item>

				<u-form-item prop="phonenumber" label="电话号码" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="accountForm.phonenumber" clearable border="none" inputAlign="right"
								placeholder="请输入电话号码"></u--input>
							<!-- <u-icon name="arrow-right"></u-icon> -->
						</view>
					</template>
				</u-form-item>

				<u-form-item label="创建时间" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="accountForm.createTime" border="none" inputAlign="right" placeholder="请输入创建时间"
								readonly></u--input>
						</view>
					</template>
				</u-form-item>

				<u-form-item label="登录ip" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="accountForm.loginIp" border="none" inputAlign="right" placeholder="请输入登录ip"
								readonly></u--input>
						</view>
					</template>
				</u-form-item>

				<view style="margin-top:20px;">
					<u-button type="primary" text="保 存" @click="updateProfileHandler"></u-button>
				</view>
			</u--form>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onReady, onShow } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
// 1. 引入 Store
import { useUserStore } from '@/stores/user.js';
// 2. 引入项目配置和API (根据你实际目录调整)
import projectConfig from '@/env.config.js';
// 假设这是你的 API 导出位置，如果还在 main.js 挂载，建议抽取出来
import { getProfile } from '@/apis/modules/common';
import { updateProfile } from '@/apis/modules/account';

// --- Store 初始化 ---
const userStore = useUserStore();
// 解构 store 数据，保持响应式
const { profile } = storeToRefs(userStore);

// --- 响应式数据 ---
const formRef = ref(null);
const accountForm = reactive({
	nickName: '',
	email: '',
	phonenumber: '',
	createTime: '',
	loginIp: '',
	avatar: '' // 用于保存相对路径
});

// 计算属性：处理头像显示逻辑
const displayAvatar = computed(() => {
	// 1. 如果 store 里有 avatar，拼接 baseUrl
	if (profile.value && profile.value.avatar) {
		return projectConfig.baseUrl + profile.value.avatar;
	}
	// 2. 默认图
	return '/static/avatar.png';
});

// --- 表单验证规则 ---
const rules = {
	nickName: {
		type: 'string',
		required: true,
		message: '请输入用户昵称',
		trigger: ['blur', 'change']
	},
	phonenumber: [
		{
			required: true,
			message: '请输入手机号码',
			trigger: ['blur', 'change']
		},
		{
			validator: (rule, value, callback) => {
				return uni.$u.test.mobile(value);
			},
			message: '手机号码格式不正确',
			trigger: ['change', 'blur']
		}
	],
	email: [
		{
			required: true,
			message: '请输入邮箱',
			trigger: ['blur', 'change']
		},
		{
			validator: (rule, value, callback) => {
				return uni.$u.test.email(value);
			},
			message: '邮箱号码格式不正确',
			trigger: ['change', 'blur']
		}
	]
};

// --- 生命周期 ---
onReady(() => {
	if (formRef.value) {
		formRef.value.setRules(rules);
	}
});

onShow(() => {
	fetchData();
});

// --- 方法 ---

// 获取最新用户信息
const fetchData = () => {
	getProfile().then(res => {
		const data = res.data;

		// 1. 更新 Pinia Store (这会触发 $subscribe 保存到本地 lifeData)
		userStore.profile = data;
		// 或者使用 userStore.setProfile(data);

		// 2. 回填表单
		// 使用 Object.assign 避免丢失 reactive 引用
		Object.assign(accountForm, {
			nickName: data.nickName,
			email: data.email,
			phonenumber: data.phonenumber,
			createTime: data.createTime,
			loginIp: data.loginIp,
			avatar: data.avatar
		});

	}).catch(err => {
		uni.$u.toast(err.msg || '获取用户信息失败');
	});
};

// 提交修改
const updateProfileHandler = () => {
	formRef.value.validate().then(() => {
		// 合并 store 中的旧数据和表单新数据
		const params = { ...profile.value, ...accountForm };

		updateProfile(params).then(res => {
			if (res.code == 200) {

				// --- 核心点：更新 Store ---
				// 这里修改后，你的 user.js 里的 setupUserStorePersistence 会自动捕获并保存
				userStore.profile = params;

				uni.showToast({
					title: '保存成功',
					icon: 'success',
					success: () => {
						uni.navigateBack();
					}
				});
			}
		}).catch(err => {
			uni.$u.toast(err.msg || '保存失败');
		});
	}).catch(errors => {
		// 验证失败
	});
};

// 头像选择与上传
const handleToAvatar = () => {
	const source = {
		album: '从手机相册选择',
		camera: '拍照',
	};

	const _uploadImage = (type) => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: [type],
			success: (res) => {
				const tempFilePaths = res.tempFilePaths;
				const image = tempFilePaths ? tempFilePaths[0] : res.tempFiles[0].path;

				// 跳转到头像裁剪/上传页 (假设路径如下)
				uni.navigateTo({
					url: `/pagesB/user/avatar?url=${image}`
				});
			}
		});
	};

	const list = Object.entries(source);

	// #ifdef H5
	_uploadImage(list[0][0]);
	// #endif
	// #ifndef H5
	uni.showActionSheet({
		itemList: list.map(v => v[1]),
		success: ({ tapIndex: i }) => {
			// #ifdef APP-PLUS
			// 这里的权限判断建议使用 uni.authorize 或原生 api
			// 简单起见，这里直接调用选择图片
			// #endif
			_uploadImage(list[i][0]);
		}
	});
	// #endif
};
</script>

<style lang="scss" scoped>
.container {
	padding: 20px;
	box-sizing: border-box;
	background: #ffffff;

	.form-wrap {
		.item-right {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		/* Vue 3 深度选择器写法 */
		:deep(.u-form-item__body) {
			height: 80rpx;
		}
	}
}
</style>