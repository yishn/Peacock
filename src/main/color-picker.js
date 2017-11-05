const {BrowserWindow, ipcMain} = require('electron')
const querystring = require('querystring')
const setting = require('./setting')

let id = 0
let windows = {}

exports.show = function(color, callback = () => {}) {
    let currentId = id++
    let eventName = `color-picker-callback-${currentId}`

    let window = windows[currentId] = new BrowserWindow({
        width: setting.get('color_picker.width'),
        height: setting.get('color_picker.height'),
        useContentSize: true,
        center: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: 'Color Picker',
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
        delete windows[currentId]
        ipcMain.emit(eventName, {}, {color: null})
    })

    window.loadURL(`file://${__dirname}/../../index.html#${querystring.stringify({
        id: currentId,
        page: 'color-picker',
        color
    })}`)
}

exports.showEyedropper = function(callback = () => {}) {
    let currentId = id++
    let eventName = `eyedropper-callback-${currentId}`
    let parentWindow = BrowserWindow.getFocusedWindow()

    let window = windows[currentId] = new BrowserWindow({
        resizable: false,
        alwaysOnTop: true,
        fullscreen: true,
        skipTaskbar: true,
        title: 'Eyedropper',
        show: false,
        frame: false,
        parent: parentWindow,
        modal: true,
        webPreferences: {
            nodeIntegrationInWorker: true
        }
    })

    if (setting.get('debug.devtools')) {
        window.webContents.openDevTools()
    }

    ipcMain.once(eventName, (evt, arg) => callback(arg))

    window.once('closed', () => {
        delete windows[currentId]
        ipcMain.emit(eventName, {}, {color: null})
    })

    window.loadURL(`file://${__dirname}/../../index.html#${querystring.stringify({
        id: currentId,
        page: 'eyedropper'
    })}`)
}
