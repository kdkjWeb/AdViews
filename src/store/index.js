import Vue from 'vue';
import Vuex from 'vuex';;
Vue.use(Vuex)


const state = {
  token: '',
  userInfo: '',   //存储用户相关信息
  // baseUrl: 'http://192.168.101.51:8080/',
  // baseUrl: 'http://39.96.11.70:8080/travel/'
  baseUrl: process.env.API_ROOT
}


export default new Vuex.Store({
    state: state,
    getters: {
      getToken: state => state.token,
      getUserInfo: state => state.userInfo
    },
    mutations: {
        setToken(state,data){
          sessionStorage.token = data;
          state.token = data;
        },
        setUserInfo(state,data){
            //sessionStorage.userInfo = JSON.stringify(data);
          sessionStorage.userInfo = data;
          state.userInfo = data
        }
    }
})
