<template>
<div class="row">
  <damage-create></damage-create>
</div>
</template>

<script>
  import DamageCreate from './DamageCreate'

  export default {
    name: "damage-create-mode",
    computed: {
      msg() {
        return window.MSG
      },
    },
    components: {DamageCreate}
  }
</script>

<style scoped>

</style>
