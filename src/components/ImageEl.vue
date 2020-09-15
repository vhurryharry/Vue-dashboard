<template>
  <div v-if="imageData" class="image-row col-lg-12">
    <p>
      <img class="damage-image" :src="imageData.thumbnail" alt="" @click="selectImage">
    </p>
    <p>
      <a v-if="canFly" href="#" class="btn btn-default" @click.prevent="flyTo" :title="msg.flyTo">
        <i class="glyphicon glyphicon-search"></i>
      </a>
    </p>
  </div>

  <div v-else>{{msg.loading}}</div>
</template>

<script>
  export default {
    name: "image-el",
    props: ['imageId'],

    computed: {
      imageData() {
        return this.$store.state.images[this.imageId]
      },

      canFly(){
        return !this.imageData.is_manual
      },

      msg(){
        return window.MSG
      }
    },

    methods: {
      selectImage() {
        this.$store.commit('selectImage', this.imageId)
      },
      flyTo() {
        let imageData = this.imageData,
          latitude = imageData.latitude,
          longitude = imageData.longitude,
          altitude = imageData.altitude,
          yaw = imageData.yaw,
          pitch = imageData.pitch,
          roll = imageData.roll

        this.$bus.$emit('fly-to', {latitude, longitude, altitude, yaw, pitch, roll});
      }
    }
  }
</script>

<style scoped>
  .damage-image {
    cursor: pointer;
  }

  .damage-image:hover {
    /*border: solid 1px silver;*/
  }

  .image-row {
    margin-bottom: 15px;
  }

  .image-row p {
    text-align: center;
    margin: 0 0 3px;
  }
</style>
