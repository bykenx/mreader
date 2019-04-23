/* eslint-disable no-new */
import EPub from 'epubjs'
import BaseReader from '../internal/BaseReader'

class EpubReader extends BaseReader {
  constructor (props) {
    props = props || {}
    super(props)
    this.bookSrcUrl = props.url
    this.book = new EPub()
    if (this.bookSrcUrl) {
      this.open(this.bookSrcUrl)
    }
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
      height: 500
    })
    this.rendition.display()
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
   * @returns {{name: string, srcUrl: string, chapterUrl: string, cover: string, author: string, origin: string, charset: string, _type: number}}
   */
  static getMetaInfo (book) {

  }
}

export default {
  mt: 'epub',
  cl: EpubReader
}
