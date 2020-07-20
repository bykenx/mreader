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
  }
  /**
   * 打开图书
   * @param {any} res
   */
  open (res) {
  }
  /**
   * 将内容渲染至界面
   * @param {HTMLElement} el
   */
  render (el) {}
  /**
   * 窗口大小变化
   * @param {number} w
   * @param {number} h
   */
  resize (w, h) {}
  /**
   * 添加书签
   * @param {string} name
   * @param {string} bookmark
   */
  addBookMark (name, bookmark) {}
  /**
   * 获取阅读进度
   * @returns {{page: Number, total: Number, name?:String}}
   */
  getProcess () {}
  /**
   * 翻页：上一页
   * @param {Boolean} first 翻到第一页
   */
  prev (first) {}
  /**
   * 翻页：下一页
   * @param {Boolean} last 翻到最后一页
   */
  next (last) {}
  /**
   * 翻页后的更新操作
   */
  update () {}
}

export default BaseReader
