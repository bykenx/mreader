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
    <!-- 菜单结束 -->
    <div slot="content" class="content">
      <div class="intro">
        <h2>Mreader 电子书阅读器</h2>
        <p><label>author</label>: byken</p>
        <div>
          <label>简介</label>: 跨平台的电子书阅读器。
          <p>1、自定义书源和添加本地书籍阅读的功能；</p>
          <p>2、自定义书源搜索书籍并添加到书架；</p>
          <p>3、打开epub格式的本地电子书。</p>
        </div>
        <p><label>设计日期</label>: 2018年12月 ~ 2019年4月</p>
        <p><label>版本</label>: 0.0.2</p>
        <p><label>开源软件</label>: electronjs、Vuejs、Vuex、vuex-electron等</p>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  name: 'AboutPage',
  data () {
    return {
      showNavigation: false
    }
  }
}
</script>

<style>
  .intro {
    margin-left: 50px;
    margin-top: 20px
  }
</style>