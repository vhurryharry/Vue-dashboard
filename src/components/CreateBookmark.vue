<template>
  <li class="list-group-item">
    <form action="" class="form">
      <div class="form-group">
        <input v-model="name" class="form-control" type="text" :placeholder="msg.bookmarkName" required>
      </div>
      <div class="form-group">
        <input class="form-control" type="submit" :value="msg.bookmarkThis" @click.prevent="createBookmark">
      </div>
    </form>
  </li>
</template>

<script>
  export default {
    name: "create-bookmark",
    data(){
      return {
        name: ''
      }
    },

    computed: {
      msg() {
        return window.MSG
      },

    },
    methods: {
      createBookmark(){
        if (this.name){
          this.$bus.$emit('create-bookmark', this.name)
          this.name = ''
        }
      }
    }

  }
</script>

<style scoped>

</style>
