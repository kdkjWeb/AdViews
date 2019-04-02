// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//引入element-ui并使用
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

//引用echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;


//引入axios封装请求并使用
 import Server from './server/index';
Vue.prototype.$get = Server.get;
Vue.prototype.$post = Server.post;
Vue.prototype.$delete = Server.delete;
Vue.prototype.$put = Server.put;


//引入store
import store from './store/index'




//路由拦截
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    next();
  }else {
    if(store.state.token){
      next();
    }else {
      next({
        path: '/login'
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
