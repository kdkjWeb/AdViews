<template>
    <div>
        <el-row :gutter="20">
            
            <el-col :span="24">
               
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                    </div>
                    <el-table :data="todoList" :show-header="false" max-height="404" style="width: 100%;font-size:14px;">
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                    </el-table>

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

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
            return {
                currentPage: 1, //当前第几页
                pageSize: 30,   //每页显示多少条
                total: 1000,   //总共多少条数据
                name: localStorage.getItem('ms_username'),
                todoList: [{
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false,
                    }, {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: true,
                    }
                ]
               
            }
        },
        
        methods: {
            //当前第几页
            handleCurrentChange(val) {
                this.currentPage = val;
                // this.getCircleList(this.pageSize,val)
            },
        },

}
</script>

<style>

</style>
