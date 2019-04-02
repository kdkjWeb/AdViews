<template>
    <div>
      <!--start 精品案例基本信息-->
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
              <el-form-item label="行程标题">
                <el-input v-model="form.title" placeholder="请输入行程标题"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="行程副标题">
                <el-input v-model="form.playType" placeholder="请输入行程副标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行程介绍">
                <!--<el-input v-model="form.title" placeholder="请输入行程介绍"></el-input>-->
                <el-input type="textarea" v-model="form.intro" placeholder="请输入行程介绍"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="人均消费">
                <el-input v-model="form.price" placeholder="请输入人均消费"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仅剩数量">
                <el-input v-model="form.remains" placeholder="请输入仅剩数量"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出发时间">
                <el-date-picker
                  v-model="form.starttime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择出发日期">
                </el-date-picker>
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
      <!--end 精品案例基本信息-->

      <!--start 详细信息模板-->
      <div class="viewpoint">
        <el-tabs v-model="activeName"  type="border-card" @tab-click="handleClick">
          <el-tab-pane label="行程特色" name="first">

            <h2>请上传行程特色图片</h2>
            <div>
              <el-upload
                :action="`${this.$store.state.baseUrl}/img/addFile`"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove1"
                name="picture"
                :limit="6"
                :file-list="tripImgList"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess1"
                :on-exceed="handleExceed">
                <i class="el-icon-plus"></i>
              </el-upload>
              <i>只支持jpg/png类型，且不超过5M</i>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>

          </el-tab-pane>
          <el-tab-pane label="推荐玩法" name="second">
            <div class="play_list">

                <div class="dayList">
                  <el-tag v-for="item,index in daysList"
                          :type="index == activeDay ? '' : 'info'"
                          :key="index"
                          closable
                          @close="handleClose(item,index)"
                          @click.native="checkDay(index,item)">第{{index+1}}天</el-tag>
                </div>

                <div class="play_list_item">

                    <h1>第{{activeDay + 1}}天行程</h1>

                      <!--start 地点活动-->
                    <div>
                      <el-form size="mini" label-width="100px">
                        <el-form-item label="地点">
                          <el-input v-model="viewpoinItem.title"></el-input>
                        </el-form-item>
                        <el-form-item label="活动">
                          <el-input type="textarea" v-model="viewpoinItem.actInfo"></el-input>
                        </el-form-item>
                        <div v-for="(items,indexs) in viewpoinItem.lableList" :key="indexs">

                          <div>
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="景区名称">
                                  <el-input v-model="items.tripName"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="景区地址">
                                  <el-input v-model="items.addr"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="开放时间">
                                  <el-input v-model="items.opentime"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </div>

                          <div>
                            <el-form-item :label="`第${indexs+1}个景区`">
                              <!--<editor @getContent="getContent" :index="indexs" :conent="items.tripDesc"></editor>-->
                              <vue-editor
                                useCustomImageHandler
                                @imageAdded="handleImageAdded" v-model="items.tripDesc"></vue-editor>
                            </el-form-item>
                          </div>




                          <div class="btn_wrap">
                            <el-button size="small" type="danger" @click="deleteThisView(indexs)">删出当前景区</el-button>
                            <el-button size="small" v-if="viewpoinItem.lableList.length < 3" type="primary" @click="addFamous">添加第{{indexs + 2}}个景区</el-button>
                          </div>
                        </div>

                        <div>
                          <el-row>
                            <el-col :span="12">
                              <el-form-item label="酒店名称">
                                <el-input v-model="viewpoinItem.hotelName"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="酒店地址">
                                <el-input v-model="viewpoinItem.hotelAddr"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12">
                              <el-form-item label="酒店介绍">
                                <el-input type="textarea" v-model="viewpoinItem.hotelIntro"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="酒店封面图">
                                <el-upload
                                  class="avatar-uploader"
                                  :action="`${this.$store.state.baseUrl}/img/addFile`"
                                  name="picture"
                                  :show-file-list="false"
                                  :on-success="handleAvatarSuccess2"
                                  :before-upload="beforeAvatarUpload">
                                  <img v-if="viewpoinItem.hotelImg" :src="viewpoinItem.hotelImg" class="avatar">
                                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>

                      </el-form>

                      <div>
                        <el-button v-if="!id" type="success" @click="savaDay">保存第{{activeDay + 1}}天</el-button>
                        <el-button v-if="id" type="success" @click="editDay">修改第{{activeDay + 1}}天</el-button>
                        <el-button v-if="daysList.length == activeDay + 1" type="success" @click="addtDay">添加第{{activeDay + 2}}天</el-button>

                      </div>
                    </div>
                      <!--end 地点活动-->
                </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="报价说明" name="third">
            <h2>请输入行程报价</h2>
            <!--<editor @getContent="getContent1"></editor>-->
            <vue-editor
              useCustomImageHandler
              @imageAdded="handleImageAdded" v-model="offerDesc"></vue-editor>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--end 详细信息模板-->
      <!--start 发布热门按钮-->
      <div class="send_btn">
        <el-button @click="sendFamous" type="primary">{{btnTxt}}</el-button>
      </div>
      <!--end 发布热门按钮-->

    </div>
