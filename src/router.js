import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Registration from '@/components/Register'
import MainView from '@/components/views/MainView'
import Channel from '@/components/views/Channel'
import AuthGuard from './utils/auth-guard'
import AddGroupForm from '@/components/AddGroupForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      beforeEnter: AuthGuard,
      name: 'main',
      component: MainView,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Channel
        },
        {
          path: 'create-group',
          name: 'create-group',
          component: AddGroupForm
        }
      ]
    },
    {
      path: '/signin',
      name: 'signin',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Registration
    }
  ]
})
