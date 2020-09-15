<template>
  <div class="alert alert-warning locked-bar" role="alert">
    {{msg}}
  </div>
</template>

<script>
  export default {
    name: "locked-bar",
    props: ['user'],
    computed: {
      msg(){
        return interpolate(gettext("You can't change this survey, another user <strong>%s</strong> is already working with it"), this.user)
      }
    }
  }
</script>

<style scoped>
  .locked-bar {
  }
</style>
