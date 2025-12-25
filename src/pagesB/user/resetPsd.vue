<template>
	<view class="container">
		<view class="form-wrap">
			<u--form :model="passwordForm" :rules="rules" ref="formRef" label-width="140rpx">

				<u-form-item prop="oldPsd" label="旧密码" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="passwordForm.oldPsd" clearable border="none" inputAlign="right" password
								placeholder="请输入旧密码"></u--input>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>

				<u-form-item prop="newPsd" label="新密码" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="passwordForm.newPsd" clearable border="none" inputAlign="right" password
								placeholder="请输入新密码"></u--input>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>

				<u-form-item prop="confirmPsd" label="确认密码" borderBottom>
					<template #right>
						<view class="item-right">
							<u--input v-model="passwordForm.confirmPsd" clearable border="none" inputAlign="right" password
								placeholder="请确认新密码"></u--input>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>

				<view style="margin-top:20px;">
					<u-button type="primary" text="保 存" @click="submitHandler"></u-button>
				</view>

			</u--form>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onReady } from '@dcloudio/uni-app';

// TODO: 请根据你的实际项目结构导入修改密码的API
// 假设路径为 @/apis/modules/account
import { updateUserPwd } from '@/apis/modules/account';

// --- 响应式数据 ---
const formRef = ref(null);
const passwordForm = reactive({
	oldPsd: '',
	newPsd: '',
	confirmPsd: '',
});

// --- 校验规则 ---
const rules = {
	oldPsd: {
		type: 'string',
		required: true,
		message: '请输入旧密码',
		trigger: ['blur', 'change']
	},
	newPsd: {
		type: 'string',
		required: true,
		min: 6,
		max: 20,
		message: '长度在6-20个字符',
		trigger: ['blur', 'change']
	},
	confirmPsd: [
		{
			type: 'string',
			required: true,
			message: '确认密码不能为空',
			trigger: ['blur', 'change']
		},
		{
			// 自定义验证器
			validator: (rule, value, callback) => {
				// Vue3 中直接访问 reactive 对象
				return value === passwordForm.newPsd;
			},
			message: '两次输入的密码不一致',
			trigger: ['blur', 'change'] // 通常确认密码在输入时就需要实时反馈
		}
	]
};

// --- 生命周期 ---
onReady(() => {
	if (formRef.value) {
		formRef.value.setRules(rules);
	}
});

// --- 方法 ---
const submitHandler = () => {
	formRef.value.validate().then(() => {
		// 校验通过，调用 API
		// 注意：updateUserPwd 需要你从 api 文件引入
		updateUserPwd(passwordForm.oldPsd, passwordForm.newPsd).then(res => {
			if (res.code == 200) {
				uni.showToast({
					title: '保存成功',
					icon: 'success',
					success: () => {
						// 延迟返回，让用户看清提示
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				});
			} else {
				uni.$u.toast(res.msg || '修改失败');
			}
		}).catch(err => {
			uni.$u.toast(err.msg || '请求失败');
		});
	}).catch(errors => {
		// 校验失败
		console.log(errors);
	});
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
			/* 垂直居中 */
		}

		/* Vue 3 推荐使用 :deep() 替代 ::v-deep */
		:deep(.u-form-item__body) {
			height: 80rpx;
		}
	}
}
</style>