import Vue from 'vue'
import axios from 'axios'

import App from './App'
// components
import Register from '@/components/register'
// router
import router from '@/router'
// store
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Register.registerComponents()

/* eslint-disable no-new */
new Vue({
  components: { App },
  mounted () {
    this.$store.dispatch('loadSources')
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
