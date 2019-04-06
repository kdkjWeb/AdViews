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
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增酒店</el-button>
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
              <el-form-item label="目的地" prop="destination">
                <el-input v-model="form.destination" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="酒店名称" prop="title">
                <el-input v-model="form.title" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入住日期" prop="stayTime">
                <el-date-picker
                  v-model="form.stayTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions0"
                  placeholder="选择入住日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退房日期" prop="leaveTime">
                <el-date-picker
                  v-model="form.leaveTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions1"
                  placeholder="选择退房日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="价格" prop="price">
                    <el-input v-model="form.price" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="星级" prop="level">
                    <el-select v-model="form.level" placeholder="请选择星级" clearable>
                      <el-option label="无级别" value="无级别"></el-option>
                      <el-option label="一星" value="一星"></el-option>
                      <el-option label="二星" value="二星"></el-option>
                      <el-option label="三星" value="三星"></el-option>
                      <el-option label="四星" value="四星"></el-option>
                      <el-option label="五星" value="五星"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="评分" prop="comment">
                    <el-input v-model="form.comment" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-form-item label="封面图" prop="userName">
                <el-upload
                  class="avatar-uploader"
                  :action="`${this.$store.state.baseUrl}/img/addFile`"
                  name="picture"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :show-file-list="false">
                  <img v-if="coverPath" :src="coverPath" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="交通" prop="traffic">
                <el-input v-model="form.traffic" clearable></el-input>
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
    name: 'Hotel',
    data(){
      return{
        dialogTitle: '新增机票',   //弹出框标题
        coverPath: '',
        id: '',    //用户id
        form: {
          destination: '',  //目的地
          title: '',   //酒店名称
          stayTime: '',
          leaveTime: '',
          price: '',   //价格
          level: '',   //星级
          comment: '',   //评分
          address: '',   //地址
          traffic: '',  //交通
          detail: '',   //描述
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
          {prop: 'title', label: '酒店名称', width: '', align: ''},
          {prop: 'stayTime', label: '入住时间', width: '', align: ''},
          {prop: 'leaveTime', label: '退房时间', width: '', align: ''},
          {prop: 'level', label: '星级', width: '', align: ''},
          {prop: 'price', label: '价格（元）', width: '', align: ''},
          {prop: 'comment', label: '评分', width: '', align: ''},
          {prop: 'crtTime', label: '创建时间', width: '', align: ''},
        ],
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.form.leaveTime) {
              return (
                time.getTime() > new Date(this.form.leaveTime).getTime() || time.getTime() < Date.now() - 8.64e7
              );
            } else {
              return time.getTime() < Date.now() - 8.64e7;
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.form.stayTime) {
              return (
                time.getTime() < Date.now() - 8.64e7 || time.getTime() < new Date(this.form.stayTime).getTime() - 8.64e7
              );
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        rules: {

        }

      }
    },
    methods: {

      handleAvatarSuccess(res, file) {
        if(res.code == 0){
          this.coverPath = res.data;
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG && !isPNG) {
          this.$message.error('请选择我们支持的格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过5MB!');
        }
        return (isJPG || isPNG) && isLt5M;
      },

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
        const url = this.id ? '/hotel/updateModel' : '/hotel/insertModel';

        if(this.id){   //存在id修改
          this.$put(url,{
            destination: this.form.destination,
            comment: this.form.comment,
            title: this.form.title,
            stayTime: this.form.stayTime,
            leaveTime: this.form.leaveTime,
            price: this.form.price,
            level: this.form.level,
            address: this.form.address,
            traffic: this.form.traffic,
            detail: this.form.detail,
            coverPath: this.coverPath,
            id: this.id
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '酒店修改成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '酒店修改失败',
              type: 'warning'
            });
          }).catch(err=>{
            err=>{
              this.$message({
                message: '酒店修改失败',
                type: 'warning'
              });
            }
          })
        }else {   //不存在id新增
          this.$post(url,{
            destination: this.form.destination,
            title: this.form.title,
            comment: this.form.comment,
            stayTime: this.form.stayTime,
            leaveTime: this.form.leaveTime,
            price: this.form.price,
            level: this.form.level,
            address: this.form.address,
            traffic: this.form.traffic,
            detail: this.form.detail,
            coverPath: this.coverPath,
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '酒店添加成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '酒店添加失败',
              type: 'warning'
            });
          }).catch(err=>{
            this.$message({
              message: '酒店添加失败',
              type: 'warning'
            });
          })
        }


      },


      //获取表格数据
      getDataList(pageNum){
        this.$get('/hotel/queryByRecord',{
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
        this.dialogTitle = '新增酒店';

        this.$refs.form.resetFields();
        this.coverPath = '';

      },




      //编辑表格单行内容
      handleEdit(row){
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

        this.dialogTitle = '编辑酒店';

        this.id = row.id;

        //获取用户详情
        this.$get('/hotel/selectById',{
          id: row.id
        }).then(res=>{
          console.log(res)
          if(res.code == 0){
            this.dialogVisible = true;

            this.form = res.data;
            this.coverPath = res.data.coverPath;
          }
        })
      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该酒店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/hotel/deleteById',{
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
