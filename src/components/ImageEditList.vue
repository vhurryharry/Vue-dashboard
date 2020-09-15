<template>
  <div>
    <div class="row">
      <image-el-edit v-for="imageId in damage.images" :imageId="imageId" :key="imageId" :damage="damage"></image-el-edit>
    </div>

  </div>
</template>

<script>
  import ImageElEdit from './ImageElEdit'

  export default {
    name: "image-list",
    props: ['damage'],
    components: {ImageElEdit}
  }
</script>

<style scoped>
</style>
