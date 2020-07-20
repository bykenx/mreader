<template>
  <layout>
    <div class="md-toolbar-row" slot="header">
      <md-button class="md-icon-button md-toolbar-section-start">
        <router-link to="/">
          <md-icon class="md-primary">keyboard_arrow_left</md-icon>
        </router-link>
      </md-button>
      <md-autocomplete
        :md-options='options'
        :md-open-on-focus='false'
        v-model='name'
        md-layout='box'
        @md-changed='changedInput'>
        <label>输入书名</label>
      </md-autocomplete>
    </div>
    <md-content slot="content" v-if="results">
      <md-card v-for="(item, idx) in results" :key="idx">
        <md-card-header>
          <!-- 封面图片 -->
          <md-card-media>
            <img :src="item.cover" @click="show(item)">
          </md-card-media>
          <!-- 书源信息 -->
          <span class="tag-source" :title="item.sourceName">{{ item.sourceName ? item.sourceName[0] : '' }}</span>
        </md-card-header>
        <md-card-content>
          <!-- 书名 -->
          <p class="t-book-name">{{ item.name }}</p>
          <!-- 作者 -->
          <p class="t-book-author">{{ item.author }}</p>
          <!-- 最新章节 -->
          <p class="t-book-last">{{ item.lastChapter }}</p>
          <md-button @click="gotoReader(item)">进入阅读</md-button>
          <md-button @click="add(item)">加到书架</md-button>
        </md-card-content>
      </md-card>
    </md-content>

    <md-drawer
      class="md-right"
      md-fixed
      :md-active.sync="showDetails"
      v-if="currentSelect"
      slot="option-menu">
      <div class="book-detail">
        <img :src="currentSelect.cover">
        <p>{{ currentSelect.name }}</p>
        <p>
          <md-icon class="md-primary fa fa-user"></md-icon>
          {{ currentSelect.author }}
        </p>
        <p>
          <md-icon class="md-primary fa fa-tag"></md-icon>
          {{ currentSelect.kind }}
        </p>
        <p>
          <md-icon class="md-primary fa fa-chrome"></md-icon>
          {{ currentSelect.sourceName }}
        </p>
        <p>
          <md-icon class="md-primary fa fa-history"></md-icon>
          {{ currentSelect.lastChapter }}
        </p>
      </div>
    </md-drawer>
  </layout>
</template>
<script>
import History from 'modules/storage/History'
import { BookService } from '@/services'

let store = new History('book')

export default {
  name: 'BookSearchPage',
  data () {
    return {
      name: null,
      options: [],
      results: null,
      showDetails: false,
      currentSelect: null
    }
  },
  computed: {
    sources () {
      // 从 state 获取已经加载的源
      return this.$store.state.Source.sources
    }
  },
  mounted () {
  },
  methods: {
    changedInput (data) {
      if (!data || data === '') {
        return
      }
      this.search(data)
    },
    search (name) {
      // 清空搜索结果
      this.results = []
      for (let i in this.sources) {
        let current = this.sources[i]
        window.current = current
        current.searchBook(name)
          .then(data => {
            data.forEach(e => {
              // 提取书源名字的第一个字
              e.sourceName = current.name
            })
            this.results.splice(this.results.length, 0, ...data)
          })
      }
    },
    show (book) {
      this.currentSelect = book
      this.showDetails = true
    },
    add (book) {
      BookService.save({
        name: book.name,
        link: book.link,
        source: book.source,
        cover: book.cover,
        author: book.author
      })
    },
    gotoReader (book) {
      // 保存浏览记录并获取id
      let stored = store.save(book)
      // 跳转到阅读器页面
      this.$router.push({
        'name': 'reader',
        'params': { 'id': stored.$id },
        'query': { 'referer': 'history' }
      })
    }
  }
}
</script>

<style>
  p { line-height: 1 }
  #app-toolbar {
    position: fixed;
    top: 0
  }
  .md-card {
    margin: 4px;
  }
  .md-icon {
    font-size: 12px
  }
  .md-card > * {
    display: inline-block;
    vertical-align: top
  }
  .md-card-media {
    margin-left: 0!important;
    width: 90px!important;
    height: 120px!important;
  }
  .tag-source {
    position: absolute;
    width: 30px;
    height: 30px;
    line-height: 30px;
    right: 16px;
    top: 16px;
    text-align: center;
    border-radius: 15px;
    color: #FCFDFD;
    background: #BDC3C7;
    cursor: pointer;
  }
  .md-card-content {
    width: 240px
  }
  .book-detail {
    margin: 20px;
    font-size: 14px
  }
  .book-detail img {
    width: 100%
  }
  .t-book-last {
    color: #848484
  }
</style>