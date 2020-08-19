import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

//1.安装你插件
Vue.use(Vuex)

const state = {
  cartList: []
}
//2.创建store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
  },
})
//导出,挂载在vue实例上
export default store