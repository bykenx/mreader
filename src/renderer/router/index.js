import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: require('pages/MainPage').default
  },
  {
    path: '/about',
    name: 'about',
    component: require('pages/AboutPage').default
  },
  {
    path: '/settings',
    name: 'settings',
    component: require('pages/SettingsPage').default
  },
  {
    path: '/reader/:id',
    name: 'reader',
    component: require('pages/ReaderPage').default
  },
  {
    path: '/source',
    name: 'source',
    component: require('pages/BookSrcPage').default
  },
  {
    path: '/source/:id',
    name: 'sourcedetail',
    component: require('pages/SourceDetail').default
  },
  {
    path: '/search',
    name: 'search',
    component: require('pages/BookSearchPage').default
  }]
})
