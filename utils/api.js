import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
	console.log("添加token");
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
    }
  }
}
