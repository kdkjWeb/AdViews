<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="机场地址">
                  <el-input v-model="formInline.airport" placeholder="请输入机场地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="酒店地址">
                  <el-input v-model="formInline.address" placeholder="请输入机场地址" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="addUser">
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增接送机</el-button>
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
              <el-form-item label="机场地址" prop="airport">
                <el-input v-model="form.airport" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="酒店地址" prop="address">
                <el-input v-model="form.address" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车种类" prop="carLable">
                <el-input v-model="form.carLable" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车型" prop="carType">
                <el-input v-model="form.carType" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplier">
                <el-input v-model="form.supplier" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="价格" prop="price">
                <el-input v-model="form.price" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="司机服务" prop="service">
                <el-input v-model="form.service" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接机类型" prop="queryType">
                <el-select v-model="form.queryType" placeholder="请选择接机类型" clearable>
                  <el-option label="接机" value="1"></el-option>
                  <el-option label="送机" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="接送机日期" prop="queryDate">
                <el-date-picker
                  v-model="form.queryDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  placeholder="请选择接送机日期">
                </el-date-picker>
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
    name: 'Transfer',
    data(){
      return{
        dialogTitle: '新增接送机',   //弹出框标题
        id: '',    //用户id
        form: {
          airport: '',  //机场地址
          address: '',   //酒店地址
          carLable: '',   //车种类
          carType: '',   //车型
          supplier: '',   //供应商
          price: '',   //价格
          service: '',   //司机服务
          queryType: '',   //接机类型
          queryDate: '',   //接送机日期
        },
        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          airport: '',
          address: ''
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'airport', label: '机场地址', width: '', align: ''},
          {prop: 'queryType', label: '接送机类型', width: '', align: ''},
          {prop: 'address', label: '酒店地址', width: '', align: ''},
          {prop: 'carLable', label: '车种类', width: '', align: ''},
          {prop: 'carType', label: '车型', width: '', align: ''},
          {prop: 'supplier', label: '供应商', width: '', align: ''},
          {prop: 'price', label: '价格（元/辆）', width: '', align: ''},
          {prop: 'crtTime', label: '创建时间', width: '', align: ''},
        ],
        rules: {

        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
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

        var url = this.id ? '/pickUp/updateModel' : '/pickUp/insertModel';

        if(this.id){   //id存在  表示修改
          this.$put(url,{
            airport: this.form.airport,  //机场地址
            address: this.form.address,   //酒店地址
            carLable: this.form.carLable,   //车种类
            carType: this.form.carType,   //车型
            supplier: this.form.supplier,   //供应商
            price: this.form.price,   //价格
            service: this.form.service,   //司机服务
            queryType: this.form.queryType,   //接机类型
            queryDate: this.form.queryDate,   //接送机日期
            id: this.id
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '接送机编辑成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '接送机编辑失败',
              type: 'warning'
            });
          }).catch(err=>{
            this.$message({
              message: '接送机编辑失败',
              type: 'warning'
            });
          })
        }else {   //id不存在   表示新增
          this.$post(url,{
            airport: this.form.airport,  //机场地址
            address: this.form.address,   //酒店地址
            carLable: this.form.carLable,   //车种类
            carType: this.form.carType,   //车型
            supplier: this.form.supplier,   //供应商
            price: this.form.price,   //价格
            service: this.form.service,   //司机服务
            queryType: this.form.queryType,   //接机类型
            queryDate: this.form.queryDate,   //接送机日期
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '接送机新增成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '接送机新增失败',
              type: 'warning'
            });
          }).catch(err=>{
            this.$message({
              message: '接送机新增失败',
              type: 'warning'
            });
          })
        }

      },


      //获取表格数据
      getDataList(pageNum){
        this.$get('/pickUp/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          airport: this.formInline.airport ? this.formInline.airport : null,
          address: this.formInline.address ? this.formInline.address : null,
        }).then(res=>{
          if(res.code == 0){
            this.total = res.data.total;

            let arr = res.data.list;
            arr.forEach((e,index)=>{
              arr[index].queryType = e.queryType == 1 ? '接机' : '送机'
            })

            this.tableData = JSON.parse(JSON.stringify(arr));
          }
        })
      },

      //新增用户
      handleAddUser(){
        this.dialogVisible = true;
        this.id = '';
        this.dialogTitle = '新增接送机';

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
        this.dialogTitle = '编辑接送机';

        this.id = row.id;

        //获取用户详情
        this.$get('/pickUp/selectById',{
          id: row.id
        }).then(res=>{
          if(res.code == 0){


            this.form = res.data;
            this.form.queryType = res.data.queryType + '';
          }
        })
      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该接送机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/pickUp/deleteById',{
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
