<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="城市名">
                  <el-input v-model="formInline.destination" placeholder="请输入目的地" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="addUser">
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleDestination">新增精品案例</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 用户列表表格 -->
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          size="small"
          border >
          <el-table-column
            v-for="(item,index) in tableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-view" @click.stop="handleView(scope.row)">预览</el-button>
              <el-button type="text" icon="el-icon-edit" @click.stop="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" class="red" @click.stop="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- start分页 -->
      <div class="page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total,prev, pager, next, jumper"
          :total="total"
          background>
        </el-pagination>
      </div>
      <!-- end分页 -->
    </div>


    <el-dialog
      title="精品案例详情预览"
      :visible.sync="dialogVisible"
      width="50%">
      <div class="phone">
        <div class="phoneWrap">
          <!--start 轮播图-->
          <div class="banner">
            <Swiper>
              <Slide v-for="(item,index) in viewData.showImgList" :key="index">
                <img :src="item" alt="" width="100%" height="130">
              </Slide>
            </Swiper>
          </div>
          <!--end 轮播图-->

          <!--start 基本信息-->
          <div class="basicInfo">
            <h4>￥<span>{{viewData.price}}</span>/人起</h4>
            <p>{{viewData.title}}</p>
            <div class="basicInfo_bottom">
              <div>仅剩<span>{{viewData.remains}}</span>席 </div>
              <div><span>{{viewData.starttime}}</span>出发</div>
            </div>
          </div>
          <!--end 基本信息-->
          <div class="bgHr"></div>

          <!--start 底部详细信息-->
          <div>
            <!--start  选项卡bar-->
            <div class="cardBar">
              <div @click="changeBar(0)"><span :class="activeBar == 0 ? 'activeBar' : ''">行程特色</span></div>
              <div @click="changeBar(1)"><span :class="activeBar == 1 ? 'activeBar' : ''">推荐玩法</span></div>
              <div @click="changeBar(2)"><span :class="activeBar == 2 ? 'activeBar' : ''">报价说明</span></div>
            </div>
            <!--end 选项卡bar-->
            <div class="barCon" v-if="activeBar == 0">
              <img :src="item" alt="" v-for="item,index in viewData.tripImgList">
            </div>
            <div class="barCon recommend" v-if="activeBar == 1">

              <div class="dayItem" v-for="item,index in viewData.daysList" :key="index">
                <h5><span class="dayIndex">DAY{{index+1}}</span><span>{{item.title}}</span></h5>
                <div>活动</div>
                <div class="actInfo">{{item.actInfo}}</div>
                <div>
                  <div class="famousItem" v-for="items,index in item.lableList" :key="index">
                    <div><span>景点：</span>{{items.tripName}}</div>
                    <div v-html="items.tripDesc"></div>
                    <div><span>地址：</span>{{items.addr}}</div>
                    <div><span>时间：</span>{{items.opentime}}</div>
                  </div>
                </div>
                <div class="holte">
                  <div><span>酒店：</span>{{item.hotelName}}</div>
                  <div class="holteWrap">
                    <div class="holteWrap_img"><img :src="item.hotelImg" alt=""></div>
                    <div class="holteWrap_info">
                      <div class="holteWrap_info_title">{{item.hotelIntro}}</div>
                      <div><span>地址：</span>{{item.hotelAddr}}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="barCon" v-if="activeBar == 2" v-html="viewData.offerDesc"></div>
          </div>
          <!--end 底部详细信息-->
          
        </div>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  import { Swiper, Slide } from 'vue-swiper-component';
  export default {
    name: 'viewpoint',
    components: {
      Swiper,
      Slide
    },
    data(){

      return{
        activeBar: 0,
        dialogVisible: false,
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          destination: '',   //姓名
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'cityname', label: '城市名', width: '', align: ''},
          {prop: 'title', label: '标题', width: '', align: ''},
          {prop: 'playType', label: '副标题', width: '', align: ''},
          {prop: 'intro', label: '介绍', width: '', align: ''},
          {prop: 'price', label: '人均费用', width: '', align: ''},
          {prop: 'remains', label: '仅剩席位', width: '', align: ''},
          {prop: 'starttime', label: '出游时间', width: '', align: ''},

        ],
        viewData: {}

      }
    },
    methods: {
      //条件查询搜索
      onSubmitSearch(){
        this.currentPage = 1;
        this.getDataList();
      },

      changeBar(val){
        this.activeBar = val;
      },

      //预览
      handleView(val){

        if(val.bcid){

          this.$get('/bestCase/queryById',{
            id: val.bcid
          }).then(res=>{
            if(res.code ==0 ){

              this.dialogVisible = true;
              this.viewData = res.data;
            }
          },err=>{
            this.$message.error('预览失败，请稍后再试!');
          }).catch(err=>{
            this.$message.error('预览失败，请稍后再试!');
          })
        }

      },

      //获取表格数据
      getDataList(pageNum){
        this.$get('/bestCase/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          cityname: this.formInline.destination ? this.formInline.destination : null,
        }).then(res=>{
          if(res.code == 0){
            console.log(res)
            this.total = res.data.total;

            let arr = res.data.list;

            arr.forEach((e,index)=>{

              console.log(e.places)

              if(e.places){
                arr[index].places = e.places.split(',');
              }

            })

            this.tableData = JSON.parse(JSON.stringify(arr));

            console.log(this.tableData)
          }
        })
      },

      //新增供应商
      handleDestination(){
        this.$router.push({
          name: 'viewpointTpl'
        })
      },

      //编辑
      handleEdit(row){
        console.log(row)
        this.$router.push({
          name: 'viewpointTpl',
          query: {
            id: row.bcid
          }
        })
      },



      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该热门目的地, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/bestCase/deleteById',{
            id: row.bcid
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getDataList();
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //当前第几页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getDataList(this.currentPage);
      },



    },
    mounted(){
      //获取表格数据
      this.getDataList();



    }
  }