</template>

<script>
  // import editor from './../components/editor';
  import { VueEditor } from 'vue2-editor';

  export default {
      name: "viewpointTpl",
      components: {
        // editor
        VueEditor
      },
      data() {
        return {
          btnTxt: '新增精品案例',
          form: {
            title: '',
            playType: '',   //副标题对应出游类型
            intro: '',
            price: '',
            remains: '',
            starttime: '',
            country: '',
            city: ''
          },
          activeName: 'first',
          dialogImageUrl: '',
          dialogVisible: false,
          viewpoinItem: {
            title: '',
            actInfo: '',
            lableList: [
              {
                tripName: '',
                opentime: '',
                addr: '',
                tripDesc: ''
              }
            ],
            hotelName: '',
            hotelAddr: '',
            hotelIntro: '',
            hotelImg: ''
          },
          imgList: [],
          imgList1: [],
          countryList: [],
          cityList: [],
          offerDesc: '',   //报价说明

          activeDay: 0,
          daysList: [
            {
              id: ''
            }
          ],
          id: '',
          showImgList: [],   //轮播图返回值
          tripImgList: [],   //行程特色返回值
          dayId: '',   //每个精品案例的id
        }
      },

      methods: {

        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {

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



        sendFamous(){

          if(this.dayId){   // 修改
            this.$post('/bestCase/updateBestCase',{
              bcid: this.dayId,
              nationid: this.form.country,
              cityid: this.form.city,
              title: this.form.title,
              playType: this.form.playType,
              intro: this.form.intro,
              price: this.form.price,
              remains: this.form.remains,
              starttime: this.form.starttime,
              showImgList: this.imgList,    //轮播图图片
              tripImgList: this.imgList1,   //行程特色
              offerDesc: this.offerDesc,
              daysList: this.daysList
            }).then(res=>{
              console.log(res)
              if(res.code == 0){
                this.$message({
                  type: 'success',
                  message: '修改精品案例成功!'
                });
                this.$router.push({
                  name: 'viewpoint'
                })
              }
            },err => {
              this.$message({
                message: '修改精品案例失败',
                type: 'viewpoint'
              });
            })
          }else{   //新增
            this.$post('/bestCase/addBestCase',{
              nationid: this.form.country,
              cityid: this.form.city,
              title: this.form.title,
              playType: this.form.playType,
              intro: this.form.intro,
              price: this.form.price,
              remains: this.form.remains,
              starttime: this.form.starttime,
              showImgList: this.imgList,    //轮播图图片
              tripImgList: this.imgList1,   //行程特色
              offerDesc: this.offerDesc,
              daysList: this.daysList
            }).then(res=>{
              console.log(res)
              if(res.code == 0){
                this.$message({
                  type: 'success',
                  message: '新增精品案例成功!'
                });
                this.$router.push({
                  name: 'viewpoint'
                })
              }
            },err => {
              this.$message({
                message: '新增精品案例失败',
                type: 'warning'
              });
            })
          }


        },

        // 切换天数
        checkDay(index,item){

          console.log(index,item)

          if(item.id || item.bctdid){
            this.id = item.id ? item.id : item.bctdid;

            this.$get('/bestCase/queryByBestCaseTripDaysId',{
              id: item.id ? item.id : item.bctdid
            }).then(res=>{
              console.log(res)

              if(res.code == 0){
                this.viewpoinItem = res.data;
              }

            })
          }

          this.activeDay = index;
        },

        //添加景区
        addFamous(){
          var obj = {
            tripName: '',
            addr: '',
            opentime: '',
            tripDesc: ''
          };
          this.viewpoinItem.lableList.push(obj);
        },

        //删除景区
        deleteThisView(index){

          if(this.viewpoinItem.lableList.length == 1){
            this.$message({
              message: '请至少保留一个景区',
              type: 'warning'
            });
            return false;
          }

          console.log(index)
          this.viewpoinItem.lableList.splice(index,1)
        },

        //保存每天
        savaDay(){
          this.$post('/bestCase/addBestCaseTripDays',{
             title: this.viewpoinItem.title,    //地点
             actInfo: this.viewpoinItem.actInfo,   //活动介绍
             hotelName: this.viewpoinItem.hotelName,   //酒店名称
             hotelAddr: this.viewpoinItem.hotelAddr,   //酒店地址
             hotelIntro: this.viewpoinItem.hotelIntro,   //酒店介绍
             hotelImg: this.viewpoinItem.hotelImg,   //酒店图片
             days: this.activeDay + 1,
             lableList: this.viewpoinItem.lableList,   //景区
          }).then(res=>{
            if(res.code == 0){
              this.$message({
                message: '保存成功！',
                type: 'success'
              });




                var obj = {};
                obj.bctdid = res.bestCaseTripDaysId;

                // this.daysList.push(obj);

              this.daysList[this.activeDay] = obj;
                // console.log(this.daysList)

                //天数改变
               // this.dayList[this.activeDay].id =  res.bestCaseTripDaysId;

            }
          },err => {
            this.$message({
              message: '保存失败，请重新保存！',
              type: 'warning'
            });
          })
        },

        //添加第几天
        addtDay(){
          if(!(this.daysList[this.activeDay].bctdid)){
            this.$message({
              message: `请保存第${this.activeDay + 1}天后再添加`,
              type: 'warning'
            });
            return;
          }

          this.activeDay ++ ;

          console.log(this.activeDay)
          console.log( this.daysList)

          console.log( this.daysList.length)


         /* if(){

          }*/



          this.daysList.push({
            id: ''
          })
          this.id = '';

          this.viewpoinItem = {
            address: '',
            activity: '',
            lableList: [
              {
                tripName: '',
                opentime: '',
                addr: '',
                tripDesc: ''
              }
            ],
            hotleNmae: '',
            hotleAdr: '',
            hotleIntro: '',
            hotleImg: ''
          }
        },


        //修改某天
        editDay(){
          this.$post('/bestCase/updateBestCaseTripDays',{
            title: this.viewpoinItem.title,    //地点
            actInfo: this.viewpoinItem.actInfo,   //活动介绍
            hotelName: this.viewpoinItem.hotelName,   //酒店名称
            hotelAddr: this.viewpoinItem.hotelAddr,   //酒店地址
            hotelIntro: this.viewpoinItem.hotelIntro,   //酒店介绍
            hotelImg: this.viewpoinItem.hotelImg,   //酒店图片
            days: this.activeDay + 1,
            lableList: this.viewpoinItem.lableList,   //景区
            bctdid: this.id
          }).then(res=>{
            console.log(res)
            if(res.code == 0){
              this.$message({
                message: '修改成功！',
                type: 'success'
              });

            }
          })
        },


        //  删除某天
        handleClose(val,index){
          console.log(val,index)

          if(val.id){   //val.id不为空表示已经提交后台保存
            this.$confirm(`此操作将永久删除第${index+1}天行程, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$delete('/bestCase/deleteByBestCaseTripDaysId',{
                id: val.id
              }).then(res=>{
                if(res.code == 0){
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

                  this.daysList.splice(index,1);
                  // this.dayList.splice(index,1);
                  this.activeDay = this.daysList.length - 1 ;
                }
              })

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          }else {
            this.$message({
              type: 'info',
              message: '还没保存，不能删除哦！'
            });
          }


        },



        handleClick(tab, event) {
          console.log(tab, event);
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


        handleRemove1(file, fileList) {
          console.log(file,fileList)

          this.$delete('/img/deleteByUrl',{
            url: file.response ? file.response.data : file.url
          }).then(res=>{

            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              const imgData = [];

              for (var i = 0; i < fileList.length; i++){
                let obj = {};
                // obj.url = fileList[i].response.data;

                obj.url = fileList[i].response ? fileList[i].response.data : fileList[i].url;


                imgData.push(obj);
              }

              this.imgList1 = imgData;
            }

          })

        },



        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        /**start上传图片 */
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

        handleAvatarSuccess1(res, file) {
          console.log(res,file)
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '上传成功!'
            });
            var obj = {};
            obj.url = res.data;
            this.imgList1.push(obj);
          }

        },

        handleAvatarSuccess2(res, file) {
          console.log(res,file)
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '上传成功!'
            });

            this.viewpoinItem.hotelImg = res.data;
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


        //获取精品案例详情
        getDetails(){
          if(this.$route.query.id){
            this.$get('/bestCase/queryById',{
              id: this.$route.query.id
            }).then(res=>{
              if(res.code == 0){
                const data = res.data;
                this.form.country = data.nationid;
                this.form.city = data.cityid;
                this.form.title = data.title;
                this.form.playType = data.playType;
                this.form.price = data.price;
                this.form.remains = data.remains;
                this.form.starttime = data.starttime;
                this.offerDesc = data.offerDesc;
                this.form.intro = data.intro;


                if(this.form.city){
                  this.changeCountry(this.form.city);
                }

                this.viewpoinItem = data.daysList[0];


                this.daysList = data.daysList;


                this.id = this.daysList[0].id;


                let arr = [];
                let arr1 = [];

                data.showImgList.forEach((e,index)=>{
                  let obj = {}
                  obj.url = e;
                  arr.push(obj)
                })
                this.showImgList = JSON.parse(JSON.stringify(arr));
                this.imgList = JSON.parse(JSON.stringify(arr));


                data.tripImgList.forEach((e,index)=>{
                  let obj = {}
                  obj.url = e;
                  arr1.push(obj)
                })
                this.tripImgList = JSON.parse(JSON.stringify(arr1));
                this.imgList1 = JSON.parse(JSON.stringify(arr1));



              }
            })
          }
        }

      },

    mounted(){
      //获取所有国家
      this.getCountryList();






      console.log(this.$route.query.id,111)

      if(this.$route.query.id){
        this.dayId = this.$route.query.id;
        this.btnTxt = '修改精品案例';

        //获取精品案例详情
        this.getDetails();
      }

    }
  }
</script>

<style>
.el-date-range-picker{
    z-index: 20000 !important;
  }
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


<style scoped>
.basicInfo{
  width: 1000px;
  margin: 0 auto;
}
.viewpoint{
  width: 1000px;
  margin: 0 auto;
}
.viewpoint h2{
  font-size: 18px;
  padding: 20px 0;
}
.viewpoint .el-input{
  /*width: 240px;*/
}
.play_list_item{
  border-bottom: 3px solid #ddd;
}
.play_list_item:last-child{
  border: none;
}
.play_list_item h1{
  font-size: 18px;
  padding: 10px 0 20px 40px;
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
