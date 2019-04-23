import BaseReader from '../internal/BaseReader'

/** 编译之后的规则
 * @type {{String: String}}
 */
let _rules = []

/**
 * @type {RegExp}
 */
let flags = /^\$([A-Za-z])(.+)/

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
    tagname = tagname.replace('/', '')
  }
  pattern += `(<${tagname}[^>]*>)`
  if (n && n !== '') {
    if (n === 'n') {
      pattern += `(?:(<${tagname}[^>]*>)+)`
    } else if (n instanceof Number) {
      pattern += `(?:(<${tagname}[^>]*>){${n - 1}})`
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
function getReplaced (tagname, repalced, global, ignored) {
  let flags = ''
  global = global || true
  ignored = ignored || true
  // 替换成匹配的内容加自定义内容
  repalced = '$1' + repalced
  flags += global ? 'g' : ''
  flags += ignored ? 'i' : ''
  let pattern = `<${tagname}[^>]*>((?:[^<]*))<\\/${tagname}>`
  return [new RegExp(pattern, flags), repalced]
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
  'p': '$r<br>',
  'br/': '$dn',
  '<!--[^-]*-->': ''
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
    this.reader = document.createElement('div')
    this.offset = 0
    this.lines = 0
    this.lh = 0
    this.slines = 0
  }
  open (content) {
    this.content = content
    this.reader.innerHTML = processContent(this.content)
    this.reader.style.lineHeight = 1.5
    this.reader.style.fontSize = '18px'
    let {lines, lh, slines} = screenLines(this.container, this.reader)
    this.offset = 0
    this.lines = lines
    this.lh = lh
    this.slines = slines
    this.update()
  }
  render (el) {
    el.appendChild(this.reader)
    this.container = el
  }
  next () {
    if (this.offset - this.lh * this.slines > 0 - this.lines * this.lh) {
      this.offset -= this.lh * this.slines
      this.update()
      return true
    }
    return false
  }
  prev () {
    if (this.offset + this.lh * this.slines <= 0) {
      this.offset += this.lh * this.slines
      this.update()
      return true
    }
    return false
  }
  update () {
    this.reader.style.marginTop = this.offset + 'px'
  }
}

init()

export default {
  mt: 'txt',
  cl: TxtReader
}
