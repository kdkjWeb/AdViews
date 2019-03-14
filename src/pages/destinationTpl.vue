<template>
    <div>
      <!--start 热门目的地基本信息-->
        <div class="basicInfo">


          <el-form ref="form" :model="form" label-width="120px" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item label="目的地名称">
                  <el-input v-model="form.name" placeholder="请输入目的地名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目的地标题">
                  <el-input v-model="form.title" placeholder="请输入目的地标题"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="目的地描述">
                  <el-input type="textarea" v-model="form.desc" placeholder="请输入目的地描述"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="目的地图片">
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-form-item>
              </el-col>
            </el-row>

            </el-form>

        </div>
      <!--end 热门目的地基本信息-->

      <!--start 热门目的地模板-->
        <div class="famousWrap">
          <h1>热门景区</h1>

          <div class="famousList">
            <div class="famousItem">
              <h2>第一天</h2>

              <el-form ref="form" :model="form" label-width="120px" size="mini">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="景区名称">
                      <el-input v-model="form.name" placeholder="请输入景区名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="景区标题">
                      <el-input v-model="form.title" placeholder="请输入景区标题"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>



            </div>
          </div>
        </div>
      <!--end 热门目的地模板-->
    </div>
</template>

<script>



    export default {


        name: "destinationTpl",
        data() {
          return {
            form: {
              name: '',
              title: '',
              desc: ''
            },
            dialogImageUrl: '',
            dialogVisible: false,



          }
        },

        methods: {
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
          }
        }
    }
</script>

<style scoped>
.basicInfo{
  width: 1000px;
  margin: 0 auto;
}
.famousWrap{
  width: 1000px;
  margin: 0 auto;
}
.famousWrap h1{
  font-size: 30px;
  padding: 30px;
}


.famousItem{
  background: #fff;
  padding: 30px 50px 50px 0;
}
.famousItem h2{
  padding-left: 50px;
  font-size: 20px;
  padding-bottom: 20px;
}
</style>
