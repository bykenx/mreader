import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

const homeDir = remote.app.getPath('home')
const dirName = process.env.NODE_ENV === 'development' ? '.mreader-dev' : '.mreader'
const userDataDir = path.join(homeDir, dirName)
if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir)
}

/**
 * @param {string} currentPath
 * @param {string} dir
 * @returns {string}
 */
function mkdir (currentPath, dir) {
  var p = path.join(currentPath, dir)
  fs.mkdirSync(p)
  return p
}

/**
 * @param {string} currentPath
 * @param {string} filename
 * @returns {string}
 */
function touch (currentPath, filename) {
  var p = path.join(currentPath, filename)
  let fn = fs.openSync(p, 'w')
  fs.closeSync(fn)
  return p
}

/**
 * @param {string} currentPath
 * @returns {{[name: string]: string}}
 */
function ls (currentPath) {
  var items = fs.readdirSync(currentPath)
  var results = []
  for (let item of items) {
    let fullpath = path.join(currentPath, item)
    let stat = fs.statSync(fullpath)
    if (stat.isFile()) {
      results[item] = 'file'
    } else if (stat.isDirectory()) {
      results['item'] = 'dir'
    }
  }
  return results
}

/**
 * @param {string} fullpath
 */
function readFile (fullpath) {
  return new Promise((resolve, reject) => {
    let content = null
    try {
      content = fs.readFileSync(fullpath)
    } catch (e) {
      reject(e)
    }
    resolve(content)
  })
}

/**
 * @param {string} fullpath
 * @param {any} data
 */
function saveFile (fullpath, data) {
  return new Promise((resolve, reject) => {
    fs.open(fullpath, 'w', (err, fd) => {
      if (err) {
        reject(err)
      }
      fs.write(
        fd,
        data,
        (err, written, buffer) => {
          if (err) {
            reject(err)
          }
          resolve(written)
        }
      )
    })
  })
}

class ContextPath {
  constructor (currentPath) {
    this.currentPath = currentPath
  }
  pwd () {
    return this.currentPath
  }
  touch (filename) {
    return touch(this.currentPath, filename)
  }
  ls () {
    return ls(this.currentPath)
  }
  join (p) {
    return path.join(this.currentPath, p)
  }
  exists (pathname) {
    var p = path.join(this.currentPath, pathname)
    return fs.existsSync(p)
  }
  /**
   * @param {string} filename
   * @returns {Buffer}
   */
  readFileSync (filename) {
    let p = path.join(this.currentPath, filename)
    try {
      return fs.readFileSync(p)
    } catch (e) {
      return null
    }
  }
  readFile (fullpath) {
    return readFile(fullpath)
  }
  /**
   * @param {string} path
   * @returns {ContextPath}
   */
  getPath (path) {
    if (!this.exists(path)) {
      path = mkdir(this.currentPath, path)
    } else {
      path = this.join(path)
    }
    return new ContextPath(path)
  }
}

/**
 * @param {string} pathname
 * @returns {ContextPath}
 */
function getPath (pathname) {
  if (pathname.startsWith('/') || pathname.startsWith('~')) {
    throw Error('the pathname is invalid.')
  }
  var p = path.join(userDataDir, pathname)
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p)
  }
  return new ContextPath(p)
}

function type2 (obj) {
  let _type = Object.prototype.toString.call(obj)
  return _type.slice(8, _type.length - 1).toLowerCase()
}

function stringify (data) {
  let _type = type2(data)
  let raw = null
  switch (_type) {
    case 'object':
      raw = {}
      for (let i in data) {
        if (data.hasOwnProperty(i)) {
          raw[i] = stringify(data[i])
        }
      }
      break
    case 'array':
      return data
    case 'string':
      return data
    default:
      raw = data
  }
  return JSON.stringify(raw)
}

function parse (data) {
  return JSON.parse(data)
}

export {
  getPath,
  readFile,
  saveFile,
  mkdir,
  touch,
  parse,
  stringify,
  type2
}
