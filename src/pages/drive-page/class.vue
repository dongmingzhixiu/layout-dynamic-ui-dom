<template>
  <!-- 班牌盘显示内容 -->
  <div>
    这是班牌页面
  </div>
</template>

<script>
  export default {
    name: 'class',
    data() {
      return {

      };
    },
    created() {
      setTimeout(() => {
        let jsEvent = ldvJs || window.ldvJs || {
          executeMethod: (action, methodType, jsonParam) => {

          }
        }
        let object=jsEvent.executeMethod();
        console.log(object);
      }, 3000)
    }
  }
</script>

<style>
</style>
