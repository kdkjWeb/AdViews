<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="操作人">
                  <el-input v-model="formInline.user" placeholder="请输入操作人"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
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


  </div>
</template>

<script>
  export default {
    name: 'logs',
    data(){
      return{
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {
          user: ''
        },
        tableData: [],
        tableList: [   //表格的头部配置
          {prop: 'operationName', label: '操作人', width: '', align: ''},
          {prop: 'operationMenu', label: '操作菜单', width: '', align: ''},
          {prop: 'url', label: '操作路径', width: '', align: ''},
          {prop: 'operationTime', label: '操作时间', width: '', align: ''},
        ],
      }
    },
    methods: {
      //条件查询搜索
      onSubmitSearch(){
        this.currentPage = 1;
        this.getLogsList();
      },

      //获取日志纪录数据
      getLogsList(pageNum){
          this.$post('smLog/queryByRecord',{
            pageSize: this.pageSize,
            pageNum: pageNum ? pageNum : 1,
            operationName: this.formInline.user ? this.formInline.user : null,
          }).then(res=>{
              console.log(res)
              if(res.code == 0){
                this.tableData = res.data.list;
                this.total = res.data.total;
              }
          })
      },


      //当前第几页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getLogsList(this.pageSize)
      },
    },
    mounted(){
      //获取日志列表
      this.getLogsList();
    }
  }
</script>

<style scoped>
  .addUser{
    text-align: right;
  }
  .red{
    color: #ff0000;
  }
  .el-select{
    width: 100%;
  }
</style>
