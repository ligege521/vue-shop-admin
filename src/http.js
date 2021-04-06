import Vue from 'vue'
// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.timeout = 1000;
// axios.interceptors.
axios.defaults.timeout = 5000;
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.prototype.$http = axios;
