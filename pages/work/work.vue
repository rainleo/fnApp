<template>
	<view class="page_edu">
		<view class="page_edu_header">
			<view class="header">
				<image src="/static/icon_main.png" class="btn"></image>
				<view class="input">
					<image src="/static/search.png" class="search"></image>
					<input type="text" value="" placeholder="搜索" />
				</view>
				<image src="/static/msg.png" class="btn"></image>
			</view>
			<view class="header_content">
				<view class="left">
					<text class="title">移动办公</text>
					<text class="sub_title">随时随地工作提醒，快捷办公</text>
					<text class="btn">免费使用</text>
				</view>
				<view>
					<image src="/static/right.png" style="width: 131px;height: 122px;"></image>
				</view>
			</view>
		</view>
		<view class="page_content">
			<view class="menu">
				<template v-for="(it,i) in menus">
					<view class="item" @click="mopen(i)">
						<view class="img_view" :style="{background: it.bg}">
							<image :src="it.icon" class="image"></image>
						</view>
						<text class="txt">{{it.txt}}</text>
					</view>
				</template>
			</view>
			<neil-modal :show="show" @close="closeModal" title="新建代办">
			    <view class="input-view">
			        <view class="input-name">
			            <view>用户名</view>
			            <input type="text" placeholder="请输入用户名" />
			        </view>
					<view class="input-name">
					    <view>用户名</view>
					    <input type="text" placeholder="请输入用户名" />
					</view>
					<view class="input-name">
					    <view>用户名</view>
					    <input type="text" placeholder="请输入用户名" />
					</view>
			        <view class="input-password">
			            <view>密码</view>
			            <input type="text" password placeholder="请输入密码" />
			        </view>
			    </view>
			</neil-modal>
			<view class="s_menu">
				<template v-for="(it,i) in second_menus">
					<view class="item" @click="open(i)">
						<image :src="it.icon" class="image"></image>
						<text class="txt">{{it.txt}}</text>
					</view>
				</template>
			</view>
			<view class="ad">
				<view class="ad_btn">
					<text class="title">功能建设中</text>
					<text class="sub_title">敬请期待...</text>
				</view>
				<image src="/static/tag.png" class="bg"></image>
			</view>
		</view>
		<scroll-view scroll-x="true" class="slider">
			<template v-for="(it, i) in records">
				<view class="item" :key="'slider_item_'+i" :style="{background: it.bg, marginRight: i === records.length - 1 ? '15px' : '0px'}">
					<view class="item_content">
						<view class="title">
							<text class="first">{{it.title}}</text>
							<text class="main">发起人：{{it.mainTeacher}}</text>
							<text class="sub" :style="{color:it.subColor}">{{it.subTitle}}</text>
						</view>
						<image class="image" :src="it.icon"></image>
						<text class="free">待\n办</text>
					</view>
				</view>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: {
		    neilModal
		},
		data() {
			return {
				menus: [{
						bg: 'linear-gradient(0deg,rgba(9,216,162,1),rgba(90,242,217,1))',
						icon: '/static/graduation.png',
						txt: '新建代办',
						isFree: true
					},
					{
						bg: 'linear-gradient(0deg,rgba(251,184,35,1),rgba(255,228,40,1))',
						icon: '/static/live.png',
						txt: '财务申请',
						isFree: false
					},
					{
						bg: 'linear-gradient(0deg,rgba(255,126,34,1),rgba(240,184,27,1))',
						icon: '/static/emblem.png',
						txt: '报销申请',
						isFree: true
					},
					{
						bg: 'linear-gradient(0deg,rgba(9,177,252,1),rgba(24,200,255,1))',
						icon: '/static/question_bank.png',
						txt: '我的报销',
						isFree: true
					}
				],
				second_menus: [{
						icon: '/static/exam.png',
						txt: '审批'
					},
					{
						icon: '/static/textbook.png',
						txt: '建设中',
					},
					{
						icon: '/static/book_ticket.png',
						txt: '建设中'
					},
					{
						icon: '/static/more.png',
						txt: '建设中'
					}
				],
				records: [{
						bg: 'linear-gradient(-30deg,rgba(171,218,255,1),rgba(215,239,255,1))',
						title: '教师考情分析',
						mainTeacher: '小A',
						subTitle: '标题名称',
						subColor: '#15639F',
						//icon: '/static/test2.png',
						isFree: true
					},
					{
						bg: 'linear-gradient(-30deg,rgba(192,253,227,1),rgba(224,252,240,1))',
						title: '查看详情',
						mainTeacher: '小B',
						subTitle: '标题名称',
						subColor: '#07B77B',
						//icon: '/static/test.png',
						isFree: false
					},
					{
						bg: 'linear-gradient(-30deg,rgba(171,218,255,1),rgba(215,239,255,1))',
						title: '教师考情分析',
						mainTeacher: '小A',
						subTitle: '标题名称',
						subColor: '#15639F',
						//icon: '/static/test2.png',
						isFree: true
					}
				],
				page:{
					'page':0,
					'size':3,
					'sort':'id,desc'
				},
				totalElements:0,
			show:false,
			todo:[]
			}
		},
		onLoad() {
			this.$minApi.myinfo().then(res=>{
					console.log(res)
					this.$cache.set('_user', res)
				}).catch(err=>{
					console.log("get user error")
				})
		  this.myTodo()
		},
		methods: {
			open:function (x) {
				console.log(x);
				switch (x) {
					case 0:
							this.$openPage({
								name: 'approve'
							})
							break
					case 1:
							break
					case 2:
							break
					}
			},
			mopen:function (x) {
				console.log(x);
				switch (x) {
					case 0:
							// this.show = true
							this.$openPage({
								name: 'addwork'
							})
							break
					case 1:
							this.$openPage("financial")
							break
					case 2:
							this.$openPage("myapprove")
							break

					case 3:
							this.$openPage("myreimburse")
							break					}
			},
			closeModal:function () {
			    console.log(`监听到close`)
			    this.show = false
			},
			myTodo: function () {
			    console.log("todo");
				this.$minApi.appTodoList(JSON.stringify(this.page)).then(res=>{
					for (let i = 0; i < 3; i++) {//res.content.length
						console.log(res.content[i]);
						this.records[i].title= res.content[i].todoAbstract;
						this.records[i].mainTeacher=res.content[i].copyPerson.username;
						this.records[i].subTitle=res.content[i].content;
					}
					this.$forceUpdate();
				}).catch(err =>{
					uni.showToast({title:"添加失败!", icon:"none"});
					})
			},

		}
	}
