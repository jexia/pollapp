import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },

  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },

  {
    path: '/update/:id',
    name: 'update',
    component: () => import(/* webpackChunkName: "update" */ '@/views/Polls/Update.vue'),
    props: true
  },

  {
    path: '/results/:id',
    name: 'results',
    component: () => import(/* webpackChunkName: "results" */ '@/views/Polls/Results.vue'),
    props: true
  },

  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '@/views/Polls/Create.vue')
  },

  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router