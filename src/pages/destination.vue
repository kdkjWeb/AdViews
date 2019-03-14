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
                  <el-input v-model="formInline.mbname" placeholder="请输入目的地" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="addUser">
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增热门目的地</el-button>
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
          @row-click="goClientDetails"
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
              <el-tag>成都</el-tag>
              <el-tag>重庆</el-tag>
              <el-tag>北京</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="创建时间"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
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



  </div>
</template>

<script>
  export default {
    name: 'destination',
    data(){

      return{
        dialogTitle: '新增会员',   //弹出框标题
        mbId: '',    //供应商id

        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          mbname: '',   //姓名
          phone: '',   //手机号
          idcard: ''   //身份证号
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'mbname', label: '中文目的地', width: '', align: ''},
          {prop: 'phone', label: '英文目的地', width: '', align: ''},
          {prop: 'gender', label: '标题', width: '', align: ''},
          {prop: 'age', label: '描述', width: '', align: ''},
        ],

        rules: {
          mbname: [
            { required: true, message: '请输入会员姓名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          /* addr: [
             { required: true, message: '请输入供应商地址', trigger: 'blur' },
             { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
           ],
           phone: [
             { required: true, message: '请输入供应商电话', trigger: 'blur' },
             { pattern: /^1[34578]\d{9}$/, message: '请输入合法的手机号' }
           ],
           qq: [
             // { required: true, message: '请输入供应商电话', trigger: 'blur' },
             { pattern: /^[1-9]\d{4,10}$/, message: '请输入合法的qq号' }
           ],
           weixin: [
             // { required: true, message: '请输入供应商电话', trigger: 'blur' },
             { pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, message: '请输入合法的微信号' }
           ],
           email: [
             // { required: true, message: '请输入供应商电话', trigger: 'blur' },
             { pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/, message: '请输入合法的邮箱' }
           ],
           goods: [
             { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
           ],
           price: [
             { pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/, message: '请输入大于0并且保留两位小数' }
           ],*/
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
        this.$refs[formName].validate((valid) => {

          var url = this.mbId ? '/member/updateMember' : '/member/addMember'


          if (valid) {
            this.$post(url,{
              mbname: this.form.mbname,
              passport: this.form.passport,
              asks: this.form.asks,
              phone: this.form.phone,
              edu: this.form.edu,
              isdone: this.form.isdone,
              gender: this.form.gender,
              habbits: this.form.habbits,
              dones: this.form.dones,
              age: this.form.age,
              addr: this.form.addr,
              donemoney: this.form.donemoney,
              email: this.form.email,
              birth: this.form.birth,
              travel: this.form.travel,
              qq: this.form.qq,
              star: this.form.star,
              weixin: this.form.weixin,
              cdate: this.form.cdate,
              idcard: this.form.idcard,
              update: this.form.updatetime,
              mbId: this.mbId ? this.mbId : null
            }).then(res=>{
              console.log(res)

              this.dialogVisible = false;

              if(res.code == 0){
                this.$message({
                  message: this.mbId ? '编辑会员成功！' : '添加会员成功！',
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
      },


      //查看会员详情
      goClientDetails(row){

        /*this.$router.push({
          name: 'clientDetails',
          params: {
            id: row.mbId
          }
        })*/

      },

      //获取表格数据
      getDataList(pageNum){
        this.$post('/member/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          mbname: this.formInline.mbname ? this.formInline.mbname : null,
          phone: this.formInline.phone ? this.formInline.phone : null,
          idcard: this.formInline.idcard ? this.formInline.idcard : null,
        }).then(res=>{
          if(res.code == 0){
            console.log(res)
            this.total = res.data.total;

            let arr = res.data.list;
            arr.forEach((e,index)=>{
              arr[index].status = e.status == 1 ? '启用' : '禁用'
            })

            this.tableData = JSON.parse(JSON.stringify(arr));
          }
        })
      },

      //新增供应商
      handleAddUser(){
        this.dialogVisible = true;
        this.mbId = '';
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

      },



      //编辑表格单行内容
      handleEdit(row){

        console.log(row)

        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

        this.dialogVisible = true;
        this.dialogTitle = '编辑会员';


        this.mbId = row.mbId;

        if(this.mbId){
          this.$get('/member/queryById',{
            id: this.mbId
          }).then(res=>{

            if(res.code == 0){
              res.data.gender = res.data.gender + '';
              res.data.isdone = res.data.isdone + '';
              this.form = res.data;
            }
          })
        }




      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get('/member/deleteById',{
            id: row.mbId
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

