const request = require('request')

var headers = {
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,cy;q=0.7',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
}

function getHeaders () {
  return headers
}

var urllib = {
  headers: getHeaders()
}

var typeValider = {
  'support': [
    'json',
    'html',
    'xml'
  ]
}

typeValider.is = function (data, _type) {
  return true
}

/**
 * @returns {{headers: string, form: Array, data: object, accept: string}}
 */
urllib.env = (function () {
  return function () {
    var env = {
      headers: this.headers,
      query: [],
      form: null,
      data: null,
      formdata: '',
      accept: null
    }
    for (var i in urllib) {
      if (!urllib.hasOwnProperty(i)) {
        continue
      }
      if (i === 'env') {
        continue
      }
      env[i] = urllib[i]
    }
    return env
  }
})()

urllib.get = function (url, callback) {
  var options = {
    headers: this.headers,
    method: 'GET',
    encoding: null
  }
  var query = this.query || []
  var _query = []
  var querystring = null
  for (var key in query) {
    _query.push(key + '=' + query[key])
  }
  querystring = _query.join('&')
  if (querystring) {
    url = url + '?' + querystring
  }
  return request(url, options, callback)
}

urllib.postForm = function (url, form, callback) {
  var options = {
    headers: this.headers,
    method: 'POST'
  }
  options['form'] = form || this.form || {}
  return request(url, options, callback)
}

urllib.postJson = function (url, data, callback) {
  var options = {
    headers: this.headers,
    json: true,
    method: 'POST'
  }
  options.headers['Content-Type'] = 'application/json'
  options['body'] = JSON.stringify(data || this.data || {})
  return request(url, options, callback)
}

urllib.postFormData = function (url, formdata, callback) {
  var options = {
    headers: this.headers,
    method: 'POST',
    formData: formdata || this.formdata || {}
  }
  return request(url, options, callback)
}

urllib.post = urllib.postForm

urllib.decoder = {}

urllib.decoder.guessEncoding = function guessEncoding (headers) {
  var r = headers['content-type'].match(/charset=(.+)/)
  // 修复某些以 gbk 编码的网站的访问问题
  if (r) {
    r = r[1]
  } else {
    r = 'utf-8'
  }
  return r
}

export default urllib
