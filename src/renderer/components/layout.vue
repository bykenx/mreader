<template>
  <div id="app-wrapper" class='md-layout-column'>
    <!-- <div class="fake-title-bar">
      {{ title }}
      <div class="handle-bar" v-if="platform === 'win32'">
        <i class="el-icon-minus" @click="minimizeWindow"></i>
        <i class="el-icon-close" @click="closeWindow"></i>
      </div>
    </div> -->
    <!-- 头部导航栏 -->
    <md-toolbar class="md-primary" id="app-toolbar" :style="headerStyle">
      <slot name="header"></slot>
    </md-toolbar>
    <!-- 头部导航栏结束 -->

    <!-- 菜单 -->
    <slot name="main-menu"></slot>
    <!-- 菜单结束 -->
    
    <!-- 右侧抽屉 -->
    <slot name="option-menu"></slot>
    <!-- 右侧抽屉结束 -->
    
    <!-- 内容部分 -->
    <div id="content" :style="contentStyle">
      <slot name="content"></slot>
    </div>
    <!-- 内容部分结束 -->
  </div>
</template>

<script>
  export default {
    props: {
      showHeader: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    computed: {
      headerStyle () {
        return this.showHeader ? '' : 'display: none;'
      },
      contentStyle () {
        return this.showHeader ? 'marginTop: 64px;' : ''
      }
    }
  }
</script>

<style lang="css">
  #app {
    position: absolute;
    overflow-x: hidden;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  #app-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .md-drawer {
    width: 260px;
    max-width: calc(100vw - 125px);
  }
  .md-list-item {
    cursor: pointer;
  }
  .md-content {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
  }
</style>