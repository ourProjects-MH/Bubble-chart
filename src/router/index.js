import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Update from '../views/Update.vue'
import PasswordChange from '../views/PasswordChange.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/admin',
    name: 'Update',
    component: Update
  },
  {
    path: '/changepassword',
    name: 'PasswordChange',
    component: PasswordChange
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
