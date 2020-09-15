<template>
  <div>
    <image-edit-list :damage="damage"></image-edit-list>
  </div>
</template>


<script>
  import ImageEditList from './ImageEditList'

  export default {
    name: "damage-info",

    props: ['damage'],

    components: {ImageEditList},

    mounted(){
      this.$store.dispatch('loadDamageImages', this.damage.id)
    }
  }
</script>

<style scoped>

</style>
