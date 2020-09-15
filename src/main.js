// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import store from './store.js'

Vue.config.productionTip = false


import Axios from 'axios';

Axios.defaults.xsrfCookieName = 'csrftoken'
Axios.defaults.xsrfHeaderName = 'X-CSRFToken'

let initialState = Object.assign(
  {},
  INITIAL,
  {
    currentDamage: null,
    editDamage: null,
    currentImage: null,
    filters: {
      id: '',
      component: '',
      class: '',
      geometryType: '',
      grade: '',
      type: '',
      isDamage: ''
    },
    loading: false,
    images: {},
    history: [],
    historyId: '',
    showBookmarks: localStorage.getItem('showBookmarks') === 'true',
    showLabels: localStorage.getItem('showLabels') === 'true',
  });


store.replaceState(initialState)

const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', {get(){return this.$root.bus}});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    bus
  },
  // router,
  store,
  components: { App },
  template: '<App/>'
})
