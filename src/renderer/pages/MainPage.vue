<template>
  <layout>
    <md-button slot="header" class="md-icon-button" @click="showNavigation = true">
      <md-icon>menu</md-icon>
    </md-button>
    <div slot="header" class="md-toolbar-section-end">
      <md-button class="md-icon-button" @click="showOptions = true">
        <md-icon>more_vert</md-icon>
      </md-button>
    </div>

    <!-- 菜单 -->
    <md-drawer :md-active.sync="showNavigation" slot="main-menu">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Mreader</span>
      </md-toolbar>
      <func-nav></func-nav>
    </md-drawer>
    <!-- 菜单结束 -->

    <!-- 右侧抽屉 -->
    <md-drawer class="md-right" :md-active.sync="showOptions" slot="option-menu">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">选择一个操作</span>
      </md-toolbar>
      <md-list>
        <md-list-item>
          <md-icon class="md-primary">add</md-icon>
          <span class="md-list-item-text">本地图书</span>
        </md-list-item>
        <md-list-item>
          <md-icon class="md-primary">clear</md-icon>
          <span class="md-list-item-text">清除缓存</span>
        </md-list-item>
        <md-list-item>
          <md-icon class="md-primary">edit</md-icon>
          <span class="md-list-item-text">编辑</span>
        </md-list-item>
        <md-list-item>
          <md-icon class="md-primary">delete</md-icon>
          <span class="md-list-item-text">清空书架</span>
        </md-list-item>
      </md-list>
    </md-drawer>
    <!-- 右侧抽屉结束 -->
    <book-shelf slot='content' v-model='books' :clicked='open'></book-shelf>
  </layout>
</template>

<script>
import Book from 'modules/storage/Book'
import History from 'modules/storage/History'
import { remote } from 'electron'

remote.powerMonitor.on('on-battery', ev => {
  console.log(ev)
})
let book = new History('book')
export default {
  name: 'MainPage',
  data () {
    return {
      showNavigation: false,
      showOptions: false,
      books: []
    }
  },
  mounted () {
    window.a = this.$store
    this.$store.dispatch('loadSources')
    Book.getAll()
      .then((err, all) => {
        if (!err) {
          this.books = book.all()
        }
      })
  },
  methods: {
    open (id) {
      this.$router.push({
        'name': 'reader',
        'params': {id: id}
      })
    }
  }
}
</script>

<style>
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