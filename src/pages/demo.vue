<template>
    <div>
      <div class="block">
        <span class="demonstration">开始时间：</span>
        <el-date-picker
          v-model="startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间"
        ></el-date-picker>
      </div>
      <div class="block">
        <span class="demonstration">结束时间：</span>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="change"
          placeholder="选择时间"
        ></el-date-picker>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptionsStartTime: {},
        pickerOptionsEndTime: {},
        startTime: "",
        endTime: ""
      };
    },
    methods: {
      change(val) {
        console.log(val);
        this.comptime(this.startTime, val)
          .then(res => {
            this.endTime = res;
            console.log("res: ", res);
          })
          .catch(err => {
            this.endTime = err;
            console.log("err: ", err);
          });
      },
      async comptime(beginTime, endTime) {
        if (beginTime) {
          var str = endTime;
          var beginTimes = beginTime.substring(0, 10).split("-");
          var endTimes = endTime.substring(0, 10).split("-");

          beginTime =
            beginTimes[1] +
            "-" +
            beginTimes[2] +
            "-" +
            beginTimes[0] +
            " " +
            beginTime.substring(10, 19);
          endTime =
            endTimes[1] +
            "-" +
            endTimes[2] +
            "-" +
            endTimes[0] +
            " " +
            endTime.substring(10, 19);
          var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
          if (a <= 0) {
            this.$message({
              message: "结束时间必须大于开始时间",
              type: "warning"
            });
            return "";
          } else {
            return str;
          }
        } else {
          this.$message({
            message: "请选择开始时间",
            type: "warning"
          });
        }
      },
      changeStartTime() {
        this.pickerOptionsStartTime = Object.assign(
          {},
          this.pickerOptionsStartTime,
          {
            disabledDate: time => {
              return time.getTime() > this.endTime;
            }
          }
        );
      },
      changeEndTime() {
        this.pickerOptionsEndTime = Object.assign({}, this.pickerOptionsEndTime, {
          disabledDate: time => {
            return time.getTime() < this.startTime;
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
