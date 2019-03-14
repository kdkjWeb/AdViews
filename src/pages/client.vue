<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="姓名">
                  <el-input v-model="formInline.mbname" placeholder="请输入客户姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="formInline.phone" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                  <el-input v-model="formInline.idcard" placeholder="请输入身份证号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="addUser">
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增会员</el-button>
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

    <!-- start 弹出新增用户框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="70%">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="mbname">
                <el-input v-model="form.mbname" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="护照号" prop="passport">
                <el-input v-model="form.passport" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="咨询次数" prop="asks">
                <el-input v-model="form.asks" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="教育程度" prop="edu">
                <el-select v-model="form.edu" placeholder="请选择教育程度">
                  <el-option label="本科以上" value="本科以上"></el-option>
                  <el-option label="本科" value="本科"></el-option>
                  <el-option label="专科" value="专科"></el-option>
                  <el-option label="高中" value="高中"></el-option>
                  <el-option label="初中" value="初中"></el-option>
                  <el-option label="初中以下" value="初中以下"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否成单" prop="isdone">
                <el-select v-model="form.isdone" placeholder="请选择是否成单">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="兴趣爱好" prop="habbits">
                <el-input v-model="form.habbits" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成单次数" prop="dones">
                <el-input v-model="form.dones" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="年龄" prop="age">
                <el-input v-model="form.age" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="通讯地址" prop="addr">
                <el-input v-model="form.addr" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成单金额" prop="donemoney">
                <el-input v-model="form.donemoney" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期" prop="birth">
                <el-date-picker type="date" placeholder="请选择出生日期" v-model="form.birth" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="历史旅游目的地" prop="travel">
                <el-input v-model="form.travel" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="QQ号" prop="qq">
                <el-input v-model="form.qq" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="微信号" prop="weixin">
                <el-input v-model="form.weixin" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="星座" prop="star">
                <el-input v-model="form.star" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="form.idcard" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="mbId">
              <el-form-item label="创建日期" prop="cdate">
                <el-date-picker disabled="" type="date" placeholder="请选择创建日期" v-model="form.cdate" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="mbId">
              <el-form-item label="修改日期" prop="updatetime">
                <el-date-picker disabled="" type="date" placeholder="请选择修改日期" v-model="form.updatetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
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
    name: 'client',
    data(){

      return{
        dialogTitle: '新增会员',   //弹出框标题
        mbId: '',    //供应商id
        form: {
          mbname: '',  //姓名
          passport: '',   //护照号
          asks: '',   //咨询次数
          phone: '',   //手机号
          edu: '',   //教育程度
          isdone: '',   //是否成单
          gender: '',   //性别
          habbits: '',   //爱好
          dones: '',  //成单次数
          age: '',  //年龄
          addr: '',   //通讯地址
          donemoney: '',   //成单金额
          email: '',   //邮箱
          birth: '',  //出生日期
          travel: '',   //历史出游目的地
          qq: '',  //qq号
          star: '',   //星座
          weixin: '',  //微信号
          cdate: '',   //创建日期
          idcard: '',  //省份证号
          updatetime: '',   //修改日期
        },
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
          {prop: 'mbname', label: '姓名', width: '', align: ''},
          {prop: 'phone', label: '手机号', width: '', align: ''},
          {prop: 'gender', label: '性别', width: '', align: ''},
          {prop: 'age', label: '年龄', width: '', align: ''},
          {prop: 'cdate', label: '创建日期', width: '', align: ''},
          {prop: 'idcard', label: '身份证号', width: '', align: ''},
          {prop: 'qq', label: 'QQ号', width: '', align: ''},
          {prop: 'weixin', label: '微信号', width: '', align: ''},
          {prop: 'email', label: '邮箱', width: '', align: ''},
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

