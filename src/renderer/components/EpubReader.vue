<template>
  <div class="viewer"></div>
</template>

<script>
  import { EpubReader } from 'modules/reader'
  export default {
    name: 'EpubReader',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        reader: null,
        chapterList: []
      }
    },
    mounted () {
      this.reader = new EpubReader()
      this.reader.render(document.querySelector('.viewer'))
      let link = this.value.link
      this.reader.open(link)
      this.reader.ready
        .then(([_, spine, meta, cover, navigation, resources]) => {
          console.log([_, spine, meta, cover, navigation, resources])
          this.reader.themes.register(this.themes)
          let toc = navigation.toc
          let chapters = []
          // 更新章节列表
          for (let i in toc) {
            chapters.push({name: toc[i].label, id: toc[i].id, toc: toc[i]})
          }
          this.chapterList = chapters

          // 设置显示样式
          this.reader.themes.select(this.theme)
          this.reader.themes.font(this.fontFamily)
          this.reader.themes.fontSize(this.fontSize + 'px')
        })
      window.addEventListener('resize', ev => {
        this.reader.resize(ev.target.innerWidth, ev.target.innerHeight)
      })
    },
    methods: {
      prev () {
        this.reader.prev()
      },
      next () {
        this.reader.next()
      },
      go (index) {
        let chapter = this.chapterList[index]
        let target = chapter.toc.href
        this.reader.go(target)
      }
    },
    computed: {
      themes () {
        let themes = {}
        let _themes = this.$store.state.GlobalSettings.themes
        for (let i in _themes) {
          themes[i] = {'body': _themes[i]}
        }
        return themes
      },
      fontFamilys () {
        return this.$store.state.GlobalSettings.fontFamily
      },
      theme () {
        return this.$store.state.GlobalSettings.currentSettings.theme || 'default'
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
        return value
      }
    },
    watch: {
      chapterList (newValue) {
        this.$emit('chapters-changed', newValue)
      },
      theme (newValue) {
        if (this.reader.themes) {
          this.reader.themes.select(newValue)
        }
      },
      fontFamily (newValue) {
        if (this.reader.themes) {
          this.reader.themes.font(newValue)
        }
      },
      fontSize (newValue) {
        if (this.reader.themes) {
          this.reader.themes.fontSize(newValue + 'px')
        }
      },
      process (newVaule) {
        this.$emit('process-changed', newVaule)
      }
    }
  }
</script>
