<template>
  <layout>
    <md-button slot="header" class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
    </md-button>
    <!-- 菜单 -->
    <md-drawer :md-active.sync="showNavigation" slot="main-menu">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Mreader</span>
      </md-toolbar>
      <func-nav></func-nav>
    </md-drawer>
  </layout>
</template>

<script>
export default {
  name: 'SettingsPage',
  data () {
    return {
      showNavigation: false
    }
  }
}
</script>