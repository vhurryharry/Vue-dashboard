<template>
   <div class="loader">
     {{msg.loading}}
   </div>
</template>

<script>
  export default {
    name: "loader",
    computed:{
      msg(){
        return window.MSG
      }
    }
  }
</script>

<style scoped>
.loader {
  padding: 3px;
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: azure;
  z-index: 1000;
}
</style>
