import StoreEnable from './internal/base'

/**
 * @property {string} _id
 * @property {string} url
 * @property {string} name
 * @property {string} group
 * @property {string} findUrl
 * @property {string} searchUrl
 * @property {string} searchListRule
 * @property {string} searchNameRule
 * @property {string} searchAuthorRule
 * @property {string} searchCoverRule
 * @property {string} searchUrlRule
 * @property {string} searchKindRule
 * @property {string} searchLastChapterRule
 * @property {string} detailUrlRule
 * @property {string} detailNameRule
 * @property {string} detailAuthorRule
 * @property {string} detailCoverRule
 * @property {string} detailKindRule
 * @property {string} detailLastChapterRule
 * @property {string} chapterUrlRule
 * @property {string} chapterListRule
 * @property {string} chapterNameRule
 * @property {string} chapterUrlRule
 * @property {string} contentRule
 * @property {Boolean} enabled
 */
class BookSource extends StoreEnable {
  /* eslint-disable-next-line */
  static __db_name = 'booksource'
  /**
   * @param {{}} props
   */
  constructor (props) {
    super()
    this._id = props._id || ''
    this.url = props.url
    this.name = props.name
    this.group = props.group
    this.findUrl = props.findUrl
    this.searchUrl = props.searchUrl
    this.searchListRule = props.searchListRule
    this.searchNameRule = props.searchNameRule
    this.searchAuthorRule = props.searchAuthorRule
    this.searchCoverRule = props.searchCoverRule
    this.searchUrlRule = props.searchUrlRule
    this.searchKindRule = props.searchKindRule
    this.searchLastChapterRule = props.searchLastChapterRule
    this.detailUrlRule = props.detailUrlRule
    this.detailNameRule = props.detailNameRule
    this.detailAuthorRule = props.detailAuthorRule
    this.detailCoverRule = props.detailCoverRule
    this.detailKindRule = props.detailKindRule
    this.detailLastChapterRule = props.detailLastChapterRule
    this.chapterUrlRule = props.chapterUrlRule
    this.chapterListRule = props.chapterListRule
    this.chapterNameRule = props.chapterNameRule
    this.contentUrlRule = props.chapterUrlRule
    this.contentRule = props.contentRule
    this.enabled = props.enabled || false
  }
}

export default BookSource
