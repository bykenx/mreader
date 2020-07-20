import iconv from 'iconv-lite'

/**
 * 将 Buffer 转化为 ArrayBuffer 的工具函数
 * @param {Buffer} buf
 * @returns {ArrayBuffer}
 */
function toArrayBuffer (buf) {
  var ab = new ArrayBuffer(buf.length)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

/**
 * 将 bytes 解码为字符串的工具函数
 * @param {Buffer} bytes
 * @param {string} encoding
 * @returns {string}
 */
function decode (bytes, encoding) {
  encoding = encoding || 'utf-8'
  return iconv.decode(bytes, encoding)
}

/**
 * 将字符串编码为 bytes 的工具函数
 * @param {string} str 原始字符串
 * @param {string} encoding 编码方式
 * @returns {Buffer}
 */
function encode (str, encoding) {
  encoding = encoding || 'utf-8'
  return iconv.encode(str, encoding)
}

/**
 * 将 n 个长度为 m 的数组转化为 m 个 长度为 n 的数组
 * @param {Array<Array>} obj
 * @returns {Array<Array>}
 */
function zip (obj) {
  let res = []
  for (let i in obj) {
    let tmp = obj[i]
    for (let j in tmp) {
      if (!res[j]) {
        res[j] = []
      }
      res[j].push(obj[i][j])
    }
  }
  return res
}

/**
 * 简单的 Json 文件格式化工具函数
 * @param {String} source 原始文本
 * @param {Boolean} transtab2space 是否以两个空格替换 Tab 键
 */
function simpleJsonFormat (source, transtab2space) {
  let tab = transtab2space ? '  ' : '\t'
  let depthCount = 0
  let result = ''
  let keys = source.split('')
  function appendTab () {
    depthCount += 1
    return normalTab()
  }
  function popTab () {
    depthCount -= 1
    return normalTab()
  }
  function normalTab () {
    let res = ''
    for (let i = 0; i < depthCount; i++) {
      res += tab
    }
    // console.log("\"", res, "\"")
    return res
  }
  while (true) {
    let key = keys.shift()
    switch (key) {
      case '[':
        result += '\n'
        result += appendTab()
        result += key
        break
      case '{':
        result += key + '\n'
        result += appendTab()
        break
      case ',':
        result += key + '\n'
        result += normalTab()
        break
      case '}':
        result += '\n'
        result += popTab()
        result += key
        break
      case ']':
        result += key
        break
      case undefined:
        break
      default:
        result += key
    }
    if (key === undefined) {
      break
    }
  }
  return result
}

/**
 * 打印错误信息
 * @param {Error} err
 */
function trace (err) {
  if (err && console && console.error) {
    console.error(err)
  }
}

function urlFormat (protocol, url) {
  if (url.startsWith('//')) {
    url = [protocol, url].join('')
  }
  return url
}

export {
  toArrayBuffer,
  simpleJsonFormat,
  decode,
  encode,
  zip,
  trace,
  urlFormat
}
