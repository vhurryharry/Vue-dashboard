<template>
  <div class="col-lg-6 damage-left">
    <div class="row">
      <div class="col-lg-9">
        <h1>{{msg.compareDamage}} {{damage.damage_id}}</h1>
        <damage-edit :damage="damage">
          <router-link class="btn btn-default"
                       :to="{ name: 'DamageList' }">
            {{msg.backToDamageList}}
          </router-link>

        </damage-edit>
      </div>
      <div class="col-lg-3">
        <image-edit-list :damage="damage"></image-edit-list>
      </div>
    </div>
  </div>

</template>

<script>
  import DamageEdit from './DamageEdit'
  import ImageEditList from './ImageEditList'

  export default {
    name: "damage-left",
    props: ['damage'],
    components: {DamageEdit, ImageEditList},
    computed: {
      msg(){
        return window.MSG
      }
    },
    mounted(){
      this.$store.dispatch('loadDamageImages', this.damage.id)
    }

  }
</script>

<style scoped>
.damage-left {
  border-right: solid thin silver;
  padding: 5px;
}
</style>
