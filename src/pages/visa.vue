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
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增签证</el-button>
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
      width="50%">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="签证地" prop="destination">
                <el-input v-model="form.destination" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="送签地" prop="sendAddr">
                <el-input v-model="form.sendAddr" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="价格" prop="price">
                <el-input v-model="form.price" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签证类型" prop="visaType">
                <el-input v-model="form.visaType" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="办理时长" prop="processingTime">
                <el-input v-model="form.processingTime" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签证有效期" prop="expiryTime">
                <el-input v-model="form.expiryTime" clearable></el-input>
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
    name: 'visa',
    data(){
      return{
        dialogTitle: '新增签证',   //弹出框标题
        id: '',    //用户id
        form: {
          destination: '',  //签证地
          sendAddr: '',   //送签地
          price: '',   //价格
          visaType: '',   //签证类型
          processingTime: '',   //办理时长
          expiryTime: '',   //签证有效期
          title: '',   //标题
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
          {prop: 'destination', label: '签证地', width: '', align: ''},
          {prop: 'sendAddr', label: '送签地', width: '', align: ''},
          {prop: 'title', label: '标题', width: '', align: ''},
          {prop: 'visaType', label: '签证类型', width: '', align: ''},
          {prop: 'price', label: '价格', width: '', align: ''},
          {prop: 'crtTime', label: '价格', width: '', align: ''}
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
        var url = this.id ? '/visa/updateModel' : '/visa/insertModel';

        if(this.id){   //id存在  表示修改
          this.$put(url,{
            destination: this.form.destination,  //签证地
            sendAddr: this.form.sendAddr,   //送签地
            price: this.form.price,   //价格
            visaType: this.form.visaType,   //签证类型
            processingTime: this.form.processingTime,   //办理时长
            expiryTime: this.form.expiryTime,   //签证有效期
            title: this.form.title,   //标题
            id: this.id
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '签证编辑成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '签证编辑失败',
              type: 'warning'
            });
          }).catch(err=>{
            this.$message({
              message: '签证新增失败',
              type: 'warning'
            });
          })
        }else{   //id不存在  表示新增
          this.$post(url,{
            destination: this.form.destination,  //签证地
            sendAddr: this.form.sendAddr,   //送签地
            price: this.form.price,   //价格
            visaType: this.form.visaType,   //签证类型
            processingTime: this.form.processingTime,   //办理时长
            expiryTime: this.form.expiryTime,   //签证有效期
            title: this.form.title,   //标题
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '签证新增成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '签证新增失败',
              type: 'warning'
            });
          }).catch(err=>{
            this.$message({
              message: '签证新增失败',
              type: 'warning'
            });
          })
        }

      },


      //获取表格数据
      getDataList(pageNum){
        this.$get('/visa/queryByRecord',{
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
        this.dialogTitle = '新增签证';


        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

      },




      //编辑表格单行内容
      handleEdit(row){

        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

        this.dialogVisible = true;
        this.dialogTitle = '编辑签证';

        this.id = row.id;

        //获取用户详情
        this.$get('/visa/selectById',{
          id: row.id
        }).then(res=>{
          if(res.code == 0){

            this.form = res.data;
          }
        })
      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该签证, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/visa/deleteById',{
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
