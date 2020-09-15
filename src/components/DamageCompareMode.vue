<template>
  <div class="row">
    <damage-left :damage="damage"></damage-left>

    <router-view></router-view>

  </div>
</template>

<script>
  import DamageLeft from './DamageLeft'

  export default {
    name: "damage-compare-mode",
    components: {DamageLeft},

    computed: {
      damage() {
        return this.$store.getters.getDamage(this.$route.params.id)
      },

      componentName() {
        return this.$store.getters.damageComponentName(this.damage.component)
      },

      typeName() {
        return this.$store.getters.damageTypeName(this.damage)
      },

      geometryTypeName() {
        return this.$store.getters.geometryTypeName(this.damage.geometry_type)
      },

      gradeName() {
        return this.$store.getters.damageGradeName(this.damage.grade)
      },

      msg(){
        return window.MSG
      }

    }
  }
</script>

<style scoped>

</style>
