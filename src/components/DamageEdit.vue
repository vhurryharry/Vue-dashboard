<template>
  <div>
    <div class="confirmWindow" v-if="showConfirmDelete">
      <div class="panel panel-danger">
        <div class="panel-heading">
          <strong>{{msg.confirmDeleteHeader}}</strong>
        </div>

        <div class="panel-body">
          {{msg.confirmDeleteText}}
        </div>
        <div class="panel-footer">
          <button class="btn btn-danger" @click.prevent="deleteDamage">{{msg.delete}}</button>
          <button class="btn btn-primary" @click.prevent="hideConfirmDeleteDialog">{{msg.cancel}}</button>
        </div>
      </div>
    </div>


    <form action="" class="form">
      <div class="row">
        <div class="col-lg-4 form-group">
          <label>{{msg.component}}</label>
          <select class="form-control" v-model.number="damageData.component" :disabled="!canChangeSurvey">
            <option value="">-</option>
            <option v-for="c in componentList" :disabled="c.depth === 0" :value="c.id">{{c.name}}</option>
          </select>
        </div>
        <div class="col-lg-2 form-group">
          <label> {{msg.isDamage}}</label>
          <p>
            <input class="form" type="checkbox" name="is_damage" v-model="damageData.is_damage" :disabled="!canChangeSurvey">
          </p>
        </div>
        <div class="col-lg-3 form-group">
          <label>{{msg.id}}</label>
          <input type="text" class="form-control" v-model="damageData.damage_id" :disabled="!canChangeSurvey">
        </div>
        <div class="col-lg-3 form-group">
          <label>{{msg.grade}}</label>
          <select class="form-control" v-model.number="damageData.grade" :disabled="!canChangeSurvey">
            <option v-for="(name, id) in damageGrades" :value="id">{{name}}</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-4 form-group">
          <label>{{msg.geometryType}}</label>
          <select v-model.number="damageData.geometry_type" name="" class="form-control">
            <option v-for="(name, id) in geometryTypes" :value="id">{{name}}</option>
          </select>
        </div>

        <div class="col-lg-4 form-group" v-if="isArea">
          <label>{{msg.square}}</label>
          <div class="input-group">
            <input type="text" class="form-control" v-model.number="damageData.square" :disabled="!canChangeSurvey">
            <span class="input-group-addon">m²</span>
          </div>
        </div>

        <div v-if="isLinear">
          <div class="col-lg-4 form-group">
            <label>{{msg.length}}</label>
            <div class="input-group">
              <input type="text" class="form-control" v-model.number="damageData.length" :disabled="!canChangeSurvey">
              <span class="input-group-addon">mm</span>
            </div>
          </div>

          <div class="col-lg-4 form-group">
            <label>{{msg.width}}</label>
            <div class="input-group">
              <input type="text" class="form-control" v-model.number="damageData.width" :disabled="!canChangeSurvey">
              <span class="input-group-addon">mm</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div v-for="(name, id) in damageTypes" class="col-lg-3 form-group">
          <label :value="id">
            <input type="checkbox" :value="id" v-model.number="damageData.types" :disabled="!canChangeSurvey">
            {{name}}</label>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12 form-group">
          <label>{{msg.notes}}</label>
          <input type="text" class="form-control" v-model="damageData.notes" :disabled="!canChangeSurvey">
        </div>
      </div>
    </form>

    <div class="row" v-if="canChangeSurvey">
      <div class="col-lg-12">
        <form v-if="!uploading" action="" class="form" enctype="multipart/form-data">
          <label for="">Upload image file</label>
          <input
                 type="file"
                 @change="imageFileSelected"
                 accept="image/*">
        </form>

        <div v-else>Uploading...</div>
      </div>
    </div>
    <br><br>
    <slot></slot>
    <button class="btn btn-danger"
            v-if="damage.is_manual"
            @click.prevent="showConfirmDeleteDialog">{{msg.deleteDamage}}</button>
    <button class="btn btn-success" v-if="isChanged" @click.prevent="save">{{msg.save}}</button>

  </div>
</template>

<script>
  function eqSet(as, bs) {
    if (as.size !== bs.size) return false
    for (var a of as) if (!bs.has(a)) return false
    return true;
  }

  export default {
    name: "damage-edit",

    props: ['damage'],
    data(){
      let {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square} = this.damage

      return {
        uploading: false,
        showConfirmDelete: false,
        damageData: {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square}
      }
    },

    computed: {
      componentList(){
        return this.$store.state.components
      },

      isChanged() {
        let {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square} = this.damageData,
          d = this.damage,
          typesSet1 = new Set(types),
          typesSet2 = new Set(this.damage.types)

        if (d.is_damage !== is_damage
          || d.grade !== grade
          || d.component !== component
          || d.geometry_type !== geometry_type
          || d.square !== square
          || d.length !== length
          || d.width !== width
          || d.damage_id !== damage_id
          || !eqSet(typesSet1, typesSet2)
          || d.notes !== notes) {
          return true
        }
        return false
      },

      damageTypes() {
        return this.$store.getters.damageTypesForGeometry(this.damageData.geometry_type)
      },

      geometryTypeName() {
        return this.$store.getters.geometryTypeName(this.damage.geometry_type);
      },

      geometryTypes(){
        return this.$store.state.geometryTypes
      },

      damageGrades() {
        return this.$store.state.damageGrades;
      },

      canChangeSurvey() {
        return this.$store.state.perms.can_change_survey
      },

      isArea() {
        return this.damageData.geometry_type === 2
      },

      isLinear() {
        return this.damageData.geometry_type === 1
      },

      msg() {
        return window.MSG
      }
    },

    mounted(){
      this.$bus.$emit('showOnlyDamage', this.damage.id)
    },

    updated(){
      if (this.isChanged) {
        this.$parent.$emit('damageUnsaved')
      } else {
        this.$parent.$emit('damageSaved')
      }
    },

    methods: {
      save() {
        this.$store.dispatch('changeDamageInfo', {id: this.damage.id, info: this.damageData}).then(_ => {
          let {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square} = this.damage
          this.damageData = {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square}
          this.$bus.$emit('updateDamageLabel', {id: this.damage.id, label: damage_id})
        })
        this.$parent.$emit('damageSaved')
      },

      showConfirmDeleteDialog(){
        this.showConfirmDelete = true
      },

      hideConfirmDeleteDialog(){
        this.showConfirmDelete = false
      },

      deleteDamage() {
        this.$store.dispatch('deleteDamage', this.damage.id)
        this.$router.push({name: 'DamageList'})
      },

      imageFileSelected(event){
        const fileList = event.target.files
        if (!fileList.length) return

        this.uploading = true

        this.$store.dispatch('uploadImage', {damageId: this.damage.id, file: fileList[0]})
          .then(() => {
            this.uploading = false
          })

      },
    }
  }
</script>

<style scoped>
  .confirmWindow {
    z-index: 99999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(65, 64, 65, 0.49);
    text-align: center;
  }

  .confirmWindow .panel {
    text-align: left;
    display: inline-block;
    width: 30%;
    margin-top: 10%;
    box-shadow: 5px 5px 8px #575757;
  }
</style>
