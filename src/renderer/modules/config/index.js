const fs = require('fs')

/**
 * @param {object} opts 
 * @param {string} fileobj
 */
var Config = function Config (opts, fileobj) {
    this._opts = opts
    this._fileobj = fileobj || null
    this._changed = false
    this._corntab_exec_time = 2000
    this._init()
}

/**
 * @param {string} filepath 
 */
Config.load = function (filepath) {
    var data = fs.readFileSync(filepath, 'utf-8')
    data = JSON.parse(data)
    return new Config(data, filepath)
}

Config.prototype._init = function () {
    if (this._fileobj) {
        setInterval(this._corntab(), 
            this._corntab_exec_time)
    }
    var that = this 
    this._save = (function () {
        return function () {
            that._changed = false
        }
    })()
    this._change = (function () {
        return function () {
            that._changed = true
        }
    })()
}

/**
 * @returns {boolean}
 * @returns {Function}
 */
Config.prototype._corntab = function () {
    var that = this
    return function () {
        if (!that._changed) {
            return false
        }
        var data = JSON.stringify(that._opts)
        var fd = fs.openSync(that._fileobj, 'w')
        fs.writeSync(fd, data)
        that._save()
        return true
    }
}

/**
 * @param {string} opt 
 * @param {string} val
 * @param {string} val
 */
Config.prototype.set = function (opt, val) {
    if (!Boolean(opt))
        throw Error('invalid option.')
    var opts = opt.split('.'),
        cur = this._opts,
        lens = opts.length,
        i = 0
    for (; i < lens-1; i++) {
        cur = cur[opts[i]]
        if (!Boolean(cur))
            throw Error('not existed option.')
    }
    cur[opts[i]] = val
    this._change()
    return val
}

/**
 * @param {string} opt 
 * @returns {string}
 */
Config.prototype.get = function (opt) {
    if (!Boolean(opt))
        throw Error('invalid option.')
    var opts = opt.split('.'),
        cur = this._opts,
        lens = opts.length,
        i = 0
    for (; i < lens; i++) {
        if (!Boolean(cur))
            throw Error('not existed option.')
        cur = cur[opts[i]]
    }
    return cur
}

/**
 * @param {string} name
 * @returns {Config}
 */
Config.prototype.part = function (name) {
    var part = this._opts[name]
    var new_chap = new Config(part)
    new_chap._change = this._change
    new_chap._save = this._save
    return new_chap
}

module.exports = Config