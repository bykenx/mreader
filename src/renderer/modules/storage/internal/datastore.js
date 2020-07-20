import { getPath } from './util'
import DataStore from 'nedb'

class DB {
  constructor () {
    this.db = null
    this.dbDir = getPath('db')
  }

  /**
   * @param {{[x: string]: string}} db
   */
  createOrReadDatabase (db) {
    db = db || {}
    var database = {}
    for (let idx in db) {
      if (!this.dbDir.exists(db[idx])) {
        this.dbDir.touch(db[idx])
      }
    }
    for (let idx in db) {
      database[idx] = new DataStore({
        filename: this.dbDir.join(db[idx]),
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
  bookmark: 'bookmark.db',
  book: 'book.db',
  booksource: 'booksource.db'
})
