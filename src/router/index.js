import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cube-cut',
    name: 'cubeCut',
    component: () => import('../views/CubeCutView.vue')
  },
  {
    path: '/cube-join',
    name: 'cubeJoin',
    component: () => import('../views/CubeJoinView.vue')
  },
  {
    path: '/cuboid-cut',
    name: 'cuboidCut',
    component: () => import('../views/CuboidCutView.vue')
  },
  {
    path: '/cuboid-cut-cuboid',
    name: 'cuboidCutCuboid',
    component: () => import('../views/CuboidCutCuboidView.vue')
  },
  {
    path: '/cuboid-join',
    name: 'cuboidJoin',
    component: () => import('../views/CuboidJoinView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 