import cacheDir from './internal/cache'

class BookCache {
  constructor () {
    throw Error('BookCache can not be initialization.')
  }
  static getAll () {
    return []
  }
  static save (name, _id, chapter, content) {
    let dir = name + '_' + _id
    let curDir = cacheDir.dir(dir)
    curDir.save(chapter, content)
  }
  static get (name, _id, chapter) {
    let dir = name + '_' + _id
    let curDir = cacheDir.dir(dir)
    return curDir.readFileSync(chapter)
  }
  static clear (name, _id) {
    let dir = name + _id
    let curDir = cacheDir.dir(dir)
    curDir.clearAll()
  }
}

export default BookCache
