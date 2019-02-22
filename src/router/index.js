import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
//引入所有路由文件
import routes from './routes.js'

Vue.use(Router)


export default new Router(routes)


// 页面刷新时，重新赋值用户信息
if((sessionStorage.getItem('userInfo')) || sessionStorage.getItem('token')){

  sessionStorage.getItem('userInfo') && store.commit('setUserInfo',sessionStorage.getItem('userInfo'));
  sessionStorage.getItem('token') && store.commit('setToken',sessionStorage.getItem('token'));

}






