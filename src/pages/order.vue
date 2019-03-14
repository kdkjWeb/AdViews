<template>
  <div class="order">
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="24">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="姓名">
                      <el-input v-model="formInline.orUsername" placeholder="请输入客户姓名" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="手机号">
                      <el-input v-model="formInline.orPhone" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="出发地">
                      <el-input v-model="formInline.origin" placeholder="请输入出发地" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="目的地">
                      <el-input v-model="formInline.destination" placeholder="请输入目的地" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>


                <el-row>
                  <el-col :span="18">
                    <el-form-item label="旅游时间">
                      <el-date-picker
                        v-model="formInline.time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <div class="addUser">
                      <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增</el-button>
                      <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">导出</el-button>
                    </div>
                  </el-col>
                </el-row>
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
      width="50%">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="70px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="orUsername">
                <el-input v-model="form.orUsername" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="orPhone">
                <el-input v-model="form.orPhone" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出发地" prop="origin">
                <el-input v-model="form.origin" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地" prop="destination">
                <el-input v-model="form.destination" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单类型" prop="orType">
                <el-select v-model="form.orType" placeholder="请选择订单类型">
                  <el-option label="个人定制" value="个人定制"></el-option>
                  <el-option label="公司定制" value="公司定制"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人数" prop="orPersons">
                <el-input v-model="form.orPersons" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出游类型" prop="playType">
                <el-select v-model="form.playType" placeholder="请选择出游类型">
                  <el-option label="亲子" value="亲子"></el-option>
                  <el-option label="朋友" value="朋友"></el-option>
                  <el-option label="情侣" value="情侣"></el-option>
                  <el-option label="家庭" value="家庭"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来访渠道" prop="channel">
                <el-select v-model="form.channel" placeholder="请选择来访渠道">
                  <el-option label="广告" value="广告"></el-option>
                  <el-option label="旅行社" value="旅行社"></el-option>
                  <el-option label="朋友圈" value="朋友圈"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开始时间" prop="beginPlayTime">
                <el-date-picker
                  v-model="form.beginPlayTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endPlayTime">
                <el-date-picker
                  v-model="form.endPlayTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
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
    name: 'order',
    data(){

      return{
        dialogTitle: '新增订单',   //弹出框标题
        mbId: '',    //供应商id
        form: {
          beginPlayTime: '',  //开始游玩时间
          endPlayTime: '',   //结束时间
          channel: '',   //来访渠道
          destination: '',   //目的地
          origin: '',  //出发地
          orUsername: '',   //姓名
          orPhone: '',  //电话
          orPersons: '',   //人数
          playType: '',  //出游类型
          orType: '',   //订单类型

        },
        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          destination: '',   //目的地
          origin: '',  //出发地
          orUsername: '',   //姓名
          orPhone: '',  //电话
          time: '',   //时间
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'orUsername', label: '姓名', width: '', align: ''},
          {prop: 'orType', label: '定制类型', width: '', align: ''},
          {prop: 'orPhone', label: '电话', width: '', align: ''},
          {prop: 'origin', label: '出发地', width: '', align: ''},
          {prop: 'destination', label: '目的地', width: '', align: ''},
          {prop: 'beginPlayTime', label: '开始时间', width: '', align: ''},
          {prop: 'endPlayTime', label: '结束时间', width: '', align: ''},
          {prop: 'orPersons', label: '人数', width: '', align: ''},
          {prop: 'playType', label: '出游类型', width: '', align: ''},
          {prop: 'channel', label: '来访渠道', width: '', align: ''},
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

          var url = this.mbId ? '/order/updateOrder' : '/order/addOrder'


          if (valid) {
            this.$post(url,{
              orUsername: this.form.orUsername,
              orPhone: this.form.orPhone,
              origin: this.form.origin,
              destination: this.form.destination,
              orPersons: this.form.orPersons,
              playType: this.form.playType,
              channel: this.form.channel,
              orType: this.form.orType,
              beginPlayTime: this.form.beginPlayTime,
              endPlayTime: this.form.endPlayTime,
              ordersid: this.mbId ? this.mbId : null
            }).then(res=>{
              console.log(res)

              this.dialogVisible = false;

              if(res.code == 0){
                this.$message({
                  message: this.mbId ? '编辑订单成功！' : '添加订单成功！',
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




      //获取表格数据
      getDataList(pageNum){

        console.log(this.formInline.time)
        this.$get('/order/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          destination: this.formInline.destination ? this.formInline.destination : null,
          origin: this.formInline.origin ? this.formInline.origin : null,
          orUsername: this.formInline.orUsername ? this.formInline.orUsername : null,
          orPhone: this.formInline.orPhone ? this.formInline.orPhone : null,
          beginPlayTime: this.formInline.time ? this.formInline.time[0] : null,
          endPlayTime: this.formInline.time ? this.formInline.time[0] : null,
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
        this.dialogTitle = '编辑订单';


        this.mbId = row.ordersid;

        if(this.mbId){
          this.$get('/order/queryById',{
            id: this.mbId
          }).then(res=>{
            console.log(res)
            if(res.code == 0){
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
          this.$get('/order/deleteById',{
            id: row.ordersid
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
  .order .el-date-editor{
    width: 100%;
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


