<template>
  <a class="list-group-item" href="#" @click.prevent="flyTo" :title="msg.flyTo">
    <div class="row">
      <div class="col-lg-1">
        <input type="checkbox" v-model="bookmark.show_in_report" @click="changeShowInReport" :title="msg.showInReport">
      </div>
      <div class="col-lg-6 bookmark-name">
        {{bookmark.name}}
      </div>
      <div class="col-lg-4" style="text-align: right">
        <span class="btn btn-xs btn-danger delete-button"
                :title="msg.remove"
                @click.prevent="deleteBookmark">
          <i class="glyphicon glyphicon-remove"></i>
        </span>
        <span class="btn btn-xs set-initial-button"
                    :class="{'btn-default': !isInitial, 'btn-success': isInitial}"
                    :title="msg.setInitialPosition"
                    @click.prevent="setInitial">
          <i class="glyphicon glyphicon-tag"></i>
        </span>
      </div>

    </div>
  </a>
</template>

<script>
  export default {
    name: "bookmark",

    props: ['bookmark'],
    computed: {
      msg(){
        return window.MSG
      },

      isInitial(){
        return this.bookmark.is_initial_position
      },

    },

    methods: {
      deleteBookmark(e){
        e.stopPropagation()
        this.$store.dispatch('deleteBookmark', this.bookmark.id)
      },

      flyTo(){
        let bm = this.bookmark,
          latitude = bm.latitude,
          longitude = bm.longitude,
          altitude = bm.altitude,
          yaw = bm.yaw,
          pitch = bm.pitch,
          roll = bm.roll

        this.$bus.$emit('fly-to', {latitude, longitude, altitude, yaw, pitch, roll});
      },

      setInitial(e){
        e.stopPropagation()
        this.$store.dispatch('updateBookmark',
            {id: this.bookmark.id,
                data: {is_initial_position: true}})
      },
      changeShowInReport(e){
        e.stopPropagation()
        this.$store.dispatch('updateBookmark',
            {id: this.bookmark.id,
                data: {show_in_report: !this.bookmark.show_in_report}})
      },

    }
  }
</script>

<style scoped>
  .bookmark-name {
    overflow-wrap: break-word;
  }
</style>
