import Vue from 'vue';
import Vuex from 'vuex';;
Vue.use(Vuex)


const state = {
  token: '',
  userInfo: {}   //存储用户相关信息
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
            sessionStorage.userInfo = JSON.stringify(data);
            state.userInfo = data
        }
    }
})
