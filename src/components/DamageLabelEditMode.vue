<template>
    <div class="row">
        <div class="col-lg-12">

            <h2>Label offset</h2>
            <div class="filters-bar">
              <form action="" class="form-inline" @submit.prevent="">

                <div class="form-group">
                  <label>{{msg.xOffset}}</label> <input type="number" required name="" class="form-control"
                                                        v-model="label_x_offset">
                </div>
                <div class="form-group">
                  <label>{{msg.yOffset}}</label> <input type="number" required name="" class="form-control"
                                                        v-model="label_y_offset">
                </div>
                <div class="form-group">
                  <label>{{msg.zOffset}}</label> <input type="number" required name="" class="form-control"
                                                        v-model="label_z_offset">
                </div>
                <div class="form-group">
                  <label>{{msg.labelBackColor}}</label>
                  <div class="input-group color-picker" ref="colorpicker">
                    <input type="text" class="form-control" v-model="colorValue" @focus="showPicker()"
                           @input="updateFromInput"/>
                    <span class="input-group-addon color-picker-container">
                        <span class="current-color" :style="'background-color: ' + colorValue"
                              @click="togglePicker()"></span>
                        <chrome-picker :value="colors" @input="updateFromPicker" v-if="displayPicker"/>
                      </span>
                  </div>
                </div>

                <button class="btn btn-success" @click.prevent="save">Save</button>
                <button class="btn btn-warning" @click.prevent="reset">Reset</button>

                <router-link class="btn btn-default"
                             :to="{ name: 'DamageList' }">
                  {{msg.backToDamageList}}
                </router-link>
              </form>
            </div>
        </div>
    </div>
</template>

<script>
  import { Chrome } from 'vue-color'
  import colors from 'vue-color'

  export default {
    name: "damage-labe-edit-mode",
    components: {'chrome-picker': Chrome},
    props: ['color'],
    data() {
      let defaultColor = '#FF0000'
      let displayPicker = false
      let colorValue = ""
      let damage = this.$store.getters.getDamage(this.$route.params.id)
      let {label_x_offset, label_y_offset, label_z_offset, label_background_color} = damage
      return {
        label_x_offset,
        label_y_offset,
        label_z_offset,
        label_background_color,
        colorValue,
        defaultColor,
        displayPicker
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
      reset() {
        this.label_x_offset = 0
        this.label_y_offset = 0
        this.label_z_offset = 0
        this.label_background_color = 'rgba(255,255,255,0.5)'
        this.save()
      },

      setColor(color) {
        this.updateColors(color);
        this.colorValue = color;
      },
      updateColors(color) {
        if (color.slice(0, 1) == '#') {
          this.colors = {
            hex: color
          };
        }
        else if (color.slice(0, 4) == 'rgba') {
          var rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(','),
            hex = '#' + ((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1);
          this.colors = {
            hex: hex,
            a: rgba[3],
          }
        }
      },
      showPicker() {
        document.addEventListener('click', this.documentClick);
        this.displayPicker = true;
      },
      hidePicker() {
        document.removeEventListener('click', this.documentClick);
        this.displayPicker = false;
      },
      togglePicker() {
        this.displayPicker ? this.hidePicker() : this.showPicker();
      },
      updateFromInput() {
        this.updateColors(this.colorValue);
      },
      updateFromPicker(color) {

        this.colors = color;

        if (color.rgba.a == 1) {
          this.colorValue = color.hex;
          this.label_background_color = 'rgba(' + color.rgba.r + ', ' + color.rgba.g + ', ' + color.rgba.b + ', ' + color.rgba.a + ')'
        }
        else {
          this.colorValue = 'rgba(' + color.rgba.r + ', ' + color.rgba.g + ', ' + color.rgba.b + ', ' + color.rgba.a + ')';
          this.label_background_color = 'rgba(' + color.rgba.r + ', ' + color.rgba.g + ', ' + color.rgba.b + ', ' + color.rgba.a + ')'
        }
      },
      documentClick(e) {
        var el = this.$refs.colorpicker,
          target = e.target;
        if (el !== target && !el.contains(target)) {
          this.hidePicker()
        }
      },


      save() {
        let {label_x_offset, label_y_offset, label_z_offset, label_background_color} = this
        let info = {label_x_offset, label_y_offset, label_z_offset, label_background_color}
        this.$store.dispatch('changeDamageInfo', {id: this.damage.id, info: info}).then(_ => {
          this.$bus.$emit('updateDamageLabelOffset', {id: this.damage.id, ...info})
        })
      }
    },
    mounted() {
      this.$bus.$emit('highlightDamageLabel', this.damage.id)

      let rgba = this.damage.label_background_color.replace(/^rgba?\(|\s+|\)$/g, '').split(',')
      let hex = '#' + ((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1);
      this.setColor(this.color || hex);

    },
    destroyed() {
      this.$bus.$emit('unhighlightDamageLabel')
    },
  }
</script>

<style scoped>

.current-color {
	display: inline-block;
	width: 16px;
	height: 16px;
	background-color: #000;
	cursor: pointer;
}

</style>
