import store from './internal/localstorage'

const flag = '$mreader_history'
const stores = {}

function deleteDuplicate (data, keys) {
  for (let i = 0; i < data.length; i++) {
    for (let j = i; j < data.length; j++) {
      if (data[j]['$$delete'] && data['$$delete'] === true) {
        continue
      }
      let flag = true
      for (let k in keys) {
        console.log(data.length)
        if (data[i][keys[k]] !== data[j][keys[k]]) {
          flag = false
          continue
        }
      }
      if (flag) {
        if (data[j]['$ts'] > data[i]['$ts']) {
          data[i]['$$delete'] = true
        } else {
          data[j]['$$delete'] = true
        }
      }
    }
  }
  for (let i in data) {
    if (data[i]['$$delete']) {
      data = data.splice(i, 1)
    }
  }
  return data
}

class History {
  constructor (name, keys) {
    this.flag = flag + '_' + name
    this.newKey = false
    let identify = false
    if (keys) {
      if (keys instanceof Array) {
        identify = true
      } else if (keys instanceof String) {
        keys = [keys]
        identify = true
      } else {
        throw Error('keys must be Array or String')
      }
    } else {
      identify = false
    }
    let data = store.get(this.flag, {keys: keys, data: []})
    if (identify) {
      if (data['keys'].length !== keys.length) {
        throw Error(`require ${data.keys.length}keys`)
      }
      for (let i in keys) {
        if (data['keys'][i] !== keys[i]) {
          throw Error('key not matched!')
        }
      }
      data.data = deleteDuplicate(data.data, keys)
    }
    this.keys = keys
    this.identify = identify
    stores[this.flag] = data.data
    store.set(this.flag, {keys: keys, data: data.data})
  }
  save (item) {
    this.newKey = true
    item['$ts'] = (new Date()).getTime()
    let history = stores[this.flag]
    history.push(item)
    store.set(this.flag, {keys: this.keys, data: history})
    return item
  }
  all () {
    let data = stores[this.flag]
    return this.newKey && this.identify ? deleteDuplicate(data, this.keys) : data
  }
  clear () {
    return (delete stores[this.all.flag]) || store.set(this.flag, [])
  }
}

export default History
