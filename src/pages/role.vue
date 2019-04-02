<template>
    <div>
      <div class="container">
        <!-- 顶部搜索、新增用户 -->
        <div class="handle-box addUser">
          <el-button size="mini" type="primary" class="handle-del mr10" @click="handleAddRole">新增角色</el-button>
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
        top="30vh"
        :visible.sync="dialogVisible"
        width="30%">
        <div>
          <el-form ref="form" :model="form" :rules="rules" label-width="65px" size="mini">
            <el-form-item label="角色名" prop="roleName">
              <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="des">
              <el-input type="textarea" v-model="form.des"></el-input>
            </el-form-item>
            <el-form-item label="菜单">
              <el-tree
                :data="treeList"
                show-checkbox
                node-key="id"
                ref="tree"
                accordion
                highlight-current
                :props="defaultProps">
              </el-tree>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancle">取 消</el-button>
            <el-button type="primary" @click="handleComfirm('form')">保 存</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'role',
    data(){
      return{
        dialogTitle: '新增角色',
        rowId: '',   //修改这行的 id
        checkArr: [],   //以前选中的数组
        treeList: [],
        defaultProps: {
          children: 'childList',
          label: 'muname'
        },
        form: {
          roleName: '',
          des: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          des: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ],
        },
        dialogVisible: false,  //是否显示遮罩层
        currentPage: 1, //当前第几页
        pageSize: 30,   //每页显示多少条
        total: 0,   //总共多少条数据
        tableData: [],
        tableList: [   //表格的头部配置
          {prop: 'rname', label: '角色名', width: '', align: ''},
          {prop: 'rdesc', label: '描述', width: '', align: ''},
          {prop: 'cdate', label: '创建时间', width: '', align: ''}
        ],
      }
    },
    methods: {




      //新增角色
      handleAddRole(){
        this.dialogTitle = '新增角色';
        this.dialogVisible = true;
       /* this.form.roleName = '';
        this.form.des = '';*/
        this.rowId = '';


        this.$nextTick(function() {
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.form.resetFields();

        })
      },

      //编辑表格单行内容
      handleEdit(row){
        console.log(row)

        this.dialogTitle = '编辑角色';
        this.dialogVisible = true;

        this.form.roleName = row.rname;
        this.form.des = row.rdesc;




        if(row.hasOwnProperty('menuJson') && row.menuJson.length > 0){
          this.$nextTick(function() {
            this.checkArr = row.menuJson.split(',');

            this.$refs.tree.setCheckedKeys(this.checkArr)

          })
        }

        this.rowId = row.rId;

        console.log(this.rowId)
      },

      //删除表格某一行
      handleDelete(row){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          console.log(row)

          this.$get('role/deleteById',{
            id: row.rId
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getRoleList();
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
        this.getRoleList(this.currentPage);
      },

      //点击弹出框的取消按钮
      handleCancle(){
        this.dialogVisible = false;
      },

      //点击弹出框的确认按钮
      handleComfirm(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {

            // var arr = this.getCheckedKeys(this.treeList, this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()));


            var arr = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());

            if(arr.length <= 0){
              this.$message({
                message: '请选择该角色对应的操作菜单',
                type: 'warning'
              });
              return;
            }

            var url = this.rowId ? 'role/updateRole' : 'role/addRole'

            this.$post(url,{
              rname: this.form.roleName,
              rdesc: this.form.des,
              menuJson: arr.join(','),
              rId: this.rowId ? this.rowId : null
            }).then(res=>{
              if(res.code == 0){
                this.$message({
                  type: 'success',
                  message: this.rowId ? '编辑角色成功!' : '新增角色成功!'
                });
                this.dialogVisible = false;
                this.getRoleList();
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });


        // this.dialogVisible = false;



      },



      //获取角色列表
      getRoleList(pageNum){
        this.$get('role/queryByRecord',{
            pageSize: this.pageSize,
            pageNum: pageNum ? pageNum : 1,
        }).then(res=>{
            if(res.code == 0){
              this.tableData = res.data.list;
              this.total = res.data.total;
            }
        })
      },

      //获取菜单
      getMenList(){
        this.$get('manager/queryMenus',{}).then(res=>{
          console.log(res)

          if(res.code == 0){
            this.treeList = res.data;

            console.log(this.treeList)
          }
        })
      }
    },

    mounted(){
      //获取角色列表
      this.getRoleList();

      //获取菜单列表
      this.getMenList();
    }
  }
</script>




<style scoped>
  .addUser{
    text-align: right;
    padding-bottom: 20px;
  }
  .red{
    color: #ff0000;
  }
  .el-select{
    width: 100%;
  }
</style>

