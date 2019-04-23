import begin from '.'
import { zip } from '../util'
import { autogenerate } from './internal/auto'

class BookSource {
  constructor (bookSource) {
    autogenerate(this, bookSource)
  }
  searchBook (name, no) {
    no = no || 1
    let url = this.searchUrl
    url = url.replace('searchKey', encodeURIComponent(name))
    url = url.replace('searchPage', no)
    return new Promise((resolve, reject) => {
      begin(url)
        .then(soup => {
          // 请求结束后的动作
          let searchListResult = soup.startAt(this.searchListRule)
          let name = searchListResult.find(this.searchNameRule)
          let author = searchListResult.find(this.searchAuthorRule)
          let kind = searchListResult.find(this.searchKindRule)
          let lastChapter = searchListResult.find(this.searchLastChapterRule)
          let url = searchListResult.find(this.searchUrlRule)
          let cover = searchListResult.find(this.searchCoverRule)
          Promise.all([name, author, kind, lastChapter, cover, url])
            .then(info => {
              info = zip(info)
              let result = []
              for (let i = 0; i < info.length; i++) {
                let book = {}
                book['name'] = info[i][0].trim()
                book['author'] = info[i][1].trim()
                book['kind'] = info[i][2].trim()
                book['lastChapter'] = info[i][3].trim()
                book['cover'] = info[i][4].trim()
                book['link'] = info[i][5].trim()
                book['source'] = this._id
                result.push(book)
              }
              resolve(result)
            })
        }).catch(reject)
    })
  }
  getChapterList (book) {
    return new Promise((resolve, reject) => {
      let url = book['link']
      begin(url)
        .then(async soup => {
          // 有单独存放章节列表的页面
          if (this.chapterUrlRule) {
            let url = await soup.find(this.chapterUrlRule)
            begin(url)
              .then(soup => {
                let list = soup.startAt(this.chapterListRule)
                let name = list.find(this.chapterNameRule)
                let url = list.find(this.contentUrlRule)
                Promise.all([name, url])
                  .then(info => {
                    info = zip(info)
                    let result = []
                    for (let i = 0; i < info.length; i++) {
                      let chapter = {}
                      chapter['name'] = info[i][0].trim()
                      chapter['link'] = info[i][1].trim()
                      result.push(chapter)
                    }
                    resolve(result)
                  }).catch(reject)
              })
          } else {
            let list = soup.startAt(this.chapterListRule)
            let name = list.find(this.chapterNameRule)
            let url = list.find(this.contentUrlRule)
            Promise.all([name, url])
              .then(info => {
                info = zip(info)
                let result = []
                for (let i = 0; i < info.length; i++) {
                  let chapter = {}
                  chapter['name'] = info[i][0].trim()
                  chapter['link'] = info[i][1].trim()
                  result.push(chapter)
                }
                resolve(result)
              }).catch(reject)
          }
        }).catch(reject)
    })
  }
  getContent (chapter) {
    let url = chapter['link']
    if (url.startsWith('/')) {
      url = this.url + url
    }
    return new Promise((resolve, reject) => {
      begin(url)
        .then(soup => {
          soup.find(this.contentRule)
            .then(resolve)
        }).catch(reject)
    })
  }
}

export default BookSource
