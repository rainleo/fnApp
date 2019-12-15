<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit">
				<view class="input-view">
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left" style="font-size: 28upx;">
								申请事项
							</view>
							<view class="uni-list-cell-db" style=" font-size: 32upx;color: #808080">
								<picker @change="bindPickerChange" :value="index" :range="array">
									<view class="uni-input">{{array[index]}}</view>
								</picker>
							</view>
						</view>
					</view>

					<view class="input-password">
						<view>申请金额</view>
						<input type="text" v-model="formData.amount" placeholder="  请输入金额" />
					</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left" style="font-size: 28upx; ">
								审批人
							</view>
							<view class="uni-list-cell-db" style=" font-size: 32upx;color: #808080">
								<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
									<view class="uni-input" v-for="(item,idx) in auditJobArray" v-if="auditJobArray.length > 0" :key="idx">
									{{multiArray[idx][multiIndex[idx]]}} 
									</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="uni-textarea">
						<view>事项描述 </view>
						<view>
							<textarea @blur="bindTextAreaBlur" placeholder-style="color:#808080" placeholder="     请输入事项描述" />
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
	
	export default {
		
		data() {
			return {
				title: '表单验证',
				index: 0,
				array: ['选择申请事项'],
				arrayData:[],
				multiArray: [
				],
				muliArrayData:[],
				multiIndex: [],
				formData:{
					accountingSubjectsId:'',
					applicationDescription:'',
					amount:'',
					reviewerList:[
					],
					companyId:'',
					deptId:''
				},
				auditQuery:{
					source:0,
					companyId:''
				},
				auditJobArray:[]
				
			}
		},
		onLoad() {
			this.getSubject();
			this.getAuditUser();	
		},
		methods: {
			getUser: function(e,pos){
					this.$minApi.appUsersQuery(e).then(res=>{
					if(res.content.length===0)
					 {
						 this.multiArray[0]=['未设置审批岗位员工'];
						 return
					 }
					this.muliArrayData[pos]=res.content
					for (let i = 0; i < res.content.length; i++) {
						this.multiArray[pos][i]=res.content[i].username
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})	
			},
			getAuditUser: function(){
					this.$minApi.appAuditChainQuery({source:0,companyId:this.$cache.get('_userinfo').companyId}).then(res=>{
					if(res.content.length===0)
					 {
						 this.multiArray[0]=['未设置审批链请联系管理员','','',''];
						 return
					 }
					for (let i = 0; i < res.content.length; i++) {
						this.auditJobArray.push(res.content[i].jobId)
						this.muliArrayData.push([])
						this.getUser(res.content[i].jobId,i)
						this.multiIndex.push(0)
						this.multiArray.push([])
						this.formData.reviewerList.push({});
						
					}
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})	
			},
			getSubject: function(){
					this.$minApi.appAccountingSubjectsQuery(this.$cache.get('_userinfo').companyId).then(res=>{
					if(res.content.length===0)
					 {
						 this.array=['未设置财务事项'];
						 return
					 }
					this.arrayData=res.content
					var array=[]
					for (let i = 0; i < res.content.length; i++) {
						array.push(res.content[i].subjectName)
					}
					this.array=array
					this.$forceUpdate()
					}).catch(err =>{
						uni.showToast({title:"添加失败!", icon:"none"});
						})	
			},
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"accountingSubjectsId", checkType : "string", checkRule:"1,10",  errorMsg:"应为1-10个字符"},
					{name:"applicationDescription", checkType : "string", checkRule:"1,100",  errorMsg:"最多100字符"},
					{name:"amount", checkType : "notnull", checkRule:"",  errorMsg:"请输入金额"}
				];
				this.formData.accountingSubjectsId=this.arrayData[this.index].id
				this.formData.companyId=this.$cache.get('_userinfo').companyId
				this.formData.deptId=this.$cache.get('_userinfo').deptId
				//进行表单检查
				this.formData.reviewerList=[]
				for (let i = 0; i < this.multiIndex.length; i++) {
					let obj ={userId:'',sorted:''}
					obj.userId=this.muliArrayData[i][this.multiIndex[i]].id
					obj.sorted=i+1
					this.formData.reviewerList[i]=obj
				}
				console.log(JSON.stringify(this.formData));
				var checkRes = graceChecker.check(this.formData, rule);
				if(checkRes){
					this.$minApi.appAapplicationDocuments(JSON.stringify(this.formData)).then(res=>{
					this.$openPage({
					 	name: 'work'
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
				this.chosen = ''
			},
			bindTextAreaBlur: function (e) {
			            console.log(e.detail.value)
						this.formData.applicationDescription=e.detail.value
			},
			bindPickerChange: function(e){
				this.index=e.detail.value
			
			},	
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
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
