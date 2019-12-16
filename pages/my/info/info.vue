<template>
  <view>
    <cmd-page-body type="top">
      <cmd-transition name="fade-up">
        <view>
          <cmd-cel-item title="头像" slot-right >
            <cmd-avatar :src="user.avatar"></cmd-avatar>
          </cmd-cel-item>
          <cmd-cel-item title="部门" :addon="user.dept" arrow></cmd-cel-item>
          <cmd-cel-item title="昵称" addon="Slimmer" arrow></cmd-cel-item>
          <cmd-cel-item title="姓名" :addon="user.username" arrow></cmd-cel-item>
          <cmd-cel-item title="手机" :addon="user.phone"  arrow></cmd-cel-item>
          <cmd-cel-item title="邮箱" :addon="user.email" arrow></cmd-cel-item>
          <cmd-cel-item title="修改密码" @click="fnClick('modify')" arrow></cmd-cel-item>
		  <button class="btn-logout" @click="logout">退出登录</button>
        </view>
      </cmd-transition>
    </cmd-page-body>
  </view>
</template>

<script>
  import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
  import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
  import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
  import cmdCelItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
  import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
  import cmdInput from "@/components/cmd-input/cmd-input.vue"

  export default {
    components: {
      cmdNavBar,
      cmdPageBody,
      cmdTransition,
      cmdCelItem,
      cmdAvatar,
	  cmdInput
    },

    data() {
      return {
		  user:{
			  avatar:"",
			  dept:"",
			  email:"",
			  job:"",
			  username:"",
			  phone:""
		  }
	  };
    },

    mounted() {
		
	},
	onLoad() {
		if(this.$cache.get('_user') == null){
			this.myinfo()
		}else{
			this.user=this.$cache.get('_user')
		}
	},
    
    methods:{
      /**
       * 点击触发
       * @param {Object} type 跳转页面名或者类型方式
       */
      fnClick(type){
        if(type == 'modify'){
          this.$openPage('modify')
        }
      },
	  logout(){
		console.log("11");
		this.$cache.delete("_loginFlag");
		this.$cache.delete("_token");
		uni.reLaunch({
			url:"../../login/login"
		})
	  },
	  myinfo: function (e) {
	  	this.$minApi.myinfo().then(res=>{
			console.log(res)
			this.user = res
		}).catch(err=>{
			
		})
	  }
    }
  }
</script>

<style>
  .btn-logout {
    margin-top: 100upx;
    width: 80%;
    border-radius: 50upx;
    font-size: 16px;
    color: #fff;
    background: linear-gradient(to right, #365fff, #36bbff);
  }

  .btn-logout-hover {
    background: linear-gradient(to right, #365fdd, #36bbfa);
  }
</style>
