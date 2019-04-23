import { getPath } from './util'
import DataStore from 'nedb'

class DB {
  constructor () {
    this.db = null
    this.dbDir = getPath('db')
  }

  /**
     *
     * @param {{[x: string]: string}} db
     */
  createOrReadDatabase (db) {
    db = db || {}
    var existsAll = true
    var database = {}
    for (let part in db) {
      existsAll &= this.dbDir.exists(db[part])
    }
    if (!existsAll) {
      for (let part in db) {
        this.dbDir.touch(db[part])
      }
    }
    for (let part in db) {
      database[part] = new DataStore({
        filename: this.dbDir.join(db[part]),
        autoload: true
      })
    }
    return database
  }

  /**
     * @param {{[x: string]: string}} db
     * @returns {{[id: string]: DataStore}}
     */
  init (db) {
    if (this.db) {
      return this.db
    }

    this.db = this.createOrReadDatabase(db)
    return this.db
  }
}

const db = new DB()

export default db.init({
  chapter: 'chapter.db',
  book: 'book.db',
  booksource: 'booksource.db'
})
