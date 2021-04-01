import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
// 首页子页面
import Users from '../views/Users'

import Welcome from '../components/Welcome'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
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
