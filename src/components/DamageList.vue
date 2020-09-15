<template>
  <div class="damage-table">
    <table class="table table-bordered table-condensed ">
      <thead>
        <tr>
          <th>{{msg.isDamage}}</th>
          <th>{{msg.isAddedManually}}</th>
          <th>{{msg.id}}</th>
          <th>{{msg.component}}</th>
          <th>{{msg.geometryType}}</th>
          <th>{{msg.dimensions}}</th>
          <th>{{msg.types}}</th>
          <th>{{msg.grade}}</th>
          <th>{{msg.notes}}</th>
          <th>{{msg.reportImagesNumber}}</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <damage v-for="damage in damages" :damage="damage" :key="damage.id"></damage>
      </tbody>
    </table>
  </div>

</template>

<script>
  import Damage from './Damage'

  export default {
    name: "damage-list",

    computed: {
      msg() {
        return window.MSG
      },

      damages(){
        return this.$store.getters.damages
      }
    },

    components: {Damage},

    mounted(){
      this.$bus.$emit('showAllDamages')
    }
  }
</script>

<style scoped>
.damage-table {
}
</style>
