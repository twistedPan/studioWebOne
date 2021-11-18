import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Map',
    component: () => import(/* webpackChunkName: "about" */ '../views/Map.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
