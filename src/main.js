import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.css'
import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import axios from 'axios';

Vue.config.productionTip = false
Vue.prototype.$axios=axios; //跨域处理插件
Vue.prototype.$HttpUrl = 'http://localhost:8090'
Vue.use(Element)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
