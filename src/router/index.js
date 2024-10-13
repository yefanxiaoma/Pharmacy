import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter);
/*
* 解决this.$router.push("")跳转重复
* */
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user/login',
    name: 'login',
    component: () => import('@/views/User/login/Login.vue')
  },
  {
    path: '/user/register',
    name: 'register',
    component: () => import('@/views/User/login/Register.vue')

  },
  {
    path: '/user/usercenter',
    name: 'usercenter',
    component: ()=>import('@/views/User/usercenter/UserCenter.vue'),
    meta:{requiresAuth:true},
  },
  {
    path: '/drugdetail/:id',
    name: 'DrugDetail',
    props: true,
    component: ()=>import('@/views/User/drug/DrugDetail.vue'),
    meta:{requiresAuth:true},
  },
  {
    path: '/shoppingcart',
    name: 'ShoppingCart',
    component: () => import('@/views/User/shoppingcart/ShoppingCart.vue'),
    meta:{requiresAuth:true},
  },
  {
    path: '/search',
    name: 'SearchAll',
    component: () => import('@/views/User/search/SearchAll.vue'),

  },
  {
    path: '/typeshow',
    name: 'TypeShow',
    component: () => import('@/views/User/typeshow/TypeShow.vue'),

  },
  {
    path: '/orders/orderinfo',
    name: 'OrderInfo',
    component: () => import('@/views/User/orderinfo/OrderInfo.vue'),
    meta:{requiresAuth:true},
  },
  {
    path: '/orders/orderdetail',
    name: 'OrderDetail',
    component: () => import('@/views/User/orderinfo/OrderDetail.vue'),
    meta:{requiresAuth:true},
  },
  {
    path: '/OrderShow',
    name: 'OrderShow',
    component: () => import('@/views/Admin/ordersmanage/OrderShow.vue'),
    meta:{requiresAuth:true},
  },
  {
    path: '/admin/index',
    name: 'AdminIndex',
    component: ()=>import('@/views/Admin/AdminIndex.vue'),
    meta:{requiresAuth:true},
    children:[
      {
        path: '/admin/AdminHome',
        name: 'AdminHome',
        meta:{
          title:'首页',
        },
        component: () => import('@/views/Admin/home/AdminHome.vue'),
      }
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
/*
* 解决重复菜单报错
* */
export function resetRouter(){
  router.matcher = new VueRouter({
    mode:'history',
    routes:[]
  }).matcher
}
/*
* 全局路由守卫*/
router.beforeEach((to, from, next) => {
  // 检查用户是否登录
  const isLoggedIn = !!sessionStorage.getItem("CurUser") || !!sessionStorage.getItem("AdminCurUser");

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    // 如果路由需要认证并且用户未登录
    next({ path: '/user/login' }); // 跳转到登录页
  } else {
    next(); // 确保一定要调用 next()
  }
});
export default router
