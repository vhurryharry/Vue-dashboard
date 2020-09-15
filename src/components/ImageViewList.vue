<template>
  <div>
    <div class="row">
      <image-el v-for="imageId in images" :imageId="imageId" :key="imageId"></image-el>
    </div>

  </div>
</template>

<script>
  import ImageEl from './ImageEl'

  export default {
    name: "image-list",
    props: ['images'],
    components: {ImageEl}
  }
</script>

<style scoped>
</style>
