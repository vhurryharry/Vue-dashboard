import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import util from './util'

Vue.use(Vuex);

function intOrNull(val) {
  return val ? parseInt(val, 10) : null
}


export default new Vuex.Store({
  state: {},

  mutations: {
    selectDamage(state, damageId) {
      state.currentDamage = damageId
    },

    setEditDamage(state, damageId) {
      state.editDamage = damageId
    },

    selectImage(state, imageId) {
      state.currentImage = imageId
    },

    loadingOn(state) {
      state.loading = true
    },

    loadingOff(state) {
      state.loading = false
    },

    lockOn(state) {
      state.perms.can_change_survey = false
    },

    lockOff(state) {
      state.perms.can_change_survey = true
    },

    updateImage(state, data) {
      Vue.set(state.images, data.id, data)
    },

    updateFilters(state, filterData) {
      state.filters = filterData

      let currentDamageFound = this.getters.damages.filter(damage => {
        if (damage.id === this.state.currentDamage) {
          return true
        }
      })

      if (!currentDamageFound.length) {
        state.currentDamage = null
        state.currentImage = null
      }
    },

    damageUpdated(state, data) {
      let beingUpdatedDamage = state.damages.filter(damage => {
        if (damage.id === data.id) {
          return damage
        }
      })
      if (beingUpdatedDamage.length) {
        beingUpdatedDamage = beingUpdatedDamage[0]

        Object.keys(data).forEach(name => {
          beingUpdatedDamage[name] = data[name]
        })
      }

    },

    bookmarkUpdated(state, data) {
      let beingUpdatedBookmark = state.bookmarks.filter(bookmark => {
        if (bookmark.id === data.id) {
          return bookmark
        }
      })
      if (beingUpdatedBookmark.length) {
        beingUpdatedBookmark = beingUpdatedBookmark[0]

        Object.keys(data).forEach(name => {
          beingUpdatedBookmark[name] = data[name]
        })

          if (beingUpdatedBookmark.is_initial_position){
              state.bookmarks.forEach((bm) => {
                  bm.is_initial_position = bm.id === beingUpdatedBookmark.id
              })
          }
      }

    },

    setCompanionDamages(state, data) {
      Vue.set(state, 'damageCompanionList', data)
    },

    cleanCompanionDamages(state, data) {
      Vue.set(state, 'damageCompanionList', null)
    },

    setSimilarDamages(state, data) {
      Vue.set(state, 'damageSimilarList', data)
    },

    cleanSimilarDamages(state, data) {
      Vue.set(state, 'damageSimilarList', null)
    },

    newHistory(state, damage) {
      let {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square} = damage
      Vue.set(state, 'history', {is_damage, grade, types, notes, damage_id, component, geometry_type, length, width, square})
      Vue.set(state, 'historyId', damage.id)
    },

    reset(state) {
      this.dispatch('changeDamageInfo', {id: state.historyId, info: state.history})
    },

    addToShowInReport(state, {damageId, imageId}) {
      let damage = this.getters.getDamage(damageId)
      damage.image_ids_for_report.push(imageId)
    },

    removeFromShowInReport(state, {damageId, imageId}) {
      let damage = this.getters.getDamage(damageId),
        imageIndex = damage.image_ids_for_report.indexOf(imageId)
      damage.image_ids_for_report.splice(imageIndex, 1)
    },

    toggleBookmarks(state) {
      state.showBookmarks = !state.showBookmarks
      localStorage.setItem('showBookmarks', state.showBookmarks)
    },

    toggleLabels(state) {
      state.showLabels = !state.showLabels
      localStorage.setItem('showLabels', state.showLabels)
    },

    createBookmark(state, data) {
      state.bookmarks.unshift(data)
    },

    deleteBookmark(state, id) {
      let filtered = state.bookmarks.filter((bm) => {
        return bm.id !== id
      })
      Vue.set(state, 'bookmarks', filtered)
    },

    setBookmarkInitial(state, id) {
      state.bookmarks.forEach((bm) => {
        bm.is_initial_position = bm.id === id
      })
    },

    damageCreated(state, data) {
      state.damages.unshift(data)
    },

    damageOnImageRemoved(state, {damageId, imageId}) {
      const damage = this.getters.getDamage(damageId),
        imageIndex = damage.images.indexOf(imageId)
      damage.images.splice(imageIndex, 1)
    },

    damageDeleted(state, damageId) {
      let damageIndex = -1
      state.damages.forEach((damage, index) => {
        if (damage.id === damageId){
          damageIndex = index
        }
      })
      if (damageIndex >= 0){
        state.damages.splice(damageIndex, 1)
      }
    },

  },

  getters: {
    getDamage: (state) => (damageId) => {
      if (typeof damageId === 'string') {
        damageId = parseInt(damageId, 10)
      }

      let damages = state.damages
        .concat(state.damageCompanionList || [])
        .concat(state.damageSimilarList || [])

      return damages.filter(damage => damage.id === damageId)[0]
    },

    damages(state) {
      let typeFilter = intOrNull(state.filters.type),
        componentFilter = intOrNull(state.filters.component),
        idFilter = state.filters.id,
        geometryTypeFilter = intOrNull(state.filters.geometryType),
        gradeFilter = intOrNull(state.filters.grade),
        isDamageFilter = intOrNull(state.filters.isDamage)

      return state.damages.filter(damage => {
        let include = true;

        if (typeFilter !== null && damage.types.indexOf(typeFilter) === -1) {
          include = false
        }

        if (componentFilter !== null && damage.component !== componentFilter) {
          include = false
        }

        if (geometryTypeFilter !== null && damage.geometry_type !== geometryTypeFilter) {
          include = false
        }

        if (gradeFilter !== null && damage.grade !== gradeFilter) {
          include = false
        }

        if (isDamageFilter !== null && damage.is_damage !== Boolean(isDamageFilter - 1)) {
          include = false
        }

        if ((idFilter.length && !damage.damage_id)
          || (idFilter.length && damage.damage_id.indexOf(idFilter) === -1)) {
          include = false
        }

        return include
      }).sort((damage) => {
        return damage.id
      })
    },

    damageCompareList: (state) => (damage) => {
      return state.damages.filter(d => {
        return d.damage_class === damage.damage_class && d.id !== damage.id
      })
    },

    damageComponentName: (state) => (componentId) => {
      let component = state.components.filter(
        component => component.id === componentId)[0]
      if (component) {
        return component.name
      } else {
        return '-'
      }
    },

    damageTypeName: (state) => (damage) => {
      return damage.types.map(t => {
        return state.damageTypes[t][0]
      }).join(', ')
    },

    geometryTypeName: (state) => (geometryType) => {
      return state.geometryTypes[geometryType]
    },

    geometryTypeList: (state) => {
      return Object.entries(state.geometryTypes)
    },

    damageGradeName: (state) => (grade) => {
      return state.damageGrades[grade]
    },

    damageTypesForGeometry: (state) => (geometry_type) => {
      let result = {},
        entries = Object.entries(state.damageTypes),
        filtered = entries.filter(([_, value]) => {
          return geometry_type === value[1]
        }).forEach(([key, value]) => {
          result[key] = value[0]
        })
      return result
    },

    surveyDate: (state) => (surveyId) => {
      return state.surveys.filter(
        survey => survey.id === surveyId)[0].date
    },

  },

  actions: {
    loadDamageImages(context, damageId) {
      context.commit('loadingOn')
      let url = `/insights/api/image/?damages=${damageId}`

      Axios.get(url)
        .then(response => {
          if (response.status === 200) {

            response.data.forEach((value, index) => {
              context.commit('updateImage', value)
            })
            context.commit('loadingOff')
          }
        })
    },

    loadImage(context, imageId) {
      context.commit('loadingOn')
      let url = `/insights/api/image/?id=${imageId}`

      Axios.get(url)
        .then(response => {
          if (response.status === 200) {

            response.data.forEach((value, index) => {
              context.commit('updateImage', value)
            })
            context.commit('loadingOff')
          }
        })
    },

    changeDamageInfo(context, {id, info}) {
      return new Promise((resolve, reject) => {
        context.commit('loadingOn')
        let url = `/insights/api/damage/${id}/edit/`

        Axios.patch(url, info)
          .then(({data, status}) => {
            if (status === 200) {
              info.id = id
              context.commit('damageUpdated', data)
              context.commit('loadingOff')
              resolve()
            } else {
              context.commit('loadingOff')
              reject();
            }
          });
      })
    },

    loadCompanionDamages(context, damage) {
      context.commit('loadingOn')
      let projectId = context.state.projectId,
        damageId = damage.damage_id,
        url = `/insights/api/damage/${projectId}/?damage_id=${damageId}`

      Axios.get(url)
        .then(response => {
          if (response.status === 200) {
            // filter out current damage
            let data = response.data.filter((d) => {
              return damage.id !== d.id && damage.survey !== d.survey
            })

            context.commit('setCompanionDamages', data)
            context.commit('loadingOff')
          }
        })

    },

    loadSimilarDamages(context, damage) {
      context.commit('loadingOn')

      let projectId = context.state.projectId,
        componentId = damage.component,
        geometryType = damage.geometry_type,
        url = `/insights/api/damage/${projectId}/?component=${componentId}&geometry_type=${geometryType}`

      Axios.get(url)
        .then(response => {
          if (response.status === 200) {
            // filter out current damage
            let data = response.data.filter((d) => {
              return damage.id !== d.id && damage.survey !== d.survey
            })

            context.commit('setSimilarDamages', data)
            context.commit('loadingOff')
          }
        })

    },

    loadDamage(context, damageId) {
      context.commit('loadingOn')

      let projectId = context.state.projectId,
        url = `/insights/api/damage/${projectId}/?id=${damageId}`

      Axios.get(url)
        .then(response => {
          if (response.status === 200) {
            // filter out current damage
            let data = response.data.filter((d) => {
              return damageId !== d.id
            })

            context.commit('setSimilarDamages', data)
            context.commit('loadingOff')
          }
        })

    },

    toggleShowInReport(context, {damageId, imageId, current}) {
      context.commit('loadingOn')
      let url = `/insights/api/damage_on_image/${damageId}/${imageId}/`
      if (current) {
        Axios.delete(url).then(() => {
          context.commit('removeFromShowInReport', {damageId, imageId})
          context.commit('loadingOff')
        })
      } else {
        Axios.post(url).then(() => {
          context.commit('addToShowInReport', {damageId, imageId})
          context.commit('loadingOff')
        })
      }
    },

    updateImageCameraposition(context, {id, latitude, longitude, altitude, roll, pitch, yaw}){
        context.commit('loadingOn')
        let url = `/insights/api/image/${id}/`
        let _data = {latitude, longitude, altitude, roll, pitch, yaw}

        Axios.patch(url, _data).then(({status, data}) => {
            context.commit('updateImage', data)
            context.commit('loadingOff')
        })

    },

    createBookmark(context, {name, latitude, longitude, altitude, roll, pitch, yaw, screenshot}) {
      context.commit('loadingOn')
      let url = `/insights/api/bookmark/`
      let _data = {survey: INITIAL.surveyId, ...{name, latitude, longitude, altitude, roll, pitch, yaw, screenshot}}

      Axios.post(url, _data).then(({status, data}) => {
        context.commit('createBookmark', data)
        context.commit('loadingOff')
      })
    },

    deleteBookmark(context, id) {
      context.commit('loadingOn')
      let url = `/insights/api/bookmark/${id}/`

      Axios.delete(url).then(({status, data}) => {
        context.commit('deleteBookmark', id)
        context.commit('loadingOff')
      })
    },

    setBookmarkInitial(context, id) {
      context.commit('loadingOn')
      let url = `/insights/api/bookmark/${id}/`

      Axios.patch(url, {is_initial_position: true}).then(({status, data}) => {
        context.commit('setBookmarkInitial', id)
        context.commit('loadingOff')
      })
    },

    updateBookmark(context, {id, data}) {
      context.commit('loadingOn')
      let url = `/insights/api/bookmark/${id}/`

      Axios.patch(url, data).then(({status, data}) => {
        context.commit('bookmarkUpdated', data)
        context.commit('loadingOff')
      })
    },

    createDamage(context, newDamageData) {
      context.commit('loadingOn')
      let self = this

      return new Promise((resolve, reject) => {
        const projectId = INITIAL.projectId,
          surveyId = INITIAL.surveyId,
          url = `/insights/api/damage/${projectId}/`,
          requestData = {is_damage: true, survey: surveyId, ...newDamageData}

        Axios.post(url, requestData).then(
          ({status, data}) => {
            // created successfuly
            context.commit('damageCreated', data)
            resolve(data)

            // if imageId passed, then add that image to damage
            if (newDamageData.imageId) {
                self.dispatch('addDamageOnImage',
                  {damage: data.id,
                    image: newDamageData.imageId,
                    show_in_report: true})
            }

            context.commit('loadingOff')
          }).catch((error) => {
          reject(error.response.data)
          context.commit('loadingOff')
        })
      })
    },

    addDamageOnImage(context, {damage, image, show_in_report}){
      const url = `/insights/api/damage_on_image/`,
        requestData = {
          damage: damage,
          image: image,
          show_in_report: show_in_report,
        },
        damageData = this.getters.getDamage(damage)

      Axios.post(url, requestData)
        .then(({data, status}) => {
          context.commit('damageUpdated',
            {
              id: data.damage,
              images: damageData.images.concat([data.image]),
              image_ids_for_report: damageData.image_ids_for_report.concat([data.image])
            })
          context.commit('loadingOff')
        });
    },

    uploadImage(context, {damageId, file}) {
      context.commit('loadingOn')
      const formData = new FormData(),
        url = '/insights/api/image/'
        // self = this

      formData.append('survey', INITIAL.surveyId)
      formData.append('imagefile', file, file.name)

      return new Promise((resolve, reject) => {

        Axios.post(url, formData).then(({data}) => {
          context.commit('updateImage', data)

          this.dispatch('addDamageOnImage',
            {damage: damageId,
              image: data.id,
              show_in_report: true})

          resolve()

        })
      })
    },

    removeImage(context, {damageId, imageId}) {
      context.commit('loadingOn')
      const url = `/insights/api/image/${damageId}/${imageId}/`

        Axios.delete(url).then(({data}) => {
          context.commit('damageOnImageRemoved', {damageId, imageId})

          context.commit('loadingOff')
        })
    },

    deleteDamage(context, damageId) {
      context.commit('loadingOn')
      const url = `/insights/api/damage/${damageId}/edit/`

        return new Promise((resolve, reject) => {
          Axios.delete(url).then(({data}) => {
            resolve()
            context.commit('damageDeleted', damageId)
            context.commit('loadingOff')
          })
        })

    }

  }
})
