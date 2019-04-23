const files = require.context('./types', false, /\.js$/)
const types = {}

const TxtReader = require('./types/TxtReader').default.cl

files.keys().forEach(key => {
  let m = files(key).default
  types[m.mt] = m.cl
})

class Reader {
  constructor (source) {
    this.innerReader = source.builder(source.content)
  }
  static support (_type) {
    return types.hasOwnProperty(_type)
  }
  static newSource (obj, _type) {
    let builder = types[_type] || TxtReader
    return {builder: builder, content: obj}
  }
}

export default Reader

export { TxtReader }
