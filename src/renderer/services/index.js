import { remote } from 'electron'

import Book from '../modules/storage/Book'
import BookSource from '../modules/storage/BookSource'

// 全局变量
const home = remote.app.getPath('home')

// 全局 ipc 调用
const dialog = remote.dialog

const BookService = {
  /**
   * @param {{name: string, src: string}} book
   */
  save (book) {
    book = Book.build(book)
    console.log(book)
    // 先判断是否为本地图书
    if (book.isLocal()) {
    } else {
      // 检查书源是否存在
      BookSource.getById(book.source)
        .then(d => {
          console.log(d, book)
          if (d) {
            book.save()
          }
        })
    }
  }
}

const FileDialogService = {
  showOpenDialog (title, path, filters) {
    title = title || '选择你的文件'
    path = path || home
    filters = filters || [
      {'name': 'All Files', extensions: ['*']}
    ]
    return dialog.showOpenDialog(null, {
      title: title,
      defaultPath: path,
      properties: ['openFile'],
      filters: filters
    })
  },
  showSaveDialog (title, path, filters) {
    title = title || '选择你要保存的路径'
    path = path || home
    filters = filters || [
      {'name': 'All Files', extensions: ['*']}
    ]
    return dialog.showSaveDialog(null, {
      title: title,
      defaultPath: path,
      filters: filters
    })
  }
}

export {
  BookService,
  FileDialogService
}
