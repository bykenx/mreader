import StoreEnable from './internal/base'

/**
  * @enum {number}
  */
var BookTypes = {
  ONLINE_BOOK: 0x01,
  LOCAL_BOOK: 0x02
}

/**
 * @property {string} _id
 * @property {string} name
 * @property {string} tag
 * @property {string} link
 * @property {string} chapterUrl
 * @property {number} updateDate
 * @property {string} cover
 * @property {string} author
 * @property {string} introduce
 * @property {string} source
 * @property {string} charset
 * @property {number} _type
 */
class Book extends StoreEnable {
  static __DB_NAME = 'book'
  /**
   * @param {{}} props
   */
  constructor (props) {
    super(props)
    this._id = props._id || ''
    this.name = props.name
    this.tag = props.tag
    this.link = props.link || ''
    this.chapterUrl = props.chapterUrl
    this.updateDate = props.updateDate
    this.cover = props.cover
    this.author = props.author
    this.introduce = props.introduce
    this.source = props.source
    this.charset = props.charset
    this._type = this.link.startsWith('http') ? BookTypes.ONLINE_BOOK : BookTypes.LOCAL_BOOK
  }
  isLocal () {
    return this._type === BookTypes.LOCAL_BOOK
  }
}

export default Book

export {
  BookTypes
}
