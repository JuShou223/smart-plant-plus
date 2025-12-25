<template>
	<page-meta>
		<navigation-bar title="裁剪" title-align="center" background-color="#007AFF" />
	</page-meta>
	<cropping :source="{ album: '相册' }" :imageUrl="avatarUrl" @cancel="handleCancel" @success="handleSuccess" />
</template>

<script>
	import cropping from '@/components/cropping/index.vue';
	import { uploadAvatar } from "@/apis/modules/account";

	export default {
		components: {
			cropping
		},
		data () {
			return {
				avatarUrl: '',
			}
		},
		onLoad (option) {
			this.avatarUrl = String(option.url);
		},
		methods: {
			handleCancel () {
				uni.navigateBack();
			},
			handleSuccess (data) {
				let params = {
					name: 'avatarfile',
					filePath: data.url
				};
				uploadAvatar(params).then(res => {
					uni.navigateBack();
				})
			}
		},
	}
</script>

<style>
</style>