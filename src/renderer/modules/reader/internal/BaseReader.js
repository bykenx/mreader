/**
 * @property {number} width
 * @property {number} height
 */
class BaseReader {
  /**
   * @param {object} props
   */
  constructor (props) {
    props = props || {}
    this.width = props.width || 800
    this.height = props.height || 600
  }
  /**
   * @param {any} res
   */
  open (res) {
  }
  /**
   * @param {HTMLElement} el
   */
  render (el) {}
  /**
   * @param {number} w
   * @param {number} h
   */
  resize (w, h) {}
  /**
   * @param {string} name
   * @param {string} bookmark
   */
  addBookMark (name, bookmark) {}
  /**
   * @returns {number}
   */
  getProcess () {}
  /**
   * @param {any} _id
   */
  jumpTo (_id) {}
  getChapters () {}
  prev () {}
  next () {}
}

export default BaseReader
