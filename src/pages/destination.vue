<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="目的地">
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
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleDestination">新增热门目的地</el-button>
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

          <el-table-column
            prop="tag"
            label="景区"
            align="center">
            <template slot-scope="scope">
              <el-tag v-for="(items,index) in scope.row.places" :key="index">{{items}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="cdate"
            label="创建时间"
            width="180"
            align="center">
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
            <div class="bannerWrap">
              <h3>{{viewData.title}}</h3>
              <p>{{viewData.intro}}</p>
            </div>
          </div>
          <!--end 轮播图-->

          <div class="dayList">
            <div class="dayItem" v-for="item,index in viewData.spotList" :key="index">
              <div class="dayItem_top">
                <div class="dayIndex">{{index+1}}</div>
                <div class="dayInfo">
                  <h5>{{item.title}}</h5>
                  <p>{{item.subtitle}}</p>
                </div>
              </div>
              <div v-html="item.spotDesc"></div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { Swiper, Slide } from 'vue-swiper-component';

  export default {
    name: 'destination',
    components: {
      Swiper,
      Slide
    },
    data(){
      return{
        dialogVisible: false,
        viewData: {},
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          destination: '',   //姓名
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'cityname', label: '中文目的地', width: '', align: ''},
          {prop: 'cityEnglishname', label: '英文目的地', width: '', align: ''},
          {prop: 'title', label: '标题', width: '', align: ''},
          {prop: 'intro', label: '描述', width: '', align: ''},
        ],

      }
    },
    methods: {
      //条件查询搜索
      onSubmitSearch(){
        this.currentPage = 1;
        this.getDataList();
      },

      //预览
      handleView(val){
        console.log(val)
        if(val.hddid){
          this.$get('/hotDestDesc/queryById',{
            id: val.hddid
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
        this.$get('/hotDestDesc/queryByRecord',{
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
          name: 'destinationTpl'
        })
      },

      //编辑
      handleEdit(row){
        console.log(row)

        if(row.hddid){
          this.$router.push({
            name: 'destinationTpl',
            query: {
              id: row.hddid
            }
          })
        }

      },



      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该热门目的地, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/hotDestDesc/deleteById',{
            id: row.hddid
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
  .dayItem img{
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
    background: #eee;
    overflow: auto;
  }
  .banner{
    width: 100%;
    height: 130px;
  }
  .bannerWrap{
    position: relative;
    top: -30px;
    z-index: 9999;
    width: 260px;
    margin: 0 auto;
    background: #fff;
    border-radius: 5px;
    padding: 8px;
    font-size: 12px;
    box-sizing: border-box;
  }
  .bannerWrap h3{
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .bannerWrap p{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .dayList{
    margin-top: 100px;
    padding: 5px;
  }
  .dayItem{
    background: #fff;
    padding: 10px 5px;
    box-sizing: border-box;
    border-radius: 8px;
  }
  .dayItem_top{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
  .dayIndex{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    background:radial-gradient(circle,rgba(0,255,255,1),rgba(13,131,177,1));
    border:1px solid rgba(11, 107, 144, 1);
    font-size: 12px;
    margin-right: 5px;
    color: #fff;
  }
  .dayInfo{
    width: calc(100% - 50px);
    flex: 1;
  }
  .dayInfo p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

