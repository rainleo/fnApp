<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit">
				<view class="input-view">
					<view class="input-name">
						<view>标题</view>
						<input type="text" v-model="formData.todoAbstract" placeholder="请输入标题" />
					</view>

					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left" style="font-size: 28upx; ">
								协助人
							</view>
							<view class="uni-list-cell-db" style=" font-size: 32upx;color: #808080">
								<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange2" :value="multiIndex2" :range="multiArray2">
									<view class="uni-input">{{muliArrayData2[0][multiIndex2[0]].name}} {{muliArrayData2[1][multiIndex2[1]].name}}
										{{muliArrayData2[2][multiIndex2[2]].username}}</view>
								</picker>
							</view>
						</view>
					</view>

					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left" style="font-size: 28upx; ">
								抄送人
							</view>
							<view class="uni-list-cell-db" style=" font-size: 32upx;color: #808080">
								<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
									<view class="uni-input">{{muliArrayData[0][multiIndex[0]].name}} {{muliArrayData[1][multiIndex[1]].name}}
										{{muliArrayData[2][multiIndex[2]].username}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="input-date">
						<view class="view-date">期望完成时间</view>
						<view class="view-input-date">
							<ruiDatePicker fields="second" start="2010-00-00 00:00:00" end="2030-12-30 23:59:59" :value="this.value" @change="bindChange"
							 @cancel="bindCancel"></ruiDatePicker>
						</view>
					</view>
					<view class="uni-textarea">
						<view>待办内容 </view>
						<view>
							<textarea @blur="bindTextAreaBlur" placeholder-style="color:#808080 " placeholder="     请输入代办内容" />
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
	var  graceChecker = require("../../../utils/graceChecker.js");
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	export default {
		components:{
			ruiDatePicker
		},
		data() {
			return {
				value:'',
				title: '表单验证',
				index: 0,
				multiArray: [
					['','',''],
					['','',''],
					['','','']
				],
				muliArrayData:[
					[{id:'1',name:''},{id:'2',name:''},{id:'3',name:''}],
					[{id:'1',name:''},{id:'2',name:''},{id:'3',name:''}],
					[{id:'1',username:''},{id:'2',username:''},{id:'3',username:''}]
				],
				multiIndex: [0, 0, 0],
				multiArray2: [
					['','',''],
					['','',''],
					['','','']
				],
				muliArrayData2:[
					[{id:'1',name:''},{id:'2',name:''},{id:'3',name:''}],
					[{id:'1',name:''},{id:'2',name:''},{id:'3',name:''}],
					[{id:'1',username:''},{id:'2',username:''},{id:'3',username:''}]
				],
				multiIndex2: [0, 0, 0],
				formData:{
					todoAbstract:'',
					assistantPersonId:'',
					copyPersonId:'',
					content:'',
					expectedCompletionTime:'',
					createTime:'',
					status:'0',
					updateTime:'',
					
				},
				deptData:{
					id:0,
				},
			}
		},
		onLoad() {
			this.getdept()	
			
				
		},
		methods: {
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"todoAbstract", checkType : "string", checkRule:"1,4",  errorMsg:"请输入标题"},
					{name:"content", checkType : "string", checkRule:"1,23",  errorMsg:"请输入代办内容"},
					{name:"copyPersonId", checkType : "string", checkRule:"1,4",  errorMsg:"请选择协助人"}
				];
				//进行表单检查
				this.formData.copyPersonId=this.muliArrayData[2][this.multiIndex[2]].id;
				this.formData.assistantPersonId=this.muliArrayData2[2][this.multiIndex2[2]].id;
				console.log(this.formData);
				var checkRes = graceChecker.check(this.formData, rule);
				if(checkRes){
					this.$minApi.addTolist(JSON.stringify(this.formData)).then(res=>{
					this.$openPage({
						name: 'todo'
					})
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			formReset: function (e) {
				console.log("清空数据")
				//this.title = ''
				//this.value='2019-12-14 00:00:00'
				
			},
			bindChange: function (e) {
				console.log(new Date(e).getTime())
				this.formData.expectedCompletionTime=new Date(e).getTime();
				this.formData.createTime= new Date().getTime();
				this.formData.updateTime= new Date().getTime();
			},
			bindCancel: function (e) {
				console.log('22222')
				//this.chosen = ''
			},
			bindTextAreaBlur: function (e) {
			            console.log(e.detail.value)
						this.formData.content=e.detail.value
			},
			getdept: function(){
					this.deptData.id=this.$cache.get('_userinfo').companyId
					this.$minApi.appDeptQuery(this.deptData).then(res=>{
					if(res.content.length===0) {
						this.multiArray2[0]=['','',''];
						this.multiArray[0]=['','',''];
						return
					}
					this.muliArrayData[0]=res.content
					this.muliArrayData2[0]=res.content
					for (let i = 0; i < res.content.length; i++) {
						this.multiArray[0][i]=res.content[i].name
						this.multiArray2[0][i]=res.content[i].name
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})
			},
			getjobs: function(){
					this.$minApi.appJobQuery(this.muliArrayData[0][this.multiIndex[0]].id).then(res=>{
					if(res.content.length===0) {
						this.multiArray[1]=['','',''];
						return
					}
					this.muliArrayData[1]=res.content
					for (let i = 0; i < res.content.length; i++) {
						this.multiArray[1][i]=res.content[i].name
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})
			},
			getjobs2: function(){
					this.$minApi.appJobQuery(this.muliArrayData2[0][this.multiIndex2[0]].id).then(res=>{
					if(res.content.length===0) {
						this.multiArray2[1]=['','',''];
						return
					}
					this.muliArrayData2[1]=res.content
					for (let i = 0; i < res.content.length; i++) {
						this.multiArray2[1][i]=res.content[i].name
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})
			},	
			getUser: function(){
					console.log(this.muliArrayData);
					this.$minApi.appUsersQuery(this.muliArrayData[1][this.multiIndex[1]].id).then(res=>{
					if(res.content.length===0)
					 {
						 this.multiArray[2]=['','',''];
						 return
					 }
					this.muliArrayData[2]=res.content
					for (let i = 0; i < res.content.length; i++) {
						this.multiArray[2][i]=res.content[i].username
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})	
			},
			getUser2: function(){
					console.log(this.muliArrayData);
					this.$minApi.appUsersQuery(this.muliArrayData2[1][this.multiIndex2[1]].id).then(res=>{
					if(res.content.length===0)
					 {
						 this.multiArray2[2]=['','',''];
						 return
					 }
					this.muliArrayData2[2]=res.content
					for (let i = 0; i < res.content.length; i++) {
						this.multiArray2[2][i]=res.content[i].username
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})	
			},		
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0:
						this.getjobs()
						this.multiIndex[1] = 0
						this.multiIndex[2] = 0
						break
					case 1:
						this.getUser()
						this.multiIndex[2] = 0
						break
				}
				this.$forceUpdate()
			},
			bindMultiPickerColumnChange2: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex2[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0:
						this.getjobs2()
						this.multiIndex2[1] = 0
						this.multiIndex2[2] = 0
						break
					case 1:
						this.getUser2()
						this.multiIndex2[2] = 0
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
			bottom: -150rpx;
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
