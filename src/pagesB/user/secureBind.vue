<template>
	<page-meta>
		<navigation-bar title="解除微信绑定" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="secure-bind-wrap">
		<view class="main-wrap">
			<u--form :model="form" :rules="rules" ref="form" labelWidth="31">
				<u-form-item prop="password" borderBottom>
					<u--input v-model="form.password" type="password" clearable border="none" placeholder="请输入密码"
						prefixIcon="lock-fill" prefixIconStyle="font-size: 44rpx; color: #2ecc71; margin-right: 10rpx"
						:clearable="true"></u--input>
				</u-form-item>
			</u--form>
			<view style="margin-top: 40rpx;">
				<u-button type="primary" text="解 除" @click="handleSecureUnbundle()"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
import { secureBind } from '@/apis/modules/common.js'
export default {
	data() {
		return {
			form: {
				verifyType: 1,
				password: '',
			},
			rules: {
				password: {
					type: 'string',
					required: true,
					min: 5,
					max: 20,
					message: '请输入密码',
					trigger: ['blur', 'change']
				},
			}
		};
	},
	methods: {
		handleSecureUnbundle() {
			this.$refs.form.validate().then(res => {
				secureBind(this.form).then(response => {
					if (response.code == 200) {
						uni.switchTab({
							url: '/pages/tabBar/user/index'
						});
					} else {
						uni.$u.toast(response.msg);
					}
				}).catch(err => {
					console.log(err);
				});
			})
		},
	}
};
</script>

<style lang="scss">
.secure-bind-wrap {
	.main-wrap {
		padding: 40rpx;
		background: #ffffff;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
}
</style>