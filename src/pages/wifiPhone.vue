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
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增WIFI电话卡</el-button>
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
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- start 弹出新增用户框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
          <el-row>
            <el-col :span="24">
              <el-form-item label="目的地" prop="destination">
                <el-input v-model="form.destination" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="供应商" prop="supplier">
                <el-input v-model="form.supplier" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="价格" prop="price">
                <el-input v-model="form.price" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="描述" prop="detail">
                <el-input type="textarea" v-model="form.detail" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="取还地点" prop="getAddress">
                <el-input type="textarea" v-model="form.getAddress" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>



        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancle" size="small">取 消</el-button>
            <el-button type="primary" @click="handleComfirm('form')" size="small">保 存</el-button>
        </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: 'wifiPhone',
    data(){
      return{
        dialogTitle: '新增WIFI电话卡',   //弹出框标题
        id: '',    //用户id
        form: {
          destination: '',  //目的地
          title: '',   //标题
          supplier: '',   //供应商
          price: '',   //价格
          detail: '',   //描述
          getAddress: '',   //取还地点
        },
        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          destination: ''
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'destination', label: '目的地', width: '', align: ''},
          {prop: 'title', label: '标题', width: '', align: ''},
          {prop: 'supplier', label: '供应商', width: '', align: ''},
          {prop: 'price', label: '价格', width: '', align: ''},
          {prop: 'crtTime', label: '创建时间', width: '', align: ''}
        ],
        rules: {

        }

      }
    },
    methods: {
      //条件查询搜索
      onSubmitSearch(){
        this.currentPage = 1;
        this.getDataList();
      },

      //弹出框取消按钮
      handleCancle(){
        this.dialogVisible = false;
      },

      //弹出框确认按钮
      handleComfirm(formName){
          var url = this.id ? '/wifyPhone/updateModel' : '/wifyPhone/insertModel';
          if(this.id){   // id存在表示修改
            this.$put(url,{
              destination: this.form.destination,  //目的地
              title: this.form.title,   //标题
              supplier: this.form.supplier,   //供应商
              price: this.form.price,   //价格
              detail: this.form.detail,   //描述
              getAddress: this.form.getAddress,   //取还地点
              id: this.id
            }).then(res=>{
              this.$message({
                type: 'success',
                message: 'WIFI电话卡编辑成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            },err=>{
              this.$message({
                message: 'WIFI电话卡编辑失败',
                type: 'warning'
              });
            }).catch(err=>{
              this.$message({
                message: 'IFI电话卡编辑失败',
                type: 'warning'
              });
            })
          }else {  // id 不存在表示新增
            this.$post(url,{
              destination: this.form.destination,  //目的地
              title: this.form.title,   //标题
              supplier: this.form.supplier,   //供应商
              price: this.form.price,   //价格
              detail: this.form.detail,   //描述
              getAddress: this.form.getAddress,   //取还地点
            }).then(res=>{
              this.$message({
                type: 'success',
                message: 'WIFI电话卡新增成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            },err=>{
              this.$message({
                message: 'IFI电话卡新增失败',
                type: 'warning'
              });
            }).catch(err=>{
              this.$message({
                message: 'IFI电话卡新增失败',
                type: 'warning'
              });
            })
          }
      },


      //获取表格数据
      getDataList(pageNum){
        this.$get('/wifyPhone/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          destination: this.formInline.destination ? this.formInline.destination : null,
        }).then(res=>{
          if(res.code == 0){
            this.total = res.data.total;

            this.tableData = res.data.list;
          }
        })
      },

      //新增用户
      handleAddUser(){
        this.dialogVisible = true;
        this.id = '';
        this.dialogTitle = '新增WIFI电话卡';


        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

      },




      //编辑表格单行内容
      handleEdit(row){

        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });


        this.dialogTitle = '编辑WIFI电话卡';

        this.id = row.id;

        //获取用户详情
        this.$get('/wifyPhone/selectById',{
          id: row.id
        }).then(res=>{
          if(res.code == 0){
            this.dialogVisible = true;
            this.form = res.data;
          }
        })
      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该WIFI电话卡, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/wifyPhone/deleteById',{
            id: row.id
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
</style>

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
  .el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
</style>
