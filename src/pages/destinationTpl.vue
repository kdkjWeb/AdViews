<template>
    <div>
      <!--start 热门目的地基本信息-->
        <div class="basicInfo">


          <el-form ref="form" :model="form" label-width="120px" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item label="目的地名称">
                  <!--<el-input v-model="form.name" placeholder="请输入目的地名称"></el-input>-->
                  <el-select v-model="form.country" clearable placeholder="请选择国家" @change="changeCountry()">
                    <el-option
                      v-for="item in countryList"
                      :key="item.nationid"
                      :label="item.nationname"
                      :value="item.nationid">
                    </el-option>
                  </el-select>
                  <el-select v-model="form.city" clearable placeholder="请选择城市">
                    <el-option
                      v-for="item in cityList"
                      :key="item.cityid"
                      :label="item.cityname"
                      :value="item.cityid">
                    </el-option>
                  </el-select>
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
                    :action="`${this.$store.state.baseUrl}/img/addFile`"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    name="picture"
                    :limit="6"
                    :file-list="showImgList"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    :on-exceed="handleExceed">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <i>只支持jpg/png类型，且不超过5M</i>
                  <!--<div slot="tip" class="el-upload__tip">只支持jpg/png类型，且不超过2M</div>-->
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

            <!--start  景区每天描述-->
            <div class="famousItem" v-for="item,index in famousList" :key="index">
              <h2 class="day">第{{index+1}}个</h2>

              <!--ref="form" :model="form" -->
              <el-form label-width="120px" size="mini">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="景区名称">
                      <el-input v-model="item.title" placeholder="请输入景区名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="景区标题">
                      <el-input v-model="item.subtitle" placeholder="请输入景区标题"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <div class="editor">
                <h2>请输入景区描述</h2>
                <vue-editor
                  useCustomImageHandler
                  @imageAdded="handleImageAdded" v-model="item.spotDesc"></vue-editor>
                <!--<editor :index="index" @getContent="getContent"></editor>-->
              </div>
              <div class="btn_wrap">
                <el-button size="small" type="danger" @click="deleteFamous(index)">删出当前景区</el-button>
                <el-button v-if="(index+1) ==  famousList.length" @click="addFamous" size="small" type="primary">添加第{{index+2}}个景区</el-button>
              </div>
            </div>
            <!--end  景区每天描述-->




            <!--start 发布热门按钮-->
            <div class="send_btn">
              <el-button @click="sendFamous" type="primary">{{btnTxt}}</el-button>
            </div>
            <!--end 发布热门按钮-->

          </div>
        </div>
      <!--end 热门目的地模板-->
    </div>
</template>

<script>

import editor from './../components/editor';

import { VueEditor } from 'vue2-editor';


