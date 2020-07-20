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
  // import 'vue-material/dist/theme/default-dark.css'
  // Material Icons
  import 'material-design-icons/iconfont/material-icons.css'
  // Awesome icon
  import 'font-awesome/css/font-awesome.css'
  // common
  import '@/assets/css/common.css'

  Vue.use(VueMaterial)

  export default {
    name: 'MReader'
  }
</script>

<style>
  /* styles */
</style>
