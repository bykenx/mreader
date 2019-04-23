import db from './datastore'
import { } from './util'

/**
 * 将同步的回调过程转化为异步的 Promise
 * 仅在本包中使用！！！
 * @param {Object} caller
 * @param {Function} callable
 * @param {any} args
 */
function state (caller, callable, ...args) {
  let promise = new Promise((resolve, reject) => {
    // 回调函数转换为 Promise 的形式
    function cb (...args2) {
      resolve(args2)
    }
    try {
      callable.call(caller, ...args, cb)
    } catch (e) {
      reject(e)
    }
  })
  return {
    then (onfilfilled) {
      return promise.then(data => {
        onfilfilled(...data)
      })
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
  static _getDb () {
    // 必须指明本地存储的数据库名称
    if (!this.hasOwnProperty('__db_name')) {
      throw Error('Model must have s static perperty `__db_name`')
    }
    return db[this.__db_name]
  }

  /**
   * 通过 _id 获取数据条目
   * @param {String} id
   */
  static getById (id) {
    let db = this._getDb()
    return state(db, db.find, {_id: id})
  }

  /**
   * 获取所有源
   */
  static getAll () {
    let db = this._getDb()
    return state(db, db.find, {})
  }

  /**
   * 保存源配置信息
   * @param {Base} data
   */
  static save (data) {
    let db = this._getDb()
    // 存储的数据有 _id 并且不为空字符串则执行更新的过程
    if (data['_id'] && data['_id'] !== '') {
      return state(db, db.update, {_id: data['_id']}, data)
    } else {
      // 否则新建条目
      return state(db, db.insert, data)
    }
  }

  /**
   * 移除源信息
   * @param {Base} data
   */
  static remove (id) {
    let db = this._getDb()
    return state(db, db.remove, {'_id': id})
  }
}

export default StoreEnable
