<template>
	<view class="s-page-wrapper is-100vh">
		<view class="is-33vh has-mgt-10">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../../static/img/common/logo.png" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="content">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input type="number" maxlength="11" v-model="login.username" placeholder="请输入手机号" class="is-input1 " @input="BindInput" data-val="username" />
				</view>
				<view class=" has-radius has-mgtb-10">
					<input v-model="login.password" placeholder="请输入登录密码" class="is-input1"  @input="BindInput" data-val="password"/>
				</view>

				<view class=" loginbtn has-radius has-mgtb-20">
					<button :loading="login.loading" @tap="defaultHandlerLogin"> {{ login.loading ? "登录中...":"登 录"}} </button>
				</view>
			</view>
		</view>
		<view class="is-20vh has-mgt-80 content">
			<!-- <navigator url="../register/register" class=" has-radius is-right is-grey has-mgr-20" hover-class="">
				<text>没有账号？</text><text class="is-blue">点击注册</text>
			</navigator> -->
			
			<span  class=" has-radius is-right is-grey has-mgr-20 " hover-class="">
				<div class="uni-text-bottom ">
					<min-a to="register" class="is-blue">点击注册</min-a>
					<text>|</text>
					<min-a to="modify" class="is-red">忘记密码</min-a>
				</div>
			</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login: {
					loading: false,
					username:"",
					password:""
				},
				url:'',
				phoneReg: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
			};
		},
		onLoad:function(){
			const value = this.$cache.get('_loginFlag');
			//this.url=this.$parseURL();
			console.log("url");
			console.log(this.url);
			if (value) {
				if (value == true) {
					console.log("value:"+value);
					uni.switchTab({
						url: '../work/work'
					});
				} 
			} else{
				this.$cache.set('_loginFlag', false)
				console.log(this.$cache.get('_loginFlag'));	
			}
		},
		methods:{
			defaultHandlerLogin:function(){
				// uni.showToast({
				// 	title: "loading",
				// 	icon: "loading",
				// 	duration: 2000
				// })
				if (!this.phoneReg.test(this.login.username)) {
					uni.showToast({
					  title: "手机号不正确",
					  icon: "none"
					})
					return false;
				}
				console.log(JSON.stringify(this.login));
				this.$minApi.login(JSON.stringify(this.login)).then(res=>{
					this.$cache.set('_loginFlag', true)
					this.$cache.set('_token', res.token)
					var pages = getCurrentPages();
					var currPage = pages[pages.length - 1]; //当前页面
					this.url=this.$cache.get('url');
					if(this.url != null && this.url != currPage.route ){
						console.log("lll");
						const url = this.$cache.get('url');
						this.$cache.delete('url');
						
						uni.switchTab({
							url: '/'+url,
						});
						
						
					}else{
						this.$openPage({
							name: 'todo'
						})
					}
					
				}).catch(err =>{
					this.login.loading = false;
				})
				 
			},
			BindInput:function(e){
				var dataval = e.currentTarget.dataset.val;
				this.login[dataval] = e.detail.value; 
			}
			
		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.content {
		width: 85%;
		margin: 0 auto;
	}

	.loginbtn button {
		margin-top: 20rpx;
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
	}

	button:after {
		border: 2rpx solid #f2f2f2;
	}

	.logoimg {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
	}

	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}
	.uni-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.uni-text-bottom  text{
		display: flex;
		flex-direction: row;
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
</style>
