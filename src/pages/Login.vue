<template>
  <div id="login">
     <div class="wrap">
       <!--start logo标志-->
       <div class="logo_wrap">
         <div class="logo">
           <div class="logo_img">
             <img src="./../assets/images/logo.png" width="49" height="49" alt="拼游logo">
           </div>
           <div class="logo_txt">
             <img src="./../assets/images/logo_txt.png" width="84" height="40" alt="拼游">
           </div>
         </div>
         <p class="concat">商务合作</p>
       </div>
       <!--end logo标志-->

       <!--start 登陆框内容-->
       <div class="login_wrap">
         <div class="row">
           <span class="iconfont icon-yonghuming icon"></span>
           <input v-model="userInfo.userName" class="row_input" type="text" placeholder="请输入您的用户名">
         </div>
         <div class="row">
           <span class="iconfont icon-icon icon"></span>
           <input v-model="userInfo.userPas" class="row_input" type="password" placeholder="请输入您的密码">
         </div>
         <div class="row">
           <input v-model="userInfo.userCode" class="code" type="text" placeholder="请输入验证码">
           <span class="verification" @click="getRandom">{{verification}}</span>
         </div>
         <p class="random"><a href="javascript:;" @click="getRandom">看不清换一张</a></p>
         <div class="row login_btn" @click="login">登录</div>
       </div>
       <!--end 登陆框内容-->
       <!-- start 底部版权 -->
       <div class="copyright">
         <p>Copyright © 2018 成都剑书科技有限公司 版权所有</p>
       </div>
       <!-- end 底部版权 -->
     </div>


  </div>
</template>

<script>
  export default {
    name: 'Login',
    data(){
      return{
        userInfo: {
          userName: '',
          userPas: '',
          userCode: ''
        },
        verification: '',
      }
    },
    methods:{
      //设置随机数
      setRandom(){
        for(var i=0; i<4; i++){
          this.verification+=Math.floor(Math.random()*10)
        }
      },

      //更换验证码
      getRandom(){
        this.verification = ''
        this.setRandom()
      },

      //登录
      login(){
        if(this.userInfo.userName == '' || this.userInfo.userPas == ''){
          this.$message({
            message: '请输入用户名和密码',
            type: 'warning'
          });
          return;
        }
        if(this.userInfo.userCode == ''){
          this.$message({
            message: '请输入验证码',
            type: 'warning'
          });
          return;
        }
        if(this.userInfo.userCode != this.verification){
          this.$message({
            message: '验证码输入错误',
            type: 'warning'
          });
          //验证码输入错误重新生成新的验证码
          this.getRandom();
          return;
        }
        if(this.userInfo.userName != this.userInfo.userPas){
          this.$message({
            message: '密码或错误，请确认后再输入',
            type: 'warning'
          });
        }

        this.$post('pyweb//login',{
            phone: this.userInfo.userName
        }).then(res=>{
            if(res.code == 0){
              //保存用户相关信息
              let userInfo = {
                name: res.userInfo.name,
                id: res.userInfo.id,
                role: res.data
              }

              //存入vuex
              this.$store.commit('setUserInfo', userInfo)

              if(res.data.hostelExists){
                this.$router.push({
                  name: 'hotel'
                })
              }else if(res.data.adExists){
                this.$router.push({
                  name: 'ad'
                })
              }


            }else if(res.code ==500){
              this.$message({
                message: res.msg,
                type: 'warning'
              });
            }
        })


      }

    },
    mounted(){
      this.setRandom()
    }
  }
</script>

<style scoped>
  #login{
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-image: url(../assets/images/bg.png);
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-size: 100% auto;
    /*padding-top: 72px;*/
    box-sizing: border-box;
    overflow: hidden;
  }


  /*start logo*/
  .logo_wrap{
    position: relative;

  }
  .logo{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    width: 147px;
    height: 49px;
    margin: 0 auto 0;
  }
  .logo_img{
    width: 49px;
  }
  .logo_txt{
    width: 84px;
    margin-top: 5px;
  }
  .concat{
    position: absolute;
    right: 0;
    bottom: 0;
    color: #999;
  }
  /*end logo*/

  /*start 登陆框内容*/
  .login_wrap{
    width:400px;
    height:360px;
    background:rgba(255,255,255,1);
    box-shadow:0px 3px 17px 4px rgba(40,118,159,0.41);
    border-radius:4px;
    margin: 30px auto 0;
    padding-top: 30px;
    box-sizing: border-box;
  }

  .login_wrap .row{
    position: relative;
    width: 320px;
    height: 40px;
    box-sizing: border-box;
    margin: 25px auto 0;
  }
  .login_wrap .row_border{
    border: 1px solid #cbcbcb;
  }
  .row_input{
    width: 320px;
    height: 40px;
    padding-left: 50px;
    box-sizing: border-box;
  }
  .icon{
    position: absolute;
    left: 1px;
    top: 1px;
    display: inline-block;
    width: 38px;
    height: 38px;
    background: #f3f3f3;
    text-align: center;
    line-height: 38px;
    font-size: 20px;
    color: #b3b3b3;
  }
  .login_wrap .row input{
    border: 1px solid #cbcbcb;
  }
  .login_wrap .row .code{
    width: 201px;
    height: 40px;
    box-sizing: border-box;
    padding-left: 10px;
  }
  .login_wrap .row .verification{
    display: inline-block;
    width: 95px;
    height: 40px;
    background: blue;
    vertical-align: middle;
    margin-left: 20px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    letter-spacing: 2px;
    user-select: none;
    cursor: pointer;
  }
  .login_btn{
    margin-top: 0 !important;
    background-color: #2791fe;
    color: #fff;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }
  .random{
    padding: 30px 0 15px 40px;
  }
  .random>a{
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(250,182,19,1);
  }
  /*end 登陆框内容*/

  /*start 底部版权*/
  .copyright{
    width: 100%;
    text-align: center;
    margin-top: 19px;
    color: rgba(0,0,0,.9);
    font-size: 14px;
    font-family: "Microsoft YaHei";
  }
  /*end 底部版权*/


</style>

