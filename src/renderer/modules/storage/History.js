import store from './internal/localstorage'

const flag = '$mreader_history'

class History {
  constructor (name) {
    this.flag = flag + '_' + name
  }
  save (item) {
    item['$id'] = (new Date()).getTime()
    let history = store.get(this.flag, [])
    history.push(item)
    store.set(this.flag, history)
    return item
  }
  all () {
    return store.get(this.flag) || []
  }
  /**
   * @param {{timestamp: Number}} item
   */
  delete (item) {
    let id = item['$id']
    let history = store.get(this.flag, [])
    for (let i in history) {
      if (item['name'] === history[i]['name'] &&
      id === history[i]['$id']) {
        history.splice(i, 1)
        break
      }
    }
    store.set(this.flag, history)
  }
  clear () {
    return store.set(this.flag, [])
  }
  get (id) {
    let history = store.get(this.flag, [])
    for (let i in history) {
      if (id === history[i]['$id']) {
        return history[i]
      }
    }
    return null
  }
}

export default History
