<template>
  <view>
    <cmd-page-body type="top">
      <cmd-transition name="fade-up">
        <view class="modify">
          <view class="modify-phone">
            <cmd-input v-model="mobile.phone" type="number" maxlength="11" placeholder="请输入手机号"></cmd-input>
            <view class="modify-phone-getcode" :style="safety.state ? 'color: #2196F3;':''" @tap="!safety.state ? fnGetPhoneCode() : ''">{{!safety.state&&'获取验证码'||(safety.time+' s')}}</view>
          </view>
          <view class="modify-code">
            <cmd-input v-model="mobile.code" type="number" maxlength="6" placeholder="请输入短信验证码"></cmd-input>
          </view>
          <view class="modify-password">
            <cmd-input v-model="mobile.passwordOne" type="password" displayable maxlength="26" placeholder="请输入新密码"></cmd-input>
          </view>
          <view class="modify-password">
            <cmd-input v-model="mobile.passwordTwo" type="password" maxlength="26" placeholder="请再次确认新密码"></cmd-input>
          </view>
          <button class="btn-modify" :class="modifyMobile ? 'btn-modify-active':''" :disabled="!modifyMobile"
            hover-class="btn-modify-hover" @tap="fnModify">提交</button>
        </view>
      </cmd-transition>
    </cmd-page-body>
  </view>
</template>

<script>
  import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
  import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
  import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
  import cmdInput from "@/components/cmd-input/cmd-input.vue"
  const mobsms = uni.requireNativePlugin('HY-MobSms');
  export default {
    components: {
      cmdNavBar,
      cmdPageBody,
      cmdTransition,
      cmdInput
    },

    data() {
      return {
        mobile: {
          phone: '',
          code: '',
          passwordOne: '',
          passwordTwo: ''
        },
        passwordReg: /^\w+$/,
        phoneReg: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
        safety: {
          time: 60,
          state: false,
          interval: ''
        },
        modifyMobile: false
      };
    },

    watch: {
      /**
       * 监听表单数值
       */
      mobile: {
        handler(newValue) {
          if (this.phoneReg.test(newValue.phone) && newValue.code.length == 4 && newValue.passwordOne.length >= 6 &&
            newValue.passwordOne == newValue.passwordTwo) {
            this.modifyMobile = true;
          } else {
            this.modifyMobile = false;
			
          }
        },
        deep: true
      }
    },

    methods: {
      /**
       * 提交按钮点击执行
       */
      fnModify() {
        console.log(JSON.stringify(this.mobile));
		mobsms.verify({country:'86',phone:this.phone,code:this.code},result=>{
			    console.log(JSON.stringify(result))
			    if(result.code==1){
			        //modify
					this.$minApi.login(JSON.stringify(this.login)).then(res=>{
						
						}).catch(err =>{
							this.login.loading = false;
					})
			    }else{
			        uni.showToast({
			          title: "短信验证码验证失败",
			          icon: "none"
			        })
			    //const status= result.status
			    }
			})
			
		
      },
      /**
       * 获取验证码
       */
      fnGetPhoneCode() {
        if (this.phoneReg.test(this.mobile.phone)) {
          uni.showToast({
            title: "正在发送验证码",
            icon: "loading",
            success: () => {
			  mobsms.sendSms({country:'86',phone:this.mobile.phone},result=>{
			      if(result.code==1){
			          uni.showToast({
			            title: "发送成功",
			            icon: "success"
			          })
					  // 成功后显示倒计时60s后可在点击
					  this.safety.state = true;
					  // 倒计时
					  this.safety.interval = setInterval(() => {
					    if (this.safety.time-- <= 0) {
					      this.safety.time = 60;
					      this.safety.state = false;
					      clearInterval(this.safety.interval);
					    }
					  }, 1000);
					  
			      }else{
			          uni.showToast({
			            title: "发送失败",
			            icon: "none"
			          })
			  		}
			  	})
            }
          })
        } else {
          uni.showToast({
            title: "手机号不正确",
            icon: "none"
          })
        }
      }
    },

    beforeDestroy() {
      /**
       * 关闭页面清除轮询器
       */
      clearInterval(this.safety.interval);
    }
  }
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}
  .modify {
    margin-top: 118upx;
    margin-right: 72upx;
    margin-left: 72upx;
  }

  .modify-phone {
	font-family: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 118upx;
	padding-left: 30rpx;
    margin-bottom: 40upx;
	border: 2rpx solid #e5e5e5;
	box-shadow: none;
	border-radius: 44rpx;
	font-size: 32rpx;
  }

  .modify-phone-getcode {
    color: #3F51B5;
    text-align: center;
    min-width: 140upx;
	font-size: 28rpx;
	padding-right: 30rpx;
  }

  .modify-password,
  .modify-code {
	font-family: inherit;
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
	font-family: inherit;
	background: #fff;
	resize: none;
	margin-bottom: 40upx;
  }

 
 .btn-modify {
   margin-top: 100upx;
   border-radius: 50upx;
   font-size: 16px;
   color: #fff;
   background: linear-gradient(to right, #88a1f9, #9ac6ff);
 }
 
 .btn-modify-active {
   background: linear-gradient(to right, #365fff, #36bbff);
 }
 
 .btn-modify-hover {
   background: linear-gradient(to right, #365fdd, #36bbfa);
 }

  button[disabled] {
    color: #fff;
  }
</style>
