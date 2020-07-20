import db from './datastore'

// findOne(query: any, projection: any, callback: (err: Error, document: any) => void): void
// find(query: any, projection: any, callback: (err: Error, documents: any[]) => void): void

function parse (obj) {
  let obj2 = {}
  for (let i in obj) {
    if (i && i.startsWith('__')) {
      // 私有属性
      continue
    }
    // null 或 undefined将会被 NeDB 忽略
    obj2[i] = String(obj[i]) || ''
  }
  return obj2
}

/**
 * 将回调过程转化为异步的 Promise
 * 仅在本包中使用！！！
 * @param {Object} caller
 * @param {Function} callable
 * @param {any} args
 */
function state (caller, callable, mycb, ...args) {
  let promise = new Promise((resolve, reject) => {
    // 回调函数转换为 Promise 的形式
    function cb (...results) {
      // 将第一位返回值的错误信息取出来
      let err = results.shift()
      if (err) {
        // 有错误直接返回错误
        reject(err)
      }
      if (mycb) {
        // 处理回调
        results = mycb(...results)
      }
      resolve(results)
    }
    // 调用方法，并通过 cb 处理回调结果
    callable.call(caller, ...args, cb)
  })
  return {
    then (onfilfilled) {
      return promise.then(onfilfilled)
    },
    catch (onrejected) {
      return promise.catch(onrejected)
    }
  }
}

/**
 * 数据的储存过程
 */
class StoreEnable {
  constructor () {
    /** @type {[string]} */
    let key = []
    let c = this.constructor
    if (c.hasOwnProperty('__KEY')) {
      let _key = c['__KEY']
      if (_key instanceof String) {
        key.push(_key)
      } else if (_key instanceof Array) {
        key.splice(key.length, 0, ..._key)
      } else {
        throw Error('__KEY must be string or Array.')
      }
    }
    if (!key.includes('_id')) {
      key.push('_id')
    }
    this.__key = key
  }

  static _getDb () {
    // 必须指明本地存储的数据库名称
    if (!this.hasOwnProperty('__DB_NAME')) {
      throw Error('Model must have s static porperty `__DB_NAME`')
    }
    return db[this.__DB_NAME]
  }

  /**
  * 获取所有源
  */
  static getAll () {
    let db = this._getDb()
    return state(
      db,
      db.find,
      results => results.map(value => new this(value)),
      // 搜索条件为空，则匹配所有内容
      {}
    )
  }

  /**
   * 通过 _id 获取数据条目
   * @param {String} id
   */
  static getById (id) {
    let db = this._getDb()
    return state(
      db,
      db.findOne,
      result => new this(result),
      {_id: id})
  }

  /**
   * 保存源配置信息
   * @param {Object} data
   */
  static save (data) {
    let db = this._getDb()
    // 存储的数据有 _id 并且不为空字符串则执行更新的过程
    if (data['_id'] && data['_id'] !== '') {
      return state(db,
        db.update,
        {_id: data['_id']},
        null,
        data
      )
    } else {
      // 否则新建条目
      delete data['_id']
      return state(db,
        db.insert,
        result => new this(result),
        data
      )
    }
  }

  /**
   * 移除指定 id 的数据
   * @param {Object} data
   */
  static remove (id) {
    let db = this._getDb()
    return state(db, db.remove, null, {'_id': id})
  }

  /**
   * 构造一个新的对象
   * @param {Object} obj
   */
  static build (obj) {
    return new this(obj)
  }

  /**
   * @param {Object} props
   */
  static get (props) {
    let db = this._getDb()
    return state(db, db.find, null, props)
  }

  // 对象方法
  /**
   * 保存当前数据
   */
  save () {
    let _save = this.constructor.save
    let obj = parse(this)
    return _save.call(this.constructor, obj)
  }

  /**
   * exists
   */
  exists () {
    let cond = {}
    let keys = this.__key
    for (let i in keys) {
      let v = this[keys[i]]
      if (v === null || v === undefined || v === '') {
        throw Error('the item exists in __KEY must be not null')
      }
      cond[keys[i]] = v
    }
    let c = this.constructor
    return new Promise((resolve, reject) => {
      c.get(cond)
        .then((err, data) => {
          if (err) {
            reject(err)
          } else if (!err && data.length !== 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
    })
  }
}

export default StoreEnable
