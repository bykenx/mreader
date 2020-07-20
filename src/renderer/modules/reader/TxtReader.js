import BaseReader from './internal/BaseReader'

/** 编译之后的规则
 * @type {{String: String}}
 */
let _rules = []

/**
 * 检测是普通的替换内容还是特殊规则的标识
 * @type {RegExp}
 */
let flags = /^\$([A-Za-z])(.*)/

/**
 * @param {String} tagname
 * @param {Boolean} global
 * @param {Boolean} ignored
 * @param {String} n
 */
function getRemoved (tagname, global, ignored, n) {
  // 正则表达式字符串
  let pattern = ''
  // 默认删除匹配的标签
  let repalced = ''
  // 自闭和
  let simpleClosure = false
  // flags eg. i、g...
  let flags = ''
  global = global || true
  ignored = ignored || true
  flags += global ? 'g' : ''
  flags += ignored ? 'i' : ''
  if (tagname.endsWith('/')) {
    // 单闭和的标签
    simpleClosure = true
    tagname = tagname.replace(/\/$/, '')
  }
  pattern += `(<${tagname}[^>]*>)`
  if (n && n !== '') {
    if (n === 'n') {
      pattern += `(?:(<${tagname}[^>]*>)+)`
    } else {
      // 非数字的 n parseInt 后将会变成 NaN
      n = parseInt(n)
      if (n instanceof Number) {
        pattern += `(?:(<${tagname}[^>]*>){${n - 1}})`
      }
    }
    // 去除重复的标签
    repalced = '$1'
  }
  if (!simpleClosure) {
    // 普通标签
    pattern += `<\\/${tagname}>`
  }
  return [new RegExp(pattern, flags), repalced]
}

/**
 * @param {String} tagname
 * @param {String} repalced
 * @param {Boolean} global
 * @param {Boolean} ignored
 */
function getReplaced (tagname, replaced, global, ignored) {
  let flags = ''
  global = global || true
  ignored = ignored || true
  // 替换成匹配的内容加自定义内容
  let r = /(?:^\^([^$,]+)(?:,|[^$]$))?(?:([^^$]+)\$$)?/
  let matcher = r.exec(replaced)
  replaced = '$1' // 标准替换，将外部的标签去掉
  if (matcher) {
    // 在前面加内容
    if (matcher[1]) {
      replaced = matcher[1] + replaced
    }
    // 在后面加内容
    if (matcher[2]) {
      replaced = replaced + matcher[2]
    }
  }
  flags += global ? 'g' : ''
  flags += ignored ? 'i' : ''
  let pattern = `<${tagname}[^>]*>((?:[^<]*))<\\/${tagname}>`
  return [new RegExp(pattern, flags), replaced]
}

/**
 * 将多余的网页排版格式去掉
 * @param {String} data
 */
function processContent (data) {
  for (let i in _rules) {
    let _rule = _rules[i]
    data = data.replace(_rule[0], _rule[1])
  }
  return data
}

/**
 * @example
 * '<p>((?:[^<]*))<\\/p>': '$1<br>', // 一般规则
 * '(<br>)\s*[<br>]+': '$1',         // 去除多余的换行符
 * 'p': '$r<br>',                    // 将 p 标签替换成 br换行标签
 * 'br/': '$dn'                      // 去除换行符
 * 规则的原始字符串
 * @type {{String: String}}
 */
let rule = {
  'img': '$d', // 去除图片
  'div': '$r', // 去除 div 包裹
  'span': '$r', // 去除 span 包裹
  // p 标签添加段落缩进，添加 br 换行
  'p': '$r^&ensp;&ensp;&ensp;&ensp;,<br>$',
  'br/': '$dn', // 去除多余的 br 标签
  '<!--[^-]*-->': '' // 去除网页中的注释
}

/**
 * 包初始化入口
 */
function init () {
  for (let re in rule) {
    let r = rule[re]
    let matcher = flags.exec(r)
    if (matcher) {
      let mode = matcher[1]
      switch (mode) {
        case 'd':
          _rules.push(getRemoved(re, true, true, matcher[2]))
          break
        case 'r':
          _rules.push(getReplaced(re, matcher[2]))
          break
        default:
          break
      }
    } else {
      _rules.push([new RegExp(re, 'gi'), rule[re]])
    }
  }
}

/**
 * 计算内容总共行数、行高、一屏可显示行数
 * @param {HTMLElement} viewer
 * @param {HTMLElement} content
 * @returns {{lines: Number, lh: Number, slines: Number}}
 */
function screenLines (viewer, content) {
  let result = {lines: 0, lh: 0, slines: 0}
  let styles1 = window.getComputedStyle(viewer, null)
  let styles2 = window.getComputedStyle(content, null)
  let h1 = parseInt(styles1.height, 10)
  let h2 = parseInt(styles2.height, 10)
  let lh2 = parseInt(styles2.lineHeight, 10)
  result['slines'] = Math.floor(h1 / lh2)
  result['lh'] = lh2
  result['lines'] = Math.ceil(h2 / lh2)
  return result
}

class TxtReader extends BaseReader {
  constructor (props) {
    props = props || {}
    super(props)
    /**
     * 显示书籍内容的容器
     * @type {HTMLElement}
     */
    this._self = document.createElement('div')
    this._self.style.lineHeight = 1.5
    this._self.style.transition = 'margin-top .2s ease-in-out'
    this.container = {
      offset: 0, // marginTop偏移值
      slines: 0, // 当前屏幕行数(screen lines)
      lines: 0, // 总行数
      lh: 0, // 行高,
      sh: 0, // 屏幕显示的内容高度
      el: null
    }
    this.page = 1
    this.total = 0
  }
  open (content) {
    this.content = content
    this._self.innerHTML = processContent(this.content)
    this.resize()
    this.page = 1
    this.update()
  }
  /** @param {HTMLElement} el */
  render (el) {
    if (!this.container.el) {
      this.container.el = el
      this.container.el.appendChild(this._self)
    }
  }
  next (last) {
    if (last) {
      this.page = this.total
      this.update()
      return true
    }
    if (this.page < this.total) {
      this.page += 1
      this.update()
      return true
    }
    return false
  }
  prev (first) {
    if (first) {
      this.page = 1
      this.update()
      return true
    }
    if (this.page > 1) {
      this.page -= 1
      this.update()
      return true
    }
    return false
  }
  addBookMark (name, bookmark) {
  }
  getProcess () {
    return {
      page: this.page,
      total: this.total
    }
  }
  update () {
    this.container.offset = 0 - this.container.sh * (this.page - 1)
    // 根据页数计算偏移值
    this._self.style.marginTop = this.container.offset + 'px'
  }
  resize () {
    let {lines, lh, slines} = screenLines(this.container.el, this._self)
    this.container.offset = 0
    this.container.lines = lines
    this.container.lh = lh
    this.container.slines = slines
    this.container.sh = slines * lh
    // 计算窗口变更后的总页数
    this.total = Math.ceil(this.container.lines / this.container.slines)
  }
}

init()

export default TxtReader
