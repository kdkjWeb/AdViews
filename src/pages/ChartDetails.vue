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
                <p>{{sums.clicks}}</p>
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
                <p>{{sums.visits}}</p>
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
                <p>{{assign.clicks}}</p>
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
                <p>{{assign.visits}}</p>
              </dd>
            </dl>
          </div>
          <div>
            <p>指定时间</p>
            <p>
              <el-date-picker
                size="mini"
                v-model="date"
                type="date"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                @change="handleChange"
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
            <li :class="activeIndex == index ? 'active' : ''" @click="handleType(item.type,index)" v-for="item,index in timeList" :key="index">{{item.title}}</li>
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
            activeIndex: 0,
            timeList: [{
              title: '最近七日',
              type: 0
            },{
              title: '最近四周',
              type: 1
            },{
              title: '最近半年',
              type: 2
            }],
            assign: {},
            sums: {},
            date: '',
            pickerOptions: {
              //限制用户只能选择今天和今天以前的日期
              disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e6
              }
            },
            drawLineList: {
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
                data: []
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name:'点击量',
                  type:'line',
                  data:[]
                },
                {
                  name:'浏览量',
                  type:'line',
                  data:[]
                }
              ]
            }
          }
        },

        methods: {
            //获取顶部基本信息
            getDataTop(time){
              this.$get('pyweb/ad/detailsTop',{
                adId: this.$route.query.id,
                time: time
              }).then(res=>{
                  if(res.code == 0){
                    this.assign = res.data.assign;
                    this.sums = res.data.sums;
                  }
              })
            },

            //用户选择时间时触发
            handleChange(){
                this.getDataTop(this.date)
            },

            //控制用户选择不同的时间区域
            handleType(type,index){
                this.getLineList(type)
                this.activeIndex = index;
            },


            //获取图表数据
            getLineList(type){
              this.$get('pyweb/ad/detailsData',{
                  adId: this.$route.query.id,
                  type: type
              }).then(res=>{
                  if(res.code === 0){

                    //配置点击量
                    this.drawLineList.series[0].data = this.resetArray(res.data,'clicks');

                    //配置浏览量
                    this.drawLineList.series[1].data = this.resetArray(res.data,'visits');


                    //配置横坐标时间
                    this.drawLineList.xAxis.data = this.resetArray(res.data,'ctime');




                    //绘制图表
                    this.drawLine();
                  }

              })
            },

            /**
             * 重构数组数据
             * @param array
             * @param type
             * @returns {Array}
             */
            resetArray(array,type){
                let arr = [];
                array.forEach((item,index)=>{
                    if(item[type] || item[type] === 0){
                      arr.push(item[type])
                    }
                })

                return arr;
            },


            //绘制图表
            drawLine() {
              // 基于准备好的dom，初始化echarts实例
              let myChart = this.$echarts.init(this.$refs.myChart);
              // 绘制图表
              myChart.setOption(this.drawLineList);
            }
          },

        mounted(){

        },

        created(){
            //获取顶部基本信息
            this.getDataTop();

            //获取图表数据  0\1\2  分别对应日周月
            this.getLineList(0)

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
    background-color: #ddd;
    color: #fff;
    border-top-left-radius:6px;
    border-top-right-radius: 6px;
    overflow: hidden;
  }
  .active{
    background-color: #2693fa;
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
