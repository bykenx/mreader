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
    <md-drawer md-right :md-active.sync="showOptions" slot="option-menu">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">选择一个操作</span>
      </md-toolbar>
      <md-list>
        <md-list-item @click="addLocalBook">
          <md-icon class="md-primary">add</md-icon>
          <span class="md-list-item-text">本地图书</span>
        </md-list-item>
        <md-list-item @click="clearCache">
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
    <md-content slot="content">
      <book-shelf v-model='books' :clicked='open' index='_id' />
    </md-content>
    <!-- 确认框 -->
    <md-dialog-confirm slot="content"
      :md-active.sync="showClearCacheConfirm"
      md-title="清除缓存"
      md-content="是否清除本地的图书缓存？"
      md-confirm-text="确认"
      md-cancel-text="取消"
      @md-confirm="onClearCacheConfirm" />
  </layout>
</template>

<script>
import Book from 'modules/storage/Book'
import { EpubReader } from 'modules/reader'
import { FileDialogService } from '@/services'

export default {
  name: 'MainPage',
  data () {
    return {
      showNavigation: false,
      showOptions: false,
      showClearCacheConfirm: false,
      books: []
    }
  },
  mounted () {
    Book.getAll()
      .then(books => {
        this.books = books
      })
  },
  methods: {
    open (id) {
      this.$router.push({
        'name': 'reader',
        'params': {
          'id': id
        },
        'query': {
          'referer': 'bookshelf'
        }
      })
    },
    addLocalBook () {
      let files = FileDialogService.showOpenDialog()
      if (files && files[0]) {
        console.log(files[0])
        let url = 'file://' + files[0]
        EpubReader.getMetaInfo(url)
          .then(metadata => {
            let book = new Book({
              name: metadata.name,
              tag: [],
              link: url,
              chapterUrl: '',
              updateDate: new Date(),
              cover: '',
              author: metadata.author,
              introduce: metadata.description,
              source: '',
              charset: ''
            })
            book.save()
          })
      }
    },
    clearCache () {
      this.showClearCacheConfirm = true
    },
    onClearCacheConfirm () {
      alert('clear')
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
    flex-wrap: wrap
  }
</style>