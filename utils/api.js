import MinRequest from './MinRequest'
import MinCache from './MinCache'
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
	console.log("返回值判断");
  return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
  config.baseURL = 'http://localhost:8000'
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
	}
  }
}
