<template>
  <tr class="damage-row" :class="classObject">
    <td>
      <i v-if="damage.is_damage" class="glyphicon glyphicon-ok"></i>
      <i v-else class="glyphicon glyphicon-remove"></i>
    </td>
    <td>
      <i v-if="damage.is_manual" class="glyphicon glyphicon-ok"></i>
      <i v-else class="glyphicon glyphicon-remove"></i>
    </td>
    <td :class="{warning: damage.is_damage && !damage.damage_id}">{{ damage.damage_id }}</td>
    <td :class="{warning: damage.is_damage && !damage.component}">{{componentName}}</td>
    <td>{{geometryTypeName}}</td>
    <td :class="{warning: damage.is_damage && ((damage.geometry_type === 1 && (damage.length === 0 || damage.width === 0)) || (damage.geometry_type === 2 && damage.square === 0))}">{{damage.dimensions}}</td>
    <td :class="{warning: damage.is_damage && !damage.types.length}">{{typeName}}</td>
    <td :class="{warning: damage.is_damage && !damage.grade}"><span v-if="damage.is_damage">{{gradeName}}</span></td>
    <td>{{damage.notes}}</td>
    <td :class="{warning: damage.is_damage && !damage.image_ids_for_report.length}"><span v-if="damage.is_damage">{{damage.image_ids_for_report.length}}</span></td>
    <td>
      <router-link
        class="btn btn-default"
        :to="{ name: 'DamageLabelEdit', params: { id: damage.id }}"
        :title="msg.customizeLabel"
        v-if="canChangeSurvey"
      >
        <i class="glyphicon glyphicon-tag"></i>
      </router-link>
      <router-link
        class="btn btn-default"
        :to="{ name: 'DamageEdit', params: { id: damage.id }}"
        :title="msg.edit"
      >
        <i class="glyphicon glyphicon-edit"></i>
      </router-link>
      <router-link
        class="btn btn-default"
        :to="{ name: 'DamageCompare', params: { id: damage.id }}"
        :title="msg.compare">
        <i class="glyphicon glyphicon-resize-horizontal"></i>
      </router-link>
    </td>
  </tr>
</template>

<script>
  export default {
    name: "damage",

    props: ['damage'],

    computed: {
      classObject(){
        return {
          active: this.$store.state.currentDamage === this.damage.id
        }
      },

      componentName(){
        return this.$store.getters.damageComponentName(this.damage.component)
      },

      typeName(){
        return this.$store.getters.damageTypeName(this.damage)
      },

      canChangeSurvey() {
        return this.$store.state.perms.can_change_survey
      },

      geometryTypeName(){
        return this.$store.getters.geometryTypeName(this.damage.geometry_type)
      },

      gradeName(){
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
