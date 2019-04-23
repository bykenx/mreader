import store from './internal/localstorage'
import { readFile } from './internal/util'
import Book from './Book'
import BookSource from './BookSource'
import BookCache from './BookCache'

/**
 * 从JSON文件读取源信息的工具函数
 * @param {String} filename
 */
function readBookSourceFromJsonFile (filename) {
  readFile(filename).then(data => {
    let configs = JSON.parse(data)
    for (let i in configs) {
      let source = new BookSource(configs[i])
      BookSource.save(source)
    }
  })
}

export {
  store,
  Book,
  BookSource,
  BookCache,
  readFile,
  readBookSourceFromJsonFile
}
