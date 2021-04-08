import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
// 首页子页面
import Welcome from '../components/Welcome'
import Users from '../views/Users'
import Rights from '../views//power/Rights'
import Roles from '../views//power/Roles'

// 商品管理
import Cate from '../views/commodity/Cate'
import Params from '../views/commodity/Params'
import GoodList from '../views/commodity/List'
import Add from '../views/commodity/Add'

//订单管理
import Order from '../views/order/Order'

// 数据统计
import Report from '../views/report/Report'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights},
      { path: '/roles', component: Roles},
      { path: '/categories', component: Cate},
      { path: '/params', component: Params},
      { path: '/goods', component: GoodList},
      { path: '/goods/add', component: Add},
      { path: '/orders', component: Order},
      { path: '/reports', component: Report},
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  console.log(to.path);
  let token = window.sessionStorage.getItem('token');
  if (to.path === '/login') {
    return next()
  } else if (!token) {
    return next('/login');
  } else {
    return next();
  }

})

export default router
