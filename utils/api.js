import MinRequest from './MinRequest'
import MinCache from './MinCache'
import MinRouter from './router'
const minRequest = new MinRequest()
const cache = new MinCache()
// 请求拦截器
const websiteUrl = 'http://localhost:8000';
minRequest.interceptors.request((request) => {
	console.log("添加token");
	const value = cache.get('_loginFlag');
	console.log("token"+cache.get('_token'));
	if (value&&cache.get('_token')) {
		if (value == true) {
			console.log("token added");
			request.header={...request.header,...{'Authorization':'Bearer '+cache.get('_token')}}
		} 
	}
	
  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	//console.log(JSON.stringify(response));
	console.log(response);
	if(response.errMsg == "request:fail"){
		uni.showModal({
			content: "网络异常，请稍后重试！",
			confirmText: "确定",
			showCancel: false,
		})
		return
	}
	console.log('-----');
	if (response.statusCode == 200 ||response.statusCode == 201) {
		return response.data
	} else{
		uni.showModal({
			content: response.data.message,
			confirmText: "确定",
			showCancel: false,
			complete() {
				console.log(response.data.message);
				if(response.data.status === 401){
					console.log(401);
					var pages = getCurrentPages();
					var currPage = pages[pages.length - 1]; //当前页面
					//var prevPage = pages[pages.length - 2]; //上一个页面
					console.log(currPage.route);
					cache.set('url',currPage.route);
					uni.navigateTo({
						url: '/pages/login/login'
					});
					cache.set('_loginFlag',false)
					cache.delete('_token')
				}else{
					console.log("error :"+response.data.status);
				}
			}
		})
		// uni.showToast({
		//     title: response.data.message,
		//     duration: 2000,
		// 	complete: () => {}
		// });
		
		
		
		
	}
	
  
})

// 设置默认配置
minRequest.setConfig((config) => {
  config.baseURL =websiteUrl//'http://localhost:8000'  //'http://leo.free.idcfengye.com'
  //config.baseURL='http://leo.free.idcfengye.com'
  return config
})


export default {
  apis: {
	 url(){
		  return websiteUrl
	  },
     vcode () {
      return minRequest.get('/auth/vCode')
    },
	myinfo () {
	  return minRequest.get('/auth/info')
	},
	login (data) {
		return minRequest.post('/auth/applogin',data)
	},
	register (data) {
		return minRequest.post('/users/create',data)
	},
	modifyPwd (data) {
		return minRequest.post('/users/update',data)
	},
	addTolist (data) {
		return minRequest.post('/api/todoList',data)
	},
	addOrg (data) {
	  return minRequest.post('/api/appDeptAdd',data)
	},
	appTodoList (data) {
		if(data.my==1){
			return minRequest.get('/api/appTodoList?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0')
		}else{
			return minRequest.get('/api/appMyTodoList?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0')
		}
	},
	appDeptQuery (data) {
		return minRequest.get('/api/appDeptQuery?sort=id,desc'+'&pid='+data.id)
	},
	appJobQuery (data) {
		return minRequest.get('/api/appJobQuery?page=0&size=100&sort=id,desc&deleted=0'+'&deptId='+data)
	},
	appUsersQuery (data) {
		return minRequest.get('/api/appUsersQuery?page=0&size=100&sort=id,desc'+'&jobId='+data)
	},
	appAapplicationDocuments(data){
		return minRequest.post('/api/appAapplicationDocuments',data)
	},
	appAuditChainQuery(data){
		return minRequest.get('/api/appAuditChainQuery?page=0&size=100&sort=id,desc&deleted=0'+'&companyId='+data.companyId+'&source='+data.source)
	},
	appAccountingSubjectsQuery(data){
		return minRequest.get('/api/appAccountingSubjectsQuery?page=0&size=100&sort=id,desc&deleted=0'+'&companyId='+data)
	},
	appApplicationDocumentsQuery (data) {
		if(data.my==1){
			//审批中审批通过待申请
			return minRequest.get('/api/appApplicationDocumentsQuery?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0&status=1')
		}else{
			//审批中
			return minRequest.get('/api/appApplicationDocumentsQuery?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0&status=0')
		}
	},
	appReimbursementDocuments(data){
		return minRequest.post('/api/appReimbursementDocuments',data)
	},
	appReimbursementDocumentsQuery (data) {
		if(data.my==1){
			//审批通过
			return minRequest.get('/api/appReimbursementDocumentsQuery?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0&status=1')
		}else{
			//审批中
			return minRequest.get('/api/appReimbursementDocumentsQuery?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0&status=0')
		}
	},
	appApproveQuery (data) {
		if(data.my==0){
			//申请审批
			return minRequest.get('/api/appApplicationDocumentsQuery?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0&status=0')
		}else{
			//报销审批
			return minRequest.get('/api/appReimbursementDocumentsQuery?page='+data.page+'&size='+data.size+'&sort=id,desc&deleted=0&status=0')
		}
	},
  }
}
