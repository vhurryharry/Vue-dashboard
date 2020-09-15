<template>
  <div class="col-lg-6">
    <h1>{{msg.similarDamages}}:</h1>
    <table class="table table-bordered" v-if="damageSimilarList">
      <thead>
      <tr>
        <th>{{msg.surveyDate}}</th>
        <th>{{msg.id}}</th>
        <th>{{msg.component}}</th>
        <th>{{msg.dimensions}}</th>
        <th>{{msg.type}}</th>
        <th>{{msg.grade}}</th>
        <th>{{msg.notes}}</th>
      </tr>
      </thead>
      <tbody>
      <damage-short v-for="damage in damageSimilarList" :damage="damage" :mainDamage="damageId" :key="damage.id"></damage-short>
      </tbody>
    </table>

    <div v-else>{{msg.loading}}</div>
    <br>
    <router-link class="btn btn-default"
                 :to="{ name: 'DamageCompare', params: { id: damageId }}">
      {{msg.back}}
    </router-link>
  </div>
</template>

<script>
  import DamageShort from './DamageShort'

  export default {
    name: "damage-compare-list",
    components: {DamageShort},
    computed: {
      damageId() {
        return this.$route.params.id
      },
      damage() {
        return this.$store.getters.getDamage(this.damageId)
      },

      damageSimilarList() {
        return this.$store.state.damageSimilarList
      },
      msg(){
        return window.MSG
      }
    },
    created(){
      this.$store.commit('cleanSimilarDamages')
    },

    mounted(){
      this.$store.dispatch('loadSimilarDamages', this.damage)
    }
  }
</script>

<style scoped>

</style>
