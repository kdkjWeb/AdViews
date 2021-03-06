/**
 * @author 杨勇
 * @date 18/10/31
 * @Description:  封装axios请求
 */

import Axios from 'axios';
import store from "../store/index";
import { Message } from 'element-ui';

//配置API接口地址
const API_ROOT = process.env.API_ROOT;


Axios.defaults.baseURL = API_ROOT;
Axios.defaults.timeout = 20000;
Axios.defaults.withCredentials = true;

//http request 拦截器
Axios.interceptors.request.use(
  config =>{
    if(store.state.token){   //判断token是否存在，如果存在，则在所有请求头上面添加token

      //   config.headers.Authorization = `token ${store.state.token}`;

      // config.headers['token'] = store.state.token;  //请求头设置token
      config.headers['type'] = 0;  //请求头设置token
    }
    return config;
  },err=>{
    return Promise.reject(err)
  }
)

//http response 拦截器
Axios.interceptors.response.use(
  response=>{
    return response;
  },err=>{
    if(err.response){
      switch (err.response.status) {

      }
    }
    return Promise.reject(err.response.data)
  }
  )

export default {

  /**
   * 封装get方法
   * @param url
   * @param params
   * @returns {Promise<any>}
   */


  get: (url,params = {})=>{
    return new Promise((resolve,reject)=>{
      Axios.get(url,{
        params: params
      }).then(res=>{
        // resolve(res.data)

        if(res.data.code == 0){
          resolve(res.data)
        }else if(res.data.code == 500){
          Message({
            message: res.data.msg,
            type: 'warning'
          });
          resolve(res.data)
        }

      }).catch(err=>{
        reject(err)
      })
    })
  },

  /**
   * 封装post方法
   * @param url
   * @param data
   * @returns {Promise<any>}
   */

  post: (url,data = {})=>{

    return new Promise((resolve,reject)=>{
      Axios.post(url,data).then(res=>{
        // resolve(res.data)

        if(res.data.code == 0){
          resolve(res.data)
        }else if(res.data.code == 500){
          Message({
            message: res.data.msg,
            type: 'warning'
          });
          resolve(res.data)
        }

      }).catch(err=>{
        reject(err)
      })
    })
  },


  delete: (url,params = {})=>{
    return new Promise((resolve,reject)=>{
      Axios.delete(url,{
        params: params
      }).then(res=>{
        // resolve(res.data)

        if(res.data.code == 0){
          resolve(res.data)
        }else if(res.data.code == 500){
          Message({
            message: res.data.msg,
            type: 'warning'
          });
          resolve(res.data)
        }

      }).catch(err=>{
        reject(err)
      })
    })
  },

  put: (url,data = {})=>{
    return new Promise((resolve,reject)=>{
      Axios.put(url,data).then(res=>{
        // resolve(res.data)

        if(res.data.code == 0){
          resolve(res.data)
        }else if(res.data.code == 500){
          Message({
            message: res.data.msg,
            type: 'warning'
          });
          resolve(res.data)
        }

      }).catch(err=>{
        reject(err)
      })
    })
  },

}
