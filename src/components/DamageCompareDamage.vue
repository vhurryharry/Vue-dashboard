<template>
  <div class="col-lg-6 damage-right">
    <div class="row" v-if="damage">
      <div class="col-lg-3">
        <image-view-list :images="damage.images"></image-view-list>
      </div>

      <div class="col-lg-9">
        <h1>{{msg.toDamage}} {{damage.damage_id}}</h1>
        <damage-view :damage="damage"></damage-view>
      </div>
    </div>
    <a href="#" class="btn btn-default" @click.prevent="back">{{msg.back}}</a>
  </div>
</template>

<script>
  import DamageView from './DamageView'
  import ImageViewList from './ImageViewList'

  export default {
    name: "damage-compare-damage",
    components: {DamageView, ImageViewList},
    computed: {
      mainDamageId() {
        return this.$route.params.id
      },
      damageId() {
        return this.$route.params.otherId
      },
      damage() {
        let d = this.$store.getters.getDamage(this.damageId)
        if (!d){
          this.$store.dispatch('loadDamage', this.damageId)
        }
        return d
      },
      msg(){
        return window.MSG
      }
    },
    methods: {
      back(){
        this.$router.go(-1)
      }
    },

    mounted() {
      this.$store.dispatch('loadDamageImages', this.damageId)
    }

  }
</script>

<style scoped>
  .damage-right {
    padding: 5px;
  }

</style>
