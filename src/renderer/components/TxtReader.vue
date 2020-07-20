<template>
  <div class="viewer" />
</template>

<script>
  import { TxtReader } from 'modules/reader'
  import History from 'modules/storage/History'
  import BookCache from 'modules/storage/BookCache'
  import { decode } from 'modules/util'

  let reading = new History('reading', ['name', 'source'])
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
        reader: null,
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
      console.log(reading)
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
      this.reader = new TxtReader()
      this.viewer = document.querySelector('.viewer')
      this.reader.render(this.viewer)

      // 加载样式
      this.setStyle('fontFamily', this.fontFamily)
      this.setStyle('fontSize', this.fontSize + 'px')
      // 获取计算属性 theme
      let theme = this.theme
      this.setStyle('color', theme.color)
      this.setStyle('background', theme.background)

      // 读取章节列表
      this.source.getChapterList(book)
        .then(chapters => {
          this.bookName = book.name
          this.author = book.author
          this.chapterList = chapters
          this.page = 1
          this.total = this.chapterList.length
          this.currentChapter = this.chapterList[this.page - 1]
          this.chapterName = this.currentChapter.name
          this.loadHistory()
          this.loadSource()
        })
    },
    methods: {
      next () {
        if (!this.reader.next() && this.page < this.total) {
          this.page += 1
          this.currentChapter = this.chapterList[this.page - 1]
          this.chapterName = this.currentChapter.name
          this.loadSource()
        }
        return true
      },
      prev () {
        if (!this.reader.prev() && this.page > 1) {
          this.page -= 1
          this.currentChapter = this.chapterList[this.page - 1]
          this.chapterName = this.currentChapter.name
          this.loadSource(_ => {
            // 跳转到章节末尾
            this.reader.next(true)
          })
        }
        return true
      },
      go (index) {
        this.page = index + 1
        this.currentChapter = this.chapterList[this.page - 1]
        this.chapterName = this.currentChapter.name
        this.loadSource()
      },
      loadHistory () {
      },
      storeHistory () {
        reading.save({
          name: this.bookName,
          process: this.page + '@' + this.process.page
        })
      },
      loadSource (cb) {
        // 先尝试从本地缓存读取内容
        let content = BookCache.get(this.bookName, this.source.name, this.chapterName)
        if (!content) {
          this.source.getContent(this.chapterList[this.page - 1])
            .then(data => {
              this.reader.open(data)
              if (cb) {
                cb()
              }
              BookCache.save(this.bookName, this.source.name, this.chapterName, data)
            })
        } else {
          content = decode(content)
          this.reader.open(content)
          if (cb) {
            cb()
          }
        }
        // 读取操作结束后保存阅读进度
        this.storeHistory()
      },
      setStyle (key, value) {
        this.viewer.style[key] = value
      }
    },
    computed: {
      themes () {
        return this.$store.state.GlobalSettings.themes
      },
      fontFamilys () {
        return this.$store.state.GlobalSettings.fontFamily
      },
      theme () {
        let name = this.$store.state.GlobalSettings.currentSettings.theme || 'default'
        return this.themes[name]
      },
      fontFamily () {
        let idx = this.$store.state.GlobalSettings.currentSettings.fontFamily || 0
        return this.fontFamilys[idx].value
      },
      fontSize () {
        return this.$store.state.GlobalSettings.currentSettings.fontSize || 14
      },
      process () {
        let value = {page: 1, total: 1, name: ''}
        if (this.reader) {
          value = this.reader.getProcess()
        }
        let percentage = ((this.page + value.page / value.total - 1) / this.total * 100).toFixed(2)
        value['bookName'] = this.bookName
        value['chapterName'] = this.chapterName
        value['percentage'] = percentage
        return value
      }
    },
    watch: {
      chapterList (newValue, oldValue) {
        this.$emit('chapters-changed', newValue)
      },
      theme (newValue) {
        this.setStyle('color', newValue.color)
        this.setStyle('background', newValue.background)
      },
      fontFamily (newValue) {
        this.setStyle('fontFamily', newValue)
      },
      fontSize (newValue) {
        this.setStyle('fontSize', newValue + 'px')
      },
      process (newVaule) {
        this.$emit('process-changed', newVaule)
      }
    }
  }
</script>