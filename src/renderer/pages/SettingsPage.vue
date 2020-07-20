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

    <div slot="content" class="settings-area">
      <div>
        <label for=""></label>
        <md-switch v-model="dimspace">自动调整段前间距</md-switch>
        <settings-drawer />
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  name: 'SettingsPage',
  data () {
    return {
      showNavigation: false,
      dimspace: false
    }
  }
}
</script>

<style>
  .input-group {
    border: 1px solid #ccc;
    padding-left: 10px
  }
  .input-group > * {
    display: block
  }
  .settings-area {
    padding-left: 30px;
    padding-right: 30px
  }
</style>