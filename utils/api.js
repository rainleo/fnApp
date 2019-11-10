import MinRequest from './MinRequest'
import MinCache from './MinCache'
import MinRouter from './router'
const minRequest = new MinRequest()
const cache = new MinCache()
// 请求拦截器
minRequest.interceptors.request((request) => {
	console.log("添加token");
	const value = cache.get('_loginFlag');
	if (value) {
		if (value == true) {
			request.header={...request.header,...{'Authorization':'Bearer '+cache.get('_token')}}
		} 
	}
	
  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	console.log(response);
	if (response.statusCode === 200) {
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
  config.baseURL = 'http://leo.free.idcfengye.com'
  return config
})


export default {
  apis: {
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
		return minRequest.post('/auth/applogin',data)
	},
	modifyPwd (data) {
		return minRequest.post('/auth/applogin',data)
	}
  }
}
