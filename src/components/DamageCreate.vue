<template>
<div>

  <div v-if="image" class="col-lg-4 col-lg-offset-4">
    <img :src="image.thumbnail" alt="">
  </div>

  <div class="col-lg-8 col-lg-offset-2">
    <form action="" class="form" @submit.prevent="create">
      <div class="row">
        <div class="col-lg-6 form-group">
          <label>{{msg.component}}</label>
          <select class="form-control" v-model.number="component" required :disabled="!canChangeSurvey">
            <option value="">-</option>
            <option v-for="c in componentList" :disabled="c.depth === 0" :value="c.id">{{c.name}}</option>
          </select>
        </div>

        <div class="col-lg-6 form-group">
          <label>{{msg.id}}</label>
          <input type="text" class="form-control" v-model="damage_id" required :disabled="!canChangeSurvey">
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 form-group">
          <label>{{msg.geometryType}}</label>

          <select class="form-control" v-model.number="geometry_type" required :disabled="!canChangeSurvey">
            <option value="">-</option>
            <option v-for="[id, name] in geometryTypes" :value="id">{{name}}</option>
          </select>
        </div>

        <div v-if="isLinear">
          <div class="col-lg-3 form-group" :class="{'has-error': errors.width}">
            <label>{{msg.width}}</label>
            <div class="controls">
              <div class="input-group">
                <input type="text" class="form-control" v-model.number="width" required :disabled="!canChangeSurvey">
                <span class="input-group-addon">mm</span>
              </div>
              <span class="help-block" v-for="e in errors.width">{{e}}</span>
            </div>
          </div>

          <div class="col-lg-3 form-group" :class="{'has-error': errors.length}">
            <label>{{msg.length}}</label>
            <div class="controls">
              <div class="input-group">
                <input type="text" class="form-control" v-model.number="length" required :disabled="!canChangeSurvey">
                <span class="input-group-addon">mm</span>
              </div>
              <span class="help-block" v-for="e in errors.length">{{e}}</span>
            </div>
          </div>
        </div>

        <div class="col-lg-6 form-group" :class="{'has-error': errors.square}" v-if="isArea">
          <label>{{msg.square}}</label>
          <div class="controls">
            <div class="input-group">
              <input type="text" class="form-control"
                     :class="{'form-control-danger': errors.square}" v-model.number="square" required :disabled="!canChangeSurvey">
              <span class="input-group-addon">m²</span>
            </div>
            <span class="help-block" v-for="e in errors.square">{{e}}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <input class="btn btn-success" type="submit" :value="msg.createDamage">

          <router-link class="btn btn-default" :to="{ name: 'DamageList' }">
            {{msg.backToDamageList}}
          </router-link>

        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: "damage-create",

    props: [],

    data(){
      return {
        geometry_type: '',
        component: '',
        damage_id: '',
        width: 0,
        length: 0,
        square: 0,
        types: [],
        errors: {}
      }
    },

    computed: {
      imageId(){
        const imageId = this.$route.params.imageId
        return imageId ? parseInt(imageId, 10) : null
      },

      image(){
        const image = this.$store.state.images[this.imageId]
        if (this.imageId && !image) {
          // image not loaded yet
          this.$store.dispatch('loadImage', this.imageId)
        }
        return image
      },

      isArea() {
        return this.geometry_type === 2
      },

      isLinear() {
        return this.geometry_type === 1
      },

      msg() {
        return window.MSG
      },

      ...mapState({
        componentList: 'components',
        canChangeSurvey: state => state.perms.can_change_survey
      }),

      ...mapGetters({
        geometryTypes: 'geometryTypeList'
      })
    },

    methods: {
      create() {
        this.errors = {}

        let newDamageData = this._data
        if (this.imageId){
          newDamageData.imageId = this.imageId
        }

        this.$store.dispatch('createDamage', newDamageData).then(
          data => {
            this.$router.push({name: 'DamageEdit', params: {id: data.id}})
          },

          errorData => {
            this.errors = errorData
          }
        )
      }
    }
  }
</script>

<style scoped>
</style>