</script>

<style>
	page {
		width: 100%;
		background-color: #ebebeb;
	}
</style>
<style lang="scss" scoped>
	@function realSize($args) {
		@return $args / 1.5;
	}

	.page_edu {
		width: 100%;
	}

	.page_edu_header {
		padding-top: var(--status-bar-height);
		background-color: #0bc99d;
		width: 100%;
		height: realSize(415px);

		.header {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: realSize(20px);

			.btn {
				width: realSize(36px);
				height: realSize(30px);
			}

			.input {
				height: realSize(59px);
				width: 100%;
				margin-left: realSize(20px);
				margin-right: realSize(20px);
				background: rgba(255, 255, 255, 1);
				border-radius: realSize(30px);
				display: flex;
				flex-direction: row;
				align-items: center;

				.search {
					width: realSize(30px);
					height: realSize(30px);
					margin-left: realSize(20px);
					margin-right: realSize(20px);
				}
			}
		}

		.header_content {
			display: flex;
			flex-direction: row;

			.left {
				display: flex;
				flex-direction: column;
				width: 57%;
				margin-top: 10px;
				margin-left: 15px;
				margin-right: 15px;

				.title {
					width: realSize(419px);
					height: realSize(59px);
					font-size: realSize(47px);
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
				}

				.sub_title {
					margin-top: 3px;
					font-size: realSize(18px);
					font-weight: 400;
					color: rgba(255, 255, 255, 1);

					background: linear-gradient(0deg, rgba(120, 255, 224, 1) 0%, rgba(255, 255, 255, 1) 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}

				.btn {
					margin-top: 3px;
					width: realSize(198px);
					height: realSize(60px);
					background: linear-gradient(-30deg, rgba(252, 135, 29, 1), rgba(246, 185, 9, 1));
					box-shadow: 0px 4px 10px 0px rgba(255, 121, 0, 0.5);
					border-radius: realSize(30px);
					color: rgba(255, 255, 255, 1);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}

	.page_content {
		width: 100%;
		margin-top: -74px;

		.menu {
			margin-left: 10px;
			margin-right: 10px;
			padding-left: 10px;
			padding-right: 10px;
			height: realSize(176px);
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 10px 10px 0px rgba(0, 161, 124, 0.1);
			border-radius: 10px;
			display: flex;
			flex-direction: row;
			align-items: stretch;
			justify-content: space-between;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.img_view {
					width: 60px;
					height: 60px;
					border-radius: 30px;
					display: flex;
					align-items: center;
					justify-content: center;

					.image {
						width: 50px;
						height: 50px;
					}
				}

				.txt {
					margin-top: 5px;
					font-size: 14px;
					color: rgba(51, 51, 51, 1);
				}
			}
		}

		.s_menu {
			display: flex;
			flex-direction: row;
			align-items: stretch;
			justify-content: space-between;
			margin-top: 15px;
			margin-left: 10px;
			margin-right: 10px;
			padding-left: 10px;
			padding-right: 10px;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.image {
					width: 35px;
					height: 35px;
				}

				.txt {
					margin-top: 5px;
					font-size: 14px;
					color: rgba(51, 51, 51, 1);
				}
			}
		}

		.ad {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.bg {
				position: absolute;
				width: 120px;
				height: 105px;
				left: 0;
			}

			.ad_btn {
				width: 100%;
				height: 63px;
				margin: 30px;
				background: linear-gradient(0deg, rgba(253, 155, 28, 1), rgba(251, 197, 33, 1));
				border-radius: 67px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.title {
					font-size: realSize(38px);
					font-family: PingFang-SC-Heavy;
					font-weight: 800;
					color: rgba(255, 255, 255, 1);
				}

				.sub_title {
					background: linear-gradient(0deg, rgba(255, 128, 37, 1), rgba(255, 153, 32, 1));
					box-shadow: 0px 4px 5px 0px rgba(92, 53, 48, 0.3), 0px 1px 0px 0px rgba(228, 228, 228, 1);
					border-radius: realSize(24px);
					font-size: realSize(24px);
					font-family: PingFang-SC-Heavy;
					font-weight: 800;
					font-style: italic;
					color: rgba(255, 236, 177, 1);
					line-height: realSize(26px);
				}
			}
		}
	}

	.slider {
		white-space: nowrap;
		width: 100%;
		background-color: white;

		.item {
			display: inline-block;
			margin-left: 15px;
			margin-top: 13px;
			margin-bottom: 13px;
			width: 60%;
			height: 125px;
			border-radius: 10px;

			.item_content {
				display: flex;
				flex-direction: row;

				.title {
					width: 36%;
					margin: 20px;
					display: flex;
					flex-direction: column;
					
					.first {
						font-size: 16px;
						color:rgba(46,65,69,1);
					}
					.main {
						font-size: 13px;
						color:rgba(79,103,101,1);
						margin-top: 5px;
					}
					.sub {
						width: 60px;
						font-size: 10px;
						margin-top: 20px;
						background:rgba(255,255,255,0.4);
						border-radius:5px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}

				.image {
					margin-top: 35px;
					width: 80px;
					height: 80px;
				}

				.free {
					background: rgba(11, 147, 252, 1);
					border-radius: 0px 0px 22px 22px;
					width: 25px;
					height: 50px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #FFFFFF;
					font-size: 14px;
				}
			}
		}
	}
</style>
