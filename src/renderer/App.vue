<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'

  // Vue Material
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
  import 'vue-material/dist/theme/default.css'
  // Material Icons
  import 'material-design-icons/iconfont/material-icons.css'
  // common
  import '@/assets/css/common.css'

  // components
  import Register from '@/components/register'
  // router
  import router from '@/router'

  Vue.use(VueMaterial)
  
  Register.registerComponents()

  export default {
    name: 'mreader',
    router
  }
</script>

<style>
  /* styles */
</style>
