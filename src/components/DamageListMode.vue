<template>
  <div class="row">
    <div class="col-lg-12">
      <filters-bar></filters-bar>
    </div>

    <div class="col-lg-12">
      <damage-list></damage-list>
    </div>
  </div>
</template>

<script>
  import FiltersBar from './FiltersBar'
  import DamageList from './DamageList'

  export default {
    name: "damage-list-mode",
    components: {FiltersBar, DamageList}
  }

</script>

<style scoped>

</style>
