import { stringify, parse, type2 } from './util'

let store = localStorage

function set (key, value, customStringify) {
  let stringifyFunc = customStringify || stringify
  value = stringifyFunc(value)
  if (type2(value) !== 'string') {
    throw Error('parse function must return a string value.')
  }
  return store.setItem(key, value)
}

function get (key, defaultKey) {
  let value = store.getItem(key)
  return parse(value) || defaultKey
}

function del (key) {
  store.removeItem(key)
}

export default {
  get,
  set,
  del
}
