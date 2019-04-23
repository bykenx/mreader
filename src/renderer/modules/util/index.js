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
 * @param {string} str
 * @param {string} encoding
 * @returns {Buffer}
 */
function encode (str, encoding) {
  encoding = encoding || 'utf-8'
  return iconv.encode(str, encoding)
}

/**
 * 将 n 个长度为 m 的数组转化为 m 个 长度为 n 的数组
 * @param {Array<Array>} obj
 * @returns {Array<any>}
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
 * 打印错误信息
 * @param {Error} err
 */
function trace (err) {
  if (err && console && console.error) {
    console.error(err)
  }
}

export {
  toArrayBuffer,
  decode,
  encode,
  zip,
  trace
}
