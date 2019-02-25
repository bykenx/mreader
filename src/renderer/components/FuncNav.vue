<template>
  <md-list>
    <router-link to="/">
      <md-list-item>
        <md-icon>menu</md-icon>
        <span class="md-list-item-text">我的书架</span>
      </md-list-item>
    </router-link>
    <router-link to="booksrc">
      <md-list-item>
        <md-icon>send</md-icon>
        <span class="md-list-item-text">
          书源管理
        </span>
      </md-list-item>
    </router-link>
    <router-link to="settings">
      <md-list-item>
        <md-icon>delete</md-icon>
        <span class="md-list-item-text">设置
          </span>
      </md-list-item>
    </router-link>
    <router-link to="about">
      <md-list-item>
        <md-icon>error</md-icon>
        <span class="md-list-item-text">关于
        </span>
      </md-list-item>
    </router-link>
  </md-list>
</template>
