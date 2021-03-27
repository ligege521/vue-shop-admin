import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import {Form, FormItem, Input, Button, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
// icon 文件
import './assets/icon/font/iconfont.css'
// 导入axios
import axios from 'axios'

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
