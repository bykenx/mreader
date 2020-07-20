import store from './internal/localstorage'
import { readFile, saveFile } from './internal/util'
import { simpleJsonFormat } from '../util'
import Book from './Book'
import BookSource from './BookSource'
import BookCache from './BookCache'

/**
 * 从JSON文件读取源信息的工具函数
 * @param {String} filename
 */
function readBookSourceFromJsonFile (filename) {
  return new Promise((resolve, reject) => {
    readFile(filename).then(data => {
      let configs = JSON.parse(data)
      for (let i in configs) {
        let source = BookSource.build(configs[i])
        source.save()
      }
      resolve(filename)
    }).catch(reject)
  })
}

/**
 * 保存书源模板至本地
 */
function saveBookSourceTemplate (filename) {
  return new Promise((resolve, reject) => {
    let source = BookSource.build({})
    let t = {}
    for (let prop in source) {
      switch (prop) {
        case '_id':
        case '_type':
        case '__key':
        case 'enabled':
          break
        default:
          t[prop] = source[prop] || ''
          break
      }
    }
    t = JSON.stringify([t])
    t = simpleJsonFormat(t)
    saveFile(filename, t)
      .then(_ => {
        resolve(filename)
      })
      .catch(reject)
  })
}

export {
  store,
  Book,
  BookSource,
  BookCache,
  readFile,
  readBookSourceFromJsonFile,
  saveBookSourceTemplate
}
