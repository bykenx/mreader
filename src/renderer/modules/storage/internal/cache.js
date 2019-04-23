import { getPath } from './util'
import fs from 'fs'

const cacheDir = getPath('cache')

/**
 * @param {string} prefix
 */
cacheDir.clear = function (prefix) {
  let pathAndType = this.ls()
  for (let path in pathAndType) {
    if (pathAndType[path] === 'file') {
      if (path.startsWith(prefix)) {
        path = this.join(path)
        fs.unlinkSync(path)
      }
    }
  }
}

cacheDir.clearAll = function () {
  let pathAndType = this.ls()
  for (let path in pathAndType) {
    if (pathAndType[path] === 'file') {
      path = this.join(path)
      fs.unlinkSync(path)
    }
  }
}

/**
 * @param {string} name
 * @param {string} content
 * @param {string} encoding
 */
cacheDir.save = function (name, content, encoding) {
  encoding = encoding || 'utf-8'
  fs.writeFileSync(this.join(name), content, 'utf-8')
}

cacheDir.dir = function (dir) {
  let obj = this.getPath(dir)
  obj.clear = this.clear
  obj.clearAll = this.clearAll
  obj.save = this.save
  obj.dir = this.dir
  return obj
}

export default cacheDir
