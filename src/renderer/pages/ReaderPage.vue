<template>
  <layout :showHeader='showToolbar'>
    <md-button class="md-icon-button" slot="header" @click="back">
      <md-icon class="md-primary">keyboard_arrow_left</md-icon>
    </md-button>
    <div slot="header" class="md-toolbar-section-end">
      <md-button class="md-icon-button">
        <md-icon class="md-primary">book</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click="showChapters">
        <md-icon class="md-primary">list</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="md-primary">search</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click="showBookmarks">
        <md-icon class="md-primary">bookmark</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click="showSettings">
        <md-icon class="md-primary">settings</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click="showInfo">
        <md-icon class="md-primary">info</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="md-primary" @click="fullScreen">fullscreen</md-icon>
      </md-button>
    </div>
    <div class="reader" slot="content">
      <!-- 根据条件选择 TxtReader 或 EpubReader渲染 -->
      <!-- 使用TxtReader组件显示txt图书 -->
      <txt-reader
        v-if="type === 'txt' && book !== null"
        v-model='book'
        @chapters-changed='updateChapters' 
        @info-changed='updateInfo'
        @process-changed='updateProcess'
        ref='reader'/>
      <epub-reader
        v-else-if="type === 'epub' && book !== null"
        v-model='book'
        @chapters-changed='updateChapters'
        @info-changed='updateInfo'
        @process-changed='updateProcess'
        ref="reader" />
      <!-- 控制器，控制前后的翻页操作 -->
      <div class="control">
          <div class="prev" @click="prev"></div>
          <div class="toggleToolbar" @click="showToolbar = !showToolbar" />
          <div class="next" @click="next"></div>
      </div>
      <!-- 状态栏 -->
      <div class="status-bar">
        <span>{{ process.chapterName }}</span>
        <span>{{ process.page }} / {{ process.total }}</span>
        <span>{{ process.percentage }}%</span>
      </div>
    </div>
    <md-drawer class="md-right" :md-active.sync="show" slot="option-menu">
      <!-- 显示书签 -->
      <template v-if="option === 'bookmarks'">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">书签</span>
        </md-toolbar>
      </template>
      <!-- 显示图书的章节目录 -->
      <template v-if="option === 'chapters'">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">目录</span>
        </md-toolbar>
        <ul class="chapters-list">
          <li class="chapter-list-item"
            v-for="(c, index) in chapters"
            :key="index"
            @click="go(index)">
            {{c.name}}
          </li>
        </ul>
      </template>
      <!-- 搜索 -->
      <search-drawer v-else-if="option === 'search'" />
      <!-- 设置样式 -->
      <settings-drawer v-else-if="option === 'settings'" />
      <!-- 显示书籍详情 -->
      <template v-else-if="option === 'info'">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">书籍信息</span>
        </md-toolbar>
      </template>
      <!-- 其他 -->
      <template v-else-if="option === 'else'">
        你发现了新大陆
      </template>
    </md-drawer>
  </layout>
</template>

<script>
/* =========================================================== */
// 测试时，数据将会被持久化
// /Users/byken/Library/Application Support/Electron/vuex.json
/* =========================================================== */
import History from 'modules/storage/History'
import Book from 'modules/storage/Book'
let history = new History('book')
export default {
  name: 'ReaderPage',
  data () {
    return {
      show: false,
      // 进入阅读页面默认不显示toolbar
      showToolbar: false,
      option: '',
      book: null,
      chapters: null,
      bookinfo: null,
      type: '',
      oldTitle: '',
      process: {
        page: 1,
        total: 1,
        bookName: '',
        chapterName: '',
        percentage: 0.00
      }
    }
  },
  mounted () {
    let id = this.$route.params.id
    this.oldTitle = document.title
    this.referer = this.$route.query.referer || null
    switch (this.referer) {
      case 'history':
        this.book = history.get(id)
        this.type = 'txt'
        break
      case 'bookshelf':
      default:
        Book.getById(id)
          .then(book => {
            this.book = book
            if (book._type === 1) {
              this.type = 'txt'
            } else if (book._type === 2) {
              this.type = 'epub'
            }
          })
    }
  },
  methods: {
    next () {
      this.$refs.reader.next()
    },
    prev () {
      this.$refs.reader.prev()
    },
    showBookmarks () {
      this.show = true
      this.option = 'bookmarks'
    },
    showChapters () {
      this.show = true
      this.option = 'chapters'
    },
    showSettings () {
      this.show = true
      this.option = 'settings'
    },
    showInfo () {
      this.show = true
      this.option = 'info'
    },
    go (where) {
      this.$refs.reader.go(where)
      this.show = false
    },
    back () {
      this.$router.go(-1)
      document.title = this.oldTitle
    },
    // 事件处理函数
    updateInfo (info) {
      this.info = info
    },
    updateChapters (chapters) {
      this.chapters = chapters
    },
    fullScreen () {
    },
    updateProcess (process) {
      this.process = process
    }
  }
}
</script>

<style>
  .md-input {
    width: 100%
  }
  .reader {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    bottom: 0
  }
  .control {
      user-select: none;
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0
  }
  .control > div {
      position: absolute;
      width: 40px;
      height: 100%;
      cursor: pointer;
      color: #ccc
  }
  .control > div:hover { color: #999 }
  .control .prev { left: 0 }
  .control .next { right: 0 }
  .control .prev::before, .control .next::before {
    position: absolute;
    font-size: 50px;
    line-height: 50px;
    margin-top: -25px;
    font-weight: 800;
    top: 50%;
    color: currentColor
  }
  .control .prev::before { content: '‹' }
  .control .next::before { content: '›' }
  .chapters-list {
    margin: 0;
    padding: 0
  }
  .md-right {
    width: 360px;
    padding: 0 10px
  }
  .chapters-list li {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    list-style-type: none;
    font-size: 16px;
    cursor: pointer;
    overflow: hidden;
  }
  .chapter-list-item:hover {
    background: #ccc;
  }
  .viewer {
    position: absolute;
    width: 100%;
    height: 100%
  }
  .md-toolbar-section-end .md-button {
    margin-left: 20px
  }
  .toggleToolbar {
    width: calc(100vw - 80px)!important;
    height: 50px!important;
    left: 40px;
    top: 50%;
    margin-top: -25px
  }
  .status-bar {
    position: fixed;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    bottom: 0;
    text-align: right;
  }
  .status-bar span {
    display: inline-block;
    margin: 0 20px
  }
  .status-bar span:first-child {
    position: absolute;
    left: 0
  }
</style>