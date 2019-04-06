<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="出发地">
                  <el-input v-model="formInline.startPlace" placeholder="请输入出发地" clearable></el-input>
                </el-form-item>
                <el-form-item label="目的地">
                  <el-input v-model="formInline.endPlace" placeholder="请输入目的地" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="addUser">
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增机票</el-button>
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
              <el-form-item label="出发地" prop="startPlace">
                <el-input v-model="form.startPlace" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地" prop="endPlace">
                <el-input v-model="form.endPlace" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起飞时间" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="handelStartTime"
                  placeholder="选择起飞时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="降落时间" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择起飞时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起飞日期" prop="queryTime">
                <el-date-picker
                  v-model="form.queryTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择起飞日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="舱位类型" prop="cabin">
                <el-select v-model="form.cabin" placeholder="请选择舱位类型" clearable>
                  <el-option label="经济舱" value="经济舱"></el-option>
                  <el-option label="商务舱" value="商务舱"></el-option>
                  <el-option label="头等舱" value="头等舱"></el-option>
                  <el-option label="超级经济舱" value="超级经济舱"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起飞机场" prop="startAirport">
                <el-input v-model="form.startAirport" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="降落机场" prop="endAirport">
                <el-input v-model="form.endAirport" clearable></el-input>
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
              <el-form-item label="航空公司" prop="companyName">
                <el-input v-model="form.companyName" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="航班号" prop="flightNumber">
                <el-input v-model="form.flightNumber" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机型" prop="aircraftType">
                <el-input v-model="form.aircraftType" clearable></el-input>
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
    name: 'AirTickets',
    data(){

      var checkStarTime = (rule,value,callback)=>{
        if (value === '') {
          callback(new Error('请选择起飞时间'));
        }else {
          const timestamp = (new Date()).getTime()

          let date = value;
          date = new Date(Date.parse(date.replace(/-/g, "/")));
          date = date.getTime();

          if(date < timestamp && (timestamp - date) > 1500){
            return callback(new Error('起飞时间不能小于当前时间'));
          }

        }
      };

      var checkEndTime = (rule,value,callback)=>{
        if (value === '') {
          callback(new Error('请选择降落时间'));
        }else {
          // const timestamp = (new Date()).getTime()

          console.log(value)

          let date = value;
          date = new Date(Date.parse(date.replace(/-/g, "/")));
          date = date.getTime();



          let startDate = this.form.startTime;
          startDate = new Date(Date.parse(startDate.replace(/-/g, "/")));
          startDate = startDate.getTime();

          console.log(date,startDate)

          if(date < startDate){
            return callback(new Error('降落时间不能小于起飞时间'));
          }

        }
      };


      return{
        dialogTitle: '新增机票',   //弹出框标题
        id: '',    //用户id
        form: {
          startPlace: '',  //出发地
          endPlace: '',   //目的地
          startTime: '',   //起飞时间
          endTime: '',   //降落时间
          cabin: '',   //舱位类型
          queryTime: '',   //起飞日期
          startAirport: '',   //起飞机场
          endAirport: '',   //降落机场
          price: '',   //价格
          companyName: '',   //航空公司
          flightNumber: '',  //航班号
          aircraftType: '',  //机型
        },
        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          startPlace: '',
          endPlace: ''
        },
        tableData: [],   //表格数据
        roleList: [],   //角色列表
        tableList: [   //表格的头部配置
          {prop: 'startPlace', label: '出发地', width: '', align: ''},
          {prop: 'endPlace', label: '目的地', width: '', align: ''},
          {prop: 'queryTime', label: '起飞日期', width: '', align: ''},
          {prop: 'startTime', label: '起飞时间', width: '', align: ''},
          {prop: 'endTime', label: '降落时间', width: '', align: ''},
          {prop: 'crtTime', label: '创建时间', width: '', align: ''},
          {prop: 'price', label: '价格', width: '', align: ''},

        ],
        rules: {
          startTime: [
            { validator: checkStarTime, trigger: 'blur', required: false}
          ],
          endTime: [
            { validator: checkEndTime, trigger: 'blur', required: false}
          ],
        }

      }
    },
    methods: {
      //验证起飞时间
      handelStartTime(){
        console.log(this.form.startTime)
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
        const url = this.id ? '/flight/updateModel' : '/flight/insertModel';
        if(this.id){   //id存在就是修改
          this.$put(url,{
            startPlace: this.form.startPlace,  //出发地
            endPlace: this.form.endPlace,   //目的地
            startTime: this.form.startTime,   //起飞时间
            endTime: this.form.endTime,   //降落时间
            cabin: this.form.cabin,   //舱位类型
            queryTime: this.form.queryTime,   //起飞日期
            startAirport: this.form.startAirport,   //起飞机场
            endAirport: this.form.endAirport,   //降落机场
            price: this.form.price,   //价格
            companyName: this.form.companyName,   //航空公司
            flightNumber: this.form.flightNumber,  //航班号
            aircraftType: this.form.aircraftType,  //机型
            id: this.id
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '机票编辑成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '机票编辑失败',
              type: 'warning'
            });
          }).catch(err=>{
            this.$message({
              message: '机票编辑失败',
              type: 'warning'
            });
          })
        }else {   //id不存在就是新增
          this.$post(url,{
            startPlace: this.form.startPlace,  //出发地
            endPlace: this.form.endPlace,   //目的地
            startTime: this.form.startTime,   //起飞时间
            endTime: this.form.endTime,   //降落时间
            cabin: this.form.cabin,   //舱位类型
            queryTime: this.form.queryTime,   //起飞日期
            startAirport: this.form.startAirport,   //起飞机场
            endAirport: this.form.endAirport,   //降落机场
            price: this.form.price,   //价格
            companyName: this.form.companyName,   //航空公司
            flightNumber: this.form.flightNumber,  //航班号
            aircraftType: this.form.aircraftType,  //机型
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '机票添加成功!'
              });
              this.dialogVisible = false;
              this.getDataList();
            }
          },err=>{
            this.$message({
              message: '机票添加失败',
              type: 'warning'
            });
          }).catch(err=>{
            err=>{
              this.$message({
                message: '机票添加失败',
                type: 'warning'
              });
            }
          })
        }
      },


      //获取表格数据
      getDataList(pageNum){
        this.$get('/flight/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          startPlace: this.formInline.startPlace ? this.formInline.startPlace : null,
          endPlace: this.formInline.endPlace ? this.formInline.endPlace : null,
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
        this.dialogTitle = '新增机票';


        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

      },




      //编辑表格单行内容
      handleEdit(row){

        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });

        this.dialogTitle = '编辑机票';


        this.id = row.id;

        //获取用户详情
        this.$get('/flight/selectById',{
          id: row.id
        }).then(res=>{
          if(res.code == 0){

            this.form = res.data;

            this.dialogVisible = true;

          }
        })
      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该机票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('/flight/deleteById',{
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
