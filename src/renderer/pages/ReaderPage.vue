<template>
  <layout>
    <router-link to="/" slot="header">
      <md-button class="md-icon-button">
        <md-icon class="md-primary">keyboard_arrow_left</md-icon>
      </md-button>
    </router-link>
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
      <md-button class="md-icon-button">
        <md-icon class="md-primary">bookmark</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="md-primary">settings</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="md-primary">info</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="md-primary">fullscreen</md-icon>
      </md-button>
    </div>
    <div class="reader" slot="content">
      <!-- 使用TxtReader组件渲染显示txt图书 -->
      <txt-reader
        v-if="book !== null"
        v-model='book'
        ref='reader'
        @chapters-changed='updateChapters' />
      <!-- 控制器，控制前后的翻页操作 -->
      <div class="control">
          <div class="prev" @click="prev"></div>
          <div class="next" @click="next"></div>
      </div>
    </div>
    <!-- 显示图书的章节列表 -->
    <md-drawer class="md-right" :md-active.sync="showOptions" slot="option-menu">
      <template v-if="option === 'chapters'">
        <ul class="chapters-list">
          <li class="chapter-item" v-for="(c, index) in chapters" :key="index">
            {{c.name}}
          </li>
        </ul>
      </template>
      <template v-else-if="option === 'else'">
      </template>
    </md-drawer>
  </layout>
</template>

<script>
// import EpubReader from 'modules/reader/EpubReader'
// import { readFile } from 'modules/storage'
import History from 'modules/storage/History'
let store = new History('book')
export default {
  name: 'ReaderPage',
  data () {
    return {
      showOptions: null,
      option: null,
      book: null,
      chapters: []
    }
  },
  mounted () {
    let id = this.$route.params.id
    this.referer = this.$route.query.referer || null
    this.book = store.get(id)
    // this.reader = new EpubReader()
    // this.reader.render(document.querySelector('#viewer'))
    // readFile('/Users/byken/.mreader-dev/cache/test.epub')
    //   .then(data => {
    //     this.reader.open(data)
    //   })
  },
  methods: {
    next () {
      this.$refs.reader.next()
    },
    prev () {
      this.$refs.reader.prev()
    },
    showChapters () {
      this.showOptions = true
      this.option = 'chapters'
    },
    updateChapters (chapters) {
      this.chapters = chapters
    }
  }
}
</script>

<style>
  .reader {
    position: absolute;
    top: 64px;
    bottom: 0;
    width: 100%;
    background-color: #D6BF9B;
    overflow-y: hidden;
    bottom: 0
  }
  .control {
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0
  }
  .control > div {
      position: absolute;
      width: 40px;
      height: 100%;
      line-height: 100%;
      cursor: pointer;
      color: #ccc
  }
  .control > div:hover { color: #999 }
  .control .prev { left: 0 }
  .control .next { right: 0 }
  .control .prev::before, .control .next::before {
    position: absolute;
    font-size: 64px;
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
  .chapters-list li {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    list-style-type: none;
    font-size: 16px;
    cursor: pointer;
    overflow-x: hidden;
  }
  .chapter-item:hover {
    background: #ccc;
  }
  .viewer {
    position: absolute;
    width: 100%;
    height: 100%
  }
</style>