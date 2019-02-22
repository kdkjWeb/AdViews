<template>
  <div>
    <div class="container">
      <!-- 顶部搜索、新增用户 -->
      <div class="handle-box">
        <el-row>
          <el-col :span="18">
            <div>
              <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
                <el-form-item label="供应商名称">
                  <el-input v-model="formInline.spname" placeholder="请输入供应商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="formInline.addr" placeholder="请输入地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="货品信息">
                  <el-input v-model="formInline.goods" placeholder="请输入货品信息" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="addUser">
              <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddUser">新增供应商</el-button>
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
      width="30%">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="供应商名称" prop="spname">
            <el-input v-model="form.spname" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="addr">
            <el-input v-model="form.addr" clearable></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="form.qq" clearable></el-input>
          </el-form-item>
          <el-form-item label="微信号" prop="weixin">
            <el-input v-model="form.weixin" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="货品信息" prop="goods">
            <el-input v-model="form.goods" clearable></el-input>
          </el-form-item>
          <el-form-item label="货价" prop="price">
            <el-input v-model="form.price" clearable></el-input>
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

      return{
        dialogTitle: '新增供应商',   //弹出框标题
        spId: '',    //供应商id
        form: {
          spname: '',  //供应商名称
          addr: '',   //地址
          phone: '',   //电话
          qq: '',   //qq
          weixin: '',   //微信号
          email: '',   //邮箱
          goods: '',   //货品信息
          price: ''   //货价
        },
        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 20,   //每页显示多少条
        total: 0,   //总共多少条数据
        formInline: {   //查询输入框数据
          addr: '',
          spname: '',
          goods: ''
        },
        tableData: [],   //表格数据
        tableList: [   //表格的头部配置
          {prop: 'spname', label: '供应商名称', width: '', align: ''},
          {prop: 'addr', label: '地址', width: '', align: ''},
          {prop: 'phone', label: '电话', width: '', align: ''},
          {prop: 'qq', label: 'QQ', width: '', align: ''},
          {prop: 'weixin', label: '微信号', width: '', align: ''},
          {prop: 'email', label: '邮箱', width: '', align: ''},
          {prop: 'goods', label: '货品信息', width: '', align: ''},
          {prop: 'price', label: '货价', width: '', align: ''},
        ],

        rules: {
          spname: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          addr: [
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
          ],
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

          var url = this.spId ? '/supplier/updateSupplier' : '/supplier/addSupplier'


          if (valid) {
            this.$post(url,{
              spname: this.form.spname,
              addr: this.form.addr,
              phone: this.form.phone,
              qq: this.form.qq,
              weixin: this.form.weixin,
              email: this.form.email,
              goods: this.form.goods,
              price: this.form.price,
              spId: this.spId ? this.spId : null
            }).then(res=>{
                console.log(res)

                this.dialogVisible = false;

                if(res.code == 0){
                    this.$message({
                      message: this.spId ? '编辑供应商成功！' : '添加供应商成功！',
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
        this.$post('supplier/queryByRecord',{
          pageSize: this.pageSize,
          pageNum: pageNum ? pageNum : 1,
          addr: this.formInline.addr ? this.formInline.addr : null,
          goods: this.formInline.goods ? this.formInline.goods : null,
          spname: this.formInline.spname ? this.formInline.spname : null,
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
        this.spId = '';
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
        this.dialogTitle = '编辑供应商';


        this.spId = row.spId;

        if(this.spId){
            this.$get('/supplier/queryById',{
              id: this.spId
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

