<template>
    <div class="clientDetails">
      <el-row :gutter="10">
        <el-col :md="8" :lg="6"><span>姓名：</span><span>{{clientDetails.mbname}}</span></el-col>
        <el-col :md="8" :lg="6"><span>护照号：</span><span>{{clientDetails.passport}}</span></el-col>
        <el-col :md="8" :lg="6"><span>咨询次数：</span><span>{{clientDetails.asks}}</span></el-col>
        <el-col :md="8" :lg="6"><span>手机号：</span><span>{{clientDetails.phone}}</span></el-col>
        <el-col :md="8" :lg="6"><span>教育程度：</span><span>{{clientDetails.edu}}</span></el-col>
        <el-col :md="8" :lg="6"><span>是否成单：</span><span>{{clientDetails.isdone}}</span></el-col>
        <el-col :md="8" :lg="6"><span>性别：</span><span>{{clientDetails.gender}}</span></el-col>
        <el-col :md="8" :lg="6"><span>兴趣爱好：</span><span>{{clientDetails.habbits}}</span></el-col>
        <el-col :md="8" :lg="6"><span>成单次数：</span><span>{{clientDetails.dones}}</span></el-col>
        <el-col :md="8" :lg="6"><span>年龄：</span><span>{{clientDetails.age}}</span></el-col>
        <el-col :md="8" :lg="6"><span>通讯地址：</span><span>{{clientDetails.addr}}</span></el-col>
        <el-col :md="8" :lg="6"><span>成单金额：</span><span>{{clientDetails.donemoney}}</span></el-col>
        <el-col :md="8" :lg="6"><span>邮箱：</span><span>{{clientDetails.email}}</span></el-col>
        <el-col :md="8" :lg="6"><span>出生日期：</span><span>{{clientDetails.birth}}</span></el-col>
        <el-col :md="8" :lg="6"><span>历史旅游目的地：</span><span>{{clientDetails.travel}}</span></el-col>
        <el-col :md="8" :lg="6"><span>QQ号：</span><span>{{clientDetails.qq}}</span></el-col>
        <el-col :md="8" :lg="6"><span>星座：</span><span>{{clientDetails.star}}</span></el-col>
        <el-col :md="8" :lg="6"><span>微信号：</span><span>{{clientDetails.weixin}}</span></el-col>
        <el-col :md="8" :lg="6"><span>身份证号：</span><span>{{clientDetails.idcard}}</span></el-col>
        <el-col :md="8" :lg="6"><span>创建时间：</span><span>{{clientDetails.cdate}}</span></el-col>
        <el-col :md="8" :lg="6"><span>修改时间：</span><span>{{clientDetails.updatetime}}</span></el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "clientDetails",
        data(){
          return{
            clientDetails: {}
          }
        },
        methods: {
          getClientDetails(){
            this.$get('/member/queryById',{
              id: this.$route.params.id
            }).then(res=>{
              console.log(res)

              if(res.code == 0){
                res.data.gender = res.data.gender == 1 ? '男' : '女';
                res.data.isdone = res.data.isdone == 1 ? '是' : '否';
                this.clientDetails = res.data;
              }
            })
          }
        },

        created(){

          console.log(this.$route.params)
          this.getClientDetails();
        },
    }
</script>

<style scoped>
.clientDetails .el-col{
  line-height: 50px;
}
</style>
