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
// treeTable
import TreeTable from 'vue-table-with-tree-grid'
// 时间过滤器
import filter from './filter'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


// 全局消息弹框
Vue.prototype.$message = Message
// 全局确认弹框
Vue.prototype.$confirm = MessageBox.confirm
// 时间过滤器
Vue.filter('dateFormat', filter);
// 富文本
Vue.use(VueQuillEditor);

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.component('tree-table', TreeTable);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
