<template>
    <div class="filters-bar">
      <form action="" class="form-inline" @submit.prevent="filterChanged">

        <div class="form-group">
          <label>{{msg.id}}</label>
          <input type="text" name="" class="form-control" v-model="filters.id">
        </div>

        <div class="form-group">
          <label>{{msg.geometryType}}</label>
          <select v-model="filters.geometryType" name="" class="form-control">
            <option value="">{{msg.all}}</option>
            <option v-for="(name, id) in geometryTypes" :value="id">{{name}}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{msg.type}}</label>
          <select v-model="filters.type" name="" class="form-control">
            <option value="">{{msg.all}}</option>
            <option v-for="(name, id) in damageTypes" :value="id">{{name[0]}}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{msg.grade}}</label>
          <select v-model="filters.grade" name="" class="form-control">
            <option value="">{{msg.all}}</option>
            <option v-for="(name, id) in damageGrades" :value="id">{{name}}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{msg.component}}</label>
          <select v-model="filters.component" name="" class="form-control">
            <option value="">{{msg.all}}</option>
            <option v-for="type in componentTypes" :value="type.id" :disabled="type.depth === 0">&nbsp;{{type | padTypeName}}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{msg.isDamage}}</label>
          <select v-model.number="filters.isDamage" name="" class="form-control">
            <option value="">{{msg.all}}</option>
            <option value="2">{{msg.damage}}</option>
            <option value="1">{{msg.notADamage}}</option>
          </select>
        </div>
        <div class="form-group pull-right">
          <router-link v-if="canChangeSurvey" class="btn btn-default" :to="{ name: 'DamageCreate'}" :title="msg.createDamageDesc">
            {{msg.createDamage}}
          </router-link>

          <button class="btn btn-primary" @click.prevent="toggleBookmarks">
            {{ showBookmarks ? msg.hideBookmarks : msg.showBookmarks }}
          </button>

          <button class="btn btn-default" @click.prevent="toggleLabels">
            {{ showLabels ? msg.hideLabels : msg.showLabels }}
          </button>

        </div>

      </form>

    </div>
</template>

<script>




  export default {
    name: "filters-bar",

    filters: {
      padTypeName(type){
        return ' '.repeat(type.depth) + type.name
      }
    },

    computed: {
      msg() {
        return window.MSG
      },

      filters(){
        return this.$store.state.filters
      },

      damageTypes(){
        return this.$store.state.damageTypes
      },

      geometryTypes(){
        return this.$store.state.geometryTypes
      },

      damageGrades(){
        return this.$store.state.damageGrades
      },

      componentTypes(){
        return this.$store.state.components
      },

      showBookmarks(){
        return this.$store.state.showBookmarks
      },

      showLabels(){
        return this.$store.state.showLabels
      },

      canChangeSurvey() {
        return this.$store.state.perms.can_change_survey
      },
    },

    methods: {
      toggleBookmarks() {
        this.$store.commit('toggleBookmarks')
      },

      toggleLabels() {

        if (this.$store.state.showLabels) {
          viewer.entities.values.forEach((entity) => {
            entity.label.show = false
          })

        } else {
          viewer.entities.values.forEach((entity) => {
            entity.label.show = true
          })

        }

        this.$store.commit('toggleLabels')


      }
    }
  }
</script>

<style scoped>
</style>
