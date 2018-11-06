<template>
    <div class="chart">
      <!--start 顶部基本信息-->
      <div class="topInfo">
        <div class="left">
          <div>
            <dl>
              <dt>
                <span class="iconfont icon-dianji"></span>
              </dt>
              <dd>
                <p>总点击数</p>
                <p>3125533</p>
              </dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>
                <span class="iconfont icon-liulanjilu"></span>
              </dt>
              <dd>
                <p>总浏览量</p>
                <p>5142433</p>
              </dd>
            </dl>
          </div>
        </div>
        <div class="right">
          <div>
            <dl>
              <dt>
                <span class="iconfont icon-dianjichufa"></span>
              </dt>
              <dd>
                <p>今日点击数</p>
                <p>5142</p>
              </dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>
                <span class="iconfont icon-liulanlishi"></span>
              </dt>
              <dd>
                <p>今日浏览量</p>
                <p>5142</p>
              </dd>
            </dl>
          </div>
          <div>
            <p>指定时间</p>
            <p>
              <el-date-picker
                size="mini"
                v-model="value1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </p>
          </div>
        </div>
      </div>
      <!--end 顶部基本信息-->

      <!--start 图表内容-->
      <div class="container">
        <div class="container_head">
          <ul>
            <li>最近一周</li>
            <li>最近七周</li>
            <li>最近半年</li>
          </ul>
        </div>
        <div class="wrap">
          <div class="myChart" ref="myChart"></div>
        </div>
      </div>
      <!--end 图表内容-->
    </div>
</template>

<script>
    export default {
        name: "ChartDetails",
        data() {
          return {

          }
        },

        methods: {
            //获取顶部基本信息
            getDataTop(){
              this.$get('pyweb/ad/detailsTop',{
                adId: this.$route.query.id
              }).then(res=>{
                  console.log(res)
              })
            },

            //绘制图表
            drawLine() {
              // 基于准备好的dom，初始化echarts实例
              let myChart = this.$echarts.init(this.$refs.myChart);
              // 绘制图表
              myChart.setOption({
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data:['点击量','浏览量']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                toolbox: {
                  feature: {
                    saveAsImage: {}
                  }
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name:'点击量',
                    type:'line',
                    data:[120, 132, 101, 134, 90, 230, 210]
                  },
                  {
                    name:'浏览量',
                    type:'line',
                    data:[220, 182, 191, 234, 290, 330, 310]
                  }
                ]
              });
            }
          },

        mounted(){
          //绘制图表
          this.drawLine();
        },

        created(){
            //获取顶部基本信息
            this.getDataTop();

          console.log(this.$route.query.id)
        }
    }
</script>

<style scoped>
.chart .topInfo{
  width: 900px;
  margin: 0 auto;
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  color: #2693fa;
  font-size: 12px;
}
.chart .topInfo div.left{
  width: 310px;
  border-radius: 5px;
  display: inherit;
  box-shadow:0px 3px 17px 4px rgba(40,118,159,0.21);
  justify-content: space-between;
}
.chart .topInfo div.right{
  width: 540px;
  border-radius: 5px;
  display: inherit;
  box-shadow:0px 3px 17px 4px rgba(40,118,159,0.21);
  justify-content: space-between;
}
.topInfo span.iconfont{
  font-size: 30px;
  opacity: 0.8;
}

 .left div{
   flex: 1;
   padding: 13px 15px 8px;
 }
 .left div dl,.right div dl{
   position: relative;
   display: flex;
   display: -webkit-flex;
 }
 .left div dl::after,.right div dl::after{
   position: absolute;
   right: -10px;
   top: 5px;
   display: inline-block;
   content: '';
   width: 2px;
   height: 40px;
   background-color: #ddd;
 }
 .left div:last-child dl::after,.right div:last-child dl::after{
   display: none;
 }


 .left div dt,.right div dt{
   width: 30px;
   height: 30px;
   margin-right: 5px;
 }
 .left div dd p:last-child,.right div dd p:last-child{
   font-weight: bold;
   font-size: 20px;
   letter-spacing: 1px;
 }


 .right div{
   padding: 13px 15px 8px;
 }
 .right div:nth-child(1),.right div:nth-child(2){
   flex: 2;
 }
 .right div:nth-child(3){
   flex: 3;
 }
 .right div:last-child p{
   text-align: center;
   padding: 2px 0;
 }
 .right p .el-date-editor{
   width: 175px !important;
   padding: 0;
 }



  /*start 图表内容*/
  .container{
    width: 900px;
    margin: 30px auto 20px;
  }
  .container .container_head ul{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    background-color: #2693fa;
    color: #fff;
    border-top-left-radius:6px;
    border-top-right-radius: 6px;
    margin-bottom: 10px;
  }
  .container .container_head ul li{
    flex: 1;
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .container .container_head ul li:nth-child(2){
    border-right: 2px solid #fff;
    border-left: 2px solid #fff;
  }
  .container .wrap{
    height: 300px;
    height: calc(100vh - 260px);
    border: 1px solid #ddd;
    border-top: none;
  }
  .myChart{
    width: 100%;
    height: 100%;
  }
</style>
