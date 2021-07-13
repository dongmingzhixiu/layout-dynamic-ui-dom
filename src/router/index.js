import Vue from 'vue'
import Router from 'vue-router'
import home from '@/home'
import classPage from '@/pages/drive-page/class'
import login from '@/pages/login/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    //班牌
		{
		  path: '/class',
		  name: 'classPage',
		  component: classPage
		},
  ]
})
