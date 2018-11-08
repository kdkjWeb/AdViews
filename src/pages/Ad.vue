<template>
    <div class="ad">
      <!--start 表格-->
      <el-table
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="handelRowClick">
        <el-table-column
          prop="title"
          label="广告名称"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          label="广告类型"
          align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detailType == 3">列表广告</el-tag>
            <el-tag v-else-if="scope.row.detailType == 2">启动页</el-tag>
            <el-tag v-else>轮播图</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="我的图片"
          align="center">
          <template slot-scope="scope">
            <a  v-if="scope.row.url" @click.stop="lookPic(scope.row.url)">查看大图</a>
            <a v-else href="javascript:;">暂无图片</a>
          </template>
        </el-table-column>
        <el-table-column
          label="我的网站"
          align="center">
          <template slot-scope="scope">
            <a  v-if="scope.row.detail" @click.stop="lookUrl(scope.row.detail)">查看网站</a>
            <a v-else href="javascript:;">暂无网站</a>
          </template>
        </el-table-column>
        <el-table-column
          label="广告状态"
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
    </div>
</template>

<script>
  import {mapGetters} from "vuex";


  export default {
        name: "Ad",
        data() {
          return {
            tableData: []
          }
        },
        methods: {
          /**
           * 获取商家广告列表
           */
          getDataList(){
            this.$get('pyweb/ad/queryAdvertisingList',{
              id: this.getUserInfo.id,
              pageSize: 0
            }).then(res=>{
              if (res.code === 0){
                console.log(res)
                this.tableData = res.data;
              }
            })
          },

          //查看网站
          lookUrl(href){
            window.open(href, '_blank');
          },

          //查看图片
          lookPic(href){
            window.open(href, '_blank');
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
          //获取商家广告列表
          this.getDataList();
        },
        computed: {
          ...mapGetters(['getUserInfo'])
        }
    }
</script>



<style scoped>
  .ad a{
    cursor: pointer;
    color: #409EFF;
  }
</style>
