import Vue from 'vue'
import Vuex from 'vuex'
import router,{resetRouter} from "../router";
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

function addNewRoute(menuList) {

  let routes = router.options.routes
  routes.forEach(routeItem=>{
    if(routeItem.path==="/admin/index"){
      menuList.forEach(menu=>{
        let childRoute =  {
          path:'/'+menu.menuClick,
          name:menu.menuName,
          meta:{
            title:menu.menuName,
          },
          component:()=>import('@/views/Admin/'+menu.menuComponent)
        }
        routeItem.children.push(childRoute)
      })
    }
  })
  resetRouter()
  for (let x of routes){
    router.addRoute(x)
  }
}
export default new Vuex.Store({
  state: {
    menu:[]
  },
  getters: {
    getMenu(state) {
      return state.menu
    }
  },
  mutations: {
    setMenu(state,menuList) {
       state.menu =menuList
      addNewRoute(menuList)
    },
    clearMenu(state) {
      state.menu = []; // 清空菜单
    }
  },
  actions: {
  },
  modules: {
  },
  plugins:[createPersistedState()]
})
