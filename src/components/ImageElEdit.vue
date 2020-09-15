<template>
  <div v-if="imageData" class="image-row col-lg-12">
    <div class="confirmWindow" v-if="showConfirmDelete">
      <div class="panel panel-danger">
        <div class="panel-heading">
          <strong>{{msg.confirmDeleteHeader}}</strong>
        </div>

        <div class="panel-body">
          {{msg.confirmDeleteText}}
        </div>
        <div class="panel-footer">
          <button class="btn btn-danger" @click.prevent="remove">{{msg.delete}}</button>
          <button class="btn btn-primary" @click.prevent="hideConfirmDeleteDialog">{{msg.cancel}}</button>
        </div>
      </div>
    </div>


    <p>
      <label><input type="checkbox" :checked="showInReport" :disabled="!canChangeSurvey" @change="toggleShow"> {{msg.showInReport}}</label>
    </p>
    <p>
      <img class="damage-image" :src="imageData.thumbnail" alt="" @click="selectImage">
    </p>
    <p>
      <router-link v-if="canChangeSurvey"
                   class="btn btn-default"
                   :to="{ name: 'DamageCreateWithImage', params: {imageId: imageId}}"
                   :title="msg.createDamageDesc">
        <i class="glyphicon glyphicon-plus"></i>
      </router-link>

      <a v-if="canFly" href="#" class="btn btn-default" @click.prevent="flyTo" :title="msg.flyTo">
        <i class="glyphicon glyphicon-search"></i>
      </a>

      <a href="#" v-if="canChangeSurvey" class="btn btn-default" @click.prevent="saveCameraPosition"
              :title="msg.saveCameraPosition">
        <i class="glyphicon glyphicon-screenshot"></i>
      </a>

      <button v-if="canChangeSurvey && imageData.is_manual"
              class="btn btn-danger"
              :title="msg.remove"
              @click.prevent="showConfirmDeleteDialog">
        <i class="glyphicon glyphicon-remove"></i>
      </button>
    </p>
  </div>

  <div v-else>{{msg.loading}}</div>
</template>

<script>
  export default {
    name: "image-el",
    props: ['imageId', 'damage'],
    data(){
      return {
        showConfirmDelete: false
      }
    },

    computed: {
      showInReport(){
        return this.damage.image_ids_for_report.indexOf(this.imageId) !== -1
      },
      imageData() {
        let image = this.$store.state.images[this.imageId]
        if (!image) {
          // image not loaded yet
          this.$store.dispatch('loadImage', this.imageId)
        }

        return image
      },
      canFly(){
        return this.imageData.latitude && this.imageData.longitude && this.imageData.altitude
      },

      canChangeSurvey() {
        return this.$store.state.perms.can_change_survey
      },
      msg(){
        return window.MSG
      }
    },

    methods: {
      showConfirmDeleteDialog(){
        this.showConfirmDelete = true
      },

      hideConfirmDeleteDialog(){
        this.showConfirmDelete = false
      },
      selectImage() {
        this.$store.commit('selectImage', this.imageId)
      },
      saveCameraPosition(){
          this.$bus.$emit('save-camera-position', this.imageId);
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
      },

      toggleShow(){
        this.$store.dispatch('toggleShowInReport',
          {damageId: this.damage.id, imageId: this.imageId, current: this.showInReport})
      },

      remove(){
        this.$store.dispatch('removeImage', {imageId: this.imageId, damageId: this.damage.id})
      }
    },

    created(){
      this.$once('flyToDefault', () => {
        if (this.damage.default_image_id === this.imageId){
          this.flyTo()
        }
      })
    },

    updated(){
      if (this.imageData){
        this.$emit('flyToDefault')
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
  .confirmWindow {
    z-index: 99999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(65, 64, 65, 0.49);
    text-align: center;
  }

  .confirmWindow .panel {
    text-align: left;
    display: inline-block;
    width: 30%;
    margin-top: 10%;
    box-shadow: 5px 5px 8px #575757;
  }
</style>
