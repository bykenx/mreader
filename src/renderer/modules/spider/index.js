import urllib from './internal/urllib'
import { decode } from 'modules/util'
import Soup from './internal/soup'

/**
 * 爬虫框架的总入口
 * 参数 url 为请求的地址
 * @param {string} url
 * @returns {Promise<Soup>}
 */
function begin (url) {
  return new Promise((resolve, reject) => {
    urllib.get(url, (err, response, body) => {
      if (err) {
        reject(err)
      }
      let encoding = urllib.decoder.guessEncoding(response.headers)
      resolve(new Soup(decode(body, encoding)))
    })
  })
}

export default begin
