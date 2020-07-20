/* eslint-disable */
import EPub from 'epubjs'
import { Book } from 'epubjs'
import BaseReader from './internal/BaseReader'

class EpubReader extends BaseReader {
  constructor (props) {
    props = props || {}
    super(props)
    // EPub 对象
    this.book = new EPub()
    this.themes = null

    // 获取数据和设定初始值
    let url = props.url

    // 如果指定了链接，则直接打开书籍
    if (url) {
      this.open(this.url)
    }

    // 钩子函数
    this.ready = this.book.ready

    this.book.on('book:linkClicked', function(href) {
        console.log(href)
    })
  }
  /**
   * @param {String} res
   */
  open (res) {
    this.book.open(res)
    return this.book
  }
  render (el) {
    this.rendition = this.book.renderTo(el, {
      width: '100%',
      height: '100%'
    })
    // 显示内容
    this.rendition.display()
    this.themes = this.rendition.themes
    return this.rendition
  }
  next () {
    this.book.package.metadata.direction === 'rtl' ? this.rendition.prev() : this.rendition.next()
  }
  prev () {
    this.book.package.metadata.direction === 'rtl' ? this.rendition.next() : this.rendition.prev()
  }
  /**
   * @param { any } book
   * @returns {Promise<{name: string, author: string, pubdate: string, description: string}>}
   */
  static getMetaInfo (book) {
    let bk = new Book(book)
    return new Promise((resolve, reject) => {
      bk.opened
        .then(self => {
          let metadata = {}
          let _metadata = self.package.metadata
          metadata['name'] = _metadata['title']
          metadata['author'] = _metadata['creator'] || ''
          metadata['pubdate'] = _metadata['pubdate']
          metadata['description'] = _metadata['description'] || ''
          resolve(metadata)
        }).catch(reject)
    })
  }
  go (target) {
    this.rendition.display(target)
  }
  update () {
  }
  resize (width, height) {
    this.rendition.resize(width, height)
  }
  getProcess () {
    return {
      page: 1,
      total: 1,
      name: ''
    }
  }
}

export default EpubReader
