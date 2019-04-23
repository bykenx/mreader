<template>
  <div class="viewer" />
</template>

<script>
  import { TxtReader } from 'modules/reader'
  import History from 'modules/storage/History'
  import BookCache from 'modules/storage/BookCache'
  import { decode } from 'modules/util'

  let reading = new History('reading')
  export default {
    name: 'TxtReader',
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        _self: null,
        bookName: '',
        author: '',
        page: 1,
        total: 1,
        chapterName: '',
        chapterList: [],
        currentChapter: null,
        bookmarks: null,
        source: null
      }
    },
    mounted () {
      // 从 store 获取加载的书源
      let sources = this.$store.state.Source.sources
      let book = this.value
      for (let i in sources) {
        if (sources[i]._id === book.source) {
          this.source = sources[i]
          break
        }
      }
      if (!this.source) {
        alert('当前书源不存在')
        return
      }
      this._self = new TxtReader()
      this._self.render(document.querySelector('.viewer'))
      this.source.getChapterList(book)
        .then(chapters => {
          this.bookName = book.name
          this.author = book.author
          this.page = 1
          this.chapterList = chapters
          this.currentChapter = this.chapterList[this.page - 1]
          this.chapterName = this.currentChapter.name
          this.loadSource()
        })
    },
    methods: {
      next () {
        if (!this._self.next()) {
          this.page += 1
          this.currentChapter = this.chapterList[this.page - 1]
          this.chapterName = this.currentChapter.name
          this.loadSource()
        }
      },
      prev () {
        if (!this._self.prev() && this.page >= 0) {
          this.page -= 1
          this.currentChapter = this.chapterList[this.page - 1]
          this.chapterName = this.currentChapter.name
          this.loadSource()
        }
      },
      storeHistory () {
        console.log(reading)
      },
      loadSource () {
        // 先尝试从本地缓存读取内容
        let content = BookCache.get(this.bookName, this.source.name, this.chapterName)
        if (!content) {
          this.source.getContent(this.chapterList[this.page])
            .then(data => {
              this._self.open(data)
              BookCache.save(this.bookName, this.source.name, this.chapterName, data)
            })
        } else {
          content = decode(content)
          this._self.open(content)
        }
      },
      updateChapters (newValue) {
        this.$emit('chapters-changed', newValue)
      }
    },
    watch: {
      'chapterList': 'updateChapters'
    }
  }
</script>