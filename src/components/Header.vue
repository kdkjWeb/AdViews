<!-- 头部导航 -->
<template>
  <div class="header">
    <!-- start logo图片 -->
    <div class="logo"></div>
    <!-- end logo图片 -->

    <!-- start 标题 -->
    <h1 class="title">广告运营统计平台</h1>
    <!-- end 标题 -->

    <!-- start 右侧模块 -->
    <div class="right_model">
      <div>
        <span class="iconfont icon-yonghuming"></span>
        <p>您好！<span>{{userName}}</span></p>
      </div>
      <div @click="LoginOut">
        <span class="iconfont icon-084tuichu"></span>
        <p>退出</p>
      </div>
    </div>
    <!-- end 右侧模块 -->
  </div>
</template>

<script>
  import bus from './bus.js'
  import {mapGetters} from "vuex";




  export default {
    data(){
      return{
        show: false,
        userName: '',
      }
    },
    methods: {
      //退出登录
      LoginOut(){
        console.log('退出登录')

        this.$get('pyweb/logout',{}).then(res=>{
            if(res.code == 0){
              //清除sessionStorage
              sessionStorage.removeItem('userInfo');
              //清除vuex
              this.$store.commit('setUserInfo', null)
              this.$router.push({
                path: '/login'
              })
            }else if(res.code == 500){
              this.$message({
                message: '请重新登录',
                type: 'warning'
              });
              this.$router.push({
                path: '/login'
              })
            }
        })
      },

    },
    mounted(){
      this.userName = this.getUserInfo.name;
    },
    computed:{
      ...mapGetters(['getUserInfo'])
    },

  }
</script>

<style scoped>
  .header{
    width: 100%;
    height: 50px;
    background: #383d41;
  }
  .logo{
    float: left;
    width: 127px;
    height: 100%;
    border-right: 1px solid #2c3135;
    background-image: url(../assets/images/header_logo.png);
    background-repeat: no-repeat;
    background-position: center;
  }
  .title{
    float: left;
    line-height: 50px;
    padding-left: 20px;
    color: #fff;
    font-size: 16px;
  }
  .right_model{
    display: flex;
    display: -webkit-flex;
    float: right;
    user-select: none;
    height: 100%;
    width: 260px;
    line-height: 50px;
    color: #fff;
  }
  .right_model div:first-child{
    flex: 4;
  }
  .right_model div:last-child{
    flex: 2;
  }
  .right_model span.iconfont{
    font-size: 20px;
  }
  .right_model div:first-child p{
    max-width: 115px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .right_model p{
    display: inline-block;
    vertical-align: top;
    padding-right: 30px;
  }




  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
