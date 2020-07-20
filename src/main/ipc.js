import { ipcMain, dialog, app } from 'electron'

// const
const home = app.getPath('home')

const IPC = {
  support () {
    // =============================
    // Dialog
    // =============================
    // open file dialog, r remains `reply'
    ipcMain.on('open-file-dialog', (ev, title, path, filters) => {
      title = title || '选择你的文件'
      path = path || home
      filters = filters || [
        {'name': 'All Files', extensions: ['*']}
      ]
      dialog.showOpenDialog(
        ev.sender,
        {
          title: title,
          defaultPath: path,
          properties: ['openFile', 'openDirectory'],
          filters: filters
        },
        files => {
          if (files) {
            ev.sender.send('open-file-dialog-r', files)
          }
        }
      )
    })

    // save file dialog
    ipcMain.on('save-file-dialog', (ev, title, path, filters) => {
      title = title || '选择你要保存的路径'
      path = path || home
      filters = filters || [
        {'name': 'All Files', extensions: ['*']}
      ]
      dialog.showSaveDialog(
        null,
        {
          title: title,
          defaultPath: path,
          filters: filters
        },
        file => {
          ev.sender.send('save-file-dailog-r', file)
        }
      )
    })

    // error
    ipcMain.on('open-error-dialog', (ev, title, message) => {
      dialog.showErrorBox(title, message)
      ev.sender.send('open-error-dialog-r')
    })

    // information
    ipcMain.on('open-information-dialog', (ev, title, message, choices) => {
      choices = choices || ['Yes', 'No']
      dialog.showMessageBox(
        ev.sender,
        {
          type: 'info',
          title: title,
          message: message,
          buttons: choices
        },
        index => {
          ev.sender.send('open-information-dialog-r', index)
        }
      )
    })
  }
}

export default IPC
