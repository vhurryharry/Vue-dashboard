<template>
  <div>
    <form action="" class="form">
      <div class="row">
        <div class="col-lg-4 form-group">
          <label>{{msg.component}}</label>
          <p class="form-control-static">
            {{componentName}}
          </p>
        </div>
        <div class="col-lg-2 form-group">
          <label> {{msg.isDamage}}</label>
          <p class="form-control-static">
            <i v-if="damage.is_damage" class="glyphicon glyphicon-ok"></i>
            <i v-else class="glyphicon glyphicon-remove"></i>
          </p>
        </div>
        <div class="col-lg-3 form-group">
          <label>{{msg.id}}</label>
          <p class="form-control-static">
            {{damage.damage_id}}
          </p>
        </div>
        <div class="col-lg-3 form-group">
          <label>{{msg.grade}}</label>
          <p class="form-control-static">
            {{damageGradeName}}
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-4 form-group">
          <label>{{msg.geometryType}}</label>
          <p class="form-control-static">
            {{geometryTypeName}}
          </p>
        </div>

        <div class="col-lg-4 form-group">
          <label>{{msg.dimensions}}</label>
          <p class="form-control-static">
            {{damage.dimensions}}
          </p>
        </div>

        <div class="col-lg-4 form-group">
          <label>{{msg.type}}</label>
          <p class="form-control-static">
            {{typeName}}
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12 form-group">
          <label>{{msg.notes}}</label>
          <p  class="form-control-static">
            {{damage.notes}}
          </p>
        </div>
      </div>
    </form>

    <slot></slot>

  </div>
</template>

<script>
  export default {
    name: "damage-view",

    props: ['damage'],

    computed: {
      componentName(){
        return this.$store.getters.damageComponentName(this.damage.component)
      },

      geometryTypeName() {
        return this.$store.getters.geometryTypeName(this.damage.geometry_type);
      },

      damageGradeName() {
        return this.$store.getters.damageGradeName(this.damage.grade);
      },

      typeName(){
        return this.$store.getters.damageTypeName(this.damage)
      },

      msg() {
        return window.MSG
      }
    }
  }
</script>

<style scoped>
</style>
