<template>
  <div id="app-wrapper" class="md-layout-column">
    <!-- 头部导航栏 -->
    <md-toolbar class="md-primary">
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
    <slot name="content"></slot>
    <!-- 内容部分结束 -->
  </div>
</template>

<style lang="css">
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