<template>
    <div>
        <div class="container">
            <!-- 顶部搜索、新增用户 -->
            <div class="handle-box">
                <el-row>
                    <el-col :span="18">
                        <div>
                            <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                                <el-form-item label="用户名">
                                    <el-input v-model="formInline.user" placeholder="请输入用户名" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                                </el-form-item>
                                </el-form>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="addUser">
                            <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增用户</el-button>
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
                            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="text" icon="el-icon-setting" class="orange" @click="handlePassword(scope.row)">修改密码</el-button>
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
        width="30%">
        <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="70px" size="mini">
                <el-form-item label="用户名" prop="userName" v-if="isUserShow">
                    <el-input v-model="form.userName" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="isPwdShow">
                    <el-input v-model="form.password" type="password" clearable></el-input>
                </el-form-item>

                <el-form-item v-if="isPwdShow">
                  <p class="pwdNotice"><span>提示：</span>密码必须包含不少于8位的大小写字母、数字和特殊字符且不能包含用户名</p>
                </el-form-item>

                <el-form-item label="确认密码" prop="sussesspwd" v-if="isPwdShow">
                  <el-input v-model="form.sussesspwd" type="password" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role" v-if="isUserShow">
                    <el-select v-model="form.role" placeholder="请选择用户角色" clearable>
                    <el-option :label="item.rname" :value="item.rId" v-for="item in roleList" :key="item.rId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status" v-if="isUserShow">
                    <el-select v-model="form.status" placeholder="请选择用户状态" clearable>
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
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
    name: 'user',
    data(){

        var checkUserName = (rule, value, callback) => {
          var regUserName = /^[\w]{3,20}$/;

          if (!value) {
            return callback(new Error('用户名不能为空'));
          }else if(!(regUserName.test(value))){
            return callback(new Error('用户名只能是3到20位的数字、字母、下划线'));
          }else {
            callback();
          }
        };

        var validatePass = (rule, value, callback) => {
          //验证密码必须同时包含不少于8位的大小写字母、数字和特殊字符且不能包含用户名
          // var regPassword = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&*()_+-<>=|?:"{},，.\/;'[\]])[\da-zA-Z`~!@#$%^&*()_+-<>=|?:"{},，.\/;'[\]]{8,20}$/;

          var regPassword = /^(?![A-Za-z0-9]+$)(?![a-z0-9\，\~\`\!\#\%\^\*\(\)\_\-\+\=\|\\\}\]\{\[\:\;\"\'\?\/\.]+$)(?![A-Za-z\，\~\`\!\#\%\^\*\(\)\_\-\+\=\|\\\}\]\{\[\:\;\"\'\?\/\.]+$)(?![A-Z0-9\，\~\`\!\#\%\^\*\(\)\_\-\+\=\|\\\}\]\{\[\:\;\"\'\?\/\.]+$)[a-zA-Z0-9\，\~\`\!\#\%\^\*\(\)\_\-\+\=\|\\\}\]\{\[\:\;\"\'\?\/\.]{8,}$/;

          if (value === '') {
            callback(new Error('请输入密码'));
          }else if(!(regPassword.test(value))){
            return callback(new Error('密码必须同时包含大小写字母、数字和特殊字符且不能少于8位'));
          }else if(value.includes(this.form.userName)){
            return callback(new Error('密码不能包含用户名'));
          } else {

            if (this.form.sussesspwd !== '') {
              this.$refs.form.validateField('sussesspwd');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };

        var validateRole = (rule,value,callback)=>{
          if (value === '') {
            callback(new Error('请选择用户角色'));
          }else {
            callback();
          }
        };

        var validateStatus = (rule,value,callback)=>{

          console.log(value)
          if (value === '') {
            callback(new Error('请选择用户状态'));
          }else {
            callback();
          }
        };



        return{
            dialogTitle: '新增用户',   //弹出框标题
            isPwdShow: false,
            isUserShow: false,
            userId: '',    //用户id
            form: {
                userName: '',  //用户名
                password: '',   //密码
                sussesspwd: '',   //确认密码
                role: '',   //角色
                status: ''   //状态
            },
            dialogVisible: false,  //是否显示遮罩层
            currentPage: 1, //当前第几页
            pageSize: 20,   //每页显示多少条
            total: 0,   //总共多少条数据
            formInline: {   //查询输入框数据
                user: ''
            },
            tableData: [],   //表格数据
            roleList: [],   //角色列表
            tableList: [   //表格的头部配置
                {prop: 'account', label: '用户名', width: '', align: ''},
                {prop: 'role', label: '角色', width: '', align: ''},
                {prop: 'cdate', label: '创建时间', width: '', align: ''},
                {prop: 'status', label: '状态', width: '', align: ''},
            ],

            rules: {
              userName: [
                { validator: checkUserName, trigger: 'blur' }
              ],
              password: [
                { validator: validatePass, trigger: 'blur' }
              ],
              sussesspwd: [
                { validator: validatePass2, trigger: 'blur' }
              ],
              role: [
                { validator: validateRole, trigger: 'change' }
              ],
              status: [
                { validator: validateStatus, trigger: 'change' }
              ]
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

          if(this.isPwdShow && (!this.isUserShow) && this.userId){   //修改密码
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$get('manager/updatePwd',{
                  id: this.userId,
                  pwd: this.form.password
                }).then(res=>{
                  if(res.code == 0){
                    this.dialogVisible = false;
                    this.$message({
                      message: '修改密码成功！',
                      type: 'success'
                    });
                  }
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            })
          }else {    //新增用户、修改用户    如果存在id就是修改用户否则就是新增用户
            var url = this.userId ? 'manager/updateManager' : 'manager/addManager';

            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$post(url,{
                  mgId: this.userId ? this.userId : null,
                  account: this.form.userName,
                  addPwd: this.form.password ? this.form.password : null,
                  rId: this.form.role,
                  status: this.form.status
                }).then(res=>{

                  if(res.code == 0){
                    this.dialogVisible = false;

                    this.$message({
                      message: this.userId ? '修改用户成功' : '新增用户成功',
                      type: 'success'
                    });

                    this.getDataList();

                  }
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          }




          // this.dialogVisible = false;
        },


        //获取表格数据
        getDataList(pageNum){
          this.$get('manager/queryByRecord',{
            pageSize: this.pageSize,
            pageNum: pageNum ? pageNum : 1,
            account: this.formInline.user ? this.formInline.user : null,
          }).then(res=>{
              if(res.code == 0){
                this.total = res.data.total;

                let arr = res.data.list;
                arr.forEach((e,index)=>{
                  arr[index].status = e.status == 1 ? '启用' : '禁用'
                })

                this.tableData = JSON.parse(JSON.stringify(arr));
              }
          })
        },

        //新增用户
        handleAddUser(){
            this.dialogVisible = true;
            this.isPwdShow = true;
            this.isUserShow = true;
            this.userId = '';
            /*this.form.userName = '';
            this.form.role = '';
            this.form.status = '';
            this.form.password = '';
            this.form.sussesspwd = '';*/


          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });

        },


        //修改密码
        handlePassword(row){


          this.dialogVisible = true;
          this.dialogTitle = '修改密码';
          this.isPwdShow = true;
          this.isUserShow = false;
          this.form.userName = row.account;
          this.userId = row.mgId;

          this.form.password = '';
          this.form.sussesspwd = '';

          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          });


        },

        //编辑表格单行内容
        handleEdit(row){

          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });

            this.dialogVisible = true;
            this.dialogTitle = '编辑用户';
            this.isPwdShow = false;
            this.isUserShow = true;

            this.userId = row.mgId;

            //获取用户详情
            this.$get('manager/queryById',{
                id: row.mgId
            }).then(res=>{
              if(res.code == 0){

                this.form.userName = res.data.account;
                this.form.password = res.data.pwd;
                this.form.sussesspwd = res.data.pwd;
                this.form.role = res.data.rId;
                this.form.status = res.data.status + '';
              }
            })
        },

        //删除表格某一行
        handleDelete(row){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                  this.$get('manager/deleteById',{
                    id: row.mgId
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

        //获取角色列表
        getRoleList(){
          this.$get('role/queryByRecord',{
            pageSize: 0,
          }).then(res=>{
            if(res.code == 0){
              this.roleList = res.data.list;
            }
          })
        }
    },
    mounted(){
      //获取表格数据
      this.getDataList();

      //获取角色列表
      this.getRoleList();
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
