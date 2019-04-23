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
 * @property {string} srcUrl
 * @property {string} chapterUrl
 * @property {number} updateDate
 * @property {string} cover
 * @property {string} author
 * @property {string} introduce
 * @property {string} origin
 * @property {string} charset
 * @property {number} _type
 */
class Book extends StoreEnable {
  /* eslint-disable-next-line */
  static __db_name = 'book'
  /**
   * @param {{}} props
   */
  constructor (props) {
    super()
    this._id = props._id || null
    this.name = props.name
    this.tag = props.tag
    this.src = props.src || ''
    this.chapterUrl = props.chapterUrl
    this.updateDate = props.updateDate
    this.cover = props.cover
    this.author = props.author
    this.introduce = props.introduce
    this.origin = props.origin
    this.charset = props.charset
    this._type = this.srcUrl.startsWith('http') ? BookTypes.ONLINE_BOOK : BookTypes.LOCAL_BOOK
  }
}

export default Book
