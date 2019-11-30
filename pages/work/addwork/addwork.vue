<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view class="input-view">
				    <view class="input-name">
				        <view>标题</view>
				        <input type="text" v-model="formData.todoAbstract" placeholder="请输入标题" />
				    </view>
				    <view class="input-password">
				        <view>协助人</view>
				        <input type="text" v-model="formData.assistantPersonId" placeholder="请输入协助人"  />
				    </view>
					
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left" style="font-size: 28upx; ">
								抄送人
							</view>
							<view class="uni-list-cell-db" style=" font-size: 32upx;color: #808080">
								<picker  mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
									<view class="uni-input">{{multiArray[0][multiIndex[0]]}} {{multiArray[1][multiIndex[1]]}} {{multiArray[2][multiIndex[2]]}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="input-date">
						<view class="view-date">完成时间</view>
						<view  class="view-input-date">
							<ruiDatePicker
							fields="second"
							start="2010-00-00 00:00:00"
							end="2030-12-30 23:59:59"
							:value="value"
							@change="bindChange"
							@cancel="bindCancel"></ruiDatePicker>
						</view>
					</view>
					<view class="uni-textarea">
						 <view>待办内容 </view>
						 <view>
							 <textarea @blur="bindTextAreaBlur" placeholder-style="color:#808080" placeholder="     请输入代办内容"/>
						 </view>
					</view>
					
				</view>
				
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">Submit</button>
					<button  class="btn-reset" type="default" formType="reset">Reset</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	var  graceChecker = require("../../../utils/graceChecker.js");
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	export default {
		components:{
			ruiDatePicker
		},
		data() {
			return {
				title: '表单验证',
				index: 0,
				multiArray: [
					['1','2','3'],
					['5','6','2'],
					['3','4','3']
				],
				multiIndex: [0, 0, 0],
				formData:{
					todoAbstract:'',
					assistantPersonId:'',
					copyPersonId:'',
					content:'',
					expectedCompletionTime:'',
					createTime:'',
					status:'0',
					
				},
			}
		},
		methods: {
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"todoAbstract", checkType : "string", checkRule:"1,4",  errorMsg:"请输入标题"},
					{name:"assistantPersonId", checkType : "string", checkRule:"1,4",  errorMsg:"请输入抄送人"},
					{name:"content", checkType : "string", checkRule:"1,23",  errorMsg:"请输入代办内容"},
					{name:"copyPersonId", checkType : "string", checkRule:"1,4",  errorMsg:"请选择协助人"}
				];
				//进行表单检查
				this.formData.copyPersonId=this.multiArray[0][this.multiIndex[0]];
				console.log(this.formData);
				var checkRes = graceChecker.check(this.formData, rule);
				if(checkRes){
					this.$minApi.addTolist(JSON.stringify(this.formData)).then(res=>{
					
						uni.showToast({title:"添加成功!", icon:"none"});
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			formReset: function (e) {
				console.log("清空数据")
				this.chosen = ''
			},
			bindChange: function (e) {
				console.log(new Date(e).getTime())
				this.formData.expectedCompletionTime=new Date(e).getTime();
				this.formData.createTime= new Date().getTime();
			},
			bindCancel: function (e) {
				console.log(e)
				this.chosen = ''
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
			bottom: -100rpx;
	}
		
	.uni-textarea{
		padding-left: 30upx;
		width: 120upx;
		height: 200upx;
		line-height: 50upx;
		font-size: 28upx;
		color: #333333;
		padding-top: 40upx;
	}
	.input-date{
	    height: 80upx;
	    width: 100%;
	    display: flex;
	    flex-direction: column;
		align-content:center;
	    position: relative;
	    padding-left: 30upx;
	    box-sizing: border-box;
		font-size: 28upx;
		color: #333333;
		
		
	}
	.view-input-date{
		height: 80upx;
		width: 100%;
	}
	
	
</style>
