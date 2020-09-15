import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import DamageListMode from '../components/DamageListMode'
import DamageEditMode from '../components/DamageEditMode'
import DamageLabelEditMode from '../components/DamageLabelEditMode'
import DamageCreateMode from '../components/DamageCreateMode'
import DamageCompareMode from '../components/DamageCompareMode'
import DamageCompanionList from '../components/DamageCompanionList'
import DamageCompareList from '../components/DamageCompareList'
import DamageCompareDamage from '../components/DamageCompareDamage'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DamageList',
      component: DamageListMode
    },
    {
      path: '/create/:imageId',
      name: 'DamageCreateWithImage',
      component: DamageCreateMode
    },
    {
      path: '/create',
      name: 'DamageCreate',
      component: DamageCreateMode
    },
    {
      path: '/edit/:id',
      name: 'DamageEdit',
      component: DamageEditMode
    },
    {
      path: '/label/:id',
      name: 'DamageLabelEdit',
      component: DamageLabelEditMode
    },
    {
      path: '/compare/:id/',
      component: DamageCompareMode,
      children: [
        {
          path: '',
          name: 'DamageCompare',
          component: DamageCompanionList
        },
        {
          path: 'browse/',
          name: 'DamageCompareList',
          component: DamageCompareList
        },
        {
          path: 'to/:otherId',
          name: 'DamageCompareDamage',
          component: DamageCompareDamage
        }
      ]
    },

  ]
})
