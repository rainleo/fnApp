<template>
	<view class="container999" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
		<!-- 刷新事件isRefresh需要异步操作返回resolve -->
		<refresh ref="refresh" @isRefresh='isRefresh'></refresh>
		<view class='nav'>
			<!-- #ifdef H5 -->
				<view style="height: 44px;width: 100%;">边距盒子</view>
			<!-- #endif -->
			
			<!-- 导航栏 agents导航栏标题 -->
			<navTab ref="navTab" :tabTitle="tabTitle" @changeTab='changeTab'></navTab>
		</view>
		<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
		<swiper style="min-height: 100vh;" :current="currentTab" @change="swiperTab">
			<swiper-item v-for="(listItem,listIndex) in list" :key="listIndex">
				<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="lower1" scroll-with-animation :scroll-into-view="toView">
				<view :id="'top'+listIndex" style="width: 100%;height: 180upx;">边距盒子</view>
				<view class='content'>
					<view class='card' v-for="(item,index) in listItem" v-if="listItem.length > 0" :key="index" @click="updateTo(item.applicationNo)">
						事项：{{item.subjectName}}
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-bottom">
								<text>金额：</text><div v-if="item.amount">{{item.amount}}</div>
								<text>审批状态：</text> <div v-if="item.status">{{item.status}}</div>
								<text>申请单号：{{item.applicationNo}}</text>
							</view>
							<view class="uni-media-list-text-top">描述   </view>
							{{item.applicationDescription}}
						</view>
					</view>
				</view>
				<view class='noCard' v-if="listItem.length===0">
					暂无信息
				</view>
				<view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- <tabBar4 :currentPage="currentPage"></tabBar4> -->
	</view>
</template>

<script>
const util = require('../../../utils/util.js');
import refresh from '../../../components/refresh.vue';
import navTab from '../../../components/navTab.vue';
//import tabBar4 from '../../components/tabBar4.vue';
export default {
	components: {refresh,navTab},
	data() {
		return {
			toView:'',//回到顶部id
		    currentTab: 0, //sweiper所在页
			pages:[0,0], //第几页存储 
			tabTitle:['申请审批','报销审批',], //导航栏格式
			list: [[],[]] ,//数据格式
			page:{
				page:0,
				size:5,
				sort:'id,desc',
				delete:0,
				tab:0,
				my:0,
			},
			totalElements:[0,0],
			
		  };
	},
	onLoad(e) {
		this.$minApi.appApproveQuery(this.page).then(res=>{
		  this.totalElements[0]=res.totalElements;
		  this.list[0]=res.content;
			this.$forceUpdate();
		}).catch(err =>{
			console.log(err);
			console.log("error");
			})
	    this.page.my=1;
		this.$minApi.appApproveQuery(this.page).then(res=>{
			  this.totalElements[1]=res.totalElements;
			  this.list[1]=res.content;
				this.$forceUpdate();
			}).catch(err =>{
				console.log("error");
				})
		
	},
	onShow() {},
	onHide() {},
	methods: {
		toTop(){
			this.toView = ''
			setTimeout(()=>{
				this.toView = 'top' + this.currentTab
			},10)
		},
		changeTab(index){
			this.currentTab = index
		},
		updateTo(index){
		 console.log(index);
		 if(this.currentTab==1){
			 this.$openPage({
				 name:"reimberse",
				 query:{applicationNo:index}
			 })
		 }
		},
		// 其他请求事件 当然刷新和其他请求可以写一起 多一层判断。
		isRequest(pages) {
			return new Promise((resolve, reject) => {
				console.log("refresss");
				this.pages[this.currentTab]++
					
				if((this.pages[this.currentTab])*this.page.size >= this.totalElements[this.currentTab]){
					console.log("no more data");
					uni.hideLoading();
					uni.showToast({title:"没有数据了!", icon:"none"});
					return;
				}
				this.page.tab=this.currentTab;
				this.page.page=this.pages[this.currentTab];
				var that = this
				this.page.my=this.currentTab;
				//refresh data
				this.$minApi.appApproveQuery(this.page).then(res=>{
				  this.totalElements[this.currentTab]=res.totalElements;
				  let newData =res.content;
				  console.log(res);
				  console.log("refress success");
				  resolve(newData)
				}).catch(err =>{
					console.log("refresh fail")
					uni.showToast({title:"刷新失败!", icon:"none"});
					})
				
				//let newData = ['新数据1','新数据2','新数据3']
				
				uni.hideLoading();
				
				
			})
		},
		// swiper 滑动
		swiperTab: function(e) {
			var index = e.detail.current //获取索引
			if(this.tabTitle.length<=5){
				this.$refs.navTab.navClick(index)
			}else{
				this.$refs.navTab.longClick(index)
			}
		},
		// 加载更多 util.throttle为防抖函数
		lower1: util.throttle(function(e) {
		console.log(`加载${this.currentTab}`)//currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数
		uni.showLoading({
			title: '加载中',
			mask:true
		})
			this.isRequest().then((res)=>{
				let tempList = this.list
				tempList[this.currentTab] = tempList[this.currentTab].concat(res)
				console.log(tempList)
				this.list = tempList
				this.$forceUpdate() //二维数组，开启强制渲染
			})
		}, 300),
		// 刷新touch监听
		refreshStart(e) {
			this.$refs.refresh.refreshStart(e);
		},
		refreshMove(e){
			this.$refs.refresh.refreshMove(e);
		},
		refreshEnd(e) {
			this.$refs.refresh.refreshEnd(e);
		},
		isRefresh(){
				setTimeout(() => {
					uni.showToast({
						icon: 'success',
						title: '刷新成功'
					})
					this.$refs.refresh.endAfter() //刷新结束调用
				}, 1000)
		}
	}
};
</script>

<style lang="scss">
.container999 {
	  width: 100vw;
	  font-size: 28upx;
	  min-height: 100vh;
	  overflow: hidden;
	  color: #6B8082;
	  position: relative;
	  background-color: white;
	}
	.content {
		width: 100%;
	}
	
	.card {
		width: 90%;
		height: 200upx;
		background-color: white;
		margin: 0 auto 42upx auto;
		background: #FFFFFF;
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
		border-radius: 5px;
		position: relative;
	}
	
	.noCard {
		width: 90%;
		height: 200upx;
		margin: auto;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
		box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.10);
		border-radius: 10upx;
	}
	
	
	.nav {
		position: fixed;
		left: 0;
		top: 0;
		color: white;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 24upx;
		background-color: #0bc99d;
		z-index: 996;
	}
	

	.input999 {
		color: #999;
		width: 80%;
	}
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}
	
	.banner-img {
		width: 100%;
	}
	
	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}
	
	.uni-media-list-logo {
		width: 180upx;
		height: 140upx;
	}
	
	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}
	
	.uni-media-list-text-top {
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}
	
	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
