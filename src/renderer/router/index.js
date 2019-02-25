import Vue from 'vue'
import Router from 'vue-router'

import MainPage from 'pages/MainPage'
import ReaderPage from 'pages/ReaderPage'
import SettingsPage from 'pages/SettingsPage'
import AboutPage from 'pages/AboutPage'
import SourceDetail from 'pages/SourceDetail'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    name: 'main',
    component: MainPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/reader/:id',
    name: 'reader',
    component: ReaderPage
  },
  {
    path: '/source/:id',
    name: 'source',
    component: SourceDetail
  }]
})
