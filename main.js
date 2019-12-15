import Vue from 'vue'
import App from './App'

import MinRequest from './utils/MinRequest'
import minRequest from './utils/api'
// 引入MinRouter文件
import MinRouter from './utils/MinRouter'
// 引入router文件
import minRouter from './utils/router'
import mina from './components/min-a.vue'
import MinCache from './utils/MinCache'

Vue.config.productionTip = false

App.mpType = 'app'

// 注册请求
Vue.use(MinRequest)
Vue.use(MinRouter)
Vue.component('min-a', mina)
Vue.use(MinCache)
// 设置默认缓存时间
// Vue.use(MinCache, {timeout: 600})
const app = new Vue({
    ...App,
	minRouter,
	minRequest
	
})
app.$mount()
