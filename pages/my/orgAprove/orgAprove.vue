<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view class="input-view">
					<view class="input-name">
						<view>机构名称</view>
						<input type="text" v-model="formData.orgName" placeholder="请输入机构名" />
					</view>

					<view class="uni-list list-pd">
						<view class="uni-list-cell cell-pd">
							<view class="uni-uploader">
								<view class="uni-uploader-head">
									<view class="uni-uploader-title"> 上传组织机构相关执照</view>
									<view class="uni-uploader-info">{{imageList.length}}/9</view>
								</view>
								<view class="uni-uploader-body">
									<view class="uni-uploader__files">
										<block v-for="(image,index) in imageList" :key="index">
											<view class="uni-uploader__file">
												<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
											</view>
										</block>
										<view class="uni-uploader__input-box">
											<view class="uni-uploader__input" @tap="chooseImage"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary" :disabled="submitclose">Submit</button>
					<button class="btn-reset" type="default" formType="reset">Reset</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var graceChecker = require("../../../utils/graceChecker.js");
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {

		data() {
			return {
				title: '',
				index: 0,
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				formData: {
					orgName: '',
					name: '',
					pid: 1,
					enabled: 'false',
					deptDetailList: [],

				},
				files: [],
				submitclose:false,
			}
		},
		methods: {
			formSubmit: function(e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				console.log(JSON.stringify(this.formData));
				var rule = [{
					name: "orgName",
					checkType: "string",
					checkRule: "1,6",
					errorMsg: "机构应为1-6个字符"
				}];
				//进行表单检查
				this.submitclose=true;
				var checkRes = graceChecker.check(this.formData, rule);
				this.formData.name = this.formData.orgName;
				if (checkRes) {
					if (this.imageList.length > 0) {

						console.log();
						//uni.showToast({title:"验证通过!", icon:"none"});
						//call api
						//this.files = [];
						//this.formData.deptDetailLis = [];
						
						
						this.$minApi.addOrg(JSON.stringify(this.formData)).then(res => {
							uni.showToast({
								title: "添加成功!",
								icon: "none"
							});
						}).catch(err => {
							uni.showToast({
								title: "添加失败!",
								icon: "none"
							});
							this.submitclose=false;
						})

						return
					}
					uni.showToast({
						title: "图片未选择!",
						icon: "none"
					});
					this.submitclose=false;
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					this.submitclose=false;
				}
			},
			formReset: function(e) {
				console.log("清空数据")
				this.imageList = []
				this.formData.deptDetailList=[]
				this.submitclose=false
			},
			chooseImage: async function() {
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {

						this.imageList = this.imageList.concat(res.tempFilePaths);
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.uploadFile({
								url: 'http://localhost:8000' + '/api/qiNiuContentall',
								//files: this.files,
								fileType: 'image',
								filePath: res.tempFilePaths[i],
								header: {
									'Authorization': "Bearer " + this.$cache.get('_token')
								},
								//header:Authorization: "Bearer "+this.$cache.get('_token'), 
								name: 'file',
								success: (uploadFileRes) => {
									let data = JSON.parse(uploadFileRes.data)
									console.log(data);
									console.log(this.formData.deptDetailList.length);
									if(this.formData.deptDetailList.length==0){
										this.formData.deptDetailList=data;
									}else{
										console.log(data[0]);
										this.formData.deptDetailList.push(data[0]);
									}
									console.log(this.formData.deptDetailList);
						
								},
								fail: (err) => {
									console.log(err);
								}
							});
						
						}
						
						//console.log(res.tempFiles);
						//console.log(res.tempFilePaths);
						//console.log(this.imageList);
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				console.log(this.imageList);
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			}

		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.uni-padding-wrap {
		margin-top: 118upx;
		margin-right: 50upx;
		margin-left: 50upx;
	}

	.input-name,
	.input-password .uni-uploader-title {
		height: 80upx;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
		padding-left: 30upx;
		box-sizing: border-box;
	}

	.input-name::after {
		content: " ";
		position: absolute;
		left: 0upx;
		bottom: 0;
		right: 0;
		height: 1px;
		transform-origin: 0 0;
		transform: scaleY(.5);
	}

	.input-name view,
	.input-password view,
	.uni-uploader-title {
		width: 300upx;
		height: 50upx;
		line-height: 50upx;
		font-size: 30upx;
		color: #333333;
	}

	.input-name input,
	.input-password input {
		flex: 1;
		height: 50upx;
		line-height: 50upx;

	}

	.uni-btn-v {
		display: flex;
		flex-direction: row;
		margin-bottom: 20rpx;
	}

	.btn-submit,
	.btn-reset {
		margin-bottom: 70rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #2A62FF;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #E2E4EA;
		opacity: 0.8;
		bottom: -40rpx;
	}
</style>