</script>

<style>
  .famousItem img{
    width: 100%;
  }
</style>

<style scoped>
  .phone{
    position: relative;
    width: 375px;
    height: 667px;
    background-image: url("./../assets/images/IPhoneX.png");
    background-size: 100%;
    margin: 0 auto;
  }
  .phoneWrap{
    position: absolute;
    left: 58px;
    top: 64px;
    width: 276px;
    height: 551px;
    /*border: 1px solid #ddd;*/
    box-sizing: border-box;
    background: #fff;
  }
  .banner{
    width: 100%;
    height: 130px;
  }
  .basicInfo{
    padding: 10px;
  }
  .basicInfo h4{
    color: #0C83B0;
  }
  .basicInfo p{
    font-weight: bold;
  }
  .basicInfo_bottom{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .bgHr{
    width: 100%;
    height: 5px;
    background: #ddd;
  }
  .cardBar{
    display: flex;
    display: -webkit-flex;
    padding: 10px 0 0;
    border-bottom: 1px solid #ddd;
  }
  .cardBar div{
    flex: 1;
    text-align: center;
  }
  .activeBar{
    border-bottom: 3px solid #0C83B0;
    padding: 0 3px 2px;
  }
  .barCon{
    padding: 0 10px 10px;
    height: 285px;
    overflow: auto;
  }
  .barCon img{
    width: 100% !important;
    height: auto;
  }

  .recommend{
    font-size: 12px;
    /*margin-left: 10px;*/
    /*margin-top: 10px;*/
    box-sizing: border-box;
  }
  .cirle{
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    text-align: center;
    line-height: 15px;
    color: #fff;
    background: #0C83B0;
    font-size: 10px;
  }
  .dayIndex{
    padding-right: 5px;
  }
  .actInfo{
    padding: 5px 0;
  }
  .famousItem{
    margin-bottom: 10px;
  }
  .holteWrap{
    display: flex;
    display: -webkit-flex;
    margin-top: 5px;
  }
  .holteWrap_img{
    width: 70px;
    height: 70px;
    padding-right: 5px;
  }
  .holteWrap_img img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .holteWrap_info{
    flex: 1;
  }
  .holteWrap_info_title{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;

  }
  .dayItem{
    margin-top: 30px;
  }
  .dayItem:nth-child(1){
    margin-top: 10px;
  }
  .dayItem h5 span:first-child{
    color: #0C83B0;
  }




  .container .el-tag{
    margin: 3px;
  }
  .pwdNotice{
    line-height: 20px;
    padding-top: 10px;

  }
  .pwdNotice span{
    color: red;
  }
  .addUser{
    text-align: right;
  }
  .red{
    color: #ff0000;
  }
  .orange{
    color: #e6a23c;
  }
  .el-select{
    width: 100%;
  }
</style>

