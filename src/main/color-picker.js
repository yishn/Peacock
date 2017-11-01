const {BrowserWindow, ipcMain} = require('electron')
const querystring = require('querystring')
const setting = require('./setting')

let id = 0
let window = null

exports.show = function(color, callback = () => {}) {
    let currentId = id++
    let eventName = `color-picker-callback-${currentId}`

    window = new BrowserWindow({
        width: setting.get('color_picker.width'),
        height: setting.get('color_picker.height'),
        useContentSize: true,
        center: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        show: false,
        parent: BrowserWindow.getFocusedWindow(),
        modal: true,
        backgroundColor: '#fafafa',
        webPreferences: {
            nodeIntegrationInWorker: true
        }
    })

    if (setting.get('debug.devtools')) {
        window.webContents.openDevTools()
    }

    ipcMain.once(eventName, (evt, arg) => callback(arg))

    window.once('ready-to-show', () => window.show())

    window.once('closed', () => {
        window = null
        ipcMain.emit(eventName, {}, {color: null})
    })

    window.loadURL(`file://${__dirname}/../../index.html#${querystring.stringify({
        id: currentId,
        page: 'color-picker',
        color
    })}`)
}
