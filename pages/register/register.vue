<template>
	<view class="s-page-wrapper is-100vh">
		<view class="is-33vh has-mgt-10">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../../static/img/common/logo.png" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="registercontent">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input type="number" v-model="phone" maxlength="11" placeholder="请输入手机号" class="is-input1 " />
				</view>
				<view class=" has-mgtb-10 ">
					<input type="number" maxlength="6" v-model="code" placeholder="短信验证码" class="is-input1 " />
					<view class="codeimg" @tap="getsmscode">{{smsbtn.text}}</view>
				</view>

				<view class=" has-radius has-mgtb-10">
					<input placeholder="请输入登录密码" :password="true" v-model="password" class="is-input1" />

				</view>
				<view class=" registerbtn has-radius has-mgtb-20">
					<button @click="register">注 册</button>
				</view>
			</view>
		</view>
		<view class="is-20vh has-mgt-80">
			<navigator url="../principle/principle" class=" has-radius is-center is-grey " hover-class="">
				<text>注册即表示同意</text><text class="is-blue">《用户协议》</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	const mobsms = uni.requireNativePlugin('HY-MobSms');
	export default {
		data() {
			return {
				smsbtn: {
					text: '获取验证码',
					status: false,
					codeTime: 60
				},
				timerId: null,
				code: '',
				phone:'',
				password:'',
				phoneReg: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
			};
		},
		methods: {
			getsmscode: function() {
				if (!this.phoneReg.test(this.phone)) {
					uni.showToast({
					  title: "手机号不正确",
					  icon: "none"
					})
					return false;
				}
				if (this.smsbtn.status == true ) {
					console.log('message：', "别着急！短信已经发送了~");
					return false;
				}
				mobsms.sendSms({country:'86',phone:this.phone},result=>{
				    if(result.code==1){
				        uni.showToast({
				          title: "发送成功",
				          icon: "success"
				        })
				    }else{
				        uni.showToast({
				          title: "发送失败",
				          icon: "none"
				        })
						}
					})
				
				this.smsbtn.status = true; // 这段代码其实应该加在你request请求 短信发送成功后
				this.timerId = setInterval(() => {
							var codeTime = this.smsbtn.codeTime;
							codeTime--;
							this.smsbtn.codeTime = codeTime;
							this.smsbtn.text = codeTime + "S";
							if (codeTime < 1) {
								clearInterval(this.timerId);
								this.smsbtn.text = "重新获取";
								this.smsbtn.codeTime = 60;
								this.smsbtn.status = false;
							}
						},
						1000);
				return false;
			},
			register: function () {
				mobsms.verify({country:'86',phone:this.phone,code:this.code},result=>{
				    console.log(JSON.stringify(result))
				    if(result.code==1){
				        //register 
						var form ={'phone':this.phone,'password':this.password};
						this.$minApi.register(JSON.stringify(form)).then(res=>{
							uni.showToast({
							  title: "注册成功！",
							  icon: "none"
							})
							}).catch(err =>{
								uni.showToast({
								  title: "注册失败！",
								  icon: "none"
								})
						})
				    }else{
				        uni.showToast({
				          title: "短信验证码验证失败",
				          icon: "none"
				        })
				    //const status= result.status
				    }
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

	.registercontent {
		width: 85%;
		margin: 0 auto;
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

	.iconfont {
		position: absolute;
		font-size: 40rpx;
		right: 12%;
		z-index: 999;
		width: 105rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.codeimg {
		position: absolute;
		font-size: 28rpx;
		right: 12%;
		z-index: 999;
		width: 200rpx;
		text-align: center;
		color: #353535;
		margin-top: -11%;
		background: #fff;
		border-top-right-radius: 44rpx;
		border-bottom-right-radius: 44rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.registerbtn button {
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
</style>
