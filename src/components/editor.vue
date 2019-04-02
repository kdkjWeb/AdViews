<template>
  <div>

    <div ref="editor" style="text-align:left">

    </div>

  </div>
</template>

<script>
  import E from 'wangeditor'
  export default {
    name: 'HelloWorld',
    props:['index','rowIndex','conent'],
    data () {
      return {
        editorContent: "",
      }
    },
    methods:{

    },
    mounted(){

      // this.editorContent = this.conent ? this.conent : '';

      let editor = new E(this.$refs.editor);  //获取编辑器的节点
      editor.customConfig.uploadImgServer = `${this.$store.state.baseUrl}/img/addFile`;  // 上传图片到服务器
      editor.customConfig.onchange = (html) => {  //编辑时获取编辑器里面的内容
        this.editorContent = html;

        this.$emit('getContent',this.editorContent,this.index,this.rowIndex)
      };

      editor.customConfig.uploadFileName = 'picture';   //自定义fileName
      editor.customConfig.uploadImgHooks = {
        success: function (xhr, editor, result) {
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        customInsert: function (insertImg, result, editor) {

          console.log(result)

          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          let url = result.data;
          insertImg(url)
        }
      };
      editor.create();
      console.log(this.index,this.rowIndex)

    }
  }
</script>


<style scoped>

</style>
