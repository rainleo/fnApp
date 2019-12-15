import MinRouter from './MinRouter'

// 配置路由
const router = new MinRouter({
	routes: [
		{
			// 页面路径
      path: 'pages/index/index',
      // type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo']
      // 跳转方式(默认跳转方式)
			type: 'navigateTo',
			name: 'index'
		},
		{
			path: 'pages/register/register',
			name: 'register'
		},
		{
			path: 'pages/todo/todo',
			type: 'switchTab',
			name: 'todo'
		},
		{
			path: 'pages/login/login',
			type: 'navigateTo',
			name: 'login'
		},
		{
			path: 'pages/modify/modify',
			type: 'navigateTo',
			name: 'modify'
		},
		{
			path: 'pages/my/info/info',
			type: 'navigateTo',
			name: 'info'
		},
		{
			path: 'pages/work/work',
			type: 'switchTab',
			name: 'work'
		},
		{
			path: 'pages/todo/approve/approve',
			type: 'navigateTo',
			name: 'approve'
		},
		{
			path: 'pages/work/addwork/addwork',
			type: 'navigateTo',
			name: 'addwork'
		},
		{
			path: 'pages/todo/financial/financial',
			type: 'navigateTo',
			name: 'financial'
		},
		{
			path: 'pages/my/orgAprove/orgAprove',
			type: 'navigateTo',
			name: 'orgapprove'
		},
		{
			path:'pages/work/reimburse/reimburse',
			type:'navigateTo',
			name:'reimberse'
		},
		{
			path:'pages/work/myapprove/myapprove',
			type:'navigateTo',
			name:'myapprove'
		},
		{
			path:'pages/work/myreimburse/myreimburse',
			type:'navigateTo',
			name:'myreimburse'
			
		},
		
		
	] 
})
router.beforeEach((to, from, next) => {
	if (from === 'pages/index/index' && to === 'pages/my/index') {
		// 不希望跳转就传false
		next(false)
		// 跳到指定页面
		// next('pages/test/index')
	}
})


export default router

