<template>
  <tr class="damage-row" @click="selectDamage">
    <td>{{ surveyDate }}</td>
    <td>{{ damage.damage_id }}</td>
    <td>{{componentName}}</td>
    <td>{{damage.dimensions}}</td>
    <td>{{typeName}}</td>
    <td><span v-if="damage.is_damage">{{gradeName}}</span></td>
    <td>{{damage.notes}}</td>
  </tr>
</template>

<script>
  export default {
    name: "damage-short",

    props: ['damage', 'mainDamage'],

    computed: {
      componentName(){
        return this.$store.getters.damageComponentName(this.damage.component)
      },

      typeName(){
        return this.$store.getters.damageTypeName(this.damage)
      },

      surveyDate(){
        return this.$store.getters.surveyDate(this.damage.survey)
      },

      geometryTypeName(){
        return this.$store.getters.geometryTypeName(this.damage.geometry_type)
      },

      gradeName(){
        return this.$store.getters.damageGradeName(this.damage.grade)
      },

    },

    methods: {
      selectDamage(){
        this.$router.push({name: 'DamageCompareDamage', params: {id: this.mainDamage, otherId: this.damage.id}})
      }
    }
  }
</script>

<style scoped>
  .damage-row:hover {
    background-color: silver;
    cursor: pointer;
  }
</style>