export default {
    name: "destinationTpl",
    components: {
      // editor
      VueEditor
    },
    data() {
      return {
        form: {
          country: '',
          city: '',
          title: '',
          desc: ''
        },
        imgList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        famousList: [
          {
            title: '',
            subtitle: '',
            spotDesc: ''
          }
        ],

        countryList: [],
        cityList: [],
        habbid: '',
        btnTxt: '新增热门目的地',
        showImgList: []


      }
    },

    methods: {

      handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
        // An example of using FormData
        // NOTE: Your key could be different such as:
        // formData.append('file', file)

        var formData = new FormData();
        formData.append('picture', file)

        this.$post('/img/addFile',formData).then(res=>{
          let url = res.data; // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', url);
          resetUploader();
        }).catch((err) => {
          console.log(err);
        })

      },


      getContent(msg,index){
        console.log(msg,index)

        this.famousList[index].spotDesc = msg;
      },

      //添加景区模板
      addFamous(){
        if(this.famousList.length > 4){
          this.$message({
            message: '最多只能添加5个景区哦！',
            type: 'warning'
          });
          return;
        }

        var obj = {
          title: '',
          subtitle: '',
          spotDesc: ''
        };

        this.famousList.push(obj)
      },

      //删除当前景区
      deleteFamous(index){
        console.log(index)
        this.famousList.splice(index,1)
        console.log(this.famousList)
      },

      //发布热门景区
      sendFamous(){

        if(this.$route.query.id){



          var placesArr = [];

          for(var i = 0; i < this.famousList.length; i++){
            if(!(this.famousList[i].title)){
              var msg = "请输入第" + (i+1) + "个景区的名称!";
              this.$message({
                message: msg,
                type: 'warning'
              });
              return;
            }else if(!(this.famousList[i].subtitle)){
              var msg = "请输入第" + (i+1) + "个景区的标题!";
              this.$message({
                message: msg,
                type: 'warning'
              });
              return;
            }else if(!(this.famousList[i].spotDesc)){
              var msg = "请输入第" + (i+1) + "个景区的描述!";
              this.$message({
                message: msg,
                type: 'warning'
              });
              return;
            }else if(this.famousList[i].title){
              placesArr.push(this.famousList[i].title);
            }
          }

          this.$post('/hotDestDesc/updateHotDestDesc',{
            hddid: this.habbid,
            nationid: this.form.country,
            cityid: this.form.city,
            title: this.form.title,
            intro: this.form.desc,
            showImgList: this.imgList,
            spotList: this.famousList,
            places: placesArr.join(',')
          }).then(res=>{
            console.log(res)
            if(res.code == 0){
              this.$message({
                message: '修改热门目的地成功！',
                type: 'success'
              });

              this.$router.push({
                name: 'destination'
              })
            }
          })
        }else {

          var placesArr = [];

          for(var i = 0; i < this.famousList.length; i++){
            if(!(this.famousList[i].title)){
              var msg = "请输入第" + (i+1) + "个景区的名称!";
              this.$message({
                message: msg,
                type: 'warning'
              });
              return;
            }else if(!(this.famousList[i].subtitle)){
              var msg = "请输入第" + (i+1) + "个景区的标题!";
              this.$message({
                message: msg,
                type: 'warning'
              });
              return;
            }else if(!(this.famousList[i].spotDesc)){
              var msg = "请输入第" + (i+1) + "个景区的描述!";
              this.$message({
                message: msg,
                type: 'warning'
              });
              return;
            }else if(this.famousList[i].title){
              placesArr.push(this.famousList[i].title);
            }
          }

          this.$post('/hotDestDesc/addHotDestDesc',{
            nationid: this.form.country,
            cityid: this.form.city,
            title: this.form.title,
            intro: this.form.desc,
            showImgList: this.imgList,
            spotList: this.famousList,
            places: placesArr.join(',')
          }).then(res=>{
            console.log(res)
            if(res.code == 0){
              this.$message({
                message: '新增热门目的地成功！',
                type: 'success'
              });
              this.$router.push({
                name: 'destination'
              })
            }
          })

        }

      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG && !isPNG) {
          this.$message.error('请选择我们支持的格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过5MB!');
        }
        return (isJPG || isPNG) && isLt5M;
      },

      handleRemove(file, fileList) {

        // const index = this.imgList.indexOf()

        console.log(file,fileList)


        this.$delete('/img/deleteByUrl',{
          url: file.response ? file.response.data : file.url
        }).then(res=>{

          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            console.log(file,fileList)


            const imgData = [];

            for (var i = 0; i < fileList.length; i++){
              let obj = {};
              obj.url = fileList[i].response ? fileList[i].response.data : fileList[i].url;

              imgData.push(obj);
            }

            this.imgList = imgData;
          }

        })

      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      handleAvatarSuccess(res, file) {
        console.log(res,file)
        if(res.code == 0){

          this.$message({
            type: 'success',
            message: '上传成功!'
          });
          var obj = {};
          obj.url = res.data;
          this.imgList.push(obj);

        }

      },

      handleExceed(files, fileList){
        this.$message({
          message: '最多上传6张图片！',
          type: 'warning'
        });
      },

      //获取所有国家
      getCountryList(){
        this.$get('/nation/queryByRecord',{}).then(res=>{
          if(res.code == 0){
            this.countryList = res.data.list;
          }
        })
      },

      //获取国家对应的城市
      getCityList(id){
        this.$get('/city/queryByRecord',{
          nationid: id
        }).then(res=>{
          if(res.code == 0){

            this.cityList = res.data.list;
          }
        })
      },

      //选择国家之后获取城市
      changeCountry(){
        console.log(this.form.country)
        if(this.form.country){
          this.getCityList(this.form.country)
        }
      },


      //获取热门目的地
       getDetails(){
        if(this.$route.query.id){
          this.$get('/hotDestDesc/queryById',{
            id: this.$route.query.id
          }).then(res=>{
            console.log(res)
            if(res.code == 0){
              const data = res.data;

              this.form.country = data.nationid;
              this.form.city = data.cityid;
              this.form.title = data.title;
              this.form.desc = data.intro;
              this.famousList = data.spotList;


              let arr = [];

              data.showImgList.forEach((e,index)=>{
                let obj = {}
                obj.url = e;
                arr.push(obj)
              })
              this.showImgList = JSON.parse(JSON.stringify(arr));
              this.imgList = JSON.parse(JSON.stringify(arr));


              if(this.form.city){
                this.changeCountry(this.form.city);
              }


            }
          })
        }
       }

    },

    mounted(){
      //获取所有国家
      this.getCountryList();

      if(this.$route.query.id){
        this.habbid = this.$route.query.id;
        this.btnTxt = '修改热门目的地';

        this.getDetails();
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
.famousItem h2.day{
  padding-left: 50px;
  font-size: 20px;
  padding-bottom: 20px;
}

.editor{
  padding-left: 50px;
}
.editor h2{
  padding: 20px 0 30px;
  font-size: 16px;
}
.btn_wrap{
  text-align: right;
  padding: 30px 0;
}
.send_btn{
  text-align: center;
  margin-top: 30px;
}
</style>
