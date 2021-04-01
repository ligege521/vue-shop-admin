import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
// 导入Element
import ElementUI from 'element-ui';
import {Message} from 'element-ui';
import {MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
// icon 文件
import './assets/icon/login/iconfont.css'
import  './assets/icon/home/iconfont.css'
// axios
import './http'


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.config.productionTip = false

Vue.use(ElementUI);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
