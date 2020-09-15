<template>
  <div class="col-lg-6">
    <div v-if="damageCompanionList">
      <div v-if="damageCompanionList.length">
        <h1>{{msg.otherVersions}}</h1>
        <table class="table table-bordered">
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
          <damage-short v-for="damage in damageCompanionList" :damage="damage" :mainDamage="damageId"
                        :key="damage.id"></damage-short>
          </tbody>
        </table>
      </div>

      <div v-else>
        <h2>{{msg.noPreviousVersions}}</h2>
      </div>

      <div>
        <br>
        <router-link class="btn btn-default"
                     :to="{ name: 'DamageCompareList', params: { id: damageId }}">
          {{msg.lookForOther}}
        </router-link>
      </div>

    </div>

    <div v-else>
      <p>{{msg.loading}}</p>
    </div>


  </div>
</template>

<script>
  import DamageShort from './DamageShort'

  export default {
    name: "damage-companion-list",
    components: {DamageShort},
    computed: {
      damageId() {
        return this.$route.params.id
      },
      damage() {
        return this.$store.getters.getDamage(this.damageId)
      },
      damageCompanionList() {
        return this.$store.state.damageCompanionList
      },
      msg() {
        return window.MSG
      },
    },
    created(){
      this.$store.commit('cleanCompanionDamages')
    },

    mounted() {
      this.$store.dispatch('loadCompanionDamages', this.damage)
    }

  }
</script>

<style scoped>

</style>
