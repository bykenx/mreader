<template>
  <md-list>
    <router-link to="main">
      <md-list-item>
        <md-icon>menu</md-icon>
        <span class="md-list-item-text">我的书架</span>
      </md-list-item>
    </router-link>
    <router-link to="source">
      <md-list-item>
        <md-icon>send</md-icon>
        <span class="md-list-item-text">
          书源管理
        </span>
      </md-list-item>
    </router-link>
    <router-link to="settings">
      <md-list-item>
        <md-icon>settings</md-icon>
        <span class="md-list-item-text">设置
          </span>
      </md-list-item>
    </router-link>
    <router-link to="search">
      <md-list-item>
        <md-icon>search</md-icon>
        <span class="md-list-item-text">搜索图书
          </span>
      </md-list-item>
    </router-link>
    <router-link to="about">
      <md-list-item>
        <md-icon>info</md-icon>
        <span class="md-list-item-text">关于
        </span>
      </md-list-item>
    </router-link>
    <md-list-item>
      <md-icon>close</md-icon>
      <span class="md-list-item-text">关闭应用
      </span>
    </md-list-item>
  </md-list>
</template>
