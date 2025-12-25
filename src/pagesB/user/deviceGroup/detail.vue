<template>
	<page-meta>
		<navigation-bar :title="title" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="device-group-add-wrap">
		<view class="main-wrap">
			<u--form :model="form" :rules="rules" ref="form" labelWidth="60" labelAlign="center">
				<u-form-item label="名称" prop="groupName" borderBottom>
					<u--input v-model="form.groupName" border="none" placeholder="请输入分组名称" :clearable="true"></u--input>
				</u-form-item>
				<u-form-item label="排序" prop="groupOrder" borderBottom>
					<u--input v-model="form.groupOrder" type="number" border="none" placeholder="请输入分组排序"
						:clearable="true"></u--input>
				</u-form-item>
				<u-form-item label="备注" prop="remark" borderBottom>
					<u--input v-model="form.remark" border="none" placeholder="请输入内容" :clearable="true"></u--input>
				</u-form-item>
			</u--form>
			<view style="margin-top:40rpx; display:flex;">
				<u-button type="error" v-if="isUpdate" @tap="handleDelete()" customStyle="margin:10px;">删除</u-button>
				<u-button type="primary" @tap="handleSubmitForm" customStyle="margin:10px;">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { getGroup, delGroup, updateGroup, addGroup } from '@/apis/modules/group';

	export default {
		data () {
			return {
				title: '添加分组',
				isUpdate: false,
				// 表单参数
				form: {
					groupName: null,
					groupOrder: 0,
					remark: null
				},
				// 表单校验
				rules: {
					'groupName': {
						type: 'string',
						required: true,
						message: '分组名称不能为空',
						trigger: ['blur', 'change']
					},
					'groupOrder': {
						type: 'number',
						required: true,
						message: '序号不能为空',
						trigger: ['blur', 'change']
					},
				}
			};
		},
		onLoad (option) {
			if (option.groupId) {
				this.form.groupId = option.groupId;
				this.getInfo();
				this.title = '修改分组';
				this.isUpdate = true;
			}
		},
		methods: {
			getInfo () {
				getGroup(this.form.groupId).then(response => {
					this.form = response.data;
				});
			},
			// 提交数据
			handleSubmitForm () {
				this.$refs.form.validate().then(res => {
					uni.showLoading({ title: '提交中...' });
					if (this.form.groupId != null) {
						updateGroup(this.form).then(response => {
							uni.showToast({ icon: 'success', title: '修改成功' });
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
									success: (e) => {
										var pages = getCurrentPages();
										var page = pages[pages.length - 2];
										if (page === undefined || page === null)
											return;
										// 更新列表
										if (uni.getSystemInfoSync().platform ===
											'devtools') {
											page.$vm.dataList = [];
											page.$vm.getList();
										} else {
											page.dataList = [];
											page.getList();
										}
									}
								});
							}, 1000);
						}).finally(() => {
							uni.hideLoading();
						});
					} else {
						addGroup(this.form).then(response => {
							uni.showToast({ icon: 'success', title: '新增成功' });
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
									success: (e) => {
										var pages = getCurrentPages();
										var page = pages[pages.length - 2];
										if (page === undefined || page === null)
											return;
										// 更新列表
										if (uni.getSystemInfoSync().platform ===
											'devtools') {
											page.$vm.dataList = [];
											page.$vm.getList();
										} else {
											page.dataList = [];
											page.getList();
										}
									}
								});
							}, 1000);
						}).finally(() => {
							uni.hideLoading();
						});
					}
				});
			},
			// 删除
			handleDelete () {
				uni.showModal({
					title: '系统提示',
					content: '确定删除当前分组吗？',
					success: result => {
						if (result.confirm) {
							uni.showLoading({ title: '删除中...' });
							delGroup(this.form.groupId).then(res => {
								if (res) {
									uni.showToast({
										icon: 'success',
										title: res.msg
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1,
											success: (e) => {
												var pages = getCurrentPages();
												var page = pages[pages.length - 2];
												if (page === undefined || page ===
													null)
													return;
												// 更新列表
												if (uni.getSystemInfoSync()
													.platform ===
													'devtools') {
													page.$vm.dataList = [];
													page.$vm.getList();
												} else {
													page.dataList = [];
													page.getList();
												}
											}
										});
									}, 1000);
								}
							}).finally(() => {
								uni.hideLoading();
							});
						}
					}
				});
			},
		}
	};
</script>

<style lang="scss">
	.device-group-add-wrap {
		.main-wrap {
			padding: 40rpx;
			background: #ffffff;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
		}
	}
</style>