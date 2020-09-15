<template>
  <ul class="list-group bookmarks-list">
    <create-bookmark></create-bookmark>
    <bookmark v-for="bookmark in bookmarks" :bookmark="bookmark" :key="bookmark.id"></bookmark>
  </ul>

</template>

<script>
  import Bookmark from './Bookmark'
  import CreateBookmark from './CreateBookmark'

  export default {
    name: "bookmark-list",

    computed: {
      msg() {
        return window.MSG
      },

      bookmarks(){
        return this.$store.state.bookmarks
      }
    },

    components: {Bookmark, CreateBookmark}
  }
</script>

<style scoped>
.bookmarks-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
