<template>
  <div id="big-image" @click="close" :title="msg.clickToClose">
    <img id="damage-image" class="damage-image-big" :src="imageData.imagefile" :data-zoom="imageData.imagefile" alt="">
  </div>
</template>

<script>
  export default {
    name: "image-big",
    props: ['imageId'],

    computed: {
      imageData() {
        return this.$store.state.images[this.imageId]
      },
      msg(){
        return window.MSG
      }
    },
    methods: {
      close() {
        this.$store.commit('selectImage', null)
      }
    }
  }
</script>

<style>
  .damage-image-big {
    max-height: 100%;
    max-width: 100%;
    box-shadow: 5px 5px 8px #575757;
  }

  #big-image {
    cursor: pointer;
    text-align: center;
    padding: 3px;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba(65, 64, 65, 0.49)
  }
</style>
