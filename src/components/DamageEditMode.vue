<template>
  <div class="row">
    <div class="confirmWindow" v-if="showConfirmLeave">
      <div class="panel panel-warning">
        <div class="panel-heading">
          <strong>{{msg.confirmLeaveHeader}}</strong>
        </div>

        <div class="panel-body">
          {{msg.confirmLeaveText}}
        </div>
        <div class="panel-footer">
          <button class="btn btn-warning" @click.prevent="discardAndLeave">{{msg.discardAndLeave}}</button>
          <button class="btn btn-default" @click.prevent="hideConfirmLeaveDialog">{{msg.cancel}}</button>
        </div>
      </div>
    </div>


    <div class="col-lg-7">
      <damage-edit :damage="damage">
        <router-link class="btn btn-default"
                     :to="{ name: 'DamageList' }">
          {{msg.backToDamageList}}
        </router-link>

        <router-link class="btn btn-default"
                     :to="{ name: 'DamageCompare', params: { id: damage.id }}">
          <i class="glyphicon glyphicon-resize-horizontal"></i> {{msg.compare}}
        </router-link>

      </damage-edit>
    </div>

    <div class="col-lg-5">
      <damage-info :damage="damage"></damage-info>
    </div>
  </div>
</template>

<script>
  import DamageEdit from './DamageEdit'
  import DamageInfo from './DamageInfo'

  export default {
    name: "damage-edit-mode",
    components: {DamageEdit, DamageInfo},
    data() {
      return {
        showConfirmLeave: false,
        damageUnsaved: false,
        next: null,
      }
    },
    computed: {
      msg() {
        return window.MSG
      },
      damage() {
        return this.$store.getters.getDamage(this.$route.params.id)
      },
    },
    methods: {
      showConfirmLeaveDialog() {
        this.showConfirmLeave = true
      },

      hideConfirmLeaveDialog() {
        this.showConfirmLeave = false
      },

      discardAndLeave(){
        this.next()
      },

      showConfirm(e){
        if (this.damageUnsaved) {
          let confirmationMessage = "\o/";

          e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
          return confirmationMessage;              // Gecko, WebKit, Chrome <34
        }
      }
    },

    beforeRouteLeave (to, from, next) {
      if (this.damageUnsaved){
        this.showConfirmLeaveDialog()
        this.next = next
      } else {
        next()
      }
    },

    mounted() {
      this._handler = this.showConfirm.bind(this)

      this.$on('damageUnsaved', _ => {
        this.damageUnsaved = true
        window.addEventListener('beforeunload', this._handler)
      })

      this.$on('damageSaved', _ => {
        this.damageUnsaved = false
        window.removeEventListener('beforeunload', this._handler)
      })
    },

    beforeDestroy(){
      window.removeEventListener('beforeunload', this._handler)
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
