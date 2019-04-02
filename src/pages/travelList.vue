<template>
  <div>
    <div class="container">
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
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


    </div>



  </div>
</template>

<script>
  export default {
    name: 'travelList',
    data(){

      return{

        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'id', label: '行程单号', width: '', align: ''},
          {prop: 'name', label: '行程名称', width: '', align: ''},
          {prop: 'userName', label: '作者', width: '', align: ''},
          {prop: 'orderId', label: '订单号', width: '', align: ''},
          {prop: 'crtTime', label: '创建时间', width: '', align: ''},
          {prop: 'startTime', label: '出发时间', width: '', align: ''},
          {prop: 'status', label: '状态', width: '', align: ''},
        ],

      }
    },
    methods: {




      //获取表格数据
      getDataList(){
        this.$get('/journeys/queryJourneysByOrder',{
          orderId: this.$route.query.id
        }).then(res=>{
          if(res.code == 0){
            console.log(res)

            var arr = res.list;

            arr.forEach((e,index)=>{
              arr[index].status = e.status == 0 ? '草稿' : '已发布';
            })


            this.tableData = JSON.parse(JSON.stringify(arr));

            console.log(this.tableData)

          }
        })
      },




      //编辑表格单行内容
      handleEdit(row){


      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get('/supplier/deleteById',{
            id: row.spId
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


    },
    mounted(){


      //获取表格数据
      this.getDataList();


    }
  }
</script>

<style scoped>
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

