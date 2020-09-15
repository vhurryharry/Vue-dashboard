<template>
  <div id="app">
    <loader v-if="loading"></loader>
    <locked-bar v-if="locked" :user="lockedByUser"></locked-bar>
    <div class="row" v-if="showBookmarks">
      <div class="col-lg-10">
        <three-d-view></three-d-view>
      </div>
      <div class="col-lg-2">
        <bookmark-list></bookmark-list>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-lg-12">
        <three-d-view></three-d-view>
      </div>
    </div>

      <router-view></router-view>

    <image-big v-if="currentImage" :imageId="currentImage"></image-big>
  </div>
</template>

<script>
  import ThreeDView from './components/ThreeDView'
  import Loader from './components/Loader'
  import LockedBar from './components/LockedBar'
  import ImageBig from './components/ImageBig'
  import BookmarkList from './components/BookmarkList'

  import router from './router'

  import Axios from 'axios'

  window.MSG = {
    xOffset: gettext('X Offset'),
    yOffset: gettext('Y Offset'),
    zOffset: gettext('Z Offset'),
    labelBackColor: gettext('Background Color'),
    latitude: gettext('Latitude'),
    longitude: gettext('Longitude'),
    altitude: gettext('Altitude'),
    saveCameraPosition: gettext('Save camera position'),
    saveAndLeave: gettext('Save and leave'),
    discardAndLeave: gettext('Discard and leave'),
    confirmDeleteHeader: gettext('Confirm delete'),
    confirmDeleteText: gettext('Deletion can be undone'),
    confirmLeaveHeader: gettext('Confirm'),
    confirmLeaveText: gettext('You did not save your changes'),
    reportImagesNumber: gettext('Report images number'),
    delete: gettext('Delete'),
    cancel: gettext('Cancel'),
    reset: gettext('Reset'),
    remove: gettext('Remove'),
    deleteDamage: gettext('Delete this damage'),
    areYouSure: gettext('Are you sure? This action is irreversible.'),
    damageType: gettext('Damage type'),
    geometryType: gettext('Geometry type'),
    grade: gettext('Grade'),
    setInitialPosition: gettext('Set as initial camera position'),
    length: gettext('Length'),
    customizeLabel: gettext('Customize label position'),
    width: gettext('Width'),
    square: gettext('Area'),
    notes: gettext('Notes'),
    id: gettext('ID'),
    close: gettext('Close'),
    damages: gettext('Damages'),
    component: gettext('Component'),
    types: gettext('Types'),
    type: gettext('Type'),
    dimensions:  gettext('Dimensions'),
    all: gettext('All'),
    loading: gettext('Loading...'),
    showInReport: gettext('Show in report'),
    flyTo: gettext('Fly to'),
    edit: gettext('Edit'),
    save: gettext('Save'),
    compare: gettext('Compare'),
    compareDamage: gettext('Compare damage'),
    selectAnother: gettext('Select another'),
    toDamage: gettext('to damage'),
    selectDamageToCompare: gettext('Select damage to compare to'),
    similarDamages: gettext('Similar damages'),
    compareToOtherVersions: gettext('Compare to other versions:'),
    otherVersions: gettext('Other versions of this damage:'),
    backToDamageList: gettext('Back to damage list'),
    clickToClose: gettext('Click to close'),
    isDamage: gettext('Is a damage?'),
    damage: gettext('Damage'),
    notADamage: gettext('Not a damage'),
    survey: gettext('Survey'),
    surveyDate: gettext('Survey date'),
    lookForOther: gettext('Look for other damages'),
    back: gettext('Back'),
    noPreviousVersions: gettext('No previous versions of this damage'),
    bookmarkName: gettext('Bookmark name'),
    showBookmarks: gettext('Show bookmarks'),
    hideBookmarks: gettext('Hide bookmarks'),
    showLabels: gettext('Show 3d labels'),
    hideLabels: gettext('Hide 3d labels'),
    bookmarkThis: gettext('Bookmark this position'),
    createDamage: gettext('Create damage'),
    createDamageDesc: gettext('Create a new damage, that did not exist before in this survey'),
    addedManually: gettext('Added manually'),
    isAddedManually: gettext('Is added manually?'),
  }

  export default {
    name: 'App',
    router,
    data(){
      return {
        locked: false,
        lockedByUser: null
      }
    },

    components: {ThreeDView, Loader, LockedBar, ImageBig, BookmarkList},

    computed: {
      currentDamage(){
        let currentDamageId = this.$store.state.currentDamage

        if (currentDamageId){
          return this.$store.state.damages.filter(
            damage => damage.id === currentDamageId)[0]
        } else {
          return null;
        }
      },

      showBookmarks(){
        return this.$store.state.showBookmarks
      },

      showLabels(){
        return this.$store.state.showLabels
      },

      loading(){
        return this.$store.state.loading
      },

      currentImage(){
        return this.$store.state.currentImage
      },

      editDamageId(){
        return this.$store.state.editDamage
      }

    },

    created () {
      // if current user is Expert (can expertize_project), run periodic task to either
      // update survey lock or wait for lock release
      if (INITIAL.perms.can_change_survey) {
        let self = this

        let watcher = function () {
          Axios.get('/insights/api/aquire_survey_lock/' + INITIAL.surveyId + '/').then(({data, status}) => {
            if (data.status === 'ok') {
              self.locked = false
              self.$store.commit('lockOff')
            } else {
              self.locked = true
              self.lockedByUser = data.user
              self.$store.commit('lockOn')
            }
          })
        }
        watcher()
        setInterval(watcher, INITIAL.lock_update_period * 1000)
      }
    }

  }
</script>

<style>
  .filters-bar {
    border: solid thin #ddd;
    padding: 1em;
    margin-top: 1em;
    margin-bottom: 1em;
  }
</style>
