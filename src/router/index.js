import Vue from 'vue'
import Router from 'vue-router'
import tableTree from '@/components/tableTree'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tableTree',
      component: tableTree
    }
  ]
})
