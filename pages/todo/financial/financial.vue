<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" >
				<view class="input-view">
				    <view class="input-name">
				        <view>申请事项</view>
				        <input type="text" v-model="formData.title" placeholder="请输入标题" />
				    </view>
				    <view class="input-password">
				        <view>申请金额</view>
				        <input type="text" password placeholder="请输入协助人"  />
				    </view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left" style="font-size: 28upx; ">
								审批人
							</view>
							<view class="uni-list-cell-db" style=" font-size: 32upx;color: #808080">
								<picker  mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
									<view class="uni-input">{{multiArray[0][multiIndex[0]]}} {{multiArray[1][multiIndex[1]]}} {{multiArray[2][multiIndex[2]]}} {{multiArray[3][multiIndex[3]]}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="uni-textarea">
						 <view>事项描述 </view>
						 <view>
							 <textarea @blur="bindTextAreaBlur" placeholder-style="color:#F76260" placeholder="     占位符字体是红色的"/>
						 </view>
					</view>
				</view>
				
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">Submit</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("../../../utils/graceChecker.js");
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
				title: '表单验证',
				index: 0,
				multiArray: [
					['1','2','3','5'],
					['5','6','2','6'],
					['3','4','3','5'],
					['3','4','3','5']
				],
				multiIndex: [0, 0, 0,0],
				formData:{
					title:'',
					partcipant:'',
					cc:'',
					content:'',
					
				},
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
		},
		methods: {
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"cc", checkType : "string", checkRule:"1,3",  errorMsg:"姓名应为1-3个字符"},
					{name:"title", checkType : "in", checkRule:"男,女",  errorMsg:"请选择性别"},
					{name:"loves", checkType : "notnull", checkRule:"",  errorMsg:"请选择爱好"}
				];
				//进行表单检查
				var formData = e.detail.value;
				this.formData.cc=this.multiArray[0][this.multiIndex[0]];
				console.log(this.formData);
				console.log(JSON.stringify(this.formData));
				var checkRes = graceChecker.check(this.formData, rule);
				if(checkRes){
					uni.showToast({title:"验证通过!", icon:"none"});
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			formReset: function (e) {
				console.log("清空数据")
				this.chosen = ''
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
				},
			bindTextAreaBlur: function (e) {
			            console.log(e.detail.value)
						this.formData.content=e.detail.value
			},
					
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0:
						switch (this.multiIndex[0]) {
							case 0:
								this.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
								this.multiArray[2] = ['猪肉绦虫', '吸血虫']
								break
							case 1:
								this.multiArray[1] = ['鱼', '两栖动物', '爬行动物']
								this.multiArray[2] = ['鲫鱼', '带鱼']
								break
						}
						this.multiIndex[1] = 0
						this.multiIndex[2] = 0
						break
					case 1:
						switch (this.multiIndex[0]) {
							case 0:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['猪肉绦虫', '吸血虫']
										break
									case 1:
										this.multiArray[2] = ['蛔虫']
										break
									case 2:
										this.multiArray[2] = ['蚂蚁', '蚂蟥']
										break
									case 3:
										this.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓']
										break
									case 4:
										this.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物']
										break
								}
								break
							case 1:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['鲫鱼', '带鱼']
										break
									case 1:
										this.multiArray[2] = ['青蛙', '娃娃鱼']
										break
									case 2:
										this.multiArray[2] = ['蜥蜴', '龟', '壁虎']
										break
								}
								break
						}
						this.multiIndex[2] = 0
						break
				}
				this.$forceUpdate()
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
	.input-password {
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
	    border-top: 1px solid #e5e5e5;
	    transform-origin: 0 0;
	    transform: scaleY(.5);
	}
	
	.input-name view,
	.input-password view {
	    width: 120upx;
	    height: 50upx;
	    line-height: 50upx;
	    font-size: 28upx;
	    color: #333333;
	}
	
	.input-name input,
	.input-password input {
	    flex: 1;
	    height: 50upx;
	    line-height: 50upx;
		
	}
	.uni-btn-v  {
		display: flex;
		flex-direction: row;
		margin-bottom: 20rpx;
	}
		
	.btn-submit ,
	.btn-reset{
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
		
	.uni-textarea{
		padding-left: 30upx;
		width: 120upx;
		height: 200upx;
		line-height: 50upx;
		font-size: 28upx;
		color: #333333;
	}
</style>
