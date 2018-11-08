<template>
    <div class="hotel">
      <!--start 表格-->
      <el-table
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="handelRowClick">
        <el-table-column
          prop="title"
          label="旅舍名称"
          width="120"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="addr"
          label="旅舍地址"
          width="150"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          width="120"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="des"
          label="旅舍简介"
          width="200"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          label="房间类型"
          align="center">
          <template slot-scope="scope">
            <el-tag style="margin: 0 2px;" v-for="item,index in scope.row.roomType" :key="index">{{item.str}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="房间图片"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.multiples != undefined" type="text" @click.stop="lookPic(scope.row.multiples)">查看大图</el-button>
            <el-button v-else type="text">暂无图片</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="deadline"
          label="到期时间"
          width="100"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          label="广告状态"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status == -1">已删除</el-tag>
            <el-tag type="success" v-if="scope.row.status == 0">正在使用</el-tag>
            <el-tag type="info" v-if="scope.row.status == 1">已禁用</el-tag>
            <el-tag type="warning" v-if="scope.row.status == 2">已到期</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--end 表格-->

      <!--start 查看图片轮播图-->
      <el-dialog
        title="图片详情"
        :visible.sync="dialogVisible"
        width="40%">
        <div>
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item,index in imgList" :key="index">
              <img :src="item.str" alt="">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-dialog>
      <!--end 查看图片轮播图-->

    </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
        name: "Index",
        data() {
          return {
            tableData: [],
            dialogVisible: false,
            imgList: [],
          }
        },
        methods: {
            //获取商家旅舍信息列表
            getDataList(){
              this.$get('pyweb/ad/queryHostelList',{
                id: this.getUserInfo.id,
                pageSize: 0
              }).then(res=>{
                if (res.code === 0){
                  this.tableData = res.data;
                }
              })
            },

            //查看大图
            lookPic(val){
              this.dialogVisible = true;
              //保存所有图片
              this.imgList = val;
            },

            //点击某一行
            handelRowClick(row, event, column){
               console.log(row, event, column)

                this.$router.push({
                  name: 'chartDetails',
                  query: {
                    id: row.id
                  }
                })
            }
        },
      created() {
          //获取商家旅舍列表
          this.getDataList();
      },
      computed:{
        ...mapGetters(['getUserInfo'])
      },
    }
</script>



<style scoped>
.hotel .el-carousel__item img{
  width: 100%;
}

</style>
